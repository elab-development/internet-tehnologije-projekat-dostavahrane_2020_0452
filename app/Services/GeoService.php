<?php

namespace App\Services;

use App\Models\Store;
use Error;
use Exception;
use Illuminate\Support\Facades\Http;

class GeoService
{

    public function calculate($lat, $lng, $storeId)
    {
        $apiKey = env('TRAVEL_API_KEY', '');
        $url = env('TRAVEL_API_URL', '');
        $store = Store::find($storeId);
        if (!$store) {
            throw new Exception("Missing store");
        }
        $response = Http::get($url, [
            'key' => $apiKey,
            'destinations' => $lat . ',' . $lng,
            'origins' => $store->lat . ',' . $store->lng
        ]);
        if (!$response->successful()) {
            throw new Exception($response->body()['error_message']);
        }
        return $response->body()['rows'][0]['elements'][0];
    }
}
