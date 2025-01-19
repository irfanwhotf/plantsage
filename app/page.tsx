'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PlantInfo } from './utils/gemini';
import FeedbackButton from '@/components/FeedbackButton';
import { useAnalytics } from '@/hooks/useAnalytics';

// API endpoint based on environment
const API_ENDPOINT = typeof window !== 'undefined'
  ? `${window.location.origin}/api/identify`
  : '/api/identify';

interface IdentifyResponse {
  result: PlantInfo;
  error?: string;
}

export default function Home() {
  const { trackEvent } = useAnalytics();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAIExplanationOpen, setIsAIExplanationOpen] = useState(false);
  const [expandedTips, setExpandedTips] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    try {
      setError(null);
      setLoading(true);
      setResult(null);

      // Track upload attempt
      trackEvent('upload_image', 'identification', 'start');

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
      setSelectedImage(file);
      setPreview(base64);

      // Send base64 image to API
      console.log('Sending request to:', API_ENDPOINT);
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        throw new Error('Invalid response from server. Please try again.');
      }

      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to identify plant');
      }

      if (!data.result) {
        throw new Error('No plant identification data received');
      }

      setResult(data.result);

      // Track successful identification
      trackEvent('plant_identified', 'identification', 'success', data.result.commonName);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResult(null);

      // Track error
      trackEvent('identification_error', 'identification', 'error', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const resetState = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const toggleTip = (tipId: string) => {
    trackEvent('toggle_tip', 'interaction', tipId);
    setExpandedTips(prev => 
      prev.includes(tipId) 
        ? prev.filter(id => id !== tipId)
        : [...prev, tipId]
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleCameraClick = () => {
    trackEvent('camera_click', 'interaction', 'camera');
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    trackEvent('upload_click', 'interaction', 'upload');
    fileInputRef.current?.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 md:mb-6">
            Welcome to Plant Sage
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your intelligent companion for instant plant identification and detailed information.
            Simply upload a photo or take a picture to get started.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-start">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            {/* Hidden File Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
            />
            <input
              type="file"
              ref={cameraInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
            />

            <h2 className="section-title">Upload Your Plant</h2>
            <div className="space-y-4">
              {!selectedImage ? (
                <div
                  className="upload-zone p-8 text-center"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="max-w-sm mx-auto">
                    <div className="mb-6">
                      <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 animate-glow">
                        <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 font-medium mb-2">Drag and drop your image here</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">or choose an option below</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={handleUploadClick}
                        className="button"
                        type="button"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Choose File
                      </button>
                      
                      <button
                        onClick={handleCameraClick}
                        className="button bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500"
                        type="button"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 014 4H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
                    src={preview}
                    alt="Selected plant"
                    className="max-h-96 mx-auto rounded-lg"
                  />
                  <button
                    onClick={resetState}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 text-red-200">
                  {error}
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your plant...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Plant Details</h2>
            {error ? (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200">
                {error}
              </div>
            ) : result ? (
              <div className="space-y-6">
                {/* Plant Name and Basic Info */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 mb-2">
                    {result.commonName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    <span className="italic">{result.scientificName}</span>
                    <span className="mx-2">•</span>
                    <span>{result.family}</span>
                  </p>
                </div>

                {/* Characteristics */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-3">Characteristics</h4>
                  <div className="grid gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-1">Appearance</p>
                      <p className="text-gray-600 dark:text-gray-300">{result.characteristics?.appearance}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-1">Growth Habit</p>
                      <p className="text-gray-600 dark:text-gray-300">{result.characteristics?.growthHabit}</p>
                    </div>
                    {result.characteristics?.toxicity && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="font-medium text-red-600 dark:text-red-400 mb-1">Toxicity Warning</p>
                        <p className="text-red-600 dark:text-red-300">{result.characteristics.toxicity}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Care Requirements */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-3">Care Guide</h4>
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium text-emerald-600 dark:text-emerald-400 w-24">Light</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{result.care?.light}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium text-emerald-600 dark:text-emerald-400">Water</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{result.care?.water}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-medium text-emerald-600 dark:text-emerald-400">Soil</td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{result.care?.soil}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Interesting Facts */}
                <div>
                  <h4 className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-3">Fun Facts</h4>
                  <ul className="space-y-2">
                    {result.facts?.map((fact, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                        <span className="text-emerald-500 dark:text-emerald-400 mt-1">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plant Care Tips */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-emerald-600 dark:text-emerald-400 mb-3">Plant Care Tips</h3>
                  <div className="space-y-3">
                    {result.plantCareTips?.map((tip, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                        <button
                          onClick={() => toggleTip(`tip-${index}`)}
                          className="w-full flex justify-between items-center p-4 text-left"
                        >
                          <span className="font-medium text-gray-700 dark:text-gray-300">{tip.title}</span>
                          <svg
                            className={`w-5 h-5 transform transition-transform ${
                              expandedTips.includes(`tip-${index}`) ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {expandedTips.includes(`tip-${index}`) && (
                          <div className="px-4 pb-4">
                            <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Explanation Section */}
                {isAIExplanationOpen && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How PlantSage Works</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      PlantSage uses advanced artificial intelligence and machine learning algorithms to analyze your plant photos. 
                      Our system has been trained on millions of plant images to accurately identify species and provide tailored care recommendations. 
                      The AI considers various factors such as leaf shape, color patterns, flower characteristics, and overall plant structure to make its determinations.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p>Upload a plant image to see detailed information</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Instant Identification</h3>
            <p className="text-gray-600 dark:text-gray-300">Advanced AI technology identifies your plants in seconds with high accuracy.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Detailed Information</h3>
            <p className="text-gray-600 dark:text-gray-300">Get comprehensive care guides and interesting facts about your plants.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Smart Features</h3>
            <p className="text-gray-600 dark:text-gray-300">Experience intelligent plant analysis with our advanced features.</p>
          </div>
        </div>
      </div>
      <FeedbackButton plantName={result?.commonName} />
    </main>
  );
}
