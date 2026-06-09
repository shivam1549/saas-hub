"use client";
import React, { useState } from 'react';
import { Calendar, X, AlertCircle, Flag } from 'lucide-react';
import api from '@/api/axios';

export default function SprintModal({ isOpen, onClose, onSuccess, projectId }) {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    project_id: projectId // Automatically link it to the current project!
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/sprints', formData);
      if (onSuccess) onSuccess(); 
    } catch (err) {
      console.error("Sprint creation failed:", err);
      if (err.response && err.response.status === 422) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' | ');
        setError(`Validation Failed: ${errorMessages}`);
      } else {
        setError('An unexpected error occurred while creating the sprint.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Plan New Sprint</h2>
            <p className="text-xs text-slate-500 mt-0.5">Timebox your team's upcoming tasks.</p>
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
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <Flag size={16} className="text-blue-600"/> Sprint Name
            </label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Sprint 1: Foundation" 
              disabled={isLoading}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400"/> Start Date
              </label>
              <input 
                required
                type="date" 
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none disabled:opacity-60 text-sm" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400"/> End Date
              </label>
              <input 
                required
                type="date" 
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none disabled:opacity-60 text-sm" 
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-5 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? 'Creating...' : 'Create Sprint'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}