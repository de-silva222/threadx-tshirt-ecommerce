<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\ProductModel;
use App\Models\ProductVariantModel;
use App\Models\ProductImageModel;
use App\Services\ImageStorageService;

class ProductController extends BaseApiController
{
    protected ProductModel $products;

    public function __construct()
    {
        $this->products = new ProductModel();
    }

    public function index()
    {
        $filters = $this->request->getGet();
        $page = max(1, (int) ($filters['page'] ?? 1));
        $perPage = 20;
        $builder = $this->products->orderBy('created_at', 'DESC');
        if (!empty($filters['q'])) $builder->like('name', $filters['q']);

        $total = $builder->countAllResults(false);
        $items = $builder->limit($perPage, ($page - 1) * $perPage)->findAll();

        return json_success(['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function show($id = null)
    {
        $product = $this->products->find((int) $id);
        if (!$product) return json_error('Product not found.', 404);
        $product['images'] = (new ProductImageModel())->where('product_id', $id)->orderBy('sort_order')->findAll();
        $product['variants'] = (new ProductVariantModel())->where('product_id', $id)->findAll();
        return json_success($product);
    }

    public function create()
    {
        $data = $this->request->getJSON(true);

        $rules = [
            'category_id' => 'required|is_natural_no_zero',
            'name' => 'required|min_length[2]',
            'sku' => 'required|is_unique[products.sku]',
            'base_price' => 'required|decimal',
        ];
        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }

        $data['slug'] = $data['slug'] ?? url_title($data['name'], '-', true);
        $id = $this->products->insert($data, true);

        return json_success($this->products->find($id), 'Product created.', 201);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true);
        $this->products->update($id, $data);
        return json_success($this->products->find($id), 'Product updated.');
    }

    public function delete($id = null)
    {
        $this->products->delete($id);
        return json_success(null, 'Product deleted.');
    }

    public function uploadImage($productId = null)
    {
        $file = $this->request->getFile('image');
        if (!$file || !$file->isValid()) return json_error('No valid file uploaded.', 422);

        try {
            $url = (new ImageStorageService())->store($file, 'products');
        } catch (\RuntimeException $e) {
            return json_error($e->getMessage(), 422);
        }

        $imageModel = new ProductImageModel();
        $type = $this->request->getPost('type') ?? 'front';
        $sortOrder = $this->request->getPost('sort_order') ?? 0;

        $id = $imageModel->insert([
            'product_id' => $productId, 'url' => $url, 'type' => $type, 'sort_order' => $sortOrder,
        ], true);

        return json_success($imageModel->find($id), 'Image uploaded.', 201);
    }

    public function deleteImage($imageId = null)
    {
        (new ProductImageModel())->delete($imageId);
        return json_success(null, 'Image deleted.');
    }

    public function addVariant($productId = null)
    {
        $data = $this->request->getJSON(true);
        $data['product_id'] = $productId;

        $rules = [
            'size' => 'required|in_list[S,M,L,XL,XXL]',
            'color' => 'required',
            'sku' => 'required|is_unique[product_variants.sku]',
            'stock' => 'required|is_natural',
        ];
        if (!$this->validateData($data, $rules)) {
            return json_error('Validation failed.', 422, $this->validator->getErrors());
        }

        $variantModel = new ProductVariantModel();
        $id = $variantModel->insert($data, true);
        return json_success($variantModel->find($id), 'Variant added.', 201);
    }

    public function updateVariant($id = null)
    {
        $data = $this->request->getJSON(true);
        $variantModel = new ProductVariantModel();
        $variantModel->update($id, $data);
        return json_success($variantModel->find($id), 'Variant updated.');
    }

    public function deleteVariant($id = null)
    {
        (new ProductVariantModel())->delete($id);
        return json_success(null, 'Variant deleted.');
    }
}
