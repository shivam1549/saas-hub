<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SprintController extends Controller
{
    /**
     * GET /api/sprints
     * Fetch all sprints (you can optionally filter by project_id in the frontend)
     */
   public function index(Request $request)
    {
        $query = Sprint::query();

        // If the frontend asks for a specific project's sprints, filter them!
        if ($request->has('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Return them ordered by start date so the newest sprints are at the top
        return response()->json($query->orderBy('start_date', 'asc')->get());
    }

    /**
     * POST /api/sprints
     * Create a new sprint for a specific project
     */
    public function store(Request $request)
    {
        $tenantId = $request->user()->tenant_id;

        // 🛡️ SENIOR VALIDATION: Ensure the project belongs to the current tenant
        $validated = $request->validate([
            'project_id' => ['required', Rule::exists('projects', 'id')->where('tenant_id', $tenantId)],
            'name'       => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date', // Ensures end date isn't in the past
        ]);

        // Force the tenant_id for absolute security
        $validated['tenant_id'] = $tenantId;

        $sprint = Sprint::create($validated);

        return response()->json([
            'message' => 'Sprint created successfully',
            'sprint' => $sprint
        ], 201);
    }

    /**
     * GET /api/sprints/{sprint}
     * View a single sprint AND all the tasks inside it
     */
    public function show(Sprint $sprint)
    {
        // Because of our TenantScope, if they ask for a sprint from another company, 
        // Laravel automatically throws a 404 Not Found here.
        
        // Load the sprint and all its attached tasks
        $sprint->load('tasks');

        return response()->json($sprint);
    }
}