<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
     Schema::create('sprints', function (Blueprint $table) {
        $table->id();
        
        // We add a specific name to the constraint to avoid collisions
        $table->foreignId('tenant_id')
              ->constrained('tenants', 'id', 'sprints_tenant_fk') 
              ->onDelete('cascade');
              
        $table->foreignId('project_id')
              ->constrained('projects', 'id', 'sprints_project_fk')
              ->onDelete('cascade');

        $table->string('name');
        $table->date('start_date');
        $table->date('end_date');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sprints');
    }
};
