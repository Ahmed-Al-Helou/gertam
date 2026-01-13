<?php
/**
 * Direct test to DirectPay - minimal test case
 */

$merchantId = 'DP00000051';
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Minimal test data
$testData = [
    'Amount' => '10000',  // 100 SAR in cents
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => $merchantId,
    'MessageID' => '1',
    'PaymentDescription' => 'Test Payment',
    'Quantity' => '1',
    'ResponseBackURL' => 'http://localhost:3000/payment/callback',
    'ThemeID' => '1',
    'TransactionID' => 'TEST-' . time(),
    'Version' => '1.0',
];

echo "═══════════════════════════════════════════════════════════\n";
echo "DirectPay Direct Test\n";
echo "═══════════════════════════════════════════════════════════\n\n";

// Sort fields alphabetically
$sortedFields = array_keys($testData);
sort($sortedFields);

echo "Fields (alphabetical):\n";
foreach ($sortedFields as $field) {
    echo "  - $field: {$testData[$field]}\n";
}

// Build hash string
$hashString = $authToken;
foreach ($sortedFields as $field) {
    $value = $testData[$field];
    if ($field === 'PaymentDescription') {
        $value = str_replace(' ', '+', $value);
    }
    $hashString .= $value;
}

$hash = hash('sha256', $hashString);

echo "\nHash String:\n$hashString\n";
echo "\nHash Length: " . strlen($hashString) . "\n";
echo "\nCalculated Hash:\n$hash\n";

// Add hash to data
$testData['SecureHash'] = $hash;

echo "\n═══════════════════════════════════════════════════════════\n";
echo "Creating HTML form for manual test...\n";
echo "═══════════════════════════════════════════════════════════\n\n";

// Create HTML form
$html = <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DirectPay Test Form</title>
</head>
<body>
    <h1>DirectPay Test Form</h1>
    <p>Hash: $hash</p>
    <form method="POST" action="https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler" id="testForm">

HTML;

foreach ($testData as $key => $value) {
    $html .= "        <input type=\"hidden\" name=\"$key\" value=\"$value\">\n";
}

$html .= <<<HTML
        <button type="submit">Submit to DirectPay</button>
    </form>
    
    <h2>Form Data:</h2>
    <pre>
HTML;

foreach ($testData as $key => $value) {
    $html .= "$key: $value\n";
}

$html .= <<<HTML
    </pre>
</body>
</html>
HTML;

file_put_contents('/home/huzaifaa/code/alfaraa/back-end/public/test_directpay.html', $html);

echo "✅ Test form created at: back-end/public/test_directpay.html\n";
echo "\nOpen this file in a browser and click Submit to test DirectPay directly.\n";
echo "\nIf this also fails with Error 00018, the problem is with:\n";
echo "  1. MerchantID or AuthToken credentials\n";
echo "  2. DirectPay account configuration\n";
echo "  3. DirectPay server-side validation logic\n\n";
