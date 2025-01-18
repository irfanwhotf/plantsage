import { NextResponse } from 'next/server';
import { identifyPlant, PlantInfo } from '@/app/utils/gemini';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

interface RequestBody {
  image: string;
}

interface IdentifyResponse {
  result?: PlantInfo;
  error?: string;
}

// Add CORS headers to all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Create error response helper
const createErrorResponse = (message: string, status: number = 500) => {
  return NextResponse.json(
    { error: message },
    { status, headers: corsHeaders }
  );
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

    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return createErrorResponse('Invalid content type. Expected application/json', 400);
    }

    let body: RequestBody;
    try {
      body = await request.json();
    } catch (e) {
      console.error('JSON parse error:', e);
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    const { image } = body;
    
    if (!image || typeof image !== 'string') {
      return createErrorResponse('Invalid image data', 400);
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('Missing API key');
      return createErrorResponse('Server configuration error: Missing API key', 500);
    }

    console.log('Processing image with Gemini...');
    const result = await identifyPlant(image);
    console.log('Gemini response received:', result);
    
    if (!result) {
      return createErrorResponse('No result from plant identification');
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
    return createErrorResponse(
      error instanceof Error ? error.message : 'Failed to identify plant'
    );
  }
}
