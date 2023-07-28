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
        <?php StyleManager::render('login-styles',1); ?>
        <title>Kide World School</title>
    </head>
    <body>
        <div class="vs-container">
            <img class="img-background" src="{{ asset('assets/images/logo/background.png') }}" />
            <div class="vs-contain-imgFront-form">
                <div class="sub-vs-contain-imgFront-form">
                    <div class="form-size">
                        <div class="vs-logo">
                            <div class="logo-img">
                                <img src="{{ asset('assets/images/logo/logo.jpg') }}" />
                            </div>
                        </div>
                        <div class="form-inside">
                            <form autocomplete="false" action="{{ url('/processLogin') }}"
                                method="POST">
                                {{ @csrf_field() }}
                                <span style="color:red;font-size:1em">
                                    <?php if(session()->has('login_error')) echo session('login_error');?>
                                </span>
                                <div class="vs-form-group">
                                    <label for="username" class="vs-form-label">User name</label>
                                    <input type="text" name="login_name" placeholder="username" class="vs-form-control" />
                                </div>
                                <div class="vs-form-group">
                                    <label for="password" class="vs-form-label">Password</label>
                                    <input type="password" name="password" class="vs-form-control" placeholder="password"
                                        autocomplete="nope" />
                                </div>
                                <div class="vs-btn-group">
                                    <button class="vs-btn" type="submit">LOGIN</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>