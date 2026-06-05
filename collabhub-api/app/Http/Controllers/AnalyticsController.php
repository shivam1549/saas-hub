<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index(Request $request, $projectId)
    {
        $user = $request->user();
        
        // Base query: Lock it to the current project
        $query = Task::where('project_id', $projectId);

        // 🛡️ ROLE-BASED LOGIC: If it's an employee, maybe they only see their own stats
        // (If you want employees to see company-wide stats, just remove this if block!)
        /*
        if ($user->role === 'employee') {
            $query->where('assignee_id', $user->id);
        }
        */

        // 1. Calculate KPIs (Total, Completed, Rate)
        $totalTasks = (clone $query)->count();
        $completedTasks = (clone $query)->where('status', 'done')->count();
        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;

        // 2. Status Distribution (For a Pie Chart)
        $statusCounts = (clone $query)
            ->select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                // Format for Recharts: { name: 'To Do', value: 15 }
                return [
                    'name' => ucwords(str_replace('_', ' ', $item->status)),
                    'value' => $item->total
                ];
            });

        // 3. Team Workload (For a Bar Chart) - Admins only usually care about this
        $teamWorkload = [];
        if ($user->role === 'admin') {
            $teamWorkload = (clone $query)
                ->whereNotNull('assignee_id')
                ->select('assignee_id', DB::raw('count(*) as tasks'))
                ->groupBy('assignee_id')
                ->with('assignee:id,name') // Get the user's name
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->assignee ? $item->assignee->name : 'Unknown',
                        'tasks' => $item->tasks
                    ];
                });
        }

        return response()->json([
            'kpis' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'rate' => $completionRate
            ],
            'statusDistribution' => $statusCounts,
            'teamWorkload' => $teamWorkload
        ]);
    }
}