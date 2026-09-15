<?php

namespace App\Services;

use App\Models\ProductVariantModel;
use App\Models\CustomDesignModel;
use App\Models\CouponModel;
use App\Models\ShippingModel;
use RuntimeException;

/**
 * The single source of truth for order pricing.
 *
 * IMPORTANT: the frontend NEVER sends a price. It only sends
 * variant IDs / custom design IDs + quantities. Every amount here
 * is recalculated from the database so prices can't be manipulated
 * client-side.
 */
class PricingService
{
    protected ProductVariantModel $variants;
    protected CustomDesignModel $designs;
    protected CouponModel $coupons;
    protected ShippingModel $shipping;

    public function __construct()
    {
        $this->variants = new ProductVariantModel();
        $this->designs = new CustomDesignModel();
        $this->coupons = new CouponModel();
        $this->shipping = new ShippingModel();
    }

    /**
     * @param array $lines [['type' => 'variant'|'custom', 'id' => int, 'quantity' => int], ...]
     * @return array{items: array, subtotal: float}
     */
    public function priceLines(array $lines): array
    {
        $items = [];
        $subtotal = 0.0;

        foreach ($lines as $line) {
            $quantity = max(1, (int) ($line['quantity'] ?? 1));

            if ($line['type'] === 'variant') {
                $variant = $this->variants->find((int) $line['id']);
                if (!$variant || !$variant['is_active']) {
                    throw new RuntimeException('One of the items in your cart is no longer available.');
                }
                if ($variant['stock'] < $quantity) {
                    throw new RuntimeException("Not enough stock for SKU {$variant['sku']}.");
                }

                $product = $this->variants->productFor($variant['product_id']);
                $unitPrice = (float) ($variant['price_override']
                    ?? $product['sale_price']
                    ?? $product['base_price']);

                $lineTotal = round($unitPrice * $quantity, 2);
                $subtotal += $lineTotal;

                $items[] = [
                    'product_variant_id' => $variant['id'],
                    'custom_design_id' => null,
                    'product_name' => $product['name'],
                    'size' => $variant['size'],
                    'color' => $variant['color'],
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            } elseif ($line['type'] === 'custom') {
                $design = $this->designs->find((int) $line['id']);
                if (!$design) {
                    throw new RuntimeException('A custom design in your cart could not be found.');
                }

                $unitPrice = (float) $design['total_price'];
                $lineTotal = round($unitPrice * $quantity, 2);
                $subtotal += $lineTotal;

                $items[] = [
                    'product_variant_id' => null,
                    'custom_design_id' => $design['id'],
                    'product_name' => 'Custom T-Shirt (' . ucfirst($design['tshirt_type']) . ')',
                    'size' => $design['size'],
                    'color' => $design['color'],
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'line_total' => $lineTotal,
                ];
            } else {
                throw new RuntimeException('Invalid line item type.');
            }
        }

        return ['items' => $items, 'subtotal' => round($subtotal, 2)];
    }

    public function calculateDiscount(float $subtotal, ?string $couponCode, int $userId = null): array
    {
        if (!$couponCode) {
            return ['discount' => 0.0, 'coupon_id' => null];
        }

        $coupon = $this->coupons->validateForUse($couponCode, $subtotal, $userId);
        $discount = $coupon['type'] === 'percentage'
            ? round($subtotal * ((float) $coupon['value'] / 100), 2)
            : min((float) $coupon['value'], $subtotal);

        return ['discount' => $discount, 'coupon_id' => $coupon['id']];
    }

    public function calculateDelivery(string $district, float $totalAfterDiscount): float
    {
        $freeThreshold = (float) (setting('free_delivery_threshold') ?? 5000);
        if ($totalAfterDiscount >= $freeThreshold) {
            return 0.0;
        }

        $fee = $this->shipping->feeFor($district);
        return $fee ?? (float) (setting('default_delivery_fee') ?? 350);
    }

    public function priceOrder(array $lines, ?string $couponCode, string $district, ?int $userId = null): array
    {
        ['items' => $items, 'subtotal' => $subtotal] = $this->priceLines($lines);

        ['discount' => $discount, 'coupon_id' => $couponId] = $this->calculateDiscount($subtotal, $couponCode, $userId);

        $afterDiscount = max(0, $subtotal - $discount);
        $deliveryFee = $this->calculateDelivery($district, $afterDiscount);
        $total = round($afterDiscount + $deliveryFee, 2);

        return [
            'items' => $items,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'coupon_id' => $couponId,
            'delivery_fee' => $deliveryFee,
            'total' => $total,
        ];
    }
}
