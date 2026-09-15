<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $allowedFields = [
        'category_id', 'name', 'slug', 'sku', 'description', 'material', 'gsm', 'fit',
        'base_price', 'sale_price', 'tags', 'is_featured', 'is_active',
        'rating_avg', 'rating_count', 'sales_count',
    ];
    protected $useTimestamps = true;

    /**
     * Server-side filtering/sorting/pagination for the shop page.
     */
    public function search(array $filters): array
    {
        $builder = $this->where('is_active', 1);

        if (!empty($filters['q'])) {
            $q = $this->db->escapeString($filters['q']);
            $builder->where("MATCH(name, description, tags) AGAINST ('{$q}*' IN BOOLEAN MODE) > 0", null, false);
        }
        if (!empty($filters['category'])) {
            $builder->where('category_id', $filters['category']);
        }
        if (!empty($filters['min_price'])) {
            $builder->where('COALESCE(sale_price, base_price) >=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $builder->where('COALESCE(sale_price, base_price) <=', $filters['max_price']);
        }
        if (!empty($filters['min_rating'])) {
            $builder->where('rating_avg >=', $filters['min_rating']);
        }
        if (!empty($filters['featured'])) {
            $builder->where('is_featured', 1);
        }

        $sort = $filters['sort'] ?? 'featured';
        match ($sort) {
            'newest' => $builder->orderBy('created_at', 'DESC'),
            'best_selling' => $builder->orderBy('sales_count', 'DESC'),
            'price_low' => $builder->orderBy('COALESCE(sale_price, base_price)', 'ASC'),
            'price_high' => $builder->orderBy('COALESCE(sale_price, base_price)', 'DESC'),
            'rating' => $builder->orderBy('rating_avg', 'DESC'),
            default => $builder->orderBy('is_featured', 'DESC')->orderBy('created_at', 'DESC'),
        };

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = min(48, max(1, (int) ($filters['per_page'] ?? 12)));

        $total = $builder->countAllResults(false);
        $results = $builder->limit($perPage, ($page - 1) * $perPage)->findAll();

        return ['total' => $total, 'page' => $page, 'per_page' => $perPage, 'items' => $results];
    }

    public function bySlugWithRelations(string $slug): ?array
    {
        $product = $this->where('slug', $slug)->first();
        if (!$product) {
            return null;
        }

        $product['images'] = (new ProductImageModel())->where('product_id', $product['id'])->orderBy('sort_order')->findAll();
        $product['variants'] = (new ProductVariantModel())->where('product_id', $product['id'])->where('is_active', 1)->findAll();
        $product['category'] = (new CategoryModel())->find($product['category_id']);

        return $product;
    }

    public function recalculateRating(int $productId): void
    {
        $row = $this->db->table('reviews')
            ->selectAvg('rating')
            ->selectCount('id', 'cnt')
            ->where('product_id', $productId)
            ->where('is_approved', 1)
            ->get()->getRowArray();

        $this->update($productId, [
            'rating_avg' => round((float) ($row['rating'] ?? 0), 2),
            'rating_count' => (int) ($row['cnt'] ?? 0),
        ]);
    }
}
