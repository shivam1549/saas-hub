"use client"; // 1. Must be a client component to use hooks

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 2. Import the hook
import { LayoutDashboard, Layers, Users, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname(); // 3. Get the current URL path

  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
      {/* Logo Section */}
      <div className="p-6 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Layers className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">CollabHub</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={pathname === '/dashboard'} 
        />
        <NavItem 
          href="/projects/1" 
          icon={<Layers size={20} />} 
          label="Active Project" 
          active={pathname.includes('/projects')} 
        />
        <NavItem 
          href="/team" 
          icon={<Users size={20} />} 
          label="My Team" 
          active={pathname === '/team'} 
        />
        <NavItem 
          href="/settings" 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={pathname === '/settings'} 
        />
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all font-medium text-sm">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

// Internal Helper Component
const NavItem = ({ href, icon, label, active }) => (
  <Link 
    href={href}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${active 
        ? 'bg-blue-600/10 text-blue-500 font-bold' 
        : 'hover:bg-slate-800 hover:text-white text-slate-400'}
    `}
  >
    <span className={`${active ? 'text-blue-500' : 'group-hover:text-white'}`}>
      {icon}
    </span>
    <span className="text-sm">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
  </Link>
);

export default Sidebar;