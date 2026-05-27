<?php

namespace App\StyleManagement;

class StyleProvider
{
    protected static $bundles = [
        'prm-style'=>[
            'output_file'=>'/dist/css/prm_style.css?v=18',
            'files' => [
                'assets/css/vsstyle.css',/** Must be set before bootstrap**/
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                'assets/vendors/general/toastr/build/toastr.css',
                'assets/vendors/general/morris.js/morris.css',
                'assets/vendors/custom/vendors/line-awesome/css/line-awesome.css',
                'assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/demo1/style.bundle.css',
                'assets/css/choices.min.css',
                 'assets/css/vs_select.base.css', 
                 'assets/css/vs_select.material.css', 
                'assets/css/vs_input.material.css', 
                'assets/css/dialog_style.css',
                'assets/css/vs_loader.css',
 
                'https://cdn.vectoraclouds.com/frontcore/components/DateTimePicker/DateTimePicker.css',
 
                'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview.css',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview_table.css',
                'assets/css/sweetalert2.min.css',
                'assets/plugins/chart.js/Chart.css',
                'assets/css/prm_style.css', /** Must be placed below all.min.css **/
                'assets/css/vs_search_input.css',
                'https://cdn.vectoraclouds.com/frontcore/components/SearchInput/vs_search_input_example.css',
                'assets/css/expandable-row.theme.css',

                'https://cdn.vectoraclouds.com/frontcore/components/items_view/v2/style/items_view.css',
                'assets/css/items_view.theme.css',
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
                // '/assets/css/merchant-login-style.css',
                '/assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/bootstrap.min.css'
            ]
        ],
        // 'landing-style' => [
        //     'output_file' => '/dist/css/landing-styles.css',
        //     'files' => [
        //         '/assets/css/landing-style.css',
        //         '/assets/css/font-awesome/6.2.0/css/all.min.css',
        //         'assets/css/bootstrap.min.css',
        //     ]
        // ],
        'prm-landing-styles' => [
            'output_file' => '/dist/css/landing-styles.css',
            'files' => [
                '/assets/css/landing-style.css',
                // '/assets/css/ksm-landing-style.css',
                '/assets/css/font-awesome/6.2.0/css/all.min.css',
                //'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',
                //'assets/css/tailwind.boot.css',
                'assets/css/bootstrap.min.css',
            ]
        ],
          'umt-style'=>[
            'output_file'=>'/dist/css/umtstyle.css?v=1',
            'files' => [
                'assets/css/vsstyle.css',/** Must be set before bootstrap**/
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                'assets/css/choices.min.css',
                // 'assets/css/choices.custom.css',
                
                //'assets/css/choices_style.css',
                 'assets/css/vs_select.base.css', 
                 'assets/css/vs_select.material.css', 
                 'assets/css/vs_input.material.css', 
                'assets/css/toastr/toastr.css',
                //'assets/vendors/general/morris.js/morris.css', /** morris is jquery build and used for chartjs but now No need of this */
                'assets/css/line-awesome/css/line-awesome.css',
                'assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/demo1/style.bundle.css',
                // 'assets/dist/css/adminlte.min.css',
                'assets/css/ksm_style.css', /** Must be placed below all.min.css **/
                'assets/css/dialog_style.css',
                'assets/css/vs_loader.css',
                'assets/css/vsa_dropdown_button.css',
                'assets/css/no_data.css',
                'https://cdn.vectoraclouds.com/frontcore/components/DateTimePicker/DateTimePicker.css',
                //'assets/css/vs-pagination.css',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview.css',
                 'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview_table.css',
                'assets/css/sweetalert2.min.css',
                'assets/plugins/chart.js/Chart.css',
            ]
        ],
        'tenant-style'=>[
            'output_file'=>'/dist/css/tenant_style.css?v=18',
            'files' => [
                'assets/css/vsstyle.css',/** Must be set before bootstrap**/
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css',
                'assets/vendors/general/toastr/build/toastr.css',
                'assets/vendors/general/morris.js/morris.css',
                'assets/vendors/custom/vendors/line-awesome/css/line-awesome.css',
                'assets/css/font-awesome/6.2.0/css/all.min.css',
                'assets/css/demo1/style.bundle.css',               
                'assets/css/choices.min.css',
                'assets/css/dialog_style.css',
 
                'assets/css/vs_loader.css',
                //'assets/css/jquery.datepicker2.css',
                'https://cdn.vectoraclouds.com/frontcore/components/DateTimePicker/DateTimePicker.css',
                //'assets/css/vs-pagination.css',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview.css',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/vs_listview_table.css',
                'assets/css/sweetalert2.min.css',
                'assets/plugins/chart.js/Chart.css',
                'assets/css/tenant_style.css', /** Must be placed below all.min.css **/
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
