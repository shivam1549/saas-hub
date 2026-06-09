import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Maximize2, Trash2 } from 'lucide-react'; // 🔥 Import the new Expand icon
import api from '@/api/axios';

export default function TaskCard({ task, users = [], setTasks, onTaskClick, onContextMenu, onDeleteTask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const assignedUser = users.find(u => String(u.id) === String(task.assignee_id));

  const handleAssign = async (e) => {
    e.stopPropagation(); 
    const rawValue = e.target.value;
    const newAssigneeId = rawValue === "" ? null : rawValue;

    if (setTasks) {
        setTasks(prevTasks => prevTasks.map(t => 
            t.id === task.id ? { ...t, assignee_id: newAssigneeId } : t
        ));
    }

    try {
        await api.patch(`/tasks/${task.id}`, { assignee_id: newAssigneeId });
    } catch (error) {
        console.error("Failed to assign task:", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // 🔥 REMOVED onClick FROM HERE so it stops fighting the drag sensor!
      onContextMenu={(e) => onContextMenu && onContextMenu(e, task)}
      className={`bg-white p-4 rounded-xl border mb-3 shadow-sm group relative ${
        isDragging ? 'shadow-xl border-blue-400 scale-[1.02] rotate-1 z-50' : 'border-slate-200 hover:border-slate-300'
      } transition-all`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
          task.priority === 'high' ? 'bg-red-100 text-red-700' :
          task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-600'
        }`}>
          {task.priority || 'Medium'}
        </span>

        {/* 🔥 THE NEW OPEN PANEL BUTTON */}
        <button
            onPointerDown={(e) => e.stopPropagation()} // Stops dnd-kit from starting a drag
            onClick={(e) => {
                e.stopPropagation(); // Stops React from bubbling
                onTaskClick && onTaskClick(task);
            }}
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
            title="View Details"
        >
            <Maximize2 size={14} />
        </button>
      </div>
      
      <h4 className="font-bold text-slate-800 text-sm mb-2">{task.title}</h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{task.description}</p>
      
      <div className="flex justify-between items-center border-t border-slate-100 pt-3">
        <div 
            className="relative flex items-center group/avatar cursor-pointer"
            onPointerDown={(e) => e.stopPropagation()} 
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm ${
                assignedUser ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400 border-dashed'
            }`}>
                {assignedUser ? assignedUser.name.charAt(0).toUpperCase() : '?'}
            </div>

            <select
                value={task.assignee_id || ""}
                onChange={handleAssign}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                title="Assign Task"
            >
                <option value="">Unassigned</option>
                {users.map(user => (
                    <option key={user.id} value={user.id}>
                        Assign to: {user.name}
                    </option>
                ))}
            </select>
        </div>

        {/* 🔥 NEW ACTIONS BAR */}
    <div className="flex items-center gap-1" onPointerDown={(e) => e.stopPropagation()}>
       
        
        <button
            onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
            title="Delete Task"
        >
            <Trash2 size={14} />
        </button>
    </div>

        <span className="text-[10px] font-medium text-slate-400">Task #{task.id}</span>
      </div>
    </div>
  );
}