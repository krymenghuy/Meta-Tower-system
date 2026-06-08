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
   
    mThis.auth_script_url ="https://cdn.vectoraclouds.com/frontcore/utils/AuthManager.v2.js?v=2";
    //mThis.auth_script_url = mThis.base_url +  "/assets/js/AuthManager.v2.js?v=2";

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

    // function channelPrefix(){
    //     return 'vsksmkidsworld';
    // }

    // mThis.createChannelName = () => {
    //     const subs_id = mThis.subs_id;
    //     const user_id = mThis.user_id;
    //     const branch_id = mThis.branch_id;
    //     const user_class = mThis.user_class;

    //     if (user_id && user_id > 0) {
    //         return channelPrefix() + "_backend_" + subs_id + "_" + user_id;
    //     } else {
    //         if (branch_id && branch_id > 0 && user_class) {
    //             return channelPrefix() + "_backend_" + subs_id + "_" + branch_id + "_" + user_class;
    //         } else if (branch_id && branch_id > 0) {
    //             return channelPrefix() + "_backend_" + subs_id + "_" + branch_id;
    //         } else if (user_class) {
    //             return channelPrefix() + "_backend_" + subs_id + "_" + user_class;
    //         } else {
    //             return channelPrefix() + "_backend_" + subs_id;
    //         }
    //     }
    // };

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
    //   console.log('ðŸŸ¢ Back online');
    // },

    // offline: () => {
    //   console.warn('ðŸ”´ Connection lost');
    // }
    // You can later add: resolveAuthHeaders, or switch authType to 'custom' etc.
  });
};
    mThis.init = async()=>{
      //window.Sanitizer  = window.Sanitizer || StringSanitizer || null;
     //BEGIN:: process side menus click using VSRoute
       mThis.side_menus = document.querySelector('#_dms_aside_menus');
       
      //Sanitizer.setDebugMode(false);     
      VSRoute.init(mThis.side_menus.querySelectorAll('a.menu-item'),"DashboardComponent",mThis.side_menus,{debug:true});

      // Same contract UI as PRM: allow menu href ContractComponent or ContractsComponent
      if (typeof ContractsComponent !== 'undefined' && typeof ContractComponent === 'undefined') {
          window.ContractComponent = ContractsComponent;
      } else if (typeof ContractComponent !== 'undefined' && typeof ContractsComponent === 'undefined') {
          window.ContractsComponent = ContractComponent;
      }

      // Same invoice UI as PRM: allow menu href InvoicesComponent or InvoiceComponent
      if (typeof InvoiceComponent !== 'undefined' && typeof InvoicesComponent === 'undefined') {
          window.InvoicesComponent = InvoiceComponent;
      } else if (typeof InvoicesComponent !== 'undefined' && typeof InvoiceComponent === 'undefined') {
          window.InvoiceComponent = InvoicesComponent;
      }

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
"use strict";
class SearchWidget{
    constructor(container, options = null){
        const defaults = {
            searchIcon:'fa fa-search',
            inputClass: 'form-control border border-secondary rounded-3',
            onkeyup:()=>{ return;}
        }

       options = options || defaults;
       options.onkeyup = (typeof options.onkeyup ==='function')? options.onkeyup: defaults.onkeyup;
       options.searchIcon =   options.searchIcon || defaults.searchIcon;
       options.inputClass = options.inputClass || defaults.inputClass;
       this.options = options;
       this.container = container;
       this.container.innerHTML = '<a href="javascript:void(0)" class="sw-search-lnk"><i class="fa fa-search fs-5"></i></a>';
       this.state = 0; /** not in search mode */
       const that = this;

       this.container.dataset.state = 0;
       this.container.addEventListener('click', e=>{
          e.preventDefault();
          let lnk = e.target.closest('.sw-search-lnk');
          if (lnk){
            that.setState(null);
          }
          
       });
    }

    setState(state=null){
      if(state == 0){
        this.container.innerHTML = '<a href="javascript:void(0)" class="sw-search-lnk"><i class="fa fa-search fs-5"></i></a>';
      } else if (state==1){
        this.container.innerHTML = ['<input class="sw-search-input ',this.options.inputClass,'" placeholder="',this.options.placeHolder,'">'].join('');
        let el = this.container.querySelector('.sw-search-input');
        const that = this;
        if(el){
            el.focus();
            el.select();

             el.onkeyup = e=>{
                 e.preventDefault();
                 that.options.onkeyup(el.value, e);
             }
             el.onmouseenter = e=>{
                el.dataset.isfocus =1;
                clearTimeout(that.mTimeout);  
             }
             el.onmouseleave = e=>{
                e.preventDefault();
                el.dataset.isfocus =0; 
                let tog_state = this.state ==1? 0 : 1;
                if(!el.value || (tog_state + '').trim() ==''){
                    that.mTimeout =  setTimeout(()=>{
                        if (el.dataset.isfocus == 0) that.setState(0);
                     },1000);
                }
             }
        }
         
      } else{
         let tog_state = this.state ==1? 0 : 1;
         this.setState(tog_state);
      }
    }

    getState(){
      return this.state;
    }
    getValue(){
       if(this.state ==1){
         const el = this.container.querySelector('.sw-search-input');
         return el? el.value: null;
       }else return null;   
    }

    setValue(value){
        if(this.state ==1){
          const el = this.container.querySelector('.sw-search-input');
          el.value = value;
        }
     }

}

/*!
 * Pusher JavaScript Library v8.0.1
 * https://pusher.com/
 *
 * Copyright 2020, Pusher
 * Released under the MIT licence.
 */
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Pusher=e():t.Pusher=e()}(window,(function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(r,o,function(e){return t[e]}.bind(null,o));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";var r,o=this&&this.__extends||(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)});Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(t){void 0===t&&(t="="),this._paddingCharacter=t}return t.prototype.encodedLength=function(t){return this._paddingCharacter?(t+2)/3*4|0:(8*t+5)/6|0},t.prototype.encode=function(t){for(var e="",n=0;n<t.length-2;n+=3){var r=t[n]<<16|t[n+1]<<8|t[n+2];e+=this._encodeByte(r>>>18&63),e+=this._encodeByte(r>>>12&63),e+=this._encodeByte(r>>>6&63),e+=this._encodeByte(r>>>0&63)}var o=t.length-n;if(o>0){r=t[n]<<16|(2===o?t[n+1]<<8:0);e+=this._encodeByte(r>>>18&63),e+=this._encodeByte(r>>>12&63),e+=2===o?this._encodeByte(r>>>6&63):this._paddingCharacter||"",e+=this._paddingCharacter||""}return e},t.prototype.maxDecodedLength=function(t){return this._paddingCharacter?t/4*3|0:(6*t+7)/8|0},t.prototype.decodedLength=function(t){return this.maxDecodedLength(t.length-this._getPaddingLength(t))},t.prototype.decode=function(t){if(0===t.length)return new Uint8Array(0);for(var e=this._getPaddingLength(t),n=t.length-e,r=new Uint8Array(this.maxDecodedLength(n)),o=0,i=0,s=0,c=0,a=0,u=0,h=0;i<n-4;i+=4)c=this._decodeChar(t.charCodeAt(i+0)),a=this._decodeChar(t.charCodeAt(i+1)),u=this._decodeChar(t.charCodeAt(i+2)),h=this._decodeChar(t.charCodeAt(i+3)),r[o++]=c<<2|a>>>4,r[o++]=a<<4|u>>>2,r[o++]=u<<6|h,s|=256&c,s|=256&a,s|=256&u,s|=256&h;if(i<n-1&&(c=this._decodeChar(t.charCodeAt(i)),a=this._decodeChar(t.charCodeAt(i+1)),r[o++]=c<<2|a>>>4,s|=256&c,s|=256&a),i<n-2&&(u=this._decodeChar(t.charCodeAt(i+2)),r[o++]=a<<4|u>>>2,s|=256&u),i<n-3&&(h=this._decodeChar(t.charCodeAt(i+3)),r[o++]=u<<6|h,s|=256&h),0!==s)throw new Error("Base64Coder: incorrect characters for decoding");return r},t.prototype._encodeByte=function(t){var e=t;return e+=65,e+=25-t>>>8&6,e+=51-t>>>8&-75,e+=61-t>>>8&-15,e+=62-t>>>8&3,String.fromCharCode(e)},t.prototype._decodeChar=function(t){var e=256;return e+=(42-t&t-44)>>>8&-256+t-43+62,e+=(46-t&t-48)>>>8&-256+t-47+63,e+=(47-t&t-58)>>>8&-256+t-48+52,e+=(64-t&t-91)>>>8&-256+t-65+0,e+=(96-t&t-123)>>>8&-256+t-97+26},t.prototype._getPaddingLength=function(t){var e=0;if(this._paddingCharacter){for(var n=t.length-1;n>=0&&t[n]===this._paddingCharacter;n--)e++;if(t.length<4||e>2)throw new Error("Base64Coder: incorrect padding")}return e},t}();e.Coder=i;var s=new i;e.encode=function(t){return s.encode(t)},e.decode=function(t){return s.decode(t)};var c=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return o(e,t),e.prototype._encodeByte=function(t){var e=t;return e+=65,e+=25-t>>>8&6,e+=51-t>>>8&-75,e+=61-t>>>8&-13,e+=62-t>>>8&49,String.fromCharCode(e)},e.prototype._decodeChar=function(t){var e=256;return e+=(44-t&t-46)>>>8&-256+t-45+62,e+=(94-t&t-96)>>>8&-256+t-95+63,e+=(47-t&t-58)>>>8&-256+t-48+52,e+=(64-t&t-91)>>>8&-256+t-65+0,e+=(96-t&t-123)>>>8&-256+t-97+26},e}(i);e.URLSafeCoder=c;var a=new c;e.encodeURLSafe=function(t){return a.encode(t)},e.decodeURLSafe=function(t){return a.decode(t)},e.encodedLength=function(t){return s.encodedLength(t)},e.maxDecodedLength=function(t){return s.maxDecodedLength(t)},e.decodedLength=function(t){return s.decodedLength(t)}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r="utf8: invalid source encoding";function o(t){for(var e=0,n=0;n<t.length;n++){var r=t.charCodeAt(n);if(r<128)e+=1;else if(r<2048)e+=2;else if(r<55296)e+=3;else{if(!(r<=57343))throw new Error("utf8: invalid string");if(n>=t.length-1)throw new Error("utf8: invalid string");n++,e+=4}}return e}e.encode=function(t){for(var e=new Uint8Array(o(t)),n=0,r=0;r<t.length;r++){var i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=192|i>>6,e[n++]=128|63&i):i<55296?(e[n++]=224|i>>12,e[n++]=128|i>>6&63,e[n++]=128|63&i):(r++,i=(1023&i)<<10,i|=1023&t.charCodeAt(r),i+=65536,e[n++]=240|i>>18,e[n++]=128|i>>12&63,e[n++]=128|i>>6&63,e[n++]=128|63&i)}return e},e.encodedLength=o,e.decode=function(t){for(var e=[],n=0;n<t.length;n++){var o=t[n];if(128&o){var i=void 0;if(o<224){if(n>=t.length)throw new Error(r);if(128!=(192&(s=t[++n])))throw new Error(r);o=(31&o)<<6|63&s,i=128}else if(o<240){if(n>=t.length-1)throw new Error(r);var s=t[++n],c=t[++n];if(128!=(192&s)||128!=(192&c))throw new Error(r);o=(15&o)<<12|(63&s)<<6|63&c,i=2048}else{if(!(o<248))throw new Error(r);if(n>=t.length-2)throw new Error(r);s=t[++n],c=t[++n];var a=t[++n];if(128!=(192&s)||128!=(192&c)||128!=(192&a))throw new Error(r);o=(15&o)<<18|(63&s)<<12|(63&c)<<6|63&a,i=65536}if(o<i||o>=55296&&o<=57343)throw new Error(r);if(o>=65536){if(o>1114111)throw new Error(r);o-=65536,e.push(String.fromCharCode(55296|o>>10)),o=56320|1023&o}}e.push(String.fromCharCode(o))}return e.join("")}},function(t,e,n){t.exports=n(3).default},function(t,e,n){"use strict";n.r(e);var r,o=function(){function t(t,e){this.lastId=0,this.prefix=t,this.name=e}return t.prototype.create=function(t){this.lastId++;var e=this.lastId,n=this.prefix+e,r=this.name+"["+e+"]",o=!1,i=function(){o||(t.apply(null,arguments),o=!0)};return this[e]=i,{number:e,id:n,name:r,callback:i}},t.prototype.remove=function(t){delete this[t.number]},t}(),i=new o("_pusher_script_","Pusher.ScriptReceivers"),s={VERSION:"8.0.1",PROTOCOL:7,wsPort:80,wssPort:443,wsPath:"",httpHost:"sockjs.pusher.com",httpPort:80,httpsPort:443,httpPath:"/pusher",stats_host:"stats.pusher.com",authEndpoint:"/pusher/auth",authTransport:"ajax",activityTimeout:12e4,pongTimeout:3e4,unavailableTimeout:1e4,userAuthentication:{endpoint:"/pusher/user-auth",transport:"ajax"},channelAuthorization:{endpoint:"/pusher/auth",transport:"ajax"},cdn_http:"http://js.pusher.com",cdn_https:"https://js.pusher.com",dependency_suffix:""},c=function(){function t(t){this.options=t,this.receivers=t.receivers||i,this.loading={}}return t.prototype.load=function(t,e,n){var r=this;if(r.loading[t]&&r.loading[t].length>0)r.loading[t].push(n);else{r.loading[t]=[n];var o=Ce.createScriptRequest(r.getPath(t,e)),i=r.receivers.create((function(e){if(r.receivers.remove(i),r.loading[t]){var n=r.loading[t];delete r.loading[t];for(var s=function(t){t||o.cleanup()},c=0;c<n.length;c++)n[c](e,s)}}));o.send(i)}},t.prototype.getRoot=function(t){var e=Ce.getDocument().location.protocol;return(t&&t.useTLS||"https:"===e?this.options.cdn_https:this.options.cdn_http).replace(/\/*$/,"")+"/"+this.options.version},t.prototype.getPath=function(t,e){return this.getRoot(e)+"/"+t+this.options.suffix+".js"},t}(),a=new o("_pusher_dependencies","Pusher.DependenciesReceivers"),u=new c({cdn_http:s.cdn_http,cdn_https:s.cdn_https,version:s.VERSION,suffix:s.dependency_suffix,receivers:a}),h={baseUrl:"https://pusher.com",urls:{authenticationEndpoint:{path:"/docs/channels/server_api/authenticating_users"},authorizationEndpoint:{path:"/docs/channels/server_api/authorizing-users/"},javascriptQuickStart:{path:"/docs/javascript_quick_start"},triggeringClientEvents:{path:"/docs/client_api_guide/client_events#trigger-events"},encryptedChannelSupport:{fullUrl:"https://github.com/pusher/pusher-js/tree/cc491015371a4bde5743d1c87a0fbac0feb53195#encrypted-channel-support"}}},p=function(t){var e,n=h.urls[t];return n?(n.fullUrl?e=n.fullUrl:n.path&&(e=h.baseUrl+n.path),e?"See: "+e:""):""};!function(t){t.UserAuthentication="user-authentication",t.ChannelAuthorization="channel-authorization"}(r||(r={}));var l,f=(l=function(t,e){return(l=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(t,e)},function(t,e){function n(){this.constructor=t}l(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),d=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),y=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),v=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),g=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),b=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),m=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),_=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),w=function(t){function e(e){var n=this.constructor,r=t.call(this,e)||this;return Object.setPrototypeOf(r,n.prototype),r}return f(e,t),e}(Error),S=function(t){function e(e,n){var r=this.constructor,o=t.call(this,n)||this;return o.status=e,Object.setPrototypeOf(o,r.prototype),o}return f(e,t),e}(Error),k=function(t,e,n,o,i){var s=Ce.createXHR();for(var c in s.open("POST",n.endpoint,!0),s.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),n.headers)s.setRequestHeader(c,n.headers[c]);if(null!=n.headersProvider){var a=n.headersProvider();for(var c in a)s.setRequestHeader(c,a[c])}return s.onreadystatechange=function(){if(4===s.readyState)if(200===s.status){var t=void 0,e=!1;try{t=JSON.parse(s.responseText),e=!0}catch(t){i(new S(200,"JSON returned from "+o.toString()+" endpoint was invalid, yet status code was 200. Data was: "+s.responseText),null)}e&&i(null,t)}else{var c="";switch(o){case r.UserAuthentication:c=p("authenticationEndpoint");break;case r.ChannelAuthorization:c="Clients must be authorized to join private or presence channels. "+p("authorizationEndpoint")}i(new S(s.status,"Unable to retrieve auth string from "+o.toString()+" endpoint - received status: "+s.status+" from "+n.endpoint+". "+c),null)}},s.send(e),s};for(var C=String.fromCharCode,P="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",T={},O=0,E=P.length;O<E;O++)T[P.charAt(O)]=O;var A=function(t){var e=t.charCodeAt(0);return e<128?t:e<2048?C(192|e>>>6)+C(128|63&e):C(224|e>>>12&15)+C(128|e>>>6&63)+C(128|63&e)},x=function(t){return t.replace(/[^\x00-\x7F]/g,A)},L=function(t){var e=[0,2,1][t.length%3],n=t.charCodeAt(0)<<16|(t.length>1?t.charCodeAt(1):0)<<8|(t.length>2?t.charCodeAt(2):0);return[P.charAt(n>>>18),P.charAt(n>>>12&63),e>=2?"=":P.charAt(n>>>6&63),e>=1?"=":P.charAt(63&n)].join("")},R=window.btoa||function(t){return t.replace(/[\s\S]{1,3}/g,L)},j=function(){function t(t,e,n,r){var o=this;this.clear=e,this.timer=t((function(){o.timer&&(o.timer=r(o.timer))}),n)}return t.prototype.isRunning=function(){return null!==this.timer},t.prototype.ensureAborted=function(){this.timer&&(this.clear(this.timer),this.timer=null)},t}(),I=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}();function D(t){window.clearTimeout(t)}function N(t){window.clearInterval(t)}var H=function(t){function e(e,n){return t.call(this,setTimeout,D,e,(function(t){return n(),null}))||this}return I(e,t),e}(j),U=function(t){function e(e,n){return t.call(this,setInterval,N,e,(function(t){return n(),t}))||this}return I(e,t),e}(j),M={now:function(){return Date.now?Date.now():(new Date).valueOf()},defer:function(t){return new H(0,t)},method:function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=Array.prototype.slice.call(arguments,1);return function(e){return e[t].apply(e,r.concat(arguments))}}};function z(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];for(var r=0;r<e.length;r++){var o=e[r];for(var i in o)o[i]&&o[i].constructor&&o[i].constructor===Object?t[i]=z(t[i]||{},o[i]):t[i]=o[i]}return t}function q(){for(var t=["Pusher"],e=0;e<arguments.length;e++)"string"==typeof arguments[e]?t.push(arguments[e]):t.push(K(arguments[e]));return t.join(" : ")}function B(t,e){var n=Array.prototype.indexOf;if(null===t)return-1;if(n&&t.indexOf===n)return t.indexOf(e);for(var r=0,o=t.length;r<o;r++)if(t[r]===e)return r;return-1}function F(t,e){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(t[n],n,t)}function X(t){var e=[];return F(t,(function(t,n){e.push(n)})),e}function J(t,e,n){for(var r=0;r<t.length;r++)e.call(n||window,t[r],r,t)}function W(t,e){for(var n=[],r=0;r<t.length;r++)n.push(e(t[r],r,t,n));return n}function G(t,e){e=e||function(t){return!!t};for(var n=[],r=0;r<t.length;r++)e(t[r],r,t,n)&&n.push(t[r]);return n}function V(t,e){var n={};return F(t,(function(r,o){(e&&e(r,o,t,n)||Boolean(r))&&(n[o]=r)})),n}function Y(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return!0;return!1}function $(t){return e=function(t){return"object"==typeof t&&(t=K(t)),encodeURIComponent((e=t.toString(),R(x(e))));var e},n={},F(t,(function(t,r){n[r]=e(t)})),n;var e,n}function Q(t){var e,n,r=V(t,(function(t){return void 0!==t}));return W((e=$(r),n=[],F(e,(function(t,e){n.push([e,t])})),n),M.method("join","=")).join("&")}function K(t){try{return JSON.stringify(t)}catch(r){return JSON.stringify((e=[],n=[],function t(r,o){var i,s,c;switch(typeof r){case"object":if(!r)return null;for(i=0;i<e.length;i+=1)if(e[i]===r)return{$ref:n[i]};if(e.push(r),n.push(o),"[object Array]"===Object.prototype.toString.apply(r))for(c=[],i=0;i<r.length;i+=1)c[i]=t(r[i],o+"["+i+"]");else for(s in c={},r)Object.prototype.hasOwnProperty.call(r,s)&&(c[s]=t(r[s],o+"["+JSON.stringify(s)+"]"));return c;case"number":case"string":case"boolean":return r}}(t,"$")))}var e,n}var Z=new(function(){function t(){this.globalLog=function(t){window.console&&window.console.log&&window.console.log(t)}}return t.prototype.debug=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLog,t)},t.prototype.warn=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLogWarn,t)},t.prototype.error=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.log(this.globalLogError,t)},t.prototype.globalLogWarn=function(t){window.console&&window.console.warn?window.console.warn(t):this.globalLog(t)},t.prototype.globalLogError=function(t){window.console&&window.console.error?window.console.error(t):this.globalLogWarn(t)},t.prototype.log=function(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];var r=q.apply(this,arguments);if(Ge.log)Ge.log(r);else if(Ge.logToConsole){var o=t.bind(this);o(r)}},t}()),tt=function(t,e,n,r,o){void 0===n.headers&&null==n.headersProvider||Z.warn("To send headers with the "+r.toString()+" request, you must use AJAX, rather than JSONP.");var i=t.nextAuthCallbackID.toString();t.nextAuthCallbackID++;var s=t.getDocument(),c=s.createElement("script");t.auth_callbacks[i]=function(t){o(null,t)};var a="Pusher.auth_callbacks['"+i+"']";c.src=n.endpoint+"?callback="+encodeURIComponent(a)+"&"+e;var u=s.getElementsByTagName("head")[0]||s.documentElement;u.insertBefore(c,u.firstChild)},et=function(){function t(t){this.src=t}return t.prototype.send=function(t){var e=this,n="Error loading "+e.src;e.script=document.createElement("script"),e.script.id=t.id,e.script.src=e.src,e.script.type="text/javascript",e.script.charset="UTF-8",e.script.addEventListener?(e.script.onerror=function(){t.callback(n)},e.script.onload=function(){t.callback(null)}):e.script.onreadystatechange=function(){"loaded"!==e.script.readyState&&"complete"!==e.script.readyState||t.callback(null)},void 0===e.script.async&&document.attachEvent&&/opera/i.test(navigator.userAgent)?(e.errorScript=document.createElement("script"),e.errorScript.id=t.id+"_error",e.errorScript.text=t.name+"('"+n+"');",e.script.async=e.errorScript.async=!1):e.script.async=!0;var r=document.getElementsByTagName("head")[0];r.insertBefore(e.script,r.firstChild),e.errorScript&&r.insertBefore(e.errorScript,e.script.nextSibling)},t.prototype.cleanup=function(){this.script&&(this.script.onload=this.script.onerror=null,this.script.onreadystatechange=null),this.script&&this.script.parentNode&&this.script.parentNode.removeChild(this.script),this.errorScript&&this.errorScript.parentNode&&this.errorScript.parentNode.removeChild(this.errorScript),this.script=null,this.errorScript=null},t}(),nt=function(){function t(t,e){this.url=t,this.data=e}return t.prototype.send=function(t){if(!this.request){var e=Q(this.data),n=this.url+"/"+t.number+"?"+e;this.request=Ce.createScriptRequest(n),this.request.send(t)}},t.prototype.cleanup=function(){this.request&&this.request.cleanup()},t}(),rt={name:"jsonp",getAgent:function(t,e){return function(n,r){var o="http"+(e?"s":"")+"://"+(t.host||t.options.host)+t.options.path,s=Ce.createJSONPRequest(o,n),c=Ce.ScriptReceivers.create((function(e,n){i.remove(c),s.cleanup(),n&&n.host&&(t.host=n.host),r&&r(e,n)}));s.send(c)}}};function ot(t,e,n){return t+(e.useTLS?"s":"")+"://"+(e.useTLS?e.hostTLS:e.hostNonTLS)+n}function it(t,e){return"/app/"+t+("?protocol="+s.PROTOCOL+"&client=js&version="+s.VERSION+(e?"&"+e:""))}var st={getInitial:function(t,e){return ot("ws",e,(e.httpPath||"")+it(t,"flash=false"))}},ct={getInitial:function(t,e){return ot("http",e,(e.httpPath||"/pusher")+it(t))}},at={getInitial:function(t,e){return ot("http",e,e.httpPath||"/pusher")},getPath:function(t,e){return it(t)}},ut=function(){function t(){this._callbacks={}}return t.prototype.get=function(t){return this._callbacks[ht(t)]},t.prototype.add=function(t,e,n){var r=ht(t);this._callbacks[r]=this._callbacks[r]||[],this._callbacks[r].push({fn:e,context:n})},t.prototype.remove=function(t,e,n){if(t||e||n){var r=t?[ht(t)]:X(this._callbacks);e||n?this.removeCallback(r,e,n):this.removeAllCallbacks(r)}else this._callbacks={}},t.prototype.removeCallback=function(t,e,n){J(t,(function(t){this._callbacks[t]=G(this._callbacks[t]||[],(function(t){return e&&e!==t.fn||n&&n!==t.context})),0===this._callbacks[t].length&&delete this._callbacks[t]}),this)},t.prototype.removeAllCallbacks=function(t){J(t,(function(t){delete this._callbacks[t]}),this)},t}();function ht(t){return"_"+t}var pt=function(){function t(t){this.callbacks=new ut,this.global_callbacks=[],this.failThrough=t}return t.prototype.bind=function(t,e,n){return this.callbacks.add(t,e,n),this},t.prototype.bind_global=function(t){return this.global_callbacks.push(t),this},t.prototype.unbind=function(t,e,n){return this.callbacks.remove(t,e,n),this},t.prototype.unbind_global=function(t){return t?(this.global_callbacks=G(this.global_callbacks||[],(function(e){return e!==t})),this):(this.global_callbacks=[],this)},t.prototype.unbind_all=function(){return this.unbind(),this.unbind_global(),this},t.prototype.emit=function(t,e,n){for(var r=0;r<this.global_callbacks.length;r++)this.global_callbacks[r](t,e);var o=this.callbacks.get(t),i=[];if(n?i.push(e,n):e&&i.push(e),o&&o.length>0)for(r=0;r<o.length;r++)o[r].fn.apply(o[r].context||window,i);else this.failThrough&&this.failThrough(t,e);return this},t}(),lt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),ft=function(t){function e(e,n,r,o,i){var s=t.call(this)||this;return s.initialize=Ce.transportConnectionInitializer,s.hooks=e,s.name=n,s.priority=r,s.key=o,s.options=i,s.state="new",s.timeline=i.timeline,s.activityTimeout=i.activityTimeout,s.id=s.timeline.generateUniqueID(),s}return lt(e,t),e.prototype.handlesActivityChecks=function(){return Boolean(this.hooks.handlesActivityChecks)},e.prototype.supportsPing=function(){return Boolean(this.hooks.supportsPing)},e.prototype.connect=function(){var t=this;if(this.socket||"initialized"!==this.state)return!1;var e=this.hooks.urls.getInitial(this.key,this.options);try{this.socket=this.hooks.getSocket(e,this.options)}catch(e){return M.defer((function(){t.onError(e),t.changeState("closed")})),!1}return this.bindListeners(),Z.debug("Connecting",{transport:this.name,url:e}),this.changeState("connecting"),!0},e.prototype.close=function(){return!!this.socket&&(this.socket.close(),!0)},e.prototype.send=function(t){var e=this;return"open"===this.state&&(M.defer((function(){e.socket&&e.socket.send(t)})),!0)},e.prototype.ping=function(){"open"===this.state&&this.supportsPing()&&this.socket.ping()},e.prototype.onOpen=function(){this.hooks.beforeOpen&&this.hooks.beforeOpen(this.socket,this.hooks.urls.getPath(this.key,this.options)),this.changeState("open"),this.socket.onopen=void 0},e.prototype.onError=function(t){this.emit("error",{type:"WebSocketError",error:t}),this.timeline.error(this.buildTimelineMessage({error:t.toString()}))},e.prototype.onClose=function(t){t?this.changeState("closed",{code:t.code,reason:t.reason,wasClean:t.wasClean}):this.changeState("closed"),this.unbindListeners(),this.socket=void 0},e.prototype.onMessage=function(t){this.emit("message",t)},e.prototype.onActivity=function(){this.emit("activity")},e.prototype.bindListeners=function(){var t=this;this.socket.onopen=function(){t.onOpen()},this.socket.onerror=function(e){t.onError(e)},this.socket.onclose=function(e){t.onClose(e)},this.socket.onmessage=function(e){t.onMessage(e)},this.supportsPing()&&(this.socket.onactivity=function(){t.onActivity()})},e.prototype.unbindListeners=function(){this.socket&&(this.socket.onopen=void 0,this.socket.onerror=void 0,this.socket.onclose=void 0,this.socket.onmessage=void 0,this.supportsPing()&&(this.socket.onactivity=void 0))},e.prototype.changeState=function(t,e){this.state=t,this.timeline.info(this.buildTimelineMessage({state:t,params:e})),this.emit(t,e)},e.prototype.buildTimelineMessage=function(t){return z({cid:this.id},t)},e}(pt),dt=function(){function t(t){this.hooks=t}return t.prototype.isSupported=function(t){return this.hooks.isSupported(t)},t.prototype.createConnection=function(t,e,n,r){return new ft(this.hooks,t,e,n,r)},t}(),yt=new dt({urls:st,handlesActivityChecks:!1,supportsPing:!1,isInitialized:function(){return Boolean(Ce.getWebSocketAPI())},isSupported:function(){return Boolean(Ce.getWebSocketAPI())},getSocket:function(t){return Ce.createWebSocket(t)}}),vt={urls:ct,handlesActivityChecks:!1,supportsPing:!0,isInitialized:function(){return!0}},gt=z({getSocket:function(t){return Ce.HTTPFactory.createStreamingSocket(t)}},vt),bt=z({getSocket:function(t){return Ce.HTTPFactory.createPollingSocket(t)}},vt),mt={isSupported:function(){return Ce.isXHRSupported()}},_t={ws:yt,xhr_streaming:new dt(z({},gt,mt)),xhr_polling:new dt(z({},bt,mt))},wt=new dt({file:"sockjs",urls:at,handlesActivityChecks:!0,supportsPing:!1,isSupported:function(){return!0},isInitialized:function(){return void 0!==window.SockJS},getSocket:function(t,e){return new window.SockJS(t,null,{js_path:u.getPath("sockjs",{useTLS:e.useTLS}),ignore_null_origin:e.ignoreNullOrigin})},beforeOpen:function(t,e){t.send(JSON.stringify({path:e}))}}),St={isSupported:function(t){return Ce.isXDRSupported(t.useTLS)}},kt=new dt(z({},gt,St)),Ct=new dt(z({},bt,St));_t.xdr_streaming=kt,_t.xdr_polling=Ct,_t.sockjs=wt;var Pt=_t,Tt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Ot=new(function(t){function e(){var e=t.call(this)||this,n=e;return void 0!==window.addEventListener&&(window.addEventListener("online",(function(){n.emit("online")}),!1),window.addEventListener("offline",(function(){n.emit("offline")}),!1)),e}return Tt(e,t),e.prototype.isOnline=function(){return void 0===window.navigator.onLine||window.navigator.onLine},e}(pt)),Et=function(){function t(t,e,n){this.manager=t,this.transport=e,this.minPingDelay=n.minPingDelay,this.maxPingDelay=n.maxPingDelay,this.pingDelay=void 0}return t.prototype.createConnection=function(t,e,n,r){var o=this;r=z({},r,{activityTimeout:this.pingDelay});var i=this.transport.createConnection(t,e,n,r),s=null,c=function(){i.unbind("open",c),i.bind("closed",a),s=M.now()},a=function(t){if(i.unbind("closed",a),1002===t.code||1003===t.code)o.manager.reportDeath();else if(!t.wasClean&&s){var e=M.now()-s;e<2*o.maxPingDelay&&(o.manager.reportDeath(),o.pingDelay=Math.max(e/2,o.minPingDelay))}};return i.bind("open",c),i},t.prototype.isSupported=function(t){return this.manager.isAlive()&&this.transport.isSupported(t)},t}(),At={decodeMessage:function(t){try{var e=JSON.parse(t.data),n=e.data;if("string"==typeof n)try{n=JSON.parse(e.data)}catch(t){}var r={event:e.event,channel:e.channel,data:n};return e.user_id&&(r.user_id=e.user_id),r}catch(e){throw{type:"MessageParseError",error:e,data:t.data}}},encodeMessage:function(t){return JSON.stringify(t)},processHandshake:function(t){var e=At.decodeMessage(t);if("pusher:connection_established"===e.event){if(!e.data.activity_timeout)throw"No activity timeout specified in handshake";return{action:"connected",id:e.data.socket_id,activityTimeout:1e3*e.data.activity_timeout}}if("pusher:error"===e.event)return{action:this.getCloseAction(e.data),error:this.getCloseError(e.data)};throw"Invalid handshake"},getCloseAction:function(t){return t.code<4e3?t.code>=1002&&t.code<=1004?"backoff":null:4e3===t.code?"tls_only":t.code<4100?"refused":t.code<4200?"backoff":t.code<4300?"retry":"refused"},getCloseError:function(t){return 1e3!==t.code&&1001!==t.code?{type:"PusherError",data:{code:t.code,message:t.reason||t.message}}:null}},xt=At,Lt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Rt=function(t){function e(e,n){var r=t.call(this)||this;return r.id=e,r.transport=n,r.activityTimeout=n.activityTimeout,r.bindListeners(),r}return Lt(e,t),e.prototype.handlesActivityChecks=function(){return this.transport.handlesActivityChecks()},e.prototype.send=function(t){return this.transport.send(t)},e.prototype.send_event=function(t,e,n){var r={event:t,data:e};return n&&(r.channel=n),Z.debug("Event sent",r),this.send(xt.encodeMessage(r))},e.prototype.ping=function(){this.transport.supportsPing()?this.transport.ping():this.send_event("pusher:ping",{})},e.prototype.close=function(){this.transport.close()},e.prototype.bindListeners=function(){var t=this,e={message:function(e){var n;try{n=xt.decodeMessage(e)}catch(n){t.emit("error",{type:"MessageParseError",error:n,data:e.data})}if(void 0!==n){switch(Z.debug("Event recd",n),n.event){case"pusher:error":t.emit("error",{type:"PusherError",data:n.data});break;case"pusher:ping":t.emit("ping");break;case"pusher:pong":t.emit("pong")}t.emit("message",n)}},activity:function(){t.emit("activity")},error:function(e){t.emit("error",e)},closed:function(e){n(),e&&e.code&&t.handleCloseEvent(e),t.transport=null,t.emit("closed")}},n=function(){F(e,(function(e,n){t.transport.unbind(n,e)}))};F(e,(function(e,n){t.transport.bind(n,e)}))},e.prototype.handleCloseEvent=function(t){var e=xt.getCloseAction(t),n=xt.getCloseError(t);n&&this.emit("error",n),e&&this.emit(e,{action:e,error:n})},e}(pt),jt=function(){function t(t,e){this.transport=t,this.callback=e,this.bindListeners()}return t.prototype.close=function(){this.unbindListeners(),this.transport.close()},t.prototype.bindListeners=function(){var t=this;this.onMessage=function(e){var n;t.unbindListeners();try{n=xt.processHandshake(e)}catch(e){return t.finish("error",{error:e}),void t.transport.close()}"connected"===n.action?t.finish("connected",{connection:new Rt(n.id,t.transport),activityTimeout:n.activityTimeout}):(t.finish(n.action,{error:n.error}),t.transport.close())},this.onClosed=function(e){t.unbindListeners();var n=xt.getCloseAction(e)||"backoff",r=xt.getCloseError(e);t.finish(n,{error:r})},this.transport.bind("message",this.onMessage),this.transport.bind("closed",this.onClosed)},t.prototype.unbindListeners=function(){this.transport.unbind("message",this.onMessage),this.transport.unbind("closed",this.onClosed)},t.prototype.finish=function(t,e){this.callback(z({transport:this.transport,action:t},e))},t}(),It=function(){function t(t,e){this.timeline=t,this.options=e||{}}return t.prototype.send=function(t,e){this.timeline.isEmpty()||this.timeline.send(Ce.TimelineTransport.getAgent(this,t),e)},t}(),Dt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Nt=function(t){function e(e,n){var r=t.call(this,(function(t,n){Z.debug("No callbacks on "+e+" for "+t)}))||this;return r.name=e,r.pusher=n,r.subscribed=!1,r.subscriptionPending=!1,r.subscriptionCancelled=!1,r}return Dt(e,t),e.prototype.authorize=function(t,e){return e(null,{auth:""})},e.prototype.trigger=function(t,e){if(0!==t.indexOf("client-"))throw new d("Event '"+t+"' does not start with 'client-'");if(!this.subscribed){var n=p("triggeringClientEvents");Z.warn("Client event triggered before channel 'subscription_succeeded' event . "+n)}return this.pusher.send_event(t,e,this.name)},e.prototype.disconnect=function(){this.subscribed=!1,this.subscriptionPending=!1},e.prototype.handleEvent=function(t){var e=t.event,n=t.data;if("pusher_internal:subscription_succeeded"===e)this.handleSubscriptionSucceededEvent(t);else if("pusher_internal:subscription_count"===e)this.handleSubscriptionCountEvent(t);else if(0!==e.indexOf("pusher_internal:")){this.emit(e,n,{})}},e.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):this.emit("pusher:subscription_succeeded",t.data)},e.prototype.handleSubscriptionCountEvent=function(t){t.data.subscription_count&&(this.subscriptionCount=t.data.subscription_count),this.emit("pusher:subscription_count",t.data)},e.prototype.subscribe=function(){var t=this;this.subscribed||(this.subscriptionPending=!0,this.subscriptionCancelled=!1,this.authorize(this.pusher.connection.socket_id,(function(e,n){e?(t.subscriptionPending=!1,Z.error(e.toString()),t.emit("pusher:subscription_error",Object.assign({},{type:"AuthError",error:e.message},e instanceof S?{status:e.status}:{}))):t.pusher.send_event("pusher:subscribe",{auth:n.auth,channel_data:n.channel_data,channel:t.name})})))},e.prototype.unsubscribe=function(){this.subscribed=!1,this.pusher.send_event("pusher:unsubscribe",{channel:this.name})},e.prototype.cancelSubscription=function(){this.subscriptionCancelled=!0},e.prototype.reinstateSubscription=function(){this.subscriptionCancelled=!1},e}(pt),Ht=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Ut=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return Ht(e,t),e.prototype.authorize=function(t,e){return this.pusher.config.channelAuthorizer({channelName:this.name,socketId:t},e)},e}(Nt),Mt=function(){function t(){this.reset()}return t.prototype.get=function(t){return Object.prototype.hasOwnProperty.call(this.members,t)?{id:t,info:this.members[t]}:null},t.prototype.each=function(t){var e=this;F(this.members,(function(n,r){t(e.get(r))}))},t.prototype.setMyID=function(t){this.myID=t},t.prototype.onSubscription=function(t){this.members=t.presence.hash,this.count=t.presence.count,this.me=this.get(this.myID)},t.prototype.addMember=function(t){return null===this.get(t.user_id)&&this.count++,this.members[t.user_id]=t.user_info,this.get(t.user_id)},t.prototype.removeMember=function(t){var e=this.get(t.user_id);return e&&(delete this.members[t.user_id],this.count--),e},t.prototype.reset=function(){this.members={},this.count=0,this.myID=null,this.me=null},t}(),zt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),qt=function(t,e,n,r){return new(n||(n=Promise))((function(o,i){function s(t){try{a(r.next(t))}catch(t){i(t)}}function c(t){try{a(r.throw(t))}catch(t){i(t)}}function a(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,c)}a((r=r.apply(t,e||[])).next())}))},Bt=function(t,e){var n,r,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;s;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,r=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=e.call(t,s)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}},Ft=function(t){function e(e,n){var r=t.call(this,e,n)||this;return r.members=new Mt,r}return zt(e,t),e.prototype.authorize=function(e,n){var r=this;t.prototype.authorize.call(this,e,(function(t,e){return qt(r,void 0,void 0,(function(){var r,o;return Bt(this,(function(i){switch(i.label){case 0:return t?[3,3]:null==(e=e).channel_data?[3,1]:(r=JSON.parse(e.channel_data),this.members.setMyID(r.user_id),[3,3]);case 1:return[4,this.pusher.user.signinDonePromise];case 2:if(i.sent(),null==this.pusher.user.user_data)return o=p("authorizationEndpoint"),Z.error("Invalid auth response for channel '"+this.name+"', expected 'channel_data' field. "+o+", or the user should be signed in."),n("Invalid auth response"),[2];this.members.setMyID(this.pusher.user.user_data.id),i.label=3;case 3:return n(t,e),[2]}}))}))}))},e.prototype.handleEvent=function(t){var e=t.event;if(0===e.indexOf("pusher_internal:"))this.handleInternalEvent(t);else{var n=t.data,r={};t.user_id&&(r.user_id=t.user_id),this.emit(e,n,r)}},e.prototype.handleInternalEvent=function(t){var e=t.event,n=t.data;switch(e){case"pusher_internal:subscription_succeeded":this.handleSubscriptionSucceededEvent(t);break;case"pusher_internal:subscription_count":this.handleSubscriptionCountEvent(t);break;case"pusher_internal:member_added":var r=this.members.addMember(n);this.emit("pusher:member_added",r);break;case"pusher_internal:member_removed":var o=this.members.removeMember(n);o&&this.emit("pusher:member_removed",o)}},e.prototype.handleSubscriptionSucceededEvent=function(t){this.subscriptionPending=!1,this.subscribed=!0,this.subscriptionCancelled?this.pusher.unsubscribe(this.name):(this.members.onSubscription(t.data),this.emit("pusher:subscription_succeeded",this.members))},e.prototype.disconnect=function(){this.members.reset(),t.prototype.disconnect.call(this)},e}(Ut),Xt=n(1),Jt=n(0),Wt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Gt=function(t){function e(e,n,r){var o=t.call(this,e,n)||this;return o.key=null,o.nacl=r,o}return Wt(e,t),e.prototype.authorize=function(e,n){var r=this;t.prototype.authorize.call(this,e,(function(t,e){if(t)n(t,e);else{var o=e.shared_secret;o?(r.key=Object(Jt.decode)(o),delete e.shared_secret,n(null,e)):n(new Error("No shared_secret key in auth payload for encrypted channel: "+r.name),null)}}))},e.prototype.trigger=function(t,e){throw new m("Client events are not currently supported for encrypted channels")},e.prototype.handleEvent=function(e){var n=e.event,r=e.data;0!==n.indexOf("pusher_internal:")&&0!==n.indexOf("pusher:")?this.handleEncryptedEvent(n,r):t.prototype.handleEvent.call(this,e)},e.prototype.handleEncryptedEvent=function(t,e){var n=this;if(this.key)if(e.ciphertext&&e.nonce){var r=Object(Jt.decode)(e.ciphertext);if(r.length<this.nacl.secretbox.overheadLength)Z.error("Expected encrypted event ciphertext length to be "+this.nacl.secretbox.overheadLength+", got: "+r.length);else{var o=Object(Jt.decode)(e.nonce);if(o.length<this.nacl.secretbox.nonceLength)Z.error("Expected encrypted event nonce length to be "+this.nacl.secretbox.nonceLength+", got: "+o.length);else{var i=this.nacl.secretbox.open(r,o,this.key);if(null===i)return Z.debug("Failed to decrypt an event, probably because it was encrypted with a different key. Fetching a new key from the authEndpoint..."),void this.authorize(this.pusher.connection.socket_id,(function(e,s){e?Z.error("Failed to make a request to the authEndpoint: "+s+". Unable to fetch new key, so dropping encrypted event"):null!==(i=n.nacl.secretbox.open(r,o,n.key))?n.emit(t,n.getDataToEmit(i)):Z.error("Failed to decrypt event with new key. Dropping encrypted event")}));this.emit(t,this.getDataToEmit(i))}}}else Z.error("Unexpected format for encrypted event, expected object with `ciphertext` and `nonce` fields, got: "+e);else Z.debug("Received encrypted event before key has been retrieved from the authEndpoint")},e.prototype.getDataToEmit=function(t){var e=Object(Xt.decode)(t);try{return JSON.parse(e)}catch(t){return e}},e}(Ut),Vt=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Yt=function(t){function e(e,n){var r=t.call(this)||this;r.state="initialized",r.connection=null,r.key=e,r.options=n,r.timeline=r.options.timeline,r.usingTLS=r.options.useTLS,r.errorCallbacks=r.buildErrorCallbacks(),r.connectionCallbacks=r.buildConnectionCallbacks(r.errorCallbacks),r.handshakeCallbacks=r.buildHandshakeCallbacks(r.errorCallbacks);var o=Ce.getNetwork();return o.bind("online",(function(){r.timeline.info({netinfo:"online"}),"connecting"!==r.state&&"unavailable"!==r.state||r.retryIn(0)})),o.bind("offline",(function(){r.timeline.info({netinfo:"offline"}),r.connection&&r.sendActivityCheck()})),r.updateStrategy(),r}return Vt(e,t),e.prototype.connect=function(){this.connection||this.runner||(this.strategy.isSupported()?(this.updateState("connecting"),this.startConnecting(),this.setUnavailableTimer()):this.updateState("failed"))},e.prototype.send=function(t){return!!this.connection&&this.connection.send(t)},e.prototype.send_event=function(t,e,n){return!!this.connection&&this.connection.send_event(t,e,n)},e.prototype.disconnect=function(){this.disconnectInternally(),this.updateState("disconnected")},e.prototype.isUsingTLS=function(){return this.usingTLS},e.prototype.startConnecting=function(){var t=this,e=function(n,r){n?t.runner=t.strategy.connect(0,e):"error"===r.action?(t.emit("error",{type:"HandshakeError",error:r.error}),t.timeline.error({handshakeError:r.error})):(t.abortConnecting(),t.handshakeCallbacks[r.action](r))};this.runner=this.strategy.connect(0,e)},e.prototype.abortConnecting=function(){this.runner&&(this.runner.abort(),this.runner=null)},e.prototype.disconnectInternally=function(){(this.abortConnecting(),this.clearRetryTimer(),this.clearUnavailableTimer(),this.connection)&&this.abandonConnection().close()},e.prototype.updateStrategy=function(){this.strategy=this.options.getStrategy({key:this.key,timeline:this.timeline,useTLS:this.usingTLS})},e.prototype.retryIn=function(t){var e=this;this.timeline.info({action:"retry",delay:t}),t>0&&this.emit("connecting_in",Math.round(t/1e3)),this.retryTimer=new H(t||0,(function(){e.disconnectInternally(),e.connect()}))},e.prototype.clearRetryTimer=function(){this.retryTimer&&(this.retryTimer.ensureAborted(),this.retryTimer=null)},e.prototype.setUnavailableTimer=function(){var t=this;this.unavailableTimer=new H(this.options.unavailableTimeout,(function(){t.updateState("unavailable")}))},e.prototype.clearUnavailableTimer=function(){this.unavailableTimer&&this.unavailableTimer.ensureAborted()},e.prototype.sendActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection.ping(),this.activityTimer=new H(this.options.pongTimeout,(function(){t.timeline.error({pong_timed_out:t.options.pongTimeout}),t.retryIn(0)}))},e.prototype.resetActivityCheck=function(){var t=this;this.stopActivityCheck(),this.connection&&!this.connection.handlesActivityChecks()&&(this.activityTimer=new H(this.activityTimeout,(function(){t.sendActivityCheck()})))},e.prototype.stopActivityCheck=function(){this.activityTimer&&this.activityTimer.ensureAborted()},e.prototype.buildConnectionCallbacks=function(t){var e=this;return z({},t,{message:function(t){e.resetActivityCheck(),e.emit("message",t)},ping:function(){e.send_event("pusher:pong",{})},activity:function(){e.resetActivityCheck()},error:function(t){e.emit("error",t)},closed:function(){e.abandonConnection(),e.shouldRetry()&&e.retryIn(1e3)}})},e.prototype.buildHandshakeCallbacks=function(t){var e=this;return z({},t,{connected:function(t){e.activityTimeout=Math.min(e.options.activityTimeout,t.activityTimeout,t.connection.activityTimeout||1/0),e.clearUnavailableTimer(),e.setConnection(t.connection),e.socket_id=e.connection.id,e.updateState("connected",{socket_id:e.socket_id})}})},e.prototype.buildErrorCallbacks=function(){var t=this,e=function(e){return function(n){n.error&&t.emit("error",{type:"WebSocketError",error:n.error}),e(n)}};return{tls_only:e((function(){t.usingTLS=!0,t.updateStrategy(),t.retryIn(0)})),refused:e((function(){t.disconnect()})),backoff:e((function(){t.retryIn(1e3)})),retry:e((function(){t.retryIn(0)}))}},e.prototype.setConnection=function(t){for(var e in this.connection=t,this.connectionCallbacks)this.connection.bind(e,this.connectionCallbacks[e]);this.resetActivityCheck()},e.prototype.abandonConnection=function(){if(this.connection){for(var t in this.stopActivityCheck(),this.connectionCallbacks)this.connection.unbind(t,this.connectionCallbacks[t]);var e=this.connection;return this.connection=null,e}},e.prototype.updateState=function(t,e){var n=this.state;if(this.state=t,n!==t){var r=t;"connected"===r&&(r+=" with new socket ID "+e.socket_id),Z.debug("State changed",n+" -> "+r),this.timeline.info({state:t,params:e}),this.emit("state_change",{previous:n,current:t}),this.emit(t,e)}},e.prototype.shouldRetry=function(){return"connecting"===this.state||"connected"===this.state},e}(pt),$t=function(){function t(){this.channels={}}return t.prototype.add=function(t,e){return this.channels[t]||(this.channels[t]=function(t,e){if(0===t.indexOf("private-encrypted-")){if(e.config.nacl)return Qt.createEncryptedChannel(t,e,e.config.nacl);var n=p("encryptedChannelSupport");throw new m("Tried to subscribe to a private-encrypted- channel but no nacl implementation available. "+n)}if(0===t.indexOf("private-"))return Qt.createPrivateChannel(t,e);if(0===t.indexOf("presence-"))return Qt.createPresenceChannel(t,e);if(0===t.indexOf("#"))throw new y('Cannot create a channel with name "'+t+'".');return Qt.createChannel(t,e)}(t,e)),this.channels[t]},t.prototype.all=function(){return function(t){var e=[];return F(t,(function(t){e.push(t)})),e}(this.channels)},t.prototype.find=function(t){return this.channels[t]},t.prototype.remove=function(t){var e=this.channels[t];return delete this.channels[t],e},t.prototype.disconnect=function(){F(this.channels,(function(t){t.disconnect()}))},t}();var Qt={createChannels:function(){return new $t},createConnectionManager:function(t,e){return new Yt(t,e)},createChannel:function(t,e){return new Nt(t,e)},createPrivateChannel:function(t,e){return new Ut(t,e)},createPresenceChannel:function(t,e){return new Ft(t,e)},createEncryptedChannel:function(t,e,n){return new Gt(t,e,n)},createTimelineSender:function(t,e){return new It(t,e)},createHandshake:function(t,e){return new jt(t,e)},createAssistantToTheTransportManager:function(t,e,n){return new Et(t,e,n)}},Kt=function(){function t(t){this.options=t||{},this.livesLeft=this.options.lives||1/0}return t.prototype.getAssistant=function(t){return Qt.createAssistantToTheTransportManager(this,t,{minPingDelay:this.options.minPingDelay,maxPingDelay:this.options.maxPingDelay})},t.prototype.isAlive=function(){return this.livesLeft>0},t.prototype.reportDeath=function(){this.livesLeft-=1},t}(),Zt=function(){function t(t,e){this.strategies=t,this.loop=Boolean(e.loop),this.failFast=Boolean(e.failFast),this.timeout=e.timeout,this.timeoutLimit=e.timeoutLimit}return t.prototype.isSupported=function(){return Y(this.strategies,M.method("isSupported"))},t.prototype.connect=function(t,e){var n=this,r=this.strategies,o=0,i=this.timeout,s=null,c=function(a,u){u?e(null,u):(o+=1,n.loop&&(o%=r.length),o<r.length?(i&&(i*=2,n.timeoutLimit&&(i=Math.min(i,n.timeoutLimit))),s=n.tryStrategy(r[o],t,{timeout:i,failFast:n.failFast},c)):e(!0))};return s=this.tryStrategy(r[o],t,{timeout:i,failFast:this.failFast},c),{abort:function(){s.abort()},forceMinPriority:function(e){t=e,s&&s.forceMinPriority(e)}}},t.prototype.tryStrategy=function(t,e,n,r){var o=null,i=null;return n.timeout>0&&(o=new H(n.timeout,(function(){i.abort(),r(!0)}))),i=t.connect(e,(function(t,e){t&&o&&o.isRunning()&&!n.failFast||(o&&o.ensureAborted(),r(t,e))})),{abort:function(){o&&o.ensureAborted(),i.abort()},forceMinPriority:function(t){i.forceMinPriority(t)}}},t}(),te=function(){function t(t){this.strategies=t}return t.prototype.isSupported=function(){return Y(this.strategies,M.method("isSupported"))},t.prototype.connect=function(t,e){return function(t,e,n){var r=W(t,(function(t,r,o,i){return t.connect(e,n(r,i))}));return{abort:function(){J(r,ee)},forceMinPriority:function(t){J(r,(function(e){e.forceMinPriority(t)}))}}}(this.strategies,t,(function(t,n){return function(r,o){n[t].error=r,r?function(t){return function(t,e){for(var n=0;n<t.length;n++)if(!e(t[n],n,t))return!1;return!0}(t,(function(t){return Boolean(t.error)}))}(n)&&e(!0):(J(n,(function(t){t.forceMinPriority(o.transport.priority)})),e(null,o))}}))},t}();function ee(t){t.error||t.aborted||(t.abort(),t.aborted=!0)}var ne=function(){function t(t,e,n){this.strategy=t,this.transports=e,this.ttl=n.ttl||18e5,this.usingTLS=n.useTLS,this.timeline=n.timeline}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n=this.usingTLS,r=function(t){var e=Ce.getLocalStorage();if(e)try{var n=e[re(t)];if(n)return JSON.parse(n)}catch(e){oe(t)}return null}(n),o=[this.strategy];if(r&&r.timestamp+this.ttl>=M.now()){var i=this.transports[r.transport];i&&(this.timeline.info({cached:!0,transport:r.transport,latency:r.latency}),o.push(new Zt([i],{timeout:2*r.latency+1e3,failFast:!0})))}var s=M.now(),c=o.pop().connect(t,(function r(i,a){i?(oe(n),o.length>0?(s=M.now(),c=o.pop().connect(t,r)):e(i)):(!function(t,e,n){var r=Ce.getLocalStorage();if(r)try{r[re(t)]=K({timestamp:M.now(),transport:e,latency:n})}catch(t){}}(n,a.transport.name,M.now()-s),e(null,a))}));return{abort:function(){c.abort()},forceMinPriority:function(e){t=e,c&&c.forceMinPriority(e)}}},t}();function re(t){return"pusherTransport"+(t?"TLS":"NonTLS")}function oe(t){var e=Ce.getLocalStorage();if(e)try{delete e[re(t)]}catch(t){}}var ie=function(){function t(t,e){var n=e.delay;this.strategy=t,this.options={delay:n}}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n,r=this.strategy,o=new H(this.options.delay,(function(){n=r.connect(t,e)}));return{abort:function(){o.ensureAborted(),n&&n.abort()},forceMinPriority:function(e){t=e,n&&n.forceMinPriority(e)}}},t}(),se=function(){function t(t,e,n){this.test=t,this.trueBranch=e,this.falseBranch=n}return t.prototype.isSupported=function(){return(this.test()?this.trueBranch:this.falseBranch).isSupported()},t.prototype.connect=function(t,e){return(this.test()?this.trueBranch:this.falseBranch).connect(t,e)},t}(),ce=function(){function t(t){this.strategy=t}return t.prototype.isSupported=function(){return this.strategy.isSupported()},t.prototype.connect=function(t,e){var n=this.strategy.connect(t,(function(t,r){r&&n.abort(),e(t,r)}));return n},t}();function ae(t){return function(){return t.isSupported()}}var ue,he=function(t,e,n){var r={};function o(e,o,i,s,c){var a=n(t,e,o,i,s,c);return r[e]=a,a}var i,s=Object.assign({},e,{hostNonTLS:t.wsHost+":"+t.wsPort,hostTLS:t.wsHost+":"+t.wssPort,httpPath:t.wsPath}),c=Object.assign({},s,{useTLS:!0}),a=Object.assign({},e,{hostNonTLS:t.httpHost+":"+t.httpPort,hostTLS:t.httpHost+":"+t.httpsPort,httpPath:t.httpPath}),u={loop:!0,timeout:15e3,timeoutLimit:6e4},h=new Kt({lives:2,minPingDelay:1e4,maxPingDelay:t.activityTimeout}),p=new Kt({lives:2,minPingDelay:1e4,maxPingDelay:t.activityTimeout}),l=o("ws","ws",3,s,h),f=o("wss","ws",3,c,h),d=o("sockjs","sockjs",1,a),y=o("xhr_streaming","xhr_streaming",1,a,p),v=o("xdr_streaming","xdr_streaming",1,a,p),g=o("xhr_polling","xhr_polling",1,a),b=o("xdr_polling","xdr_polling",1,a),m=new Zt([l],u),_=new Zt([f],u),w=new Zt([d],u),S=new Zt([new se(ae(y),y,v)],u),k=new Zt([new se(ae(g),g,b)],u),C=new Zt([new se(ae(S),new te([S,new ie(k,{delay:4e3})]),k)],u),P=new se(ae(C),C,w);return i=e.useTLS?new te([m,new ie(P,{delay:2e3})]):new te([m,new ie(_,{delay:2e3}),new ie(P,{delay:5e3})]),new ne(new ce(new se(ae(l),i,P)),r,{ttl:18e5,timeline:e.timeline,useTLS:e.useTLS})},pe={getRequest:function(t){var e=new window.XDomainRequest;return e.ontimeout=function(){t.emit("error",new v),t.close()},e.onerror=function(e){t.emit("error",e),t.close()},e.onprogress=function(){e.responseText&&e.responseText.length>0&&t.onChunk(200,e.responseText)},e.onload=function(){e.responseText&&e.responseText.length>0&&t.onChunk(200,e.responseText),t.emit("finished",200),t.close()},e},abortRequest:function(t){t.ontimeout=t.onerror=t.onprogress=t.onload=null,t.abort()}},le=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),fe=function(t){function e(e,n,r){var o=t.call(this)||this;return o.hooks=e,o.method=n,o.url=r,o}return le(e,t),e.prototype.start=function(t){var e=this;this.position=0,this.xhr=this.hooks.getRequest(this),this.unloader=function(){e.close()},Ce.addUnloadListener(this.unloader),this.xhr.open(this.method,this.url,!0),this.xhr.setRequestHeader&&this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.send(t)},e.prototype.close=function(){this.unloader&&(Ce.removeUnloadListener(this.unloader),this.unloader=null),this.xhr&&(this.hooks.abortRequest(this.xhr),this.xhr=null)},e.prototype.onChunk=function(t,e){for(;;){var n=this.advanceBuffer(e);if(!n)break;this.emit("chunk",{status:t,data:n})}this.isBufferTooLong(e)&&this.emit("buffer_too_long")},e.prototype.advanceBuffer=function(t){var e=t.slice(this.position),n=e.indexOf("\n");return-1!==n?(this.position+=n+1,e.slice(0,n)):null},e.prototype.isBufferTooLong=function(t){return this.position===t.length&&t.length>262144},e}(pt);!function(t){t[t.CONNECTING=0]="CONNECTING",t[t.OPEN=1]="OPEN",t[t.CLOSED=3]="CLOSED"}(ue||(ue={}));var de=ue,ye=1;function ve(t){var e=-1===t.indexOf("?")?"?":"&";return t+e+"t="+ +new Date+"&n="+ye++}function ge(t){return Ce.randomInt(t)}var be,me=function(){function t(t,e){this.hooks=t,this.session=ge(1e3)+"/"+function(t){for(var e=[],n=0;n<t;n++)e.push(ge(32).toString(32));return e.join("")}(8),this.location=function(t){var e=/([^\?]*)\/*(\??.*)/.exec(t);return{base:e[1],queryString:e[2]}}(e),this.readyState=de.CONNECTING,this.openStream()}return t.prototype.send=function(t){return this.sendRaw(JSON.stringify([t]))},t.prototype.ping=function(){this.hooks.sendHeartbeat(this)},t.prototype.close=function(t,e){this.onClose(t,e,!0)},t.prototype.sendRaw=function(t){if(this.readyState!==de.OPEN)return!1;try{return Ce.createSocketRequest("POST",ve((e=this.location,n=this.session,e.base+"/"+n+"/xhr_send"))).start(t),!0}catch(t){return!1}var e,n},t.prototype.reconnect=function(){this.closeStream(),this.openStream()},t.prototype.onClose=function(t,e,n){this.closeStream(),this.readyState=de.CLOSED,this.onclose&&this.onclose({code:t,reason:e,wasClean:n})},t.prototype.onChunk=function(t){var e;if(200===t.status)switch(this.readyState===de.OPEN&&this.onActivity(),t.data.slice(0,1)){case"o":e=JSON.parse(t.data.slice(1)||"{}"),this.onOpen(e);break;case"a":e=JSON.parse(t.data.slice(1)||"[]");for(var n=0;n<e.length;n++)this.onEvent(e[n]);break;case"m":e=JSON.parse(t.data.slice(1)||"null"),this.onEvent(e);break;case"h":this.hooks.onHeartbeat(this);break;case"c":e=JSON.parse(t.data.slice(1)||"[]"),this.onClose(e[0],e[1],!0)}},t.prototype.onOpen=function(t){var e,n,r;this.readyState===de.CONNECTING?(t&&t.hostname&&(this.location.base=(e=this.location.base,n=t.hostname,(r=/(https?:\/\/)([^\/:]+)((\/|:)?.*)/.exec(e))[1]+n+r[3])),this.readyState=de.OPEN,this.onopen&&this.onopen()):this.onClose(1006,"Server lost session",!0)},t.prototype.onEvent=function(t){this.readyState===de.OPEN&&this.onmessage&&this.onmessage({data:t})},t.prototype.onActivity=function(){this.onactivity&&this.onactivity()},t.prototype.onError=function(t){this.onerror&&this.onerror(t)},t.prototype.openStream=function(){var t=this;this.stream=Ce.createSocketRequest("POST",ve(this.hooks.getReceiveURL(this.location,this.session))),this.stream.bind("chunk",(function(e){t.onChunk(e)})),this.stream.bind("finished",(function(e){t.hooks.onFinished(t,e)})),this.stream.bind("buffer_too_long",(function(){t.reconnect()}));try{this.stream.start()}catch(e){M.defer((function(){t.onError(e),t.onClose(1006,"Could not start streaming",!1)}))}},t.prototype.closeStream=function(){this.stream&&(this.stream.unbind_all(),this.stream.close(),this.stream=null)},t}(),_e={getReceiveURL:function(t,e){return t.base+"/"+e+"/xhr_streaming"+t.queryString},onHeartbeat:function(t){t.sendRaw("[]")},sendHeartbeat:function(t){t.sendRaw("[]")},onFinished:function(t,e){t.onClose(1006,"Connection interrupted ("+e+")",!1)}},we={getReceiveURL:function(t,e){return t.base+"/"+e+"/xhr"+t.queryString},onHeartbeat:function(){},sendHeartbeat:function(t){t.sendRaw("[]")},onFinished:function(t,e){200===e?t.reconnect():t.onClose(1006,"Connection interrupted ("+e+")",!1)}},Se={getRequest:function(t){var e=new(Ce.getXHRAPI());return e.onreadystatechange=e.onprogress=function(){switch(e.readyState){case 3:e.responseText&&e.responseText.length>0&&t.onChunk(e.status,e.responseText);break;case 4:e.responseText&&e.responseText.length>0&&t.onChunk(e.status,e.responseText),t.emit("finished",e.status),t.close()}},e},abortRequest:function(t){t.onreadystatechange=null,t.abort()}},ke={createStreamingSocket:function(t){return this.createSocket(_e,t)},createPollingSocket:function(t){return this.createSocket(we,t)},createSocket:function(t,e){return new me(t,e)},createXHR:function(t,e){return this.createRequest(Se,t,e)},createRequest:function(t,e,n){return new fe(t,e,n)},createXDR:function(t,e){return this.createRequest(pe,t,e)}},Ce={nextAuthCallbackID:1,auth_callbacks:{},ScriptReceivers:i,DependenciesReceivers:a,getDefaultStrategy:he,Transports:Pt,transportConnectionInitializer:function(){var t=this;t.timeline.info(t.buildTimelineMessage({transport:t.name+(t.options.useTLS?"s":"")})),t.hooks.isInitialized()?t.changeState("initialized"):t.hooks.file?(t.changeState("initializing"),u.load(t.hooks.file,{useTLS:t.options.useTLS},(function(e,n){t.hooks.isInitialized()?(t.changeState("initialized"),n(!0)):(e&&t.onError(e),t.onClose(),n(!1))}))):t.onClose()},HTTPFactory:ke,TimelineTransport:rt,getXHRAPI:function(){return window.XMLHttpRequest},getWebSocketAPI:function(){return window.WebSocket||window.MozWebSocket},setup:function(t){var e=this;window.Pusher=t;var n=function(){e.onDocumentBody(t.ready)};window.JSON?n():u.load("json2",{},n)},getDocument:function(){return document},getProtocol:function(){return this.getDocument().location.protocol},getAuthorizers:function(){return{ajax:k,jsonp:tt}},onDocumentBody:function(t){var e=this;document.body?t():setTimeout((function(){e.onDocumentBody(t)}),0)},createJSONPRequest:function(t,e){return new nt(t,e)},createScriptRequest:function(t){return new et(t)},getLocalStorage:function(){try{return window.localStorage}catch(t){return}},createXHR:function(){return this.getXHRAPI()?this.createXMLHttpRequest():this.createMicrosoftXHR()},createXMLHttpRequest:function(){return new(this.getXHRAPI())},createMicrosoftXHR:function(){return new ActiveXObject("Microsoft.XMLHTTP")},getNetwork:function(){return Ot},createWebSocket:function(t){return new(this.getWebSocketAPI())(t)},createSocketRequest:function(t,e){if(this.isXHRSupported())return this.HTTPFactory.createXHR(t,e);if(this.isXDRSupported(0===e.indexOf("https:")))return this.HTTPFactory.createXDR(t,e);throw"Cross-origin HTTP requests are not supported"},isXHRSupported:function(){var t=this.getXHRAPI();return Boolean(t)&&void 0!==(new t).withCredentials},isXDRSupported:function(t){var e=t?"https:":"http:",n=this.getProtocol();return Boolean(window.XDomainRequest)&&n===e},addUnloadListener:function(t){void 0!==window.addEventListener?window.addEventListener("unload",t,!1):void 0!==window.attachEvent&&window.attachEvent("onunload",t)},removeUnloadListener:function(t){void 0!==window.addEventListener?window.removeEventListener("unload",t,!1):void 0!==window.detachEvent&&window.detachEvent("onunload",t)},randomInt:function(t){return Math.floor((window.crypto||window.msCrypto).getRandomValues(new Uint32Array(1))[0]/Math.pow(2,32)*t)}};!function(t){t[t.ERROR=3]="ERROR",t[t.INFO=6]="INFO",t[t.DEBUG=7]="DEBUG"}(be||(be={}));var Pe=be,Te=function(){function t(t,e,n){this.key=t,this.session=e,this.events=[],this.options=n||{},this.sent=0,this.uniqueID=0}return t.prototype.log=function(t,e){t<=this.options.level&&(this.events.push(z({},e,{timestamp:M.now()})),this.options.limit&&this.events.length>this.options.limit&&this.events.shift())},t.prototype.error=function(t){this.log(Pe.ERROR,t)},t.prototype.info=function(t){this.log(Pe.INFO,t)},t.prototype.debug=function(t){this.log(Pe.DEBUG,t)},t.prototype.isEmpty=function(){return 0===this.events.length},t.prototype.send=function(t,e){var n=this,r=z({session:this.session,bundle:this.sent+1,key:this.key,lib:"js",version:this.options.version,cluster:this.options.cluster,features:this.options.features,timeline:this.events},this.options.params);return this.events=[],t(r,(function(t,r){t||n.sent++,e&&e(t,r)})),!0},t.prototype.generateUniqueID=function(){return this.uniqueID++,this.uniqueID},t}(),Oe=function(){function t(t,e,n,r){this.name=t,this.priority=e,this.transport=n,this.options=r||{}}return t.prototype.isSupported=function(){return this.transport.isSupported({useTLS:this.options.useTLS})},t.prototype.connect=function(t,e){var n=this;if(!this.isSupported())return Ee(new w,e);if(this.priority<t)return Ee(new g,e);var r=!1,o=this.transport.createConnection(this.name,this.priority,this.options.key,this.options),i=null,s=function(){o.unbind("initialized",s),o.connect()},c=function(){i=Qt.createHandshake(o,(function(t){r=!0,h(),e(null,t)}))},a=function(t){h(),e(t)},u=function(){var t;h(),t=K(o),e(new b(t))},h=function(){o.unbind("initialized",s),o.unbind("open",c),o.unbind("error",a),o.unbind("closed",u)};return o.bind("initialized",s),o.bind("open",c),o.bind("error",a),o.bind("closed",u),o.initialize(),{abort:function(){r||(h(),i?i.close():o.close())},forceMinPriority:function(t){r||n.priority<t&&(i?i.close():o.close())}}},t}();function Ee(t,e){return M.defer((function(){e(t)})),{abort:function(){},forceMinPriority:function(){}}}var Ae=Ce.Transports,xe=function(t,e,n,r,o,i){var s,c=Ae[n];if(!c)throw new _(n);return!(t.enabledTransports&&-1===B(t.enabledTransports,e)||t.disabledTransports&&-1!==B(t.disabledTransports,e))?(o=Object.assign({ignoreNullOrigin:t.ignoreNullOrigin},o),s=new Oe(e,r,i?i.getAssistant(c):c,o)):s=Le,s},Le={isSupported:function(){return!1},connect:function(t,e){var n=M.defer((function(){e(new w)}));return{abort:function(){n.ensureAborted()},forceMinPriority:function(){}}}};var Re=function(t){if(void 0===Ce.getAuthorizers()[t.transport])throw"'"+t.transport+"' is not a recognized auth transport";return function(e,n){var o=function(t,e){var n="socket_id="+encodeURIComponent(t.socketId);for(var r in e.params)n+="&"+encodeURIComponent(r)+"="+encodeURIComponent(e.params[r]);if(null!=e.paramsProvider){var o=e.paramsProvider();for(var r in o)n+="&"+encodeURIComponent(r)+"="+encodeURIComponent(o[r])}return n}(e,t);Ce.getAuthorizers()[t.transport](Ce,o,t,r.UserAuthentication,n)}},je=function(t){if(void 0===Ce.getAuthorizers()[t.transport])throw"'"+t.transport+"' is not a recognized auth transport";return function(e,n){var o=function(t,e){var n="socket_id="+encodeURIComponent(t.socketId);for(var r in n+="&channel_name="+encodeURIComponent(t.channelName),e.params)n+="&"+encodeURIComponent(r)+"="+encodeURIComponent(e.params[r]);if(null!=e.paramsProvider){var o=e.paramsProvider();for(var r in o)n+="&"+encodeURIComponent(r)+"="+encodeURIComponent(o[r])}return n}(e,t);Ce.getAuthorizers()[t.transport](Ce,o,t,r.ChannelAuthorization,n)}},Ie=function(){return(Ie=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};function De(t){return t.httpHost?t.httpHost:t.cluster?"sockjs-"+t.cluster+".pusher.com":s.httpHost}function Ne(t){return t.wsHost?t.wsHost:"ws-"+t.cluster+".pusher.com"}function He(t){return"https:"===Ce.getProtocol()||!1!==t.forceTLS}function Ue(t){return"enableStats"in t?t.enableStats:"disableStats"in t&&!t.disableStats}function Me(t){var e=Ie(Ie({},s.userAuthentication),t.userAuthentication);return"customHandler"in e&&null!=e.customHandler?e.customHandler:Re(e)}function ze(t,e){var n=function(t,e){var n;return"channelAuthorization"in t?n=Ie(Ie({},s.channelAuthorization),t.channelAuthorization):(n={transport:t.authTransport||s.authTransport,endpoint:t.authEndpoint||s.authEndpoint},"auth"in t&&("params"in t.auth&&(n.params=t.auth.params),"headers"in t.auth&&(n.headers=t.auth.headers)),"authorizer"in t&&(n.customHandler=function(t,e,n){var r={authTransport:e.transport,authEndpoint:e.endpoint,auth:{params:e.params,headers:e.headers}};return function(e,o){var i=t.channel(e.channelName);n(i,r).authorize(e.socketId,o)}}(e,n,t.authorizer))),n}(t,e);return"customHandler"in n&&null!=n.customHandler?n.customHandler:je(n)}var qe=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Be=function(t){function e(e){var n=t.call(this,(function(t,e){Z.debug("No callbacks on watchlist events for "+t)}))||this;return n.pusher=e,n.bindWatchlistInternalEvent(),n}return qe(e,t),e.prototype.handleEvent=function(t){var e=this;t.data.events.forEach((function(t){e.emit(t.name,t)}))},e.prototype.bindWatchlistInternalEvent=function(){var t=this;this.pusher.connection.bind("message",(function(e){"pusher_internal:watchlist_events"===e.event&&t.handleEvent(e)}))},e}(pt);var Fe=function(){var t,e;return{promise:new Promise((function(n,r){t=n,e=r})),resolve:t,reject:e}},Xe=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])})(e,n)};return function(e,n){function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),Je=function(t){function e(e){var n=t.call(this,(function(t,e){Z.debug("No callbacks on user for "+t)}))||this;return n.signin_requested=!1,n.user_data=null,n.serverToUserChannel=null,n.signinDonePromise=null,n._signinDoneResolve=null,n._onAuthorize=function(t,e){if(t)return Z.warn("Error during signin: "+t),void n._cleanup();n.pusher.send_event("pusher:signin",{auth:e.auth,user_data:e.user_data})},n.pusher=e,n.pusher.connection.bind("state_change",(function(t){var e=t.previous,r=t.current;"connected"!==e&&"connected"===r&&n._signin(),"connected"===e&&"connected"!==r&&(n._cleanup(),n._newSigninPromiseIfNeeded())})),n.watchlist=new Be(e),n.pusher.connection.bind("message",(function(t){"pusher:signin_success"===t.event&&n._onSigninSuccess(t.data),n.serverToUserChannel&&n.serverToUserChannel.name===t.channel&&n.serverToUserChannel.handleEvent(t)})),n}return Xe(e,t),e.prototype.signin=function(){this.signin_requested||(this.signin_requested=!0,this._signin())},e.prototype._signin=function(){this.signin_requested&&(this._newSigninPromiseIfNeeded(),"connected"===this.pusher.connection.state&&this.pusher.config.userAuthenticator({socketId:this.pusher.connection.socket_id},this._onAuthorize))},e.prototype._onSigninSuccess=function(t){try{this.user_data=JSON.parse(t.user_data)}catch(e){return Z.error("Failed parsing user data after signin: "+t.user_data),void this._cleanup()}if("string"!=typeof this.user_data.id||""===this.user_data.id)return Z.error("user_data doesn't contain an id. user_data: "+this.user_data),void this._cleanup();this._signinDoneResolve(),this._subscribeChannels()},e.prototype._subscribeChannels=function(){var t,e=this;this.serverToUserChannel=new Nt("#server-to-user-"+this.user_data.id,this.pusher),this.serverToUserChannel.bind_global((function(t,n){0!==t.indexOf("pusher_internal:")&&0!==t.indexOf("pusher:")&&e.emit(t,n)})),(t=this.serverToUserChannel).subscriptionPending&&t.subscriptionCancelled?t.reinstateSubscription():t.subscriptionPending||"connected"!==e.pusher.connection.state||t.subscribe()},e.prototype._cleanup=function(){this.user_data=null,this.serverToUserChannel&&(this.serverToUserChannel.unbind_all(),this.serverToUserChannel.disconnect(),this.serverToUserChannel=null),this.signin_requested&&this._signinDoneResolve()},e.prototype._newSigninPromiseIfNeeded=function(){if(this.signin_requested&&(!this.signinDonePromise||this.signinDonePromise.done)){var t=Fe(),e=t.promise,n=t.resolve;t.reject;e.done=!1;var r=function(){e.done=!0};e.then(r).catch(r),this.signinDonePromise=e,this._signinDoneResolve=n}},e}(pt),We=function(){function t(e,n){var r,o,i,c=this;!function(t){if(null==t)throw"You must pass your app key when you instantiate Pusher."}(e),function(t){if(null==t)throw"You must pass an options object";if(null==t.cluster)throw"Options object must provide a cluster";"disableStats"in t&&Z.warn("The disableStats option is deprecated in favor of enableStats")}(n),this.key=e,this.config=(o=this,i={activityTimeout:(r=n).activityTimeout||s.activityTimeout,cluster:r.cluster,httpPath:r.httpPath||s.httpPath,httpPort:r.httpPort||s.httpPort,httpsPort:r.httpsPort||s.httpsPort,pongTimeout:r.pongTimeout||s.pongTimeout,statsHost:r.statsHost||s.stats_host,unavailableTimeout:r.unavailableTimeout||s.unavailableTimeout,wsPath:r.wsPath||s.wsPath,wsPort:r.wsPort||s.wsPort,wssPort:r.wssPort||s.wssPort,enableStats:Ue(r),httpHost:De(r),useTLS:He(r),wsHost:Ne(r),userAuthenticator:Me(r),channelAuthorizer:ze(r,o)},"disabledTransports"in r&&(i.disabledTransports=r.disabledTransports),"enabledTransports"in r&&(i.enabledTransports=r.enabledTransports),"ignoreNullOrigin"in r&&(i.ignoreNullOrigin=r.ignoreNullOrigin),"timelineParams"in r&&(i.timelineParams=r.timelineParams),"nacl"in r&&(i.nacl=r.nacl),i),this.channels=Qt.createChannels(),this.global_emitter=new pt,this.sessionID=Ce.randomInt(1e9),this.timeline=new Te(this.key,this.sessionID,{cluster:this.config.cluster,features:t.getClientFeatures(),params:this.config.timelineParams||{},limit:50,level:Pe.INFO,version:s.VERSION}),this.config.enableStats&&(this.timelineSender=Qt.createTimelineSender(this.timeline,{host:this.config.statsHost,path:"/timeline/v2/"+Ce.TimelineTransport.name}));this.connection=Qt.createConnectionManager(this.key,{getStrategy:function(t){return Ce.getDefaultStrategy(c.config,t,xe)},timeline:this.timeline,activityTimeout:this.config.activityTimeout,pongTimeout:this.config.pongTimeout,unavailableTimeout:this.config.unavailableTimeout,useTLS:Boolean(this.config.useTLS)}),this.connection.bind("connected",(function(){c.subscribeAll(),c.timelineSender&&c.timelineSender.send(c.connection.isUsingTLS())})),this.connection.bind("message",(function(t){var e=0===t.event.indexOf("pusher_internal:");if(t.channel){var n=c.channel(t.channel);n&&n.handleEvent(t)}e||c.global_emitter.emit(t.event,t.data)})),this.connection.bind("connecting",(function(){c.channels.disconnect()})),this.connection.bind("disconnected",(function(){c.channels.disconnect()})),this.connection.bind("error",(function(t){Z.warn(t)})),t.instances.push(this),this.timeline.info({instances:t.instances.length}),this.user=new Je(this),t.isReady&&this.connect()}return t.ready=function(){t.isReady=!0;for(var e=0,n=t.instances.length;e<n;e++)t.instances[e].connect()},t.getClientFeatures=function(){return X(V({ws:Ce.Transports.ws},(function(t){return t.isSupported({})})))},t.prototype.channel=function(t){return this.channels.find(t)},t.prototype.allChannels=function(){return this.channels.all()},t.prototype.connect=function(){if(this.connection.connect(),this.timelineSender&&!this.timelineSenderTimer){var t=this.connection.isUsingTLS(),e=this.timelineSender;this.timelineSenderTimer=new U(6e4,(function(){e.send(t)}))}},t.prototype.disconnect=function(){this.connection.disconnect(),this.timelineSenderTimer&&(this.timelineSenderTimer.ensureAborted(),this.timelineSenderTimer=null)},t.prototype.bind=function(t,e,n){return this.global_emitter.bind(t,e,n),this},t.prototype.unbind=function(t,e,n){return this.global_emitter.unbind(t,e,n),this},t.prototype.bind_global=function(t){return this.global_emitter.bind_global(t),this},t.prototype.unbind_global=function(t){return this.global_emitter.unbind_global(t),this},t.prototype.unbind_all=function(t){return this.global_emitter.unbind_all(),this},t.prototype.subscribeAll=function(){var t;for(t in this.channels.channels)this.channels.channels.hasOwnProperty(t)&&this.subscribe(t)},t.prototype.subscribe=function(t){var e=this.channels.add(t,this);return e.subscriptionPending&&e.subscriptionCancelled?e.reinstateSubscription():e.subscriptionPending||"connected"!==this.connection.state||e.subscribe(),e},t.prototype.unsubscribe=function(t){var e=this.channels.find(t);e&&e.subscriptionPending?e.cancelSubscription():(e=this.channels.remove(t))&&e.subscribed&&e.unsubscribe()},t.prototype.send_event=function(t,e,n){return this.connection.send_event(t,e,n)},t.prototype.shouldUseTLS=function(){return this.config.useTLS},t.prototype.signin=function(){this.user.signin()},t.instances=[],t.isReady=!1,t.logToConsole=!1,t.Runtime=Ce,t.ScriptReceivers=Ce.ScriptReceivers,t.DependenciesReceivers=Ce.DependenciesReceivers,t.auth_callbacks=Ce.auth_callbacks,t}(),Ge=e.default=We;Ce.setup(We)}])}));
//# sourceMappingURL=pusher.min.js.map
"use strict";
const FindContext = (()=>{
   const self = {};

    self.fetchApis = {
        "staff":`${main_view.base_url}/api/employee/find`,
        "employee":`${main_view.base_url}/ypg/employee/list`,
        // "parent":`${main_view.base_url}/api/guardian/find`,
        //"user":`${main_view.base_url}/api/user/find`  
    };  

    self.getTitle = (role)=>{
       switch(role){
          case  'sfaff':
          case 'employee':  
            return "Find Staff";
          default:{
            return 'Find Someone'
          }  
       }
    };

    self.getColumns = (role)=>{
        switch(role){
            case 'staff': 
            case 'employee':
               {
                   return [
                     {
                        title:"Emp_ID",
                        data:"id"
                     },
                    {
                        title:"ID",
                        data:"code"
                     },
                     {
                        title:"Name",
                        data:"name"
                     },
                     {
                        title:"Sex",
                        data:"sex"
                     },
                     {
                        title:"Email",
                        data:"email"
                     },
                     {
                        title:"Position",
                        name:"position",
                        data:(data,index,tr)=>{
                           return [`<span class="text-primary">`,data.position_id,` </span>`].join('');
                        } 
                     },
                   ];
                   
               }
               
            case 'user':  
            case 'login':{
                return [
                     {
                        title:"Login",
                        data:"login_name"
                     },
                     {
                        title:"Full Name",
                        data:"full_name"
                     },
                     {
                        title:"Type",
                        data:"user_class"
                     },
                     {
                        title:"Role",
                        data:"role"
                     },
                     {
                        title:"email",
                        data:"email"
                     },
                     {
                        title:"Phone",
                        data:"phone_number"
                     }
                   ];
            }
            default:{
               return [];
            } 
         }
    };


    self.getContext = (role)=>{
        return {
            "title": self.getTitle(role),
            "columns": self.getColumns(role),
            "fetchApi":self.fetchApis[role],
        };
    };

    return self;
})();

const FindPersonDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        //let dTitle = 'Find Someone';
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-lg",
            createContent:(me)=>{
                return [
                  `<div class="d-flex flex-column">`,
                      `<div class="d-flex">`,
                        `<input name="search_value" class="form-control" placeholder="Search" />`,
                      `</div>`,
                      `<div class="w-100">`,
                         `<table name="tblPersons" id="tblPersons" class="table mt-3">`,
                             
                         `<thead></thead><tbody></tbody>`,
                         `</table>`,
                       `</div>`,
                   `</div>`,
               ].join('');
            },
            contentCreated:(me)=>{
                me.renderColumns = (tbl, cols) => {
                  
                    const thead = tbl.querySelector('thead');
                    const tbody = tbl.querySelector('tbody');
                    thead.innerHTML = '';
                    tbody.innerHTML = '';
                    let rows =``;
                    let html = '';
                    cols.map(c =>{
                        html = [html, '<th>',c.title,'</th>'].join('');
                    });
                    thead.innerHTML = ['<tr>',html,'</tr>'].join('');
                    
                    rows = [rows ,`<tr>
                                 <td colspan="100%" >
                                    <span class="d-flex align-items-center justify-content-center">Search for someone here</span>
                                 </td>
                              </tr>`].join('');
                    tbody.innerHTML = rows;
                    // tbody.addEventListener('click', function(event) 
                    tbody.onclick = (event) =>{
                     let tr = VSUtil.closestLimited(event.target,'tr');
                     if (tr) {
                        tr.classList.toggle('row-selected'); 
                        if(me.dataOptions.singleSelect && tr.classList.contains('row-selected')){
                           if(me.prev_selected_tr) me.prev_selected_tr.classList.remove('row-selected');
                        }
                        me.prev_selected_tr = tr;
                     }
                  };
                };
              
               me.getSelection = (tbl, cols)=>{
                 //const tbl = me.controls.tblPersons;
                 //const context = FindContext.getColumns(me.dataOptions.role);`
                 let tbody = tbl.querySelector('tbody');
                 let ps = [];
                 let tds = null;
                 tbody.querySelectorAll('tr').forEach(tr =>{
                     if(tr.classList.contains('row-selected')){
                        tds = tds||tr.querySelectorAll('td') 
                        let item = {};
                        tds.forEach(td=>{
                           item[td.dataset.name] = td.textContent;
                        });
                        item.emp_id = tr.dataset.id;
                        item.id = tr.dataset.id;
                        ps.push(item);
                     }
                 });
                 return ps;
               }

               me.beginSearch = (search_value,tbl,context) =>{
                   let p = {"search_value":search_value};
                   vsapi.call(context.fetchApi,p,false,false).then(res =>{
                     let data = res.status_code ==200 ? res.data : [];
                     me.renderItems(data,tbl,context.columns);
                   });
               }

               me.renderItems = (data,tbl,cols)=>{
                  const tbody = tbl.querySelector('tbody');
                   tbody.innerHTML = '';
                   let index =0;
                   let html = '';
                   data.map(item =>{
                     let row_html ='';
                        cols.map(c =>{
                           let name = c.name;
                           let val = typeof c.data == 'function' ? c.data(item,index) : (item[c.data || c.name]);
                           
                           row_html = [row_html,'<td data-name="',name,'">',val,'</td>'].join('');
                        });
                        html += ['<tr data-id="',item.id,'">',row_html,'</tr>'].join('');
                        index++;
                   });
                   tbody.innerHTML = html;
               }

               me.controls.search_value.onkeyup = e =>{
                  setTimeout(()=>{
                     me.beginSearch(e.target.value,me.controls.tblPersons,me.context);
                  },300);
               };
            },
            // extendMethods:{
            //     "getData":(me,dataOptions)=>{
            //        return {"photo":me.controls.userImageBox.getImage()};
            //     }
            // },
            prepareFormOptions:{
               createTitle: "Find Someone",
            },
            onPrepareForm:(me,data,fields,divModal)=>{
               me.controls.search_value.value = '';
               const context = FindContext.getContext(me.dataOptions.role);
               me.context = context;
               divModal.querySelector('.modal-header').classList.add('border-0','pb-0');
               divModal.querySelector('.modal-footer').classList.add('border-0','pt-0');
               me.renderColumns(me.controls.tblPersons, context.columns);
               const elTitle = divModal.querySelector('.modal-content .modal-title');
               if(elTitle){
                  elTitle.textContent = context.title; 
               }
               LocaleManager.translateZone(me.divModal);
            },
            buttons:[
               {
                 label:"<span>Cancel</span>",
                 cssClass:"btn btn-warning",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:'<span vslang="DataTransferItemList.OK"></span>',
                cssClass:'btn btn-primary',
                click:(me)=>{
                  me.context = me.context || FindContext.getContext(me.dataOptions.role);  
                  const p = me.getSelection(me.controls.tblPersons,me.context.columns);
                  if (!p || !p[0]){
                     cv_interact.warning('No one is selected!');
                     return;
                  }
                  const d = me.dataOptions.singleSelect ? p[0]: p;
                  me.hide(true,d);
                }
              }  
            ],
        
         });
        dialog.show(op);
     }

   return self;
})();
"use strict";
const PusherClient = new function(){
    const mThis = this;
 
    this.branch_id = document.querySelector('meta[name="sess_branch_id"]').getAttribute('content');
    this.user_id = document.querySelector('meta[name="sess_user_id"]').getAttribute('content');
    // this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
    // this.user_id = $('meta[name="sess_user_id"]').attr('content');
    this.base_url = main_view.base_url || document.querySelector('meta[name="base_url"]').getAttribute('content');
    this.current_view_name = '';

       //*** For Demo DMS */
    this.backend_channel_name = ['dms.backend.',this.branch_id].join('');
    //*** FOr HouExpress */
   // this.backend_channel_name = ['houex.backend.',this.branch_id].join('');
   
    this.pusher_channel = {'bind':()=>{ return;}};

    //pusher_app_key are in .env file, and in main.js
    //cookie_name are set in main.js, app.js, vsapi.js, loginController.php, Master.blade.php, "login/index.blade.php" 
    
    //*** For Demo DMS */
    const pusher_app_key = 'e71b395ef6f9326086ca'; //process.env.PUSHER_APP_KEY 

    //** For HOUExpress */
    //let pusher_app_key = '105a036ea697941d67d1'; //process.env.PUSHER_APP_KEY

    const pusher = new Pusher(pusher_app_key,{
        cluster: 'ap1',
        useTLS:true,
        disableStats:true,
        // authEndpoint:"/dms/broadcast/auth",
        //authTransport:'ajax', //two options = {'ajax','jsonp'}. The default is "ajax"
        authorizer: function authorizer(channel, options){
            return {
                authorize: function authorize(socketId, callback) {
                    const p = {"socket_id":socketId,"channel_name":channel.name};
                    vsapi.call(`${main_view.base_url}/api/broadcast/auth`,p,false,false).then(d =>{
                        const auth_data = d.data || d;
                        //NOTE: @auth_data ={"auth":"app_key:sig"} . For example,  @auth_data = {"auth":"b7351506ee87f3eec932:3c27d88c6944726d39052efd50770468b23b0e9987e981acbc5ed58ba4bb1d51"}
                        if(auth_data){
                             callback(null, auth_data);
                             //console.log('Pusher authorization succeeded!');
                        }else{
                            console.error('Pusher authorization failed. This can happen when token expired!');
                        }
                       
                    });
                }
            };
        }
    });
 
    pusher.connection.bind('error', function(err) {
        console.error("Pusher error:", err);
    });
    
    pusher.connection.bind('connected',(payload)=>{
        console.info('Web socket connection successful :)');
    });
 
    mThis.pusher_channel = pusher.subscribe(`private-${mThis.backend_channel_name}`);

    mThis.pusher_channel.bind('pusher:subscription_succeeded',(d)=>{
        console.info("Channel subscription succeeded");
    });

    mThis.pusher_channel.bind('pusher:subscription_error',(d)=>{
        console.error("Channel subscription error: "+d);
    });

    mThis.pusher_channel.bind('order_image_created',d=>{
        let data = d.data;
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data.message,
            toast:true,
            showConfirmButton: false,
            timer:2000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
        });

        let order_id = data.order?data.order.id:0;
        let image_count = (data.order || {}).image_count; 
        OrderImagesComponent.addImage(order_id,data.img,image_count);
    });

    mThis.pusher_channel.bind('order_image_deleted',d=>{
        let data = d.data;
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: data.message,
            toast:true,
            showConfirmButton: false,
            timer:2000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
        });

        let order_id = data.order_id;
        OrderImagesComponent.removeImage(order_id,data.image_id,data.image_count);
    });

    mThis.pusher_channel.bind('package_status_changed',(d) =>{
        let data = d.data;
        //Add new notification to the notif list
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        let msg = DUtil.escapeHtml(data.message);
        if (data.status_id==8) toastr.success(msg,data.title);
        else if (data.status_id==9) toastr.warning(msg,data.title);
        else toastr.info(msg,data.title);

        if(PackageListComponent.self.is(':visible')){
            let tr = PackageListComponent.findRowByBarcode(data.barcode || data.bar_code);
            PackageListComponent.displayDriverData(tr,{"driver_id":data.driver_id,"driver_name":data.driver_name,'status':data.status,'status_id':data.status_id});
        }
        if (TripListComponent.self.is(':visible')){
            TripListComponent.packageStatusChanged_eventHandler(data);
        }

    });

    // mThis.pusher_channel.bind('package_status_changed', (d)=>{
    //     TripListComponent.packageStatusChanged_eventHandler(d);
    // });

    mThis.pusher_channel.bind('order_created', (d)=>{ 
        toastr.info(d.data.message, 'Order Created');
        main_view.addNotificationItem({'title':d.data.title,'message':d.data.message});
        const tr = PickupListComponent.getExpandedRow_tr();
        //Automatically prepend new Order Row (TR), only when there is no expanded row being opened
        if(!tr) PickupListComponent.orderCreated_eventHandler(d);
    });

    mThis.pusher_channel.bind('driver_accepted_order',(d) =>{
        let data = d.data;
        toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Accepted');
        main_view.addNotificationItem({'title':data.title,'message':data.message});

        if(PickupListComponent.tblOrders){
            if(PickupListComponent.tblOrders.style.display !== 'none'){
                let tr = PickupListComponent.findRowByOrdderId(data.order_id);
                PickupListComponent.updatePickupStatus(tr,data);
            }
        }
    });

    mThis.pusher_channel.bind( 'driver_canceled_order',(d) =>{
        let data = d.data;
        toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Canceled');
        main_view.addNotificationItem({'title':data.title,'message':data.message});

        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        }
    });

    mThis.pusher_channel.bind('pickup_driver_changed',(d) =>{
        let data = d.data;
        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            toastr.success(DUtil.escapeHtml(data.message),'Pickup Driver Changed',data.title?data.title:'Pickup Driver Changed');
            main_view.addNotificationItem({'title':data.title,'message':data.message});
            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        }
    });

    mThis.pusher_channel.bind( 'order_status_changed',(d) =>{
        let data = d.data;

        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            main_view.addNotificationItem({'title':data.title,'message':data.message});
            toastr.success(DUtil.escapeHtml(data.message),data.title?data.title:'Order Status');

            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            PickupListComponent.updatePickupStatus(tr,data);
        } 
    });
                    
    mThis.pusher_channel.bind('order_deleted',(d) =>{
        let data = d.data;
        toastr.error(DUtil.escapeHtml(data.message),'Order Deleted',data.title?data.title:'Order Deleted');
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            let tr = PickupListComponent.findRowByOrdderId(data.order_id);
            if(tr){
                const detail_tr = tr.nextElementSibling;
                if (detail_tr && detail_tr.classList.contains('detail-row')){
                    detail_tr.remove();
                }
                tr.remove();
            }
        }
    });
   
    mThis.pusher_channel.bind('package_photo_picked',(d) =>{
        let data = d.data;
        data.title = data.title || 'Photo Picked';
        toastr.info(DUtil.escapeHtml(data.message),'Photo Picked',data.title);
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            PickupListComponent.setImageCount(data.order_id,data.img_count); 
        }
    });

    mThis.pusher_channel.bind('package_photo_deleted',(d) =>{
        let data = d.data;
        data.title = data.title || 'Photo Deleted';
        toastr.warning(DUtil.escapeHtml(data.message),'Photo Deleted',data.title);
        main_view.addNotificationItem({'title':data.title,'message':data.message});
        if(PickupListComponent.tblOrders && PickupListComponent.tblOrders.style.display !== 'none'){
            PickupListComponent.setImageCount(data.order_id,data.img_count); 
        }
    });

    mThis.pusher_channel.bind('message_received', function(data) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: JSON.stringify(data),
            toast:true,
            showConfirmButton: false,
            timer:2000,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
        });
    });
}
"use strict";

var DashboardComponent = new (function () {
	const mThis = this;
	mThis.title_prop = "Dashboard";
	mThis.base_url = main_view.base_url;
	mThis.self = main_view.VSAppContent.querySelector("#_main_dashboard_component");

	mThis.init = () => {
		if (mThis.initAlready) return;
		mThis.initAlready = true;
	};
  
	mThis.renderDashboard = () => {
		const div = mThis.self;
		const html = `
			<div class="row gy-3 mt-1">
				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-primary rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Total Zones</h5>
									<h2 class="fw-bold text-dark mb-3">120</h2>
									<small class="text-success">+1 from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/home_zone.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-success rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Active Zones</h5>
									<h2 class="fw-bold text-dark mb-3">90</h2>
									<small class="bg-success rounded-4 px-2 py-1 text-white">Operational</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/active_zone.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-warning rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Security Level</h5>
									<h2 class="fw-bold text-dark mb-3">Normal</h2>
									<small class="d-none text-success">+1 from last month</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/security.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="col-12 col-md-6 col-lg-3">
					<div class="card border border-danger rounded-3 shadow-sm h-100">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-start">
								<div>
									<h5 class="text-primary-custom mb-3">Electricity Usage</h5>
									<h2 class="fw-bold text-danger mb-3">282.3 kW</h2>
									<small class="text-success">+5.2% from last hour</small>
								</div>
								<div class="text-primary">
									<img class="img--size" src="${main_view.asset_url}/images/icons/electricity.svg" alt=""/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="row gy-3 mt-1">
				<div class="col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header text-primary-custom border-0 fw-semibold" style="background-color: #E7E7E7;">Building Occupancy</div>
						<div class="card-body" style="height:300px;">
							<canvas id="chartOccupancy"></canvas>
						</div>
					</div>
				</div>

				<div class="col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header text-primary-custom border-0 fw-semibold" style="background-color: #E7E7E7;">Annual Electricity Consumption</div>
						<div class="card-body" style="height:300px;">
							<canvas id="chartElectricity"></canvas>
						</div>
					</div>
				</div>
			</div>

			<div class="row gy-3 mt-1">
				<div class="col-12 col-md-6 col-lg-6">
					<div class="card shadow-sm border-0 rounded-3 h-100">
						<div class="card-header bg-white border-0 fw-semibold">Facility Health Status</div>
						<div class="card-body small">
							<div class="mb-2">HVAC Systems <span class="float-end">92%</span>
								<div class="progress"><div class="progress-bar bg-primary" style="width:92%"></div></div>
							</div>
							<div class="mb-2">Plumbing Systems <span class="float-end">87%</span>
								<div class="progress"><div class="progress-bar bg-info" style="width:87%"></div></div>
							</div>
							<div class="mb-2">Electrical Systems <span class="float-end">95%</span>
								<div class="progress"><div class="progress-bar bg-success" style="width:95%"></div></div>
							</div>
							<div class="mb-2">Structural Elements <span class="float-end">98%</span>
								<div class="progress"><div class="progress-bar bg-warning" style="width:98%"></div></div>
							</div>
							<div>Network Infrastructure <span class="float-end">85%</span>
								<div class="progress"><div class="progress-bar bg-danger" style="width:85%"></div></div>
							</div>
						</div>
					</div>
				</div>
			</div>`;

		div.innerHTML = html;

		Object.assign(div.style, {
			height: (window.innerHeight - 90) + "px",
			overflow: "auto"
		});
		window.onresize = () => {
			Object.assign(div.style, {
				height: (window.innerHeight - 90) + "px",
				overflow: "auto"
			});
		};

		mThis.initCharts();
	};

	mThis.initCharts = () => {
		if (typeof Chart === "undefined") return;

		// Electricity Line Chart
		new Chart(document.getElementById("chartElectricity"), {
			type: 'line',
			data: {
				labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
				datasets: [
					{ label:"Consumption", data:[40,55,60,75,65,85,70,60,55,68,72,90], borderColor:"#0d6efd", backgroundColor:"rgba(13,110,253,0.1)", fill:true, tension:0.3 },
					{ label:"Cost", data:[35,50,65,70,60,80,65,58,60,70,78,88], borderColor:"#dc3545", backgroundColor:"rgba(220,53,69,0.1)", fill:true, tension:0.3 }
				]
			},
			options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}} }
		});

		new Chart(document.getElementById("chartOccupancy"), {
			type: 'bar',
			data: {
				labels: ["Floor 1","Floor 2","Floor 3","Floor 4","Floor 5","Floor 6"],
				datasets: [
					{ label:"Semester 1", data:[70,60,85,90,65,75], backgroundColor:"rgba(26,22,71,0.85)", borderRadius:6, maxBarThickness:20 },
					{ label:"Semester 2", data:[60,55,80,85,60,70], backgroundColor:"rgba(246,214,115,0.85)", borderRadius:6, maxBarThickness:20 }
				]
			},
			options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}, scales:{x:{grid:{display:false}}, y:{grid:{color:"#f1f3f5"}, ticks:{stepSize:20}}}}
		});
	};

	mThis.show = function () {
		main_view.setContentView(mThis.self, mThis.title_prop);
		mThis.renderDashboard();
	};

	return mThis;
})();

"use strict";

var TenantProfileComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Tenant Management";
    this.defaultPage = "profile_view";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.btnDocument = mThis.self.querySelector("#_btnDocument");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant_");
    mThis.elStatus = mThis.self.querySelector("#_el_tenant_status");
    mThis.btnBack = document.querySelector("#_btn_back_tenant");
    mThis.divTenantListContainer = mThis.self.querySelector(
        "#_tenant_list_container",
    );
    mThis.divProfileView = document.querySelector("#_ten_profile_view");
    mThis.cardViewContainer = mThis.self.querySelector("#_tenant_card_view");
    mThis.listViewContainer = mThis.self.querySelector("#_tenant_list_view");
    mThis.currentViewMode = "card";
    mThis.paginationContainer = mThis.self.querySelector(
        "#tenant_card_container_pagination",
    );
    this.pages = {
        tenant_list: this.divTenantListContainer,
        profile_view: this.divProfileView,
    };
    mThis.profile_info_tenant = this.divProfileView.querySelector(
        "#profile_info_tenant",
    );

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.tenantCardView = new ListView(mThis.cardViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            renderItems: (items, container) => {
                mThis.renderTenantCard(container, items);
            },
            listContainerClass: null,
        });
        mThis.tenantListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase text-nowrap",
            rowCreated: (data, index, tr) => {
                // console.log(9090,tr);

                // tr.dataset.id = data.id;
                // tr.dataset.statusid = data.status_id;
                // mThis.initDropdownMenus(tr);
                if (data.id !== 1) {
                    tr.style.display = "none"; // hide rows that don't match
                }
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                mThis.initDropdownMenus(tr);
            },
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.renderView();
                    mThis.tenantListView.showPage(mThis.getFilterData());
                },
            };
            CreateTenantDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("tenant_list", mThis.getFilterData());
        };
        const cardTab = document.getElementById("tenantViewCard");
        const listTab = document.getElementById("tenantViewList");
        if (cardTab && listTab) {
            cardTab.addEventListener("change", () => {
                mThis.currentViewMode = "card";
                mThis.renderView();
            });

            listTab.addEventListener("change", () => {
                mThis.currentViewMode = "list";
                mThis.renderView();
            });
        }
        mThis.pr_tbl = mThis.tenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        };
        mThis.tblTenant = mThis.tenantListView.getTable();

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.renderView();
            };
        });
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.renderView();
            }, 250);
        };

        mThis.initDropdownMenus(mThis.cardViewContainer);
        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = (listContainer) => {
        const menuOptions = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2">View Details</span>',
                    icon: `<i class="fa-solid fa-user fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_profile",
                },
                {
                    html: '<span class="ps-2">Modify Tenant</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_tenant",
                },
                {
                    html: '<span class="ps-2">Delete Tenant</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant",
                },
                {
                    html: '<span class="ps-2">Upload Document</span>',
                    icon: `<i class="fa-solid fa-file-upload fs-5 text-muted"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "upload_document",
                },
                {
                    html: '<span class="ps-2">Create Contract</span>',
                    icon: `<i class="fa-solid fa-file-contract fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract",
                },
                {
                    html: '<span class="ps-2">Service Requests</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "service_request",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                // console.log(123456, status_id);

                // menu.edit_student.style.display = enroll_finalized == 1 ? 'none' : 'block';
                menu.create_contract.style.display =
                    Number(status_id) !== 2 ? "block" : "none";
                menu.service_request.style.display = "none";
                // menu.upload_document.style.display =status_id == 1 || status_id == 2  ? "block" : "none";
            },
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_profile": {
                        mThis.showPage("profile_view", { tenant_id: id });
                        break;
                    }
                    case "create_contract": {
                        mThis.createContract(id, menuLink);
                        break;
                    }
                    case "upload_document": {
                        mThis.uploadDocument(id, menuLink);
                        break;
                    }
                    case "modify_document": {
                        mThis.modifyDocument(id, menuLink);
                        break;
                    }
                    case "modify_tenant": {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case "delete_tenant": {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    case "service_request": {
                        mThis.serviceRequest(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };
    mThis.editTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateTenantDialog.show(op);
    };
    mThis.serviceRequest = (id, menuLink) => {
        let op = {
            id: null, // id
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateServiceRequestDialog.show(op);
    };
    mThis.createContract = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        ContractDialog.show(op);
    };
    mThis.uploadDocument = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // console.log(111, op);

        TenantDocumentDialog.show(op);
    };
    mThis.modifyDocument = (id, menuLink) => {
        onClose: (() => {
            mThis.renderView();
        },
            // mThis.showPage("profile_view", { tenant_id: id });
            TenantDocumentDialog.show(op));
    };
    mThis.renewContract = (id, menuLink) => {
        let op = {
            id: null,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // renewDialog.show(op);
        // alert("coming soon!");
    };
    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Tenant?",
            {
                title: "Delete Tenant",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/tenant/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                mThis.renderView();
                                cv_interact.success("Tenant has been deleted.");
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.renderTenantCard = (div, data) => {
        data = data ?? [];
        // if (!AuthManager) {
        //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
        //     return;
        // }
        AuthManager.init().then((user) => {
            mThis.renderCard(div, data);
        });
    };
    mThis.renderCard = (container, data) => {
        // console.log(8888, data);
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                /** Backend: status_id 2 means tenant has a currently active contract. */
                const hasContractAlready = Number(d.status_id) === 2;
                const currentUnitCode =
                    hasContractAlready && d.space_code ? d.space_code : "Unit";
                const status = (d.status || "Pending").toLowerCase();
                let statusClass = "";
                switch (status) {
                    case "active":
                        statusClass =
                            "badge text-success bg-success-subtle border border-success";

                        break;
                    case "inactive":
                        statusClass =
                            "badge text-danger bg-danger-subtle border border-danger";

                        break;
                    default:
                        statusClass =
                            "badge text-warning bg-warning-subtle border border-warning";

                        break;
                }
                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:80px;height:80px;">
                                            <img src="${d.image_url || main_view.asset_url + "/images/default/placeholder.svg"}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
                                        </div>
                                        <div class="flex items-start justify-between mb-6">
                                            <span class="fw-semibold text-start mb-1 text-dark text-capitalize">${d.name}</span>
                                            <div class="d-flex align-items-center mt-1 gap-2">
                                                    <span class="${statusClass}" style="min-width:70px; text-transform: capitalize;">${status}</span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0"> <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body text-center" style="background-color:#fbfcfd; padding: 1rem;">
                                <div class="row g-4 py-2 border-bottom border-gray">
                                    <div class="col-5">
                                        <div class="card bg-prm-custom text-center shadow-sm">
                                                <div class="fs-6 py-1 text-gold-custom">${currentUnitCode}</div>
                                        </div>
                                    </div>
                                    <div class="col-1"></div>
                                    <div class="col-6">
                                        ${
                                            hasContractAlready
                                                ? `
                                                <div class="d-flex flex-column text-center gap-1">
                                                    <span class="text-prm-custom fw-semibold">
                                                        Lease Expiry
                                                    </span>
                                                    <small class="text-muted">
                                                        ${d.end_date || d.start_date || "â€”"}
                                                    </small>
                                                </div>
                                            `
                                                : `
                                                <div class="text-end">
                                                    <a href="javascript:void(0)"
                                                    class="create-tenant-contract fw-semibold"
                                                    data-id="${d.id}" data-name="${d.name}">
                                                        <span class="tool-tip">
                                                            <i class="fa-solid fa-file-circle-plus text-prm-custom fs-6"></i>
                                                            <span class="tool-tiptext fs-6">Create Contract</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            `
                                        }

                                    </div>
                                </div>
                                <div class="card_container" style="max-width: 250px;">
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-hashtag me-2 text-muted"></i>
                                        <span>${d.code ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-regular fa-calendar me-2 text-muted"></i>
                                        <span>${d.date_of_birth ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-phone me-2 text-muted"></i>
                                        ${d.phone_number || ""}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-at me-2 text-muted"></i>
                                        ${d.email || "_"}
                                    </p>


                                </div>
                            </div>
                                <div class="d-flex justify-content-between rounded-bottom-2 align-items-center px-2 py-2"
                                    style="font-size: 1rem; background-color: #d4d4db; border-top: 1px solid #e2e8f0;">

                                    <span style="color: #64748b; font-size: 0.85rem;">
                                        Last Updated :  ${d.update_user || "System"}
                                    </span>

                                    <a href="javascript:void(0)"
                                    class="text-primary-custom see-tenant-detail  text-decoration-none" style="font-size: 0.85rem;"
                                    data-id="${d.id}">
                                        View Details <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.85rem;"></i>
                                    </a>
                                </div>

                        </div>
                    </div>
                    `;
            });
        } else {
            html += `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    No tenants found
                </div>
            </div>`;
        }
        html += `</div>`;
        container.innerHTML = html;
        const seeProfileInfo =
            mThis.cardViewContainer.querySelectorAll(".see-tenant-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                mThis.showPage("profile_view", tenantId);
                //const employeeData = data.find((emp) => emp.id == employeeId);
                // if (employeeData) {
                //     let sub_content = mThis.self.querySelector("#sub_content");
                //     sub_content.classList.add("d-none");
                //     let view_see_info =
                //         mThis.self.querySelector("#view_see_info__");
                //     view_see_info.classList.remove("d-none");

                //     mThis.renderProfile(employeeData);
                //     mThis.renderCardCenter(employeeId);
                //     mThis.renderCardLeft(employeeId);
                //     mThis.renderCardRight(employeeId);
                //     mThis.renderCardTaxAllowance(employeeId);
                //     mThis.renderEmpDocuments(employeeId);
                // } else {
                //     console.error(
                //         "Employee data not found for ID:",
                //         employeeId
                //     );
                // }
            });
        });

        const createContract = mThis.cardViewContainer.querySelectorAll(
            ".create-tenant-contract",
        );
        createContract.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                const op = {
                    id: null,
                    tenant_id: tenantId,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.renderView();
                    },
                };
                ContractDialog.show(op);
            });
        });
        const container_te = mThis.cardViewContainer;
        const te_parent = container_te;
        te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        te_parent.classList.add("overflow-y-auto");
        te_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };
    };

    mThis.renderView = () => {
        const params = mThis.getFilterData();

        if (mThis.currentViewMode === "card") {
            mThis.cardViewContainer.classList.remove("d-none");
            mThis.listViewContainer.classList.add("d-none");
            mThis.paginationContainer.style.display = "block";
            mThis.tenantCardView.showPage(params);
        } else {
            mThis.cardViewContainer.classList.add("d-none");
            mThis.listViewContainer.classList.remove("d-none");
            mThis.paginationContainer.style.display = "none";
            mThis.tenantListView.showPage(params);
        }
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            // id: 1,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });

        return p;
    };
    mThis.getPageContainer = (pageName) => {
        return mThis.pages[pageName];
    };
    mThis.openTenantDocument = async (id, mode = "view") => {
        const res = await vsapi.call(
            [main_view.base_url, "/prm/tenant/document/download"].join(""),
            { id },
            false,
            null,
        );
        if (res.status_code !== 200) {
            cv_interact.error(res.error_message || "Failed to open document.");
            return;
        }
        const { data_url, file_name } = res.data || {};
        if (!data_url) {
            cv_interact.error("Document URL is missing.");
            return;
        }
        if (mode === "download") {
            const a = document.createElement("a");
            a.href = data_url;
            a.download = file_name || "document";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }

        const extFromName = (file_name || "").split(".").pop();
        const ext = String(
            (res.data && res.data.ext) || extFromName || "",
        ).toLowerCase();

        const overlay = document.createElement("div");
        overlay.style.cssText =
            "position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:pointer;";

        const wrapper = document.createElement("div");
        wrapper.style.cssText =
            "position:relative; max-width:90vw; max-height:90vh;";

        const isImage = ["png", "jpg", "jpeg"].includes(ext);
        const isPdf = ext === "pdf";

        if (isImage) {
            const img = document.createElement("img");
            img.src = data_url;
            img.style.cssText =
                "max-width:100%; max-height:90vh; border-radius:8px; box-shadow:0 4px 32px #000;";
            wrapper.appendChild(img);
        } else if (isPdf) {
            const iframe = document.createElement("iframe");
            iframe.src = data_url;
            iframe.style.cssText =
                "width:80vw; height:85vh; border:none; border-radius:8px;";
            wrapper.appendChild(iframe);
        } else {
            window.open(data_url, "_blank");
            return;
        }

        const btnClose = document.createElement("button");
        btnClose.style.cssText =
            "position:absolute; top:-16px; right:-16px; border:none; background:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer; line-height:1;";
        btnClose.innerHTML = "&times;";
        btnClose.onclick = (e) => {
            e.stopPropagation();
            document.body.removeChild(overlay);
        };

        wrapper.appendChild(btnClose);
        overlay.appendChild(wrapper);
        overlay.onclick = () => document.body.removeChild(overlay);
        document.body.appendChild(overlay);
    };
    mThis.showPage = async (pageName, op = {}) => {
        if (this.self.style.display !== "block") {
            main_view.setContentView(this.self, this.title_prop);
        }
        switch (pageName) {
            case "tenant_list": {
                mThis.currentPage = "tenant_list";
                mThis.renderView();
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                );
                // const data = res.data || {};
                // mThis.renderProfile(data);
                // break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                );
                const data = res.data || {};
                mThis.renderProfile(data);
                break;
            }

            default: {
                return;
            }
        }
        const targetPage = mThis.getPageContainer(pageName);
        const siblings = Array.from(targetPage.parentElement.children);
        // Hide all siblings smoothly
        siblings.forEach((div) => {
            if (div !== targetPage && div.style.display !== "none") {
                div.style.display = "none";
            }
        });
        targetPage.style.display = "block";
    };
    mThis.renderProfile = (data) => {
        // console.log(123, data);

        let cls_class = "";
        if (data && data.status) {
            switch (data.status) {
                case "Pending":
                    cls_class =
                        "badge text-warning bg-warning-subtle border border-warning";
                    break;
                case "Active":
                    cls_class =
                        "badge text-success bg-success-subtle border border-success";
                    break;
                case "Inactive":
                    cls_class =
                        "badge text-danger bg-danger-subtle border border-danger";
                    break;
                default:
                    cls_class = "badge text-muted bg-light";
                    break;
            }
        }
        let html = `
        <div class="row g-4 d-flex align-items-stretch"> <div class="col-12 col-lg-3">
                <div class="card shadow-sm mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column">
                        <div class="position-relative d-inline-block mb-3">
                            <img src="${data.image_url || `${main_view.base_url}/assets/images/default/placeholder.svg`}"
                                class="rounded-circle border shadow-sm"
                                width="140" height="140"
                                style="object-fit: cover; object-position: center;">
                        </div>
                        <h4 class="fw-bold mb-2 text-capitalize">${data.name}</h4>
                        <div class="mb-3">
                            <span class="${cls_class} px-3 py-2">${data.status}</span>
                        </div>
                        <hr class="my-3">

                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-9">
                <div class="card shadow-sm h-100"> 
                    
                    <div class="card-body tab-content">
                        <div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="text-capitalize">${data.name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Gender</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class=" text-primary">${data.phone_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    `;

        mThis.profile_info_tenant.innerHTML = html;

        // ===== Tabs JS =====
        const tabLinks =
            mThis.profile_info_tenant.querySelectorAll("#tenantTabs a");
        const tabPanes =
            mThis.profile_info_tenant.querySelectorAll(".tab-pane");

        tabLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("href").replace("#", "");

                // remove active class
                tabLinks.forEach((l) => l.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                link.classList.add("active");
                const profile_info_tenant =
                    mThis.profile_info_tenant.querySelector(`#${target}`);
                profile_info_tenant.classList.add("active");
                mThis.renderOverView(profile_info_tenant, target, data);
            });
        });

        mThis.setActionsProfileInfo(mThis.profile_info_tenant);
    };
    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };
    mThis._fmtMoney = (n) => {
        if (n == null || n === "") return "â€”";
        const x = Number(n);
        if (Number.isNaN(x)) return String(n);
        return x.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };
    mThis._getUnitCode = (row, fallback = "â€”") => {
        if (!row) return fallback;
        const value =
            row.unit_code ??
            row.space_code ??
            row.unit ??
            row.code ??
            row.unit_number;
        return value == null || value === "" ? fallback : value;
    };
    mThis._leaseHistoryContractsHtml = (renewalEntriesRaw) => {
        const entries = Array.isArray(renewalEntriesRaw)
            ? renewalEntriesRaw
            : [];
        if (!entries.length) {
            return `<div class="text-center py-5 text-muted">
                <i class="fa fa-file-text fa-2x mb-2 opacity-50 d-block"></i>
                <p class="mb-0">No contract recorded for this tenant.</p>
            </div>`;
        }

        // Group by contract_id so we render one card per contract.
        const groupsByContractId = new Map();
        entries.forEach((e) => {
            const cid = e.contract_id ?? "0";
            if (!groupsByContractId.has(cid)) groupsByContractId.set(cid, []);
            groupsByContractId.get(cid).push(e);
        });

        let cards = "";
        groupsByContractId.forEach((group) => {
            if (!group.length) return;
            const first = group[0];

            const contractStatusName = String(
                first.contract_status ?? "",
            ).trim();
            const contractStatusLower = contractStatusName.toLowerCase();

            // const hasCurrent = group.some((r) => !!r.is_current);

            let accent = "#adb5bd";
            let circleBg = "#6c757d";
            let headerBadgeHtml = "";
            let priceColor = "#212529";
            let depositBadgeStyle =
                "color:#3f51d8;background-color:#e7efff;border:1px solid #cfdbff;";

            if (contractStatusLower === "active") {
                accent = "#0f49bd";
                circleBg = "#0f49bd";
                priceColor = "#3f51d8";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">CURRENT</span>`;
            } else if (contractStatusLower === "pending") {
                accent = "#fd7e14";
                circleBg = "#fd7e14";
                priceColor = "#fd7e14";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#fd7e14;">PENDING</span>`;
            } else if (contractStatusLower === "terminated") {
                accent = "#dc3545";
                circleBg = "#dc3545";
                priceColor = "#dc3545";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#dc3545;">TERMINATED</span>`;
            } else {
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 ms-1" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${mThis._escapeHtml(contractStatusName || "â€”")}</span>`;
            }

            const start = mThis._escapeHtml(first.contract_start_date ?? "");
            const end = mThis._escapeHtml(first.contract_end_date ?? "");
            const title = `Contract: ${start} â€” ${end}`;

            const unitPart = mThis._escapeHtml(mThis._getUnitCode(first, "â€”"));
            const sqmPart =
                first.sqm_size != null && first.sqm_size !== ""
                    ? `${mThis._fmtMoney(first.sqm_size)} mÂ²`
                    : "â€”";
            const bldg = first.building_name
                ? mThis._escapeHtml(first.building_name)
                : "";
            const detailPillsHtml = `
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">Unit ${unitPart}</span>
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${sqmPart}</span>
                    ${bldg ? `<span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${bldg}</span>` : ""}
                </div>`;

            const priceNum = Number(first.price ?? 0);
            const sqmNum = Number(first.space_sqm_size ?? first.sqm_size ?? 0);
            const isTotalPriceType =
                String(first.price_type ?? "sqm").toLowerCase() === "total";
            const totalPriceNum = isTotalPriceType
                ? priceNum
                : sqmNum > 0
                  ? priceNum * sqmNum
                  : null;
            const priceLine =
                totalPriceNum != null && !Number.isNaN(totalPriceNum)
                    ? `${VSMoney.formatAmount(totalPriceNum, "USD")}`
                    : "â€”";
            const depositSmallHtml =
                first.deposit != null && first.deposit !== ""
                    ? `Deposit ${VSMoney.formatAmount(first.deposit, "USD")}`
                    : "";
            if (first.deposit_remarks) {
                depositSmallHtml = dep
                    ? `${depositSmallHtml} <span class="text-muted">â€¢ ${mThis._escapeHtml(first.deposit_remarks)}</span>`
                    : `<span class="text-muted">${mThis._escapeHtml(first.deposit_remarks)}</span>`;
            }
            const depositBadgeHtml = depositSmallHtml
                ? `<span class="badge rounded-2 px-3 py-2" style="${depositBadgeStyle}">${depositSmallHtml}</span>`
                : "";

            const renewalsTableRowsHtml = group
                .map((r) => {
                    const isInitial = !!r.is_initial;
                    const renewalDate = r.renewal_date
                        ? mThis._escapeHtml(r.renewal_date)
                        : isInitial
                          ? "Initial"
                          : "â€”";

                    const rowStart = mThis._escapeHtml(
                        r.renewal_start_date ?? "â€”",
                    );
                    const rowEnd = mThis._escapeHtml(r.renewal_end_date ?? "â€”");

                    const rowUnitCode = mThis._escapeHtml(
                        mThis._getUnitCode(first, "â€”"),
                    );
                    const currentBadgeHtml = r.is_current
                        ? `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">Current</span>`
                        : "";

                    const remarks =
                        r.remarks != null && r.remarks !== ""
                            ? mThis._escapeHtml(r.remarks)
                            : "â€”";

                    const updatedBy = r.update_user
                        ? `${mThis._escapeHtml(r.update_user)}${r.updated_at ? ` â€¢ ${mThis._escapeHtml(r.updated_at)}` : ""}`
                        : "â€”";

                    return `<tr class="${r.is_current ? "table-prm-current-row" : ""}">
                        <td class="text-nowrap">${renewalDate}</td>
                        <td class="text-nowrap">${rowStart}</td>
                        <td class="text-nowrap">${rowEnd}</td>
                        <td class="text-nowrap">
                            <span class="fw-semibold text-prm-custom">${rowUnitCode}</span>
                            ${currentBadgeHtml}
                        </td>
                        <td>${remarks}</td>
                        <td class="text-nowrap">${updatedBy}</td>
                    </tr>`;
                })
                .join("");

            const renewalsCount = group.length;

            cards += `<div class="d-flex position-relative mb-4">

                <div class="flex-grow-1 ms-3">
                    <div class="card shadow-sm" style="border-left: 6px solid ${accent};border-radius: 14px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between flex-column flex-md-row mb-3">
                                <div>
                                    <h5 class="card-title mb-1">${title} ${headerBadgeHtml}</h5>
                                    ${detailPillsHtml}
                                </div>
                                <div class="text-end mt-2 mt-md-0">
                                    <small class="text-muted d-block mb-1">Monthly</small>
                                    <p class="h5 mb-0" style="color:${priceColor};">${priceLine}</p>
                                    <div class="mt-2">${depositBadgeHtml}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        return cards;
    };
    mThis.renderOverView = (div, target, data) => {
        if (target == "overview_tenant_detail") {
            const p = { id: data.id };

            vsapi
                .call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const d = res.status_code == 200 ? res.data : {};

                    let html = "";
                    html += `<div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <h5 class="fw-bold mb-2"><i class="fa fa-user me-1 text-primary"></i> Personal Information</h5>
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="">${data.name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Sex</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class="">${data.phone_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>`;
                    div.innerHTML = html;
                });
        }
        if (target == "lease_tenant_history") {
            const p = { id: data.id };
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/lease-history"].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const raw =
                        res.status_code == 200 && res.data != null
                            ? res.data
                            : [];
                    const contracts = Array.isArray(raw) ? raw : [];
                    const cardsHtml =
                        mThis._leaseHistoryContractsHtml(contracts);
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class=" py-4 position-relative overflow-auto lease-history-scroll" style="max-height: 360px; scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;">
                                ${cardsHtml}
                            </div>
                        </div>`;
                })
                .catch((err) => {
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class="alert alert-danger m-3">Failed to load contracts: ${mThis._escapeHtml(err && err.message ? err.message : "Unknown error")}</div>
                        </div>`;
                });
        }
        if (target === "document_tenant_list") {
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/document/list"].join(""),
                    { tenant_id: data.id },
                    false,
                    null,
                )
                .then((res) => {
                    const documents =
                        res.status_code === 200 && Array.isArray(res.data)
                            ? res.data
                            : [];

                    let rows = "";

                    documents.forEach((doc) => {
                        rows += `
                    <tr class="border-bottom">
                        <td class="ps-3 py-3" style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="d-flex align-items-center">
                                <div>
                                    <div class="text-dark">
                                        ${doc.document_type || doc.document_type_id || "â€”"}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.original_file_name || "â€”"}
                            </div>
                        </td>
                        <td style="width: 12%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.ext ? doc.ext.toUpperCase() : "â€”"}
                            </div>
                        </td>
                        <td style="width: 30%; height: 65px; vertical-align: middle;">
                            <span class="text-dark">
                                ${doc.remarks || "_"}
                            </span>
                        </td>
                        <td class="text-end py-3 px-3" style="width: 10%; height: 55px; vertical-align: middle; ">
                            <div class="d-flex justify-content-start gap-2">
                                <a href="javascript:void(0)" class="view-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-eye text-success fs-6"></i>
                                        <span class="tool-tiptext fs-6">View</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="modify-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-edit fs-6 text-warning"></i>
                                        <span class="tool-tiptext fs-6">Modify</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="download-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-solid fa-cloud-arrow-down text-primary fs-6"></i>
                                        <span class="tool-tiptext fs-6">Download</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="delete-doc-btn" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-trash-can text-danger fs-6"></i>
                                        <span class="tool-tiptext fs-6">Delete</span>
                                    </span>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;
                    });

                    // Empty state
                    if (documents.length === 0) {
                        rows = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            No data to display
                        </td>
                    </tr>`;
                    }

                    const html = `
                <div class="tab-pane active" id="document_tenant_list">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-2"><i class="fa fa-address-card me-2 text-primary"></i> Identity Documents</h5>
                        <button type="button" class="fw-light btn btn-primary w-16 w-md-auto btnAddNewPrm" id="_btnDocument">
                            <span vslang="buttons.Upload Document">Upload Document</span>
                        </button>
                    </div>

                    <div class="table-responsive " style="max-height: 290px; overflow-y: auto; scrollbar-width: thin;">
                        <table class="table align-middle mb-3">
                            <thead class="bg-light">
                                <tr class="text-uppercase small">
                                    <th class="border-0 ps-3" style="letter-spacing: 0.05em;">Type</th>
                                    <th class="border-0">File Name</th>
                                    <th class="border-0">File Type</th>
                                    <th class="border-0">Remark</th>
                                    <th class="border-0 text-start">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>

                </div>`;

                    div.innerHTML = html;
                    const btnDocument = div.querySelector("#_btnDocument");
                    if (btnDocument) {
                        btnDocument.onclick = () => {
                            TenantDocumentDialog.show({
                                id: null,
                                tenant_id: data.id,
                                onClose: () => {
                                    mThis.renderOverView(div, target, data);
                                },
                            });
                        };
                    }

                    div.querySelectorAll(".view-doc").forEach((btn) => {
                        btn.addEventListener("click", async (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "view");
                        });
                    });
                    div.querySelectorAll(".download-doc").forEach((btn) => {
                        btn.addEventListener("click", (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "download");
                        });
                    });

                    document.querySelectorAll(".modify-doc").forEach((btn) => {
                        btn.addEventListener("click", async function (e) {
                            e.preventDefault();
                            const op = {
                                id: parseInt(this.dataset.id),
                                tenant_id: data.id,
                                btn: e.target,
                                onClose: () => {
                                    mThis.renderOverView(div, target, data);
                                    mThis.tenantListView.showPage(
                                        mThis.getFilterData(),
                                    );
                                },
                            };
                            TenantDocumentDialog.show(op);
                        });
                    });

                    document
                        .querySelectorAll(".delete-doc-btn")
                        .forEach((btn) => {
                            btn.addEventListener("click", async function (e) {
                                const docId = this.dataset.id;

                                const confirmed = await cv_interact.confirm(
                                    "Are you sure you want to delete this document?",
                                    {
                                        title: "Delete Document",
                                        context: "delete",
                                    },
                                );

                                if (confirmed) {
                                    const p = { id: docId };
                                    vsapi
                                        .call(
                                            [
                                                main_view.base_url,
                                                "/prm/tenant/document/delete",
                                            ].join(""),
                                            p,
                                            false,
                                            false,
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                cv_interact.success(
                                                    "Document deleted.",
                                                );
                                                mThis.renderOverView(
                                                    div,
                                                    target,
                                                    data,
                                                );
                                            } else {
                                                cv_interact.error(
                                                    res.error_message,
                                                );
                                            }
                                        });
                                }
                            });
                        });
                })

                .catch((err) => {
                    div.innerHTML = `<div class="alert alert-danger m-3">Failed to load documents: ${err.message}</div>`;
                });
        }
    };

    mThis.setActionsProfileInfo = (divProfile) => {
        // console.log(33, divProfile);

        divProfile.addEventListener("click", (e) => {
            // let btn = VSUtil.closestLimited(e.target, ".edit_tenant_profile_info ");
            // if (btn) {
            //     mThis.editTenantInfo(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".delete_employee");
            // if (btn) {
            //     mThis.deleteEmployee(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".set_resign");
            // if (btn) {
            //     mThis.setResign(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".movement");
            // if (btn) {
            //     mThis.movement(btn.dataset.id, btn);
            //     return;
            // }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/tenant/tenantProfile/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.statuses,
                    "id",
                    "name",
                    "",
                    "All Statuses",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };
    // mThis.show = (options) => {
    //     mThis.init();
    //     mThis.options = options;
    //     mThis.prepareFormOptions(() => {
    //         // main_view.setContentView(mThis.self, mThis.title_prop);
    //         // mThis.renderView();
    //         // mThis.showPage(mThis.defaultPage, mThis.getFilterData());
    //         mThis.showPage("profile_view", { tenant_id: tenantId });
    //     });
    // };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            AuthManager.init().then((user) => {
                const tenantId = user.official_id || user.id;
                if (!tenantId) {
                    cv_interact.error("Could not identify tenant.");
                    return;
                }
                mThis.showPage("profile_view", { tenant_id: tenantId });
            });
        });
    };

    return mThis;
})();

"use strict";

var ContractsComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Contract Management";
    mThis.self = main_view.VSAppContent.querySelector("#_main_contract_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddContract");
    mThis.btnPDF = mThis.self.querySelector('#_asusp_btn_pdf');
    // mThis.elTenant = mThis.self.querySelector('#tenant_id');
    mThis.elBusinessType = mThis.self.querySelector('#business_type_id');
    // mThis.elSpaceType = mThis.self.querySelector('#space_type_id');
    mThis.divFilter = mThis.self.querySelector("#_divFilter_contract");
    mThis.elStatus = mThis.self.querySelector("#el_contract_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_contract");


    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        // {
        //     transTitle: "titles.Tenant",
        //     className: "align-middle text-nowrap",
        //     data: (data,index) => {
        //         return `
        //                 <div class="d-flex flex-column">
        //                     ${data.tenant_name ?? ''}
        //                     <span class="d-block text-primary" style="font-size:12px;">${data.phone_number ?? ''}</span>
        //                 </div>`;
        //         }
        // },
         {
            transTitle: "titles.Start Date",
            className: "align-middle",
            data: (data, index, tr) => {
                // const displayDate = (data.last_renewal_date && data.last_renewal_date.trim()) ? data.last_renewal_date : (data.start_date ?? '');
                const displayDate = data.start_date ?? '';
                return `<small class="px-2 py-2 bg-body-secondary text-nowrap text-muted rounded-2"><i class="fa-regular fa-clock"></i> ${displayDate}</small>`;
            }
        },
         {
            transTitle: "titles.End Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<small class="px-2 py-2 bg-body-secondary text-muted text-nowrap rounded-2"><i class="fa-regular fa-clock"></i> ${data.end_date ?? ''}</smaLL>`;
            }
        },
        {
            transTitle: "titles.Business",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.business_type ?? ''}</span>`;
            }
        },
         {
            transTitle: "titles.Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-nowrap text-prm-custom">${data.space_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<span class="px-2 py-1 bg-prm-custom text-nowrap text-white rounded font-medium">${data.space_code ?? ''}</span>`;
            }
        },

        {
            transTitle: "titles.Price",
            className: "align-middle",
            data: (data) => {
                const price = VSMoney.formatAmount(data.price,data.currency_code ?? 'USD');

                if (data.price_type === 'total') {
                    return `
                        <span class="text-nowrap w-semibold">${price} <small class="text-nowrap text-muted">/mon</small></span>
                        <span class="d-block text-primary" style="font-size:12px;">Whole Room</span>
                    `;
                }

                return `
                    <span class="text-nowrap text-primary-custom">
                            ${price}
                        <small class="text-nowrap text-muted"> /mÂ²</small>
                    </span>
                    <span class="d-block text-primary" style="font-size:12px;">${data.sqm_size ?? '-'} mÂ²</span>
                `;
            }
        },
        {
            transTitle: "titles.Deposit",
            className: "align-middle",
            data: (data) => {
               const deposit = VSMoney.formatAmount(data.deposit, data.currency_code ?? 'USD');
                return `<div class="text-primary-prm text-capitalize" style="width:90px;">
                        <span class="text-prm-custom" >${deposit}</span>
                    </div>`;

            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:300px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? '_'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = parseInt(data.status_id, 10);
                const statusKey = (data.status ?? '').toLowerCase();
                const map = {
                    1: { text: 'Pending', cls: 'bg-warning-subtle text-warning border border-warning' },
                    2: { text: 'Active', cls: 'bg-success-subtle text-success border border-success' },
                    3: { text: 'Expired', cls: 'bg-danger-subtle text-danger border border-danger' },
                    4: { text: 'Terminated', cls: 'bg-danger-subtle text-danger border border-danger' },
                };
                const byName = {
                    pending: 'bg-warning-subtle text-warning border border-warning',
                    active: 'bg-success-subtle text-success border border-success',
                    expired: 'bg-danger-subtle text-danger border border-danger',
                    terminated: 'bg-danger-subtle text-danger border border-danger',
                };
                const m = map[statusId] || null;
                const label = m?.text || (statusKey === 'terminated' ? 'Terminated' : (data.status ?? 'â€”'));
                const cls = m?.cls || byName[statusKey] || 'bg-light text-muted';
                return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
            },
        },
        // {
        //     transTitle: "titles.Last Updated",
        //     className: 'align-middle text-nowrap',
        //     data: (data, index, tr) => {
        //         return `<div class="d-flex flex-column">
        //             <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ''}</span>
        //             <small class="text-muted">${data.updated_at ?? ''}</small>
        //         </div>`;
        //     }
        // },
        // {
        //     className: 'col_action align-middle',
        //     data: (data) => `
        //         <div class="d-flex justify-content-center align-items-end">
        //             <a href="javascript:void(0)" class="btn_contract_action" data-id="${data.id}" data-statusid="${data.status_id}" data-status="${data.status ?? ''}" data-end-date="${data.end_date ?? ''}" aria-haspopup="true" aria-expanded="false">
        //                <button class="btn btn-sm  rounded-2 text-nowrap">
        //                     <span>
        //                         <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
        //                     </span>
        //                </button>
        //             </a>
        //         </div>`
        // },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        if (mThis.btnAdd) {
            mThis.btnAdd.style.display = 'none';
        }

        mThis.ContractListView = new ListView('_contract_list', {
            fetchApi: `${main_view.base_url}/prm/tenant/contract/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 header-uppercase',
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.dataset.status = data.status ?? '';
                tr.dataset.endDate = data.end_date ?? '';
                tr.classList.add('contract');
                tr.setAttribute('id', ['contract_invoice_id', data.id].join(''));
            },
            listContainerClass: null
        });

        mThis.pr_tbl = mThis.ContractListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 200) + 'px';
        }

        mThis.tblContract = mThis.ContractListView.getTable();
        mThis.initDropdownMenus(mThis.tblContract);

        if (!mThis.tblContract.id) mThis.tblContract.id = '_contract_list_table';
        new ExpandableRowConfig(mThis.tblContract.id, {
            dontExpandByClickingOn: [],
            onOpen: (container, detail_tr, parent_tr) => {
                const rawId = parent_tr.getAttribute('id') || '';
                const id = rawId.replace(/^contract_invoice_id/, '');
                if (id && !Number.isNaN(Number(id))) mThis.displayContractDetail(container, id);
            }
        });

        // Filter change handler with tooltip reinitialization
        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after filter
                setTimeout(() => {
                    // $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }
        });

        // Search handler with tooltip reinitialization
        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ContractListView.showPage(mThis.getFilterData());

                // Re-initialize tooltips after search
                setTimeout(() => {
                    // $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                    $('[data-bs-toggle="tooltip"]').tooltip();
                }, 500);
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: (mThis.elSearch.value || "").trim(),
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.parseSafeDate = (value) => {
        if (!value) return null;
        const raw = String(value).trim();
        if (!raw) return null;

        const monthMap = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
        };

        if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
            const [year, month, day] = raw.split('-').map(Number);
            return new Date(year, month - 1, day);
        }

        if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
            const [dayStr, monthStr, yearStr] = raw.split('-');
            const month = monthMap[monthStr.toLowerCase()];
            if (month === undefined) return null;
            return new Date(Number(yearStr), month, Number(dayStr));
        }

        if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
            const [day, month, year] = raw.split('/').map(Number);
            return new Date(year, month - 1, day);
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return null;
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
    };

    mThis.isWithinNextThreeMonths = (date) => {
        if (!date) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);

        return date >= today && date <= maxDate;
    };

    mThis.displayContractDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        Promise.all([
            vsapi.call(`${main_view.base_url}/prm/contract/details`, { id }, null, null),
            vsapi.call(`${main_view.base_url}/prm/contract/list-renewals`, { contract_id: id, per_page: 50 }, null, null)
        ])
            .then(([detailsRes, renewalsRes]) => {
                if (detailsRes.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load contract details</div>`;
                    return;
                }
                const renewals = (renewalsRes.status_code === 200 && renewalsRes.data && renewalsRes.data.data) ? renewalsRes.data.data : [];
                mThis.renderContractDetail(container, detailsRes.data || {}, id, renewals);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading contract details</div>`;
            });
    };

    mThis.renderContractDetail = (container, d, contractId, renewals) => {
        // const cur = (d.cur_symbol != null) ? d.cur_symbol : '$';
        // const priceLabel = (d.price_type === 'total') ? 'Whole Room' : 'Per sqm';
        // const priceVal = d.price != null ? Number(d.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Ã¢â‚¬â€';
        // const depositVal = (d.deposit != null && d.deposit !== '') ? Number(d.deposit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Ã¢â‚¬â€';

        const renewalsList = Array.isArray(renewals) ? renewals : [];
        const escapeHtml = (str) => {
            if (!str) return '';
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        };
        let renewalTableHtml = '';
        if (renewalsList.length > 0) {
            const unitPillClass = 'px-2 py-1 bg-prm-custom text-white rounded font-medium ';
            const rows = renewalsList.map((r) => {
                const spaceCode = (r.space_code ?? '').trim();
                const unitCell = `<span class="${unitPillClass}">${escapeHtml(spaceCode)}</span>`;
                return `
                <tr>
                    <td class="align-middle text-nowrap">${(r.renewal_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${(r.start_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${(r.end_date ?? '').trim() }</td>
                    <td class="align-middle text-nowrap">${unitCell}</td>
                    <td class="text-break align-middle" style="width: 300px;">${escapeHtml((r.remarks ?? '_').trim())}</td>
                    // <td class="align-middle text-nowrap"><div class="d-flex flex-column"><span class="text-capitalize">${escapeHtml((r.update_user ?? '').trim()) || '_'}</span><small class="text-muted">${(r.updated_at ?? '').trim() || ''}</small></div></td>
                </tr>`;
            }).join('');
            renewalTableHtml = `
                    <div class="card  shadow-sm overflow-hidden">
                        <div class="card-body p-0">
                            <div class="table-responsive ">
                                <table class="table table-hover table-sm mb-0 align-middle table--dropdown">
                                    <thead>
                                        <tr class="table-light">
                                            <th class="text-nowrap  py-2 px-3">Renewal date</th>
                                            <th class="text-nowrap  py-2 px-3">Start date</th>
                                            <th class="text-nowrap  py-2 px-3">End date</th>
                                            <th class="text-nowrap  py-2 px-3">Unit</th>
                                            <th class="text-nowrap  py-2 px-3">Remark</th>
                                            // <th class="text-nowrap  py-2 px-3">Last Updated</th>
                                        </tr>
                                    </thead>
                                    <tbody class="border-top">${rows}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `;
        } else {
            renewalTableHtml = `
                    <div class="card  shadow-sm">
                        <div class="card-body text-center py-4">
                            <span class="rounded-circle d-inline-flex align-items-center justify-content-center bg-light text-muted mb-2" style="width:48px;height:48px;"><i class="fa-solid fa-rotate-right fa-lg"></i></span>
                            <p class="text-muted mb-0">No renewal history for this contract.</p>
                            <small class="text-muted">Renewals will appear here when the contract is renewed.</small>
                        </div>
                    </div>`;
        }

        container.innerHTML = `

                 ${renewalTableHtml}`;

    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_contract_action",
            cssClass: "bg-white shadow",
            menus: [

                {
                    html: '<span class="ps-2 " vslang="titles.Modify Contract"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Renew Contract"></span>',
                    icon: `<i class="fa-solid fa-arrow-up-right-from-square fs-5 text-prm-custom"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "renew_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Terminate Contract"></span>',
                    icon: `<i class="fa-regular fa-circle-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "terminate_contract"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete Contract"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_contract"
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const row = container.closest('tr');
                const statusId = Number(container.dataset.statusid ?? row?.dataset?.statusid);
                const statusText = String(container.dataset.status ?? row?.dataset?.status ?? '').trim().toLowerCase();
                const isActive = statusText === 'active' || statusId === 2;
                const endDate = mThis.parseSafeDate(container.dataset.endDate ?? row?.dataset?.endDate ?? '');
                const isPending = statusText === 'pending';
                const isExpired = statusText === 'expired';
                const isTerminated = statusText === 'terminated';
                              // show renew only when status is active and end date is within next 3 months (not for pending)
                              const showRenew = isActive && endDate && mThis.isWithinNextThreeMonths(endDate);
                const canModify = !isExpired && !isTerminated;

                menu.edit_contract.style.display = canModify ? 'block' : 'none';
                menu.renew_contract.style.display = showRenew ? 'block' : 'none';
                if (menu.terminate_contract) {
                    // show terminate only when status is active
                    menu.terminate_contract.style.display = isActive ? 'block' : 'none';
                }
                if (menu.delete_contract) {
                    // show delete when status is pending, expired, or terminated
                    menu.delete_contract.style.display = (isPending || isExpired || isTerminated) ? 'block' : 'none';
                }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {

                    case 'edit_contract': {
                        mThis.editContract(id, menuLink);
                        break;
                    }
                    case 'renew_contract': {
                        mThis.renewContract(id, menuLink);
                        break;
                    }
                    case 'terminate_contract': {
                        mThis.terminateContract(id, menuLink);
                        break;
                    }
                    case 'delete_contract': {
                        mThis.deleteContract(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    mThis.editContract = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };
        ContractDialog.show(op);
    }
    mThis.renewContract = (id, menulink) => {
        if (!id) return;

        let op = {
            id: id,
            contract_id: id,
            btn: menulink,
            onClose: () => {
                mThis.ContractListView.showPage(mThis.getFilterData());
            }
        };

        RenewDialog.show(op);
    };

    mThis.terminateContract = (id, menuLink) => {
        if (!id) return;

        const op = {
            id: id,
            btn: menuLink,
        };

        cv_interact.confirm(
            "Terminate this contract?",
            {
                title: "Terminate Contract",
                context: "delete",
                confirmButtonText: "Terminate",
            },
            (yes) => {
                if (!yes) return;
                vsapi
                    .call(
                        [main_view.base_url, "/prm/contract/terminate"].join(""),
                        op,
                        menuLink,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Contract has been terminated.");
                            if (mThis.ContractListView) {
                                mThis.ContractListView.showPage(mThis.getFilterData());
                            }
                        } else {
                            cv_interact.error(res.error_message || "Failed to terminate contract.");
                        }
                    });
            },
        );
    };
    mThis.deleteContract = (id, menuLink) => {
        if (!id) return;

        cv_interact.confirm(
            "Delete this contract?",
            {
                title: "Delete Contract",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (yes) => {
                if (!yes) return;
                vsapi
                    .call(
                        [main_view.base_url, "/prm/contract/delete"].join(""),
                        { id },
                        menuLink,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Contract has been deleted.");
                            if (mThis.ContractListView) {
                                mThis.ContractListView.showPage(mThis.getFilterData());
                            }
                        } else {
                            cv_interact.error(res.error_message || "Failed to delete contract.");
                        }
                    });
            },
        );
    };


    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/contract/form-options`, null, null, null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                // VSUtil.setComboItems(mThis.elTenant, d.tenants, 'id', 'tenant', '', 'All Tenants', null);
                VSUtil.setComboItems(mThis.elStatus, d.statuses, 'id', 'status_name', '', 'All Statuses','');
                VSUtil.setComboItems(mThis.elBusinessType, d.business_types, 'id', 'business_type', '', 'All Business Types', '');

                if (typeof onFinish === 'function') onFinish();
            })
    }

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ContractListView.showPage(mThis.getFilterData());

            // Initialize tooltips after table loads
            setTimeout(() => {
                $('[data-bs-toggle="tooltip"]').tooltip();
                // console.log('Tooltips initialized');
            }, 800);

            // Auto-refresh every hour to update contract statuses
            if (!mThis.autoRefreshInterval) {
                mThis.autoRefreshInterval = setInterval(() => {
                    console.log('Auto-refreshing contracts...');
                    mThis.ContractListView.showPage(mThis.getFilterData());

                    // Re-initialize tooltips after refresh
                    setTimeout(() => {
                        $('[data-bs-toggle="tooltip"]').tooltip('dispose');
                        $('[data-bs-toggle="tooltip"]').tooltip();
                    }, 800);
                }, 3600000); // 1 hour = 3600000ms
            }
        });
    };

    return mThis;
})();
const ContractDialog = (() => {
    const self = {};
    let dialog = null;
    // const parseDateInput = (value) => {
    //     if (!value) return null;
    //     const raw = String(value).trim();
    //     if (!raw) return null;
    //     if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    //         const [year, month, day] = raw.split('-').map(Number);
    //         return new Date(year, month - 1, day);
    //     }

    //     if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(raw)) {
    //         const [dayStr, monthStr, yearStr] = raw.split('-');
    //         const monthMap = {
    //             Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    //             Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    //         };
    //         const month = monthMap[monthStr];
    //         if (month === undefined) return null;
    //         return new Date(Number(yearStr), month, Number(dayStr));
    //     }

    //     if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    //         const [day, month, year] = raw.split('/').map(Number);
    //         return new Date(year, month - 1, day);
    //     }

    //     const parsed = new Date(raw);
    //     return Number.isNaN(parsed.getTime()) ? null : parsed;
    // };

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3 justify-content-start">
                 <div class="">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="tenant" class="data-input form-control" data-field="tenant_name"  placeholder="Tenant" />
                                <label>Tenant</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input name="legal_name" class="data-input form-control" disabled data-field="legal_name" placeholder=" " />
                                <label>Legal Name</label>
                            </div>
                        </div>

                        <div class="col-6">
                            <select data-style="material" placeholder="Business Type" name="business_type_id" class="data-input form-control" data-field="business_type_id"> </select>
                        </div>
                        <div class="col-3">
                            <select data-style="material" placeholder="Unit Code" name="code" class="data-input form-control" data-field="space_id"> </select>
                        </div>
                        <div class="col-3">
                            <div class="vs-material-field">
                                <input type="text" name="deposit" class="data-input form-control" data-field="deposit" placeholder=" " />
                                <label>Deposit</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                <label>Start Date</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" placeholder=" " />
                                <label>End Date</label>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="col-12">
                    <div class="p-3 bg-white border rounded shadow-sm">
                        <h6 class="mb-3 text-golden">Unit Details</h6>
                        <div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" disabled />
                                    <label>Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" disabled />
                                    <label>Size (mÂ²)</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="hidden" name="price_type" class="data-input" data-field="price_type" />
                                    <input type="text" name="price_type_label" class="data-input form-control" disabled />
                                    <label>Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" disabled />
                                    <label>Price</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div class="col-12 mt-3">
                        <div class="vs-material-field">
                            <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                            <label>Remark</label>
                        </div>
                    </div>
                </div>`
                ].join("");
            },

            contentCreated: (me) => {
                me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    type: "select",
                    prefetch: true,
                    maxDropdownHeight: "380px",
                    // api:
                    query: {
                        from: "tenants",
                        select: ["id", "name", "code", "legal_name"],
                        searchFields: { name: "LIKE", code: "=", legal_name: "LIKE" },
                        orderBy: [["id", "desc"]]
                    },
                    showColumnHeader: true,
                    columns: {
                        code: "Code",
                        name: "Name",
                        // legal_name: "Legal Name"
                    },
                    onSelect: (item) => {
                        const tenantId = item?.id || "";
                        const tenantName = item?.name || "";
                        const tenantCode = item?.code || "";
                        me.controls.tenant.value = tenantCode
                            ? `${tenantName} (${tenantCode})`
                            : tenantName;
                        me.controls.tenant.dataset.tenantId = tenantId;
                        me.tenant_id = tenantId;
                        me.controls.legal_name.value = item?.legal_name || "";
                    }
                });
                applyNumberInput(me.controls.deposit);

                // me.controls.deposit.addEventListener('input', (e) => {
                //     let v = e.target.value;
                //     v = v.replace(/[^0-9.]/g, '');

                //     const parts = v.split('.');
                //     if (parts.length > 2) {
                //         v = parts[0] + '.' + parts[1];
                //     }
                //     if (parts[1] !== undefined) {
                //         v = parts[0] + '.' + parts[1].slice(0, 2);
                //     }

                //     e.target.value = v;
                // });
                // me.controls.deposit.addEventListener('blur', (e) => {
                //     let v = parseFloat(e.target.value);

                //     if (isNaN(v) || v <= 0) {
                //         e.target.value = '';
                //         return;
                //     }
                //     e.target.value = v;
                // });
            },

            configSelect: [
                {
                    name: "tenant_id",
                    data: "tenants",
                    textField: "tenant",
                    valueField: "id",
                },
                {
                    name: "business_type_id",
                    data: "business_types",
                    textField: "business_type",
                    valueField: "id",
                },
                {
                    name: "code",
                    data: "building_spaces",
                    textField: "code",
                    valueField: "id",
                },
            ],
            prepareFormOptions: {
                createTitle: "Create Contract",
                modifyTitle: "Modify Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options",].join(""),
                    params: (op) => {
                        return {
                            id: op.id,
                            space_id: op.space_id ?? null,
                            tenant_id: op.tenant_id ?? null
                        };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                const isReadOnly = me.dataOptions.id > 0 || data.prefill_tenant_id;
                console.log(123,me.dataOptions.id);
                me.controls.tenant.disabled = isReadOnly;
                if(me.dataOptions.id){
                    me.setReadOnly(true, ['code','start_date','end_date']);
                }

                // me.setReadOnly(true, ['code','start_date','end_date']);

                if (me.searchTenant && typeof me.searchTenant.reset === "function") {
                    me.searchTenant.reset();
                }
                // Preselect tenant when coming from TenantComponent or from booked unit phone-match.
                const prefillTenantId = !me.dataOptions.id
                    ? (me.dataOptions.tenant_id ?? data?.prefill_tenant_id ?? null)
                    : null;
                if (prefillTenantId) {
                    me.tenant_id = prefillTenantId;
                    vsapi
                        .call(
                            [main_view.base_url, "/prm/tenant/details"].join(""),
                            { id: prefillTenantId },
                            false,
                            null,
                        )
                        .then((res) => {
                            if (res.status_code === 200 && res.data) {
                                const t = res.data;
                                const tenantInput =
                                    me.divModal.querySelector('input[name="tenant"]');
                                if (tenantInput) {
                                    const tenantCode = t.code || "";
                                    tenantInput.value = tenantCode
                                        ? `${t.name || ""} (${tenantCode})`
                                        : (t.name || "");
                                    tenantInput.dataset.tenantId = prefillTenantId;
                                }
                                if (me.controls.legal_name) {
                                    me.controls.legal_name.value = t.legal_name || "";
                                }
                            }
                        })
                        .catch(() => {});
                } else {
                    me.tenant_id = data?.contract_details?.tenant_id ?? null;
                }
                const unitSelect = me.divModal.querySelector('[data-field="space_id"]');
                const spaceRows = Array.isArray(data?.building_spaces) ? data.building_spaces : [];

                const spaceTypes = Array.isArray(data?.space_types) ? data.space_types : [];
                const getSpaceTypeName = (spaceTypeId) => {
                    const row = spaceTypes.find((x) => String(x.id) === String(spaceTypeId));
                    return row?.space_type ?? '';
                };
                const applyUnitData = (spaceId) => {
                    const selected = spaceRows.find((row) => String(row.id) === String(spaceId));
                    if (!selected) {
                        me._createContractSpaceTypeId = null;
                        return;
                    }
                    me._createContractSpaceTypeId = selected.space_type_id ?? null;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = selected.space_type ?? getSpaceTypeName(selected.space_type_id) ?? '';
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = selected.sqm_size ?? '';
                    if (me.controls.price_type && me.controls.price_type_label) {
                        me.controls.price_type.value = selected.price_type ?? '';

                        me.controls.price_type_label.value = selected.price_type === 'sqm' ? 'mÂ²' : selected.price_type === 'total' ? 'Unit' : '';
                    }
                    if (me.controls.price) me.controls.price.value = selected.price ?? '';
                };

                if (unitSelect) {
                    unitSelect.onchange = (e) => {
                        applyUnitData(e.target.value);
                    };
                    const prefillSpaces = Array.isArray(data?.prefill_spaces) ? data.prefill_spaces : [];
                    const prefillSpaceIds = prefillSpaces
                        .map((s) => String(s?.id ?? "").trim())
                        .filter((v) => v !== "");
                    const defaultSpaceId = me.dataOptions?.space_id
                        ?? data?.contract_details?.space_id
                        ?? prefillSpaceIds[0]
                        ?? '';
                    if (defaultSpaceId) {
                        unitSelect.value = defaultSpaceId;
                        applyUnitData(defaultSpaceId);
                    } else if (unitSelect.value) {
                        applyUnitData(unitSelect.value);
                    }
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: 'btn btn-secondary',
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const op = me.getData();
                        // if (!me.tenant_id) {
                        //     cv_interact.error("Please select a tenant.");
                        //     return;
                        // }
                        // if (!op.business_type_id) {
                        //     cv_interact.error("Please select a business type.");
                        //     return;
                        // }
                        if (me._createContractSpaceTypeId !== undefined && me._createContractSpaceTypeId !== null) {
                            op.space_type_id = me._createContractSpaceTypeId;
                        }
                        op.tenant_id = me.tenant_id;
                        op.id = me.dataOptions.id;
                        // op.tenant_id = me.tenant_id;

                        // if (!op.id) {
                        //     const endDt = parseDateInput(op.end_date);
                        //     if (!endDt || Number.isNaN(endDt.getTime())) {
                        //         cv_interact.error("Please enter a valid End Date.");
                        //         return;
                        //     }
                        //     const endDay = new Date(
                        //         endDt.getFullYear(),
                        //         endDt.getMonth(),
                        //         endDt.getDate(),
                        //     );
                        //     const today = new Date();
                        //     today.setHours(0, 0, 0, 0);
                        //     if (endDay < today) {
                        //         cv_interact.error("End date cannot be in the past.");
                        //         return;
                        //     }
                        // }

                        vsapi.call([main_view.base_url, "/prm/contract/save",].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Contract has been updated successfully.");
                                } else {
                                    cv_interact.success("New contract has been created successfully.");
                                }
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                    },
                },
            ],
        });
        dialog.show(op);
    };
    return self;
})();

/**
 * Normalize contract dates from API or display (e.g. 30-Jun-2026) to YYYY-MM-DD for date inputs.
 */
function normalizeContractDateToIso(raw) {
    if (raw == null || raw === "") return "";
    const s = String(raw).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (m) {
        const months = {
            jan: 0,feb: 1,mar: 2,apr: 3,may: 4, jun: 5,jul: 6,aug: 7,sep: 8,oct: 9, nov: 10,dec: 11,
        };
        const mon = months[m[2].toLowerCase()];
        if (mon == null) return "";
        const d = new Date(parseInt(m[3], 10), mon, parseInt(m[1], 10));
        if (!Number.isNaN(d.getTime())) {
            return (
                d.getFullYear() +
                "-" +
                String(d.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(d.getDate()).padStart(2, "0")
            );
        }
        return "";
    }
    const d2 = new Date(s);
    if (!Number.isNaN(d2.getTime())) {
        return (
            d2.getFullYear() +
            "-" +
            String(d2.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d2.getDate()).padStart(2, "0")
        );
    }
    return "";
}

const RenewDialog = (() => {
    const self = {};
    let dialog = null;
    const hasAtLeastOneMonth = (startDate, endDate) => {
        const monthsDiff =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

        if (monthsDiff > 1) return true;
        if (monthsDiff < 1) return false;

        return endDate.getDate() >= startDate.getDate();
    };

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
           createContent: () => {
                return `
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="p-3 border rounded">
                                <h6 class="mb-3 text-golden">Old Contract</h6>
                                <div class="row g-2">
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_start" class="data-input form-control" data-field="old_contract_start"  placeholder=" " disabled />
                                            <label>Start Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="old_contract_end" class="data-input form-control" data-field="old_contract_end" placeholder=" " disabled />
                                            <label>End Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="number" name="old_contract_price" class="data-input form-control" data-field="old_contract_price" placeholder=" " disabled />
                                            <label>Price</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-sm">
                                <h6 class="mb-3 text-golden">Renew Contract</h6>
                                <div class="row g-3">
                                    <div class="col-4">
                                       <div class="vs-material-field">
                                           <input  data-style="material" type="date" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" " disabled />
                                             <label>Start Date</label>
                                       </div>
                                   </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <input  data-style="material" type="date" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" " />
                                            <label>End Date</label>
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="vs-material-field">
                                            <select placeholder="unit code" data-style="material" name="code" placeholder=" " class="data-input form-control" data-field="space_id">
                                            </select>
                                        </div>
                                    </div>
                                     <div class="col-12">
                                        <div class="vs-material-field">
                                            <textarea name="remarks" class="data-input form-control" data-field="remarks"></textarea>
                                            <label>Renewal Remark</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="p-3 bg-white border rounded shadow-lg">
                                <h6 class="mb-3 text-golden">Unit Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="space_name" class="data-input form-control" data-field="space_name" placeholder=" " readonly disabled />
                                    <label>Type</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="sqm_size" class="data-input form-control" data-field="sqm_size" placeholder=" " readonly disabled />
                                    <label>Size</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="price_type" class="data-input form-control" data-field="price_type" placeholder=" " readonly disabled />
                                    <label>Charge As</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="price" class="data-input form-control" data-field="price" placeholder=" " readonly disabled />
                                    <label>Price</label>
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>

                    </div>
                `;
            },
            contentCreated: (me) => {
                DateTimePicker.initAll(me.divModal);
            },

            prepareFormOptions: {
                createTitle: "Renew Contract",
                modifyTitle: "Renew Contract",
                targetProp: "contract_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/contract/form-options"].join(""),
                    params: (op) => ({ id: op.id }),
                },
            },
            configSelect: [
                {
                    name: "code",
                    data: "building_spaces",
                    textField: "code",
                    valueField: "id",
                },
            ],

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                const det = data.contract_details || {};
                // const oldStartIso = normalizeContractDateToIso(det.start_date);
                // const oldEndIso = normalizeContractDateToIso(det.end_date);
                if (me.controls.old_contract_start) {
                    me.controls.old_contract_start.value = det.start_date || "";
                }
                if (me.controls.old_contract_end) {
                    me.controls.old_contract_end.value = det.end_date || "";
                }
                if (me.controls.old_contract_price) {
                    me.controls.old_contract_price.value =
                        det.price != null && det.price !== "" ? det.price : "";
                }
                // Renew period starts the same calendar day as the current contract end_date.
                const renewStartIso = det.renew_start_date || "";

                if (me.controls.start_date) {
                    me.controls.start_date.value = renewStartIso;
                }
                if (me.controls.end_date) me.controls.end_date.value = "";
                if (me.controls.price) {
                    me.controls.price.value =
                        det.price != null && det.price !== "" ? det.price : "";
                }
                if (me.controls.price_type) {
                    me.controls.price_type.value = det.price_type ?? "";
                }
                if (me.controls.remarks) me.controls.remarks.value = "";
                // DateTimePicker may attach after first paint; force final values.
                setTimeout(() => {
                    if (me.controls.start_date && renewStartIso) {
                        me.controls.start_date.value = renewStartIso;
                    }
                    // Keep renew end_date empty by default (user must choose).
                    if (me.controls.end_date) {
                        me.controls.end_date.value = "";
                    }
                }, 0);
                const unitSelect = me.divModal.querySelector('[data-field="space_id"]');
                const spaceRows = Array.isArray(data?.building_spaces) ? data.building_spaces : [];
                const spaceTypes = Array.isArray(data?.space_types) ? data.space_types : [];
                const getSpaceTypeName = (spaceTypeId) => {
                    const row = spaceTypes.find((x) => String(x.id) === String(spaceTypeId));
                    return row?.space_type ?? '';
                };
                const applyContractPriceFields = () => {
                    if (me.controls.price_type) {
                        me.controls.price_type.value = det.price_type ?? "";
                    }
                    if (me.controls.price) {
                        me.controls.price.value =
                            det.price != null && det.price !== "" ? det.price : "";
                    }
                };
                const setUnitFields = (unitData) => {
                    if (!unitData) return;
                    if (me.controls.space_name) {
                        me.controls.space_name.value = unitData.space_type ?? getSpaceTypeName(unitData.space_type_id);
                    }
                    if (me.controls.sqm_size) me.controls.sqm_size.value = unitData.sqm_size ?? '';
                    // if (me.controls.price_type) me.controls.price_type.value = unitData.price_type ?? '';
                    if (me.controls.price_type) {
                        me.controls.price_type.value = unitData.price_type ?? '';
                        me.controls.price_type.value = unitData.price_type === 'sqm' ? 'mÂ²' : unitData.price_type === 'total' ? 'Unit' : '';
                    }
                    if (me.controls.price) me.controls.price.value = unitData.price ?? '';
                    applyContractPriceFields();
                };
                const applyUnitData = (spaceId) => {
                    if (!spaceId) return;
                    const selected = spaceRows.find((row) => String(row.id) === String(spaceId));
                    if (selected) {
                        setUnitFields(selected);
                    }

                    // Refresh selected unit data from API when unit code changes.
                    vsapi.call(`${main_view.base_url}/prm/building-space/details`, { id: spaceId }, null, null)
                        .then((res) => {
                            if (res.status_code !== 200 || !res.data) return;
                            const merged = selected ? { ...selected, ...res.data } : res.data;
                            setUnitFields(merged);
                        })
                        .catch(() => {});
                };

                if (unitSelect) {
                    unitSelect.onchange = (e) => {
                        applyUnitData(e.target.value);
                    };

                    const defaultSpaceId = data?.contract_details?.space_id ?? '';
                    if (defaultSpaceId) {
                        unitSelect.value = defaultSpaceId;
                        applyUnitData(defaultSpaceId);
                    }
                }
                applyContractPriceFields();
                me.detail = data.contract_details;
            },

            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn btn-secondary',
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span>Renew</span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const op = me.getData();
                        const renewStart = op.start_date ? new Date(op.start_date) : null;
                        const renewEnd = op.end_date ? new Date(op.end_date) : null;
                        if (!renewEnd || Number.isNaN(renewEnd.getTime())) {
                            cv_interact.error("Please select a valid Renew End Date.");
                            return;
                        }
                        if (renewStart && !Number.isNaN(renewStart.getTime()) && renewEnd <= renewStart) {
                            cv_interact.error("Renew End Date must be after Renew Start Date.");
                            return;
                        }
                        delete op.old_contract_start;
                        delete op.old_contract_end;
                        delete op.old_contract_price;
                        delete op.price;
                        delete op.price_type;
                        op.id = me.dataOptions.id;
                        vsapi.call([main_view.base_url, "/prm/contract/renew"].join(""), op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success("Contract has been renewed successfully");
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var InvoicesComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = "$";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_invoice_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnInvoice");
    mThis.btnAddTest = mThis.self.querySelector("#_btnInvoice_test");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_invoice");
    mThis.elFilter_status = mThis.self.querySelector("#payment_status");
    mThis.elFilter_invoice_type = mThis.self.querySelector("#invoice_type");
    mThis.elSpaceType = mThis.self.querySelector("#space_type_id");
    mThis.elTenant = mThis.self.querySelector("#tenant_id");
    mThis.elSearch = mThis.self.querySelector("#_search_invoice");
    mThis.tblReceive = mThis.self.querySelector("#_tblReceive");

    let InvoiceItemDialog = null;

    mThis.cols = [
        { transTitle: "", className: "align-middle text-capitalize" },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-start text-nowrap",
            data: function (data) {
                const code = data.code
                    ? `<span class="text-prm-custom">${data.code}</span>`
                    : `<span class="text-muted fst-italic">_</span>`;

                let typeHtml = "";
                const val = data.invoice_type;

                if (val == 1) {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> Tax</span>`;
                } else if (val == 2) {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> No Tax</span>`;
                } else {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> Commercial</span>`;
                }
                return `
                    <div class="d-flex flex-column">
                        ${code}
                     <!--   <hr class="m-0 border border-secondary border-3 opacity-75"> -->
                        ${typeHtml}
                    </div>
                `;
            },
        },
        // {
        //     transTitle: "titles.Tenant",
        //     className: "align-middle text-nowrap",
        //     data: (data) => {
        //         return `
        //                 <div class="d-flex flex-column">
        //                     <span>${data.tenant_name ?? ""}</span>
        //                     <span class="d-block text-primary"style="font-size:12px;">${
        //                         data.tenant_phone ?? ""
        //                     }</span>
        //                 </div>`;
        //     },
        // },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>
                    <span class="d-block text-prm-custom ">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            },
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                return `
                    <div class="d-flex flex-column align-items-center">
                        <span class="text-prm-custom text-nowrap">${
                            data.issue_date ?? ""
                        }
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const statusId = Number(data.payment_status_id || 0);
                return `
                    <div class="d-flex flex-column align-items-center ">
                        <span class="text-prm-custom text-nowrap">${
                            data.due_date ?? ""
                        }
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap text-primary",
            data: (data) => {
                const amt = data.amount_payable
                    ? Number(data.amount_payable).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block text-primary fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },
        {
            transTitle: "titles.Paid",
            className: "align-middle text-success  text-nowrap",
            data: (data) => {
                const amt = data.paid_amount
                    ? Number(data.paid_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle text-danger  text-nowrap",
            data: (data) => {
                const amt = data.due_amount
                    ? Number(data.due_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },

        {
            transTitle: "titles.Status",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                const statusId = Number(data.payment_status_id || 0);
                let cls = "bg-secondary";
                let icon = "bi bi-question-circle";

                if (statusId === 1) {
                    // Paid
                    cls =
                        "text-success bg-success-subtle border border-success";
                } else if (statusId === 2) {
                    // Unpaid
                    cls = "text-danger bg-danger-subtle border border-danger";
                } else if (statusId === 3) {
                    // Partially Paid
                    cls =
                        "text-warning bg-warning-subtle border border-warning ";
                } else if (statusId === 4) {
                    // Overdue
                    cls = "status-overdue";
                }
                return `
                    <span class="badge ${cls} text-capitalize d-inline-flex align-items-center justify-content-center px-3 py-2 gap-1" style="min-width:110px">
                        ${data.payment_status_name || "â€”"}
                    </span>`;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:240px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${
                            data.general_remark ?? "_"
                        }</span>
                    </div>
                `;
            },
        },

        // {
        //     transTitle: "titles.Last Updated",
        //     className: "align-middle text-nowrap",
        //     data: (data) => `
        //         <div class="d-flex flex-column">
        //             <span class="text-capitalize text-prm-custom">${
        //                 data.update_user || "â€”"
        //             }</span>
        //             <small class="text-muted">${data.updated_at || "â€”"}</small>
        //         </div>`,
        // },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: (data) => {
                // if (data.payment_status_id === 4) {
                //     return "";
                // }

                return `<div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action"
                        data-id="${
                            data.id
                        }" data-statusid="${data.payment_status_id || ""}" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.InvoiceListView = new ListView("_invoices_list", {
            fetchApi: `${main_view.base_url}/prm/tenant/invoice/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.classList.add("invoice", "cursor-pointer");
                tr.id = `invoice_id_${data.id}`;
                tr.dataset.statusid = data.payment_status_id || 0;
                tr.dataset.canceled = 0;
            },
            listContainerClass: null,
        }); 

        // mThis.btnAdd.onclick = (e) => {
        //     e.preventDefault();
        //     InvoiceDialog.show({
        //         id: null,
        //         btn: e.target,
        //         onClose: () =>
        //             mThis.InvoiceListView.showPage(mThis.getFilterData()),
        //     });
        // };

        mThis.listContainer = mThis.InvoiceListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };

        mThis.tblInvoice = mThis.InvoiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblInvoice);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.InvoiceListView.showPage(mThis.getFilterData());
        });

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.InvoiceListView.showPage(mThis.getFilterData());
            }, 250);
        };

        new ExpandableRowConfig(mThis.tblInvoice.id, {
            dontExpandByClickingOn: ["btn_leave_action"],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.id.replace("invoice_id_", "");
                if (id && !isNaN(id)) mThis.displayInvoiceDetail(container, id);
            },
        });

        vsapi
            .call(
                `${main_view.base_url}/prm/invoice_setting/get`, //call restapi get first
                {},
            )
            .then((res) => {
                InvoiceSetting = res.data;
                console.log(111112, InvoiceSetting);
                if (res.status_code !== 200) {
                    cv_interact.error("Failed to load invoice details.");
                    return;
                }
            });

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi
            .call(`${main_view.base_url}/prm/tenant/invoice/details`, { id })
            .then((res) => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }
                mThis.renderInvoiceDetail(container, res.data || {});

                console.log(1112345678, res.data);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice detail.</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const currency = mThis.currency_symbol || "$";
        const validItems = (invoice.items || []).filter(
            (item) =>
                parseFloat(item.price || 0) > 0 ||
                parseFloat(item.total || 0) > 0 ||
                parseFloat(item.amount || 0) > 0,
        );

        const formatDate = (dateStr) => {
            if (!dateStr) return "â€”";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        };
        const getDiscountDisplay = (item) => {
            const value = parseFloat(item.discount || 0);
            const type = (item.discount_type || "percent").toLowerCase().trim();

            const discType = type === "percent" ? "%" : "$";

            const currency = mThis.currency_symbol || "$";

            if (value <= 0) {
                return `<span class="text-center ">0%</span>`;
            }

            if (type === "amount" || type === "$") {
                return `${currency}${value.toFixed(2)}`;
            } else {
                const percentStr =
                    value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);

                return `${percentStr}${discType}`;
            }
        };
        const itemsHtml = validItems
            .map((item) => {
                const qty = parseFloat(item.qty || 1);
                const price = parseFloat(item.price || 0);

                const discount = parseFloat(item.discount || 0);
                const taxAmount = parseFloat(item.tax_rate) || 0;
                const total = parseFloat(item.total || item.amount || 0);
                const unit_type = item.unit_type;

                return `
                <tr>
                    <td class="fw-medium">${item.remarks || "â€”"}
                    </td>
                    <td class="text-center small">${formatDate(
                        item.start_date,
                    )}</td>
                    <td class="text-center small">${formatDate(
                        item.end_date,
                    )}</td>
                    <td class="text-center small">${qty} ${unit_type}</td>
                    <td class="text-end">${currency}${price.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        },
                    )}</td>
                    <td class="text-end text-danger">${getDiscountDisplay(
                        item,
                    )}</td>
                    <td class="text-center text-info">${taxAmount}%</td>
                    <td class="text-end fw-bold">${currency}${total.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                    )}</td>

                </tr>`;
            })
            .join("");

        // âœ… Footer totals calculation
        const foot = validItems.reduce(
            (acc, item) => {
                const total = parseFloat(item.total || item.amount || 0);
                acc.total += total;
                return acc;
            },
            { discount: 0, tax: 0, total: 0 },
        );

        const fmt = (n) =>
            n.toLocaleString("en-US", { minimumFractionDigits: 2 });
        container.innerHTML = `
            <div class="bg-white rounded shadow-sm">
                <div class="table-responsive table--dropdown">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background:#e1e5f2;">
                            <tr style= background-color:#E1E5F2;" >
                                <th class="text-center" >Item Description </th>
                                <th class="text-center" >Start Date</th>
                                <th class="text-center" >End Date</th>
                                <th class="text-center" >Qty</th>
                                <th class="text-end" >Price</th>
                                <th class="text-end" >Discount</th>
                                <th class="text-center" >Tax %</th>
                                <th class="text-end" >Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                itemsHtml ||
                                '<tr><td colspan="8" class="text-center py-4 text-muted">No items found</td></tr>'
                            }
                        </tbody>
                        <tfoot class="table-light fw-bold">
                                <!-- Displaying Net Total -->
                            <tr>
                                <td colspan="7" class="text-end  ">Sub Total</td>
                                <td colspan="1" class="text-end  fs-6">
                                    ${currency}${fmt(
                                        parseFloat(invoice.amount || 0),
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-end text-danger">Total Discount</td>
                                <td colspan="1" class="text-end text-danger fs-6">
                                    ${(() => {
                                        const discVal = parseFloat(
                                            invoice.discount_value || 0,
                                        );
                                        const discType = (
                                            invoice.discount_type || ""
                                        ).toLowerCase();

                                        if (discVal <= 0)
                                            return `<span class="text-muted">0%</span>`;
                                        if (discType === "percent") {
                                            return `${fmt(discVal)}%`;
                                        } else {
                                            return `${currency}${fmt(discVal)}`;
                                        }
                                    })()}
                                </td>
                            </tr>

                            <!-- Displaying Net Total -->
                            <tr>
                                <td colspan="7" class="text-end  text-primary">Grand (Net)</td>
                                <td colspan="1" class="text-end text-success fs-6">
                                    ${currency}${fmt(
                                        parseFloat(invoice.amount_payable || 0),
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                    ${
                        invoice.remarks
                            ? `
                        <div class="mt-3 p-3 bg-light rounded border">
                            <small class="text-muted fw-semibold d-block  text-uppercase" style="font-size: 0.7rem;">Remarks:</small>
                            <p class="mb-0 small">${invoice.remarks}</p>
                        </div>`
                            : ""
                    }
                </div>`;
    };

    mThis.getFilterData = () => {
        const params = {
            payment_status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value.trim(),
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            if (el.value && el.dataset.field) {
                params[el.dataset.field] = el.value.trim();
            }
        });
        return params;
    };

    mThis.initDropdownMenus = (container) => {
        const menuOptions = {
            containerElement: container,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white box-shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Pay"></span>',
                    icon: `<i class="fa-solid fa-hand-holding-dollar text-success fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "receive_invoice",
                },
                // {
                //     html: '<span class="ps-2" vslang="titles.Modify"></span>',
                //     icon: `<i class="fa-solid fa-edit text-primary fs-5"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "modify_invoice",
                // },
                {
                    html: '<span class="ps-2" vslang="titles.Print"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_invoice",
                },
                // {
                //     html: '<span class="ps-2" vslang="titles.Delete"></span>',
                //     icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "delete_invoice",
                // },
            ],
            onShow: (me, menuContainer) => {
                const menu = me.getActiveMenus(menuContainer);
                const statusId = Number(menuContainer.dataset.statusid);

                // menu.print_invoice.style.display =
                //     statusId === 1 || statusId === 3 || statusId === 2
                //         ? "block"
                //         : "none";
                menu.receive_invoice.style.display =
                    statusId === 2 || statusId === 3 || statusId === 4
                        ? "block"
                        : "none";
                statusId === 2 || statusId === 3 ? "block" : "none";
                menu.delete_invoice.style.display =
                    statusId === 2 ? "block" : "none";
                menu.modify_invoice.style.display =
                    statusId === 2 ? "block" : "none";
            },
            onClick: (menulink, id, name) => {
                if (name === "delete_invoice") {
                    mThis.deleteInvoice(id);
                } else if (name === "print_invoice") {
                    mThis.printInvoice(id);
                } else if (name === "receive_invoice") {
                    mThis.receiveInvoice(id);
                } else if (name === "modify_invoice") {
                    mThis.editInvoice(id, menulink);
                }
            },
        };

        new VSDropdownMenu(menuOptions);
    };

    mThis.deleteInvoice = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;

        cv_interact.confirm(
            "Are you sure you want to delete this invoice?",
            {
                transTitle: "Delete Invoice",
                confirmButtonText: "Delete",
                context: "danger",
            },
            (confirmed) => {
                if (!confirmed) return;

                vsapi
                    .call(
                        `${main_view.base_url}/prm/tenant/invoice/delete`,
                        { id },
                        menuLink,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.InvoiceListView.showPage(
                                mThis.getFilterData(),
                            );
                            cv_interact.success("Invoice deleted successfully");
                        } else {
                            cv_interact.error(
                                res.error_message || "Failed to delete.",
                            );
                        }
                    });
            },
        );
    };

    mThis.editInvoice = (id, menulink) => {
        console.log("editInvoice id:", id);
        InvoiceDialog.show({
            id: id,
            btn: menulink,
            onClose: () =>
                mThis.InvoiceListView.showPage(mThis.getFilterData()),
        });
    };

    mThis.receiveInvoice = (id, menulink) => {
        ReceiveDialog.show({
            invoice_id: id,
            btn: menulink,
            onClose: () =>
                mThis.InvoiceListView.showPage(mThis.getFilterData()),
        });
    };

    mThis.printInvoice = (id, invoice_type, menulink) => {
        if (!invoice_type || invoice_type === "undefined") {
            console.warn(
                "Type missing for ID " + id + ". Fetching from server...",
            );

            vsapi
                .call(`${main_view.base_url}/prm/tenant/invoice/details`, { id: id })
                .then((res) => {
                    if (res.status_code === 200) {
                        mThis.printInvoice(id, res.data.invoice_type, menulink);
                    } else {
                        cv_interact.error("Could not determine invoice type.");
                    }
                });
            return;
        }

        const invType = parseInt(invoice_type);
        const params = { invoice_id: id, btn: menulink };

        if (invType === 1) {
            InvoiceTaxDialog.show(params);
        } else if (invType === 2) {
            InvoiceNoTaxDialog.show(params);
        } else if (invType === 3) {
            InvoiceCommercialDialog.show(params);
        }
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/prm/tenant/invoice/form-options`)
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.statuses,
                    "id",
                    "payment_status",
                    "",
                    "All Statuses",
                    "",
                );

                // Populate Invoice Type filter
                const typeOptions = [
                    { id: 1, name: "Tax" },
                    { id: 2, name: "No Tax" },
                    { id: 3, name: "Commercial" },
                ];
                VSUtil.setComboItems(
                    mThis.elFilter_invoice_type,
                    typeOptions,
                    "id",
                    "name",
                    "",
                    "All Types",
                    "",
                );

                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options = {}) => {
        mThis.init();
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.InvoiceListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const InvoiceDialog = (() => {
    const self = {};
    let dialog = null;
    let availableItem = [];
    let InvoiceSetting = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                        <div class="container-fluid">
                            <div id="_invoice_form_container" class="bg-white rounded-3">

                                <div class="d-flex justify-content-between align-items-start">

                                    <!-- LEFT: Tenant Info -->
                                    <div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Tenant Name  </label>
                                            <span class="field-sep">:</span>
                                            <input name="tenant" class="data-input form-control field-input" data-field="tenant_id" placeholder=" " autocomplete="off">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Phone Number</label>
                                            <span class="field-sep">:</span>
                                            <input name="phone_number" class="data-input form-control field-input bg-light"  placeholder=" ">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Email Address</label>
                                            <span class="field-sep">:</span>
                                            <input name="email" class="data-input form-control field-input " placeholder=" ">
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Space / Room</label>
                                            <span class="field-sep">:</span>
                                                <select name="space"  data-style="material" class="data-input form-control" data-field="space_id" required placeholder=" ">
                                                </select>
                                        </div>
                                    </div>

                                    <!-- RIGHT: Space / Button -->
                                    <div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Invoice Type</label>
                                            <span class="field-sep">:</span>
                                                <select name="invoice_type"  data-style="material" class="data-input form-control" data-field="invoice_type" required placeholder=" ">
                                                    <option value="1">Tax</option>
                                                    <option value="2">No Tax</option>
                                                    <option value="3">Commercial</option>
                                                </select>
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Issue Date </label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="issue_date" data-field="issue_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Due Date </label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="due_date" data-field="due_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>


                                        <div class="field-row w-100 justify-content-end">
                                            <div class="d-flex flex-wrap gap-2 justify-content-end ">
                                                <button name="btnRent" class="custom-button">Rent</button>
                                                <button name="btnService" class="custom-button">Service</button>
                                                <button name="btnRequest" class="custom-button">Request</button>
                                                <button name="btnElectric" class="custom-button">Electric</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div name="divItemsView" ></div>
                                <div class="mt-4 d-flex justify-content-end mb-3">
                                    <div name="div_invoice_summary" class="w-100" style="max-width: 400px;"></div>
                                </div>

                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="general_remark" name="general_remark" rows="1" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>


                            </div>
                        </div>

                        <style>
                        .field-row {
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            --field-width: 260px;
                        }
                        .field-label {
                            width: 110px;
                            font-size: 0.875rem;
                            color: #222;
                            flex-shrink: 0;
                        }
                        .field-sep {
                            margin: 0 10px;
                            font-weight: 600;
                            color: #444;
                            flex-shrink: 0;
                        }
                        .field-row .field-input {
                            width: var(--field-width);
                            border-radius: 6px;
                            border: 1px solid #d0d0d0;
                            font-size: 0.875rem;
                            padding: 6px 10px;
                            background-color: #fff;
                            box-sizing: border-box;
                        }
                        .field-row .field-input:focus {
                            border-color: #86b7fe;
                            box-shadow: 0 0 0 3px rgba(13,110,253,0.15);
                            outline: none;
                        }
                        .field-row .choices {
                            width: var(--field-width) !important;
                            flex-shrink: 0;
                        }
                        .field-row .choices .choices__inner {
                            width: 100% !important;
                            min-height: unset !important;
                            border-radius: 6px !important;
                            border: 1px solid #d0d0d0 !important;
                            font-size: 0.875rem !important;
                            padding: 6px 10px !important;
                            background-color: #fff !important;
                            box-sizing: border-box;
                        }
                        .field-row .choices.is-focused .choices__inner,
                        .field-row .choices .choices__inner:focus-within {
                            border-color: #86b7fe !important;
                            box-shadow: 0 0 0 3px rgba(13,110,253,0.15) !important;
                            outline: none !important;
                        }
                        .field-row .choices[data-type="select-one"] .choices__button {
                            display: none !important;
                        }
                        .field-row .choices .choices__list--dropdown {
                            width: var(--field-width) !important;
                            z-index: 9999;
                        }
                        .custom-button {
                            color: #1a1647;
                            padding: 10px;
                            font-size: 12px;
                            border-radius: 0.5em;
                            background: ##d4d4db;
                            cursor: pointer;
                            border: 1px solid #9290aa;
                            transition: all 0.3s;
                        }
                        .custom-button:hover {
                            background-color: #b9b9c9;
                            border-color: #1a1647;
                        }

                        .custom-button:active {
                            color: #666;
                            box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
                        }

                        .cursor-blocked {
                            cursor: not-allowed !important;
                        }

                        </style>


                    `,

            contentCreated: (me) => {
                me.controls = me.controls || {};
                const btn_close = me.divModal.querySelector(".close");
                if (btn_close) btn_close.classList.add("d-none");
                const allInputs = me.divModal.querySelectorAll(
                    ".data-input, input, select, textarea",
                );
                allInputs.forEach((el) => {
                    const key = el.dataset.field || el.name;
                    if (key) me.controls[key] = el;
                });
                me.controls.divItemsView = me.divModal.querySelector(
                    '[name="divItemsView"]',
                );

                me.controls.div_invoice_summary = me.divModal.querySelector(
                    '[name="div_invoice_summary"]',
                );

                me.controls.btnRent.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    if (
                        !me.controls.invoice_type.value ||
                        me.controls.invoice_type.value === ""
                    ) {
                        return cv_interact.error("Please select Invoice Type.");
                    }
                    const invoiceType = me.controls.invoice_type.value;
                    const spaces = me._tenantSpaces || [];
                    const months = me._tenantMonths || [];
                    const selectedSpaceId =
                        me.controls.space?.value ||
                        me.controls.space_id?.value ||
                        "";

                    const matchedSpace =
                        spaces.find(
                            (s) =>
                                String(s.space_id) === String(selectedSpaceId),
                        ) || spaces[0];

                    if (!matchedSpace) {
                        return cv_interact.error("No space/contract found.");
                    }
                    const availableMonths = months.filter(
                        (m) =>
                            String(m.contract_id) ===
                            String(matchedSpace.contract_id),
                    );

                    if (!availableMonths || availableMonths.length === 0) {
                        return cv_interact.error(
                            "Rent has already reached the final month of the contract.",
                        );
                    }

                    // Popup Initialization
                    let rentDiv = null;
                    InputBox.resetInstance("rentPopUp");

                    InputBox.show({
                        title: "Rent Detail",
                        instanceKey: "rentPopUp",
                        confirmButtonText: "Save",
                        createContent() {
                            const div = document.createElement("div");
                            rentDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Contract Details</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="contract_id" name="contract_id" type="text" readonly>
                            <label style="color:#777;">Unit Code / Room</label>
                        </div>
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="monthly" name="monthly" type="text" readonly>
                            <label style="color:#777;">Monthly</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Billing Period</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="start_date" name="start_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;">Start Date</label>
                        </div>
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="end_date" name="end_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;">End Date</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Financials</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem; ${
                            Number(invoiceType) === 2
                                ? "grid-column: span 2;"
                                : ""
                        }">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="price" name="price" type="text" readonly style=" color:#0c447c;">
                            <label style="color:#777;">Effective Price ($)</label>
                        </div>
                        ${
                            Number(invoiceType) === 2
                                ? ""
                                : `                                        
                            <div class="material-input outlined" style="margin-bottom: 1rem;">
                                <input class="data-input form-control" data-field="tax_rate" name="tax_rate" type="text" inputmode="decimal" placeholder="0" required>
                                <label style="color:#777;">Tax % </label>
                            </div>`
                        }
                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                            <div style="flex:1">
                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                <label style="color:#777;">Discount</label>
                            </div>
                            <div style="width:100px;">
                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                    <option value="percent" selected>%</option>
                                    <option value="amount">$</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="material-input outlined" style="margin-bottom: 1rem; display:none;">
                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                    <label style="color:#777;">Remark</label>
                </div>
            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elContract = rentDiv.querySelector(
                                '[data-field="contract_id"]',
                            );
                            const elMonthly = rentDiv.querySelector(
                                '[data-field="monthly"]',
                            );
                            const elPrice = rentDiv.querySelector(
                                '[data-field="price"]',
                            );
                            const elStartDate = rentDiv.querySelector(
                                '[data-field="start_date"]',
                            );
                            const elEndDate = rentDiv.querySelector(
                                '[data-field="end_date"]',
                            );
                            const elDiscountType = rentDiv.querySelector(
                                '[data-field="discount_type"]',
                            );

                            if (!elContract || !elMonthly || !elPrice) return;

                            elContract.value =
                                matchedSpace.space_code || "(No code)";
                            elContract.dataset.contractId = String(
                                matchedSpace.contract_id,
                            );

                            const effectivePrice = Number(
                                matchedSpace.effective_price || 0,
                            );
                            elPrice.value = effectivePrice.toFixed(2);

                            const matchedMonth =
                                months.find(
                                    (m) =>
                                        String(m.contract_id) ===
                                        String(matchedSpace.contract_id),
                                ) || {};

                            elMonthly.value = matchedMonth.month || "";

                            if (elDiscountType) {
                                elDiscountType.value = "percent";
                            }
                            if (elStartDate) {
                                elStartDate.value =
                                    matchedMonth.start_date || "";
                            }
                            if (elEndDate) {
                                elEndDate.value = matchedMonth.end_date || "";
                            }

                            const numericInputs = [
                                rentDiv.querySelector(
                                    '[data-field="discount"]',
                                ),
                                rentDiv.querySelector(
                                    '[data-field="tax_rate"]',
                                ),
                            ].filter((input) => input !== null);

                            numericInputs.forEach((input) => {
                                input.addEventListener("input", (e) => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        "",
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2) {
                                        v = parts[0] + "." + parts[1];
                                    }
                                    if (parts[1] !== undefined) {
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
                                    }
                                    e.target.value = v;
                                });

                                input.addEventListener("blur", (e) => {
                                    let v = parseFloat(e.target.value);
                                    if (isNaN(v) || v < 0) {
                                        e.target.value = "";
                                        return;
                                    }
                                    e.target.value = v.toFixed(2);
                                });
                            });
                        },

                        onConfirm(data, btn, ibMe) {
                            // 1. Check if Tax field exists in the DOM layout tree (Invoice Type !== 2)
                            const elTaxRate = document.querySelector(
                                '[data-field="tax_rate"]',
                            );

                            if (elTaxRate) {
                                // If tax field is blank, empty strings, or evaluates to an invalid number
                                if (
                                    data.tax_rate === undefined ||
                                    data.tax_rate === null ||
                                    String(data.tax_rate).trim() === ""
                                ) {
                                    return ibMe.setError(
                                        "Tax % is required for this invoice type.",
                                    );
                                }

                                const taxValue = Number(data.tax_rate);
                                if (isNaN(taxValue) || taxValue < 0) {
                                    return ibMe.setError(
                                        "Please enter a valid Tax % value.",
                                    );
                                }
                            }

                            const elContract = document.querySelector(
                                '[data-field="contract_id"]',
                            );
                            const realContractId =
                                elContract?.dataset.contractId ||
                                data.contract_id;

                            if (!realContractId) {
                                return ibMe.setError(
                                    "Unit Code / Room is missing.",
                                );
                            }

                            const roomCode = matchedSpace.space_code || "â€”";
                            const finalPrice = Number(
                                data.price || matchedSpace.effective_price || 0,
                            );

                            const dataToAdd = {
                                item_id: realContractId,
                                type: "rent",
                                price: finalPrice,
                                qty: 1,
                                remarks: `Rent - ${roomCode} (${
                                    data.monthly || "N/A"
                                })`,
                                contract_id: realContractId,
                                start_date: data.start_date || "",
                                end_date: data.end_date || "",
                                space_code: roomCode,
                                discount: Number(data.discount) || 0,
                                discount_type: data.discount_type || "percent",
                                tax_rate: Number(data.tax_rate) || 0,
                                unit_type: `monthly`,
                            };

                            const existingIds = me.itemsView.rows
                                .map(
                                    (row) =>
                                        row.meta?.item_id || row.data?.item_id,
                                )
                                .filter(
                                    (id) =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null,
                                );

                            const isDuplicate = existingIds.some(
                                (id) =>
                                    String(id) === String(dataToAdd.item_id),
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    `Rent is already in the list.`,
                                );
                            }

                            me.itemsView.addRow(dataToAdd, 0);
                            cv_interact.success(
                                `Rent for ${roomCode} added successfully.`,
                            );
                            ibMe.close();
                        },
                    });
                };

                me.controls.btnElectric.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    // Fetch InvoiceSetting first, then open popup
                    const openElectricPopup = () => {
                        let electricDiv = null;
                        InputBox.resetInstance("electricPopUp");
                        InputBox.show({
                            title: "Electricity Utility",
                            instanceKey: "electricPopUp",
                            confirmButtonText: "Save",

                            createContent() {
                                const div = document.createElement("div");
                                electricDiv = div;
                                div.style.cssText =
                                    "display:flex; flex-direction:column;";

                                div.innerHTML = `
                                <!-- Tabs Container -->
                                <div class="d-flex mb-3" style="border-bottom:1px solid #eee; gap:16px;">
                                    <div id="btn_tab_reading" style="cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;">By Reading</div>
                                    <div id="btn_tab_manual" style="cursor:pointer; padding:8px 12px; color:#777;">Manual Entry</div>
                                </div>

                                <!-- Section: Core Consumption Inputs -->
                                <div class="d-flex align-items-center mb-3">
                                    <span id="consumption_header" style="color:#0C447C; font-size:13px;">Readings</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <!-- Conditional Dynamic Fields (Reading vs Manual) -->
                                <div id="row_reading_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="old_electric" name="old_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;">Old Reading (kWh)</label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="new_electric" name="new_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;">New Reading (kWh)</label>
                                    </div>
                                </div>

                                <!-- Shared Units Field (ReadOnly on Reading tab, Editable on Manual tab) -->
                                <div id="row_manual_fields" class="material-input outlined" style="margin-bottom: 1rem; display:none;">
                                    <input class="data-input form-control" data-field="units_used" name="units_used" type="text" inputmode="decimal" placeholder="0.00">
                                    <label style="color:#777;">Units Used (kWh)</label>
                                </div>

                               <!-- Section: Unified Calculations -->
                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;">Calculation</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <!-- Dynamic Row Container: Swaps between 2 columns (Reading mode) and 3 columns (Manual mode) -->
                                <div id="row_calculation_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    
                                    <!-- Only visible in Reading Tab -->
                                    <div id="wrapper_units_readonly" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input id="units_used_readonly" class="form-control bg-light cursor-blocked" type="text" readonly placeholder="0.00">
                                        <label style="color:#777;">Calculated Units (kWh)</label>
                                    </div>
                                    
                                    <!-- Shared Field: Changes grid position dynamically -->
                                    <div id="wrapper_exchange_rate" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="exchange_rate" name="exchange_rate" type="text" inputmode="decimal" placeholder="0.00" value="4025">
                                        <label style="color:#777;">Exchange Rate (KHR)</label>
                                    </div>

                                    <!-- Hidden on Reading Init, part of the 3-column row in Manual -->
                                    <div id="wrapper_price_khr" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_khr" name="price_khr" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;">Price per kWh (KHR)</label>
                                    </div>

                                    <div id="wrapper_price_usd" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_usd" name="price_usd" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;">Price per kWh (USD)</label>
                                    </div>
                                </div>

                                <!-- Section: Unified Period -->
                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;">Period</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;">Start Date</label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;">End Date</label>
                                    </div>
                                </div>

                                <!-- Unified Total Amount Footer Display -->
                                <div class="material-input outlined">
                                    <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                        style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;">
                                    <label style="color:#0c447c;">Total Amount ($)</label>
                                </div>
                                
                                <div class="material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                                <input class="data-input" type="text" data-field="entry_mode" value="reading" style="display:none;">
                            `;
                                return div;
                            },

                            onOpen(ibMe) {
                                // Target elements using structural selectors
                                const elOld = electricDiv.querySelector(
                                    '[data-field="old_electric"]',
                                );
                                const elNew = electricDiv.querySelector(
                                    '[data-field="new_electric"]',
                                );
                                const elUnits = electricDiv.querySelector(
                                    '[data-field="units_used"]',
                                );
                                const elUnitsReadonly =
                                    electricDiv.querySelector(
                                        "#units_used_readonly",
                                    );

                                const elExchangeRate =
                                    electricDiv.querySelector(
                                        '[data-field="exchange_rate"]',
                                    );
                                const elPriceKHR = electricDiv.querySelector(
                                    '[data-field="price_khr"]',
                                );
                                const elPriceUSD = electricDiv.querySelector(
                                    '[data-field="price_usd"]',
                                );

                                const elStartDate = electricDiv.querySelector(
                                    '[data-field="start_date"]',
                                );
                                const elEndDate = electricDiv.querySelector(
                                    '[data-field="end_date"]',
                                );
                                const elTotal = electricDiv.querySelector(
                                    '[data-field="total_amount"]',
                                );
                                const elRemark = electricDiv.querySelector(
                                    '[data-field="remark"]',
                                );
                                const elMode = electricDiv.querySelector(
                                    '[data-field="entry_mode"]',
                                );

                                // Structural layout layout control nodes
                                const btnTabReading =
                                    electricDiv.querySelector(
                                        "#btn_tab_reading",
                                    );
                                const btnTabManual =
                                    electricDiv.querySelector(
                                        "#btn_tab_manual",
                                    );
                                const txtConsumptionHeader =
                                    electricDiv.querySelector(
                                        "#consumption_header",
                                    );
                                const rowReadingFields =
                                    electricDiv.querySelector(
                                        "#row_reading_fields",
                                    );
                                const rowManualFields =
                                    electricDiv.querySelector(
                                        "#row_manual_fields",
                                    );
                                const wrapperUnitsReadonly =
                                    electricDiv.querySelector(
                                        "#wrapper_units_readonly",
                                    );

                                elExchangeRate.value = InvoiceSetting
                                    ? (InvoiceSetting.exchange_rate ?? "")
                                    : "";

                                console.log(
                                    "InvoiceSetting.exchange_rate",
                                    InvoiceSetting
                                        ? InvoiceSetting.exchange_rate
                                        : null,
                                );

                                // Currency conversion handlers
                                elPriceKHR.addEventListener("input", (e) => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
                                    const khrVal =
                                        parseFloat(e.target.value) || 0;
                                    elPriceUSD.value =
                                        khrVal > 0
                                            ? (khrVal / rate).toFixed(2)
                                            : "";
                                    recalc();
                                });

                                elPriceUSD.addEventListener("input", (e) => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
                                    const usdVal =
                                        parseFloat(e.target.value) || 0;
                                    elPriceKHR.value =
                                        usdVal > 0
                                            ? Math.round(usdVal * rate)
                                            : "";
                                    recalc();
                                });

                                elExchangeRate.addEventListener("input", () => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
                                    const usdVal =
                                        parseFloat(elPriceUSD.value) || 0;
                                    if (usdVal > 0) {
                                        elPriceKHR.value = Math.round(
                                            usdVal * rate,
                                        );
                                    } else {
                                        const khrVal =
                                            parseFloat(elPriceKHR.value) || 0;
                                        if (khrVal > 0)
                                            elPriceUSD.value = (
                                                khrVal / rate
                                            ).toFixed(2);
                                    }
                                    recalc();
                                });

                                // UI Tab switcher

                                // New structural nodes for 3-in-1 row switching
                                const rowCalculationFields =
                                    electricDiv.querySelector(
                                        "#row_calculation_fields",
                                    );

                                // UI Tab switcher
                                const switchTab = (mode) => {
                                    elMode.value = mode;
                                    if (mode === "reading") {
                                        // Form structure configuration
                                        rowReadingFields.style.display = "grid";
                                        rowManualFields.style.display = "none";
                                        txtConsumptionHeader.textContent =
                                            "Readings";

                                        // Calculation Row: Standard 2x2 layout look
                                        rowCalculationFields.style.gridTemplateColumns =
                                            "1fr 1fr";
                                        wrapperUnitsReadonly.style.display =
                                            "block";

                                        // Tab Styles
                                        btnTabReading.style.cssText =
                                            "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                        btnTabManual.style.cssText =
                                            "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                    } else {
                                        // Form structure configuration
                                        rowReadingFields.style.display = "none";
                                        rowManualFields.style.display = "block";
                                        txtConsumptionHeader.textContent =
                                            "Manual Entry";

                                        // Calculation Row: Shrinks into 1 clean row with 3 columns
                                        rowCalculationFields.style.gridTemplateColumns =
                                            "1fr 1fr 1fr";
                                        wrapperUnitsReadonly.style.display =
                                            "none";

                                        // Tab Styles
                                        btnTabManual.style.cssText =
                                            "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                        btnTabReading.style.cssText =
                                            "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                    }
                                    recalc();
                                };

                                btnTabReading.onclick = () =>
                                    switchTab("reading");
                                btnTabManual.onclick = () =>
                                    switchTab("manual");

                                // Centralized recalculation logic
                                const recalc = () => {
                                    const mode = elMode.value;
                                    let units = 0;

                                    if (mode === "reading") {
                                        const oldVal =
                                            parseFloat(elOld.value) || 0;
                                        const newVal =
                                            parseFloat(elNew.value) || 0;
                                        units = newVal - oldVal;

                                        if (units < 0) {
                                            elUnitsReadonly.value = "0.00";
                                            elUnitsReadonly.style.color = "red";
                                        } else {
                                            elUnitsReadonly.value =
                                                units.toFixed(2);
                                            elUnitsReadonly.style.color =
                                                "#212529";
                                        }
                                    } else {
                                        units = parseFloat(elUnits.value) || 0;
                                    }

                                    const ppu =
                                        parseFloat(elPriceUSD.value) || 0;
                                    const total = Math.max(0, units) * ppu;

                                    if (elTotal)
                                        elTotal.value = total.toFixed(2);

                                    if (elRemark) {
                                        const start = elStartDate.value || "";
                                        const end = elEndDate.value || "";
                                        const period =
                                            start && end
                                                ? ` (${start} - ${end})`
                                                : "";
                                        const calcStr =
                                            units > 0 && ppu > 0
                                                ? ` â€” ${units.toFixed(
                                                      2,
                                                  )} kWh Ã— $${ppu.toFixed(2)}`
                                                : mode === "reading"
                                                  ? " â€” Reading Setup"
                                                  : " â€” Manual Entry";

                                        elRemark.value = `Electric${period}${calcStr}`;
                                    }
                                };

                                // Input format validation helpers and recalculation binding
                                [
                                    elOld,
                                    elNew,
                                    elUnits,
                                    elPriceUSD,
                                    elExchangeRate,
                                    elStartDate,
                                    elEndDate,
                                ].forEach((el) => {
                                    if (!el) return;
                                    el.addEventListener("input", recalc);
                                    if (el.dataset.type === "date") {
                                        el.addEventListener("change", recalc);
                                    }

                                    // Block non-numeric characters while tying
                                    el.addEventListener("input", (e) => {
                                        if (el.dataset.type === "date") return;
                                        let v = e.target.value.replace(
                                            /[^0-9.]/g,
                                            "",
                                        );
                                        const parts = v.split(".");
                                        if (parts.length > 2)
                                            v = parts[0] + "." + parts[1];
                                        if (parts[1] !== undefined)
                                            v =
                                                parts[0] +
                                                "." +
                                                parts[1].slice(0, 2);
                                        e.target.value = v;
                                    });

                                    // Enforce proper floats on losing input focus
                                    el.addEventListener("blur", (e) => {
                                        if (el.dataset.type === "date") return;
                                        let v = parseFloat(e.target.value);
                                        if (isNaN(v) || v < 0) {
                                            e.target.value = "";
                                            return;
                                        }
                                        e.target.value = v.toFixed(2);
                                    });
                                });
                            },

                            onConfirm(data, btn, ibMe) {
                                const mode = data.entry_mode || "reading";
                                const ppu = parseFloat(data.price_usd) || 0;
                                let units = 0;
                                let remarks = "";

                                // Validation rules per view mode
                                if (mode === "reading") {
                                    const oldReading =
                                        parseFloat(data.old_electric) || 0;
                                    const newReading =
                                        parseFloat(data.new_electric) || 0;
                                    units = newReading - oldReading;

                                    if (newReading <= 0)
                                        return ibMe.setError(
                                            "New reading is required.",
                                        );
                                    if (newReading <= oldReading)
                                        return ibMe.setError(
                                            "New reading must be greater than old reading.",
                                        );
                                    remarks = `Electricity ${oldReading}kWh - ${newReading}kWh`;
                                } else {
                                    units = parseFloat(data.units_used) || 0;
                                    if (units <= 0)
                                        return ibMe.setError(
                                            "Units Used field is required and must be greater than 0.",
                                        );
                                    remarks = `Electric Utility - ${
                                        data.start_date || ""
                                    } to ${data.end_date || ""}`;
                                }

                                if (ppu <= 0)
                                    return ibMe.setError(
                                        "Price per kWh (USD) is required.",
                                    );
                                if (!data.start_date || !data.end_date)
                                    return ibMe.setError(
                                        "Start and End dates are required.",
                                    );
                                if (
                                    new Date(data.end_date) <
                                    new Date(data.start_date)
                                ) {
                                    return ibMe.setError(
                                        "End date cannot be before Start date.",
                                    );
                                }

                                // Push payload to items view structure
                                me.itemsView.addRow(
                                    {
                                        item_id: null,
                                        type: "utility",
                                        price: ppu,
                                        qty: units,
                                        // remarks: remarks,
                                        remarks:
                                            mode === "reading"
                                                ? `Electricity ${
                                                      data.old_electric || 0
                                                  }KWh - ${
                                                      data.new_electric || 0
                                                  }KWh`
                                                : `Electricity ${units}KWh`,
                                        unit_type: "KWh",
                                        old_reading:
                                            mode === "reading"
                                                ? parseFloat(
                                                      data.old_electric,
                                                  ) || 0
                                                : 0,
                                        new_reading:
                                            mode === "reading"
                                                ? parseFloat(
                                                      data.new_electric,
                                                  ) || 0
                                                : 0,
                                        units_used: units,
                                        price_per_unit: ppu,
                                        start_date: data.start_date,
                                        end_date: data.end_date,
                                        discount: 0,
                                        discount_type: "percent",
                                    },
                                    0,
                                );

                                cv_interact.success("Electric item added.");
                                ibMe.close();
                            },
                        });
                    }; // end openElectricPopup

                    if (InvoiceSetting) {
                        openElectricPopup();
                    } else {
                        vsapi
                            .call(
                                `${main_view.base_url}/prm/invoice_setting/get`,
                                {},
                            )
                            .then((res) => {
                                if (
                                    res.status_code === 200 &&
                                    res.data &&
                                    res.data.length > 0
                                ) {
                                    InvoiceSetting = res.data[0];
                                } else {
                                    InvoiceSetting = {};
                                }
                                openElectricPopup();
                            })
                            .catch(() => {
                                InvoiceSetting = {};
                                openElectricPopup();
                            });
                    }
                };

                // =====================Service ===================
                me.controls.btnService.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    const services = availableItem || [];
                    if (services.length === 0) {
                        return cv_interact.error("No services available.");
                    }

                    const serviceOptions = services
                        .map(
                            (s) =>
                                `<option value="${s.id}">${
                                    s.service || s.name || `Service #${s.id}`
                                }</option>`,
                        )
                        .join("");

                    let serviceDiv = null;

                    InputBox.resetInstance("servicePopUp");

                    InputBox.show({
                        title: "Add Service",
                        instanceKey: "servicePopUp",
                        confirmButtonText: "Save",
                        createContent() {
                            const div = document.createElement("div");
                            serviceDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Service Selection</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <select class="data-input form-control" data-style="material" data-field="service_id" name="service_id" placeholder="Select Service">
                                                ${serviceOptions}
                                            </select>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light" data-field="charge_as" name="charge_as" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Charge As</label>
                                        </div>
                                        <div id="price_wrapper" class="material-input outlined" style="margin-bottom: 1rem; grid-column: span 2;">
                                            <input class="data-input form-control bg-light" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Unit Price ($)</label>
                                        </div>
                                        <div id="duration_container" style="display:none; margin-bottom: 1rem;" class="material-input outlined" >
                                            <select class="data-input form-control" data-style="material" data-field="duration_months" name="duration_months" placeholder="Duration (Qty)">
                                                <option value="1">1 Month</option>
                                                <option value="3">3 Months</option>
                                                <option value="6">6 Months</option>
                                                <option value="12">12 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div id="billing_period_container" style="display:none;">
                                    <div class="d-flex align-items-center  mb-3">
                                        <span style=" color:#0C447C; font-size:13px;">Billing Period</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;">Start Date</label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;">End Date</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Financials</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>

                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;">Discount</label>
                                            </div>
                                            <div style="width:80px;">
                                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                                    <option value="percent" selected>%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="material-input outlined mt-2">
                                    <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                        style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;">
                                    <label style="color:#0c447c;">Total Amount ($)</label>
                                </div>

                                <div class="material-input outlined mt-3" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                            `;
                            return div;
                        },
                        onOpen(ibMe) {
                            const elBillingCont = serviceDiv.querySelector(
                                "#billing_period_container",
                            );
                            const elPriceWrapper =
                                serviceDiv.querySelector("#price_wrapper");

                            const elService = serviceDiv.querySelector(
                                '[data-field="service_id"]',
                            );
                            const elUnitType = serviceDiv.querySelector(
                                '[data-field="charge_as"]',
                            );
                            const elPrice = serviceDiv.querySelector(
                                '[data-field="price"]',
                            );
                            const elDuration = serviceDiv.querySelector(
                                '[data-field="duration_months"]',
                            );
                            const elDurationCont = serviceDiv.querySelector(
                                "#duration_container",
                            );
                            const elStartDate = serviceDiv.querySelector(
                                '[data-field="start_date"]',
                            );
                            const elEndDate = serviceDiv.querySelector(
                                '[data-field="end_date"]',
                            );
                            const elDiscount = serviceDiv.querySelector(
                                '[data-field="discount"]',
                            );
                            const elDiscountType = serviceDiv.querySelector(
                                '[data-field="discount_type"]',
                            );
                            const elTotalAmount = serviceDiv.querySelector(
                                '[data-field="total_amount"]',
                            );

                            // --- Calculation Engine ---
                            const calculateTotalAmount = () => {
                                const price = parseFloat(elPrice.value) || 0;

                                // If it's a month unit, get month selection. Otherwise, fallback to Qty 1.
                                const isMonthly =
                                    (elUnitType.value || "").toLowerCase() ===
                                    "month";
                                const qty = isMonthly
                                    ? parseInt(elDuration.value) || 1
                                    : 1;

                                let subtotal = price * qty;
                                const discountVal =
                                    parseFloat(elDiscount.value) || 0;

                                if (elDiscountType.value === "percent") {
                                    subtotal =
                                        subtotal -
                                        subtotal * (discountVal / 100);
                                } else if (elDiscountType.value === "amount") {
                                    subtotal = subtotal - discountVal;
                                }

                                if (subtotal < 0) subtotal = 0;

                                if (elTotalAmount) {
                                    elTotalAmount.value = subtotal.toFixed(2);
                                }
                            };

                            const fillFields = (serviceId) => {
                                const selected = services.find(
                                    (s) => String(s.id) === String(serviceId),
                                );
                                if (selected) {
                                    const unit = (
                                        selected.charge_as || ""
                                    ).toLowerCase();

                                    if (elUnitType)
                                        elUnitType.value =
                                            selected.charge_as || "â€”";
                                    if (elPrice)
                                        elPrice.value = Number(
                                            selected.price || 0,
                                        ).toFixed(2);

                                    if (unit === "month") {
                                        elDurationCont.style.display = "block";
                                        elBillingCont.style.display = "block";
                                        elPriceWrapper.style.gridColumn =
                                            "span 1";
                                    } else {
                                        elDurationCont.style.display = "none";
                                        elDuration.value = "1";
                                        elBillingCont.style.display = "none";
                                        elPriceWrapper.style.gridColumn =
                                            "span 2";

                                        elStartDate.value = "";
                                        elEndDate.value = "";
                                    }

                                    recalcDates();
                                    calculateTotalAmount(); // Calculate right after switching services
                                }
                            };

                            const recalcDates = () => {
                                if (elStartDate.value && elDuration.value) {
                                    let start = new Date(elStartDate.value);
                                    if (isNaN(start.getTime())) return;

                                    let months =
                                        parseInt(elDuration.value) || 1;
                                    let end = new Date(start);
                                    end.setMonth(end.getMonth() + months);
                                    end.setDate(end.getDate() - 1);

                                    const formatDate = (date) => {
                                        const monthsArr = [
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                        ];
                                        const day = String(
                                            date.getDate(),
                                        ).padStart(2, "0");
                                        const month =
                                            monthsArr[date.getMonth()];
                                        const year = date.getFullYear();
                                        return `${day}-${month}-${year}`;
                                    };

                                    elEndDate.value = formatDate(end);
                                }
                            };

                            if (elDiscountType)
                                elDiscountType.value = "percent";

                            if (elService) {
                                fillFields(elService.value);
                                elService.addEventListener("change", (e) =>
                                    fillFields(e.target.value),
                                );
                            }

                            // Recalculate dates AND totals on configuration inputs
                            [elDuration, elStartDate].forEach((el) => {
                                el?.addEventListener("change", () => {
                                    recalcDates();
                                    calculateTotalAmount();
                                });
                            });

                            // Trigger real-time calculations on financial configuration inputs
                            if (elDiscountType) {
                                elDiscountType.addEventListener(
                                    "change",
                                    calculateTotalAmount,
                                );
                            }

                            if (elDiscount) {
                                elDiscount.addEventListener("input", (e) => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        "",
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    e.target.value = v;

                                    calculateTotalAmount(); // Live recalculation as you type
                                });

                                elDiscount.addEventListener("blur", (e) => {
                                    let v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);
                                    calculateTotalAmount();
                                });
                            }
                        },
                        onConfirm(data, btn, ibMe) {
                            if (!data.service_id) {
                                return ibMe.setError(
                                    "Please select a Service.",
                                );
                            }

                            const selectedService = services.find(
                                (s) => String(s.id) === String(data.service_id),
                            );
                            if (!selectedService) return;

                            const serviceDisplayName =
                                selectedService.service ||
                                selectedService.name ||
                                `Service #${selectedService.id}`;

                            const unit = (
                                selectedService.charge_as || ""
                            ).toLowerCase();

                            if (unit === "month") {
                                if (!data.duration_months) {
                                    return ibMe.setError(
                                        "Please input Duration.",
                                    );
                                }
                                if (!data.start_date || !data.end_date) {
                                    return ibMe.setError(
                                        "Please input Start and End Date.",
                                    );
                                }
                            }

                            const qtyMonths =
                                unit === "month"
                                    ? parseInt(data.duration_months) || 1
                                    : 1;

                            let remarkStr = serviceDisplayName;
                            if (unit === "month") {
                                remarkStr += ` - ${qtyMonths} Month${
                                    qtyMonths > 1 ? "s" : ""
                                } `;
                            }

                            // Read the dynamically computed total amount from input
                            const totalAmountInput = serviceDiv.querySelector(
                                '[data-field="total_amount"]',
                            );
                            const calculatedTotal = totalAmountInput
                                ? parseFloat(totalAmountInput.value)
                                : Number(selectedService.price) || 0;

                            const existingIds = me.itemsView.rows
                                .map(
                                    (row) =>
                                        row.meta?.item_id || row.data?.item_id,
                                )
                                .filter(
                                    (id) =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null,
                                );

                            const isDuplicate = existingIds.some(
                                (id) => String(id) === String(data.service_id),
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    `Service is already in the list.`,
                                );
                            }

                            me.itemsView.addRow(
                                {
                                    item_id: data.service_id,
                                    type: "service",
                                    price: Number(selectedService.price) || 0,
                                    qty: qtyMonths,
                                    remarks: remarkStr,
                                    unit_type:
                                        (selectedService.charge_as || "Month") +
                                        (qtyMonths > 1 ? "s" : ""),
                                    discount: Number(data.discount) || 0,
                                    start_date: data.start_date || "",
                                    end_date: data.end_date || "",
                                    discount_type:
                                        data.discount_type || "percent",
                                    total_amount: calculatedTotal,
                                },
                                0,
                            );

                            cv_interact.success(
                                `Service added for ${qtyMonths} ${
                                    unit === "month" ? "month(s)" : "unit"
                                }`,
                            );
                            ibMe.close();
                        },
                        onCancel(ibMe) {
                            ibMe.close();
                        },
                    });
                };

                // ==================Service Request=========
                me.controls.btnRequest.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }

                    const selectedSpaceId =
                        me.controls.space?.value || me.controls.space_id?.value;
                    if (!selectedSpaceId || selectedSpaceId === "") {
                        return cv_interact.error("Please select Space.");
                    }

                    const requests = me._requestedServices || [];
                    console.log("All Requests", requests);

                    const filteredRequests = requests.filter(
                        (r) => String(r.space_id) === String(selectedSpaceId),
                    );

                    if (filteredRequests.length === 0) {
                        return cv_interact.error(
                            "No Requests relate to this space.",
                        );
                    }

                    const serviceRequestOption = filteredRequests
                        .map(
                            (sr) =>
                                `<option value="${sr.request_id}">${sr.code} (${sr.space_code})</option>`,
                        )
                        .join("");

                    let requestDiv = null;
                    InputBox.resetInstance("requestPopUp");

                    InputBox.show({
                        title: "Service Request",
                        instanceKey: "requestPopUp",
                        confirmButtonText: "Save",
                        createContent() {
                            const div = document.createElement("div");
                            requestDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Request Info</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <select class="data-input form-control" data-field="request_id" name="request_id" data-style="material" placeholder="Request No">
                                                ${serviceRequestOption}
                                            </select>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="service_name" name="service_name" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Service Name</label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light" data-field="unit_type" name="unit_type" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Unit Type</label>
                                        </div>
                                        <div class="material-input outlined" data-wrapper="duration" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="duration_hours" name="duration_hours" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Duration (Hours)</label>
                                        </div>
                                        <div id="price_wrapper_requested" class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Original Price ($)</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Financials</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;">Discount</label>
                                            </div>
                                            <div style="width:80px;">
                                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                                    <option value="percent" selected>%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div class="material-input outlined" style="grid-column: span 2; margin-top: 0.5rem;">
                                            <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                                style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;" placeholder=" ">
                                            <label style="color:#0c447c;">Total Amount ($)</label>
                                        </div>
                                    </div>
                                </div>
                                <div class=" material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elPriceWrapperR = requestDiv.querySelector(
                                "#price_wrapper_requested",
                            );
                            const elRequest = requestDiv.querySelector(
                                '[data-field="request_id"]',
                            );
                            const elDuration = requestDiv.querySelector(
                                '[data-field="duration_hours"]',
                            );
                            const elPrice = requestDiv.querySelector(
                                '[data-field="price"]',
                            );
                            const elServiceName = requestDiv.querySelector(
                                '[data-field="service_name"]',
                            );
                            const elUnitType = requestDiv.querySelector(
                                '[data-field="unit_type"]',
                            );
                            const elRemark = requestDiv.querySelector(
                                '[data-field="remark"]',
                            );
                            const elDurationWrapper = requestDiv.querySelector(
                                '[data-wrapper="duration"]',
                            );
                            const elDiscount = requestDiv.querySelector(
                                '[data-field="discount"]',
                            );
                            const elDiscountType = requestDiv.querySelector(
                                '[data-field="discount_type"]',
                            );
                            const elTotalAmount = requestDiv.querySelector(
                                '[data-field="total_amount"]',
                            );

                            if (elPriceWrapperR)
                                elPriceWrapperR.style.gridColumn = "span 2";

                            // Calculation function for Live Totals
                            const calculateTotalAmount = () => {
                                if (!elPrice || !elTotalAmount) return;

                                const originalPrice =
                                    parseFloat(elPrice.value) || 0;
                                const duration =
                                    elUnitType && elUnitType.value === "Hour"
                                        ? parseFloat(elDuration.value) || 0
                                        : 1;
                                const baseTotal = originalPrice * duration;

                                const discountVal =
                                    parseFloat(elDiscount.value) || 0;
                                const discType = elDiscountType
                                    ? elDiscountType.value
                                    : "percent";

                                let finalTotal = baseTotal;

                                if (discType === "percent") {
                                    finalTotal =
                                        baseTotal -
                                        baseTotal * (discountVal / 100);
                                } else {
                                    finalTotal = baseTotal - discountVal;
                                }

                                // Make sure total doesn't drop into negative numbers
                                if (finalTotal < 0) finalTotal = 0;

                                elTotalAmount.value = finalTotal.toFixed(2);
                            };

                            const fillRequestData = (selectedId) => {
                                const matched = filteredRequests.find(
                                    (r) =>
                                        String(r.request_id) ===
                                        String(selectedId),
                                );

                                if (matched) {
                                    elServiceName.value =
                                        matched.service_name || "";
                                    elUnitType.value = matched.unit_type || "";
                                    elDuration.value =
                                        matched.duration_hours || "0";
                                    elPrice.value = Number(
                                        matched.price,
                                    ).toFixed(2);
                                    elRemark.value = matched.remarks || "";

                                    elDurationWrapper.style.display =
                                        matched.unit_type === "Hour"
                                            ? "block"
                                            : "none";
                                    elPriceWrapperR.style.gridColumn =
                                        matched.unit_type === "Hour"
                                            ? "span 2"
                                            : "span 1";

                                    // Recalculate based on newly matched service values
                                    calculateTotalAmount();
                                }
                            };

                            if (elDiscountType) {
                                elDiscountType.value = "percent";
                                elDiscountType.addEventListener(
                                    "change",
                                    calculateTotalAmount,
                                );
                            }

                            if (elRequest) {
                                fillRequestData(elRequest.value);
                                elRequest.addEventListener("change", (e) => {
                                    fillRequestData(e.target.value);
                                });
                            }

                            if (elDiscount) {
                                elDiscount.addEventListener("input", (e) => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        "",
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    if (parts[1] !== undefined)
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
                                    e.target.value = v;

                                    calculateTotalAmount(); // Recalculate on keystroke
                                });

                                elDiscount.addEventListener("blur", (e) => {
                                    const v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);

                                    calculateTotalAmount(); // Final check on blur
                                });
                            }
                        },

                        onConfirm(data, btn, ibMe) {
                            const selectedRequest = filteredRequests.find(
                                (r) =>
                                    String(r.request_id) ===
                                    String(data.request_id),
                            );

                            if (!selectedRequest) {
                                return cv_interact.error(
                                    "Please select a service request.",
                                );
                            }

                            const requestDisplayName =
                                selectedRequest.code ||
                                `Request # ${selectedRequest.request_id}`;

                            const existingIds = me.itemsView.rows
                                .map(
                                    (row) =>
                                        row.meta?.item_id || row.data?.item_id,
                                )
                                .filter(
                                    (id) =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null,
                                );

                            const isDuplicate = existingIds.some(
                                (id) =>
                                    String(id) ===
                                    String(selectedRequest.request_id),
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    "Service Request is already in the list.",
                                );
                            }

                            const dataToAdd = {
                                item_id: selectedRequest.request_id,
                                type: "Service Request",
                                price: Number(selectedRequest.price),
                                qty:
                                    selectedRequest.unit_type === "Hour"
                                        ? selectedRequest.duration_hours || 0
                                        : 1,
                                unit_type: `${selectedRequest.unit_type || 0}`,
                                remarks: `Service Request:  ${requestDisplayName}`,
                                space_id: selectedRequest.space_id,
                                space_code: selectedRequest.space_code,
                                discount: Number(data.discount) || 0,
                                discount_type: data.discount_type || "percent",
                                request_id: selectedRequest.request_id,
                            };

                            me.itemsView.addRow(dataToAdd, 0);
                            cv_interact.success(
                                "Service request added to invoice",
                            );
                            ibMe.close();
                        },
                    });
                };

                me.itemsView = new ItemsView(me.controls.divItemsView, {
                    currencyCode: "USD",
                    columns: [
                        // {
                        //     name: "item_id",
                        //     displayType: "text",
                        //     readOnly: true,
                        //     width: "2px",
                        // },

                        {
                            name: "remarks",
                            transTitle: "titles.Item",
                            displayType: "text",
                            dataType: "string",
                            readOnly: true,
                            className: "small col-item-name",
                            width: "230px",
                            // html: '<input type="checkbox" class="check_accept">',
                        },

                        {
                            name: "start_date",
                            transTitle: "titles.Start Date",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "130px",
                        },
                        {
                            name: "end_date",
                            transTitle: "titles.End Date",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "130px",
                        },
                        {
                            name: "qty",
                            transTitle: "titles.QTY",
                            dataType: "number",
                            readOnly: true,
                            className: "text-start",
                            width: "70px",
                        },

                        {
                            name: "unit_type",
                            transTitle: "titles.Charge As",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "110px",
                        },
                        {
                            name: "price",
                            transTitle: "titles.Price",
                            readOnly: true,
                            isNumeric: true,
                            dataType: "money",
                            width: "150px",
                        },
                        {
                            name: "discount",
                            transTitle: "titles.Discount",
                            isDiscount: true,
                            discountType: ["percent", "amount"],
                            defaultDiscountType: "percent",
                            discountBeforeTax: true,
                            readOnly: true,
                            width: "100px",
                        },
                        {
                            name: "tax_rate",
                            transTitle: "titles.Tax",
                            dataType: "percent",
                            readOnly: true,
                        },
                        {
                            name: "total",
                            transTitle: "titles.Total",
                            dataType: "money",
                            readOnly: true,
                            isNumeric: true,
                            width: "150px",
                        },
                    ],
                    calc: {
                        mode: "auto",
                        qtyField: "qty",
                        priceField: "price",
                        totalField: "total",
                        taxField: "tax_rate",
                        currencyPrecision: 2,
                    },

                    totalSummary: {
                        container: me.controls.div_invoice_summary,
                        showTax: false,
                        allowDiscount: true,
                        discountBeforeTax: true,
                        // currencyConversion: {
                        //     currency_code: "KHR",
                        //     rate: 4100
                        // }
                    },
                    // currencyConversion: {
                    //     currency_code: "KHR",
                    //     rate: 4100,
                    //     transTitle: "titles.Amount in KHR"
                    // },
                    tableClass: "table",
                    ensureEmptyRow: false,
                    showAddLineButton: false,
                    showAddLineButton: false,

                    validateColumns: {
                        item_id: "positive",
                        qty: "positive",
                        price: "positive",
                    },

                    itemRendered(item, ctx) {
                        const tr = ctx.tr;
                        const item_id = ctx.data.item_id;
                        const type = ctx.data.type;
                        const unit_type = ctx.data.unit_type;

                        item.setRowMeta(tr, {
                            item_id: item_id,
                            type: type,
                            unit_type: unit_type,
                        });

                        if (item.rows.length >= 2) {
                            me.controls.tenant.disabled = true;
                            me.setReadOnly(true, [
                                "tenant_id",
                                "space_id",
                                "invoice_type",
                            ]);
                        }
                    },

                    onItemChange: (rowId, item, fieldName, td, tr) => {
                        if (fieldName === "item_id") {
                            const selectedService = availableItem.find(
                                (s) => String(s.id) === String(item.item_id),
                            );
                            if (selectedService) {
                                me.itemsView.setCellValue(
                                    tr,
                                    "price",
                                    Number(selectedService.price) || 0,
                                );
                                me.itemsView.setCellValue(
                                    tr,
                                    "unit_type",
                                    selectedService.unit_type || "â€”",
                                );
                                me.itemsView.setCellValue(tr, "qty", 1);
                                me.itemsView.setCellValue(
                                    tr,
                                    "remarks",
                                    selectedService.service ||
                                        selectedService.name ||
                                        "â€”",
                                );
                                me.itemsView.setCellValue(
                                    tr,
                                    "type",
                                    "service",
                                );
                            } else if (item.contract_id || item.space_price) {
                                const rentPrice =
                                    parseFloat(
                                        item.space_price || item.price,
                                    ) || 0;
                                me.itemsView.setCellValue(
                                    tr,
                                    "price",
                                    rentPrice,
                                );
                                me.itemsView.setCellValue(tr, "type", "rent");
                                me.itemsView.setCellValue(tr, "unit_type", "â€”");
                            }
                        }
                    },
                });

                me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    type: "select",
                    prefetch: true,
                    query: {
                        from: "tenants",
                        where: [["status_id", "=", 2]],
                        select: [
                            "id",
                            "name",
                            "legal_name",
                            "email",
                            "phone_number",
                        ],
                        searchFields: {
                            name: "LIKE",
                            legal_name: "like",
                            email: "=",
                            phone: "=",
                        },
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: (tenant) => {
                        me._selectedTenantId = tenant.id;
                        vsapi
                            .post(
                                `${main_view.base_url}/prm/tenant/option-tenant-with-contract`,
                                { tenant_id: tenant.id },
                                {},
                            )
                            .then((res) => {
                                const d = res.data || {};

                                me.controls.phone_number.value =
                                    d.tenant?.phone_number || "";
                                me.controls.email.value = d.tenant?.email || "";
                                me._selectedTenantId = tenant.id;
                                me._tenantData = d;
                                me._tenantSpaces = d.spaces || [];
                                me._tenantMonths = d.months || [];
                                me._requestedServices =
                                    d.service_requests || [];

                                VSUtil.setComboItems(
                                    me.controls.space,
                                    d.spaces || [],
                                    "space_id",
                                    "space_code",
                                    "",
                                    "Select Space",
                                    "",
                                );
                            });
                    },
                });

                me.searchTenant.reset("");

                me.saveData = () => {
                    let header = me.getData();
                    const items = me.itemsView.getItems({
                        metaKeys: ["item_id", "type", "remark", "unit_type"],
                    }); // Retrieves all row data

                    console.log("Items", items);

                    const totals = me.itemsView.getCurrentTotals?.() || {};

                    if (me._selectedTenantId) {
                        header.tenant_id = me._selectedTenantId;
                    }
                    if (me.dataOptions?.id) {
                        header.id = me.dataOptions.id;
                    }

                    const toMySQLDate = (dateStr) => {
                        if (!dateStr) return null;
                        const d = new Date(dateStr);
                        return isNaN(d.getTime())
                            ? null
                            : d.toISOString().split("T")[0];
                    };

                    const mappedItems = items
                        .filter(
                            (item) =>
                                parseFloat(item.price || 0) > 0 ||
                                parseFloat(item.qty || 0) > 0,
                        )

                        .map((item) => {
                            return {
                                ...item,
                                item_id: item.item_id || null,
                                type: item.type || "service",
                                qty: parseFloat(item.qty || 1),
                                price: parseFloat(item.price || 0),
                                unit_type: item.unit_type || "â€”",
                                remarks: item.remarks || item.description || "",
                                start_date: item.start_date,
                                end_date: item.end_date,
                                discount: parseFloat(item.discount || 0),
                                tax_rate: parseFloat(item.tax_rate || 0),
                                amount: parseFloat(item.total || 0),
                            };
                        });

                    return {
                        ...header,
                        items: mappedItems,
                        discount_value: totals.discount_value || 0,
                        discount_type: totals.discount_type || "percent",
                        amount: totals.subtotal, // Total for the invoice header
                        amount_payable: totals.grand_total,
                    };
                };
            },

            onPrepareForm: (me, data) => {
                availableItem = (data.services || []).filter(
                    (s) => s.type_id == 2,
                );

                const isReadOnly = me.dataOptions.id > 0;
                me.controls.tenant.disabled = isReadOnly;
                me.setReadOnly(isReadOnly, [
                    "tenant_id",
                    "space_id",
                    "invoice_type",
                ]);

                // me.set;

                me._selectedTenantId = null;
                me._tenantData = null;
                me._tenantSpaces = [];
                me._tenantMonths = [];

                // Clear all inputs
                if (me.controls) {
                    Object.values(me.controls).forEach((el) => {
                        if (
                            el &&
                            (el.tagName === "INPUT" ||
                                el.tagName === "TEXTAREA")
                        ) {
                            el.value = "";
                        }
                    });
                    if (me.controls.space) {
                        me.controls.space.innerHTML =
                            '<option value="">-- Select Room / Space --</option>';
                        me.controls.space.value = "";
                        me.controls.space.dispatchEvent(
                            new Event("change", { bubbles: true }),
                        );
                    }
                }
                if (me.searchTenant) me.searchTenant.reset("");
                if (me.itemsView) me.itemsView.setData([]);

                if (me.dataOptions.id) {
                    vsapi
                        .call(`${main_view.base_url}/prm/tenant/invoice/details`, {
                            id: me.dataOptions.id,
                        })
                        .then((res) => {
                            if (res.status_code !== 200) {
                                cv_interact.error(
                                    "Failed to load invoice details.",
                                );
                                return;
                            }
                            const detail = res.data || {};
                            console.log("invoice detail:", detail);

                            me.controls.due_date.value = detail.due_date;
                            me.controls.issue_date.value = detail.issue_date;
                            me.controls.invoice_type.value =
                                detail.invoice_type || "";
                            if (me.controls.general_remark) {
                                me.controls.general_remark.value =
                                    detail.general_remark || "";
                            }
                            if (me.controls.tenant) {
                                me.controls.tenant.value =
                                    detail.tenant_name || "";
                            }
                            if (detail.tenant_id) {
                                me._selectedTenantId = detail.tenant_id;
                                me.controls.phone_number.value =
                                    detail.tenant_phone || "";
                                me.controls.email.value =
                                    detail.tenant_email || "";

                                vsapi
                                    .post(
                                        `${main_view.base_url}/prm/tenant/option-tenant-with-contract`,
                                        { tenant_id: detail.tenant_id },
                                        {},
                                    )
                                    .then((res) => {
                                        const d = res.data || {};
                                        me._tenantSpaces = d.spaces || [];
                                        me._tenantMonths = d.months || [];
                                        me._requestedServices =
                                            d.service_requests || [];

                                        VSUtil.setComboItems(
                                            me.controls.space,
                                            d.spaces || [],
                                            "space_id",
                                            "space_code",
                                            "",
                                            "Select Space",
                                            "",
                                        );
                                        setTimeout(() => {
                                            if (detail.space_id) {
                                                me.controls.space.value =
                                                    String(detail.space_id);

                                                // âœ… Verify â€” if Choices.js overrides, force via option.selected
                                                if (
                                                    me.controls.space.value !==
                                                    String(detail.space_id)
                                                ) {
                                                    const opt = Array.from(
                                                        me.controls.space
                                                            .options,
                                                    ).find(
                                                        (o) =>
                                                            String(o.value) ===
                                                            String(
                                                                detail.space_id,
                                                            ),
                                                    );
                                                    if (opt) {
                                                        opt.selected = true;
                                                        me.controls.space.dispatchEvent(
                                                            new Event(
                                                                "change",
                                                                {
                                                                    bubbles: true,
                                                                },
                                                            ),
                                                        );
                                                        console.log(
                                                            "space restored via option.selected:",
                                                            opt.text,
                                                        );
                                                    } else {
                                                        console.warn(
                                                            "space option not found for id:",
                                                            detail.space_id,
                                                        );
                                                    }
                                                } else {
                                                    console.log(
                                                        "space restored:",
                                                        me.controls.space.value,
                                                    );
                                                }
                                            }
                                        }, 100);
                                    });
                            }

                            me.itemsView.setData(detail);

                            console.log(
                                "Invoice items loaded into view:",
                                detail.items,
                            );
                        });
                }
            },

            onShow: (me) => {
                const title = me.divModal.querySelector(".modal-title");
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h4 class="text-prm-custom text-start fw-bold">Modify Invoice</h4>'
                        : '<h4 class="text-prm-custom text-start fw-bold">Create Invoice</h4>';
                }
            },

            prepareFormOptions: {
                modifyTitle: "Modify Invoice",
                createTitle: "Create Invoice",
                targetProp: "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/tenant/invoice/form-options`,
                    params: (op) => {
                        console.log("API params op:", op);
                        return { id: op.id };
                    },
                },
            },

            onClose: (me) => {
                if (me.controls && me.controls.space) {
                    me.controls.space.innerHTML =
                        '<option value="">-- Select Room / Space --</option>';
                }
                if (me.searchTenant) me.searchTenant.reset("");
                if (me.itemsView) me.itemsView.setData([]);
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const formData = me.saveData();

                        if (!formData) return;

                        if (!formData.items || formData.items.length === 0) {
                            return cv_interact.error("Add at least one item.");
                        }
                        formData.id = me.dataOptions.id;

                        vsapi
                            .call(
                                `${main_view.base_url}/prm/tenant/invoice/save`,
                                formData,
                                btn,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        formData.id
                                            ? "Invoice has been updated."
                                            : "Invoice has been successfully created.",
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message || "Save failed.",
                                    );
                                }
                            });
                    },
                },
            ],
        });

        dialog.show(op);
    };
    return self;
})();

const ReceiveDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            title: "Receive Payment",
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="container-fluid px-0">
                    <div class="row g-0" style="border-radius:8px;overflow:hidden;margin-bottom:1.5rem;">
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Balance Due</div>
                            <div style="font-size:17px;font-weight:600;color:#5665E1;" id="f_due">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; text-align:center;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Total Paid</div>
                            <div style="font-size:17px;font-weight:600;color:#19BF9B;" id="f_tot">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;text-align:right;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Remaining</div>
                            <div style="font-size:17px;font-weight:600;color:#FAB31C;" id="f_bal">$0.00</div>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;">

                        <!-- Cash -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Cash</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="c_e" style="color:#212529;">â€”</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cash" type="text" class="form-control data-input" data-field="cash" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                            </div>
                        </div>

                        <!-- Bank Transfer -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Bank Transfer</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="b_e" style="color:#212529;">â€”</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="bank_transfer_bank_id" class="form-select data-input" data-field="bank_transfer_bank_id" data-style="material"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="transfer_amount" type="text" class="form-control data-input" data-field="transfer_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="bank_ref_number" type="text" class="form-control data-input" data-field="bank_ref_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Ref Number</label>
                                </div>
                            </div>
                        </div>

                        <!-- Card -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Card</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="ca_e" style="color:#212529;">â€”</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="card_type" class="form-select data-input" data-field="card_type" data-style="material">
                                        <option value="">None</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_amount" type="text" class="form-control data-input" data-field="card_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_number" type="text" class="form-control data-input" data-field="card_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Card Number</label>
                                </div>
                            </div>
                        </div>

                        <!-- Cheque -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Cheque</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="ch_e" style="color:#212529;">â€”</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="cheque_bank_id" class="form-select data-input" data-field="cheque_bank_id" data-style="material"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_amount" type="text" class="form-control data-input" data-field="cheque_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_number" type="text" class="form-control data-input" data-field="cheque_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Cheque Number</label>
                                </div>
                            </div>
                        </div>

                        <!-- Remarks -->
                        <div>
                            <div class="material-input outlined" style="margin:0;">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks" rows="2" style="height:55px;" placeholder=" "></textarea>
                                <label style="padding-left:6px;color:#777777;">Remarks</label>
                            </div>
                        </div>

                    </div>
                </div>`,

            contentCreated: (me) => {
                const updateTotals = () => {
                    const getValue = (name) => {
                        const el = me.divModal.querySelector(
                            `[name="${name}"]`,
                        );
                        return el ? parseFloat(el.value) || 0 : 0;
                    };

                    const fmt = (n) => "$" + Number(n).toFixed(2);

                    const cash = getValue("cash");
                    const bank = getValue("transfer_amount");
                    const card = getValue("card_amount");
                    const cheque = getValue("cheque_amount");

                    const totalPaid = cash + bank + card + cheque;

                    let due = 0;
                    const dueEl = me.divModal.querySelector("#f_due");
                    if (dueEl) {
                        due =
                            parseFloat(
                                dueEl.textContent.replace(/[^0-9.-]+/g, ""),
                            ) || 0;
                    }

                    const remaining = due - totalPaid;

                    // --- Update Summary Header ---
                    me.divModal.querySelector("#f_tot").textContent =
                        fmt(totalPaid);

                    const balEl = me.divModal.querySelector("#f_bal");
                    if (balEl) {
                        if (totalPaid > due + 0.001) {
                            balEl.style.color = "#dc3545";
                            balEl.textContent =
                                "Overpaid: " + fmt(Math.abs(remaining));
                        } else {
                            balEl.style.color =
                                remaining <= 0.001 ? "#3B6D11" : "#FAB31C";
                            balEl.textContent = fmt(Math.max(0, remaining));
                        }
                    }

                    // --- Update Badge Displays ---
                    me.divModal.querySelector("#c_e").textContent =
                        cash > 0 ? fmt(cash) : "â€”";
                    me.divModal.querySelector("#b_e").textContent =
                        bank > 0 ? fmt(bank) : "â€”";
                    me.divModal.querySelector("#ca_e").textContent =
                        card > 0 ? fmt(card) : "â€”";
                    me.divModal.querySelector("#ch_e").textContent =
                        cheque > 0 ? fmt(cheque) : "â€”";

                    // --- REMOVED AUTO REMARKS SYNC LOGIC TO ALLOW MANUAL INPUT ---
                };

                const amountFields = [
                    "cash",
                    "transfer_amount",
                    "card_amount",
                    "cheque_amount",
                ];
                amountFields.forEach((name) => {
                    const input = me.divModal.querySelector(`[name="${name}"]`);
                    if (input) {
                        input.addEventListener("input", updateTotals);
                        input.addEventListener("change", updateTotals);
                    }
                });

                me.convertPayment = (data) => {
                    const parseAmt = (v) =>
                        isNaN(parseFloat(v)) ? 0 : parseFloat(v);
                    const breakdowns = [];

                    if (parseAmt(data.cash) > 0) {
                        breakdowns.push({
                            method: "Cash",
                            amount: parseAmt(data.cash),
                            currency_code: "USD",
                        });
                    }
                    if (parseAmt(data.transfer_amount) > 0) {
                        breakdowns.push({
                            method: "Bank",
                            amount: parseAmt(data.transfer_amount),
                            currency_code: "USD",
                            bank_id:
                                parseInt(data.bank_transfer_bank_id) || null,
                            bank_name: me.getSelectText
                                ? me.getSelectText("bank_transfer_bank_id")
                                : null,
                            bank_ref_number: data.bank_ref_number || null,
                        });
                    }
                    if (parseAmt(data.card_amount) > 0) {
                        breakdowns.push({
                            method: "Card",
                            amount: parseAmt(data.card_amount),
                            currency_code: "USD",
                            card_type: data.card_type || null,
                            card_number: data.card_number || null,
                        });
                    }
                    if (parseAmt(data.cheque_amount) > 0) {
                        breakdowns.push({
                            method: "Cheque",
                            amount: parseAmt(data.cheque_amount),
                            currency_code: "USD",
                            bank_id: parseInt(data.cheque_bank_id) || null,
                            cheque_bank_name: me.getSelectText
                                ? me.getSelectText("cheque_bank_id")
                                : null,
                            cheque_number: data.cheque_number || null,
                        });
                    }
                    return {
                        invoice_id: me.dataOptions?.invoice_id || null,
                        remarks: (data.remarks || "").trim(), // Correctly picks up manual entry
                        pmt_breakdowns: breakdowns,
                    };
                };

                applyNumberInput(me.controls.cash);
                applyNumberInput(me.controls.cheque_amount);
                applyNumberInput(me.controls.card_amount);
                applyNumberInput(me.controls.transfer_amount);
            },

            onPrepareForm: (me) => {
                const opts = me.dataOptions || {};
                if (opts.invoice_id) {
                    vsapi
                        .call(`${main_view.base_url}/prm/tenant/invoice/details`, {
                            id: opts.invoice_id,
                        })
                        .then((res) => {
                            if (res.status_code === 200) {
                                const d = res.data || {};
                                const bal = Number(d.balance || 0).toFixed(2);
                                const set = (id, val) => {
                                    const el = me.divModal.querySelector(
                                        "#" + id,
                                    );
                                    if (el) el.textContent = val;
                                };
                                set("f_due", "$" + bal);
                                set("f_bal", "$" + bal);
                                set("f_tot", "$0.00");
                            }
                        });
                }

                vsapi
                    .call(`${main_view.base_url}/prm/tenant/invoice/form-options`)
                    .then((res) => {
                        const banks = res?.data?.banks || [];
                        if (me.controls.bank_transfer_bank_id) {
                            VSUtil.setComboItems(
                                me.controls.bank_transfer_bank_id,
                                banks,
                                "id",
                                "name",
                                true,
                                "â€” Select Bank â€”",
                            );
                        }
                        if (me.controls.cheque_bank_id) {
                            VSUtil.setComboItems(
                                me.controls.cheque_bank_id,
                                banks,
                                "id",
                                "name",
                                true,
                                "â€” Select Bank â€”",
                            );
                        }
                    });
            },

            buttons: [
                {
                    label: "Cancel",
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false),
                },
                {
                    label: "Receive",
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const rawData = me.getData();
                        const payload = me.convertPayment(rawData);
                        const totalInput = payload.pmt_breakdowns.reduce(
                            (sum, item) => sum + item.amount,
                            0,
                        );

                        if (totalInput <= 0) {
                            return cv_interact.error(
                                "Please enter a payment amount.",
                            );
                        }

                        vsapi
                            .call(
                                `${main_view.base_url}/prm/tenant/invoice/receive`,
                                payload,
                                btn,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        "Payment Received Successfully.",
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message || "Save failed.",
                                    );
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                                cv_interact.error("Network error occurred.");
                            });
                    },
                },
            ],
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var ReservationComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Booking Amenity";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_reservation_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnReservation");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_reservation");
    mThis.elFilter_status = mThis.self.querySelector("#_reservation_status");
    mThis.elAmenity = mThis.self.querySelector("#amenity_id");
    mThis.elBookingDate = mThis.self.querySelector("#booking_date");
    mThis.elSearch = mThis.self.querySelector("#_search_reservation");
    mThis.elBookingDateTo = mThis.self.querySelector("booking_date_to");
    mThis.autoRefreshMs = 60000;
    mThis.autoRefreshTimer = null;
    mThis.autoRefreshStartTimeout = null;

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        // {
        //     transTitle: "titles.Tenant",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="text-primary-custom text-capitalize">${data.tenant_name ?? "_"}</span>
        //                 <span class="d-block text-primary"style="font-size:12px;">${data.phone_number ?? "_"}</span>`;
        //     },
        // },
        {
            transTitle: "titles.Amenity",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom text-capitalize">${data.amenity_name ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.booking_date ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Time",
            className: "align-middle",
            data: (data) => {
                const to12h = (hhmm) => {
                    if (!hhmm) return "";
                    const [h, m] = String(hhmm).trim().split(":").map(Number);
                    const hour = isNaN(h) ? 0 : h % 24;
                    const min = isNaN(m) ? 0 : m;
                    const ampm = hour < 12 ? "AM" : "PM";
                    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                    return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
                };
                const start12 = to12h((data.start_time ?? "").substring(0, 5));
                const end12 = to12h((data.end_time ?? "").substring(0, 5));
                return `<span class="d-block">${start12} - ${end12}</span>`;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:250px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "_"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.status ?? "").toLowerCase();
                let cls =
                    "badge border border-secondary text-secondary bg-secondary-subtle";
                let label = "Upcoming";
                if (status === "upcoming") {
                    cls = "badge border border-info text-info bg-info-subtle";
                    label = "Upcoming";
                } else if (status === "in-progress") {
                    cls =
                        "badge border border-warning text-warning bg-warning-subtle";
                    label = "In-Progress";
                } else if (status === "completed") {
                    cls =
                        "badge border border-success text-success bg-success-subtle";
                    label = "Completed";
                } else if (status === "cancelled") {
                    cls =
                        "badge border border-danger text-danger bg-danger-subtle";
                    label = "Cancelled";
                }
                return `
                    <span class="${cls} px-3 d-inline-flex align-items-center" style="min-width:90px">
                        ${label}
                    </span>
                `;
            },
        },
        // {
        //     transTitle: "titles.Last Updated",
        //     className: "align-middle",
        //     data: (data, index, tr) => {
        //         return `<div class="d-flex flex-column">
        //                     <span class="text-muted">${data.updated_at ?? ""}</span>
        //                 </div>`;
        //     },
        //     <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
        // },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => {
                // console.log(444, data.status_id);

                if (data.status_id == 2) return "";
                return `<div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_reservation_action" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                       <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        if (mThis.elBookingDateTo && !mThis.elBookingDateTo.value) {
            const today = new Date().toISOString().split("T")[0];
            mThis.elBookingDateTo.value = today;
        }

        mThis.ReservationListView = new ListView("_reservation_list", {
            fetchApi: `${main_view.base_url}/prm/tenant/reservation/list-paginate`,
            perPage: 8,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("reservation");
                tr.setAttribute("id", `reservation_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ReservationListView.showPage(mThis.getFilterData());
                },
            };
            // if (!AuthManager.allowed(240)) return;
            CreateReservationDialog.show(op);
        };

        mThis.pr_tbl = mThis.ReservationListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        mThis.tblReservation = mThis.ReservationListView.getTable();

        mThis.initDropdownMenus(mThis.tblReservation);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ReservationListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
            // building_id: mThis.elBuilding.value,
            // floor_id: mThis.elFloor.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.isActiveView = () =>
        !!(mThis.self && mThis.self.offsetParent !== null);
    mThis.refreshListIfActive = () => {
        if (!mThis.initAlready || !mThis.isActiveView()) return;
        mThis.ReservationListView.showPage(mThis.getFilterData());
    };

    mThis.startAutoRefresh = () => {
        clearInterval(mThis.autoRefreshTimer);
        clearTimeout(mThis.autoRefreshStartTimeout);
        const now = Date.now();
        const msToNextMinute = 60000 - (now % 60000);
        mThis.autoRefreshStartTimeout = setTimeout(() => {
            mThis.refreshListIfActive();
            mThis.autoRefreshTimer = setInterval(() => {
                mThis.refreshListIfActive();
            }, mThis.autoRefreshMs);
        }, msToNextMinute);
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_reservation_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_reservation",
                },
                {
                    html: '<span class="ps-2">Cancel</span>',
                    icon: `<i class="fa-solid fa-square-xmark fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "cancel_reservation",
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_reservation",
                },
            ],

            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = parseInt(container.dataset.statusid);

                menu.edit_reservation.style.display = "none";
                menu.cancel_reservation.style.display = "none";
                menu.delete_reservation.style.display = "none";

                if (status_id === 1) {
                    menu.cancel_reservation.style.display = "block";
                    menu.edit_reservation.style.display = "block";
                } else if (status_id === 3 || status_id === 4) {
                    menu.delete_reservation.style.display = "block";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_reservation": {
                        mThis.editReservation(id, menuLink);
                        break;
                    }
                    case "cancel_reservation": {
                        mThis.cancelReservation(id, menuLink);
                        break;
                    }
                    case "delete_reservation": {
                        mThis.deleteReservation(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editReservation = (id, menulink) => {
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ReservationListView.showPage(mThis.getFilterData());
            },
        };
        CreateReservationDialog.show(op);
    };

    mThis.cancelReservation = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Cancel this reservation ?",
            {
                transTitle: "Cancel Reservation",
                context: "delete",
                confirmButtonText: "Cancel",
            },
            (confirmed) => {
                if (!confirmed) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/reservation/cancel`,
                        { id: id },
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Reservation cancelled.");
                            mThis.ReservationListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Cancel failed",
                            );
                        }
                    });
            },
        );
    };

    mThis.deleteReservation = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this reservation?",
            {
                transTitle: "Delete Reservation",
                context: "delete",
                confirmButtonText: "Delete",
            },
            (e) => {
                if (!e) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/reservation/delete`,
                        { id: id },
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success("Reservation deleted.");
                            mThis.ReservationListView.showPage(
                                mThis.getFilterData(),
                            );
                        } else {
                            cv_interact.error(
                                res.error_message || "Delete failed",
                            );
                        }
                    });
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/reservation/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.reservation_statuses,
                    "id",
                    "reservation_status",
                    "",
                    "All Statuses",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ReservationListView.showPage(mThis.getFilterData());
            mThis.startAutoRefresh();
        });
    };
    return mThis;
})();

const CreateReservationDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                            <!-- <input type="hidden" class="data-input" data-field="tenant_id"> -->
                            <!-- <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="tenant" class="data-input form-control" data-field="tenant_name" placeholder="Tenant" autocomplete="off">
                                    <label>Tenant</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" disabled placeholder=" "></input>
                                    <label>Phone Number</label>
                                </div>
                            </div> -->
                            <div class="col-6">
                                <select data-style="material" name="amenity" class="data-input form-control" data-field="amenity_id" placeholder="Amenity">
                                </select>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" class="data-input form-control" data-field="amenity_code" placeholder=" " disabled />
                                    <label>Amenity Code</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="booking_date" required class="data-input form-control form_input" data-field="booking_date" />
                                    <label>Booking Date</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input type="time" name="start_time" class="data-input form-control form_input" data-field="start_time" placeholder=" " />
                                    <label>Check-in Time</label>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="vs-material-field">
                                    <input type="time" name="end_time" required class="data-input form-control form_input" data-field="end_time" placeholder=" " />
                                    <label>Check-out Time</label>
                                </div>
                            </div>

                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label>Remark</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    // me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    //     type: "select",
                    //     prefetch: true,
                    //     query: {
                    //         from: "tenants",
                    //         select: ["id", "name", "phone_number"],
                    //         where: [["status_id", "=", 2]],
                    //         orderBy: [["id", "DESC"]],
                    //         limit: 50,
                    //         searchFields: {
                    //             name: "LIKE",
                    //             phone_number: "LIKE",
                    //         },
                    //     },
                    //     showColumnHeader: true,
                    //     columns: {
                    //         name: "Name",
                    //         phone_number: "Phone",
                    //     },
                    //     onSelect: (tenant) => {
                    //         me._selectedTenantId = tenant.id;

                    //         // Direct mapping from the search result
                    //         if (me.controls.phone_number) {
                    //             me.controls.phone_number.value =
                    //                 tenant.phone_number || "";
                    //         }
                    //     },
                    // });
                    // me.searchTenant.reset("");
                },

                configSelect: [
                    {
                        name: "amenity_id",
                        data: "amenities",
                        textField: "amenity",
                        valueField: "id",
                    },

                    {
                        name: "reservation_statuses",
                        data: "reservation_statuses",
                        textField: "reservation_status",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Create Reservation",
                    modifyTitle: "Modify Reservation",
                    targetProp: "reservation_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/reservation/form-options",
                        ].join(""),
                        params: (op) => {
                            return {
                                id: op.id,
                                tenant_id: op.tenant_id ?? null,
                            };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    const details = data?.reservation_details || {};
                    const amenitySelect = me.divModal.querySelector(
                        '[data-field="amenity_id"]',
                    );
                    const applyAmenityData = (amenityId) => {
                        const amenities = Array.isArray(data?.amenities)
                            ? data.amenities
                            : [];
                        const selected = amenities.find(
                            (item) => String(item.id) === String(amenityId),
                        );
                        const codeInput = me.divModal.querySelector(
                            '[data-field="amenity_code"]',
                        );
                        if (codeInput)
                            codeInput.value = selected?.amenity_code ?? "";
                    };
                    if (
                        me.searchTenant &&
                        typeof me.searchTenant.reset === "function"
                    ) {
                        me.searchTenant.reset();
                    }

                    amenitySelect.onchange = (e) =>
                        applyAmenityData(e.target.value);
                    if (me.dataOptions.id > 0) {
                        // console.log(1221, data);
                        me.controls.tenant_id.value = details.tenant_id;
                        setTimeout(() => {
                            if (details.amenity_id) {
                                amenitySelect.value = details.amenity_id;
                                applyAmenityData(details.amenity_id);
                            }
                            // $(amenitySelect).trigger("change");
                        }, 500);
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                            me._selectedTenantId = null;
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            // op.id = me.dataOptions.id;
                            // if (
                            //     me._selectedTenantId != null &&
                            //     me._selectedTenantId !== undefined
                            // ) {
                            //     op.tenant_id = me._selectedTenantId;
                            // }

                            // op.tenant_id = me._selectedTenantId;
                            // op.id = me.dataOptions.id;
                            console.log(123, op);

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/prm/tenant/reservation/save",
                                    ].join(""),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        // me._selectedTenantId = null;
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Reservation has been updated successfully.",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New reservation has been added successfully.",
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };
    return self;
})();

"use strict";

var TenantProfileComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Tenant Management";
    this.defaultPage = "profile_view";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_tenant_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.btnDocument = mThis.self.querySelector("#_btnDocument");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant_");
    mThis.elStatus = mThis.self.querySelector("#_el_tenant_status");
    mThis.btnBack = document.querySelector("#_btn_back_tenant");
    mThis.divTenantListContainer = mThis.self.querySelector(
        "#_tenant_list_container",
    );
    mThis.divProfileView = document.querySelector("#_ten_profile_view");
    mThis.cardViewContainer = mThis.self.querySelector("#_tenant_card_view");
    mThis.listViewContainer = mThis.self.querySelector("#_tenant_list_view");
    mThis.currentViewMode = "card";
    mThis.paginationContainer = mThis.self.querySelector(
        "#tenant_card_container_pagination",
    );
    this.pages = {
        tenant_list: this.divTenantListContainer,
        profile_view: this.divProfileView,
    };
    mThis.profile_info_tenant = this.divProfileView.querySelector(
        "#profile_info_tenant",
    );

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.tenantCardView = new ListView(mThis.cardViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            renderItems: (items, container) => {
                mThis.renderTenantCard(container, items);
            },
            listContainerClass: null,
        });
        mThis.tenantListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase text-nowrap",
            rowCreated: (data, index, tr) => {
                // console.log(9090,tr);

                // tr.dataset.id = data.id;
                // tr.dataset.statusid = data.status_id;
                // mThis.initDropdownMenus(tr);
                if (data.id !== 1) {
                    tr.style.display = "none"; // hide rows that don't match
                }
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                mThis.initDropdownMenus(tr);
            },
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.renderView();
                    mThis.tenantListView.showPage(mThis.getFilterData());
                },
            };
            CreateTenantDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("tenant_list", mThis.getFilterData());
        };
        const cardTab = document.getElementById("tenantViewCard");
        const listTab = document.getElementById("tenantViewList");
        if (cardTab && listTab) {
            cardTab.addEventListener("change", () => {
                mThis.currentViewMode = "card";
                mThis.renderView();
            });

            listTab.addEventListener("change", () => {
                mThis.currentViewMode = "list";
                mThis.renderView();
            });
        }
        mThis.pr_tbl = mThis.tenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        };
        mThis.tblTenant = mThis.tenantListView.getTable();

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.renderView();
            };
        });
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.renderView();
            }, 250);
        };

        mThis.initDropdownMenus(mThis.cardViewContainer);
        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = (listContainer) => {
        const menuOptions = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2">View Details</span>',
                    icon: `<i class="fa-solid fa-user fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_profile",
                },
                {
                    html: '<span class="ps-2">Modify Tenant</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_tenant",
                },
                {
                    html: '<span class="ps-2">Delete Tenant</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant",
                },
                {
                    html: '<span class="ps-2">Upload Document</span>',
                    icon: `<i class="fa-solid fa-file-upload fs-5 text-muted"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "upload_document",
                },
                {
                    html: '<span class="ps-2">Create Contract</span>',
                    icon: `<i class="fa-solid fa-file-contract fs-5 text-success"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "create_contract",
                },
                {
                    html: '<span class="ps-2">Service Requests</span>',
                    icon: `<i class="fa-solid fa-screwdriver-wrench fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "service_request",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                // console.log(123456, status_id);

                // menu.edit_student.style.display = enroll_finalized == 1 ? 'none' : 'block';
                menu.create_contract.style.display =
                    Number(status_id) !== 2 ? "block" : "none";
                menu.service_request.style.display = "none";
                // menu.upload_document.style.display =status_id == 1 || status_id == 2  ? "block" : "none";
            },
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_profile": {
                        mThis.showPage("profile_view", { tenant_id: id });
                        break;
                    }
                    case "create_contract": {
                        mThis.createContract(id, menuLink);
                        break;
                    }
                    case "upload_document": {
                        mThis.uploadDocument(id, menuLink);
                        break;
                    }
                    case "modify_document": {
                        mThis.modifyDocument(id, menuLink);
                        break;
                    }
                    case "modify_tenant": {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case "delete_tenant": {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    case "service_request": {
                        mThis.serviceRequest(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };
    mThis.editTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateTenantDialog.show(op);
    };
    mThis.serviceRequest = (id, menuLink) => {
        let op = {
            id: null, // id
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        CreateServiceRequestDialog.show(op);
    };
    mThis.createContract = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        ContractDialog.show(op);
    };
    mThis.uploadDocument = (id, menuLink) => {
        let op = {
            id: null,
            tenant_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // console.log(111, op);

        TenantDocumentDialog.show(op);
    };
    mThis.modifyDocument = (id, menuLink) => {
        onClose: (() => {
            mThis.renderView();
        },
            // mThis.showPage("profile_view", { tenant_id: id });
            TenantDocumentDialog.show(op));
    };
    mThis.renewContract = (id, menuLink) => {
        let op = {
            id: null,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // renewDialog.show(op);
        // alert("coming soon!");
    };
    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            },
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Tenant?",
            {
                title: "Delete Tenant",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/tenant/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                mThis.renderView();
                                cv_interact.success("Tenant has been deleted.");
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.renderTenantCard = (div, data) => {
        data = data ?? [];
        // if (!AuthManager) {
        //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
        //     return;
        // }
        AuthManager.init().then((user) => {
            mThis.renderCard(div, data);
        });
    };
    mThis.renderCard = (container, data) => {
        // console.log(8888, data);
        container.innerHTML = "";
        let html = `<div class="row g-3">`;
        if (Array.isArray(data) && data.length > 0) {
            data.forEach((d) => {
                /** Backend: status_id 2 means tenant has a currently active contract. */
                const hasContractAlready = Number(d.status_id) === 2;
                const currentUnitCode =
                    hasContractAlready && d.space_code ? d.space_code : "Unit";
                const status = (d.status || "Pending").toLowerCase();
                let statusClass = "";
                switch (status) {
                    case "active":
                        statusClass =
                            "badge text-success bg-success-subtle border border-success";

                        break;
                    case "inactive":
                        statusClass =
                            "badge text-danger bg-danger-subtle border border-danger";

                        break;
                    default:
                        statusClass =
                            "badge text-warning bg-warning-subtle border border-warning";

                        break;
                }
                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:80px;height:80px;">
                                            <img src="${d.image_url || main_view.asset_url + "/images/default/placeholder.svg"}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
                                        </div>
                                        <div class="flex items-start justify-between mb-6">
                                            <span class="fw-semibold text-start mb-1 text-dark text-capitalize">${d.name}</span>
                                            <div class="d-flex align-items-center mt-1 gap-2">
                                                    <span class="${statusClass}" style="min-width:70px; text-transform: capitalize;">${status}</span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0"> <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" data-statusid="${d.status_id}" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body text-center" style="background-color:#fbfcfd; padding: 1rem;">
                                <div class="row g-4 py-2 border-bottom border-gray">
                                    <div class="col-5">
                                        <div class="card bg-prm-custom text-center shadow-sm">
                                                <div class="fs-6 py-1 text-gold-custom">${currentUnitCode}</div>
                                        </div>
                                    </div>
                                    <div class="col-1"></div>
                                    <div class="col-6">
                                        ${
                                            hasContractAlready
                                                ? `
                                                <div class="d-flex flex-column text-center gap-1">
                                                    <span class="text-prm-custom fw-semibold">
                                                        Lease Expiry
                                                    </span>
                                                    <small class="text-muted">
                                                        ${d.end_date || d.start_date || "â€”"}
                                                    </small>
                                                </div>
                                            `
                                                : `
                                                <div class="text-end">
                                                    <a href="javascript:void(0)"
                                                    class="create-tenant-contract fw-semibold"
                                                    data-id="${d.id}" data-name="${d.name}">
                                                        <span class="tool-tip">
                                                            <i class="fa-solid fa-file-circle-plus text-prm-custom fs-6"></i>
                                                            <span class="tool-tiptext fs-6">Create Contract</span>
                                                        </span>
                                                    </a>
                                                </div>
                                            `
                                        }

                                    </div>
                                </div>
                                <div class="card_container" style="max-width: 250px;">
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-hashtag me-2 text-muted"></i>
                                        <span>${d.code ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-regular fa-calendar me-2 text-muted"></i>
                                        <span>${d.date_of_birth ?? "_"}</span>
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-phone me-2 text-muted"></i>
                                        ${d.phone_number || ""}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-at me-2 text-muted"></i>
                                        ${d.email || "_"}
                                    </p>


                                </div>
                            </div>
                                <div class="d-flex justify-content-between rounded-bottom-2 align-items-center px-2 py-2"
                                    style="font-size: 1rem; background-color: #d4d4db; border-top: 1px solid #e2e8f0;">

                                    <span style="color: #64748b; font-size: 0.85rem;">
                                        Last Updated :  ${d.update_user || "System"}
                                    </span>

                                    <a href="javascript:void(0)"
                                    class="text-primary-custom see-tenant-detail  text-decoration-none" style="font-size: 0.85rem;"
                                    data-id="${d.id}">
                                        View Details <i class="fa-solid fa-arrow-right ms-1" style="font-size: 0.85rem;"></i>
                                    </a>
                                </div>

                        </div>
                    </div>
                    `;
            });
        } else {
            html += `
            <div class="col-12">
                <div class="text-center py-5 text-muted">
                    No tenants found
                </div>
            </div>`;
        }
        html += `</div>`;
        container.innerHTML = html;
        const seeProfileInfo =
            mThis.cardViewContainer.querySelectorAll(".see-tenant-detail");
        seeProfileInfo.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                mThis.showPage("profile_view", tenantId);
                //const employeeData = data.find((emp) => emp.id == employeeId);
                // if (employeeData) {
                //     let sub_content = mThis.self.querySelector("#sub_content");
                //     sub_content.classList.add("d-none");
                //     let view_see_info =
                //         mThis.self.querySelector("#view_see_info__");
                //     view_see_info.classList.remove("d-none");

                //     mThis.renderProfile(employeeData);
                //     mThis.renderCardCenter(employeeId);
                //     mThis.renderCardLeft(employeeId);
                //     mThis.renderCardRight(employeeId);
                //     mThis.renderCardTaxAllowance(employeeId);
                //     mThis.renderEmpDocuments(employeeId);
                // } else {
                //     console.error(
                //         "Employee data not found for ID:",
                //         employeeId
                //     );
                // }
            });
        });

        const createContract = mThis.cardViewContainer.querySelectorAll(
            ".create-tenant-contract",
        );
        createContract.forEach((link) => {
            link.addEventListener("click", (e) => {
                const tenantId = e.currentTarget.dataset.id;
                mThis.tenant_id = tenantId;
                const op = {
                    id: null,
                    tenant_id: tenantId,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.renderView();
                    },
                };
                ContractDialog.show(op);
            });
        });
        const container_te = mThis.cardViewContainer;
        const te_parent = container_te;
        te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        te_parent.classList.add("overflow-y-auto");
        te_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            te_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };
    };

    mThis.renderView = () => {
        const params = mThis.getFilterData();

        if (mThis.currentViewMode === "card") {
            mThis.cardViewContainer.classList.remove("d-none");
            mThis.listViewContainer.classList.add("d-none");
            mThis.paginationContainer.style.display = "block";
            mThis.tenantCardView.showPage(params);
        } else {
            mThis.cardViewContainer.classList.add("d-none");
            mThis.listViewContainer.classList.remove("d-none");
            mThis.paginationContainer.style.display = "none";
            mThis.tenantListView.showPage(params);
        }
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            // id: 1,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });

        return p;
    };
    mThis.getPageContainer = (pageName) => {
        return mThis.pages[pageName];
    };
    mThis.openTenantDocument = async (id, mode = "view") => {
        const res = await vsapi.call(
            [main_view.base_url, "/prm/tenant/document/download"].join(""),
            { id },
            false,
            null,
        );
        if (res.status_code !== 200) {
            cv_interact.error(res.error_message || "Failed to open document.");
            return;
        }
        const { data_url, file_name } = res.data || {};
        if (!data_url) {
            cv_interact.error("Document URL is missing.");
            return;
        }
        if (mode === "download") {
            const a = document.createElement("a");
            a.href = data_url;
            a.download = file_name || "document";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            return;
        }

        const extFromName = (file_name || "").split(".").pop();
        const ext = String(
            (res.data && res.data.ext) || extFromName || "",
        ).toLowerCase();

        const overlay = document.createElement("div");
        overlay.style.cssText =
            "position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:pointer;";

        const wrapper = document.createElement("div");
        wrapper.style.cssText =
            "position:relative; max-width:90vw; max-height:90vh;";

        const isImage = ["png", "jpg", "jpeg"].includes(ext);
        const isPdf = ext === "pdf";

        if (isImage) {
            const img = document.createElement("img");
            img.src = data_url;
            img.style.cssText =
                "max-width:100%; max-height:90vh; border-radius:8px; box-shadow:0 4px 32px #000;";
            wrapper.appendChild(img);
        } else if (isPdf) {
            const iframe = document.createElement("iframe");
            iframe.src = data_url;
            iframe.style.cssText =
                "width:80vw; height:85vh; border:none; border-radius:8px;";
            wrapper.appendChild(iframe);
        } else {
            window.open(data_url, "_blank");
            return;
        }

        const btnClose = document.createElement("button");
        btnClose.style.cssText =
            "position:absolute; top:-16px; right:-16px; border:none; background:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer; line-height:1;";
        btnClose.innerHTML = "&times;";
        btnClose.onclick = (e) => {
            e.stopPropagation();
            document.body.removeChild(overlay);
        };

        wrapper.appendChild(btnClose);
        overlay.appendChild(wrapper);
        overlay.onclick = () => document.body.removeChild(overlay);
        document.body.appendChild(overlay);
    };
    mThis.showPage = async (pageName, op = {}) => {
        if (this.self.style.display !== "block") {
            main_view.setContentView(this.self, this.title_prop);
        }
        switch (pageName) {
            case "tenant_list": {
                mThis.currentPage = "tenant_list";
                mThis.renderView();
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                );
                // const data = res.data || {};
                // mThis.renderProfile(data);
                // break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const tenant_id = op.tenant_id || op.id || op;
                const p = { id: tenant_id };
                const res = await vsapi.call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                );
                const data = res.data || {};
                mThis.renderProfile(data);
                break;
            }

            default: {
                return;
            }
        }
        const targetPage = mThis.getPageContainer(pageName);
        const siblings = Array.from(targetPage.parentElement.children);
        // Hide all siblings smoothly
        siblings.forEach((div) => {
            if (div !== targetPage && div.style.display !== "none") {
                div.style.display = "none";
            }
        });
        targetPage.style.display = "block";
    };
    mThis.renderProfile = (data) => {
        // console.log(123, data);

        let cls_class = "";
        if (data && data.status) {
            switch (data.status) {
                case "Pending":
                    cls_class =
                        "badge text-warning bg-warning-subtle border border-warning";
                    break;
                case "Active":
                    cls_class =
                        "badge text-success bg-success-subtle border border-success";
                    break;
                case "Inactive":
                    cls_class =
                        "badge text-danger bg-danger-subtle border border-danger";
                    break;
                default:
                    cls_class = "badge text-muted bg-light";
                    break;
            }
        }
        let html = `
        <div class="row g-4 d-flex align-items-stretch"> <div class="col-12 col-lg-3">
                <div class="card shadow-sm mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column">
                        <div class="position-relative d-inline-block mb-3">
                            <img src="${data.image_url || `${main_view.base_url}/assets/images/default/placeholder.svg`}"
                                class="rounded-circle border shadow-sm"
                                width="140" height="140"
                                style="object-fit: cover; object-position: center;">
                        </div>
                        <h4 class="fw-bold mb-2 text-capitalize">${data.name}</h4>
                        <div class="mb-3">
                            <span class="${cls_class} px-3 py-2">${data.status}</span>
                        </div>
                        <hr class="my-3">

                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-9">
                <div class="card shadow-sm h-100"> 
                    
                    <div class="card-body tab-content">
                        <div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="text-capitalize">${data.name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Gender</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class=" text-primary">${data.phone_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    `;

        mThis.profile_info_tenant.innerHTML = html;

        // ===== Tabs JS =====
        const tabLinks =
            mThis.profile_info_tenant.querySelectorAll("#tenantTabs a");
        const tabPanes =
            mThis.profile_info_tenant.querySelectorAll(".tab-pane");

        tabLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const target = link.getAttribute("href").replace("#", "");

                // remove active class
                tabLinks.forEach((l) => l.classList.remove("active"));
                tabPanes.forEach((p) => p.classList.remove("active"));

                link.classList.add("active");
                const profile_info_tenant =
                    mThis.profile_info_tenant.querySelector(`#${target}`);
                profile_info_tenant.classList.add("active");
                mThis.renderOverView(profile_info_tenant, target, data);
            });
        });

        mThis.setActionsProfileInfo(mThis.profile_info_tenant);
    };
    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };
    mThis._fmtMoney = (n) => {
        if (n == null || n === "") return "â€”";
        const x = Number(n);
        if (Number.isNaN(x)) return String(n);
        return x.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });
    };
    mThis._getUnitCode = (row, fallback = "â€”") => {
        if (!row) return fallback;
        const value =
            row.unit_code ??
            row.space_code ??
            row.unit ??
            row.code ??
            row.unit_number;
        return value == null || value === "" ? fallback : value;
    };
    mThis._leaseHistoryContractsHtml = (renewalEntriesRaw) => {
        const entries = Array.isArray(renewalEntriesRaw)
            ? renewalEntriesRaw
            : [];
        if (!entries.length) {
            return `<div class="text-center py-5 text-muted">
                <i class="fa fa-file-text fa-2x mb-2 opacity-50 d-block"></i>
                <p class="mb-0">No contract recorded for this tenant.</p>
            </div>`;
        }

        // Group by contract_id so we render one card per contract.
        const groupsByContractId = new Map();
        entries.forEach((e) => {
            const cid = e.contract_id ?? "0";
            if (!groupsByContractId.has(cid)) groupsByContractId.set(cid, []);
            groupsByContractId.get(cid).push(e);
        });

        let cards = "";
        groupsByContractId.forEach((group) => {
            if (!group.length) return;
            const first = group[0];

            const contractStatusName = String(
                first.contract_status ?? "",
            ).trim();
            const contractStatusLower = contractStatusName.toLowerCase();

            // const hasCurrent = group.some((r) => !!r.is_current);

            let accent = "#adb5bd";
            let circleBg = "#6c757d";
            let headerBadgeHtml = "";
            let priceColor = "#212529";
            let depositBadgeStyle =
                "color:#3f51d8;background-color:#e7efff;border:1px solid #cfdbff;";

            if (contractStatusLower === "active") {
                accent = "#0f49bd";
                circleBg = "#0f49bd";
                priceColor = "#3f51d8";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">CURRENT</span>`;
            } else if (contractStatusLower === "pending") {
                accent = "#fd7e14";
                circleBg = "#fd7e14";
                priceColor = "#fd7e14";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#fd7e14;">PENDING</span>`;
            } else if (contractStatusLower === "terminated") {
                accent = "#dc3545";
                circleBg = "#dc3545";
                priceColor = "#dc3545";

                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#dc3545;">TERMINATED</span>`;
            } else {
                headerBadgeHtml = `<span class="badge text-uppercase rounded-4 ms-1" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${mThis._escapeHtml(contractStatusName || "â€”")}</span>`;
            }

            const start = mThis._escapeHtml(first.contract_start_date ?? "");
            const end = mThis._escapeHtml(first.contract_end_date ?? "");
            const title = `Contract: ${start} â€” ${end}`;

            const unitPart = mThis._escapeHtml(mThis._getUnitCode(first, "â€”"));
            const sqmPart =
                first.sqm_size != null && first.sqm_size !== ""
                    ? `${mThis._fmtMoney(first.sqm_size)} mÂ²`
                    : "â€”";
            const bldg = first.building_name
                ? mThis._escapeHtml(first.building_name)
                : "";
            const detailPillsHtml = `
                <div class="d-flex flex-wrap gap-2 mt-2">
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">Unit ${unitPart}</span>
                    <span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${sqmPart}</span>
                    ${bldg ? `<span class="badge rounded-pill fw-normal px-3 py-2" style="color:#4a4a4a;background-color:#f6f4ee;border:1px solid #e5dfd1;">${bldg}</span>` : ""}
                </div>`;

            const priceNum = Number(first.price ?? 0);
            const sqmNum = Number(first.space_sqm_size ?? first.sqm_size ?? 0);
            const isTotalPriceType =
                String(first.price_type ?? "sqm").toLowerCase() === "total";
            const totalPriceNum = isTotalPriceType
                ? priceNum
                : sqmNum > 0
                  ? priceNum * sqmNum
                  : null;
            const priceLine =
                totalPriceNum != null && !Number.isNaN(totalPriceNum)
                    ? `${VSMoney.formatAmount(totalPriceNum, "USD")}`
                    : "â€”";
            const depositSmallHtml =
                first.deposit != null && first.deposit !== ""
                    ? `Deposit ${VSMoney.formatAmount(first.deposit, "USD")}`
                    : "";
            if (first.deposit_remarks) {
                depositSmallHtml = dep
                    ? `${depositSmallHtml} <span class="text-muted">â€¢ ${mThis._escapeHtml(first.deposit_remarks)}</span>`
                    : `<span class="text-muted">${mThis._escapeHtml(first.deposit_remarks)}</span>`;
            }
            const depositBadgeHtml = depositSmallHtml
                ? `<span class="badge rounded-2 px-3 py-2" style="${depositBadgeStyle}">${depositSmallHtml}</span>`
                : "";

            const renewalsTableRowsHtml = group
                .map((r) => {
                    const isInitial = !!r.is_initial;
                    const renewalDate = r.renewal_date
                        ? mThis._escapeHtml(r.renewal_date)
                        : isInitial
                          ? "Initial"
                          : "â€”";

                    const rowStart = mThis._escapeHtml(
                        r.renewal_start_date ?? "â€”",
                    );
                    const rowEnd = mThis._escapeHtml(r.renewal_end_date ?? "â€”");

                    const rowUnitCode = mThis._escapeHtml(
                        mThis._getUnitCode(first, "â€”"),
                    );
                    const currentBadgeHtml = r.is_current
                        ? `<span class="badge text-uppercase rounded-4 text-white ms-1" style="background-color:#0f49bd;">Current</span>`
                        : "";

                    const remarks =
                        r.remarks != null && r.remarks !== ""
                            ? mThis._escapeHtml(r.remarks)
                            : "â€”";

                    const updatedBy = r.update_user
                        ? `${mThis._escapeHtml(r.update_user)}${r.updated_at ? ` â€¢ ${mThis._escapeHtml(r.updated_at)}` : ""}`
                        : "â€”";

                    return `<tr class="${r.is_current ? "table-prm-current-row" : ""}">
                        <td class="text-nowrap">${renewalDate}</td>
                        <td class="text-nowrap">${rowStart}</td>
                        <td class="text-nowrap">${rowEnd}</td>
                        <td class="text-nowrap">
                            <span class="fw-semibold text-prm-custom">${rowUnitCode}</span>
                            ${currentBadgeHtml}
                        </td>
                        <td>${remarks}</td>
                        <td class="text-nowrap">${updatedBy}</td>
                    </tr>`;
                })
                .join("");

            const renewalsCount = group.length;

            cards += `<div class="d-flex position-relative mb-4">

                <div class="flex-grow-1 ms-3">
                    <div class="card shadow-sm" style="border-left: 6px solid ${accent};border-radius: 14px;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between flex-column flex-md-row mb-3">
                                <div>
                                    <h5 class="card-title mb-1">${title} ${headerBadgeHtml}</h5>
                                    ${detailPillsHtml}
                                </div>
                                <div class="text-end mt-2 mt-md-0">
                                    <small class="text-muted d-block mb-1">Monthly</small>
                                    <p class="h5 mb-0" style="color:${priceColor};">${priceLine}</p>
                                    <div class="mt-2">${depositBadgeHtml}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        });

        return cards;
    };
    mThis.renderOverView = (div, target, data) => {
        if (target == "overview_tenant_detail") {
            const p = { id: data.id };

            vsapi
                .call(
                    [
                        main_view.base_url,
                        "/prm/tenant/tenantProfile/details",
                    ].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const d = res.status_code == 200 ? res.data : {};

                    let html = "";
                    html += `<div class="tab-pane py-2 active" id="overview_tenant_detail">
                            <h5 class="fw-bold mb-2"><i class="fa fa-user me-1 text-primary"></i> Personal Information</h5>
                            <div class="row g-4 mb-5">
                                <div class="col-md-4"><small class="text-muted">Name</small><div class="">${data.name ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Sex</small><div class="">${data.sex == "M" ? "Male" : data.sex == "F" ? "Female" : "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Date of Birth</small><div class="">${data.date_of_birth ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="">${data.legal_name ?? ""}</div></div>
                                <div class="col-md-4"><small class="text-muted">National ID</small><div class="">${data.national_id ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="">${data.passport_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Phone</small><div class="">${data.phone_number ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Email</small><div class=" text-primary">${data.email ?? "_"}</div></div>
                                <div class="col-md-4"><small class="text-muted">Relationship</small><div class="">Partner</div></div>
                                <div class="col-12"><small class="text-muted">Address</small><div class="text-prm-custom text-capitalize">${data.address ?? "_"}</div></div>
                            </div>
                        </div>`;
                    div.innerHTML = html;
                });
        }
        if (target == "lease_tenant_history") {
            const p = { id: data.id };
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/lease-history"].join(""),
                    p,
                    false,
                    null,
                )
                .then((res) => {
                    const raw =
                        res.status_code == 200 && res.data != null
                            ? res.data
                            : [];
                    const contracts = Array.isArray(raw) ? raw : [];
                    const cardsHtml =
                        mThis._leaseHistoryContractsHtml(contracts);
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class=" py-4 position-relative overflow-auto lease-history-scroll" style="max-height: 360px; scrollbar-width: thin;scrollbar-color: #888 #f1f1f1;">
                                ${cardsHtml}
                            </div>
                        </div>`;
                })
                .catch((err) => {
                    div.innerHTML = `<div class="tab-pane active" id="lease_tenant_history">
                            <h5 class="fw-bold mb-2">
                                <i class="fa fa-file-text me-1 text-primary"></i>
                                Contract
                            </h5>
                            <div class="alert alert-danger m-3">Failed to load contracts: ${mThis._escapeHtml(err && err.message ? err.message : "Unknown error")}</div>
                        </div>`;
                });
        }
        if (target === "document_tenant_list") {
            vsapi
                .call(
                    [main_view.base_url, "/prm/tenant/document/list"].join(""),
                    { tenant_id: data.id },
                    false,
                    null,
                )
                .then((res) => {
                    const documents =
                        res.status_code === 200 && Array.isArray(res.data)
                            ? res.data
                            : [];

                    let rows = "";

                    documents.forEach((doc) => {
                        rows += `
                    <tr class="border-bottom">
                        <td class="ps-3 py-3" style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="d-flex align-items-center">
                                <div>
                                    <div class="text-dark">
                                        ${doc.document_type || doc.document_type_id || "â€”"}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td style="width: 20%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.original_file_name || "â€”"}
                            </div>
                        </td>
                        <td style="width: 12%; height: 55px; vertical-align: middle;">
                            <div class="text-dark">
                                ${doc.ext ? doc.ext.toUpperCase() : "â€”"}
                            </div>
                        </td>
                        <td style="width: 30%; height: 65px; vertical-align: middle;">
                            <span class="text-dark">
                                ${doc.remarks || "_"}
                            </span>
                        </td>
                        <td class="text-end py-3 px-3" style="width: 10%; height: 55px; vertical-align: middle; ">
                            <div class="d-flex justify-content-start gap-2">
                                <a href="javascript:void(0)" class="view-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-eye text-success fs-6"></i>
                                        <span class="tool-tiptext fs-6">View</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="modify-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-edit fs-6 text-warning"></i>
                                        <span class="tool-tiptext fs-6">Modify</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="download-doc" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-solid fa-cloud-arrow-down text-primary fs-6"></i>
                                        <span class="tool-tiptext fs-6">Download</span>
                                    </span>
                                </a>
                                <a href="javascript:void(0)" class="delete-doc-btn" data-id="${doc.id}">
                                    <span class="tool-tip">
                                        <i class="fa-regular fa-trash-can text-danger fs-6"></i>
                                        <span class="tool-tiptext fs-6">Delete</span>
                                    </span>
                                </a>
                            </div>
                        </td>
                    </tr>
                `;
                    });

                    // Empty state
                    if (documents.length === 0) {
                        rows = `
                    <tr>
                        <td colspan="5" class="text-center py-4 text-muted">
                            No data to display
                        </td>
                    </tr>`;
                    }

                    const html = `
                <div class="tab-pane active" id="document_tenant_list">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="fw-bold mb-2"><i class="fa fa-address-card me-2 text-primary"></i> Identity Documents</h5>
                        <button type="button" class="fw-light btn btn-primary w-16 w-md-auto btnAddNewPrm" id="_btnDocument">
                            <span vslang="buttons.Upload Document">Upload Document</span>
                        </button>
                    </div>

                    <div class="table-responsive " style="max-height: 290px; overflow-y: auto; scrollbar-width: thin;">
                        <table class="table align-middle mb-3">
                            <thead class="bg-light">
                                <tr class="text-uppercase small">
                                    <th class="border-0 ps-3" style="letter-spacing: 0.05em;">Type</th>
                                    <th class="border-0">File Name</th>
                                    <th class="border-0">File Type</th>
                                    <th class="border-0">Remark</th>
                                    <th class="border-0 text-start">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>

                </div>`;

                    div.innerHTML = html;
                    const btnDocument = div.querySelector("#_btnDocument");
                    if (btnDocument) {
                        btnDocument.onclick = () => {
                            TenantDocumentDialog.show({
                                id: null,
                                tenant_id: data.id,
                                onClose: () => {
                                    mThis.renderOverView(div, target, data);
                                },
                            });
                        };
                    }

                    div.querySelectorAll(".view-doc").forEach((btn) => {
                        btn.addEventListener("click", async (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "view");
                        });
                    });
                    div.querySelectorAll(".download-doc").forEach((btn) => {
                        btn.addEventListener("click", (e) => {
                            const id = e.currentTarget.dataset.id;
                            mThis.openTenantDocument(id, "download");
                        });
                    });

                    document.querySelectorAll(".modify-doc").forEach((btn) => {
                        btn.addEventListener("click", async function (e) {
                            e.preventDefault();
                            const op = {
                                id: parseInt(this.dataset.id),
                                tenant_id: data.id,
                                btn: e.target,
                                onClose: () => {
                                    mThis.renderOverView(div, target, data);
                                    mThis.tenantListView.showPage(
                                        mThis.getFilterData(),
                                    );
                                },
                            };
                            TenantDocumentDialog.show(op);
                        });
                    });

                    document
                        .querySelectorAll(".delete-doc-btn")
                        .forEach((btn) => {
                            btn.addEventListener("click", async function (e) {
                                const docId = this.dataset.id;

                                const confirmed = await cv_interact.confirm(
                                    "Are you sure you want to delete this document?",
                                    {
                                        title: "Delete Document",
                                        context: "delete",
                                    },
                                );

                                if (confirmed) {
                                    const p = { id: docId };
                                    vsapi
                                        .call(
                                            [
                                                main_view.base_url,
                                                "/prm/tenant/document/delete",
                                            ].join(""),
                                            p,
                                            false,
                                            false,
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                cv_interact.success(
                                                    "Document deleted.",
                                                );
                                                mThis.renderOverView(
                                                    div,
                                                    target,
                                                    data,
                                                );
                                            } else {
                                                cv_interact.error(
                                                    res.error_message,
                                                );
                                            }
                                        });
                                }
                            });
                        });
                })

                .catch((err) => {
                    div.innerHTML = `<div class="alert alert-danger m-3">Failed to load documents: ${err.message}</div>`;
                });
        }
    };

    mThis.setActionsProfileInfo = (divProfile) => {
        // console.log(33, divProfile);

        divProfile.addEventListener("click", (e) => {
            // let btn = VSUtil.closestLimited(e.target, ".edit_tenant_profile_info ");
            // if (btn) {
            //     mThis.editTenantInfo(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".delete_employee");
            // if (btn) {
            //     mThis.deleteEmployee(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".set_resign");
            // if (btn) {
            //     mThis.setResign(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".movement");
            // if (btn) {
            //     mThis.movement(btn.dataset.id, btn);
            //     return;
            // }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/tenant/tenantProfile/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.statuses,
                    "id",
                    "name",
                    "",
                    "All Statuses",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };
    // mThis.show = (options) => {
    //     mThis.init();
    //     mThis.options = options;
    //     mThis.prepareFormOptions(() => {
    //         // main_view.setContentView(mThis.self, mThis.title_prop);
    //         // mThis.renderView();
    //         // mThis.showPage(mThis.defaultPage, mThis.getFilterData());
    //         mThis.showPage("profile_view", { tenant_id: tenantId });
    //     });
    // };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            AuthManager.init().then((user) => {
                const tenantId = user.official_id || user.id;
                if (!tenantId) {
                    cv_interact.error("Could not identify tenant.");
                    return;
                }
                mThis.showPage("profile_view", { tenant_id: tenantId });
            });
        });
    };

    return mThis;
})();

"use strict";
"use strict";
"use strict";
"use strict";
var ReceiptsComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Transaction";
    mThis.currency_symbol = "$";

    mThis.bindDom = () => {
        if (mThis.self) return true;
        if (!main_view?.VSAppContent) return false;

        mThis.base_url = main_view.base_url;
        mThis.self = main_view.VSAppContent.querySelector(
            "#_main_receipts_component"
        );
        if (!mThis.self) return false;

        mThis.elStatus = mThis.self.querySelector("#_receipts_status");
        mThis.divFilter = mThis.self.querySelector("#_divFilter_receipts");
        mThis.elSearch = mThis.self.querySelector("#_search_receipts");
        return true;
    };

    mThis.cols = [
        { transTitle: "", className: "align-middle" },
        {
            transTitle: "titles.Receipt No",
            className: "align-middle text-nowrap",
            data: (data) => {
                const code = data.code
                    ? `<span class="text-prm-custom">${data.code}</span>`
                    : `<span class="text-muted fst-italic">N/A</span>`;

                return `
                    <div class="d-flex flex-column">
                        ${code}
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-nowrap",
            data: (data) => {
                const code = data.invoice_code
                    ? `<span class="text-prm-custom ">${data.invoice_code}</span>`
                    : `<span class="text-muted fst-italic">N/A</span>`;
                return `
                    <div class="d-flex flex-column ">
                        ${code}
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Payment Date",
            className: "align-middle text-nowrap",
            data: (data) => {
                const date = data.receipt_date;
                return `
                    <div class="d-flex flex-column">
                        ${date}
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>
                    <span class="d-block text-prm-custom ">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            },
        },
        {
            transTitle: "titles.Mode of Payment",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.payment_methods}</span>
                    </div>`;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap",
            data: (data) => {
                const val = parseFloat(data.total_received || 0).toFixed(2);
                return `<span class="text-primary fw-bold">$ ${val}</span>`;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const statusId = parseInt(data.receipt_status_id) || 1;

                const statusClasses = {
                    1: "badge text-success bg-success-subtle border border-success",
                    2: "badge text-danger bg-danger-subtle border border-danger",
                };

                const cls =
                    statusClasses[statusId] ??
                    "badge text-dark bg-light border";

                return `
                    <span
                        data-id="${data.id}"
                        class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px;">
                        ${data.receipt_status_name ??
                            (statusId === 1 ? "Active" : "Canceled")}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ??
                            "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: (data) => `
                <a href="javascript:void(0)" class="btn_receipts_action" data-id="${data.id}" data-statusid="${data.receipt_status_id}" style="padding: 0 10px;">
                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                </a>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;
        if (!mThis.bindDom()) return;

        mThis.ReceiptListView = new ListView("_receipts_list", {
            fetchApi: `${main_view.base_url}/prm/tenant/receipt/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase mb-0",
            rowCreated: (data, index, tr) => {
                tr.classList.add("receipt", "cursor-pointer");
                tr.id = `receipt_id_${data.id}`;
                tr.dataset.statusId = data.receipt_status_id;
            },
        });
        mThis.listContainer = mThis.ReceiptListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };

        mThis.tblReceipt = mThis.ReceiptListView.getTable();

        mThis.initDropdownMenus(mThis.tblReceipt);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.ReceiptListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }, 300);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch?.value ?? "",
            status_id: mThis.elStatus?.value ?? "",
        };
        mThis.divFilter?.querySelectorAll(".filter-field").forEach((el) => {
            if (el.dataset.field) {
                p[el.dataset.field] = el.value;
            }
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_receipts_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Print Receipt"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    name: "print_receipt",
                    cssClass: "border-bottom pb-2",
                },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "print_receipt") {
                    mThis.printReceipt(id, menuLink);
                }
            },
        });
    };

    mThis.printReceipt = (id, menuLink) => {
        PrintReceiptDialog.show({
            receipt_id: id,
            btn: menuLink,
            detailsUrl: `${mThis.base_url}/prm/tenant/receipt/details`,
            invoiceDetailsUrl: `${mThis.base_url}/prm/tenant/invoice/details`,
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/tenant/receipt/form-options`,
                {},
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                if (mThis.elStatus) {
                    VSUtil.setComboItems(
                        mThis.elStatus,
                        d.receipt_statuses,
                        "id",
                        "name",
                        "",
                        "All Statuses",
                        ""
                    );
                }
            })
            .catch((err) => {
                console.error("ReceiptsComponent: form-options failed", err);
            })
            .finally(() => {
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        if (!mThis.bindDom()) {
            console.error("ReceiptsComponent: #_main_receipts_component not found.");
            return;
        }

        mThis.options = options;
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.init();

        mThis.prepareFormOptions(() => {
            if (mThis.ReceiptListView) {
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }
        });
    };

    return mThis;
})();

window.ReceiptsComponent = ReceiptsComponent;
