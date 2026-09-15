<?php

namespace App\Models;

use CodeIgniter\Model;

class AddressModel extends Model
{
    protected $table = 'addresses';
    protected $allowedFields = [
        'user_id', 'label', 'first_name', 'last_name', 'phone',
        'address_line', 'city', 'district', 'postal_code', 'is_default',
    ];
    protected $useTimestamps = true;
}
