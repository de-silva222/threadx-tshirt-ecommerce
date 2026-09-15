<?php

namespace App\Models;

use CodeIgniter\Model;

class CartModel extends Model
{
    protected $table = 'carts';
    protected $allowedFields = ['user_id', 'session_id'];
    protected $useTimestamps = true;

    public function findOrCreate(?int $userId, ?string $sessionId): array
    {
        if ($userId) {
            $cart = $this->where('user_id', $userId)->first();
            if ($cart) return $cart;
            $id = $this->insert(['user_id' => $userId, 'session_id' => $sessionId], true);
            return $this->find($id);
        }

        $cart = $this->where('session_id', $sessionId)->first();
        if ($cart) return $cart;
        $id = $this->insert(['session_id' => $sessionId], true);
        return $this->find($id);
    }

    /** Merge a guest cart into the user's cart on login. */
    public function mergeIntoUserCart(string $sessionId, int $userId): void
    {
        $guestCart = $this->where('session_id', $sessionId)->where('user_id', null)->first();
        if (!$guestCart) return;

        $userCart = $this->findOrCreate($userId, null);
        $itemModel = new CartItemModel();
        $items = $itemModel->where('cart_id', $guestCart['id'])->findAll();

        foreach ($items as $item) {
            $existing = $itemModel->where('cart_id', $userCart['id'])
                ->where('product_variant_id', $item['product_variant_id'])
                ->first();
            if ($existing) {
                $itemModel->update($existing['id'], ['quantity' => $existing['quantity'] + $item['quantity']]);
            } else {
                $itemModel->update($item['id'], ['cart_id' => $userCart['id']]);
            }
        }

        $this->delete($guestCart['id']);
    }
}
