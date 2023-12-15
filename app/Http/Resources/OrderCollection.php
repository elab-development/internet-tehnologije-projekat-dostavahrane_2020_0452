<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class OrderCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public $collects = OrderBaseResource::class;
    public function toArray($request)
    {
        return [
            "data" => $this->collection,
            'page' => $this->currentPage(),
            "total" => $this->total()
        ];
    }
}
