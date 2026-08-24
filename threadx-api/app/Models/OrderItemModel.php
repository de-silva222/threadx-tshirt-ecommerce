<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderItemModel extends Model
{
    protected $table = 'order_items';
    protected $allowedFields = [
        'order_id', 'product_variant_id', 'custom_design_id', 'product_name',
        'size', 'color', 'unit_price', 'quantity', 'line_total',
    ];
    protected $useTimestamps = false;
}
