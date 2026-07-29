import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { createServer as createViteServer } from 'vite';
import jwt from 'jsonwebtoken';
import { destinations as defaultDestinations } from './src/destinations.ts';

const app = express();
const PORT = 3000;
const SECRET = 'osthir_wow_secret_123';
const DATA_FILE = path.join(process.cwd(), 'data.json');

app.use(express.json());

// Helper to init or read data
async function getData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.destinations || parsed.destinations.length === 0) {
      parsed.destinations = defaultDestinations;
      await saveData(parsed);
    }
    return parsed;
  } catch (e) {
    const defaultData = {
      credentials: { username: 'admin', password: 'password' },
      destinations: defaultDestinations
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

async function saveData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Admin Auth middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// API Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const data = await getData();
  
  if (username === data.credentials.username && password === data.credentials.password) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/destinations', async (req, res) => {
  const data = await getData();
  res.json(data.destinations);
});

app.post('/api/destinations', authenticateToken, async (req, res) => {
  const data = await getData();
  data.destinations = req.body;
  await saveData(data);
  res.json({ success: true });
});

app.post('/api/credentials', authenticateToken, async (req, res) => {
  const { username, password } = req.body;
  const data = await getData();
  data.credentials = { username, password };
  await saveData(data);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
