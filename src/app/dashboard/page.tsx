'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useUserStats, useInterviewPreps, useResume } from '@/lib/supabase/hooks';
import { Button } from '@/components/ui/button';
import { LogOut, User, Settings, LayoutGrid, Loader2, Bell, Search, Plus, FileText, Briefcase, Target, TrendingUp, Brain, Upload, Download, ExternalLink, MoreHorizontal, ChevronRight } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import gsap from 'gsap';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const { stats: userStats, loading: statsLoading } = useUserStats();
  const { preps: interviewPreps } = useInterviewPreps();
  const { resume } = useResume();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
    { label: 'Jobs Matched', value: userStats.jobsMatched.toString(), change: '+0', icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Applications', value: userStats.applications.toString(), change: '+0', icon: FileText, color: 'bg-purple-500' },
    { label: 'Interview Preps', value: userStats.interviews.toString(), change: '+0', icon: Target, color: 'bg-green-500' },
    { label: 'Skill Score', value: userStats.skillScore ? `${userStats.skillScore}%` : '0%', change: '+0', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const matchedJobs = [
    { 
      title: 'Frontend Developer', 
      company: 'TechCorp', 
      location: 'Remote', 
      match: 95, 
      salary: '$80k-$120k',
      posted: '2 days ago',
      tags: ['React', 'TypeScript', 'Next.js']
    },
    { 
      title: 'Full Stack Engineer', 
      company: 'StartupXYZ', 
      location: 'San Francisco', 
      match: 92, 
      salary: '$100k-$150k',
      posted: '1 week ago',
      tags: ['Node.js', 'React', 'MongoDB']
    },
    { 
      title: 'Software Engineer Intern', 
      company: 'BigTech Inc', 
      location: 'New York', 
      match: 88, 
      salary: '$40/hr',
      posted: '3 days ago',
      tags: ['Python', 'Java', 'AWS']
    },
  ];

  // Format interview preps for display
  const formattedPreps = interviewPreps.slice(0, 2).map((prep: any) => ({
    role: prep.role,
    company: prep.company,
    status: 'Ready',
    questions: prep.prep_material?.technicalQuestions?.length + prep.prep_material?.behavioralQuestions?.length || 0,
    lastUpdated: new Date(prep.created_at).toLocaleDateString(),
  }));

  const skillGaps = [
    { skill: 'System Design', current: 65, target: 85 },
    { skill: 'Data Structures', current: 80, target: 90 },
    { skill: 'React Advanced', current: 75, target: 90 },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-neutral-50 dark:bg-neutral-950 relative">
      <GridPattern />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-black border-r border-neutral-200 dark:border-neutral-800 p-6 hidden lg:flex flex-col z-40">
        <div className="dash-item flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white dark:text-black" />
          </div>
          <span className="text-lg font-medium text-black dark:text-white">CareerAI</span>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { icon: LayoutGrid, label: 'Overview', id: 'overview' },
            { icon: FileText, label: 'Resume', id: 'resume' },
            { icon: Briefcase, label: 'Job Matches', id: 'jobs' },
            { icon: Target, label: 'Interview Prep', id: 'prep' },
            { icon: TrendingUp, label: 'Analytics', id: 'analytics' },
            { icon: Settings, label: 'Settings', id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`dash-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
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
                <Brain className="w-4 h-4 text-white dark:text-black" />
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies..."
                  className="w-full h-10 pl-11 pr-4 bg-neutral-100 dark:bg-neutral-900 border-0 rounded-full text-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex h-9 rounded-full gap-2"
                onClick={() => router.push('/dashboard/upload-resume')}
              >
                <Upload className="w-4 h-4" />
                Upload Resume
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
            <p className="text-neutral-500 mt-2">Here&apos;s your job search progress</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-green-500 font-mono bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-light text-black dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Matched Jobs */}
            <div className="lg:col-span-2 card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-black dark:text-white">Top Job Matches</h2>
                  <p className="text-sm text-neutral-500">AI-curated opportunities for you</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-neutral-500"
                  onClick={() => setActiveTab('jobs')}
                >
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {matchedJobs.map((job) => (
                  <div key={job.title + job.company} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-base font-medium text-black dark:text-white group-hover:underline mb-1">{job.title}</h3>
                        <p className="text-sm text-neutral-500">{job.company} • {job.location}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs font-mono bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                          {job.match}% Match
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-4 h-4 text-neutral-400" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {job.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span>{job.salary}</span>
                      <span>{job.posted}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Prep */}
            <div className="card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-medium text-black dark:text-white">Interview Prep</h2>
                <p className="text-sm text-neutral-500">Your preparation materials</p>
              </div>
              <div className="p-6 space-y-4">
                {formattedPreps.length > 0 ? formattedPreps.map((prep: any, index: number) => (
                  <div key={prep.role + prep.company + index} className="p-4 border border-neutral-200 dark:border-neutral-800 rounded-xl hover-lift cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black dark:text-white group-hover:underline">{prep.role}</p>
                        <p className="text-xs text-neutral-500">{prep.company}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        prep.status === 'Ready' 
                          ? 'bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {prep.status}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mb-2">{prep.questions} questions • {prep.lastUpdated}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs h-8">
                      Start Prep
                    </Button>
                  </div>
                )) : (
                  <p className="text-sm text-neutral-500 text-center py-4">No interview preps yet</p>
                )}
                <Button 
                  className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200"
                  onClick={() => router.push('/dashboard/interview-prep')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Prep Session
                </Button>
              </div>
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="card-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-medium text-black dark:text-white">Skill Gap Analysis</h2>
              <p className="text-sm text-neutral-500">Areas to focus on for your target roles</p>
            </div>
            <div className="p-6 space-y-6">
              {skillGaps.map((skill) => (
                <div key={skill.skill}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-black dark:text-white">{skill.skill}</span>
                    <span className="text-xs text-neutral-500">{skill.current}% / {skill.target}%</span>
                  </div>
                  <div className="relative h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-black dark:bg-white rounded-full transition-all"
                      style={{ width: `${skill.current}%` }}
                    />
                    <div 
                      className="absolute top-0 h-full w-px bg-green-500"
                      style={{ left: `${skill.target}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/dashboard/upload-resume')}
              className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift text-left group"
            >
              <Upload className="w-8 h-8 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
              <h3 className="text-base font-medium text-black dark:text-white mb-1">Upload Resume</h3>
              <p className="text-sm text-neutral-500">Update your profile with latest resume</p>
            </button>
            <button 
              onClick={() => setActiveTab('jobs')}
              className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift text-left group"
            >
              <Search className="w-8 h-8 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
              <h3 className="text-base font-medium text-black dark:text-white mb-1">Discover Jobs</h3>
              <p className="text-sm text-neutral-500">Browse AI-matched opportunities</p>
            </button>
            <button 
              onClick={() => router.push('/dashboard/interview-prep')}
              className="card-item p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl hover-lift text-left group"
            >
              <Target className="w-8 h-8 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-3" />
              <h3 className="text-base font-medium text-black dark:text-white mb-1">Prep Interview</h3>
              <p className="text-sm text-neutral-500">Get personalized practice questions</p>
            </button>
          </div>
        </div>
      </main>
      <div className="noise-overlay" />
    </div>
  );
}
