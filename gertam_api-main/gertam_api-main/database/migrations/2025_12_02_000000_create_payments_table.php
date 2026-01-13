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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders', 'id')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users', 'id')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('SAR');
            $table->string('payment_method'); // 'directpay', 'cod', etc.
            $table->string('status')->default('pending'); // pending, completed, failed, cancelled
            $table->string('reference_number')->nullable()->unique();
            $table->string('transaction_id')->nullable()->unique();
            $table->json('response_data')->nullable();
            $table->timestamps();

            $table->index('order_id');
            $table->index('user_id');
            $table->index('status');
            $table->index('reference_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
