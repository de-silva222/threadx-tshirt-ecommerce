<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Central place documenting upload + security limits used across the app.
 * (Actual enforcement happens in ImageStorageService and controller validation.)
 */
class CorsAndUploads extends BaseConfig
{
    public array $allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp'];
    public array $allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    public int $maxUploadSizeBytes = 8 * 1024 * 1024; // 8MB, override via MAX_UPLOAD_SIZE_BYTES env
}
