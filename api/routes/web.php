<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->post('/security/attempt-login', 'SecurityController@attemptLogin');
$router->post('/security/attempt-register', 'SecurityController@attemptRegister');


$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/player/list','PlayerController@test');
});