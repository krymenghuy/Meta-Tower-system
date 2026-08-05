<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use XAuthService;
use JDV;


class MobileAuthController extends Controller
{
    /* =====================================================
     * MOBILE LOGIN (API)
     * =================================================== */
    public function mobileLogin(Request $request)
    {
        $appId = $request->app_id;
        $loginName = trim($request->login_name);
        $password  = $request->password;

        $result = XAuthService::verifyUser($appId, $loginName, $password);

        if ($result->status !== 'OK') {
            return $result; // backward-compatible
        }

        $user = $result->user;

        // Attach Firebase topics (non-sensitive metadata)
        // $user->firebase_topics = getFirebaseTopics($user);

        return $result;
    }

    /* =====================================================
     * GUARDIAN / MOBILE LOGOUT (REAL LOGOUT)
     * =================================================== */
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        if (!$token) {
            return response()->json([
                'status'  => 'ERROR',
                'message' => 'Missing access token'
            ], 401);
        }
        XAuthService::revokeToken($token);
        return response()->json([
            'status'  => 'OK',
            'message' => 'Logged out successfully'
        ]);
    }

    public function getProfile(Request $request)
    {
        $ss = XAuthService::verifyAuth($request, -1);
        if ($ss->status_code !== 200) {
            return JDV::raw($ss);
        }
        return response()->json([
            'status'  => 'OK',
            'message' => 'Got profile successfully'
        ]);
    }
}