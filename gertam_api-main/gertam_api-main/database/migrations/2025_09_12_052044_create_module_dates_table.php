<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('module_dates', function (Blueprint $table) {
            $table->id();
            $table->integer("date_form");
            $table->integer("date_to");
            $table->foreignId("module_by")->constrained("modules","id")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_dates');
    }
};
