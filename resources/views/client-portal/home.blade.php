<?php 
   if(!Session::get('login_name')) return response()->view('/'); 
   $role_id = \App\Models\UM::roleId(Session::get('user_id'));
   if ($role_id !=3)  return response()->view('borrower.login');
?>
<!DOCTYPE html>
<html>

<head>
    <title>Student Grant Loan</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="sess_branch_id" content="{{ sess_company_id() }}" />
    <meta name="sess_user_id" content="{{ sess_user_id() }}" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Koulen&display=swap" rel="stylesheet">

    <link href="{{ asset('assets/borrower-css/home.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/select2.min.css') }}" rel="stylesheet" type="text/css" />

    <link
        href="{{ asset('assets/vendors/custom/vendors/line-awesome/css/line-awesome.css') }}"
        rel="stylesheet" type="text/css" />
    <!-- <link href="{{ asset('assets/vendors/custom/vendors/flaticon/flaticon.css') }}" rel="stylesheet" type="text/css" /> -->
    <!-- <link href="{{ asset('assets/vendors/custom/vendors/flaticon2/flaticon.css') }}" rel="stylesheet" type="text/css" /> -->
    <link href="{{ asset('assets/css/font-awesome/5.15.4/css/all.min.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ asset('assets/css/demo1/style.bundle.css') }}" rel="stylesheet"
        type="text/css" />
    <link href="{{ asset('assets/vendors/custom/datatables/datatables.bundle.css') }}"
        rel="stylesheet" type="text/css" />
    <link href="{{ url('css/app.css') }}" rel="stylesheet" type="text/css" />

    <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"> -->
    <!-- <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/bs5/dt-1.11.5/datatables.min.css"/> -->
    <!-- <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script> -->
    <!-- <script type="text/javascript" src="https://cdn.datatables.net/v/bs5/dt-1.11.5/datatables.min.js"></script> -->

    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script> -->
    <script src="{{ asset('assets/vendors/general/jquery/dist/jquery.js') }}"
        type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/select2.min.js') }}" type="text/javascript"></script>
    <!-- <script defer src="{{ asset('assets/vendors/general/owl.carousel/dist/owl.carousel.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('assets/js/demo1/scripts.bundle.js') }}" type="text/javascript">
    </script>
    <script defer src="{{ asset('assets/vendors/custom/datatables/datatables.bundle.js') }}"
        type="text/javascript"></script>

    <!-- <script defer src="{{ asset('assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js') }}" type="text/javascript"></script> -->
    <script defer src="{{ asset('assets/vendors/general/sticky-js/dist/sticky.min.js') }}"
        type="text/javascript"></script>

    <script defer src="{{ asset('assets/js/Popper.js') }}" type="text/javascript"></script>
    <script defer
        src="{{ asset('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}"
        type="text/javascript"></script>
    <script defer src="{{ asset('assets/borrower-js/securitycom.js') }}" type="text/javascript">
    </script>
    <script defer src="{{ asset('assets/js/string_san.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/cv_interact.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/validator.js') }}" type="text/javascript"></script>
    <!-- <script defer src="{{ asset('assets/js/tracking_map.js') }}" type="text/javascript"></script> -->

    <script defer src="{{ asset('assets/js/datehelper.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/date.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/jquery.datepicker2.js') }}" type="text/javascript">
    </script>

    <script defer src="{{ asset('assets/js/pdfmake.min.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('assets/js/vfs_fonts.js') }}" type="text/javascript"></script>
    <script defer src="{{ asset('js/borrower/main.js') }}"></script>
    <!-- <script defer src="{{ asset('js/inputBoxes.js') }}" type="text/javascript"></script> -->

    <!-- <script src="https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js"></script> -->
    <!-- <script defer src="{{ asset('assets/js/ckeditor/ckeditor.js') }}" type="text/javascript"></script> -->

    <!-- <script defer src="{{ asset('js/AuthManager.js') }}" ></script>  -->

</head>

<body>

    <div id="_main_hidden_fields">
        <input type="hidden" id="__base_url" value="{{ url('/') }}">
        <input type="hidden" id="__xsp_name" value="_csrf_115578" />
        <input type="hidden" id="__xsp_value" value="<?php echo Str::random(30); ?>" />
    </div>
    <div id="cover-spin" class="loading_a"></div>


    <div class="container-fluid top-panel">
        <div class="container">
            <div class="row pt-4">
                <div class="col-md-3 logo">
                    <img src="{{ asset('assets/borrower-css/logo.png') }}" alt="">
                </div>
                <div class="col-md-9">
                    <h2 class="school-name-kh">សាកលវិទ្យាលយ័បញ្ញាសាស្ត្រកម្ពុជា</h2>
                    <h4 class="school-name-en">PANNASASTRA UNIVERSITY OF CAMBODIA</h4>
                    <p>(+855) 92 974 949 / 86 358 696</p>
                    <div class="rowAddress d-flex justify-content-between" style="margin-top:-15px">
                        <p>Address: Beung Keng Kang 3, Chamkarmon, Phnom Penh</p>
                        <span class="btn-logout"><a id="_bor_btnLogout" class="d-flex btn btn-outline-danger"
                                style="border-radius:35px;border:1.5px solid red; background-opacity:0.6"
                                href="javascript:void(0)"><img
                                    src="{{ asset('assets/borrower-css/arrow-right-from-bracket-solid.svg') }}"
                                    alt="">Logout</a></span>
                    </div>

                </div>
            </div>
        </div>
    </div>

    <div class="container-fluid">
        <div style="width:100%">
            <div class="form-inline tab-buttons">
                <button type="button" id="_bor_btnPayments" class="btn btn-outline-success"
                    style="border-radius:15px;width:100px">PAYMENTS</button> &nbsp;
                <button type="button" id="_bor_btnLoanInfo" class="btn btn-outline-success"
                    style="border-radius:15px;width:100px">LOAN INFO</button> &nbsp;
                <button type="button" id="_bor_btnProfile" class="btn btn-outline-success"
                    style="display:none;border-radius:15px;width:100px">PROFILE</button>
            </div>
        </div>
        <div id="_app_main_content" style="width:100%">
            @include('borrower.paymentListComponent')
            @include('borrower.loanInfoComponent')
            @include('borrower.profileComponent')
        </div>
    </div>

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

    <script>
        $(document).ready(function () {
            $('#tblPayment').DataTable();
        });

    </script>

    <script src="{{ asset('js/PDFReceipt.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    <script src="{{ asset('js/app.js') }}"></script>

</body>

</html>
