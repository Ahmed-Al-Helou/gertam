<?php
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// استخدام الـ URL بدون & في الـ hash string كما في رسالة DirectPay
$hashString = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm489860682enDP000000511AlFaraa+Order+2091http://localhost:3000/payment/callback?order_id=209payment_id=561ORD-209-8aeOEj1.0';

echo "Hash String (without &): $hashString\n";
echo "Length: " . strlen($hashString) . "\n";
echo "SHA-256: " . hash('sha256', $hashString) . "\n";
?>
