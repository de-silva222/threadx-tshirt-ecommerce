<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\CartModel;
use App\Models\CartItemModel;
use App\Models\ProductVariantModel;
use App\Models\CouponModel;

class CartController extends BaseApiController
{
    protected CartModel $carts;
    protected CartItemModel $items;

    public function __construct()
    {
        $this->carts = new CartModel();
        $this->items = new CartItemModel();
    }

    protected function resolveCart(): array
    {
        return $this->carts->findOrCreate($this->currentUserId(), $this->guestSessionId());
    }

    public function index()
    {
        $cart = $this->resolveCart();
        $items = $this->items->forCartWithDetails($cart['id']);
        $subtotal = array_sum(array_column(array_filter($items, fn($i) => !$i['saved_for_later']), 'subtotal'));

        return json_success([
            'cart_id' => $cart['id'],
            'items' => array_values(array_filter($items, fn($i) => !$i['saved_for_later'])),
            'saved_for_later' => array_values(array_filter($items, fn($i) => $i['saved_for_later'])),
            'subtotal' => round($subtotal, 2),
        ]);
    }

    public function addItem()
    {
        $data = $this->request->getJSON(true);
        $cart = $this->resolveCart();
        $quantity = max(1, (int) ($data['quantity'] ?? 1));

        if (!empty($data['variant_id'])) {
            $variantModel = new ProductVariantModel();
            $variant = $variantModel->find((int) $data['variant_id']);
            if (!$variant || !$variant['is_active']) {
                return json_error('This variant is not available.', 404);
            }
            if ($variant['stock'] < $quantity) {
                return json_error('Not enough stock available.', 422);
            }

            $existing = $this->items->where('cart_id', $cart['id'])
                ->where('product_variant_id', $variant['id'])
                ->where('saved_for_later', 0)
                ->first();

            if ($existing) {
                $this->items->update($existing['id'], ['quantity' => $existing['quantity'] + $quantity]);
            } else {
                $this->items->insert([
                    'cart_id' => $cart['id'], 'product_variant_id' => $variant['id'], 'quantity' => $quantity,
                ]);
            }
        } elseif (!empty($data['custom_design_id'])) {
            $this->items->insert([
                'cart_id' => $cart['id'], 'custom_design_id' => (int) $data['custom_design_id'], 'quantity' => $quantity,
            ]);
        } else {
            return json_error('variant_id or custom_design_id is required.', 422);
        }

        return json_success(null, 'Added to cart.', 201);
    }

    public function updateItem($id = null)
    {
        $data = $this->request->getJSON(true);
        $item = $this->items->find((int) $id);
        if (!$item) return json_error('Cart item not found.', 404);

        $update = [];
        if (isset($data['quantity'])) $update['quantity'] = max(1, (int) $data['quantity']);
        if (isset($data['saved_for_later'])) $update['saved_for_later'] = (bool) $data['saved_for_later'] ? 1 : 0;

        $this->items->update($item['id'], $update);
        return json_success(null, 'Cart updated.');
    }

    public function removeItem($id = null)
    {
        $item = $this->items->find((int) $id);
        if (!$item) return json_error('Cart item not found.', 404);
        $this->items->delete($item['id']);
        return json_success(null, 'Item removed.');
    }

    public function applyCoupon()
    {
        $data = $this->request->getJSON(true);
        $cart = $this->resolveCart();
        $items = $this->items->forCartWithDetails($cart['id']);
        $subtotal = array_sum(array_column(array_filter($items, fn($i) => !$i['saved_for_later']), 'subtotal'));

        try {
            $coupon = (new CouponModel())->validateForUse($data['code'] ?? '', $subtotal, $this->currentUserId());
        } catch (\RuntimeException $e) {
            return json_error($e->getMessage(), 422);
        }

        $discount = $coupon['type'] === 'percentage'
            ? round($subtotal * ((float) $coupon['value'] / 100), 2)
            : min((float) $coupon['value'], $subtotal);

        return json_success(['code' => $coupon['code'], 'discount' => $discount]);
    }

    public function mergeGuestCart()
    {
        $data = $this->request->getJSON(true);
        $sessionId = $data['session_id'] ?? $this->guestSessionId();
        if ($sessionId) {
            $this->carts->mergeIntoUserCart($sessionId, $this->currentUserId());
        }
        return json_success(null, 'Cart merged.');
    }
}
