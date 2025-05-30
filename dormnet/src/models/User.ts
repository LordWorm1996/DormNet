import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  role: string;
  passwordResetRequested: boolean;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  passwordResetRequested: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
