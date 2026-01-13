<?php
/**
 * Test DirectPay hash with PaymentDescription URL-encoded
 * Using the exact format from DirectPay support
 */

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Test case: Order 209 (from example in code)
$paymentData = [
    'Amount' => '48986',
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa Order 209',
    'Quantity' => '1',
    'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=209&payment_id=56',
    'ThemeID' => '1',
    'TransactionID' => 'ORD-209-8aeOEj',
    'Version' => '1.0',
];

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  DIRECTPAY HASH TEST - WITH PAYMENTDESCRIPTION URL-ENCODED      ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

// Fields in alphabetical order
$sortedFields = [
    'Amount',
    'Channel',
    'CurrencyISOCode',
    'Language',
    'MerchantID',
    'MessageID',
    'PaymentDescription',
    'Quantity',
    'ResponseBackURL',
    'ThemeID',
    'TransactionID',
    'Version'
];

echo "FIELDS IN HASH (ALPHABETICAL ORDER):\n";
echo "───────────────────────────────────────────────────────────────────\n";
$i = 1;
foreach ($sortedFields as $field) {
    $value = $paymentData[$field];
    if ($field === 'PaymentDescription') {
        $displayValue = str_replace(' ', '+', $value);
        echo "$i. $field = $displayValue (URL-ENCODED)\n";
    } else {
        $displayValue = strlen($value) > 40 ? substr($value, 0, 37) . '...' : $value;
        echo "$i. $field = $displayValue\n";
    }
    $i++;
}

echo "\n";

// Build concatenation
$concatenation = $authToken;
foreach ($sortedFields as $field) {
    if (isset($paymentData[$field])) {
        $value = (string)$paymentData[$field];
        
        // URL-encode PaymentDescription
        if ($field === 'PaymentDescription') {
            $value = str_replace(' ', '+', $value);
        }
        
        $concatenation .= $value;
    }
}

echo "CONCATENATION STRING:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo "Full concatenation:\n";
echo $concatenation . "\n\n";
echo "Length: " . strlen($concatenation) . " characters\n\n";

// Hash calculation
$concatenationUtf8 = mb_convert_encoding($concatenation, 'UTF-8', 'UTF-8');
$calculatedHash = hash('sha256', $concatenationUtf8, false);

echo "HASH CALCULATION:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo "Algorithm: SHA-256\n";
echo "Encoding: UTF-8\n";
echo "Calculated Hash: $calculatedHash\n\n";

// Expected from DirectPay support
$expectedFormat = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm489860682enDP000000511AlFaraa+Order+2091http://localhost:3000/payment/callback?order_id=209&payment_id=561ORD-209-8aeOEj1.0';

echo "VERIFICATION:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo "Expected format (from DirectPay):\n";
echo $expectedFormat . "\n\n";

// Check if our concatenation matches the expected format
$matches = $concatenation === $expectedFormat;
echo "Does our concatenation match DirectPay's format? " . ($matches ? "✅ YES" : "❌ NO") . "\n";

if (!$matches) {
    echo "\nDifferences:\n";
    echo "Our length: " . strlen($concatenation) . "\n";
    echo "Expected length: " . strlen($expectedFormat) . "\n";
    
    // Character by character comparison
    $minLen = min(strlen($concatenation), strlen($expectedFormat));
    for ($i = 0; $i < $minLen; $i++) {
        if ($concatenation[$i] !== $expectedFormat[$i]) {
            echo "First difference at position $i: '" . $concatenation[$i] . "' vs '" . $expectedFormat[$i] . "'\n";
            echo "Context (ours): " . substr($concatenation, max(0, $i-10), 30) . "\n";
            echo "Context (expected): " . substr($expectedFormat, max(0, $i-10), 30) . "\n";
            break;
        }
    }
}

echo "\n";
echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║ RESULT                                                           ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

if ($matches) {
    echo "✅ CONCATENATION MATCHES DirectPay's expected format!\n";
    echo "✅ Hash: $calculatedHash\n";
    echo "\nThis should resolve Error 00018!\n";
} else {
    echo "❌ Concatenation does not match expected format\n";
    echo "Please check the differences above\n";
}

echo "\n";
?>
