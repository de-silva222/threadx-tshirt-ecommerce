<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductVariantModel extends Model
{
    protected $table = 'product_variants';
    protected $allowedFields = [
        'product_id', 'size', 'color', 'color_hex', 'sku',
        'price_override', 'stock', 'is_active',
    ];
    protected $useTimestamps = true;

    public function productFor(int $productId): ?array
    {
        return (new ProductModel())->find($productId);
    }

    /**
     * Reduce stock safely (atomic, prevents overselling under concurrency).
     * Returns false if there wasn't enough stock.
     */
    public function reduceStock(int $variantId, int $quantity): bool
    {
        $affected = $this->db->table($this->table)
            ->where('id', $variantId)
            ->where('stock >=', $quantity)
            ->update(['stock' => new \CodeIgniter\Database\RawSql("stock - {$quantity}")]);

        return $this->db->affectedRows() > 0;
    }
}
