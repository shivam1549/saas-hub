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
     Schema::create('webhooks', function (Blueprint $table) {
        $table->id();
        
        $table->foreignId('tenant_id')
              ->constrained('tenants', 'id', 'webhooks_tenant_fk')
              ->onDelete('cascade');

        $table->string('url');
        $table->string('event_type')->index(); 
        $table->string('secret')->nullable();
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
        Schema::dropIfExists('webhooks');
    }
};
