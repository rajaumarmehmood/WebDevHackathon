'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, LayoutGrid, Loader2, ArrowUpRight, Bell, Search, Plus, Folder, Clock, Star, MoreHorizontal, Sparkles } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import gsap from 'gsap';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
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
        gsap.set('.dash-item', { y: 30, opacity: 0 });
        gsap.set('.card-item', { y: 20, opacity: 0, scale: 0.98 });
        
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.to('.dash-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.06 })
          .to('.card-item', { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08 }, '-=0.4');
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const stats = [
    { label: 'Total Projects', value: '12', change: '+2', trend: 'up' },
    { label: 'Active Tasks', value: '48', change: '+12', trend: 'up' },
    { label: 'Completed', value: '156', change: '+8', trend: 'up' },
    { label: 'Team Members', value: '8', change: '+1', trend: 'up' },
  ];

  const recentProjects = [
    { name: 'E-commerce Platform', status: 'In Progress', updated: '2 hours ago', color: 'bg-blue-500' },
    { name: 'Mobile App Redesign', status: 'Review', updated: '5 hours ago', color: 'bg-purple-500' },
    { name: 'API Integration', status: 'Completed', updated: '1 day ago', color: 'bg-green-500' },
    { name: 'Dashboard Analytics', status: 'In Progress', updated: '2 days ago', color: 'bg-orange-500' },
  ];

  const activities = [
    { action: 'Completed task', item: 'User authentication flow', time: '10 min ago' },
    { action: 'Created project', item: 'Mobile App v2', time: '1 hour ago' },
    { action: 'Invited member', item: 'sarah@example.com', time: '3 hours ago' },
    { action: 'Updated settings', item: 'Security preferences', time: '5 hours ago' },
  ];


  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      <GridPattern />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 p-6 hidden lg:flex flex-col z-40">
        <div className="dash-item flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-medium text-black dark:text-white">authflow</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { icon: LayoutGrid, label: 'Dashboard', active: true },
            { icon: Folder, label: 'Projects' },
            { icon: User, label: 'Team' },
            { icon: Clock, label: 'Activity' },
            { icon: Star, label: 'Favorites' },
            { icon: Settings, label: 'Settings' },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className={`dash-item flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* User Card */}
        <div className="dash-item p-4 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white dark:text-black" />
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="w-full h-10 pl-11 pr-4 bg-neutral-100 dark:bg-neutral-900 border-0 rounded-full text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex h-9 rounded-full gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
              <button className="relative p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button onClick={handleLogout} className="p-2 text-neutral-500 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>


        {/* Content */}
        <div className="p-6 lg:p-8 space-y-8">
          {/* Welcome */}
          <div className="dash-item">
            <p className="text-sm font-mono tracking-widest text-neutral-400 uppercase mb-2">Dashboard</p>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-black dark:text-white">
              Welcome back, {user.name.split(' ')[0]} 👋
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm text-neutral-500">{stat.label}</span>
                  <span className="text-xs text-green-500 font-mono bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-light text-black dark:text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Projects */}
            <div className="lg:col-span-2 card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-black dark:text-white">Recent Projects</h2>
                  <p className="text-sm text-neutral-500">Your latest work</p>
                </div>
                <Button variant="ghost" size="sm" className="text-neutral-500">
                  View All <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {recentProjects.map((project) => (
                  <div key={project.name} className="p-6 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white group-hover:underline">{project.name}</p>
                      <p className="text-xs text-neutral-500">{project.updated}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      project.status === 'Completed' 
                        ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                        : project.status === 'Review'
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    }`}>
                      {project.status}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>


            {/* Activity */}
            <div className="card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-medium text-black dark:text-white">Recent Activity</h2>
                <p className="text-sm text-neutral-500">What&apos;s happening</p>
              </div>
              <div className="p-6 space-y-6">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    <div>
                      <p className="text-sm text-black dark:text-white">
                        {activity.action} <span className="text-neutral-500">{activity.item}</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Account Card */}
          <div className="card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <User className="w-5 h-5 text-neutral-400" />
              <h2 className="text-lg font-medium text-black dark:text-white">Account Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-black dark:text-white font-medium">{user.name}</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-black dark:text-white font-medium">{user.email}</p>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <p className="text-green-600 dark:text-green-400 font-medium">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
