<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'createdAt' => $this->created_at,
            'address' => $this->address,
            'status' => $this->status,
            'lat' => $this->lat,
            'lng' => $this->lng,
            'rating' => $this->rating,
            'client' => new UserResource($this->client),
            'driverId' => new UserResource($this->driver),
            "items" => OrderItemResource::collection($this->items),
            'driverStatus' => $this->driver_status,
            'driverStatus' => $this->driver_status,
            'store' => [
                "id" => $this->store_id,
                "name" => $this->store->name
            ],
            'prepTime' => $this->prep_time,
            'deliveryTime' => $this->delivery_time,
            'deliveryPrice' => $this->delivery_price
        ];
    }
}
