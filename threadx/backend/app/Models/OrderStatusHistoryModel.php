<?php

namespace App\Models;

use CodeIgniter\Model;

class OrderStatusHistoryModel extends Model
{
    protected $table = 'order_status_history';
    protected $allowedFields = ['order_id', 'status', 'changed_by', 'note'];
    protected $useTimestamps = false;

    public function log(int $orderId, string $status, ?int $changedBy = null, ?string $note = null): void
    {
        $this->insert([
            'order_id' => $orderId,
            'status' => $status,
            'changed_by' => $changedBy,
            'note' => $note,
            'created_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
