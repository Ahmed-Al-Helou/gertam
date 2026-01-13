<?php
/**
 * Test: Verify ResponseBackURL handling in concatenation
 */

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Test Case: Order 219
$paymentData = [
    'Amount' => '48986',
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa Order 219',
    'Quantity' => '1',
    'ResponseBackURL' => 'http://localhost:3000/payment/callback?order_id=219&payment_id=66',
    'ThemeID' => '1',
    'TransactionID' => 'ORD-219-BL8H4K',
    'Version' => '1.0',
];

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  Analyzing ResponseBackURL in Concatenation                     ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

// The fields in order
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

echo "Building concatenation string:\n";
echo "───────────────────────────────────────────────────────────────────\n";

$concatenation = $authToken;
$step = 1;

foreach ($sortedFields as $field) {
    if (isset($paymentData[$field])) {
        $value = (string)$paymentData[$field];
        
        if ($field === 'PaymentDescription') {
            $value = str_replace(' ', '+', $value);
        }
        
        $concatenation .= $value;
        
        if ($field === 'ResponseBackURL') {
            echo "\nStep $step: ResponseBackURL\n";
            echo "  Original value: " . $paymentData[$field] . "\n";
            echo "  Value added: " . $value . "\n";
            echo "  Concatenation so far ends with: " . substr($concatenation, -50) . "\n";
        }
        
        $step++;
    }
}

echo "\n\n";
echo "FINAL CONCATENATION STRING:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo $concatenation . "\n\n";

echo "Length: " . strlen($concatenation) . " characters\n\n";

echo "WHAT DIRECTPAY EXPECTS:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo "NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm489860682enDP000000511AlFaraa+Order+2091http://localhost:3000/payment/callback?order_id=209payment_id=561ORD-209-8aeOEj1.0\n\n";

echo "NOTICE:\n";
echo "───────────────────────────────────────────────────────────────────\n";
echo "DirectPay expects NO & before payment_id\n";
echo "Current format: ?order_id=219&payment_id=66\n";
echo "Expected format: ?order_id=209payment_id=56\n";
echo "\nThe & is NOT URL-encoded, it's just removed!\n";

?>
