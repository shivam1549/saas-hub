"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useEchoListener, useEcho } from '@/hooks/useEcho';
import { X, Send, RotateCcw } from 'lucide-react';

/**
 * Cross-Window Sync Tester
 * Helps verify that events are being received and processed in multiple windows
 * 
 * Usage: Add to your projects page or layout for debugging:
 * <CrossWindowSyncTester projectId={projectId} />
 */
export default function CrossWindowSyncTester({ projectId, isOpen = false }) {
  const [open, setOpen] = useState(isOpen);
  const [testEvents, setTestEvents] = useState([]);
  const [windowId] = useState(() => Math.random().toString(36).substring(7));
  const [taskUpdates, setTaskUpdates] = useState([]);

  const { echo, isReady } = useEcho();

  // Handler for real task updates
  const handleTaskUpdated = useCallback((event) => {
    const entry = {
      id: Date.now(),
      type: 'REAL_EVENT',
      timestamp: new Date().toLocaleTimeString(),
      data: event,
      windowId,
    };
    setTaskUpdates(prev => [entry, ...prev].slice(0, 20)); // Keep last 20
    console.log(`[Window ${windowId}] Real event received:`, event);
  }, [windowId]);

  // Subscribe to real events
  const { isSubscribed } = useEchoListener(
    `project.${projectId}`,
    'TaskUpdated',
    handleTaskUpdated,
    !!projectId
  );

  // Add test event entry
  const addTestEvent = (message, type = 'info') => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
      windowId,
    };
    setTestEvents(prev => [entry, ...prev].slice(0, 20)); // Keep last 20
  };

  // Simulate triggering event from THIS window (for testing)
  const simulateTaskUpdate = () => {
    if (echo) {
      const fakeEvent = {
        task: {
          id: Math.floor(Math.random() * 1000),
          title: `Test Task ${Date.now()}`,
          status: ['todo', 'in_progress', 'done'][Math.floor(Math.random() * 3)],
          updated_at: new Date().toISOString(),
        }
      };
      
      console.log(`[Window ${windowId}] Simulating event:`, fakeEvent);
      addTestEvent(`Simulated TaskUpdated event: Task #${fakeEvent.task.id}`, 'test');
      
      // This will NOT actually broadcast - it's just for UI testing
      // For real testing, trigger event from Laravel
    }
  };

  // Clear history
  const clearHistory = () => {
    setTestEvents([]);
    setTaskUpdates([]);
    addTestEvent('History cleared', 'info');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition-all"
      >
        🧪 Cross-Window Tester
      </button>
    );
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-96 bg-white rounded-lg shadow-2xl border-2 border-purple-300">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧪</span>
          <div>
            <h3 className="font-bold">Cross-Window Sync Tester</h3>
            <p className="text-xs opacity-75">Window ID: {windowId}</p>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Status */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className={`p-2 rounded ${isReady ? 'bg-green-100' : 'bg-amber-100'}`}>
            <p className="text-xs font-semibold text-gray-600">Echo Status</p>
            <p className={isReady ? 'text-green-700 font-bold' : 'text-amber-700 font-bold'}>
              {isReady ? '✓ Ready' : '⏳ Connecting'}
            </p>
          </div>
          <div className={`p-2 rounded ${isSubscribed ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="text-xs font-semibold text-gray-600">Subscription</p>
            <p className={isSubscribed ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
              {isSubscribed ? '✓ Active' : '✕ Inactive'}
            </p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="flex gap-2">
          <button
            onClick={simulateTaskUpdate}
            disabled={!isReady}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-3 py-2 rounded text-sm font-semibold transition-all"
          >
            <Send size={16} />
            Simulate Event
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 bg-slate-300 hover:bg-slate-400 text-slate-700 px-3 py-2 rounded text-sm font-semibold transition-all"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Real Events */}
        {taskUpdates.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-2">📡 REAL EVENTS RECEIVED</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-green-50 p-2 rounded border border-green-200">
              {taskUpdates.map(event => (
                <div key={event.id} className="text-xs font-mono bg-white p-1 rounded border border-green-100">
                  <p className="text-green-700 font-bold">{event.timestamp}</p>
                  <p className="text-green-600 truncate">
                    Task #{event.data.task?.id}: {event.data.task?.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Events */}
        {testEvents.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-600 mb-2">🔬 TEST EVENTS</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2 rounded border border-slate-200">
              {testEvents.map(event => (
                <div key={event.id} className={`text-xs font-mono p-1 rounded border ${
                  event.type === 'test' ? 'bg-blue-50 border-blue-100' :
                  event.type === 'error' ? 'bg-red-50 border-red-100' :
                  'bg-white border-slate-100'
                }`}>
                  <p className={`font-bold ${
                    event.type === 'test' ? 'text-blue-700' :
                    event.type === 'error' ? 'text-red-700' :
                    'text-gray-600'
                  }`}>
                    {event.timestamp}
                  </p>
                  <p className="truncate">{event.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-xs text-blue-700">
          <p className="font-bold mb-1">💡 How to test:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Open this project in 2+ browser windows/tabs</li>
            <li>In Window A, drag a task to another column</li>
            <li>Watch Window B - it should update automatically</li>
            <li>Real events appear in green section above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
