<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Must run AFTER AuthFilter. Rejects any request where the
 * authenticated user's role (from the DB, not the client) isn't admin.
 */
class AdminFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        if (empty($request->user) || $request->user['role'] !== 'admin') {
            return service('response')
                ->setStatusCode(403)
                ->setJSON(['success' => false, 'message' => 'Admin access required.']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // no-op
    }
}
