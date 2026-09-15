<?php

namespace App\Models;

use CodeIgniter\Model;
use RuntimeException;

class CouponModel extends Model
{
    protected $table = 'coupons';
    protected $allowedFields = [
        'code', 'type', 'value', 'min_order_amount', 'usage_limit',
        'per_user_limit', 'used_count', 'starts_at', 'expires_at', 'is_active',
    ];
    protected $useTimestamps = true;

    public function validateForUse(string $code, float $subtotal, ?int $userId): array
    {
        $coupon = $this->where('code', strtoupper(trim($code)))->first();

        if (!$coupon || !$coupon['is_active']) {
            throw new RuntimeException('This coupon code is not valid.');
        }
        $now = date('Y-m-d H:i:s');
        if ($coupon['starts_at'] && $coupon['starts_at'] > $now) {
            throw new RuntimeException('This coupon is not active yet.');
        }
        if ($coupon['expires_at'] && $coupon['expires_at'] < $now) {
            throw new RuntimeException('This coupon has expired.');
        }
        if ($coupon['usage_limit'] !== null && $coupon['used_count'] >= $coupon['usage_limit']) {
            throw new RuntimeException('This coupon has reached its usage limit.');
        }
        if ($subtotal < (float) $coupon['min_order_amount']) {
            throw new RuntimeException('Minimum order of ' . $coupon['min_order_amount'] . ' required for this coupon.');
        }
        if ($userId && $coupon['per_user_limit'] !== null) {
            $usedByUser = $this->db->table('coupon_usages')
                ->where('coupon_id', $coupon['id'])->where('user_id', $userId)
                ->countAllResults();
            if ($usedByUser >= $coupon['per_user_limit']) {
                throw new RuntimeException('You have already used this coupon the maximum number of times.');
            }
        }

        return $coupon;
    }

    public function recordUsage(int $couponId, ?int $userId, int $orderId): void
    {
        $this->db->table('coupon_usages')->insert([
            'coupon_id' => $couponId, 'user_id' => $userId, 'order_id' => $orderId, 'used_at' => date('Y-m-d H:i:s'),
        ]);
        $this->set('used_count', 'used_count + 1', false)->where('id', $couponId)->update();
    }
}
