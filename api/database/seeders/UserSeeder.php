<?php

namespace Database\Seeders;

use DateTime;
use DateTimeZone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $pwd = Hash::make('1234567');
        $now = new DateTime('now',new DateTimeZone('Europe/Lisbon'));
        DB::table('users')->insert([
            'firstName' => 'Pablo',
            'lastName' => 'Câmara',
            'email' => 'admin@camara.pt',
            'password' => $pwd,
            'api_token' => md5($pwd . $now->format('YmdHis')),
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
