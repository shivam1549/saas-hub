<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Notifications\TaskActivityNotification;
use App\Models\User;
use App\Events\TaskUpdated;

class TaskController extends Controller
{
    /**
     * GET /api/tasks
     * Load the Kanban Board (Tasks with their assignees and projects)
     */
 public function index(Request $request)
    {
        // 1. Start the query builder (don't call ->get() yet!)
        $query = Task::with(['assignee:id,name,email', 'project:id,title']);

        // 2. If the frontend sends a ?project_id=3 filter, apply it!
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Optional: If you ever want to fetch tasks for just one sprint
        if ($request->has('sprint_id')) {
            $query->where('sprint_id', $request->sprint_id);
        }

        // 3. Now execute the query and return the results
        $tasks = $query->get();
        
        
        return response()->json($tasks);
    }

    /**
     * POST /api/tasks
     * Create a new task on the board
     */
    public function store(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        $validated = $request->validate([
            'project_id'  => ['required', Rule::exists('projects', 'id')->where('tenant_id', $tenantId)],
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority'    => 'in:low,medium,high',
            'status'      => 'in:todo,in_progress,done',
            'assignee_id' => ['nullable', Rule::exists('users', 'id')->where('tenant_id', $tenantId)],
            
            // 🚀 THE NEW SPRINT LOGIC
            'sprint_id'   => [
                'nullable', 
                // 1. Must exist in the sprints table
                // 2. Must belong to Shiva Fashion
                // 3. Must belong to the Project we are currently adding the task to!
                Rule::exists('sprints', 'id')
                    ->where('tenant_id', $tenantId)
                    ->where('project_id', $request->project_id) 
            ],
        ]);


        $validated['tenant_id'] = $tenantId;
        $task = Task::create($validated);

             // 1. Safely grab the currently logged-in user making the request
$currentUser = $request->user();

if ($task->priority === 'high') {
    // 2. Fetch admins safely. 
    // If you DO have tenant_id in your database:
    $admins = User::where('tenant_id', $currentUser->tenant_id)->where('role', 'admin')->get();
    
    // OR, if you DO NOT have tenant_id in your database yet, use this line instead:
    // $admins = User::where('role', 'admin')->get();

    foreach ($admins as $admin) {
        $admin->notify(new TaskActivityNotification(
            $task, 
            "URGENT: High priority task created - {$task->title}", 
            "urgent"
        ));
    }
}

        return response()->json($task, 201);
    }

    /**
     * PUT/PATCH /api/tasks/{task}
     * Move a task (e.g., from 'todo' to 'in_progress')
     */
   public function update(Request $request, Task $task)
    {
        $tenantId = $request->user()->tenant_id;

        $validated = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'priority'    => 'sometimes|in:low,medium,high',
            'status'      => 'sometimes|in:todo,in_progress,done',
            'assignee_id' => ['nullable', Rule::exists('users', 'id')->where('tenant_id', $tenantId)],
            
            'sprint_id'   => [
                'nullable', 
                Rule::exists('sprints', 'id')
                    ->where('tenant_id', $tenantId)
                    // USE THE EXISTING TASK'S PROJECT ID HERE!
                    ->where('project_id', $task->project_id) 
            ],
        ]);

        $task->update($validated);

             // 1. Safely grab the currently logged-in user making the request
$currentUser = $request->user();

if ($task->priority === 'high') {
    // 2. Fetch admins safely. 
    // If you DO have tenant_id in your database:
    $admins = User::where('tenant_id', $currentUser->tenant_id)->where('role', 'admin')->get();
    
    // OR, if you DO NOT have tenant_id in your database yet, use this line instead:
    // $admins = User::where('role', 'admin')->get();

    foreach ($admins as $admin) {
        $admin->notify(new TaskActivityNotification(
            $task, 
            "URGENT: High priority task created - {$task->title}", 
            "urgent"
        ));
    }
}
// event(new TaskUpdated($task));
broadcast(new TaskUpdated($task))->toOthers();

        return response()->json([
            'message' => 'Task updated successfully',
            'task' => $task
        ]);
    }

    /**
     * DELETE /api/tasks/{task}
     * Remove a task
     */
    public function destroy(Task $task)
{
    // Capture the ID before deleting
    $taskId = $task->id;

    $task->delete();
broadcast(new TaskUpdated($task))->toOthers();

    return response()->json(['message' => 'Task deleted']);
}
}