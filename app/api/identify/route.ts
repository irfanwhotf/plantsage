import { NextResponse } from 'next/server';
import { identifyPlant, PlantInfo } from '@/app/utils/gemini';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    // Log request details for debugging
    console.log('Received request:', {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
    });

    const body = await request.json() as RequestBody;
    const { image } = body;
    
    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'Invalid image data' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('Missing API key');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('Processing image with Gemini...');
    const result = await identifyPlant(image);
    console.log('Gemini response received:', result);
    
    if (!result) {
      throw new Error('No result from plant identification');
    }
    
    return NextResponse.json(
      { result },
      { 
        status: 200,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'no-store, must-revalidate',
        }
      }
    );
    
  } catch (error) {
    console.error('Error in /api/identify:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to identify plant' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}
