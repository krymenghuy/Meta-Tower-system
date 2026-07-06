<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Cookie;
use XAuthService; // alias of AuthService

class AuthController extends Controller
{
    /* =====================================================
     * AUTH COOKIE (SINGLE SOURCE OF TRUTH)
     * =================================================== */
    protected function authCookie(string $value = '', int $expire = 0)
    {
        return cookie(
            Config::get('app.cookie_name'),
            $value,
            $expire,
            '/',
            null,
            true,   // Secure
            true    // HttpOnly
        );
    }

    /* =====================================================
     * API LOGIN (JSON – USED BY APPS / MOBILE)
     * =================================================== */
    public function apiLogin(Request $request)
    {
        $appId = $request->app_id ?? Config::get('app.admin_app_id');

        return XAuthService::verifyUser(
            $appId,
            $request->login_name,
            $request->password
        );
    }

    /* =====================================================
     * WEB LOGIN (ADMIN / BACKOFFICE)
     * =================================================== */
    public function processLogin(Request $request)
    {
        $appId = $request->app_id ?? Config::get('app.admin_app_id');

        $result = XAuthService::verifyUser(
            $appId,
            $request->login_name,
            $request->password,
            'en'
        );

        // --------------------------------------------------
        // 1️⃣ Authentication failed → render EDV login view
        // --------------------------------------------------
        if (($result->status_code ?? 500) !== 200) {
            return view('login.prm_login', [
                'login_error' => $result->error_message ?? 'Login failed',
                'login_name'  => $request->login_name,
            ]);
        }

        $user = $result->user ?? null;

        if (!$user || empty($user->access_token)) {
            return view('login.prm_login', [
                'login_error' => 'Authentication token was not generated.',
                'login_name'  => $request->login_name,
            ]);
        }

        // --------------------------------------------------
        // 2️⃣ Extract token → bind session user
        // --------------------------------------------------
        $accessToken = $user->access_token;
        unset($user->access_token);

        XAuthService::bindUserToSession($user);

        // --------------------------------------------------
        // 3️⃣ Decide routing (controller responsibility)
        // --------------------------------------------------

        // Case A: valid default app
        if (!empty($user->default_app) && !empty($user->default_app->home_route)) {
            return redirect($user->default_app->home_route)
                ->withCookie($this->authCookie($accessToken));
        }

        // Case B: multiple apps → selector
        if (!empty($user->apps) && count($user->apps) > 1) {
            return redirect('landingpoint')
                ->withCookie($this->authCookie($accessToken));
        }

        // Case C: single app fallback
        if (!empty($user->apps[0]->home_route)) {
            return redirect($user->apps[0]->home_route)
                ->withCookie($this->authCookie($accessToken));
        }

        // --------------------------------------------------
        // 4️⃣ No route available → render EDV login view
        // --------------------------------------------------
        return view('login.prm_login', [
            'login_error' => 'No accessible application found for your account.',
            'login_name'  => $request->login_name,
        ]);
    }

    /* =====================================================
     * TENANT CLIENT PORTAL LOGIN (WEB, SAME COOKIE RULES)
     * =================================================== */
    public function processClientLogin(Request $request)
    {
        $result = XAuthService::verifyUser(
            Config::get('app.prm_client_app_id'),
            $request->login_name,
            $request->password,
            'en'
        );

        // --------------------------------------------------
        // 1️⃣ Authentication failed → render login view
        // --------------------------------------------------
        if (($result->status_code ?? 500) !== 200) {
            return view('login.prm_client_login', [
                'login_error' => $result->error_message ?? 'Login failed',
                'login_name'  => $request->login_name,
            ]);
        }

        $user = $result->user ?? null;

        if (!$user || empty($user->access_token)) {
            return view('login.prm_client_login', [
                'login_error' => 'Authentication token was not generated. Please try again.',
                'login_name'  => $request->login_name,
            ]);
        }

        // --------------------------------------------------
        // 2️⃣ Extract token → bind session user
        // --------------------------------------------------
        $accessToken = $user->access_token;
        unset($user->access_token);

        XAuthService::bindUserToSession($user);

        // --------------------------------------------------
        // 3️⃣ Redirect to student portal
        // --------------------------------------------------
        return redirect('tenant')
            ->withCookie($this->authCookie($accessToken));
    }




    public function logout(Request $request)
    {
        $token = XAuthService::getWebToken($request);
        if ($token) {
            XAuthService::revokeToken($token);
        }
        Cookie::queue($this->authCookie('', -1));
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
