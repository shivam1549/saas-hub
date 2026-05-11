<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\BelongsToTenant; // 1. Bring in the Invisible Wall!

class Sprint extends Model
{
    use BelongsToTenant; // 2. Activate the security

    protected $guarded = []; // 3. Allow mass assignment from the Controller

    /**
     * A Sprint belongs to one specific Project.
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * A Sprint contains many Tasks.
     */
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}