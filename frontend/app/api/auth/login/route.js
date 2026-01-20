import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { users } from '../dataStore';

// Hardcoded admin users for serverless environments where globalThis doesn't persist
const ADMIN_USERS = {
  'gianniskon12@gmail.com': {
    id: 'admin-1',
    name: 'Giannis',
    email: 'gianniskon12@gmail.com',
    password: 'admin123',
  },
  'sotiris040197@gmail.com': {
    id: 'admin-2',
    name: 'Sotiris',
    email: 'sotiris040197@gmail.com',
    password: 'admin123',
  },
};

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check hardcoded admin users first (for serverless compatibility)
    let user = ADMIN_USERS[email];

    // Then check dynamic users from dataStore
    if (!user) {
      user = users.get(email);
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
