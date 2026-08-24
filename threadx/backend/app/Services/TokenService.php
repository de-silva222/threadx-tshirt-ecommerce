<?php

namespace App\Services;

/**
 * Minimal HMAC-signed token service (JWT-equivalent) so the project
 * doesn't require pulling in an external JWT library to run.
 * Swap for firebase/php-jwt in production if preferred — interface stays the same.
 */
class TokenService
{
    protected static function secret(): string
    {
        return env('AUTH_JWT_SECRET', 'change-me');
    }

    public static function issue(int $userId, string $role): string
    {
        $ttlMinutes = (int) env('AUTH_TOKEN_TTL_MINUTES', 10080);
        $payload = [
            'sub' => $userId,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + ($ttlMinutes * 60),
        ];

        $body = self::base64UrlEncode(json_encode($payload));
        $signature = self::sign($body);

        return "{$body}.{$signature}";
    }

    public static function verify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 2) {
            return null;
        }

        [$body, $signature] = $parts;

        if (!hash_equals(self::sign($body), $signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($body), true);
        if (!$payload || ($payload['exp'] ?? 0) < time()) {
            return null;
        }

        return $payload;
    }

    protected static function sign(string $body): string
    {
        return self::base64UrlEncode(hash_hmac('sha256', $body, self::secret(), true));
    }

    protected static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    protected static function base64UrlDecode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
