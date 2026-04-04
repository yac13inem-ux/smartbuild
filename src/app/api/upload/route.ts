import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const gpsLat = formData.get('gpsLat') as string;
    const gpsLng = formData.get('gpsLng') as string;
    const timestamp = formData.get('timestamp') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename with timestamp
    const timestampStr = timestamp || Date.now().toString();
    const ext = file.name.split('.').pop();
    const filename = `${timestampStr}_${Math.random().toString(36).substring(7)}.${ext}`;

    const uploadDir = join(process.cwd(), 'upload');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return file metadata
    const fileUrl = `/upload/${filename}`;

    return NextResponse.json({
      success: true,
      filename,
      url: fileUrl,
      originalName: file.name,
      size: file.size,
      type: file.type,
      gps: gpsLat && gpsLng ? { lat: gpsLat, lng: gpsLng } : null,
      timestamp: timestampStr,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
