import { NextResponse } from 'next/server';
import { brands } from '../../auth/dataStore';

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const brand = brands.get(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      brand,
      success: true
    });
  } catch (error) {
    console.error('Error fetching brand:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand', success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;

    // Check if brand exists
    const brand = brands.get(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    // Verify user owns this brand (in production, check JWT/session)
    const userId = 'demo-user';
    if (brand.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 403 }
      );
    }

    // Delete the brand
    brands.delete(id);

    return NextResponse.json({
      message: 'Brand deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand', success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Check if brand exists
    const brand = brands.get(id);

    if (!brand) {
      return NextResponse.json(
        { error: 'Brand not found', success: false },
        { status: 404 }
      );
    }

    // Verify user owns this brand (in production, check JWT/session)
    const userId = 'demo-user';
    if (brand.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 403 }
      );
    }

    // Update the brand
    const updatedBrand = {
      ...brand,
      ...body,
      id, // Ensure ID doesn't change
      userId, // Ensure userId doesn't change
      updatedAt: new Date().toISOString()
    };

    brands.set(id, updatedBrand);

    return NextResponse.json({
      brand: updatedBrand,
      success: true
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json(
      { error: 'Failed to update brand', success: false },
      { status: 500 }
    );
  }
}
