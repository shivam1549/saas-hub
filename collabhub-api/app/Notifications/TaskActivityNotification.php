<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TaskActivityNotification extends Notification
{
    use Queueable;

    private $task;
    private $message;
    private $type;

    public function __construct($task, $message, $type = 'info')
    {
        $this->task = $task;
        $this->message = $message;
        $this->type = $type; // 'assigned', 'comment', 'urgent'
    }

    // Tell Laravel to save this in the database
    public function via($notifiable)
    {
        return ['database'];
    }

    // The actual data that gets sent to your React frontend
    public function toDatabase($notifiable)
    {
        return [
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
            'title' => $this->task->title,
            'message' => $this->message,
            'type' => $this->type,
        ];
    }
}