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

// POST /api/blocks - Create a new block with floors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, projectId, numberOfFloors, floorsData, grosOeuvreProgress, cesProgress, cetProgress, globalProgress } = body;

    if (!name || !projectId) {
      return NextResponse.json(
        { error: 'Block name and project ID are required' },
        { status: 400 }
      );
    }

    const block = await db.block.create({
      data: {
        name,
        description,
        projectId,
        numberOfFloors: numberOfFloors || null,
        floorsData: floorsData ? JSON.stringify(floorsData) : null,
        grosOeuvreProgress: grosOeuvreProgress || 0,
        cesProgress: cesProgress || 0,
        cetProgress: cetProgress || 0,
        globalProgress: globalProgress || 0,
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
