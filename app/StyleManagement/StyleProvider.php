<?php

namespace App\StyleManagement;

class StyleProvider
{
    protected static $bundles = [
        'dms-style'=>[
            'output_file'=>'/dist/css/dmsstyle.css?v=18',
            'files'=>[
                'assets/css/vsstyle.css?',/** Must be set before bootstrap**/
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                //'/assets/vendors/custom/datatables/datatables.bundle.css',
                //'/assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css',
                //'/assets/vendors/general/tether/dist/css/tether.css',
                //'/assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
                //'/assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css',
                //'assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css',
                'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
                'assets/css/select2.min.css',
                // 'assets/css/dashboard.css',
                //'assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css',
                //'assets/vendors/general/dropzone/dist/dropzone.css',
                //'assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css',
                'assets/vendors/general/toastr/build/toastr.css',
                'assets/vendors/general/morris.js/morris.css',
                'assets/vendors/custom/vendors/line-awesome/css/line-awesome.css',
                'assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/demo1/style.bundle.css',
                'assets/css/jto_style.css', /** Must be placed below all.min.css **/
                'assets/css/loader.css',
                'assets/css/jquery.datepicker2.css',
                'assets/css/vs-pagination.css',
                //'assets/css/pipeline.css',
                'assets/css/sweetalert2.min.css',
                '/assets/vendors/custom/datatables/datatables.bundle.css', /** to be removed soon with the script datatables.bundle.min.js */
                //'assets/plugins/chart.js/Chart.css',
              ]
            ],
            'abm-style'=>[
                'output_file'=>'/dist/css/dmsstyle.css?v=18',
                'files' => [
                    'assets/css/vsstyle.css',/** Must be set before bootstrap**/
                    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                    //'/assets/vendors/custom/datatables/datatables.bundle.css',
                    //'/assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css',
                    //'/assets/vendors/general/tether/dist/css/tether.css',
                    //'/assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
                    //'/assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css',
                    //'assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css',
                    'assets/css/select2.min.css',
                    //'assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css',
                    //'assets/vendors/general/dropzone/dist/dropzone.css',
                    //'assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css',
                    'assets/vendors/general/toastr/build/toastr.css',
                    'assets/vendors/general/morris.js/morris.css',
                    'assets/vendors/custom/vendors/line-awesome/css/line-awesome.css',
                    'assets/css/font-awesome/6.2.0/css/all.min.css',
                    'assets/css/demo1/style.bundle.css',
                    // 'assets/dist/css/adminlte.min.css',
                    'assets/css/jto_style.css', /** Must be placed below all.min.css **/
                    'assets/css/loader.css',
                    'assets/css/jquery.datepicker2.css',
                    'assets/css/vs-pagination.css',
                    'assets/css/sweetalert2.min.css',
                    'assets/plugins/chart.js/Chart.css',
                ]
                ],    
        'report-styles' => [
            'output_file' => '/dist/css/report-styles.css',
            'files' => [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css'
            ]
        ],
        'login-styles' => [
            'output_file' => '/dist/css/login-styles.css',
            'files' => [
                '/assets/css/login-style.css',
                '/assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/bootstrap.min.css'
            ]
        ],
        'landing-styles' => [
            'output_file' => '/dist/css/landing-styles.css',
            'files' => [
                '/assets/css/landing-style.css',
                '/assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/bootstrap.min.css',
            ]
            ],
        
    ];

    static function bundle($bundle_name = null)
    {
        if (!$bundle_name) return [];
        return isset(self::$bundles[$bundle_name]) ? self::$bundles[$bundle_name] : [];
    }

    static function getBundles()
    {
        return self::$bundles;
    }
}
