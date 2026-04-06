import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/problems/[id] - Get a single problem
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const problem = await db.problem.findUnique({
      where: { id },
      include: {
        project: true,
        block: true,
        unit: true,
      },
    });

    if (!problem) {
      return NextResponse.json(
        { error: 'Problem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problem' },
      { status: 500 }
    );
  }
}

// PUT /api/problems/[id] - Update a problem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      description,
      status,
      projectId,
      blockId,
      unitId,
      images,
    } = body;

    const problem = await db.problem.update({
      where: { id },
      data: {
        description,
        status,
        projectId,
        blockId,
        unitId,
        images: images ? JSON.stringify(images) : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: problem,
    });
  } catch (error) {
    console.error('Error updating problem:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

// DELETE /api/problems/[id] - Delete a problem
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await db.problem.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting problem:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}
