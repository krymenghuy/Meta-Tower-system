<?php
namespace App\ScriptManagement;
    class ScriptProvider{
         //base in base_path()/public directory
         /***
          /assets/js
          /js/components 
         ***/
         protected static $bundles = [
            'primary-loader'=>[
                'attr'=>'async',
                'single_file'=>1,
                'output_file'=>'/dist/js/primary-loader.js?v=2',
                'files'=>[
                    '/assets/js/loader.js'
                ]
            ],
            'priority-one'=>[
                'attr'=>null,
                'single_file'=>1,
                'output_file'=>'/dist/js/priority-one.min.js?v=13',
                'files'=>[
                    '/assets/js/LocaleManager.js',
                    '/assets/js/vsapi_jto.js',
                    '/assets/js/priority-load.js',
                ]
            ],
            'primary'=>[
                'attr'=>null,
                'single_file'=>1,
                'output_file'=>'/dist/js/dms.primary.js?v=2',
                'files'=>[
                    '/assets/material-js/jquery.min.js',
                    '/assets/js/Chart/Chart.js',
                ]
            ],
           'pdfmake'=>[
                'attr'=>'defer',
                'single_file'=>0,
                'minify'=>0,
                'output_file'=>'/dist/js/vs.pdfmake.js',
                'files'=>[
                    '/assets/js/pdfmake.min.js',
                    '/assets/js/vfs_fonts.js'
                ]
           ],
           'primary-defer'=>[
                'attr'=>'defer',
                'single_file'=>1,
                'output_file'=>'/dist/js/dms.primary-defer.js?v=53',
                'files'=>[
                    '/assets/js/string_san.js',
                    '/assets/js/vsutil.js',
                    '/assets/js/sweetalert2.all.min.js',
                    '/assets/js/sweetalert2.toast.js',
                    '/assets/js/ExchangeManager.js',
                    '/assets/js/expandableTableRow.js',
                    '/assets/vendors/general/popper.js/dist/umd/popper.js',
                    '/assets/material-js/bootstrap.min.js',
                    '/assets/js/validator.js',
                    '/assets/js/cv_interact.js',
                    '/assets/js/datehelper.js',
                    '/assets/js/date.js',
                    '/assets/js/jquery.datepicker2.js',
                    '/assets/js/select2.min.js',
                    '/assets/js/initializeSelect2.js',
                    '/assets/js/toastr.min.js',
                    '/assets/js/init.toastr.js',
                    '/assets/js/demo1/scripts.bundle.js',
                    '/assets/js/datatables.bundle.min.js',/** to be removed soon */
                    '/assets/js/browsercontrol.js'
                ]
                ,'no-minify'=>[
                    '/assets/js/crypto-js.js', 
                ]
                ],
                'abm-components'=>[
                    'attr'=>'defer',
                    'single_file'=>1,
                    'output_file'=>'/dist/js/abm.components.js',
                    'files'=>[
                        '/assets/js/VSRoute.js',
                        '/js/layout/abm/main.js',
                        '/assets/js/formUtils.js',
                        '/js/components/abm/dms.utils.js',
                        '/js/components/abm/CustomerListComponent.js',
                        '/js/components/abm/DialogFilter.js',
                        //'/js/components/UnauthComponent.js',
                        '/js/components/abm/PDFReport.js',
                        '/assets/js/ImageBox.js',
                        '/assets/js/ImageHelper.js',
                        '/assets/js/FileChooser.js',
                        '/assets/js/ListView.js',
                        '/assets/js/InputBoxes.js',
                        // 'js/components/dms/SenderPaymentComponent.js',
                        // 'js/components/dms/TripListComponent.js',
                        // 'js/components/dms/RoleManagementComponent.js',
                        // 'js/components/dms/UserManagementComponent.js',
                        'assets/js/pusher/pusher.min.js',
                        '/js/components/abm/pusher_client_houxpress.js',
                        //'/js/components/abm/pusher_client_dms.js'

                        // '/assets/js/InputBoxes.js',
                        //start Components abm

                        '/js/components/abm/CustomersComponent.js',
                        '/js/components/abm/CountryZonesComponent.js',
                        
                        '/js/components/abm/DashboardComponent.js',
                        '/js/components/abm/SuppliersComponent.js',
                        // '/js/components/abm/CustomersComponent.js',
                        '/js/components/abm/ShipmentsComponent.js',
                    ]
              ],

               'dms-components'=>[
                    'attr'=>'defer',
                    'single_file'=>1,
                    'output_file'=>'/dist/js/dms.components.js?v=204',
                    'files'=>[
                        '/assets/js/VSRoute.js',
                        '/js/layout/dms/main.js?v=1',
                        '/assets/js/formUtils.js',
                        '/js/components/dms/dms.utils.js',
                        '/js/components/dms/DialogFilter.js',
                        '/js/components/dms/PDFReport.js',
                        '/assets/js/ImageBox.js',
                        '/assets/js/ImageHelper.js',
                        '/assets/js/FileChooser.js',
                        '/assets/js/ListView.js',
                        'js/components/dms/DashboardComponent.js',
                        '/js/components/dms/CompanyComponent.js',
                        '/js/components/dms/CompletedPackageListComponent.js',
                        'js/components/dms/DeliveryPriceComponent.js',
                        'js/components/dms/DeliveryZoneComponent.js',
                        'js/components/dms/DriverListComponent.js?v=1',
                        'js/components/dms/DriverPaymentComponent.js',
                        'js/components/dms/MerchantBalancesCompoment.js',
                        'js/components/dms/DriverBalancesCompoment.js',
                        'js/components/dms/ExchangeRatesComponent.js',
                        'js/components/dms/GeneralSettingsComponent.js',
                        '/assets/js/InputBoxes.js',
                        'js/components/dms/LocationComponent.js?v=1',
                        'js/components/dms/MobileBrandImagesComponent.js',
                        'js/components/dms/MobileTCComponent.js',
                        'js/components/dms/MobilePrivacyComponent.js',
                        'js/components/dms/PackageListComponent.js',
                        'js/components/dms/FindPersonDialog.js',
                        'js/components/dms/PickupListComponent.js',
                        // 'js/components/dms/MagicEntryUtil.js',
                        // 'js/components/dms/MagicEntryDialog.js',
                        'js/components/dms/PriceSettingsComponent.js',
                        'js/components/dms/ProductCategoriesComponent.js',
                        'js/components/dms/RemarksComponent.js',
                        'js/components/dms/OrderImagesComponent.js',
                        'js/components/dms/PromotionComponent.js',
                        'js/components/dms/ReportCenterComponent.js',
                        'js/components/dms/SalesAgentsComponent.js',
                        'js/components/dms/SenderListComponent.js?v=1',
                        'js/components/dms/SenderPaymentComponent.js',
                        'js/components/dms/TripListComponent.js',
                        'js/components/um/RoleManagementComponent.js',
                        'js/components/um/UserManagementComponent.js',
                        'assets/js/pusher/pusher.min.js',
                        '/js/components/dms/pusher_client_houxpress.js',
                        //'/js/components/dms/pusher_client_dms.js'
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
