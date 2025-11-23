import { NextResponse } from 'next/server';
import { brands } from '../../../auth/dataStore';

export async function GET(request, { params }) {
  try {
    const brandId = params.id;
    const brand = brands.get(brandId);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      brand: {
        id: brand.id,
        name: brand.name,
      },
      channels: brand.channels,
      success: true
    });
  } catch (error) {
    console.error('Error fetching channels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch channels', success: false },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const brandId = params.id;
    const brand = brands.get(brandId);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { channelType, accountName } = body;

    if (!channelType) {
      return NextResponse.json(
        { error: 'Channel type is required', success: false },
        { status: 400 }
      );
    }

    // Find the channel and update it
    const channelIndex = brand.channels.findIndex(ch => ch.type === channelType);

    if (channelIndex === -1) {
      return NextResponse.json(
        { error: 'Channel type not found', success: false },
        { status: 404 }
      );
    }

    // Update channel status to connected
    brand.channels[channelIndex] = {
      ...brand.channels[channelIndex],
      status: 'connected',
      accountName: accountName || `${channelType}_account`,
      connectedAt: new Date().toISOString()
    };

    // Update the brand in the store
    brands.set(brandId, brand);

    return NextResponse.json({
      channel: brand.channels[channelIndex],
      success: true
    });
  } catch (error) {
    console.error('Error connecting channel:', error);
    return NextResponse.json(
      { error: 'Failed to connect channel', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const brandId = params.id;
    const brand = brands.get(brandId);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { channelId, channelType } = body;

    // Find the channel by ID or type
    const channelIndex = brand.channels.findIndex(ch =>
      (channelId && ch.id === channelId) || (channelType && ch.type === channelType)
    );

    if (channelIndex === -1) {
      return NextResponse.json(
        { error: 'Channel not found', success: false },
        { status: 404 }
      );
    }

    // Update channel status to disconnected
    brand.channels[channelIndex] = {
      ...brand.channels[channelIndex],
      status: 'disconnected',
      accountName: null,
      connectedAt: null
    };

    // Update the brand in the store
    brands.set(brandId, brand);

    return NextResponse.json({
      channel: brand.channels[channelIndex],
      success: true
    });
  } catch (error) {
    console.error('Error disconnecting channel:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect channel', success: false },
      { status: 500 }
    );
  }
}
