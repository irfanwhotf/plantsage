# Plant Identifier

A modern web application that uses AI to identify plants and provide detailed information about them.

## Features

- Upload plant images through an intuitive interface
- Get detailed plant information including:
  - Common name
  - Scientific name
  - Plant family
  - Key characteristics
  - Care requirements
  - Interesting facts
- Beautiful, responsive design
- Real-time AI-powered plant identification

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your Google API key:
```
GOOGLE_API_KEY=your_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Google's Gemini AI API

## Note

You'll need to obtain a Google API key with access to the Gemini API to use the plant identification feature.
