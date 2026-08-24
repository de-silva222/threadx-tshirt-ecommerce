<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

/**
 * Shared base for all API controllers: consistent JSON error handling
 * and a helper to resolve the current cart owner (auth user or guest session).
 */
class BaseApiController extends ResourceController
{
    protected $format = 'json';

    protected function currentUserId(): ?int
    {
        return $this->request->user['id'] ?? null;
    }

    protected function guestSessionId(): ?string
    {
        return $this->request->getHeaderLine('X-Session-Id') ?: null;
    }

    protected function requireGuestOrAuth(): void
    {
        if (!$this->currentUserId() && !$this->guestSessionId()) {
            throw new \RuntimeException('Missing session. Send X-Session-Id header for guest carts.');
        }
    }
}
