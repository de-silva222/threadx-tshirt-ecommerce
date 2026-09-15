<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\ShippingModel;

class ShippingController extends BaseApiController
{
    public function index()
    {
        return json_success((new ShippingModel())->all());
    }

    public function create()
    {
        $data = $this->request->getJSON(true);
        $model = new ShippingModel();
        $id = $model->insert($data, true);
        return json_success($model->find($id), 'Shipping rate created.', 201);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $model = new ShippingModel();
        $model->update($id, $data);
        return json_success($model->find($id), 'Shipping rate updated.');
    }
}
