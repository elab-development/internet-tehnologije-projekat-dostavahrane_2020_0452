<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderBaseResource extends JsonResource
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
            'clientId' => $this->client_id,
            'driverId' => $this->driver_id,
            'driverStatus' => $this->driver_status,
            'driverStatus' => $this->driver_status,
            'storeId' => $this->driver_status,
            'prepTime' => $this->prep_time,
            'deliveryTime' => $this->delivery_time
        ];
    }
}
