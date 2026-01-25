import { NextResponse } from 'next/server';

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
            // In a real application, you would set a secure HTTP-only cookie here
            // For now, we return success so the client can set its session state
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
