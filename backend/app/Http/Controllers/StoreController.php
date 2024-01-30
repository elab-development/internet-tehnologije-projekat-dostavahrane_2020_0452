<?php

namespace App\Http\Controllers;

use App\Http\Resources\StoreResource;
use App\Models\Merchant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(StoreResource::collection(Store::all()));
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
        DB::beginTransaction();
        $body = $request->all();
        $store = Store::create($body['store']);
        $userData = $body['user'];
        if (User::where('email', $userData['email'])->first()) {
            DB::rollBack();
            return response(['message' => 'Email already in use'], 400);
        }
        $user = User::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'phone' => $userData['phone'],
            'password' => Hash::make($userData['password']),
            'user_type' => 'merchant'
        ]);
        Merchant::create([
            "id" => $user->id,
            'store_id' => $store->id
        ]);
        return response()->json(new StoreResource($store));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Store  $store
     * @return \Illuminate\Http\Response
     */
    public function show(Store $store)
    {
        return response()->json(new StoreResource($store));
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
        return response()->json(new StoreResource($store));
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
        $store->delete();
        return response()->noContent();
    }

    public function merchantStore(Request $request)
    {
        $user = $request->user();
        if ($user->user_type != 'merchant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $store = Merchant::find($user->id)->store;
        return response()->json(new StoreResource($store));
    }
}
