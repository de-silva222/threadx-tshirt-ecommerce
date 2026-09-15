<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\ReviewModel;
use App\Models\ProductModel;

class ReviewController extends BaseApiController
{
    public function index()
    {
        $model = new ReviewModel();
        $status = $this->request->getGet('status'); // pending|approved
        $builder = $model->select('reviews.*, users.name as user_name, products.name as product_name')
            ->join('users', 'users.id = reviews.user_id')
            ->join('products', 'products.id = reviews.product_id')
            ->orderBy('reviews.created_at', 'DESC');

        if ($status === 'pending') $builder->where('is_approved', 0);
        if ($status === 'approved') $builder->where('is_approved', 1);

        return json_success($builder->findAll());
    }

    public function approve($id = null)
    {
        $model = new ReviewModel();
        $review = $model->find((int) $id);
        if (!$review) return json_error('Review not found.', 404);

        $model->update($id, ['is_approved' => 1]);
        (new ProductModel())->recalculateRating($review['product_id']);

        return json_success(null, 'Review approved.');
    }

    public function delete($id = null)
    {
        $model = new ReviewModel();
        $review = $model->find((int) $id);
        if ($review) {
            $model->delete($id);
            (new ProductModel())->recalculateRating($review['product_id']);
        }
        return json_success(null, 'Review deleted.');
    }
}
