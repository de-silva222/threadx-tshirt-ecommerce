<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

/**
 * Loads the sample data from database/seed.sql (categories, products,
 * variants, images, users, orders, reviews, coupons).
 *
 * Run with: php spark db:seed ThreadxSeeder
 */
class ThreadxSeeder extends Seeder
{
    public function run()
    {
        $sqlPath = ROOTPATH . '../database/seed.sql';
        if (!is_file($sqlPath)) {
            $sqlPath = APPPATH . '../../database/seed.sql';
        }

        $sql = file_get_contents($sqlPath);
        $sql = preg_replace('/USE\s+\w+\s*;/i', '', $sql);

        foreach (array_filter(array_map('trim', explode(';', $sql))) as $statement) {
            if ($statement === '' || str_starts_with($statement, '--')) {
                continue;
            }
            $this->db->query($statement);
        }

        echo "THREADX sample data seeded.\n";
    }
}
