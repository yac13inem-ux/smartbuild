import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { imagePath } = await request.json();

    if (!imagePath) {
      return NextResponse.json({ error: 'imagePath is required' }, { status: 400 });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/png;base64,${base64Image}`;

    const zai = await ZAI.create();

    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this UI interface screenshot in detail. Tell me: 1) What page/section is this? 2) What are the main UI elements visible? 3) Are there any error messages or issues? 4) What language is the interface? 5) Describe the overall layout and user experience. Be very specific about what you see.'
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    const analysis = response.choices[0]?.message?.content;

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Screenshot analysis error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
