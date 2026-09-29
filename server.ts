import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { handleGenerateStory, handleGenerateImage } from './src/server/apiHandlers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// API Endpoints
app.post('/api/generate-story', async (req, res) => {
  try {
    const result = await handleGenerateStory(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-story:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate story' });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const result = await handleGenerateImage(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    res.json({ imageUrl: null, fallback: true });
  }
});

app.post('/api/layout-builder', (req, res) => {
  res.json({ success: true, layout: req.body.layout, timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'ComicCraft AI' });
});

// Serve static frontend in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ComicCraft server running on port ${PORT}`);
});
