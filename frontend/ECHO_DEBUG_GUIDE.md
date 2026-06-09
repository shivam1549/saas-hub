# Echo + Pusher Debugging Checklist

## ✅ What Was Fixed

### 1. **Null Export Issue**
- ❌ OLD: `echo.js` exported `null` due to SSR
- ✅ NEW: `useEcho()` hook handles client-side initialization properly

### 2. **Echo Instance Lifecycle**
- ❌ OLD: Single export captured at module load (stale)
- ✅ NEW: Module-level singleton ensures only ONE Echo instance, initialized once on client

### 3. **Stale Closures & Dependencies**
- ❌ OLD: `useEffect([projectId, echo])` - echo is mutable object in dependency array
- ✅ NEW: Dependency array only uses primitive values `[projectId]` via internal hook

### 4. **Listener Storage & Cleanup**
- ❌ OLD: Listener not stored, just `.listen()` called and forgotten
- ✅ NEW: Listener tracked, proper cleanup in return function

### 5. **Echo Readiness**
- ❌ OLD: No way to know if Echo was ready
- ✅ NEW: `isReady` state tells you when Echo is initialized

### 6. **Callback State Updates**
- ❌ OLD: No callback to update UI on event
- ✅ NEW: `useCallback()` with proper dependencies ensures stable callback

## 🔍 Verification Steps

### Step 1: Verify Event Name Matches Exactly

**In your Laravel Broadcaster:**
```php
// Check the exact event name being broadcast
// Should match 'TaskUpdated' exactly (case-sensitive!)
broadcast(new TaskUpdated($task));
```

**In useEchoListener call:**
```javascript
useEchoListener(
    `project.${projectId}`,
    'TaskUpdated',  // ← Must match EXACTLY
    handleTaskUpdated,
    !!projectId
);
```

### Step 2: Verify Event Payload Structure

When Laravel broadcasts, the payload should match what you're expecting:

```javascript
// In your callback handler:
const handleTaskUpdated = useCallback((event) => {
    console.log("Full event object:", event);
    console.log("Event keys:", Object.keys(event));
    console.log("Event.task:", event.task);  // Check if this exists
    // The payload structure depends on your Laravel broadcast
}, []);
```

**Common payload structure:**
```javascript
{
    task: {
        id: 1,
        title: "Task Title",
        status: "in_progress",
        // ... other task fields
    }
}
```

### Step 3: Verify Channel Name Format

**In your code:**
```javascript
// Channel name format: project.{projectId}
const channelName = `project.${projectId}`;
console.log("Subscribing to channel:", channelName);
// Should print: Subscribing to channel: project.1
```

**In Laravel, this should match:**
```php
// In your Event class
public function broadcastOn(): array
{
    return [
        new PrivateChannel('project.' . $this->task->project_id),
    ];
}
```

### Step 4: Check Browser Console for Errors

Open DevTools Console (F12) and look for:

```
[useEchoListener] Subscribing to project.1 -> TaskUpdated
[useEchoListener] Channel subscribed: project.1
[useEchoListener] Listener attached for TaskUpdated
```

If you see warnings or errors, the hook logs them:
```
[useEchoListener] Not ready yet for project.1
[useEchoListener] Setup error: ...
```

### Step 5: Check Network / Pusher Debug

1. **Pusher Debug Console:**
   - Go to https://dashboard.pusher.com/
   - Select your app
   - Click "Debug Console" tab
   - You should see:
     ```
     Channel: project.1
     Event: TaskUpdated
     Data: { ... }
     ```

2. **Browser Network Tab (F12 → Network):**
   - Filter by "ws" (WebSocket)
   - Look for Pusher connection
   - Should show connected state

3. **Browser WebSocket Messages:**
   - In DevTools, go to Network → find pusher.com WebSocket
   - Click on "Messages" tab
   - You should see subscribe confirmations:
     ```json
     {
       "event": "pusher_internal:subscription_succeeded",
       "channel": "project.1",
       "data": "{}"
     }
     ```

## 🐛 If Callbacks Still Not Firing

### Issue: Echo not connected
```javascript
// Add this to check Echo status:
import { useEcho } from '@/hooks/useEcho';

// In component:
const { echo, isReady } = useEcho();

useEffect(() => {
    if (echo) {
        console.log("Echo connection state:", echo.connector.socket.connected);
        console.log("Echo channels:", Object.keys(echo.channels));
    }
}, [echo]);
```

### Issue: Wrong event name
```javascript
// In Laravel, check the broadcast event class name matches:
// Event class name: TaskUpdated
// .listen('TaskUpdated')  ← Must match

// Check your Laravel event:
class TaskUpdated implements ShouldBroadcast {
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function broadcastAs()
    {
        return 'TaskUpdated'; // ← Explicit name
    }
}
```

### Issue: Wrong channel name
```javascript
// Verify channel name matches EXACTLY:
// Laravel: new PrivateChannel('project.1')
// Frontend: echo.channel('project.1')

// Check your Laravel event:
public function broadcastOn(): array
{
    return [
        new PrivateChannel('project.' . $this->task->project_id),
    ];
}
```

### Issue: Channel requires auth
If using PrivateChannel, verify auth:
```javascript
// In your Laravel route:
Broadcast::channel('project.{id}', function ($user, $id) {
    // Return true if user can access this channel
    return $user->projects()->where('id', $id)->exists();
});
```

## 🧪 Quick Test

Add this temporary test to trigger an event:

```javascript
// In your component, add a test button:
<button onClick={() => {
    console.log("Testing Echo...");
    const channel = echo?.channel(`project.${projectId}`);
    if (channel) {
        console.log("Channel:", channel);
        // Manually fire event for testing
        channel.listen('TaskUpdated', (e) => {
            console.log("Manual test received:", e);
        });
    }
}}>
    Test Echo
</button>
```

Then from Laravel (via tinker or artisan):
```bash
php artisan tinker
>>> event(new App\Events\TaskUpdated($task));
```

## 📋 Hook API Reference

### `useEcho()`
Returns: `{ echo, isReady }`
- `echo`: Echo instance or null
- `isReady`: Boolean, true when Echo is initialized

### `useEchoListener(channelName, eventName, callback, isEnabled)`
Returns: `{ isSubscribed, error, isReady }`
- `channelName`: string - Channel to subscribe to
- `eventName`: string - Event to listen for
- `callback`: function - Called when event fires (closure-safe)
- `isEnabled`: boolean - Enable/disable subscription
