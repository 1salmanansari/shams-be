import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const stockSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["PUMP", "MOTOR", "RAW"] }, // ALLOW TYPES ["PUMP", "MOTOR", "RAW"]
    scale: { type: String, required: true },
    available: { type: Number, default: 0, required: true },
    isActive: { type: Boolean, default: true, required: true },
    isDelete: { type: Boolean, default: false, required: true },
    createdAt: { type: Number, default: () => Date.now(), required: true },
    updatedAt: { type: Number, default: () => Date.now(), required: true },
});

stockSchema.index({ name: 1 });

export default mongoose.model("Stock", stockSchema);
