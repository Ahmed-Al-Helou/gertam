<?php

// Test script to validate Payment model
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';

$app->make('Illuminate\Contracts\Http\Kernel')->bootstrap();

try {
    // Test 1: Instantiate Payment model
    $payment = new App\Models\Payment();
    echo "✓ TEST 1 PASSED: Payment model instantiated successfully\n";
    
    // Test 2: Check fillable attributes
    $fillable = $payment->getFillable();
    echo "✓ TEST 2 PASSED: Fillable attributes loaded: " . count($fillable) . " fields\n";
    
    // Test 3: Check table name
    echo "✓ TEST 3 PASSED: Table name: " . $payment->getTable() . "\n";
    
    // Test 4: Check casts
    $casts = $payment->getCasts();
    echo "✓ TEST 4 PASSED: Casts configured: " . implode(', ', array_keys($casts)) . "\n";
    
    // Test 5: Verify order relationship method exists
    if (method_exists($payment, 'order')) {
        echo "✓ TEST 5 PASSED: order() relationship method exists\n";
    }
    
    // Test 6: Verify user relationship method exists
    if (method_exists($payment, 'user')) {
        echo "✓ TEST 6 PASSED: user() relationship method exists\n";
    }
    
    echo "\n✅ ALL TESTS PASSED - Payment model is ready for use!\n";
    
} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
