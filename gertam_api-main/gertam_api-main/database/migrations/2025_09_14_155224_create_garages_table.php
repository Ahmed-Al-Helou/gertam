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
        Schema::create('garages', function (Blueprint $table) {
            $table->id();
            $table->string("car_name");
            $table->string("brand");
            $table->string("module");
            $table->string("date");
            $table->string("engaine");
            $table->string("image_url");
            $table->foreignId("user_id")->constrained("users", "id")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('garages');
    }
};
