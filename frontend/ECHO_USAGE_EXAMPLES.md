# useEcho Hook - Usage Examples

## Quick Start

### Basic Usage in a Component

```javascript
"use client";
import { useEchoListener } from '@/hooks/useEcho';
import { useState, useCallback } from 'react';

export default function MyComponent() {
  const [messages, setMessages] = useState([]);
  
  const handleNewMessage = useCallback((event) => {
    console.log("New message:", event.message);
    setMessages(prev => [...prev, event.message]);
  }, []);

  const { isSubscribed, error, isReady } = useEchoListener(
    'chat.room.1',
    'MessageSent',
    handleNewMessage,
    true  // enabled
  );

  return (
    <div>
      <p>Status: {isReady ? 'Connected' : 'Connecting...'}</p>
      <p>Subscribed: {isSubscribed ? '✅' : '❌'}</p>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <ul>
        {messages.map((msg, i) => <li key={i}>{msg}</li>)}
      </ul>
    </div>
  );
}
```

## Advanced Usage

### Multiple Listeners in One Component

```javascript
"use client";
import { useEchoListener } from '@/hooks/useEcho';
import { useState, useCallback } from 'react';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);

  // Listener 1: Task updates
  const handleTaskUpdated = useCallback((event) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === event.task.id ? event.task : task
      )
    );
  }, []);

  // Listener 2: Comments
  const handleCommentAdded = useCallback((event) => {
    setComments(prev => [...prev, event.comment]);
  }, []);

  const taskListener = useEchoListener(
    `project.${projectId}`,
    'TaskUpdated',
    handleTaskUpdated,
    !!projectId
  );

  const commentListener = useEchoListener(
    `project.${projectId}`,
    'CommentAdded',
    handleCommentAdded,
    !!projectId
  );

  return (
    <div>
      <h2>Tasks ({taskListener.isSubscribed ? '✅' : '⏳'})</h2>
      <ul>
        {tasks.map(task => <li key={task.id}>{task.title}</li>)}
      </ul>

      <h2>Comments ({commentListener.isSubscribed ? '✅' : '⏳'})</h2>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
    </div>
  );
}
```

### Conditional Listening

```javascript
"use client";
import { useEchoListener } from '@/hooks/useEcho';
import { useState, useCallback } from 'react';

export default function UserNotifications({ userId, isOpen }) {
  const [notifications, setNotifications] = useState([]);

  const handleNotification = useCallback((event) => {
    setNotifications(prev => [...prev, event.notification]);
  }, []);

  // Only listen when modal is open
  const { isSubscribed } = useEchoListener(
    `user.${userId}`,
    'NotificationReceived',
    handleNotification,
    isOpen  // ← Only enable when open
  );

  return (
    <div>
      <p>Listening: {isSubscribed ? 'Yes' : 'No'}</p>
      {notifications.map(notif => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  );
}
```

### With useEffect for Extra Logic

```javascript
"use client";
import { useEchoListener } from '@/hooks/useEcho';
import { useState, useCallback, useEffect } from 'react';

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleActivityUpdate = useCallback((event) => {
    console.log("Activity received:", event);
    setActivities(prev => [event.activity, ...prev]);
  }, []);

  const { isSubscribed, error, isReady } = useEchoListener(
    'activity-feed',
    'ActivityCreated',
    handleActivityUpdate,
    true
  );

  // Show loading state based on connection
  useEffect(() => {
    setIsLoading(!isReady);
  }, [isReady]);

  // React to connection errors
  useEffect(() => {
    if (error) {
      console.error("Connection error, retrying...");
      // Could implement retry logic here
    }
  }, [error]);

  return (
    <div>
      {isLoading && <p>Connecting to live feed...</p>}
      {error && <p>Connection issues detected</p>}
      {isSubscribed && (
        <div>
          {activities.map(activity => (
            <div key={activity.id}>{activity.message}</div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Converting Existing Code

### Before (Old Pattern - DON'T USE)

```javascript
import echo from '@/api/echo';
import { useEffect } from 'react';

export default function Component() {
  useEffect(() => {
    if (!echo) return;
    
    const channel = echo.channel('project.1');
    channel.listen('TaskUpdated', (event) => {
      console.log(event);
    });
    
    return () => {
      echo.leaveChannel('project.1');
    };
  }, [echo]);  // ← WRONG: echo might be null, object in dependency
}
```

### After (New Pattern - USE THIS)

```javascript
import { useEchoListener } from '@/hooks/useEcho';
import { useCallback } from 'react';

export default function Component() {
  const handleEvent = useCallback((event) => {
    console.log(event);
  }, []);

  useEchoListener(
    'project.1',
    'TaskUpdated',
    handleEvent,
    true
  );
}
```

## Testing the Hook

### Manual Test Component

```javascript
"use client";
import { useEchoListener, useEcho } from '@/hooks/useEcho';
import { useState, useCallback } from 'react';

export default function EchoTestComponent() {
  const { echo, isReady } = useEcho();
  const [testEvents, setTestEvents] = useState([]);

  const handleTestEvent = useCallback((event) => {
    setTestEvents(prev => [
      ...prev,
      { timestamp: new Date(), event }
    ]);
  }, []);

  const { isSubscribed } = useEchoListener(
    'test-channel',
    'TestEvent',
    handleTestEvent,
    true
  );

  const simulateEvent = () => {
    // Manually call handler to test UI update
    handleTestEvent({ data: 'test', timestamp: Date.now() });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h3>Echo Tester</h3>
      <p>Echo Ready: {isReady ? '✅' : '❌'}</p>
      <p>Subscribed: {isSubscribed ? '✅' : '❌'}</p>
      
      <button onClick={simulateEvent}>
        Simulate Event (UI test)
      </button>

      <h4>Events Received:</h4>
      <div style={{ 
        maxHeight: '200px', 
        overflow: 'auto',
        backgroundColor: '#f5f5f5',
        padding: '10px'
      }}>
        {testEvents.map((item, i) => (
          <div key={i} style={{ fontSize: '12px', marginBottom: '5px' }}>
            <strong>{item.timestamp.toLocaleTimeString()}:</strong>{' '}
            {JSON.stringify(item.event)}
          </div>
        ))}
      </div>

      <h4>Debug Info</h4>
      <pre style={{ fontSize: '10px', backgroundColor: '#eee', padding: '10px' }}>
        {echo && {
          channels: Object.keys(echo.channels || {}),
          connected: echo.connector?.socket?.connected
        } ? JSON.stringify({
          channels: Object.keys(echo.channels || {}),
          connected: echo.connector?.socket?.connected
        }, null, 2) : 'Echo not initialized'}
      </pre>
    </div>
  );
}
```

## Best Practices

### ✅ DO

- Use `useCallback` for event handlers to maintain stable reference
- Only enable listeners when you need them (`isEnabled` parameter)
- Check `isReady` before using Echo instance
- Handle errors from the hook
- Use primitive values in dependency arrays (not objects)

### ❌ DON'T

- Pass object/array references directly as dependencies
- Store Echo instance in component state (use the hook)
- Call `.listen()` directly without the hook
- Leave listeners without cleanup (the hook handles this)
- Use the old `import echo from '@/api/echo'` pattern

## Troubleshooting

### "Echo not initialized" warnings

This is normal on first mount. Wait for `isReady === true` before subscribing.

### "Callback error" in console

Your event handler threw an error. Check the full error message after "Callback error:"

### Event received but UI doesn't update

Make sure your callback uses `useState` setters properly:
```javascript
// ✅ Correct
const handleEvent = useCallback((event) => {
  setTasks(prev => [...prev, event.task]);
}, []);

// ❌ Wrong (stale closure)
const handleEvent = (event) => {
  setTasks([...tasks, event.task]); // tasks might be stale
};
```

### Duplicate subscriptions

Each time component renders, a new listener might be attached. Make sure you return cleanup from the hook (it does automatically).
