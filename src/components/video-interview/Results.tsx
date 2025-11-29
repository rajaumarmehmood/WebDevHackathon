'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, RotateCcw, Home } from 'lucide-react';

interface Response {
  question: string;
  answer: string;
  timestamp: Date;
  category: string;
}

interface ResultsProps {
  responses: Response[];
  onExit: () => void;
  onRetry: () => void;
}

export default function Results({ responses, onExit, onRetry }: ResultsProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-black text-white p-6">
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-light">Interview Completed!</h1>
          <p className="text-lg text-neutral-400">
            You answered {responses.length} questions. Here's your interview summary.
          </p>
        </div>

        {/* Responses */}
        <div className="space-y-6">
          {responses.map((response, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full">
                      Question {index + 1}
                    </span>
                    <span className="text-xs text-neutral-400 uppercase">
                      {response.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium mb-3">{response.question}</h3>
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(response.timestamp).toLocaleTimeString()}
                </span>
              </div>

              <div className="pl-4 border-l-2 border-white/20">
                <p className="text-sm text-neutral-400 mb-1">Your Answer:</p>
                <p className="text-base leading-relaxed text-neutral-200">
                  {response.answer || 'No answer recorded'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <Button
            onClick={onRetry}
            variant="outline"
            className="gap-2 border-white/20 hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Interview
          </Button>
          <Button
            onClick={onExit}
            className="gap-2 bg-white text-black hover:bg-neutral-200"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
