import mongoose, { Document, Schema } from "mongoose";

// Interface for TypeScript type safety
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Schema definition
const userSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
