import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, MessageSquare, UserPlus } from 'lucide-react';
import api from '@/api/axios';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };
    fetchNotifications();
    
    // Optional: Poll every 30 seconds for new alerts
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      // Remove it from the local state
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getIcon = (type) => {
    if (type === 'urgent') return <AlertCircle size={16} className="text-red-500" />;
    if (type === 'comment') return <MessageSquare size={16} className="text-blue-500" />;
    return <UserPlus size={16} className="text-emerald-500" />; // default assigned
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
      >
        <Bell size={20} />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">
              {notifications.length} New
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                You're all caught up!
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer" onClick={() => markAsRead(n.id)}>
                  <div className="mt-0.5 shrink-0">
                    {getIcon(n.data.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{n.data.message}</p>
                    <p className="text-xs text-slate-400 mt-1">Task: {n.data.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}