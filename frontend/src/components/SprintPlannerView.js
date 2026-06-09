import React from 'react';

const SprintPlannerView = ({ tasks = [], sprints = [], onPlanTask }) => {
  // 1. USE snake_case for the database column!
  const backlogTasks = tasks.filter(task => task.sprint_id === null);

  return (
    <div className="flex gap-8 h-full animate-in fade-in duration-500">
      
      {/* --- LEFT: UNPLANNED BACKLOG --- */}
      <div className="w-1/3">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-slate-800">Unplanned Backlog</h3>
          <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 font-semibold">
            {backlogTasks.length} Tasks
          </span>
        </div>
        
        <div className="space-y-3 bg-slate-100/50 p-4 rounded-xl border border-slate-200 min-h-[500px]">
          {backlogTasks.length > 0 ? (
            backlogTasks.map(task => (
              <div 
                key={task.id} 
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm hover:border-blue-400 transition-all hover:translate-x-1 group flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">📦 {task.title}</span>
                </div>
                
                {/* 2. THE DYNAMIC SPRINT SELECTOR (Reveals on Hover) */}
                <div className="hidden group-hover:flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 animate-in fade-in">
                    <select 
                        onChange={(e) => onPlanTask(task.id, e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded p-1.5 flex-1 text-slate-600 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 cursor-pointer"
                        defaultValue=""
                    >
                        <option value="" disabled>Move to sprint...</option>
                        {sprints.map(sprint => (
                            <option key={sprint.id} value={sprint.id}>
                                {sprint.name}
                            </option>
                        ))}
                    </select>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs italic">
              No tasks in backlog.
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT: THE ROADMAP --- */}
      <div className="flex-1 space-y-6">
        <h3 className="font-bold text-slate-800 mb-4">Project Roadmap</h3>
        
        {sprints.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center shadow-sm">
                <p className="text-slate-500 font-medium mb-2">No Sprints Planned Yet</p>
                <p className="text-slate-400 text-sm">Click "Create Sprint" above to timebox your tasks.</p>
            </div>
        ) : (
            // 3. MAP OVER THE REAL SPRINTS
            sprints.map((sprint, index) => {
                // Find tasks that belong ONLY to this sprint
                const sprintTasks = tasks.filter(task => task.sprint_id === sprint.id);
                
                // For UI purposes, let's make the first sprint look "Active"
                const isActive = index === 0;

                return (
                    <div 
                        key={sprint.id} 
                        className={`bg-white rounded-xl border-l-4 ${isActive ? 'border-l-blue-600' : 'border-l-slate-300 opacity-70 hover:opacity-100 transition-opacity'} border border-slate-200 p-6 shadow-sm`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{sprint.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">
                                    {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
                                </p>
                            </div>
                            {isActive && (
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">ACTIVE</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            {sprintTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                                    <span className="text-slate-700">{task.title}</span>
                                </div>
                            ))}
                            
                            {sprintTasks.length === 0 && (
                                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-xs">
                                    Select this sprint from the backlog to assign tasks.
                                </div>
                            )}
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
};

export default SprintPlannerView;