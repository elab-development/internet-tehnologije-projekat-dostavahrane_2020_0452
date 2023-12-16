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
        $body = json_decode($response->body(), true);
        if (!$response->successful()) {
            throw new Exception($body['error_message']);
        }
        return $body['rows'][0]['elements'][0];
    }

    public function geocode($address)
    {
        $apiKey = env('TRAVEL_API_KEY', '');
        $url = env('GEOCODE_API_URL', '');
        $response = Http::get($url, [
            'key' => $apiKey,
            'address' => $address
        ]);
        $body = json_decode($response->body(), true);
        if (!$response->successful()) {
            throw new Exception($body['error_message']);
        }
        $result = [];
        foreach ($body['result'] as $element) {
            $result[] = [
                "address" => $element['formatted_address'],
                "lat" => $element['geometry']["location"]["lat"],
                "lng" => $element['geometry']["location"]["lng"]
            ];
        }
        return $result;
    }
}
