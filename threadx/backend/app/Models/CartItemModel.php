<?php

namespace App\Models;

use CodeIgniter\Model;

class CartItemModel extends Model
{
    protected $table = 'cart_items';
    protected $allowedFields = [
        'cart_id', 'product_variant_id', 'custom_design_id', 'quantity', 'saved_for_later',
    ];
    protected $useTimestamps = true;

    public function forCartWithDetails(int $cartId): array
    {
        $items = $this->where('cart_id', $cartId)->findAll();
        $variantModel = new ProductVariantModel();
        $productModel = new ProductModel();
        $designModel = new CustomDesignModel();
        $imageModel = new ProductImageModel();

        $out = [];
        foreach ($items as $item) {
            if ($item['product_variant_id']) {
                $variant = $variantModel->find($item['product_variant_id']);
                if (!$variant) continue;
                $product = $productModel->find($variant['product_id']);
                $image = $imageModel->where('product_id', $product['id'])->orderBy('sort_order')->first();
                $unitPrice = (float) ($variant['price_override'] ?? $product['sale_price'] ?? $product['base_price']);

                $out[] = [
                    'id' => $item['id'],
                    'type' => 'variant',
                    'variant_id' => $variant['id'],
                    'product_id' => $product['id'],
                    'product_slug' => $product['slug'],
                    'name' => $product['name'],
                    'image' => $image['url'] ?? null,
                    'size' => $variant['size'],
                    'color' => $variant['color'],
                    'unit_price' => $unitPrice,
                    'quantity' => $item['quantity'],
                    'subtotal' => round($unitPrice * $item['quantity'], 2),
                    'stock' => $variant['stock'],
                    'saved_for_later' => (bool) $item['saved_for_later'],
                ];
            } elseif ($item['custom_design_id']) {
                $design = $designModel->find($item['custom_design_id']);
                if (!$design) continue;

                $out[] = [
                    'id' => $item['id'],
                    'type' => 'custom',
                    'variant_id' => null,
                    'design_id' => $design['id'],
                    'name' => 'Custom T-Shirt (' . ucfirst($design['tshirt_type']) . ')',
                    'image' => $design['design_image'],
                    'size' => $design['size'],
                    'color' => $design['color'],
                    'unit_price' => (float) $design['total_price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => round((float) $design['total_price'] * $item['quantity'], 2),
                    'stock' => null,
                    'saved_for_later' => (bool) $item['saved_for_later'],
                ];
            }
        }

        return $out;
    }
}
