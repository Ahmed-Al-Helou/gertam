<?php

/**
 * COMPREHENSIVE DIRECTPAY HASH VALIDATOR
 * Use this to generate test cases for DirectPay support
 */

echo "╔════════════════════════════════════════════════════════════════════╗\n";
echo "║        DIRECTPAY ERROR 00018 - COMPREHENSIVE HASH VALIDATION        ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n\n";

// Test Case 1: Order 212 (from latest logs)
$testCases = [
    [
        'name' => 'Order 212 - Latest Success',
        'merchant_id' => 'DP00000051',
        'auth_token' => 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm',
        'amount' => 48986,
        'channel' => '0',
        'currency' => '682',
        'language' => 'en',  // lowercase
        'message_id' => '1',
        'quantity' => '1',
        'response_url' => 'http://localhost:3000/payment/callback?order_id=212&payment_id=59',
        'theme_id' => '1',
        'transaction_id' => 'ORD-212-90rOP1',
        'version' => '1.0',
        'expected_hash' => 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af'
    ]
];

foreach ($testCases as $test) {
    echo "\n═══════════════════════════════════════════════════════════════════════\n";
    echo "TEST: {$test['name']}\n";
    echo "═══════════════════════════════════════════════════════════════════════\n\n";
    
    // Build fields in alphabetical order
    $fields = [
        'Amount' => $test['amount'],
        'Channel' => $test['channel'],
        'CurrencyISOCode' => $test['currency'],
        'Language' => $test['language'],
        'MerchantID' => $test['merchant_id'],
        'MessageID' => $test['message_id'],
        'Quantity' => $test['quantity'],
        'ResponseBackURL' => $test['response_url'],
        'ThemeID' => $test['theme_id'],
        'TransactionID' => $test['transaction_id'],
        'Version' => $test['version']
    ];
    
    echo "INPUT VALUES (in alphabetical order):\n";
    echo str_repeat("-", 70) . "\n";
    foreach ($fields as $key => $value) {
        printf("%-25s: %s\n", $key, $value);
    }
    
    echo "\n\nCONCATENATION PROCESS:\n";
    echo str_repeat("-", 70) . "\n";
    echo sprintf("AuthToken (prefix):   %s\n", substr($test['auth_token'], 0, 10) . '...');
    $concat = $test['auth_token'];
    foreach ($fields as $key => $value) {
        $concat .= $value;
        echo sprintf("After %s:  ...%s\n", $key, substr($concat, -15));
    }
    
    echo "\n\nFINAL CONCATENATION STRING:\n";
    echo str_repeat("-", 70) . "\n";
    echo $concat . "\n";
    echo sprintf("Length: %d characters\n", strlen($concat));
    
    // Calculate hash
    $calculatedHash = hash('sha256', $concat, false);
    
    echo "\n\nHASH CALCULATION:\n";
    echo str_repeat("-", 70) . "\n";
    echo sprintf("Algorithm:           SHA-256\n");
    echo sprintf("Encoding:            UTF-8\n");
    echo sprintf("Output Format:       Lowercase Hexadecimal\n");
    
    echo "\n\nRESULTS:\n";
    echo str_repeat("-", 70) . "\n";
    echo sprintf("Calculated Hash:     %s\n", $calculatedHash);
    echo sprintf("Expected Hash:       %s\n", $test['expected_hash']);
    echo sprintf("Match:               %s\n", ($calculatedHash === $test['expected_hash']) ? "✓ YES" : "✗ NO");
    
    // Alternative format tests
    echo "\n\nALTERNATIVE ALGORITHM TESTS:\n";
    echo str_repeat("-", 70) . "\n";
    
    // SHA-1
    $hash_sha1 = hash('sha1', $concat, false);
    echo sprintf("SHA-1 Hash:          %s\n", $hash_sha1);
    echo sprintf("  (If this matches, use SHA-1 instead of SHA-256)\n");
    
    // MD5
    $hash_md5 = hash('md5', $concat, false);
    echo sprintf("MD5 Hash:            %s\n", $hash_md5);
    echo sprintf("  (If this matches, use MD5 instead of SHA-256)\n");
    
    // With different Language values
    echo "\n\nLANGUAGE VARIANT TESTS:\n";
    echo str_repeat("-", 70) . "\n";
    
    $fieldVariants = $fields;
    $fieldVariants['Language'] = 'En';  // Uppercase
    $concat_En = $test['auth_token'];
    foreach ($fieldVariants as $value) {
        $concat_En .= $value;
    }
    $hash_En = hash('sha256', $concat_En, false);
    echo sprintf("With Language='En':  %s\n", $hash_En);
    echo sprintf("  (If this matches DirectPay's error response, use uppercase 'En')\n");
    
    // 5-field variant (if DirectPay really only uses 5)
    echo "\n\nMINIMAL 5-FIELD TEST:\n";
    echo str_repeat("-", 70) . "\n";
    $fields_5 = [
        'Amount' => $test['amount'],
        'CurrencyISOCode' => $test['currency'],
        'MerchantID' => $test['merchant_id'],
        'MessageID' => $test['message_id'],
        'TransactionID' => $test['transaction_id']
    ];
    $concat_5 = $test['auth_token'];
    foreach ($fields_5 as $value) {
        $concat_5 .= $value;
    }
    $hash_5 = hash('sha256', $concat_5, false);
    echo sprintf("5-field Hash:        %s\n", $hash_5);
    echo sprintf("  (If this matches, DirectPay only uses 5 fields)\n");
    
    echo "\n";
}

echo "\n╔════════════════════════════════════════════════════════════════════╗\n";
echo "║                         USAGE INSTRUCTIONS                         ║\n";
echo "╚════════════════════════════════════════════════════════════════════╝\n\n";

echo "1. RUN THIS SCRIPT:\n";
echo "   php /home/huzaifaa/code/alfaraa/back-end/test_comprehensive_hash.php\n\n";

echo "2. COMPARE OUTPUTS:\n";
echo "   - If calculated hash matches expected, the algorithm is correct\n";
echo "   - If SHA-1 or MD5 matches, DirectPay uses that algorithm instead\n";
echo "   - If 5-field hash matches, DirectPay uses only 5 fields\n\n";

echo "3. PROVIDE TO DIRECTPAY SUPPORT:\n";
echo "   - Copy the entire test output\n";
echo "   - Include your merchant ID\n";
echo "   - Ask them which hash value DirectPay expects\n";
echo "   - Ask them which algorithm they use\n";
echo "   - Ask them which fields they include\n\n";

?>
