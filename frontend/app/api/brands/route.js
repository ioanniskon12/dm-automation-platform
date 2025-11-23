import { NextResponse } from 'next/server';
import { brands } from '../auth/dataStore';

export async function GET(request) {
  try {
    // In a real app, get userId from session/JWT
    // For now, we'll use a demo user
    const userId = 'demo-user';

    // Get all brands for this user
    const userBrands = Array.from(brands.values()).filter(
      brand => brand.userId === userId
    );

    return NextResponse.json({
      brands: userBrands,
      success: true
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, avatar } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Brand name is required', success: false },
        { status: 400 }
      );
    }

    const userId = 'demo-user';
    const brandId = `brand-${Date.now()}`;

    const newBrand = {
      id: brandId,
      name,
      avatar: avatar || null, // Store avatar (base64 or URL)
      userId,
      createdAt: new Date().toISOString(),
      channels: [
        { id: `${brandId}-ch-1`, type: 'instagram', status: 'disconnected', accountName: null },
        { id: `${brandId}-ch-2`, type: 'facebook', status: 'disconnected', accountName: null },
        { id: `${brandId}-ch-3`, type: 'whatsapp', status: 'disconnected', accountName: null },
        { id: `${brandId}-ch-4`, type: 'telegram', status: 'disconnected', accountName: null },
        { id: `${brandId}-ch-5`, type: 'sms', status: 'disconnected', accountName: null },
        { id: `${brandId}-ch-6`, type: 'tiktok', status: 'disconnected', accountName: null },
      ]
    };

    brands.set(brandId, newBrand);

    return NextResponse.json({
      brand: newBrand,
      success: true
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json(
      { error: 'Failed to create brand', success: false },
      { status: 500 }
    );
  }
}
