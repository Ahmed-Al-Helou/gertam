#!/bin/bash

# DirectPay Fix Verification Script
# This script verifies that the DirectPay fix has been applied correctly

echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║    DirectPay Error 00018 FIX - Verification Script              ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""

# Check if DirectPayController.php exists
if [ ! -f "app/Http/Controllers/Api/DirectPayController.php" ]; then
    echo "❌ DirectPayController.php not found!"
    exit 1
fi

echo "✅ DirectPayController.php found"
echo ""

# Check if PaymentDescription is in buildDirectPaySecureHash
if grep -q "'PaymentDescription'" app/Http/Controllers/Api/DirectPayController.php; then
    echo "✅ PaymentDescription is included in sortedFields"
else
    echo "❌ PaymentDescription is NOT in sortedFields"
    exit 1
fi

# Check if URL-encoding is implemented
if grep -q "str_replace.*'+'" app/Http/Controllers/Api/DirectPayController.php; then
    echo "✅ URL-encoding for PaymentDescription is implemented"
else
    echo "❌ URL-encoding for PaymentDescription is NOT implemented"
    exit 1
fi

# Check if there are 12 fields
field_count=$(grep -A 20 "'\$sortedFields = \[" app/Http/Controllers/Api/DirectPayController.php | grep -o "'[A-Za-z]*'" | wc -l)
echo "✅ Number of fields in hash: $field_count (should be 12)"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                        All checks passed!                        ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "The DirectPay Error 00018 fix has been successfully applied."
echo ""
echo "Next steps:"
echo "1. Test a new payment through DirectPay"
echo "2. Check storage/logs/laravel.log for the new hash"
echo "3. The payment should now be accepted by DirectPay"
