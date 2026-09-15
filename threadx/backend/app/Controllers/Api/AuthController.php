<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\UserModel;
use App\Services\TokenService;

class AuthController extends BaseApiController
{
    protected UserModel $users;

    public function __construct()
    {
        $this->users = new UserModel();
    }

    public function register()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'name' => 'required|min_length[2]|max_length[120]',
            'email' => 'required|valid_email|is_unique[users.email]',
            'phone' => 'required|min_length[7]|max_length[20]',
            'password' => 'required|min_length[8]',
            'confirm_password' => 'required|matches[password]',
        ];

        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }

        $userId = $this->users->insert([
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => trim($data['phone']),
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'role' => 'customer',
            'status' => 'active',
        ], true);

        $user = $this->users->find($userId);
        unset($user['password_hash']);
        $token = TokenService::issue($userId, 'customer');

        return json_success(['user' => $user, 'token' => $token], 'Account created.', 201);
    }

    public function login()
    {
        $data = $this->request->getJSON(true);

        if (empty($data['email']) || empty($data['password'])) {
            return json_error('Email and password are required.', 422);
        }

        $user = $this->users->findByEmail(strtolower(trim($data['email'])));

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            return json_error('Invalid email or password.', 401);
        }
        if ($user['status'] !== 'active') {
            return json_error('This account has been disabled. Contact support.', 403);
        }

        $token = TokenService::issue($user['id'], $user['role']);
        unset($user['password_hash']);

        return json_success(['user' => $user, 'token' => $token], 'Logged in.');
    }

    public function logout()
    {
        // Stateless tokens: logout is handled client-side by discarding the token.
        // (For revocation support, swap in a token blacklist table keyed by jti.)
        return json_success(null, 'Logged out.');
    }

    public function me()
    {
        return json_success($this->request->user);
    }

    public function updateProfile()
    {
        $data = $this->request->getJSON(true);
        $userId = $this->currentUserId();

        $allowed = array_intersect_key($data, array_flip(['name', 'phone']));
        if (empty($allowed)) {
            return json_error('Nothing to update.', 422);
        }

        $this->users->update($userId, $allowed);
        $user = $this->users->find($userId);
        unset($user['password_hash']);

        return json_success($user, 'Profile updated.');
    }

    public function changePassword()
    {
        $data = $this->request->getJSON(true);
        $userId = $this->currentUserId();
        $user = $this->users->find($userId);

        if (empty($data['current_password']) || !password_verify($data['current_password'], $user['password_hash'])) {
            return json_error('Current password is incorrect.', 422);
        }
        if (empty($data['new_password']) || strlen($data['new_password']) < 8) {
            return json_error('New password must be at least 8 characters.', 422);
        }

        $this->users->update($userId, ['password_hash' => password_hash($data['new_password'], PASSWORD_BCRYPT)]);
        return json_success(null, 'Password updated.');
    }

    public function forgotPassword()
    {
        $data = $this->request->getJSON(true);
        $user = $this->users->findByEmail(strtolower(trim($data['email'] ?? '')));

        // Always respond success (don't leak which emails exist).
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $this->users->update($user['id'], [
                'reset_token' => hash('sha256', $token),
                'reset_token_expires_at' => date('Y-m-d H:i:s', strtotime('+1 hour')),
            ]);
            // TODO: send email with a link containing $token via the mail service configured in .env
        }

        return json_success(null, 'If that email exists, a reset link has been sent.');
    }

    public function resetPassword()
    {
        $data = $this->request->getJSON(true);
        $token = $data['token'] ?? '';
        $hashed = hash('sha256', $token);

        $user = $this->users->where('reset_token', $hashed)
            ->where('reset_token_expires_at >=', date('Y-m-d H:i:s'))
            ->first();

        if (!$user) {
            return json_error('This reset link is invalid or has expired.', 422);
        }
        if (empty($data['password']) || strlen($data['password']) < 8) {
            return json_error('Password must be at least 8 characters.', 422);
        }

        $this->users->update($user['id'], [
            'password_hash' => password_hash($data['password'], PASSWORD_BCRYPT),
            'reset_token' => null,
            'reset_token_expires_at' => null,
        ]);

        return json_success(null, 'Password reset. You can now log in.');
    }
}
