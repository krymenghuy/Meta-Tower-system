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
                '/assets/js/LocaleManager.v2.js',
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
        'bhr-primary-defer' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/dms.primary-defer.js?v=53',
            'files' => [
                '/assets/js/string_san.js',
                '/assets/js/vsutil.v2.js',
                '/assets/js/sweetalert2.all.min.js',
                '/assets/js/sweetalert2.toast.js',
                '/assets/js/ExchangeManager.js',
                '/assets/js/expandableTableRow.js',
                '/assets/js/UMExpandItemView.js',
                '/assets/js/VSDropdownMenu.js',
                '/assets/js/GeneralDialog.bs5.js',
                '/assets/vendors/general/popper.js/dist/umd/popper.js',
                //'/assets/material-js/bootstrap.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
                '/assets/js/choices.js',
                '/assets/js/validator.js',
                '/assets/js/cv_interact.js',
                '/assets/js/datehelper.js',
                '/assets/js/date.js',
                '/assets/js/jquery.datepicker2.js',
                '/assets/js/select2.min.js',
                '/assets/js/initializeSelect2.js',
                '/assets/js/toastr.min.js',
                '/assets/js/init.toastr.js',
                '/assets/js/scripts.bundle.js',
                //'/assets/js/datatables.bundle.min.js',/** to be removed soon */
                '/assets/js/browsercontrol.js'
            ],
            'no-minify' => [
                '/assets/js/crypto-js.js',
            ]
        ],

        'bhr-components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/abm.components.js',
            'files' => [
                'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',
                '/assets/js/VSRoute.v2.js',
                '/js/layout/bhr/main.js',
                //'/js/components/bhr/PDFReport.js',
                '/assets/js/ImageBox.js',
                '/assets/js/ImageHelper.js',
                '/assets/js/FileChooser.js',
                '/assets/js/ListView.js',
                '/assets/js/InputBoxes.bs5.js',
                '/assets/js/xlsx/xlsx.full.min.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/common/FindPersonDialog.js',
                // '/js/components/abm/pusher_client_houxpress.js',
                '/js/components/common/pusher_client_dms.js',
                '/js/components/bhr/DashboardComponent.js',
                '/js/components/bhr/SkillsComponent.js',
                '/js/components/bhr/JobsLevelComponent.js',
                '/js/components/bhr/EmployeeComponent.js',

                '/js/components/bhr/PayrollComponent.js',
                '/js/components/bhr/DepartmentComponent.js',
                '/js/components/bhr/PositionComponent.js',
                '/js/components/bhr/LeaveComponent.js',
                '/js/components/bhr/ReportComponent.js',
                'js/components/bhr/WarningComponent.js',
                '/js/components/bhr/EmployeeSeniorityComponent.js',
                '/js/components/bhr/EmployeeBonusComponent.js',
                '/js/components/bhr/AttendanceComponent.js',
                '/js/components/bhr/StaffAttendanceComponent.js',
                '/js/components/bhr/EmployeeMovementComponent.js',
                '/js/components/bhr/EmployeeBenefitComponent.js',

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
