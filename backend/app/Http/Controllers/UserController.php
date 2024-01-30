<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function clients()
    {

        return response()->json(UserResource::collection(User::where('user_type', 'client')->get()));
    }
    public function drivers()
    {

        return response()->json(UserResource::collection(User::where('user_type', 'driver')->get()));
    }
}
