<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\SettingModel;
use App\Models\ShippingModel;

class SettingController extends BaseApiController
{
    public function publicSettings()
    {
        $map = (new SettingModel())->allAsMap();
        // Only expose non-sensitive, storefront-facing config.
        $public = [
            'brand_name', 'accent_color', 'currency', 'default_delivery_fee',
            'free_delivery_threshold', 'contact_phone', 'contact_email',
            'whatsapp_number', 'instagram_url', 'tiktok_url', 'facebook_url',
            'custom_printing_fee_text', 'custom_printing_fee_image', 'store_status',
        ];
        return json_success(array_intersect_key($map, array_flip($public)));
    }

    public function shippingRates()
    {
        return json_success((new ShippingModel())->all());
    }
}
