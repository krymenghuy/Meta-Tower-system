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
            'output_file' => '/dist/js/primary-loader.js',
            'files' => [
                '/js/components/loader.js'       
            ]
        ],
        'priority-one' => [
            'attr' => 'async',
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.priority-one.min.js',
            'files' => [
                '/assets/js/vsapi.js',
                '/assets/js/LocaleManager.js',
                '/assets/js/priority-load.js'
            ]
        ],
        'primary' => [
            'attr' => null,
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.primary.js?v=1',
            'files' => [
                '/assets/material-js/jquery.min.js',
                '/assets/plugins/chart.js/Chart.js'
            ]
        ],
        'primary-async' => [
            'attr' => 'async',
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.primary-async.js',
            'files' => [
                '/js/components/AuthManager.js'
            ]
        ],
        'pdfmake' => [
            'attr' => 'defer',
            'single_file' => 0, /* original 0*/
            'output_file' => '/dist/js/vs.pdfmake.js',
            'minify' => 0,
            'files' => [
                '/assets/js/pdfmake.min.js',
                '/assets/js/vfs_fonts.js',
            ]
        ],
        'primary-defer' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.primary-defer.js',
            'files' => [
                '/assets/js/string_san.js',
                '/assets/js/vsutil.js',
                '/assets/js/vsdom.js',
                '/assets/js/sweetalert2.all.min.js',
                '/assets/js/sweetalert2.toast.js',
                '/assets/js/ItemsView.js',
                '/assets/js/ExchangeManager.js',
                '/assets/js/expandableTableRow.js',
                '/assets/js/Popper.js',
                '/assets/vendors/general/popper.js/dist/umd/popper.js',
                '/assets/material-js/bootstrap.min.js',
                '/assets/js/validator.js',
                '/assets/js/cv_interact.js',
                '/assets/js/datehelper.js',
                '/assets/js/date.js',
                '/assets/js/jquery.datepicker2.js',
                '/assets/js/xlsx/xlsx.full.min.js',
                '/assets/vendors/general/js-cookie/src/js.cookie.js',
                '/assets/vendors/general/moment/min/moment.min.js',
                '/assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js',
                '/assets/vendors/general/sticky-js/dist/sticky.min.js',
                '/assets/js/select2.min.js',
                '/assets/js/initializeSelect2.js',
                '/assets/js/toastr.min.js',
                '/assets/js/init.toastr.js',
                '/assets/js/demo1/scripts.bundle.js',
                '/assets/js/datatables.bundle.min.js',
                '/assets/js/browsercontrol.js'
            ],
            'no-minify' => [
                '/assets/js/crypto-js.js',
                '/assets/js/ckeditor.js',
            ]
        ],
        'components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.components.js',
            'files' => [
                '/js/components/SearchData.js',
                '/js/components/RenderTableReport.js',
                '/assets/js/formUtils.js',
                '/js/layout/main.js?v=1',
                '/js/components/PDFReport.js',
                '/js/components/FileChooser.js',
                '/js/components/ImageHelper.js',
                '/js/components/ListView.js',
                '/js/components/SimpleItemEditor.js',
                '/js/components/OptionEditor.js',
                '/js/components/DashboardComponent.js',
                '/js/components/PersonDialog.js',
                '/js/components/InvoicesComponent.js?v=2',
                '/js/components/ReportCenterComponent.js',
                '/js/components/InputBoxes.js',
                '/js/components/CompanyComponent.js?v=1',
                '/js/components/LocationComponent.js',
                '/js/components/RegistrationComponent.js',
                '/js/components/TuitionFeeComponent.js',
                '/js/components/PolicyDiscountComponent.js',
                '/js/components/NonTuitionFeeComponent.js',
                '/js/components/DepositFeeComponent.js',
                '/js/components/FindStudentComponent.js',
                '/js/components/StudentInformationComponent.js',
                '/js/components/ActivitiesComponent.js',
                '/js/components/DiscountComponent.js',
                '/js/components/AactivitiesComponent.js',
                '/js/components/ManageAccountComponent.js',
                '/js/components/PrintStudentCardsComponent.js',
                '/js/components/IdCardSettingsComponent.js',
                '/js/components/StudentAttendanceComponent.js',
                '/js/components/StudentAttendanceReportComponent.js',
                '/js/components/UserManagementComponent.js',
                '/js/components/RoleManagementComponent.js',
                '/js/components/ProgramComponent.js',
                '/js/components/StudentGroupComponent.js',
                '/js/components/CampusComponent.js',
                '/js/components/TermComponent.js',
                '/js/components/AcademicYearComponent.js',
                '/js/components/PaymentPendingComponent.js',
                '/js/components/RequestDiscountComponent.js',
                '/js/components/PromoteStudentComponent.js',
                '/js/components/AssignStudentComponent.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/pusher_connect.js'
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
