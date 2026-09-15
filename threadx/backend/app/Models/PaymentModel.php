<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model
{
    protected $table = 'payments';
    protected $allowedFields = ['order_id', 'provider', 'provider_reference', 'amount', 'status', 'raw_callback'];
    protected $useTimestamps = true;
}
