<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\OrderModel;
use App\Models\OrderItemModel;
use App\Models\OrderStatusHistoryModel;

class OrderController extends BaseApiController
{
    protected OrderModel $orders;

    public function __construct()
    {
        $this->orders = new OrderModel();
    }

    public function index()
    {
        $filters = $this->request->getGet();
        $builder = $this->orders->orderBy('created_at', 'DESC');

        if (!empty($filters['status'])) $builder->where('order_status', $filters['status']);
        if (!empty($filters['payment_status'])) $builder->where('payment_status', $filters['payment_status']);
        if (!empty($filters['q'])) {
            $builder->groupStart()
                ->like('order_number', $filters['q'])
                ->orLike('email', $filters['q'])
                ->orLike('phone', $filters['q'])
                ->groupEnd();
        }

        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = 20;
        $total = $builder->countAllResults(false);
        $items = $builder->limit($perPage, ($page - 1) * $perPage)->findAll();

        return json_success(['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function show($id = null)
    {
        $order = $this->orders->find((int) $id);
        if (!$order) return json_error('Order not found.', 404);
        $order['items'] = (new OrderItemModel())->where('order_id', $id)->findAll();
        $order['history'] = (new OrderStatusHistoryModel())->where('order_id', $id)->orderBy('created_at')->findAll();
        return json_success($order);
    }

    public function updateStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        $validStatuses = ['pending','confirmed','processing','printing','packed','shipped','delivered','cancelled'];
        if (empty($data['status']) || !in_array($data['status'], $validStatuses, true)) {
            return json_error('Invalid status.', 422);
        }

        $this->orders->update($id, ['order_status' => $data['status']]);
        (new OrderStatusHistoryModel())->log((int) $id, $data['status'], $this->currentUserId(), $data['note'] ?? null);

        return json_success($this->orders->find($id), 'Order status updated.');
    }

    public function updatePaymentStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        $validStatuses = ['pending','paid','failed','refunded','cod_pending'];
        if (empty($data['payment_status']) || !in_array($data['payment_status'], $validStatuses, true)) {
            return json_error('Invalid payment status.', 422);
        }
        $this->orders->update($id, ['payment_status' => $data['payment_status']]);
        return json_success($this->orders->find($id), 'Payment status updated.');
    }

    public function updateTracking($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->orders->update($id, [
            'courier_name' => $data['courier_name'] ?? null,
            'tracking_number' => $data['tracking_number'] ?? null,
        ]);
        return json_success($this->orders->find($id), 'Tracking updated.');
    }
}
