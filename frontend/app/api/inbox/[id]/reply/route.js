import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function POST(request, { params }) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let fetchOptions = {
      method: 'POST',
      headers: {},
    };

    if (contentType.includes('multipart/form-data')) {
      // Forward multipart form data as-is
      const formData = await request.formData();
      fetchOptions.body = formData;
    } else {
      // Forward JSON body
      const body = await request.json();
      fetchOptions.headers['Content-Type'] = 'application/json';
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}/api/inbox/${params.id}/reply`, fetchOptions);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
