<?php
// Debug script to show exact hash string format

$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$orderId = 209;
$paymentId = 56;
$amountInFils = 48986;
$merchantId = 'DP00000051';
$referenceNumber = 'ORD-209-8aeOEj';
$returnUrl = 'http://localhost:3000/payment/callback?order_id=209&payment_id=56';

// Your current code
$paymentDescription = 'AlFaraa Order #' . $orderId;
$paymentDescriptionEncoded = str_replace(' ', '+', $paymentDescription);

echo "Payment Description: $paymentDescription\n";
echo "Encoded: $paymentDescriptionEncoded\n";
echo "---\n";

$fields_for_hash = [
    'Amount' => $amountInFils,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => $merchantId,
    'MessageID' => '1',
    'PaymentDescription' => $paymentDescriptionEncoded,
    'Quantity' => '1',
    'ResponseBackURL' => $returnUrl,
    'ThemeID' => '1',
    'TransactionID' => $referenceNumber,
    'Version' => '1.0',
];

ksort($fields_for_hash);

$hashString = $authToken;
foreach ($fields_for_hash as $key => $value) {
    $hashString .= $value;
    echo "$key => $value\n";
}

echo "\n---\n";
echo "Final Hash String:\n";
echo $hashString . "\n";
echo "\n---\n";
echo "Hash String Length: " . strlen($hashString) . "\n";
echo "SHA-256: " . hash('sha256', $hashString) . "\n";

// Now show the EXPECTED format from DirectPay
echo "\n\n=== EXPECTED FORMAT FROM DirectPay ===\n";
$expected = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm489860682enDP000000511AlFaraa+Order+2091http://localhost:3000/payment/callback?order_id=209&payment_id=56ORD-209-8aeOEj1.0';
echo "Expected: $expected\n";
echo "Expected Length: " . strlen($expected) . "\n";
?>
