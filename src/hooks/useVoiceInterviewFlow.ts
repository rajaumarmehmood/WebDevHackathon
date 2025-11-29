'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Question {
  id: string;
  question: string;
  category: string;
}

interface Response {
  question: string;
  answer: string;
  timestamp: Date;
  category: string;
}

export function useVoiceInterviewFlow(category: string, prepId?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingRef = useRef(false);

  // Fetch questions from prep material or API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let url = `/api/interview/questions?category=${category}`;
        if (prepId) {
          url += `&prepId=${prepId}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [category, prepId]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setCurrentTranscript(prev => {
            const newTranscript = prev + finalTranscript;
            return newTranscript || interimTranscript;
          });

          // Reset silence timer on speech
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
          }

          // Set new silence timer (3 seconds of silence = answer complete)
          silenceTimerRef.current = setTimeout(() => {
            if (!isProcessingRef.current && currentTranscript.trim()) {
              moveToNextQuestion();
            }
          }, 3000);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  const speakQuestion = useCallback((questionText: string) => {
    return new Promise<void>((resolve) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(questionText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Get available voices
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.startsWith('en'));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          // Wait 1.5 seconds after speaking before starting to listen
          setTimeout(() => resolve(), 1500);
        };

        utterance.onerror = () => {
          resolve();
        };

        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [isListening]);

  const moveToNextQuestion = useCallback(async () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // Stop listening
    stopListening();

    // Save current response
    if (currentQuestionIndex >= 0 && currentTranscript.trim()) {
      const currentQuestion = questions[currentQuestionIndex];
      setResponses(prev => [...prev, {
        question: currentQuestion.question,
        answer: currentTranscript.trim(),
        timestamp: new Date(),
        category: currentQuestion.category,
      }]);
    }

    // Clear transcript
    setCurrentTranscript('');

    // Check if there are more questions
    if (currentQuestionIndex + 1 < questions.length) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      // Speak next question
      await speakQuestion(questions[nextIndex].question);

      // Start listening
      startListening();
      isProcessingRef.current = false;
    } else {
      // Interview completed
      await speakQuestion('Interview completed! Thank you for your time.');
      setInterviewCompleted(true);
      isProcessingRef.current = false;
    }
  }, [currentQuestionIndex, currentTranscript, questions, speakQuestion, startListening, stopListening]);

  const startInterview = useCallback(async () => {
    if (questions.length === 0) return;

    setCurrentQuestionIndex(0);
    setCurrentTranscript('');
    setResponses([]);

    // Speak first question
    await speakQuestion(questions[0].question);

    // Start listening
    startListening();
  }, [questions, speakQuestion, startListening]);

  const stopInterview = useCallback(() => {
    stopListening();
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }, [stopListening]);

  return {
    questions,
    currentQuestionIndex,
    responses,
    isLoading,
    isListening,
    currentTranscript,
    interviewCompleted,
    startInterview,
    stopInterview,
  };
}
