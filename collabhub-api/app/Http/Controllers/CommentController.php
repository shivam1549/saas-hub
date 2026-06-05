<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Fetch all comments for a specific task
    public function index($taskId)
    {
        $comments = Comment::with('user:id,name') // Eager load the user's name
            ->where('task_id', $taskId)
            ->orderBy('created_at', 'desc') // Newest at the top
            ->get();
            
        return response()->json($comments);
    }

    // Save a new comment
    public function store(Request $request, $taskId)
    {
        // 1. Validate. Notice content can be nullable now if they just send a file!
        $request->validate([
            'content'    => 'nullable|string',
            'attachment' => 'nullable|file|max:10240', // Max 10MB
        ]);

        // Require at least text OR a file
        if (!$request->content && !$request->hasFile('attachment')) {
            return response()->json(['message' => 'Comment cannot be empty'], 422);
        }

        $commentData = [
            'task_id' => $taskId,
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ];

        // 2. Handle the File Upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            
            // Saves to storage/app/public/attachments
            $path = $file->store('attachments', 'public'); 
            
            $commentData['file_path'] = $path;
            $commentData['file_name'] = $file->getClientOriginalName();
        }

        $comment = Comment::create($commentData);
        $comment->load('user:id,name');

        return response()->json($comment, 201);
    }
}