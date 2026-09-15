<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\AddressModel;

class AddressController extends BaseApiController
{
    protected AddressModel $addresses;

    public function __construct()
    {
        $this->addresses = new AddressModel();
    }

    public function index()
    {
        return json_success($this->addresses->where('user_id', $this->currentUserId())->findAll());
    }

    public function store()
    {
        $data = $this->request->getJSON(true);
        $data['user_id'] = $this->currentUserId();

        $rules = [
            'first_name' => 'required', 'last_name' => 'required', 'phone' => 'required',
            'address_line' => 'required', 'city' => 'required', 'district' => 'required',
        ];
        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }

        if (!empty($data['is_default'])) {
            $this->addresses->where('user_id', $this->currentUserId())->set('is_default', 0)->update();
        }

        $id = $this->addresses->insert($data, true);
        return json_success($this->addresses->find($id), 'Address saved.', 201);
    }

    public function update($id = null)
    {
        $address = $this->addresses->find((int) $id);
        if (!$address || $address['user_id'] != $this->currentUserId()) {
            return json_error('Address not found.', 404);
        }
        $data = $this->request->getJSON(true);
        if (!empty($data['is_default'])) {
            $this->addresses->where('user_id', $this->currentUserId())->set('is_default', 0)->update();
        }
        $this->addresses->update($id, $data);
        return json_success($this->addresses->find($id), 'Address updated.');
    }

    public function delete($id = null)
    {
        $address = $this->addresses->find((int) $id);
        if (!$address || $address['user_id'] != $this->currentUserId()) {
            return json_error('Address not found.', 404);
        }
        $this->addresses->delete($id);
        return json_success(null, 'Address deleted.');
    }
}
