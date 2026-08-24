<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\ProductModel;

class ProductController extends BaseApiController
{
    protected ProductModel $products;

    public function __construct()
    {
        $this->products = new ProductModel();
    }

    public function index()
    {
        $filters = $this->request->getGet();
        $result = $this->products->search($filters);

        // attach primary image + category name for grid cards
        $imageModel = new \App\Models\ProductImageModel();
        $categoryModel = new \App\Models\CategoryModel();
        foreach ($result['items'] as &$item) {
            $img = $imageModel->where('product_id', $item['id'])->orderBy('sort_order')->first();
            $item['image'] = $img['url'] ?? null;
            $cat = $categoryModel->find($item['category_id']);
            $item['category_name'] = $cat['name'] ?? null;
        }

        return json_success($result);
    }

    public function show($slug = null)
    {
        $product = $this->products->bySlugWithRelations($slug);
        if (!$product) {
            return json_error('Product not found.', 404);
        }
        return json_success($product);
    }
}
