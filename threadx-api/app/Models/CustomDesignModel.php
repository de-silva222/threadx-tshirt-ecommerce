<?php

namespace App\Models;

use CodeIgniter\Model;

class CustomDesignModel extends Model
{
    protected $table = 'custom_designs';
    protected $allowedFields = [
        'user_id', 'tshirt_type', 'color', 'size', 'design_image', 'custom_text',
        'font', 'text_color', 'print_position', 'scale', 'rotation', 'pos_x', 'pos_y',
        'base_price', 'printing_fee', 'total_price', 'status', 'admin_note',
    ];
    protected $useTimestamps = true;

    /** Server-side price calculation for custom designs — never trust client-sent totals. */
    public function calculatePrice(string $tshirtType, bool $hasImage, bool $hasText): array
    {
        $basePrices = ['oversized' => 3290.0, 'regular' => 2990.0];
        $base = $basePrices[$tshirtType] ?? $basePrices['regular'];

        $fee = 0.0;
        if ($hasImage) $fee += (float) (setting('custom_printing_fee_image') ?? 650);
        if ($hasText) $fee += (float) (setting('custom_printing_fee_text') ?? 450);
        // If both, apply a small combo discount on the fee.
        if ($hasImage && $hasText) $fee -= 150;

        $fee = max(0, $fee);

        return ['base_price' => $base, 'printing_fee' => $fee, 'total_price' => round($base + $fee, 2)];
    }
}
