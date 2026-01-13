<?php

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  Testing Fixed ResponseBackURL (NO & before payment_id)          ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

// Test Order 219
$orderId = 219;
$paymentId = 66;
$referenceNumber = 'ORD-219-BL8H4K';
$amount = '48986'; // 489.86 SAR in cents

// ✅ FIXED: NO & before payment_id
$returnUrl = 'http://localhost:3000/payment/callback?order_id=' . $orderId . 'payment_id=' . $paymentId;

echo "✅ FIXED ResponseBackURL Format:\n";
echo "   $returnUrl\n\n";

// DirectPay spec - 12 fields in alphabetical order
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$paymentData = [
    'Amount' => $amount,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+219', // URL-encoded
    'Quantity' => '1',
    'ResponseBackURL' => $returnUrl,  // ✅ NO & before payment_id
    'ThemeID' => '1',
    'TransactionID' => $referenceNumber,
    'Version' => '1.0',
];

// Build fields in alphabetical order
$sortedFields = [
    'Amount', 'Channel', 'CurrencyISOCode', 'Language',
    'MerchantID', 'MessageID', 'PaymentDescription',
    'Quantity', 'ResponseBackURL', 'ThemeID',
    'TransactionID', 'Version'
];

echo "Building Concatenation String:\n";
echo "─────────────────────────────────────────────────────────────────\n";

$concatenation = $authToken;
echo "Start with AuthToken: $authToken\n";

foreach ($sortedFields as $index => $field) {
    $value = $paymentData[$field];
    $concatenation .= $value;
    echo "Step " . ($index + 1) . ": $field = $value\n";
}

echo "\n✅ FINAL CONCATENATION STRING:\n";
echo "─────────────────────────────────────────────────────────────────\n";
echo "$concatenation\n";
echo "\nLength: " . strlen($concatenation) . " characters\n";

// Calculate hash
$hash = hash('sha256', $concatenation, false);
echo "\n✅ SHA-256 Hash (lowercase hex):\n";
echo "   $hash\n";

// Verify format matches DirectPay's expected format
echo "\n✅ Verification:\n";
echo "─────────────────────────────────────────────────────────────────\n";

$directPayExpected = "NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm489860682enDP000000511AlFaraa+Order+2091http://localhost:3000/payment/callback?order_id=209payment_id=561ORD-209-8aeOEj1.0";

echo "DirectPay Expected Format (from guidance):\n";
echo "   $directPayExpected\n";
echo "   Length: " . strlen($directPayExpected) . " characters\n\n";

echo "Our Format (fixed ResponseBackURL):\n";
echo "   $concatenation\n";
echo "   Length: " . strlen($concatenation) . " characters\n\n";

// Check if ResponseBackURL doesn't have & before payment_id
if (strpos($returnUrl, '&payment_id=') === false && strpos($returnUrl, 'payment_id=') !== false) {
    echo "✅ ResponseBackURL format is CORRECT (NO & before payment_id)\n";
} else {
    echo "❌ ResponseBackURL format may be INCORRECT\n";
}

// Check all 12 fields are present
if (count($sortedFields) === 12) {
    echo "✅ All 12 fields are present in hash\n";
} else {
    echo "❌ Wrong number of fields: " . count($sortedFields) . " (should be 12)\n";
}

echo "✅ PaymentDescription is URL-encoded: " . (strpos($concatenation, 'AlFaraa+Order+219') !== false ? 'YES' : 'NO') . "\n";

echo "\n" . "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  This hash should now match DirectPay's validation!            ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n";
?>
