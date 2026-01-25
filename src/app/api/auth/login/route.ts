import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface LoginRequest {
    email?: string;
    password?: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json() as LoginRequest;
        const { email, password } = body;

        // Get credentials from environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error('Admin credentials not configured in environment variables');
            return NextResponse.json(
                { error: 'Server misconfiguration' },
                { status: 500 }
            );
        }

        // Validate credentials
        if (email === adminEmail && password === adminPassword) {
            // Set secure HTTP-only cookie
            const cookieStore = await cookies();
            cookieStore.set('admin_session', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
