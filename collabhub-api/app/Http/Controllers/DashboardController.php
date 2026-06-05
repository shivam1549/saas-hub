<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->role === 'admin';

        // 1. DYNAMIC KPIs
        if ($isAdmin) {
            $activeProjects = Project::where('tenant_id', $user->tenant_id)->count();
            $tasksCompleted = Task::whereHas('project', function($q) use ($user) {
                $q->where('tenant_id', $user->tenant_id);
            })->where('status', 'done')->count();
        } else {
            // Employees only see their project count and their own completions
            $activeProjects = $user->projects()->count(); 
            $tasksCompleted = Task::where('assignee_id', $user->id)->where('status', 'done')->count();
        }

        // 2. VELOCITY CHART (Tasks completed over the last 7 days)
        // This is a simple mock query. In a real app, you group by updated_at date.
        $velocityChart = [
            ['name' => 'Mon', 'completed' => rand(2, 10)],
            ['name' => 'Tue', 'completed' => rand(4, 15)],
            ['name' => 'Wed', 'completed' => rand(3, 12)],
            ['name' => 'Thu', 'completed' => rand(5, 20)],
            ['name' => 'Fri', 'completed' => rand(8, 25)],
            ['name' => 'Sat', 'completed' => rand(1, 5)],
            ['name' => 'Sun', 'completed' => rand(0, 2)],
        ];

        // 3. ACTION ITEMS (Employees need to see their urgent tasks!)
        $myTasks = [];
        if (!$isAdmin) {
            $myTasks = Task::where('assignee_id', $user->id)
                ->where('status', '!=', 'done')
                ->orderBy('priority', 'desc') // High priority first
                ->limit(5)
                ->get();
        }

        return response()->json([
            'role' => $user->role,
            'kpis' => [
                'projects' => $activeProjects,
                'completed' => $tasksCompleted,
                'velocity' => round($tasksCompleted / 7, 1) // Avg per day
            ],
            'chartData' => $velocityChart,
            'actionItems' => $myTasks
        ]);
    }
}