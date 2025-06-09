<?php

namespace App\ScriptManagement;

class ScriptProvider
{
    //base in base_path()/public directory
    /***
          /assets/js
          /js/components
     ***/
    protected static $bundles = [
        'primary-loader' => [
            'attr' => 'async',
            'single_file' => 1,
            'output_file' => '/dist/js/primary-loader.js?v=2',
            'files' => [
                '/assets/js/loader.js'
            ]
        ],
        'priority-one' => [
            'attr' => null,
            'single_file' => 1,
            'output_file' => '/dist/js/priority-one.min.js?v=13',
            'files' => [
                '/assets/js/LocaleManager.v3.js', //LocaleManager.v3.js is compatible with new "vsd/localization" package
                '/assets/js/vsapi_bhr.js',
                '/assets/js/priority-load.js',
            ]
        ],
        'primary' => [
            'attr' => null,
            'single_file' => 1,
            'output_file' => '/dist/js/dms.primary.js?v=2',
            'files' => [
                '/assets/material-js/jquery.min.js',
                '/assets/js/Chart/Chart.js',
            ]
        ],
        'pdfmake' => [
            'attr' => 'defer',
            'single_file' => 0,
            'minify' => 0,
            'output_file' => '/dist/js/vs.pdfmake.js',
            'files' => [
                '/assets/js/pdfmake.min.js',
                '/assets/js/vfs_fonts.js'
            ]
        ],
        'primary-defer' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/dms.primary-defer.js?v=53',
            'files' => [
                'https://cdn.vectoraclouds.com/frontcore/sanitizer/sanitizer.js',
                '/assets/js/vsutil.v2.js',
                '/assets/js/FilterPanel.js',
                '/assets/js/sweetalert2.all.min.js',
                '/assets/js/sweetalert2.toast.js',
                '/assets/js/expandableTableRow.js',
                '/assets/js/UMExpandItemView.js',
                '/assets/js/VSDropdownMenu.js',
                '/assets/js/GeneralDialog.bs5.js',
                '/assets/vendors/general/popper.js/dist/umd/popper.js',
                //'/assets/material-js/bootstrap.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
                'assets/js/vs_choices.js',
                '/assets/js/validator.js',
                '/assets/js/cv_interact.js',
                '/assets/js/datehelper.js',
                '/assets/js/date.js',
                '/assets/js/jquery.datepicker2.js',
                '/assets/js/toastr.min.js',
                '/assets/js/init.toastr.js',
                '/assets/js/scripts.bundle.js',
                //'/assets/js/datatables.bundle.min.js',/** to be removed soon */
                '/assets/js/browsercontrol.js',
                'https://cdn.vectoraclouds.com/frontcore/components/GeneralDialog.bs5.js',
                '/assets/js/VSMoney.js',
            ],
            'no-minify' => [
                '/assets/js/crypto-js.js',
            ]
        ],

        'ypg-components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/bhr.components.js',
            'files' => [
                'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',
                'https://cdn.vectoraclouds.com/frontcore/vsroute/vsroute.js',
                '/js/layout/ypg/main.js',
                //'/js/components/ypg/PDFReport.js',
                '/assets/js/SearchWidget.js',
                '/assets/js/ImageBox.js',
                '/assets/js/ImageHelper.js',
                '/assets/js/FileChooser.js',
                '/assets/js/ListView.js',
                '/assets/js/InputBoxes.bs5.js',
                '/assets/js/xlsx/xlsx.full.min.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/common/FindPersonDialog.js',
                '/js/components/common/pusher_client.js',
                '/js/components/ypg/DashboardComponent.js',
                '/js/components/ypg/HomeComponent.js',
                '/js/components/ypg/RenderTableReportComponent.js',
                '/js/components/ypg/ReportCenterComponent.js',
                'js/components/common/LocationComponent.js',
                'js/components/common/CompanyComponent.js',
                'js/components/umt/ChangeRoleDialog.js',
                'js/components/umt/ChangeLoginNameDialog.js',
                'js/components/umt/SetPasswordDialog.js',
                'js/components/umt/CreateBranchDialog.js',
                'js/components/umt/CreateLoginDialog.js',
                'js/components/umt/FindUserDialog.js',
                'js/components/umt/BranchManagementComponent.js',
                //'js/components/umt/RoleManagementComponent.js',
                'js/components/umt/RoleManagementTool.js',
                'js/components/ypg/MemberComponent.js',
                'js/components/ypg/TaskTypeComponent.js',
                'js/components/ypg/TaskAssignComponent.js',
                'js/components/ypg/SlotInfoComponent.js',
                'js/components/ypg/RegisterDeceasedComponent.js',
                'js/components/ypg/PolicyComponent.js',
                // 'js/components/ypg/RecordRelationComponent.js',
            ]
        ],

        'report-scripts' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/report-scripts.js',
            'files' => [
                '/assets/material-js/jquery.min.js',
                '/assets/material-js/bootstrap.min.js'
            ]
        ],

        'attendance-script' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/attendance.js',
            'files' => [
                '/assets/material-js/jquery.min.js',
                '/assets/js/sweetalert2.all.min.js',
               '/assets/js/datehelper.js',
                '/assets/js/date.js',
                '/assets/js/jquery.datepicker2.js',
                '/assets/js/vsapi_bhr.js',
                '/js/components/ypg/ScanAttendanceComponent.js'
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
