<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" type="image/png" href="{{ asset('assets/images/yavpheng/CYPA_logo.png') }}"/>
    <?php StyleManager::render('login-styles',1); ?>
    <title>Sign Up - Yav Pheng Association</title>
</head>
<body>
    <div class="vs-container-login">
        <div>
            <img class="img-background" src="{{ asset('assets/images/bhr/main_page.png') }}"/>
            <div class="overlay-blur"></div>
        </div>
        <div class="login-frame">
            <div class="vs-container-front-img">
                <div class="vs-login">
                    <div class="vs-form-login">
                        <div class="vs--logo">
                            <img class="w-100" src="{{ asset('assets/images/yavpheng/CYPA_logo.png') }}"/>
                        </div>
                        <h3 class="vs-title mt-4">Create your account</h3>
                        <div class="vs-form-group">
                            <form action="{{ url('/processSignup') }}" method="POST">
                                {{ csrf_field() }}
                                <div>
                                    <span class="error_text">
                                        <?php if(session()->has('signup_error')) echo session('signup_error'); ?>
                                    </span>
                                </div>
                                <div class="vs-d-flex">
                                    <label for="username" class="vs-form-label">Username</label>
                                    <input type="text" class="vs-form-control" name="username" placeholder="Enter username" required/>
                                </div>
                                <div class="vs-d-flex">
                                    <label for="password" class="vs-form-label">Password</label>
                                    <input type="password" class="vs-form-control" name="password" placeholder="Enter password" required/>
                                </div>
                                <div class="vs-d-flex">
                                    <label for="confirm_password" class="vs-form-label">Confirm Password</label>
                                    <input type="password" class="vs-form-control" name="confirm_password" placeholder="Confirm password" required/>
                                </div>
                                <div class="vs-d-flex-btn">
                                    <button class="btn-login" type="submit">SIGN UP</button>
                                </div>
                                <div class="vs-d-flex-btn" style="margin-top: 10px;">
                                    <p style="text-align:center; width:100%;">
                                        Already have an account?
                                        <a href="{{ url('/login') }}" style="color:#007bff; text-decoration:none;">Log in</a>
                                    </p>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                    
                    <div class="vs-d-flex-copyright">
                        <p>China Yav Pheng Association</p>
                        <p>Copyright &copy; 2021</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</body>
</html>
