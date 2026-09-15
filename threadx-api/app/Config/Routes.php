<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->setDefaultNamespace('App\Controllers');
$routes->setDefaultController('Home');
$routes->setDefaultMethod('index');
$routes->setAutoRoute(false);

// CORS preflight (OPTIONS) catch-all. Without this, CodeIgniter throws a 404
// for the browser's preflight request before it ever reaches CorsFilter,
// since no route explicitly matches the OPTIONS method — the browser then
// reports this as a CORS error even though the real cause is routing.
$routes->options('(:any)', static function () {
    return service('response')->setStatusCode(204);
});

// ------------------------------------------------------------
// Public / storefront API
// ------------------------------------------------------------
$routes->group('api', function ($routes) {

    // ---------- Auth ----------
    $routes->group('auth', function ($routes) {
        $routes->post('register', 'Api\AuthController::register');
        $routes->post('login', 'Api\AuthController::login');
        $routes->post('logout', 'Api\AuthController::logout', ['filter' => 'auth']);
        $routes->post('forgot-password', 'Api\AuthController::forgotPassword');
        $routes->post('reset-password', 'Api\AuthController::resetPassword');
        $routes->get('me', 'Api\AuthController::me', ['filter' => 'auth']);
        $routes->put('me', 'Api\AuthController::updateProfile', ['filter' => 'auth']);
        $routes->put('me/password', 'Api\AuthController::changePassword', ['filter' => 'auth']);
    });

    // ---------- Products ----------
    $routes->get('products', 'Api\ProductController::index');
    $routes->get('products/(:segment)', 'Api\ProductController::show/$1');
    $routes->get('products/(:segment)/reviews', 'Api\ReviewController::forProduct/$1');
    $routes->post('products/(:num)/reviews', 'Api\ReviewController::store/$1', ['filter' => 'auth']);

    // ---------- Categories ----------
    $routes->get('categories', 'Api\CategoryController::index');
    $routes->get('categories/(:segment)', 'Api\CategoryController::show/$1');

    // ---------- Cart (guest via X-Session-Id header, or auth) ----------
    $routes->get('cart', 'Api\CartController::index');
    $routes->post('cart/items', 'Api\CartController::addItem');
    $routes->put('cart/items/(:num)', 'Api\CartController::updateItem/$1');
    $routes->delete('cart/items/(:num)', 'Api\CartController::removeItem/$1');
    $routes->post('cart/apply-coupon', 'Api\CartController::applyCoupon');
    $routes->post('cart/merge', 'Api\CartController::mergeGuestCart', ['filter' => 'auth']);

    // ---------- Wishlist (auth required) ----------
    $routes->group('wishlist', ['filter' => 'auth'], function ($routes) {
        $routes->get('/', 'Api\WishlistController::index');
        $routes->post('/', 'Api\WishlistController::add');
        $routes->delete('(:num)', 'Api\WishlistController::remove/$1');
    });

    // ---------- Addresses (auth required) ----------
    $routes->group('addresses', ['filter' => 'auth'], function ($routes) {
        $routes->get('/', 'Api\AddressController::index');
        $routes->post('/', 'Api\AddressController::store');
        $routes->put('(:num)', 'Api\AddressController::update/$1');
        $routes->delete('(:num)', 'Api\AddressController::delete/$1');
    });

    // ---------- Orders ----------
    $routes->post('orders', 'Api\OrderController::store'); // guest checkout allowed
    $routes->get('orders', 'Api\OrderController::index', ['filter' => 'auth']);
    $routes->get('orders/(:segment)', 'Api\OrderController::show/$1');
    $routes->get('orders/(:segment)/track', 'Api\OrderController::track/$1');

    // ---------- Custom T-shirt designer ----------
    $routes->post('custom-designs', 'Api\CustomDesignController::store');
    $routes->post('custom-designs/upload', 'Api\CustomDesignController::uploadImage');
    $routes->get('custom-designs/(:num)', 'Api\CustomDesignController::show/$1');
    $routes->get('my/custom-designs', 'Api\CustomDesignController::mine', ['filter' => 'auth']);

    // ---------- Coupons ----------
    $routes->post('coupons/validate', 'Api\CouponController::validateCode');

    // ---------- Payments ----------
    $routes->post('payments/initiate', 'Api\PaymentController::initiate');
    $routes->post('payments/callback', 'Api\PaymentController::callback'); // server-to-server, verified in controller
    $routes->get('payments/(:num)/status', 'Api\PaymentController::status/$1');

    // ---------- Settings (public read-only, e.g. brand config, delivery fees) ----------
    $routes->get('settings/public', 'Api\SettingController::publicSettings');
    $routes->get('shipping', 'Api\SettingController::shippingRates');
});

// ------------------------------------------------------------
// Admin API — all behind auth + admin role filters
// ------------------------------------------------------------
$routes->group('api/admin', ['filter' => ['auth', 'admin']], function ($routes) {

    $routes->get('dashboard', 'Admin\DashboardController::overview');
    $routes->get('reports', 'Admin\DashboardController::reports');

    // Products
    $routes->get('products', 'Admin\ProductController::index');
    $routes->post('products', 'Admin\ProductController::create');
    $routes->get('products/(:num)', 'Admin\ProductController::show/$1');
    $routes->put('products/(:num)', 'Admin\ProductController::update/$1');
    $routes->delete('products/(:num)', 'Admin\ProductController::delete/$1');
    $routes->post('products/(:num)/images', 'Admin\ProductController::uploadImage/$1');
    $routes->delete('products/images/(:num)', 'Admin\ProductController::deleteImage/$1');
    $routes->post('products/(:num)/variants', 'Admin\ProductController::addVariant/$1');
    $routes->put('variants/(:num)', 'Admin\ProductController::updateVariant/$1');
    $routes->delete('variants/(:num)', 'Admin\ProductController::deleteVariant/$1');

    // Categories
    $routes->get('categories', 'Admin\CategoryController::index');
    $routes->post('categories', 'Admin\CategoryController::create');
    $routes->post('categories/(:num)/image', 'Admin\CategoryController::uploadImage/$1');
    $routes->put('categories/(:num)', 'Admin\CategoryController::update/$1');
    $routes->delete('categories/(:num)', 'Admin\CategoryController::delete/$1');

    // Orders
    $routes->get('orders', 'Admin\OrderController::index');
    $routes->get('orders/(:num)', 'Admin\OrderController::show/$1');
    $routes->put('orders/(:num)/status', 'Admin\OrderController::updateStatus/$1');
    $routes->put('orders/(:num)/payment-status', 'Admin\OrderController::updatePaymentStatus/$1');
    $routes->put('orders/(:num)/tracking', 'Admin\OrderController::updateTracking/$1');

    // Customers
    $routes->get('customers', 'Admin\CustomerController::index');
    $routes->get('customers/(:num)', 'Admin\CustomerController::show/$1');
    $routes->put('customers/(:num)/status', 'Admin\CustomerController::updateStatus/$1');

    // Custom designs
    $routes->get('custom-designs', 'Admin\CustomDesignAdminController::index');
    $routes->put('custom-designs/(:num)/status', 'Admin\CustomDesignAdminController::updateStatus/$1');

    // Inventory
    $routes->get('inventory', 'Admin\InventoryController::index');
    $routes->put('inventory/(:num)', 'Admin\InventoryController::updateStock/$1');

    // Coupons
    $routes->get('coupons', 'Admin\CouponController::index');
    $routes->post('coupons', 'Admin\CouponController::create');
    $routes->put('coupons/(:num)', 'Admin\CouponController::update/$1');
    $routes->delete('coupons/(:num)', 'Admin\CouponController::delete/$1');

    // Reviews
    $routes->get('reviews', 'Admin\ReviewController::index');
    $routes->put('reviews/(:num)/approve', 'Admin\ReviewController::approve/$1');
    $routes->delete('reviews/(:num)', 'Admin\ReviewController::delete/$1');

    // Delivery / shipping
    $routes->get('shipping', 'Admin\ShippingController::index');
    $routes->put('shipping/(:num)', 'Admin\ShippingController::update/$1');
    $routes->post('shipping', 'Admin\ShippingController::create');

    // Settings
    $routes->get('settings', 'Admin\SettingAdminController::index');
    $routes->put('settings', 'Admin\SettingAdminController::update');
});