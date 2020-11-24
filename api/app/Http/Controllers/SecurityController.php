<?php

namespace App\Http\Controllers;

use App\Models\User;
use DateTime;
use DateTimeZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;

class SecurityController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    private function invalidCredentials(int $status_code){
        return new JsonResponse(
            [
                'status' => false,
                'message' => 'Invalid login credentials'
            ],
            $status_code
        );
    }

    //
    public function attemptLogin(){
        $email = Request::input('email');
        $password = Request::input('password');


        if(empty($email) || empty($password)){
            return $this->invalidCredentials(JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = DB::selectOne(
            'SELECT id,firstName,lastName,password,created_at FROM users WHERE email = :email',
            [
                'email' => 'admin@camara.pt'
            ]
        );

        if(
            null === $user
            ||
            false === Hash::check($password,$user->password)
        ){
            return $this->invalidCredentials(JsonResponse::HTTP_UNAUTHORIZED);
        }

        // Generate new API token on login
        $now = new DateTime('now',new DateTimeZone('Europe/Lisbon'));
        $apiToken = md5($user->password . $now->format('YmdHis'));

        DB::table('users')->where('id','=',$user->id)->update([
            'api_token' => $apiToken,
            'updated_at' => $now
        ]);
        
        return new JsonResponse([
            'status' => true,
            'api_token' => $apiToken,
            'data' => [
                'firstName' => $user->firstName,
                'lastName' => $user->lastName,
                'email' => $email,
                'created_at' => $user->created_at
            ]
        ]);
        
    }
}
