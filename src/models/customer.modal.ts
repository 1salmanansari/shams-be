import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const customerSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true,
    },
    name: { type: String, required: true },
    company: { type: String, required: true },
    dialCode: { type: String, required: true },
    gst: { type: String, default: '' },
    mobile: { type: String, required: true },
    isActive: { type: Boolean, default: true, required: true },
    isDelete: { type: Boolean, default: false, required: true },
    createdAt: { type: Number, default: () => Date.now(), required: true },
    updatedAt: { type: Number, default: () => Date.now(), required: true },
});

customerSchema.index({ name: 1 });

export default mongoose.model("Customer", customerSchema);
