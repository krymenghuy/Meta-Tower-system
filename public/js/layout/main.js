'use strict';
let main_view = new function(){
    let mThis = this;
    this.onLayoutLoad = null;
    this.elScreenTitle = $('#screen_title');
    this.base_url = $('meta[name="base_url"]').attr('content');
    this.asset_url =$('meta[name="asset_url"]').attr('content'); 
    this.top_right_menus = $('#_main_top_right_menus');
    this.btnTasks = $('#_main_btn_tasks');
    this.btnLang = $('#_main_btn_lang');
    this.btnUser = $('#_main_btn_user');
    this.btnNotif = $('#_main_btn_notif');
  
    this.branch_id = $('meta[name="sess_branch_id"]').attr('content');
    this.user_id = $('meta[name="sess_user_id"]').attr('content'); 
    
    this.current_view_name = '';
    this.pusher_channel = {};
     
    this.clickOnClass = (target,cssClass)=>{
        let c = [];
        if(target.parentNode){
            c = target.parentNode.classList?target.parentNode.classList:[];
            if(c.contains(cssClass))
            {
              return target.parentNode;
            }
        }else{
            c = target.classList?target.classList:[];
            if(c.contains(cssClass)){
                return target; 
             }
        }
        return null; 
        //return (target.parentNode.classList.contains(cssClass) || target.classList.contains(cssClass));
    }
     
   //begin:: process side menus click
    let side_menus = document.querySelector('#kt_aside_menu_wrapper');
        side_menus.querySelectorAll('a.menu-item').forEach(lnk=>{
            lnk.addEventListener('click',e=>{
                e.preventDefault();
                let href = lnk.getAttribute("href");
                let comp = window[href];
                comp.show(null);
            });
        });
    //end::side menus click handlers
    
    this.mnuLogout = $('#_main_lnkLogout');
    
    this.mnuLogout1 = $('#_main_mnu_logout');
    this.mnuAbout1 = $('#_main_mnu_about');

    this.mnuManageBrandImages_mobile = $('#_main_lnkManageBrandImages_mobile');
    this.mnuPromotions_mobile = $('#_main_lnkPromotions');

    if (!this.branch_id || !this.user_id){
        console.error('branch_id (company_id) and user_id are not found! => so Notifications will not work!');
    }
    this.backend_channel_name = ['vsksm.backend.',this.branch_id].join('');
  
    this.getEncryptData = (qstring,onFinish)=>{
        let p = {'data':qstring};
        vsapi.call([mThis.base_url,'/api/encryptData'].join(''),p).then((res)=>{
            onFinish(res.data?res.data:res);
        }); 
    }
   
    this.init = ()=>{
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

        this.top_right_menus.on('click','.btn-dropdown',function(e){
            e.preventDefault();
            if(mThis.prev_shown_dropdown_menus) mThis.prev_shown_dropdown_menus.removeClass('show');
            let div =  $(this).parent().find('.dropdown-menu');
            let menu_name = ($(this).data('menu')+'').toLowerCase(); 
            div.addClass('show');
            mThis.prev_shown_dropdown_menus = div;
        });

        
        $(document).on("click", function (e) {
            let x = mThis.top_right_menus.find(".dropdown-menu");
            let container = x.parent();
            if(container){
                if(!container.is(e.target) && container.has(e.target).length === 0) {
                    x.removeClass("show");
                }
            }
            e.stopPropagation();
        });

        // document.addEventListener('click',e=>{
        //    e.preventDefault();
        //    let d = mThis.clickOnClass(e.currentTarget,'btn-dropdown');
        //    if(d){
        //       d.parentNode.querySelector('.dropdown-menu').classList.toggle('show');
        //       return;
        //    }

        //    d = mThis.clickOnClass(e.currentTarget,'dropdown-item');
        //    if(d){
        //       d.closest('.dropdown-menu').remove('show');
        //       return;
        //    }
        //    document.body.querySelectorAll('.dropdown-menu').remove('show'); 
        // });
        
        this.mnuLogout.on('click',(e)=>{
            cv_interact.confirm("Do you want to log out?",{"title":"M-Clinic System","confirmButtonText":"Log Out","cancelButtonText":"No, I stay in","context":"delete","translate":true},(e)=>{
                if(e){
                    mThis.logOut();
                }
            });
        });

        this.mnuLogout1.on('click',(e)=>{
            mThis.mnuLogout.trigger('click');
        });
       
        if (typeof mThis.onLayoutLoad ==='function') mThis.onLayoutLoad();
    }

    this.logOut = ()=>{
        mThis.deleteAllCookies();
        window.location.replace([mThis.base_url,'/logout'].join(''));
    }
    
    this.setLangMenu = (lang)=>{
        let lnkName = $('#_main_lang_name');
        let lang_name = LocaleManager.langs[lang].name;
        let icon_image = LocaleManager.langs[lang].icon_image;

        let icon_url = [document.querySelector('meta[name="asset_url"]').getAttribute('content'),'/images/icons/',icon_image].join('');
        lnkName.text(lang_name);

        mThis.btnLang.find('img').attr('src',icon_url);
        mThis.btnLang.data('lang',lang);
        LocaleManager.lang = lang;
    }

    this.addNotificationItem = (notif,update_count=true)=>{
        let div = mThis.top_right_menus.find('.main-notif-panel');
        div.prepend(`<div class="main-notif-item"><span class="notif-title">${notif.title}</span><span class="notif-text">${notif.message}</span></div>`);
        if(update_count) mThis.incrementNotificationCount();
    }
         
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
    
    mThis.incrementNotificationCount = ()=>{
        let d = mThis.btnNotif.data('count');
        d = d>=0?d:0;
        d++;
        mThis.btnNotif.text(d).data('count',d);         
    }

    mThis.incrementTaskCount = ()=>{
        let d = mThis.btnTasks.data('count');
        d = d>=0?d:0;
        d++;
        mThis.btnNotif.text(d).data('count',d);
    }  
};

main_view.init();

window.addEventListener('DOMContentLoaded',(e)=>{
    LocaleManager.translateZone('_app_content');
    DashboardComponent.show(null);
    main_view.setLangMenu(LocaleManager.currentLanguage.code);
});

let input = document.getElementsByTagName("input");
for(let i=0; i < input.length; i++){
    input[i].onselect = function(e){
        e.preventDefault();
    }

    input[i].onfocus = function(e){
        e.preventDefault();
    }
}

// window.oncontextmenu = function(){
//     return false;
// }

// document.onkeydown = function(e){
//     if(window.event.keyCode == 123 ||  e.button==2)    
//         return false;
// }