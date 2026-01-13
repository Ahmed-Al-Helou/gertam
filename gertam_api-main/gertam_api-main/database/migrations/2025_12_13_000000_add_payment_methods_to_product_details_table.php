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
        Schema::table('product_details', function (Blueprint $table) {
            // إضافة عمود لتخزين طرق الدفع المدعومة (JSON)
            $table->json('supported_payment_methods')->default('["cod"]')->after('thumbnail');
            // أو: cod = الدفع عند الاستلام، directpay = الدفع الإلكتروني
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_details', function (Blueprint $table) {
            $table->dropColumn('supported_payment_methods');
        });
    }
};
