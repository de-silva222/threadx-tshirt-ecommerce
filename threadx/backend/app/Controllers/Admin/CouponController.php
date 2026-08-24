<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\CouponModel;

class CouponController extends BaseApiController
{
    protected CouponModel $coupons;

    public function __construct()
    {
        $this->coupons = new CouponModel();
    }

    public function index()
    {
        return json_success($this->coupons->orderBy('created_at', 'DESC')->findAll());
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $rules = [
            'code' => 'required|is_unique[coupons.code]',
            'type' => 'required|in_list[percentage,fixed]',
            'value' => 'required|decimal',
        ];
        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }
        $data['code'] = strtoupper(trim($data['code']));
        $id = $this->coupons->insert($data, true);
        return json_success($this->coupons->find($id), 'Coupon created.', 201);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        if (isset($data['code'])) $data['code'] = strtoupper(trim($data['code']));
        $this->coupons->update($id, $data);
        return json_success($this->coupons->find($id), 'Coupon updated.');
    }

    public function delete($id = null)
    {
        $this->coupons->delete($id);
        return json_success(null, 'Coupon deleted.');
    }
}
