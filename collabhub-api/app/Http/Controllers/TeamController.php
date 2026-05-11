<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeamController extends Controller
{
    /**
     * POST /api/team
     * Invite a new employee to the workspace.
     */
    public function store(Request $request)
    {
        // 1. THE GATEKEEPER (Authorization)
        // Check if the person making the request is an Admin.
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Access Denied: Only admins can invite new employees.'
            ], 403);
        }

        // 2. VALIDATION
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
        ]);

        // 3. GENERATE TEMPORARY CREDENTIALS
        $tempPassword = Str::random(10); // e.g., "Xj9Fk2pL1z"

        // 4. CREATE THE EMPLOYEE
        // Notice we DO NOT ask the frontend for a tenant_id or role.
        // We forcefully assign them on the backend for absolute security.
        $employee = User::create([
            'name'      => $validated['name'],
            'email'     => $validated['email'],
            'password'  => Hash::make($tempPassword),
            'tenant_id' => $request->user()->tenant_id, // Lock them to the Admin's company
            'role'      => 'employee', // Explicitly set to employee
        ]);

        // 5. RETURN SUCCESS
        return response()->json([
            'message' => 'Employee successfully added to workspace.',
            'employee' => $employee,
            'temporary_password' => $tempPassword // The admin copies this and gives it to the employee
        ], 201);
    }

    /**
     * GET /api/team
     * See everyone in the current workspace.
     */
    public function index(Request $request)
    {
        // Because we added the TenantScope (The Invisible Wall) earlier, 
        // User::all() will ONLY return users that belong to the logged-in admin's tenant!
        $team = User::all();
        
        return response()->json($team);
    }
}