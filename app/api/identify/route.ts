import { NextResponse } from 'next/server';
import { identifyPlant, PlantInfo } from '@/app/utils/gemini';

export const runtime = 'edge';

interface RequestBody {
  image: string;
}

interface IdentifyResponse {
  result: PlantInfo;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { image } = body;
    
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    const result = await identifyPlant(image);
    return NextResponse.json({ result });
    
  } catch (error) {
    console.error('Error in /api/identify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to identify plant' },
      { status: 500 }
    );
  }
}
