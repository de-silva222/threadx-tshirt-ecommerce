<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\WishlistModel;
use App\Models\WishlistItemModel;
use App\Models\ProductModel;
use App\Models\ProductImageModel;

class WishlistController extends BaseApiController
{
    public function index()
    {
        $wishlist = (new WishlistModel())->findOrCreateForUser($this->currentUserId());
        $itemModel = new WishlistItemModel();
        $productModel = new ProductModel();
        $imageModel = new ProductImageModel();

        $items = $itemModel->where('wishlist_id', $wishlist['id'])->findAll();
        $out = [];
        foreach ($items as $item) {
            $product = $productModel->find($item['product_id']);
            if (!$product) continue;
            $img = $imageModel->where('product_id', $product['id'])->orderBy('sort_order')->first();
            $out[] = [
                'wishlist_item_id' => $item['id'],
                'product_id' => $product['id'],
                'slug' => $product['slug'],
                'name' => $product['name'],
                'price' => $product['sale_price'] ?? $product['base_price'],
                'image' => $img['url'] ?? null,
            ];
        }

        return json_success($out);
    }

    public function add()
    {
        $data = $this->request->getJSON(true);
        $wishlist = (new WishlistModel())->findOrCreateForUser($this->currentUserId());
        $itemModel = new WishlistItemModel();

        $exists = $itemModel->where('wishlist_id', $wishlist['id'])->where('product_id', $data['product_id'] ?? 0)->first();
        if (!$exists) {
            $itemModel->insert(['wishlist_id' => $wishlist['id'], 'product_id' => $data['product_id']]);
        }
        return json_success(null, 'Added to wishlist.', 201);
    }

    public function remove($productId = null)
    {
        $wishlist = (new WishlistModel())->findOrCreateForUser($this->currentUserId());
        (new WishlistItemModel())->where('wishlist_id', $wishlist['id'])->where('product_id', $productId)->delete();
        return json_success(null, 'Removed from wishlist.');
    }
}
