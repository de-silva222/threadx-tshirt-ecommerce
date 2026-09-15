<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\CustomDesignModel;
use App\Services\ImageStorageService;
use RuntimeException;

class CustomDesignController extends BaseApiController
{
    protected CustomDesignModel $designs;

    public function __construct()
    {
        $this->designs = new CustomDesignModel();
    }

    /** Step 4 of the designer: upload the artwork, get back a URL to reference. */
    public function uploadImage()
    {
        $file = $this->request->getFile('design');
        if (!$file) {
            return json_error('No file uploaded.', 422);
        }

        try {
            $url = (new ImageStorageService())->store($file, 'custom-designs');
        } catch (RuntimeException $e) {
            return json_error($e->getMessage(), 422);
        }

        return json_success(['url' => $url], 'Uploaded.');
    }

    /**
     * Save the finished design configuration (steps 1-8) and calculate the
     * final price server-side — never trust a price sent by the client.
     */
    public function store()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'tshirt_type' => 'required|in_list[oversized,regular]',
            'color' => 'required',
            'size' => 'required|in_list[S,M,L,XL,XXL]',
            'print_position' => 'required|in_list[front,back,left_chest,right_chest]',
        ];
        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }

        $hasImage = !empty($data['design_image']);
        $hasText = !empty($data['custom_text']);
        if (!$hasImage && !$hasText) {
            return json_error('Add an image or custom text to your design.', 422);
        }

        $price = $this->designs->calculatePrice($data['tshirt_type'], $hasImage, $hasText);

        $id = $this->designs->insert([
            'user_id' => $this->currentUserId(),
            'tshirt_type' => $data['tshirt_type'],
            'color' => $data['color'],
            'size' => $data['size'],
            'design_image' => $data['design_image'] ?? null,
            'custom_text' => $data['custom_text'] ?? null,
            'font' => $data['font'] ?? 'Inter',
            'text_color' => $data['text_color'] ?? '#000000',
            'print_position' => $data['print_position'],
            'scale' => $data['scale'] ?? 1.0,
            'rotation' => $data['rotation'] ?? 0,
            'pos_x' => $data['pos_x'] ?? 50,
            'pos_y' => $data['pos_y'] ?? 50,
            'base_price' => $price['base_price'],
            'printing_fee' => $price['printing_fee'],
            'total_price' => $price['total_price'],
            'status' => 'pending_review',
        ], true);

        return json_success($this->designs->find($id), 'Design saved.', 201);
    }

    public function show($id = null)
    {
        $design = $this->designs->find((int) $id);
        if (!$design) return json_error('Design not found.', 404);
        return json_success($design);
    }

    public function mine()
    {
        return json_success($this->designs->where('user_id', $this->currentUserId())
            ->orderBy('created_at', 'DESC')->findAll());
    }
}
