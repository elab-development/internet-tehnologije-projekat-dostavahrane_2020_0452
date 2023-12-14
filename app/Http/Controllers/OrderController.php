<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{

    private $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = $request->query;
        $user = $request->user();
        if ($user->user_type == 'client') {
            $query['client_id'] = $user->id;
        }
        if ($user->user_type == 'driver') {
            $query['driver_id'] = $user->id;
        }
        if ($user->user_type == 'merchant') {
            $merchant = Merchant::find($user->id);
            $query['store_id'] = $merchant->store_id;
        }

        return response()->json($this->orderService->searchOrders($request->query));
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->user_type != 'client') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $body = $request->all();
        $validator = Validator::make($body, [
            'address' => 'required|string|min:10',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'items' => 'required|array:itemId,count|min:1'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        try {
            return response()->json($this->orderService->createOrder($body, $user->id));
        } catch (\Exception $ex) {
            return response()->json($ex->getMessage(), 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $order = $this->orderService->getById($id);
        $user = $request->user();
        if ($user->user_type === 'client' && $user->id != $order->client_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->user_type === 'driver' && $user->id != $order->driver_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        if ($user->user_type === 'merchant') {
            $merchant = Merchant::find($user->id);
            if ($order->store_id != $merchant->store_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }
        return $order;
    }
}
