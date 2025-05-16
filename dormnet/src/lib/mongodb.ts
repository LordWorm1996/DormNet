// src/lib/mongodb.ts
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI!;  // your chain connection in .env
let isConnected = false;

export default async function connect() {
    if (isConnected) return;           // Already connected
    await mongoose.connect(uri);       // Opens the connection
    isConnected = true;                // Sets the connection to "Connected"
}
