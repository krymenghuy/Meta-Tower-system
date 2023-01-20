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
                'output_file'=>'/assets/js/priority-one.min.js',
                'files'=>[
                    '/assets/js/vsapi.js',
                    '/assets/js/LocaleManager.js',
                    '/js/priority-load.js'
                ]
            ],
            'primary'=>[
                'attr'=>null,
                'output_file'=>'/js/lms.primary.js',
                'files'=>[
                    '/assets/material-js/jquery.min.js',
                    '/assets/plugins/chart.js/Chart.js',
                    //'/assets/js/securitycom.js',
                    //'/js/LocaleManager.js',
                ]
            ],
           'primary-async'=>[
                'attr'=>'async',
                'output_file'=>'/js/lms.primary-async.js',
                'files'=>[
                    '/js/AuthManager.js'
                ]
           ],
           'pdfmake'=>[
             'attr'=>'defer',
             'minify'=>0,
             'files'=>[
                '/assets/js/pdfmake.min.js',
                '/assets/js/vfs_fonts.js',
             ]
           ],
           'primary-defer'=>[
                'attr'=>'defer',
                'output_file'=>'/js/lms.primary-defer.js',
                'files'=>[
                    //'/assets/js/crypto-js.js',
                    //'/js/security/Encrypter.js',
                    '/assets/js/vsutil.js',
                    '/assets/js/formUtils.js',
                    '/assets/js/vsdom.js',
                    '/assets/js/ItemsView.js',
                    '/assets/js/expandableTableRow.js',
                    '/assets/plugins/chart.js/Chart.js',
                    '/assets/js/Popper.js', //Popper 2.10
                    //'https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js', 2.9
                    '/assets/material-js/bootstrap.min.js', //bootstrap 5.0.2
                    //'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js',//bootstrap 5.0.2
                    '/assets/js/string_san.js',
                    '/assets/js/sweetalert2.all.min.js',
                     //Initialize Toast style and options
                    '/assets/js/sweetalert2.toast.js',
                    '/assets/js/validator.js',
                    '/assets/js/cv_interact.js',
                    '/assets/js/datehelper.js',
                    '/assets/js/date.js',
                    '/assets/js/jquery.datepicker2.js',
                    //'assets/js/html2canvas.min.js',
                    //'/assets/js/vs_multiple_select.js',
                    'https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js',
                    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.13.1/xlsx.full.min.js',
                    '/assets/vendors/general/js-cookie/src/js.cookie.js',
                    '/assets/vendors/general/moment/min/moment.min.js',
                    '/assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js',
                    '/assets/vendors/general/sticky-js/dist/sticky.min.js',
                    '/assets/js/select2.min.js',
                    '/assets/js/initializeSelect2.js',
                    '/assets/js/demo1/scripts.bundle.js',
                    '/assets/vendors/custom/datatables/datatables.bundle.js',
                    //'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js', //This script for toastr (event toasts)
                    'https://js.pusher.com/7.2/pusher.min.js', 
                    '/js/app.js',
                    '/assets/js/browsercontrol.js',
                ]
                ,'no-minify'=>[
                    '/assets/js/crypto-js.js', 
                    '/js/app.js',
                    '/assets/js/demo1/scripts.bundle.js',
                    'https://cdn.ckeditor.com/4.17.2/standard/ckeditor.js',
                    'http://127.0.0.1:8000/assets/vendors/custom/datatables/datatables.bundle.js',
                    //'/assets/vendors/general/perfect-scrollbar/dist/perfect-scrollbar.js'

                ]
                ],
               'components'=>[
                    'attr'=>'defer',
                    'output_file'=>'/js/components/output/lms.components.js',
                    'files'=>[
                        '/js/components/PersonDialog.js',
                        '/js/components/AppointmentListComponent.js',
                        '/js/components/QueueComponent.js',
                        '/js/components/EmployeeListComponent.js',
                        '/js/components/PositionsComponent.js',
                        '/js/components/LaboPartnersComponent.js',
                        '/js/components/VendorsComponent.js',
                        '/js/components/PatientInvoicesComponent.js',
                        '/js/components/PatientReceiptsComponent.js',
                        '/js/components/MedicalServiceComponent.js',
                        '/js/components/ItemsComponent.js',
                        '/js/components/StockTrackingComponent.js',
                        '/js/components/ItemGroupsComponent.js',
                        '/js/components/CategoriesComponent.js',
                        '/js/components/PatientFinderComponent.js',
                        '/js/components/PatientListComponent.js',
                        '/js/components/ExpenseBookComponent.js',
                        '/js/components/ReportCenterComponent.js',
                        '/js/components/InputBoxes.js',
                        '/js/components/FindPersonDialog.js',
                        '/js/components/DashboardComponent.js',
                        '/js/components/CompanyComponent.js', 
                        '/js/components/LocationComponent.js',
                        '/js/components/ServiceDepartmentsComponent.js',
                        '/js/components/ChiefComplaintsComponent.js',
                        '/js/components/GeneralSettingsComponent.js',
                        '/js/components/RoleManagementComponent.js',
                        '/js/components/ExchangeRateComponent.js',
                        '/js/components/UserManagementComponent.js'
                    ]

                    ],
                    'mainjs'=>[
                        'attr'=>'defer',
                        'output_file'=>'/js/layout/output/lms.main.js',
                        'files'=>[
                            '/js/layout/main.js',
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


    class StyleProvider{
        protected static $bundles = [
           'primary'=>[
               'files'=>[
                   '/assets/material-js/jquery.min.css',
               ]
           ],
          
        ];

        static function bundle($bundle_name=null){
            if(!$bundle_name) return [];
            return isset(self::$bundles[$bundle_name])?self::$bundles[$bundle_name]:[];
        }
   }
?>