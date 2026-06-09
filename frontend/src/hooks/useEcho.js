import { useEffect, useRef, useState, useCallback } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

/**
 * Custom hook for managing Laravel Echo connection and listeners
 * Handles:
 * - Echo instance initialization on client-side only
 * - Proper timing and hydration issues
 * - Listener subscription and cleanup
 * - Echo readiness state
 */

// Singleton reference (stored in module scope)
let echoInstance = null;
let isInitializing = false;
const initPromise = new Promise((resolve) => {
  // Only initialize once, on client-side
  if (typeof window !== 'undefined' && !echoInstance && !isInitializing) {
    isInitializing = true;
    window.Pusher = Pusher;

    console.log('%c[Echo Init] Initializing with authEndpoint...', 'color: #2196f3; font-weight: bold;');

    echoInstance = new Echo({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      
      // 🚀 CRITICAL: This tells Echo where to get auth signatures for private channels
      authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
      
      // 🔐 Auth callback - called when Echo needs to auth a private channel subscription
      auth: {
        headers: {
          get Authorization() {
            const token = localStorage.getItem('access_token');
            const authHeader = token ? `Bearer ${token}` : '';
            console.log('%c[Echo Auth] 🔐 Getting Authorization header:', 'color: #ff9800; font-weight: bold;', authHeader ? 'Token found ✓' : 'NO TOKEN ✗');
            return authHeader;
          }
        }
      }
    });

    // Set global reference
    window.Echo = echoInstance;
    console.log('%c[Echo Init] ✅ Echo initialized', 'color: #4caf50; font-weight: bold;');
    resolve(echoInstance);
  } else if (echoInstance) {
    resolve(echoInstance);
  } else {
    resolve(null);
  }
});

export function useEcho() {
  const [echo, setEcho] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize echo on mount (client-side only)
    initPromise.then((instance) => {
      setEcho(instance);
      setIsReady(!!instance);
    });
  }, []);

  return { echo, isReady };
}

/**
 * Hook for subscribing to Echo channel and listener
 * 
 * @param {string} channelName - Channel name (e.g., 'project.1')
 * @param {string} eventName - Event name (e.g., 'TaskUpdated')
 * @param {function} callback - Callback function when event fires
 * @param {boolean} isEnabled - Whether to enable the subscription
 * 
 * @returns {object} { isSubscribed, error, isReady, eventCount, lastEventTime }
 */
export function useEchoListener(channelName, eventName, callback, isEnabled = true) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [lastEventTime, setLastEventTime] = useState(null);
  const [setupId, setSetupId] = useState(0); // Track how many times we set up
  
  // Store references to clean up properly
  const channelRef = useRef(null);
  const listenerRef = useRef(null);
  const callbackRef = useRef(callback);
  const setupCountRef = useRef(0);

  const { echo, isReady } = useEcho();

  // Always keep callback ref in sync
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Main setup effect - only depends on primitives + isReady
  useEffect(() => {
    // Guard checks
    if (!isReady) {
      console.log(`%c[useEchoListener] ⏳ Waiting for Echo to initialize`, 'color: #ff9800; font-weight: bold;');
      return;
    }

    if (!echo) {
      console.error(`%c[useEchoListener] ❌ Echo not initialized despite isReady=true`, 'color: #f44336; font-weight: bold;');
      setError(new Error('Echo instance not available'));
      return;
    }

    if (!channelName) {
      console.log(`%c[useEchoListener] ⏳ Channel name not ready`, 'color: #ff9800; font-weight: bold;');
      return;
    }

    if (!eventName) {
      console.log(`%c[useEchoListener] ⏳ Event name not ready`, 'color: #ff9800; font-weight: bold;');
      return;
    }

    if (!isEnabled) {
      console.log(`%c[useEchoListener] 🔇 Listener disabled for ${channelName}`, 'color: #9c27b0; font-weight: bold;');
      setIsSubscribed(false);
      return;
    }

    if (!callbackRef.current) {
      console.error(`%c[useEchoListener] ❌ Callback is undefined`, 'color: #f44336; font-weight: bold;');
      setError(new Error('Callback is missing'));
      return;
    }

    setupCountRef.current += 1;
    const currentSetupId = setupCountRef.current;
    console.log(`%c[useEchoListener] Setup #${currentSetupId} for ${channelName}:${eventName}`, 'color: #2196f3; font-weight: bold;');
    setSetupId(currentSetupId);

    try {
      // Check if already subscribed to this channel
      const isAlreadySubscribed = !!(echo?.channels && echo.channels[channelName]);
      
      if (isAlreadySubscribed) {
        console.log(`%c[useEchoListener] 📌 Reusing existing channel: ${channelName}`, 'color: #8bc34a;');
        channelRef.current = echo.channels[channelName];
      } else {
        console.log(`%c[useEchoListener] 📡 Creating new channel: ${channelName}`, 'color: #00bcd4;');
        channelRef.current = echo.channel(channelName);
      }

      // Create listener function that calls callback
      const listener = (event) => {
        const timestamp = new Date().toLocaleTimeString();
        const eventLogStyle = 'color: #00ff00; font-weight: bold; background: #000; padding: 4px 8px; border-radius: 3px;';
        
        console.log(
          `%c[ECHO EVENT #${setupId}] ${timestamp} - ${channelName}:${eventName}`,
          eventLogStyle,
          event
        );

        // Update event tracking
        setEventCount(prev => prev + 1);
        setLastEventTime(new Date());

        // Call the callback with error handling
        try {
          console.log(`%c[useEchoListener] 📞 Calling callback with event`, 'color: #ffc107; font-weight: bold;', event);
          callbackRef.current(event);
          console.log(`%c[useEchoListener] ✓ Callback executed successfully`, 'color: #00ff00; font-weight: bold;');
        } catch (err) {
          console.error(
            `%c[useEchoListener] ❌ Callback error in setup #${setupId}:`,
            'color: #f44336; font-weight: bold;',
            err
          );
          setError(err);
        }
      };

      // Attach the listener
      console.log(`%c[useEchoListener] 🔗 Attaching listener for event: ${eventName}`, 'color: #4caf50; font-weight: bold;');
      channelRef.current.listen(eventName, listener);
      
      listenerRef.current = { 
        channelName, 
        eventName, 
        listener,
        setupId: currentSetupId 
      };
      
      setIsSubscribed(true);
      setError(null);
      
      console.log(
        `%c[useEchoListener] ✅ READY - Listening on ${channelName}:${eventName}`,
        'color: #4caf50; font-weight: bold; font-size: 12px; padding: 4px 8px; background: #f1f8e9; border-radius: 3px;'
      );

      // Expose debug info
      if (!window.__echoDebug) {
        window.__echoDebug = {};
      }
      window.__echoDebug[`${channelName}:${eventName}`] = {
        subscribed: true,
        channelName,
        eventName,
        eventCount: 0,
        lastEventTime: null,
        setupId: currentSetupId,
        callbackExists: !!callbackRef.current
      };

    } catch (err) {
      console.error(
        `%c[useEchoListener] ❌ Setup error in setup #${setupCountRef.current}:`,
        'color: #f44336; font-weight: bold;',
        err
      );
      setError(err);
      setIsSubscribed(false);
    }

    // Cleanup function
    return () => {
      console.log(
        `%c[useEchoListener] 🧹 Cleanup triggered for setup #${currentSetupId} (${channelName}:${eventName})`,
        'color: #ff6f00; font-weight: bold;'
      );

      if (channelRef.current && listenerRef.current?.setupId === currentSetupId) {
        try {
          console.log(`%c[useEchoListener] 🚪 Leaving channel: ${channelName}`, 'color: #f44336;');
          echo.leaveChannel(channelName);
          channelRef.current = null;
          listenerRef.current = null;
          setIsSubscribed(false);
          
          if (window.__echoDebug && window.__echoDebug[`${channelName}:${eventName}`]) {
            window.__echoDebug[`${channelName}:${eventName}`].subscribed = false;
          }
        } catch (err) {
          console.error(
            `%c[useEchoListener] ❌ Cleanup error:`,
            'color: #f44336; font-weight: bold;',
            err
          );
        }
      } else {
        console.log(
          `%c[useEchoListener] ⏭️  Skipping cleanup - newer setup already active`,
          'color: #9c27b0; font-weight: bold;'
        );
      }
    };
  }, [isReady, channelName, eventName, isEnabled]);

  return { isSubscribed, error, isReady, eventCount, lastEventTime, setupId };
}

