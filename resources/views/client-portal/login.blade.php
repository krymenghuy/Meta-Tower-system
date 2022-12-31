<?php  unset($_COOKIE['vectoramicroloans_session']);
unset($_COOKIE['lms5378_3508zd']); 
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Koulen&display=swap" rel="stylesheet">
    <link href="{{ asset('assets/borrower-css/login-style.css') }}" rel="stylesheet"
        type="text/css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</head>

<body>
    <div class="container-fluid d-flex bg-login">
        <div class="login-panel">
            <div class="login-logo">
                <img src="{{ asset('assets/borrower-css/logo.png') }}" alt="">
            </div>


            <form action="{{ url('/processLogin') }}" method="POST">
                {{ csrf_field() }}
                <div class="px-4 py-4">
                    <h2 class="titleLogin">Login</h2>
                    <label for="" class="labelText">Email</label>
                    <input type="text" name="login_name" class="form-control mb-3">

                    <label for="" class="labelText">Password</label>
                    <input name="password" type="password" class="form-control">

                    <div class="mt-2 forgotPassword">
                        <a href="#">Forgot password?</a>
                    </div>

                </div>

                <div class="px-4 py-4">
                    <button type="submit" class="btn btn-primary btnLogin">Login</button>
                </div>
                <div class="panelRegister">
                    <a href="#" class="btnRegister">Don't have account?</a>
                </div>




            </form>

        </div>

    </div>
</body>

</html>
