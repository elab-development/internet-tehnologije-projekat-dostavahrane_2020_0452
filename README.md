# Delivery app

App is used to order food. User can search restaurants and create orders.

Merchant can see it's active orders and accept or reject them.

When mercant finishes the order, driver can be assigned to it.

Driver needs to check when he picks up the order and delivers it.

Admin can create, update and delete stores and items.

Merchant can only change if item is active.

## Prerequisites 

* Node >=16
* PHP >=8.2
* Composer
* Mysql

## Starting the server app

* Create db named delivery
* Install all dependencies using `composer install`
* Execute migrations using `php artisan migrate`
* Start the server with `php artisan serve`

## Starting the client app

* Install dependencies using `npm install`
* Start the client with `npm start`


