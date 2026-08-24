<?php

namespace App\Models;

use CodeIgniter\Model;

class ReviewModel extends Model
{
    protected $table = 'reviews';
    protected $allowedFields = ['product_id', 'user_id', 'order_item_id', 'rating', 'comment', 'is_approved'];
    protected $useTimestamps = true;

    public function approvedForProduct(int $productId): array
    {
        return $this->select('reviews.*, users.name as user_name')
            ->join('users', 'users.id = reviews.user_id')
            ->where('product_id', $productId)
            ->where('is_approved', 1)
            ->orderBy('reviews.created_at', 'DESC')
            ->findAll();
    }

    /** Only verified purchasers (who received the product) may review. */
    public function userPurchasedProduct(int $userId, int $productId): bool
    {
        return $this->db->table('order_items')
            ->join('orders', 'orders.id = order_items.order_id')
            ->join('product_variants', 'product_variants.id = order_items.product_variant_id')
            ->where('orders.user_id', $userId)
            ->where('orders.order_status', 'delivered')
            ->where('product_variants.product_id', $productId)
            ->countAllResults() > 0;
    }
}
