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
        Schema::create('product_compatibilities', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('product_detail_id'); 
            $table->foreign('product_detail_id')
                ->references('id')
                ->on('product_details')
                ->onDelete('cascade');

            $table->foreignId("brand_id")->constrained("brands","id")->onDelete("cascade");
            $table->foreignId("model_id")->nullable()->constrained("modules", "id")->onDelete("cascade");
            $table->foreignId("model_date_id")->nullable()->constrained("module_dates", "id")->onDelete("cascade");
            $table->foreignId("engine_id")->nullable()->constrained("enginees", "id")->onDelete("cascade");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_compatibilities');
    }
};
