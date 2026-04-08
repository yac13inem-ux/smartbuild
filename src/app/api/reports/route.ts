import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reports - Get all reports
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const blockId = searchParams.get('blockId');
    const unitId = searchParams.get('unitId');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (projectId) where.projectId = projectId;
    if (blockId) where.blockId = blockId;
    if (unitId) where.unitId = unitId;
    if (type) where.type = type;

    const [reports, total] = await Promise.all([
      db.report.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          project: true,
          block: true,
          unit: true,
        },
      }),
      db.report.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      projectId,
      blockId,
      unitId,
      images,
      observations,
    } = body;

    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    const report = await db.report.create({
      data: {
        title,
        description,
        type,
        projectId: projectId || null,
        blockId: blockId || null,
        unitId: unitId || null,
        images: images ? JSON.stringify(images) : null,
        observations,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: report,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
