<?php if(!Session::get('login_name')) return response()->view('/'); ?>
<!DOCTYPE html>
<html lang="en">

  <!-- begin::Head -->
  <head>
    <!--begin::Base Path (base relative path for assets of this page) -->
    <base href="../">

    <!--end::Base Path -->
    <meta charset="utf-8" />
    <title>Vectora Microloans</title>
    <link type="images/png" rel="icon"  href="{{ asset('css/images/logo/logo.png') }}">
    <meta name="description" content="Updates and statistics">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Prevent error 419 when we use ajax -->
    <meta name="csrf-token" content="{{csrf_token()}}" />
    <meta name="sess_branch_id" content="{{sess_company_id()}}"/>
    <meta name="sess_user_id" content="{{sess_user_id()}}"/>

    <!--begin::Fonts -->
        <script>
                WebFontConfig = {
                    google: {
                        families: ['Roboto:300,400,700']
                    }
                };
            
                (function(d) {
                    var wf = d.createElement('script'), s = d.scripts[0];
                    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
                    wf.async = true;
                    s.parentNode.insertBefore(wf, s);
                })(document);
            </script>
    <!--end::Fonts -->

    

    <!--begin::Page Vendors Styles(used by this page) -->
    <link href="{{ asset('assets/vendors/custom/datatables/datatables.bundle.css') }}" rel="stylesheet" type="text/css" />
    <!--end::Page Vendors Styles -->

    <!--begin::Page Vendors Styles(used by this page) -->
    <!-- <link href="{{ asset('assets/vendors/custom/fullcalendar/fullcalendar.bundle.css') }}" rel="stylesheet" type="text/css" /> -->

    <!--end::Page Vendors Styles -->

    <!--begin:: Global Mandatory Vendors -->
    <link href="{{ asset('assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css') }}" rel="stylesheet" type="text/css" />

    <!--end:: Global Mandatory Vendors -->

    <link href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet">


    <!--begin:: Global Optional Vendors -->
    <link href="{{ asset('assets/vendors/general/tether/dist/css/tether.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/vendors/general/bootstrap-timepicker/css/bootstrap-timepicker.css') }}" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="{{ asset('assets/vendors/general/bootstrap-daterangepicker/daterangepicker.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/vendors/general/bootstrap-select/dist/css/bootstrap-select.css') }}" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="{{ asset('assets/vendors/general/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/bootstrap-notifications.min.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="//rawgithub.com/indrimuska/jquery-editable-select/master/dist/jquery-editable-select.min.css" rel="stylesheet"> -->
    <!-- <link href="{{ asset('assets/vendors/general/ion-rangeslider/css/ion.rangeSlider.css') }}" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="{{ asset('assets/vendors/general/nouislider/distribute/nouislider.css') }}" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="{{ asset('assets/vendors/general/owl.carousel/dist/assets/owl.carousel.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/dropzone/dist/dropzone.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/vendors/general/summernote/dist/summernote.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/animate.css/animate.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/toastr/build/toastr.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/general/morris.js/morris.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/vendors/general/sweetalert2/dist/sweetalert2.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/vendors/general/socicon/css/socicon.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/custom/vendors/line-awesome/css/line-awesome.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/custom/vendors/flaticon/flaticon.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/vendors/custom/vendors/flaticon2/flaticon.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/font-awesome/5.15.4/css/all.min.css') }}" rel="stylesheet" type="text/css" />

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Styles(used by all pages) -->
    <link href="{{ asset('assets/css/demo1/style.bundle.css') }}" rel="stylesheet" type="text/css" />
    <!--end::Global Theme Styles -->

    <!--begin::Layout Skins(used by all pages) -->
    <link href="{{ asset('assets/css/demo1/skins/header/base/light.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/demo1/skins/header/menu/light.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/css/demo1/skins/brand/dark.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/css/demo1/skins/aside/dark.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/loader.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/jquery.datepicker2.css') }}" rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/css/autoComplete.min.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/css/vs_multiple_select.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ url('css/app.css') }}" rel="stylesheet" type="text/css" />
 
    <!-- Admin LTE -->
    <link href="{{ asset('assets/css/adminlte.css') }}" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="{{ asset('assets/plugins/chart.js/Chart.css') }}">
    <!-- Ionicons -->
    <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css">
    <!-- ::End AndimLte -->
 
    <!--end::Layout Skins -->
    <!--start:: Custom js  -->
    <script src="{{ asset('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
   
    <!-- AdminLTE dashboard3 -->
    <script defer src="{{ asset('assets/plugins/chart.js/Chart.js') }}"></script> 
    <script defer src="{{ asset('assets/dist/js/pages/dashboard3.js') }}"></script>
    <script defer src="https://code.iconify.design/2/2.0.3/iconify.min.js"></script>
   
     <!-- AdminLte -->
    <!-- End:: AndminLte -->

    <!-- <script defer src="{{ asset('assets/js/autoComplete.min.js') }}" type="text/javascript"></script> -->
    <!--Popper.js version 2 is too high for bootstrap 4.4.1, so this popper is version 1.1~ Popper.js is used for Dropdown positioning, and tooltip-->
    <!-- <script defer src="{{ asset('assets/vendors/general/popper.js/dist/umd/popper.js') }}" type="text/javascript"></script>    -->
     <!--Popper.js verson 2-->
    <script defer src="{{ asset('assets/js/Popper.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/securitycom.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/string_san.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/cv_interact.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/validator.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/tracking_map.js') }}" type="text/javascript"></script>
     
    <script defer src="{{ asset('assets/js/datehelper.js') }}" type="text/javascript"></script>
	  <script defer src="{{ asset('assets/js/date.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/jquery.datepicker2.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/html2canvas.min.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/pdfmake.min.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/vfs_fonts.js') }}" type="text/javascript"></script>
    <!-- <script defer src="{{ asset('assets/js/pdfmake-unicode.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('assets/js/vs_multiple_select.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('js/inputBoxes.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('js/v_control.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('js/FindPersonDialog.js') }}" type="text/javascript"></script>
    <script src="https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js"></script>
    <!-- <script defer src="{{ asset('assets/js/ckeditor/ckeditor.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('js/main.js') }}" ></script> 
 
    <script defer type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js"></script> 
    <!--begin:: Global Mandatory Vendors -->
    <!-- <script defer src="{{ asset('assets/vendors/general/popper.js/dist/umd/popper.js') }}" type="text/javascript"></script>    -->
    <script defer src="{{ asset('assets/vendors/general/js-cookie/src/js.cookie.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/vendors/general/moment/min/moment.min.js') }}" type="text/javascript"></script>
    <!-- <script defer  src="{{ asset('assets/vendors/general/tooltip.js/dist/umd/tooltip.min.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/vendors/general/sticky-js/dist/sticky.min.js') }}" type="text/javascript"></script>
    <!-- <script src="{{ asset('assets/vendors/general/wnumb/wNumb.js') }}" type="text/javascript"></script> -->
    <!--end:: Global Mandatory Vendors -->

    <!-- <script src="//rawgithub.com/indrimuska/jquery-editable-select/master/dist/jquery-editable-select.min.js"></script> -->
    <script defer src="{{ asset('assets/js/select2.min.js') }}" type="text/javascript"></script>
    <!-- <script defer src="{{ asset('assets/vendors/general/owl.carousel/dist/owl.carousel.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('assets/js/demo1/scripts.bundle.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/vendors/custom/datatables/datatables.bundle.js') }}" type="text/javascript"></script>
    <!-- end:: Custom js -->
     
  </head>
  <style type="text/css">
    @media (min-width: 1025px) {
      .kt-header--fixed.kt-subheader--fixed.kt-subheader--enabled .kt-wrapper{
        padding-top: 65px !important;
      }
    }
    .required:after{ 
        content:'*'; 
        color:red; 
        padding-left:5px;
    }
  </style>

  <!-- end::Head -->

  <!-- begin::Body -->
  <body class="kt-quick-panel--right kt-demo-panel--right kt-offcanvas-panel--right kt-header--fixed kt-header-mobile--fixed kt-subheader--enabled kt-subheader--fixed kt-subheader--solid kt-aside--enabled kt-aside--fixed kt-page--loading kt-brand--minimize kt-aside--minimize">
  <div id="_main_hidden_fields">
          <input type="hidden" id="__base_url" value="{{ url('/') }}">
          <input type="hidden" id="__xsp_name" value="_csrf_128757" />
          <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
  </div>
 
  <div id="cover-spin" class="loading_a"></div>
    <!-- begin:: Page -->

    <!-- begin:: Header Mobile -->
      <!-- <div id="kt_header_mobile" class="kt-header-mobile  kt-header-mobile--fixed ">
        <div class="kt-header-mobile__logo">
          <a href="javascript:;">
            <img alt="Logo" src="{{ asset('assets/media/logos/logo-light.png') }}" />
          </a>
        </div>
        <div class="kt-header-mobile__toolbar">
          <button class="kt-header-mobile__toggler kt-header-mobile__toggler--left" id="kt_aside_mobile_toggler"><span></span></button>
          <button class="kt-header-mobile__toggler" id="kt_header_mobile_toggler"><span></span></button>
          <button class="kt-header-mobile__topbar-toggler" id="kt_header_mobile_topbar_toggler"><i class="flaticon-more"></i></button>
        </div>
      </div> -->
    <!-- end:: Header Mobile -->
    <div class="kt-grid kt-grid--hor kt-grid--root">
      <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">

        <!-- begin:: Aside -->
        <button class="kt-aside-close " id="kt_aside_close_btn"><i class="la la-close"></i></button>
        <div class="kt-aside  kt-aside--fixed  kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop" id="kt_aside">

          <!-- begin:: Aside -->
          <div class="kt-aside__brand kt-grid__item " id="kt_aside_brand">
            <div class="kt-aside__brand-logo">
              <span id="_dms_brand_label">{{session('login_name')}}</span>
              <!-- <a href="javascript:;">
                {{-- <img alt="Logo" src="{{ asset('css/images/logo/logo.png') }}" /> --}}
              </a> -->
            </div>
            <div class="kt-aside__brand-tools">
              <button class="kt-aside__brand-aside-toggler" id="kt_aside_toggler" style="padding;10px;font-size:1.3em !important">
                <span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                      <path d="M5.29288961,6.70710318 C4.90236532,6.31657888 4.90236532,5.68341391 5.29288961,5.29288961 C5.68341391,4.90236532 6.31657888,4.90236532 6.70710318,5.29288961 L12.7071032,11.2928896 C13.0856821,11.6714686 13.0989277,12.281055 12.7371505,12.675721 L7.23715054,18.675721 C6.86395813,19.08284 6.23139076,19.1103429 5.82427177,18.7371505 C5.41715278,18.3639581 5.38964985,17.7313908 5.76284226,17.3242718 L10.6158586,12.0300721 L5.29288961,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero" transform="translate(8.999997, 11.999999) scale(-1, 1) translate(-8.999997, -11.999999) " />
                      <path d="M10.7071009,15.7071068 C10.3165766,16.0976311 9.68341162,16.0976311 9.29288733,15.7071068 C8.90236304,15.3165825 8.90236304,14.6834175 9.29288733,14.2928932 L15.2928873,8.29289322 C15.6714663,7.91431428 16.2810527,7.90106866 16.6757187,8.26284586 L22.6757187,13.7628459 C23.0828377,14.1360383 23.1103407,14.7686056 22.7371482,15.1757246 C22.3639558,15.5828436 21.7313885,15.6103465 21.3242695,15.2371541 L16.0300699,10.3841378 L10.7071009,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(15.999997, 11.999999) scale(-1, 1) rotate(-270.000000) translate(-15.999997, -11.999999) " />
                    </g>
                  </svg></span>
                <span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1" class="kt-svg-icon">
                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                      <polygon id="Shape" points="0 0 24 0 24 24 0 24" />
                      <path d="M12.2928955,6.70710318 C11.9023712,6.31657888 11.9023712,5.68341391 12.2928955,5.29288961 C12.6834198,4.90236532 13.3165848,4.90236532 13.7071091,5.29288961 L19.7071091,11.2928896 C20.085688,11.6714686 20.0989336,12.281055 19.7371564,12.675721 L14.2371564,18.675721 C13.863964,19.08284 13.2313966,19.1103429 12.8242777,18.7371505 C12.4171587,18.3639581 12.3896557,17.7313908 12.7628481,17.3242718 L17.6158645,12.0300721 L12.2928955,6.70710318 Z" id="Path-94" fill="#000000" fill-rule="nonzero" />
                      <path d="M3.70710678,15.7071068 C3.31658249,16.0976311 2.68341751,16.0976311 2.29289322,15.7071068 C1.90236893,15.3165825 1.90236893,14.6834175 2.29289322,14.2928932 L8.29289322,8.29289322 C8.67147216,7.91431428 9.28105859,7.90106866 9.67572463,8.26284586 L15.6757246,13.7628459 C16.0828436,14.1360383 16.1103465,14.7686056 15.7371541,15.1757246 C15.3639617,15.5828436 14.7313944,15.6103465 14.3242754,15.2371541 L9.03007575,10.3841378 L3.70710678,15.7071068 Z" id="Path-94" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(9.000003, 11.999999) rotate(-270.000000) translate(-9.000003, -11.999999) " />
                    </g>
                  </svg></span>
              </button>

                      <!--
                     <button class="kt-aside__brand-aside-toggler kt-aside__brand-aside-toggler--left" id="kt_aside_toggler"><span></span></button>
                    -->
            </div>
          </div>

          <!-- end:: Aside -->

          <!-- begin:: Aside Menu -->
          @include('menus.menu')

          
          <!-- end:: Aside Menu -->
        </div>
        <!-- end:: Aside -->
  <div class="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
   

          <!-- begin:: Header -->
          
          <div id="kt_header" class="kt-header kt-grid__item  kt-header--fixed"> 
                   
            <!-- begin:: Header Menu-->
            <div class="kt-header-menu-wrapper" id="kt_header_menu_wrapper" style="padding:10px">
               <div style="width:100%">
                <div class="form-inline" style="float:left">
                      <div class="screen-info">
                          <div><i class="screen-icon" id="screen_icon"></i></div>
                          <div style="width:15px"></div>
                          <div><span class="screen-title" id="screen_title"></span></div>   
                      </div> 
                  </div> 
                    
              </div>
                  
            </div>
            <!-- end:: Header Menu -->
          </div>
          <!-- end:: Header -->

  <!-- Begin::Container -->
   <div id="_p2" class="kt-content kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor" id="kt_content" style="margin-top:-50px;">
        <div id="_p1" class="row" style="background-color:red">
            <div class="col-lg-12" id="_app_content" style="background-color:#fff;">
               <!-- if put "layouts.tripListComponent" at bottom  => then there is error in pages -->
               @include('layouts.inputBoxes')
               @include('layouts.dashboardComponent')
               @include('layouts.waitinglistComponent')
               @include('layouts.approveListComponent')
               @include('layouts.borrowersComponent')
               @include('layouts.guarantorsComponent')
               @include('layouts.loanComponent')
               @include('layouts.repaymentsComponent')
               @include('layouts.promsoryNotesComponent')
               @include('layouts.nonPerformingLoansComponent')
            </div><!--end:: div#_app_content-->
        </div>
   </div>
       
</div>
</div><!-- added to fix --> 
<!-- End::Container -->
  
          <!-- begin:: Footer -->
 
          <div class="kt-footer  kt-grid__item kt-grid kt-grid--desktop kt-grid--ver-desktop" id="kt_footer">
            <div class="kt-container  kt-container--fluid ">
              <div class="kt-footer__copyright">
                2021&nbsp;&copy;&nbsp;<a href="#" target="_blank" class="kt-link">Dolgoal Co. Ltd.</a>
              </div>
              <!-- <div class="kt-footer__menu">
                <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">About</a>
                <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">Team</a>
                <a href="http://keenthemes.com/metronic" target="_blank" class="kt-footer__menu-link kt-link">Contact</a>
              </div> -->
            </div>
          </div>

          <!-- end:: Footer -->
        </div>
      </div>
    </div>

    <!-- end:: Page -->

    <!-- begin::Scrolltop -->
    <div id="kt_scrolltop" class="kt-scrolltop">
      <i class="fa fa-arrow-up"></i>
    </div>

    <!-- end::Scrolltop -->
     

    <!-- begin::Global Config(global config for global JS scripts) -->
    <script>
      var KTAppOptions = {
        "colors": {
          "state": {
            "brand": "#5d78ff",
              "dark": "#282a3c",
            "light": "#ffffff",
            "primary": "#5867dd",
            "success": "#34bfa3",
            "info": "#36a3f7",
            "warning": "#ffb822",
            "danger": "#fd3995"
          },
          "base": {
            "label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
            "shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
          }
        }
      };
    </script>

    @if(Session::has('flash_message'))
    <script type="text/javascript">
        var KTToastrDemo = function() {
            var demo = function() {
                toastr.options = {
                  "closeButton": true,
                  "debug": false,
                  "newestOnTop": false,
                  "progressBar": true,
                  "positionClass": "toast-top-right",
                  "preventDuplicates": false,
                  "onclick": null,
                  "showDuration": "300",
                  "hideDuration": "1000",
                  "timeOut": "5000",
                  "extendedTimeOut": "1000",
                  "showEasing": "swing",
                  "hideEasing": "linear",
                  "showMethod": "fadeIn",
                  "hideMethod": "fadeOut"
                };

                toastr.success("{{ Session::get('flash_message') }}");   
            }

            return {
                init: function() {
                    demo();
                }
            };
        }();

        jQuery(document).ready(function() {
            KTToastrDemo.init();
        });
      
    </script>
    @endif




    <!-- end::Global Config -->

    <!-- Bootstrap core JavaScript-->
    <!-- Titya set this script for vue.js load -->
    <!-- <script src="{{ mix('js/app.js') }}"></script> -->

    <!--begin:: Global Optional Vendors -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery-form/dist/jquery.form.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/block-ui/jquery.blockUI.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/vendors/custom/js/vendors/bootstrap-datepicker.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-datetime-picker/js/bootstrap-datetimepicker.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/vendors/general/bootstrap-timepicker/js/bootstrap-timepicker.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/bootstrap-timepicker.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-daterangepicker/daterangepicker.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-maxlength/src/bootstrap-maxlength.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/vendors/bootstrap-multiselectsplitter/bootstrap-multiselectsplitter.min.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/vendors/general/bootstrap-select/dist/js/bootstrap-select.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-switch/dist/js/bootstrap-switch.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/bootstrap-switch.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/ion-rangeslider/js/ion.rangeSlider.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/typeahead.js/dist/typeahead.bundle.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/handlebars/dist/handlebars.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/inputmask/dist/jquery.inputmask.bundle.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/inputmask/dist/inputmask/inputmask.date.extensions.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/inputmask/dist/inputmask/inputmask.numeric.extensions.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/nouislider/distribute/nouislider.js') }}" type="text/javascript"></script> -->
      <!-- <script async src="{{ asset('assets/vendors/general/autosize/dist/autosize.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/clipboard/dist/clipboard.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/dropzone/dist/dropzone.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/summernote/dist/summernote.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/markdown/lib/markdown.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-markdown/js/bootstrap-markdown.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/bootstrap-markdown.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/bootstrap-notify/bootstrap-notify.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/bootstrap-notify.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery-validation/dist/jquery.validate.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery-validation/dist/additional-methods.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/jquery-validation.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/toastr/build/toastr.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/raphael/raphael.js') }}" type="text/javascript"></script> -->
    <script src="{{ asset('js/defaultview.js') }}" ></script> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" ></script> 
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAf3okvwfpIsHQjiKvgDKcjp-OK5je_bQw"></script>
     
    <!-- <script src="https://js.pusher.com/7.0/pusher.min.js"></script> -->
    <script src="{{asset('js/app.js')}}"></script>
    <!-- <script async src="{{ asset('assets/vendors/general/morris.js/morris.js') }}" type="text/javascript"></script>
    <script asnyc src="{{ asset('assets/vendors/general/chart.js/dist/Chart.bundle.js') }}" type="text/javascript"></script>> -->
    <!-- <script src="{{ asset('assets/vendors/custom/vendors/bootstrap-session-timeout/dist/bootstrap-session-timeout.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/vendors/jquery-idletimer/idle-timer.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/waypoints/lib/jquery.waypoints.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/counterup/jquery.counterup.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/es6-promise-polyfill/promise.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/sweetalert2/dist/sweetalert2.min.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/custom/js/vendors/sweetalert2.init.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery.repeater/src/lib.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery.repeater/src/jquery.input.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/jquery.repeater/src/repeater.js') }}" type="text/javascript"></script> -->
    <!-- <script src="{{ asset('assets/vendors/general/dompurify/dist/purify.js') }}" type="text/javascript"></script> -->

    <!--end:: Global Optional Vendors -->

    <!--begin::Global Theme Bundle(used by all pages) -->
   

    <!--end::Global Theme Bundle -->

    <!--begin::Page Vendors(used by this page) -->
    <!-- <script src="{{ asset('assets/vendors/custom/fullcalendar/fullcalendar.bundle.js') }}" type="text/javascript"></script> -->
    <!--end::Page Vendors -->

    <!--begin::Page Scripts(used by this page) -->
    <!--end::Page Scripts -->

    <!-- begin::ckeditor -->
    <!-- <script src="{{ asset('assets/js/ckeditor/ckeditor.js') }}" type="text/javascript"></script>
    <script>
      var options = {
        filebrowserImageBrowseUrl: '/laravel-filemanager?type=Images',
        filebrowserImageUploadUrl: '/laravel-filemanager/upload?type=Images&_token=',
        filebrowserBrowseUrl: '/laravel-filemanager?type=Files',
        filebrowserUploadUrl: '/laravel-filemanager/upload?type=Files&_token='
      };
      CKEDITOR.replace('description', options);
    </script> -->
    <!-- end::ckeditor -->

    <!--begin::Page Vendors(used by this page) -->
    <!--end::Page Vendors -->

    <!--begin::Page Scripts(used by this page) -->
    <!-- <script src="{{ asset('assets/js/demo1/pages/crud/datatables/advanced/column-visibility.js') }}" type="text/javascript"></script> -->
    <!--end::Page Scripts -->
    <!-- <script src="{{ asset('assets/js/demo1/pages/crud/forms/validation/form-controls.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/demo1/pages/crud/forms/widgets/select2.js') }}" type="text/javascript"></script>
    <script src="{{ asset('assets/js/demo1/pages/crud/forms/widgets/bootstrap-datepicker.js') }}" type="text/javascript"></script>
    -->
   <!-- </script> -->

   <!-- <div id="toast-container" autohide="true">
     <div class="toast toast-error toast-top-full-width">
       <span class="toast-message">This is message</span>
       <button data-dismiss="true" class="toast-close-button"></button>
     </div>
   </div> -->
  </body>
  <!-- end::Body -->
</html>