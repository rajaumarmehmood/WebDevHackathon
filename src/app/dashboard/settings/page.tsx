'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Bell, Shield, Palette, Brain } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import gsap from 'gsap';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  if (isLoading) return null;
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
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12 space-y-8">
        {/* Title */}
        <div className="fade-item">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
            Settings
          </h1>
          <p className="text-lg text-neutral-500">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <User className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-xl font-medium text-black dark:text-white">Profile</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-neutral-500 mb-2 block">Full Name</label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-500 mb-2 block">Email</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg"
              />
            </div>
            <p className="text-xs text-neutral-400">
              Profile editing coming soon
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <Bell className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-xl font-medium text-black dark:text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Job Matches</p>
                <p className="text-xs text-neutral-500">Get notified when new jobs match your profile</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Interview Reminders</p>
                <p className="text-xs text-neutral-500">Reminders for upcoming interviews</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Weekly Summary</p>
                <p className="text-xs text-neutral-500">Weekly email with your progress</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <p className="text-xs text-neutral-400">
              Notification preferences coming soon
            </p>
          </div>
        </div>

        {/* Privacy */}
        <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <Shield className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-xl font-medium text-black dark:text-white">Privacy & Security</h2>
          </div>
          <div className="p-6 space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Download My Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              Delete Account
            </Button>
            <p className="text-xs text-neutral-400">
              Security features coming soon
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <Palette className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h2 className="text-xl font-medium text-black dark:text-white">Appearance</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="text-sm text-neutral-500 mb-2 block">Theme</label>
              <select className="w-full h-12 px-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <p className="text-xs text-neutral-400">
              Theme switching coming soon
            </p>
          </div>
        </div>
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
