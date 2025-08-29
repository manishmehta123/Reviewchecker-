import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  battle: { type: mongoose.Schema.Types.ObjectId, ref: 'Battle', required: true, index: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ratingLeft: { type: Number, min: 0, max: 5, required: true },
  ratingRight: { type: Number, min: 0, max: 5, required: true },
  comment: { type: String, default: '' },
}, { timestamps: true });

reviewSchema.index({ battle: 1, reviewer: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
