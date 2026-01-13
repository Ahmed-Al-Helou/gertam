#!/bin/bash

# DirectPay Payment System - Complete Diagnostic Script
# الغرض: التحقق من سبب فشل الدفع الإلكتروني

echo "================================"
echo "DirectPay System Diagnostic"
echo "================================"
echo ""

# 1. التحقق من السيرفر
echo "1️⃣  التحقق من أن السيرفر يعمل..."
if curl -s http://127.0.0.1:8000/api/payment/initiate -X OPTIONS -i | grep -q "200\|Allow"; then
    echo "✅ السيرفر يعمل بشكل صحيح"
else
    echo "❌ السيرفر لا يعمل - شغل: php artisan serve"
    exit 1
fi

echo ""
echo "2️⃣  التحقق من الـ DirectPay Credentials..."

# دخول artisan tinker
php artisan tinker <<EOF
echo "Merchant ID: " . env('DIRECTPAY_MERCHANT_ID', 'DP00000051') . "\n";
echo "Auth Token: " . env('DIRECTPAY_AUTH_TOKEN', 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm') . "\n";
echo "Payment URL: " . env('DIRECTPAY_SR_URL_PAYMENT', 'https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler') . "\n";
exit();
EOF

echo ""
echo "3️⃣  التحقق من Payment Model..."
php artisan tinker <<EOF
try {
    \$payment = new App\Models\Payment();
    echo "✅ Payment Model works\n";
    echo "Fillable: " . implode(", ", \$payment->getFillable()) . "\n";
} catch (\Exception \$e) {
    echo "❌ Error: " . \$e->getMessage() . "\n";
}
exit();
EOF

echo ""
echo "4️⃣  التحقق من جدول Payments..."
mysql -u root alfaraa -e "SELECT COUNT(*) as PaymentCount FROM payments;" 2>/dev/null || echo "❌ Cannot access database"

echo ""
echo "5️⃣  فحص آخر 5 محاولات دفع..."
mysql -u root alfaraa -e "SELECT id, order_id, amount, status, created_at FROM payments ORDER BY created_at DESC LIMIT 5;" 2>/dev/null || echo "❌ Cannot query"

echo ""
echo "6️⃣  فحص الـ Logs..."
echo "آخر 10 أسطر تحتوي على 'DirectPay':"
grep -i "directpay" storage/logs/laravel.log | tail -10 || echo "لا توجد سجلات"

echo ""
echo "================================"
echo "Diagnostic Complete"
echo "================================"
