<?php

namespace App\Services;

use CodeIgniter\HTTP\Files\UploadedFile;
use RuntimeException;

/**
 * Storage abstraction so the app isn't tightly coupled to one provider.
 * Driver is chosen via STORAGE_DRIVER env var: "local" | "cloudinary".
 *
 * Usage:
 *   $url = (new ImageStorageService())->store($uploadedFile, 'products');
 */
class ImageStorageService
{
    protected string $driver;

    protected array $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    protected array $allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
    protected int $maxSizeBytes;

    public function __construct()
    {
        $this->driver = env('STORAGE_DRIVER', 'local');
        // Default max upload size for custom designs: 8 MB, configurable via env.
        $this->maxSizeBytes = (int) env('MAX_UPLOAD_SIZE_BYTES', 8 * 1024 * 1024);
    }

    public function validate(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new RuntimeException('Upload failed: ' . $file->getErrorString());
        }

        if (!in_array($file->getMimeType(), $this->allowedMimes, true)) {
            throw new RuntimeException('Unsupported file type. Allowed: PNG, JPG, JPEG, WEBP.');
        }

        $ext = strtolower($file->getExtension());
        if (!in_array($ext, $this->allowedExt, true)) {
            throw new RuntimeException('Unsupported file extension.');
        }

        if ($file->getSize() > $this->maxSizeBytes) {
            $mb = round($this->maxSizeBytes / 1024 / 1024, 1);
            throw new RuntimeException("File too large. Maximum size is {$mb}MB.");
        }
    }

    public function store(UploadedFile $file, string $folder = 'misc'): string
    {
        $this->validate($file);

        return $this->driver === 'cloudinary'
            ? $this->storeCloudinary($file, $folder)
            : $this->storeLocal($file, $folder);
    }

    protected function storeLocal(UploadedFile $file, string $folder): string
    {
        $basePath = rtrim(env('STORAGE_LOCAL_PATH', 'public/uploads'), '/');
        $targetDir = FCPATH . "../{$basePath}/{$folder}";

        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $newName = $file->getRandomName();
        $file->move($targetDir, $newName);

        $baseUrl = rtrim(env('STORAGE_LOCAL_URL', 'http://localhost:8080/uploads'), '/');
        return "{$baseUrl}/{$folder}/{$newName}";
    }

    protected function storeCloudinary(UploadedFile $file, string $folder): string
    {
        // Kept dependency-free here so the project runs before `composer require` is run.
        // In production: composer require cloudinary/cloudinary_php, then upload via the SDK:
        //
        //   $cloudinary = new \Cloudinary\Cloudinary([...credentials from env...]);
        //   $result = $cloudinary->uploadApi()->upload($file->getTempName(), ['folder' => $folder]);
        //   return $result['secure_url'];
        //
        throw new RuntimeException(
            'Cloudinary driver selected but the SDK is not wired up yet. ' .
            'Run `composer require cloudinary/cloudinary_php` and implement storeCloudinary(), ' .
            'or set STORAGE_DRIVER=local for development.'
        );
    }
}
