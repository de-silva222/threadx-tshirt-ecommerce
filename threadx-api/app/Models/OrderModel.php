<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderModel extends Model
{
    protected $table = 'orders';
    protected $allowedFields = [
        'order_number', 'user_id', 'first_name', 'last_name', 'email', 'phone',
        'address_line', 'city', 'district', 'postal_code',
        'subtotal', 'discount', 'delivery_fee', 'total', 'coupon_id',
        'payment_method', 'payment_status', 'order_status',
        'courier_name', 'tracking_number', 'notes',
    ];
    protected $useTimestamps = true;

    public function generateOrderNumber(): string
    {
        $last = $this->orderBy('id', 'DESC')->first();
        $nextId = $last ? ((int) preg_replace('/\D/', '', $last['order_number']) + 1) : 10001;
        return 'TS' . $nextId;
    }

    public function findByNumberOrId(string $identifier): ?array
    {
        if (ctype_digit($identifier)) {
            $byId = $this->find((int) $identifier);
            if ($byId) return $byId;
        }
        return $this->where('order_number', $identifier)->first();
    }
}
