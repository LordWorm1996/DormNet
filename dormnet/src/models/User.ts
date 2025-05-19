import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  _id: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
