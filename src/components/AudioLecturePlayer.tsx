'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';

interface AudioLecturePlayerProps {
  prepMaterial: any;
}

export default function AudioLecturePlayer({ prepMaterial }: AudioLecturePlayerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(128));
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const generateLectureText = () => {
    let text = `Interview Preparation for ${prepMaterial.role}.\n\n`;
    
    // Role Insights
    text += `Role Overview: ${prepMaterial.material.companyInsights.culture}\n\n`;
    text += `Key Technologies: ${prepMaterial.material.companyInsights.techStack.join(', ')}.\n\n`;
    text += `Interview Process: ${prepMaterial.material.companyInsights.interviewProcess}\n\n`;
    
    // Preparation Tips
    text += `Preparation Tips:\n`;
    prepMaterial.material.companyInsights.tips.forEach((tip: string, i: number) => {
      text += `Tip ${i + 1}: ${tip}\n`;
    });
    text += '\n';
    
    // Technical Questions (first 3)
    text += `Technical Questions:\n`;
    prepMaterial.material.technicalQuestions.slice(0, 3).forEach((q: any, i: number) => {
      text += `Question ${i + 1}: ${q.question}\n`;
      text += `Difficulty: ${q.difficulty}. Category: ${q.category}.\n`;
      text += `Answer: ${q.answer}\n\n`;
    });
    
    // Behavioral Questions (first 2)
    text += `Behavioral Questions:\n`;
    prepMaterial.material.behavioralQuestions.slice(0, 2).forEach((q: any, i: number) => {
      text += `Question ${i + 1}: ${q.question}\n`;
      text += `Framework: ${q.framework}.\n\n`;
    });
    
    // Study Guide (first 3)
    text += `Study Guide:\n`;
    prepMaterial.material.studyGuide.slice(0, 3).forEach((item: any, i: number) => {
      text += `Topic ${i + 1}: ${item.topic}. Priority: ${item.priority}. Estimated time: ${item.timeEstimate}.\n`;
    });
    
    return text;
  };

  const generateAudioLecture = async () => {
    setIsGenerating(true);
    
    try {
      const lectureText = generateLectureText();
      
      // Use Web Speech API for TTS
      if ('speechSynthesis' in window) {
        // Wait for voices to load if they haven't already
        let voices = speechSynthesis.getVoices();
        
        if (voices.length === 0) {
          // Wait for voices to load
          await new Promise<void>((resolve) => {
            speechSynthesis.onvoiceschanged = () => {
              voices = speechSynthesis.getVoices();
              resolve();
            };
            // Timeout after 2 seconds
            setTimeout(resolve, 2000);
          });
        }
        
        const utterance = new SpeechSynthesisUtterance(lectureText);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Get available voices
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && (voice.name.includes('Google') || voice.name.includes('Natural'))
        ) || voices.find(voice => voice.lang.startsWith('en'));
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        // Create audio context for visualization
        setupAudioVisualization();
        
        // Set audioUrl to indicate audio is ready (even though we're using Web Speech API)
        setAudioUrl('speech-synthesis-active');
        
        // For now, we'll use the Web Speech API directly
        // In production, you'd want to use a proper TTS API that returns audio files
        speechSynthesis.speak(utterance);
        
        utterance.onstart = () => {
          setIsPlaying(true);
          setIsGenerating(false);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
        };
        
        utterance.onerror = (error) => {
          console.error('Speech synthesis error:', error);
          setIsGenerating(false);
          setAudioUrl(null);
          alert('Failed to generate audio. Please try again.');
        };
        
        // Store utterance reference for pause/resume
        (window as any).currentUtterance = utterance;
        
      } else {
        alert('Text-to-speech is not supported in your browser.');
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio lecture');
      setIsGenerating(false);
    }
  };

  const setupAudioVisualization = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        // Create oscillator for visualization (since Web Speech API doesn't provide audio stream)
        const oscillator = audioContextRef.current.createOscillator();
        oscillator.connect(analyserRef.current);
        oscillator.start();
        
        visualize();
      }
    } catch (error) {
      console.error('Error setting up audio visualization:', error);
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray));
      }
    };
    
    draw();
  };

  const togglePlayPause = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        speechSynthesis.pause();
        setIsPlaying(false);
      } else {
        if (speechSynthesis.paused) {
          speechSynthesis.resume();
        }
        setIsPlaying(true);
      }
    }
  };

  const regenerateAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setAudioUrl(null);
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      
      // Reset audio data
      setAudioData(new Uint8Array(128));
    }
    
    // Generate new audio
    generateAudioLecture();
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
      setAudioUrl(null);
      
      // Stop visualization
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      
      // Close audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
      
      // Reset audio data
      setAudioData(new Uint8Array(128));
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900/30 dark:to-neutral-800/30 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
        <Volume2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
        <div>
          <h2 className="text-xl font-medium text-black dark:text-white">Audio Lecture</h2>
          <p className="text-sm text-neutral-500">Listen to your interview prep material</p>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        {!audioUrl && !isPlaying && !isGenerating && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
              <Volume2 className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
              Generate Audio Lecture
            </h3>
            <p className="text-sm text-neutral-500 mb-6">
              Convert your interview prep material into an audio lecture
            </p>
            <Button
              onClick={generateAudioLecture}
              className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-black"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Generate Audio Lecture
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-600 dark:text-neutral-400 mx-auto mb-4" />
            <p className="text-sm text-neutral-500">Generating audio lecture...</p>
          </div>
        )}

        {(isPlaying || (audioUrl && !isGenerating)) && (
          <>
            {/* Audio Visualizer */}
            <div className="relative h-32 bg-white dark:bg-black rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <div className="absolute inset-0 flex items-center justify-center gap-1 px-4">
                {Array.from({ length: 64 }).map((_, i) => {
                  const value = audioData[i * 2] || 0;
                  const height = isPlaying ? (value / 255) * 100 : 20;
                  
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-neutral-600 to-neutral-400 dark:from-neutral-400 dark:to-neutral-600 rounded-full transition-all duration-75"
                      style={{
                        height: `${Math.max(height, 10)}%`,
                        opacity: isPlaying ? 0.8 : 0.3,
                      }}
                    />
                  );
                })}
              </div>
              
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5">
                  <Play className="w-12 h-12 text-neutral-400" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={regenerateAudio}
                className="h-12 w-12"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              
              <Button
                size="icon"
                onClick={togglePlayPause}
                className="h-14 w-14 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-black"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={stopAudio}
                className="h-12 w-12"
              >
                <div className="w-4 h-4 bg-current" />
              </Button>
            </div>

            {/* Info */}
            <div className="text-center">
              <p className="text-xs text-neutral-500">
                {isPlaying ? 'Playing audio lecture...' : 'Audio lecture ready'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
