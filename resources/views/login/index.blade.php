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
        <link rel="stylesheet" type="text/css" href="{{asset('assets/css/login/login-style.css')}}"/>
        <link rel="stylesheet" type="text/css" href="{{asset('assets/css/font-awesome/6.2.0/css/all.min.css')}}"/>
        <title>M-Clinic</title>
       
    </head>
    <body>
        <div class="container">
            <div class="background-image"></div>
            <div class="form">
            <span style="color:yellow;font-size:1em"><?php if(session()->has('login_error')) echo session('login_error');?></span>
                <form autocomplete="false" action="{{ url('/processLogin') }}" method="POST">
                    {{@csrf_field()}}
                    <div>
                        <input type="email" name="login_name" placeholder="User name"/>
                        <i class="fa-regular fa-circle-check" style="font-size:1.7em"></i>
                    </div>
                    <div>
                        <input type="password" name="password" placeholder="Password" autocomplete="nope" value=""/>
                        <i class="fa-regular fa-circle-check" style="font-size:1.7em"></i>
                    </div>
                    <button type="submit">LOGIN</button>
                </form>
            </div>
            <div class="front-image"></div>
            <div class="overlay-front"></div>
            <div class="logo">
                <img src="{{asset('assets/css/login/logo.png')}}"/>
            </div>
        </div>
    
    </body>
</html>