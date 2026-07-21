<?php
return [
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
              'https://cdn.vectoraclouds.com/frontcore/utils/vsapi.js',
              'https://cdn.vectoraclouds.com/frontcore/components/LocaleManager.v3.js',
               '/assets/js/priority-load.js',
            ]
        ],
        'primary' => [
            'attr' => null,
            'single_file' => 1,
            'output_file' => '/dist/js/dms.primary.js?v=2',
            'files' => [
                //'/assets/material-js/jquery.min.js',
                '/assets/js/Chart/Chart.js',
            ]
        ],
        // 'pdfmake' => [
        //     'attr' => 'defer',
        //     'single_file' => 0,
        //     'minify' => 0,
        //     'output_file' => '/dist/js/vs.pdfmake.js',
        //     'files' => [
        //         '/assets/js/pdfmake.min.js',
        //         '/assets/js/vfs_fonts.js'
        //     ]
        // ],
        'primary-defer' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/dms.primary-defer.js?v=53',
            'files' => [
                'https://cdn.vectoraclouds.com/frontcore/sanitizer/sanitizer.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/utils/vsutils.v2.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/components/FilterPanel.v2.js',
                // 'https://cdn.vectoraclouds.com/frontcore/components/FilterPanel.v2.js',

                '/assets/js/sweetalert2.all.min.js',
                '/assets/js/sweetalert2.toast.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ExpandableTableRow.v2.js',
                'https://cdn.vectoraclouds.com/frontcore/components/UMExpandItemView.js',
                'https://cdn.vectoraclouds.com/frontcore/components/VSDropdownMenu.js',

                'https://cdn.vectoraclouds.com/beta-vfc/vfc.utils.configSelect.js',
                 'https://cdn.vectoraclouds.com/beta-vfc/VSInteractBoundary.js',
                'https://cdn.vectoraclouds.com/vfc/vfc.utils.inputFormat.js',
                'https://cdn.vectoraclouds.com/beta-vfc/vfc.form.js',
                'https://cdn.vectoraclouds.com/beta-vfc/vfc.material.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/GeneralDialog.bs.v2.js',
                // 'https://cdn.vectoraclouds.com/frontcore/components/GeneralDialog.bs5.js',

                '/assets/vendors/general/popper.js/dist/umd/popper.js',
                //'/assets/material-js/bootstrap.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',

                'assets/js/choices.11.2.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/components/vs_choices.js',

                'https://cdn.vectoraclouds.com/frontcore/utils/validator.js',
                'https://cdn.vectoraclouds.com/frontcore/components/cv_interact.js',

                'https://cdn.vectoraclouds.com/frontcore/utils/DateHelper.js',
                'https://cdn.vectoraclouds.com/frontcore/components/DateTimePicker/DateTimePicker.js',
                'https://cdn.vectoraclouds.com/frontcore/components/QuickToast/QuickToast.js',

                '/assets/js/toastr.min.js',
                '/assets/js/init.toastr.js',
                'https://cdn.vectoraclouds.com/frontcore/components/layout.js',
                //'/assets/js/datatables.bundle.min.js',/** to be removed soon */
                '/assets/js/browsercontrol.js',
                'https://cdn.vectoraclouds.com/frontcore/components/VSMoney.js',

                'https://cdn.vectoraclouds.com/frontcore/components/items_view/v2/core/ItemsEngine.js',
                'https://cdn.vectoraclouds.com/frontcore/components/items_view/v2/core/ItemsValidator.js',
                'https://cdn.vectoraclouds.com/frontcore/components/items_view/v2/ui/ItemsView.js',

            ],
            'no-minify' => [
                '/assets/js/crypto-js.js',
            ]
        ],

        'prm-components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/bhr.components.js',
            'files' => [
                '/js/components/umt/ChangePasswordDialog.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/SearchInput/VSSearchInput.js',
                'https://cdn.vectoraclouds.com/frontcore/components/SearchInput/VSSearchInputHelper.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/InputBox.v2.js',
                'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',
                'https://cdn.vectoraclouds.com/frontcore/vsroute/vsroute.js',
                '/js/layout/prm/main.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageHelper.js',
               'https://cdn.vectoraclouds.com/frontcore/components/ImageBox.js',
                //'/assets/js/ImageBox.js',
                // 'https://cdn.vectoraclouds.com/frontcore/components/ExpandableTableRow.v2.js',
                'https://cdn.vectoraclouds.com/frontcore/components/FileChooser.js',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/listview.v2.js',

                //'/assets/js/xlsx/xlsx.full.min.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/common/FindPersonDialog.js',
                '/js/components/common/pusher_client.js',
                '/js/components/prm/DashboardComponent.js',
                // '/js/components/prm/HomeComponent.js',
                '/js/components/prm/RenderTableReport.js',
                // '/js/components/prm/ReportCenterComponent.js',
                // 'js/components/common/LocationComponent.js',
                '/js/components/common/CompanyComponent.js',
                'js/components/umt/ChangeRoleDialog.js',
                'js/components/umt/ChangeLoginNameDialog.js',
                'js/components/umt/SetPasswordDialog.js',
                'js/components/umt/CreateBranchDialog.js',
                'js/components/umt/CreateLoginDialog.js',
                'js/components/umt/FindUserDialog.js',
                // 'js/components/umt/BranchManagementComponent.js',
                'js/components/umt/RoleManagementTool.js',
                'js/components/prm/TenantComponent.js',
                'js/components/prm/BuildingComponent.js',
                'js/components/prm/ContractComponent.js',
                'js/components/prm/SpaceComponent.js',
                'js/components/prm/MaintenanceComponent.js',
                'js/components/prm/ReceiptComponent.js',
                'js/components/prm/ServiceComponent.js',
                'js/components/prm/VendorComponent.js',
                'js/components/prm/BillComponent.js',
                'js/components/prm/BillPaymentComponent.js',
                'js/components/prm/PurchaseOrdersComponent.js',
                'js/components/prm/InvoiceComponent.js',
                'js/components/prm/CompanyProfileComponent.js',
                'js/components/prm/SettingComponent.js',
                'js/components/prm/ReportComponent.js',
                'js/components/prm/ExpenseComponent.js',
                'js/components/prm/ServiceRequestComponent.js',
                'js/components/prm/ReservationComponent.js',
                'js/components/prm/AmenityComponent.js',
                'js/components/prm/ItemsComponent.js',
                'js/components/prm/InvoiceSettingComponent.js',
                'js/components/prm/PrintContractDialog.js',
                'js/components/prm/DepositComponent.js',
                'js/components/prm/AnnouncementComponent.js',



            ]
        ],

        'tenant-components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/bhr.components.js',
            'files' => [
                'https://cdn.vectoraclouds.com/beta-frontcore/components/SearchInput/VSSearchInput.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/components/SearchInput/VSSearchInputHelper.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/InputBox.v2.js',
                'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',

                'https://cdn.vectoraclouds.com/frontcore/vsroute/vsroute.js',

                '/js/layout/tenant/main.js',
                '/assets/js/SearchWidget.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageHelper.js',
                //'/assets/js/ImageHelper.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageBox.js',
                //'/assets/js/ImageBox.js',

                'https://cdn.vectoraclouds.com/frontcore/components/FileChooser.js',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/listview.v2.js',

                //'/assets/js/xlsx/xlsx.full.min.js',
                '/js/components/umt/ChangePasswordDialog.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/common/FindPersonDialog.js',
                '/js/components/common/pusher_client.js',
                '/js/components/tenant/DashboardComponent.js',
                '/js/components/tenant/TenantProfileComponent.js',
                '/js/components/tenant/TeamComponent.js',
                '/js/components/tenant/ContractsComponent.js',
                '/js/components/tenant/InvoicesComponent.js',
                '/js/components/tenant/TransactionComponent.js',
                '/js/components/tenant/RequestServiceComponent.js',
                '/js/components/tenant/AnnouncementComponent.js',
                '/js/components/tenant/ReservationComponent.js',
                '/js/components/tenant/ServicesComponent.js',



            ]
        ],
        'mhr-components' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/mhr.components.js',
            'files' => [
                'https://cdn.vectoraclouds.com/beta-frontcore/components/SearchInput/VSSearchInput.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/components/SearchInput/VSSearchInputHelper.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/InputBox.v2.js',
                'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',

                'https://cdn.vectoraclouds.com/frontcore/vsroute/vsroute.js',

                '/js/layout/mhr/main.js',
                '/assets/js/SearchWidget.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageHelper.js',
                //'/assets/js/ImageHelper.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageBox.js',
                //'/assets/js/ImageBox.js',

                'https://cdn.vectoraclouds.com/frontcore/components/FileChooser.js',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/listview.v2.js',

                //'/assets/js/xlsx/xlsx.full.min.js',
                '/js/components/umt/ChangePasswordDialog.js',
                'assets/js/pusher/pusher.min.js',
                '/js/components/common/FindPersonDialog.js',
                '/js/components/common/pusher_client.js',
                '/js/components/mhr/DashboardComponent.js',
                '/js/components/mhr/EmployeeSkillComponent.js',
                '/js/components/mhr/EmployeeEducationComponent.js',
                '/js/components/mhr/EmployeeExperienceComponent.js',
                '/js/components/mhr/EmployeeDocumentComponent.js',
                '/js/components/mhr/TaxAllowanceComponent.js',
                '/js/components/mhr/EmployeeManagementComponent.js',
                '/js/components/mhr/MovementComponent.js',
                '/js/components/mhr/WorkShiftListComponent.js',
                '/js/components/mhr/skillsComponent.js',
                '/js/components/mhr/BenefitDisbursementComponent.js',
                '/js/components/mhr/LeaveComponent.js',
                '/js/components/mhr/UninformedLeaveComponent.js',
                '/js/components/mhr/HolidayComponent.js',
                '/js/components/mhr/PayrollComponent.js',
                '/js/components/mhr/PayrollListComponent.js',
                '/js/components/mhr/BenefitComponent.js',
                '/js/components/mhr/EmployeeBenefitComponent.js',
                '/js/components/mhr/PayrollAccountComponent.js',
                '/js/components/mhr/WalletAccountComponent.js',
                '/js/components/mhr/StaffAttendanceComponent.js',
                '/js/components/mhr/WarningComponent.js',
                '/js/components/mhr/TaxBracketComponent.js',
                '/js/components/mhr/PositionComponent.js',
                '/js/components/mhr/DepartmentComponent.js',
                '/js/components/mhr/JobsLevelComponent.js',
                '/js/components/mhr/BenefitDisbursePolicyComponent.js',
                '/js/components/mhr/CheckPointComponent.js',
                '/js/components/mhr/CheckPointCategoryComponent.js',



            ]
        ],
       'umt-primary-defer' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/ksm.primary-defer.js',
            'files' => [
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
                'https://cdn.vectoraclouds.com/frontcore/sanitizer/sanitizer.js?v=18',
                'https://cdn.vectoraclouds.com/beta-frontcore/utils/vsutils.v2.js',
                '/assets/js/sweetalert2.all.min.js',
                '/assets/js/sweetalert2.toast.js',
                '/assets/js/SearchWidget.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ExpandableTableRowConfig.js',
                'https://cdn.vectoraclouds.com/frontcore/components/UMExpandItemView.js',
                'https://cdn.vectoraclouds.com/frontcore/components/VSDropdownMenu.js',
                'https://cdn.vectoraclouds.com/frontcore/components/VSDropdownButton.js',

                'https://cdn.vectoraclouds.com/vfc/vfc.utils.configSelect.js',
                'https://cdn.vectoraclouds.com/vfc/vfc.utils.inputFormat.js',
                'https://cdn.vectoraclouds.com/vfc/vfc.form.js',

                'https://cdn.vectoraclouds.com/beta-frontcore/components/GeneralDialog.bs.v2.js',
                'https://cdn.vectoraclouds.com/frontcore/components/validator.js',
                'https://cdn.vectoraclouds.com/frontcore/components/cv_interact.js',
                'https://cdn.vectoraclouds.com/frontcore/utils/DateHelper.js',

                 'https://cdn.vectoraclouds.com/frontcore/components/DateTimePicker/DateTimePicker.js',
                   'https://cdn.vectoraclouds.com/frontcore/components/QuickToast/QuickToast.js',
                'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0',
                'assets/js/choices.11.2.js',
                'https://cdn.vectoraclouds.com/beta-frontcore/components/vs_choices.js',
                '/assets/js/toastr.min.js',
                '/assets/js/init.toastr.js',
                'https://cdn.vectoraclouds.com/frontcore/components/layout.js',
                '/assets/js/browsercontrol.js',
                '/assets/js/qrcode.min.js',
                'https://raw.githack.com/SortableJS/Sortable/master/Sortable.js'
            ],
            'no-minify' => [
                '/assets/js/crypto-js.js',
                '/assets/js/ckeditor.js',
            ]
        ],
        'landing-script'=>[
            'attr'=>'defer',
            'single_file'=>1,
            'output_file'=>'/dist/js/landing_script.js',
              'files'=>[
                  '/assets/js/bga/skyline.js',
              ]
        ],
        'umt-components'=>[
            'attr'=>'defer',
            'single_file'=>1,
            'output_file'=>'/dist/js/umt.components.js',
            'files'=>[
                'https://cdn.vectoraclouds.com/beta-vfc/vfc.utils.configSelect.js',
                'https://cdn.vectoraclouds.com/beta-vfc/vfc.utils.inputFormat.js',
                'https://cdn.vectoraclouds.com/beta-vfc/vfc.form.js',
                //'/assets/material-js/jquery.min.js',
                //'https://cdn.jsdelivr.net/gh/tomik23/circular-progress-bar@latest/docs/circularProgressBar.min.js',
                'https://cdn.vectoraclouds.com/frontcore/vsroute/vsroute.js',
                '/js/layout/umt/main.js',
                // '/js/components/abm/PDFReport.js',
                '/js/components/prm/RenderTableReport.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageHelper.js',
                'https://cdn.vectoraclouds.com/frontcore/components/ImageBox.js',

                // 'https://cdn.vectoraclouds.com/frontcore/components/ImageBox.js',
                'https://cdn.vectoraclouds.com/frontcore/components/SearchInput/VSSearchInput.js',
                'https://cdn.vectoraclouds.com/frontcore/components/VSMoney.js',
                'https://cdn.vectoraclouds.com/frontcore/components/FileChooser.js',
                'https://cdn.vectoraclouds.com/frontcore/components/listview/listview.v2.js',
                'https://cdn.vectoraclouds.com/frontcore/components/InputBox.v2.js',
                '/assets/js/xlsx/xlsx.full.min.js',
                '/js/components/umt/FindUserDialog.js',
                '/js/components/umt/ChangeRoleDialog.js',
                '/js/components/umt/CreateLoginDialog.js',
                '/js/components/umt/BranchDialog.js',
                '/js/components/umt/ChangeLoginNameDialog.js',
                '/js/components/umt/SetPasswordDialog.js',
                '/js/components/umt/UserManagementComponent.js',
                '/js/components/umt/CampusManagementComponent.js',
                '/js/components/umt/RoleManagementTool.js',
                //  '/js/components/umt/RoleManagementComponent.js',
                'https://js.pusher.com/8.2.0/pusher.min.js',
                //'/js/components/abm/pusher_client_houxpress.js',
                //'/js/components/common/pusher_connect.js',
                // '/js/components/abm/CustomersComponent.js',
            ]
        ],
        'report-scripts' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/report-scripts.js',
            'files' => [
                //'/assets/material-js/jquery.min.js',
                '/assets/material-js/bootstrap.min.js'
            ]
        ],

         'login-script' => [
            'attr' => 'defer',
            'single_file' => 1,
            'output_file' => '/dist/js/login_script.js',
            'files' => [
                //'/assets/material-js/jquery.min.js',
                '/assets/js/bga/login_glass_world.js'
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
                'https://cdn.vectoraclouds.com/frontcore/utils/vsapi.js',
                '/js/components/mhr/ScanAttendanceComponent.js'
            ]
        ]
    ];
