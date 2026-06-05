<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// ✅ Add this: Authorization for project channels
// This allows users to receive real-time updates for projects they belong to

Broadcast::channel('project.{id}', function ($user, $id) {
    // TEMPORARY: Log what's happening for debugging
    Log::info("Authorizing user {$user->id} for project {$id}");
    
    // Check the relationship - log the result
    $hasAccess = $user->projects()->where('projects.id', $id)->exists();
    Log::info("User {$user->id} projects check: " . ($hasAccess ? 'YES' : 'NO'));
    
    return $hasAccess;
});
