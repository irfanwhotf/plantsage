'use client';

import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

interface FeedbackButtonProps {
  plantName?: string;
}

export default function FeedbackButton({ plantName }: FeedbackButtonProps) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-4 right-4 inline-flex items-center px-3 py-2 md:px-4 md:py-2 border border-transparent text-xs md:text-sm font-medium rounded-full md:rounded-md shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 md:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span className="hidden md:inline">Feedback</span>
      </button>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        closeModal={() => setIsFeedbackOpen(false)}
        plantName={plantName}
      />
    </>
  );
}
