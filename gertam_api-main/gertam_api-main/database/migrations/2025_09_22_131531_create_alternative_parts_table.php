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
        Schema::create('alternative_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_id")->constrained("product_details", "id")->onDelete("cascade");
            $table->string("company");
            $table->string("part_number");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alternative_parts');
    }
};
