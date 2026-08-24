<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoryModel extends Model
{
    protected $table = 'categories';
    protected $allowedFields = ['name', 'slug', 'description', 'image', 'is_active', 'sort_order'];
    protected $useTimestamps = true;

    public function active()
    {
        return $this->where('is_active', 1)->orderBy('sort_order', 'ASC')->findAll();
    }

    public function bySlug(string $slug): ?array
    {
        return $this->where('slug', $slug)->first();
    }
}
