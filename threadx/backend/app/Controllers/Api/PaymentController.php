<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\OrderModel;
use App\Models\PaymentModel;
use App\Services\PaymentService;

class PaymentController extends BaseApiController
{
    public function initiate()
    {
        $data = $this->request->getJSON(true);
        $order = (new OrderModel())->findByNumberOrId($data['order_number'] ?? '');
        if (!$order) return json_error('Order not found.', 404);

        try {
            $fields = (new PaymentService())->createPayment($order);
        } catch (\RuntimeException $e) {
            return json_error($e->getMessage(), 500);
        }

        (new PaymentModel())->insert([
            'order_id' => $order['id'], 'provider' => 'payhere',
            'amount' => $order['total'], 'status' => 'initiated',
        ]);

        return json_success($fields);
    }

    /**
     * Server-to-server callback from the payment gateway.
     * This is the ONLY place a payment can be marked "paid" — never trust
     * a status the browser reports on redirect back to the site.
     */
    public function callback()
    {
        $payload = $this->request->getPost() ?: $this->request->getJSON(true);
        $verified = (new PaymentService())->handleCallback($payload);

        $orderModel = new OrderModel();
        $order = $orderModel->where('order_number', $payload['order_id'] ?? '')->first();

        if (!$order) {
            return $this->response->setStatusCode(404)->setBody('Order not found');
        }

        $paymentModel = new PaymentModel();
        $payment = $paymentModel->where('order_id', $order['id'])->orderBy('id', 'DESC')->first();

        if ($verified) {
            $orderModel->update($order['id'], ['payment_status' => 'paid', 'order_status' => 'confirmed']);
            if ($payment) {
                $paymentModel->update($payment['id'], [
                    'status' => 'paid',
                    'provider_reference' => $payload['payment_id'] ?? null,
                    'raw_callback' => json_encode($payload),
                ]);
            }
            (new \App\Models\OrderStatusHistoryModel())->log($order['id'], 'confirmed', null, 'Payment verified via gateway callback.');
        } else {
            $orderModel->update($order['id'], ['payment_status' => 'failed']);
            if ($payment) {
                $paymentModel->update($payment['id'], ['status' => 'failed', 'raw_callback' => json_encode($payload)]);
            }
        }

        return $this->response->setStatusCode(200)->setBody('OK');
    }

    public function status($orderId = null)
    {
        $order = (new OrderModel())->find((int) $orderId);
        if (!$order) return json_error('Order not found.', 404);
        return json_success(['payment_status' => $order['payment_status']]);
    }
}
