import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateUnitGlobalProgress } from '@/lib/progress-utils';

// GET /api/units/[id] - Get a specific unit
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const unit = await db.unit.findUnique({
      where: { id },
      include: {
        block: {
          include: {
            project: true,
          },
        },
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

    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error('Error fetching unit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unit' },
      { status: 500 }
    );
  }
}

// PUT /api/units/[id] - Update a unit
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      unitNumber,
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

    // Get current unit data first
    const currentUnit = await db.unit.findUnique({
      where: { id },
    });

    if (!currentUnit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    // Calculate CES and CET progress
    const cesItems = [
      cesPlumbing ?? currentUnit.cesPlumbing ?? 0,
      cesElectrical ?? currentUnit.cesElectrical ?? 0,
      cesPainting ?? currentUnit.cesPainting ?? 0,
      cesFlooring ?? currentUnit.cesFlooring ?? 0,
      cesCarpentry ?? currentUnit.cesCarpentry ?? 0,
      cesCeramic ?? currentUnit.cesCeramic ?? 0,
    ];
    const cesProgress = Math.round(cesItems.reduce((sum, val) => sum + val, 0) / cesItems.length);

    const cetItems = [
      cetHvac ?? currentUnit.cetHvac ?? 0,
      cetFireFighting ?? currentUnit.cetFireFighting ?? 0,
      cetElevators ?? currentUnit.cetElevators ?? 0,
      cetPlumbing ?? currentUnit.cetPlumbing ?? 0,
      cetElectrical ?? currentUnit.cetElectrical ?? 0,
    ];
    const cetProgress = Math.round(cetItems.reduce((sum, val) => sum + val, 0) / cetItems.length);

    // Calculate global progress
    const goProgress = grosOeuvreProgress ?? currentUnit.grosOeuvreProgress;
    const globalProgress = Math.round(
      (goProgress * 0.5) + (cesProgress * 0.3) + (cetProgress * 0.2)
    );

    const unit = await db.unit.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(unitNumber !== undefined && { unitNumber }),
        ...(floorNumber !== undefined && { floorNumber: parseInt(floorNumber) }),
        ...(unitType !== undefined && { unitType }),
        ...(area !== undefined && { area: parseFloat(area) }),
        ...(grosOeuvreProgress !== undefined && { grosOeuvreProgress: goProgress }),
        cesProgress,
        cetProgress,
        globalProgress,
        ...(cesPlumbing !== undefined && { cesPlumbing }),
        ...(cesElectrical !== undefined && { cesElectrical }),
        ...(cesPainting !== undefined && { cesPainting }),
        ...(cesFlooring !== undefined && { cesFlooring }),
        ...(cesCarpentry !== undefined && { cesCarpentry }),
        ...(cesCeramic !== undefined && { cesCeramic }),
        ...(cetHvac !== undefined && { cetHvac }),
        ...(cetFireFighting !== undefined && { cetFireFighting }),
        ...(cetElevators !== undefined && { cetElevators }),
        ...(cetPlumbing !== undefined && { cetPlumbing }),
        ...(cetElectrical !== undefined && { cetElectrical }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: unit,
    });
  } catch (error) {
    console.error('Error updating unit:', error);
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    );
  }
}

// DELETE /api/units/[id] - Delete a unit
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log('🗑️ DELETE request for unit ID:', id);

    await db.unit.delete({
      where: { id },
    });

    console.log('✅ Unit deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Unit deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting unit:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      {
        error: 'Failed to delete unit',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false
      },
      { status: 500 }
    );
  }
}
