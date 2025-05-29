'use strict';
const main_view = new function(){
    const mThis = this;
    this.apiCluster = 'menus';
    this.onLayoutLoad = null;
    this.elScreenTitle = document.querySelector('#screen_title');
    this.divTitle = this.elScreenTitle.closest('div.screen-info');

    this.elScreenTitle_mobile =  document.querySelector('#mobile_screen_title');
    this.currency = {symbol: '<span class="fs-6 fw-bold hl-1">៛</span>', name :'KHR'};
    this.base_currency = 'KHR';
    this.national_currency = 'KHR';
    this.payroll_currency = 'USD';
    this.base_url = document.querySelector('meta[name="base_url"]').getAttribute('content'); //$('#__base_url').val();
    //this.mainRoute = document.querySelector('meta[name="main_route"]').getAttribute('content');
    this.asset_url =document.querySelector('meta[name="asset_url"]').getAttribute('content');
    this.branch_id = document.querySelector('meta[name="sess_branch_id"]').getAttribute('content');
    this.user_id = document.querySelector('meta[name="sess_user_id"]').getAttribute('content');
    this.subs_id = document.querySelector('meta[name="subs_id"]').getAttribute('content');
    this.app_id = document.querySelector('meta[name="app_id"]').getAttribute('content');

    /** Used to automcatically clear cached AuthManager.js script on client browser */
    this.auth_script_url = [this.asset_url,'/js/AuthManager.v2.js?v=5'].join('');
    this.secure_endpoint =  [this.base_url,'/api/1a2b3c4d5e6f7g8h9i0j1k2l3m/en'].join('');
    //this.auth_script_version =4;

    this.VSAppContent = document.querySelector('#_app_content');
    this.appContent = $(this.VSAppContent);

    this.top_right_menus = document.querySelector('#_main_top_right_menus');
    this.btnTasks = this.top_right_menus.querySelector('#_main_btn_tasks');
    this.btnLang = this.top_right_menus.querySelector('#_main_btn_lang');
    this.btnUser = this.top_right_menus.querySelector('#_main_btn_user');
    this.btnNotif = this.top_right_menus.querySelector('#_main_btn_notif');

    this.current_view_name = '';
    this.pusher_channel = {};

    this.MULTI_WAREHOUSE_OP =1;
    this.DEF_TO_WAREHOUSE_ID =1;
    this.DEF_WAREHOUSE_ID =1;

    this.mnuLogout = this.top_right_menus.querySelector('#_main_mnu_logout');
    this.mnuAbout1 = this.top_right_menus.querySelector('#_main_mnu_about');

    if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
    }
    /** Toto: load "mThis.backend_channel_name" and other environment's vairables from backend's env directly */
    this.backend_channel_name = ['bhr.backend.',this.branch_id].join('');

    // // event onShowComponent() is triggered when any component is shown
    // this.onShowComponent =  (component)=>{
    //     main_view.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
    //    if(!component) return;

    //    switch(component.id){
    //     case 200:{
    //         let btn = main_view.divTitle.querySelector('.btn-db-fitler');
    //         if(btn) return;
    //           main_view.divTitle.insertAdjacentHTML('beforeend','<div class="div-db-filter"><button class="btn-db-fitler btn btn-sm btn-primary"><i class="fa fa-list"></i></button></div>');
    //           btn = main_view.divTitle.querySelector('.btn-db-fitler');
    //           if(btn){
    //              main_view.initDashboardFilter(btn);
    //           }
    //         break;
    //     }
    //     default:{
    //         const div = main_view.divTitle.querySelector('div.div-db-filter');
    //         if(div) div.remove();
    //     }
    //    }

    // };

    this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        vsapi.call([mThis.base_url,'/api/vs-encrypt031181'].join(''),p).then((res)=>{
            onFinish(res.data || res);
        }); 
    };

    this.init = ()=>{
      window.Sanitizer  = window.Sanitizer || StringSanitizer;
     //BEGIN:: process side menus click using VSRoute
       this.side_menus = document.querySelector('#kt_aside_menu_wrapper');
       this.lnkLogout = this.side_menus.querySelector('#_main_lnkLogout');

       VSRoute.init(this.side_menus.querySelectorAll('a.menu-item'),"DashboardComponent",this.side_menus,false);
     //END:: process side menus click using VSRoute

        this.displayUserMenus();
        this.displayNotifications();
        this.displayTasks();

        this.top_right_menus.onclick = e =>{
           let btn = VSUtil.closestLimited(e.target,'.btn-dropdown');
           if(btn){
                let div =  e.target.closest('div.dropdown').querySelector('.dropdown-menu');
                if(mThis.prev_shown_dropdown_menus && mThis.prev_shown_dropdown_menus !== div) mThis.prev_shown_dropdown_menus.classList.remove('show');
                if(div){
                    div.classList.toggle('show');
                    if (div.classList.contains('show')) mThis.prev_shown_dropdown_menus = div;
                }
                return;
           }

           btn = VSUtil.closestLimited(e.target,'.lnk-lang');
           if(btn){
            const lang = btn.dataset.lang;
            LocaleManager.translateAll(lang);
            mThis.setLangMenu(lang);
            btn.closest('.dropdown-menu').classList.remove('show');
            LocaleManager.saveLang(lang, (d)=>{
                 LocaleManager.translateAll(lang);
            });
            return;
           }
        }

        // $(document).on('click', function(e){
        //     let x = $(this).find('body div.dropdown-menu');
        //     let container = x.parent();
        //     if(container){
        //         if(!container.is(e.target) && container.has(e.target).length === 0){
        //             x.removeClass('show');
        //         }
        //     }
        //     e.stopPropagation();
        // });

        document.addEventListener('click', e => {
            let dropdownMenu =  mThis.prev_shown_dropdown_menus ; // //document.querySelector('.dropdown-menu');
            // Get the container element
            let container = dropdownMenu ? dropdownMenu.closest('.dropdown') : null;

            if (container) {
                // Check if the click target is outside the container
                if (!container.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            }

            if (e.target.matches('.dropdown-item')) {
                // Get the parent element and remove the 'show' class
                e.target.parentElement.classList.remove('show');
            }
        });

        // $(document).on('click', '.dropdown-item', function (e) {
        //     $(this).parent().removeClass('show');
        // });

        this.lnkLogout.onclick = e =>{
            cv_interact.confirm("Do you want to log out?",{
                title: "Sign Out",
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
                title: "Sign Out",
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
        let lnkName = mThis.top_right_menus.querySelector('#_main_lang_name');
        let lang_name = LocaleManager.langs[lang].name;
        let icon_image = LocaleManager.langs[lang].icon_image;

        let icon_url = [document.querySelector('meta[name="asset_url"]').getAttribute('content'),'/images/icons/',icon_image].join('');
        lnkName.textContent =  lang_name;

        mThis.btnLang.querySelector('img').setAttribute('src',icon_url);
        mThis.btnLang.dataset.lang = lang;
        LocaleManager.lang = lang;
    }

    this.addNotificationItem = (notif, update_count = true) => {
        if(!notif || !notif.message) return;
        let div = mThis.top_right_menus.querySelector('.main-notif-panel');
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

        let div = mThis.top_right_menus.querySelector('div.main-task-panel');
        let el =null;
        div.querySelectorAll('.main-task-item').forEach(el =>{
            if(el.dataset.id == d.request_id) return false;
        });

        if(el) {
            let v = el.querySelector('div.task-buttons');
            let buttons = null;

            if(d.request_completed == 1) {
                if((d.request_status+'').toLowerCase() =='approved')
                    buttons = `<span class="task-btn-approved"><i class="fa fa-check" style="color:green"></i> Approved</span>`;
                else
                    buttons = `<span class="task-btn-rejected"><i class="fa fa-times" style="color:red"></i> Rejected</span>`;
            }
            v.innerHTML = buttons;
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
        vsapi.call(`${mThis.base_url}/api/user/notifications`,null,false,false).then((res)=>{
            let i=0;
            if(res.status_code ===200){
                let d = res.data;
                if(d) {
                    let items = d.items;
                    const notifCount = mThis.btnNotif.querySelector('span.number--notification');
                    notifCount.textContent =  d.unread_count;
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
                mThis.top_right_menus.querySelector('div.main-notif-panel').innerHTML =  empty_item;
            }
        });
    };

    this.setTaskCount = (c)=>{
        if(!mThis.btnTasks) return;
        mThis.btnTasks.dataset,count = c;
        mThis.btnTasks.textContent = c;
    }

    this.setNotificationCount = (c)=>{
        mThis.btnNotif.dataset.count = c;
        mThis.btnNotif.querySelector('.number--notification').textContent = c;
    }

    this.displayTasks =()=> {
        let items =null;
        vsapi.call(`${mThis.base_url}/api/user/pending-requests`,null,false,false).then((res)=>{
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
                        if(mThis.btnTasks){
                            const p = mThis.btnTasks.parentElement;
                            if(p) p.insertAdjacentHTML("beforeend",html);
                        }

                }
                mThis.setTaskCount(i);
            }
        });
    };

    mThis.updateNotificationCount = ()=>{
        vsapi.call(`${mThis.base_url}/api/user/unread-count`,null,false,false).then((res)=>{
            if(res.status_code ===200){
                let d = res.data;
                const span = mThis.btnNotif.querySelector('.number--notification');
                if(d > 0) span.textContent =  d; else span.textContent = 0;
                if(d > 0) mThis.btnNotif.dataset.count = d ; else mThis.btnNotif.dataset.count = 0;
            }
        });
    }

    mThis.incrementNotificationCount = ()=>{
        const notifCount_span = mThis.btnNotif.querySelector('span.number--notification');
        let d = mThis.btnNotif.dataset.count;
        d = d>=0?d:0;
        d++;
        notifCount_span.textContent = d;
        mThis.btnNotif.dataset.count = d;
    }

    mThis.incrementTaskCount = ()=>{
        let d = mThis.btnTasks.dataset.count;
        d = d>=0?d:0;
        d++;
        mThis.btnNotif.textContent = d;
        mThis.btnNotif.dataset.count = d;
    }


    mThis.setContentView = (viewInstance, title_prop = null) => {
        const siblings = Array.from(viewInstance.parentElement.children);
        
        // Hide all siblings smoothly
        siblings.forEach((div) => {
            if (div !== viewInstance && div.style.display !== 'none') {
                div.style.display = 'none';
            }
        });
        viewInstance.style.display = 'block';
        // Set the title if provided
        if (title_prop) mThis.setTitle(title_prop);
    };

};

window.addEventListener('DOMContentLoaded',function(){

    // function setUpChatIdentity(user){
    //     window.$crisp.push(["set", "user:email", user.email]);
    //     window.$crisp.push(["set", "user:nickname", user.login_name]);
    //     window.$crisp.push(["set", "user:phone", user.phone_number]);
    //     window.$crisp.push(["set", "user:avatar", user.avatar ?? user.image_url]);
    //     window.$crisp.push(["set", "user:company", ['HOUXPRESS']]);
    //     window.$crisp.push(["set", "session:data", [
    //       ["user_class", user.user_class],
    //       ["role_id", user.role_id],
    //       ["role_name", user.role_name]
    //     ]]);
    // }

    main_view.init();
    //VSRoute.onShowComponent = main_view.onShowComponent;

    LocaleManager.translateZone(main_view.appContent);
    main_view.setLangMenu(LocaleManager.currentLanguage.code);
    VSMoney.init();

    // if(typeof AuthManager =='undefined'){
    //     VSRoute.loadScript(main_view.auth_script_url).then(()=>{
    //         AuthManager.init().then(user =>{
    //             window.$crisp = [];
    //             window.CRISP_WEBSITE_ID = "0ba03a66-8247-48cc-b23f-de9f433b8635";
    //             (function() {
    //                 const d = document;
    //                 let s = d.createElement("script");
    //                 s.src = "https://client.crisp.chat/l.js";
    //                 s.async = 1;
    //                 d.getElementsByTagName("head")[0].appendChild(s);
    //                 setUpChatIdentity(user);
    //             })();
    //         });
    //     });

    // }
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
