import mongoose from "mongoose";
const { Schema } = mongoose;

const uploadSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Upload", uploadSchema);
