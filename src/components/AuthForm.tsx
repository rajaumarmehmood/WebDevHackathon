'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowRight, Loader2, Brain, FileText, Search, TrendingUp, Check } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
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


      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.to('.anim-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 }, '-=0.5')
        .to('.feature-card', { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 }, '-=0.4');
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (mode === 'login') {
      const result = await login(email, password);
      setIsLoading(false);
      if (result.success) {
        router.push('/dashboard');
      } else {
        // Check if it's an email confirmation error
        if (result.error?.toLowerCase().includes('email not confirmed')) {
          setError('Please confirm your email before logging in. Check your inbox for the confirmation link.');
        } else {
          setError(result.error || 'Something went wrong');
        }
      }
    } else {
      const result = await signup(email, name, password);
      setIsLoading(false);
      if (result.success) {
        // Redirect to confirm email page instead of dashboard
        router.push(`/confirm-email?email=${encodeURIComponent(email)}`);
      } else {
        setError(result.error || 'Something went wrong');
      }
    }
  };

  const features = [
    { icon: FileText, label: 'Resume AI', desc: 'Smart analysis' },
    { icon: Search, label: 'Job Match', desc: 'Auto discovery' },
    { icon: TrendingUp, label: 'Career Boost', desc: 'Interview prep' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen flex bg-white dark:bg-black relative overflow-hidden">
      <GridPattern />

      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-black text-white overflow-hidden border-r border-neutral-800">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

        <div className="relative z-10 flex flex-col justify-between h-full p-16 xl:p-20">
          {/* Logo */}
          <div className="anim-item flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-medium text-white tracking-tight">Navigation</span>
          </div>

          {/* Main Content */}
          <div className="space-y-10">
            <div>
              <p className="anim-item text-sm font-mono tracking-widest text-neutral-400 uppercase mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-neutral-400"></span>
                {mode === 'login' ? 'Welcome Back' : 'Get Started'}
              </p>
              <h1 className="anim-item text-5xl xl:text-7xl font-medium tracking-tighter leading-[1.05]">
                {mode === 'login' ? (
                  <>Your dream<br /><span className="text-neutral-400">job awaits.</span></>
                ) : (
                  <>Start your<br /><span className="text-neutral-400">career journey.</span></>
                )}
              </h1>
            </div>

            <p className="anim-item text-lg text-neutral-400 max-w-md leading-relaxed font-light">
              {mode === 'login'
                ? 'Sign in to access your personalized job matches and interview prep materials.'
                : 'Create an account to unlock AI-powered job discovery and interview preparation.'}
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
              {features.map((feature, i) => (
                <div
                  key={feature.label}
                  className="feature-card p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-default group"
                >
                  <feature.icon className="w-6 h-6 text-white mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <p className="text-sm font-medium text-white mb-1">{feature.label}</p>
                  <p className="text-xs text-neutral-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="anim-item flex items-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-neutral-300">System Operational</span>
            </div>
            <div className="text-neutral-500">v2.4.0</div>
          </div>
        </div>
      </div>


      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden anim-item flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-white dark:text-black" />
            </div>
            <span className="text-xl font-medium text-black dark:text-white">Navigation</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="anim-item text-3xl lg:text-4xl font-semibold tracking-tight text-black dark:text-white">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="anim-item text-neutral-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <a href={mode === 'login' ? '/signup' : '/login'}
                className="text-black dark:text-white hover:underline font-medium transition-all">
                {mode === 'login' ? 'Sign up free' : 'Sign in'}
              </a>
            </p>
          </div>

          {error && (
            <div className="anim-item p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="anim-item space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-xl text-base transition-all shadow-sm"
                />
              </div>
            )}

            <div className="anim-item space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-xl text-base transition-all shadow-sm"
              />
            </div>

            <div className="anim-item space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300 ml-1">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 focus:border-black dark:focus:border-white focus:ring-0 rounded-xl text-base pr-12 transition-all shadow-sm"
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
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div className="w-5 h-5 border border-neutral-300 dark:border-neutral-700 rounded flex items-center justify-center group-hover:border-black dark:group-hover:border-white transition-colors bg-white dark:bg-neutral-900">
                    <Check className="w-3 h-3 text-transparent group-hover:text-black dark:group-hover:text-white" />
                  </div>
                  <span className="text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="anim-item w-full h-12 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl text-base font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === 'login' ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="anim-item relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white dark:bg-black text-xs font-medium text-neutral-400 uppercase tracking-wider">or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="anim-item grid grid-cols-3 gap-3">
            {[
              { name: 'Google', icon: 'G' },
              { name: 'GitHub', icon: 'Gh' },
              { name: 'Apple', icon: 'Ap' },
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="h-12 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                {/* Icons would go here, using text for now to keep it simple/clean or use Lucide if available */}
                <span>{provider.name}</span>
              </button>
            ))}
          </div>

          {/* Terms */}
          <p className="anim-item text-xs text-neutral-400 text-center leading-relaxed px-4">
            By continuing, you agree to our{' '}
            <a href="#" className="hover:text-black dark:hover:text-white underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-2 transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="hover:text-black dark:hover:text-white underline decoration-neutral-300 dark:decoration-neutral-700 underline-offset-2 transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
      <div className="noise-overlay opacity-50" />
    </div>
  );
}
