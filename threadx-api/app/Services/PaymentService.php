<?php

namespace App\Services;

/**
 * Payment gateway abstraction. Concrete provider is chosen via
 * PAYMENT_PROVIDER env var so a different Sri Lankan gateway
 * (or a global one) can be swapped in without touching callers.
 *
 * CRITICAL: verifyPayment()/handleCallback() must NEVER trust a
 * status value sent directly from the browser — only a signed
 * server-to-server callback (or a server-side verify API call)
 * may mark an order as paid.
 */
interface PaymentGatewayInterface
{
    public function createPayment(array $order): array; // returns fields the frontend needs to redirect/submit to the gateway
    public function verifyCallback(array $payload): bool; // verifies signature/hash from the gateway's callback
    public function refund(string $providerReference, float $amount): bool;
}

class PaymentService
{
    protected PaymentGatewayInterface $gateway;

    public function __construct(?PaymentGatewayInterface $gateway = null)
    {
        $this->gateway = $gateway ?? $this->resolveGateway();
    }

    protected function resolveGateway(): PaymentGatewayInterface
    {
        return match (env('PAYMENT_PROVIDER', 'payhere')) {
            'payhere' => new PayHereGateway(),
            default => new PayHereGateway(),
        };
    }

    public function createPayment(array $order): array
    {
        return $this->gateway->createPayment($order);
    }

    public function handleCallback(array $payload): bool
    {
        // Server-side signature verification — the ONLY source of truth
        // for whether a payment succeeded. The frontend/browser status
        // is never trusted for marking an order paid.
        return $this->gateway->verifyCallback($payload);
    }

    public function refundPayment(string $providerReference, float $amount): bool
    {
        return $this->gateway->refund($providerReference, $amount);
    }
}

/**
 * PayHere (Sri Lanka) implementation.
 * Docs: https://support.payhere.lk/api-&-mobile-sdk/payhere-checkout
 *
 * Merchant ID / secret must be supplied via env — see .env.example.
 * This class intentionally does not hardcode credentials.
 */
class PayHereGateway implements PaymentGatewayInterface
{
    public function createPayment(array $order): array
    {
        $merchantId = env('PAYHERE_MERCHANT_ID');
        $merchantSecret = env('PAYHERE_MERCHANT_SECRET');

        if (!$merchantId || !$merchantSecret) {
            throw new \RuntimeException(
                'PayHere credentials are not configured. Set PAYHERE_MERCHANT_ID and ' .
                'PAYHERE_MERCHANT_SECRET in your .env file before enabling online payments.'
            );
        }

        // PayHere requires an MD5 hash of order details signed with the merchant secret.
        $amountFormatted = number_format((float) $order['total'], 2, '.', '');
        $hashedSecret = strtoupper(md5($merchantSecret));
        $hash = strtoupper(md5(
            $merchantId . $order['order_number'] . $amountFormatted . 'LKR' . $hashedSecret
        ));

        return [
            'action_url' => env('PAYMENT_MODE', 'sandbox') === 'sandbox'
                ? 'https://sandbox.payhere.lk/pay/checkout'
                : 'https://www.payhere.lk/pay/checkout',
            'merchant_id' => $merchantId,
            'return_url' => env('PAYHERE_RETURN_URL'),
            'cancel_url' => env('PAYHERE_CANCEL_URL'),
            'notify_url' => env('PAYHERE_NOTIFY_URL'),
            'order_id' => $order['order_number'],
            'items' => 'THREADX Order ' . $order['order_number'],
            'currency' => 'LKR',
            'amount' => $amountFormatted,
            'hash' => $hash,
        ];
    }

    public function verifyCallback(array $payload): bool
    {
        $merchantSecret = env('PAYHERE_MERCHANT_SECRET');
        if (!$merchantSecret) {
            return false;
        }

        $merchantId = $payload['merchant_id'] ?? '';
        $orderId = $payload['order_id'] ?? '';
        $amount = $payload['payhere_amount'] ?? '';
        $currency = $payload['payhere_currency'] ?? '';
        $statusCode = $payload['status_code'] ?? '';
        $receivedMd5 = $payload['md5sig'] ?? '';

        $hashedSecret = strtoupper(md5($merchantSecret));
        $expectedMd5 = strtoupper(md5(
            $merchantId . $orderId . $amount . $currency . $statusCode . $hashedSecret
        ));

        // status_code "2" = success per PayHere docs.
        return hash_equals($expectedMd5, $receivedMd5) && $statusCode === '2';
    }

    public function refund(string $providerReference, float $amount): bool
    {
        // PayHere refunds currently require a merchant portal / support request
        // rather than a public API call. Stubbed here for the abstraction;
        // wire up the real endpoint once PayHere issues one for your account.
        return false;
    }
}
