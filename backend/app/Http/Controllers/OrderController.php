<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderCollection;
use App\Http\Resources\OrderResource;
use App\Models\Merchant;
use App\Models\Order;
use App\Services\OrderService;
use ArrayObject;
use Illuminate\Database\Eloquent\Builder;
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
        $query = $_GET;
        $user = $request->user();
        if ($user->user_type == 'client') {
            $query['client_id'] = $user->id;
        }
        if ($user->user_type == 'merchant') {
            $merchant = Merchant::find($user->id);
            $query['store_id'] = $merchant->store_id;
        }
        if ($user->user_type == 'driver') {
            $query['driver_id'] = $user->id;
        }
        return response()->json(new OrderCollection($this->orderService->searchOrders($query)));
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
            'address' => 'required|string|min:5',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'items' => 'required|array|min:1'
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }
        try {
            return response()->json(new OrderResource($this->orderService->createOrder($body, $user->id)));
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
        return response()->json(new OrderResource($order));
    }

    public function activeOrders(Request $request)
    {
        $user = $request->user();
        if ($user->user_type == 'client') {
            return response(['message' => 'Forbidden'], 403);
        }
        if ($user->user_type == 'merchant') {
            $storeId = Merchant::find($user->id)->store_id;
            $orders = Order::where('store_id', $storeId)
                ->whereIn('status', ['pending', 'accepted'])->get();
            return response()->json(OrderResource::collection($orders));
        }
        if ($user->user_type == 'driver') {
            $ordersQuery = Order::query()->where('driver_id', $user->id)
                ->where('driver_status', '<>', 'delivered')
                ->orWhere(function (Builder $query) {
                    $query->where('status', 'prepared')->whereNull('driver_status');
                });
            return response()->json(OrderResource::collection($ordersQuery->get()));
        }
        $ordersQuery = Order::query()->where('status', '<>', 'rejected')
            ->where('driver_status', '<>', 'delivered');
        return response()->json(OrderResource::collection($ordersQuery->get()));
    }

    public function acceptOrder($id, Request $request)
    {
        $user = $request->user();
        $order = $this->orderService->acceptOrder($id, $request->all(), $user);
        return response()->json(new OrderResource($order));
    }

    public function rejectOrder($id, Request $request)
    {
        $user = $request->user();
        $order = $this->orderService->rejectOrder($id, $user);
        return response()->json(new OrderResource($order));
    }

    public function prepareOrder($id, Request $request)
    {
        $user = $request->user();
        $order = $this->orderService->prepareOrder($id, $user);
        return response()->json(new OrderResource($order));
    }
    public function assignOrder($id, Request $request)
    {
        $user = $request->user();
        $driverId = $user->user_type == 'driver' ? $user->id : $request->driverId;
        $order = $this->orderService->assignOrder($id, $user, $driverId);
        return response()->json(new OrderResource($order));
    }
    public function pickupOrder($id, Request $request)
    {
        $user = $request->user();
        $order = $this->orderService->pickupOrder($id, $user);
        return response()->json(new OrderResource($order));
    }
    public function deliverOrder($id, Request $request)
    {
        $user = $request->user();
        $order = $this->orderService->deliverOrder($id, $user);
        return response()->json(new OrderResource($order));
    }

    public function getOrderStatistics(Request $request)
    {
        $user = $request->user();
        if ($user->user_type != 'admin') {
            return response()->json(["message" => 'Forbidden'], 403);
        }
        return response()->json($this->orderService->getStoreStatistics($request->query('from', null), $request->query('to', null)));
    }
}
