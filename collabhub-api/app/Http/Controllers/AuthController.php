<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * POST /api/register
     */
    public function register(Request $request)
    {
        // 1. Validate the incoming data
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'name'         => 'required|string|max:255',
            'email'        => 'required|string|email|max:255|unique:users',
            'password'     => 'required|string|min:8|confirmed', // expects 'password_confirmation' field
        ]);

        // 2. Database Transaction: All or Nothing
        DB::beginTransaction();

        try {
            // A. Create the Workspace (Tenant)
            $tenant = Tenant::create([
                'name' => $validated['company_name'],
                'slug' => Str::slug($validated['company_name']) . '-' . Str::random(4), // e.g., kanpur-lights-8f2a
            ]);

            // B. Create the User and link them to the new Tenant
            $user = User::create([
                'name'      => $validated['name'],
                'email'     => $validated['email'],
                'password'  => Hash::make($validated['password']),
                'tenant_id' => $tenant->id,
                'role'      => 'admin', // The person who registers the company is the Admin
            ]);

            DB::commit(); // Save everything to the database safely

            // C. Generate the Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message'      => 'Registration successful',
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user,
                'tenant'       => $tenant
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // If anything failed, undo the database changes
            return response()->json(['message' => 'Registration failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/login
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Check credentials
        if (!Auth::attempt($validated)) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = User::where('email', $validated['email'])->firstOrFail();

        // Generate the token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'      => 'Login successful',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ]);
    }

    /**
     * POST /api/logout
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }
}