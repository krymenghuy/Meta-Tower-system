'use strict'
//$(document).ready(function(){
   let main_view = new function(){
    let mThis = this;
    this.self = $('#_app_content');
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('meta[name="base_url"]').attr('content'); //$('#__base_url').val();
    this.top_right_menus = $('#_main_top_right_menus');
    this.btnTasks = $('#_main_btn_tasks');
    this.btnLang = $('#_main_btn_lang');
    this.btnUser = $('#_main_btn_user');
    this.btnNotif = $('#_main_btn_notif');
  
     this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
     this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
    
     
     this.current_view_name = '';
     
     this.mnuDashboard = $('#_main_lnkDashboard');

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

     //User menus
    this.lnkAbout = $('#_main_mnu_about');
    this.lnkLogout = $('#_main_mnu_logout');
         
     this.mnuManageBrandImages_mobile = $('#_main_lnkManageBrandImages_mobile');
     this.mnuPromotions_mobile = $('#_main_lnkPromotions');

     //Give warning in console.log when main_view.branch_id and main_view.user_id are NOT found that websocket does not work
     if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
     }
     this.backend_channel_name = ['vsloan.backend.',this.branch_id].join('');

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
        let option = {'title':'Dashboard','refresh_data':true};
        DashboardComponent.show(option);
     });

     this.mnuLoanAppList.on('click',(e)=>{
         e.preventDefault();
         //There are two sub views in ApplicantListComponent. "applicant_list" and "applicant_view"
         let option = {'title':'Loan Applications'};
         LoanAppListComponent.show(option);
     });

     this.mnuLoanList.on('click',(e)=>{
        e.preventDefault();
        //There are two sub views in ApplicantListComponent. "applicant_list" and "applicant_view"
        let option = {'title':'Active Loans'};
        LoanListComponent.show(option);
    });

    this.mnuFinishedLoanList.on('click',(e)=>{
        e.preventDefault();
        //There are two sub views in ApplicantListComponent. "applicant_list" and "applicant_view"
        let option = {'title':'Finished Loans'};
        FinishedLoanListComponent.show(option);
    });
 

    this.mnuBorrowers.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Borrowers'};
        BorrowerListComponent.show(option);
        
    });

    this.mnuGuarantors.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Guarantors'};
        GuarantorListComponent.show(option);
        
    });

    this.mnuLoans.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Loans'};
        LoansComponent.show(option);
        
    });


    this.mnuLoanCollection.on('click',(e)=>{
        e.preventDefault();
        let option = {'title':'Loan Collection'};
        LoanCollectionComponent.show(option);
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
  
    // this.mnuSalesAgents.on('click',(e)=>{
    //     e.preventDefault();
    //     let option = {'title':'Sales Agents'};
    //     SalesAgentsComponent.show(option);
    // });
  
    this.mnuManageLocations.on('click',(e)=>{
        e.preventDefault();
        let option = {title:'Manage Locations'};
        LocationComponent.show(option);
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
        //let base_url = $('#__base_url').val();
        //let cookie_name ='pem_session';
        //CommonLib.deleteCookie(cookie_name);

        // var d = new Date;
        // d.setTime(d.getTime() + 24*60*60*1000*days);
        // let name="pem_session";
        // document.cookie = name + "=;path=/;expires=" + d.toGMTString();
       mThis.deleteAllCookies();   
       //window.location = [base_url,'/logout'].join('');
       window.location.replace([mThis.base_url,'/logout'].join(''));
    });

    this.setLangMenu = (lang)=>{
            let lnkName = $('#_main_lang_name');
            //let lang = $(this).data('lang');
            //Langauge name such "Khmer" or "English"
            let lang_name = LocaleManager.langs[lang].name;
            let icon_url = LocaleManager.langs[lang].icon_url;
            lnkName.text(lang_name);
            //let lang_image_url = $(this).find('img').attr('src');

            mThis.btnLang.find('img').attr('src',icon_url);
            mThis.btnLang.data('lang',lang);
    }

      //language menus (top right menus)
         this.top_right_menus.on('click','.lnk-lang',function(e){
               let lang = $(this).data('lang');
               mThis.setLangMenu(lang);
               $(this).closest('.dropdown-menu').removeClass('show');

               //Save language setting for the current user
               //if the @lang to be saved is different from the currently displayed langauge => saveLang() will load new langauge content and translate all components
               LocaleManager.saveLang(lang);
               
          }); 
  
      //User Menus (top right menus)
            this.lnkLogout.on('click',()=>{
               mThis.mnuLogout.trigger('click');
            });
            
            this.lnkAbout.on('click',()=>{
            cv_interact.alert('About LMS system');
            });


    this.mnuReports_general.on('click',()=>{
        let op = {'title':'Reports'};
        ReportsComponent.show(op);
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
        

         //begin:: init dropdown menus on Top-right screen
            
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
 
        //  //WHEN parameters (@lang, @persist =1) are specified => function will update the Language menu by displaying the currently selected langauge
        //  //On application's first load (or when user refresh Browser)=> parameters (@lang=NULL, @persits =0), so changeLanguage() will only load languages and translate language based on user's language setting by retrieve the previously selected language content and load it.
        //  this.changeLanguage = (lang='en',persists=0)=>{
        //      //cv_interact.alert(`Change language to ${lang}`);
        //      //if @persists =1 => then Save user's language in tables "um_users" and "um_sessions"
        //      let p = {'lang':lang,'persists':persists};
        //      post_ajax(`${mThis.base_url}/api/settings/lang`,p,(res)=>{
        //        if (res.status_code===200){
        //           alert(JSON.stringify(res.data));
        //           mThis.lang =lang;

        //            //In case of page_load => set language
        //             if (persists==0){
        //                  //mThis.btnLang.find('img');
        //             }
        //        }
        //      });

        //  }

        //title_prop is json prop in locale file (such as km.json or en.json). It is the Screen's title in base language used in en.json or km.json. For example, title_prop "dashboard" then from this we can translate to any other langauge 
        //setTitle() will set Screen screen title based on the currently loaded Langauge "LocaleManager.langContent" > "titles" property
        this.setTitle = (title_prop)=>{
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

        //  //populate User menus => "User Login name", "Log out" menus
        //  this.displayUserMenus = ()=>{
        //      let div = mThis.top_right_menus.find(`div.main-user-menus`);
        //      let html = `
        //          <span class="user-menu-item"><a class="dropdown-item" href="javascript:void(0)"><i class="fas fa-cog"></i> About LMS</a></span>
        //          <span class="user-menu-item"><a id="_main_mnu_logout" class="dropdown-item" href="javascript:void(0)"><i class="fas fa-sign-out-alt" style="font-size:0.8em"></i> Log out</a></span>
        //         `;
        //      div.append(html);
        //  }
 
         this.displayNotifications = ()=> {
             post_ajax(`${mThis.base_url}/api/notifications`,null,(d)=>{
                let i=0;
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

                if(i==0){
                   let empty_item =`<div class="main-notif-item"><span class="notif-text">No Notifications!</span></div>`;
                  
                   mThis.top_right_menus.find('div.main-notif-panel').append(empty_item);;
               }

             });
         };

        //  this.setTaskCount = (c)=>{
        //    mThis.btnTasks.data('count',c).text(c);
        //  }

         this.setNotificationCount = (c)=>{
             mThis.btnNotif.data('count',c).text(c);
         }

        //  this.displayTasks =()=> {
        //      let items =null;
        //      post_ajax(`${mThis.base_url}/api/pending-requests`,null,(d)=>{
        //          if(d){
        //            let i=0;
        //            let c;
        //            do{
        //                c =d[i];
        //                 if(!c) break;
        //                    mThis.addTaskItem(c,false);
        //                i++;
        //            }while(c);
                      
        //              if(i==0) {
        //                  let item =`<div class="main-task-item">
        //                          <span class="task-text">No pending requests</span>     
        //                      </div>`;
        //                      let html = `<div class="dropdown-menu dropdown-menu-right">
        //                          <span class="task-header">Requests</span> 
        //                          <div class="main-task-panel">
        //                              ${item}
        //                          </div>
        //                      </div>`;
        //                  mThis.btnTasks.parent().append(html);
        //              } 
                      
        //              mThis.setTaskCount(i);
        //          }
        //      });
            
        //  };
 
         //this.displayUserMenus();
         this.displayNotifications();
         //this.displayTasks();

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
                 let x = mThis.top_right_menus.find('div.dropdown-menu'); 
                 let container =  x.parent();
                 if(container){
                     if (!container.is(e.target) && container.has(e.target).length === 0) {
                         x.removeClass('show');
                     }
                 }
         });

         // //When user click on the btnNotif that display number of unread notif => set readAll() and set number to zero
         //     mThis.btnNotif.on('click',function(e){
         //         e.preventDefault();
         //         post_ajax(`${mThis.base_url}/api/mark-read-all`,null,(d)=>{
         //         mThis.btnNotif.text(0); 
         //         });
         //     });
 
        mThis.updateNotificationCount = ()=>{
             post_ajax(`${mThis.base_url}/api/unread-count`,null,(d)=>{
                 if(d>0) mThis.btnNotif.text(d); else mThis.btnNotif.text(0); 
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
        

        //start: listen to "MessageReceived" event
        window.Echo.private(this.backend_channel_name).listen('.message_received',(data)=>{
             alert(JSON.stringify(data));
         });
        //end: listen to "MessageReceived" event
   
}

//});

// window.addEventListener('load',function(){
//     //load user's saved langauge by previous setting
//     LocaleManager.loadLang(null,(langContent)=>{
//         //ususally mThis.app_content_id ='_app_content'
//         main_view.setLangMenu(langContent.code);
//         LocaleManager.translateAll();
//     });
// });

$(document).ready(()=>{
    LocaleManager.loadLang(null,(langContent)=>{
        //ususally mThis.app_content_id ='_app_content'
        main_view.setLangMenu(langContent.code);
        LocaleManager.translateAll();

         //Set Default Home View => supposed to be dashboard, but now show Pickup List instead
         DashboardComponent.show(null);
    });
});