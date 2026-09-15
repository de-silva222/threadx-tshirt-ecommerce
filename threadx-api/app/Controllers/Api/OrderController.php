<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\OrderModel;
use App\Models\OrderItemModel;
use App\Models\OrderStatusHistoryModel;
use App\Models\ProductVariantModel;
use App\Models\CouponModel;
use App\Models\CartModel;
use App\Models\CartItemModel;
use App\Services\PricingService;
use RuntimeException;

class OrderController extends BaseApiController
{
    public function index()
    {
        $orders = (new OrderModel())->where('user_id', $this->currentUserId())
            ->orderBy('created_at', 'DESC')->findAll();
        return json_success($orders);
    }

    public function show($identifier = null)
    {
        $order = (new OrderModel())->findByNumberOrId($identifier);
        if (!$order) return json_error('Order not found.', 404);

        // Guests may look up an order by number + email match is recommended client-side;
        // logged-in users may only view their own orders.
        if ($this->currentUserId() && $order['user_id'] && $order['user_id'] != $this->currentUserId()) {
            return json_error('Order not found.', 404);
        }

        $order['items'] = (new OrderItemModel())->where('order_id', $order['id'])->findAll();
        return json_success($order);
    }

    public function track($identifier = null)
    {
        $order = (new OrderModel())->findByNumberOrId($identifier);
        if (!$order) return json_error('Order not found.', 404);

        $steps = ['pending', 'confirmed', 'processing', 'printing', 'packed', 'shipped', 'delivered'];
        $currentIndex = array_search($order['order_status'], $steps, true);

        $timeline = array_map(fn($step, $i) => [
            'status' => $step,
            'completed' => $order['order_status'] !== 'cancelled' && $currentIndex !== false && $i <= $currentIndex,
        ], $steps, array_keys($steps));

        return json_success([
            'order_number' => $order['order_number'],
            'order_status' => $order['order_status'],
            'payment_status' => $order['payment_status'],
            'courier_name' => $order['courier_name'],
            'tracking_number' => $order['tracking_number'],
            'timeline' => $timeline,
            'cancelled' => $order['order_status'] === 'cancelled',
        ]);
    }

    /**
     * Create an order.
     *
     * SECURITY: the client sends only variant/design IDs + quantities + a coupon
     * code + delivery district. Every price is recalculated server-side via
     * PricingService — the frontend's numbers are never trusted.
     */
    public function store()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'first_name' => 'required', 'last_name' => 'required',
            'email' => 'required|valid_email', 'phone' => 'required',
            'address_line' => 'required', 'city' => 'required', 'district' => 'required',
            'payment_method' => 'required|in_list[cod,online]',
        ];
        if (!$this->validateData($data, $rules) || empty($data['items'])) {
            return json_error('Validation failed. Check your details and cart.', 422, $this->validator->getErrors());
        }

        $db = \Config\Database::connect();
        $db->transStart();

        try {
            $pricing = new PricingService();
            $priced = $pricing->priceOrder(
                $data['items'],
                $data['coupon_code'] ?? null,
                $data['district'],
                $this->currentUserId()
            );

            $orderModel = new OrderModel();
            $orderNumber = $orderModel->generateOrderNumber();

            $paymentStatus = $data['payment_method'] === 'cod' ? 'cod_pending' : 'pending';

            $orderId = $orderModel->insert([
                'order_number' => $orderNumber,
                'user_id' => $this->currentUserId(),
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'address_line' => $data['address_line'],
                'city' => $data['city'],
                'district' => $data['district'],
                'postal_code' => $data['postal_code'] ?? null,
                'subtotal' => $priced['subtotal'],
                'discount' => $priced['discount'],
                'delivery_fee' => $priced['delivery_fee'],
                'total' => $priced['total'],
                'coupon_id' => $priced['coupon_id'],
                'payment_method' => $data['payment_method'],
                'payment_status' => $paymentStatus,
                'order_status' => 'pending',
                'notes' => $data['notes'] ?? null,
            ], true);

            $orderItemModel = new OrderItemModel();
            $variantModel = new ProductVariantModel();

            foreach ($priced['items'] as $item) {
                $orderItemModel->insert(array_merge($item, ['order_id' => $orderId]));

                // Reduce stock atomically; fail the whole transaction if oversold.
                if ($item['product_variant_id']) {
                    $ok = $variantModel->reduceStock($item['product_variant_id'], $item['quantity']);
                    if (!$ok) {
                        throw new RuntimeException('Item went out of stock while placing your order: ' . $item['product_name']);
                    }
                }
            }

            if ($priced['coupon_id']) {
                (new CouponModel())->recordUsage($priced['coupon_id'], $this->currentUserId(), $orderId);
            }

            (new OrderStatusHistoryModel())->log($orderId, 'pending', $this->currentUserId(), 'Order placed.');

            // Clear the cart that was checked out.
            if (!empty($data['clear_cart'])) {
                $cart = (new CartModel())->findOrCreate($this->currentUserId(), $this->guestSessionId());
                (new CartItemModel())->where('cart_id', $cart['id'])->where('saved_for_later', 0)->delete();
            }

            $db->transComplete();

            if (!$db->transStatus()) {
                throw new RuntimeException('Could not complete your order. Please try again.');
            }

            $order = $orderModel->find($orderId);
            $order['items'] = $orderItemModel->where('order_id', $orderId)->findAll();

            return json_success($order, 'Order placed successfully.', 201);
        } catch (RuntimeException $e) {
            $db->transRollback();
            return json_error($e->getMessage(), 422);
        }
    }
}
