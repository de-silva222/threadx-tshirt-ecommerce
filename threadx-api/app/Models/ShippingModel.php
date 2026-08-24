<?php

namespace App\Models;

use CodeIgniter\Model;

class ShippingModel extends Model
{
    protected $table = 'shipping';
    protected $allowedFields = ['district', 'fee', 'is_active'];
    protected $useTimestamps = false;

    public function feeFor(string $district): ?float
    {
        $row = $this->where('district', $district)->where('is_active', 1)->first();
        return $row ? (float) $row['fee'] : null;
    }

    public function all(): array
    {
        return $this->orderBy('district', 'ASC')->findAll();
    }
}
