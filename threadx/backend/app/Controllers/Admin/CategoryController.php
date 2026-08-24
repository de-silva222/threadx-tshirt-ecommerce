<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseApiController;
use App\Models\CategoryModel;
use App\Services\ImageStorageService;

class CategoryController extends BaseApiController
{
    protected CategoryModel $categories;

    public function __construct()
    {
        $this->categories = new CategoryModel();
    }

    public function index()
    {
        return json_success($this->categories->orderBy('sort_order')->findAll());
    }

    public function create()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $data['slug'] = $data['slug'] ?? url_title($data['name'] ?? '', '-', true);

        $file = $this->request->getFile('image');
        if ($file && $file->isValid()) {
            $data['image'] = (new ImageStorageService())->store($file, 'categories');
        }

        $id = $this->categories->insert($data, true);
        return json_success($this->categories->find($id), 'Category created.', 201);
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $this->categories->update($id, $data);
        return json_success($this->categories->find($id), 'Category updated.');
    }

    public function delete($id = null)
    {
        $this->categories->delete($id);
        return json_success(null, 'Category deleted.');
    }
}
