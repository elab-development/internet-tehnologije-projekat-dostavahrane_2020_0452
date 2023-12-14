<?php

namespace App\Services;

use App\Models\Item;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Support\Facades\DB;

class OrderService
{


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
            $item = Item::find($$orderData['items'][0]->itemId);
            $storeId = $item->store_id;
            $order =  Order::create([
                'client_id' => $clientId,
                'lat' => $orderData->lat,
                'lng' => $orderData->lng,
                'address' => $orderData->address,
                'status' => 'pending',
                'store_id' => $storeId,
            ]);
            foreach ($orderData['items'] as $itemRequest) {
                $item = Item::find($itemRequest->itemId);
                if (!$item) {
                    throw new Exception('Missing item');
                }
                if ($storeId != $item->store_id) {
                    throw new Exception('Items from multiple stores are not permitted');
                }
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_id' => $item->id,
                    'count' => $itemRequest->count,
                    'price' => $item->price
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
}
