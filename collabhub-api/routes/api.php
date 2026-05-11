<?php
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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

    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('sprints', SprintController::class);
    Route::apiResource('tasks', TaskController::class);
});
