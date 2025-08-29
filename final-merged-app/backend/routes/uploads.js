import express from "express";
import Upload from "../models/Upload.js";
import User from "../models/User.js";
import { authMiddleware, ownerOnly } from "../middleware/auth.js";

const router = express.Router();

// Owner creates uploads
router.post("/", authMiddleware, ownerOnly, async (req, res) => {
  const { title, description } = req.body;
  const upload = await Upload.create({ title, description, ownerId: req.user.id });
  res.json(upload);
});

// Owner: my uploads (owner only)
router.get("/owner", authMiddleware, ownerOnly, async (req, res) => {
  const uploads = await Upload.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(uploads);
});

// User: see only own uploads (if we allow users to have uploads later)
router.get("/my", authMiddleware, async (req, res) => {
  const uploads = await Upload.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
  res.json(uploads);
});

// Public homepage: show owner's uploads
router.get("/public", async (req, res) => {
  const owner = await User.findOne({ role: "owner" }).select("_id");
  if (!owner) return res.json([]);
  const uploads = await Upload.find({ ownerId: owner._id }).sort({ createdAt: -1 });
  res.json(uploads);
});

export default router;
