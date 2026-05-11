<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Fetch all users for the Team Dashboard
     */
    public function index(Request $request)
    {
        // 🛡️ SECURITY: Only return users that belong to the logged-in user's company
        $users = User::where('tenant_id', $request->user()->tenant_id)->get();

        return response()->json($users);
    }

    /**
     * Create a new team member from the Invite Modal
     */
    public function store(Request $request)
    {
        // Ensure the person making the request is an admin!
        if ($request->user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized. Only admins can create users.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,employee',
        ]);

        // Create the user and FORCE them into the current Admin's tenant
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'tenant_id' => $request->user()->tenant_id, // 🛡️ The multi-tenant lock!
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
}
