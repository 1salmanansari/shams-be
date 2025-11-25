import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true,
    },
    client: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    mode: {
        type: String,
        enum: ["CASH", "UPI", "NET_BANKING", "CHEQUE"],
        required: true,
        uppercase: true,
    },
    remark: { type: String, default: "", trim: true },
    millie: { type: Number, required: true }, // store timestamp
    createdAt: { type: Number, default: () => Date.now(), required: true },
    updatedAt: { type: Number, default: () => Date.now(), required: true },
});

paymentSchema.index({ client: 1, millie: -1 });

paymentSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

paymentSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

export default mongoose.model("Payment", paymentSchema);
