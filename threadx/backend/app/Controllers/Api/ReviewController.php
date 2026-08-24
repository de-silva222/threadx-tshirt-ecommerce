<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\ReviewModel;
use App\Models\ProductModel;

class ReviewController extends BaseApiController
{
    public function forProduct($slug = null)
    {
        $product = (new ProductModel())->bySlug($slug) ?? (new ProductModel())->where('slug', $slug)->first();
        if (!$product) return json_error('Product not found.', 404);

        return json_success((new ReviewModel())->approvedForProduct($product['id']));
    }

    public function store($productId = null)
    {
        $data = $this->request->getJSON(true);
        $reviewModel = new ReviewModel();

        if (empty($data['rating']) || $data['rating'] < 1 || $data['rating'] > 5) {
            return json_error('Rating must be between 1 and 5.', 422);
        }

        if (!$reviewModel->userPurchasedProduct($this->currentUserId(), (int) $productId)) {
            return json_error('Only customers who purchased and received this product can review it.', 403);
        }

        $existing = $reviewModel->where('product_id', $productId)->where('user_id', $this->currentUserId())->first();
        if ($existing) {
            return json_error('You have already reviewed this product.', 422);
        }

        $reviewModel->insert([
            'product_id' => $productId,
            'user_id' => $this->currentUserId(),
            'rating' => (int) $data['rating'],
            'comment' => $data['comment'] ?? null,
            'is_approved' => 0, // requires admin approval before publishing
        ]);

        return json_success(null, 'Review submitted and pending approval.', 201);
    }
}
