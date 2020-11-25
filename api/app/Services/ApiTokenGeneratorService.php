<?php

namespace App\Services;

class ApiTokenGeneratorService {


    private $dateTimeService;

    public function __construct(DateTimeService $dateTimeService) {
        $this->dateTimeService = $dateTimeService;
    }
 
    /**
     * @param string $userHashedPassword
     * @return string
     */
    public function generate(
        $userHashedPassword
    )
    {
        return md5($userHashedPassword . $this->dateTimeService->getNow()->format('YmdHis'));
    }
}