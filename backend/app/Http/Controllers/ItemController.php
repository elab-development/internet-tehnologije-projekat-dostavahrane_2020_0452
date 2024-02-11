<?php

namespace App\Http\Controllers;

use App\Http\Resources\ItemResource;
use App\Http\Resources\StoreResource;
use App\Models\Item;
use App\Models\Merchant;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        if ($user->user_type != 'admin' && $user->user_type != 'merchant') {
            return response()->json(["message" => "Forbidden"], 403);
        }
        $storeId = $request->input("storeId", null);
        if ($user->user_type === 'merchant') {
            $merchant = Merchant::find($user->id);
            $storeId = $merchant->store_id;
        }
        $item = Item::create([
            'name' => $request->name,
            'image' => $request->image,
            'price' => $request->price,
            'disabled' => $request->disabled,
            'store_id' => $storeId
        ]);

        return response()->json(new ItemResource($item));
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
        if ($user->user_type == 'admin') {
            return true;
        }
        if ($user->user_type != 'merchant') {
            return false;
        }
        $merchant = Merchant::find($user->id);
        return $merchant->store_id == $item->store_id;
    }

    public function uploadFile(Request $request)
    {
        $user = $request->user();
        if ($user->user_type != 'admin' && $user->user_type != 'merchant') {
            return response()->json(["message" => "Forbidden"], 403);
        }
        $fileName = $request->file('file')->store('local');
        return response()->json(['fileName' => $fileName]);
    }

    public function getFile($itemId)
    {
        $item = Item::find($itemId);
        if (!$item) {
            return response()->json(['message' => "missing item"], 404);
        }
        return response(Storage::disk('local')->get($item->image));
    }
}
