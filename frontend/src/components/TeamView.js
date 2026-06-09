import React from 'react';
import { Mail, Briefcase, CheckCircle2, Clock, Circle } from 'lucide-react';

const TeamView = ({ users = [], tasks = [], onInviteClick }) => {

  return (
    <div className="h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team Workload</h2>
          <p className="text-sm text-slate-500 mt-1">Monitor task distribution and team velocity.</p>
        </div>
        <button
          onClick={onInviteClick}
          className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
        >
          + Invite Member
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <p className="text-slate-500">No team members found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => {
            // --- THE WORKLOAD ENGINE ---
            // We calculate exactly what this specific user is doing right now
            const userTasks = tasks.filter(t => t.assignee_id === user.id);
            const todo = userTasks.filter(t => t.status === 'todo').length;
            const inProgress = userTasks.filter(t => t.status === 'in_progress').length;
            const done = userTasks.filter(t => t.status === 'done').length;

            // Calculate progress percentage
            const total = userTasks.length;
            const progress = total === 0 ? 0 : Math.round((done / total) * 100);

            return (
              <div key={user.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group">

                {/* User Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 truncate">
                      <Mail size={12} /> {user.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium mt-1">
                      <Briefcase size={12} /> {user.role === 'admin' ? 'Administrator' : 'Employee'}
                    </div>
                  </div>
                </div>

                {/* Workload Stats */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100">
                    <div className="text-xl font-black text-slate-700 mb-1">{todo}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                      <Circle size={10} /> To Do
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                    <div className="text-xl font-black text-blue-700 mb-1">{inProgress}</div>
                    <div className="text-[10px] font-bold text-blue-500 uppercase flex items-center justify-center gap-1">
                      <Clock size={10} /> Active
                    </div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3 text-center border border-emerald-100">
                    <div className="text-xl font-black text-emerald-700 mb-1">{done}</div>
                    <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center justify-center gap-1">
                      <CheckCircle2 size={10} /> Done
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                    <span>Task Completion</span>
                    <span className={progress === 100 ? 'text-emerald-600' : ''}>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamView;