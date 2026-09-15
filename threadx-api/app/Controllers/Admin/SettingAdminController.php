<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\SettingModel;

class SettingAdminController extends BaseApiController
{
    public function index()
    {
        return json_success((new SettingModel())->allAsMap());
    }

    public function update()
    {
        $data = $this->request->getJSON(true);
        $model = new SettingModel();
        foreach ($data as $key => $value) {
            $model->set($key, (string) $value);
        }
        return json_success($model->allAsMap(), 'Settings updated.');
    }
}
