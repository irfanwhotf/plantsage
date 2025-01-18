'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlantInfo } from './utils/gemini';

// API endpoint based on environment
const API_ENDPOINT = '/api/identify';

interface IdentifyResponse {
  result: PlantInfo;
  error?: string;
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IdentifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setError(null);
      setIsLoading(true);
      setResults(null);

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });

      // Set preview image
      setSelectedImage(base64);

      // Send base64 image to API
      console.log('Sending request to:', API_ENDPOINT);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify plant');
      }

      if (!data.result) {
        throw new Error('No plant identification data received');
      }

      setResults(data);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const resetState = () => {
    setSelectedImage(null);
    setResults(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4 font-serif">
            🌿 Plant Sage
          </h1>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Discover the secrets of nature! Upload any plant photo and let our AI reveal its identity and fascinating details.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Upload Your Plant</h2>
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              id="fileInput"
            />
            <input
              type="file"
              ref={cameraInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              capture="environment"
              className="hidden"
              id="cameraInput"
            />

            <div
              className={cn(
                "bg-white rounded-2xl shadow-lg p-8 border-2 border-dashed transition-all duration-200",
                selectedImage ? "border-emerald-500" : "border-gray-300",
                !selectedImage && "hover:border-emerald-400"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {!selectedImage ? (
                <div className="text-center">
                  <div className="mb-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Upload Your Plant Photo
                    </h3>
                    <p className="text-gray-500 mb-8">
                      Drag and drop your image here, or choose an option below
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      {/* Upload Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose File
                      </button>

                      {/* Camera Button */}
                      <button
                        onClick={() => cameraInputRef.current?.click()}
                        className="inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors duration-200 shadow-sm hover:shadow-md"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take Photo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="max-h-96 mx-auto rounded-lg"
                  />
                  <button
                    onClick={resetState}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {error}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing your plant...
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className={cn(
            "bg-white rounded-2xl shadow-lg p-6 border border-emerald-100",
            "transition-all duration-300",
            results ? "opacity-100" : "opacity-50"
          )}>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">Plant Details</h2>
            {error ? (
              <div className="p-4 rounded-lg bg-red-50 text-red-600">
                {error}
              </div>
            ) : results ? (
              <div className="space-y-6">
                {/* Plant Name and Basic Info */}
                <div className="border-b pb-4">
                  <h3 className="text-2xl font-semibold text-emerald-800 mb-1">
                    {results.result.commonName}
                  </h3>
                  <p className="text-gray-600">
                    <span className="italic">{results.result.scientificName}</span>
                    <span className="mx-2">•</span>
                    <span>{results.result.family}</span>
                  </p>
                </div>

                {/* Characteristics */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-700 mb-3">Characteristics</h4>
                  <div className="grid gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="font-medium text-emerald-800 mb-1">Appearance</p>
                      <p className="text-gray-600">{results.result.characteristics.appearance}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <p className="font-medium text-emerald-800 mb-1">Growth Habit</p>
                      <p className="text-gray-600">{results.result.characteristics.growthHabit}</p>
                    </div>
                    {results.result.characteristics.toxicity && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="font-medium text-red-800 mb-1">Toxicity Warning</p>
                        <p className="text-red-600">{results.result.characteristics.toxicity}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Care Requirements */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-700 mb-3">Care Guide</h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 bg-emerald-50 text-sm font-medium text-emerald-800 w-24">Light</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{results.result.care.light}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-emerald-50 text-sm font-medium text-emerald-800">Water</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{results.result.care.water}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-emerald-50 text-sm font-medium text-emerald-800">Soil</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{results.result.care.soil}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interesting Facts */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-700 mb-3">Fun Facts</h4>
                  <ul className="space-y-2">
                    {results.result.facts.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-emerald-500 mt-1">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p>Upload a plant image to see detailed information</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Instant Identification</h3>
            <p className="text-gray-600">Advanced AI technology identifies your plants in seconds with high accuracy.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Detailed Information</h3>
            <p className="text-gray-600">Get comprehensive care guides and interesting facts about your plants.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-emerald-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Easy to Use</h3>
            <p className="text-gray-600">Simple upload process and intuitive interface for the best user experience.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
