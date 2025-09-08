import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const schoolSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  zipCode: { type: String },
  isActive: { type: Boolean, default: true, required: true },
  isDelete: { type: Boolean, default: false, required: true },
  createdAt: { type: Number, default: () => Date.now(), required: true },
  updatedAt: { type: Number, default: () => Date.now(), required: true },
});

schoolSchema.index({ name: 1 });

export default mongoose.model("School", schoolSchema);
