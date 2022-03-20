'use strict'
//$(document).ready(function(){
   let main_view = new function(){
     //let mThis = this;

     //we use process.env.MIX_PUSHER_APP_KEY instead of the following variables
    //  this.PUSHER_APP_KEY = '780bc0f81cba4c28118a';
    //  this.PUSHER_APP_ID =1312272;
    //  this.PUSHER_APP_CLUSTER ='mt1';
    //  this.PUSHER_APP_SECRET ='330244c53d84af48fc46';
     
     this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
     this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
     
     this.MULTI_WAREHOUSE_OP =0;
     this.DEF_TO_WAREHOUSE_ID =1;
     this.DEF_WAREHOUSE_ID =1;

     this.current_view_name = '';
     
     this.mnuDashboard = $('#_main_lnkDashboard');
     this.mnuPickupList = $('#_main_lnkPickupList');
     this.mnuOutstandingPackageList = $('#_main_lnkPackageList');
     this.mnuDeliveryTrips = $('#_main_lnkTrips');
     this.mnuCompletedPackageList = $('#_main_lnkCompletedPackageList');
     this.mnuWaitingList = $('#_main_lnkLoanApplications');
     this.mnuApproveList = $('#_main_lnkApproveList');
     this.mnuBorrowers = $('#_main_lnkBorrowers');
     this.mnuGuarantors = $('#_main_lnkGuarantors');
     this.mnuLoans = $('#_main_lnkLoans');
     this.mnuRepayments = $('#_main_lnkRepayments');
     this.mnuPromsoryNotes = $('#_main_lnkPrm_Notes');
     this.mnuNonPerformaingLoan = $('#_main_lnkNon_Performing_Loans');
     //this.mnuBillings = $('#_main_lnkBilling');
     
     this.mnuSenderList = $('#_main_lnkSenderList');
     this.mnuDriverList = $('#_main_lnkDriverList');
     this.mnuSalesAgents = $('#_main_lnkSalesAgents');
     //this.mnuDriverProfile = $('#_main_lnkDriverProfile');

     this.mnuDriverPmts = $('#_main_lnkPmt_driver');
     this.mnuSenderPmts = $('#_main_lnkPmt_sender');

     this.mnuManageUsers = $('#_main_lnkManageUsers');
     this.mnuManageRoles = $('#_main_lnkManageRoles');
     this.mnuManagePermissions = $('#_main_lnkManagePermissions');
       
     this.mnuCompanyProfile = $('#_main_lnkCompanyProfile');
     this.mnuManageLocations = $('#_main_lnkManageLocation');
     this.mnuManageDeliveryZones = $('#_main_lnkManageDeliveryZones');
     this.mnuManageDeliveryPrices = $('#_main_lnkManageDeliveryPrices');
     this.mnuReports_general = $('#_mainLnkReports_general');
     this.mnuReports_financials = $('#_mainLnkReports_financials');
     this.mnuGeneralSettings = $('#_main_lnkGeneralSettings');
     this.mnuLogout = $('#_main_lnkLogout');
     this.mnuManageBrandImages_mobile = $('#_main_lnkManageBrandImages_mobile');
     this.mnuPromotions_mobile = $('#_main_lnkPromotions');

     //Give warning in console.log when main_view.branch_id and main_view.user_id are NOT found that websocket does not work
     if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
     }
     this.backend_channel_name = ['backend.',this.branch_id].join('');

     //sub class "hiddenFields" provide quick access to critical hidden fields
      //begin::hiddenField class 
            this.hiddenFields = new function(){
                let xThis = this;
                this.self = $('#_main_hidden_fields');
                
                this.base_url = ()=>{
                if (!xThis.base_url) xThis.base_url = xThis.self.find('#__base_url').val();   
                return xThis.base_url;
                }
                this.csrf_name = ()=>{
                    if (!xThis.csrf_name)  xThis.csrf_name = xThis.self.find('#__xsp_name').val();
                    return xThis.csrf_name;
                }
                this.csrf_value = ()=>{
                    if (!xThis.csrf_value)  xThis.csrf_value = xThis.self.find('#__xsp_value').val();
                    return xThis.csrf_value;
                }
            }
         //end::hiddenField class 


    //  this.setView =function(component,option) {
    //      mThis.current_view_name = option.view_name;
    //      component.show(option);  
    //  } 

     this.mnuDashboard.on('click',function(e){
       e.preventDefault();
       let option = {'title':'Dashboard'};
       DashboardComponent.show(option);
     });

     this.mnuWaitingList.on('click',(e)=>{
         e.preventDefault();
         let option = {'title':'Applicants List'};
         WaitingListComponent.show(option);
         
     });

     this.mnuApproveList.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Approve List'};
        ApproveListComponent.show(option);
        
    });

    this.mnuBorrowers.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Borrowers'};
        BorrowersComponent.show(option);
        
    });

    this.mnuGuarantors.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Guarantors'};
        GuarantorsComponent.show(option);
        
    });

    this.mnuLoans.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Loans'};
        LoansComponent.show(option);
        
    });


    this.mnuRepayments.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Repayments'};
        RepaymentsComponent.show(option);
        
    });


    
    this.mnuNonPerformaingLoan.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Non-Performing Loans'};
        NonPerformingLoansComponent.show(option);
        
    });

    
    this.mnuPromsoryNotes.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Promsory Notes'};
        PromsoryNotesComponent.show(option);
        
    });

     this.mnuCompanyProfile.on('click',function(e){
        e.preventDefault();
        let option = {'title':'Company Profile'};
        CompanyComponent.show(option);
     });

     this.mnuOutstandingPackageList.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Package Trail'};
        PackageListComponent.show(option);
    });

    this.mnuDeliveryTrips.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Manage Fleet'};
        TripListComponent.show(option);
    });
    
    this.mnuCompletedPackageList.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Completed Deliveries'};
        CompletedPackageListComponent.show(option);
        //console.log(CompletedPackageListComponent.self.parent().attr('id'));
    });

    // this.mnuBillings.on('click',(e)=>{
    //     e.preventDefault();
    //     let option = {'title':'Billings & Payments'};
    //     BillingComponent.show(option);
    // });
	
	this.mnuSenderList.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Merchant List'};
        SenderListComponent.show(option);
    });
    
    this.mnuDriverList.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Driver List'};
        DriverListComponent.show(option);
    });

    this.mnuSalesAgents.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Sales Agents'};
        SalesAgentsComponent.show(option);
    });

    this.mnuDriverPmts.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Driver Transactions'};
        DriverPaymentComponent.show(option);
    });

    this.mnuSenderPmts .on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Merchant Transactions'};
        SenderPaymentComponent.show(option);
    });

    // this.mnuDriverProfile.on('click',(e)=>{
    //     e.preventDefault();
    //     let option = {'title':'Driver Profile'};
    //     DriverProfileComponent.show(option);
    // });

    this.mnuManageLocations.on('click',(e)=>{
        e.preventDefault();
        let option = {title:'Manage Locations'};
        LocationComponent.show(option);
    });

    this.mnuManageDeliveryZones.on('click',(e)=>{
        e.preventDefault();
        let option = {title:'Delivery Zones'};
        DeliveryZoneComponent.show(option);
    });
    
    this.mnuManageDeliveryPrices.on('click',(e)=>{
        e.preventDefault();
        let option = {title:'Price Settings'};
        PriceSettingsComponent.show(option);
        //DeliveryPriceComponent.show(option);
    });

    this.mnuManageUsers.on('click',function(e){
        e.preventDefault();
        let option = {title:'Manage Users'};
        UserManagementComponent.show(option);
    });
    this.mnuManageRoles.on('click',function(e){
        e.preventDefault();
        let option = {title:'Manage Roles'};
        RoleManagementComponent.show(option);
    });

    this.mnuLogout.on('click',(e)=>{
        let base_url = $('#__base_url').val();
        window.location = [base_url].join('');
    });

    this.mnuReports_general.on('click',()=>{
        let op = {'title':'General Reports','reportGroup':'General'};
        ReportsComponent.show(op);
    }); 
    this.mnuReports_financials.on('click',()=>{
        let op = {'title':'Company Financials','reportGroup':'Financials'};
        ReportsComponent.show(op);
    });

        this.mnuGeneralSettings.on('click',function(e){
            e.preventDefault();
            generalSettingsComponent.show({'title':'General Settings'}); 
        });

        this.mnuManageBrandImages_mobile.on('click',(e)=>{
            e.preventDefault();
            let op = {'title':'Mobile Brand Images'};
            MobileBrandImagesComponent.show(op);
        });
        this.mnuPromotions_mobile.on('click',(e)=>{
            e.preventDefault();
            let op = {'title':'Promotions'};
            PromotionComponent.show(op);
        });
        
 
          try{
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              };

          } catch {};
          
              //toastr.info("New event here!");
        

        //start: listen to "MessageReceived" event
        window.Echo.private(this.backend_channel_name).listen('.message_received',(data)=>{
             alert(JSON.stringify(data));
         });
        //end: listen to "MessageReceived" event
   
   }

//});

// $(document).ready(function(){
 
//     // var notificationsWrapper   = $('.dropdown-notifications');
//     // var notificationsToggle    = notificationsWrapper.find('a[data-toggle]');
//     // var notificationsCountElem = notificationsToggle.find('i[data-count]');
//     // var notificationsCount    = parseInt(notificationsCountElem.data('count'));
//     // var notifications         = notificationsWrapper.find('ul.dropdown-menu');

//     // if (notificationsCount <= 0) {
//     //    notificationsWrapper.hide();
//     // }

//     // Enable pusher logging - don't include this in production
//     //Pusher.logToConsole = true;

     
//     // var pusher = new Pusher(main_view.PUSHER_APP_KEY,{
//     //      //forceTLS:false,
//     //      //appId:main_view.PUSHER_APP_ID,
//     //      //key:main_view.PUSHER_APP_KEY, 
//     //      //secret:main_view.PUSHER_APP_SECRET,
//     //      enabledTransports:['ws', 'wss','sockjs'],
//     //      cluster:main_view.PUSHER_APP_CLUSTER,
//     //     //  auth: {
//     //     //   headers: {
//     //     //     //CSRFToken: "some_csrf_token",
//     //     //     'Access-Controll-Allow-Origin':'http://127.0.0.1:800'
//     //     //   },
//     //     // },
//     //   });
 
//     // let pusher = new Pusher(main_view.PUSHER_APP_KEY,{
//     //     //forceTLS:false,
//     //     enabledTransports:['ws', 'wss','sockjs'],
//     //     cluster:main_view.PUSHER_APP_CLUSTER,
//     //  });

//     //   pusher.connection.bind("error", function (err) {
//     //     if (err.data.code === 4004) {
//     //       log(">>>Number of notifications reach its limit");
//     //     }else  console.error("connection error", JSON.stringify(err));
//     //   });

//     // let c = pusher.subscribe('message_channel');
//     //   c.bind('onMessageReceived',(d)=>{
//     //       let data = d.data;
//     //       toastr.info(JSON.stringify(data));
//     //   });

//     // // Subscribe to the channel we specified in our Laravel Event
//     // let channel = pusher.subscribe('pickup_channel');

//     // // Bind a function to a Event (the full Laravel class)
//     //   channel.bind('onPickupRequestAccepted', function(d) {
//     //   let data = d.data;
//     //    //display toast
//     //       toastr.info(data.message);
//     //    //end of displaying toast

//     //   var existingNotifications = notifications.html();
//     //   var avatar = Math.floor(Math.random() * (71 - 20 + 1)) + 20;
      
//     //   var newNotificationHtml = `
//     //     <li class="notification active">
//     //         <div class="media">
//     //           <div class="media-left">
//     //             <div class="media-object">
//     //               <img src="https://api.adorable.io/avatars/71/`+avatar+`.png" class="img-circle" alt="50x50" style="width: 50px; height: 50px;">
//     //             </div>
//     //           </div>
//     //           <div class="media-body">
//     //             <strong class="notification-title">`+data.message+`</strong>
//     //             <!--p class="notification-desc">`+ data.accept_time +`</p-->
//     //             <div class="notification-meta">
//     //               <small class="timestamp">about a minute ago</small>
//     //             </div>
//     //           </div>
//     //         </div>
//     //     </li>
//     //   `;
      
//     //   notifications.html(newNotificationHtml + existingNotifications);
//     //   notificationsCount += 1;
//     //   notificationsCountElem.attr('data-count', notificationsCount);
//     //   notificationsWrapper.find('.notif-count').text(notificationsCount);
//     //   notificationsWrapper.show();
//     // });
// });
