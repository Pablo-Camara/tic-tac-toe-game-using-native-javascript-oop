<?php

namespace App\Services;

use DateTime;
use DateTimeZone;

class DateTimeService {

    public function getNow(){
        return new DateTime('now',new DateTimeZone('Europe/Lisbon'));
    }
}