"use client";
import React, { useState } from 'react';
import { X, Briefcase, Calendar, DollarSign, Target } from 'lucide-react';
import api from '@/api/axios';
const ProjectModal = ({ isOpen, onClose, onSuccess }) => {
  // 1. Initialize Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Manufacturing',
    deadline: '',
    budget: ''
  });

  // 2. Loading and Error States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 3. The API Submission Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send the data to the Laravel backend
      await api.post('/projects', formData);

      // If successful, trigger the Dashboard refresh and close the modal
      if (onSuccess) {
        onSuccess(); 
      }
    } catch (err) {
      console.error("Project creation failed:", err);
      
      // Catch Laravel's strict validation errors (422 Unprocessable Entity)
      if (err.response && err.response.status === 422) {
        const errorMessages = Object.values(err.response.data.errors).flat().join(' | ');
        setError(`Validation Failed: ${errorMessages}`);
      } else {
        setError('An unexpected error occurred while creating the project.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase size={22} className="text-blue-600" /> Start New Project
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
        </div>

       {/* The Form you provided */}
        <form className="p-8 space-y-6 pt-6" onSubmit={handleSubmit}>
          
          {/* Project Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Project Name</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Q3 Brass Export Batch" 
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Category Select */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Target size={16} /> Category
              </label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none disabled:opacity-60"
              >
                <option>Manufacturing</option>
                <option>Wholesale</option>
                <option>Marketing</option>
                <option>Logistics</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} /> Deadline
              </label>
              <input 
                type="date" 
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none disabled:opacity-60" 
              />
            </div>
          </div>

          {/* Budget Field */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} /> Allocated Budget (₹)
            </label>
            <input 
              type="number" 
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder="e.g., 50000"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 outline-none disabled:opacity-60"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
            >
              {isLoading ? 'Launching...' : 'Launch Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;