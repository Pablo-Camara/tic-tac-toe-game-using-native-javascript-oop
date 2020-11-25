<?php

namespace Database\Seeders;

use App\Services\ApiTokenGeneratorService;
use App\Services\DateTimeService;
use App\Services\PasswordHashService;
use DateTime;
use DateTimeZone;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{

    private $passwordHashService;
    private $dateTimeService;
    private $apiTokenGeneratorService;

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
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $pwd = $this->passwordHashService->hash('1234567');
        $now = $this->dateTimeService->getNow();
        $apiToken = $this->apiTokenGeneratorService->generate($pwd);
        
        DB::table('users')->insert([
            'firstName' => 'Pablo',
            'lastName' => 'Câmara',
            'email' => 'admin@camara.pt',
            'password' => $pwd,
            'api_token' => $apiToken,
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
