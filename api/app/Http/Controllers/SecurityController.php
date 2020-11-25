<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ApiTokenGeneratorService;
use App\Services\DateTimeService;
use App\Services\PasswordHashService;
use DateTime;
use DateTimeZone;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Request;
use Illuminate\Validation\ValidationException;

class SecurityController extends Controller
{
    
    private $dateTimeService;
    private $passwordHashService;
    private $apiTokenGeneratorService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(
        DateTimeService $dateTimeService,
        PasswordHashService $passwordHashService,
        ApiTokenGeneratorService $apiTokenGeneratorService
    )
    {
        $this->dateTimeService = $dateTimeService;
        $this->passwordHashService = $passwordHashService;
        $this->apiTokenGeneratorService = $apiTokenGeneratorService;
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

    private function registerFailed(){
        return new JsonResponse(
            [
                'status' => false,
                'message' => 'Could not register please try again later'
            ],
            JsonResponse::HTTP_INTERNAL_SERVER_ERROR
        );
    }

    private function successUserResponse(\App\Models\User $user){
        return new JsonResponse(
            [
                'status' => true,
                'api_token' => $user->api_token,
                'data' => [
                    'firstName' => $user->firstName,
                    'lastName' => $user->lastName,
                    'email' => $user->email,
                    'created_at' => $user->created_at
                ]
            ]
        );
    }

    public function attemptRegister(\Illuminate\Http\Request $request){

        try {
            $this->validate($request,[
                'firstName' => 'required',
                'lastName' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:7|confirmed'
            ]);
        } catch (ValidationException $ex) {
            return $ex->getResponse();;
        }
        

        $user = new User();
        $user->fill($request->only($user->getFillable()));

        $now = $this->dateTimeService->getNow();

        $user->setCreatedAt($now);
        $user->setUpdatedAt($now);

        $hashedPassword = $this->passwordHashService->hash($request->input('password'));
        $apiToken = $this->apiTokenGeneratorService->generate($hashedPassword);

        $user->forceFill([
            'password' => $hashedPassword,
            'api_token' => $apiToken
        ]);

        if(false === $user->save()){
            return $this->registerFailed();
        }

        return $this->successUserResponse($user);
    }

    //
    public function attemptLogin(){
        $email = Request::input('email');
        $password = Request::input('password');


        if(empty($email) || empty($password)){
            return $this->invalidCredentials(JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = DB::selectOne(
            'SELECT * FROM users WHERE email = :email',
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
        $now = $this->dateTimeService->getNow();
        $apiToken = md5($user->password . $now->format('YmdHis'));

        $updatedUserData = [
            'api_token' => $apiToken,
            'updated_at' => $now
        ];

        DB::table('users')->where('id','=',$user->id)->update($updatedUserData);

        $returnUser = new User();
        $returnUser->forceFill((array)$user);
        $returnUser->forceFill($updatedUserData);
        
        return $this->successUserResponse($returnUser);
        
    }
}
