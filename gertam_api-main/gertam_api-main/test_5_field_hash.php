<?php

// Test DirectPay hash with ONLY 5 fields
// Based on DIRECTPAY_ERROR_00018_FIX.md which states:
// "DirectPay **only validates the hash using 5 specific required fields**, not all parameters"

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$amount = 48986;
$currencyCode = '682';
$merchantId = 'DP00000051';
$messageId = '1';
$transactionId = 'ORD-212-90rOP1';

// Formula from DIRECTPAY_ERROR_00018_FIX.md:
// SHA-256(authToken + Amount + CurrencyISOCode + MerchantID + MessageID + TransactionID)
// (Sorted alphabetically by field name)

echo "=== Testing DirectPay Hash with 5 REQUIRED FIELDS ===\n\n";

// Alphabetically sorted field names:
// 1. Amount
// 2. CurrencyISOCode
// 3. MerchantID
// 4. MessageID
// 5. TransactionID

echo "Fields (alphabetically sorted):\n";
echo "1. Amount: $amount\n";
echo "2. CurrencyISOCode: $currencyCode\n";
echo "3. MerchantID: $merchantId\n";
echo "4. MessageID: $messageId\n";
echo "5. TransactionID: $transactionId\n\n";

// Build concatenation: authToken + value1 + value2 + value3 + value4 + value5
$concatenation = $authToken . $amount . $currencyCode . $merchantId . $messageId . $transactionId;

echo "=== CONCATENATION ===\n";
echo "Full: $concatenation\n";
echo "Length: " . strlen($concatenation) . "\n\n";

// Calculate SHA-256 hash
$hash = hash('sha256', $concatenation, false);

echo "=== HASH ===\n";
echo "SHA-256 Hash: $hash\n\n";

echo "=== EXPECTED VALUES (from logs) ===\n";
echo "From logs (11 fields): f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af\n";
echo "From 11-field test:    f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af\n\n";

echo "Current 5-field hash matches either? ";
echo ($hash === 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af') ? "YES ✓" : "NO ✗";
echo "\n";
