import express from "express";
import Review from "../models/Review.js";
import Upload from "../models/Upload.js";
import { authMiddleware, ownerOnly } from "../middleware/auth.js";

const router = express.Router();

// Summary: average per upload + global average + winner (top avg)
router.get("/reviews/summary", authMiddleware, ownerOnly, async (req, res) => {
  const uploads = await Upload.find({ ownerId: req.user.id });
  if (!uploads.length) return res.json({ uploads: [], globalAverage: 0, winner: null });

  const result = [];
  let sum = 0, count = 0;

  for (const u of uploads) {
    const revs = await Review.find({ uploadId: u._id });
    const c = revs.length;
    const s = revs.reduce((a, r) => a + r.rating, 0);
    const avg = c ? s / c : 0;
    result.push({ uploadId: u._id, title: u.title, average: Number(avg.toFixed(2)), count: c });
    sum += s; count += c;
  }

  const globalAverage = count ? Number((sum / count).toFixed(2)) : 0;
  const winner = result.sort((a,b)=>b.average - a.average)[0] || null;
  res.json({ uploads: result, globalAverage, winner });
});

// Clear reviews for all owner's uploads
router.delete("/reviews/clear", authMiddleware, ownerOnly, async (req, res) => {
  const uploads = await Upload.find({ ownerId: req.user.id }).select("_id");
  const ids = uploads.map(u => u._id);
  await Review.deleteMany({ uploadId: { $in: ids } });
  res.json({ message: "All reviews for your uploads cleared." });
});

export default router;
