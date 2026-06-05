<?php

use App\Http\Controllers\SprintController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use Illuminate\Http\Request;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// ==========================================
// PUBLIC ROUTES (No Token Required)
// ==========================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🚀 Broadcasting auth - MUST be outside auth middleware for proper error handling
Route::post('/broadcasting/auth', function (Request $request) {
    Log::info("📡 broadcasting/auth endpoint hit");
    Log::info("📝 Headers Authorization:", ['auth' => $request->header('Authorization')]);
    Log::info("📝 Bearer token:", ['token' => $request->bearerToken()]);
    
    try {
        // Manually authenticate using Sanctum
        $user = $request->user('sanctum');
        
        if (!$user) {
            Log::warning("❌ No authenticated user in broadcasting/auth");
            Log::warning("📝 Request user check failed - trying bearer token directly");
            
            // Try to get the token directly
            $token = $request->bearerToken();
            Log::warning("📝 Bearer token found: " . ($token ? 'YES (length: ' . strlen($token) . ')' : 'NO'));
            
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $channel = $request->input('channel_name');
        $socket_id = $request->input('socket_id');

        Log::info("✅ User {$user->id} auth check passed for channel {$channel}");

        // Manually authorize the channel
        $authorized = false;
        
        if (strpos($channel, 'project.') === 0) {
            // Extract project ID from channel name (e.g., 'project.1' -> 1)
            $projectId = str_replace('project.', '', $channel);
            
            // Check if user has access to this project
            $authorized = $user->projects()->where('projects.id', $projectId)->exists();
            
            Log::info("User {$user->id} project check for project {$projectId}: " . ($authorized ? 'YES' : 'NO'));
        } elseif (preg_match('/^App\.Models\.User\.(\d+)$/', $channel, $matches)) {
            // Private user channels
            $userId = $matches[1];
            $authorized = (int)$user->id === (int)$userId;
            
            Log::info("User {$user->id} private channel check: " . ($authorized ? 'YES' : 'NO'));
        }

        if (!$authorized) {
            Log::warning("⛔ Channel authorization failed for user {$user->id} on channel {$channel}");
            return response()->json(['error' => 'Forbidden'], 403);
        }

        // Generate Pusher auth signature
        $pusher = new \Pusher\Pusher(
            config('broadcasting.connections.pusher.key'),
            config('broadcasting.connections.pusher.secret'),
            config('broadcasting.connections.pusher.app_id'),
            [
                'cluster' => config('broadcasting.connections.pusher.options.cluster'),
            ]
        );

        $auth = $pusher->socket_auth($channel, $socket_id);
        
        Log::info("✅ Broadcasting auth SUCCESS for user {$user->id} on channel {$channel}");
        
        return response()->json([
            'auth' => $auth,
            'channel_data' => json_encode(['user_id' => $user->id])
        ]);
    } catch (\Exception $e) {
        Log::error('❌ Broadcasting auth EXCEPTION: ' . $e->getMessage(), ['file' => $e->getFile(), 'line' => $e->getLine()]);
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::middleware('auth:sanctum')->group(function () {

    // Workspace Team Management
    Route::get('/team', [TeamController::class, 'index']);
    Route::post('/team', [TeamController::class, 'store']);

    Route::post('/logout', [AuthController::class, 'logout']);
    // This single line automatically creates 5 routes:
    // GET /api/projects (index)
    // POST /api/projects (store)
    // GET /api/projects/{id} (show)
    // PUT /api/projects/{id} (update)
    // DELETE /api/projects/{id} (destroy)

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);

    Route::get('/tasks/{task}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{task}/comments', [CommentController::class, 'store']);
    Route::get('/projects/{project}/analytics', [App\Http\Controllers\AnalyticsController::class, 'index']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::apiResource('projects', ProjectController::class);

    Route::get('/notifications', function (Request $request) {
    return response()->json($request->user()->unreadNotifications);
});

Route::post('/notifications/{id}/read', function (Request $request, $id) {
    $notification = $request->user()->notifications()->findOrFail($id);
    $notification->markAsRead();
    return response()->json(['status' => 'success']);
});
    
    Route::apiResource('sprints', SprintController::class);
    Route::apiResource('tasks', TaskController::class);
});
