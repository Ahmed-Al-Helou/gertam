<?php
/**
 * Comprehensive test for DirectPay hash with all orders
 * Tests the corrected algorithm with PaymentDescription included
 */

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Test cases - recent orders from logs
$testCases = [
    [
        'name' => 'Order 209',
        'data' => [
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
        ]
    ],
    [
        'name' => 'Order 212',
        'data' => [
            'Amount' => '48986',
            'Channel' => '0',
            'CurrencyISOCode' => '682',
            'Language' => 'en',
            'MerchantID' => 'DP00000051',
            'MessageID' => '1',
            'PaymentDescription' => 'AlFaraa Order 212',
            'Quantity' => '1',
            'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=212&payment_id=59',
            'ThemeID' => '1',
            'TransactionID' => 'ORD-212-90rOP1',
            'Version' => '1.0',
        ]
    ],
    [
        'name' => 'Order 214',
        'data' => [
            'Amount' => '48986',
            'Channel' => '0',
            'CurrencyISOCode' => '682',
            'Language' => 'en',
            'MerchantID' => 'DP00000051',
            'MessageID' => '1',
            'PaymentDescription' => 'AlFaraa Order 214',
            'Quantity' => '1',
            'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=214&payment_id=61',
            'ThemeID' => '1',
            'TransactionID' => 'ORD-214-xqXlcl',
            'Version' => '1.0',
        ]
    ],
];

echo "\n";
echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  DIRECTPAY HASH TEST - COMPREHENSIVE (12 FIELDS, WITH PD)       ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

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

echo "FIELDS IN HASH (12 FIELDS, ALPHABETICAL ORDER):\n";
echo "───────────────────────────────────────────────────────────────────\n";
for ($i = 1; $i <= 12; $i++) {
    echo "$i. " . $sortedFields[$i-1] . "\n";
}

echo "\n\n";

$results = [];

foreach ($testCases as $testCase) {
    echo "┌───────────────────────────────────────────────────────────────────┐\n";
    echo "│ " . $testCase['name'] . "\n";
    echo "└───────────────────────────────────────────────────────────────────┘\n\n";
    
    $paymentData = $testCase['data'];
    
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
    
    // Calculate hash
    $concatenationUtf8 = mb_convert_encoding($concatenation, 'UTF-8', 'UTF-8');
    $hash = hash('sha256', $concatenationUtf8, false);
    
    echo "Concatenation length: " . strlen($concatenation) . " characters\n";
    echo "Hash (SHA-256): $hash\n";
    echo "Concatenation: " . substr($concatenation, 0, 80) . "...\n";
    echo "\n";
    
    $results[] = [
        'name' => $testCase['name'],
        'hash' => $hash,
        'concatenation' => $concatenation,
    ];
}

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║ SUMMARY                                                          ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

echo "Test Results:\n";
echo "───────────────────────────────────────────────────────────────────\n";
foreach ($results as $result) {
    echo $result['name'] . ":\n";
    echo "  Hash: " . $result['hash'] . "\n";
    echo "\n";
}

echo "✅ All hashes calculated with new algorithm (12 fields + PaymentDescription URL-encoded)\n";
echo "✅ These hashes should now match DirectPay's validation\n";

echo "\n";
?>
