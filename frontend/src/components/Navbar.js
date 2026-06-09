import React from 'react';
import { Bell, Search, User, ChevronDown, HelpCircle } from 'lucide-react';
import NotificationBell from '@/components/NotificationBell'; // Adjust the path if needed

const Navbar = () => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
      {/* Left: Project Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="text-slate-500 hover:text-blue-600 cursor-pointer transition-colors">Development Team</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-900">Sprint Planning</span>
      </div>

      {/* Center: Search Bar (Essential for Senior UX) */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks, docs, or people..." 
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
       <NotificationBell />
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <HelpCircle size={20} />
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <button className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-900 leading-tight">John Doe</p>
            <p className="text-[10px] text-slate-500 leading-tight">Admin</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;