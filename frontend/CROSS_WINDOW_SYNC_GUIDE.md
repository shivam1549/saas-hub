# Cross-Window Real-Time Sync Guide

## What Should Happen

When you drag a task in **Window A**:
1. **Window A**: Task moves immediately (optimistic update)
2. **Window A**: API call sent to Laravel
3. **Laravel**: Updates database + broadcasts `TaskUpdated` event to channel `project.1`
4. **Window A**: Receives event, confirms state update
5. **Window B**: Receives same event, automatically updates WITHOUT refresh ✅

## How to Verify

### Step 1: Open Both Windows

Open your project in 2 separate browser windows/tabs:
- **Window A**: http://localhost:3000/projects/1
- **Window B**: http://localhost:3000/projects/1 (same project)

### Step 2: Check Connection Status

In both windows, look for the **Echo Status Badge** (bottom-right corner):
- Should show: **✓ Connected** (green)
- Click it to expand and see active channels

If showing **⏳ Connecting** or **✕ Disconnected**:
- Check browser console (F12) for errors
- Verify Pusher credentials in `.env.local`
- Check NEXT_PUBLIC_PUSHER_APP_KEY and NEXT_PUBLIC_PUSHER_APP_CLUSTER

### Step 3: Check Subscription Status

Open the **🧪 Cross-Window Tester** (appears at top-center):
- Should show: **Echo Status: ✓ Ready**
- Should show: **Subscription: ✓ Active**

If inactive:
- Wait 2-3 seconds for Echo to initialize
- Check browser console for `[useEchoListener]` messages

### Step 4: Trigger Event from Window A

In Window A, drag a task:
- From **To-Do** column → **In Progress** column
- Watch both windows simultaneously

### Step 5: Check the Cross-Window Tester

In **Window B**, the tester should show:
```
📡 REAL EVENTS RECEIVED
[timestamp] Task #1: in_progress
```

This confirms Window B received the event from Laravel!

### Step 6: Verify Pusher Debug Console

1. Go to https://dashboard.pusher.com/
2. Select your app
3. Go to "Debug Console" tab
4. You should see:
   ```
   Channel: project.1
   Event: TaskUpdated
   Data: { "task": { "id": 1, "status": "in_progress", ... } }
   ```

## Debugging Checklist

### ✅ Browser Console

Look for these logs (F12 → Console tab):

```
[useEchoListener] Subscribing to project.1 -> TaskUpdated
[useEchoListener] Channel subscribed: project.1
[useEchoListener] ✓ Listener attached for TaskUpdated
[ECHO] Successfully subscribed to project.1
```

When event fires:
```
%c[ECHO EVENT] 14:23:45 - project.1:TaskUpdated
Task {id: 1, status: "in_progress", ...}
```

### ✅ Laravel Broadcast Setup

Verify your `TaskUpdated` event class:

```php
<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TaskUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    public function __construct(Task $task)
    {
        $this->task = $task;
    }

    // ✅ Event name must match frontend listener
    public function broadcastAs()
    {
        return 'TaskUpdated';  // Must match useEchoListener('TaskUpdated')
    }

    // ✅ Channel name must match frontend subscription
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('project.' . $this->task->project_id),
        ];
    }

    // ✅ Broadcast data structure
    public function broadcastWith(): array
    {
        return [
            'task' => $this->task->toArray(),  // Task as array with all fields
        ];
    }
}
```

### ✅ Laravel Route Broadcast Authorization

Ensure your route allows users to access private channels:

```php
// In routes/channels.php
Broadcast::channel('project.{id}', function ($user, $id) {
    // Return true if user can access project {id}
    return $user->projects()->where('id', $id)->exists();
});
```

### ✅ Frontend Event Handler

Your callback in page.js should be updating state properly:

```javascript
const handleTaskUpdated = useCallback((event) => {
    console.log("[ECHO] TaskUpdated event received:", event);
    
    // ✅ Functional update - never stale!
    setTasks(prevTasks =>
        prevTasks.map(task =>
            task.id === event.task.id 
                ? { ...task, ...event.task }  // Update specific task
                : task
        )
    );
}, []);  // No dependencies - always stable
```

## Common Issues & Fixes

### Issue: Event received in Pusher console but NOT in browser

**Cause**: Private channel authorization failed

**Fix**:
1. Check `routes/channels.php` - does it return true for your user?
2. Verify user is logged in (check Laravel auth)
3. Check browser console for auth errors

```php
// Broadcast::channel('project.{id}', function ($user, $id) {
//     dd($user, $id);  // Debug: What's being checked?
// });
```

### Issue: Window B doesn't update even though Pusher shows event

**Cause**: Listener not registered or payload mismatch

**Fix**:
1. Open DevTools (F12) in Window B
2. Look for `[ECHO] TaskUpdated event received:` in console
3. If not there, check subscription status with tester
4. Check payload structure matches what you expect

```javascript
// In page.js, add logging to see payload:
const handleTaskUpdated = useCallback((event) => {
    console.log("EVENT STRUCTURE:", {
        keys: Object.keys(event),
        task: event.task,
        taskKeys: event.task ? Object.keys(event.task) : null,
    });
    setTasks(prevTasks => ...);
}, []);
```

### Issue: Connection works but events never fire

**Cause**: Event name or channel name mismatch

**Fix**: Verify exact names:
```javascript
// Frontend - what are we listening for?
useEchoListener(
    `project.${projectId}`,    // ← Channel name
    'TaskUpdated',              // ← Event name
    handleTaskUpdated,
    !!projectId
);

// Backend - what's being broadcast?
class TaskUpdated implements ShouldBroadcast {
    public function broadcastAs() {
        return 'TaskUpdated';     // ← Must match!
    }
    
    public function broadcastOn(): array {
        return [
            new PrivateChannel('project.' . $this->task->project_id),  // ← Must match!
        ];
    }
}
```

### Issue: Only one window updates, the other doesn't

**Cause**: Event handler using stale state

**Fix**: Always use functional updates:
```javascript
// ❌ WRONG - stale closure
const handler = (event) => {
    setTasks([...tasks, event.task]);  // tasks might be old!
};

// ✅ CORRECT - functional update
const handler = (event) => {
    setTasks(prevTasks => [...prevTasks, event.task]);
};
```

### Issue: Lots of "multiple listeners" console warnings

**Cause**: Listener re-registering too often

**Fix**: The hook handles this, but check that dependencies are stable:
```javascript
// In page.js, make sure callback is wrapped in useCallback
const handleTaskUpdated = useCallback((event) => {
  // ...
}, []);  // Empty deps = never changes
```

## Testing Steps

### Quick Test: Drag Task

1. **Window A**: Drag task from "To-Do" → "In Progress"
2. **Window B**: Should automatically update in real-time
3. **Expected**: No refresh needed!

### Comprehensive Test: Open DevTools in Both

1. **Window A**: F12 → Console
2. **Window B**: F12 → Console
3. **Window A**: Drag task
4. **Window B**: Console should show: `[ECHO] TaskUpdated event received: {...}`

### Browser Network Inspector

1. **Window B**: F12 → Network → Filter "ws" (WebSocket)
2. Look for `pusher.com` connection
3. Click Messages tab
4. When **Window A** updates, look for message like:
```json
{
  "event": "project.1",
  "data": { "task": { "id": 1, ... } }
}
```

## Multi-Tab Test Script

To test with multiple projects simultaneously:

1. Open **Project 1** in Window A
2. Open **Project 1** in Window B
3. Open **Project 2** in Window C
4. Drag task in Window A (Project 1)
   - Window B should update immediately
   - Window C should stay unchanged (different project)
5. Drag task in Window C (Project 2)
   - Window A and B stay unchanged
   - Only same project channels receive events

This confirms channel isolation is working!

## Status Badge Indicators

| Badge | Meaning | Action |
|-------|---------|--------|
| 🟢 Connected | Echo initialized | Ready to sync |
| 🟡 Connecting | Waiting for Pusher | Wait 2-3 seconds |
| 🔴 Disconnected | Not initialized | Check console errors |

## Tester Component Guide

The **🧪 Cross-Window Tester** shows:

| Section | What It Shows |
|---------|--------------|
| **Echo Status** | Is Echo initialized? |
| **Subscription** | Is listener active for this channel? |
| **📡 Real Events** | Events received in **green** |
| **🔬 Test Events** | Simulation results in **blue** |

## Next Steps if Still Not Working

1. **Check Laravel logs**:
   ```bash
   tail -f storage/logs/laravel.log
   ```
   Look for broadcast errors

2. **Enable Pusher debug mode**:
   ```javascript
   // In useEcho.js
   Pusher.logToConsole = true;
   ```

3. **Test with tinker**:
   ```bash
   php artisan tinker
   >>> $task = Task::find(1);
   >>> event(new \App\Events\TaskUpdated($task));
   ```

4. **Check Pusher credentials**:
   - Go to https://dashboard.pusher.com/
   - Verify APP_ID, KEY, SECRET in `.env`
   - Verify CLUSTER matches

5. **Enable CORS if needed**:
   ```javascript
   // In useEcho.js
   cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
   forceTLS: true,
   enabledTransports: ['ws', 'wss'],  // Add this
   ```
