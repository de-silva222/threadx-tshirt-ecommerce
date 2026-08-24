<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\CouponModel;

class CouponController extends BaseApiController
{
    public function validateCode()
    {
        $data = $this->request->getJSON(true);
        try {
            $coupon = (new CouponModel())->validateForUse(
                $data['code'] ?? '', (float) ($data['subtotal'] ?? 0), $this->currentUserId()
            );
        } catch (\RuntimeException $e) {
            return json_error($e->getMessage(), 422);
        }
        return json_success(['code' => $coupon['code'], 'type' => $coupon['type'], 'value' => $coupon['value']]);
    }
}
