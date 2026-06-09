"use client";
import React, { useState } from 'react';
import { AlignLeft, Flag, Calendar, X, AlertCircle, User, Layers } from 'lucide-react';
import api from '@/api/axios';

export default function TaskModal({ isOpen, onClose, onSuccess, projectId, sprints = [], users = [] }) {
  // 1. Initialize State (Notice due_date, project_id, sprint_id, assignee_id)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium', // Default to medium
    due_date: '',
    project_id: projectId, 
    sprint_id: '', // Blank means it goes to the Backlog!
    assignee_id: '', 
    status: 'todo' // All new tasks start as To Do
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. The API Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Clean up empty strings to null for the database
      const payload = {
        ...formData,
        sprint_id: formData.sprint_id === '' ? null : formData.sprint_id,
        assignee_id: formData.assignee_id === '' ? null : formData.assignee_id,
      };

      await api.post('/tasks', payload);
      
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("Task creation failed:", err);
      if (err.response && err.response.status === 422) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' | ');
        setError(`Validation Failed: ${errorMessages}`);
      } else {
        setError('An unexpected error occurred while creating the task.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create New Task</h2>
            <p className="text-xs text-slate-500 mt-0.5">Add a new item to your project.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Task Title</label>
            <input 
              type="text" 
              required
              disabled={isLoading}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Finalize brass light shipment" 
              className="w-full px-4 py-2 placeholder-slate-400 text-slate-900 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
              <AlignLeft size={16} className="text-slate-400"/> Description
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3" 
              disabled={isLoading}
              placeholder="Add more details..." 
              className="w-full placeholder-slate-400 text-slate-900 px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-sm"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Flag size={16} className="text-slate-400"/> Priority
              </label>
              <select 
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 text-slate-900 rounded-lg border border-slate-200 outline-none bg-white text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400"/> Due Date
              </label>
              <input 
                type="date" 
                value={formData.due_date}
                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 outline-none text-sm" 
              />
            </div>

            {/* Assignee Selection (NEW) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <User size={16} className="text-slate-400"/> Assign To
              </label>
              <select 
                value={formData.assignee_id}
                onChange={(e) => setFormData({...formData, assignee_id: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 text-slate-900 rounded-lg border border-slate-200 outline-none bg-white text-sm"
              >
                <option value="">Unassigned</option>
                {users.map(user => (
                   <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>

            {/* Sprint Selection (NEW) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                <Layers size={16} className="text-slate-400"/> Add to Sprint
              </label>
              <select 
                value={formData.sprint_id}
                onChange={(e) => setFormData({...formData, sprint_id: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 text-slate-900 rounded-lg border border-slate-200 outline-none bg-white text-sm"
              >
                <option value="">Backlog (No Sprint)</option>
                {sprints.map(sprint => (
                   <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-60"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}