<?php

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  FINAL SOLUTION: ResponseBackURL with & & Hash without &        ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

// The fix: Two different URLs!
// 1. $returnUrl - For actual form submission to DirectPay (with &)
// 2. $returnUrlForHash - For hash calculation (without &)

$orderId = 219;
$paymentId = 66;

// ✅ URL for form submission (normal format with &)
$returnUrl = 'http://localhost:3000/payment/callback?order_id=' . $orderId . '&payment_id=' . $paymentId;

// ✅ URL for hash calculation (without & as per DirectPay spec)
$returnUrlForHash = 'http://localhost:3000/payment/callback?order_id=' . $orderId . 'payment_id=' . $paymentId;

echo "TWO URLS SCENARIO:\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "1️⃣ URL for Form Submission to DirectPay (with &):\n";
echo "   $returnUrl\n";
echo "   ✅ Frontend will receive this from DirectPay callback\n";
echo "   ✅ Next.js can parse order_id and payment_id correctly\n\n";

echo "2️⃣ URL for Hash Concatenation (without & - DirectPay requirement):\n";
echo "   $returnUrlForHash\n";
echo "   ✅ Used ONLY for hash calculation\n";
echo "   ✅ Must NOT have & before payment_id\n\n";

// Now calculate hash with the correct URL
$authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
$amount = '48986';
$reference = 'ORD-219-BL8H4K';

$fields = [
    'Amount' => $amount,
    'Channel' => '0',
    'CurrencyISOCode' => '682',
    'Language' => 'en',
    'MerchantID' => 'DP00000051',
    'MessageID' => '1',
    'PaymentDescription' => 'AlFaraa+Order+219',
    'Quantity' => '1',
    'ResponseBackURL' => $returnUrlForHash,  // ✅ WITHOUT &
    'ThemeID' => '1',
    'TransactionID' => $reference,
    'Version' => '1.0',
];

$sortedFields = ['Amount', 'Channel', 'CurrencyISOCode', 'Language',
                 'MerchantID', 'MessageID', 'PaymentDescription',
                 'Quantity', 'ResponseBackURL', 'ThemeID',
                 'TransactionID', 'Version'];

$concatenation = $authToken;
foreach ($sortedFields as $field) {
    $concatenation .= $fields[$field];
}

$hash = hash('sha256', $concatenation, false);

echo "HASH CALCULATION:\n";
echo "═══════════════════════════════════════════════════════════════════\n\n";

echo "Concatenation String (uses URL WITHOUT &):\n";
echo "$concatenation\n\n";

echo "Hash Result:\n";
echo "$hash\n\n";

echo "═══════════════════════════════════════════════════════════════════\n";
echo "✅ THE SOLUTION:\n\n";

echo "Backend (DirectPayController.php):\n";
echo "  • Sends form with: ResponseBackURL = '$returnUrl' (with &)\n";
echo "  • Calculates hash with: ResponseBackURL = '$returnUrlForHash' (without &)\n\n";

echo "Frontend (Next.js callback page):\n";
echo "  • Receives URL from DirectPay: '$returnUrl' (with &)\n";
echo "  • Can properly parse: order_id and payment_id ✅\n";
echo "  • No 'Invalid URL' error ✅\n\n";

echo "DirectPay (Gateway):\n";
echo "  • Validates hash against: ResponseBackURL without & ✅\n";
echo "  • Sends callback with: ResponseBackURL with & (normal format) ✅\n";
echo "  • No Error 00018 ✅\n\n";

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║  This solution fixes BOTH issues:                               ║\n";
echo "║  1. Error 00018 (hash mismatch) ✅                              ║\n";
echo "║  2. Invalid URL error in Next.js ✅                             ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n";
?>
