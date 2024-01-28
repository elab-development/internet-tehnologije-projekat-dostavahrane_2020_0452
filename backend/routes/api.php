<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GeoController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::apiResource('/stores', StoreController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/travel-time', [GeoController::class, 'travelTime']);
    Route::put('/orders/{id}/accept', [OrderController::class, 'rejectOrder']);
    Route::put('/orders/{id}/reject', [OrderController::class, 'acceptOrder']);
    Route::put('/orders/{id}/prepare', [OrderController::class, 'prepareOrder']);
    Route::put('/orders/{id}/assign', [OrderController::class, 'assignOrder']);
    Route::put('/orders/{id}/pick-up', [OrderController::class, 'pickupOrder']);
    Route::put('/orders/{id}/deliver', [OrderController::class, 'deliverOrder']);
    Route::apiResource('/orders', OrderController::class)->only(['index', 'store', 'show']);
    Route::apiResource('/stores', StoreController::class)->only(['update', 'store', 'destroy']);
    Route::apiResource('items', ItemController::class)->only(['store', 'update', 'destroy']);
});
