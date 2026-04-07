import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/gros-oeuvre-floors - Get all floors with Gros Œuvre data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blockId = searchParams.get('blockId');

    const where: any = {};
    if (blockId) where.blockId = blockId;

    const floors = await db.grosOeuvreFloor.findMany({
      where,
      include: {
        block: true,
      },
      orderBy: { floorNumber: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: floors,
    });
  } catch (error) {
    console.error('Error fetching Gros Œuvre floors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Gros Œuvre floors' },
      { status: 500 }
    );
  }
}

// POST /api/gros-oeuvre-floors - Create or update Gros Œuvre floor data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      blockId,
      floorNumber,
      ironReviewDate,
      concretePourDate,
      ironApproval,
      concretePoured,
      notes,
    } = body;

    if (!blockId || !floorNumber) {
      return NextResponse.json(
        { error: 'Block ID and floor number are required' },
        { status: 400 }
      );
    }

    // Check if floor already exists
    const existingFloor = await db.grosOeuvreFloor.findFirst({
      where: {
        blockId,
        floorNumber,
      },
    });

    let floor;

    if (existingFloor) {
      // Update existing floor
      floor = await db.grosOeuvreFloor.update({
        where: { id: existingFloor.id },
        data: {
          ...(ironReviewDate && { ironReviewDate: new Date(ironReviewDate) }),
          ...(concretePourDate && { concretePourDate: new Date(concretePourDate) }),
          ...(ironApproval !== undefined && { ironApproval }),
          ...(concretePoured !== undefined && { concretePoured }),
          ...(notes !== undefined && { notes }),
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new floor
      floor = await db.grosOeuvreFloor.create({
        data: {
          blockId,
          floorNumber,
          ...(ironReviewDate && { ironReviewDate: new Date(ironReviewDate) }),
          ...(concretePourDate && { concretePourDate: new Date(concretePourDate) }),
          ironApproval: ironApproval || false,
          concretePoured: concretePoured || false,
          notes,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: floor,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating Gros Œuvre floor:', error);
    return NextResponse.json(
      { error: 'Failed to save Gros Œuvre floor data' },
      { status: 500 }
    );
  }
}
