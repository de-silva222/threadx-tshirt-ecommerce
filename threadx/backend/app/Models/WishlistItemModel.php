<?php

namespace App\Models;

use CodeIgniter\Model;

class WishlistItemModel extends Model
{
    protected $table = 'wishlist_items';
    protected $allowedFields = ['wishlist_id', 'product_id'];
    protected $useTimestamps = false;
}
