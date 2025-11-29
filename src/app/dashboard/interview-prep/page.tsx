'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Brain, Loader2, Sparkles, BookOpen, Code, MessageSquare, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import { InterviewPrep } from '@/lib/types';
import gsap from 'gsap';

export default function InterviewPrepPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [generating, setGenerating] = useState(false);
  const [prepMaterial, setPrepMaterial] = useState<InterviewPrep | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['technical']));

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Pre-fill form from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      const techParam = params.get('technologies');
      
      if (roleParam) setRole(roleParam);
      if (techParam) setTechnologies(techParam);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!user) return;
    
    setGenerating(true);
    setStep(2);
    
    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(t => t);
      
      const response = await fetch('/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          role,
          technologies: techArray,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prep material');
      }

      setPrepMaterial(data.data);
      setStep(3);
    } catch (error: any) {
      console.error('Error generating prep:', error);
      alert(error.message || 'Failed to generate interview prep');
      setStep(1);
    } finally {
      setGenerating(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      <GridPattern />
      
      <DashboardSidebar user={user} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="text-sm font-medium text-black dark:text-white">CareerAI</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-8">
        {step === 1 && (
          <>
            {/* Title */}
            <div className="fade-item text-center">
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
                AI Interview Preparation
              </h1>
              <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                Get personalized, research-backed interview questions and study guides tailored to your target role
              </p>
            </div>

            {/* Form */}
            <div className="fade-item max-w-2xl mx-auto">
              <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Position</Label>
                  <Input
                    id="role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g., Frontend Developer, Full Stack Engineer"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologies">Key Technologies (comma-separated)</Label>
                  <Input
                    id="technologies"
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    placeholder="e.g., React, Node.js, TypeScript, AWS"
                    className="h-12"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!role || !technologies || generating}
                  className="w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Prep Material
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="fade-item grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Code, title: 'Technical Questions', desc: 'Role-specific coding challenges' },
                { icon: MessageSquare, title: 'Behavioral Prep', desc: 'STAR method examples' },
                { icon: BookOpen, title: 'Study Guide', desc: 'Curated learning resources' },
                { icon: Brain, title: 'Role Insights', desc: 'General interview tips' },
              ].map((feature) => (
                <div key={feature.title} className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl mb-3">
                    <feature.icon className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <h3 className="text-sm font-medium text-black dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="fade-item max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-black dark:bg-white rounded-full">
              <Brain className="w-10 h-10 text-white dark:text-black animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-light text-black dark:text-white mb-4">
                AI is researching...
              </h2>
              <p className="text-neutral-500 mb-8">
                Analyzing {role} requirements and {technologies} best practices
              </p>
              <div className="space-y-3">
                {[
                  'Searching latest interview trends',
                  'Analyzing technology requirements',
                  'Identifying common pitfalls',
                  'Generating personalized questions',
                  'Curating study resources',
                ].map((task, i) => (
                  <div key={task} className="flex items-center justify-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && prepMaterial && (
          <div className="fade-item space-y-6">
            {/* Success Banner */}
            <div className="p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-2xl flex items-center gap-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="text-lg font-medium text-green-900 dark:text-green-100">Prep Material Ready!</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Personalized for {prepMaterial.role} position
                </p>
              </div>
            </div>

            {/* Role Insights */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-xl font-medium text-black dark:text-white">Role Insights</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Overview</p>
                  <p className="text-neutral-700 dark:text-neutral-300">{prepMaterial.material.companyInsights.culture}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Key Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {prepMaterial.material.companyInsights.techStack.map((tech: string) => (
                      <span key={tech} className="px-3 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Typical Interview Process</p>
                  <p className="text-neutral-700 dark:text-neutral-300">{prepMaterial.material.companyInsights.interviewProcess}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Preparation Tips</p>
                  <ul className="space-y-2">
                    {prepMaterial.material.companyInsights.tips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="text-green-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Questions */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('technical')}
                className="w-full p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-xl font-medium text-black dark:text-white">Technical Questions</h2>
                  <span className="text-sm text-neutral-500">({prepMaterial.material.technicalQuestions.length})</span>
                </div>
                {expandedSections.has('technical') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('technical') && (
                <div className="p-6 space-y-4">
                  {prepMaterial.material.technicalQuestions.map((q: any, i: number) => (
                    <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-medium text-black dark:text-white flex-1">{q.question}</p>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          q.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400' :
                          q.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400' :
                          'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                        }`}>
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded">
                          {q.category}
                        </span>
                      </div>
                      <details className="text-sm">
                        <summary className="cursor-pointer text-neutral-500 hover:text-black dark:hover:text-white">
                          View hints & answer
                        </summary>
                        <div className="mt-3 space-y-2 pl-4 border-l-2 border-neutral-200 dark:border-neutral-800">
                          <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Hints</p>
                            <ul className="space-y-1">
                              {q.hints.map((hint: string, j: number) => (
                                <li key={j} className="text-neutral-600 dark:text-neutral-400">• {hint}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Answer</p>
                            <p className="text-neutral-700 dark:text-neutral-300">{q.answer}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Behavioral Questions */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('behavioral')}
                className="w-full p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-xl font-medium text-black dark:text-white">Behavioral Questions</h2>
                  <span className="text-sm text-neutral-500">({prepMaterial.material.behavioralQuestions.length})</span>
                </div>
                {expandedSections.has('behavioral') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('behavioral') && (
                <div className="p-6 space-y-4">
                  {prepMaterial.material.behavioralQuestions.map((q: any, i: number) => (
                    <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                      <p className="font-medium text-black dark:text-white">{q.question}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded">
                          {q.category}
                        </span>
                        <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded">
                          {q.framework}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Tips</p>
                        <ul className="space-y-1">
                          {q.tips.map((tip: string, j: number) => (
                            <li key={j} className="text-sm text-neutral-600 dark:text-neutral-400">• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Study Guide */}
            <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleSection('study')}
                className="w-full p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-xl font-medium text-black dark:text-white">Study Guide</h2>
                  <span className="text-sm text-neutral-500">({prepMaterial.material.studyGuide.length} topics)</span>
                </div>
                {expandedSections.has('study') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {expandedSections.has('study') && (
                <div className="p-6 space-y-4">
                  {prepMaterial.material.studyGuide.map((item: any, i: number) => (
                    <div key={i} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-medium text-black dark:text-white">{item.topic}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                          item.priority === 'High' ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' :
                          'bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500">Est. Time: {item.timeEstimate}</p>
                      <div>
                        <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">Resources</p>
                        <ul className="space-y-1">
                          {item.resources.map((resource: string, j: number) => (
                            <li key={j} className="text-sm text-neutral-600 dark:text-neutral-400">• {resource}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setPrepMaterial(null);
                  setRole('');
                  setTechnologies('');
                }}
              >
                New Prep Session
              </Button>
            </div>
          </div>
        )}
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
