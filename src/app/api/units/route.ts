import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateUnitGlobalProgress } from '@/lib/progress-utils';

// GET /api/units - Get all units
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blockId = searchParams.get('blockId');
    const projectId = searchParams.get('projectId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (blockId) where.blockId = blockId;
    if (projectId) {
      // If projectId is provided, get units from all blocks in this project
      const blocks = await db.block.findMany({
        where: { projectId },
        select: { id: true },
      });
      where.blockId = { in: blocks.map(b => b.id) };
    }

    const [units, total] = await Promise.all([
      db.unit.findMany({
        where,
        include: {
          block: {
            include: {
              project: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.unit.count({ where }),
    ]);

    // Calculate progress for each unit
    const unitsWithProgress = units.map(unit => {
      const progress = calculateUnitGlobalProgress(unit);
      return {
        ...unit,
        cesProgress: progress.cesProgress,
        cetProgress: progress.cetProgress,
        globalProgress: progress.globalProgress,
      };
    });

    return NextResponse.json({
      success: true,
      data: unitsWithProgress,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    );
  }
}

// POST /api/units - Create a new unit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      unitNumber,
      blockId,
      floorNumber,
      unitType,
      area,
      grosOeuvreProgress,
      cesPlumbing,
      cesElectrical,
      cesPainting,
      cesFlooring,
      cesCarpentry,
      cesCeramic,
      cetHvac,
      cetFireFighting,
      cetElevators,
      cetPlumbing,
      cetElectrical,
    } = body;

    if (!name || !blockId) {
      return NextResponse.json(
        { error: 'Unit name and block ID are required' },
        { status: 400 }
      );
    }

    // Calculate CES and CET progress
    const cesItems = [
      cesPlumbing || 0,
      cesElectrical || 0,
      cesPainting || 0,
      cesFlooring || 0,
      cesCarpentry || 0,
      cesCeramic || 0,
    ];
    const cesProgress = Math.round(cesItems.reduce((sum, val) => sum + val, 0) / cesItems.length);

    const cetItems = [
      cetHvac || 0,
      cetFireFighting || 0,
      cetElevators || 0,
      cetPlumbing || 0,
      cetElectrical || 0,
    ];
    const cetProgress = Math.round(cetItems.reduce((sum, val) => sum + val, 0) / cetItems.length);

    // Calculate global progress
    const goProgress = grosOeuvreProgress || 0;
    const globalProgress = Math.round(
      (goProgress * 0.5) + (cesProgress * 0.3) + (cetProgress * 0.2)
    );

    const unit = await db.unit.create({
      data: {
        name,
        unitNumber,
        blockId,
        floorNumber: floorNumber ? parseInt(floorNumber) : null,
        unitType,
        area: area ? parseFloat(area) : null,
        grosOeuvreProgress: goProgress,
        cesProgress,
        cetProgress,
        globalProgress,
        cesPlumbing: cesPlumbing || 0,
        cesElectrical: cesElectrical || 0,
        cesPainting: cesPainting || 0,
        cesFlooring: cesFlooring || 0,
        cesCarpentry: cesCarpentry || 0,
        cesCeramic: cesCeramic || 0,
        cetHvac: cetHvac || 0,
        cetFireFighting: cetFireFighting || 0,
        cetElevators: cetElevators || 0,
        cetPlumbing: cetPlumbing || 0,
        cetElectrical: cetElectrical || 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: unit,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating unit:', error);
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    );
  }
}
