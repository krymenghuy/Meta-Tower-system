'use strict';
var main_view = (()=>{
    const mThis = {};
    mThis.apiCluster = 'menus';
    mThis.onLayoutLoad = null;
    mThis.elScreenTitle = document.querySelector('#screen_title');
    mThis.elScreenTitle_mobile =  document.querySelector('#mobile_screen_title');
    
    mThis.base_url = document.querySelector('meta[name="base_url"]').getAttribute('content');
    //mThis.mainRoute = document.querySelector('meta[name="main_route"]').getAttribute('content');
    mThis.asset_url =document.querySelector('meta[name="asset_url"]').getAttribute('content'); 
    mThis.branch_id = document.querySelector('meta[name="sess_branch_id"]').getAttribute('content');
    mThis.user_id = document.querySelector('meta[name="sess_user_id"]').getAttribute('content'); 
    mThis.subs_id = document.querySelector('meta[name="subs_id"]').getAttribute('content'); 
    mThis.app_id = document.querySelector('meta[name="app_id"]').getAttribute('content');

    mThis.VSAppContent = document.querySelector('#_app_content');
    //mThis.appContent = $(mThis.VSAppContent); //should no longer use it !!!
   
    mThis.auth_script_url = 'https://cdn.vectoraclouds.com/frontcore/utils/AuthManager.v2.js';
    //mThis.auth_script_url = [mThis.asset_url,'/js/AuthManager.v2.js?v=5'].join('');
    mThis.secure_endpoint =  [mThis.base_url,'/api/1a2b3c4d5e6f7g8h9i0j1k2l3m/en'].join('');
    mThis.top_right_menus = document.querySelector('#_main_top_right_menus');
      
    // mThis.btnTasks = mThis.top_right_menus.querySelector('#_main_btn_tasks');
    mThis.btnLang = mThis.top_right_menus.querySelector('#_main_btn_lang');
    mThis.btnUser = mThis.top_right_menus.querySelector('#_main_btn_user');
    mThis.btnNotif = mThis.top_right_menus.querySelector('#_main_btn_notif');
     
    mThis.current_view_name = '';
    mThis.pusher_channel = {};
    
    mThis.MULTI_WAREHOUSE_OP =1;
    mThis.DEF_TO_WAREHOUSE_ID =1;
    mThis.DEF_WAREHOUSE_ID =1;
   
    mThis.mnuLogout = mThis.top_right_menus.querySelector('#_main_mnu_logout');
    mThis.mnuAbout1 = mThis.top_right_menus.querySelector('#_main_mnu_about');
    
    if (!mThis.branch_id || !mThis.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
    }
    /** Toto: load "mThis.backend_channel_name" and other environment's vairables from backend's env directly */
    mThis.backend_channel_name = ['ypg_backend_',(mThis.subs_id || '').toLowerCase()].join('');
    mThis.getEncryptData = (qstring,onFinish)=>{
        const p = {'data':qstring};
        vsapi.call([mThis.base_url,'/api/vs-encrypt031181'].join(''),p).then((res)=>{
            onFinish(res.data || res);
        }); 
    }
  
mThis.init_vsapi = async () => {
  await vsapi.init({
    authType: vsapi.authTypes.BEARER,
    //fetchTokenUrl:'/api/vsx-sec/token',
    tokenResolver: async () => {
      const res = await fetch('/api/vsx-sec/token', { 
         credentials: 'include',
         headers: {
         'X-Requested-With': 'XMLHttpRequest'
        } 
     });
      const json = await res.json();
      if(json.status_code == 200){
         return json.data.token;
      }else{
        alert('[vsapi] tokenResolver() got error: ' + json.error_message);
        return null;
      }
    },
    defaultLoaderSelector: '#vs_loader',
    useStreamingProgress: true,
    //useCache: true,
    //cacheTTL: 3000,

    // online: () => {
    //   console.log('🟢 Back online');
    // },

    // offline: () => {
    //   console.warn('🔴 Connection lost');
    // }
    // You can later add: resolveAuthHeaders, or switch authType to 'custom' etc.
  });
};
    mThis.init = async()=>{
      //window.Sanitizer  = window.Sanitizer || StringSanitizer || null;
     //BEGIN:: process side menus click using VSRoute
       mThis.side_menus = document.querySelector('#_dms_aside_menus');
       
      //Sanitizer.setDebugMode(false);     
      VSRoute.init(mThis.side_menus.querySelectorAll('a.menu-item'),"DashboardComponent",mThis.side_menus,true);

     //END:: process side menus click using VSRoute

        mThis.displayUserMenus();
        mThis.displayNotifications();
        //mThis.displayTasks();

        mThis.top_right_menus.onclick = e =>{
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
            let lang = btn.dataset.lang;
            LocaleManager.translateAll(lang);
            mThis.setLangMenu(lang);
            btn.closest('.dropdown-menu').classList.remove('show');
            LocaleManager.saveLang(lang);   
            return;
           }
        }
    
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
        
        mThis.lnkLogout = mThis.side_menus.querySelector('#_main_lnkLogout'); 
        mThis.lnkLogout.onclick = e =>{
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

        
        mThis.mnuLogout.addEventListener('click',e => {
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

    mThis.logOut = ()=>{
        mThis.deleteAllCookies();
        window.location.replace([mThis.base_url,'/logout'].join(''));
    }
    
    mThis.setLangMenu = (lang)=>{
        let lnkName = mThis.top_right_menus.querySelector('#_main_lang_name');
        let lang_name = LocaleManager.langs[lang].name;
        let icon_image = LocaleManager.langs[lang].icon_image;

        let icon_url = [document.querySelector('meta[name="asset_url"]').getAttribute('content'),'/images/icons/',icon_image].join('');
        lnkName.textContent =  lang_name;

        mThis.btnLang.querySelector('img').setAttribute('src',icon_url);
        mThis.btnLang.dataset.lang = lang;
        LocaleManager.lang = lang;
        const body = document.body;
        body.classList.remove('font-kh', 'font-en');
        if (lang === 'km') {
            body.classList.add('font-kh');
        } else {
            body.classList.add('font-en');
        }
    }

    mThis.addNotificationItem = (notif, update_count = true) => {
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
          
    mThis.changeRequestStatus = (d) => {
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

    mThis.setTitle = (title_prop=null)=>{
        const title = LocaleManager.trans(title_prop,'titles');
        mThis.elScreenTitle.textContent = title;
        mThis.elScreenTitle_mobile.textContent = title;
          mThis.elScreenTitle.setAttribute('vslang', `titles.${title_prop}`);
        // mThis.elScreenTitle.dataset.vslang = `titles.${title_prop}`;
        mThis.elScreenTitle_mobile.setAttribute('vslang', `titles.${title_prop}`);
    }

    mThis.deleteAllCookies = () => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
    };

    mThis.addTaskItem = (c={},update_count=true)=>{
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

    mThis.displayUserMenus = ()=>{
        return;
    }

    mThis.displayNotifications = ()=> {
        vsapi.call(`${mThis.base_url}/api/user/notifications`,null,{useCache:false,cacheTTL:3000}).then((res)=>{
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

    // mThis.setTaskCount = (c)=>{
    //     if(!mThis.btnTasks) return;
    //     mThis.btnTasks.dataset,count = c;
    //     mThis.btnTasks.textContent = c;
    // }

    mThis.setNotificationCount = (c)=>{
        mThis.btnNotif.dataset.count = c;
        mThis.btnNotif.querySelector('.number--notification').textContent = c;
    }

    // mThis.displayTasks =()=> {
    //     //let items =null;
    //     vsapi.call(`${mThis.base_url}/api/user/pending-requests`,null,{useCache:false, cacheTTL:3000}).then((res)=>{
    //         if(res.status_code===200){
    //             let d = res.data;
    //             let i=0;
    //             let c;
    //             do{
    //                 c =d[i];
    //                     if(!c) break;
    //                     mThis.addTaskItem(c,false);
    //                 i++;
    //             }while(c);
                    
    //             if(i==0) {
    //                 let item =`<div class="main-task-item">
    //                         <span class="task-text">No pending requests</span>     
    //                     </div>`;
    //                     let html = `<div class="dropdown-menu dropdown-menu-right">
    //                         <span class="task-header">Requests</span> 
    //                         <div class="main-task-panel">
    //                             ${item}
    //                         </div>
    //                     </div>`;
    //                     if(mThis.btnTasks){
    //                         const p = mThis.btnTasks.parentElement;   
    //                         if(p) p.insertAdjacentHTML("beforeend",html);
    //                     }
                    
    //             }
    //             mThis.setTaskCount(i);
    //         }
    //     });
    // };

    mThis.updateNotificationCount = ()=>{
        vsapi.call(`${mThis.base_url}/api/user/unread-count`,null,{useCache:false,cacheTTL:3000}).then((res)=>{
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

    // mThis.incrementTaskCount = ()=>{
    //     let d = mThis.btnTasks.dataset.count;
    //     d = d>=0?d:0;
    //     d++;
    //     mThis.btnNotif.textContent = d;
    //     mThis.btnNotif.dataset.count = d;
    // }
    
    mThis.setContentView = (viewInstance, title_prop = null) => {
        const siblings = Array.from(viewInstance.parentElement.children);
        
        // Hide all siblings smoothly
        siblings.forEach((div) => {
            if (div !== viewInstance && div.style.display !== 'none') {
                div.style.display = 'none';
            }
        });
    
        // // Prepare the target view for fade-in
        // if (viewInstance.style.display !== 'block') {
        //     viewInstance.style.display = 'block';
        //     viewInstance.style.opacity = 0;
        // }
    
        // // Ensure transition is applied only after display change
        // requestAnimationFrame(() => {
        //     viewInstance.style.transition = 'opacity 200ms';
        //     viewInstance.style.opacity = 1;
        // });
        viewInstance.style.display = 'block';
        // Set the title if provided
        if (title_prop) mThis.setTitle(title_prop);
    };

    return mThis;
})();
//end::main_view module
 
window.addEventListener('DOMContentLoaded',async()=>{
    VSUtil.defaultStyle = 'material';
    await main_view.init_vsapi();
    await VSMoney.init();
    main_view.init();
    LocaleManager.translateZone(main_view.VSAppContent);
    main_view.setLangMenu(LocaleManager.currentLanguage.code);

    const inputs = main_view.VSAppContent.querySelectorAll("input");

    DateTimePicker.destroyAll();
    inputs.forEach(el =>{
        const type = el.getAttribute('type') ?? el.dataset.select ?? '';
        if(['date','daterange','datepicker'].indexOf(type.toLowerCase()) >= 0){
            new DateTimePicker(el,null);
        }  
        el.onselect = function(e){
            e.preventDefault();
        }

        el.onfocus = function(e){
            e.preventDefault();
        }
    });
});
  
// window.oncontextmenu = function(){
//     return false;
// }

// document.onkeydown = function(e){
//     if(window.event.keyCode == 123 ||  e.button == 2)    
//         return false;
// }