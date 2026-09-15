<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\OrderModel;
use App\Models\UserModel;
use App\Models\ProductModel;

class DashboardController extends BaseApiController
{
    public function overview()
    {
        $db = \Config\Database::connect();

        $totalSales = $db->table('orders')->selectSum('total')->where('payment_status !=', 'failed')->get()->getRow()->total ?? 0;
        $totalOrders = (new OrderModel())->countAll();
        $totalCustomers = (new UserModel())->where('role', 'customer')->countAllResults();
        $totalProducts = (new ProductModel())->countAll();
        $pendingOrders = (new OrderModel())->whereIn('order_status', ['pending', 'confirmed', 'processing'])->countAllResults();

        $recentOrders = (new OrderModel())->orderBy('created_at', 'DESC')->limit(8)->findAll();

        $bestSellers = $db->table('products')
            ->select('id, name, sales_count, base_price, sale_price')
            ->orderBy('sales_count', 'DESC')->limit(5)->get()->getResultArray();

        return json_success([
            'total_sales' => (float) $totalSales,
            'total_orders' => $totalOrders,
            'total_customers' => $totalCustomers,
            'total_products' => $totalProducts,
            'pending_orders' => $pendingOrders,
            'recent_orders' => $recentOrders,
            'best_sellers' => $bestSellers,
        ]);
    }

    public function reports()
    {
        $range = $this->request->getGet('range') ?? 'monthly'; // daily|weekly|monthly|yearly
        $db = \Config\Database::connect();

        $format = match ($range) {
            'daily' => '%Y-%m-%d',
            'weekly' => '%x-W%v',
            'yearly' => '%Y',
            default => '%Y-%m',
        };

        $sales = $db->table('orders')
            ->select("DATE_FORMAT(created_at, '{$format}') as period, SUM(total) as total, COUNT(*) as orders")
            ->where('payment_status !=', 'failed')
            ->groupBy('period')->orderBy('period', 'ASC')
            ->get()->getResultArray();

        return json_success(['range' => $range, 'sales' => $sales]);
    }
}
