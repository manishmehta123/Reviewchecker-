import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Battle from '../models/Battle.js';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Multer storage (local uploads folder)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// Create a new battle (two images)
router.post('/', requireAuth, upload.fields([
  { name: 'leftImage', maxCount: 1 },
  { name: 'rightImage', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, leftCaption = '', rightCaption = '' } = req.body;
    const leftFile = req.files?.leftImage?.[0];
    const rightFile = req.files?.rightImage?.[0];
    if (!leftFile || !rightFile) return res.status(400).json({ error: 'Both images required' });

    const leftUrl = `/uploads/${leftFile.filename}`;
    const rightUrl = `/uploads/${rightFile.filename}`;

    const battle = await Battle.create({
      title,
      owner: req.userId,
      left: { url: leftUrl, caption: leftCaption },
      right: { url: rightUrl, caption: rightCaption }
    });

    res.json(battle);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// List battles with aggregated stats
router.get('/', async (req, res) => {
  try {
    const battles = await Battle.find().sort({ createdAt: -1 }).lean();
    const ids = battles.map(b => b._id);
    const agg = await Review.aggregate([
      { $match: { battle: { $in: ids } } },
      { $group: {
        _id: '$battle',
        count: { $sum: 1 },
        avgLeft: { $avg: '$ratingLeft' },
        avgRight: { $avg: '$ratingRight' },
      }}
    ]);

    const byId = Object.fromEntries(agg.map(a => [a._id.toString(), a]));
    const enriched = battles.map(b => {
      const a = byId[b._id.toString()] || { count: 0, avgLeft: 0, avgRight: 0 };
      // Winner algorithm: higher average wins; tie breaker = more reviews; else draw
      let winner = 'Draw';
      if (a.avgLeft > a.avgRight) winner = 'Left';
      else if (a.avgRight > a.avgLeft) winner = 'Right';
      else if (a.count > 0) winner = 'Tie';
      return { ...b, stats: { reviews: a.count, avgLeft: Number(a.avgLeft||0).toFixed(2), avgRight: Number(a.avgRight||0).toFixed(2), winner } };
    });

    res.json(enriched);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get a battle's reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ battle: req.params.id })
      .populate('reviewer', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Post a review
router.post('/:id/reviews', requireAuth, async (req, res) => {
  try {
    const { ratingLeft, ratingRight, comment = '' } = req.body;
    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ error: 'Battle not found' });

    const review = await Review.create({
      battle: battle._id,
      reviewer: req.userId,
      ratingLeft, ratingRight, comment
    });
    res.json(review);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: 'You already reviewed this battle' });
    }
    res.status(500).json({ error: e.message });
  }
});

// Clear reviews (owner only)
router.delete('/:id/reviews', requireAuth, async (req, res) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) return res.status(404).json({ error: 'Battle not found' });
    if (battle.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Only owner can clear reviews' });
    }
    await Review.deleteMany({ battle: battle._id });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
