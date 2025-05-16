// src/models/Machine.ts
import mongoose, { Document } from 'mongoose';

/** 1. Define and export the TS interface */
export interface IMachine extends Document {
    _id:      string;
    name:     string;
    status:   'available' | 'in-use';
    createdAt: Date;
    updatedAt: Date;
}

const MachineSchema = new mongoose.Schema({
    name:   { type: String, required: true },
    status: { type: String, enum: ['available','in-use'], default: 'available' },
}, { timestamps: true });

/** 2. Tell Mongoose about the interface */
const Machine = mongoose.models.Machine
    || mongoose.model<IMachine>('Machine', MachineSchema);

export default Machine;
