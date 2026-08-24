<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\ProductVariantModel;

class InventoryController extends BaseApiController
{
    public function index()
    {
        $db = \Config\Database::connect();
        $lowStockThreshold = 5;

        $rows = $db->table('product_variants pv')
            ->select('pv.id, pv.sku, pv.size, pv.color, pv.stock, p.name as product_name, p.id as product_id')
            ->join('products p', 'p.id = pv.product_id')
            ->orderBy('pv.stock', 'ASC')
            ->get()->getResultArray();

        foreach ($rows as &$row) {
            $row['low_stock'] = $row['stock'] > 0 && $row['stock'] <= $lowStockThreshold;
            $row['out_of_stock'] = $row['stock'] <= 0;
        }

        return json_success($rows);
    }

    public function updateStock($variantId = null)
    {
        $data = $this->request->getJSON(true);
        if (!isset($data['stock']) || $data['stock'] < 0) {
            return json_error('A valid stock quantity is required.', 422);
        }
        $model = new ProductVariantModel();
        $model->update($variantId, ['stock' => (int) $data['stock']]);
        return json_success($model->find($variantId), 'Stock updated.');
    }
}
