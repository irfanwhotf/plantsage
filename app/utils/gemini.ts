import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with error handling
const initializeAPI = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY environment variable");
  }
  return new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
};

export interface PlantInfo {
  commonName: string;
  scientificName: string;
  family: string;
  characteristics: {
    appearance: string;
    growthHabit: string;
    toxicity: string;
  };
  care: {
    light: string;
    water: string;
    soil: string;
  };
  facts: string[];
}

export async function identifyPlant(imageBase64: string): Promise<PlantInfo> {
  try {
    if (!imageBase64) {
      throw new Error("No image data provided");
    }

    const genAI = initializeAPI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract the base64 data from the Data URL if it exists
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    // Validate base64 data
    try {
      Buffer.from(base64Data, 'base64');
    } catch (error) {
      throw new Error('Invalid base64 image data');
    }

    const prompt = `Identify this plant and provide information in JSON format:
{
  "commonName": "Common name",
  "scientificName": "Scientific name",
  "family": "Family name",
  "characteristics": {
    "appearance": "Brief appearance",
    "growthHabit": "Growth pattern",
    "toxicity": "Toxicity info"
  },
  "care": {
    "light": "Light needs",
    "water": "Water needs",
    "soil": "Soil type"
  },
  "facts": ["Fact 1", "Fact 2"]
}`;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ]);

    console.log('Received response from Gemini API');

    if (!result || !result.response) {
      throw new Error('No response received from Gemini API');
    }

    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    console.log('Processing Gemini response:', text);

    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from the response');
      }

      const plantInfo = JSON.parse(jsonMatch[0]) as PlantInfo;
      
      // Validate the response structure
      if (!plantInfo.commonName || !plantInfo.scientificName) {
        throw new Error('Could not identify the plant in the image');
      }

      // Ensure all required fields are present
      const validatePlantInfo = (info: PlantInfo): boolean => {
        return !!(
          info.commonName &&
          info.scientificName &&
          info.family &&
          info.characteristics?.appearance &&
          info.characteristics?.growthHabit &&
          info.characteristics?.toxicity &&
          info.care?.light &&
          info.care?.water &&
          info.care?.soil &&
          Array.isArray(info.facts)
        );
      };

      if (!validatePlantInfo(plantInfo)) {
        throw new Error('Incomplete plant information received');
      }

      return plantInfo;
    } catch (parseError) {
      console.error('Parse error:', parseError);
      throw new Error('Could not process the plant identification response');
    }
  } catch (error) {
    console.error('Error in identifyPlant:', error);
    if (error instanceof Error) {
      if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('API key is invalid or has insufficient permissions');
      } else if (error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API quota exceeded. Please try again later');
      } else if (error.message.includes('404')) {
        throw new Error('Model not available. Please check if your API key has access to the latest models');
      }
      throw error;
    }
    throw new Error('Failed to process image with AI model');
  }
}
