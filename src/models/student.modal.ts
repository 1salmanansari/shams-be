import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studentSchema = new mongoose.Schema({
	id: { type: String, default: uuidv4, unique: true, index: true },
	enrollmentNo: { type: String, required: true, unique: true, index: true },
	schoolId: { type: String, required: true, index: true },
	classId: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
	paid: { type: Number, required: true, default: 0 },
	mobile: { type: String, required: true },
	email: { type: String, lowercase: true, trim: true },
	dob: { type: String },
	address: { type: String },
	isActive: { type: Boolean, default: true },
	isDelete: { type: Boolean, default: false },
	createdAt: { type: Number, default: () => Date.now(), required: true },
	updatedAt: { type: Number, default: () => Date.now(), required: true },
});

export default mongoose.model("Student", studentSchema);
