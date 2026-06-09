'use client';
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Plus, Briefcase, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '@/api/axios';
import ProjectModal from '@/components/ProjectModal';

// Lazy load the chart - it's heavy and not critical
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

// Memoize StatCard to prevent unnecessary re-renders
const StatCard = memo(({ icon, label, value, growth }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="p-4 bg-slate-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-black text-slate-800">{value}</p>
      <p className="text-xs font-medium text-slate-400 mt-1">{growth}</p>
    </div>
  </div>
));

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Memoize fetch function to prevent unnecessary API calls
  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const [projectsRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/dashboard')
      ]);
      setProjects(projectsRes.data);
      setDashboardData(statsRes.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (isLoading || !dashboardData) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 animate-pulse font-medium">Loading Workspace...</div>;
  }

  const { role, kpis, chartData, actionItems } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 animate-in fade-in duration-700 bg-slate-50 min-h-screen">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Overview</h1>
          <p className="text-slate-500 mt-1 font-medium">
            {role === 'admin' ? "Company-wide velocity and project health." : "Your personal task load and active projects."}
          </p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsProjectModalOpen(true)} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} /> Create Project
          </button>
        )}
      </div>

      {isProjectModalOpen && (
        <ProjectModal 
          isOpen={isProjectModalOpen} 
          onClose={() => setIsProjectModalOpen(false)} 
          onSuccess={() => { setIsProjectModalOpen(false); fetchDashboard(); }}
        />
      )}

      {error && <div className="text-red-600 mb-4 font-medium bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

      {/* 2. Stats Grid (Now fully dynamic!) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<Briefcase className="text-blue-600" />} label={role === 'admin' ? "Total Projects" : "My Projects"} value={kpis.projects} growth="Active right now" />
        <StatCard icon={<CheckCircle2 className="text-emerald-600" />} label={role === 'admin' ? "Company Completions" : "My Completions"} value={kpis.completed} growth="All time" />
        <StatCard icon={<Clock className="text-amber-600" />} label="Avg. Daily Velocity" value={kpis.velocity} growth="Tasks per day (7d avg)" />
      </div>

      {/* 3. Analytics Chart & Action Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        
{/* Chart Card */}
<div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-w-0">
   <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Completed Tasks (7-Day Trend)</h2>
   
   {/* Chart Container with fixed height to prevent layout shift */}
   <div className="h-[300px] w-full mt-4">
     {chartData && chartData.length > 0 ? (
       <ResponsiveContainer width="100%" height="100%">
         <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
           <defs>
             <linearGradient id="colorVelocity" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
             </linearGradient>
           </defs>
           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
           <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
           <Area type="monotone" dataKey="completed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVelocity)" />
         </AreaChart>
       </ResponsiveContainer>
     ) : (
       <div className="h-full flex items-center justify-center text-slate-400">No chart data available</div>
     )}
   </div>
</div>

        {/* Action Items Panel (Takes up 1/3 of the screen. Empty for Admins, vital for Employees) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <h2 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider flex items-center gap-2">
             <AlertCircle size={16} className="text-amber-500"/> Action Items
           </h2>
           {role === 'admin' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-300"><CheckCircle2 size={32}/></div>
                 <p className="text-sm font-medium text-slate-500">You're the Admin. Check specific project boards to manage team tasks.</p>
              </div>
           ) : (
              <div className="space-y-3 overflow-y-auto flex-1">
                 {actionItems && actionItems.length === 0 ? (
                    <p className="text-sm text-slate-500 italic text-center mt-10">You're all caught up!</p>
                 ) : (
                    actionItems && actionItems.slice(0, 5).map(task => (
                      <div key={`task-${task.id}`} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-slate-500">TASK-{task.id}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${task.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'}`}>
                               {task.priority}
                            </span>
                         </div>
                         <p className="text-sm font-semibold text-slate-800 truncate">{task.title}</p>
                      </div>
                    ))
                 )}
              </div>
           )}
        </div>
      </div>

      {/* 4. Projects Grid (Optimized with limit) */}
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        {role === 'admin' ? 'All Workspaces' : 'My Workspaces'} <div className="h-px flex-1 bg-slate-200 ml-2"></div>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
           <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
             <p className="text-slate-500 font-medium">No projects found.</p>
           </div>
        ) : (
          projects.slice(0, 9).map((project) => (
             <Link href={`/projects/${project.id}`} key={`project-${project.id}`} className="block group">
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group-hover:scale-[1.02]">
                 <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{project.title}</h3>
                 <p className="text-sm text-slate-600 line-clamp-2 mb-4">{project.description || 'No description'}</p>
               </div>
             </Link>
          ))
        )}
      </div>
      
      {projects.length > 9 && (
        <div className="mt-6 text-center">
          <Link href="/projects" className="text-blue-600 hover:text-blue-700 font-medium">
            View all {projects.length} projects →
          </Link>
        </div>
      )}

    </div>
  );
}