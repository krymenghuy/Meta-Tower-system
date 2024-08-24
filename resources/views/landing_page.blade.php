<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- <link rel="icon" type="image/png" href="background-image.png" /> -->
  <link type="images/png" sizes="32x32" rel="icon" href="{{ asset('assets/images/logo/jto2.jpg') }}"/>

  <title>LANDING PAGE</title>
  <script>
    function checkDevice() {
      if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !window.MSStream && !navigator.userAgent.match(/iPad/i)) {
        //alert("Sorry, this system is not available on mobile devices.");
        document.body.innerHTML = `<h2 style="display:block;text-align:center;padding:15px;">Sorry, this system is not available on mobile devices</h2>`;
        if (typeof window.stop === 'function') {
          window.stop();
        } else if (typeof document.execCommand === 'function') {
          document.execCommand('Stop', false);
        }
      }
      //return true;
    }
  </script>
  <?php StyleManager::render('landing-styles', 1); ?>



</head>

<body id="body" onload="checkDevice()">
  <div class="box-center  d-flex justify-content-center align-items-center">
      <div class="container p-1  rounded-5">
        <div class="logo_">
          <img src="assets/images/logo/log_jto.png">
        </div>
        <div class="row m-3">

           <?php
             $user = \App\Services\Umt\AuthService::user();
             if(!$user) return ; //todo: redirect to login page
             $apps = $user->apps;
             foreach($apps as $app){
              if(!$app->is_mobile_app){
                echo '<div class="col-sm-12 mt-3">
                          <div class="card p-1 border shadow rounded-4">
                            <div class="d-flex flex-row">
                              <img src="'.url('/assets/images/icons/'. ($app->icon_file_name?? 'package.png') ) . '"width="70"/>
                              <div class="d-flex  flex-column ml-2">
                                <a href="'.$app->home_route.'" class="link text-primary" style="text-decoration:none"> <h4 class=" p-1 ms-2  link-view-app">'.$app->app_name.'</h4></a>
                                <span class="ratings ms-2 p-1"><i class="fa fa-star"></i><i class="fa fa-star"></i><i
                                    class="fa fa-star"></i></span>
                              </div>
                            </div>
                              <div class="d-flex justify-content-between install mt-1">
                                <span class="text-primary link-view-app">&nbsp;</span>
                                <h6 style="font-size:15px;" class="text-secondary text-capitalize mx-4">Version : <span class="text-muted">1.5.1</span></h6>
                              </div>
                            </div>
                     </div>';
              }
              
             }  
           ?>
            <!-- <div class="col-sm-12 mt-3">
                <div class="card p-3 border shadow rounded-4">
                  <div class="d-flex flex-row ">
                    <img src="{{asset('assets/images/logo/logo.png')}}" width="70" />
                    <div class="d-flex  flex-column ml-2">
                      <h4 class="text-primary link-view-app">Delivery Management</h4>
                      <span class="ratings"><i class="fa fa-star"></i><i class="fa fa-star"></i><i
                          class="fa fa-star"></i></span>
                    </div>
                  </div>
                    <div class="d-flex justify-content-between install mt-3">
                      <span class="text-primary link-view-app">View&nbsp;<i class="fa fa-angle-right"></i></span>
                      <h6 style="font-size:15px;" class="text-primary text-capitalize">Last login : <span class="text-muted" >01-03-2024</span></h6>
                    </div>
                </div>
            </div> -->
            <!-- <div class="col-sm-12 mt-3">
                <div class="card p-3 border shadow rounded-4">
                  <div class="d-flex flex-row ">
                    <img src="{{asset('assets/images/logo/logo.png')}}" width="70" />
                    <div class="d-flex  flex-column ml-2">
                      <h4 class="text-primary link-view-app">Airway Bill Management</h4>
                      <span class="ratings"><i class="fa fa-star"></i><i class="fa fa-star"></i><i
                          class="fa fa-star"></i></span>
                    </div>
                  </div>
                    <div class="d-flex justify-content-between install mt-3">
                      <span class="text-primary link-view-app">View&nbsp;<i class="fa fa-angle-right"></i></span>
                      <h6 style="font-size:15px;" class="text-primary text-capitalize">Last login : <span class="text-muted" >01-03-2024</span></h6>
                      
                    </div>
                </div>
            </div> -->
        </div>
        <div class="vs-d-flex-copyright">
            <span class="fs-6">Advanced Business Solutions</span>
            <span class="fs-6">Powered by Vectorasoft</span>
        </div>

      </div>
  </div>

</body>

</html>