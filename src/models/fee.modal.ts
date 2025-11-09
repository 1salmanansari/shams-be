import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const feeSchema = new mongoose.Schema({
	id: { type: String, default: uuidv4, unique: true, index: true },
	studentId: { type: String, required: true, index: true },
	classId: { type: String, required: true },
	schoolId: { type: String, required: true },
	academicYear: { type: String, required: true }, // e.g. "2025-2026"

	// Yearly summary
	totalAmount: { type: Number, required: true },
	paidAmount: { type: Number, default: 0 },
	pendingAmount: { type: Number, required: true }, // total - paid

	// Payment history
	payments: [
		{
			id: { type: String, default: uuidv4 },
			amount: { type: Number, required: true },
			date: { type: Number, default: () => Date.now() },
			mode: { type: String, enum: ["CASH", "UPI", "ACCOUNT", "CHEQUE"], default: "CASH" },
			note: { type: String }
		}
	],

	isActiveYear: { type: Boolean, default: true },
	remarks: { type: String },

	createdAt: { type: Number, default: () => Date.now() },
	updatedAt: { type: Number, default: () => Date.now() }
});

feeSchema.index({ studentId: 1, academicYear: 1 }, { unique: true });

export default mongoose.model("Fee", feeSchema);
