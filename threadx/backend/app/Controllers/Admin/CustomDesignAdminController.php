<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\CustomDesignModel;

class CustomDesignAdminController extends BaseApiController
{
    public function index()
    {
        $model = new CustomDesignModel();
        $status = $this->request->getGet('status');
        $builder = $model->orderBy('created_at', 'DESC');
        if ($status) $builder->where('status', $status);
        return json_success($builder->findAll());
    }

    public function updateStatus($id = null)
    {
        $data = $this->request->getJSON(true);
        $valid = ['pending_review', 'approved', 'printing', 'completed', 'rejected'];
        if (empty($data['status']) || !in_array($data['status'], $valid, true)) {
            return json_error('Invalid status.', 422);
        }
        $model = new CustomDesignModel();
        $model->update($id, ['status' => $data['status'], 'admin_note' => $data['admin_note'] ?? null]);
        return json_success($model->find($id), 'Design status updated.');
    }
}
