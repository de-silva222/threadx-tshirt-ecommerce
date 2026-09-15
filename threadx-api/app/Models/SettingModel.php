<?php

namespace App\Models;

use CodeIgniter\Model;

class SettingModel extends Model
{
    protected $table = 'settings';
    protected $primaryKey = 'id';
    protected $allowedFields = ['key', 'value'];
    protected $useTimestamps = false;

    public function get(string $key, $default = null)
    {
        $row = $this->where('key', $key)->first();
        return $row ? $row['value'] : $default;
    }

    public function set(string $key, string $value): void
    {
        $existing = $this->where('key', $key)->first();
        if ($existing) {
            $this->update($existing['id'], ['value' => $value]);
        } else {
            $this->insert(['key' => $key, 'value' => $value]);
        }
    }

    public function allAsMap(): array
    {
        $rows = $this->findAll();
        $map = [];
        foreach ($rows as $row) {
            $map[$row['key']] = $row['value'];
        }
        return $map;
    }
}
