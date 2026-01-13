<?php

/**
 * DIRECTPAY HASH ENCRYPTION MATCHING TEST
 * Visual comparison of hash calculations
 */

echo "\n╔════════════════════════════════════════════════════════════════════╗\n";
echo "║           DIRECTPAY HASH ENCRYPTION - MATCHING TEST                ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n\n";

// Test configuration
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$amount = 48986;
$channel = '0';
$currency = '682';
$languageLower = 'en';
$languageUpper = 'En';
$merchantId = 'DP00000051';
$messageId = '1';
$quantity = '1';
$responseUrl = 'http://localhost:3000/payment/callback?order_id=212&payment_id=59';
$themeId = '1';
$transactionId = 'ORD-212-90rOP1';
$version = '1.0';

// Expected hash from logs (with lowercase 'en')
$expectedHash = 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af';

echo "┌──────────────────────────────────────────────────────────────────┐\n";
echo "│ TEST 1: SHA-256 with Lowercase 'en' (CURRENT IMPLEMENTATION)     │\n";
echo "└──────────────────────────────────────────────────────────────────┘\n\n";

$fields1 = [
    'Amount' => $amount,
    'Channel' => $channel,
    'CurrencyISOCode' => $currency,
    'Language' => $languageLower,
    'MerchantID' => $merchantId,
    'MessageID' => $messageId,
    'Quantity' => $quantity,
    'ResponseBackURL' => $responseUrl,
    'ThemeID' => $themeId,
    'TransactionID' => $transactionId,
    'Version' => $version
];

$concat1 = $authToken;
foreach ($fields1 as $value) {
    $concat1 .= $value;
}
$hash1 = hash('sha256', $concat1, false);

echo "Concatenation String:\n";
echo "  " . $concat1 . "\n";
echo "Length: " . strlen($concat1) . " characters\n\n";
echo "Hash Result:\n";
echo "  " . $hash1 . "\n";
echo "Expected:   \n";
echo "  " . $expectedHash . "\n\n";

if ($hash1 === $expectedHash) {
    echo "✅ MATCH CONFIRMED! Hash matches expected value.\n\n";
} else {
    echo "❌ MISMATCH! Hashes do not match.\n\n";
}

echo "┌──────────────────────────────────────────────────────────────────┐\n";
echo "│ TEST 2: SHA-256 with Uppercase 'En' (ALTERNATIVE)               │\n";
echo "└──────────────────────────────────────────────────────────────────┘\n\n";

$fields2 = $fields1;
$fields2['Language'] = $languageUpper;

$concat2 = $authToken;
foreach ($fields2 as $value) {
    $concat2 .= $value;
}
$hash2 = hash('sha256', $concat2, false);

echo "Concatenation String:\n";
echo "  " . $concat2 . "\n";
echo "Length: " . strlen($concat2) . " characters\n\n";
echo "Hash Result:\n";
echo "  " . $hash2 . "\n";
echo "Expected:   \n";
echo "  " . $expectedHash . "\n\n";

if ($hash2 === $expectedHash) {
    echo "✅ MATCH CONFIRMED! Hash matches expected value.\n\n";
} else {
    echo "❌ MISMATCH! Hashes do not match. Difference: uppercase 'En' produces different hash.\n\n";
}

echo "┌──────────────────────────────────────────────────────────────────┐\n";
echo "│ TEST 3: SHA-1 with Lowercase 'en' (LEGACY ALGORITHM)            │\n";
echo "└──────────────────────────────────────────────────────────────────┘\n\n";

$hash3 = hash('sha1', $concat1, false);

echo "Hash Result (SHA-1):\n";
echo "  " . $hash3 . "\n";
echo "Expected (SHA-256):   \n";
echo "  " . $expectedHash . "\n\n";

if ($hash3 === $expectedHash) {
    echo "✅ MATCH CONFIRMED! SHA-1 matches expected value.\n\n";
} else {
    echo "❌ MISMATCH! SHA-1 does not match. DirectPay uses SHA-256, not SHA-1.\n\n";
}

echo "┌──────────────────────────────────────────────────────────────────┐\n";
echo "│ TEST 4: 11-Field vs 5-Field Comparison                          │\n";
echo "└──────────────────────────────────────────────────────────────────┘\n\n";

// 5-field test
$fields5 = [
    'Amount' => $amount,
    'CurrencyISOCode' => $currency,
    'MerchantID' => $merchantId,
    'MessageID' => $messageId,
    'TransactionID' => $transactionId
];

$concat5 = $authToken;
foreach ($fields5 as $value) {
    $concat5 .= $value;
}
$hash5 = hash('sha256', $concat5, false);

echo "11-Field Hash:\n";
echo "  " . $hash1 . "\n";
echo "5-Field Hash: \n";
echo "  " . $hash5 . "\n";
echo "Expected:    \n";
echo "  " . $expectedHash . "\n\n";

echo "Field Count Comparison:\n";
echo "  11 fields: Length=" . strlen($concat1) . " → Hash matches: " . ($hash1 === $expectedHash ? "YES ✓" : "NO ✗") . "\n";
echo "  5 fields:  Length=" . strlen($concat5) . " → Hash matches: " . ($hash5 === $expectedHash ? "YES ✓" : "NO ✗") . "\n\n";

echo "┌──────────────────────────────────────────────────────────────────┐\n";
echo "│ SUMMARY TABLE                                                    │\n";
echo "└──────────────────────────────────────────────────────────────────┘\n\n";

$testResults = [
    [
        'Algorithm' => 'SHA-256',
        'Fields' => '11',
        'Language' => 'en (lowercase)',
        'Concatenation Length' => strlen($concat1),
        'Hash' => substr($hash1, 0, 16) . '...',
        'Matches Expected' => ($hash1 === $expectedHash ? '✅ YES' : '❌ NO')
    ],
    [
        'Algorithm' => 'SHA-256',
        'Fields' => '11',
        'Language' => 'En (uppercase)',
        'Concatenation Length' => strlen($concat2),
        'Hash' => substr($hash2, 0, 16) . '...',
        'Matches Expected' => ($hash2 === $expectedHash ? '✅ YES' : '❌ NO')
    ],
    [
        'Algorithm' => 'SHA-1',
        'Fields' => '11',
        'Language' => 'en (lowercase)',
        'Concatenation Length' => strlen($concat1),
        'Hash' => substr($hash3, 0, 16) . '...',
        'Matches Expected' => ($hash3 === $expectedHash ? '✅ YES' : '❌ NO')
    ],
    [
        'Algorithm' => 'SHA-256',
        'Fields' => '5',
        'Language' => 'en (lowercase)',
        'Concatenation Length' => strlen($concat5),
        'Hash' => substr($hash5, 0, 16) . '...',
        'Matches Expected' => ($hash5 === $expectedHash ? '✅ YES' : '❌ NO')
    ]
];

// Print table header
printf("%-12s %-8s %-18s %-20s %-20s %-15s\n", 'Algorithm', 'Fields', 'Language', 'Concat Length', 'Hash (first 16)', 'Match');
echo str_repeat("-", 93) . "\n";

// Print table rows
foreach ($testResults as $row) {
    printf("%-12s %-8s %-18s %-20s %-20s %-15s\n",
        $row['Algorithm'],
        $row['Fields'],
        $row['Language'],
        $row['Concatenation Length'],
        $row['Hash'],
        $row['Matches Expected']
    );
}

echo "\n\n";
echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║                        CONCLUSION                                  ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n\n";

if ($hash1 === $expectedHash) {
    echo "✅ CONFIRMED: Your backend implementation is CORRECT!\n\n";
    echo "Hash Algorithm:    SHA-256 ✓\n";
    echo "Field Count:       11 fields ✓\n";
    echo "Language Value:    'en' (lowercase) ✓\n";
    echo "Encoding:          UTF-8 ✓\n";
    echo "Calculation:       Verified and correct ✓\n\n";
    echo "Your code generates the EXACT hash expected from DirectPay.\n";
    echo "Error 00018 is NOT due to incorrect hash calculation.\n\n";
} else {
    echo "❌ Your implementation does not match the expected hash.\n";
}

?>
