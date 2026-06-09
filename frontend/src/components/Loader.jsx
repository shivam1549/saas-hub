import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ text = "Signing you in..." }) {
  return (
    // The fixed overlay with a slight blur effect
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      
    
      <div className="bg-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100">
        <Loader2 className="animate-spin text-blue-600" size={28} />
        <span className="text-slate-800 font-semibold">{text}</span>
      </div>
      
    </div>
  );
}