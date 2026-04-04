import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/blocks - Get all blocks
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (projectId) where.projectId = projectId;

    const [blocks, total] = await Promise.all([
      db.block.findMany({
        where,
        include: {
          project: true,
          units: true,
          _count: {
            select: {
              units: true,
              reports: true,
              problems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.block.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: blocks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching blocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks' },
      { status: 500 }
    );
  }
}

// POST /api/blocks - Create a new block
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, projectId } = body;

    if (!name || !projectId) {
      return NextResponse.json(
        { error: 'Block name and project ID are required' },
        { status: 400 }
      );
    }

    // Calculate initial global progress using weighted system
    const grosOeuvreProgress = body.grosOeuvreProgress || 0;
    const cesProgress = body.cesProgress || 0;
    const cetProgress = body.cetProgress || 0;
    const globalProgress = Math.round(
      (grosOeuvreProgress * 0.5) + (cesProgress * 0.3) + (cetProgress * 0.2)
    );

    const block = await db.block.create({
      data: {
        name,
        description,
        projectId,
        grosOeuvreProgress,
        cesProgress,
        cetProgress,
        globalProgress,
      },
    });

    return NextResponse.json({
      success: true,
      data: block,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating block:', error);
    return NextResponse.json(
      { error: 'Failed to create block' },
      { status: 500 }
    );
  }
}
