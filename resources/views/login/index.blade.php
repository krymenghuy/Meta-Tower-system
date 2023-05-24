<?php  
  unset($_COOKIE['vectorasoft_vsksm_session']);
  unset($_COOKIE['vsksm997878za']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php StyleManager::render('login-styles'); ?>
    <title>M-Clinic</title>
    <style type="text/css">
        *{
            padding:0;
            margin:0;
            box-sizing: border-box;
        }
        
        .vs-container{
            width:100vw;
            height:100vh;
            overflow:hidden;
        }

            .img-background{
                width:100vw;
                height:100vh;
                background-size:cover;
                background-repeat:no-repeat;
                background-position: center;
                position:absolute;
            }

            .vs-contain-imgFront-form{
                width:100vw;
                height:100vh;
                position:absolute;
                display:flex;
                align-items:center;
                justify-content:center;
            }

            .sub-vs-contain-imgFront-form{
                width:70vw;
                height:80vh;
                border-radius:5vh;
                background-color:red;
                display:flex;
            }

            .img-size,
            .form-size{
                width:50%;
                height:100%;
            }

            .form-size{
                display:flex;
                align-items:center;
                justify-content:center;
                background-color:#f6cb1ba3;
                border-radius:5vh 0 0 5vh;
                flex-direction: column;
            }

            .img-front{
                width:100%;
                height:100%;
                border-radius:0 5vh 5vh 0;
                filter:opacity(0.75);
            }

            .vs-form-group,
            .vs-btn-group{
                width:100%;
                padding:1.5vh 0;
            }

            .vs-btn-group{
                display:flex;
                align-items:center;
                justify-content:center;
                flex-direction: column;
            }

            .form-inside{
                width:100%;
                padding:0 6vw;
                height:70%;
            }

            .form-inside form{
                width:100%;
            }

            .vs-form-group .vs-form-label{
                padding:1vh 0;
                color:#fff;
                font-size:2vh;
            }

            .vs-form-group .vs-form-control{
                padding:1.5vh 1.5vw;
                border:none;
                outline:none;
                border-radius:1vh;
                margin:2vh 0;
                font-size:1.5vh;
            }

            ::placeholder{
                padding:0 0.1vw;
            }

            .vs-form-control{
                width:100%;
            }

            .vs-btn-group .vs-btn{
                width:95%;
                padding:0.5vh 0;
                border-radius:3vh;
                outline:none;
                background-color:transparent;
                border:0.3vh solid #fff;
                font-size:2.3vh;
                color:#fff;
                cursor:pointer;
            }

            .vs-logo{
                display:flex;
                justify-content:center;
                width:100%;
                height:30%;
                align-items:end;
            }

            .logo-img{
                position: relative;
                width: 30vw;
                display: flex;
                justify-content:center;
            }

            .logo-img img{
                background-image: cover;
                background-repeat: no-repeat;
                height:15vh;
            }

            @media screen and (max-width:820px){
                .sub-vs-contain-imgFront-form{
                    width:95vw;
                }

                .form-inside p{
                    height:auto;
                }
            }

            @media screen and (min-width:821px) and (max-width:1200px){
                .sub-vs-contain-imgFront-form{
                    width:90vw;
                }
            }
        </style>

    </head>
    <body>
        <div class="vs-container">
            <img class="img-background" src="{{ asset('assets/images/background-image.jpeg') }}"/>
            <div class="vs-contain-imgFront-form">
                <div class="sub-vs-contain-imgFront-form">
                    <div class="form-size">
                        <div class="vs-logo">
                            <div class="logo-img">
                                <img src="{{ asset('assets/images/vectorasoft.png') }}"/>
                            </div>
                        </div>
                        <div class="form-inside">
                            <form autocomplete="false" action="{{ url('/processLogin') }}" method="POST">
                                {{ @csrf_field() }}
                                <span style="color:yellow;font-size:1em">
                                    <?php if(session()->has('login_error')) echo session('login_error');?>
                                </span>
                                <div class="vs-form-group">
                                    <label for="username" class="vs-form-label">User name</label>
                                    <input type="text" name="login_name" placeholder="username" class="vs-form-control"/>
                                </div>
                                <div class="vs-form-group">
                                    <label for="password" class="vs-form-label">Password</label>
                                    <input type="password" name="password" class="vs-form-control" placeholder="password" autocomplete="nope"/>
                                </div>
                                <div class="vs-btn-group">
                                    <button class="vs-btn" type="submit">LOGIN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="img-size">
                        <img class="img-front" src="{{ asset('assets/images/front-image.jpg') }}"/>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>