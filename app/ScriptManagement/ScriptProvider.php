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
                '/assets/js/string_san.js',
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
                '/assets/js/VSRoute.v2.js',
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
                '/js/components/ypg/SkillsComponent.js',
                '/js/components/ypg/JobsLevelComponent.js',
                '/js/components/ypg/EmployeeComponent.js',
                '/js/components/ypg/PayrollComponent.js',
                '/js/components/ypg/PayrollListComponent.js',
                '/js/components/ypg/DepartmentComponent.js',
                '/js/components/ypg/PositionComponent.js',
                '/js/components/ypg/LeaveComponent.js',
                '/js/components/ypg/LeaveUnFormComponent.js',
                '/js/components/ypg/ReportCenterComponent.js',
                'js/components/ypg/WarningComponent.js',
                //'/js/components/ypg/EmployeeSeniorityComponent.js',
                // '/js/components/ypg/EmployeeBonusComponent.js',
                '/js/components/ypg/StaffAttendanceComponent.js',
                '/js/components/ypg/EmployeeMovementComponent.js',
                '/js/components/ypg/EmployeeBenefitComponent.js',
                '/js/components/ypg/AccountComponent.js',
                '/js/components/ypg/TaxBracketComponent.js',
                '/js/components/ypg/WalletAccountComponent.js',
                '/js/components/ypg/HolidayComponent.js',
                '/js/components/ypg/WorkshiftComponent.js',
                '/js/components/ypg/WorkShiftListComponent.js',
                '/js/components/ypg/RenderTableReportComponent.js',
                '/js/components/ypg/BenefitDisbursementComponent.js',
                'js/components/ypg/BenefitDisbursePolicyComponent.js',
                'js/components/ypg/BenefitComponent.js',
                'js/components/common/LocationComponent.js',
                'js/components/common/CompanyComponent.js',
                'js/components/ypg/ExitFormComponent.js',
                'js/components/ypg/CheckPointCategoryComponent.js',
                'js/components/ypg/CheckPointComponent.js',
                'js/components/umt/ChangeRoleDialog.js',
                'js/components/umt/ChangeLoginNameDialog.js',
                'js/components/umt/SetPasswordDialog.js',
                'js/components/umt/CreateBranchDialog.js',
                'js/components/umt/CreateLoginDialog.js',
                'js/components/umt/FindUserDialog.js',
                'js/components/umt/BranchManagementComponent.js',
                //'js/components/umt/RoleManagementComponent.js',
                'js/components/umt/RoleManagementTool.js',

                'js/components/ypg/CreateContractDialog.js',
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
