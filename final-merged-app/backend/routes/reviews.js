import express from "express";
import Review from "../models/Review.js";
import Upload from "../models/Upload.js";

const router = express.Router();

// Public: add review
router.post("/:uploadId", async (req, res) => {
  const { reviewerName, rating, comment } = req.body;
  const { uploadId } = req.params;
  const upload = await Upload.findById(uploadId);
  if (!upload) return res.status(404).json({ error: "Upload not found" });
  const review = await Review.create({ uploadId, reviewerName, rating, comment });
  res.json(review);
});

// Public: get reviews for an upload
router.get("/public/:uploadId", async (req, res) => {
  const { uploadId } = req.params;
  const reviews = await Review.find({ uploadId }).sort({ createdAt: -1 });
  res.json(reviews);
});

export default router;
