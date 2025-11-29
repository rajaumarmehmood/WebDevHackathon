'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowRight, Loader2, Brain, FileText, Search, TrendingUp, Check } from 'lucide-react';
import { FloatingShapes, GridPattern } from '@/components/Doodles';
import gsap from 'gsap';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.anim-item', { y: 40, opacity: 0 });
      gsap.set('.feature-card', { y: 30, opacity: 0, scale: 0.95 });
      gsap.set('.doodle-line', { scaleX: 0, transformOrigin: 'left' });

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.to('.doodle-line', { scaleX: 1, duration: 0.8, stagger: 0.1 })
        .to('.anim-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, '-=0.5')
        .to('.feature-card', { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }, '-=0.4');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = mode === 'login' 
      ? await login(email, password)
      : await signup(email, name, password);
    setIsLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  const features = [
    { icon: FileText, label: 'Resume AI', desc: 'Smart analysis' },
    { icon: Search, label: 'Job Match', desc: 'Auto discovery' },
    { icon: TrendingUp, label: 'Career Boost', desc: 'Interview prep' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex bg-white dark:bg-black relative">
      <GridPattern />
      <FloatingShapes />

      
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden border-r border-neutral-200 dark:border-neutral-800">
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="anim-item flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-medium text-black dark:text-white">CareerAI</span>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <p className="anim-item text-sm font-mono tracking-widest text-neutral-400 uppercase mb-4">
                {mode === 'login' ? 'Welcome Back' : 'Get Started'}
              </p>
              <h1 className="anim-item text-5xl xl:text-6xl font-light tracking-tight text-black dark:text-white leading-[1.1]">
                {mode === 'login' ? (
                  <>Your dream<br />job awaits</>
                ) : (
                  <>Start your<br />career journey</>
                )}
              </h1>
            </div>

            {/* Doodle decoration */}
            <div className="doodle-line h-px bg-gradient-to-r from-neutral-300 via-neutral-400 to-transparent dark:from-neutral-700 dark:via-neutral-600 w-48" />

            <p className="anim-item text-lg text-neutral-500 max-w-sm leading-relaxed">
              {mode === 'login' 
                ? 'Sign in to access your personalized job matches and interview prep materials.'
                : 'Create an account to unlock AI-powered job discovery and interview preparation.'}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              {features.map((feature) => (
                <div key={feature.label} className="feature-card p-4 border border-neutral-200 dark:border-neutral-800 hover-lift cursor-pointer group">
                  <feature.icon className="w-5 h-5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
                  <p className="text-sm font-medium text-black dark:text-white">{feature.label}</p>
                  <p className="text-xs text-neutral-400 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="anim-item flex items-center gap-8">
            <div>
              <p className="text-2xl font-light text-black dark:text-white">50K+</p>
              <p className="text-xs text-neutral-400">Jobs Found</p>
            </div>
            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <p className="text-2xl font-light text-black dark:text-white">95%</p>
              <p className="text-xs text-neutral-400">Match Rate</p>
            </div>
            <div className="h-8 w-px bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <p className="text-2xl font-light text-black dark:text-white">10K+</p>
              <p className="text-xs text-neutral-400">Students</p>
            </div>
          </div>
        </div>
      </div>


      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden anim-item flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-medium text-black dark:text-white">CareerAI</span>
          </div>

          <div className="space-y-2">
            <h2 className="anim-item text-3xl lg:text-4xl font-light tracking-tight text-black dark:text-white">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="anim-item text-neutral-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <a href={mode === 'login' ? '/signup' : '/login'} 
                 className="text-black dark:text-white animated-underline font-medium">
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </a>
            </p>
          </div>

          {error && (
            <div className="anim-item p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="anim-item space-y-2">
                <Label htmlFor="name" className="text-sm text-neutral-600 dark:text-neutral-400">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-lg text-base transition-all"
                />
              </div>
            )}

            <div className="anim-item space-y-2">
              <Label htmlFor="email" className="text-sm text-neutral-600 dark:text-neutral-400">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-lg text-base transition-all"
              />
            </div>

            <div className="anim-item space-y-2">
              <Label htmlFor="password" className="text-sm text-neutral-600 dark:text-neutral-400">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-lg text-base pr-12 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>


            {mode === 'login' && (
              <div className="anim-item flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 border border-neutral-300 dark:border-neutral-700 rounded flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-colors">
                    <Check className="w-3 h-3 text-transparent group-hover:text-neutral-300" />
                  </div>
                  <span className="text-neutral-500">Remember me</span>
                </label>
                <a href="#" className="text-neutral-500 hover:text-black dark:hover:text-white animated-underline transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="anim-item w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg text-base font-medium transition-all group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="anim-item relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-black text-sm text-neutral-400">or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="anim-item grid grid-cols-3 gap-3">
            {[
              { name: 'Google', icon: '🔍' },
              { name: 'GitHub', icon: '🐙' },
              { name: 'Apple', icon: '🍎' },
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="h-12 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>{provider.icon}</span>
                <span className="hidden sm:inline text-neutral-600 dark:text-neutral-400">{provider.name}</span>
              </button>
            ))}
          </div>

          {/* Terms */}
          <p className="anim-item text-xs text-neutral-400 text-center leading-relaxed">
            By continuing, you agree to our{' '}
            <a href="#" className="animated-underline text-neutral-600 dark:text-neutral-300">Terms</a>
            {' '}and{' '}
            <a href="#" className="animated-underline text-neutral-600 dark:text-neutral-300">Privacy Policy</a>
          </p>
        </div>
      </div>
      <div className="noise-overlay" />
    </div>
  );
}
