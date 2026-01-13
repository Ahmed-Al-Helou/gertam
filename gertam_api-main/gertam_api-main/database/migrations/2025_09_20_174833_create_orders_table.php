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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users", "id")->onDelete("cascade");
            $table->string("name");
            $table->string("country");
            $table->string("email");
            $table->string("city");
            $table->string("status")->default("قيد التنفيذ");
            $table->text("orderNotes")->nullable();
            $table->string("phone");
            $table->string("streetAddress");
            $table->string("totlePrice");
            $table->foreignId("store_id")->nullable()->constrained("stores","id")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
