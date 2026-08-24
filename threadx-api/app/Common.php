<?php

use App\Models\SettingModel;

if (!function_exists('setting')) {
    /**
     * Convenience accessor for admin-configurable settings, cached per-request.
     */
    function setting(string $key, $default = null)
    {
        static $cache = null;
        if ($cache === null) {
            $cache = (new SettingModel())->allAsMap();
        }
        return $cache[$key] ?? $default;
    }
}

if (!function_exists('json_success')) {
    function json_success($data = null, string $message = '', int $status = 200)
    {
        $response = service('response');
        return $response->setStatusCode($status)->setJSON([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }
}

if (!function_exists('json_error')) {
    function json_error(string $message, int $status = 400, $errors = null)
    {
        $response = service('response');
        return $response->setStatusCode($status)->setJSON([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ]);
    }
}
