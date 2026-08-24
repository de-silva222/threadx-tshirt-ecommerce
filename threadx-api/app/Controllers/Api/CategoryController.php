<?php

namespace App\Controllers\Api;

use App\Controllers\BaseApiController;
use App\Models\CategoryModel;

class CategoryController extends BaseApiController
{
    protected CategoryModel $categories;

    public function __construct()
    {
        $this->categories = new CategoryModel();
    }

    public function index()
    {
        return json_success($this->categories->active());
    }

    public function show($slug = null)
    {
        $category = $this->categories->bySlug($slug);
        if (!$category) {
            return json_error('Category not found.', 404);
        }
        return json_success($category);
    }
}
