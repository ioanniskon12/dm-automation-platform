import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const channel = searchParams.get('channel');

    const url = channel
      ? `${API_URL}/api/triggers/types?channel=${channel}`
      : `${API_URL}/api/triggers/types`;

    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching trigger types:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
