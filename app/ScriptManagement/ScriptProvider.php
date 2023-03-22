<?php
namespace App\ScriptManagement;
    class ScriptProvider{
         //base in base_path()/public directory
         /***
          /assets/js
          /js/components 
         ***/
         protected static $bundles = [
            'priority-one'=>[
                'attr'=>'async',
                'single_file'=>1,
                'output_file'=>'/dist/js/clinic.priority-one.min.js',
                'files'=>[
                    '/assets/js/vsapi.js',
                    '/assets/js/LocaleManager.js',
                    '/assets/js/priority-load.js'
                ]
            ],
            'primary'=>[
                'attr'=>null,
                'single_file'=>1,
                'output_file'=>'/dist/js/clinic.primary.js?v=1',
                'files'=>[
                    '/assets/material-js/jquery.min.js',
                    '/assets/plugins/chart.js/Chart.js'
                ]
            ],
           'primary-async'=>[
                'attr'=>'async',
                'single_file'=>1,
                'output_file'=>'/dist/js/clinic.primary-async.js',
                'files'=>[
                    '/js/components/AuthManager.js'
                ]
           ],
           'pdfmake'=>[
             'attr'=>'defer',
             'single_file'=>0,
             'output_file'=>'/dist/js/vs.pdfmake.js',
             'minify'=>0,
             'files'=>[
                '/assets/js/pdfmake.min.js',
                '/assets/js/vfs_fonts.js',
             ]
           ],
        'primary-defer'=>[
            'attr'=>'defer',
            'single_file'=>1,
            'output_file'=>'/dist/js/clinic.primary-defer.js',
            'files'=>[
                '/assets/js/string_san.js',
                '/assets/js/vsutil.js',
                '/assets/js/vsdom.js',
                '/assets/js/sweetalert2.all.min.js',
                //Initialize Toast style and options
                '/assets/js/sweetalert2.toast.js',
                '/assets/js/ItemsView.js',
                '/assets/js/ExchangeManager.js',
                '/assets/js/expandableTableRow.js',
                '/assets/js/Popper.js', //Popper 2.10
                //'/assets/plugins/chart.js/Chart.js',
                '/assets/vendors/general/popper.js/dist/umd/popper.js',
                ////'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js', 2.9
                '/assets/material-js/bootstrap.min.js', //bootstrap 5.0.2
                ////'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js',//bootstrap 5.0.2
                //'/assets/vendors/general/tooltip.js/dist/umd/tooltip.min.js',
                //"https://code.iconify.design/2/2.0.3/iconify.min.js",
                //"{{ asset('assets/dist/js/pages/dashboard3.js') }}",                  
                '/assets/js/validator.js',
                '/assets/js/cv_interact.js',
                '/assets/js/datehelper.js',
                '/assets/js/date.js',
                '/assets/js/jquery.datepicker2.js',
                //'assets/js/html2canvas.min.js',
                //'/assets/js/vs_multiple_select.js',
                //'https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js',
                '/assets/js/xlsx/xlsx.full.min.js',
                //'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js',
                '/assets/vendors/general/js-cookie/src/js.cookie.js',
                '/assets/vendors/general/moment/min/moment.min.js',
                '/assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js',
                '/assets/vendors/general/sticky-js/dist/sticky.min.js',
                '/assets/js/select2.min.js',
                '/assets/js/initializeSelect2.js',
                '/assets/js/toastr.min.js', /** for event toast **/
                '/assets/js/init.toastr.js',
                '/assets/js/demo1/scripts.bundle.js',
                '/assets/js/datatables.bundle.min.js',
                //'/assets/plugins/chart.js/Chart.js',
                '/assets/js/datatables.bundle.min.js',
                //'https://js.pusher.com/7.2/pusher.min.js', 
                //'/js/app.js',
                '/assets/js/browsercontrol.js'
            ]
                    ,'no-minify'=>[
                        '/assets/js/crypto-js.js',
                        '/assets/js/ckeditor.js',
                        //'https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js',
                        //'/assets/js/datatables.bundle.min.js'
                        //,'http://127.0.0.1:8000/assets/vendors/custom/datatables/datatables.bundle.js',
                        //'/assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js'

                    ]
                ],
               'components'=>[
                    'attr'=>'defer',
                    'single_file'=>1,
                    'output_file'=>'/dist/js/clinic.components.js',
                    'files'=>[
                        '/assets/js/formUtils.js',
                        //'assets/js/pusher/pusher.min.js',
                        '/js/layout/main.js?v=1',
                        // '/assets/js/vfs_fonts.js',
                        // '/assets/js/pdfmake.min.js',
                        '/js/components/PDFReport.js',
                        '/js/components/FileChooser.js',
                        '/js/components/DashboardComponent.js',
                        '/js/components/PersonDialog.js',
                        '/js/components/AppointmentListComponent.js?v=5',
                        '/js/components/QueueComponent.js?v=5',
                        '/js/components/ConsultationQueueComponent.js?v=3',
                        '/js/components/EmployeeListComponent.js',
                        '/js/components/PositionsComponent.js',
                        '/js/components/LaboPartnersComponent.js',
                        '/js/components/VendorsComponent.js',
                        '/js/components/InvoicesComponent.js?v=2',
                        '/js/components/PatientReceiptsComponent.js',
                        '/js/components/MedicalServiceComponent.js',
                        '/js/components/ItemsComponent.js',
                        '/js/components/StockTrackingComponent.js?v=2',
                        '/js/components/ItemGroupsComponent.js?v=2',
                        '/js/components/CategoriesComponent.js?v=2',
                        '/js/components/PatientFinderComponent.js?v=2',
                        '/js/components/PatientListComponent.js?v=2',
                        '/js/components/ExpenseBookComponent.js',
                        '/js/components/ReportCenterComponent.js',
                        '/js/components/InputBoxes.js',
                        //'/js/components/FindPersonDialog.js',
                        '/js/components/CompanyComponent.js?v=1',
                        '/js/components/MobileBrandImagesComponent.js',
                        '/js/components/PromotionComponent.js',
                        '/js/components/LocationComponent.js',
                        '/js/components/ServiceDepartmentsComponent.js',
                        '/js/components/ChiefComplaintsComponent.js',
                        '/js/components/GeneralSettingsComponent.js',
                        '/js/components/RoleManagementComponent.js',
                        '/js/components/ExchangeRateComponent.js',
                        '/js/components/StockTransferComponent.js',
                        '/js/components/UserManagementComponent.js',
                        'assets/js/pusher/pusher.min.js',
                        '/js/components/pusher_connect.js'
                    ]

                    ],

                    'report-scripts'=>[
                        'attr'=>'defer',
                        'single_file'=>1,
                        'output_file'=>'/dist/js/report-scripts.js',
                        'files'=>[
                            '/assets/material-js/jquery.min.js',
                            '/assets/material-js/bootstrap.min.js'
                        ]
                    ]
         ];

         static function bundle($bundle_name=null){
            if(!$bundle_name) return [];
             return isset(self::$bundles[$bundle_name])?self::$bundles[$bundle_name]:[];
         }

        static function getBundles(){
            return self::$bundles;
        }
    }
?>