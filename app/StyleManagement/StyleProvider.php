<?php

namespace App\StyleManagement;

class StyleProvider
{
    protected static $bundles = [
        'vsksm-style' => [
            'output_file' => '/dist/css/vsksm-style.css',
            'files' => [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                '/assets/vendors/custom/datatables/datatables.bundle.css',
                '/assets/vendors/general/perfect-scrollbar/css/perfect-scrollbar.css',
                '/assets/vendors/general/tether/dist/css/tether.css',
                '/assets/vendors/general/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css',
                '/assets/vendors/general/bootstrap-datetime-picker/css/bootstrap-datetimepicker.css',
                'assets/vendors/general/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.css',
                'assets/css/select2.min.css',
                'assets/vendors/general/owl.carousel/dist/assets/owl.theme.default.css',
                'assets/vendors/general/dropzone/dist/dropzone.css',
                'assets/vendors/general/bootstrap-markdown/css/bootstrap-markdown.min.css',
                'assets/vendors/general/toastr/build/toastr.css',
                'assets/vendors/general/morris.js/morris.css',
                'assets/vendors/custom/vendors/line-awesome/css/line-awesome.css',
                'assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/demo1/style.bundle.css',
                'assets/css/loader.css',
                'assets/css/jquery.datepicker2.css',
                'assets/css/vsstyle.css',
                'assets/css/kms_style.css',
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
        ]
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
