<?php
// Quick test of the new document-order hash formula

$auth = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';

// Test order 170
$messageID = '1';
$merchantID = 'DP00000051';
$amount = '87347';
$currencyCode = '682';
$transactionID = 'ORD-170-03QYJj';

// Document order: MessageID, MerchantID, Amount, CurrencyISOCode, TransactionID
$concat = $auth . $messageID . $merchantID . $amount . $currencyCode . $transactionID;
$hash = hash('sha256', $concat);

echo "=== Document Order Hash Test ===\n";
echo "Concatenation: " . substr($concat, 0, 50) . "...\n";
echo "Hash: " . $hash . "\n";
echo "\nOrder 170 should now use: " . $hash . "\n";
echo "Previous (Alphabetical): 504b1e483f2b737e1d3f838a8ba3b7b0398e9758df926fe883ebe8a0f9a50458\n";
echo "\n✓ If hash changed, new formula is working.\n";
?>
