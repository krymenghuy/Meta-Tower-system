<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" type="image/png" href="{{'assets/images/yavpheng/CYPA_logo.png'}}"/>
        <?php StyleManager::render('login-styles',1); ?>
        <title>Yav Pheng Association</title>
        <script>
            function checkDevice(){
                if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !window.MSStream && !navigator.userAgent.match(/iPad/i)) {
                   document.body.innerHTML =`<h2 style="display:block;text-align:center;padding:15px;">Sorry, this system is not available on mobile devices</h2>`;
                   if (typeof window.stop === 'function') {
                        window.stop();
                        } else if (typeof document.execCommand === 'function') {
                        document.execCommand('Stop', false);
                    }
                }
            }
        </script>
 
    </head>
    <body onload="checkDevice()">
        <div class="vs-container-login">
            <div>
                 <img class="img-background" src="{{asset(('assets/images/bhr/main_page.png'))}}"/>
                <div class="overlay-blur"></div>
            </div>
            <div class="login-frame">
                <div class="vs-container-front-img">
                    <!-- <img class="img-front"  src="{{ asset('assets/images/bhr/cemetery.png') }}"/> -->
                    <div class="vs-login">
                        <div class="vs-form-login">
                            <div class="vs--logo">
                                <img class="w-100" src="{{ asset('assets/images/yavpheng/CYPA_logo.png ') }}"/>
                            </div>
                            <h3 class="vs-title mt-4">Sign in to your account</h3>
                            <div class="vs-form-group">
                            <form action="{{ url('/processLogin') }}" method="POST">

                                <!-- <form action="{{ url('/landing') }}" method="POST"> -->
                                    {{ csrf_field() }}
                                    <div>
                                        <span class="error_text">
                                            <?php if(session()->has('login_error')) echo session('login_error'); ?>
                                        </span>
                                    </div>
                                    <div class="vs-d-flex">
                                        <label for="username" class="vs-form-label">Username</label>
                                        <input type="text" class="vs-form-control" name="login_name" placeholder="Enter username"/>
                                    </div>
                                    <div class="vs-d-flex">
                                        <label for="username" class="vs-form-label">Password</label>
                                        <input type="password" class="vs-form-control" name="password" placeholder="Enter password"/>
                                    </div>
                                    <div class="vs-d-flex-btn">
                                        <button class="btn-login" type="submit">LOGIN</button>
                                        <br>
                                        
                                        <!-- <p style="text-align:center; font-size:16px;">
                                            Don't you have an account?
                                            <a href="/register" style="color: #007bff; text-decoration: none;">Sign up</a>
                                        </p> -->

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
















