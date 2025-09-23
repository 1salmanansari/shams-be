import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { ROLES } from "../utils/constants";

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String },
    role: { type: String, enum: ROLES, default: ROLES.TEACHER },
    DOB: { type: String },
    tokens: { type: [String], default: [] },
    isLoginGrant: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: true, required: true },
    isDelete: { type: Boolean, default: false, required: true },
    lastLogin: { type: Number, default: null },
    createdAt: { type: Number, default: () => Date.now(), required: true },
    updatedAt: { type: Number, default: () => Date.now(), required: true },
  },
  {
    timestamps: false,
  }
);

userSchema.index({ firstName: 1, lastName: 1 }); // compound index

export default mongoose.model("User", userSchema);
