'use strict';
let main_view = new function(){
    let mThis = this;
    this.apiCluster = 'menus';
    this.onLayoutLoad = null;
    this.elScreenTitle = document.querySelector('#screen_title');
    this.elScreenTitle_mobile =  document.querySelector('#mobile_screen_title');
    this.auth_script_version =4; /** Used to automcatically clear cached AuthManager.js script on client browser */
    
    this.base_url = document.querySelector('meta[name="base_url"]').getAttribute('content'); //$('#__base_url').val();
    this.mainRoute = document.querySelector('meta[name="main_route"]').getAttribute('content');
    this.asset_url =document.querySelector('meta[name="asset_url"]').getAttribute('content'); 
    this.branch_id = document.querySelector('meta[name="sess_branch_id"]').getAttribute('content');
    this.user_id = document.querySelector('meta[name="sess_user_id"]').getAttribute('content'); 

    this.appContent = $(document.querySelector('#_app_content'));
    //this.dialogs = this.appContent.find('#_main_dialogs');
 
    this.top_right_menus = $(document.querySelector('#_main_top_right_menus'));
    this.btnTasks = this.top_right_menus.find('#_main_btn_tasks');
    this.btnLang = this.top_right_menus.find('#_main_btn_lang');
    this.btnUser = this.top_right_menus.find('#_main_btn_user');
    this.btnNotif = this.top_right_menus.find('#_main_btn_notif');
     
    this.current_view_name = '';
    this.pusher_channel = {};
    
    this.MULTI_WAREHOUSE_OP =0;
    this.DEF_TO_WAREHOUSE_ID =1;
    this.DEF_WAREHOUSE_ID =1;
   
    this.mnuLogout1 = this.top_right_menus.find('#_main_mnu_logout')[0];
    this.mnuAbout1 = this.top_right_menus.find('#_main_mnu_about')[0];
    
    if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
    }
    /** Toto: load "mThis.backend_channel_name" and other environment's vairables from backend's env directly */
    this.backend_channel_name = ['dms.backend.',this.branch_id].join('');
  
    this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        vsapi.call([mThis.base_url,'/dms/encryptData'].join(''),p).then((res)=>{
            onFinish(res.data?res.data:res);
        }); 
    }
   
    this.init = ()=>{
     //BEGIN:: process side menus click using VSRoute
       this.side_menus = document.querySelector('#kt_aside_menu_wrapper');
       this.mnuLogout = this.side_menus.querySelector('#_main_lnkLogout');
       VSRoute.init(this.side_menus.querySelectorAll('a.menu-item'),"DashboardComponent");
     //END:: process side menus click using VSRoute

        this.displayUserMenus();
        this.displayNotifications();
        this.displayTasks();

        this.top_right_menus.on('click','.lnk-lang',function(e){
            let lang = $(this).data('lang');
            LocaleManager.translateAll(lang);
            mThis.setLangMenu(lang);
            $(this).closest('.dropdown-menu').removeClass('show');
            LocaleManager.saveLang(lang);   
        });
        this.top_right_menus.on('click','.lnk-lang',function(e){
            let lang = $(this).data('lang');
            LocaleManager.translateAll(lang);
            mThis.setLangMenu(lang);
            $(this).closest('.dropdown-menu').removeClass('show');
            LocaleManager.saveLang(lang);   
        });

        this.top_right_menus.on('click','.btn-dropdown',function(e){
            e.preventDefault();
            if(mThis.prev_shown_dropdown_menus) mThis.prev_shown_dropdown_menus.removeClass('show');
            let div =  $(this).parent().find('.dropdown-menu');
            div.addClass('show');
            mThis.prev_shown_dropdown_menus = div;
        });

        $(document).on('click', function(e){
            let x = $(this).find('body div.dropdown-menu');
            let container = x.parent();
            if(container){
                if(!container.is(e.target) && container.has(e.target).length === 0){
                    x.removeClass('show');
                }
            }
            e.stopPropagation();
        });

        $(document).on('click', '.dropdown-item', function (e) {
            $(this).parent().removeClass('show');
        });
         
        this.mnuLogout1.onclick = e =>{
            cv_interact.confirm("Do you want to log out?",{
                title: "MOE Campaign Data Management",
                confirmButtonText: "Log Out",
                cancelButtonText: "No, I stay in",
                context: "delete",
                translate: true
            },(e) => {
                if(e){
                    mThis.logOut();
                }
            });
        };

        
        this.mnuLogout.addEventListener('click',e => {
            cv_interact.confirm("Do you want to log out?",{
                title: "MOE Campaign Data Management",
                confirmButtonText: "Log Out",
                cancelButtonText: "No, I stay in",
                context: "delete",
                translate: true
            },(e) => {
                if(e){
                    mThis.logOut();
                }
            });
        });

       
        if (typeof mThis.onLayoutLoad ==='function') mThis.onLayoutLoad();
    }
    //end::main_view.init()

    this.logOut = ()=>{
        mThis.deleteAllCookies();
        window.location.replace([mThis.base_url,'/logout'].join(''));
    }
    
    this.setLangMenu = (lang)=>{
        let lnkName = mThis.top_right_menus.find('#_main_lang_name');
        let lang_name = LocaleManager.langs[lang].name;
        let icon_image = LocaleManager.langs[lang].icon_image;

        let icon_url = [document.querySelector('meta[name="asset_url"]').getAttribute('content'),'/images/icons/',icon_image].join('');
        lnkName.text(lang_name);

        mThis.btnLang.find('img').attr('src',icon_url);
        mThis.btnLang.data('lang',lang);
        LocaleManager.lang = lang;
    }

    this.addNotificationItem = (notif, update_count = true) => {
        if(!notif || !notif.message) return;
        let div = mThis.top_right_menus.find('.main-notif-panel')[0];
        let emptyItems = div.querySelectorAll('.empty-item');
        emptyItems.forEach(item => item.remove());
        let newDiv = document.createElement('div');
        newDiv.classList.add('main-notif-item');
        let title = notif.title?notif.title:'General';
        if(['na','n/a'].indexOf(title.toLowerCase()) >=0 ) title = 'General';
        newDiv.innerHTML = `<span class="notif-title">${(title)}</span><span class="notif-text">${notif.message}</span>`;
        div.insertBefore(newDiv, div.firstChild);
    
        if (update_count) {
            mThis.incrementNotificationCount();
        }
    };
          
    this.changeRequestStatus = (d) => {
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

    this.setTitle = (title_prop=null)=>{
        const title = LocaleManager.trans(title_prop,'titles');
        mThis.elScreenTitle.textContent = title;
        mThis.elScreenTitle_mobile.textContent = title;
        mThis.elScreenTitle.dataset.langprop = `titles.${title_prop}`;
        mThis.elScreenTitle_mobile.dataset.langprop = `titles.${title_prop}`;
    }

    this.deleteAllCookies = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    };

    this.addTaskItem = (c={},update_count=true)=>{
        let buttons = null;
        c.request_id =c.request_id?c.request_id:c.id;
        c.request_status =c.request_status?c.request_status:c.status;
        c.request_completed =c.request_completed?c.request_completed:c.completed;

        if(c.completed ==1){
            if((c.status+'').toLowerCase() =='approved')
                buttons = `<div class="task-buttons"><span class="task-btn-approved"><i class="fa fa-check" style="color:green"></i> Approved</span></div>`;
            else
                buttons = `<div class="task-buttons"><span class="task-btn-rejected"><i class="fa fa-times" style="color:red"></i> Rejected</span></div>`;     
        }
        else{
            buttons = `<div class="task-buttons form-inline">
            <button data-id="${c.request_id}" data-status="${c.request_status}" class="btn btn-sm btn-danger btn-reject-request">Reject</button>&nbsp;
            <button data-id="${c.request_id}" class="btn btn-sm btn-success btn-approve-request">Approve</button>
            </div>`;
        }
                     
        let item =`<div class="main-task-item" data-id="${c.request_id}" data-completed="${c.request_completed}" data-status="${c.request_status}">
        <span class="task-title">${c.title}</span>
        <span class="task-text">${c.description}</span>
                ${buttons}
        </div>`;
               
        mThis.top_right_menus.find('div.main-task-panel').prepend(item);
        if(update_count) mThis.incrementTaskCount();    
    }

    this.displayUserMenus = ()=>{
        return;
    }

    this.displayNotifications = ()=> {
        vsapi.call(`${mThis.base_url}/dms/notifications`,null).then((res)=>{
            let i=0;
            if(res.status_code ===200){
                let d = res.data;
                if(d) {
                    let items = d.items;
                    const notifCount = mThis.btnNotif.find('span.number--notification');
                    notifCount.text(d.unread_count);
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
                let empty_item =`<div class="main-notif-item empty-item"><span class="p-1 text-muted text-center">No Notifications</span></div>`;
                mThis.top_right_menus.find('div.main-notif-panel').html(empty_item);
            }
        });
    };

    this.setTaskCount = (c)=>{
        mThis.btnTasks.data('count',c).text(c);
    }

    this.setNotificationCount = (c)=>{
        mThis.btnNotif.data('count',c).find('.number--notification').text(c);
    }

    this.displayTasks =()=> {
        let items =null;
        vsapi.call(`${mThis.base_url}/dms/pending-requests`,null).then((res)=>{
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
        vsapi.call(`${mThis.base_url}/dms/unread-count`,null,false).then((res)=>{
            if(res.status_code ===200){
                let d = res.data;
                const span = mThis.btnNotif.find('.number--notification');
                if(d > 0) span.text(d); else span.text(0); 
                if(d > 0) mThis.btnNotif.data('count',d); else mThis.btnNotif.data('count',0); 
            }
        });
    }
    
    mThis.incrementNotificationCount = ()=>{
        const notifCount_span = mThis.btnNotif.find('span.number--notification');
        let d = mThis.btnNotif.data('count');
        d = d>=0?d:0;
        d++;
        notifCount_span.text(d);
        mThis.btnNotif.data('count',d);         
    }

    mThis.incrementTaskCount = ()=>{
        let d = mThis.btnTasks.data('count');
        d = d>=0?d:0;
        d++;
        mThis.btnNotif.text(d).data('count',d);
    }  
};



window.addEventListener('DOMContentLoaded',function(){
    main_view.init();
    LocaleManager.translateZone(main_view.appContent);
    main_view.setLangMenu(LocaleManager.currentLanguage.code);
});

const inputs = main_view.VSAppContent.querySelectorAll('input[type="text"], input[type="number"]');
inputs.forEach(el => {
    el.onselect = function(e) {
        e.preventDefault();
    };

    el.onfocus = function(e) {
        e.preventDefault();
    };
});

// window.oncontextmenu = function(){
//     return false;
// }

// document.onkeydown = function(e){
//     if(window.event.keyCode == 123 ||  e.button == 2)    
//         return false;
// }