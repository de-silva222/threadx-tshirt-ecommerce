<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'name', 'email', 'phone', 'password_hash', 'role', 'status',
        'email_verified_at', 'reset_token', 'reset_token_expires_at',
    ];
    protected $useTimestamps = true;
    protected $validationRules = [
        'name' => 'required|min_length[2]|max_length[120]',
        'email' => 'required|valid_email',
        'phone' => 'permit_empty|min_length[7]|max_length[20]',
    ];

    public function findByEmail(string $email): ?array
    {
        return $this->where('email', $email)->first();
    }
}
