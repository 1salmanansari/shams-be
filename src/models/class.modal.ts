import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const classSchema = new mongoose.Schema({
	id: { type: String, default: uuidv4, unique: true, index: true },
	schoolId: { type: String, required: true, index: true },
	name: { type: String, required: true },
	section: { type: String, required: true, default: "A" },
	fee: { type: Number, required: true },
	ct: { type: String, required: true, default: "" },
	isActive: { type: Boolean, default: true },
	isDelete: { type: Boolean, default: false },
	createdAt: { type: Number, default: () => Date.now(), required: true },
	updatedAt: { type: Number, default: () => Date.now(), required: true },
});

classSchema.index({ name: 1, schoolId: 1 });

export default mongoose.model("Class", classSchema);

