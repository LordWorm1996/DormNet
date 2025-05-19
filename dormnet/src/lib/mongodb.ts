import mongoose from "mongoose";

const uri = process.env.MONGO_URI!;
let isConnected = false;

export default async function connect() {
  if (isConnected) return;
  await mongoose.connect(uri);
  isConnected = true;
}
