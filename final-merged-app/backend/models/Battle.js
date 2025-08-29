import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, default: '' }
}, { _id: false });

const battleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  left: { type: imageSchema, required: true },
  right: { type: imageSchema, required: true },
}, { timestamps: true });

export default mongoose.model('Battle', battleSchema);
