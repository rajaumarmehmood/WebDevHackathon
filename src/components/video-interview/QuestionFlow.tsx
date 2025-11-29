'use client';

import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, Play } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  category: string;
}

interface QuestionFlowProps {
  questions: Question[];
  currentQuestionIndex: number;
  isListening: boolean;
  currentTranscript: string;
  onStart: () => void;
  onExit: () => void;
  started: boolean;
}

export default function QuestionFlow({
  questions,
  currentQuestionIndex,
  isListening,
  currentTranscript,
  onStart,
  onExit,
  started,
}: QuestionFlowProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-10 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-gradient-to-b from-black/95 to-black/60 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-medium text-white drop-shadow-lg">Video Interview</h1>
          {started && (
            <p className="text-sm text-white/80 mt-1 drop-shadow">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      {started && (
        <div className="px-6">
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {!started ? (
          <div className="max-w-2xl text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 shadow-xl">
              <Play className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-medium text-white drop-shadow-lg">Ready to Start?</h2>
            <p className="text-lg text-white/90 drop-shadow">
              You will be asked {questions.length} questions. Answer each question clearly.
              The interview will automatically move to the next question when you finish speaking.
            </p>
            <div className="space-y-3 text-left max-w-md mx-auto bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-start gap-3 text-sm text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                  1
                </div>
                <p>Listen to each question carefully</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                  2
                </div>
                <p>Speak your answer clearly when prompted</p>
              </div>
              <div className="flex items-start gap-3 text-sm text-white/90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                  3
                </div>
                <p>The system will automatically move to the next question</p>
              </div>
            </div>
            <Button
              onClick={onStart}
              size="lg"
              className="bg-white text-black hover:bg-neutral-200 px-8 shadow-xl font-medium"
            >
              Start Interview
            </Button>
          </div>
        ) : currentQuestion ? (
          <div className="max-w-3xl w-full space-y-8">
            {/* Question */}
            <div className="bg-black/80 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-2xl">
              <p className="text-xs uppercase tracking-wider text-white/70 mb-3 font-semibold">
                {currentQuestion.category}
              </p>
              <h2 className="text-2xl font-medium leading-relaxed text-white drop-shadow-lg">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Listening Indicator */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-black/70 backdrop-blur-xl px-6 py-4 rounded-full border border-white/30 shadow-lg">
                {isListening ? (
                  <>
                    <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-white">Listening...</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-5 h-5 text-white/60" />
                    <span className="text-sm font-medium text-white/60">Preparing...</span>
                  </>
                )}
              </div>

              {/* Live Transcript */}
              {currentTranscript && (
                <div className="bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/30 min-h-[100px] shadow-xl">
                  <p className="text-sm text-white/70 mb-2 font-medium">Your answer:</p>
                  <p className="text-base leading-relaxed text-white">{currentTranscript}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      {started && (
        <div className="p-6 bg-gradient-to-t from-black/95 to-black/60 backdrop-blur-sm">
          <p className="text-center text-sm text-white/80 drop-shadow">
            Speak clearly and naturally. The system is listening.
          </p>
        </div>
      )}
    </div>
  );
}
