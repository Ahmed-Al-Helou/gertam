<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DirectPayController extends Controller
{
    private $merchantId = 'DP00000051';
    private $authToken = 'NzQ3ODkxNmUyMDcyN2M1ZWIwMTRkYTFm';
    private $srUrlPayment = 'https://paytest.directpay.sa/SmartRoutePaymentWeb/SRPayMsgHandler';
    private $srUrlInquiry = 'https://paytest.directpay.sa/SmartRoutePaymentWeb/SRMsgHandler';

    public function __construct()
    {
        // Load from environment variables in production
        if (env('DIRECTPAY_MERCHANT_ID')) {
            $this->merchantId = env('DIRECTPAY_MERCHANT_ID');
            $this->authToken = env('DIRECTPAY_AUTH_TOKEN');
            $this->srUrlPayment = env('DIRECTPAY_SR_URL_PAYMENT');
            $this->srUrlInquiry = env('DIRECTPAY_SR_URL_INQUIRY');
        }
    }

    /**
     * Initiate DirectPay payment
     */
    public function initiatePayment(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|exists:orders,id',
                'payment_method' => 'required|in:directpay,cod',
            ]);

            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }

            $order = Order::findOrFail($request->order_id);
            // Note: Don't try to load 'items' relationship - use 'orderItem' instead

            // Check if order belongs to user
            if ($order->user_id !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // Validate order has required fields
            if (!$order->totlePrice || !$order->name || !$order->email || !$order->phone) {
                Log::warning('Order missing required fields', [
                    'order_id' => $order->id,
                    'has_totlePrice' => isset($order->totlePrice),
                    'has_name' => isset($order->name),
                    'has_email' => isset($order->email),
                    'has_phone' => isset($order->phone),
                ]);
                return response()->json(['message' => 'Order is missing required information'], 400);
            }

            // Handle COD payment
            if ($request->payment_method === 'cod') {
                $order->update(['status' => 'pending', 'payment_method' => 'cod']);

                return response()->json([
                    'message' => 'تم قبول الطلب - الدفع عند الاستلام',
                    'order_id' => $order->id,
                    'redirect' => '/order-success',
                ], 200);
            }

            // DirectPay payment processing
            try {
                $amount = (float) $order->totlePrice;
                if ($amount <= 0) {
                    throw new \Exception('Invalid order amount: ' . $amount);
                }

                $payment = Payment::create([
                    'order_id' => $order->id,
                    'user_id' => $user->id,
                    'amount' => $amount,
                    'currency' => 'SAR',
                    'payment_method' => 'directpay',
                    'status' => 'pending',
                ]);

                $referenceNumber = 'ORD-' . $order->id . '-' . Str::random(6);
                $payment->update(['reference_number' => $referenceNumber]);

                // Generate DirectPay payment request data
                $paymentFormData = $this->generateDirectPayFormData($order, $payment, $referenceNumber);

                Log::info('Payment initiation successful', [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'amount' => $amount,
                ]);

                return response()->json([
                    'message' => 'تم إعداد الدفع',
                    'payment_form_data' => $paymentFormData,
                    'payment_url' => $this->srUrlPayment,
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                ], 200);
            } catch (\Exception $paymentEx) {
                Log::error('Payment creation failed', [
                    'order_id' => $order->id,
                    'error' => $paymentEx->getMessage(),
                    'trace' => $paymentEx->getTraceAsString(),
                ]);
                throw $paymentEx;
            }
        } catch (\Illuminate\Validation\ValidationException $ve) {
            Log::warning('Payment initiation validation failed', [
                'errors' => $ve->errors(),
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $ve->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment initiation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'فشل في بدء عملية الدفع',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate DirectPay form data for POST request
     * Based on DirectPay Integration Guide v2.2 and .NET Sample Code v1.0
     */
    private function generateDirectPayFormData($order, $payment, $referenceNumber)
    {
        try {
            $amount = (float) $order->totlePrice;
            if ($amount <= 0) {
                throw new \Exception('Invalid amount: ' . $amount);
            }

            // DirectPay requires amount in cents (fils) - no decimal places
            $amountInCents = (string) round($amount * 100);

            // ResponseBackURL - encode & as %26 for proper URL handling in hash
            $callbackParams = 'order_id=' . $order->id . '%26payment_id=' . $payment->id;
            $returnUrl = env('FRONTEND_URL', 'http://localhost:3000') . '/payment/callback?' . $callbackParams;
            
            // PaymentDescription - simple format without special characters
            $paymentDescription = 'AlFaraa Order ' . $order->id;

            // DirectPay requires 12 fields for hash calculation
            // Fields must be in ALPHABETICAL order for both hash and form
            $paymentData = [
                'Amount' => $amountInCents,
                'Channel' => '0',  // 0 = Web
                'CurrencyISOCode' => '682',  // SAR currency code
                'Language' => 'en',
                'MerchantID' => $this->merchantId,
                'MessageID' => '1',  // 1 = Redirect Payment
                'PaymentDescription' => $paymentDescription,
                'Quantity' => '1',
                'ResponseBackURL' => $returnUrl,
                'ThemeID' => '1',
                'TransactionID' => $referenceNumber,
                'Version' => '1.0',
            ];

            // Calculate SecureHash per DirectPay specification
            // Hash is: AuthToken + values of 12 fields in ALPHABETICAL order
            // PaymentDescription must be URL-encoded (spaces = +)
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

            // Build concatenation: AuthToken + values in alphabetical field order
            $concatenation = $this->authToken;
            foreach ($sortedFields as $field) {
                $value = $paymentData[$field];
                // URL-encode PaymentDescription (spaces become +)
                if ($field === 'PaymentDescription') {
                    $value = str_replace(' ', '+', $value);
                }
                $concatenation .= $value;
            }

            // SHA-256 hash, lowercase hex
            $secureHash = hash('sha256', $concatenation, false);
            $paymentData['SecureHash'] = $secureHash;

            Log::info('DirectPay form data generated', [
                'order_id' => $order->id,
                'reference' => $referenceNumber,
                'amount_cents' => $amountInCents,
                'merchant' => $this->merchantId,
                'hash_string' => $concatenation,
                'hash_string_length' => strlen($concatenation),
                'secureHash' => $secureHash,
            ]);

            return $paymentData;
        } catch (\Exception $e) {
            Log::error('Failed to generate DirectPay form data', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Handle DirectPay callback (Server to Server)
     */
    public function handleCallback(Request $request)
    {
        try {
            Log::info('DirectPay callback received', $request->all());

            // Verify callback authenticity - check secure hash if provided
            $receivedHash = $request->input('secureHash');
            if ($receivedHash) {
                $transactionId = $request->input('tranRef');
                $status = $request->input('status');
                $orderReference = $request->input('orderReference');
                $amount = $request->input('amount');

                // Reconstruct hash: tranRef + status + orderReference + amount + authToken
                $hashString = $transactionId . $status . $orderReference . $amount . $this->authToken;
                $calculatedHash = sha1($hashString);

                if ($receivedHash !== $calculatedHash) {
                    Log::warning('DirectPay callback hash verification failed', [
                        'received_hash' => $receivedHash,
                        'calculated_hash' => $calculatedHash,
                    ]);
                    return response()->json(['message' => 'Hash verification failed'], 400);
                }
            }

            // Get transaction details
            $transactionId = $request->input('tranRef');
            $status = $request->input('status');
            $orderReference = $request->input('orderReference');

            if (!$transactionId || !$status || !$orderReference) {
                Log::warning('DirectPay callback missing required fields');
                return response()->json(['message' => 'Invalid callback data'], 400);
            }

            // Parse order reference
            $parts = explode('-', $orderReference);
            $orderId = $parts[1] ?? null;

            if (!$orderId) {
                Log::warning('Could not parse order ID from reference', ['orderReference' => $orderReference]);
                return response()->json(['message' => 'Invalid order reference'], 400);
            }

            $order = Order::findOrFail($orderId);
            $payment = Payment::where('order_id', $order->id)->first();

            if (!$payment) {
                Log::warning('Payment record not found', ['order_id' => $orderId]);
                return response()->json(['message' => 'Payment not found'], 404);
            }

            // Update payment status based on DirectPay response
            if ($status === 'success') {
                $payment->update([
                    'transaction_id' => $transactionId,
                    'status' => 'completed',
                    'payment_response' => $request->all(),
                ]);

                $order->update(['status' => 'confirmed']);

                Log::info('Payment completed successfully', [
                    'order_id' => $orderId,
                    'transaction_id' => $transactionId,
                ]);

                return response()->json([
                    'message' => 'تم استلام الدفع بنجاح',
                    'order_id' => $orderId,
                ], 200);
            } else {
                $payment->update([
                    'transaction_id' => $transactionId,
                    'status' => 'failed',
                    'payment_response' => $request->all(),
                ]);

                Log::warning('Payment failed', [
                    'order_id' => $orderId,
                    'status' => $status,
                ]);

                return response()->json([
                    'message' => 'فشل الدفع',
                    'status' => $status,
                ], 200);
            }
        } catch (\Exception $e) {
            Log::error('Callback processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'message' => 'حدث خطأ في معالجة الرد',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Handle DirectPay client callback (redirect from payment gateway)
     */
    public function clientCallback(Request $request)
    {
        try {
            $orderId = $request->input('order_id');
            $paymentId = $request->input('payment_id');

            Log::info('DirectPay client callback', [
                'order_id' => $orderId,
                'payment_id' => $paymentId,
                'query' => $request->query(),
            ]);

            if ($orderId && $paymentId) {
                $payment = Payment::findOrFail($paymentId);

                // Verify status with DirectPay
                $status = $this->getPaymentStatusFromDirectPay($payment->reference_number);

                if ($status === 'completed') {
                    $payment->update(['status' => 'completed']);
                    Order::findOrFail($orderId)->update(['status' => 'confirmed']);
                }

                return response()->json([
                    'status' => $status,
                    'order_id' => $orderId,
                    'payment_id' => $paymentId,
                ], 200);
            }

            return response()->json(['message' => 'Invalid parameters'], 400);
        } catch (\Exception $e) {
            Log::error('Client callback failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Callback failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get payment status from DirectPay
     */
    public function getPaymentStatus(Request $request)
    {
        try {
            $paymentId = $request->input('payment_id');
            $payment = Payment::findOrFail($paymentId);

            // Verify user owns the payment
            if ($payment->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            return response()->json([
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
                'status' => $payment->status,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'payment_method' => $payment->payment_method,
                'transaction_id' => $payment->transaction_id,
                'reference_number' => $payment->reference_number,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Get payment status failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Failed to get payment status'], 500);
        }
    }

    /**
     * Get payment status from DirectPay gateway
     */
    private function getPaymentStatusFromDirectPay($referenceNumber)
    {
        try {
            // This would make an actual API call to DirectPay to verify payment status
            // For now, we rely on the callback to update the status
            $payment = Payment::where('reference_number', $referenceNumber)->first();
            return $payment ? $payment->status : 'unknown';
        } catch (\Exception $e) {
            Log::error('Failed to get payment status from DirectPay', [
                'reference' => $referenceNumber,
                'error' => $e->getMessage(),
            ]);
            return 'error';
        }
    }
}
