<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" type="image/png" href="{{ asset('assets/images/yavpheng/CYPA_logo.png') }}"/>
    <?php StyleManager::render('login-styles', 1); ?>
    <title>Sign Up - Yav Pheng Association</title>

    <style>
        body {
            margin: 0;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .register {
            display: flex;
            height: 100vh;
        }
        /* .left-image {
            flex: 1;
            position: relative;
        }
        .left-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .overlay-blur {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.4);
        } */
        .login-box {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            /* background-image: url('https://ideogram.ai/assets/image/lossless/response/uVaaSLs1RNaW821-kn9Tw'); */
            background-image: url('assets/images/yavpheng/History006.jpg');
            background-position: center; 
            background-repeat: no-repeat;    
            z-index: 2;
            position: relative;
        }
        .login-form {
            width: 100%;
            max-width: 500px;
            padding: 30px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .logo {
            width: 120px;
            margin: 0 auto;
            display: block;
        }
        .form-title {
            text-align: center;
            margin-top: 20px;
            font-size: 24px;
            font-weight: bold;
        }
        .form-group {
            margin-top: 15px;
        }
        .form-label {
            font-weight: 600;
            margin-bottom: 5px;
            display: block;
        }
        .form-control {
            width: 100%;
            padding: 10px;
            font-size: 15px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }
        .error_text {
            color: red;
            font-size: 14px;
        }
        .btn-submit {
            width: 100%;
            margin-top: 20px;
            padding: 10px;
            font-size: 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .btn-submit:hover {
            background: #0056b3;
        }
        .redirect-login {
            margin-top: 15px;
            text-align: center;
        }
        .redirect-login a {
            color: #007bff;
            text-decoration: none;
        }
        .copyright {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="register">
        <!-- <div class="left-image">
            <img src="{{ asset('assets/images/bhr/main_page.png') }}" alt="Background Image">
            <div class="overlay-blur"></div>
        </div> -->

        <div class="login-box">
            <div class="login-form">
                <img src="{{ asset('assets/images/yavpheng/CYPA_logo.png') }}" class="logo" />
                <h3 class="form-title">Create Your Account</h3>

                <form action="{{ url('/processRegister') }}" method="POST">
                    {{ csrf_field() }}
                    
                    @if(session()->has('signup_error'))
                        <div class="error_text">{{ session('signup_error') }}</div>
                    @endif

                    <div class="form-group">
                        <label class="form-label" for="username">Username</label>
                        <input type="text" name="username" class="form-control" placeholder="Enter username" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="password">Password</label>
                        <input type="password" name="password" class="form-control" placeholder="Enter password" required>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="confirm_password">Confirm Password</label>
                        <input type="password" name="confirm_password" class="form-control" placeholder="Confirm password" required>
                    </div>

                    <button type="submit" class="btn-submit">Sign Up</button>

                    <div class="redirect-login">
                        Already have an account?
                        <a href="/logout">Log in</a>
                    </div>
                </form>

                <div class="copyright">
                    <p>China Yav Pheng Association</p>
                    <p>&copy; 2021</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
