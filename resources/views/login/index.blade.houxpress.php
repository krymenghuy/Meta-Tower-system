<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" type="image/png" href="background-image.png"/>
        <title>DELIVERY HOUEXPRESS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
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
        <style type="text/css">
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
                background: #f69a9e;
                background-image: linear-gradient(180deg, rgb(240 233 233 / 0%) 0%, rgb(254 250 251) 100%);
            }
            /* .vs-container-login{
                width:100%;
                height:100%;
                position: absolute;
                overflow:hidden;
            } */

            .vs-container-login .img-background{
                width:100vw;
                height:100vh;
                position:absolute;
                background-size: cover;
                background-repeat: no-repeat;
                overflow: hidden;
                /* filter:blur(2px); */
            }

            .login-frame{
                width:100vw;
                height:100vh;
                position: absolute;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .login-frame .img-background{
                width:80vw;
                height:100vh;
                position:absolute;
                background-size: cover;
                background-repeat: no-repeat;
                overflow: hidden;
                /* filter:blur(2px); */
            }

            .login-frame .vs-container-front-img{
                width:80vw;
                height:80vh;
                /* background-color:#00001010; */
                /* background-image: url({{ asset('assets/images/logo/houxepress2.png') }}); */
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
                /* padding: 40px 50px 20px; */
                font-size:25px;
                color:#EC1D27;
                /* margin-bottom:3vh; */
                /* color:#fff; */
            }
  
            .vs-login .vs-form-group .vs-d-flex{
                width:100%;
                display:flex;
                flex-direction: column;
            }

            .vs-login .vs-form-group .vs-d-flex .vs-form-label{
                /* color:#fff; */
                font-size:18px;
                padding:25px 10px  10px;
            }

            .vs-login .vs-form-group .vs-d-flex .vs-form-control{
                width: 100%;
                height: 40px;
                border-radius: 10px;
                border: none;
                outline: none;
                padding: 5px 15px;
                font-size: 14px;
                background: #FFFFFF;
                box-shadow: 0 0 5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.1) inset;

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
                align-items: center;
            }

            .vs-login .vs-form-group .vs-d-flex-btn .btn-login{
                min-width: 65%;
                min-height: 40px;
                border-radius: 50px;
                border: 2px solid #DD4032;
                background-color: #DD4032;
                font-size: 14px;
                color: #fff;
                cursor: pointer;
                 
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
                height:100%;
                width:80%;
                border-radius:40px;
                background-color:#FFFC;
                display:flex;
                flex-direction: column;
                align-items:center;
                justify-content:center;
                flex-wrap: wrap;
                overflow: hidden;
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
            .vs-form-login .logo {display: none;}
            @media screen and (max-width:1025px){
                .vs-login .vs-form-group{ padding: 0 25px 20px; }
                .vs-login .vs-form-group .vs-d-flex .vs-form-label{ padding: 20px 0px 10px;}
                .vs-login .vs-form-login{ border-radius: 30px;}
                .vs-login .vs-title{ padding: 30px 25px 10px;}
                .login-frame .vs-container-front-img { width: 85vw;}
                .login-frame .img-background{ width: 85vw;}
            }
            @media screen and (max-width:820px){
                .login-frame .vs-container-front-img{ width:100vw;}
                .vs-login .vs-form-group{ padding: 0 20px 20px; }
            }
            @media screen and (max-width:769px){
                .login-frame .vs-container-front-img { width: 100vw;}
                .login-frame .img-background{ width: 95vw;}
            }
            @media screen and (max-width:601px){
                .login-frame .vs-container-front-img .img-front{display: none;}
                .vs-login .vs-form-login{ width: 100%; background-color:#fff;}
                .vs-login .vs-form-group .vs-d-flex .vs-form-control{background: #fef6f7;}
                .vs-form-login .logo {width: 100px;}
                .vs-login .vs-title{ padding: 10px 20px 0;}
                .vs-login .vs-form-group .vs-d-flex .vs-form-label{ padding: 10px 0px 10px;}
                .login-frame .vs-container-front-img .vs-login{width: 60%;}
                .vs-form-login .logo {display: flex;}
                .vs-login .vs-form-group .vs-d-flex-btn .btn-login{ margin: 10% 0;}
            }
            @media screen and (max-width:601px){
                .login-frame .vs-container-front-img .vs-login{width: 80%;}
                .vs-form-login .logo {display: flex;}

            }
           

            /* @media screen and (min-width:821px) and (max-width:1500px){
                .login-frame .vs-container-front-img{
                    width:84vw;
                }
            } */
        </style>
    </head>
    <body 'onload="checkDevice()"'>
        <div class="vs-container-login shadow-lg">
            <div>
                <!-- <img class="img-background" src="{{ asset('assets/images/logo/houxepress4.svg') }}"/> -->
                <div class="overlay-blur"></div>
            </div>
            
            <div class="login-frame">
                <img class="img-background rounded-2" src="{{ asset('assets/images/logo/houxepress2.png') }}"/>
                <div class="vs-container-front-img">
                    <div class="img-front"></div>
                    <!-- <img class="img-front" src="{{ asset('assets/images/logo/login_2.png') }}"/> -->
                    <div class="vs-login">
                        <div class="vs-form-login w-100">
                            <div class="d-lg-none m-2 d-flex justify-content-center">
                                <img class="logo" src="{{ asset('assets/images/logo/houexpress1.png') }}"/>
                            </div>
                          
                            <div class="vs-form-group d-flex flex-column justify-content-center align-items-center w-100 p-4">
                                <h1 class="vs-title text-center p-2">DOMESTIC DELIVERY SERVICES</h1>
                                <form class="w-100" action="{{ url('/processLogin') }}" method="POST">
                                    {{ csrf_field() }}
                                    <div class="w-100 d-flex flex-wrap p-1 justify-content-center">
                                        <span class="text-danger text-center">
                                           <?php if(session()->has('login_error')) echo session('login_error'); ?>
                                        </span>
                                    </div>
                                    <div class="vs-d-flex">
                                        <label for="username" class="vs-form-label">Username</label>
                                        <input type="text" class="vs-form-control" name="login_name" placeholder=""/>
                                    </div>
                                    <div class="vs-d-flex">
                                        <label for="username" class="vs-form-label">Password</label>
                                        <input type="password" class="vs-form-control" name="password" placeholder=""/>
                                    </div>
                                    <div class="vs-d-flex-btn">
                                        <button class="btn-login" type="submit">LOGIN</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <!-- <div class="vs-d-flex-copyright">
                            <p>Vectorasoft Co.,LTD.</p>
                            <p>Copyright &copy 2023. All rights reserved</p>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>