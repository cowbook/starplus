const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
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
const ADMIN_COLLECTION_NAME = 'admin_config';
const ADMIN_DOC_ID = 'admin_credentials';
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-admin-key';
const SUPERADMIN_BACKDOOR = typeof process.env.superadmin === 'string' ? process.env.superadmin.trim() : '';
const execAsync = promisify(exec);
const ANSWER_OPTIONS = ['非常不满意', '不满意', '一般', '满意', '非常满意'];
let webhookBuildRunning = false;

let submissionsCollection;
let adminCollection;

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

function formatShanghaiDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);

  const pick = (type) => parts.find((part) => part.type === type)?.value || '00';
  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}:${pick('second')}`;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string' || !storedHash.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(':');
  const candidate = crypto.scryptSync(password, salt, 64).toString('hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');
  const candidateBuffer = Buffer.from(candidate, 'hex');

  if (originalBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, candidateBuffer);
}

function verifyBackdoorPassword(password) {
  if (!SUPERADMIN_BACKDOOR || typeof password !== 'string') {
    return false;
  }

  const backdoorBuffer = Buffer.from(SUPERADMIN_BACKDOOR);
  const candidateBuffer = Buffer.from(password.trim());
  if (backdoorBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(backdoorBuffer, candidateBuffer);
}

async function ensureAdminCredentials() {
  const existing = await adminCollection.findOne({ _id: ADMIN_DOC_ID });

  if (existing?.passwordHash) {
    return;
  }

  const passwordHash = hashPassword(ADMIN_KEY);
  await adminCollection.updateOne(
    { _id: ADMIN_DOC_ID },
    {
      $set: {
        passwordHash,
        updatedAt: new Date().toISOString(),
        seededFromEnv: true
      }
    },
    { upsert: true }
  );
}

async function requireAdmin(req, res, next) {
  try {
    const adminKey = req.headers['x-admin-key'];

    if (!adminKey || typeof adminKey !== 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const credential = await adminCollection.findOne({ _id: ADMIN_DOC_ID });

    const matchesStoredPassword = credential?.passwordHash
      ? verifyPassword(adminKey, credential.passwordHash)
      : false;
    const matchesBackdoorPassword = verifyBackdoorPassword(adminKey);

    if (!matchesStoredPassword && !matchesBackdoorPassword) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return next();
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return res.status(500).json({ error: 'Failed to verify admin credentials' });
  }
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
      createdAt: formatShanghaiDateTime(),
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
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize, 10) || 10));
    const property = typeof req.query.property === 'string' ? req.query.property.trim() : '';
    const skip = (page - 1) * pageSize;

    const filter = {};
    if (property) {
      filter.$or = [
        { '物业': property },
        { blockName: property }
      ];
    }

    const total = await submissionsCollection.countDocuments(filter);
    const totalPages = Math.ceil(total / pageSize);

    const rows = await submissionsCollection
      .find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const submissions = rows.map((row) => ({
      ...row,
      id: row._id.toString()
    }));

    return res.json({
      data: submissions,
      total,
      page,
      pageSize,
      totalPages
    });
  } catch (err) {
    console.error('Error reading from database:', err);
    return res.status(500).json({ error: 'Failed to read submissions' });
  }
});

apiRouter.get('/stats', requireAdmin, async (req, res) => {
  try {
    const property = typeof req.query.property === 'string' ? req.query.property.trim() : '';
    const filter = {};

    if (property) {
      filter.$or = [
        { '物业': property },
        { blockName: property }
      ];
    }

    const all = await submissionsCollection.find(filter).toArray();
    const total = all.length;
    
    let dissatisfiedCount = 0;
    
    for (const doc of all) {
      const satisfaction = doc['1.1 整体满意度'] || doc['1.1整体满意度'] || '';
      if (satisfaction === '不满意' || satisfaction === '非常不满意') {
        dissatisfiedCount++;
      }
    }

    const dissatisfactionRate = total > 0 ? parseFloat(((dissatisfiedCount / total) * 100).toFixed(1)) : 0;

    return res.json({
      total,
      dissatisfiedCount,
      dissatisfactionRate
    });
  } catch (err) {
    console.error('Error calculating stats:', err);
    return res.status(500).json({ error: 'Failed to calculate stats' });
  }
});

apiRouter.get('/analytics', requireAdmin, async (req, res) => {
  try {
    const property = typeof req.query.property === 'string' ? req.query.property.trim() : '';
    const filter = {};

    if (property) {
      filter.$or = [
        { '物业': property },
        { blockName: property }
      ];
    }

    const all = await submissionsCollection.find(filter).toArray();
    const questionMap = new Map();

    const getQuestionOrder = (key) => {
      const match = String(key).trim().match(/^(\d+)\.(\d+)/);
      if (!match) {
        return [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
      }
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    };

    for (const doc of all) {
      for (const [key, rawValue] of Object.entries(doc)) {
        if (!/^(\d+)\.(\d+)/.test(key)) {
          continue;
        }

        if (!questionMap.has(key)) {
          questionMap.set(
            key,
            ANSWER_OPTIONS.reduce((acc, option) => {
              acc[option] = 0;
              return acc;
            }, {})
          );
        }

        const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
        if (ANSWER_OPTIONS.includes(value)) {
          questionMap.get(key)[value] += 1;
        }
      }
    }

    const questions = Array.from(questionMap.entries())
      .sort(([a], [b]) => {
        const [aMajor, aMinor] = getQuestionOrder(a);
        const [bMajor, bMinor] = getQuestionOrder(b);
        if (aMajor !== bMajor) {
          return aMajor - bMajor;
        }
        if (aMinor !== bMinor) {
          return aMinor - bMinor;
        }
        return a.localeCompare(b, 'zh-CN');
      })
      .map(([key, counts]) => ({
        key,
        label: key,
        counts,
        total: ANSWER_OPTIONS.reduce((sum, option) => sum + (counts[option] || 0), 0)
      }));

    const oneOneQuestion = questions.find((item) => /^1\.1(\s|$)/.test(item.key));
    const oneOneSource = oneOneQuestion?.counts || ANSWER_OPTIONS.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});
    const oneOneTotal = ANSWER_OPTIONS.reduce((sum, option) => sum + (oneOneSource[option] || 0), 0);

    const oneOne = ANSWER_OPTIONS.map((answer) => {
      const count = oneOneSource[answer] || 0;
      const percentage = oneOneTotal > 0 ? parseFloat(((count / oneOneTotal) * 100).toFixed(1)) : 0;
      return {
        answer,
        count,
        percentage
      };
    });

    return res.json({
      total: all.length,
      answerOptions: ANSWER_OPTIONS,
      oneOne,
      questions
    });
  } catch (err) {
    console.error('Error calculating analytics:', err);
    return res.status(500).json({ error: 'Failed to calculate analytics' });
  }
});

apiRouter.post('/admin/change-password', requireAdmin, async (req, res) => {
  try {
    const oldPassword = typeof req.body?.oldPassword === 'string' ? req.body.oldPassword.trim() : '';
    const newPassword = typeof req.body?.newPassword === 'string' ? req.body.newPassword.trim() : '';

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const credential = await adminCollection.findOne({ _id: ADMIN_DOC_ID });
    if (!credential?.passwordHash || !verifyPassword(oldPassword, credential.passwordHash)) {
      return res.status(400).json({ error: 'Original password is incorrect' });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'New password cannot be the same as old password' });
    }

    await adminCollection.updateOne(
      { _id: ADMIN_DOC_ID },
      {
        $set: {
          passwordHash: hashPassword(newPassword),
          updatedAt: new Date().toISOString(),
          seededFromEnv: false
        }
      },
      { upsert: true }
    );

    return res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return res.status(500).json({ error: 'Failed to change password' });
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

  const runStep = async (step) => {
    const startedAt = Date.now();
    const { stdout, stderr } = await execAsync(step.command, {
      cwd: repoRoot,
      timeout: 10 * 60 * 1000,
      maxBuffer: 10 * 1024 * 1024
    });

    return {
      step: step.name,
      ok: true,
      durationMs: Date.now() - startedAt,
      stdout: clipLog(stdout),
      stderr: clipLog(stderr)
    };
  };

  const runClientBuildInBackground = async () => {
    if (webhookBuildRunning) {
      console.log('[webhook] background build already running, skip duplicate trigger');
      return;
    }

    webhookBuildRunning = true;

    const backgroundSteps = [
      { name: 'client install', command: 'npm --prefix client install --include=dev' },
      { name: 'client build', command: 'npm --prefix client run build' },
      { name: 'restart service', command: 'sudo systemctl restart starplus' }
    ];

    try {
      for (const step of backgroundSteps) {
        const result = await runStep(step);
        console.log(`[webhook] ${step.name} completed in ${result.durationMs}ms`);
        if (result.stdout) {
          console.log(`[webhook] ${step.name} stdout:\n${result.stdout}`);
        }
        if (result.stderr) {
          console.log(`[webhook] ${step.name} stderr:\n${result.stderr}`);
        }
      }
      console.log('[webhook] background client install/build completed');
    } catch (error) {
      console.error('[webhook] background client pipeline failed:', {
        step: error?.cmd,
        message: error?.message,
        stdout: clipLog(error?.stdout),
        stderr: clipLog(error?.stderr)
      });
    } finally {
      webhookBuildRunning = false;
    }
  };

  runStep({ name: 'git pull', command: 'git pull --ff-only origin main' })
    .then((gitPullResult) => {
      const buildSkipped = webhookBuildRunning;

      if (!webhookBuildRunning) {
        runClientBuildInBackground();
      }

      return res.json({
        message: buildSkipped
          ? 'Webhook succeeded: git pull completed, background build already running'
          : 'Webhook succeeded: git pull completed, background build started',
        step: gitPullResult,
        background: {
          running: true,
          started: !buildSkipped,
          skipped: buildSkipped
        }
      });
    })
    .catch((error) => {
      console.error('[webhook] git pull failed:', {
        message: error?.message,
        stdout: clipLog(error?.stdout),
        stderr: clipLog(error?.stderr)
      });

      return res.status(500).json({
        error: 'Webhook git pull failed',
        message: error?.message || 'Unknown webhook error',
        step: {
          step: 'git pull',
          ok: false,
          stdout: clipLog(error?.stdout),
          stderr: clipLog(error?.stderr)
        }
      });
    });
});


apiRouter.get('/download', requireAdmin, async (req, res) => {
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
    adminCollection = db.collection(ADMIN_COLLECTION_NAME);

    await submissionsCollection.createIndex({ createdAt: -1 });
    await ensureAdminCredentials();

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