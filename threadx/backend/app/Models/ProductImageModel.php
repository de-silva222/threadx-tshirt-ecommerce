<?php

namespace App\Models;

use CodeIgniter\Model;

class ProductImageModel extends Model
{
    protected $table = 'product_images';
    protected $allowedFields = ['product_id', 'url', 'type', 'sort_order'];
    protected $useTimestamps = false;
}
