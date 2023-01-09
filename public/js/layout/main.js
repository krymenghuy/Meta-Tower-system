'use strict';
//$(document).ready(function(){
   let main_view = new function(){
    let mThis = this;
    this.onLayoutLoad = null;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('meta[name="base_url"]').attr('content'); //$('#__base_url').val();
    this.asset_url =$('meta[name="asset_url"]').attr('content'); 
    this.top_right_menus = $('#_main_top_right_menus');
    this.btnTasks = $('#_main_btn_tasks');
    this.btnLang = $('#_main_btn_lang');
    this.btnUser = $('#_main_btn_user');
    this.btnNotif = $('#_main_btn_notif');
  
     this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
     this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
    
     this.current_view_name = '';
     
     this.mnuDashboard = $('#_main_lnkDashboard');
     this.mnuAppointmentList = $('#_main_lnkAppointments');
     this.mnuPatientFinder = $('#_main_lnkPatientFinder');
     this.mnuTickets = $('#_main_lnkTickets');
     this.mnuMedicalServices = $('#_main_lnkMedicalServices');
     this.mnuProducts = $('#_main_lnkProducts');
     this.mnuProductsGroup = $('#_main_lnkProductGroups');

     this.mnuPatientDashboard = $('#_main_lnkPatientDashboard');
     this.mnuOPDList = $('#_main_lnkOPDList');
     this.mnuPatientInvoices = $('#_main_lnkPatientInvoices');
     this.mnuPatientCreditNotes = $('#_main_lnkPatientCreditNotes');

     this.mnuLoanAppList = $('#_main_lnkLoanAppList');
     
     this.mnuBorrowerList =$('#_mainLnkBorrowers');
     this.mnuCreditOfficerList = $('#_mainLnkCreditOfficers');
     this.mnuServiceDepartments = $('#_main_lnkServiceDepartments');
     this.mnuManageUsers = $('#_main_lnkManageUsers');
     this.mnuManageRoles = $('#_main_lnkManageRoles');
        
     this.mnuCompanyProfile = $('#_main_lnkCompanyProfile');
     this.mnuManageLocations = $('#_main_lnkManageLocation');
     this.mnuReportCenter = $('#_mainLnkReportCenter');
     this.mnuGeneralSettings = $('#_main_lnkGeneralSettings');
     
     this.mnuLogout = $('#_main_lnkLogout');
     
     //Top right menu items for GTS About, Logout
     this.mnuLogout1 = $('#_main_mnu_logout');
     this.mnuAbout1 = $('#_main_mnu_about');

     this.mnuManageBrandImages_mobile = $('#_main_lnkManageBrandImages_mobile');
     this.mnuPromotions_mobile = $('#_main_lnkPromotions');

     //Give warning in console.log when main_view.branch_id and main_view.user_id are NOT found that websocket does not work
     if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
     }
     this.backend_channel_name = ['vsmclinic.backend.',this.branch_id].join('');
  
     this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        vsapi.call([mThis.base_url,'/api/encryptData'].join(''),p).then((res)=>{
            onFinish(res.data?res.data:'');
        }); 
    }

    //###BEGIN:: init main_view() | initMain()| init main     
    this.init = ()=>{
                this.displayUserMenus();
                this.displayNotifications();
                this.displayTasks();

                //language menus (top right menus)
                this.top_right_menus.on('click','.lnk-lang',function(e){
                        let lang = $(this).data('lang');
                      
                        //Translate all items on the page
                        LocaleManager.translateAll(lang);

                        //Only set Language name being diplayed on top menu
                        mThis.setLangMenu(lang);

                        $(this).closest('.dropdown-menu').removeClass('show');

                        //Save language setting for the current user
                        LocaleManager.saveLang(lang);   
                }); 

                //user menus (top right menus)
                this.top_right_menus.on('click','.btn-dropdown',function(e){
                    e.preventDefault();
                    if(mThis.prev_shown_dropdown_menus) mThis.prev_shown_dropdown_menus.removeClass('show');
                    let div =  $(this).parent().find('.dropdown-menu');
                    let menu_name = ($(this).data('menu')+'').toLowerCase(); 
                    div.addClass('show');
                    mThis.prev_shown_dropdown_menus = div;
                });

                //When user click on document (outside the .dropdown buttons that are menus on top-right screen)
                $(document).on('click',function(e){
                        //e.preventDefault();
                        //alert(e.currentTarget.attribute('type'));
                        let x = mThis.top_right_menus.find('div.dropdown-menu'); 
                        let container =  x.parent();
                        if(container){
                            if (!container.is(e.target) && container.has(e.target).length === 0){
                                x.removeClass('show');
                            }
                        }
                        e.stopPropagation();
                });

                this.mnuDashboard.on('click',function(e){
                    e.preventDefault();
                    let option = {'title':'Dashboard','refresh_data':true};
                    DashboardComponent.show(option);
                 });
            
                 this.mnuLoanAppList.on('click',(e)=>{
                     e.preventDefault();
                     //There are two sub views in ApplicantListComponent. "applicant_list" and "applicant_view"
                     //let option = {'title':'Loan Applications'};
                     LoanAppListComponent.show(null);
                 });
                
                 this.mnuPatientFinder.on('click',(e)=>{
                    e.preventDefault();
                    PatientFinderComponent.show(null);
                 });
                 
                 this.mnuTickets.on('click',(e)=>{
                    e.preventDefault();
                    QueueComponent.show(null);
                 });

                 this.mnuMedicalServices.on('click',(e)=>{
                    e.preventDefault();
                    MedicalServiceComponent.show(null);
                 });

                 this.mnuProducts.on('click',(e)=>{
                    e.preventDefault();
                    ProductsComponent.show(null);
                 });

                 this.mnuProductsGroup.on('click',(e)=>{
                    e.preventDefault();
                    ProductsGroupComponent.show(null);
                 });
 
                 this.mnuAppointmentList.on('click',(e)=>{
                    e.preventDefault();
                    AppointmentListComponent.show(null);
                 });

                 this.mnuOPDList.on('click',(e)=>{
                    e.preventDefault();
                    PatientListComponent.show(null);
                 });
  
                 this.mnuCompanyProfile.on('click',function(e){
                    e.preventDefault();
                    CompanyComponent.show(null);
                 });
              
                // this.mnuSalesAgents.on('click',(e)=>{
                //     e.preventDefault();
                //     let option = {'title':'Sales Agents'};
                //     SalesAgentsComponent.show(option);
                // });
              
                this.mnuManageLocations.on('click',(e)=>{
                    e.preventDefault();
                    LocationComponent.show(null);
                });
             
                this.mnuManageUsers.on('click',function(e){
                    e.preventDefault();
                    UserManagementComponent.show(null);
                });
                this.mnuManageRoles.on('click',function(e){
                    e.preventDefault();
                    RoleManagementComponent.show(null);
                });

                this.mnuServiceDepartments.on('click',function(e){
                    e.preventDefault();
                    ServiceDepartmentsComponent.show(null);
                });
            
                this.mnuLogout.on('click',(e)=>{
                    //let base_url = $('#__base_url').val();
                    //let cookie_name ='pem_session';
                    //CommonLib.deleteCookie(cookie_name);
            
                    // var d = new Date;
                    // d.setTime(d.getTime() + 24*60*60*1000*days);
                    // let name="pem_session";
                    // document.cookie = name + "=;path=/;expires=" + d.toGMTString();
                    cv_interact.confirm("Do you want to log out?",{"title":"M-Clinic System","confirmButtonText":"Log Out","cancelButtonText":"No, I stay in","context":"delete","translate":true},(e)=>{
                        if(e){
                           mThis.logOut();
                        }
                    });

                });

                this.mnuLogout1.on('click',(e)=>{
                    mThis.mnuLogout.trigger('click');
                });
            
                this.mnuReportCenter.on('click',(e)=>{
                    ReportCenterComponent.show(null);
                });
            
                // this.mnuReports_financials.on('click',()=>{
                //     let op = {'title':'Company Financials','reportGroup':'Financials'};
                //     ReportsComponent.show(op);
                // });
            
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
     
                 
                // //When user click on the btnNotif that display number of unread notif => set readAll() and set number to zero
                //     mThis.btnNotif.on('click',function(e){
                //         e.preventDefault();
                //         post_ajax(`${mThis.base_url}/api/mark-read-all`,null,(d)=>{
                //         mThis.btnNotif.text(0); 
                //         });
                //     });
         if (typeof mThis.onLayoutLoad ==='function')   mThis.onLayoutLoad();    
 
    }
 //###END:: init main_view()     

    //  this.setView =function(component,option) {
    //      mThis.current_view_name = option.view_name;
    //      component.show(option);  
    //  } 

    this.logOut = ()=>{
        mThis.deleteAllCookies();
        window.location.replace([mThis.base_url,'/logout'].join(''));
    }
        

         //begin:: init dropdown menus on Top-right screen
            
         this.setLangMenu = (lang)=>{
            let lnkName = $('#_main_lang_name');
            //let lang = $(this).data('lang');
            //Langauge name such "Khmer" or "English"
            let lang_name = LocaleManager.langs[lang].name;
            let icon_image = LocaleManager.langs[lang].icon_image;

            //Get asset_url from Master page's meta tag
            let icon_url = [document.querySelector('meta[name="asset_url"]').getAttribute('content'),'/images/icons/',icon_image].join('');
            //NOTE: LocaleManager.langs[lang].content Does not exists
            lnkName.text(lang_name);
            //let lang_image_url = $(this).find('img').attr('src');

            mThis.btnLang.find('img').attr('src',icon_url);
            mThis.btnLang.data('lang',lang);
            LocaleManager.lang = lang;
            
            //NOTE: when LocaleManager() is called => the LocaleManager's collection of eventhandlers for langauge Change event are also executed
            //The eventhandlers are functions to be executed to do something when the application's language is changed by user
            //LocaleManager.translateAll(lang);
        }

         this.addNotificationItem = (notif,update_count=true)=>{
            let div = mThis.top_right_menus.find('.main-notif-panel');
            div.prepend(`<div class="main-notif-item"><span class="notif-title">${notif.title}</span><span class="notif-text">${notif.message}</span></div>`);
            if (update_count) mThis.incrementNotificationCount();
         }
         
         this.changeRequestStatus = (d)=>{
            d.request_id =d.request_id?d.request_id:d.id;
            d.request_completed =d.request_completed?d.request_completed:d.completed;
            d.request_status = d.request_status? d.request_status:d.status;

            let div = mThis.top_right_menus.find('div.main-task-panel');
            let el =null;
            div.find('.main-task-item').each(function(){
                el = $(this);
                if(el.data('id') == d.request_id) return false; 
            });
             
            if(el) {
               let v = el.find('div.task-buttons');
               let buttons = null;

                if(d.request_completed == 1) {
                     if((d.request_status+'').toLowerCase() =='approved')
                             buttons = `<span class="task-btn-approved"><i class="fa fa-check" style="color:green"></i> Approved</span>`;
                     else
                             buttons = `<span class="task-btn-rejected"><i class="fa fa-times" style="color:red"></i> Rejected</span>`;     
               }
                v.empty().append(buttons);
            } 
         }

        //title_prop is json prop in locale file (such as km.json or en.json). It is the Screen's title in base language used in en.json or km.json. For example, title_prop "dashboard" then from this we can translate to any other langauge 
        //setTitle() will set Screen screen title based on the currently loaded Langauge "LocaleManager.langContent" > "titles" property
        this.setTitle = (title_prop=null)=>{
            let title = LocaleManager.trans(title_prop,'titles');
            mThis.elScreenTitle.html(title);
            mThis.elScreenTitle.data('langprop',`titles.${title_prop}`);
        }

         this.deleteAllCookies = () => {
            const cookies = document.cookie.split(";");
            for (const cookie of cookies) {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }

         //AddPendingRequest()
         this.addTaskItem = (c={},update_count=true)=>{
                     let buttons = null;
                     c.request_id =c.request_id?c.request_id:c.id;
                     c.request_status =c.request_status?c.request_status:c.status;
                     c.request_completed =c.request_completed?c.request_completed:c.completed;

                     if(c.completed ==1) 
                     {
                         if((c.status+'').toLowerCase() =='approved')
                             buttons = `<div class="task-buttons"><span class="task-btn-approved"><i class="fa fa-check" style="color:green"></i> Approved</span></div>`;
                         else
                             buttons = `<div class="task-buttons"><span class="task-btn-rejected"><i class="fa fa-times" style="color:red"></i> Rejected</span></div>`;     
                     }else{
                         buttons = `<div class="task-buttons form-inline">
                         <button data-id="${c.request_id}" data-status="${c.request_status}" class="btn btn-sm btn-danger btn-reject-request">Reject</button>&nbsp;
                         <button data-id="${c.request_id}" class="btn btn-sm btn-success btn-approve-request">Approve</button>
                         </div>`;
                     }
                     
                     let item =` <div class="main-task-item" data-id="${c.request_id}" data-completed="${c.request_completed}" data-status="${c.request_status}">
                     <span class="task-title">${c.title}</span>
                     <span class="task-text">${c.description}</span>
                             ${buttons}
                     </div>`;
               
                 mThis.top_right_menus.find('div.main-task-panel').prepend(item);
                 if(update_count) mThis.incrementTaskCount();    
         }

         this.displayUserMenus = ()=>{
            return;
            //  let div = mThis.top_right_menus.find(`div.main-user-menus`);
            //  let html = `
            //      <span class="user-menu-item"><a class="dropdown-item" href="#"><i class="fas fa-cog"></i> About GTS</a></span>
            //      <span class="user-menu-item"><a class="dropdown-item lnk-logout" href="#"><i class="fas fa-sign-out-alt" style="font-size:0.8em"></i> Log out</a></span>
            //     `;
            //  div.append(html);
         }

         this.displayNotifications = ()=> {
             window.vsapi.call(`${mThis.base_url}/api/notifications`,null).then((res)=>{
                let i=0;
                if(res.status_code ===200){
                    let d = res.data;
                    if(d) {
                        let items = d.items;
                        mThis.btnNotif.text(d.unread_count);
                        if(items){
                                 
                                 let c;
                                 do{
                                     c= items[i];
                                     if(!c) break;
                                        mThis.addNotificationItem(c,false);
                                     i++;
                                 }while(c);
                       }
                    } 
                }
             
                if(i==0){
                   let empty_item =`<div class="main-notif-item"><span class="notif-text">No Notifications!</span></div>`;
                  
                   mThis.top_right_menus.find('div.main-notif-panel').append(empty_item);;
               }

             });
         };

         this.setTaskCount = (c)=>{
           mThis.btnTasks.data('count',c).text(c);
         }

         this.setNotificationCount = (c)=>{
             mThis.btnNotif.data('count',c).text(c);
         }

         this.displayTasks =()=> {
             let items =null;
             window.vsapi.call(`${mThis.base_url}/api/pending-requests`,null).then((res)=>{
                 if(res.status_code===200){
                   let d = res.data;
                   let i=0;
                   let c;
                   do{
                       c =d[i];
                        if(!c) break;
                           mThis.addTaskItem(c,false);
                       i++;
                   }while(c);
                      
                     if(i==0) {
                         let item =`<div class="main-task-item">
                                 <span class="task-text">No pending requests</span>     
                             </div>`;
                             let html = `<div class="dropdown-menu dropdown-menu-right">
                                 <span class="task-header">Requests</span> 
                                 <div class="main-task-panel">
                                     ${item}
                                 </div>
                             </div>`;
                         mThis.btnTasks.parent().append(html);
                     } 
                      
                     mThis.setTaskCount(i);
                 }
             });
            
         };


        
 
        mThis.updateNotificationCount = ()=>{
             vsapi.call(`${mThis.base_url}/api/unread-count`,null).then((res)=>{
                 if(res.status_code ===200){
                    let d = res.data;
                    if(d>0) mThis.btnNotif.text(d); else mThis.btnNotif.text(0); 
                 }
                
             });
        }
        

         //Increase notication count by 1 (When a new notification arrived)
             mThis.incrementNotificationCount = ()=>{
                 let d = mThis.btnNotif.data('count');
                     d = $.isNumeric(d)?d:0;
                     d++;
                     mThis.btnNotif.text(d).data('count',d);         
             }

           mThis.incrementTaskCount = ()=>{
                 let d = mThis.btnTasks.data('count');
                 d = $.isNumeric(d)?d:0;
                 d++;
                 mThis.btnNotif.text(d).data('count',d);
           }        
     //end:: init dropdown menus on Top-right screen
  
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

          } catch (e) {return; };
          
        //toastr.info("New event here!");
       
   };

//});

    //initialize layout
    main_view.init();

    $(document).ready(()=>{
        
          //here loadLang() should have been called already, so call to LocaleManager.translateAll();
          //ususally mThis.app_content_id ='_app_content'
          LocaleManager.translateZone('_app_content');
          DashboardComponent.show(null);
          main_view.setLangMenu(LocaleManager.currentLanguage.code);
        //set default view here

        // LocaleManager.loadLang(null,(langContent)=>{
        //    //do something here
              //main_view.setLangMenu(langContent.code);
        // });

         //start: listen to "MessageReceived" event
           window.Echo.private(main_view.backend_channel_name).listen('.message_received',(data)=>{
            alert(JSON.stringify(data));
           });
        //end: listen to "MessageReceived" event

    });