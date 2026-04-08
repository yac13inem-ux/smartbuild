import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/health - Check database connection and tables
export async function GET(request: NextRequest) {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    database: {
      connected: false,
      url: process.env.DATABASE_URL ? 'configured' : 'missing',
      tables: {} as Record<string, boolean>,
    },
    environment: process.env.NODE_ENV || 'unknown',
  };

  try {
    // Test database connection
    await db.$connect();
    healthCheck.database.connected = true;

    // Check if tables exist
    try {
      await db.project.findFirst();
      healthCheck.database.tables.Project = true;
    } catch (e) {
      healthCheck.database.tables.Project = false;
    }

    try {
      await db.block.findFirst();
      healthCheck.database.tables.Block = true;
    } catch (e) {
      healthCheck.database.tables.Block = false;
    }

    try {
      await db.grosOeuvreFloor.findFirst();
      healthCheck.database.tables.GrosOeuvreFloor = true;
    } catch (e) {
      healthCheck.database.tables.GrosOeuvreFloor = false;
    }

    // Check if all required tables exist
    const allTablesExist = Object.values(healthCheck.database.tables).every(v => v);

    return NextResponse.json({
      status: allTablesExist ? 'healthy' : 'tables_missing',
      ...healthCheck,
      message: allTablesExist
        ? 'All systems operational'
        : 'Database tables are missing. Please run the migration script in Supabase.',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    healthCheck.database.connected = false;

    return NextResponse.json({
      status: 'unhealthy',
      ...healthCheck,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed. Please check your DATABASE_URL environment variable.',
    }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}
