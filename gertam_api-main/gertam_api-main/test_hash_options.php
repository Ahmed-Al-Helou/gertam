<?php
// استخدام الـ .NET documentation بالضبط

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$orderId = 209;
$paymentId = 56;
$amountInFils = 48986;
$merchantId = 'DP00000051';
$referenceNumber = 'ORD-209-8aeOEj';

// التجربة: هل يجب ترميز الـ ResponseBackURL؟
$returnUrl1 = 'http://localhost:3000/payment/callback?order_id=209&payment_id=56';
$returnUrl2 = urlencode('http://localhost:3000/payment/callback?order_id=209&payment_id=56');
$returnUrl3 = str_replace(' ', '+', 'http://localhost:3000/payment/callback?order_id=209&payment_id=56');

echo "Return URL 1 (raw): $returnUrl1\n";
echo "Return URL 2 (urlencode): $returnUrl2\n";
echo "Return URL 3 (spaces to +): $returnUrl3\n\n";

// الآن دعنا نحسب الـ hash مع كل خيار
$fields = [
    'Amount' => $amountInFils,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => $merchantId,
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+209',
    'Quantity' => '1',
    'ResponseBackURL' => $returnUrl1,
    'ThemeID' => '1',
    'TransactionID' => $referenceNumber,
    'Version' => '1.0',
];

ksort($fields);

echo "=== Option 1: Raw ResponseBackURL ===\n";
$hashString1 = $authToken;
foreach ($fields as $value) {
    $hashString1 .= $value;
}
echo "Hash String: $hashString1\n";
echo "Length: " . strlen($hashString1) . "\n";
echo "Hash: " . hash('sha256', $hashString1) . "\n\n";

// Try without ResponseBackURL in hash
$fields2 = [
    'Amount' => $amountInFils,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => $merchantId,
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+209',
    'Quantity' => '1',
    'ThemeID' => '1',
    'TransactionID' => $referenceNumber,
    'Version' => '1.0',
];

ksort($fields2);

echo "=== Option 2: WITHOUT ResponseBackURL in hash ===\n";
$hashString2 = $authToken;
foreach ($fields2 as $value) {
    $hashString2 .= $value;
}
echo "Hash String: $hashString2\n";
echo "Length: " . strlen($hashString2) . "\n";
echo "Hash: " . hash('sha256', $hashString2) . "\n\n";
?>
