<?php

namespace App\Traits;

use App\Models\Scopes\TenantScope;
use App\Models\Tenant;

trait BelongsToTenant
{
    // This function automatically runs when the Model boots up
    protected static function bootBelongsToTenant()
    {
        static::addGlobalScope(new TenantScope);
    }

    // It also defines the relationship so we don't have to write it everywhere
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}