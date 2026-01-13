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
        Schema::create('product_details', function (Blueprint $table) {
            $table->id();
            $table->string("ar_name");
            $table->string("en_name");
            $table->text("ar_description");
            $table->text("en_description");
            // $table->string("nickname_st");
            // $table->string("nickname_num");
            // $table->string("nickname_main");
            // $table->string("status")->default("active");
            // $table->string("feature")->default("no");
            // $table->string("extra_data");
            // $table->bigInteger("created_by_id");
            // $table->bigInteger("updated_by_id");
            $table->string("price");
            $table->string("old_price")->default(0);
            $table->string("thumbnail");            
            $table->foreignId("categories_id")->constrained("categories", "id")->onDelete("cascade");
            $table->foreignId("store_id")->constrained("stores", "id")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_details');
    }
};
