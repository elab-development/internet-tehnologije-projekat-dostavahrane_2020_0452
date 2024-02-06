<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Merchant;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService
{

    private $geoService;

    public function __construct(GeoService $geoService)
    {
        $this->geoService = $geoService;
    }

    public function searchOrders($filters)
    {
        $page = 0;
        $size = 20;
        $where = [];
        if (array_key_exists('storeId', $filters)) {
            $where[] = ['store_id', '=', $filters['storeId']];
        }
        if (array_key_exists('clientId', $filters)) {
            $where[] = ['client_id', '=', $filters['clientId']];
        }
        if (array_key_exists('driverId', $filters)) {
            $where[] = ['driver_id', '=', $filters['driverId']];
        }
        if (array_key_exists('from', $filters)) {
            $where[] = ['created_at', '>', $filters['from']];
        }
        if (array_key_exists('to', $filters)) {
            $where[] = ['created_at', '<', $filters['to']];
        }
        if (array_key_exists('page', $filters)) {
            $page = $filters['page'];
        }
        if (array_key_exists('size', $filters)) {
            $size = $filters['size'];
        }
        return Order::where($where)->paginate($size, ['*'], 'page', $page);
    }

    public function createOrder($orderData, $clientId)
    {
        try {
            DB::beginTransaction();
            $item = Item::find($orderData['items'][0]['itemId']);
            $storeId = $item->store_id;
            $geoResult = $this->geoService->calculate($orderData['lat'], $orderData['lng'],  $storeId);
            $deliveryTime = $geoResult['duration']['value'];
            $distance = $geoResult['distance']['value'];
            $order =  Order::create([
                'client_id' => $clientId,
                'lat' => $orderData['lat'],
                'lng' => $orderData['lng'],
                'address' => $orderData['address'],
                'status' => 'pending',
                'store_id' => $storeId,
                'delivery_time' => $deliveryTime,
                'delivery_price' => $distance * 0.06
            ]);
            foreach ($orderData['items'] as $itemRequest) {
                $item = Item::find($itemRequest['itemId']);
                if (!$item) {
                    throw new Exception('Missing item');
                }
                if ($storeId != $item->store_id) {
                    throw new Exception('Items from multiple stores are not permitted');
                }
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $item->id,
                    'count' => $itemRequest['count'],
                    'item_price' => $item->price
                ]);
            }
            DB::commit();
            return Order::find($order->id);
        } catch (\Exception $ex) {
            DB::rollBack();
            throw $ex;
        }
    }

    public function getById($id)
    {
        return Order::find($id);
    }

    public function rejectOrder($id, $user)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'merchant') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);
        if ($user->user_type == 'merchant') {
            $merchant = Merchant::find($user->id);
            if ($order->store_id != $merchant->store_id) {
                throw new Exception('Invalid access');
            }
        }
        $order->update(['status' => 'rejected']);
        return $order;
    }

    public function acceptOrder($id, $data, $user)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'merchant') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);
        if ($user->user_type == 'merchant') {
            $merchant = Merchant::find($user->id);
            if ($order->store_id != $merchant->store_id) {
                throw new Exception('Invalid access');
            }
        }
        $prepTime = $data['prepTime'];
        $order->update([
            'status' => 'accepted',
            'prep_time' => $prepTime
        ]);
        return $order;
    }
    public function prepareOrder($id, $user)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'merchant') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);
        if ($user->user_type == 'merchant') {
            $merchant = Merchant::find($user->id);
            if ($order->store_id != $merchant->store_id) {
                throw new Exception('Invalid access');
            }
        }
        $order->update(['status' => 'prepared']);
        return $order;
    }
    public function assignOrder($id, $user, $driverId)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'driver') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);

        $order->update(['driver_status' => 'assigned', 'driver_id' => $driverId]);
        return $order;
    }
    public function pickupOrder($id, $user)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'driver') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);
        if ($user->user_type == 'driver') {
            if ($order->driver_id != $user->id) {
                throw new Exception('Invalid access');
            }
        }
        $order->update(['driver_status' => 'picked_up']);
        return $order;
    }
    public function deliverOrder($id, $user)
    {
        if ($user->user_type != 'admin' && $user->user_type != 'driver') {
            throw new Exception('Invalid access');
        }
        $order = Order::find($id);
        if ($user->user_type == 'driver') {
            if ($order->driver_id != $user->id) {
                throw new Exception('Invalid access');
            }
        }
        $order->update(['driver_status' => 'delivered']);
        return $order;
    }

    public function getStoreStatistics($from, $to)
    {

        $query = DB::table('stores')
            ->select('stores.id', 'stores.name', DB::raw('COUNT(orders.id) as total'))
            ->leftJoin('orders', 'orders.store_id', '=', 'stores.id');
        if ($from) {
            $query = $query->where('orders.created_at', '>', $from);
        }
        if ($to) {
            $query = $query->where('orders.created_at', '<', $to);
        }
        $query = $query->groupBy('stores.id')->groupBy('stores.name');
        return $query->get();
    }
}
