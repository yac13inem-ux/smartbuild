import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Simple test endpoint to verify database connection and data creation
export async function GET() {
  try {
    // Test database connection
    const problemCount = await db.problem.count();
    const reportCount = await db.report.count();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        problemCount,
        reportCount
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type = 'problem', data } = body;

    if (type === 'problem') {
      // Test creating a problem
      const problem = await db.problem.create({
        data: {
          description: data?.description || 'Test problem',
          projectId: null,
          blockId: null,
          unitId: null,
          status: 'PENDING',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Problem created successfully',
        data: problem
      });
    } else if (type === 'report') {
      // Test creating a report
      const report = await db.report.create({
        data: {
          title: data?.title || 'Test report',
          description: data?.description || 'Test description',
          type: data?.type || 'PV_VISITE',
          projectId: null,
          blockId: null,
          unitId: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Report created successfully',
        data: report
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid type. Use "problem" or "report"'
    }, { status: 400 });
  } catch (error) {
    console.error('Test creation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
