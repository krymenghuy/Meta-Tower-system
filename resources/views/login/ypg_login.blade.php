<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="icon" type="image/png" href="{{'assets/images/yavpheng/CYPA_logo.png'}}"/>
  <?php StyleManager::render('login-styles',1); ?>
  <title>Yeav Pheng Association</title>
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
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    .vs-container-login {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: radial-gradient(circle at center, #1d3b40, #183439);
      position: relative;
      overflow: hidden;
    }

    .img-background {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    .overlay-blur {
      position: absolute;
      width: 100%;
      height: 100%;
      background: #234245;
      backdrop-filter: blur(5px);
      z-index: 0;
    }

    .vs-login-card {
      background: #fff;
      padding: 40px 30px;
      border-radius: 15px;
      max-width: 350px;
      width: 90%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      z-index: 1;
    }

    .vs-login-card img {
      width: 80px;
      margin-bottom: 20px;
    }

    .vs-login-card h4 {
      margin-bottom: 20px;
      font-weight: 400;
    }

    .vs-login-card input {
      display: block;
      width: 100%;
      padding: 12px 10px;
      margin: 10px 0;
      border: none;
      border-bottom: 1px solid #ccc;
      outline: none;
      font-size: 14px;
    }

    .vs-login-card button {
      width: 100%;
      padding: 12px 0;
      background: #234245;
      color: #fff;
      border: none;
      border-radius: 6px;
      margin-top: 20px;
      cursor: pointer;
      font-weight: bold;
    }

    .vs-login-card .vs-links {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      font-size: 12px;
    }

    .vs-login-card .vs-links a {
      text-decoration: none;
      color: #234245;
    }

    .vs-login-card p {
      margin-top: 20px;
      font-size: 12px;
      color: #555;
    }
  </style>
</head>
<body onload="checkDevice()">
  <div class="vs-container-login">
    <img class="img-background" src="{{asset(('assets/images/bhr/main_page.png'))}}"/>
    <div class="overlay-blur"></div>

    <div class="vs-login-card">
      <img src="{{ asset('assets/images/yavpheng/CYPA_logo.png') }}" alt="Logo"/>
      <h4>Sign in to your account</h4>
      <form action="{{ url('/processLogin') }}" method="POST">
        {{ csrf_field() }}
        <span class="error_text">
          <?php if(session()->has('login_error')) echo session('login_error'); ?>
        </span>
        <input type="text" name="login_name" placeholder="Username" value="Admin" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Log in</button>
        
      </form>
      <p>China Yeav Pheng Association</p>
      <p>Copyright &copy; 2021</p>
    </div>
  </div>
</body>
</html>
