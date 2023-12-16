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
        if ($filters['store_id']) {
            $where[] = ['store_id', '=', $filters['store_id']];
        }
        if ($filters['client_id']) {
            $where[] = ['client_id', '=', $filters['client_id']];
        }
        if ($filters['driver_id']) {
            $where[] = ['driver_id', '=', $filters['driver_id']];
        }
        if ($filters['from']) {
            $where[] = ['created_at', '>', $filters['from']];
        }
        if ($filters['to']) {
            $where[] = ['created_at', '<', $filters['to']];
        }
        if ($filters['page']) {
            $page = $filters['page'];
        }
        if ($filters['size']) {
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
}
