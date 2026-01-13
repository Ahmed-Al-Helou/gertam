<?php
// اختبار مع & مشفرة

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// مع & عادي
$url1 = 'http://localhost:3000/payment/callback?order_id=209&payment_id=56';

// مع & محرر
$url2 = 'http://localhost:3000/payment/callback?order_id=209%26payment_id=56';

// بدون & 
$url3 = 'http://localhost:3000/payment/callback?order_id=209payment_id=56';

$fields1 = [
    'Amount' => 48986,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+209',
    'Quantity' => '1',
    'ResponseBackURL' => $url1,
    'ThemeID' => '1',
    'TransactionID' => 'ORD-209-8aeOEj',
    'Version' => '1.0',
];

$fields2 = [
    'Amount' => 48986,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+209',
    'Quantity' => '1',
    'ResponseBackURL' => $url2,
    'ThemeID' => '1',
    'TransactionID' => 'ORD-209-8aeOEj',
    'Version' => '1.0',
];

$fields3 = [
    'Amount' => 48986,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+209',
    'Quantity' => '1',
    'ResponseBackURL' => $url3,
    'ThemeID' => '1',
    'TransactionID' => 'ORD-209-8aeOEj',
    'Version' => '1.0',
];

ksort($fields1);
ksort($fields2);
ksort($fields3);

echo "=== Option 1: With & (normal) ===\n";
$hash1 = $authToken;
foreach ($fields1 as $v) $hash1 .= $v;
echo "Hash: " . hash('sha256', $hash1) . "\n";
echo "Length: " . strlen($hash1) . "\n\n";

echo "=== Option 2: With %26 (encoded) ===\n";
$hash2 = $authToken;
foreach ($fields2 as $v) $hash2 .= $v;
echo "Hash: " . hash('sha256', $hash2) . "\n";
echo "Length: " . strlen($hash2) . "\n\n";

echo "=== Option 3: WITHOUT & ===\n";
$hash3 = $authToken;
foreach ($fields3 as $v) $hash3 .= $v;
echo "Hash: " . hash('sha256', $hash3) . "\n";
echo "Length: " . strlen($hash3) . "\n";
?>
