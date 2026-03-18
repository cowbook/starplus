const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const app = express();
const apiRouter = express.Router();
const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.MONGODB_DB_NAME || 'starplus';
const COLLECTION_NAME = 'submissions';
const ADMIN_KEY = process.env.ADMIN_KEY || 'change-this-admin-key';

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
  exec('git pull --force origin main', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Git pull error: ${error}`);
      return res.status(500).send('Pull failed');
    }
    console.log(`Git pull output: ${stdout}`);
    res.send('Pull successful');
  });
});


apiRouter.get('/download', (req, res) => {
  return res.status(410).json({
    error: 'CSV download is no longer available',
    message: 'Use GET /api/submissions to read records from MongoDB'
  });
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