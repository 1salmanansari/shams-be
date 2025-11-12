import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { EPaymentMode } from "../types/common"; // must use relative import

const feeSchema = new mongoose.Schema({
	id: { type: String, default: uuidv4, unique: true, index: true },
	studentId: { type: String, required: true },
	classId: { type: String, required: true },
	schoolId: { type: String, required: true },
	academicYear: { type: String, required: true }, // e.g. "2025-2026"
	amount: { type: Number, required: true },
	mode: {
		type: String,
		enum: Object.values(EPaymentMode), // "CASH","UPI","ACCOUNT","CHEQUE"
		default: EPaymentMode.CASH,
	},
	note: { type: String },
	createdAt: { type: Number, default: () => Date.now(), required: true },
	updatedAt: { type: Number, default: () => Date.now(), required: true },
});

export default mongoose.model("Fee", feeSchema);
