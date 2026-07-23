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

    // mThis.mnuChangePassword =mThis.top_right_menus.querySelector('#_main_mnu_changepwd');
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

      if (typeof ReceiptsComponent !== 'undefined') {
          window.ReceiptsComponent = ReceiptsComponent;
      }

      if (typeof EmployeeManagementComponent !== 'undefined' && typeof TeamComponent === 'undefined') {
          window.TeamComponent = EmployeeManagementComponent;
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

        // mThis.mnuChangePassword.addEventListener('click',e => {
        //     const user = AuthManager?.user ?? null;
        //     if(!user){
        //         cv_interact.error('Authentication failed!');
        //         return;
        //     }
        //     ChangePasswordDialog.show({login_name:user.login_name,user_id:user.id});
        // });

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

"use strict";
const ChangePasswordDialog = (()=>{
  const self = {};
  let dialog = null;

  self.show = (op)=>{
     dialog = dialog || new GeneralDialog({
        title: LocaleManager.trans("Change Password",'titles'),
        cssClass:null,
        createContent:(me)=>{
            return [`<div class="form-group">
                    <label for="old_password" class="form-label  " vslang="titles.Current Password">Current Password</label>
                    <div class="input-group flex-nowrap">
                        <input name="old_password" type="password" class="form-control data-input" data-field="old_password" autocomplete="off">
                        <div class="input-group-text" role="button">
                            <i class="fa-regular fa-eye fs-5 text-muted"></i>
                        </div>
                    </div>
                </div>`,
                `<div class="form-group">
                    <label for="new_password" class="form-label  " vslang="titles.New Password">New Password</label>
                    <div class="input-group flex-nowrap">
                        <input name="new_password" type="password" class="form-control data-input" data-field="new_password" autocomplete="off">
                        <div class="input-group-text" role="button">
                            <i class="fa-regular fa-eye fs-5 text-muted"></i>
                        </div>
                    </div>
                </div>`,
            `<div class="form-group">
            <label for="confirm_password" class="form-label  " vslang="titles.Confirm New Password">Confirm New Password</label>
            <div class="input-group flex-nowrap">
                <input name="confirm_password" type="password" class="form-control data-input" data-field="confirm_password" autocomplete="off">
                <div class="input-group-text" role="button">
                    <i class="fa-regular fa-eye fs-5 text-muted"></i>
                </div>
            </div>
            </div>`
            ].join('');
        },
        // afterInit:(me,divModal)=>{
        //     me.fieldList.forEach(input=>{
        //        input.onInput = function(){
        //             if((me.controls.password.value === me.controls.confirm_password.value) && !(input.value == ''))
        //             {
        //                 input.classList.remove('border-danger');
        //                 input.classList.remove('border-danger');
        //             }
        //             else
        //             {
        //                 input.classList.add('border-danger');
        //                 input.classList.add('border-danger');
        //             }
        //        }
        //        input.nextElementSibling.onclick = e=>{
        //            let type = input.type ==='password' ? 'text' : 'password';
        //            input.type = type;
        //        }
        //     });
        // },
        contentCreated:(me) => {
            me.fieldList.forEach(input=>{
               input.onInput = function(){
                    if((me.controls.password.value === me.controls.confirm_password.value) && !(input.value == ''))
                    {
                        input.classList.remove('border-danger');
                        input.classList.remove('border-danger');
                    }
                    else
                    {
                        input.classList.add('border-danger');
                        input.classList.add('border-danger');
                    }
               }
               input.nextElementSibling.onclick = e=>{
                   let type = input.type ==='password' ? 'text' : 'password';
                   input.type = type;
               }
            });
        },
        buttons:[
            {
                label:"<span>Cancel</span>",
                cssClass:"btn-vs-cancel",
                click:(me,btn)=>{
                    me.hide(false);
                }
            },
            {
                label:"<span>Change</span>",
                cssClass:"btn-vs-save",
                click:(me,btn)=>{
                    let p = me.getData();
                    p.id = me.dataOptions.user_id || me.dataOptions.id;
                    if(p.new_password !== p.confirm_password){
                        cv_interact.warning(LocaleManager.trans('Password and confirmed password do not match!','titles'));
                        return;
                    }
                    delete(p.confirm_password);

                    let login_name = me.dataOptions.login_name ?? "";
                    vsapi.call([main_view.base_url,'/api/user/password/change'].join(''),p,btn,false).then(res => {
                        if(res.status_code === 200)
                        {
                            me.hide(true);
                            let msg = LocaleManager.trans('Password has been changed successfully','titles');
                            cv_interact.success(msg);
                        }
                        else cv_interact.error(res.error_message);

                    });
                }
            }
        ]

      });
       dialog.show(op);
  };

  return self;
})();
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

var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "Dashboard";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_dashboardComponent");
    main_view.divTitle = main_view.divTitle || document.querySelector('#screen_title_wrapper');

    // *** When DashboardComponent is showing, create Dashboard Filter button near page title
    // mThis.onShow = (options) => {
    //     if (!AuthManager.allowed(254,true)) return;
    //     mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
    //     const btn = main_view.divTitle.querySelector(".btn-db-fitler");
    //     if (!btn) return;
    //     main_view.divTitle.insertAdjacentHTML(
    //         "beforeend",
    //         '<div class="d-none div-db-filter w-100 text-end"><button class="btn-db-fitler btn btn-sm btn-primary-custom rounded-circle p-2"><i class="fa-solid text-white fa-paper-plane"></i></button></div>'
    //     );
    //     btn = main_view.divTitle.querySelector(".btn-db-fitler");
    //     mThis.createFilterButton(btn);
    // };

    // *** When DashboardComponent is closing, remove Dashboard Filter button near page title
    mThis.onHide = (options) => {

    if (!AuthManager.allowed(254,true)) return;
        mThis.removeFilterButton();
    };

    mThis.init = () => {
        if (mThis.initAlready) return;
        if(AuthManager.allowed(254,true)){
            mThis.dbChartAll = mThis.self.querySelector("#dbChart_all_top");
            mThis.dbCards = mThis.self.querySelector("#db_cards");
            mThis.db_card_bottom = mThis.self.querySelector("#_db_card_bottom");
            mThis.dashboard_Bottom_left = mThis.self.querySelector("#_dashboard_bottom_left");
            mThis.dbCardOnLeave = mThis.self.querySelector("#_db_card_onLeave");
        }
        mThis.initAlready = true;
    };

    mThis.removeFilterButton = () => {
        const divTitle = main_view.divTitle;
        const div = divTitle.querySelector("div.div-db-filter");
        if (div) div.remove();
    };

    mThis.createFilterButton = (btn) => {
        mThis.filterConfig = null;
        mThis.filterConfig = new FilterPanel({
            triggerButton: btn,
            fields: [
                {
                    name: "year",
                    label: "Year",
                    valueField: "year",
                    textField: "year",
                    defaultValue: 2024,
                    data: [{ year: 2024 }, { year: 2025 }],
                },
                {
                    name: "month",
                    label: "Month",
                    // "valueField":"value",
                    // "textField":"label",
                    data: [
                        { value: "mThis_month", label: "This month" },
                        { value: "last_month", label: "Last month" },
                    ],
                },
            ],
            // "createContent":()=>{
            //     return [
            //         '<div class="d-flex flex-column p-3">',
            //            '<div>',
            //                 '<label class="form-label" vs-lang="titles.Date">Date</label>',
            //                 '<div><input class="form-control" /></div>',
            //            '</div>',
            //            '<div>',
            //               '<label class="form-label" vs-lang="titles.Branch">Branch</label>',
            //               '<div><select class="form-control"> </select></div>',
            //            '</div>',
            //         '</div>',
            //     ].join('');
            // },
            contentCreated: (me) => {
            },
            onSelect: (me, data) => {
            },
        });
    };

    mThis.renderDBChartAllTop = (data) => {
        data = data ? data : {};
        let html = [
            `<div class="chart-row py-3">`,
            `<div class="col-md-3">`,
                    '<div class="chart-container dashboard_chart ">',
                        '<span class="fw-semibold fs-5 text-primary-custom text-capitalize">',
                            data.doughnutChart.title,
                        '</span>',
                        '<canvas id="doughnutChart"></canvas>',
                    '</div>',
                `</div>`,
            `<div class="col-md-6">
                    <div class="chart-container dashboard_chart">
                        <span class="fw-semibold fs-5 text-primary-custom text-capitalize">
                            Monthly Payroll Expenses (last 12 months)
                        </span>
                        <canvas id="employeeSalaryChart"></canvas>
                    </div>
                </div>`,
            `<div class="col-md-3">`,
            `<div class="chart-container dashboard_chart bg-white shadow-sm">`,
            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,

            `<div class="bg--icon">`,
            `<img class="img--size" src="`,main_view.base_url,`/assets/images/bhr/dashboard/team.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow   rounded-2" style="background-color:#27b7ff;">${data.cards.new_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1" style="">`,data.cards.new_staff_count.title,`</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,
            `<div class="bg--icon">`,
            `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/letter.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5  text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.resigning_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1">${data.cards.resigning_staff_count.title}</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 " style="background-color: #ededed;">`,
            `<div class="d-flex align-items-center p-2 mb-1">`,
            `<div class="bg--icon">`,
            `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/stop-work.svg" alt="Icon">`,
            `</div>`,
            `<div class="ms-3 text-center flex-fill">`,
            `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.resigned_staff_count.count ?? 0}</span>`,
            `<div class="text-primary mt-1">${data.cards.resigned_staff_count.title}</div>`,
            `</div>`,
            `</div>`,
            `<hr style="border:1px solid #fff; margin:0;">`,
            `<div class="text-center">`,
            `<small class="text-muted">Last 90 days</small>`,
            `</div>`,
            `</div>`,

            `</div>`,
            `</div>`,

            `</div>`
        ].join("");
        mThis.dbChartAll.innerHTML = html;
        mThis.renderChartEmployee(data.doughnutChart);
        mThis.employeeSalaryChart(data.barCharts);
        // mThis.renderCompareChart(data.pieCharts);
    };

    mThis.renderChartEmployee = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById("doughnutChart").getContext("2d");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.values,
                        backgroundColor: data.colors,
                        borderColor: ["#fff", "#fff", "#fff"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "top",
                    },

                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw;
                                return `${label} : ${value} áž“áž¶áž€áŸ‹`;
                            },
                        },
                    },
                    datalabels: {
                        color: "#000",
                        font: {
                            size: 12,
                            weight: "bold",
                        },
                        formatter: function (value, context) {
                            return `${
                                context.chart.data.labels[context.dataIndex]
                            }\n${value} áž“áž¶áž€áŸ‹`;
                        },
                    },
                },
            },
        });
    };
    mThis.employeeSalaryChart = (data) => {
        const ctx = document
            .getElementById("employeeSalaryChart")
            .getContext("2d");

        if (!data.labels || data.labels.length < 12) {
            const defaultCount = 12 - (data.labels ? data.labels.length : 0);
            const placeholders = Array(defaultCount).fill("N/A");
            const placeholderEmployeeCounts = Array(defaultCount).fill(0);
            const placeholderSalaries = Array(defaultCount).fill(0);

            data.labels = data.labels
                ? [...data.labels, ...placeholders]
                : placeholders;
            data.employee_counts = data.employee_counts
                ? [...data.employee_counts, ...placeholderEmployeeCounts]
                : placeholderEmployeeCounts;
            data.total_salaries = data.total_salaries
                ? [...data.total_salaries, ...placeholderSalaries]
                : placeholderSalaries;
        }

        const employeeSalaryData = {
            labels: data.labels,
            datasets: [
                {
                    label: "Total Employees",
                    data: data.employee_counts,
                    backgroundColor: "#2b3991",
                    borderColor: "#fff",
                    borderWidth: 1,
                    yAxisID: "y",
                },
                {
                    label: "Total Salary Paid (ážšáŸ€áž›)",
                    data: data.total_salaries,
                    backgroundColor: "#cab54a",
                    borderColor: "#fff",
                    borderWidth: 1,
                    yAxisID: "y1",
                },
            ],
        };

        const config = {
            type: "bar",
            data: employeeSalaryData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    // title: {
                    //     display: true,
                    //     text: 'Employee Count and Total Salary Paid in the Last 12 Months',
                    // },
                },
                scales: {
                    y: {
                        type: "linear",
                        position: "left",
                        title: {
                            display: true,
                            text: "Number of Employees",
                        },
                    },
                    y1: {
                        type: "linear",
                        position: "right",
                        title: {
                            display: true,
                            text: "Salary in KHR (ážšáŸ€áž›)",
                            color: "#cab54a",
                        },
                        ticks: {
                            color: "#2b3991",
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                },
            },
        };

        new Chart(ctx, config);
    };

    mThis.renderDBCards = (data) => {
        let html = [
            `<div class="col-md-3">
                 <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="orange" stroke-width="4"
                                    stroke-dasharray="75, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                style="color:orange; font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.exit_form_count.count}</span>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start"
                            style="color: #2b3991; font-size: 1.2rem;">Exit Forms <small class="text-danger">(Pending)</small></span>
                    </div>

            </div>`,
            `<div class="col-md-3">
                      <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                        <div class="position-relative m-3" style="width: 60px; height: 60px;">
                            <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                <path class="circle-bg" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#eee" stroke-width="4" />
                                <path class="circle" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none" stroke="#cab54a" stroke-width="4"
                                    stroke-dasharray="50, 100" stroke-linecap="round" />
                            </svg>
                            <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                style="color: #2b3991; font-size: 1rem; font-weight: bold;">
                               <span class="p-1">${data.cards.intern_staff_count.count}</span>
                                <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                            </div>
                        </div>
                        <span class="fw-semibold fs-6 text-primary-custom text-start"
                            style="color: #2b3991; font-size: 1.2rem;">${data.cards.intern_staff_count.title}</span>
                    </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#f44336" stroke-width="4"
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                      style="color: #f44336; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.warning_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start"
                  style="color: #2b3991; font-size: 1.2rem;">${data.cards.warning_staff_count.title}</span>
          </div>

            </div>`,
            `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
              <div class="position-relative m-3" style="width: 60px; height: 60px;">
                  <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                      <path class="circle-bg" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#eee" stroke-width="4" />
                      <path class="circle" d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#32bcd3" stroke-width="4"
                          stroke-dasharray="50, 100" stroke-linecap="round" />
                  </svg>
                  <div class="d-flex justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                      style="color: #32bcd3; font-size: 1rem; font-weight: bold;">
                     <span class="p-1">${data.cards.probation_staff_count.count}</span>
                      <small style="color: #2b3991; font-size: 0.5rem; font-weight: bold;">staff</small>
                  </div>
              </div>
              <span class="fw-semibold fs-6 text-primary-custom text-start"
                  style="color: #2b3991; font-size: 1.2rem;">${data.cards.probation_staff_count.title}</span>
          </div>

            </div>`,
        ].join("");
        mThis.dbCards.innerHTML = html;
    };

    mThis.renderDBCardBottom = (data) => {
        data = data ? data : {};

        const tableLeave = mThis.renderDBCardOnLeave(data.onLeave);
        const tableBenefit = mThis.renderDBCardBenefit(data.benefits);
        let html = [
            `<div class="card-row  py-2 p-1">`,
            `<div class="col-md-3">
                    <div class="card-container dashboard_chart">
                        <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                            Absences over last 10 days
                        </span>
                        ${tableLeave}
                    </div>
            </div>`,

            `<div class="col-md-3">
                    <div class="card-container dashboard_chart">
                      <div class="w-100 d-flex flex-row justify-content-center align-items-center p-1 mb-2 shadow rounded-3" style="background-color: #ffffff;">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#08b9d5" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#9219ff" stroke-width="4"
                                        stroke-dasharray="75, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">
                                    ${data.accounts.payrolls.total_count || 0}
                                    </p>
                                    <small>Payrolls</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">
                                        ${VSMoney.symbol('KHR') + VSMoney.formatAmount(data.accounts.payrolls.total_balance || 0)}

                                    </p>
                                </div>
                            </div>

                </div>
                <div class="w-100 d-flex flex-row align-items-center justify-content-center align-items-center p-1 shadow rounded-3" style="background-color: #ffffff;">
                            <div class="position-relative ms-3" style="width: 120px; height: 100px;">
                                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 100%; height: 100%;">
                                    <path class="circle-bg" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#eee" stroke-width="4" />
                                    <path class="circle" d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none" stroke="#00e5ff" stroke-width="4"
                                        stroke-dasharray="75, 100" stroke-linecap="round" />
                                </svg>
                                <div class="d-flex flex-column justify-content-center align-items-center position-absolute top-50 start-50 translate-middle"
                                    style="color: #2b3991; font-size: 0.75rem; font-weight: bold; text-align: center;">
                                    <p class="fs-6 m-0">${
                                        data.accounts.wallets.total_count || 0
                                    }</p>
                                    <small>Wallets</small>
                                </div>
                            </div>
                            <div class="section-title mt-3 mx-3 mb-0 fs-6 text-start w-100">
                                <div class="w-100">
                                    <p class="fs-6 text-muted m-0" style="color: #cab54a;">Total</p>
                                    <hr style="margin: 4px 0; border: 0; border-top: 2px solid #2b3991; width: 80%;">
                                    <p class="fs-6" style="color: #2b3991;">
                                        ${VSMoney.symbol('KHR') + VSMoney.formatAmount(data.accounts.wallets.total_balance || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    <div class="text-center mt-auto">
                        <small class="text-muted">Data from the last 90 days</small>
                    </div>
                </div>
            </div>`,

            `<div class="col-md-6 p-0">
                <div class="card-container dashboard_chart mr-4">
                    <span class="fw-semibold fs-6 text-primary-custom text-capitalize">
                        Benefit Overview As of Now
                    </span>
                    ${tableBenefit}
                </div>
            </div>`,

            `</div>`,
        ].join("");

        mThis.db_card_bottom.innerHTML = html;
    };

    mThis.renderDBCardOnLeave = (data) => {
        const rowsHtml = (data || [])
            .map(
                (item) => `
                <tr>
                    <td class="align-middle">
                        <div class="text-primary-custom text-center border rounded-5 d-block p-1" style="width: 100px; background: #d1b54a;font-size: 0.75rem; font-weight: bold;">
                            ${item.formatted_date || ""}
                        </div>
                    </td>
                    <td class="align-middle" style="font-size: 0.75rem;">
                        <span class="p-1 text-white text-center border d-block rounded-5 p-1" style="width: 100px; background: #2b3991cc; font-size: 0.75rem; font-weight: bold;">
                            ${item.staff_count || 0}
                        </span>
                    </td>
                </tr>
            `
            )
            .join("");

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="text-start" style="font-size: 0.85rem; color: #d1b54a; font-weight: bold;">Date</th>
                        <th class="text-start" style="font-size: 0.85rem; color: #2b3991cc; font-weight: bold;">Absence Count</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
    };

    mThis.renderDBCardBenefit = (data) => {
        const rowsHtml = (data || [])
            .map(
                (item) => `
                <tr>
                   <td class="align-middle">
                        <div class="text-primary-custom " style="width: 20px;font-size: 0.75rem; font-weight: bold;">
                        </div>
                    </td>
                    <td class="align-middle">
                        <div class="text-primary-custom " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.benefit_name}
                        </div>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.benefit_type == 1 ? "Remuneration" : ""} ${item.benefit_type == 2 ? "Fringe" : ""}
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary-custom" style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                             ${VSMoney.symbol('KHR') + VSMoney.formatAmount(item.total_amount || 0.0)}
                        </span>
                    </td>
                    <td class="align-middle">
                        <span class="text-primary " style="width: 100px;font-size: 0.75rem; font-weight: bold;">
                            ${item.updated_by || ""}
                        </span>
                    </td>
                </tr>
            `
            )
            .join("");

        return `
        <div class="w-100 mt-2" style="max-height: 200px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; scroll-behavior: smooth; scrollbar-width: thin;">
            <table class="table bg-white rounded-4 mb-0" style="font-size: 0.8rem;">
                <thead style="position: sticky; top: 0; background: #fff; z-index: 1;">
                    <tr>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;"></th>

                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Benefit </th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Category</th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Total</th>
                        <th class="" style="font-size: 0.85rem; color: #2b3991; font-weight: bold;">Last Updated</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;
    };

    mThis.loadCards = (onFinish) => {
        const p = {};

        vsapi
            .call(
                `${main_view.base_url}/mhr/dashboard/data`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                const data = res.status_code === 200 ? res.data : {};

                mThis.renderDBChartAllTop(data);
                mThis.renderDBCards(data);
                mThis.renderDBCardBottom(data);

                onFinish();
            });
    };
    mThis.prepareFormOptions = (data, onFinish) => {
        mThis.loadCards(onFinish);
    };

    mThis.setDashboardScroll = () => {
        const parent = mThis.self;
        parent.style.height = window.innerHeight - 100 + "px";
        parent.classList.add("overflow-y-auto");
        parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            parent.style.height = window.innerHeight - 100 + "px";
        };
    };

    mThis.show = (options) => {
        if (!AuthManager.allowed(254,true)){
            mThis.self.innerHTML = renderUserHome();
            main_view.setContentView(mThis.self, mThis.title_prop);
            return;
        }

        mThis.setDashboardScroll();
        mThis.init();
        options = options || {};
        mThis.prepareFormOptions(null, (d) => {
            main_view.setContentView(mThis.self, mThis.title_prop);

        });
    };

    const renderUserHome = ()=>{
        return [
            `<div class="user_home_page">
                <img src="../../../assets/images/default/default-dashboard.jpg" >
            </div>
            <style>
                .user_home_page img{
                    height: 88.6vh;
                    width: 99.2%;
                    margin:5px;
                    background-size: cover;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>`,
        ].join("");

     };
    return mThis;
})();

"use strict";

var EmployeeSkillComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._iconUrl = () =>
        `${main_view.base_url}/assets/images/default/default-skill.svg`;

    mThis._progressBar = (rate) => {
        const num = Math.max(0, Math.min(100, Number(rate) || 0));
        const display = num.toFixed(2);
        const level =
            num >= 75 ? "high" : num >= 40 ? "mid" : "low";
        return `
            <div class="emp-skill-col-rate">
                <div class="emp-skill-rate-row">
                    <div class="emp-skill-progress-track">
                        <div class="emp-skill-progress-fill emp-skill-progress-fill--${level}" style="width:${display}%;"></div>
                    </div>
                    <span class="emp-skill-rate-badge">${display}%</span>
                </div>
            </div>`;
    };

    mThis._skillOptionsHtml = (skills, selectedId) => {
        const selected = selectedId != null ? String(selectedId) : "";
        const list = Array.isArray(skills) ? skills : [];
        return list
            .map((item) => {
                const isSelected =
                    selected && selected === String(item.id) ? " selected" : "";
                return `<option value="${item.id}"${isSelected}>${mThis._escapeHtml(item.skill_name || item.title || "_")}</option>`;
            })
            .join("");
    };

    mThis._bindActions = (container, empId, skillList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_skill_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                SkillDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-skill-action-btn-edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const skillId = btn.dataset.skillId;
                const skill = skillList.find(
                    (s) => String(s.id) === String(skillId),
                );
                SkillDialog.show({
                    id: skillId,
                    emp_id: empId,
                    skill,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-skill-action-btn-delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const skillId = btn.dataset.skillId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this skill?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Skill", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/skills/delete`,
                                { id: skillId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, skills, empId, onRefresh) => {
        if (!container) return;

        const skillList = Array.isArray(skills) ? skills : [];
        const iconUrl = mThis._iconUrl();

        const rowsHtml = skillList.length
            ? skillList
                  .map(
                      (s) => `
                <div class="emp-skill-row" data-skill-id="${s.id}">
                    <div class="emp-skill-col-name">
                        <div class="emp-skill-icon">
                            <img src="${iconUrl}" alt="">
                        </div>
                        <span class="emp-skill-name">${mThis._escapeHtml(s.skill_name || s.title || s.skill || "_")}</span>
                    </div>
                    ${mThis._progressBar(s.rate)}
                    <div class="emp-skill-col-action">
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-edit" data-skill-id="${s.id}" title="Edit" aria-label="Edit">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button type="button" class="emp-skill-action-btn emp-skill-action-btn-delete" data-skill-id="${s.id}" title="Delete" aria-label="Delete">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>`,
                  )
                  .join("")
            : `<div class="emp-skill-empty">
                    <i class="fa-solid fa-graduation-cap emp-skill-empty-icon"></i>
                    <span class="emp-skill-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-skill-card h-100">
                    <div class="emp-skill-header">
                        <div class="emp-skill-header-title">
                            <span class="emp-skill-header-icon">
                                <i class="fa-solid fa-lightbulb"></i>
                            </span>
                            <span class="emp-skill-header-label" vslang="titles.Skill">Skill</span>
                        </div>
                        <button type="button" class="emp-skill-add-btn" id="_emp_skill_btn_add" title="Add" aria-label="Add skill">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-skill-body">
                        <div class="emp-skill-cols">
                            <span vslang="titles.Skill">Skill</span>
                            <span vslang="labels.Rate">Rate</span>
                            <span vslang="titles.Action">Action</span>
                        </div>
                        <div class="emp-skill-list">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, skillList, onRefresh);
    };

    return mThis;
})();

const SkillDialog = (() => {
    const self = {};

    self._openDialog = (op, payload) => {
        const skills = payload.skills || [];
        const skill = payload.skill || op.skill || null;
        const selectedId = skill?.skill_id ?? null;

        const dlg = new GeneralDialog({
            cssClass: "modal-md vs-modal emp-skill-modal",
            backdrop: "static",
            keyboard: true,
            title: (me) =>
                LocaleManager.trans(
                    me.dataOptions.id ? "Modify Skill" : "Add Skill",
                    "titles",
                ),
            createContent: () => `
                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label fw-semibold">${LocaleManager.trans("Skill Name", "labels")} <span class="text-danger">*</span></label>
                        <select name="skill_id" class="form-control data-input" data-field="skill_id">
                            <option value="">${LocaleManager.trans("Select", "labels")}</option>
                            ${EmployeeSkillComponent._skillOptionsHtml(skills, selectedId)}
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-semibold">${LocaleManager.trans("Rate", "labels")} (%) <span class="text-danger">*</span></label>
                        <input type="number" name="rate" class="form-control data-input" data-field="rate" min="0" max="100" step="0.01" value="${skill?.rate ?? ""}" />
                    </div>
                </div>`,
            buttons: [
                {
                    label: LocaleManager.trans("Cancel", "buttons"),
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false),
                },
                {
                    label: LocaleManager.trans("Save", "buttons"),
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();
                        p.id = me.dataOptions.id;
                        p.emp_id = me.dataOptions.emp_id;

                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/skills/save`,
                                p,
                                btn,
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, p);
                                    if (
                                        typeof me.dataOptions.onClose ===
                                        "function"
                                    ) {
                                        me.dataOptions.onClose();
                                    }
                                    cv_interact.success(
                                        me.dataOptions.id
                                            ? LocaleManager.trans(
                                                  "update_success",
                                                  "message_box_default",
                                              )
                                            : LocaleManager.trans(
                                                  "create_success",
                                                  "message_box_default",
                                              ),
                                    );
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                },
            ],
        });

        dlg.show({
            ...op,
            skills,
            skill,
        });
    };

    self.show = (op) => {
        vsapi
            .call(`${main_view.base_url}/mhr/employee/skills/form-options`, {
                id: op.id || null,
                emp_id: op.emp_id || null,
            })
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(res.error_message || "Failed to load skills");
                    return;
                }

                self._openDialog(op, res.data || {});
            });
    };

    return self;
})();

"use strict";

var EmployeeEducationComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._yearRange = (start, end) => {
        const s = start != null && start !== "" ? String(start) : "";
        const e = end != null && end !== "" ? String(end) : "";
        if (s && e) return `${s} â€“ ${e}`;
        if (s) return s;
        if (e) return e;
        return "";
    };

    mThis._degreeLine = (edu) => {
        const level = (edu.edu_level || edu.degree || "").trim();
        const major = (edu.major || "").trim();
        const diploma = (edu.diploma || "").trim();
        const parts = [level, major, diploma].filter(Boolean);
        return parts.join(" Â· ");
    };

    mThis._schoolLabel = (edu) => {
        const name = (edu.school_name || edu.school || "").trim();
        return name !== "" ? name : "_";
    };

    mThis._bindActions = (container, empId, educationList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_edu_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                EducationDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-edu-action-btn--edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                EducationDialog.show({
                    id: btn.dataset.eduId,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-edu-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const eduId = btn.dataset.eduId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this education?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Education", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/educations/delete`,
                                { id: eduId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, educations, empId, onRefresh) => {
        if (!container) return;

        const educationList = Array.isArray(educations) ? educations : [];

        const rowsHtml = educationList.length
            ? educationList
                  .map((edu, index) => {
                      const years = mThis._yearRange(
                          edu.start_year,
                          edu.finish_year ?? edu.end_year,
                      );
                      const degreeLine = mThis._degreeLine(edu);
                      const period = (edu.period || "").trim();

                      return `
                <div class="emp-edu-item" data-edu-id="${edu.id}">
                    <div class="emp-edu-item-card${index === 0 ? "" : " emp-edu-item-card--muted"}">
                        <div class="emp-edu-item-head">
                            <span class="emp-edu-school-icon" aria-hidden="true">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </span>
                            <div class="emp-edu-item-main">
                                <div class="emp-edu-title-row">
                                    <div class="emp-edu-item-left">
                                        <h4 class="emp-edu-school">${mThis._escapeHtml(mThis._schoolLabel(edu))}</h4>
                                        ${
                                            period
                                                ? `<p class="emp-edu-location"><i class="fa-solid fa-clock" aria-hidden="true"></i><span>${mThis._escapeHtml(period)}</span></p>`
                                                : ""
                                        }
                                    </div>
                                    <div class="emp-edu-item-right">
                                        ${
                                            years
                                                ? `<span class="emp-edu-years">${mThis._escapeHtml(years)}</span>`
                                                : ""
                                        }
                                        ${
                                            degreeLine
                                                ? `<p class="emp-edu-degree">${mThis._escapeHtml(degreeLine)}</p>`
                                                : ""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="emp-edu-item-foot">
                            <button type="button" class="emp-edu-action-btn emp-edu-action-btn--edit" data-edu-id="${edu.id}" title="Edit" aria-label="Edit">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button type="button" class="emp-edu-action-btn emp-edu-action-btn--delete" data-edu-id="${edu.id}" title="Delete" aria-label="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-edu-empty">
                    <i class="fa-solid fa-building-columns emp-edu-empty-icon"></i>
                    <span class="emp-edu-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-edu-card h-100">
                    <div class="emp-edu-header">
                        <div class="emp-edu-header-title">
                            <span class="emp-edu-header-icon">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </span>
                            <span class="emp-edu-header-label" vslang="titles.Education">Education</span>
                        </div>
                        <button type="button" class="emp-edu-add-btn" id="_emp_edu_btn_add" title="Add" aria-label="Add education">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-edu-body">
                        <div class="emp-edu-list${educationList.length ? " emp-edu-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, educationList, onRefresh);
    };

    return mThis;
})();

const EducationDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="school" class="form-control data-input" placeholder="School" data-field="school_id"></select>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="edu_level" class="form-control data-input" placeholder="Education Level" data-field="edu_level_id"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="period" class="data-input form-control" data-field="period" placeholder=" " />
                                    <label vslang="labels.Period (if no dates)"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="number" name="start_year" class="data-input form-control" data-field="start_year" min="1950" max="2100" placeholder=" " />
                                    <label vslang="labels.Start Year"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="number" name="finish_year" class="data-input form-control" data-field="finish_year" min="1950" max="2100" placeholder=" " />
                                    <label vslang="labels.End Year"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="major" class="data-input form-control" data-field="major" placeholder=" " />
                                    <label vslang="labels.Major"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input type="text" name="diploma" class="data-input form-control" data-field="diploma" placeholder=" " />
                                    <label vslang="labels.Degree"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "school",
                        data: "schools",
                        textField: "school",
                        valueField: "id",
                    },
                    {
                        name: "edu_level",
                        data: "edu_levels",
                        textField: "edu_level",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/educations/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success");
                                        } else {
                                            cv_interact.success("create_success");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "New School",
                    modifyTitle: "Modify School",
                    targetProp: "education_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/educations/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var EmployeeExperienceComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._periodLabel = (exp) => {
        const period =
            exp.period_display ||
            exp.period ||
            "";
        return period !== "" ? period : "";
    };

    mThis._positionLabel = (exp) => {
        const position = (exp.position || exp.position_name || "").trim();
        return position !== "" ? position : "";
    };

    mThis._descriptionBullets = (exp) => {
        const desc = (exp.description || "").trim();
        if (!desc) return "";

        const lines = desc
            .split(/\r?\n/)
            .map((line) => line.replace(/^[-â€¢*]\s*/, "").trim())
            .filter(Boolean);

        if (!lines.length) return "";

        const items = lines
            .map((line) => `<li>${mThis._escapeHtml(line)}</li>`)
            .join("");

        return `<ul class="emp-exp-bullets">${items}</ul>`;
    };

    mThis._organizationLabel = (exp) => {
        const org = (exp.organization || "").trim();
        return org !== "" ? org : "_";
    };

    mThis._bindActions = (container, empId, experienceList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_exp_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                ExperienceDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-exp-action-btn--edit").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                ExperienceDialog.show({
                    id: btn.dataset.expId,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".emp-exp-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const expId = btn.dataset.expId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this experience?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Experience", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/experiences/delete`,
                                { id: expId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, experiences, empId, onRefresh) => {
        if (!container) return;

        const experienceList = Array.isArray(experiences) ? experiences : [];

        const rowsHtml = experienceList.length
            ? experienceList
                  .map((exp, index) => {
                      const period = mThis._periodLabel(exp);
                      const position = mThis._positionLabel(exp);
                      const bullets = mThis._descriptionBullets(exp);

                      return `
                <div class="emp-exp-item" data-exp-id="${exp.id}">
                    <div class="emp-exp-item-card${index === 0 ? "" : " emp-exp-item-card--muted"}">
                        <div class="emp-exp-item-head">
                            <span class="emp-exp-org-icon" aria-hidden="true">
                                <i class="fa-solid fa-briefcase"></i>
                            </span>
                            <div class="emp-exp-item-main">
                                <div class="emp-exp-title-row">
                                    <div class="emp-exp-item-left">
                                        <h4 class="emp-exp-org-name">${mThis._escapeHtml(mThis._organizationLabel(exp))}</h4>
                                        ${
                                            position
                                                ? `<p class="emp-exp-position">${mThis._escapeHtml(position)}</p>`
                                                : ""
                                        }
                                        ${bullets}
                                    </div>
                                    <div class="emp-exp-item-right">
                                        ${
                                            period
                                                ? `<span class="emp-exp-period">${mThis._escapeHtml(period)}</span>`
                                                : ""
                                        }
                                        <div class="emp-exp-actions">
                                            <button type="button" class="emp-exp-action-btn emp-exp-action-btn--edit" data-exp-id="${exp.id}" title="Edit" aria-label="Edit">
                                                <i class="fa-regular fa-pen-to-square"></i>
                                            </button>
                                            <button type="button" class="emp-exp-action-btn emp-exp-action-btn--delete" data-exp-id="${exp.id}" title="Delete" aria-label="Delete">
                                                <i class="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-exp-empty">
                    <i class="fa-solid fa-briefcase emp-exp-empty-icon"></i>
                    <span class="emp-exp-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-exp-card h-100">
                    <div class="emp-exp-header">
                        <div class="emp-exp-header-title">
                            <span class="emp-exp-header-icon">
                                <i class="fa-solid fa-briefcase"></i>
                            </span>
                            <span class="emp-exp-header-label" vslang="titles.Experience">Experience</span>
                        </div>
                        <button type="button" class="emp-exp-add-btn" id="_emp_exp_btn_add" title="Add" aria-label="Add experience">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-exp-body">
                        <div class="emp-exp-list${experienceList.length ? " emp-exp-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, experienceList, onRefresh);
    };

    return mThis;
})();

const ExperienceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" type="text" name="start_date" class="data-input form-control" data-field="start_date" placeholder=" " />
                                    <label vslang="labels.Start Date"></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" type="text" name="end_date" class="data-input form-control" data-field="end_date" placeholder=" " />
                                    <label vslang="labels.End Date"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="period" class="data-input form-control" data-field="period" placeholder=" " />
                                    <label vslang="labels.Period (if no dates)"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="organization" class="form-control data-input" placeholder="Organization" data-field="organization_id"></select>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="position" class="form-control data-input" placeholder="Position" data-field="position_id"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" rows="3" placeholder=" "></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "organization",
                        data: "organizations",
                        textField: "organization",
                        valueField: "id",
                    },
                    {
                        name: "position",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                ],
                contentCreated: (me) => {
                    if (me.controls.start_date) {
                        DateTimePicker.init(me.controls.start_date);
                    }
                    if (me.controls.end_date) {
                        DateTimePicker.init(me.controls.end_date);
                    }
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/experiences/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success");
                                        } else {
                                            cv_interact.success("create_success");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Experience",
                    modifyTitle: "vslang:titles.Edit Experience",
                    targetProp: "employee_experiences",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/experiences/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var EmployeeDocumentComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._displayFileName = (doc) => {
        return (doc.file_name || "").trim() || "_";
    };

    mThis._typeLabel = (doc) => {
        const name = (doc.document_type || "").trim();
        return name !== "" ? name : "_";
    };

    mThis._fileExt = (doc) => {
        const name = mThis._displayFileName(doc);
        const parts = name.split(".");
        return parts.length > 1 ? parts.pop().toLowerCase() : "";
    };

    mThis._fileIconClass = (ext) => {
        if (ext === "pdf") return "fa-solid fa-file-pdf";
        if (["png", "jpg", "jpeg", "gif", "webp"].indexOf(ext) !== -1) {
            return "fa-solid fa-file-image";
        }
        return "fa-solid fa-file";
    };

    mThis._download = (docId) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/employee/documents/download`,
                { id: docId },
            )
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(
                        res.error_message || "Failed to download document.",
                    );
                    return;
                }
                const { data_url, file_name } = res.data || {};
                if (!data_url) {
                    cv_interact.error("Document URL is missing.");
                    return;
                }
                const a = document.createElement("a");
                a.href = data_url;
                a.download = file_name || "document";
                a.target = "_blank";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            });
    };

    mThis._bindActions = (container, empId, documentList, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_doc_btn_add");
        if (addBtn) {
            addBtn.onclick = (e) => {
                e.preventDefault();
                DocumentDialog.show({ emp_id: empId, onClose: refresh });
            };
        }

        container.querySelectorAll(".emp-doc-action-btn--download").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                mThis._download(btn.dataset.docId);
            };
        });

        container.querySelectorAll(".emp-doc-action-btn--delete").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                const docId = btn.dataset.docId;
                cv_interact.confirm(
                    LocaleManager.trans(
                        "Delete this document?",
                        "message_box_default",
                    ),
                    {
                        title: LocaleManager.trans("Delete Document", "titles"),
                        context: "delete",
                        confirmButtonText: LocaleManager.trans(
                            "Delete",
                            "buttons",
                        ),
                    },
                    (confirmed) => {
                        if (!confirmed) return;
                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/employee/documents/delete`,
                                { id: docId },
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "Deleted successfully",
                                            "message_box_default",
                                        ),
                                    );
                                    refresh();
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    },
                );
            };
        });
    };

    mThis.render = (container, documents, empId, onRefresh) => {
        if (!container) return;

        const documentList = Array.isArray(documents) ? documents : [];

        const rowsHtml = documentList.length
            ? documentList
                  .map((doc, index) => {
                      const ext = mThis._fileExt(doc);
                      const description = (doc.description || doc.remarks || "").trim();
                      return `
                <div class="emp-doc-item" data-doc-id="${doc.id}">
                    <div class="emp-doc-item-card${index === 0 ? "" : " emp-doc-item-card--muted"}">
                        <div class="emp-doc-item-head">
                            <span class="emp-doc-file-badge emp-doc-file-badge--${ext || "file"}" aria-hidden="true">
                                <i class="${mThis._fileIconClass(ext)}"></i>
                            </span>
                            <div class="emp-doc-item-main">
                                <div class="emp-doc-title-row">
                                    <h4 class="emp-doc-type">${mThis._escapeHtml(mThis._typeLabel(doc))}</h4>
                                    ${
                                        ext
                                            ? `<span class="emp-doc-ext">${mThis._escapeHtml(ext.toUpperCase())}</span>`
                                            : ""
                                    }
                                </div>
                                <p class="emp-doc-file-name">${mThis._escapeHtml(mThis._displayFileName(doc))}</p>
                                ${
                                    description
                                        ? `<p class="emp-doc-remarks">${mThis._escapeHtml(description)}</p>`
                                        : ""
                                }
                            </div>
                            <div class="emp-doc-actions">
                                <button type="button" class="emp-doc-action-btn emp-doc-action-btn--download" data-doc-id="${doc.id}" title="Download" aria-label="Download">
                                    <i class="fa-solid fa-download"></i>
                                </button>
                                <button type="button" class="emp-doc-action-btn emp-doc-action-btn--delete" data-doc-id="${doc.id}" title="Delete" aria-label="Delete">
                                    <i class="fa-regular fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
                  })
                  .join("")
            : `<div class="emp-doc-empty">
                    <i class="fa-solid fa-folder-open emp-doc-empty-icon"></i>
                    <span class="emp-doc-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-doc-card h-100">
                    <div class="emp-doc-header">
                        <div class="emp-doc-header-title">
                            <span class="emp-doc-header-icon">
                                <i class="fa-solid fa-folder"></i>
                            </span>
                            <span class="emp-doc-header-label" vslang="titles.Documents">Documents</span>
                        </div>
                        <button type="button" class="emp-doc-add-btn" id="_emp_doc_btn_add" title="Add" aria-label="Add document">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-doc-body">
                        <div class="emp-doc-list${documentList.length ? " emp-doc-list--has-rows" : ""}">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, documentList, onRefresh);
    };

    return mThis;
})();

const DocumentDialog = (() => {
    const self = {};
    let dialog = null;

    const bindFileChooser = (me) => {
        me.fileData = null;
        if (me.controls.btn_chooseFile) {
            me.controls.btn_chooseFile.onclick = () => {
                FileChooser.chooseFile(
                    { accept: ".pdf,.png,.jpg,.jpeg,.gif,.webp" },
                    (d) => {
                        me.fileData = d;
                        if (me.controls.documents) {
                            me.controls.documents.value = d.fileName || "";
                        }
                        if (me.controls.file_ext) {
                            me.controls.file_ext.value = d.ext || "";
                        }
                    },
                );
            };
        }
    };

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <select data-style="material" name="document_type" class="form-control data-input" placeholder="Document Type" data-field="document_type_id"></select>
                            </div>
                            <div class="col-12">
                                <label class="form-label fw-semibold">${LocaleManager.trans("File", "labels")} <span class="text-danger">*</span></label>
                                <div class="emp-doc-file-picker d-flex gap-2 align-items-center">
                                    <button type="button" name="btn_chooseFile" class="btn btn-secondary">${LocaleManager.trans("Choose File", "buttons")}</button>
                                    <input type="text" name="documents" class="form-control" disabled placeholder="No file chosen" />
                                    <input type="hidden" name="file_ext" class="data-input" data-field="ext" />
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    <label>Remarks</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    bindFileChooser(me);
                },
                configSelect: [
                    {
                        name: "document_type",
                        data: "document_types",
                        textField: "document_type",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            if (me.fileData) {
                                p.data = me.fileData.dataUrl;
                                p.ext = me.fileData.ext;
                            }

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/employee/documents/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose();
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("Updated document successfully");
                                        } else {
                                            cv_interact.success("Set document successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Set Document",
                    modifyTitle: "Edit Document",
                    targetProp: "document_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/employee/documents/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

"use strict";

var EmployeeManagementComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Employee";
    mThis.defaultPage = 'employee_list';

    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_employee_management_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnAddEmployee");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_employee");
    mThis.elEmpType = mThis.self.querySelector("#_emp_type_id");
    mThis.elStatus = mThis.self.querySelector("#_emp_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_employee");
    mThis.divListContainer = mThis.self.querySelector("#_employee_list_container");
    mThis.divProfileView = mThis.self.querySelector("#_emp_profile_view");
    mThis.divlistView = mThis.self.querySelector("#_employee_list");
    mThis.paginationContainer = mThis.self.querySelector("#container_pagination");
    mThis.div_filter_fields = mThis.self.querySelector("#div_filter_filed");
    mThis.btnBack = mThis.divProfileView.querySelector("#_btn_back_employee");
    mThis.btnPrintCv = mThis.divProfileView.querySelector("#_btn_print_employee_cv");
    mThis.btnEditProfile = mThis.divProfileView.querySelector("#_btn_edit_employee_profile");
    mThis.profileInfoEmployee = mThis.divProfileView.querySelector("#profile_info_employee");
    mThis.profileCardsEmployee = mThis.divProfileView.querySelector("#profile_cards_employee");
    mThis.pages = {
        employee_list: mThis.divListContainer,
        profile_view: mThis.divProfileView,
    };

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.EmployeeListView = new ListView(mThis.divlistView, {
            fetchApi: `${main_view.base_url}/mhr/employee/list-paginate`,
            perPage: 8,
            paginationContainer: mThis.paginationContainer,
            apiCluster: main_view.apiCluster,
            renderItems: (data, list_container) => {
                mThis.renderEmployeeList(list_container, data);
            },
            listContainerClass: null,
        });
         mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                // branch_id: mThis.el_branch.value,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeListView.showPage(mThis.getFilterData());
                },
            };

            EmployeeDialog.show(op);
        };

        mThis.pr_tbl = mThis.EmployeeListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 280 + "px";
        };

        mThis.tblEmployee = mThis.EmployeeListView.getTable();

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.div_filter_fields.addEventListener("change", (e) => {
            if (e.target.classList.contains("filter-field")) {
                e.preventDefault();
                mThis.EmployeeListView.showPage(mThis.getFilterData());
            }
        });

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage("employee_list", mThis.getFilterData());
        };

        mThis.initAlready = true;
    };
      mThis.getFilterData = () => {
        const p = {"search_value":mThis.elSearch.value};
        const elements =  mThis.div_filter_fields.querySelectorAll(".filter-field");
        elements.forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });

        return p;
    };
    mThis.getPageContainer =(pageName)=>{
        return mThis.pages[pageName];
    };

    mThis.initProfileScroll = () => {
        const scrollEl = mThis.divProfileView;
        if (!scrollEl) return;

        const setHeight = () => {
            scrollEl.style.maxHeight = window.innerHeight - 20 + "px";
        };

        setHeight();
        scrollEl.classList.add("overflow-y-auto", "overflow-x-hidden");

        if (!mThis._profileScrollResizeBound) {
            window.addEventListener("resize", setHeight);
            mThis._profileScrollResizeBound = true;
        }
    };
    mThis.renderEmployeeList = (container, data) => {
        data = data ?? [];
        AuthManager.init().then(() => {
            mThis.renderEmployee(container, data);
        });
    };

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._sexLabel = (sex) => {
        if (sex === "M") return LocaleManager.trans("Male", "titles");
        if (sex === "F") return LocaleManager.trans("Female", "titles");
        return sex || "_";
    };

    mThis._maritalLabel = (status) => {
        if (!status) return "_";
        const map = {
            single: LocaleManager.trans("Single", "titles"),
            married: LocaleManager.trans("Married", "titles"),
            divorced: LocaleManager.trans("Divorced", "titles"),
            widowed: LocaleManager.trans("Widowed", "titles"),
        };
        return map[status] || status;
    };

    mThis._payrollTaxLabel = (value) => {
        if (value === "1" || value === 1) {
            return LocaleManager.trans("Tax", "titles");
        }
        return LocaleManager.trans("Non Tax", "titles");
    };

    mThis._statusBadgeClass = (status) => {
        const s = String(status || "").toLowerCase();
        if (s.includes("active")) return "is-active";
        if (s.includes("pending") || s.includes("leave")) return "is-pending";
        if (s.includes("inactive") || s.includes("resign")) return "is-inactive";
        return "is-active";
    };

    mThis._pillText = (value) => {
        if (value == null || value === "") return "_";
        return mThis._escapeHtml(String(value));
    };

    mThis._shortText = (value, max = 48) => {
        if (value == null || value === "") return "_";
        const text = String(value);
        if (text.length <= max) return mThis._escapeHtml(text);
        return mThis._escapeHtml(text.slice(0, max).trim() + "...");
    };

    mThis._formatSalary = (salary, currency) => {
        if (salary == null || salary === "") return "_";
        if (typeof VSMoney !== "undefined" && VSMoney.formatAmount) {
            return VSMoney.formatAmount(salary, currency || "USD");
        }
        return salary;
    };

    mThis._profileLine = (label, rawValue, { gold = false, muted = false, capitalize = false } = {}) => {
        let valueClass = "emp-profile-field-value";
        let display = "";

        if (muted) {
            valueClass += " is-muted";
            display = mThis._escapeHtml(rawValue);
        } else {
            const isEmpty =
                rawValue == null || rawValue === "" || rawValue === "_";
            if (isEmpty) {
                valueClass += " is-muted";
                display = "_";
            } else {
                if (gold) {
                    valueClass += " is-gold";
                }
                if (capitalize) {
                    valueClass += " is-capitalize";
                }
                display = mThis._escapeHtml(String(rawValue));
            }
        }

        return `
            <div class="emp-profile-field">
                <span class="emp-profile-field-label">${label}</span>
                <span class="${valueClass}">${display}</span>
            </div>`;
    };

    mThis._profileLinePassport = (label, passportNumber) => {
        if (!passportNumber) {
            return mThis._profileLine(
                label,
                LocaleManager.trans("not have yet", "titles"),
                { muted: true },
            );
        }
        return mThis._profileLine(label, passportNumber);
    };

    mThis._profileLineExpiry = (label, expiryDate) => {
        return mThis._profileLine(label, expiryDate);
    };

    mThis._employeeCardDetail = (iconClass, value) => `
        <li class="emp-list-card-detail">
            <span class="emp-list-card-detail-icon" aria-hidden="true">
                <i class="${iconClass}"></i>
            </span>
            <span class="emp-list-card-detail-text">${mThis._pillText(value)}</span>
        </li>`;

    mThis.renderEmployee = (container, data) => {
        let html = `<div class="row g-3">`;
        let cmt = 0;
        const defaultPhoto = `${main_view.base_url}/assets/images/default/default-staff.png`;

        if (Array.isArray(data) && data[0]) {
            data.forEach((d) => {
                const photo = d.image_url || defaultPhoto;
                const updatedBy = d.update_user || "System";

                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <article class="emp-list-card">
                            <div class="emp-list-card-header">
                                <div class="emp-list-card-avatar-wrap">
                                    <div class="emp-list-card-avatar">
                                        <img src="${photo}" alt="${mThis._escapeHtml(d.name || "Employee")}">
                                    </div>
                                </div>
                            </div>
                            <div class="emp-list-card-nameband">
                                <span class="emp-list-card-name">${mThis._escapeHtml(d.name || "_")}</span>
                            </div>
                            <div class="emp-list-card-body">
                                <ul class="emp-list-card-details">
                                    ${mThis._employeeCardDetail("fa-solid fa-hashtag", d.code)}
                                    ${mThis._employeeCardDetail("fa-regular fa-calendar", d.date_of_birth)}
                                    ${mThis._employeeCardDetail("fa-solid fa-phone", d.phone_number)}
                                    ${mThis._employeeCardDetail("fa-solid fa-at", d.email)}
                                </ul>
                            </div>
                            <footer class="emp-list-card-footer">
                                <span class="emp-list-card-footer-meta">
                                    <span vslang="titles.Last Updated">Last Updated</span>:
                                    ${mThis._escapeHtml(updatedBy)}
                                </span>
                                <a href="javascript:void(0)" class="emp-list-card-footer-link see-employee-detail" data-id="${d.id}">
                                    <span vslang="titles.View Details">View Details</span>
                                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                                </a>
                            </footer>
                        </article>
                    </div>`;

                cmt++;
            });
        }

        if (cmt === 0) {
            html = `<div class="emp-list-empty">${LocaleManager.trans("Employee not found!", "titles")}</div>`;
        } else {
            html += `</div>`;
        }

        container.innerHTML = html;
        LocaleManager.translateZone(container);

        container.querySelectorAll(".see-employee-detail").forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const employeeId = e.currentTarget.dataset.id;
                mThis.showPage("profile_view", { id: employeeId });
            });
        });
    };

    mThis.renderProfilePlaceholderCard = (container) => {
        if (!container) return;
        container.innerHTML = `
            <div class="emp-skill-card h-100">
                <div class="emp-skill-header">
                    <div class="emp-skill-header-title">
                        <span class="emp-skill-header-icon">
                            <i class="fa-solid fa-briefcase"></i>
                        </span>
                        <span class="emp-skill-header-label" vslang="titles.Experience">Experience</span>
                    </div>
                </div>
                <div class="emp-skill-body">
                    <div class="emp-skill-empty">
                        <i class="fa-solid fa-briefcase emp-skill-empty-icon"></i>
                        <span class="emp-skill-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
                    </div>
                </div>
            </div>`;
        LocaleManager.translateZone(container);
    };

    mThis.renderProfile = (data) => {
        if (!mThis.profileInfoEmployee || !data) return;

        mThis.currentEmployeeProfile = data;

        const defaultPhoto = `${main_view.base_url}/assets/images/default/default-staff.png`;
        const hasPhoto = !!data.image_url;
        const imageUrl = hasPhoto ? data.image_url : defaultPhoto;
        const photoWrapClass = hasPhoto ? "" : " is-empty";

        const addressText = data.address || "";
        const addressTitle = addressText
            ? ` title="${mThis._escapeHtml(addressText)}"`
            : "";

        const html = `
            <div class="emp-profile-wrap">
                <section class="emp-hero">
                    <div class="emp-hero-top">
                        <div class="emp-hero-identity">
                            <div class="emp-avatar-wrap${photoWrapClass}">
                                <img src="${imageUrl}" class="emp-avatar" alt="${mThis._escapeHtml(data.name)}"
                                    onerror="this.style.display='none';this.parentElement.classList.add('is-empty');">
                                <span class="emp-avatar-placeholder"><i class="fa-solid fa-user"></i></span>
                            </div>
                            <div class="emp-hero-info">
                                <div class="emp-hero-name-block">
                                    <div class="emp-hero-name-row">
                                        <h2 class="emp-hero-name text-capitalize">${mThis._escapeHtml(data.name ?? "_")}</h2>
                                        <span class="emp-status-badge ${mThis._statusBadgeClass(data.status)}">${mThis._escapeHtml(data.status ?? "Active")}</span>
                                    </div>
                                    <div class="emp-hero-social">
                                        <a href="javascript:void(0)" class="emp-social-btn emp-social-btn--facebook" title="Facebook" aria-label="Facebook">
                                            <i class="fa-brands fa-facebook-f"></i>
                                        </a>
                                        <a href="javascript:void(0)" class="emp-social-btn emp-social-btn--linkedin" title="LinkedIn" aria-label="LinkedIn">
                                            <i class="fa-brands fa-linkedin-in"></i>
                                        </a>
                                        <a href="${
                                            data.phone_number
                                                ? `https://t.me/${mThis._escapeHtml(String(data.phone_number).replace(/[^0-9+]/g, ""))}`
                                                : "javascript:void(0)"
                                        }" class="emp-social-btn emp-social-btn--telegram" title="Telegram" aria-label="Telegram"${data.phone_number ? ' target="_blank" rel="noopener noreferrer"' : ""}>
                                            <i class="fa-brands fa-telegram-plane"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="emp-hero-stats">
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-id-card"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Employee ID", "labels")}</div>
                                <div class="emp-stat-value">${mThis._escapeHtml(data.code ?? "_")}</div>
                            </div>
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-briefcase"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Position", "labels")}</div>
                                <div class="emp-stat-value text-capitalize">${mThis._escapeHtml(data.position ?? "_")}</div>
                            </div>
                            <div class="emp-stat-card">
                                <span class="emp-stat-icon"><i class="fa fa-user-tag"></i></span>
                                <div class="emp-stat-label">${LocaleManager.trans("Staff Type", "labels")}</div>
                                <div class="emp-stat-value text-capitalize">${mThis._escapeHtml(data.type ?? "_")}</div>
                            </div>
                        </div>
                    </div>
                    <div class="emp-hero-contact row g-3">
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100">
                                <span class="emp-contact-icon"><i class="fa fa-phone"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Phone Number", "labels")}</span>
                                    <span class="emp-contact-value">${mThis._pillText(data.phone_number)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100">
                                <span class="emp-contact-icon"><i class="fa fa-envelope"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Email", "labels")}</span>
                                    <span class="emp-contact-value">${mThis._pillText(data.email)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-4">
                            <div class="emp-contact-item h-100"${addressTitle}>
                                <span class="emp-contact-icon"><i class="fa fa-location-dot"></i></span>
                                <div class="emp-contact-body">
                                    <span class="emp-contact-label">${LocaleManager.trans("Address", "labels")}</span>
                                    <span class="emp-contact-value text-capitalize">${mThis._pillText(addressText)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="emp-personal">
                    <div class="emp-personal-header d-flex flex-wrap align-items-center justify-content-between gap-2">
                        <div>
                            <h5 class="emp-personal-title">
                                <span class="emp-personal-title-icon"><i class="fa fa-user"></i></span>
                                <span>${LocaleManager.trans("Personal Information", "titles")}</span>
                            </h5>
                            <p class="emp-personal-subtitle">${LocaleManager.trans("Employee details and work information", "labels")}</p>
                        </div>
                        <div class="d-inline-flex align-items-center gap-2">
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-movement d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_movement" title="Movement" aria-label="Movement">
                                <i class="fa-solid fa-right-left"></i>
                            </button>
                            <button type="button" class="emp-profile-action-btn emp-profile-action-btn-edit d-inline-flex align-items-center justify-content-center" id="_emp_profile_btn_edit" title="Edit" aria-label="Edit">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                        </div>
                    </div>

                    <div class="emp-profile-groups">
                        <div class="emp-profile-group">
                            <h6 class="emp-profile-group-title">${LocaleManager.trans("Personal", "titles")}</h6>
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Name", "labels"), data.name)}
                                ${mThis._profileLine(LocaleManager.trans("Sex", "labels"), mThis._sexLabel(data.sex))}
                                ${mThis._profileLine(LocaleManager.trans("Nationality", "labels"), data.nationality)}
                                ${mThis._profileLine(LocaleManager.trans("Date Of Birth", "labels"), data.date_of_birth)}
                                ${mThis._profileLine(LocaleManager.trans("Phone Number", "labels"), data.phone_number)}
                                ${mThis._profileLine(LocaleManager.trans("Email", "labels"), data.email)}
                            </div>
                        </div>
                        <div class="emp-profile-group">
                            <h6 class="emp-profile-group-title">${LocaleManager.trans("Work", "titles")}</h6>
                            <div class="emp-profile-field-grid">
                                ${mThis._profileLine(LocaleManager.trans("Staff Type", "labels"), data.type, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Position", "labels"), data.position, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Joining Date", "labels"), data.joining_date, { gold: true })}
                                ${mThis._profileLine(LocaleManager.trans("Salary", "labels"), mThis._formatSalary(data.salary, data.currency_code))}
                                ${mThis._profileLine(LocaleManager.trans("Identity Card", "labels"), data.nid)}
                                ${mThis._profileLine(LocaleManager.trans("Address", "labels"), data.address, { gold: true, capitalize: true })}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;

        mThis.profileInfoEmployee.innerHTML = html;
        LocaleManager.translateZone(mThis.profileInfoEmployee);
        mThis.setProfileActions(data);
        if (mThis.profileCardsEmployee) {
            const cardColClass = "col-12 col-lg-4";
            mThis.profileCardsEmployee.innerHTML = "";
            const skillCol = document.createElement("div");
            skillCol.className = cardColClass;
            const eduCol = document.createElement("div");
            eduCol.className = cardColClass;
            const thirdCol = document.createElement("div");
            thirdCol.className = cardColClass;
            const docCol = document.createElement("div");
            docCol.className = cardColClass;
            mThis.profileCardsEmployee.appendChild(skillCol);
            mThis.profileCardsEmployee.appendChild(eduCol);
            mThis.profileCardsEmployee.appendChild(thirdCol);
            mThis.profileCardsEmployee.appendChild(docCol);
            const refreshProfile = (empId) =>
                mThis.showPage("profile_view", { id: empId });
            EmployeeSkillComponent.render(
                skillCol,
                data.skills || [],
                data.id,
                refreshProfile,
            );
            EmployeeEducationComponent.render(
                eduCol,
                data.educations || [],
                data.id,
                refreshProfile,
            );
            EmployeeExperienceComponent.render(
                thirdCol,
                data.experiences || [],
                data.id,
                refreshProfile,
            );
            EmployeeDocumentComponent.render(
                docCol,
                data.documents || [],
                data.id,
                refreshProfile,
            );
        }
    };

    mThis.setProfileActions = (data) => {
        mThis.currentEmployeeId = data?.id;

        const openEditDialog = () => {
            EmployeeDialog.show({
                id: mThis.currentEmployeeId,
                onClose: () => {
                    mThis.showPage("profile_view", { id: mThis.currentEmployeeId });
                },
            });
        };

        if (mThis.btnEditProfile) {
            mThis.btnEditProfile.onclick = (e) => {
                e.preventDefault();
                openEditDialog();
            };
        }

        const inlineEditBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_edit");
        if (inlineEditBtn) {
            inlineEditBtn.onclick = (e) => {
                e.preventDefault();
                openEditDialog();
            };
        }

        const inlineMovementBtn = mThis.profileInfoEmployee.querySelector("#_emp_profile_btn_movement");
        if (inlineMovementBtn) {
            inlineMovementBtn.onclick = (e) => {
                e.preventDefault();
                if (typeof ProfileMovementDialog === "undefined") return;
                ProfileMovementDialog.show({
                    id: null,
                    emp_id: mThis.currentEmployeeId,
                    employee: mThis.currentEmployeeProfile || null,
                    btn: e.currentTarget,
                    onClose: () => {
                        mThis.showPage("profile_view", { id: mThis.currentEmployeeId });
                    },
                });
            };
        }

        if (mThis.btnPrintCv) {
            mThis.btnPrintCv.onclick = (e) => {
                e.preventDefault();
                cv_interact.info(
                    LocaleManager.trans("Print CV feature is coming soon.", "message_box_default"),
                );
            };
        }
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/employee/form-options`, null)
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elStatus,d.status,'id','name',"",LocaleManager.trans("All Statuses", "titles"),"");
                VSUtil.setComboItems(mThis.elEmpType,d.types,'id','name',"",LocaleManager.trans("All Types", "titles"),"");
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.showPage = async (pageName, op = {}) => {
        if (mThis.self.style.display !== "block") {
            main_view.setContentView(mThis.self, mThis.title_prop);
        }

        switch (pageName) {
            case "employee_list": {
                mThis.currentPage = "employee_list";
                mThis.EmployeeListView.showPage(op);
                break;
            }
            case "profile_view": {
                mThis.currentPage = "profile_view";
                const employeeId = op.id || op.employee_id || op;
                const res = await vsapi.call(
                    `${main_view.base_url}/mhr/employee/details`,
                    { id: employeeId },
                    false,
                    null,
                );
                if (res.status_code !== 200 || !res.data) {
                    cv_interact.error(
                        res.error_message ||
                            LocaleManager.trans("Employee not found", "message_box_default"),
                    );
                    mThis.showPage("employee_list", mThis.getFilterData());
                    return;
                }
                mThis.renderProfile(res.data);
                break;
            }
            default: {
                return;
            }
        }

        const targetPage = mThis.getPageContainer(pageName);
        if (!targetPage || !targetPage.parentElement) return;

        const siblings = Array.from(targetPage.parentElement.children);
        siblings.forEach((div) => {
            if (div !== targetPage && div.style.display !== "none") {
                div.style.display = "none";
            }
        });
        targetPage.style.display = "block";

        if (pageName === "profile_view") {
            mThis.initProfileScroll();
        }
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            mThis.showPage(mThis.defaultPage,mThis.getFilterData());
        });
    };

    return mThis;
})();

const EmployeeDialog = (() => {
    const self = {};
    let dialog = null;

    const ph = (text, required = false) => {
        const t = LocaleManager.trans(text, "labels");
        return required ? `${t} *` : t;
    };

    const wrapField = (controlHtml) => `<div class="mb-0">${controlHtml}</div>`;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal emp-employee-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) =>
                    LocaleManager.trans(
                        me.dataOptions.id ? "Modify Employee" : "Add Employee",
                        "titles",
                    ),
                createContent: () => `
                    <div class="emp-employee-dialog">
                        <div class="row g-3 align-items-start mb-2">
                            <div class="col-md-3">
                                <div id="_emp_dialog_photo" class="emp-dialog-photo-wrap d-flex align-items-center justify-content-center"></div>
                            </div>
                            <div class="col-md-9">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        ${wrapField(
                                            `<input type="text" name="name" class="form-control data-input" data-field="name" placeholder="${ph("Name", true)}" />`,
                                        )}
                                    </div>
                                    <div class="col-md-6">
                                        ${wrapField(
                                            `<input type="text" name="name_kh" class="form-control data-input" data-field="name_kh" placeholder="${ph("Khmer Name", true)}" />`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            `<select data-style="material" name="sex" class="form-control data-input" data-field="sex" placeholder="${ph("Sex")}">
                                                <option value="">${LocaleManager.trans("Select", "labels")}</option>
                                                <option value="M">${LocaleManager.trans("Male", "titles")}</option>
                                                <option value="F">${LocaleManager.trans("Female", "titles")}</option>
                                            </select>`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            `<select data-style="material" name="marital_status" class="form-control data-input" data-field="marital_status" placeholder="${ph("Marital Status", true)}">
                                                <option value="single">${LocaleManager.trans("Single", "titles")}</option>
                                                <option value="married">${LocaleManager.trans("Married", "titles")}</option>
                                                <option value="divorced">${LocaleManager.trans("Divorced", "titles")}</option>
                                                <option value="widowed">${LocaleManager.trans("Widowed", "titles")}</option>
                                            </select>`,
                                        )}
                                    </div>
                                    <div class="col-md-4">
                                        ${wrapField(
                                            `<input type="text" data-type="date" name="date_of_birth" class="form-control data-input" data-field="date_of_birth" placeholder="${ph("Date Of Birth", true)}" />`,
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-secondary-subtle my-3" />

                        <div class="row g-3">
                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="nationality_id" class="form-control data-input" data-field="nationality_id" placeholder="${ph("Nationality", true)}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="nid" class="form-control data-input" data-field="nid" placeholder="${ph("Identity Card", true)}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" data-type="date" name="nid_expiry_date" class="form-control data-input" data-field="nid_expiry_date" placeholder="${ph("Identity Card Expiry", true)}" />`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="nssf_id" class="form-control data-input" data-field="nssf_id" placeholder="${ph("NSSF ID")}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="passport_number" class="form-control data-input" data-field="passport_number" placeholder="${ph("Passport Number")}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" data-type="date" name="passport_expiry_date" class="form-control data-input" data-field="passport_expiry_date" placeholder="${ph("Passport Expiry", true)}" />`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="birth_city_id" class="form-control data-input" data-field="birth_city_id" placeholder="${ph("Place of Birth")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="emp_type_id" class="form-control data-input" data-field="emp_type_id" placeholder="${ph("Employee Type", true)}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="position_id" class="form-control data-input" data-field="position_id" placeholder="${ph("Position", true)}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="phone_number" class="form-control data-input" data-field="phone_number" placeholder="${ph("Phone", true)}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="email" name="email" class="form-control data-input" data-field="email" placeholder="${ph("Email", true)}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="number" name="salary" class="form-control data-input" data-field="salary" placeholder="${ph("Salary")}" />`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" data-type="date" name="joining_date" class="form-control data-input" data-field="joining_date" placeholder="${ph("Joining Date", true)}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="apply_payroll_tax" class="form-control data-input" data-field="apply_payroll_tax" placeholder="${ph("Apply Payroll Tax", true)}"></select>`,
                                )}
                            </div>

                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="spouse_name" class="form-control data-input" data-field="spouse_name" placeholder="${ph("Spouse Name")}" />`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<select data-style="material" name="spouse_emp_id" class="form-control data-input" data-field="spouse_emp_id" placeholder="${ph("Spouse Employee")}"></select>`,
                                )}
                            </div>
                            <div class="col-md-4">
                                ${wrapField(
                                    `<input type="text" name="spouse_occ_code" class="form-control data-input" data-field="spouse_occ_code" placeholder="${ph("Spouse Occupation")}" />`,
                                )}
                            </div>

                            <div class="col-12">
                                ${wrapField(
                                    `<textarea name="address" rows="3" class="form-control data-input" data-field="address" placeholder="${ph("Address", true)}"></textarea>`,
                                )}
                            </div>
                        </div>
                    </div>`,
                contentCreated: (me) => {
                    const photoEl = me.self.querySelector("#_emp_dialog_photo");
                    if (photoEl && !me.controls._empPhotoBox) {
                        me.controls._empPhotoBox = new ImageBox(photoEl, {
                            dataset: { field: "photo" },
                            cssClass: "data-input",
                            defaultPhotoName: "default-staff",
                        });
                    }
                    me.self
                        .querySelectorAll('input[data-type="date"]')
                        .forEach((el) => {
                            if (!el._dtp) new DateTimePicker(el, null);
                        });
                },
                configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "nationality",
                        valueField: "id",
                    },
                    {
                        name: "birth_city_id",
                        data: "cities",
                        textField: "city_name",
                        valueField: "birth_city_id",
                    },
                    {
                        name: "emp_type_id",
                        data: "types",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "position_id",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "apply_payroll_tax",
                        data: "payroll_taxes",
                        textField: "name",
                        valueField: "id",
                    },
                    {
                        name: "spouse_emp_id",
                        data: "employees",
                        textField: "name",
                        valueField: "id",
                        firstOption: {
                            value: "",
                            label: LocaleManager.trans("None", "labels"),
                        },
                    },
                ],
                prepareFormOptions: {
                    targetProp: "employee",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/employee/form-options`,
                        params: (op) => ({ id: op.id }),
                    },
                },
                onPrepareForm: (me, data) => {
                    const emp = data?.employee;
                    const isEdit = Number(me.dataOptions.id) > 0;

                    if (me.controls._empPhotoBox) {
                        if (emp?.image_url) {
                            me.controls._empPhotoBox.setImage(emp.image_url);
                        } else if (!isEdit) {
                            me.controls._empPhotoBox.setImage(null);
                        }
                    }

                    if (isEdit) {
                        me.setReadOnly(true, [
                            "emp_type_id",
                            "position_id",
                            "salary",
                        ]);
                    } else if (me.controls.apply_payroll_tax) {
                        me.controls.apply_payroll_tax.value = "1";
                    }
                },
                buttons: [
                    {
                        label: LocaleManager.trans("Cancel", "buttons"),
                        cssClass: "btn emp-dialog-btn-cancel",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: LocaleManager.trans("Save", "buttons"),
                        cssClass: "btn emp-dialog-btn-save",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            if (me.controls._empPhotoBox) {
                                const photo =
                                    me.controls._empPhotoBox.getImage?.() ||
                                    me.controls._empPhotoBox.getValue?.();
                                if (photo) op.photo = photo;
                            }

                            if (!op.id) {
                                op.branch_id = main_view.branch_id;
                                op.status_id = op.status_id || 10;
                            }

                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/employee/save`,
                                    op,
                                    btn,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (
                                            typeof me.dataOptions.onClose ===
                                            "function"
                                        ) {
                                            me.dataOptions.onClose();
                                        }
                                        cv_interact.success(
                                            me.dataOptions.id
                                                ? LocaleManager.trans(
                                                      "update_success",
                                                      "message_box_default",
                                                  )
                                                : LocaleManager.trans(
                                                      "create_success",
                                                      "message_box_default",
                                                  ),
                                        );
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

"use strict";

"use strict";

"use strict";

"use strict";

"use strict";

"use strict";

var MovementComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Employee Movements";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employeeMovementComponent");

    // mThis.btnAdd = mThis.self.querySelector("#_btnAddMovement");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_emp_movement");
    mThis.elEvent = mThis.self.querySelector("#el_event");
    mThis.elEmployee = mThis.self.querySelector("#el_employee");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Employee",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${data.emp_name ?? ""}</span>
                                <br/>
                                <span style="font-size: 10px; color: #2b3991;">${data.position ?? ""}</span>
                            </div>
                        </div>`;
            },
        },
        {
            title: "Event",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event ?? ""}</p>`;
            },
        },
        {
            title: "Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.event_date ?? ""}</p>`;
            },
        },
        {
            title: "last Updated",
            className: "align-middle",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 10px; color: #2b3991;">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            title: "Impact",
            className: "status text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = "";

                if ((data.impact || "").toLowerCase() === "positive") {
                    cls_class = "text-white text-center border border-success rounded-5 p-1";
                    bg_color = "#28a745";
                } else if ((data.impact || "").toLowerCase() === "neutral") {
                    cls_class = "text-white text-center border border-warning rounded-5 p-1";
                    bg_color = "#ffc107";
                } else if ((data.impact || "").toLowerCase() === "negative") {
                    cls_class = "text-white text-center border border-danger rounded-5 p-1";
                    bg_color = "#dc3545";
                } else {
                    bg_color = "#6c757d";
                }

                return `<div><a class="d-block" data-status="${data.impact}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:100px; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.impact ?? ""}
                            </span>
                        </a></div>`;
            },
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                            <a href="javascript:void(0)" class="btn_movement_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.MovementListView = new ListView("_emp_movement_list", {
            fetchApi: `${main_view.base_url}/mhr/emp-event/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white overflow-hidden rounded-3 header-uppercase",
            listContainerClass: null,
        });

        // mThis.btnAdd.onclick = function (e) {
        //     e.preventDefault();
        //     let op = {
        //         id: null,
        //         btn: e.target,
        //         onClose: () => {
        //             mThis.MovementListView.showPage();
        //         }
        //     };
        //     MovementDialog.show(op);
        // };

        mThis.tblMovement = mThis.MovementListView.getTable();
        mThis.initDropdownMenus(mThis.tblMovement);
        mThis.sh_container = mThis.MovementListView.getListContainer();

        const pr_tbl = mThis.MovementListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 215 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 215 + "px";
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.MovementListView.showPage(mThis.getFilterData());
            };
        });

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.MovementListView.showPage(mThis.getFilterData());
            }, 250);
        };

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            event_id: mThis.elEvent.value,
            emp_id: mThis.elEmployee.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            let f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_movement_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Movement">Modify Movement</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_movement",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Movement">Delete Movement</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_movement",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_movement": {
                        mThis.editMovement(id, menuLink);
                        break;
                    }
                    case "delete_movement": {
                        mThis.deleteMovement(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editMovement = (movement_id, menuLink) => {
        let op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            },
        };
        MovementDialog.show(op);
    };

    mThis.deleteMovement = (movement_id, menuLink) => {
        const op = {
            id: movement_id,
            btn: menuLink,
            onClose: () => {
                mThis.MovementListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this employee movement?",
            {
                title: "Delete Employee Movement",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${main_view.base_url}/mhr/emp-event/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.MovementListView.showPage();
                            }
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            },
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/emp-event/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elEvent, d.events, "id", "name", true, "All Movements", null);
                VSUtil.setComboItems(mThis.elEmployee, d.employees, "id", "name", true, "All Employee", null);
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.MovementListView.showPage(mThis.getFilterData());
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const MovementDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                    <div class="form-group col-12">
                        <label for="employee" class="form-label" vslang="titles.Employee"></label>
                        <select name="employee" class=" data-input" data-field="emp_id"></select>
                    </div>
                    <div class="form-group col-12 d-none">
                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="event" class="form-label" vslang="titles.Movement Type"></label>
                        <select name="event" class=" data-input" data-field="event_id"></select>
                    </div>
                    <div class="form-group col-6">
                        <label for="event_date" class="form-label" vslang="titles.Date"></label>
                        <input name="event_date" class="form-control data-input form_input" data-field="event_date" />
                    </div>
                    <div class="form-group col-12">
                        <label for="remarks" class="form-label" vslang="titles.Remarks"></label>
                        <textarea type="text" class="form-control data-input" data-field="remarks"></textarea>
                    </div>
              </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.event_date);
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
                    },
                    {
                        name: "event",
                        data: "events",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-event/save"].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Add Employee Movement",
                    modifyTitle: "Edit Employee Movement",
                    targetProp: "emp_event",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/emp-event/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: MovementDialog

/** Profile Movement — Branch / Position / Salary / Work Shift */
const ProfileMovementDialog = (() => {
    const self = {};
    let dialog = null;

    const isChecked = (val) =>
        val === true || val === 1 || val === "1" || val === "on";

    const fillCurrentValues = (me, data) => {
        const emp = data?.employee || me.dataOptions.employee || {};
        const branches = data?.branches || [];

        if (me.controls.emp_id) {
            me.controls.emp_id.value = emp.id || me.dataOptions.emp_id || "";
        }

        const branchName =
            emp.branch_name ||
            branches.find((b) => String(b.id) === String(emp.branch_id))?.branch_name ||
            branches.find((b) => String(b.id) === String(emp.branch_id))?.name ||
            "";

        if (me.controls.current_branch) {
            me.controls.current_branch.value = branchName;
        }
        if (me.controls.current_position) {
            me.controls.current_position.value = emp.position || emp.position_title || "";
        }
        if (me.controls.original_salary) {
            me.controls.original_salary.value =
                emp.salary != null && emp.salary !== "" ? emp.salary : "";
        }
        if (me.controls.current_work_shift) {
            me.controls.current_work_shift.value = emp.work_shift || "";
        }
    };

    self.show = (op) => {
        if (!op.emp_id && !op.employee?.id) {
            cv_interact.error(LocaleManager.trans("Employee is required", "message_box_default"));
            return;
        }

        op.emp_id = op.emp_id || op.employee.id;

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal movement-dialog",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="movement-dialog-body">
                            <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />

                            <div class="movement-check-row d-flex flex-wrap align-items-center gap-3 gap-md-4 mb-3">
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_branch" data-field="change_branch" data-section="branch" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Branch">Change Branch</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_position" data-field="change_position" data-section="position" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Position">Change Position</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_salary" data-field="change_salary" data-section="salary" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Salary">Change Salary</span>
                                </label>
                                <label class="movement-check form-check mb-0">
                                    <input type="checkbox" class="form-check-input movement-toggle" name="change_work_shift" data-field="change_work_shift" data-section="work_shift" value="1" />
                                    <span class="form-check-label" vslang="labels.Change Work Shift">Change Work Shift</span>
                                </label>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="branch">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Branch">Current Branch <span class="text-danger">*</span></label>
                                    <input type="text" name="current_branch" class="form-control data-input movement-readonly" data-field="current_branch" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Branch">To Branch <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_branch" class="form-control data-input" placeholder="To Branch" data-field="to_branch_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="branch_remarks" class="form-control data-input" data-field="branch_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="position">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Position">Current Position <span class="text-danger">*</span></label>
                                    <input type="text" name="current_position" class="form-control data-input movement-readonly" data-field="current_position" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Position">To Position <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_position" class="form-control data-input" placeholder="To Position" data-field="to_position_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="position_remarks" class="form-control data-input" data-field="position_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="salary">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Original Salary">Original Salary</label>
                                    <input type="text" name="original_salary" class="form-control data-input movement-readonly" data-field="original_salary" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.New Salary">New Salary <span class="text-danger">*</span></label>
                                    <input type="number" name="new_salary" class="form-control data-input" data-field="new_salary" min="0" step="0.01" />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="salary_remarks" class="form-control data-input" data-field="salary_remarks" />
                                </div>
                            </div>

                            <div class="row g-3 movement-section mb-2" data-section-row="work_shift">
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Current Work Shift">Current Work Shift <span class="text-danger">*</span></label>
                                    <input type="text" name="current_work_shift" class="form-control data-input movement-readonly" data-field="current_work_shift" readonly />
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.To Work Shift">To Work Shift <span class="text-danger">*</span></label>
                                    <select data-style="material" name="to_work_shift" class="form-control data-input" placeholder="To Work Shift" data-field="to_work_shift_id"></select>
                                </div>
                                <div class="col-12 col-md-4">
                                    <label class="form-label" vslang="labels.Remarks">Remarks</label>
                                    <input type="text" name="work_shift_remarks" class="form-control data-input" data-field="work_shift_remarks" />
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    me.syncMovementSections = () => {
                        me.divModal.querySelectorAll(".movement-toggle").forEach((chk) => {
                            const key = chk.dataset.section;
                            const row = me.divModal.querySelector(`[data-section-row="${key}"]`);
                            if (!row) return;
                            row.classList.toggle("is-open", chk.checked);
                            row.querySelectorAll(
                                "input:not([type=checkbox]), select, textarea",
                            ).forEach((el) => {
                                el.disabled = false;
                                el.removeAttribute("disabled");
                                if (el.classList.contains("movement-readonly")) {
                                    el.readOnly = true;
                                }
                            });
                        });
                    };
                    me.divModal.querySelectorAll(".movement-toggle").forEach((chk) => {
                        chk.addEventListener("change", () => {
                            me.syncMovementSections();
                            fillCurrentValues(me, me._formData || {});
                        });
                    });
                    me.syncMovementSections();
                },
                configSelect: [
                    {
                        name: "to_branch",
                        data: "branches",
                        textField: "branch_name",
                        valueField: "id",
                    },
                    {
                        name: "to_position",
                        data: "positions",
                        textField: "position_name",
                        valueField: "id",
                    },
                    {
                        name: "to_work_shift",
                        data: "work_shifts",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.emp_id =
                                me.dataOptions.emp_id || me.dataOptions.employee?.id || p.emp_id;
                            p.change_branch = isChecked(p.change_branch) ? 1 : 0;
                            p.change_position = isChecked(p.change_position) ? 1 : 0;
                            p.change_salary = isChecked(p.change_salary) ? 1 : 0;
                            p.change_work_shift = isChecked(p.change_work_shift) ? 1 : 0;

                            if (
                                !p.change_branch &&
                                !p.change_position &&
                                !p.change_salary &&
                                !p.change_work_shift
                            ) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "Please select at least one change",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }
                            if (p.change_branch && !p.to_branch_id) {
                                cv_interact.warning(
                                    LocaleManager.trans("To Branch is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_position && !p.to_position_id) {
                                cv_interact.warning(
                                    LocaleManager.trans("To Position is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_salary && (p.new_salary === "" || p.new_salary == null)) {
                                cv_interact.warning(
                                    LocaleManager.trans("New Salary is required", "message_box_default"),
                                );
                                return;
                            }
                            if (p.change_work_shift && !p.to_work_shift_id) {
                                cv_interact.warning(
                                    LocaleManager.trans(
                                        "To Work Shift is required",
                                        "message_box_default",
                                    ),
                                );
                                return;
                            }

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-event/save"].join(""),
                                    p,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose(p);
                                        }
                                        cv_interact.success("Set movement successfully");
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Movement",
                    modifyTitle: "Movement",
                    targetProp: "employee",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/emp-event/form-options"].join(""),
                        params: (op) => {
                            return {
                                id: op.id || null,
                                emp_id: op.emp_id || op.employee?.id || null,
                            };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    me._formData = data || {};
                    fillCurrentValues(me, me._formData);
                    if (typeof me.syncMovementSections === "function") {
                        me.syncMovementSections();
                    }
                },
            });

        dialog.show(op);
    };

    return self;
})();
//end:: ProfileMovementDialog

var LeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Leaves";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_emp_leave_component");

    mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_emp_leave");
    // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_leave");

    mThis.cols = [
        {
            transTitle: "",
            className: 'align-middle',
        },
        {
            transTitle: "titles.Employee ID",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<span>${data.emp_code ?? '-'}</span>`;
             }
        },

        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.employee_name ?? "-"}
                            <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
                        </div>`;
            },
        },

        {
            transTitle: "titles.Leave Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.leave_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.start_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.End Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar-check me-1"></i>
                        ${data.end_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Leave Duration",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                const days = Number(data.leave_days ?? 0);
                return `
                    <span style="min-width: 100px;" class="badge bg-light text-danger-emphasis border px-2 py-2">
                        <i class="fa-regular fa-clock me-1"></i>
                        ${days} ${days === 1 ? "Day" : "Days"}
                    </span>
                `;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:250px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = data.status_id;
                const statusKey = (data.status ?? "").toLowerCase();
                const map = {
                    1: {
                        text: "Pending",
                        cls: "bg-warning-subtle text-warning border border-warning",
                    },
                    2: {
                        text: "Approved",
                        cls: "bg-success-subtle text-success border border-success",
                    },
                    3: {
                        text: "Rejected",
                        cls: "bg-danger-subtle text-danger border border-danger",
                    },
                };
                const byName = {
                    pending:
                        "bg-warning-subtle text-warning border border-warning",
                    approved: "bg-success-subtle text-success border border-success",
                    rejected:
                        "bg-danger-subtle text-danger border border-danger",
                };
                const m = map[statusId] || null;
                const label =
                    m?.text ||
                    (statusKey === "terminated"
                        ? "Terminated"
                        : (data.status ?? "â€”"));
                const cls =
                    m?.cls || byName[statusKey] || "bg-light text-muted";
                return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/mhr/leave/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
              tr.dataset.statusid = data.status_id;
              tr.classList.add('leave');
              tr.setAttribute('id',['leave_id',data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            LeaveRequestDialog.show(op);
        };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);
        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

            el.onchange =  (e) => {
           e.preventDefault();
           mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
       });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            // leave_type_id: mThis.elFilter_leaveType.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
                const f = el.dataset.field;
                p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_leave_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Leave">Modify Leave</span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_leave"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Leave">Delete Leave</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_leave"
                },
            ],
        //     adjustPosition:{
        //         top:-200 ,
        //         left:-300
        //    },

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_leave':{
                      mThis.editLeave(id, menuLink);
                      break;
                    }
                    case 'delete_leave':{
                        mThis.deleteLeave(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }



    mThis.editLeave = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(241)) return;
        LeaveRequestDialog.show(op);
    }

    mThis.deleteLeave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this leave request?',{
            title: 'Delete Leave Request',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.LeaveRequestListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = () => {
        vsapi.call(`${main_view.base_url}/mhr/leave/form-options`, null, null, null)
            .then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',"",LocaleManager.trans("All Statuses", "titles"),"");
            VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',"",LocaleManager.trans("All Types", "titles"),"");
        })
    }

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
           main_view.setContentView(mThis.self, mThis.title_prop);
        });
    }
    return mThis;
})();

const LeaveRequestDialog = (()=>{

    const self = {};
    let dialog = null;
     self.show = (op)=>{

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <select data-style="material" name="employee_id" class="form-control data-input" placeholder="Employee"  data-field="emp_id"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="leave_type" class="form-control data-input" placeholder="Leave Type"  data-field="leave_type_id"></select>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="start_date" class="form-control data-input" data-field="start_date" required />
                                    <label>Start Date</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="vs-material-field">
                                    <input data-type="date" name="end_date" class="form-control data-input" data-field="end_date" required />
                                    <label>End Date</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" placeholder=" "></textarea>
                                    <label>Remarks</label>
                                </div>
                            </div>
                        </div>`,].join("");
                },
                contentCreated: (me) => {
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
                        // textField:"name",
                        valueField: "id",
                    },
                    {
                        name: "leave_type",
                        data: "leave_types",
                        textField: "leave_type",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/leave/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated set leave successfully");
                                        }
                                        else
                                        {
                                            cv_interact.success("Set leave successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Set Leave",
                    modifyTitle: "Edit Leave",
                    targetProp: "leave_request",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/leave/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                },
            });

        dialog.show(op);
     }

    return self;
})();
//end:: LeaveRequestDialog

"use strict";
var PayrollComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_payrollComponent");

    mThis.title_prop = "Payroll";
    mThis.elAuthorized = mThis.self.querySelector("#el_authorized");
    mThis.elDisbursed = mThis.self.querySelector("#el_disbursed");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddpayroll");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_payroll");

    const monthNames = [
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

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap",
            data: "",
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => `<div class="d-block">
                            <p class="p-0 m-0" style="color:#2b3991;">${
                                data.name
                            }</p>
                            <small class="text-success">${
                                data.p_number
                                    ? data.p_number == 1
                                        ? "(First)"
                                        : data.p_number == 2
                                        ? "(Second)"
                                        : "Other"
                                    : ""
                            }</small>

                        </div>`,
        },
        {
            title: "Duration",
            className: "align-middle w-15",
            data: (data) =>
                `<span class="text-dark">(<small class="text-dark">${
                    data.start_date ?? ""
                }â€‹ <small class="text-warning">~</small> ${
                    data.end_date ?? ""
                }</small>)</span>`,
        },
        {
            title: "Staff Count",
            className: "align-middle",
            data: (data) =>
                `<a href="javascript:void(0);" class="text-success show_payroll_list" data-id="${data.id}">${data.head_count}</a>`,
        },

        {
            title: "Total",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.total,
                    data.currency_code ?? 'USD'
                )}</p>`;
            },
        },
        {
            title: "Exchange Rate",
            className: "align-middle w-12",
            data: (data) => {
                let x_rate = data.exchange_rate;
                // if (x_rate >= 1) {
                //     x_rate = VSMoney.formatAmount(x_rate, null, null, {
                //         minimumFractionDigits: 2,
                //         maximumFractionDigits: 2,
                //         useGrouping: true,
                //     });
                // }
                return `<p class="p-0 m-0">${x_rate}</p>`;
            },
        },
        {
            title: "Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="text-warning fw-semibold">${data.update_user}</span>
                    <span>
                        <small class="text-nowrap">${data.update_date}</small>
                    </span>
                </div>`;
            },
        },
        {
            title: "Authorize",
            className: "authorized text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-2";
                let bg_color = "";
                let cls_icon = "";

                if (data.authorized === 1) {
                    cls_class =
                        "text-white text-center border border-success rounded-2 p-1";
                    bg_color = "#28a745";
                    cls_icon = "fa fa-check text-center align-center justify-content-center";
                } else if (data.authorized === 0) {
                    cls_class =
                        "text-white text-center align-center border border-warning rounded-2 p-1";
                    bg_color = "#ffc107";
                    cls_icon = "fa fa-times text-center align-center justify-content-center";

                }

                return `<div><a class="d-block" data-authorized="${
                    data.authorized
                }" data-id="${data.id}" href="javascript:void(0)">
                            <small style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                            <i class="${cls_icon}" style="font-size: 10px;"></i>
                                ${data.authorized == 0 ? "Pending" : "Approved"}
                            </small>
                        </a></div>`;
            },
        },
        {
            title: "Disbursed",
            className: "status text-nowrap align-middle",
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-2";
                let bg_color = "";
                let cls_icon = "";

                if (data.disbursed === 1) {
                    cls_class =
                        "text-white text-center border border-success rounded-2 p-1";
                    bg_color = "#28a745";
                    cls_icon = "fa fa-check text-center align-center justify-content-center";
                } else if (data.disbursed === 0) {
                    cls_class =
                        "text-white text-center border border-warning rounded-2 p-1";
                    bg_color = "#ffc107";
                    cls_icon = "fa fa-times text-center align-center justify-content-center";
                }

                return `<div><a class="d-block" data-status="${
                    data.disbursed
                }" data-id="${data.id}" href="javascript:void(0)">
                            <small style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                            <i class="${cls_icon}" style="font-size: 10px;"></i>
                                ${data.disbursed == 0 ? "Pending" : "Disbursed"}
                            </small>
                        </a></div>`;
            },
        },
        {
            title: "Actions",
            className: "align-middle",
            data: (data) =>
                `<div class="d-flex align-items-center gap-1">
                    <button class="btnAuthorized d-flex justify-content-center align-items-center bg-info rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnAuthorized">
                            <i class="fa-solid fa-check tool-tip" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Authorize','titles')}</span></i>
                    </button>
                    <button class="btnReset d-flex justify-content-center align-items-center bg-danger rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnReset">
                            <i class="fa-solid fa-reply fs-10 tool-tip" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Reset','titles')}</span></i>
                    </button>
                    <button class="btnDisbursed d-flex justify-content-center align-items-center bg-success rounded-circle border-0" data-id="${data.id}"
                            style="width: 25px; height: 25px;" id="_btnDisburse">
                            <i class="fa-solid fa-square-check tool-tip fs-6" style="color: #fff;"><span class="tool-tiptext">${LocaleManager.trans('Disburse','titles')}</span></i>
                    </button>
                </div>`,
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-end align-items-end">
                    <a href="javascript:void(0)"
                       class="btn_payroll_action"
                       data-id="${data.id}">
                        <img src="${main_view.asset_url}/images/icons/more_vert (3).svg" />
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollListView = new ListView("_payroll_list", {
            fetchApi: `${main_view.base_url}/mhr/payroll/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.classList.add("tr_action");

            },
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                // id: 1,
                btn: e.target,
                onClose: (p) => {
                    if (!p) return;

                    mThis.PayrollListView.showPage();
                },
            };
            // content.parentElement.classList.add('d-none');
            if (!AuthManager.allowed(473)) return;
            AddPayRollListDialog.show(op);
        };

        mThis.pr_tbl = mThis.PayrollListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };

        mThis.pr_tbl.onclick = (e) => {
            let lnk = VSUtil.closestLimited(e.target, "a.show_payroll_list");
            if (lnk) {
                const op = { payroll_id: lnk.dataset.id };
                VSRoute.showComponent("PayrollListComponent", op);
                return;
            }

            //     // *** You can add other action button click here like mThis
            //    lnk = VSUtil.closestLimited(e.target,'a.other_click_action');
            //    if(lnk){
            //      //do something when user clicks on "other_click_action"
            //      return;
            //    }
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.PayrollListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.PayrollListView.showPage(mThis.getFilterData());
            }, 200);
        });

        mThis.pr_table = mThis.PayrollListView.getTable();
        mThis.initDropdownMenus(mThis.pr_table);
        mThis.setActionListeners();
        mThis.initAlready = true;
    };
    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btnAuthorized");
            if (btn) {
                mThis.authorizePayroll(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btnReset");
            if (btn) {
                mThis.resetPayroll(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btnDisbursed");
            if (btn) {
                mThis.disbursePayroll_all(btn.dataset.id, btn);
            }
        });
    };
    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_payroll_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2"> Authorize </span>',
                    icon: '<i class="fa-regular fa-circle-check"></i>',
                    name: "change_authorize",
                },
                {
                    html: '<span class="ps-2"> Reset</span>',
                    icon: '<i class="fa fa-reply"></i>',
                    name: "reset_authorize",
                },
                {
                    html: '<span class="ps-2"> Disburse All</span>',
                    icon: '<i class="fa-solid fa-square-check"></i>',
                    name: "change_disbursed",
                },
                {
                    html: '<span class="ps-2">Modify Payroll</span>',
                    icon: '<i class="fa-regular fa-edit fs-5"></i>',
                    name: "edit_payroll",
                },
                {
                    html: '<span class="ps-2">Delete Payroll</span>',
                    icon: '<i class="fa-regular fa-trash-can fs-5"></i>',
                    name: "delete_payroll",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const authorized = container.dataset.authorized;

                if (authorized == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display = menu[item].dataset.mnuaction === "edit_payroll" || menu[item].dataset.mnuaction === "delete_payroll" ||menu[item].dataset.mnuaction === "change_authorize"? "none": "block";
                        }
                    }
                }
            },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_authorize":
                        mThis.authorizePayroll(id, menuLink);
                        break;
                    case "reset_authorize":
                        mThis.resetPayroll(id, menuLink);
                        break;
                    case "change_disbursed":
                        mThis.disbursePayroll_all(id, menuLink);
                        break;
                    case "edit_payroll":
                        mThis.editPayroll(id, menuLink);
                        break;
                    case "delete_payroll":
                        mThis.deletePayroll(id, menuLink);
                        break;
                }
            },
        };
        new VSDropdownMenu(menuOptions);
        table.querySelectorAll("a.btn_payroll_action").forEach((e) => {
            const isAuthorized = e.dataset.authorized == "1";

            menuOptions.menus.forEach((el, i) => {
                // const action = el.dataset.mnuaction;
                if (isAuthorized) {
                    if (
                        el.name === "edit_payroll" ||
                        el.name === "delete_payroll"
                    ) {
                        delete menuOptions.menus[i];
                    }
                } else {
                    menuOptions.menus[i + 1] = menuOptions.menus[i];
                }
            });
        });
    };

    mThis.authorizePayroll = (id, menuLink) => {
        let p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };

        if (!AuthManager.allowed(474)) return;
        cv_interact.confirm(
            "Authorize this payroll?",
            {
                title: "Authorize Payroll",
                context: "authorize",
                confirmButtonText: "Authorize",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${mThis.base_url}/mhr/payroll/authorize`, p)
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Authorized successfully");
                                mThis.PayrollListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };
    mThis.resetPayroll = (id, menuLink) => {
        const p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        if (!AuthManager.allowed(475)) return;
        cv_interact.confirm(
            'html:<span class="d-block">Are you sure you want to reset this payroll?</span> <small>This action will reverse all payroll transactions from staff payroll accounts back to the master payroll account!</small>',
            {
                title: "Reset Payroll",
                context: "delete",
                confirmButtonText: "Reset Now",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${mThis.base_url}/mhr/payroll/reset`,
                            p,
                            false,
                            null
                        )

                        .then((res) => {

                            if (res.status_code === 200) {
                                cv_interact.success("Payroll has been reset!");
                                mThis.PayrollListView.showPage(mThis.getFilterData());
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };
    mThis.disbursePayroll_all = (id, menuLink) => {
        const p = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        if (!AuthManager.allowed(476)) return;
        cv_interact.confirm(
            "Disburse this payroll?",
            {
                title: "Disburse Payroll",
                context: "disburse",
                confirmButtonText: "Disburse",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${mThis.base_url}/mhr/payroll/disburse-all`, p,false)
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Payroll disbursement was successful!");
                                mThis.PayrollListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };

    mThis.editPayroll = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollListView.showPage();
            },
        };
        if (!AuthManager.allowed(477)) return;
        AddPayRollListDialog.show(op);
    };
    mThis.deletePayroll = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink
        };
        if (!AuthManager.allowed(478)) return;
        cv_interact.confirm(
            "Delete this payroll?",
            {
                title: "Delete Payroll",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/payroll/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Payroll has been deleted!");
                                mThis.PayrollListView.showPage(mThis.getFilterData());
                            } else cv_interact.error(res.error_message);
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            }
        );
    };

    mThis.getFilterData = () => {
        const filters = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/payroll/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elAuthorized,
                    d.authorized,
                    "id",
                    "name",
                    true,
                    "All",
                    null
                );
                VSUtil.setComboItems(
                    mThis.elDisbursed,
                    d.disbursed,
                    "id",
                    "name",
                    true,
                    "All",
                    null
                );
            });
    };
    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.PayrollListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const AddPayRollListDialog = (() => {
    const self = {};
    let dialogAdd = null;
    self.show = (op) => {
        const months = [
            { value: 0, name: "select month" },
            { value: 1, name: "Jan" },
            { value: 2, name: "Feb" },
            { value: 3, name: "Mar" },
            { value: 4, name: "Apr" },
            { value: 5, name: "May" },
            { value: 6, name: "Jun" },
            { value: 7, name: "Jul" },
            { value: 8, name: "Aug" },
            { value: 9, name: "Sep" },
            { value: 10, name: "Oct" },
            { value: 11, name: "Nov" },
            { value: 12, name: "Dec" },
        ];

        dialogAdd =
            dialogAdd ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 11 },
                        (_, i) => currentYear + i
                    );

                    return [
                        `<div class="row">
                        <div class="form-group col-4">
                            <label for="month" class="form-label" vslang="titles.Month"></label>
                            <select name="month" class="data-input" data-field="month">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="year" class="form-label" vslang="titles.Year"></label>
                            <select name="year" class="data-input" data-field="year">
                                <option value="0">select year</option>
                                ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>

                        <div class="form-group col-4">
                            <label for="p_number" class="form-label" vslang="titles.Payroll Number"></label>
                            <select name="p_number" class="data-input form_input" data-field="p_number">
                                <option value="0">select number</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="name" class="form-label" vslang="titles.Name"></label>
                            <input name="name" class="form-control data-input form_input" data-field="name" placeholder="auto" />
                        </div>
                        <div class="form-group col-4">
                            <label for="start_date" class="form-label" vslang="titles.Start Date"></label>
                            <input name="start_date" class="form-control data-input form_input" data-field="start_date" />
                        </div>
                        <div class="form-group col-4">
                            <label for="end_date" class="form-label" vslang="titles.End Date"></label>
                            <input name="end_date" class="form-control data-input form_input" data-field="end_date" />
                        </div>
                        <div class="form-group col-4">
                            <label for="currency_code" class="form-label" vslang="titles.Currency">Currency</label>
                            <select  class="modal-select data-input" name="currency_code" data-field="currency_code" disabled>
                            </select>
                        </div>
                        <div class="form-group col-4">
                            <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate"></label>
                            <input name="exchange_rate" type="number" class="form-control data-input" data-field="exchange_rate" />
                        </div>


                    </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    DateTimePicker.init(me.controls.start_date);
                    DateTimePicker.init(me.controls.end_date);
                },

                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    }
                ],

                buttons: [
                    {
                        label: '<span class="text-warning" vslang="titles.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span vslang='titles.save'></span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/payroll/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Payroll is updated successfully"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New payroll is created successfully"
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Add Payroll",
                    modifyTitle: "Edit Payroll",
                    targetProp: "payrolls",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/payroll/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },

                },

                onPrepareForm: (me, data) => {
                    me.controls.currency_code.value = VSMoney.getCurrency().code;
                    const { payrolls } = data;
                    if (payrolls) {
                        me.controls.name.value = payrolls.name;
                        me.controls.month.value = payrolls.month;
                        me.controls.year.value = payrolls.year;
                        me.controls.start_date.value = payrolls.start_date;
                        me.controls.end_date.value = payrolls.end_date;
                        me.controls.exchange_rate.value = payrolls.exchange_rate;
                        me.controls.p_number.value = payrolls.p_number;
                        // me.controls.total.value = payrolls.total;
                    } else {
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/payroll/get-end-date",
                                ].join(""),
                                null,
                                null,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.controls.start_date.value =
                                        res.data.end_date;
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    }
                    me.payroll_name = "";
                    me.month = payrolls ? months[payrolls.month].name : "";
                    me.year = payrolls ? "-" + payrolls.year : "-";
                    me.p_number = payrolls ? "-" + payrolls.p_number : "-";
                    me.controls.month.onchange = (e) => {
                        me.month = e.target.textContent;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };
                    me.controls.year.onchange = (e) => {
                        me.year = "-" + e.target.textContent;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };
                    me.controls.p_number.onchange = (e) => {
                        me.p_number = "-" + e.target.value;
                        me.payroll_name = me.month + me.year + me.p_number;
                        me.controls.name.value = me.payroll_name;
                    };

                    LocaleManager.translateZone(me.divModal);
                },

            });

        dialogAdd.show(op);
    };
    return self;
})();

// document.addEventListener('DOMContentLoaded', () => {
//     document.body.addEventListener('click', function (event) {
//         if (event.target.classList.contains('payroll-link')) {
//             const payrollId = event.target.getAttribute('data-payroll-id');
//             const option = {
//                  payroll_id: payrollId
//                 };

//             if (typeof PayrollListComponent !== 'undefined' && PayrollListComponent.show) {
//                 VSRoute.showComponent('PayrollListComponent', option);
//                 //PayrollListComponent.show(option);
//             } else {
//                 console.error('PayrollListComponent.show is not defined.');
//             }
//         }
//     });
// });

"use strict";

var PayrollListComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_payrollListComponent");

    mThis.title_prop = "Payroll List";
    mThis.elFilter = mThis.self.querySelector('#el_filter_payrollList');
    mThis.elFilterBranch = mThis.self.querySelector('#el_filter_branch');
    mThis.btnImport = mThis.self.querySelector("#_btnImport");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_payroll_list");
    mThis.btnCalculate = mThis.self.querySelector("#_btnCalculate");
    mThis.btnAuthorized = mThis.self.querySelector("#_btnAuthorized");
    mThis.btnBackToPayroll = mThis.self.querySelector("#_btnBackToPayroll");
    mThis.btnDisburse = mThis.self.querySelector("#_btnDisburse");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_payrollList");
    mThis.payment_info = mThis.self.querySelector("#payment_info");
    mThis.btnPrint = mThis.self.querySelector("#_print_pay_slip");
    mThis.btnReverse = mThis.self.querySelector("#_btnReverseTransactions");
    mThis.div_payrollList = mThis.self.querySelector('#_payrollList_list');
    mThis.btnIssues = mThis.self.querySelector("#_btn_issues");
    mThis.issues_list = mThis.self.querySelector("#_issues_list");

    mThis.cols = [

        {
            title: "",
            className: 'align-middle text-capitalize text-nowrap',
            // data: (data, index, i) => { return (index + 1) },

        },

        {
            title: "Employee",
            className: "align-middle text-start w-15",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span class="text-nowrap">${
                                    data.emp_name ?? ""
                                }</span>
                                <br/>
                                <small class="text-dark">${
                                    data.emp_position ?? ""
                                }</small>
                            </div>
                        </div>`;
            }
        },

        {
            title: "Salary",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.salary, data.currency_code)}</p>`;
                //return `<p class="p-0 m-0">${main_view.currency.symbol + formattedNumber(data.salary ?? '0.00')}</p>`;
            }
        },
        {
            title: "Taxable BFT",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount((data.taxable_benefit || data.benefit_taxable), data.currency_code)}</p>`;
            }
        },
        {
            title: "Nontaxable BFT",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount((data.nontaxable_benefit || data.benefit_non_tax), data.currency_code)}</p>`;
            }
        },
        {
            title: "BFT (Flat Tax)",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                if (!data.used_amount || Object.keys(data.used_amount).length === 0) {
                    return `<p class="p-0 m-0">${VSMoney.formatAmount(0, data.currency_code)}</p>`;
                }

                const flatTaxDetails = Object.entries(data.used_amount)
                    .map(([taxRate, amount]) => {
                        const formattedAmount = VSMoney.formatAmount(amount, data.currency_code);
                        return `${formattedAmount} (${taxRate}%)`;
                    })
                    .join('<br>');

                return `<p class="p-0 m-0">${flatTaxDetails}</p>`;
            }
        },

        {
            title: "Deduction",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.deduction, data.currency_code)}</p>`;
            }
        },
        {
            title: "Allowance",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.allowance, data.currency_code)}</p>`;
            }
        },
        {
            title: "Tax Rate",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.tax_rate ?? ''} %</p>`;
            }
        },
        {
            title: "Bias",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.bias, data.currency_code)}</p>`;
            }
        },

        {
            title: "Tax Base",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.tax_base, data.currency_code)}</p>`;
            }
        },
        // {
        //     title: "Benefit Tax Flat Rate",
        //     className: "align-middle text-nowrap",
        //     data: (data, index, tr) => {
        //         return `<p class="p-0 m-0">${data.flat_tax_rate ?? ''} %</p>`;
        //     }
        // },
        {
            title: "Benefit Tax",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount((data.taxable_benefit || data.benefit_tax), data.currency_code)}</p>`;
            }
        },
        {
            title: "Total",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0 ${data.disbursed == '1' ? 'text-success' : ''}">${VSMoney.formatAmount(data.total_salary, data.currency_code)}</p>`;
            }
        },
        {
            title:"Action",
            className: "col_action align-middle",
            data: (data,index,tr) => {
                return [
                `<div class="d-flex justify-content-center align-items-center">`,
                    `<div class="text-center gap-2 d-flex flex-wrap">`,
                        `<a href="javascript:void(0)"`,
                           `class="btn_payroll_list_action"`,
                           `data-id="${data.id}"`,
                           `data-empid="${data.emp_id}"`,
                           `data-payrollid="${data.payroll_id}"`,
                           `data-disbursed="${data.disbursed || 0}"`,
                           `aria-haspopup="true"`,
                           `aria-expanded="false">`,
                           //'<span class="d-flex justify-item-center align-items-center p-1 bg-primary fw-semibold rounded-3 text-white">',(index+1),'</span>',
                            `<i class="fa-solid fa-ellipsis-vertical tool-tip fs-3 " style="color:#2b3991;"><span class="tool-tiptext fs-6 ">Action</span></i>`,
                        `</a>`,
                    `</div>`,
                `</div>`].join('');
            }
        },


    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PayrollList_ListView = new ListView(mThis.div_payrollList,{
            fetchApi : `${main_view.base_url}/mhr/payroll/staff/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            rowCreated:(data,index,tr)=>{
               tr.dataset.id = data.id;
               tr.dataset.payrollid = data.payroll_id;
               tr.dataset.empid = data.emp_id;
            },
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            listContainerClass: null
        });

        mThis.btnCalculate.onclick = function (e) {
            e.preventDefault();
            const op = {
                payroll_id: mThis.getFilterData().payroll_id
            };
            if (!AuthManager.allowed(480)) return;
            cv_interact.confirm('html:<span class="fw-semibold d-block">Calculate this payroll list?</span><small>This process will calculate net payment including their salary and other benefits for all staffs in the payroll</small>', {
                title: 'Calculate Payroll List',
                context: 'calculate',
                confirmButtonText: "Calculate"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/calculate'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            const d = res.data || {};
                            const error_count = d.error_count || 0;
                            const error_message = error_count > 0 ? `${error_count} cases failed`:'';
                            cv_interact.success([`Payroll has been calculated : ${d.success_count || 0 } cases affected! ${d.issues_count}`].join(''));
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                            mThis.showIssues(d);

                        } else {
                            cv_interact.warning(res.error_message);
                        }
                    });
                }
            });
        };

        mThis.showIssues = function (d) {
            let issues_count = d.issues_count || 0;
            if (issues_count > 0) {
                mThis.btnIssues.classList.remove('d-none');

                let html = '';
                d.issues.forEach((issue) => {
                    html += `
                    <div class="d-flex flex-wrap gap-2">
                        <span>Name: ${issue.name ?? 'N/A'}</span>
                        <span>Issue: ${issue.issue ?? 'N/A'}</span>
                        <div class="border w-100"></div>
                    </div>`;
                });
                mThis.issues_list.innerHTML = html;
            } else {
                mThis.btnIssues.classList.add('d-none');
                mThis.issues_list.innerHTML = null;
                mThis.issues_list.parentElement.classList.remove('show');
            }

        }
        mThis.btnBackToPayroll.onclick = function (e) {
            e.preventDefault();
            let lnk = VSUtil.closestLimited(e.target, "#_btnBackToPayroll");
            if (lnk) {
                VSRoute.showComponent("PayrollComponent");
                return;
            }
        }
        mThis.btnDisburse.onclick = function (e) {
            e.preventDefault();

            const op = {
                payroll_id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(481)) return;
            cv_interact.confirm('html:<span class="d-block fw-semibold text-success">Disburse this payroll list? </span><small>This process will transfer cash to all employee`s payroll accounts</small>', {
                title: 'Disburse Payroll List',
                context: 'update',
                confirmButtonText: "Disburse"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/disburse-all'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('Salary disbursements were successful!');
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        };

        mThis.btnAuthorized.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(474)) return;

             cv_interact.confirm(
                 'html:<span class="d-block fw-semibold text-success">Authorize this payroll list? </span><small>This process will authorize payroll list</small>',
                 {
                     title: "Authorize Payroll",
                     context: "authorize",
                     confirmButtonText: "Authorize",
                 },
                 function (e) {
                     if (e) {
                         vsapi
                             .call(`${mThis.base_url}/mhr/payroll/authorize`, op)
                             .then((res) => {
                                 if (res.status_code === 200) {
                                     cv_interact.success(
                                         "Payroll is now authorized successfully"
                                     );
                                    //  mThis.PayrollList_ListView.showPage();
                                 } else cv_interact.error(res.error_message);
                             });
                     }
                 }
             );
        }
        mThis.btnReverse.onclick = function (e) {
            e.preventDefault();

            const op = {
                payroll_id: mThis.elFilter.value
            };
            if (!AuthManager.allowed(482)) return;
            cv_interact.confirm('html:<span class="d-block fw-semibold text-success">Reverse this payroll list? </span><small>This process will transfer cash back to all master accounts</small>', {
                title: 'Reverse Payroll List',
                context: 'update',
                confirmButtonText: "Reverse Payroll List?"
            }, function (confirmation) {
                if (confirmation) {
                    vsapi.call([main_view.base_url, '/mhr/payroll/reverse'].join(''), op, false, null).then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('Salary reverse to master account successfully!');
                            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                        } else cv_interact.error(res.error_message);
                    });
                }
            });
        };

        mThis.btnImport.onclick = function (e) {
            e.preventDefault();

            const op = {
                id: null,
                payroll_id: PayrollListComponent.elFilter.value,
                // btn: e.target,
                onClose: () => {
                    mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                }
            };
            if (!AuthManager.allowed(213)) return;
            PayRollImportDialog.show(op);
        };
        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_content = mThis.self.querySelector("#sub_content");
            sub_content.classList.remove("d-none");
            const pay_slip = mThis.self.querySelector("#pay_slip");
            pay_slip.classList.add("d-none");
        };

        const pr_tbl = mThis.PayrollList_ListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 230) + 'px';
        sh_parent.classList.add("overflow-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 230) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);///

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{
            el.onchange =  (e) => {
           e.preventDefault();
           mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
       });
       let timeOut = null;
       mThis.elSearch.onkeyup = function (e) {
        e.preventDefault();
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            mThis.PayrollList_ListView.showPage(mThis.getFilterData());
        }, 250);
    };

        mThis.initAlready = true;

    };

    mThis.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_payroll_list_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html: '<span class="ps-2 " vslang="titles.View Pay Slip">View Pay Slip</span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "pay_slip",
                },
                // {
                //     html:'<span class="ps-2  " vslang="titles.Disburse"></span>',
                //     icon:`<i class="fa-solid fa-square-check"></i>`,
                //     cssClass:"border-bottom pb-2",
                //     name:"disburse_payroll_list"
                // },
                {
                    html:'<span class="ps-2  " vslang="titles.Add Deduction">Add Deduction</span>',
                    icon:`<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"add_deduction"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Remove from List">Remove from List</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_payroll_list"
                },

            ],
            onShow: (me, container) => {

                const menu = me.getActiveMenus(container);
                const disburse = container.dataset.disbursed;


                if (disburse == 1) {
                    for (const item in menu) {
                        if (menu[item] && menu[item].style) {
                            menu[item].style.display = (menu[item].dataset.mnuaction === 'delete_payroll_list' || menu[item].dataset.mnuaction === 'add_deduction' || menu[item].dataset.mnuaction === 'disburse_payroll_list') ? 'none' : 'block';
                        }

                    }
                }

            },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'pay_slip':{
                      mThis.viewPayment(id, menuLink);
                      break;
                    }
                    case 'add_deduction':{
                      mThis.addDeduction(id, menuLink);
                      break;
                    }

                    case 'disburse_payroll_list':{
                      const id = menuLink.dataset.id;
                      //const payroll_id = menuLink.dataset.payrollid;
                      mThis.disburseOne(id, null, null, menuLink);
                      break;
                    }
                    case 'delete_payroll_list':{
                        mThis.deletePayrollList(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }

    mThis.renderPayment = (data) => {
       let html = '';
       let benefit_flat_rate = null;
       let div_BFT  = '';

       if (data.benefit_flat_rate != null) {
            const parts = data.benefit_flat_rate.split('|').filter(part => part);

            benefit_flat_rate = parts.map(part => {
                const [bft, bftr] = part.split('@');
                return { BFT: bft, BFTR: bftr };
            });

            div_BFT = benefit_flat_rate
            .map(value => {
                return `${VSMoney.formatAmount(value.BFT,data.currency_code)} (${value.BFTR} %)`;
            })
            .join(' & ');

        }
         html += `
        <style>
            .payment_card {

            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px;
            width: 98%;


            }
            .payment_details {
                display: flex;
                justify-content: center;
                height: 510px;
            }

            .payment-header {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 10px;
            padding-bottom: 20px;
            }
            .payment-logo {
                position: absolute;
                left: 0;
            }

            .payment-title {
                text-align: center;
                flex-grow: 1;
            }
            .payment_profile {
                gap: 10px;
                justify-content: center;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
            }

            .payment_img {
                display: flex;
                justify-content: center;
                width: 80px;
                height: 80px;
                overflow: hidden;
                border-radius: 50%;

            }

            .payment_table{
                display: flex;
                padding: 10px;
            }

        </style>
            <div class="payment_card overflow-y-auto overflow-x-hidden">
                <div class="payment-header">
                    <div class="payment-logo">
                        <img src="${main_view.base_url}/assets/images/logo/lc_logo.svg" alt="Company Logo">
                        </div>
                        <div class="payment-title">
                        <h4>Pay Slip : ${data.start_date} - ${data.end_date}</h4>
                        </div>

                        </div>

                        <div class="payment_profile">
                        <div class="row cols-2 mb-0">
                        <div class="col-2">
                        <div class="payment_img" data-id="" data-imageurl="">
                        <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 10px;"/>
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize data-get">${data.emp_name}</p>
                            </div>

                           <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Sex</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">
                                    ${data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other'}
                                </p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee ID</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${data.emp_code}</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Branch</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.branch_name}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Position</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.emp_position}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Join Date</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${data.joining_date}</p>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="payment_table row "style="display: flex !important">
                <div class="col-6">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Salary </td>
                                <td>${VSMoney.formatAmount(data.p_salary,data.currency_code)}</td>
                            </tr>
                             <tr>
                                <td>Period</td>
                                <td>${data.count_day} days</td>
                            </tr>
                            <tr>
                                <td>Taxable Benefits</td>
                                <td class="text-success">${VSMoney.formatAmount(data.benefit_taxable, data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Other Benefits</td>
                                <td class="text-success">${div_BFT || 0.00}</td>
                            </tr>
                            <tr>
                                <td>Deduction</td>
                                <td class="text-danger">${VSMoney.formatAmount(data.deduction, data.currency_code)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="col-6">

                    <table class="table ">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>

                            <tr>
                                <td>Allowance</td>
                                <td>${VSMoney.formatAmount(data.p_allowance, data.currency_code)}</td>
                            </tr>

                             <tr>
                                <td>Tax Rate</td>
                                <td>${data.tax_rate }%</td>
                            </tr>
                            <tr>
                                <td>Nontaxable Benefits</td>
                                <td class="text-success">${VSMoney.formatAmount((data.nontaxable_benefit || data.benefit_non_tax), data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Benefit Tax</td>
                                <td class="text-danger">${VSMoney.formatAmount( (data.taxable_benefits || data.benefit_tax), data.currency_code)}</td>
                            </tr>
                            <tr>
                                <td>Tax Base</td>
                                <td class ="text-danger">${VSMoney.formatAmount(data.tax_base, data.currency_code)}</td>
                            </tr>
                        </tbody>

                    </table>
                    </div>
                       <div class="col-12 d-flex justify-content-center pb-1">
                            <p class=" text-success rounded-5 m-0 border p-2 bg-light">Total Salary : ${VSMoney.formatAmount(data.total_salary, data.currency_code)}</p>
                       </div>
                </div>

            </div>`;

        mThis.payment_info.innerHTML = html;
    };

    mThis.btnPrint.addEventListener('click', () => {
        windowPrintPayrollList(mThis.payment_info.innerHTML);
        // window.print();
    })


    mThis.viewPayment = (id, menuLink) => {

        const sub_content = mThis.self.querySelector("#sub_content");
        sub_content.classList.add("d-none");
        const pay_slip = mThis.self.querySelector("#pay_slip");
        pay_slip.classList.remove("d-none");
        let op = {
            id: id,
        }
        vsapi.call(`${main_view.base_url}/mhr/payroll/staff/pay-slip`,op,false,false,false).then(res => {
            if(res.status_code == 200){
                let d = res.data;
                mThis.renderPayment(d);
            }
        })

    }
    mThis.addDeduction = (id, menuLink) => {
        if (!AuthManager.allowed(214)) return;

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());

            }
        };

        AddDeductionDialog.show(op);
    }

    mThis.disburseOne = (id, emp_id,payroll_id, menuLink) => {
        const p = {
            id: id,
            //emp_id:emp_id,
            //payroll_id:payroll_id
            // btn: menuLink,
            // onClose: () => {
            //     mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            // }
        };
        cv_interact.confirm('Disburse this payroll ?',{
            title: 'Disburse Payroll List',
            context: 'disburse',
            confirmButtonText:"Disburse"
        }, e =>{
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/payroll/disburse-one`, p, false, false, false).then(res => {

                    if(res.status_code == 200){
                        cv_interact.success('Disbursed successfully');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                    else{
                        cv_interact.error(res.error_message);
                    }
                })
            }
        });

    }

    mThis.deletePayrollList = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PayrollList_ListView.showPage(mThis.getFilterData());
            }
        };
        if (!AuthManager.allowed(215)) return;
        cv_interact.confirm('Remove this staff from payroll?',{
            title: 'Remove Staff from Payroll',
            context: 'delete',
            confirmButtonText:"Remove"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/payroll/staff/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.info('The staff has been removed from payroll!');
                        mThis.PayrollList_ListView.showPage(mThis.getFilterData());
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });

    }

    mThis.getFilterData = () => {

        let p = {};

        p.payroll_id = mThis.elFilter.value;
        p.branch_id = mThis.elFilterBranch.value;
        // p.disbursed = mThis.elFilterDisburse.value;
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll('.filter-field');
        main_filters.forEach(el => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/mhr/payroll/staff/form-options`, null, null, null).then(res => {
            const d = res.status_code == 200 ? res.data : {};
            let payroll_id = null;
            const today = new Date();
            const currentMonth = today.getMonth() + 1;
            const currentYear = today.getFullYear();

            d.payrolls.forEach(payroll => {
                if (payroll.month === currentMonth && payroll.year === currentYear) {
                    payroll_id = payroll.id;

                }


            });


            VSUtil.setComboItems(mThis.elFilter,d.payrolls,'id','payroll_name',false,null,payroll_id);
            VSUtil.setComboItems(mThis.elFilterBranch, d.branches, 'id', 'branch_name', true, 'All Branches', null);
            // VSUtil.setComboItems(mThis.elFilterDisburse, d.disbursed, 'id', 'name', true, 'Default', null);
            onFinish(d);
        });
    };

    mThis.show = function (option) {
        mThis.option = option;
        mThis.init();

        mThis.prepareFormOptions(() => {
            mThis.elFilter.value = option.payroll_id;
            mThis.elFilter.dispatchEvent(new Event('change'));
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
});

const AddDeductionDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: 'modal-lg vs-modal',
            backdrop: 'static',
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="employee" class="data-input form-control" data-field="emp_id" disabled placeholder="${LocaleManager.trans('Name', 'labels')}">
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="payroll_name" class="data-input form-control" data-field="payroll_id" disabled placeholder="${LocaleManager.trans('Payroll Name', 'labels')}">
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="deduction" class="data-input form-control" data-field="deduction" placeholder=" " />
                                <label vslang="labels.Deduction"></label>
                            </div>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreated: (me) => {
            },
            prepareFormOptions: {
                createTitle: 'Add Deduction',
                modifyTitle: 'Edit Deduction ',
                targetProp: 'payroll_list',
                api: {
                    endpoint: [main_view.base_url, '/mhr/payroll/staff/form-options'].join(''),
                    params: (op) => {
                        return { 'id': op.id };
                    }
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },

            configSelect: [
                {
                    name: "employee",
                    data: 'employees',
                    textField: "name",
                    valueField: 'id'
                },
                {
                    name: "payroll_name",
                    data: 'payrolls',
                    textField: "payroll_name",
                    valueField: 'id'
                }
            ],

            buttons: [
                {
                    label: '<span class="text-warning">Cancel</span>',
                    cssClass: 'btn btn-default',
                    click: (me, btn) => {
                        // Close with Cancel button
                        me.hide(false);
                    }
                },
                {
                    label: '<span>Save</span>',
                    cssClass: 'btn btn-primary',
                    click: (me, btn) => {
                        const p = me.getData();
                        p.id = me.dataOptions.id; // Get "id" from op
                        if (!AuthManager.allowed(214)) return;

                        vsapi.call([main_view.base_url, '/mhr/payroll/staff/add-deduction'].join(''), p, btn, null)
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success("Added deduction successfully");
                                    } else {
                                        cv_interact.success("Added deduction successfully");
                                    }
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    }
                }
            ],
        });
        dialog.show(op);
    };

    return self;
})();


const PayRollImportDialog = (()=>{
    const self = {};
    let dialogImport = null;
     self.show = (op)=>{

        dialogImport = dialogImport || new GeneralDialog({
            cssClass:'modal-md',
            backdrop: 'static',
            keyboard:true,
            createContent:()=>{
                 return [`<div class="row">
                 <div class="form-group col-12">
                     <label for="payroll_name" class="form-label" vslang="titles.Payroll"></label>
                     <select name="payroll_name" class=" data-input"  data-field="payroll_id"></select>
                 </div>

              </div>`].join('');
            },
            configSelect:[
               {
                 name:"payroll_name",
                 data:'payrolls',
                 textField:"payroll_name",
                 valueField:'id'
               },
            ],
            buttons:[
               {
                label:'<span class="text-warning">Cancel</span>',
                cssClass:'btn btn-default',
                click:(me,btn)=>{
                    //Close with Cancel button
                    me.hide(false);
                }
               },
               {
                label:'<span>Import</span>',
                cssClass:'btn btn-primary',
                click:(me,btn)=>{
                    const p = me.getData();

                    p.id = me.dataOptions.id; //get "id" from op

                    vsapi.call( [main_view.base_url,'/mhr/payroll/import-staff'].join(''), p,btn,null).then(res=>{
                       if(res.status_code ==200){
                         const successCount = res.data.success_count ?? 0;
                          if(successCount > 0) cv_interact.success([successCount, ' staff have been enlisted to this payroll'].join(''));
                          else cv_interact.warning('No staff imported! This may be because all of them are already in the payroll, or there are no staff profiles');
                         me.hide(true,p);
                       }else cv_interact.error(res.error_message);
                    });
                }
               }
            ],
            prepareFormOptions:{
               createTitle:'Import Staff List',
               modifyTitle:'Edit',
               targetProp: 'payroll_list',
               api:{
                 endpoint: [main_view.base_url,'/mhr/payroll/staff/form-options'].join(''),
                 params:(op)=>{
                    return {'id':op.id};
                 }
               },
            },

            onPrepareForm:(me, data)=>{
                 LocaleManager.translateZone(me.divModal);
                 me.controls.payroll_name.value = me.dataOptions.payroll_id;
                 me.controls.payroll_name.setAttribute('disabled',true);
            }
        });

        dialogImport.show(op);
     }

    return self;
})();

function windowPrintPayrollList(html=null)
{
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if(HtmlString)
    {
        let myWindow = window.open('','PRINT');
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Pay Slip</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }

                </style>

            </head>
            <body>${HtmlString}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        },500);
    }
    else
        cv_interact.warning('Select run report before print!');
}

"use strict";

var BenefitComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_benefit_component");

    mThis.title_prop = "Benefit List";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_benefit_search");
    mThis.elBenefitType = mThis.self.querySelector("#el_benefit_type");

    mThis.cols = [
        {
            className: "align-middle text-nowrap ",
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.name ?? "-"}</span>
                    </div>
                `;
             }
        },
        {
            transTitle: "titles.Type",
            className: 'type text-nowrap',
            data: function (data, index, tr) {
                let cls_class = "text-info";
                if (data.type_id == 1) {
                    cls_class = 'badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis';
                } else if (data.type_id == 2) {
                    cls_class = 'badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis';
                }

                return `<div class="text-primary-custom" style="width:80px;">
                            <span class="${cls_class} text-capitalize d-inline-block text-center" style="min-width:70px">
                                ${data.type_id == 1 ? 'Remuneration' : 'Fringe Benefit'}
                            </span>
                        </div>`;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column" style="width:180px;">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? "-"}</span>
                    <small class="text-muted">${data.updated_at ?? "-"}</small>
                </div>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BenefitListView = new ListView("_benefit_list", {
            fetchApi: `${main_view.base_url}/mhr/benefit/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BenefitListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(270)) return;
            BenefitDialog.show(op);
        };
        mThis.pr_tbl = mThis.BenefitListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BenefitListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BenefitListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_benefit");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_benefit");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
        });
    };

    mThis.editBenefit = (id, btn) => {
        if (!AuthManager.allowed(271)) return;
        BenefitDialog.show({ id, btn, onClose: () => mThis.BenefitListView.showPage(mThis.getFilterData()),});
    };

    mThis.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(272)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Benefit",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call( `${main_view.base_url}/mhr/benefit/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_benefit");
                                mThis.BenefitListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            type_id: mThis.elBenefitType.value,

        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;

        });

        return p;
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/benefit/form-options`,null,null,null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefitType,d.benefit_types,"id","name","",LocaleManager.trans("All Types", "titles"),"");
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show =  (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BenefitListView.showPage(mThis.getFilterData());

        });

    };
    return mThis;
})();

const BenefitDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" name="type_id" class="data-input form-control" data-field="type_id" placeholder="${LocaleManager.trans('Type', 'labels')}">
                                    <option value="1" >Remuneration</option>
                                    <option value="2">Fringe Benefit</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/benefit/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_benefit");
                                        }
                                        else{
                                        cv_interact.success("create_success_benefit");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Benefit",
                    modifyTitle: "vslang:titles.Edit Benefit",
                    targetProp: "benefits",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/benefit/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var EmployeeBenefitComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_employee_benefit_component");

    mThis.title_prop = "Employee Benefits";

    mThis.btnAdd = mThis.self.querySelector("#_btn_add_benefit");
    mThis.btnImport = mThis.self.querySelector("#_btn_import_benefit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_employee_benefit");
    mThis.elSearch = mThis.self.querySelector("#_sdl_search_bonus");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    mThis.elTaxOption = mThis.self.querySelector("#el_tax_option");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.emp_name ?? "-"}
                            <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Benefit",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<span>${data.benefit_name ?? '-'}</span>`;
             }
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary p-0 m-0">${
                    data.effective_date ?? "N/A"
                }</span>`;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.amount,
                    data.currency_code
                )}</p>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.balance,
                    data.currency_code
                )}</p>`;
            },
        },

        {
            transTitle: "titles.Tax Option",
            className: "align-middle",
            data: (data) => {
                return `
                <p class="p-0 text-primary-custom m-0">${
                    data.tax_option_id == "1" ? "Taxable" : ""
                }${data.tax_option_id == "2" ? "Non Taxable" : ""}${
                    data.tax_option_id == "3" ? "Flat Rate" : ""
                }`;
            },
        },
        {
            transTitle: "titles.Flat Tax Rate",
            className: "align-middle",
            data: (data, index, tr) => {
                return data.tax_option_id == "3"
                    ? `<p class="p-0 m-0">${data.flat_tax_rate ?? "0"} %</p>`
                    : `<p class="p-0 m-0">N/A</p>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_emp_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.EmployeeBenefitListView = new ListView("_employee_bonus_list", {
            fetchApi: `${main_view.base_url}/mhr/emp-benefit/all-list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white overflow-hidden rounded-3 header-uppercase",
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = (e) => {
            e.preventDefault();
            if (!AuthManager.allowed(273)) return;
            EmployeeBenefitDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
                },
            });
        };
        mThis.btnImport.onclick = (e) => {
            e.preventDefault();
            if (!AuthManager.allowed(325)) return;
            FileChooser.chooseFile({
                accept: 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },(d) => {
                if(d){
                    vsapi.call(`${main_view.base_url}/mhr/emp-benefit/import-emp-benefits`,{
                        file: d.dataUrl
                    },false).then(res => {

                        if(res.status_code === 200){
                            mThis.EmployeeBenefitListView.showPage(null);
                            cv_interact.success('Employees Benefit Were Import Successfully!');
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
            });

        };

        const pr_tbl = mThis.EmployeeBenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }
        mThis.elSearch.addEventListener(
            "keyup",
            mThis.debounce(() => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            }, 300)
        );
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        });
        mThis.setActionListeners();
        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_benefit");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_emp_benefit");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
        });
    };

    mThis.getFilterData = () => {
        const filters = {
            benefit_id: mThis.elBenefit.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };

    mThis.editBenefit = (id, btn) => {
        if (!AuthManager.allowed(274)) return;
        EmployeeBenefitDialog.show({
            id,
            btn,
            onClose: () => mThis.EmployeeBenefitListView.showPage(mThis.getFilterData()),
        });
    };

    mThis.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(275)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Employee Benefit",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/emp-benefit/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_employee_benefit");
                                mThis.EmployeeBenefitListView.showPage(
                                    mThis.getFilterData()
                                );
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp-benefit/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefit, d.benefits, "id", "name", "",LocaleManager.trans("All Benefits", "titles"), "");
                VSUtil.setComboItems(mThis.elTaxOption, d.tax_options, "id", "name", "",LocaleManager.trans("All Tax Options", "titles"), "");

            });
    };

    mThis.debounce = (func, delay) => {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(mThis, args), delay);
        };
    };
    mThis.show = function () {
        mThis.init();
        mThis.EmployeeBenefitListView.showPage(mThis.getFilterData());
        mThis.prepareFormOptions();
         main_view.setContentView(mThis.self, mThis.title_prop);

    };
    return mThis;
})();
const EmployeeBenefitDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="employee" class="data-input form-control" data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="benefits" class="data-input form-control" data-field="benefit_id" id="benefit_id" placeholder="${LocaleManager.trans('Benefit', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="${LocaleManager.trans('Currency Code', 'labels')}" disabled></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="tax_option_id" class="data-input form-control" data-field="tax_option_id" id="tax_option_id" placeholder="${LocaleManager.trans('Tax Options', 'labels')}">
                                <option value="">(Select Tax Option)</option>
                                <option value="1">Tax</option>
                                <option value="2">Non</option>
                                <option value="3">Flat Rate</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="number" name="amount" class="form-control data-input" data-field="amount" placeholder=" " />
                                <label vslang="titles.Amount"></label>

                            </div>
                        </div>
                        <div class="col-6 effective_date d-none">
                            <div class="vs-material-field">
                                <input name="effective_date" class="form-control data-input" data-field="effective_date" placeholder=" "></input>
                                <label vslang="titles.Effective Date"></label>
                            </div>
                        </div>
                        <div class="col-6 flat_tax_rate d-none">
                            <div class="vs-material-field">
                                <input type="number" name="flat_tax_rate" class="form-control data-input" data-field="flat_tax_rate" placeholder=" " />
                                <label vslang="titles.Flat Tax"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                <label vslang="titles.Remark"></label>
                            </div>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.effective_date);
                const taxOptionField = me.divModal.querySelector("#tax_option_id");
                const flatTaxRateField = me.divModal.querySelector(".flat_tax_rate");
                taxOptionField.addEventListener("change", () => {
                    flatTaxRateField.classList.toggle(
                        "d-none",
                        taxOptionField.value !== "3"
                    );
                });

            },

            prepareFormOptions: {
                createTitle: "vslang:titles.Create Employee Benefit",
                modifyTitle: "vslang:titles.Edit Employee Benefit",
                targetProp: "emp_benefits",
                api: {
                    endpoint: `${main_view.base_url}/mhr/emp-benefit/form-options`,
                    params: (op) => ({ id: op.id }),
                },
            },
            onPrepareForm: (me, data) => {

                const BenefitField = me.divModal.querySelector("#benefit_id");

                const effective_date = me.divModal.querySelector(".effective_date");
                BenefitField.addEventListener("change", () => {
                    const selectedValue = BenefitField.value;
                    const benefit_disburse_policies =
                        data.benefit_disburse_policies;
                    const exists = benefit_disburse_policies.find(e => e.benefit_id === selectedValue);
                    if (exists) {
                        effective_date.classList.remove("d-none");
                    } else {
                        effective_date.classList.add("d-none");
                    }
                });
                BenefitField.dispatchEvent(new Event("change"));
                LocaleManager.translateZone(me.divModal);
                me.controls.currency_code.value = VSMoney.getCurrency().code;

                Object.keys(data).forEach((key) => {
                    const input = me.divModal.querySelector(
                        `[data-field="${key}"]`
                    );
                    if (input) {
                        input.value = data[key];
                    }
                });
            },
            configSelect: [
                {
                    name: "employee",
                    data: "employees",
                    textField: (me, d) => `
                        <div class="d-flex gap-2">
                            <img class="img_select" src="${d.image_url}" />
                            <div class="d-flex flex-column">
                                <span>${d.name}</span>
                                <span>${d.position}</span>
                            </div>
                        </div>`,
                    valueField: "id",
                },
                {
                    name: "benefits",
                    data: "benefits",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "currency_code",
                    data: "currency_codes",
                    textField: "code",
                    valueField: "code",
                },
            ],
            buttons: [
                {
                    label: '<span  vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false)
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();
                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                `${main_view.base_url}/mhr/emp-benefit/save`,
                                p,
                                btn
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success("update_success_employee_benefit");
                                    } else {
                                        cv_interact.success("create_success_employee_benefit");
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




var PayrollAccountComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_accountComponent");
    mThis.title_prop = "Payroll Accounts";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddAccount");
    mThis.btnAddAccountMissing = mThis.self.querySelector("#_btnAddAccountMissing");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_sdl_search_account");
    mThis.elDepartment = mThis.self.querySelector("#el_department");
    mThis.elAccount = mThis.self.querySelector("#el_account");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_account");
    mThis._transaction_info = mThis.self.querySelector("#_transaction_info");
    mThis.btnPrintTransaction = mThis.self.querySelector("#_print_transaction");
    mThis.divListView = mThis.self.querySelector('#_account_list');

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-capitalize text-nowrap w-15",
            data: (data, index, tr) => {
                return `
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.emp_name ?? ""
                                }</span>
                                <br/>
                                <span style="font-size: 11px; color: gray;">${
                                    data.position ?? ""
                                }</span>
                            </div>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Account Type",
            className: "align-middle",
            data: (data, index, tr) => {
                 return `<div class="text-primary-custom" style="width:80px;">
                            <span class="badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis text-capitalize d-inline-block text-center" style="min-width:70px">
                                ${data.account_type ?? ""}
                            </span>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Account Number",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ""}</p>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.balance,data.currency_code)}</p>`;
            },
        },

        {
            transTitle: "titles.Last Balance Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ""}</p>`;
            },
        },
        {
            transTitle: "titles.Currency",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.currency_code ?? ""}</p>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_account_action"
                    }" data-id="${data.id}" data-emp_id="${
                data.emp_id
            }" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.AccountListView = new ListView(mThis.divListView, {
            fetchApi: `${main_view.base_url}/mhr/account/payroll-account/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden  header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                btn: e.target,
                onClose: () => {
                    mThis.AccountListView.showPage();
                },
            };
            if (!AuthManager.allowed(315)) return;
            AccountDialog.show(op);
        };
        mThis.btnAddAccountMissing.onclick = function (e) {
            e.preventDefault();
            const op = {
                account_type: "Payroll",
            };
            if (!AuthManager.allowed(210)) return;
            cv_interact.confirm(
                'html:<span class="d-block fw-semibold text-success">Create accounts for all staff? </span><small>This process will create payroll account for staff who do not have an account yet!</small>',
                {
                    title: "Bulk Create Accounts",
                    context: "update", //NOTE that now "context" can be "delete" for red color, and "update" for Green color
                    confirmButtonText: "Bulk Create",
                },
                function (confirmation) {
                    if (confirmation) {
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/account/bulk-create",
                                ].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    const d = res.data;
                                    if (d.success_count > 0) {
                                        mThis.AccountListView.showPage(
                                            mThis.getFilterData()
                                        );
                                        cv_interact.success(
                                            `${d.success_count} accounts have been created!`
                                        );
                                    } else
                                        cv_interact.info(
                                            "No account were created! Maybe because all staff already have an account!"
                                        );
                                } else cv_interact.error(res.error_message);
                            });
                    }
                }
            );
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_content_account = mThis.self.querySelector(
                "#sub_content_account"
            );
            sub_content_account.classList.remove("d-none");
            const view_transaction =
                mThis.self.querySelector("#view_transaction");
            view_transaction.classList.add("d-none");
        };

        const pr_tbl = mThis.AccountListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 230 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 230 + "px";
        };

        mThis.initDropdownMenus(pr_tbl);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.AccountListView.showPage(mThis.getFilterData());
            };
        });

        mThis.initAlready = true;
    };

    mThis.renderTransaction = (data) => {
        if (!data || !data[0] || !data[0].trx) {
            console.error("Invalid data format");
            return;
        }

        const employee = data[0];
        const transactions = employee.trx;

        let html = `
            <style>
                .transaction_card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    width: 98%;
                }
                .transaction_header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 10px;
                    padding-bottom: 20px;
                }
                .transaction_logo {
                    position: absolute;
                    left: 0;
                }
                .transaction_title {
                    text-align: center;
                    flex-grow: 1;
                }
                .transaction_profile {
                    gap: 10px;
                    justify-content: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 5px;
                }
                .transaction_image {
                    display: flex;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .transaction_table {
                    display: flex;
                    padding: 10px;
                }
            </style>
            <div class="transaction_card overflow-y-auto overflow-x-hidden">
                <div class="transaction_header">
                    <div class="transaction_logo">
                        <img src="${
                            main_view.base_url
                        }/assets/images/logo/lc_logo.svg" alt="Company Logo">
                    </div>
                    <div class="transaction_title">
                        <h4>Transaction</h4>
                    </div>
                </div>
                <div class="transaction_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="transaction_image">
                                <img src="${
                                    employee.image_url
                                }" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.emp_name
                                }</p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Number</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${
                                    employee.account_number
                                }</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Balance</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.balance
                                }</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Type</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap">${
                                    employee.account_type
                                }</p>
                            </div>
                             <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Currency</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.currency_code
                                }</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Last Balance Date</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${
                                    employee.last_balance_date
                                }</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction_table row" style="display: flex !important;">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Trx Type</th>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions
                                    .map(
                                        (trx) => `
                                    <tr>
                                        <td>${
                                            trx.trx_type === 1
                                                ? "Deposit"
                                                : trx.trx_type === 2
                                                ? "Withdrawal"
                                                : "Transfer"
                                        }</td>
                                       <td>${trx.from_account_number ?? 'N/A'}</td>
                                        <td>${trx.to_account_number ?? 'N/A'}</td>
                                        <td class="${
                                            trx.status === "in"
                                                ? "text-success"
                                                : "text-danger"
                                        }">
                                            ${Number(trx.amount)
                                                .toLocaleString("en-US")
                                                .replace(/,/g, " ")}
                                        </td>
                                        <td>${trx.created_at}</td>
                                        <td>
                                            <span class="${
                                                trx.status === "in"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }">
                                                ${trx.status}
                                            </span>
                                        </td>
                                        <td>${trx.remarks ?? 'N/A'}</td>
                                    </tr>
                                `
                                    )
                                    .join("")}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        `;

        mThis._transaction_info.innerHTML = html;
    };

    mThis.btnPrintTransaction.addEventListener("click", () => {
        windowPrintTransaction(mThis._transaction_info.innerHTML);
        // window.print();
    });

    mThis.elSearch.addEventListener("keyup", (e) => {
        e.preventDefault();
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.AccountListView) {
                mThis.AccountListView.showPage(mThis.getFilterData());
            } else {
                console.error("Payroll account is not defined");
            }
        }, 200);
    });

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_account_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Deposit Cash">Deposit Cash</span>',
                    icon: `<i class="fa fa-calculator"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "deposit_amount",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.View Transactios">View Transaction</span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_transaction",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Transfer">Transfer</span>',
                    icon: `<i class="fa-solid fa-money-bill-transfer"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "transfer",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Account Details"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Account">Delete Account</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_account",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);

                // Ensure 'deposit_amount' is part of the menu and exists before hiding it
                if (menu.deposit_amount) {
                    menu.deposit_amount.style.display = "block";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "transfer": {
                        mThis.transfer(id, menuLink);
                        break;
                    }
                    case "deposit_amount": {
                        mThis.deposit_amount(id, menuLink);
                        break;
                    }
                    case "view_transaction": {
                        mThis.viewTransaction(id, menuLink);
                        break;
                    }
                    case "edit_account": {
                        mThis.editAccount(id, menuLink);
                        break;
                    }
                    case "delete_account": {
                        mThis.deleteAccount(id, menuLink);
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
    mThis.transfer = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(327)) return;
        TransferDialog.show(op);
    };
    mThis.deposit_amount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(326)) return;
        DepositDialog.show(op);
    };

    mThis.viewTransaction = (id, menuLink) => {
        const sub_content_account = mThis.self.querySelector(
            "#sub_content_account"
        );
        sub_content_account.classList.add("d-none");
        const view_transaction = mThis.self.querySelector("#view_transaction");
        view_transaction.classList.remove("d-none");

        let emp_id = menuLink.dataset.emp_id;
        let op = {
            emp_id: emp_id,
            account_id: id,
        };
        if (!AuthManager.allowed(328)) return;
        vsapi
            .call(
                `${main_view.base_url}/mhr/account/print-transaction`,
                op,
                false,
                false,
                false
            )
            .then((res) => {
                if (res.status_code == 200) {
                    let d = res.data;
                    mThis.renderTransaction(d);
                }
            });
    };
    mThis.editAccount = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(211)) return;
        AccountDialog.show(op);
    };

    mThis.deleteAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Deleted successfully");
                mThis.AccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(212)) return;
        cv_interact.confirm(
            "Delete this account?",
            {
                title: "Delete Account",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.AccountListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            }
        );
    };

    mThis.setDefaultFilter = ()=>{
        if(!mThis.rem_filter) return;
        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
             const f = el.dataset.field;
             el.value = mThis.rem_filter[f] ?? '';
        });
    };

    mThis.getFilterData = () => {
        const p = {};
        p.search_value = mThis.elSearch.value;
       // p.sort_by_department = mThis.elSortByDepartment.value;
        // p.sort_by_branch = mThis.elSortByBranch.value;
        //p.sort_by_account = mThis.elSortByAccount.value;
        //p.account_id = mThis.divFilter.value;

        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        mThis.rem_filter = main_filters;
        return p;
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/account/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elDepartment,
                    d.departments,
                    "id",
                    "name",
                    '',
                    'All Departments'
                );
                VSUtil.setComboItems(
                    mThis.elAccount,
                    d.account,
                    "id",
                    "name",
                    '',
                    'All Accounts'
                );
                onFinish();
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions(()=>{
            if (mThis.rem_filter){
                mThis.setDefaultFilter();
            }
            mThis.AccountListView.showPage();
            main_view.setContentView(mThis.self, mThis.title_prop);
        });

    };
    return mThis;
})();

const AccountDialog = (() => {
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
                        `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="employee" class="data-input form-control"  data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" class="data-input form-control" name="account_type" data-field="account_type" placeholder="${LocaleManager.trans('Account Type', 'labels')}">
                                <option value="Payroll">Payroll</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="account_number" class="form-control data-input" data-field="account_number" placeholder=" " />
                                <label vslang="titles.Account Number"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="balance" class="form-control data-input" data-field="balance" placeholder=" " />
                                <label vslang="titles.Balance"></label>
                            </div>
                        </div>
                           <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="currency_code" class="form-control data-input" data-field="currency_code" placeholder=" " />
                                <label vslang="titles.Currency"></label>
                            </div>
                        </div>
                    </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const currency_codeField = me.controls.currency_code;

                    if (currency_codeField && !currency_codeField.value) {
                        currency_codeField.value = VSMoney.getCurrency().code;

                    }

                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span class="choices__item_text"> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
                    },
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save">Save</span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        // if (me.dataOptions.id > 0) {
                                        //     cv_interact.success(
                                        //         "Updated payroll account successfully"
                                        //     );
                                        // } else {
                                        //     cv_interact.success(
                                        //         "Added payroll account successfully"
                                        //     );
                                        // }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Account",
                    modifyTitle: "vslang:titles.Detail Account",
                    targetProp: "accounts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me) => {
                    LocaleManager.translateZone(me.divModal);
                    me.setReadOnly(true,['account_number','currency_code'], {"currency_code":VSMoney.getCurrency().code});
                    const isReadOnly = me.dataOptions.id > 0;
                    me.setReadOnly(isReadOnly,['balance','employee'],isReadOnly? null : {"balance":"0.00"});
                    // me.controls.account_name.style.display = me.dataOptions.id > 0 ? 'block':'none';
                    // me.controls.account_name.setAttribute('readonly',true);

                    const balanceField = me.divModal.querySelector(
                        '[data-field="balance"]'
                    );
                    if (balanceField) {
                        if (me.dataOptions && me.dataOptions.id) {
                            balanceField.disabled = true;
                        } else {
                            balanceField.disabled = false;
                        }
                    }
                },
            });
        dialog.show(op);
    };

    return self;
})();

const DepositDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        '<div class="row">',
                        '<div class="form-group col-6">',
                        '<label for="account_name" class="form-label" vslang="titles.Account Name"></label>',
                        '<input name="account_name" class="data-input form-control" data-field="account_name" disabled/>',
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="balance" class="form-label" vslang="titles.Master Balance"></label>',
                        '<input name="balance" class="data-input form-control" data-field="balance" disabled/>',
                        "</div>",
                        '<div class="form-group col-12">',
                        '<label for="account_type" class="form-label" vslang="titles.Account Type"></label>',
                        '<select class="modal-select data-input" name="account_type" data-field="account_type" disabled>',
                        '<option value="Payroll">Payroll</option>',
                        '<option value="Wallet">Wallet</option>',
                        "</select>",
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="amount" class="form-label" vslang="titles.Amount"></label>',
                        '<input name="amount" class="form-control data-input" data-field="amount" />',
                        "</div>",
                        '<div class="form-group col-6">',
                        '<label for="currency_code" class="form-label" vslang="titles.Currency"></label>',
                        '<input name="currency_code" class="data-input form-control" data-field="currency_code" disabled/>',
                        "</div>",
                        '<div class="form-group col-md-12">',
                        '<label for="remarks" class="form-label" vslang="titles.Remarks"></label>',
                        '<textarea name="remarks" class="form-control data-input" data-field="remarks"></textarea>',
                        "</div>",
                        "</div>",
                    ].join("");
                },
                contentCreated: (me) => {
                    const currency_codeField = me.controls.currency_code;
                    if (currency_codeField && !currency_codeField.value) {
                        currency_codeField.value = VSMoney.getCurrency().code;
                    }
                },
                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="titles.Submit">Submit</span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            if (!AuthManager.allowed(326)) return;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/deposit",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        cv_interact.success(
                                            "Updated balance successfully"
                                        );
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Deposit Cash",
                    modifyTitle: "Deposit Cash",
                    targetProp: "account",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/deposit/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                       onResponse: (me, res)=>{
                        //  console.log('result from api "/form-options": ', res);
                       }
                },

                onPrepareForm: (me,acc) => {
                    LocaleManager.translateZone(me.divModal);
                    // me.controls.account_name.value = acc.account_name ?? acc.emp_name ?? '';
                    // me.controls.account_number.value = acc.account_number;
                    // me.controls.currency_code.value = acc.currency_code;
                    // me.controls.account_name.setAttribute('readonly',true);
                    // me.controls.account_number.setAttribute('readonly',true);
                    // me.controls.currency_code.setAttribute('readonly',true);
                },
            });
        dialog.show(op);
    };

    return self;
})();

const TransferDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return `
                        <div class="row">
                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">From Account</div>

                            <div class="form-group col-6">
                                <label for="account_number" class="form-label" vslang="titles.Account Number" ></label>
                                <input name="account_number" class="form-control data-input" data-field="account_number"disabled  />
                            </div>
                            <div class="form-group col-6">
                                <label for="balance" class="form-label" vslang="titles.Balance" ></label>
                                <input name="balance" class="form-control data-input" data-field="balance" disabled/>
                            </div>

                             <div class="form-group  col-12 ">
                                <div name="from_account_info" id="info"></div>
                             </div>

                            <div class="text-center fs-5 mb-2 border rounded-4 bg-primary-subtle">To Account</div>

                            <div class="form-group col-6">
                                <label for="to_account_number" class="form-label" vslang="titles.Account Number"></label>
                                <input name="to_account_number" class="form-control data-input" data-field="to_account_number" />
                            </div>
                            <div class="form-group col-6">
                                <label for="amount" class="form-label" vslang="titles.Amount"></label>
                                <input name="amount" class="form-control data-input" data-field="amount" />
                            </div>

                            <div class="form-group  col-12 ">
                                <div id="info" name="to_account_info"></div>
                             </div>
                            <div class="form-group exchange_rate col-6">
                                <label for="exchange_rate" class="form-label" vslang="titles.Exchange Rate"></label>
                                <input name="exchange_rate" class="form-control data-input" data-field="exchange_rate" />
                            </div>
                        </div>
                    `;
                },
                contentCreated: (me) => {},
                prepareFormOptions: {
                    createTitle: "Add Account",
                    modifyTitle: "Transfer",
                    targetProp: "accounts",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/account/form-options`,
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    let account = me.controls.account_number;
                    let to_account = me.controls.to_account_number;
                    let from_account_info = me.controls.from_account_info;
                    let to_account_info = me.controls.to_account_info;
                    const exchange_rate =
                        me.divModal.querySelector(".exchange_rate");
                    exchange_rate.classList.add("d-none");

                    // account.onchange = (e) => {
                    let p = { account_number: account.value };
                    vsapi
                        .call(
                            [main_view.base_url, "/mhr/account/get-info"].join(
                                ""
                            ),
                            p,
                            null,
                            null
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                let d = res.data;
                                me.account_type = d.account_type;
                                me.currency_code = d.currency_code;
                                let div = "";
                                div = `<div class = "d-flex justify-content-between border rounded-4 p-2">
                                            <div>
                                                <label for="account_type" class="form-label">Account Type</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.account_type}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Employee</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.emp_name}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Currency</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.currency_code}</span>
                                            </div>

                                        </div>`;
                                from_account_info.innerHTML = div;
                            }
                        });
                    // };

                    to_account.onchange = (e) => {
                        let p = { account_number: to_account.value };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/account/get-info",
                                ].join(""),
                                p,
                                null,
                                null
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    let d = res.data;
                                    me.to_account_type = d.account_type;
                                    me.to_account_currency_code =
                                        d.currency_code;
                                    let div = "";
                                    div = `<div class = "d-flex justify-content-between border rounded-4 p-2">
                                            <div>
                                                <label for="account_type" class="form-label">Account Type</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.account_type}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Employee</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.emp_name}</span>
                                            </div>
                                            <div>
                                                <label for="emp_name" class="form-label">Currency</label>
                                                <span class = "mx-2">:</span>
                                                <span class = "text-primary">${d.currency_code}</span>
                                            </div>
                                        </div>`;
                                    to_account_info.innerHTML = div;
                                    if (
                                        me.to_account_currency_code == me.currency_code
                                    ) {
                                        exchange_rate.classList.add("d-none");
                                    } else {
                                        exchange_rate.classList.remove("d-none");
                                    }
                                }
                            });
                    };
                },

                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Transfer</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.account_type = me.account_type;
                            p.currency_code = me.currency_code;
                            p.to_account_type = me.to_account_type;
                            p.to_account_currency_code = me.to_account_currency_code;
                            p.id = me.dataOptions.id;
                            if (
                                me.to_account_currency_code != me.currency_code
                            ) {
                                if (!me.controls.exchange_rate.value) {
                                    cv_interact.error(
                                        "Please enter exchange rate"
                                    );
                                    return;
                                }
                            }

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/account/get-confirm",
                                    ].join(""),
                                    p,
                                    null,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code === 200 && res.data) {
                                        const confirmationMessage = `Are you sure to transfer? to [${res.data.to_account_number}] (${res.data.to_account_type}) - ${res.data.emp_name}`;

                                        cv_interact.confirm(
                                            confirmationMessage,
                                            {
                                                title: "Confirm or Cancel Transfer",
                                                context: "Cancel",
                                                confirmButtonText: "Transfer",
                                            },
                                            function (confirmation) {
                                                if (confirmation) {
                                                    p.from_account = {'account_number':p.account_number}
                                                    p.to_account = {'account_number':p.to_account_number}
                                                    vsapi
                                                        .call(
                                                            [
                                                                main_view.base_url,
                                                                "/hr/account/transfer",
                                                            ].join(""),
                                                            p,
                                                            null,
                                                            null
                                                        )
                                                        .then((res) => {
                                                            if (
                                                                res.status_code ===
                                                                    200 &&
                                                                res.data
                                                            ) {
                                                                let formattedData = `
                                                        Transfer Successful
                                                        From: ${res.data.from_account_number}
                                                        To: ${res.data.to_account_number}
                                                    `;
                                                                cv_interact.success(
                                                                    formattedData
                                                                );
                                                                AccountManagementComponent.AccountListView.showPage();
                                                                me.hide(false);
                                                            } else {
                                                                cv_interact.error(
                                                                    res.error_message ||
                                                                        "Error in processing transfer"
                                                                );
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            cv_interact.error(
                                                                res.error_message ||
                                                                    "Error in processing transfer"
                                                            );
                                                        });
                                                }
                                            }
                                        );
                                    } else {
                                        cv_interact.error(
                                            res.error_message ||
                                                "Error fetching confirmation data"
                                        );
                                    }
                                })
                                .catch((err) => {
                                    cv_interact.error(
                                        "Error in processing confirmation"
                                    );
                                });
                        },
                    },
                ],
            });

        dialog.show(op);
    };
    return self;
})();

function windowPrintTransaction(html = null) {
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if (HtmlString) {
        let myWindow = window.open("", "PRINT");
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Pay Slip</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }

                </style>

            </head>
            <body>${HtmlString}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        }, 500);
    } else cv_interact.warning("Select run report before print!");
}

"use strict";
var StaffAttendanceComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_staffAttendanceComponent",
    );

    mThis.title_prop = "Staff Attendances";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddStaffAttendance");
    mThis.elSearch = mThis.self.querySelector("#_attendance_search");
    mThis.containerFilter = mThis.self.querySelector(
        "#_divFilter_staff_attendance",
    );
    mThis.divListView = mThis.self.querySelector("#_staff_attendance_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            title: "Staff ID",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.code}</span>`;
            },
        },
        {
            title: "Full Name",
            className: "name text-capitalize align-middle",
            data: (data, index, tr) => {
                const sex =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "Other";
                return `<p class="d-flex flex-column">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            title: "Position",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            title: "Date",
            className: "text-capitalize align-middle",
            data: (data, index, tr) => {
                return data.attendance_date ?? "";
            },
        },
        {
            title: "Work Shift",
            className: "text-capitalize align-middle",
            data: "work_shift",
        },
        {
            title: "Scan Info",
            className: "text-capitalize align-middle",
            data: (data) => {
                return data.scan_info
                    .map((info, index) => {
                        const timeParts = info.time.split(":");
                        let hours = parseInt(timeParts[0]);
                        const minutes = timeParts[1];
                        const ampm = hours >= 12 ? "PM" : "AM";
                        hours = hours % 12 || 12;
                        const formattedTime = `${hours}:${minutes} ${ampm}`;

                        return `
                            <div class="d-flex flex-column mb-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-primary-custom fw-bold" style="font-size: 80%;">${info.action_type}</small>
                                    <small class="text-info px-2" style="font-size: 80%;">â†’</small>
                                    <small class="text-success  fw-bold" style="font-size: 80%;">${formattedTime}</small>
                                </div>
                                ${index < data.scan_info.length - 1 ? '<hr class="my-1 border-primary-custom">' : ""}
                            </div>
                        `;
                    })
                    .join("");
            },
        },
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.StaffAttendanceListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/hr/attendances/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                },
            };
            // if (!AuthManager.allowed(247)) return;
            StaffAttendanceDialog.show(op);
        };

        mThis.pr_tbl = mThis.StaffAttendanceListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/employee/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                let d = res.status_code === 200 ? res.data : {};

                if (d) {
                    mThis.containerFilter
                        .querySelectorAll(".filter-field")
                        .forEach((el) => {
                            const f = el.dataset.field;
                            switch (f) {
                                case "branch_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.branches,
                                        "id",
                                        "branch_name",
                                        null,
                                        null,
                                        1,
                                    );
                                    break;
                                case "emp_type_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.types || [],
                                        "id",
                                        "name",
                                        true,
                                        "All Type",
                                        null,
                                    );
                                    break;
                                case "department_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.departments,
                                        "id",
                                        "name",
                                        true,
                                        "All Department",
                                        null,
                                    );
                                    break;
                                case "work_shift_id":
                                    VSUtil.setComboItems(
                                        el,
                                        d.work_shifts,
                                        "id",
                                        "name",
                                        true,
                                        "All Shift",
                                        null,
                                    );
                                    break;
                                default:
                                    break;
                            }
                        });
                }
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };
    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.StaffAttendanceListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const StaffAttendanceDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="employee" class="data-input form-control" data-field="employee_name"  placeholder="Employee" />
                                    <label vslang="labels.Employee"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" class="data-input form-control" data-field="employee_code" placeholder=" " disabled />
                                    <label vslang="labels.Employee Code">Employee Code</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="attendance_date" class="data-input form-control form_input" data-field="attendance_date" placeholder=" " />
                                    <label vslang="labels.Attendance Date">Attendance Date</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="action_type" name="attendance_type" class="data-input form-control" placeholder="Attendance Type">
                                    <option value="Check In">Check In</option>
                                    <option value="Check Out">Check Out</option>
                                </select>
                            </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="time" name="scan_time" class="data-input form-control form_input" data-field="scan_time" placeholder=" " />
                                    <label vslang="labels.Time">Time</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="work_shift_id" name="work_shift_id" class="data-input form-control" placeholder="Work Shift">
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="department_id" name="department_id" class="data-input form-control" placeholder="Department"></select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="status" name="status" class="data-input form-control" placeholder="Status"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea  type="text" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                    <label for="remark" vslang="titles.Remark"></label>
                                </div>
                            </div>

                         </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "employee",
                    data: "employees",
                    textField: (me, d) => {
                        return `<div class="d-flex gap-2 py-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span><span> ${d.position} </span> </div></div>`;
                    },
                    // textField:"name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span class="text-warning">Cancel</span>',
                    cssClass: "btn btn-default",
                    click: (me, btn) => {
                        //Close with Cancel button
                        me.hide(false);
                    },
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/hr/attendances/save",
                                ].join(""),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    cv_interact.success(
                                        "Attendance save successfully",
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            contentCreated: (me, divModal) => {
                me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                    type: "select",
                    prefetch: true,
                    maxDropdownHeight: "380px",

                    api: {
                        endpoint: `${main_view.base_url}/mhr/attendance/form-options`,
                    },
                    processResponse: (res) => {
                        const employees = res?.data?.employees || [];
                        return (Array.isArray(employees) ? employees : []).map(
                            (i) => ({
                                ...i,
                                code: i.emp_code || "",
                                name: i.emp_name || "",
                            }),
                        );
                    },
                    showColumnHeader: true,
                    columns: {
                        code: "Code",
                        name: "Name",
                        // legal_name: "Legal Name"
                    },
                    onSelect: (item) => {
                        const tenantId = item?.id || "";
                        const tenantName = item?.tenant || "";
                        const tenantCode = item?.code || "";
                        me.controls.tenant.value = tenantCode
                            ? `${tenantName} (${tenantCode})`
                            : tenantName;
                        me.controls.tenant.dataset.tenantId = tenantId;
                        me.tenant_id = tenantId;
                        me.controls.legal_name.value = item?.legal_name || "";
                    },
                });
                DateTimePicker.init(me.controls.attendance_date);


                me.saveStaffAttendance = (p) => {
                    alert("Data saved.");
                };
            },
            prepareFormOptions: {
                createTitle: "Create Attendance",
                modifyTitle: "Edit Attendance",
                targetProp: "attendance",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/hr/attendances/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log('result from api "/form-options": ', res);
                // },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
        });

        dialog.show(op);
    };

    return self;
})();


// --- appended missing mhr components ---

"use strict";

var TaxAllowanceComponent = (function () {
    const mThis = {};

    mThis._escapeHtml = (s) => {
        if (s == null) return "";
        return String(s)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    };

    mThis._formatMoney = (value, currency) => {
        if (typeof VSMoney !== "undefined" && VSMoney.formatAmount) {
            return VSMoney.formatAmount(value, currency || "USD");
        }
        const num = Number(value) || 0;
        return `$ ${num.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    mThis._bindActions = (container, empId, onRefresh) => {
        const refresh = () => {
            if (typeof onRefresh === "function") {
                onRefresh(empId);
            }
        };

        const addBtn = container.querySelector("#_emp_tax_allowance_btn_add");
        if (addBtn) {
            addBtn.onclick = function (e) {
                e.preventDefault();
                TaxAllowanceDialog.show({
                    id: null,
                    btn: e.target,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        }

        container.querySelectorAll(".btn_edit_tax_allowance").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                TaxAllowanceDialog.show({
                    id: btn.dataset.id,
                    btn: btn,
                    emp_id: empId,
                    onClose: refresh,
                });
            };
        });

        container.querySelectorAll(".btn_delete_tax_allowance").forEach((btn) => {
            btn.onclick = (e) => {
                e.preventDefault();
                mThis.deleteTaxAllowance(btn.dataset.id, btn, refresh);
            };
        });
    };

    mThis.deleteTaxAllowance = (id, menulink, refresh) => {
        let op = {
            id: id,
            btn: menulink,
        };

        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/tax-allowance/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success");
                                if (typeof refresh === "function") {
                                    refresh();
                                }
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };

    mThis.render = (container, allowances, empId, onRefresh) => {
        if (!container) return;

        const allowanceList = Array.isArray(allowances) ? allowances : [];

        const rowsHtml = allowanceList.length
            ? allowanceList
                  .map(
                      (row) => `
                <div class="emp-tax-allowance-row" data-allowance-id="${row.id}">
                    <div class="emp-tax-allowance-col-qty">${mThis._escapeHtml(String(row.qty ?? 0))}</div>
                    <div class="emp-tax-allowance-col-amount">${mThis._escapeHtml(mThis._formatMoney(row.amount, row.currency_code))}</div>
                    <div class="emp-tax-allowance-col-allowance">${mThis._escapeHtml(mThis._formatMoney(row.allowance, row.currency_code))}</div>
                    <div class="emp-tax-allowance-col-action">
                        <div class="d-flex justify-content-center align-items-middle">
                            <div class="text-middle gap-2 d-flex flex-wrap">
                                <button class="btn rounded-3 p-1 btn-primary btn_edit_tax_allowance" data-id="${row.id}">
                                    <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                                </button>
                                <button class="btn rounded-3 p-1 btn-danger btn_delete_tax_allowance" data-id="${row.id}">
                                    <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`
                  )
                  .join("")
            : `<div class="emp-tax-allowance-empty">
                    <i class="fa-solid fa-receipt emp-tax-allowance-empty-icon"></i>
                    <span class="emp-tax-allowance-empty-text">${LocaleManager.trans("No data available.", "titles")}</span>
               </div>`;

        container.innerHTML = `
                <div class="emp-tax-allowance-card h-100">
                    <div class="emp-tax-allowance-header">
                        <div class="emp-tax-allowance-header-title">
                            <span class="emp-tax-allowance-header-icon">
                                <i class="fa-solid fa-hand-holding-dollar"></i>
                            </span>
                            <span class="emp-tax-allowance-header-label" vslang="titles.Tax Allowance">Tax Allowance</span>
                        </div>
                        <button type="button" class="emp-skill-add-btn" id="_emp_tax_allowance_btn_add" title="Add" aria-label="Add tax allowance">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                    <div class="emp-tax-allowance-body">
                        <div class="emp-tax-allowance-cols">
                            <span vslang="titles.Qty">Qty</span>
                            <span vslang="titles.Unit Amt">Unit Amt</span>
                            <span vslang="titles.Allowance">Allowance</span>
                            <span vslang="titles.Action">Action</span>
                        </div>
                        <div class="emp-tax-allowance-list">
                            ${rowsHtml}
                        </div>
                    </div>
                </div>`;

        LocaleManager.translateZone(container);
        mThis._bindActions(container, empId, onRefresh);
    };

    return mThis;
})();

const TaxAllowanceDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="number" name="qty" required class="data-input form-control" data-field="qty" min="0" step="1" placeholder=" " />
                                    <label vslang="titles.Qty"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <input type="number" name="amount" required class="data-input form-control" data-field="amount" min="0" step="0.01" placeholder=" " />
                                    <label vslang="labels.Amount"></label>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <div class="vs-material-field">
                                    <select name="currency_code" class="modal-select data-input" data-field="currency_code"></select>
                                    <label vslang="titles.Currency">Currency</label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="data-input form-control" data-field="remarks" rows="4" placeholder=" "></textarea>
                                    <label vslang="labels.Remarks"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            p.emp_id = me.dataOptions.emp_id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/tax-allowance/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (
                                            typeof me.dataOptions.onClose ===
                                            "function"
                                        ) {
                                            me.dataOptions.onClose(p);
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "update_success"
                                            );
                                        } else {
                                            cv_interact.success(
                                                "create_success"
                                            );
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Tax Allowance",
                    modifyTitle: "vslang:titles.Edit Tax Allowance",
                    targetProp: "tax_allowance",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/tax-allowance/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    },
                ],
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    if (!me.dataOptions.id && me.controls.currency_code) {
                        me.controls.currency_code.value =
                            VSMoney.getCurrency().code;
                    }
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var WorkShiftListComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_workShiftListComponent");

    mThis.title_prop = "Work Shifts";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWorkShift");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_work_shift_list_search");
    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #1a1647; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-capitalize",
            data: (data) => {
                return `<span class="text-pr-custom">${data.name}</span>`;
            },
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data) => {
                return [
                    `<span class="text-Capitalize d-block">${data.update_user ?? '-'}</span>`,
                    `<span class="text-small">${data.updated_at ?? '-'}</span>`,
                ].join("");
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_work_shift" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_work_shift" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.WorkShiftListsView = new ListView("_work_shift_lists", {
            fetchApi: `${mThis.base_url}/mhr/work-shifts/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

                mThis.WorkShiftListsView.showPage(mThis.getFilterData());
            };
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WorkShiftListsView.showPage();
                },
            };
            // if (!AuthManager.allowed(267)) return;
            WorkShiftListDialog.show(op);
        };
        mThis.listContainer = mThis.WorkShiftListsView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WorkShiftListsView) {
                mThis.WorkShiftListsView.showPage(mThis.getFilterData());
            } else {
                console.error("Work is not defined");
                }
        }, 200);
    });
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_edit_work_shift");
            if (btn) {
                mThis.editWorkShift(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn_delete_work_shift");
            if (btn) {
                mThis.deleteWorkShift(btn.dataset.id, btn);
            }
        });
    };
    mThis.editWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        // if (!AuthManager.allowed(268)) return;
        WorkShiftListDialog.show(op);
    };
    mThis.deleteWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkShiftListsView.showPage();
            },
        };
        // if (!AuthManager.allowed(269)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/work-shifts/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_work_shift");
                                mThis.WorkShiftListsView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };
    mThis.show = function () {
        mThis.init();

        mThis.WorkShiftListsView.showPage(
            mThis.getFilterData(),
            null,
            () => {
               main_view.setContentView(mThis.self, mThis.title_prop);
            }
        );
    };
    return mThis;
})();
const WorkShiftListDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/work-shifts/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_work_shift");
                                        } else {
                                            cv_interact.success("create_success_work_shift");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Shift",
                    modifyTitle: "vslang:titles.Edit Shift",
                    targetProp: "work_shifts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/work-shifts/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var SkillsComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_skillsComponent");

    mThis.title_prop = "Skills";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddSkill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_skills_list_search");

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #1a1647; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>`,
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-capitalize",
            data: (data) => {
                return `<span class="text-pr-custom">${data.name ?? data.title ?? "-"}</span>`;
            },
        },
        {
            transTitle: "titles.Description",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-muted">${data.description ?? "-"}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data) => {
                return [
                    `<span class="text-Capitalize d-block">${data.update_user ?? "-"}</span>`,
                    `<span class="text-small">${data.updated_at ?? "-"}</span>`,
                ].join("");
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_skill" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_skill" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.SkillsListView = new ListView("_skills_lists", {
            fetchApi: `${mThis.base_url}/mhr/skills/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () => {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            SkillListDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.SkillsListView.showPage(mThis.getFilterData());
                },
            });
        };

        mThis.listContainer = mThis.SkillsListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.setActionListeners();
        mThis.initAlready = true;
    };

    mThis.elSearch.addEventListener("keyup", () => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.SkillsListView) {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            }
        }, 200);
    });

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) {
                p[f] = el.value;
            }
        });

        return p;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_edit_skill");
            if (btn) {
                mThis.editSkill(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_delete_skill");
            if (btn) {
                mThis.deleteSkill(btn.dataset.id, btn);
            }
        });
    };

    mThis.editSkill = (id, menulink) => {
        SkillListDialog.show({
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.SkillsListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.deleteSkill = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
        };

        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/skills/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_skill");
                                mThis.SkillsListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error("An error occurred. Please try again.");
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };

    mThis.show = function () {
        mThis.init();
        mThis.SkillsListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };

    return mThis;
})();

const SkillListDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="title" required class="data-input form-control" data-field="title" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="data-input form-control" data-field="description" rows="3" placeholder=" "></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/skills/save"].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (typeof me.dataOptions.onClose === "function") {
                                            me.dataOptions.onClose(p);
                                        }
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_skill");
                                        } else {
                                            cv_interact.success("create_success_skill");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Skill",
                    modifyTitle: "vslang:titles.Edit Skill",
                    targetProp: "skills",
                    api: {
                        endpoint: [main_view.base_url, "/mhr/skills/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var BenefitDisbursementComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self= main_view.VSAppContent.querySelector("#_main_benefit_disbursement_component");
    mThis.title_prop = "Benefits Disbursement";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefitDisburse");
    mThis.elSearch = mThis.self.querySelector("#_benefit_disburse_search");
    mThis.elCard = mThis.self.querySelector(".top_level_card");
    mThis._searchBenefitDisburse = mThis.self.querySelector("#container_benefit_disburse");
    mThis.divFilter = mThis.self.querySelector("#container_benefit_disburse");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");
    const monthNames = [
        "All",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    mThis.cols = [
        {
            title: "",
            className: "align-middle ",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle text-start w-25",
            data: (data) => {
                return `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.name ?? ""
                        }</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`;
            },
        },

        {
            transTitle: "titles.Benefit",
            className: "align-middle ",
            data: (data) =>
                `<span class="text-primary-custom">${
                    data.benefit_name ?? "HD"
                }</span>`,
        },
        {
            transTitle: "titles.Target Month",
            className: "align-middle",
            data: (data) => {
                const month = monthNames[data.target_month ] ?? "";

                return `<p class="p-0 m-0">${month} </p>`;
            },
        },
        {
            transTitle: "titles.Target Year",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom">${data.target_year}</span>`,
        },
        {
            transTitle: "titles.Withdraw Percent",
            className: "align-middle",
            data: (data) =>
                `<span class="text-prm-custom">${data.withdraw_rate ?? "0"}%</span>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-center">
                    <div class="text-center align-center gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn-benefit-disbursement-modify" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn-benefit-disbursement-delete" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.BenefitDisburseListView = new ListView("_benefit_disburse_list", {
            fetchApi: `${mThis.base_url}/mhr/emp/benefit-disbursement/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });
        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BenefitDisburseListView.showPage();
                },
            };
            // if (!AuthManager.allowed(276)) return;
            BenefitDisburseDialog.show(op);
        };
        const pr_tbl = mThis.BenefitDisburseListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);

        mThis._searchBenefitDisburse.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.BenefitDisburseListView) {
                mThis.BenefitDisburseListView.showPage(mThis.getFilterData());
            } else {
                console.error("Benefit Disburse is not defined");
            }
        }, 200);
    });

    mThis.setFilterPeriod = (p) => {
        return p;
    };

    mThis.getFilterData = () => {
        const filters = {
            benefit_id: mThis.elBenefit.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const field = el.dataset.field;
            filters[field] = el.value;
        });
        return filters;
    };
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(
                e.target,
                ".btn-benefit-disbursement-modify"
            );
            if (btn) {
                mThis.editBenefitDisburse(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(
                e.target,
                ".btn-benefit-disbursement-delete"
            );
            if (btn) {
                mThis.deleteBenefitDisburse(btn.dataset.id, btn);
            }
        });
    };
    mThis.editBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        // if (!AuthManager.allowed(277)) return;
        BenefitDisburseDialog.show(op);
    };
    mThis.deleteBenefitDisburse = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BenefitDisburseListView.showPage();
            },
        };
        // if (!AuthManager.allowed(278)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/emp/benefit-disbursement/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_benefit_disbursement");
                                mThis.BenefitDisburseListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp/benefit-disbursement/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elBenefit,
                    d.benefits,
                    "id",
                    "name",
                    true,
                    "All Benefits",
                    null
                );
            });
    };
    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.BenefitDisburseListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();
const BenefitDisburseDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    const months = [
                        { value: 0, name: "All" },
                        { value: 1, name: "January" },
                        { value: 2, name: "February" },
                        { value: 3, name: "March" },
                        { value: 4, name: "April" },
                        { value: 5, name: "May" },
                        { value: 6, name: "June" },
                        { value: 7, name: "July" },
                        { value: 8, name: "August" },
                        { value: 9, name: "September" },
                        { value: 10, name: "October" },
                        { value: 11, name: "November" },
                        { value: 12, name: "December" },
                    ];

                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 10 },
                        (_, i) => currentYear + i
                    );
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="employee" class="form-control data-input" data-field="emp_id" placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="benefits" class="form-control data-input" data-field="benefit_id" placeholder="${LocaleManager.trans('Benefit', 'labels')}"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="withdraw_rate" required class="data-input form-control" data-field="withdraw_rate" placeholder=" " />
                                    <label vslang="labels.Withdraw Percent"></label>
                                </div>
                            </div>

                        <div class="col-6">
                            <select data-style="material" name="target_month" class="form-control data-input" data-field="target_month" placeholder="${LocaleManager.trans('Month', 'labels')}">
                                ${months
                                    .map(
                                        (month) =>
                                            `<option value="${month.value}">${month.name}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="year" class="form-control data-input" data-field="target_year" placeholder="${LocaleManager.trans('Year', 'labels')}">
                                ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`
                                    )
                                    .join("")}
                            </select>
                        </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`,
                        valueField: "id",
                    },
                    {
                        name: "benefits",
                        data: "benefits",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const jl = me.getData();

                            jl.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/emp/benefit-disbursement/save",
                                    ].join(""),
                                    jl,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, jl);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_benefit_disbursement");
                                        }
                                        else{
                                        cv_interact.success("create_success_benefit_disbursement");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveBenefitDisburse = (bd) => {
                        alert("It seems no action yet!");
                    };
                },
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Benefit Disburse",
                    modifyTitle: "vslang:titles.Edit Benefit Disburse",
                    targetProp: "benefit_disbursements",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/emp/benefit-disbursement/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    // onResponse: (me, res) => {

                    //     if (res.target_month && res.target_year) {
                    //         setTimeout(() => {
                    //             const monthSelect = me.divModal.querySelector(
                    //                 '[name="target_month"]'
                    //             );
                    //             const yearSelect = me.divModal.querySelector(
                    //                 '[name="target_year"]'
                    //             );
                    //             if (monthSelect)
                    //                 monthSelect.value = res.target_month;
                    //             if (yearSelect)
                    //                 yearSelect.value = res.target_year;
                    //         }, 100);
                    //     }
                    // },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    setTimeout(() => {
                        if (data.target_month) {
                            const monthSelect = me.divModal.querySelector(
                                '[name="target_month"]'
                            );
                            if (monthSelect)
                                monthSelect.value = data.target_month;
                        }
                        if (data.target_year) {
                            const yearSelect = me.divModal.querySelector(
                                '[name="target_year"]'
                            );
                            if (yearSelect) yearSelect.value = data.target_year;
                        }
                    }, 100);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var UninformedLeaveComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Uninformed Leave";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_emp_Uninform_leave_component");

    mThis.btnAdd = mThis.self.querySelector("#_btnAddLeave");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_emp_leave");
    // mThis.elFilter_leaveType = mThis.self.querySelector('#el_leave_type');
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elLeaveType = mThis.self.querySelector("#el_leave_type");
    mThis.elSearch = mThis.self.querySelector("#_search_leave");

    mThis.cols = [
        {
            transTitle: "",
            className: 'align-middle',
        },
        {
            transTitle: "titles.Employee ID",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `<span>${data.emp_code ?? '-'}</span>`;
             }
        },

        {
            transTitle: "titles.Name",
            className: "align-middle text-nowrap",
            data: (data, index) => {
                return `
                        <div class="d-flex flex-column">
                            ${data.employee_name ?? "-"}
                            <span class="d-block text-muted" style="font-size:12px;">${data.position ?? "-"}</span>
                        </div>`;
            },
        },

        {
            transTitle: "titles.Leave Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.leave_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Start Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.start_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.End Date",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar-check me-1"></i>
                        ${data.end_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Leave Duration",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
                const days = Number(data.leave_days ?? 0);
                return `
                    <span style="min-width: 100px;" class="badge bg-light text-danger-emphasis border px-2 py-2">
                        <i class="fa-regular fa-clock me-1"></i>
                        ${days} ${days === 1 ? "Day" : "Days"}
                    </span>
                `;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:250px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const statusId = data.status_id;
                const statusKey = (data.status ?? "").toLowerCase();
                const map = {
                    1: {
                        text: "Pending",
                        cls: "bg-warning-subtle text-warning border border-warning",
                    },
                    2: {
                        text: "Approved",
                        cls: "bg-success-subtle text-success border border-success",
                    },
                    3: {
                        text: "Rejected",
                        cls: "bg-danger-subtle text-danger border border-danger",
                    },
                };
                const byName = {
                    pending:
                        "bg-warning-subtle text-warning border border-warning",
                    approved: "bg-success-subtle text-success border border-success",
                    rejected:
                        "bg-danger-subtle text-danger border border-danger",
                };
                const m = map[statusId] || null;
                const label =
                    m?.text ||
                    (statusKey === "terminated"
                        ? "Terminated"
                        : (data.status ?? "—"));
                const cls =
                    m?.cls || byName[statusKey] || "bg-light text-muted";
                return `<span class="badge ${cls}" style="min-width: 100px;" data-status_id="${data.status_id}">${label}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class=" ${data.action_id > 1 ? 'd-none' : 'btn_leave_action'}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.LeaveRequestListView = new ListView('_leave_request_list',{
            fetchApi : `${main_view.base_url}/mhr/leave/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated:(data,index,tr)=>{
              tr.dataset.statusid = data.status_id;
              tr.classList.add('leave');
              tr.setAttribute('id',['leave_id',data.id].join(''));

            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.LeaveRequestListView.showPage(mThis.getFilterData());
                }
            };
            // if (!AuthManager.allowed(240)) return;
            LeaveRequestDialog.show(op);
        };

        mThis.tblLeaves = mThis.LeaveRequestListView.getTable();

        mThis.initDropdownMenus(mThis.tblLeaves);
        mThis.pr_tbl = mThis.LeaveRequestListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + 'px';
        }

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el =>{

            el.onchange =  (e) => {
           e.preventDefault();
           mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
       });

        mThis.elSearch.addEventListener('keyup', (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            // leave_type_id: mThis.elFilter_leaveType.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
                const f = el.dataset.field;
                p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table)=>{
        const menuOptopns = {
            containerElement: table,
            actionButtonClass:"btn_leave_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Leave">Modify Leave</span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_leave"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Leave">Delete Leave</span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_leave"
                },
            ],
        //     adjustPosition:{
        //         top:-200 ,
        //         left:-300
        //    },

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_leave':{
                      mThis.editLeave(id, menuLink);
                      break;
                    }
                    case 'delete_leave':{
                        mThis.deleteLeave(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptopns);
    }



    mThis.editLeave = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(241)) return;
        LeaveRequestDialog.show(op);
    }

    mThis.deleteLeave = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.LeaveRequestListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this leave request?',{
            title: 'Delete Leave Request',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/leave/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('Deleted successfully');
                        mThis.LeaveRequestListView.showPage();
                    }
                })
            }
            else {
                cv_interact.error(res.error_message);
            }
        });
    }

    mThis.prepareFormOptions = () => {
        vsapi.call(`${main_view.base_url}/mhr/leave/form-options`, null, null, null)
            .then(res => {
            const d = res.status_code == 200 ? res.data : {};
            VSUtil.setComboItems(mThis.elFilter_status,d.status,'id','leave_status',"",LocaleManager.trans("All Statuses", "titles"),"");
            VSUtil.setComboItems(mThis.elLeaveType,d.leave_types,'id','leave_type',"",LocaleManager.trans("All Types", "titles"),"");
        })
    }

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.LeaveRequestListView.showPage(mThis.getFilterData(), null,()=>{
           main_view.setContentView(mThis.self, mThis.title_prop);
        });
    }
    return mThis;
})();



"use strict";
var HolidayComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_holidayComponent",
    );

    mThis.title_prop = "Manage Holiday";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddHoliday");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_holiday");
    mThis.elSearch = mThis.self.querySelector("#_search_holiday");
    mThis.elHolidayType = mThis.self.querySelector("#holiday_type");
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            // data: (data, index, i) => {

            // },
        },
        {
            transTitle: "titles.Holiday Date",
            className: "align-middle",
            data: (data) => {
                return ` <div class="d-flex flex-column">
                            <div class="d-flex justify-content-start align-items-center">
                                <span class="text-nowrap" style="font-size: 90%;">${data.start_date}</span>
                                <span class="text-primary px-1">~</span>
                                <span class="text-nowrap" style="font-size: 90%;">${data.end_date}</span>
                            </div>
                        </div>`;
            },
        },

        {
            transTitle: "titles.Holiday Name",
            className: "align-middle fw-bold",
            data: (data) => {
                return `<span class="text-danger text-capitalize">${data.name}</span>`;
            },
        },
        {
            transTitle: "titles.Holiday Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.holiday_type ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                //return `<p class="p-0 m-0">${data.leave_date.replace(/-/g, '/') ?? ''} - ${data.return_date.replace(/-/g, '/') ?? ''}</p>`;
                return `<div class="d-flex flex-column">
                    <span class="text-primary fw-semibold text-capitalize">${data.update_user}</span>
                    <span>
                        <small class="text-nowrap">${data.updated_at}</small>
                    </span>
                </div>`;
            },
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_holiday_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.HolidayListView = new ListView("_holiday_list", {
            fetchApi: `${main_view.base_url}/mhr/holiday/list-paginate`,
            perPage: 15,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

                mThis.HolidayListView.showPage(mThis.getFilterData());
            };
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.HolidayListView.showPage();
                },
            };
            if (!AuthManager.allowed(260)) return;
            HolidayDialog.show(op);
        };
        mThis.listContainer = mThis.HolidayListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.HolidayListView) {
                    mThis.HolidayListView.showPage(mThis.getFilterData());
                } else {
                    console.error("Holiday is not defined");
                }
            }, 200);
        });
        mThis.initDropdownMenus(mThis.listContainer);

        mThis.initAlready = true;
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_holiday_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Holiday"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_holiday",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Holiday"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_holiday",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_holiday": {
                        mThis.editHoliday(id, menuLink);
                        break;
                    }
                    case "delete_holiday": {
                        mThis.deleteHoliday(id, menuLink);
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

    mThis.editHoliday = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(262)) return;
        HolidayDialog.show(op);
    };

    mThis.deleteHoliday = (id, menuLink) => {
        // menuLink.disabled = true;
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.HolidayListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(263)) return;
        cv_interact.confirm(
            "delete_holiday",
            {
                title: "Delete Holiday",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/holiday/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_holiday");
                                mThis.HolidayListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    "Deletion failed. Try again.",
                                );
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again.",
                            );
                        })
                        .finally(() => {
                            menuLink.disabled = false;
                        });
                } else {
                    menuLink.disabled = false;
                }
            },
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/holiday/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elHolidayType,
                    d.holiday_types || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("Holiday Type", "titles"),
                    "",
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();

        mThis.HolidayListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();
const HolidayDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="holiday" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label vslang="labels.Holiday Name"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="holiday_type" class="form-control data-input" placeholder="${LocaleManager.trans('Holiday Type', 'labels')}" data-field="holiday_type_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" placeholder=" " />
                                <label vslang="labels.Start Date"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" placeholder=" " />
                                <label vslang="labels.End Date"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                <label vslang="labels.Description"></label>
                            </div>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                DateTimePicker.init(me.controls.start_date);
                DateTimePicker.init(me.controls.end_date);
            },
            configSelect: [
                {
                    name: "holiday_type",
                    data: "holiday_types",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/holiday/save"].join(
                                    "",
                                ),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_success_holiday",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_success_holiday",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Create Holiday",
                modifyTitle: "vslang:titles.Modify Holiday",
                targetProp: "holidays",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/holiday/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
        });

        dialog.show(op);
    };

    return self;
})();

var WalletAccountComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_walletAccountComponent");

    mThis.title_prop = "Wallet Accounts";
    mThis.btnAdd = mThis.self.querySelector("#_btnWalletAddAccount");
    mThis.btnAddAccountMissing = mThis.self.querySelector("#_btnWalletAddAccountMissing");
    mThis.divFilter = mThis.self.querySelector("#_wla_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_wla_search_wallet_account");
    mThis.elFilter_department = mThis.self.querySelector("#_wla_filter_department");
    mThis.btnBack = mThis.self.querySelector("#_btn_backTo_wallet_account");
    mThis._wallet_transaction_info = mThis.self.querySelector("#_wallet_transaction_info");
    mThis.btnPrintTransaction = mThis.self.querySelector("#_print_transaction");

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            transTitle: "titles.Employee",
            className: "align-middle text-capitalize text-nowrap w-15",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center;">
                            <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt=""style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.emp_name ?? ""
                                }</span>
                                <br/>
                                <span style="font-size: 11px; color: gray;">${
                                    data.position ?? ""
                                }</span>
                            </div>
                        </div>`;
            },
        },
        {
            transTitle: "titles.Account Type",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-1 m-0 text-center rounded-5 border text-white w-50 bg-info bg-gradient">${
                    data.account_type ?? ""
                }</p>`;
            },
        },

        {
            transTitle: "titles.Account Number",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.account_number ?? ""}</p>`;
            },
        },

        {
            transTitle: "titles.Balance",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.balance,data.currency_code)}</p>`;
            },
        },
        {
            transTitle: "titles.Last Balance Date",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.last_balance_date ?? ""}</p>`;
            },
        },
        {
            transTitle: "titles.Currency",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.currency_code ?? ""}</p>`;
            },
        },
        {
            className: "col_action align-middle",
            data: (data) => `
            <div class="d-flex justify-content-end align-items-end">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1
                            ? "d-none"
                            : "btn_wallet_account_action"
                    }" data-id="${data.id}" data-emp_id="${
                data.emp_id
            }" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.WalletAccountListView = new ListView("_wallet_account_list", {
            fetchApi: `${main_view.base_url}/mhr/account/wallet-account/list`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 overflow-hidden  header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();

            let op = {
                btn: e.target,
                onClose: () => {
                    mThis.WalletAccountListView.showPage();
                },
            };
            if (!AuthManager.allowed(256)) return;
            WalletAccountDialog.show(op);
        };

        mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            const sub_wallet_content = mThis.self.querySelector("#sub_wallet_content");
            sub_wallet_content.classList.remove("d-none");
            const view_wallet_transaction = mThis.self.querySelector("#view_wallet_transaction");
            view_wallet_transaction.classList.add("d-none");

        };

        const pr_tbl = mThis.WalletAccountListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 220) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + 'px';
        }

        mThis.initDropdownMenus(pr_tbl);
        const filter_fields = mThis.divFilter.querySelectorAll('.filter-field');
        filter_fields.forEach(el =>{
            el.onchange =  (e) => {
               e.preventDefault();
               mThis.WalletAccountListView.showPage(mThis.getFilterData());
            }
        });

        mThis.btnAddAccountMissing.onclick = function (e) {
            e.preventDefault();

            const op = {
                //account_id: mThis.divFilter.value,
                account_type:"Wallet"
            };
            if (!AuthManager.allowed(471)) return;
            cv_interact.confirm(
                'html:<span class="d-block fw-semibold text-success">Create wallet accounts for all staff? </span><small>This process will create wallet account for staff who do not have a wallet account yet!</small>',
                {
                    title: "Create Wallet Accounts",
                    context: "update",
                    confirmButtonText: "Bulk Create",
                },
                function (confirmation) {
                    if (confirmation) {
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/account/bulk-create",
                                ].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code === 200) {
                                    const d = res.data ?? {};
                                    const success_count = d.success_count ?? 0;
                                    if(success_count > 0) {
                                        mThis.WalletAccountListView.showPage(
                                            mThis.getFilterData()
                                        );
                                        cv_interact.success(`${success_count} wallet accounts have been creted!`);
                                    }
                                    else cv_interact.info('No wallet accounts were created. This is maybe because all staffs already have a wallet account!');

                                } else cv_interact.error(res.error_message);
                            });
                    }
                }
            );
        };

        mThis.initAlready = true;
    };

    mThis.renderWalletTransaction = (data) => {
        if (!data || !data[0] || !data[0].trx) {
            console.error("Invalid data format");
            return;
        }

        const employee = data[0];
        const transactions = employee.trx;

        let html = `
            <style>
                .transaction_card {
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                    width: 98%;
                }
                .transaction_header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 10px;
                    padding-bottom: 20px;
                }
                .transaction_logo {
                    position: absolute;
                    left: 0;
                }
                .transaction_title {
                    text-align: center;
                    flex-grow: 1;
                }
                .transaction_profile {
                    gap: 10px;
                    justify-content: center;
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 5px;
                }
                .transaction_image {
                    display: flex;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .transaction_table {
                    display: flex;
                    padding: 10px;
                }
            </style>
            <div class="transaction_card overflow-y-auto overflow-x-hidden">
                <div class="transaction_header">
                    <div class="transaction_logo">
                        <img src="${main_view.base_url}/assets/images/logo/lc_logo.svg" alt="Company Logo">
                    </div>
                    <div class="transaction_title">
                        <h4>Transaction</h4>
                    </div>
                </div>
                <div class="transaction_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="transaction_image">
                                <img src="${employee.image_url}" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${employee.emp_name}</p>
                            </div>

                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Number</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap">${employee.account_number}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Balance</p>
                                <p class="px-3">:</p>
                                <p class="text-nowrap text-capitalize">${employee.balance}</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Type</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap">${employee.account_type}</p>
                            </div>
                             <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Account Currency</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${employee.currency_code}</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Last Balance Date</p>
                                <p class="px-4">:</p>
                                <p class="text-nowrap text-capitalize">${employee.last_balance_date}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="transaction_table row" style="display: flex !important;">
                    <div class="col-12">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Trx Type</th>
                                    <th>From Account</th>
                                    <th>To Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${transactions.map(trx => `
                                    <tr>
                                        <td>${trx.trx_type === 1 ? 'Deposit' : trx.trx_type === 2 ? 'Withdrawal' : 'Transfer'}</td>
                                        <td>${trx.from_account_number}</td>
                                        <td>${trx.to_account_number}</td>
                                        <td class="${trx.status === 'in' ? 'text-success' : 'text-danger'}">
                                            ${Number(trx.amount).toLocaleString('en-US').replace(/,/g, ' ')}
                                        </td>
                                        <td>${trx.created_at}</td>
                                        <td>
                                            <span class="${trx.status === 'in' ? 'text-success' : 'text-danger'}">
                                                ${trx.status}
                                            </span>
                                        </td>
                                        <td>${trx.remarks ?? 'N/A'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        `;

        mThis._wallet_transaction_info.innerHTML = html;
    };


    mThis.btnPrintTransaction.addEventListener('click', () => {
        windowPrintWalletTransaction(mThis._wallet_transaction_info.innerHTML);
        // window.print();
    })

    mThis.elSearch.addEventListener("keyup", (e) => {
        e.preventDefault();
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WalletAccountListView) {
                mThis.WalletAccountListView.showPage(mThis.getFilterData());
            } else {
                console.error("Wallet account is not defined");
            }
        }, 200);
    });

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_wallet_account_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.View Transactions"></span>',
                    icon: `<i class="fa-regular fa-eye"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_wallet_transaction",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Wallet Details"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_wallet_account",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Wallet"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_wallet_account",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "view_wallet_transaction": {
                        mThis.viewWalletTransaction(id, menuLink);
                        break;
                    }
                    case "edit_wallet_account": {
                        mThis.editWalletAccount(id, menuLink);
                        break;
                    }
                    case "delete_wallet_account": {
                        mThis.deleteWalletAccount(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };


    mThis.editWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WalletAccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(257)) return;
        WalletAccountDialog.show(op);
    };

    mThis.deleteWalletAccount = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Deleted successfully");
                mThis.WalletAccountListView.showPage();
            },
        };
        if (!AuthManager.allowed(258)) return;
        cv_interact.confirm(
            "Delete this account?",
            {
                title: "Delete Account",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/account/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.WalletAccountListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };
    mThis.viewWalletTransaction = (id, menuLink) => {

        const sub_wallet_content = mThis.self.querySelector("#sub_wallet_content");
        sub_wallet_content.classList.add("d-none");
        const view_wallet_transaction = mThis.self.querySelector("#view_wallet_transaction");
        view_wallet_transaction.classList.remove("d-none");

        let emp_id = menuLink.dataset.emp_id;
        let op = {
            emp_id: emp_id,
            account_id: id,
        }
        if (!AuthManager.allowed(259)) return; // add comma (259, true) it show silent mode
        vsapi.call(`${main_view.base_url}/mhr/account/print-transaction`,op,false,false,false).then(res => {

            if(res.status_code == 200){
                let d = res.data;
                mThis.renderWalletTransaction(d)
            }
        })
    }

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/account/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
               VSUtil.setComboItems(mThis.elFilter_department, d.departments, 'id', 'name', '', '(All Departments)',null);
               onFinish();

            });
    };

    mThis.setDefaultFilter = ()=>{
        if(!mThis.rem_filter) return;
        const main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
             const f = el.dataset.field;
             el.value = mThis.rem_filter[f] ?? '';
        });
    };

    mThis.getFilterData = ()=>{
        const els = mThis.divFilter.querySelectorAll('.filter-field');
        const p = {};
        p.search_value = mThis.elSearch.value;
        els.forEach(el =>{
            const f = el.dataset.field;
            p[f] = el.value;
        });
        mThis.rem_filter = p;
        return p;
    }
    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions(()=>{
            if(mThis.rem_filter){
                 mThis.setDefaultFilter();
            }
            mThis.WalletAccountListView.showPage(mThis.getFilterData());
            main_view.setContentView(mThis.self, mThis.title_prop);
        });

    };
    return mThis;
})();

const WalletAccountDialog = (() => {
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
                    `<div class="row g-3">
                        <div class="col-12">
                            <select data-style="material" name="employee" class="form-control data-input"  data-field="emp_id"
                            placeholder="${LocaleManager.trans('Employee', 'labels')}"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" class="data-input form-control" name="account_type" data-field="account_type" placeholder="${LocaleManager.trans('Account Type', 'labels')}">
                                <option value="Payroll">Payroll</option>
                                <option value="Wallet">Wallet</option>
                            </select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="account_number" class="form-control data-input" data-field="account_number" placeholder=" " />
                                <label vslang="titles.Account Number"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="balance" class="form-control data-input" data-field="balance" placeholder=" " />
                                <label vslang="titles.Balance"></label>
                            </div>
                        </div>
                           <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="currency_code" class="form-control data-input" data-field="currency_code" placeholder=" " />
                                <label vslang="titles.Currency"></label>
                            </div>
                        </div>

                </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const currency_codeField = me.controls.currency_code;
                    if (currency_codeField && !currency_codeField.value) {
                        currency_codeField.value = VSMoney.getCurrency().code;
                    }
                    const accountField = me.controls.account_type;
                    if (accountField && !accountField.value) {
                        accountField.value = "Wallet";
                    }
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span>  <span>${d.position}</span></div></div>`;
                        },
                        valueField: "id",
                    },
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code",
                    }
                ],
                buttons: [
                    {
                        label: '<span vslang="titles.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;
                            vsapi.call([main_view.base_url,"/mhr/account/save",].join(""),p,btn,null).then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated wallet account successfully");
                                        }
                                        else{
                                        cv_interact.success("Added wallet account successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Account",
                    modifyTitle: "vslang:titles.Wallet Details",
                    targetProp: "accounts",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/account/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me) => {
                    LocaleManager.translateZone(me.divModal);
                    me.setReadOnly(true,['account_type','account_number','currency_code'], {"currency_code":VSMoney.getCurrency().code});
                    const isReadOnly =me.dataOptions.id > 0;
                    me.setReadOnly(isReadOnly,['balance','employee'], isReadOnly? null : {"balance":"0.00"});
                },
            });

        dialog.show(op);
    };

    return self;
})();
function windowPrintWalletTransaction(html=null)
{
    let HtmlString = null;
    HtmlString = html ? html : HtmlString;
    if(HtmlString)
    {
        let myWindow = window.open('','PRINT');
        myWindow.document.write(`<!DOCTYPE html>
        <html>
            <head>
                <title>Pay Slip</title>
                <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                 <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/bhr_style.css"/>
                <style>
                     *{
                        margin:0;
                        padding:0;
                        box-sizing: border-box;
                        font-size:11px;
                    }
                    table{
                        width: 100%;
                        border-collapse: collapse;
                    }

                </style>

            </head>
            <body>${HtmlString}</body>
        </html>`);
        myWindow.document.close();
        setTimeout(() => {
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        },500);
    }
    else
        cv_interact.warning('Select run report before print!');
}

"use strict";
var EmployeeAttendanceComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_staffAttendanceComponent",
    );

    mThis.title_prop = "Employee Attendance";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddStaffAttendance");
    mThis.elSearch = mThis.self.querySelector("#_attendance_search");
    mThis.elWorkShift = mThis.self.querySelector("#work_shift");
    mThis.containerFilter = mThis.self.querySelector(
        "#_divFilter_staff_attendance",
    );
    mThis.divListView = mThis.self.querySelector("#_staff_attendance_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            transTitle: "titles.Employee Code",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.emp_code}</span>`;
            },
        },
        {
            transTitle: "titles.Full Name",
            className: "name text-capitalize align-middle",
            data: (data, index, tr) => {
                const sex =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "Other";
                return `<p class="d-flex flex-column">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            transTitle: "titles.Date",
            className: "text-capitalize align-middle",
            data: (data, index, tr) => {
                return data.attendance_date ?? "";
            },
        },
        {
            transTitle: "titles.Work Shift",
            className: "text-capitalize align-middle",
            data: "work_shift",
        },
        {
            transTitle: "titles.Scan Info",
            className: "align-middle",
            data: (data) => {
                const time = data.scan_time;
                if (!time) return "";
                const timeParts = time.split(":");
                let hours = parseInt(timeParts[0]);
                const minutes = timeParts[1];
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12;
                const formattedTime = `${hours}:${minutes} ${ampm}`;

                const isCheckIn = (data.scan_action || "").toLowerCase().includes("in");
                const iconClass = isCheckIn ? "fa-right-to-bracket" : "fa-right-from-bracket";
                const colorClass = isCheckIn ? "success" : "warning";
                const actionLabel = isCheckIn ? "IN" : "OUT";

                return `
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle d-flex align-items-center justify-content-center bg-${colorClass}-subtle text-${colorClass}" style="width: 32px; height: 32px; flex-shrink: 0;">
                            <i class="fa-solid ${iconClass}" style="font-size: 14px;"></i>
                        </div>
                        <span class="fw-semibold text-${colorClass}" style="font-size: 90%; letter-spacing: 0.5px;">${actionLabel}</span>
                        <span class="text-${colorClass} fs-5 px-1">&bull;</span>
                        <span class="text-dark fw-semibold" style="font-size: 90%;">${formattedTime}</span>
                    </div>
                `;
            },
        },

        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? "-"}</span>
                    </div>
                `;
            },
        },

        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const status = data.attendance_status ?? "Present";
                let badgeClass = "bg-success-subtle text-success border border-success";
                if (status === "Late") {
                    badgeClass = "bg-warning-subtle text-warning border border-warning";
                } else if (status === "Absent") {
                    badgeClass = "bg-danger-subtle text-danger border border-danger";
                } else if (status === "Leave" || status === "Permission" || status === "Half Day") {
                    badgeClass = "bg-info-subtle text-info border border-info";
                } else if (status === "Holiday" || status === "Weekend") {
                    badgeClass = "bg-secondary-subtle text-secondary border border-secondary";
                }
                return `<span class="badge ${badgeClass} px-2.5 py-1.5 d-inline-flex align-items-center justify-content-center" style="min-width: 100px; font-size: 75%; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase;">${status}</span>`;
            }
        },

        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_attendance_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },



    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.StaffAttendanceListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/mhr/attendances/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                },
            };
            // if (!AuthManager.allowed(247)) return;
            StaffAttendanceDialog.show(op);
        };

        mThis.pr_tbl = mThis.StaffAttendanceListView.getListContainer();
        mThis.initDropdownMenus(mThis.pr_tbl);
        const elDate = mThis.containerFilter.querySelector("[data-select='datepicker']");
        if (elDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elDate);
        }
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.StaffAttendanceListView.showPage(
                        mThis.getFilterData(),
                    );
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/attendances/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elWorkShift,
                    d.work_shifts || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Shifts", "titles"),
                    "",
                );
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };

     mThis.initDropdownMenus = (table)=>{
        const menuOptions = {
            containerElement: table,
            actionButtonClass:"btn_attendance_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Modify Attendance"></span>',
                    icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"edit_attendance"
                },
                {
                    html:'<span class="ps-2  " vslang="titles.Delete Attendance"></span>',
                    icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"delete_attendance"
                },
            ],
        //     adjustPosition:{
        //         top:-200 ,
        //         left:-300
        //    },

            onClick:(menuLink, id, name)=>{
                switch(name){
                    case 'edit_attendance':{
                      mThis.editAttendance(id, menuLink);
                      break;
                    }
                    case 'delete_attendance':{
                        mThis.deleteAttendance(id, menuLink);
                        break;
                      }

                    default:{
                      break;
                    }
                }
            }
        }
        new VSDropdownMenu(menuOptions);
    }

    mThis.editAttendance = (id, menuLink) => {

        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(241)) return;
        StaffAttendanceDialog.show(op);
    }

    mThis.deleteAttendance = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.StaffAttendanceListView.showPage(mThis.getFilterData());
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('delete_attendance?',{
            title: 'Delete Attendance Record.',
            context: 'delete',
            confirmButtonText:"Delete"
        },function(e){
            if(e){
                vsapi.call(`${main_view.base_url}/mhr/attendances/delete`,op,false,false,false).then(res => {
                    if(res.status_code == 200){
                        cv_interact.success('attendance_delete_successfully');
                        mThis.StaffAttendanceListView.showPage();
                    } else {
                        cv_interact.error(res.error_message || 'An error occurred while deleting');
                    }
                })
            }
        });
    }

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.StaffAttendanceListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const StaffAttendanceDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                             <div class="col-6">
                                 <div class="vs-material-field">
                                     <input type="hidden" name="emp_id" class="data-input" data-field="emp_id" />
                                     <input name="employee" class="data-input form-control" data-field="employee_name" placeholder=" " autocomplete="off" />
                                     <label vslang="labels.Employee"></label>
                                 </div>
                             </div>
                             <div class="col-6">
                                 <div class="vs-material-field">
                                     <input type="text" name="employee_code" class="data-input form-control" data-field="employee_code" placeholder=" " disabled />
                                     <label vslang="labels.Employee Code">Employee Code</label>
                                 </div>
                             </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" data-type="date" name="attendance_date" class="data-input form-control form_input" data-field="attendance_date" placeholder=" " />
                                    <label vslang="labels.Attendance Date">Attendance Date</label>
                                </div>
                            </div>
                             <div class="col-6">
                                 <select data-style="material" data-field="scan_action" name="scan_action" class="data-input form-control" placeholder="${LocaleManager.trans('Attendance Type', 'labels')}">
                                     <option value="Check In">Check In</option>
                                     <option value="Check Out">Check Out</option>
                                 </select>
                             </div>

                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="time" name="scan_time" class="data-input form-control form_input" data-field="scan_time" placeholder=" " />
                                    <label vslang="labels.Time">Time</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="work_shift_id" name="work_shift_id" class="data-input form-control" placeholder="${LocaleManager.trans('Work Shift', 'titles')}">
                                </select>
                            </div>
                            <div class="col-6">
                                <select data-style="material" data-field="position_id" name="position_id" class="data-input form-control" placeholder="${LocaleManager.trans('Position', 'labels')}"></select>
                            </div>
                             <div class="col-6">
                                 <select data-style="material" data-field="attendance_status" name="attendance_status" class="data-input form-control" placeholder="${LocaleManager.trans('Status', 'titles')}"></select>
                             </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="remarks" class="form-control data-input" data-field="remarks" placeholder=" "></textarea>
                                    <label for="remark" vslang="titles.Remark"></label>
                                </div>
                            </div>

                         </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "work_shift_id",
                    data: "work_shifts",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "position_id",
                    data: "positions",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "attendance_status",
                    data: "attendance_statuses",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn-vs-cancel",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn-vs-save",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/attendances/save",
                                ].join(""),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "attendance_update_successfully",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "attendance_create_successfully",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            contentCreated: (me, divModal) => {
                DateTimePicker.init(me.controls.attendance_date);

                me.searchEmployee = VSSearchInput.init(me.controls.employee, {
                    type: "select",
                    prefetch: true,
                    api: {
                        endpoint: `${main_view.base_url}/mhr/attendances/form-options`,
                    },
                    processResponse: (res) => {
                        const employees = res?.data?.employees || [];
                        return (Array.isArray(employees) ? employees : []).map(
                            (i) => ({
                                ...i,
                                code: i.code || "",
                                name: i.name || "",
                            }),
                        );
                    },
                    showColumnHeader: true,
                    columns: {
                        code: "Code",
                        name: "Name",
                    },
                    onSelect: (employee) => {
                        if (me.controls.employee_code) {
                            me.controls.employee_code.value = employee.code || "";
                        }
                        if (me.controls.emp_id) {
                            me.controls.emp_id.value = employee.id || "";
                        }
                        if (employee.position_id && me.controls.position_id) {
                            me.controls.position_id.value = employee.position_id;
                            me.controls.position_id.dispatchEvent(new Event("change"));
                            if (window.jQuery) {
                                jQuery(me.controls.position_id).change();
                            }
                        }
                    },
                });
                me.searchEmployee.reset("");

                me.saveStaffAttendance = (p) => {
                    alert("Data saved.");
                };
            },
            prepareFormOptions: {
                createTitle: "vslang:titles.Create Attendance",
                modifyTitle: "vslang:titles.Modify Attendance",

                targetProp: "attendance",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/attendances/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log('result from api "/form-options": ', res);
                // },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var WarningComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_warningComponent",
    );

    mThis.title_prop = "Employee Warning";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWarning");
    mThis.elSearch = mThis.self.querySelector("#_warning_search");
    mThis.containerFilter = mThis.self.querySelector("#_divFilter_warning");
    mThis.elWarningType = mThis.self.querySelector("#warning_type");

    mThis.divListView = mThis.self.querySelector("#_warning_list");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            data: "",
        },
        {
            transTitle: "titles.Employee Code",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-prm text-capitalize">${data.emp_code}</span>`;
            },
        },
        {
            transTitle: "titles.Full Name",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                const sex =
                    data.sex === "M"
                        ? "Male"
                        : data.sex === "F"
                          ? "Female"
                          : "Other";
                return `<p class="d-flex flex-column">
                    <span class="text-Capitalize">${data.name}</span>
                    <small class="text-muted">${sex}</small>
                </p>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-primary-custom" >${data.position}</span>`;
            },
        },
        {
            transTitle: "titles.Warning Type",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<span class="text-nowrap text-prm-custom">${data.warning_type ?? ''}</span>`;
            }
        },
        {
            transTitle: "titles.Date",
            className: "align-middle text-center text-nowrap",
            data: (data, index, tr) => {
                return `
                    <span class="badge bg-light text-prm-custom border px-3 py-2">
                        <i class="fa-regular fa-calendar me-1"></i>
                        ${data.warning_date ?? "-"}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Issue",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.issues ?? "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.update_user ?? ""}</span>
                    <small class="text-muted">${data.updated_at ?? ""}</small>
                </div>`;
            },
        },
        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_warning_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },

    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.WarningListView = new ListView(mThis.divListView, {
            fetchApi: `${mThis.base_url}/mhr/emp-warning/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table rounded-3 overflow-hidden table--white header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WarningListView.showPage(mThis.getFilterData());
                },
            };
            WarningDialog.show(op);
        };

        mThis.pr_tbl = mThis.WarningListView.getListContainer();
        mThis.initDropdownMenus(mThis.pr_tbl);
        const elDate = mThis.containerFilter.querySelector(
            "[data-select='datepicker']",
        );
        if (elDate && typeof DateTimePicker !== "undefined") {
            DateTimePicker.init(elDate);
        }
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                el.onchange = (e) => {
                    e.preventDefault();
                    mThis.WarningListView.showPage(mThis.getFilterData());
                };
            });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/emp-warning/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elWarningType,
                    d.warning_types || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("Warning Type", "titles"),
                    "",
                );
            });
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.containerFilter
            .querySelectorAll(".filter-field")
            .forEach((el) => {
                const f = el.dataset.field;
                p[f] = el.value;
            });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Warning"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_warning",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Warning"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_warning",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_warning": {
                        mThis.editWarning(id, menuLink);
                        break;
                    }
                    case "delete_warning": {
                        mThis.deleteWarning(id, menuLink);
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

    mThis.editWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(241)) return;
        WarningDialog.show(op);
    };

    mThis.deleteWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm("delete_warning?",
        {
            title: "Delete Warning.",
            context: "delete",
            confirmButtonText: "Delete",
        },function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/mhr/emp-warning/delete`,op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("warning_delete_successfully");
                                mThis.WarningListView.showPage();
                            } else {
                                cv_interact.error(res.error_message || 'An error occurred while deleting.');
                            }
                        })
                    }
        });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.WarningListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const WarningDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="employee_id" class="form-control data-input" placeholder="${LocaleManager.trans('Employee', 'labels')}" data-field="emp_id"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="position" class="form-control data-input" placeholder="${LocaleManager.trans('Position', 'labels')}" data-field="position_id" disabled></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="warning_type" class="form-control data-input" placeholder="${LocaleManager.trans('Warning Type', 'labels')}" data-field="warning_type_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="warning_date" class="data-input form-control form_input" data-field="warning_date" placeholder=" " />
                                <label vslang="labels.Warning Date"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="issues" class="data-input form-control form_input" data-field="issues" placeholder=" " />
                                <label vslang="labels.Issue"></label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remarks" class="form-control data-input form_input" placeholder=" " data-field="remarks"></textarea>
                                <label vslang="labels.Remarks"></label>
                            </div>
                        </div>
                    </div>`,
                ].join("");
            },
            contentCreate: (me) => {

            },
            configSelect: [
                {
                    name: "employee_id",
                    data: "employees",
                    textField: (me, d) => {
                        return `${d.name ?? '-'} <small class="text-muted">(${d.code ?? '-'})</small>`;
                    },
                    valueField: "id",
                    emptyText: LocaleManager.trans("Employee", "titles"),
                },
                {
                    name: "position",
                    data: "positions",
                    textField: "name",
                    valueField: "id",
                    emptyText: LocaleManager.trans("Position", "titles"),
                },
                {
                    name: "warning_type",
                    data: "warning_types",
                    textField: "name",
                    valueField: "id",
                    emptyText: LocaleManager.trans("Warning Type", "titles"),
                }
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn-vs-cancel",
                    click: (me, btn) => me.hide(false),
                },
                {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/emp-warning/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("warning_update_successfully");
                                        }
                                        else
                                        {
                                            cv_interact.success("warning_create_successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Add Warning",
                modifyTitle: "vslang:titles.Modify Warning",
                targetProp: "warning",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/emp-warning/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },

            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);

                if (me.controls.employee_id && me.controls.position) {
                    me.controls.position.setAttribute('disabled', 'true');

                    const updatePosition = () => {
                        const empId = me.controls.employee_id.value;
                        const emp = (data.employees || []).find(e => e.id == empId);
                        if (emp) {
                            me.controls.position.value = emp.position_id || "";
                        } else {
                            me.controls.position.value = "";
                        }
                        me.controls.position.dispatchEvent(new Event("change"));
                        if (window.jQuery) {
                            jQuery(me.controls.position).change();
                        }
                    };

                    me.controls.employee_id.addEventListener("change", updatePosition);

                    if (me.controls.employee_id.value) {
                        updatePosition();
                    }
                }
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var TaxBracketComponent = (function() {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_taxBracketComponent"
    );

    mThis.title_prop = "Tax Bracket";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTaxBracket");
    mThis.divFilter =
        mThis.self.querySelector("#_divFilter_taxBracketComponent") ||
        mThis.self.querySelector("#_divFilter");

    const formattedNumber = number => {
        number = Number(number) || 0;
        return number
            .toLocaleString("en-US", {
                useGrouping: true,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
            .replace(/,/g, " ");
    };

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle  text-nowrap ",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color:#1f386b; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `
        },
        {
            transTitle: "titles.Salary Range",
            className: "align-middle  text-nowrap ",
            data: (data, index, tr) => {
                const currency = data.currency_code || '';
                const lowerAmount = data.lower_amount;

                // Handle open-ended ranges (e.g., "$5,000 and upwards")
                // vs bounded ranges (e.g., "$1,000 to $5,000 USD")
                const rangeText = data.upper_amount == -1
                    ? `${lowerAmount} ${currency} ${LocaleManager.trans('and upwards', 'titles')}`
                    : `${LocaleManager.trans('Salary ranges from', 'titles')}${lowerAmount} ${LocaleManager.trans('to', 'titles')} ${data.upper_amount} ${currency}`;

                return `<p class="p-0 m-0">${rangeText}</p>`;
            }
        },

        {
            transTitle: "titles.Rate",
            className: "align-middle  text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="text-danger p-0 m-0">${data.rate} %</p>`;
            }
        },
        {
            transTitle: "titles.Bias",
            className: "align-middle  text-nowrap ",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(
                    data.bias,
                    data.currency_code
                )}</p>`;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle  text-nowrap ",
            data: data => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ??
                    ""}</span><br/>
                <small class="text-primary">${data.updated_at ?? ""}</small>
            </div>`
        },

        {
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_taxBracket_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.TaxBracketListView = new ListView("_taxBracket_list", {
            fetchApi: `${main_view.base_url}/mhr/tax-bracket/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null
        });

        if (mThis.divFilter) {
            mThis.divFilter.addEventListener("change", e => {
                e.preventDefault();
                mThis.TaxBracketListView.showPage(mThis.getDataFormFilter());
            });
        }
        mThis.btnAdd.onclick = function(e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.TaxBracketListView.showPage();
                }
            };
            if (!AuthManager.allowed(253)) return;
            TaxBracketDialog.show(op);
        };
        mThis.pr_tbl = mThis.TaxBracketListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_taxBracket_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Tax Bracket</span>',
                    icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_taxBracket"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Tax Bracket</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_taxBracket"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_taxBracket": {
                        mThis.editTaxBracket(id, menuLink);
                        break;
                    }
                    case "delete_taxBracket": {
                        mThis.deleteTaxBracket(id, menuLink);
                        break;
                    }

                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            }
        };
        if (!AuthManager.allowed(254)) return;
        TaxBracketDialog.show(op);
    };

    mThis.deleteTaxBracket = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.TaxBracketListView.showPage();
            }
        };
        if (!AuthManager.allowed(255)) return;
        cv_interact.confirm(
            "Delete this tax bracket?",
            {
                title: "Delete Tax Bracket",
                context: "delete",
                confirmButtonText: "Delete"
            },
            function(e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/tax-bracket/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then(res => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.TaxBracketListView.showPage();
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getDataFormFilter = () => {
        let p = {};
        if (mThis.divFilter) {
            mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
                const f = el.dataset.field;
                if (f) {
                    p[f] = el.value;
                }
            });
        }
        return p;
    };

    mThis.show = function() {
        mThis.init();

        // mThis.prepareFormOptions();
        mThis.TaxBracketListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const TaxBracketDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = op => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text"  name="lower_amount" class="form-control data-input" data-field="lower_amount" />
                                    <label vslang="titles.Lower Amount"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="upper_amount" class="form-control data-input" data-field="upper_amount" />
                                    <label vslang="titles.Upper Amount"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="rate" class="form-control data-input" data-field="rate" />
                                    <label vslang="titles.Rate"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                <div class="vs-material-field">
                                     <input type="text"  name="bias" class="form-control data-input" data-field="bias" />
                                    <label vslang="titles.Bias"></label>
                                </div>
                            </div>
                             <div class="col-6">
                                <div class="vs-material-field">
                                     <select  class="modal-select data-input" name="currency_code" data-field="currency_code" disabled>
                                     </select>
                                     <label vslang="titles.Currency">Currency</label>
                                </div>
                            </div>

                        </div>`
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span class="text-white">Cancel</span>',
                        cssClass: "btn btn-sm btn-warning",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        }
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-sm btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;
                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/tax-bracket/save"
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then(res => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        }
                    }
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Tax Bracket",
                    modifyTitle: "vslang:titles.Modify Tax Bracket",
                    targetProp: "tax_bracket",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/tax-bracket/form-options"
                        ].join(""),
                        params: op => {
                            return { id: op.id };
                        }
                    }
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },
                configSelect: [
                    {
                        name: "currency_code",
                        data: "currency_codes",
                        textField: "code",
                        valueField: "code"
                    }
                ],
                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                    me.controls.currency_code.value = VSMoney.getCurrency().code;
                }
            });

        dialog.show(op);
    };
    return self;
})();

"use strict";
var PositionComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_positionComponent",
    );

    mThis.title_prop = "Positions";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddPosition");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_search_position");
    mThis.elDepartment = mThis.self.querySelector("#el_department");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "",
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="d-block text-prm-custom text-capitalize">${data.name ?? "_"}</span>
                <span class="d-block text-primary ">${data.name_kh ?? "_"}</span>`,
        },
        {
            transTitle: "titles.ShortCut",
            className: "align-middle text-nowrap text-left",
            data: (data) =>
                `<span class="text-primary-custom ">${data.code}</span>`,
        },
        {
            transTitle: "titles.Department",
            className: "align-middle text-nowrap text-left",
            data: (data) =>
                `<span class="text-primary-custom ">${data.department}</span>`,
        },
         {
            transTitle: "titles.Job Level",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-capitalize text-primary-custom">${data.level}</span>`,
        },
        {
            transTitle: "titles.Staff Group",
            className: "align-middle text-nowrap",
            data: (data) =>
                `<span class="text-primary-custom">${data.staff_group}</span>`,
        },

        {
            transTitle: "titles.Salary",
            className: "align-middle text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${VSMoney.formatAmount(data.salary, data.currency_code)}</p>`;
            },
        },
        {
            transTitle: "titles.Description",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-prm text-capitalize" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.description ?? "-"}</span>
                    </div>
                `;
            },
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class='text-primary-custom' >${data.update_user ?? ""}</span><br/>
                <small >${data.updated_at ?? ""}</small>
            </div>`,
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_position_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.PositionListView = new ListView("_position_list", {
            fetchApi: `${main_view.base_url}/mhr/position/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.PositionListView.showPage(mThis.getFilterData());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.PositionListView.showPage();
                },
            };
            if (!AuthManager.allowed(219)) return;
            PositionDialog.show(op);
        };
        mThis.listContainer = mThis.PositionListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.PositionListView) {
                    mThis.PositionListView.showPage(mThis.getFilterData());
                } else {
                    console.error("PositionListView is not defined");
                }
            }, 200);
        });

        mThis.initDropdownMenus(mThis.listContainer);

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_position_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Position">Modify Position</span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_position",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Position">Delete Position</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_position",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_position": {
                        mThis.editPosition(id, menuLink);
                        break;
                    }
                    case "delete_position": {
                        mThis.deletePosition(id, menuLink);
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

    mThis.editPosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(220)) return;
        PositionDialog.show(op);
    };

    mThis.deletePosition = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.PositionListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(221)) return;
        cv_interact.confirm(
            "delete_position",
            {
                title: "Delete Position",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/position/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "delete_success_position",
                                );
                                mThis.PositionListView.showPage();
                            } else cv_interact.error(res.error_message);
                        });
                }
            },
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/position/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elDepartment,
                    d.departments || [],
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Department", "titles"),
                    "",
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();

        mThis.PositionListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();

const PositionDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static", //User click outside form, do not close form
            keyboard: true, //prevent user from using ESC key
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <select data-style="material" name="department" class="form-control data-input" placeholder="${LocaleManager.trans('Department', 'labels')}"  data-field="department_id"></select>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="job_level" class="form-control data-input" placeholder="${LocaleManager.trans('Job Level', 'labels')}"  data-field="job_level_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="position" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label vslang="labels.Position (EN)"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="position_kh" class="data-input form-control form_input" data-field="name_kh" placeholder=" " />
                                <label vslang="labels.Position (KH)"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" data-type="text" name="code" class="data-input form-control form_input" data-field="code" placeholder=" " />
                                <label vslang="labels.Shortcut"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="staff_group" class="form-control data-input" placeholder="${LocaleManager.trans('Staff Group', 'labels')}"  data-field="staff_group_id"></select>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="number" data-type="text" name="salary" class="data-input form-control form_input" data-field="salary" placeholder=" " />
                                <label vslang="labels.Salary"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <select data-style="material" name="currency_code" class="form-control data-input" placeholder="${LocaleManager.trans('Currency Code', 'labels')}"  data-field="currency_code"></select>
                        </div>
                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                <label vslang="labels.Description"></label>
                            </div>
                        </div>

                    </div>`,
                ].join("");
            },

            configSelect: [
                {
                    name: "department",
                    data: "departments",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "job_level",
                    data: "job_levels",
                    textField: "level",
                    valueField: "id",
                },
                {
                    name: "staff_group",
                    data: "staff_groups",
                    textField: "name",
                    valueField: "id",
                },
                {
                    name: "currency_code",
                    data: "currency_codes",
                    textField: "code",
                    valueField: "code",
                },
            ],
            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/position/save"].join(
                                    "",
                                ),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_success_position",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_success_position",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Add Position",
                modifyTitle: "vslang:titles.Modify Position",
                targetProp: "positions",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/position/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                //    onResponse: (me, res)=>{
                //      console.log('result from api "/form-options": ', res);
                //    }
            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.controls.currency_code.value = VSMoney.getCurrency().code;
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var DepartmentComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_departmentComponent",
    );

    mThis.title_prop = "Departments";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddDepartment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    // mThis.elStatus = mThis.self.querySelector("#el_status");
    mThis.elSearch = mThis.self.querySelector("#_search_department");
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
            // data: (data, index, i) => {

            // },
        },
        {
            transTitle: "titles.No",
            className: "align-middle text-capitalize text-left",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Department",
            className: "align-middle text-capitalize p-3  text-left",
            data: (data) => `
                <span class="text-primary-custom">${data.name}</span>`,
        },
        {
            transTitle: "titles.Shortcut",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) =>
                `<span class="text-warning ">${data.shortcut}</span>`,
        },
        {
            transTitle: "titles.Update By",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-primary-custom" style="font-size: 12px;">${
                    data.update_user ?? ""
                }</span>
            </div>`,
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span class="text-primary-custom" style="font-size: 12px;">${
                    data.updated_at ?? ""
                }</span>
            </div>`,
        },

        {
            className: 'col_action align-middle',
            data: function (data, row, display) {
                return `
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="btn_department_action" data-id="${data.id}" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-danger-emphasis fs-5"></i>
                            </a>
                        </div>
                    </div>
                `;
            }
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.DepartmentListView = new ListView("_dep_list", {
            fetchApi: `${main_view.base_url}/mhr/department/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

         mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();

               mThis.DepartmentListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.DepartmentListView.showPage();
                },
            };
            if (!AuthManager.allowed(217)) return;
            DepartmentDialog.show(op);
        };
        mThis.listContainer = mThis.DepartmentListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.DepartmentListView) {
                    mThis.DepartmentListView.showPage(mThis.getFilterData());
                } else {
                    console.error("Department List view is not defined");
                }
            }, 200);
        });
        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };

       mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_department_action",
            cssClass: "bg-white shadow",

            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Modify Department"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_department",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Department"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_department",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_department": {
                        mThis.editDepartment(id, menuLink);
                        break;
                    }
                    case "delete_department": {
                        mThis.deleteDepartment(id, menuLink);
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
    mThis.editDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(216)) return;
        DepartmentDialog.show(op);
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters = mThis.divFilter.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.deleteDepartment = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.DepartmentListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(218)) return;
        cv_interact.confirm(
            "delete_department?",
            {
                title: "Delete Department",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/department/delete`,
                            { id: id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_department_success");
                                mThis.DepartmentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/department/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.DepartmentListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };
    return mThis;
})();

const DepartmentDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog = new GeneralDialog({
            cssClass: "modal-md vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row g-3">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input id="dep_name" type="text" data-type="text" name="department" class="data-input form-control form_input" data-field="name" placeholder=" " />
                                <label for="dep_name" vslang="labels.Department"></label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="vs-material-field">
                                <input id="dep_shortcut" type="text" data-type="text" name="shortcut" class="data-input form-control form_input" data-field="shortcut" placeholder=" " />
                                <label for="dep_shortcut" vslang="titles.Shortcut"></label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea id="dep_description" name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                <label for="dep_description" vslang="labels.Description"></label>
                            </div>
                        </div>

                    </div>`,
                ].join("");
            },

            // configSelect:[
            //    {
            //      name:"department",
            //      data:'departments',
            //      textField:"name",
            //      valueField:'id'
            //    },
            // ],
            buttons: [
                {
                    label: '<span class="text-warning" vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-default",
                    click: (me, btn) => {
                        //Close with Cancel button
                        me.hide(false);
                    },
                },
                {
                    label: "<span vslang='buttons.Save'></span>",
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id; //get "id" from op

                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/mhr/department/save",
                                ].join(""),
                                p,
                                btn,
                                null,
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.hide(true, p);
                                    if (me.dataOptions.id > 0) {
                                        cv_interact.success(
                                            "update_department_success",
                                        );
                                    } else {
                                        cv_interact.success(
                                            "create_department_success",
                                        );
                                    }
                                } else cv_interact.error(res.error_message);
                            });
                    },
                },
            ],
            prepareFormOptions: {
                createTitle: "vslang:titles.Add Department",
                modifyTitle: "vslang:titles.Modify Department",
                targetProp: "departments",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/department/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },

            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var JobsLevelComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_jobsLevelComponent");

    mThis.initAlready = false;
    mThis.title_prop = "Job Levels";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddJobLevel");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_jobsLevelComponent");
    mThis.elSearch = mThis.self.querySelector("#_job_level_search");
    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },

        {
            transTitle: "titles.Ranking",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<div class=" text-start p-1 " ><span class="">${data.rank}</span></div>`,

        },
        {
            transTitle: "titles.Job Level",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<span class="text-primary-custom">${data.name ?? 'HD'}</span>`,
        },

        {
            transTitle: "titles.Description",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<div  class="text-remark text-muted" >${data.description}</div>`,
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 12px; color: #2b3991;">${data.update_date ?? ""}</span>
            </div>`,
        },


        {
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_jobLevel_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.JobLevelListView = new ListView("_job_level_list", {
            fetchApi: `${mThis.base_url}/mhr/job_level/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.JobLevelListView.showPage();
                },
            };
            if (!AuthManager.allowed(204)) return;
            JobLevelDialog.show(op);
        };
        mThis.pr_tbl = mThis.JobLevelListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.JobLevelListView) {
                    mThis.JobLevelListView.showPage(mThis.getFilterData());
                } else {
                    console.error("jobLevel is not defined");
                }
            }, 200);
        });

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_jobLevel_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Job Level</span>',
                    icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_jobevel"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_jobevel"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_jobevel": {
                        mThis.editJobLevel(id, menuLink);
                        break;
                    }
                    case "delete_jobevel": {
                        mThis.deleteJobLevel(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        return p;
    };

    mThis.editJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        if (!AuthManager.allowed(205)) return;
        JobLevelDialog.show(op);
    };

    mThis.deleteJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        if (!AuthManager.allowed(206)) return;
        cv_interact.confirm(
            "delete_job_level?",
            {
                title: "Delete Job level",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/job_level/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "delete_job_level_successfully"
                                );
                                mThis.JobLevelListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/mhr/job_level/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.JobLevelListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();

const JobLevelDialog = (() => {
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
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text"  name="name" class="form-control data-input" data-field="name" />
                                    <label vslang="titles.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number" name="rank" class="form-control data-input" data-field="rank" />
                                    <label vslang="titles.Rank"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea type="text" class="form-control data-input" data-field="description" id="description" placeholder=""></textarea>
                                    <label vslang="titles.Description"></label>
                                </div>
                            </div>
                         </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const jl = me.getData();

                            jl.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/job_level/save",
                                    ].join(""),
                                    jl,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, jl);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success( 'update_job_level_successfully');
                                        }
                                        else
                                        {
                                            cv_interact.success('create_job_level_successfully');
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveJobLevel = (jl) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Job Level",
                    modifyTitle: "vslang:titles.Modify Job Level",
                    targetProp: "job_levels",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/job_level/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
"use strict";

var BenefitDisbursePolicyComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector( "#_main_benefit_disbursement_policy_component");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_benefit_disbursement_policy_component");
    mThis.title_prop = "Disbursement Policy";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddbdp");
    mThis.elBenefit = mThis.self.querySelector("#el_benefit");

    const monthNames = [
        "All",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            transTitle: "titles.Benefit",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "benefit_name",
        },

        {
            transTitle: "titles.Target Month",
            className: "align-middle",
            data: (data) => {
                const month = monthNames[data.target_month ] ?? "";

                return `<p class="p-0 m-0">${month} </p>`;
            },
        },

        {
            transTitle: "titles.Target Year",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: "target_year",
        },
        {
            transTitle: "titles.Withdraw Rate",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data, index, tr) => {
                return `<p class="p-0 m-0">${data.withdraw_rate ?? 0} %</p>`;
            },
        },

         {
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_bdp_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BdpListView = new ListView("_benefit_disbursement_policy_list", {
            fetchApi: `${main_view.base_url}/mhr/disburse-policy/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BdpListView.showPage(mThis.getDataFormFilter());
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BdpListView.showPage(mThis.getDataFormFilter());
                },
            };
            if (!AuthManager.allowed(279)) return;
            BdpDialog.show(op);
        };

        mThis.pr_tbl = mThis.BdpListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement || mThis.pr_tbl;
        sh_parent.style.height = (window.innerHeight - 225) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 225) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BdpListView.showPage(mThis.getDataFormFilter());
        });

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_bdp_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify">Modify Policy</span>',
                    icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_bdp"
                },
                {
                    html: '<span class="ps-2 " vslang="titles.Delete">Delete Policy</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bdp"
                }
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_bdp": {
                        mThis.editBfp(id, menuLink);
                        break;
                    }
                    case "delete_bdp": {
                        mThis.deleteBdp(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.editBfp = (id, btn) => {
        if (!AuthManager.allowed(280)) return;
        BdpDialog.show({
            id,
            btn,
            onClose: () => mThis.BdpListView.showPage(mThis.getDataFormFilter()),
        });
    };

    mThis.deleteBdp = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BdpListView.showPage(mThis.getDataFormFilter());
            },
        };
        if (!AuthManager.allowed(281)) return;
        cv_interact.confirm(
            "Delete this benefit disbursement policy?",
            {
                title: "Delete Benefit Disbursement Policy",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/disburse-policy/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.BdpListView.showPage(mThis.getDataFormFilter());
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getDataFormFilter = () => {
        let filters = {
            benefit_id: mThis.elBenefit.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };

    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/mhr/disburse-policy/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elBenefit,
                    d.benefits,
                    "id",
                    "name",
                    "",
                    LocaleManager.trans("All Benefits","titles"),
                    ""
                );
            });
    };

    mThis.show = function () {
        mThis.init();
        mThis.prepareFormOptions();
        mThis.BdpListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();

const BdpDialog = (() => {
    const self = {};
    let dialogAdd = null;
    self.show = (op) => {

        dialogAdd =
            dialogAdd ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    const months = [
                        { value: 0, name: "All" },
                        { value: 1, name: "January" },
                        { value: 2, name: "February" },
                        { value: 3, name: "March" },
                        { value: 4, name: "April" },
                        { value: 5, name: "May" },
                        { value: 6, name: "June" },
                        { value: 7, name: "July" },
                        { value: 8, name: "August" },
                        { value: 9, name: "September" },
                        { value: 10, name: "October" },
                        { value: 11, name: "November" },
                        { value: 12, name: "December" },
                    ];

                    const currentYear = new Date().getFullYear();
                    const years = Array.from(
                        { length: 10 },
                        (_, i) => currentYear + i
                    );

                    return [
                        `<div class="row g-3">

                            <div class="col-6">
                                <select data-style="material" placeholder="${LocaleManager.trans('Benefit', 'labels')}" name="benefits" class="data-input form-control" data-field="benefit_id" id="benefit_id"> </select>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input name="withdraw_rate" class="form-control data-input" data-field="withdraw_rate" />
                                    <label vslang="titles.Withdraw Rate"></label>
                                </div>
                            </div>

                        <div class=" col-6">
                            <select data-style="material" placeholder="${LocaleManager.trans('Month', 'labels')}" name="month" class="form-control data-input" data-field="target_month">
                                ${months
                                        .map(
                                            (month) =>
                                                `<option value="${month.value}">${month.name}</option>`
                                        )
                                        .join("")}
                             </select>
                        </div>
                        <div class=" col-6">
                            <select data-style="material" placeholder="${LocaleManager.trans('Year', 'labels')}" name="year" class="form-control data-input" data-field="target_year">
                                 ${years
                                    .map(
                                        (year) =>
                                            `<option value="${year}">${year}</option>`
                                    )
                                    .join("")}
                             </select>
                        </div>
                    </div>`,
                    ].join("");
                },

                configSelect: [
                    {
                        name: "benefits",
                        data: "benefits",
                        textField: "name",
                        valueField: "id",
                    },
                ],

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/disburse-policy/save"].join(
                                        ""
                                    ),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated benefit disburse policy successfully");
                                        }
                                        else{
                                            cv_interact.success("Added benefit disburse policy successfully");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],

                prepareFormOptions: {
                    createTitle: "vslang:titles.Add Benefit Disburse Policy",
                    modifyTitle: "vslang:titles.Edit Benefit Disburse Policy",
                    targetProp: "disburse_policy",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/disburse-policy/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialogAdd.show(op);
    };
    return self;
})();
"use strict";

var CheckPointComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_check_point_component");

    mThis.title_prop = "Checkpoints";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPoint");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_check_point_search");
    mThis.elCategory = mThis.self.querySelector("#el_check_point_category");

    mThis.cols = [
        {
            className: "align-middle text-nowrap ",
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.name ?? "-"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Category",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.category_name ?? "-"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap text-center",
            data: (data, index, tr) => {
                const [date, time] = (data.updated_at ?? "").split(" ");
                return `<div class="d-flex flex-column align-items-center justify-content-center text-center mx-auto">
                    ${data.update_user ? `<span class="text-capitalize text-prm-custom">${data.update_user}</span>` : ""}
                    <small class="text-muted">${date || "-"}</small>
                    <small class="text-muted">${time ?? ""}</small>
                </div>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle text-center",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_check_point" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_check_point" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.CheckPointListView = new ListView("_check_point_list", {
            fetchApi: `${main_view.base_url}/mhr/check-point/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.CheckPointListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(302)) return;
            CheckPointDialog.show(op);
        };
        mThis.pr_tbl = mThis.CheckPointListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.CheckPointListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_check_point");
            if (btn) {
                mThis.deleteCheckPoint(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_check_point");
            if (btn) {
                mThis.editCheckPoint(btn.dataset.id, btn);
            }
        });
    };

    mThis.editCheckPoint = (id, btn) => {
        if (!AuthManager.allowed(301)) return;
        CheckPointDialog.show({ id, btn, onClose: () => mThis.CheckPointListView.showPage(mThis.getFilterData()), });
    };

    mThis.deleteCheckPoint = (id, menuLink) => {
        if (!AuthManager.allowed(303)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Checkpoint",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(`${main_view.base_url}/mhr/check-point/delete`, { id: id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_check_point");
                                mThis.CheckPointListView.showPage(mThis.getFilterData());
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/check-point/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elCategory, d.check_point_categories, "id", "name", "", LocaleManager.trans("All Categories", "titles"), "");
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.CheckPointListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const CheckPointDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="category" class="data-input form-control" data-field="category_id" placeholder="${LocaleManager.trans('Category', 'labels')}">
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input id="_check_point_name" type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label for="_check_point_name" vslang="labels.Name"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                configSelect: [
                    {
                        name: "category",
                        data: "check_point_categories",
                        textField: "name",
                        valueField: "id",
                    },
                ],

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/check-point/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_check_point");
                                        }
                                        else {
                                            cv_interact.success("create_success_check_point");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Check Point",
                    modifyTitle: "vslang:titles.Edit Check Point",
                    targetProp: "check_points",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/check-point/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";

var CheckPointCategoryComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_check_point_category_component");

    mThis.title_prop = "Checkpoint Categories";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddCheckPointCategory");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_check_point_category_search");

    mThis.cols = [
        {
            className: "align-middle text-nowrap ",
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                console.log(123456,data);

                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.name ?? "-"}</span>
                    </div>
                `;
             }
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap text-center",
            data: (data, index, tr) => {
                const [date, time] = (data.updated_at ?? "").split(" ");
                return `<div class="d-flex flex-column align-items-center justify-content-center text-center mx-auto">
                    ${data.update_user ? `<span class="text-capitalize text-prm-custom">${data.update_user}</span>` : ""}
                    <small class="text-muted">${date || "-"}</small>
                    <small class="text-muted">${time ?? ""}</small>
                </div>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle text-center",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_check_point_category" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_check_point_category" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.CheckPointCategoryListView = new ListView("_check_point_category_list", {
            fetchApi: `${main_view.base_url}/mhr/check-point-category/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(299)) return;
            CheckPointCategoryDialog.show(op);
        };
        mThis.pr_tbl = mThis.CheckPointCategoryListView.getListContainer();
        const sh_parent = mThis.pr_tbl;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };

    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_check_point_category");
            if (btn) {
                mThis.deleteCheckPointCategory(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_check_point_category");
            if (btn) {
                mThis.editCheckPointCategory(btn.dataset.id, btn);
            }
        });
    };

    mThis.editCheckPointCategory = (id, btn) => {
        if (!AuthManager.allowed(298)) return;
        CheckPointCategoryDialog.show({ id, btn, onClose: () => mThis.CheckPointCategoryListView.showPage(mThis.getFilterData()),});
    };

    mThis.deleteCheckPointCategory = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());
            },
        };
        // if (!AuthManager.allowed(300)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete Checkpoint Category",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call( `${main_view.base_url}/mhr/check-point-category/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_check_point_category");
                                mThis.CheckPointCategoryListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,

        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;

        });

        return p;
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/check-point-category/form-options`,null,null,null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show =  (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.CheckPointCategoryListView.showPage(mThis.getFilterData());

        });

    };
    return mThis;
})();

const CheckPointCategoryDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/check-point-category/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_check_point_category");
                                        }
                                        else{
                                        cv_interact.success("create_success_check_point_category");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Checkpoint Category",
                    modifyTitle: "vslang:titles.Edit Checkpoint Category",
                    targetProp: "check_point_categories",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/check-point-category/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var AttendanceTracksComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Track Shifts";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_workshiftComponent");

    mThis.btnAddShiftDetail = mThis.self.querySelector("#_btnAddShiftDetail");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.work_shift_header = mThis.self.querySelector("#_work_shift_header");
    mThis.elFilter_status = mThis.self.querySelector("#el_work_shift");
    const list_container = mThis.self.querySelector("#_work_shift_body");
    const header_container = mThis.self.querySelector("#_work_shift_header");

    mThis.init = function () {
        if (mThis.initAlready) return;
        mThis.WorkshiftListView = () => {
            vsapi
                .call(
                    `${mThis.base_url}/mhr/shift-details/list-paginate`,mThis.getFilterData(),null,null).then((res) => {
                    if (res.status_code === 200) {
                        mThis.renderWorkShift(list_container, res.data);
                    }
                });
        };

        let html = `
        <div class="_work_shift_header" id="_work_shift_header">
            <div id="work_shift_type" class="col-12 p-3 border d-flex">
                <div class="shift_date col-1-5">Monday</div>
                <div class="shift_date col-1-5">Tuesday</div>
                <div class="shift_date col-1-5">Wednesday</div>
                <div class="shift_date col-1-5">Thursday</div>
                <div class="shift_date col-1-5">Friday</div>
                <div class="shift_date col-1-5">Saturday</div>
                <div class="shift_date col-1-5">Sunday</div>
            </div>
        </div>`;
        header_container.innerHTML = html;

        mThis.btnAddShiftDetail.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Scanpoint has been saved successfully!");
                    mThis.WorkshiftListView();
                },
            };
            if (!AuthManager.allowed(487)) return;
            ShiftDetailDialog.show(op);
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.WorkshiftListView(mThis.getFilterData());
            };
        });


        mThis.initDropdownMenus(list_container);
        mThis.initAlready = true;
    };




    mThis.renderWorkShift = (div, data) => {
        data = data ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seem to work properly. You may need to refresh the page"
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.beginRenderWorkShift(div, data);
        });
    };
    mThis.beginRenderWorkShift = (div, data) => {
        let html = `
        <div class="_work_shift_body col-12">
            <div class="row">
    `;

        for (const [day, shifts] of Object.entries(data)) {
            html += `
            <div class="time_cards col-2">
                <div class="day_card">
        `;

            if (shifts.length === 0) {
                html += `<div class="card p-4 bg-secondary no_shifts">No Shift</div>`;
            } else {
                shifts.forEach((shift) => {
                    const actionClass =
                        shift.action === "Check In" ||
                        shift.action === "CheckIn"
                            ? "bg-green"
                            : shift.action === "Check Out" ||
                              shift.action === "CheckOut"
                            ? "bg-gold"
                            : "";

                    html += `
                    <div class="shift_card ${actionClass}">
                        <div class="shift_element">
                            <div class="shift_time">${shift.time}</div>
                            <div class="shift_action">${shift.action}</div>
                        </div>
                        <div class="d-flex justify-content-start align-items-start">
                            <div class="text-end gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="${
                                    shift.action_id > 1
                                        ? "d-none"
                                        : "btn_shift-details_action"
                                }" data-id="${shift.id}" data-statusid="${
                        shift.status_id
                    }" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5 "></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                });
            }

            html += `
                </div>
            </div>
        `;
        }

        html += `
            </div>
        </div>
    `;

        div.innerHTML = html;
    };
    mThis.getFilterData = () => {
        const p = {
            work_shift_id: mThis.elFilter_status.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_shift-details_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit WorkShift">Edit WorkShift</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_shift-details",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete WorkShift">Delete WorkShift</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_shift-details",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_shift-details": {
                        mThis.editWorkShift(id, menuLink);
                        break;
                    }
                    case "delete_shift-details": {
                        mThis.deleteWorkShift(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editWorkShift = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                cv_interact.success("Scanpoint is updated successfully!");
                mThis.WorkshiftListView();
            },
        };
        if (!AuthManager.allowed(488)) return;
        ShiftDetailDialog.show(op);
    };
    mThis.deleteWorkShift = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
        };
        if (!AuthManager.allowed(489)) return;
        cv_interact.confirm(
            "Are you sure you want to delete this scanpoint?",
            {
                title: "Delete Scanpoint",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/shift-details/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("Deleted successfully!");
                                mThis.WorkshiftListView();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });

                }
            }
        );
    };

    mThis.prepareFormOptions = () => {
        vsapi.call(`${main_view.base_url}/mhr/shift-details/form-options`,null,null,null).then((res) => {
                if (res.status_code === 200){
                    const d = res.data;
                    VSUtil.setComboItems(mThis.elFilter_status,d.shifts,"id","name",false,null,1);
                }
        });
    };

    mThis.show = function () {
        mThis.init();

        mThis.prepareFormOptions();
        mThis.WorkshiftListView();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };
    return mThis;
})();
const ShiftDetailDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {

        dialog = new GeneralDialog({
            cssClass: "modal-md",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    `<div class="row">
                            <div class="form-group col-md-12">
                                <label for="shifts" class="form-label" vslang="titles.Work Shift"></label>
                                <span class="text-danger">*</span>
                                <select class="form-control data-input" name="shifts" data-field="work_shift_id"></select>
                            </div>
                            <div class="form-group col-md-12">
                                <div name="day" class="d-flex week data-input" data-field="day">
                                    <div class="days" data-value="Mon">Mon</div>
                                    <div class="days" data-value="Tue">Tue</div>
                                    <div class="days" data-value="Wed">Wed</div>
                                    <div class="days" data-value="Thu">Thu</div>
                                    <div class="days" data-value="Fri">Fri</div>
                                    <div class="days" data-value="Sat">Sat</div>
                                    <div class="days" data-value="Sun">Sun</div>
                                </div>

                            </div>
                            <div class="form-group col-6">
                                <label for="time" class="form-label" vslang="titles.Time">Time</label>
                                <input type="time" class="form-control data-input" data-field="time" />
                            </div>
                            <div class="form-group col-6">
                                <label for="time" class="form-label" vslang="titles.Sesion">Session</label>
                                <input class="form-control data-input" data-field="session" placeholder="m, a or e"/>
                            </div>
                            <div class="form-group col-6">
                                <label for="action" class="form-label" vslang="titles.Action">Action</label>
                                <select class="modal-select data-input form_input" data-field="action">
                                    <option value="0">select action</option>
                                    <option value="Check In">Check In</option>
                                    <option value="Check Out">Check Out</option>
                                </select>
                            </div>
                            <div class="form-group col-6">
                            <label for="action" class="form-label" vslang="titles.Scan Order Number">Scan Order Number</label>
                            <input type="number" class="form-control data-input" placeholder="1, 2, 3 or 4" data-field="shift_order_number" />

                        </div>
                            <div class="form-group col-12">
                                <label for="time" class="form-label" vslang="titles.Allow Scan">Allow Scan</label>
                            </div>
                            <div class="form-group col-6 d-flex">
                                <label for="time" class="form-label w-25 my-auto" vslang="titles.From">From</label>
                                <input type="time" class="form-control w-75 data-input" data-field="start_time" />
                            </div>
                            <div class="form-group col-6 d-flex ">
                                <label for="time" class="form-label w-25 my-auto" vslang="titles.To">To</label>
                                <input type="time" class="form-control w-75 data-input" data-field="end_time" />
                            </div>

                         </div>`,
                ].join("");
            },
            contentCreated: (me) => {
                const days = me.divModal.querySelectorAll(".days");
                days.forEach((day) => {
                    day.addEventListener("click", () => {
                        day.classList.toggle("active");
                    });
                });

                if (op.days) {
                    const selectedDays = op.days.split("|");
                    days.forEach((day) => {
                        if (selectedDays.includes(day.dataset.value)) {
                            day.classList.add("active");
                        }
                    });
                }
            },

            configSelect: [
                {
                    name: "shifts",
                    data: "shifts",
                    textField: "name",
                    valueField: "id",
                },
            ],
            buttons: [
                {
                    label: '<span class="text-shift-details">Cancel</span>',
                    cssClass: "btn btn-default",
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: "<span>Save</span>",
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const p = me.getData();

                        p.id = me.dataOptions.id;

                        const selectedDays = [];
                        const days =
                            me.divModal.querySelectorAll(".days.active");
                        days.forEach((day) => {
                            selectedDays.push(day.dataset.value);
                        });
                        p.days = selectedDays.join("|");

                        vsapi.call([ main_view.base_url,"/mhr/shift-details/save"].join(""),p,btn,null).then((res) => {
                            if (res.status_code == 200) {
                                me.hide(true, p);
                            } else cv_interact.error(res.error_message);
                        });


                    },
                },
            ],

            prepareFormOptions: {
                createTitle: "Add Scan",
                modifyTitle: "Edit Scan",
                targetProp: "shift_details",
                api: {
                    endpoint: [
                        main_view.base_url,
                        "/mhr/shift-details/form-options",
                    ].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
                // onResponse: (me, res) => {
                //     console.log('Result from API "/form-options": ', res);
                // },
            },
            onPrepareForm: (me, data) => {
                LocaleManager.translateZone(me.divModal);
                me.divModal.querySelectorAll(".data-input").forEach((el) => {
                    const data_member = el.dataset.field;
                    let id = op.id;
                    if (id) {
                        const days = me.divModal.querySelectorAll(".days");

                        days.forEach((day) => {
                            if (data.shift_details.day == day.dataset.value) {
                                day.classList.add("active");
                            } else day.classList.remove("active");

                            day.classList.add("disabled");
                        });

                        if (el.tagName.toLowerCase() === "select") {
                            if (
                                data_member == "shifts" ||
                                data_member == "work_shift_id" ||
                                data_member == "emp_type_id"
                            ) {
                                el.setAttribute("disabled", true);
                            }
                        }
                    } else {
                        const days = me.divModal.querySelectorAll(".days");
                        days.forEach((day) => {
                            day.classList.remove("disabled");
                        });
                    }
                    const shift = WorkshiftComponent.getFilterData().work_shift_id;
                    if(shift) {
                        me.controls.shifts.value = shift;
                    }
                });
            },
        });

        dialog.show(op);
    };

    return self;
})();

"use strict";
var ExitFormComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_exit_form_component");

    mThis.title_prop = "Exit Forms";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddExitForm");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_exit_form_search");
    mThis.cols = [
        {
            transTitle: "titles.Staff Name",
            className: "align-middle text-start",
            data: (data) => {
                return `
                <div class="d-flex align-items-center gap-2">
                    <img class="image-student-tbl" src="${data.image_url || main_view.asset_url + "/images/default/default-staff.png"}" alt="" style="width: 40px; height: 40px; border-radius: 50%;"/>
                    <div>
                        <span class="d-block fw-semibold">${data.emp_name ?? "-"}</span>
                        <span class="d-block text-muted" style="font-size: 12px;">${data.email ?? "-"}</span>
                    </div>
                </div>`;
            },
        },
        {
            transTitle: "titles.Position",
            className: "align-middle text-capitalize",
            data: (data) =>
                `<span class="text-pr-custom">${data.position ?? "-"}</span>`,
        },
        {
            transTitle: "titles.Form",
            className: "align-middle",
            data: (data) =>
                `<span class="text-pr-custom">${data.name ?? "-"}</span>`,
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap",
            data: (data) => {
                if (data.is_finished == 1) {
                    return `<span class="badge rounded-pill bg-success">Done</span>`;
                }
                return `<span class="badge rounded-pill bg-warning text-dark">Pending</span>`;
            },
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-center align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary btn_edit_exit_form" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-danger btn_delete_exit_form" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-success btn_view_exit_form" data-id="${data.id}" data-empid="${data.emp_id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-eye"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ExitFormListView = new ListView("_exit_form_list", {
            fetchApi: `${mThis.base_url}/mhr/exit-form/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
            },
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            };
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            if (!AuthManager.allowed(282)) return;
            ExitFormDialog.show({
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ExitFormListView.showPage(mThis.getFilterData());
                },
            });
        };

        mThis.listContainer = mThis.ExitFormListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.height = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };

        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };

    mThis.elSearch.addEventListener("keyup", () => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.ExitFormListView) {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            }
        }, 200);
    });

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            if (f) p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_edit_exit_form");
            if (btn) {
                mThis.editExitForm(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn_delete_exit_form");
            if (btn) {
                mThis.deleteExitForm(btn.dataset.id, btn);
                return;
            }
            btn = VSUtil.closestLimited(e.target, ".btn_view_exit_form");
            if (btn) {
                mThis.viewExitForm(btn.dataset.id, btn);
            }
        });
    };

    mThis.editExitForm = (id, menulink) => {
        if (!AuthManager.allowed(283)) return;
        ExitFormDialog.show({
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.deleteExitForm = (id, menulink) => {
        if (!AuthManager.allowed(284)) return;
        const op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        };

        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/exit-form/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code === 200) {
                                cv_interact.success("delete_success_exit_form");
                                mThis.ExitFormListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        })
                        .catch(() => {
                            cv_interact.error(
                                "An error occurred. Please try again."
                            );
                        })
                        .finally(() => {
                            menulink.disabled = false;
                        });
                } else {
                    menulink.disabled = false;
                }
            }
        );
    };

    mThis.viewExitForm = (form_id, menulink) => {
        if (!AuthManager.allowed(285)) return;
        ViewExitFormDialog.show({
            form_id: form_id,
            btn: menulink,
            onClose: () => {
                mThis.ExitFormListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.show = function () {
        mThis.init();
        mThis.ExitFormListView.showPage(mThis.getFilterData(), null, () => {
            main_view.setContentView(mThis.self, mThis.title_prop);
        });
    };

    return mThis;
})();

const ExitFormDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-12">
                                <select data-style="material" name="employee" class="form-control data-input" data-field="emp_id" placeholder="${LocaleManager.trans("Employee", "labels")}"></select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="form_name" required class="form-control data-input" data-field="name" placeholder=" " />
                                    <label vslang="titles.Form"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="is_finished" class="form-control data-input" data-field="is_finished" placeholder="${LocaleManager.trans("Status", "titles")}">
                                    <option value="0">Pending</option>
                                    <option value="1">Done</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) =>
                            `<div class="d-flex gap-2"><img class="img_select" src="${d.image_url || ""}" alt="" /> <div class="d-flex flex-column"><span>${d.name ?? "-"}</span><span>${d.position ?? ""}</span></div></div>`,
                        valueField: "id",
                        emptyText: LocaleManager.trans("Employee", "labels"),
                    },
                ],
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();
                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [main_view.base_url, "/mhr/exit-form/save"].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("update_success_exit_form");
                                        } else {
                                            cv_interact.success("create_success_exit_form");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Exit Form",
                    modifyTitle: "vslang:titles.Modify Exit Form",
                    targetProp: "exit_forms",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/exit-form/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onPrepareForm: (me, data) => {
                    const form = data?.exit_forms || null;
                    if (form?.emp_id && me.controls.emp_id) {
                        me.controls.emp_id.value = form.emp_id;
                    }
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();

const ViewExitFormDialog = (() => {
    const self = {};
    let dialog = null;

    const signatureCell = () => {
        return [
            '<td class="align-top p-3">',
            '<div class="text-center mb-2">ហត្ថលេខា</div>',
            '<div style="min-height:90px;"></div>',
            "<div>ឈ្មោះ ........................................</div>",
            '<div class="mt-2">តំណែង .....................................</div>',
            '<div class="mt-3 text-center">កាលបរិច្ឆេទ<br>............................</div>',
            "</td>",
        ].join("");
    };

    self.show = (op) => {
        let htmlString = [
            '<div class="d-block position-relative min-height-top form_header">',
            '<h4 class="text-end form_title mb-3">',
            "</h4>",
            '<div class="employee-info-section">',
            '<table class="table table-bordered mb-0">',
            "<tbody>",
            "<tr>",
            "<td>ឈ្មោះបុគ្គលិក៖</td>",
            '<td class="employee_name"></td>',
            "<td>អត្តលេខ៖</td>",
            '<td class="employee_code"></td>',
            "</tr>",
            "<tr>",
            "<td>កាលបរិច្ឆេទបិទការងារ៖</td>",
            '<td class="employee_effective_date"></td>',
            "<td>នាយកដ្ឋាន ឬសាខា៖</td>",
            '<td class="employee_branch"></td>',
            "</tr>",
            "<tr>",
            '<td colspan="4">',
            '<div class="d-flex flex-wrap align-items-center gap-3">',
            "<span>គោលបំណង៖</span>",
            '<div class="form-check mb-0">',
            '<input type="checkbox" class="form-check-input" checked disabled>',
            '<label class="form-check-label">ការលាលែងពីតំណែង</label>',
            "</div>",
            '<div class="form-check mb-0">',
            '<input type="checkbox" class="form-check-input" disabled>',
            '<label class="form-check-label">ការបញ្ឈប់</label>',
            "</div>",
            '<div class="form-check mb-0">',
            '<input type="checkbox" class="form-check-input" disabled>',
            '<label class="form-check-label">ផ្សេងៗ (សូមបញ្ជាក់)៖</label>',
            "</div>",
            "</div>",
            "</td>",
            "</tr>",
            "</tbody>",
            "</table>",
            "</div>",
            "</div>",
            '<div class="pb-3 bg-white mt-3">',
            '<table class="table table-bordered tbl_exit_check_item mb-0">',
            "<thead>",
            "</thead>",
            "<tbody>",
            "</tbody>",
            "</table>",
            '<table class="table table-bordered mt-3 mb-0">',
            "<thead>",
            "<tr>",
            '<th class="align-middle text-center" style="background:#e8f0fe;color:#1a56db;">បុគ្គលិក</th>',
            '<th class="align-middle text-center" style="background:#e8f0fe;color:#1a56db;">បញ្ជាក់ដោយ</th>',
            '<th class="align-middle text-center" style="background:#e8f0fe;color:#1a56db;">បញ្ជាក់ដោយ</th>',
            "</tr>",
            "</thead>",
            "<tbody>",
            "<tr>",
            signatureCell(),
            signatureCell(),
            signatureCell(),
            "</tr>",
            "</tbody>",
            "</table>",
            "</div>",
            '<div class="d-flex flex-column mt-3">',
            "<span><strong>ចំណាំ៖</strong></span>",
            "<span>ទម្រង់ជម្រះបញ្ជីនៃការចាកចេញ ត្រូវអនុវត្តន៍ជាចាំបាច់ និងប្រើប្រាស់ជាឯកសារយោងសម្រាប់ការទូទាត់ប្រាក់បំណាច់ចុងក្រោយជូនដល់បុគ្គលិកដែលត្រូវបញ្ចប់ការងារ ឬចាក់ចេញពីក្រុមហ៊ុន។ ប្រធាននាយកដ្ឋាន ឬប្រធានសាខានីមួយៗត្រូវអនុវត្តន៍ និងពិនិត្យឱ្យបានហ្មត់ចត់មុនផ្ញើឯកសារនេះទៅកាន់នាយកក្រុមហ៊ុន ដើម្បីសុំសេចក្តីសម្រេចចិត្តចុងក្រោយ។</span>",
            "</div>",
        ].join("");

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg custom-modal-size",
                backdrop: "static",
                keyboard: true,
                alwaysTriggerOnClose: true,
                createContent: () => {
                    return htmlString;
                },
                contentCreated: (me) => {
                    me.generateTableHeaders = () => {
                        return [
                            "<tr>",
                            '<th class="align-middle text-center" style="background:#e8f0fe;">អ្នកទទួល ខុសត្រូវ</th>',
                            '<th class="align-middle text-center" style="background:#e8f0fe;">បរិយាយព័ត៌មានលម្អិត</th>',
                            '<th class="align-middle text-center" style="background:#e8f0fe;">កាលបរិច្ឆេទត្រូវបានជម្រះ</th>',
                            "</tr>",
                        ].join("");
                    };

                    me.generateTableBody = (list) => {
                        let row_group = "";

                        (list || []).forEach((c) => {
                            if (!c.items || !c.items.length) return;

                            let items_html = "";
                            c.items.forEach((item) => {
                                items_html = [
                                    items_html,
                                    '<div class="d-flex align-items-center mb-1">',
                                    `<input type="checkbox" ${
                                        item.status_id == 1 ? "checked" : ""
                                    } class="exit_form_check_box" data-id="${
                                        item.id
                                    }" style="cursor:pointer; margin-right:10px">`,
                                    `<span>${item.name ?? ""}</span>`,
                                    "</div>",
                                ].join("");
                            });

                            row_group = [
                                row_group,
                                "<tr>",
                                `<td class="text-capitalize align-middle">${c.name ?? ""}</td>`,
                                `<td>${items_html}</td>`,
                                "<td></td>",
                                "</tr>",
                            ].join("");
                        });

                        return row_group;
                    };

                    me.saveCheckBoxes = (event, form_id) => {
                        const op = {
                            id: event.target.dataset.id,
                            form_id: form_id,
                            status_id: event.target.checked ? 1 : 0,
                        };
                        vsapi
                            .call(
                                [main_view.base_url, "/mhr/exit-form/update-checkbox"].join(""),
                                op,
                                false,
                                null
                            )
                            .then((res) => {
                                if (res.status_code != 200) {
                                    cv_interact.error(res.error_message);
                                }
                            });
                    };
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Close"></span>',
                        cssClass: "btn btn-default",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span><i class="fa-solid fa-print"></i></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = {
                                ...me.getData(),
                                form_id: me.dataOptions.form_id,
                                id: me.dataOptions.form_id,
                            };
                            if (!AuthManager.allowed(286)) return;
                            vsapi
                                .call(
                                    `${main_view.base_url}/mhr/exit-form/details`,
                                    p,
                                    btn
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        windowPrintExitForm(
                                            me.divModal.querySelector(".modal-body").innerHTML
                                        );
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.View Exit Form",
                    modifyTitle: "vslang:titles.View Exit Form",
                    targetProp: "exit_form",
                    api: {
                        endpoint: `${main_view.base_url}/mhr/exit-form/checkpoints`,
                        params: (op) => {
                            return { id: op.id, form_id: op.form_id };
                        },
                    },
                },
                onPrepareForm: (me, d) => {
                    const tbl = me.divModal.querySelector(".tbl_exit_check_item");
                    const thead = tbl.querySelector("thead");
                    const tbody = tbl.querySelector("tbody");

                    thead.innerHTML = me.generateTableHeaders();
                    tbody.innerHTML = me.generateTableBody(d.list);

                    const form_header = me.divModal.querySelector(".form_header");
                    const form_title = form_header.querySelector(".form_title");
                    const emp_info = form_header.querySelector(".employee-info-section");
                    const emp_name = emp_info.querySelector(".employee_name");
                    const emp_code = emp_info.querySelector(".employee_code");
                    const emp_effective_date = emp_info.querySelector(".employee_effective_date");
                    const emp_branch = emp_info.querySelector(".employee_branch");

                    form_title.innerHTML = d.title ?? "";
                    emp_name.innerHTML = d.employee?.emp_name ?? "";
                    emp_code.innerHTML = d.employee?.code ?? "";
                    emp_effective_date.innerHTML = d.employee?.efective_date ?? "";
                    emp_branch.innerHTML = d.employee?.branch_name ?? "";

                    tbl.querySelectorAll(".exit_form_check_box").forEach((cb) => {
                        cb.onchange = (event) => {
                            me.saveCheckBoxes(event, me.dataOptions.form_id);
                        };
                    });
                },
            });

        dialog.show(op);
    };

    return self;
})();
/** hello Ratanak , Please DO NOT Write function outside like this. This is VERY BAD practice */
// function check_box(event) {
//     if (event.target.checked) {
//         const op = {};
//         op.check_point_id = event.target.dataset.id;
//         op.form_id = form_id;
//         op.status_id = 1;
//         vsapi
//             .call(
//                 [main_view.base_url, "/mhr/exit-form/save-item"].join(""),
//                 op,
//                 false,
//                 null
//             )
//             .then((res) => {
//                 if (res.status_code == 200) {
//                     //cv_interact.success('saved!')
//                     return;
//                 } else cv_interact.error(res.error_message);
//             });
//     } else {
//         const op = {};
//         op.check_point_id = event.target.dataset.id;
//         op.form_id = form_id;
//         op.status_id = 0;
//         console.log("uncheck");
//         vsapi
//             .call(
//                 [main_view.base_url, "/mhr/exit-form/save-item"].join(""),
//                 op,
//                 null,
//                 null
//             )
//             .then((res) => {
//                 if (res.status_code == 200) {
//                     return;
//                 } else cv_interact.error(res.error_message);
//             });
//     }
// }

