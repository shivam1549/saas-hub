"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, Layers } from 'lucide-react'; // Added these
import TaskCard from './TaskCard';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import api from '@/api/axios';
import TaskPanel from './TaskPanel'; // Add this at the top

// 1. Remove the static const todoTasks from here!
// 2. Accept 'tasks' as a prop
const KanbanBoardView = ({ tasks, setTasks, users, onAddtask, onDeleteTask}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
  // 1. Setup Sensors (Allows for mouse and keyboard control)
 // Check if the current user is an admin for the Add Task button
 console.log("Kanban Debug - Project ID:");
console.log("Kanban Debug - Echo Instance:");
    const [userRole, setUserRole] = useState(null);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setUserRole(user.role);
    }, []);

   const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Check Text Search
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(lowerQuery) || 
        (task.description && task.description.toLowerCase().includes(lowerQuery));

      // Check Priority
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;

      // Check Assignee
      const matchesAssignee = !assigneeFilter || String(task.assignee_id) === String(assigneeFilter);

      // Task must pass ALL active filters to be shown
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]); // Only recalculate if these change

  // 3. Distribute the filtered tasks to columns
  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done')

    // THE ENGINE: Handling the Drop
    const handleDragEnd = async (event) => {
        const { active, over } = event;

        // If dropped outside a valid area, do nothing
        if (!over) return; 

        const activeId = active.id;
        const overId = over.id;

        // Find the task we are dragging
        const activeTask = tasks.find(t => t.id === activeId);
        if (!activeTask) return;

        // Determine the NEW status based on where it was dropped
        let newStatus = activeTask.status;

        // If dropped directly on a column (e.g., 'todo', 'in_progress', 'done')
        if (['todo', 'in_progress', 'done'].includes(overId)) {
            newStatus = overId;
        } else {
            // If dropped on top of another task, copy that task's status
            const overTask = tasks.find(t => t.id === overId);
            if (overTask) newStatus = overTask.status;
        }

        // If the status didn't change, we don't need to do anything
        if (activeTask.status === newStatus) return;

        // 1. OPTIMISTIC UI UPDATE (Instant feeling)
        // We update the parent's state immediately so the card snaps into place
        setTasks(prevTasks => prevTasks.map(task => 
            task.id === activeId ? { ...task, status: newStatus } : task
        ));

        // 2. BACKGROUND API CALL
        try {
            await api.put(`/tasks/${activeId}`, {
                status: newStatus
            });
        } catch (error) {
            console.error("Failed to update status", error);
            // Optional: If the API fails, revert the optimistic update here
            setTasks(prevTasks => prevTasks.map(task => 
                task.id === activeId ? { ...task, status: activeTask.status } : task
            ));
        }
    };
  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchQuery} // Bind the state
    onChange={(e) => setSearchQuery(e.target.value)} // Update on type
    className="pl-9 pr-4 py-1.5 placeholder-slate-500 text-slate-900 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
  />
</div>
          {/* Filter Dropdown Container */}
      <div className="relative">
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            isFilterOpen || priorityFilter || assigneeFilter 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : 'text-slate-600 hover:bg-slate-50 border-slate-200'
          }`}
        >
          <Filter size={16} />
          Filters
          {(priorityFilter || assigneeFilter) && (
             <span className="w-2 h-2 rounded-full bg-blue-600 ml-1"></span> // Visual dot if a filter is active
          )}
        </button>

        {/* The Dropdown Menu */}
        {isFilterOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
            
            {/* Priority Filter */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Priority</label>
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Assignee Filter */}
            <div className="mb-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Assignee</label>
              <select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Everyone</option>
                <option value="unassigned">Unassigned</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            <button 
              onClick={() => {
                setPriorityFilter("");
                setAssigneeFilter("");
                setIsFilterOpen(false);
              }}
              className="w-full text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 py-2 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 mr-2">Sorted by: Due Date</span>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><MoreHorizontal size={18} /></button>
        </div> */}
      </div>
      <DndContext 
            // sensors={sensors} // Ensure sensors are defined above in your file
            collisionDetection={closestCorners} 
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">

                {/* --- TO DO COLUMN --- */}
                {/* 
                  IMPORTANT: The droppable area MUST have an id that matches your status 
                  so dnd-kit knows when a card is dropped directly into an empty column!
                */}
                <DroppableColumn id="todo" title="To Do" columnTasks={todoTasks} onAddtask={onAddtask} users={users} setTasks={setTasks} onTaskClick={setSelectedTask} userRole={userRole} onDeleteTask={onDeleteTask} />

                {/* --- IN PROGRESS COLUMN --- */}
                <DroppableColumn id="in_progress" title="In Progress" columnTasks={inProgressTasks} onAddtask={onAddtask} users={users} setTasks={setTasks} userRole={userRole} onTaskClick={setSelectedTask} onDeleteTask={onDeleteTask} />

                {/* --- DONE COLUMN --- */}
                <DroppableColumn id="done" title="Done" columnTasks={doneTasks} onAddtask={onAddtask} users={users} setTasks={setTasks} userRole={userRole} onTaskClick={setSelectedTask} onDeleteTask={onDeleteTask} />

            </div>
        </DndContext>
        <TaskPanel 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        users={users}
      />
    </div>
  );
};

// ---------------------------------------------------------
// Helper Component: Renders a column and makes it droppable
// ---------------------------------------------------------
import { useDroppable } from '@dnd-kit/core';

function DroppableColumn({ id, title, columnTasks, onAddtask, userRole, users, setTasks, onTaskClick, onDeleteTask }) {
    // This hook makes the whole column a valid drop target
    const { setNodeRef } = useDroppable({ id: id });

    return (
        <div ref={setNodeRef} className="bg-slate-100/50 rounded-xl p-4 border border-slate-200 flex flex-col gap-4 min-h-[400px]">
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center justify-between px-1">
                {title} <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{columnTasks.length}</span>
            </h3>

            {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                        <Layers className="text-slate-300" size={24} />
                    </div>
                    <p className="text-xs font-medium text-slate-400">No tasks here yet</p>
                </div>
            ) : (
                <SortableContext items={columnTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {columnTasks.map(task => <TaskCard key={task.id} task={task} users={users} setTasks={setTasks} onTaskClick={onTaskClick} onDeleteTask={onDeleteTask} />)}
                </SortableContext>
            )}

            {/* ONLY Admins get the Add Task button! */}
            {userRole === 'admin' && (
                <button onClick={onAddtask} className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 text-sm hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-medium mt-auto">
                    + Add Task
                </button>
            )}
        </div>
    );
}

export default KanbanBoardView;