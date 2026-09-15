<?php

namespace App\Models;

use CodeIgniter\Model;

class WishlistModel extends Model
{
    protected $table = 'wishlists';
    protected $allowedFields = ['user_id'];
    protected $useTimestamps = false;

    public function findOrCreateForUser(int $userId): array
    {
        $wishlist = $this->where('user_id', $userId)->first();
        if ($wishlist) return $wishlist;
        $id = $this->insert(['user_id' => $userId], true);
        return $this->find($id);
    }
}
