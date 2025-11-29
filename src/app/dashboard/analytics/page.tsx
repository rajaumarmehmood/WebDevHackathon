'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, TrendingUp, Briefcase, FileText, Target, Brain, Activity, AlertCircle, CheckCircle, Info, BarChart3, Award } from 'lucide-react';
import { GridPattern } from '@/components/Doodles';
import DashboardSidebar from '@/components/DashboardSidebar';
import { UserAnalytics } from '@/lib/types';
import gsap from 'gsap';

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
      const ctx = gsap.context(() => {
        gsap.set('.fade-item', { y: 30, opacity: 0 });
        gsap.to('.fade-item', { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power4.out' });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityTime = (timestamp: Date) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return time.toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <Loader2 className="w-6 h-6 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  if (!user || !analytics) return null;

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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 space-y-8">
        {/* Title */}
        <div className="fade-item">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white mb-4">
            Career Analytics
          </h1>
          <p className="text-lg text-neutral-500">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="fade-item grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-light text-black dark:text-white mb-1">
              {analytics.totalJobsMatched}
            </p>
            <p className="text-sm text-neutral-500">Jobs Matched</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <p className="text-3xl font-light text-black dark:text-white mb-1">
              {analytics.totalApplications}
            </p>
            <p className="text-sm text-neutral-500">Applications</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-3xl font-light text-black dark:text-white mb-1">
              {analytics.totalInterviews}
            </p>
            <p className="text-sm text-neutral-500">Interview Preps</p>
          </div>

          <div className="p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <p className="text-3xl font-light text-black dark:text-white mb-1">
              {analytics.skillCoverage.length}
            </p>
            <p className="text-sm text-neutral-500">Skills Tracked</p>
          </div>
        </div>

        {/* AI Insights */}
        {analytics.insights && analytics.insights.length > 0 && (
          <div className="fade-item space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-black dark:text-white" />
              <h2 className="text-xl font-medium text-black dark:text-white">AI-Generated Insights</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.insights.map((insight: any, index: number) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl border ${
                    insight.type === 'success' 
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900'
                      : insight.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900'
                      : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />}
                    {insight.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />}
                    <div>
                      <h3 className={`font-medium mb-1 ${
                        insight.type === 'success' 
                          ? 'text-green-900 dark:text-green-100'
                          : insight.type === 'warning'
                          ? 'text-yellow-900 dark:text-yellow-100'
                          : 'text-blue-900 dark:text-blue-100'
                      }`}>
                        {insight.title}
                      </h3>
                      <p className={`text-sm ${
                        insight.type === 'success' 
                          ? 'text-green-700 dark:text-green-300'
                          : insight.type === 'warning'
                          ? 'text-yellow-700 dark:text-yellow-300'
                          : 'text-blue-700 dark:text-blue-300'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Progress */}
        {analytics.weeklyProgress && analytics.weeklyProgress.length > 0 && (
          <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-black dark:text-white" />
              <div>
                <h2 className="text-xl font-medium text-black dark:text-white">Job Search Progress</h2>
                <p className="text-sm text-neutral-500">Your activity over the past 4 weeks</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {analytics.weeklyProgress.map((week: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-black dark:text-white">{week.week}</span>
                      <div className="flex items-center gap-4 text-xs text-neutral-500">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
                          {week.jobsViewed} discovered
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          {week.applicationsSubmitted} applied
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          {week.interviewsScheduled} preps
                        </span>
                      </div>
                    </div>
                    
                    {/* Jobs Discovered Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Jobs Discovered</span>
                        <span>{week.jobsViewed}</span>
                      </div>
                      <div className="relative h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 h-full bg-black dark:bg-white rounded-full transition-all"
                          style={{ width: `${Math.min((week.jobsViewed / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Applications Bar */}
                    {week.applicationsSubmitted > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>Applications Submitted</span>
                          <span>{week.applicationsSubmitted}</span>
                        </div>
                        <div className="relative h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${Math.min((week.applicationsSubmitted / 10) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Interview Preps Bar */}
                    {week.interviewsScheduled > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-neutral-500">
                          <span>Interview Preps</span>
                          <span>{week.interviewsScheduled}</span>
                        </div>
                        <div className="relative h-2 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${Math.min((week.interviewsScheduled / 5) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Skill Coverage */}
        {analytics.skillCoverage && analytics.skillCoverage.length > 0 && (
          <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <Award className="w-5 h-5 text-black dark:text-white" />
              <div>
                <h2 className="text-xl font-medium text-black dark:text-white">Skill Coverage Analysis</h2>
                <p className="text-sm text-neutral-500">Your strengths and areas for improvement</p>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {analytics.skillCoverage.slice(0, 12).map((skill: any, index: number) => {
                const proficiency = Math.round(skill.current);
                const isStrength = proficiency >= 85;
                const needsWork = proficiency < 70;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-black dark:text-white">{skill.skill}</span>
                        {isStrength && (
                          <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full">
                            Strength
                          </span>
                        )}
                        {needsWork && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-950 text-yellow-600 dark:text-yellow-400 rounded-full">
                            Improve
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-500">
                          {skill.jobsRequiring} {skill.jobsRequiring === 1 ? 'job' : 'jobs'}
                        </span>
                        <span className="text-xs font-mono text-black dark:text-white">
                          {proficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                          isStrength 
                            ? 'bg-green-500' 
                            : needsWork 
                            ? 'bg-yellow-500' 
                            : 'bg-black dark:bg-white'
                        }`}
                        style={{ width: `${proficiency}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Log */}
        {analytics.activityLog && analytics.activityLog.length > 0 && (
          <div className="fade-item bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
              <Activity className="w-5 h-5 text-black dark:text-white" />
              <div>
                <h2 className="text-xl font-medium text-black dark:text-white">Recent Activity</h2>
                <p className="text-sm text-neutral-500">Your latest actions and milestones</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                {analytics.activityLog.slice(0, 15).map((activity: any, index: number) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                    <div className="w-2 h-2 mt-2 rounded-full bg-black dark:bg-white flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-black dark:text-white">
                        {activity.action} <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {formatActivityTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!analytics.activityLog || analytics.activityLog.length === 0) && (!analytics.skillCoverage || analytics.skillCoverage.length === 0) && (
          <div className="fade-item text-center py-16">
            <Activity className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-black dark:text-white mb-2">
              No analytics yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Start by uploading your resume and discovering jobs to see your analytics
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button onClick={() => router.push('/dashboard/upload-resume')}>
                Upload Resume
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/jobs')}>
                Discover Jobs
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
