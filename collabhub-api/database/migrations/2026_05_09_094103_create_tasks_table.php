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
       Schema::create('tasks', function (Blueprint $table) {
        $table->id();
        
        // Explicitly named foreign keys
        $table->foreignId('tenant_id')
              ->constrained('tenants', 'id', 'tasks_tenant_fk')
              ->onDelete('cascade');

        $table->foreignId('project_id')
              ->constrained('projects', 'id', 'tasks_project_fk')
              ->onDelete('cascade');

        $table->foreignId('sprint_id')
              ->nullable()
              ->constrained('sprints', 'id', 'tasks_sprint_fk')
              ->onDelete('set null');

        $table->foreignId('assignee_id')
              ->nullable()
              ->constrained('users', 'id', 'tasks_assignee_fk')
              ->onDelete('set null');

        $table->string('title');
        $table->text('description')->nullable();
        $table->string('priority')->default('medium')->index();
        $table->string('status')->default('todo')->index();
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
        Schema::dropIfExists('tasks');
    }
};
