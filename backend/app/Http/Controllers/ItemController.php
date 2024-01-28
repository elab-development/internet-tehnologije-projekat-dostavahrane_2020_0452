<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Http\Resources\StoreResource;
use App\Models\Item;
use App\Models\Merchant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;

class ItemController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->type != 'admin' && $user->type != 'merchant') {
            return response()->json(["message" => "Forbidden"], 403);
        }
        $storeId = $request->input("store_id", null);
        if ($user->type === 'merchant') {
            $merchant = Merchant::find($user->id);
            $storeId = $merchant->store_id;
        }
        $store = Item::create([
            'name' => $request->name,
            'image' => $request->image,
            'price' => $request->price,
            'disabled' => $request->disabled,
            'store_id' => $storeId
        ]);

        return response()->json(new ItemResource($store));
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Item $item)
    {
        if (!$this->validateUser($request->user(), $item)) {
            return response()->json(["message" => "Forbidden"], 403);
        }
        $item->update($request->only(["name", 'image', 'disabled', 'price']));
        return response()->json(new ItemResource($item));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Item  $item
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, Item $item)
    {
        if (!$this->validateUser($request->user(), $item)) {
            return response()->json(["message" => "Forbidden"], 403);
        }
        $item->delete();
        return response()->noContent();
    }

    private function validateUser(User $user, Item $item)
    {
        if ($user->type == 'admin') {
            return true;
        }
        if ($user->type != 'merchant') {
            return false;
        }
        $merchant = Merchant::find($user->id);
        return $merchant->store_id == $item->store_id;
    }
}
