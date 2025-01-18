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

// Add CORS headers to all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as RequestBody;
    const { image } = body;
    
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500, headers: corsHeaders }
      );
    }

    const result = await identifyPlant(image);
    return NextResponse.json({ result }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error in /api/identify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to identify plant' },
      { status: 500, headers: corsHeaders }
    );
  }
}
