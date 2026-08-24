<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use App\Services\TokenService;
use App\Models\UserModel;

/**
 * Verifies the Bearer token on the request and attaches the
 * authenticated user to the request as $request->user.
 * Never trusts any user/role data sent from the client body.
 */
class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');

        if (!$header || !str_starts_with($header, 'Bearer ')) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['success' => false, 'message' => 'Authentication required.']);
        }

        $token = substr($header, 7);
        $payload = TokenService::verify($token);

        if (!$payload) {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['success' => false, 'message' => 'Invalid or expired session.']);
        }

        $userModel = new UserModel();
        $user = $userModel->find($payload['sub']);

        if (!$user || $user['status'] !== 'active') {
            return service('response')
                ->setStatusCode(401)
                ->setJSON(['success' => false, 'message' => 'Account not found or disabled.']);
        }

        unset($user['password_hash']);
        $request->user = $user;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // no-op
    }
}
