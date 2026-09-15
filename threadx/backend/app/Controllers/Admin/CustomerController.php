<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\UserModel;
use App\Models\OrderModel;

class CustomerController extends BaseApiController
{
    public function index()
    {
        $userModel = new UserModel();
        $filters = $this->request->getGet();
        $builder = $userModel->where('role', 'customer');
        if (!empty($filters['q'])) {
            $builder->groupStart()->like('name', $filters['q'])->orLike('email', $filters['q'])->groupEnd();
        }
        $customers = $builder->orderBy('created_at', 'DESC')->findAll();
        foreach ($customers as &$c) unset($c['password_hash']);
        return json_success($customers);
    }

    public function show($id = null)
    {
        $userModel = new UserModel();
        $customer = $userModel->find((int) $id);
        if (!$customer || $customer['role'] !== 'customer') return json_error('Customer not found.', 404);
        unset($customer['password_hash']);
        $customer['orders'] = (new OrderModel())->where('user_id', $id)->orderBy('created_at', 'DESC')->findAll();
        return json_success($customer);
    }

    public function updateStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        if (!in_array($data['status'] ?? '', ['active', 'disabled'], true)) {
            return json_error('Invalid status.', 422);
        }
        (new UserModel())->update($id, ['status' => $data['status']]);
        return json_success(null, 'Customer status updated.');
    }
}
