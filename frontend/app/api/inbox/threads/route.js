import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/api/inbox/threads`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
