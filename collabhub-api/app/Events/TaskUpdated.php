<?php

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow; // <-- Important!
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

// You MUST add 'implements ShouldBroadcastNow' here
class TaskUpdated implements ShouldBroadcastNow 
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $task;

    // 1. Pass the updated task into the event
    public function __construct(Task $task)
    {
        $this->task = $task;
         Log::info('🚀 TaskUpdated event created for task #' . $task->id . ' on channel project.' . $task->project_id);
    }

    // 2. Tell Pusher WHICH channel to send this to
   public function broadcastOn(): array
{
    Log::info('Broadcasting TaskUpdated');

    return [
        new Channel('project.' . $this->task->project_id)
    ];
}
    // 3. Tell Pusher WHAT data to send
   
    // 3. Tell Pusher WHAT data to send
   public function broadcastWith()
{
    Log::info('📡 Broadcasting TaskUpdated to project.' . $this->task->project_id);
    return [
        'task' => $this->task  // ✅ Wrap in 'task' key!
    ];
}

    // ADD THIS NEW METHOD:
    // 4. Give the event a clean name for React
    public function broadcastAs()
    {
        return 'TaskUpdated';
    }
}