<?php

// Test DirectPay hash with UPPERCASE 'En' language value
// to see if that's what DirectPay expects

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$amount = 48986;
$channel = '0';
$currencyCode = '682';
$language = 'En';  // UPPERCASE (what DirectPay might want)
$merchantId = 'DP00000051';
$messageId = '1';
$quantity = '1';
$responseUrl = 'http://localhost:3000/payment/callback?order_id=212&payment_id=59';
$themeId = '1';
$transactionId = 'ORD-212-90rOP1';
$version = '1.0';

echo "=== Testing DirectPay Hash with UPPERCASE 'En' ===\n\n";

// Fields in alphabetical order:
$fields = [
    'Amount' => $amount,
    'Channel' => $channel,
    'CurrencyISOCode' => $currencyCode,
    'Language' => $language,  // UPPERCASE
    'MerchantID' => $merchantId,
    'MessageID' => $messageId,
    'Quantity' => $quantity,
    'ResponseBackURL' => $responseUrl,
    'ThemeID' => $themeId,
    'TransactionID' => $transactionId,
    'Version' => $version
];

echo "Fields (alphabetically sorted):\n";
foreach ($fields as $key => $value) {
    echo "- $key: $value\n";
}
echo "\n";

// Build concatenation: authToken + value1 + value2 + value3...
$concatenation = $authToken;
foreach ($fields as $value) {
    $concatenation .= $value;
}

echo "=== CONCATENATION ===\n";
echo "Full: $concatenation\n";
echo "Length: " . strlen($concatenation) . "\n\n";

// Calculate SHA-256 hash
$hash = hash('sha256', $concatenation, false);

echo "=== HASH WITH UPPERCASE 'En' ===\n";
echo "Hash: $hash\n\n";

echo "=== COMPARISON ===\n";
echo "Lowercase 'en' hash: f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af\n";
echo "Uppercase 'En' hash: $hash\n";
echo "Match: ";
echo ($hash === 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af') ? "YES ✓" : "NO ✗";
echo "\n";
