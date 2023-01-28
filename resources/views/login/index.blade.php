<?php  
  unset($_COOKIE['vectorasoft_mclinic_session']);
  unset($_COOKIE['vsmclinic997891zb']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/login/login-style.css') }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/font-awesome/6.2.0/css/all.min.css') }}" />
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
            width:80vw;
            height:80vh;
            border-radius:60px;
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
            border-radius:60px 0 0 60px;
        }

        .img-front{
            width:100%;
            height:100%;
            border-radius:0 60px 60px 0;
            filter:opacity(0.75);
        }

        .vs-form-group,
        .vs-btn-group{
            width:100%;
            padding:10px 0;
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
            display:flex;
            align-items:center;
            justify-content:center;
            flex-direction:column;
        }

        .form-inside form{
            width:100%;
        }

        .form-inside p{
            font-size:30px;
            color:#fff;
            height:12vh;
            font-size: 4em;
        }

        .vs-form-group .vs-form-label{
            padding:20px 0;
            color:#fff;
            font-size:25px;
        }

        .vs-form-group .vs-form-control{
            padding:20px 20px;
            border:none;
            outline:none;
            border-radius:10px;
            margin:20px 0;
            font-size:20px;
        }

        ::placeholder{
            padding:0 20px;
        }

        .vs-form-control{
            width:100%;
        }

        .vs-btn-group .vs-btn{
            width:95%;
            padding:10px 0;
            border-radius:10px;
            outline:none;
            background-color:transparent;
            border:3px solid #fff;
            font-size:30px;
            color:#fff;
            cursor:pointer;
        }

        @media screen and (max-width:820px){
            .sub-vs-contain-imgFront-form{
                width:95vw;
            }

            .form-inside p{
                height:20vh;
            }
        }

        @media screen and (min-width:820px) and (max-width:1200px){
            .sub-vs-contain-imgFront-form{
                width:90vw;
            }

            .form-inside p{
                height:15vh;
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
                        <div class="form-inside">
                            <p>Welcome to Mclinic</p>
                            <form autocomplete="false" action="{{ url('/processLogin') }}" method="POST">
                                {{ @csrf_field() }}
                                <span style="color:yellow;font-size:1em">
                                    <?php if(session()->has('login_error')) echo session('login_error');?>
                                </span>
                                <div class="vs-form-group">
                                    <label for="username" class="vs-form-label">Username</label>
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
                        <img class="img-front" src="{{ asset('assets/images/front-image.webp') }}"/>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>