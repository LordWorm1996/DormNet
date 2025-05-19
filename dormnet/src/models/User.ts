import mongoose, { Document } from "mongoose";

/** 1. Define a TS interface for the User document */
export interface IUser extends Document {
  username: string;
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string; // optional, if you add roles later
}

/** 2. Define the Mongoose schema */
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  _id: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

/** 3. Create and export the model */
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
