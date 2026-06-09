import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, CheckCircle, Zap } from 'lucide-react';
import api from '@/api/axios';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981']; // Blue, Amber, Emerald for statuses

export default function DashboardView({ projectId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
      useEffect(() => {
          const user = JSON.parse(localStorage.getItem('user'));
          if (user) setUserRole(user.role);
      }, []);
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/projects/${projectId}/analytics`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) fetchAnalytics();
  }, [projectId]);

  if (isLoading) return <div className="p-8 text-center text-slate-500 animate-pulse">Calculating velocity...</div>;
  if (!data) return null;

  return (
    <div className="h-full animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Project Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">
          {userRole === 'admin' ? 'Company-wide velocity and team workload.' : 'Your personal performance metrics.'}
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Target size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Tasks</p>
            <p className="text-3xl font-black text-slate-800">{data.kpis.total}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completed</p>
            <p className="text-3xl font-black text-slate-800">{data.kpis.completed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Zap size={24}/></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Completion Rate</p>
            <p className="text-3xl font-black text-slate-800">{data.kpis.rate}%</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PIE CHART: Task Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Task Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={data.statusDistribution} 
                  cx="50%" cy="50%" 
                  innerRadius={60} outerRadius={80} 
                  paddingAngle={5} dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BAR CHART: Team Workload (Admins Only!) */}
        {userRole === 'admin' && data.teamWorkload.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Team Workload</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.teamWorkload} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
                  <Bar dataKey="tasks" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}