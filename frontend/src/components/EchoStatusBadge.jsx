"use client";
import React, { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Echo Status Badge Component
 * Shows real-time subscription status for debugging
 * Place this in your app/layout.js or main component
 */
export default function EchoStatusBadge() {
  const [status, setStatus] = useState('connecting');
  const [channelName, setChannelName] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Get status from window
    const checkStatus = () => {
      if (!window.Echo) {
        setStatus('disconnected');
        return;
      }

      if (window.Echo.connector?.socket?.connected) {
        setStatus('connected');
      } else {
        setStatus('connecting');
      }

      // Show subscribed channels
      const channels = Object.keys(window.Echo.channels || {});
      if (channels.length > 0) {
        setChannelName(channels[0]);
      }
    };

    // Check immediately and every second
    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    // Log subscription events
    const originalListen = window.Echo?.channel.bind(window.Echo);
    if (window.Echo && originalListen) {
      window.Echo.channel = function(name) {
        console.log(`[EchoStatusBadge] Subscribing to channel: ${name}`);
        setChannelName(name);
        return originalListen(name);
      };
    }

    return () => clearInterval(interval);
  }, []);

  const statusConfig = {
    connected: { color: 'bg-green-100', icon: '✓', text: 'Connected', textColor: 'text-green-700' },
    connecting: { color: 'bg-amber-100', icon: '⟳', text: 'Connecting', textColor: 'text-amber-700' },
    disconnected: { color: 'bg-red-100', icon: '✕', text: 'Disconnected', textColor: 'text-red-700' },
  };

  const config = statusConfig[status];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full ${config.color} shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all`}
        title="Echo Connection Status"
      >
        <span className={`${config.textColor} font-bold text-lg`}>{config.icon}</span>
      </button>

      {/* Status panel */}
      {isVisible && (
        <div className={`fixed bottom-20 right-4 z-50 w-80 ${config.color} border-2 border-current rounded-lg p-4 shadow-xl`}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${
              status === 'connected' ? 'bg-green-500' :
              status === 'connecting' ? 'bg-amber-500' :
              'bg-red-500'
            }`}></div>
            <span className={`font-bold ${config.textColor}`}>Echo {config.text}</span>
          </div>

          {channelName && (
            <div className="text-sm mb-3">
              <div className="font-semibold">Active Channel:</div>
              <code className="bg-white bg-opacity-50 px-2 py-1 rounded text-xs">{channelName}</code>
            </div>
          )}

          {status === 'connected' && (
            <div className="text-xs mt-3 p-2 bg-white bg-opacity-50 rounded">
              ✓ Ready to receive real-time updates
              <br />
              <span className="text-gray-600">This tab will sync with other windows</span>
            </div>
          )}

          {status === 'connecting' && (
            <div className="text-xs mt-3 p-2 bg-white bg-opacity-50 rounded">
              ⟳ Waiting for connection...
              <br />
              <span className="text-gray-600">Please wait, connecting to Pusher</span>
            </div>
          )}

          {status === 'disconnected' && (
            <div className="text-xs mt-3 p-2 bg-white bg-opacity-50 rounded">
              ✕ Echo not initialized
              <br />
              <span className="text-gray-600">Check browser console for errors</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
