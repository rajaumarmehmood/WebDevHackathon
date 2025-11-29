'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Sparkles, FileText, Search, Brain, TrendingUp, Target, Zap, Check } from 'lucide-react';
import { FloatingShapes, GridPattern, MarqueeText } from '@/components/Doodles';
import gsap from 'gsap';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.hero-word', { y: 100, opacity: 0, rotateX: -40 });
      gsap.set('.fade-up', { y: 40, opacity: 0 });
      gsap.set('.scale-in', { scale: 0.8, opacity: 0 });
      gsap.set('.line-grow', { scaleX: 0, transformOrigin: 'left' });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to('.hero-word', { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15 })
        .to('.line-grow', { scaleX: 1, duration: 1 }, '-=0.6')
        .to('.fade-up', { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, '-=0.8')
        .to('.scale-in', { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 }, '-=0.5');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  const stats = [
    { value: '50K+', label: 'Jobs Discovered' },
    { value: '95%', label: 'Match Accuracy' },
    { value: '10K+', label: 'Students Helped' },
    { value: '500+', label: 'Companies' },
  ];

  const features = [
    { icon: FileText, title: 'Smart Resume Analysis', desc: 'Upload your resume and let AI extract skills, experience, and build your comprehensive profile automatically.' },
    { icon: Search, title: 'Auto Job Discovery', desc: 'AI scrapes and filters thousands of jobs across the internet, ranking them by relevance to your unique profile.' },
    { icon: Brain, title: 'AI Interview Prep', desc: 'Get personalized, research-backed interview questions and study guides tailored to specific roles and technologies.' },
    { icon: TrendingUp, title: 'Career Analytics', desc: 'Track your job search progress, identify skill gaps, and get actionable insights to improve your chances.' },
  ];

  const testimonials = [
    { name: 'Alex Kumar', role: 'CS Student, MIT', text: 'Found my dream internship in 2 weeks. The interview prep was spot-on!' },
    { name: 'Sarah Chen', role: 'New Grad, Stanford', text: 'The AI understood my skills better than I did. Got 3 offers!' },
    { name: 'Marcus Johnson', role: 'Bootcamp Grad', text: 'This platform made job hunting actually enjoyable. Highly recommend!' },
  ];


  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black overflow-hidden relative">
      <GridPattern />
      <FloatingShapes />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="fade-up flex items-center gap-3">
            <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="text-lg font-medium text-black dark:text-white">CareerAI</span>
          </div>
          <div className="fade-up hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Docs', 'Blog'].map((item) => (
              <a key={item} href="#" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white animated-underline transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="fade-up flex items-center gap-3">
            <a href="/login" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
              Sign in
            </a>
            <Button onClick={() => router.push('/signup')} className="h-9 px-4 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full text-sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center px-6 lg:px-8 pt-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="fade-up inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 rounded-full text-sm mb-8">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-neutral-600 dark:text-neutral-400">AI-Powered Job Discovery</span>
              <ArrowRight className="w-3 h-3 text-neutral-400" />
            </div>

            {/* Hero Text */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-8" style={{ perspective: '1000px' }}>
              <span className="hero-word inline-block text-black dark:text-white">Land your</span><br />
              <span className="hero-word inline-block text-black dark:text-white">dream</span>{' '}
              <span className="hero-word inline-block text-neutral-400">tech</span><br />
              <span className="hero-word inline-block text-neutral-400">job with</span>{' '}
              <span className="hero-word inline-block text-black dark:text-white">AI.</span>
            </h1>

            <div className="line-grow h-px bg-gradient-to-r from-black via-neutral-400 to-transparent dark:from-white dark:via-neutral-600 w-64 mb-8" />

            <p className="fade-up text-xl text-neutral-500 max-w-xl leading-relaxed mb-10">
              Upload your resume, discover perfectly matched jobs, and ace interviews with AI-powered personalized prep. Your career journey, simplified.
            </p>

            {/* CTA Buttons */}
            <div className="fade-up flex flex-col sm:flex-row gap-4 mb-16">
              <Button 
                onClick={() => router.push('/signup')}
                className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-full text-base font-medium group"
              >
                Start for free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                className="h-14 px-8 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full text-base font-medium"
              >
                View Demo
              </Button>
            </div>


            {/* Stats */}
            <div className="fade-up flex flex-wrap gap-8 lg:gap-12">
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  <div>
                    <p className="text-2xl lg:text-3xl font-light text-black dark:text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                  </div>
                  {i < stats.length - 1 && <div className="hidden sm:block h-10 w-px bg-neutral-200 dark:bg-neutral-800" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-y border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <MarqueeText 
          text="✦ Resume Analysis ✦ Job Discovery ✦ AI Interview Prep ✦ Career Analytics ✦ Skill Matching ✦ Personalized Questions" 
          className="text-sm text-neutral-400 font-mono"
        />
      </div>

      {/* Features Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="fade-up text-sm font-mono tracking-widest text-neutral-400 uppercase mb-4">Features</p>
            <h2 className="fade-up text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
              Your AI career assistant
            </h2>
            <p className="fade-up text-lg text-neutral-500 max-w-xl mx-auto">
              From resume upload to job offer. We handle the heavy lifting so you can focus on what matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div 
                key={feature.title} 
                className="scale-in p-8 border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white transition-colors">
                    <feature.icon className="w-6 h-6 text-neutral-600 dark:text-neutral-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-medium text-black dark:text-white">{feature.title}</h3>
                      <span className="text-xs font-mono text-neutral-400">0{i + 1}</span>
                    </div>
                    <p className="text-neutral-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="fade-up text-sm font-mono tracking-widest text-neutral-400 uppercase mb-4">Testimonials</p>
            <h2 className="fade-up text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white">
              Success stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="scale-in p-8 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Target key={i} className="w-4 h-4 fill-black dark:fill-white text-black dark:text-white" />
                  ))}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-black dark:text-white">{t.name}</p>
                    <p className="text-xs text-neutral-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="fade-up text-sm font-mono tracking-widest text-neutral-400 uppercase mb-4">How It Works</p>
            <h2 className="fade-up text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
              Three simple steps
            </h2>
            <p className="fade-up text-lg text-neutral-500 max-w-xl mx-auto">
              From resume to interview prep in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Resume', desc: 'Drop your PDF resume and let AI analyze your skills, experience, and expertise areas.' },
              { step: '02', title: 'Discover Jobs', desc: 'AI automatically finds and ranks relevant opportunities from across the internet.' },
              { step: '03', title: 'Prep & Apply', desc: 'Get personalized interview questions and study guides for each role you target.' },
            ].map((item) => (
              <div key={item.step} className="scale-in text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full text-2xl font-light mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-medium text-black dark:text-white mb-3">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="relative p-12 lg:p-20 bg-black dark:bg-white rounded-3xl overflow-hidden">
            {/* Doodle decorations */}
            <svg className="absolute top-8 right-8 w-16 h-16 text-white/10 dark:text-black/10" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
            </svg>
            <svg className="absolute bottom-8 left-8 w-12 h-12 text-white/10 dark:text-black/10" viewBox="0 0 100 100">
              <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl lg:text-6xl font-light tracking-tight text-white dark:text-black mb-6">
                Ready to land your dream job?
              </h2>
              <p className="text-lg text-neutral-400 dark:text-neutral-600 mb-10 max-w-xl mx-auto">
                Join thousands of students who found their perfect role with AI-powered career guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/signup')}
                  className="h-14 px-10 bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-full text-base font-medium group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  className="h-14 px-10 border-white/30 dark:border-black/30 text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 rounded-full text-base font-medium"
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white dark:text-black" />
                </div>
                <span className="text-lg font-medium text-black dark:text-white">CareerAI</span>
              </div>
              <p className="text-sm text-neutral-500 max-w-xs">
                AI-powered job search and interview preparation platform. Smart, personalized, and effective.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Docs', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-sm font-medium text-black dark:text-white mb-4">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-400">© 2025 CareerAI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {['Twitter', 'GitHub', 'Discord'].map((social) => (
                <a key={social} href="#" className="text-sm text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <div className="noise-overlay" />
    </div>
  );
}
