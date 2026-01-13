<?php
// Test DirectPay hash calculation with exact values from Order 212
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Values from logs - Order 212
$values = [
    'Amount' => '48986',
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',  // Should be lowercase
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'Quantity' => '1',
    'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=212&payment_id=59',
    'ThemeID' => '1',
    'TransactionID' => 'ORD-212-90rOP1',
    'Version' => '1.0',
];

// Alphabetically sorted fields
$sortedFields = [
    'Amount',
    'Channel',
    'CurrencyISOCode',
    'Language',
    'MerchantID',
    'MessageID',
    'Quantity',
    'ResponseBackURL',
    'ThemeID',
    'TransactionID',
    'Version'
];

// Build concatenation
$concatenation = $authToken;
foreach ($sortedFields as $field) {
    if (isset($values[$field])) {
        $value = (string)$values[$field];
        $value = trim($value);
        $concatenation .= $value;
        echo "Adding $field: $value\n";
    }
}

echo "\n=== CONCATENATION ===\n";
echo "Full: " . substr($concatenation, 0, 100) . "...\n";
echo "Length: " . strlen($concatenation) . "\n";

// Compute hash
$concatenationUtf8 = mb_convert_encoding($concatenation, 'UTF-8', 'UTF-8');
$hash = hash('sha256', $concatenationUtf8, false);

echo "\n=== HASH ===\n";
echo "Hash: $hash\n";
echo "Expected (from logs): f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af\n";
echo "Match: " . ($hash === 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af' ? 'YES ✓' : 'NO ✗') . "\n";
?>
