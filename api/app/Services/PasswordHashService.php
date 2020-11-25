<?php

namespace App\Services;

use Illuminate\Support\Facades\Hash;

class PasswordHashService {
    
    /**
     * @param string $password
     * @return string
     */
    public function hash($password){
        return Hash::make($password);
    }
}