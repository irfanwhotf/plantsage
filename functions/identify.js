import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequest(context) {
  try {
    const request = context.request;
    
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return new Response(JSON.stringify({ error: 'Content-Type must be application/json' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const body = await request.json();
    const { image } = body;

    if (!image || typeof image !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid image data' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(context.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract base64 data
    const base64Data = image.includes('base64,') 
      ? image.split('base64,')[1] 
      : image;

    const prompt = `You are a plant identification expert. Analyze this image and provide detailed information about the plant in the following JSON structure. If you cannot identify the plant with certainty, please indicate that in the response:

    {
      "commonName": "Main common name",
      "scientificName": "Scientific name in italics",
      "family": "Plant family name",
      "characteristics": {
        "appearance": "Detailed description of physical appearance",
        "growthHabit": "Growth pattern and mature size",
        "toxicity": "Any toxicity information if available"
      },
      "care": {
        "light": "Light requirements",
        "water": "Watering needs",
        "soil": "Soil preferences"
      },
      "facts": ["Interesting fact 1", "Interesting fact 2"]
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from the response');
    }

    const plantInfo = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ result: plantInfo }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to identify plant' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
