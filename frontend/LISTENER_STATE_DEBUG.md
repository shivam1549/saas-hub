# Deep Debugging Guide - Listener/Lifecycle/State Issues

## Expected Console Output (When Everything Works)

### Step 1: Component Mounts
```
[2196f3] useEcho() initializing...
[2196f3] Echo initialization promise created
```

### Step 2: Echo Initializes (1-2 seconds after page load)
```
[00ff00] Echo initialized successfully
[2196f3] useEcho() hook setting echo state
```

### Step 3: Listener Setup Begins
```
[2196f3] [useEchoListener] ⏳ Waiting for Echo to initialize
(repeat 1-2 times until Echo is ready)

[2196f3] [useEchoListener] Setup #1 for project.1:TaskUpdated
[00bcd4] [useEchoListener] 📡 Creating new channel: project.1
[4caf50] [useEchoListener] 🔗 Attaching listener for event: TaskUpdated
[4caf50] [useEchoListener] ✅ READY - Listening on project.1:TaskUpdated
```

### Step 4: Window A - Drag Task
In Window A console:
```
[4caf50] handleDragEnd called for task #1
[purple] [useEchoListener] 📞 Calling callback with event
[ff9800] [Page] 📨 TaskUpdated callback fired at 14:23:45
[00bcd4] [Page] 🔍 Updating task #1
[00bcd4] [Page] ✓ Found task #1, updating status from "todo" to "in_progress"
[4caf50] [Page] ✅ State update confirmed - task #1 changed
```

### Step 5: Window B - Receives Event (No Manual Action)
In Window B console, you should automatically see:
```
[00ff00] [ECHO EVENT #1] 14:23:45 - project.1:TaskUpdated
{ task: { id: 1, status: "in_progress", ... } }

[purple] [useEchoListener] 📞 Calling callback with event
[ff9800] [Page] 📨 TaskUpdated callback fired at 14:23:45
[00bcd4] [Page] 🔍 Updating task #1
[00bcd4] [Page] ✓ Found task #1, updating status from "todo" to "in_progress"
[4caf50] [Page] ✅ State update confirmed - task #1 changed
```

If you see this, **the sync is working!** ✅

---

## Diagnosing Problems

### Problem 1: Listener Not Setting Up

**What you see:**
```
[2196f3] [useEchoListener] ⏳ Waiting for Echo to initialize
(stays like this forever)
```

**Causes:**
1. Echo didn't initialize
2. `projectId` is undefined
3. Channel/Event name is missing

**How to fix:**
1. Check F12 → Console for Echo initialization errors
2. Check that URL has `?id=1` or correct project ID
3. Verify `projectId` is being extracted from `useParams()`

```javascript
// Add this to page.js temporarily for debugging:
useEffect(() => {
  console.log("Current projectId:", projectId);
}, [projectId]);
```

---

### Problem 2: Callback Not Firing

**What you see:**
```
[4caf50] [useEchoListener] ✅ READY - Listening on project.1:TaskUpdated
(but when you drag in Window A, nothing appears in Window B console)
```

**Causes:**
1. Event not being broadcast from Laravel
2. Wrong event name in Laravel
3. Wrong channel name in Laravel
4. Authorization denied for channel

**How to fix:**

1. **Check Pusher Console** at https://dashboard.pusher.com/:
   - Go to Debug Console
   - You should see event appear when you drag
   - If NOT, issue is in Laravel broadcast

2. **Check Laravel Event Class**:
```php
class TaskUpdated implements ShouldBroadcast {
    public function broadcastAs() {
        return 'TaskUpdated';  // ← Must match frontend
    }
    
    public function broadcastOn(): array {
        return [
            new PrivateChannel('project.' . $this->task->project_id),  // ← Must match
        ];
    }
    
    public function broadcastWith(): array {
        return [
            'task' => $this->task->toArray(),  // ← task property required
        ];
    }
}
```

3. **Check Laravel Route Auth**:
```php
// routes/channels.php
Broadcast::channel('project.{id}', function ($user, $id) {
    // Must return true for your user
    return $user->projects()->where('id', $id)->exists();
});
```

---

### Problem 3: Callback Fires But State Not Updating

**What you see:**
```
[ff9800] [Page] 📨 TaskUpdated callback fired at 14:23:45
[00bcd4] [Page] 🔍 Updating task #1
[ff6f00] [Page] ⚠️  State update may not have changed anything
```

**Causes:**
1. Task ID doesn't match
2. Event payload structure is wrong
3. Task not found in state array

**How to fix:**

1. **Check event structure** - Look at what arrives:
```
[00ff00] [ECHO EVENT] 14:23:45 - project.1:TaskUpdated
{ task: { id: 1, status: "in_progress", ... } }  ← Check this
```

If you see:
- `event.task` is undefined → Laravel not sending correct payload
- `event.task.id` is undefined → Task doesn't have ID field
- `event.task.id` is a string → Might not match integer ID in state

2. **Fix payload in Laravel**:
```php
public function broadcastWith(): array {
    return [
        'task' => [
            'id' => (int) $this->task->id,  // ← Ensure integer
            'status' => $this->task->status,
            'title' => $this->task->title,
            // ... other fields
        ],
    ];
}
```

3. **Check state ID types** - In Window B console, when task updates, check:
```javascript
console.log("Looking for task id:", event.task.id, "type:", typeof event.task.id);
console.log("Tasks in state:", tasks.map(t => ({ id: t.id, type: typeof t.id })));
```

---

### Problem 4: Listener Re-attaching Too Many Times

**What you see:**
```
[2196f3] Setup #1 for project.1:TaskUpdated
[2196f3] Setup #2 for project.1:TaskUpdated
[2196f3] Setup #3 for project.1:TaskUpdated
(keeps incrementing)
```

**Causes:**
1. Dependencies are changing too often
2. Component re-rendering unnecessarily
3. Echo object reference changing

**How to fix:**

Check the console for cleanup logs:
```
[ff6f00] 🧹 Cleanup triggered for setup #1
[ff6f00] 🚪 Leaving channel: project.1
```

If cleanup is happening right after setup, one of these is changing:
- `projectId`
- `isReady` 
- `isEnabled` (probably `!!projectId`)

Add temporary logging:
```javascript
useEffect(() => {
  console.log("Dependencies changed:", {
    projectId,
    listenerId: useId(), // Unique per render
  });
}, [projectId]);
```

---

## Testing Checklist

### ✅ Window A Tests

1. **Drag task from To-Do → In Progress**
   - Look for: `[ff9800] [Page] 📨 TaskUpdated callback fired` in console
   - Task should move immediately in Window A

2. **Check API call succeeded**
   - Look in Network tab (F12 → Network)
   - Should see: `PUT /api/tasks/1` with status 200

3. **Check Pusher received it**
   - Go to https://dashboard.pusher.com/ Debug Console
   - Should see: `Channel: project.1`, `Event: TaskUpdated`

### ✅ Window B Tests

1. **Check listener is subscribed**
   - Console should show: `[4caf50] ✅ READY - Listening on project.1:TaskUpdated`
   - If not, check step 1 in "Problem 1" above

2. **When Window A updates, check for event**
   - Look for: `[00ff00] [ECHO EVENT] ... project.1:TaskUpdated` in Window B console
   - If NOT there → Event not arriving (Laravel issue)
   - If YES → proceed to step 3

3. **Check callback fires**
   - Look for: `[ff9800] [Page] 📨 TaskUpdated callback fired` in Window B console
   - If NOT there → Callback not being called (hook issue)
   - If YES → proceed to step 4

4. **Check state updates**
   - Look for: `[4caf50] ✅ State update confirmed` in Window B console
   - If YES → Check if UI updated (sometimes console shows success but UI doesn't)
   - If NO → Task ID doesn't match (see "Problem 3")

---

## Manual Testing with Tinker

Test the broadcast directly from Laravel:

```bash
php artisan tinker

# Get a task
$task = App\Models\Task::find(1);

# Broadcast the event
event(new App\Events\TaskUpdated($task));

# Check Pusher Dashboard → Debug Console, you should see the event
```

Now both windows should show the event in their console.

---

## Debug Window Variable

The hook exposes debug info to `window.__echoDebug`:

```javascript
// In browser console:
console.log(window.__echoDebug);

// Output:
{
  "project.1:TaskUpdated": {
    subscribed: true,
    channelName: "project.1",
    eventName: "TaskUpdated",
    eventCount: 5,
    lastEventTime: Date,
    setupId: 1,
    callbackExists: true
  }
}
```

Check:
- `subscribed: true` ← Listener active?
- `eventCount > 0` ← Events received?
- `callbackExists: true` ← Callback present?

---

## Color Guide for Console

| Color | Meaning |
|-------|---------|
| 🔴 Red (`#f44336`) | Error |
| 🟠 Orange (`#ff9800`) | Warning / Setup step |
| 🟡 Amber (`#ffc107`) | Loading / Pending |
| 🟢 Green (`#4caf50`) | Success |
| 🔵 Blue (`#2196f3`) | Info / Debug |
| 🟦 Cyan (`#00bcd4`) | Data update |
| 🟪 Purple (`#9c27b0`) | Edge case |

---

## Quick Debug Script

Paste this in browser console to see status:

```javascript
const debug = window.__echoDebug;
console.log("=== ECHO DEBUG INFO ===");
Object.entries(debug).forEach(([key, val]) => {
  console.log(`${key}:`, {
    subscribed: val.subscribed,
    events: val.eventCount,
    lastTime: val.lastEventTime,
    callbackReady: val.callbackExists
  });
});
console.log("=== END ===");
```

---

## Still Not Working?

1. **Open both windows side-by-side**
2. **F12 in each → Console tab**
3. **Filter console to show [Page] and [ECHO] messages**
4. **Drag task in Window A**
5. **Watch Window B console for any of these sequences:**

**Sequence A - Working ✅**
```
A console: [Page] 📨 TaskUpdated callback fired
B console: (nothing yet, waiting...)
Pusher sees: event
B console: [ECHO EVENT] ..., then [Page] 📨 TaskUpdated callback fired
```

**Sequence B - Event not arriving ❌**
```
A console: [Page] 📨 TaskUpdated callback fired
B console: (no event)
Pusher: (no event - check Laravel)
```

**Sequence C - Event arrives but not processed ❌**
```
A console: [Page] 📨 TaskUpdated callback fired
Pusher: event visible
B console: (no callback fired)
Check: Is listener subscribed? setupId correct?
```

**Sequence D - Task ID mismatch ❌**
```
[Page] 📨 TaskUpdated callback fired
[Page] ❌ Event.task.id is missing or doesn't match
Check: event.task structure, id types (int vs string)
```
