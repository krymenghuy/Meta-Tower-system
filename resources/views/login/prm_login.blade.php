<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Meta Estate - Login</title>
  <link rel="icon" type="image/png" href="{{ asset('assets/images/meta/Meta_logo1.png') }}"/>
  <?php StyleManager::render('login-styles',1); ?>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: 'Roboto', 'Segoe UI', sans-serif;
    }

    .vs-container-login {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      position: relative;
      overflow: hidden;
    }

    /* Background Image */
    .vs-container-login::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('https://images.unsplash.com/photo-1605902711622-cfb43c443df0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80') center/cover no-repeat;
      filter: brightness(0.45) contrast(1.1);
      z-index: 0;
    }

    .overlay-blur {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(26, 22, 71, 0.6);
      backdrop-filter: blur(3px);
      z-index: 0;
    }

    .vs-login-card {
      z-index: 1;
      position: relative;
      background: rgba(255, 255, 255, 0.95);
      padding: 40px 35px;
      border-radius: 14px;
      max-width: 380px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 25px rgba(0,0,0,0.25);
    }

    .vs-login-card img {
      width: 120px;
      margin-bottom: 10px;
    }

    .vs-login-card h6 {
      margin-bottom: 30px;
      font-size: 18px;
      font-weight: 600;
      color: #1a1647;
    }

    .form-group {
      position: relative;
      margin-bottom: 25px;
      text-align: left;
    }

    .form-group .input-icon {
      position: absolute;
      top: 12px;
      left: 10px;
      color: #666;
      font-size: 16px;
    }

    .form-group input {
      width: 100%;
      border: none;
      border-bottom: 2px solid #ccc;
      padding: 12px 5px 6px 32px;
      font-size: 15px;
      background: transparent;
      outline: none;
      transition: border-color 0.3s;
    }

    .form-group input:focus {
      border-bottom: 2px solid #1a1647;
    }

    .form-group label {
      position: absolute;
      top: 12px;
      left: 32px;
      font-size: 14px;
      color: #999;
      pointer-events: none;
      transition: 0.2s ease all;
    }

    .form-group input:not(:placeholder-shown) ~ label {
      display: none;
    }

    .error_text {
      display: block;
      color: #e74c3c;
      font-size: 14px;
      margin: 10px 0;
      padding: 6px 10px;
      background: #fdecea;
      border-radius: 6px;
      border-left: 3px solid #e74c3c;
    }
    .remember-forgot {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        
        .remember {
            display: flex;
            align-items: center;
            font-size: 13px;
        }
        
        .remember input {
            margin-right: 8px;
        }
        
        .forgot-password {
            color: #4285F4;
            text-decoration: none;
            font-size: 13px;
            transition: color 0.3s;
        }
        
        .forgot-password:hover {
            color: #3367D6;
            text-decoration: underline;
        }
    .vs-login-card button {
      width: 100%;
      padding: 6px 0;
      background: #1a1647;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }

    .vs-login-card button:hover {
      background: #2c245e;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 15px 0;
      font-size: 14px;
      color: #777;
    }

    .divider::before,
    .divider::after {
      content: "";
      flex: 1;
      height: 1px;
      background: #ddd;
    }

    .divider span {
      padding: 0 12px;
      color: #999;
    }

    .social-login {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-bottom: 10px;
    }

    .social-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border: 1px solid #eee;
      cursor: pointer;
      transition: all 0.3s;
    }

    .social-btn:hover {
      background: #1a1647;
      color: #fff;
      transform: translateY(-3px);
      box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
    }

    .social-btn i {
      font-size: 18px;
      color: #1a1647;
    }

    .social-btn:hover i {
      color: #fff;
    }

    .vs-login-card p {
      /* margin-top: 10px; */
      font-size: 13px;
      color: #999;
    }

    .copyright {
      /* margin-top: 5px; */
      font-size: 12px;
      color: #999;
    }

    /* Autofill dark theme for input/select */
    input:-webkit-autofill,
    select:-webkit-autofill,
    textarea:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
      -webkit-text-fill-color: #000 !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  </style>
</head>
<body>
  <div class="vs-container-login">
    <div class="overlay-blur"></div>
    <div class="vs-login-card">
      <img src="{{ asset('assets/images/meta/Meta_logo.png') }}" alt="Logo"/>
      <h6>Sign in to MetaEstate</h6>

      <form action="{{ url('/processLogin') }}" method="POST">
        {{ csrf_field() }}
         @if(!empty($login_error))
           <span class="error_text">{{ $login_error }}</span>
         @endif

        <div class="form-group">
          <i class="fa fa-user input-icon"></i>
          <input type="text" name="login_name" placeholder=" " required>
          <label>Username</label>
        </div>

        <div class="form-group">
          <i class="fa fa-lock input-icon"></i>
          <input type="password" name="password" placeholder=" " required>
          <label>Password</label>
        </div>
        <div class="remember-forgot">
              <div class="remember">
                  <input type="checkbox" id="remember">
                  <label for="remember">Remember me</label>
              </div>
              <a href="#" class="forgot-password">Forgot Password?</a>
          </div>
        <button type="submit">Log in</button>

        <div class="divider"><span>Or continue with</span></div>
            <div class="social-login">
                <div class="social-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                </div>
                
                <div class="social-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"/>
                        <path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"/>
                    </svg>
                </div>
                
                <div class="social-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                        <path fill="#03A9F4" d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"/>
                    </svg>
                </div>
            </div>
            
            <!-- <div class="signup-section">
                <p>Don't have an account? <a href="#" class="signup-link">Sign Up</a></p>
            </div>
         -->
      </form>

      <small style="font-size:12px;color: #999;">Meta Estate Project</small>
      <p class="copyright p-0">Copyright &copy; 2025 MetaEstate. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
