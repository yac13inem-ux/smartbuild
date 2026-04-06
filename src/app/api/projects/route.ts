import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/projects - Get all projects with blocks and units
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const [projects, total] = await Promise.all([
      db.project.findMany({
        include: {
          blocks: {
            include: {
              units: true,
            },
          },
          _count: {
            select: {
              blocks: true,
              reports: true,
              problems: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.project.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project with blocks and floors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, location, totalApartments, blocks, authorId } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    // Calculate block progress from floor data
    const calculateBlockProgress = (floorsData: any[]) => {
      if (!floorsData || floorsData.length === 0) {
        return { grosOeuvreProgress: 0, cesProgress: 0, cetProgress: 0, globalProgress: 0 };
      }

      let totalGrosOeuvre = 0;
      let totalCes = 0;
      let totalCet = 0;

      floorsData.forEach((floor) => {
        totalGrosOeuvre += floor.grosOeuvre || 0;
        totalCes += floor.ces || 0;
        totalCet += floor.cet || 0;
      });

      const grosOeuvreProgress = Math.round(totalGrosOeuvre / floorsData.length);
      const cesProgress = Math.round(totalCes / floorsData.length);
      const cetProgress = Math.round(totalCet / floorsData.length);
      const globalProgress = Math.round((grosOeuvreProgress + cesProgress + cetProgress) / 3);

      return { grosOeuvreProgress, cesProgress, cetProgress, globalProgress };
    };

    const project = await db.project.create({
      data: {
        name,
        description,
        location,
        totalApartments: totalApartments ? parseInt(totalApartments) : null,
        authorId,
        ...(blocks && blocks.length > 0 && {
          blocks: {
            create: blocks.map((block: any) => {
              const progress = calculateBlockProgress(block.floorsData);
              return {
                name: block.name,
                description: block.description,
                numberOfFloors: block.numberOfFloors ? parseInt(block.numberOfFloors) : null,
                floorsData: block.floorsData ? JSON.stringify(block.floorsData) : null,
                grosOeuvreProgress: progress.grosOeuvreProgress,
                cesProgress: progress.cesProgress,
                cetProgress: progress.cetProgress,
                globalProgress: progress.globalProgress,
              };
            }),
          },
        }),
      },
      include: {
        blocks: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
