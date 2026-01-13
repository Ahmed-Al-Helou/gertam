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
        Schema::create('merchants', function (Blueprint $table) {
        $table->id();
        $table->string('full_name');
        $table->string('store_name');
        $table->string('email')->unique();
        $table->string('phone');
        $table->string('address');
        $table->string('id_number');
        $table->string('tax_number')->nullable();
        $table->string('national_address');
        $table->string('commercial_registration');
        $table->string('documents')->nullable(); // path for uploaded files (JSON array)
        $table->boolean('pledge')->default(false);
        $table->foreignId("user_id")->constrained("users", "id")->onDelete('cascade');
        $table->text('reason')->nullable();
        $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
