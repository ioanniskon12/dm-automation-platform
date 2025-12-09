import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request, { params }) {
  try {
    const response = await fetch(`${API_URL}/api/inbox/threads/${params.id}`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching thread:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
