// src/lib/auth.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
interface JWTPayload {
    userId: string;
    role: string;
    iat?: number;
    exp?: number;
}
export function authorizeAdmin(req: Request) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
        if (payload.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        return payload;  // returns user info if successful
    } catch (err) {
        console.error('Auth error', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
