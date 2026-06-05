<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * GET /api/projects
     * Fetch all projects for the logged-in user's tenant.
     */
    public function index()
    {
        // 🚀 SENIOR MAGIC: We don't need a WHERE clause!
        // The Invisible Wall (TenantScope) automatically filters this.
        $projects = Project::all();
        
        return response()->json($projects);
    }

    /**
     * POST /api/projects
     * Create a new project.
     */
    public function store(Request $request)
    {
        // 1. THE BOUNCER (Validation)
        // We strictly define what data is allowed inside the building.
        $validatedData = $request->validate([
            'title'    => 'required|string|max:255',
            'category' => 'required|string',
            'budget'   => 'nullable|numeric',
            'deadline' => 'nullable|date',
        ]);

        // 2. SECURITY INJECTION
        // We NEVER trust the frontend to send the tenant_id. A hacker could change it.
        // Instead, we force the tenant_id to be the one belonging to the logged-in user.
        $validatedData['tenant_id'] = auth()->user()->tenant_id;

        // 3. MASS ASSIGNMENT (The Fast Way)
        // Since we validated the data, it is 100% safe to save it all at once.
        $project = Project::create($validatedData);

        // Return a 201 Created status code with the new project
        return response()->json($project, 201);
    }

    public function show($id)
    {
        // Find the project or throw a 404 error if it doesn't exist
        $project = Project::findOrFail($id);
        
        return response()->json($project);
    }
}