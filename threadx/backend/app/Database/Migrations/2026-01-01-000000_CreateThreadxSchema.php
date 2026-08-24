<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Creates the full THREADX schema.
 *
 * The table definitions are intentionally kept in a single reviewable
 * SQL file (database/schema.sql at the project root) rather than spread
 * across Forge calls, so the schema can be read/diffed as one document.
 * This migration simply executes it idempotently.
 */
class CreateThreadxSchema extends Migration
{
    public function up()
    {
        $sqlPath = ROOTPATH . '../database/schema.sql';
        if (!is_file($sqlPath)) {
            // Fallback path if this migration runs from a different working dir.
            $sqlPath = APPPATH . '../../database/schema.sql';
        }

        $sql = file_get_contents($sqlPath);

        // Strip the CREATE DATABASE / USE statements — CI4 already targets
        // the configured database from .env.
        $sql = preg_replace('/CREATE DATABASE.*?;/is', '', $sql);
        $sql = preg_replace('/USE\s+\w+\s*;/i', '', $sql);

        foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
            if ($statement === '' || str_starts_with($statement, '--')) {
                continue;
            }
            $this->db->query($statement);
        }
    }

    public function down()
    {
        $tables = [
            'payments', 'order_status_history', 'order_items', 'orders',
            'coupon_usages', 'coupons', 'cart_items', 'carts',
            'wishlist_items', 'wishlists', 'reviews', 'custom_designs',
            'product_images', 'product_variants', 'products', 'categories',
            'addresses', 'shipping', 'settings', 'users',
        ];
        $this->db->query('SET FOREIGN_KEY_CHECKS = 0');
        foreach ($tables as $table) {
            $this->forge->dropTable($table, true);
        }
        $this->db->query('SET FOREIGN_KEY_CHECKS = 1');
    }
}
