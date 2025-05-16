// src/app/api/admin/machine/route.ts
import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import { authorizeAdmin } from '@/lib/auth';
import Machine from '@/models/Machine';

export async function POST(req: Request) {
    // 1️⃣ Authorization
    const authResult = authorizeAdmin(req);
    if (authResult instanceof NextResponse) return authResult;

    // 2️⃣ Connect to MongoDB
    await connect();

    // 3️⃣ Parse body
    const { name, status } = await req.json(); // you can add more fields later

    // 4️⃣ Create and save
    const machine = new Machine({
        name,
        status: status || 'available',
    });
    await machine.save();

    // 5️⃣ Return response
    return NextResponse.json({ message: 'Machine created', machine }, { status: 201 });
}
