<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveDriver extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropDatabaseIfExists('drivers');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->foreignId('id')->constrained('users')->cascadeOnDelete();
            $table->primary('id');
            $table->decimal('lat');
            $table->decimal('lng');
        });
    }
}
