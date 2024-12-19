<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" type="image/png" href="{{'assets/images/logo/lc_logo.svg'}}"/>
        <?php StyleManager::render('login-styles',1); ?>
        <title>BHR System</title>
        <script>
            function checkDevice(){
                if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !window.MSStream && !navigator.userAgent.match(/iPad/i)) {
                   //alert("Sorry, this system is not available on mobile devices.");
                   document.body.innerHTML =`<h2 style="display:block;text-align:center;padding:15px;">Sorry, this system is not available on mobile devices</h2>`;
                   if (typeof window.stop === 'function') {
                        window.stop();
                        } else if (typeof document.execCommand === 'function') {
                        document.execCommand('Stop', false);
                    }
                }
                //return true;
            }
        </script>
        <!-- <style type="text/css">
            *{
                padding:0;
                margin:0;
                box-sizing:border-box;
            }

            .vs-container-login{
                width:100vw;
                height:100vh;
                position: absolute;
                overflow:hidden;
            }

            .vs-container-login .img-background{
                width:100vw;
                height:100vh;
                position:absolute;
                background-size: cover;
                background-repeat: no-repeat;
                overflow: hidden;
                filter:blur(2px);
            }

            .login-frame{
                width:100vw;
                height:100vh;
                position: absolute;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .login-frame .vs-container-front-img{
                width:70vw;
                height:80vh;
                background-color:#FFFF;
                display:flex;
                align-items:center;
                justify-content:center;
                border-radius:10px;
                position: absolute;
            }

            .login-frame .vs-container-front-img .img-front{
                height:100%;
                width:50%;
                border-radius:60px 0 0 60px;
                padding: 50px;
            }

            .login-frame .vs-container-front-img .vs-login{
                height:100%;
                width:50%;
                border-radius:0 60px 60px 0;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction:column;
            }
            .vs-login .vs-title{
                font-size:50px;
                /* margin-bottom:3vh; */
                /* color:#fff; */
            }

            .vs-login .vs-form-group{
                width:80%;
            }

            .vs-login .vs-form-group .vs-d-flex{
                width:100%;
                display:flex;
                flex-direction: column;
            }

            .vs-login .vs-form-group .vs-d-flex .vs-form-label{
                /* color:#fff; */
                font-size:20px;
                padding:25px 10px  10px;
            }

            .vs-login .vs-form-group .vs-d-flex .vs-form-control{
                width:100%;
                height:50px;
                border-radius:60px;
                border:none;
                outline:none;
                padding:5px 15px;
                font-size:16px;
                background: #F4F4F4;
            }

            ::placeholder{
                font-size:18px;
                padding:5px 10px;
            }

            .vs-login .vs-form-group .vs-d-flex-btn{
                padding:10px;
                width:100%;
                margin-top:20px;
                display:flex;
                justify-content:center;
            }

            .vs-login .vs-form-group .vs-d-flex-btn .btn-login{
                width:80%;
                height:50px;
                border-radius:10px;
                border:2px solid #8DC63F;
                background-color:#8DC63F;
                font-size:20px;
                color:#fff;
                cursor:pointer;
            }

            .vs-login .vs-d-flex-copyright{
                width:100%;
                /* display:none; */
                display:flex;
                height:20%;
                align-items:center;
                justify-content:center;
                flex-direction: column;
                /* color:#fff; */
                font-size:18px;
            }

            .vs-login .vs-form-login{
                height:80%;
                width:100%;
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction: column;
            }

            .vs-container-front-img .vs-d-flex-copyright p{
                padding:10px 0;
            }

            .error_text{
                color:#ff0000;
                font-size:18px;
            }

            .overlay-blur{
                width:100vw;
                height:100vh;
                position: absolute;
                /* background-color: #00000073; */
            }

            @media screen and (max-width:820px){
                .login-frame .vs-container-front-img{
                    width:96vw;
                }
            }

            /* @media screen and (min-width:821px) and (max-width:1500px){
                .login-frame .vs-container-front-img{
                    width:84vw;
                }
            } */
        </style> -->
    </head>
    <body onload="checkDevice()">
        <div class="vs-container-login">
            <div>
                <img class="img-background" src=""/>
                <div class="overlay-blur"></div>
            </div>
            <div class="login-frame">
                <div class="vs-container-front-img">
                    <img class="img-front"  src="{{ asset('assets/images/bhr/new_staff.jpg') }}"/>
                    <div class="vs-login">
                        <div class="vs-form-login">
                            <div class="vs--logo">
                                <img class="w-100" src="{{ asset('assets/images/logo/lc_logo.svg') }}"/>
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
                                        <input type="text" class="vs-form-control" name="login_name" placeholder="Please enter username"/>
                                    </div>
                                    <div class="vs-d-flex">
                                        <label for="username" class="vs-form-label">Password</label>
                                        <input type="password" class="vs-form-control" name="password" placeholder="Pleace enter password"/>
                                    </div>
                                    <div class="vs-d-flex-btn">
                                        <button class="btn-login" type="submit">LOGIN</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div class="vs-d-flex-copyright">
                            <p>Vectorasoft Co.,LTD.</p>
                            <p>Copyright &copy 2023. All rights reserved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
