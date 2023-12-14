<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
 
//backend's channel broadcasting to font end view
Broadcast::channel('backend.{branch_id}', function ($data,$branch_id) {
    //if ($branch_id <=0 || $user_id <=0) return false;
    return ($data->branch_id === $branch_id); 
    //return true;
});

// //driver's channel
// Broadcast::channel('driver.{branch_id}.{user_id}', function ($data,$branch_id,$user_id) {
//     if ($branch_id <=0 || $user_id <=0) return false; 
//      return true;
// });

// //web to web broadcast
// Broadcast::channel('web.{branch_id}.{user_id}', function ($data,$branch_id,$user_id) {
//     if ($branch_id <=0 || $user_id <=0) return false; 
//      return true;
// });

// //public channel, no need to create channel here
// Broadcast::channel('public-channel-test', function ($data) {
//     return true;
// });