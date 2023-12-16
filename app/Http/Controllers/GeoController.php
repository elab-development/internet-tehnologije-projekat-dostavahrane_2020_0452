<?php

namespace App\Http\Controllers;

use App\Models\Store;
use App\Services\GeoService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeoController extends Controller
{

    private $geoService;
    public function __construct(GeoService $gs)
    {
        $this->geoService = $gs;
    }
    public function travelTime(Request $request)
    {
        $storeId = $request->query('store_id');
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        return response()->json($this->geoService->calculate($lat, $lng, $storeId));
    }

    public function geocode(Request $request)
    {
        return response()->json($this->geoService->geocode($request->query('address')));
    }
}
