<?php
/**
 * Debug script to test DirectPay form submission with actual fields
 * This simulates what the frontend sends to DirectPay
 */

// Test data from Order 212 (latest successful hash)
$directpayUrl = 'https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler';

$formData = [
    'MessageID' => '1',
    'TransactionID' => 'ORD-212-90rOP1',
    'MerchantID' => 'DP00000051',
    'Amount' => '48986',
    'CurrencyISOCode' => '682',
    'Channel' => '0',
    'Language' => 'en',
    'Quantity' => '1',
    'ThemeID' => '1',
    'Version' => '1.0',
    'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=212&payment_id=59',
    'SecureHash' => 'f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af',
    'PaymentDescription' => 'AlFaraa Order 212',
];

echo "═══════════════════════════════════════════════════════════════════\n";
echo "DIRECTPAY FORM SUBMISSION TEST\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "URL: $directpayUrl\n\n";

echo "FORM DATA TO SUBMIT:\n";
echo "─────────────────────────────────────────────────────────────────\n";
foreach ($formData as $key => $value) {
    echo "  $key: " . (strlen($value) > 50 ? substr($value, 0, 47) . '...' : $value) . "\n";
}

echo "\n";
echo "CHECKING FOR POTENTIAL ISSUES:\n";
echo "─────────────────────────────────────────────────────────────────\n";

// Check if all values are strings
$nonStringFields = [];
foreach ($formData as $key => $value) {
    if (!is_string($value)) {
        $nonStringFields[$key] = gettype($value);
    }
}

if (!empty($nonStringFields)) {
    echo "⚠️ Non-string fields detected (will be auto-converted):\n";
    foreach ($nonStringFields as $field => $type) {
        echo "   - $field: " . $type . "\n";
    }
} else {
    echo "✅ All fields are strings\n";
}

echo "\n";

// Check encoding
echo "ENCODING CHECK:\n";
echo "─────────────────────────────────────────────────────────────────\n";
$hasNonAscii = false;
foreach ($formData as $key => $value) {
    if (!mb_check_encoding($value, 'UTF-8')) {
        echo "⚠️ Field '$key' is not valid UTF-8\n";
        $hasNonAscii = true;
    }
}
if (!$hasNonAscii) {
    echo "✅ All fields are valid UTF-8\n";
}

echo "\n";

// Check field names match DirectPay spec
echo "FIELD NAMES VALIDATION:\n";
echo "─────────────────────────────────────────────────────────────────\n";

$requiredFields = ['MessageID', 'TransactionID', 'MerchantID', 'Amount', 'CurrencyISOCode', 'Channel', 'Language', 'Quantity', 'ThemeID', 'Version', 'ResponseBackURL', 'SecureHash'];
$submittedFields = array_keys($formData);

$missingFields = array_diff($requiredFields, $submittedFields);
$extraFields = array_diff($submittedFields, $requiredFields);

if (!empty($missingFields)) {
    echo "❌ Missing required fields:\n";
    foreach ($missingFields as $field) {
        echo "   - $field\n";
    }
} else {
    echo "✅ All required fields present\n";
}

if (!empty($extraFields)) {
    echo "⚠️ Extra fields (beyond hash fields):\n";
    foreach ($extraFields as $field) {
        echo "   - $field (this is OK if it's optional like PaymentDescription)\n";
    }
} else {
    echo "✅ No extra fields\n";
}

echo "\n";

// Check for special characters that might cause issues
echo "SPECIAL CHARACTER CHECK:\n";
echo "─────────────────────────────────────────────────────────────────\n";

$specialCharIssues = [];
foreach ($formData as $key => $value) {
    // Check for problematic characters
    if (preg_match('/[<>\"\'`;\\\\]/', $value)) {
        $specialCharIssues[$key] = $value;
    }
}

if (!empty($specialCharIssues)) {
    echo "⚠️ Fields with special characters:\n";
    foreach ($specialCharIssues as $field => $value) {
        echo "   - $field: $value\n";
    }
} else {
    echo "✅ No problematic special characters\n";
}

echo "\n";

// Simulate form submission
echo "FORM SUBMISSION SIMULATION:\n";
echo "─────────────────────────────────────────────────────────────────\n";
echo "Method: POST\n";
echo "Target URL: $directpayUrl\n";
echo "Content-Type: application/x-www-form-urlencoded\n";

$queryString = http_build_query($formData);
echo "\nQuery String (first 100 chars): " . substr($queryString, 0, 100) . "...\n";
echo "Total Query String Length: " . strlen($queryString) . " bytes\n";

echo "\n";
echo "═══════════════════════════════════════════════════════════════════\n";
echo "RECOMMENDATIONS:\n";
echo "═══════════════════════════════════════════════════════════════════\n";
echo "\n";
echo "1. Verify that DirectPay test server is accessible\n";
echo "2. Check merchant account status (DP00000051)\n";
echo "3. Verify auth token is correct\n";
echo "4. Contact DirectPay support with this test data:\n";
echo "   - Merchant ID: DP00000051\n";
echo "   - TransactionID: ORD-212-90rOP1\n";
echo "   - Amount: 48986 (489.86 SAR)\n";
echo "   - SecureHash: f050fbd9814458a35e1af4ea59a5525b6f6d95da2114d1016381926e94df63af\n";
echo "   - Error: 00018 (Secure hash does not match)\n";
echo "\n";
echo "4. Ask DirectPay to:\n";
echo "   a) Verify the merchant account is properly configured\n";
echo "   b) Confirm they're using SHA-256 for hash validation\n";
echo "   c) Confirm field order for hash (alphabetical)\n";
echo "   d) Provide their own hash calculation for same data for comparison\n";
echo "\n";
?>
