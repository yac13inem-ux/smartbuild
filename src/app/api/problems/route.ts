import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/problems - Get all problems
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const blockId = searchParams.get('blockId');
    const unitId = searchParams.get('unitId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (blockId) where.blockId = blockId;
    if (unitId) where.unitId = unitId;
    if (status) where.status = status;

    const [problems, total] = await Promise.all([
      db.problem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          project: true,
          block: true,
          unit: true,
        },
      }),
      db.problem.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}

// POST /api/problems - Create a new problem
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      description,
      projectId,
      blockId,
      unitId,
      images,
      status,
    } = body;

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const problem = await db.problem.create({
      data: {
        description,
        projectId: projectId || null,
        blockId: blockId || null,
        unitId: unitId || null,
        images: images ? JSON.stringify(images) : null,
        status: status || 'PENDING',
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: problem,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating problem:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}

// PUT /api/problems - Update a problem
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, description, images } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

    const problem = await db.problem.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(description && { description }),
        ...(images && { images: JSON.stringify(images) }),
        updatedAt: new Date(),
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

// DELETE /api/problems - Delete a problem
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' },
        { status: 400 }
      );
    }

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
