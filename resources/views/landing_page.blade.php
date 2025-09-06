<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- <link rel="icon" type="image/png" href="background-image.png" /> -->
  <link type="images/png" sizes="32x32" rel="icon" href="{{ asset('assets/images/meta/Meta_logo.png') }}"/>

  <title>Meta Estate - LANDING</title>
  <script>
    function checkDevice() {
      if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !window.MSStream && !navigator.userAgent.match(/iPad/i)) {
        document.body.innerHTML = `<h2 style="display:block;text-align:center;padding:15px;">Sorry, this system is not available on mobile devices</h2>`;
        if (typeof window.stop === 'function') {
          window.stop();
        } else if (typeof document.execCommand === 'function') {
          document.execCommand('Stop', false);
        }
      }
    }
  </script>
  <?php StyleManager::render('prm-landing-styles', 1); ?>



</head>

<body id="body" onload="checkDevice()">
  <?php
    $user = XAuthService::user();
    if (!$user) return;

    $apps = $user->apps->filter(fn($a) => !$a->is_mobile_app)->values();
    $total = $apps->count();
  ?>
  <div class="background-layer"></div>
<div class="app-landing">
  <div class="app-wrapper" id="app-wrapper">
    <div class="app-logo">
      <img src="assets/images/meta/Meta_logo.png" alt="Meta Tower Logo">
    </div>

    <div class="app-list" >
      <?php
      if ($total <= 3) {
          foreach ($apps as $app) {
              echo '<div class="app-col full">
                      <div class="app-card">
                          <a href="' . $app->home_route . '" class="app-link">
                              <div class="app-info">
                                  <img src="' . url('/assets/images/meta/' . ($app->icon_file_name ?? 'Meta_logo.png')) . '" class="app-icon" />
                                  <div class="app-meta">
                                      <h4 class="app-name">' . $app->app_name . '</h4>
                                      <span class="app-rating">
                                          <i class="fa fa-star"></i><i class="fa fa-star"></i>
                                          <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
                                      </span>
                                  </div>
                              </div>
                          </a>
                          <div class="app-version">
                              <h6>Version : <span>1.5.1</span></h6>
                          </div>
                      </div>
                    </div>';
          }
      } else {
          $index = 0;
          foreach ($apps as $app) {
              if ($index % 2 == 0) echo '<div class="row">';
              echo '<div class="app-col half">
                      <div class="app-card">
                          <a href="' . $app->home_route . '" class="app-link">
                              <div class="app-info">
                                  <img src="' . url('/assets/images/logo/' . ($app->icon_file_name ?? 'M-iis-logo.png')) . '" class="app-icon" />
                                  <div class="app-meta">
                                      <h4 class="app-name">' . $app->app_name . '</h4>
                                      <span class="app-rating">
                                          <i class="fa fa-star"></i><i class="fa fa-star"></i>
                                          <i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i>
                                      </span>
                                  </div>
                              </div>
                          </a>
                          <div class="app-version red">
                              <h6>Version : <span>1.5.1</span></h6>
                          </div>
                      </div>
                    </div>';
              $index++;
              if ($index % 2 == 0) echo '</div>';
          }
          if ($index % 2 != 0) echo '</div>';
      }
      ?>
    </div>

    <div class="app-footer">
      <span>Advanced Business Solutions</span>
      <span>Powered by Vectorasoft</span>
    </div>
  </div>
</div>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    const box = document.getElementById("app-wrapper");
    const appCount = <?php echo $total; ?>;
    if (appCount <= 3) {
      box.style.width = "30%";
    } else {
      box.style.width = "60%";
    }
  });
</script>




</body>

</html>