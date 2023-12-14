<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Store::all());
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
        if ($user->user_type != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $store = Store::create($request->all());
        return $store;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\Response
     */
    public function show(Store $store)
    {
        return response()->json($store);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Store $store)
    {
        $user = $request->user();
        if ($user->user_type != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $store->update($request->all());
        return response()->json($store);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Store $store)
    {
        $user = $request->user();
        if ($user->user_type != 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    }
}
