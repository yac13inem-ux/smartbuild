import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/blocks/[id] - Get a specific block
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const block = await db.block.findUnique({
      where: { id },
      include: {
        project: true,
        units: true,
        reports: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        problems: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!block) {
      return NextResponse.json(
        { error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: block,
    });
  } catch (error) {
    console.error('Error fetching block:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block' },
      { status: 500 }
    );
  }
}

// PUT /api/blocks/[id] - Update block progress
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      floorsData,
      grosOeuvreProgress,
      cesProgress,
      cetProgress,
    } = body;

    // Calculate global progress using weighted system:
    // Gros Œuvre = 50%, CES = 30%, CET = 20%
    const go = grosOeuvreProgress !== undefined ? grosOeuvreProgress : 0;
    const ce = cesProgress !== undefined ? cesProgress : 0;
    const ct = cetProgress !== undefined ? cetProgress : 0;
    const globalProgress = Math.round((go * 0.5) + (ce * 0.3) + (ct * 0.2));

    const block = await db.block.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(floorsData !== undefined && { floorsData: JSON.stringify(floorsData) }),
        ...(grosOeuvreProgress !== undefined && { grosOeuvreProgress: go }),
        ...(cesProgress !== undefined && { cesProgress: ce }),
        ...(cetProgress !== undefined && { cetProgress: ct }),
        globalProgress,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: block,
    });
  } catch (error) {
    console.error('Error updating block:', error);
    return NextResponse.json(
      { error: 'Failed to update block' },
      { status: 500 }
    );
  }
}

// DELETE /api/blocks/[id] - Delete a block
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.block.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting block:', error);
    return NextResponse.json(
      { error: 'Failed to delete block' },
      { status: 500 }
    );
  }
}
