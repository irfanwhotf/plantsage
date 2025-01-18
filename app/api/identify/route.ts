import { NextResponse } from 'next/server';
import { identifyPlant, PlantInfo } from '@/app/utils/gemini';

// Remove edge runtime for local development
// export const runtime = 'edge';

interface RequestBody {
  image: string;
}

interface IdentifyResponse {
  result: PlantInfo;
  error?: string;
}

export async function POST(request: Request) {
  try {
    // Add CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    if (!request.body) {
      return NextResponse.json(
        { error: 'Request body is missing' },
        { status: 400, headers }
      );
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 400, headers }
      );
    }

    const body = await request.json() as RequestBody;
    const { image } = body;
    
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400, headers }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500, headers }
      );
    }

    const result = await identifyPlant(image);
    return NextResponse.json({ result }, { headers });
    
  } catch (error) {
    console.error('Error in /api/identify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to identify plant' },
      { status: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
      }}
    );
  }
}
