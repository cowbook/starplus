const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const { promisify } = require('util');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const XLSX = require('xlsx');

const app = express();
const apiRouter = express.Router();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'starplus';
const COLLECTION_NAME = 'submissions';
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-admin-key';
const execAsync = promisify(exec);

let submissionsCollection;

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

function normalizeSubmission(submission) {
  return Object.fromEntries(
    Object.entries(submission).map(([key, value]) => {
      if (Array.isArray(value)) {
        return [key, value];
      }

      if (value && typeof value === 'object') {
        return [key, JSON.stringify(value)];
      }

      return [key, value ?? ''];
    })
  );
}

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return req.ip || req.socket?.remoteAddress || '';
}

function requireAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'];

  if (!adminKey || adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

function normalizeExportValue(value) {
  if (Array.isArray(value)) {
    return value.join('，');
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  if (value == null) {
    return '';
  }

  return String(value);
}

apiRouter.post('/submit', async (req, res) => {
  const submission = req.body;

  if (!submission || typeof submission !== 'object' || Object.keys(submission).length === 0) {
    return res.status(400).json({ error: 'Empty submission data' });
  }

  try {
    const document = {
      ...normalizeSubmission(submission),
      createdAt: new Date().toISOString(),
      ip: getClientIp(req)
    };

    const result = await submissionsCollection.insertOne({
      ...document
    });

    return res.json({ message: 'Submission saved', id: result.insertedId });
  } catch (err) {
    console.error('Error writing to database:', err);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
});

apiRouter.get('/submissions', requireAdmin, async (req, res) => {
  try {
    const rows = await submissionsCollection
      .find({})
      .sort({ _id: -1 })
      .toArray();

    const submissions = rows.map((row) => ({
      ...row,
      id: row._id.toString()
    }));

    return res.json(submissions);
  } catch (err) {
    console.error('Error reading from database:', err);
    return res.status(500).json({ error: 'Failed to read submissions' });
  }
});

apiRouter.post('/webhook', (req, res) => {
  const repoRoot = path.join(__dirname, '..');

  const clipLog = (value = '') => {
    const text = String(value || '').trim();
    if (!text) {
      return '';
    }
    const maxLen = 4000;
    return text.length > maxLen ? `${text.slice(0, maxLen)}\n...<truncated>` : text;
  };

  const runWebhookPipeline = async () => {
    const steps = [
      { name: 'git pull', command: 'git pull --ff-only origin main' },
      { name: 'client install', command: 'npm --prefix client install' },
      { name: 'client build', command: 'npm --prefix client run build' }
    ];

    const result = [];

    for (const step of steps) {
      const startedAt = Date.now();

      try {
        const { stdout, stderr } = await execAsync(step.command, {
          cwd: repoRoot,
          timeout: 10 * 60 * 1000,
          maxBuffer: 10 * 1024 * 1024
        });

        result.push({
          step: step.name,
          ok: true,
          durationMs: Date.now() - startedAt,
          stdout: clipLog(stdout),
          stderr: clipLog(stderr)
        });
      } catch (error) {
        const failure = {
          step: step.name,
          ok: false,
          durationMs: Date.now() - startedAt,
          stdout: clipLog(error.stdout),
          stderr: clipLog(error.stderr),
          message: error.message
        };

        result.push(failure);
        throw { failure, result };
      }
    }

    return result;
  };

  runWebhookPipeline()
    .then((steps) => {
      console.log('[webhook] pull/install/build completed');
      return res.json({
        message: 'Webhook succeeded: code pulled and client built',
        steps
      });
    })
    .catch((error) => {
      const failure = error.failure || { step: 'unknown', message: 'Unknown webhook error' };
      console.error('[webhook] pipeline failed:', failure);
      return res.status(500).json({
        error: 'Webhook pipeline failed',
        failedStep: failure.step,
        message: failure.message,
        steps: error.result || []
      });
    });
});


apiRouter.get('/download', async (req, res) => {
  try {
    const rows = await submissionsCollection
      .find({})
      .sort({ _id: -1 })
      .toArray();

    if (rows.length === 0) {
      return res.status(404).json({
        error: 'No submissions',
        message: 'No submission records found in MongoDB'
      });
    }

    // Keep stable column order: id, createdAt, ip first, then other keys by first appearance.
    const orderedHeaders = ['id', 'createdAt', 'ip'];
    const headerSet = new Set(orderedHeaders);

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (key === '_id') {
          continue;
        }
        if (!headerSet.has(key)) {
          orderedHeaders.push(key);
          headerSet.add(key);
        }
      }
    }

    const exportRows = rows.map((row) => {
      const result = {
        id: String(row._id),
        createdAt: row.createdAt || '',
        ip: row.ip || ''
      };

      for (const key of orderedHeaders) {
        if (key === 'id' || key === 'createdAt' || key === 'ip') {
          continue;
        }
        result[key] = normalizeExportValue(row[key]);
      }

      return result;
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportRows, { header: orderedHeaders });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

    const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15);
    const filename = `submissions_${timestamp}.xlsx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(fileBuffer);
  } catch (err) {
    console.error('Error generating xlsx export:', err);
    return res.status(500).json({ error: 'Failed to generate xlsx export' });
  }
});

app.use('/api', apiRouter);

async function startServer() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    submissionsCollection = db.collection(COLLECTION_NAME);

    await submissionsCollection.createIndex({ createdAt: -1 });

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
      console.log(`MongoDB connected: ${MONGODB_URI}/${DB_NAME}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startServer();