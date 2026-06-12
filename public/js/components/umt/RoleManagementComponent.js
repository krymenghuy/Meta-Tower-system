'use strict';
/** begin:RoleManagementComponent */
var RoleManagementComponent =  (() =>{
    const mThis = {};
    mThis.selected_role = {};
    mThis.title_prop = 'Role Management';
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector('#_um_roleManagementComponent');
    mThis.div_role_list = mThis.self.querySelector('div#_um_rolelist');
    //mThis.tblCard_body = mThis.self.querySelector('div#_um_card');
//  console.log(mmThis.tblCard_body);
    mThis.lnkNewRole = mThis.self.querySelector('#_lnkNewRole');
    mThis.elSearchRole = mThis.self.querySelector('#_search_role');
    mThis.btnPrint = mThis.self.querySelector('#_um_btn_pdf');
    mThis.div_search_widget = mThis.self.querySelector('#um_search_widget');
    mThis.lblSelectedRoleName = mThis.self.querySelector('#um_selected_role');
    mThis.lnkToggleRoleList = mThis.self.querySelector('#um_lnk_toggle_list');
    mThis.parentId = false;

  const injectCSS = (() => {
    let injected = false;
    

    return function () {
        if (injected) return;
        injected = true;

        const style = document.createElement('style');
        style.id = 'choice-app-style';
        style.textContent = `

.choice-app-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-right:8px;
    padding: 8px 10px;
    border-radius: 8px;
    background: none;
}

.choice-app-item-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.choice-app-item-name {
    display: flex;
    align-items: center;
    gap: 8px;
}

.choice-app-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

.choice-app-icon-fallback {
    font-size: 18px;
}

.choice-app-badge {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 6px;
    font-weight: 500;
}

.choice-app-badge-mobile {
    background: #e0f2fe;
    color: #0369a1;
}

.choice-app-badge-web {
    background: #f1f5f9;
    color: #334155;
}


   `.trim();

        document.head.appendChild(style);
    };
})();

mThis.formatChoice_app = (apps = []) =>
    apps.map(app => ({
        value: app.id ?? app.app_id,
        label: mThis.formatChoice_app_item(app)
 }));


 mThis.formatChoice_app_item = (app) => {
    if (!app) return '';

    const esc = s =>
        String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    const name = app.name ? esc(app.name) : '';
    const isMobile = String(app.is_mobile_app) === '1';

    const icon = app.icon
        ? `<img src="${esc(app.icon)}" class="choice-app-icon" alt="">`
        : `<i class="fas fa-volleyball-ball text-muted choice-app-icon-fallback"></i>`;

    return `
        <div class="choice-app-item">
            <div class="choice-app-item-line">
                <span class="choice-app-item-name">
                    ${icon}
                    ${name ? `<span class="choice-app-item-name-text">${name}</span>` : ''}
                </span>

                <span class="choice-app-badge ${
                    isMobile ? 'choice-app-badge-mobile' : 'choice-app-badge-web'
                }">
                    ${isMobile ? 'Mobile' : 'Web'}
                </span>
            </div>
        </div>
    `;
};

    mThis.deleteRole = (role_id)=>{
        const p = {id:role_id};
        vsapi.post([main_view.base_url,'/api/role/delete'].join(''),p,{loader:false,cacheTTL:0}).then(res =>{
           if(res.status_code ==200){
             mThis.loadRoles(mThis.getFilterData(),roles =>{
                 mThis.renderRoleCards(roles,null,null);
             });
             cv_interact.success(['Role ', (mThis.selected_role? mThis.selected_role.name: '') , ' has been deleted'].join(''));
           }else cv_interact.warning(res.error_message);
        })
    }

    mThis.renderRoleCards = (data, container = null,selected_role = null) => {;
        let html = '';
        let cnt = 0;
        container = container || mThis.div_role_list;
        if (container.style.display =='none') mThis.setRoleListState(1);
        container.innerHTML =  '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';
        (data || []).map(item =>{
            html = [ html,`<div class="col-3 col-md-3 col-lg-2 role-card" data-id="${item.id}" data-roleid="${item.id}" data-usersearchvalue="${item.user_search_value ?? ''}" data-userclass="${item.user_class ?? 'NA'}" data-rolename="${item.name ?? 'No Name'}">
            <div class="card-content bg-white shadow-sm p-2 rounded-2 d-flex flex-column justify-content-between h-100">
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <span class="data-input text-center fw-semibold text-primary-custom fs-6" data-field="user_class">
                        ${item.name ?? 'No Name'}
                    </span>
                    <span class="mt-2 d-flex justify-content-center align-items-center rounded-circle bg-light text-primary-custom fw-bold"
                        style="width:50px; height:50px; font-size:1.2em;">
                        ${item.name ? item.name.charAt(0).toUpperCase() : '?'}
                    </span>
                </div>

                <hr class="my-2">

                <span class="data-input text-muted text-center mb-2" style="font-size:0.85em">
                    Users: ${item.user_count ?? 0}
                </span>

                <div class="d-flex flex-row justify-content-between align-items-center border-top">
                    <span class="text-dark" style="font-size:0.9em">
                        ${item.user_class === 'admin' ? 'Staff' : (item.user_class ?? 'NA')}
                    </span>
                    <div class="edit_menus d-flex gap-2" style="visibility:hidden">
                        <a data-roleid="${item.id}" href="javascript:void(0)" class="lnk-edit-role">
                            <span class="d-flex align-items-center justify-content-center bg-info rounded-circle" style="width:28px; height:28px;">
                                <i class="fa fa-pencil text-white" style="font-size:12px;"></i>
                            </span>
                        </a>
                        <a data-roleid="${item.id}" href="javascript:void(0)" class="lnk-delete-role">
                            <span class="d-flex align-items-center justify-content-center bg-danger rounded-circle" style="width:28px; height:28px;">
                                <i class="fa fa-times text-white" style="font-size:12px;"></i>
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `].join('');
          cnt++;
        });
        container.innerHTML = html;

        /** Hide RoleTabView initially if there is no Role selected at first show */
          if(!mThis.selected_role){
            try{
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display= 'none';
            }catch (e){
                console.error(e);
            };
        }

        container.addEventListener('mouseenter',e=>{
           e.preventDefault();
           let x = mThis.lnkToggleRoleList.dataset;
           const role_list_state = x? x.state:null;
           if(role_list_state == 1) container.style.overflowX = 'auto';
        });

        container.addEventListener('mouseleave',e=>{
            e.preventDefault();
            container.style.overflowX = 'hidden';
         });

        container.querySelectorAll('div.role-card').forEach(div =>{
            div.onmouseleave = e=>{
                e.preventDefault();
                let edit_menus = div.querySelector('div.edit_menus');
                if(edit_menus){
                   setTimeout(()=>{
                    edit_menus.style.visibility = 'hidden';
                   },60);
                }
            }
        });

        container.onclick = e =>{
            e.preventDefault();
            let card = VSUtil.closestLimited(e.target, 'div.role-card');
            if(card){
               Array.from(container.children).map(x =>{
                    if(x !== card) x.classList.remove('selected');
                });
                card.classList.add('selected');

                let role_id = card.dataset.roleid || card.dataset.id;
                let user_class = card.dataset.userclass;
                const role_name = card.dataset.rolename || card.dataset.name;
                const selected_role = {"role_id":role_id,"user_class":user_class, "name":role_name};
                mThis.selected_role = selected_role;
                mThis.lblSelectedRoleName.innerHTML = selected_role.name;
                RoleTabView.displayContent(selected_role);
                return;
            }
        };

       let card = null;
       let user_search_value = null;
       if(cnt ===1){
            card = container.querySelector('div.role-card');
            if(card) user_search_value = card.dataset.usersearchvalue;
       }else if (cnt >1 ){
            if(!selected_role)
               card = container.querySelectorAll('div.role-card')[0];
            else{
               card = mThis.getRoleCard(selected_role.id || selected_role.role_id);
            }
       }else{
          container.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><h5>No roles were found!</h5></div>'
       }

       let role = null;
       if(card){
         const role_id = card.dataset.roleid || card.dataset.id;
         role = {
            "role_id":role_id,
            "id":role_id,
            "name":card.dataset.rolename || card.dataset.name,
            "user_class":card.dataset.userclass
         }
         card.classList.add('selected');
         mThis.selected_role = role; //ensure one role is selected effectively on first load
         mThis.scrollCardToView(card);
         mThis.lblSelectedRoleName.innerHTML = role.name;
       }
       RoleTabView.displayContent(role,null,{"user_search_value":user_search_value});
    }

    mThis.scrollCardToView =(div_card) =>{
        //mThis.div_role_list.style.overflow = 'auto';
        div_card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        //mThis.div_role_list.style.overflow = 'hidden';
    }

    mThis.getRoleCard = (role_id)=>{
        let found_card = null;
        mThis.div_role_list.querySelectorAll('div.role-card').forEach(div =>{
            let m_id = div.dataset.id || div.dataset.roleid;
            if(m_id ==role_id){
                found_card = div;
                return false;
            }
        });
        return found_card;
    }

    /** displayItems() display items by category as its header similiar to Report Center's reports display layout */
    mThis.displayItems = (data, div) => {
        div.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';

            let html = '';
            Object.values(data).forEach(cat => {
                let item_html = '';
                cat.list.map(rpt =>{
                    item_html = [item_html,`<a class="rpc-report text-black" href="javascript:void(0)" data-code="`,rpt.code,`" data-id="`,rpt.id,`">`,'<i class="fs-5 fa fa-pointer text-muted"></i> ',rpt.name,`</a>`].join('');
                    mThis.reports[rpt.code] = rpt;
                });

                let group_html = ['<a href="javascript:void(0)" class="rpc-group-header fs-5 d-block" data-category="',cat.category,'" data-categoryid="',cat.id,'">','<span class="text-nowrap fw-semibold p-2">','<img class="rpc-category-icon" src="', main_view.asset_url,'/images/icons/report.png','"> ',cat.category,'</span>','</a>'].join('');
                group_html = [group_html,`<div class="rpc-reports d-flex flex-column gap-2 justify-content-start align-items-start flex-wrap p-2 overflow-hidden">`,item_html,`</div>`].join('');
                html = [html, group_html].join('');
            });
            mThis.div_report_list.innerHTML = html;
    }

    // mThis.loadRoles = (filter, onFinish)=>{
    //     filter = filter || {"search_value":filter.search_value ?? ''};
    //     vsapi.post(`${main_view.base_url}/api/role/list`,filter,{loader:false,cacheTTL: (filter.search_value?  0 : 2000) }).then(res =>{
    //        const roles = res.status_code ==200? res.data : [];
    //        onFinish(roles);
    //     })
    //     .catch((e)=>{
    //         console.error(e);
    //         onFinish([]);
    //     });
    // }


  mThis.loadRoles = (filter = {}, onFinish) => {
    const payload = {
        search_value: filter.search_value ?? '',
        user_class: filter.user_class ?? null,
        app_id: filter.app_id ?? null
    };

    vsapi.post(
        `${main_view.base_url}/api/role/list`,
        payload,
        {
            loader: false,
            cacheTTL: payload.search_value ? 0 : 2000
        }
    ).then(res => {
        onFinish(res.status_code === 200 ? res.data : []);
    }).catch(err => {
        console.error(err);
        onFinish([]);
    });
};


    function slideDown(element, duration = 500, onFinish = null) {
        // Check if the element is already fully visible
        if (element.style.display === 'block' && element.style.maxHeight === 'none') {
            return;
        }

        element.style.display = 'block';
        element.style.overflow = 'hidden';  // Ensure content overflow is hidden
        let height = element.scrollHeight + 'px';
        element.style.maxHeight = '0';
        element.offsetHeight; // Trigger a reflow, flushing the CSS changes
        element.style.transition = `max-height ${duration}ms ease-in-out`;
        element.style.maxHeight = height;

        setTimeout(() => {
            element.style.maxHeight = 'none';
            if (onFinish) onFinish();
        }, duration);
    }

    function slideUp(element, duration = 500, onFinish = null) {
        // Check if the element is already hidden
        if (element.style.display === 'none' || element.style.maxHeight === '0px') {
            return;
        }

        // Ensure the element's height is set before starting the transition
        element.style.maxHeight = element.scrollHeight + 'px';
        element.offsetHeight; // Trigger a reflow, flushing the CSS changes
        element.style.transition = `max-height ${duration}ms ease-in-out`;
        element.style.maxHeight = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.maxHeight = '0';
            if (onFinish) onFinish();
        }, duration);
    }


    /** if state == null => setRoleListState() is like toggleRoleList() */
    mThis.setRoleListState = (state = null,duration = 600) =>{
        const div =  mThis.div_role_list;
        mThis.lnkToggleRoleList.classList.add('disabled');
        if(state === 1){
           //div.classList.add('d-flex');
           //div.style.display ='flex';
          // *** Todo: later put functions slideDown() and slideUp() in general reusable library
           slideDown(div,duration,()=>{
            mThis.lnkToggleRoleList.dataset.state =1;
            mThis.lnkToggleRoleList.innerHTML = `<i class="fa fa-minimize text-white fs-6"></i>`;
            mThis.lnkToggleRoleList.classList.remove('disabled');
           });
        //   setTimeout(() => {
        //     div.classList.remove('fade-out');
        //     div.classList.add('fade-in');
        //   }, 500); // A small delay to ensure fade-in works properly

        }else if (state === 0){
            //div.classList.remove('d-flex','fade-in');

            slideUp(div,duration,()=>{
                mThis.lnkToggleRoleList.dataset.state =0;
                mThis.lnkToggleRoleList.innerHTML = `<i class="fa fa-maximize text-white fs-6"></i>`;
                mThis.lnkToggleRoleList.classList.remove('disabled');
                //mThis.div_role_list.innerHTML = '<div class="d-flex justify-content-center"><a href="javascript:void(0)"> <i class="fas fa-chevron-double-down fs-5 fw-semibold"></i> </a></div>';
            });
            // setTimeout(() => {
            //     div.style.display = 'none';
            // }, 500);

        }else{
            let x = state ==1? 0:1;
            mThis.setRoleListState(x);
        }
    }

    mThis.init = () => {
        if(mThis.initAlready) return;

        injectCSS();
        mThis.searchWidget = new SearchWidget(mThis.div_search_widget,{
            inputClass:'form-control-sm text-yp-custom form-control border border-secondary rounded-4',
            placeHolder:'Search role or user',
            onkeyup:(value,e)=>{
                clearTimeout(mThis.search_timeout);
                mThis.search_timeout = setTimeout(()=>{
                    const p =  {"search_value":value};
                    mThis.loadRoles(p, roles =>{
                        mThis.renderRoleCards(roles);
                    });
                },250);
            }
        });

        mThis.lnkToggleRoleList.onclick = e =>{
             e.preventDefault();
             //state => 1 = Maximized or view list, 0 = Minimized
             let state = mThis.lnkToggleRoleList.dataset.state;
             mThis.setRoleListState(state);
        }

        mThis.div_role_list.onmouseover = e=>{
            e.preventDefault();
            let card = VSUtil.closestLimited(e.target,'div.role-card');
            if(card){
                let edit_menus = card.querySelector('div.edit_menus');
                if(edit_menus){
                   setTimeout(()=>{
                    edit_menus.style.visibility = 'visible';
                   },60);
                }
            }
        }

        mThis.div_role_list.addEventListener('click', e=>{
            e.preventDefault();
              //Click on Delete Role icon
            let lnk = VSUtil.closestLimited(e.target,'a.lnk-delete-role');
            if(lnk){
               let role_id = lnk.dataset.roleid;
                if(!AuthManager.allowed(112)) return;

               cv_interact.confirm(['Delete ', (RoleTabView.selected_role? `role ${RoleTabView.selected_role.name}`: 'this role') ,' permanently?'].join(''),{context:"delete","title":"Delete Role",confirmButtonText:"Delete"}, e=>{
                    if(e){
                        mThis.deleteRole(role_id);
                    }
               });
               return;
            }

            //Click on Edit Role icon
            lnk = VSUtil.closestLimited(e.target,'a.lnk-edit-role');
            if(lnk){
                let role_id = lnk.dataset.roleid;
                if(!role_id || role_id ===0){
                    cv_interact.warning('Role ID is missing');
                    return;
                }
                const op = {
                  id: role_id,
                  onClose:(d)=>{
                        const p = mThis.getFilterData();
                        mThis.loadRoles(p, roles =>{
                            let new_role = d.role;
                            mThis.renderRoleCards(roles,null,new_role);
                        });
                  }
                };
                if(!AuthManager.allowed(111)) return;
                RoleDialog.show(op);
                return;
            }

        });


        mThis.lnkNewRole.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                id: null,
                group_id:1,
                onClose:(d)=>{
                    let p = mThis.getFilterData();
                    mThis.loadRoles(p, roles =>{
                        let new_role = d.role;
                        mThis.renderRoleCards(roles,null,new_role);
                    });
                }
            }
            if(!AuthManager.allowed(109,false)) return;
            RoleDialog.show(op);
        });

        mThis.btnPrint.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                id: null,
                // group_id:1,
                action: 'gen_role',
                onClose:(d)=>{
                    // let p = mThis.getFilterData();
                    // mThis.loadRoles(p, roles =>{
                    //     let new_role = d.role;
                    //     mThis.renderRoleCards(roles,null,new_role);
                    // });
                }
            }
            if(!AuthManager.allowed(110,false)) return;
            PrintDialog.show(op);
        });

        mThis.initAlready = true;
    }

    // mThis.ensureSelectedRole = (roles = [], preferred = null) => {
    //     if (!Array.isArray(roles) || roles.length === 0) {
    //         mThis.selected_role = null;
    //         return null;
    //     }

    //     let role = null;

    //     if (preferred) {
    //         role = roles.find(r =>
    //             r.id == preferred.id || r.id == preferred.role_id
    //         );
    //     }

    //     if (!role) role = roles[0];

    //     mThis.selected_role = {
    //         role_id: role.id,
    //         id: role.id,
    //         name: role.name,
    //         user_class: role.user_class
    //     };

    //     return mThis.selected_role;
    // };

mThis.ensureSelectedRole = (roles = [], preferred = null) => {
    if (!Array.isArray(roles) || roles.length === 0) {
        mThis.selected_role = null;
        return null;
    }

    let role = null;

    if (preferred) {
        role = roles.find(r =>
            r.id == preferred.id || r.id == preferred.role_id
        );
    }

    if (!role) role = roles[0];

    mThis.selected_role = {
        role_id: role.id,
        id:role.id,
        name: role.name,
        user_class: role.user_class
    };

    return mThis.selected_role;
};

    mThis.getFilterData = ()=>{
        const p = {};
        p.search_value = mThis.searchWidget? mThis.searchWidget.getValue() : '';
        return p;
    }

    mThis.show = (options)=>{
        options = options || {};
        mThis.init();
        mThis.selected_role = null;
        mThis.options = options;
        mThis.div_role_list.style.maxHeight='';

        mThis.loadRoles(mThis.getFilterData(), roles =>{
            mThis.setRoleListState(1,0);
            mThis.renderRoleCards(roles,null);
           // mThis.setEvent();

        });
        main_view.setContentView(mThis.self,mThis.title_prop);
    }

    mThis.updateSelectRole = function(col_name, data){
        let selected_class_name = 'row-selected';
        mThis.div_role_list.querySelector(`tr.${selected_class_name}>td.${col_name}`).innerHTML = data;
    }

     return mThis;
})();
//end::RoleManagementComponent

/** begin:: vs-tab-view for role details */
const RoleTabView = new function(){
    const mThis = this;
    this.self = RoleManagementComponent.self.querySelector('#_um_role_tab');
    this.tabHeader = this.self.querySelector('div.vs-tab-header');
    this.tabBody = this.self.querySelector('div.vs-tab-body');
    this.userListView = null;
    this.tabPages = {};
    this.last_view_name = 'view_users';
    this.parentId = RoleManagementComponent.parentId;
    // console.log(5555,mThis.selected_role);
    const user_cols = [
        {
            title:"Photo",
            data:(data,index,tr)=>{
                return [`<img src="`,data.image_url,`" class="image-student-tbl">`].join('');
            }

         },
         {
            title:`${mThis.parentId?'ID':'d-none'}`,
            className:`${mThis.parentId?'id':'d-none'}`,
            data:(data,index,tr)=>{
                return data.official_id;
            }

         },
        {
           title:"Login Name",
           className:"login_name",
           data:(data,index,tr)=>{
               let lock_html = data.is_locked ==1? '<span class="d-block text-danger fw-semibold p-1">Locked</span>' : '';
               return [data.login_name,lock_html].join('');
           }

        },
        {
           title:"Full Name",
           data:(data,index,tr)=>{
               return data.full_name;
           }

        },
        {
            title:"User Class",
            data:(data,index,tr)=>{
                return data.user_class;
            }

         },
         {
            title: "Primary Role",
            data: (data, index, tr) => {
                return [
                    '<span class="d-block">', data.role_name, '</span>',
                    data.official_code
                        ? '<span class="text-left p-1"><span class="text-nowrap">ID: </span>' + data.official_code + '</span>'
                        : ''
                ].join('');
            }
        },
        {
           title:"Last Login",
           data:(data,index,tr)=>{
               return [`<span class="d-block p-1">Last login: `,(data.last_login_date || 'N/A'),`</span>`].join('');
           }

        },
        {
           title:"Created By",
           data:(data,index,tr)=>{
               return ['<span class="d-block">', data.create_user ,'</span><span class="d-block text-muted"><small>',data.create_date,'</small></span>'].join('');
           }

        },
        {
            title:"Action",
            data:(data,index,tr)=>{
                return [`<div class="d-flex gap-3 flex-wrap">`,
                // `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-edit-user"><i class="fa fa-edit"></i></a>`,
                `<a data-id="`,data.id,`" data-loginname="${data.login_name}" href="javascript:void(0)" class="lnk-reset-password"><span class="tool-tip"><i class="fa fa-key text-warning"></i><span class="tool-tiptext fs-6">Reset Password</span></span></a>`,
                `<a data-id="`,data.id,`"  data-loginname="${data.login_name}" href="javascript:void(0)" data-action="`,(data.is_locked ==1? 'unlock':'lock'),`" class="lnk-lock-user"><span class="tool-tip"><i class="${data.is_locked==1? 'fa fa-unlock text-info':'fa fa-lock text-danger'}"></i><span class="tool-tiptext fs-6">Lock User</span></span></a>`,
                `<a data-id="`,data.id,`"   data-loginname="${data.login_name}" href="javascript:void(0)" class="lnk-remove-user"><span class="p-1 rounded-4"><span class="tool-tip"><i class="fa fa-times text-danger fs-5"></i><span class="tool-tiptext fs-6">Remove User</span></span></span></a>`,
                `<a data-id="`,data.id,`"  data-loginname="${data.login_name}"  href="javascript:void(0)" class="user_action d-none"><span class="p-1 rounded-4"><i class="fa fa-tasks text-info fw-bold tool-tip"><span class="tool-tiptext fs-6">User Action</span></i></span></a>`,
                `<a data-id="`,data.id,`"  data-loginname="${data.login_name}"  href="javascript:void(0)" class="user-print"><span class="p-1 rounded-4"><span class="tool-tip"><i class="fa fa-print text-dark"></i><span class="tool-tiptext fs-6">Print</span></span></span></a>`,
                `</div>`].join('');
            }

         }
  ];

/** begin:: AppPanel definition */
 this.AppPanel = new function(){
     const that = this;
     this.self = mThis.tabBody.querySelector('#view_apps');
     this.divAppList = this.self.querySelector('#_um_role_app_list');

     this.loadApps =()=>{
        const p = {
            subs_id: main_view.subs_id,
            role_id:mThis.selected_role.role_id
        };
        vsapi.post(`${main_view.base_url}/api/role/apps`,p,{loader:false,useCache:true,cacheTTL:1500}).then(res=>{
            let apps = res.status_code ==200? res.data : [];
            that.renderContent(apps);
        });
     }

     this.renderContent = (apps)=>{
        let html = '';
        apps.map(app =>{
            const allowed = (app.allowed || 0);
            let checkStatus = (allowed ==1) ? '<i class="fa fa-check text-success fs-3 fw-bold "></i>' : '<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
            html = [html,
                '<div class="app-box d-flex justify-content-between mt-3">',
                  `<div data-id="`,app.id,`" data-ismobile="`,app.is_mobile_app,`" class="um_app d-flex gap-2 rounded-2 shadow p-3 justify-contents-center align-items-center">`,
                    //`<img class="border border-secondary rounded-5" style="width:40px;height:40px" src="/uploads/public/1_data/default/images/mr1.jpg" alt="">`,
                    `<div class="um_app_check d-flex justify-items-center justify-content-center border border-secondary rounded-5 p-1" style="width:35px;height:35px"><a href="javascript:void(0)" data-state="`,allowed,`" class="link_check_app">`,checkStatus,`</a></div>`,
                    `<span class="fs-6 fw-semibold">`,app.name,`</span>`,
                    //`<div style="position:absolute;bottom:2px;right:2px"><span class="">Mobile</span></div>`,
                `</div>`,
              '</div>'].join('');
        });

        that.divAppList.innerHTML = html;
        let max_width = 0;
        const appBoxes = that.divAppList.querySelectorAll('div.app-box');
        appBoxes.forEach(div_app => {
            max_width = Math.max(max_width, div_app.offsetWidth);
        });

        appBoxes.forEach(div_app => {
            div_app.querySelector('.um_app').style.width = `${max_width}px`;
        });

        that.divAppList.onclick = e =>{
             e.preventDefault();
             let btn = e.target.closest('.link_check_app');
             if(btn){
                that.toggleCheck(btn);
                return;
             }
        }
     }


     /** set checkbox will also toggle Checkbox when state is NULL */
     this.toggleCheck = (btn)=>{
        let state = btn.dataset.state;
        state = state ==1? 0:1;
        if(state == 0){
           btn.innerHTML ='<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
           btn.dataset.state =0;
        }else if (state ==1){
           btn.innerHTML ='<i class="fa fa-check text-success fs-3 fw-bold "></i>';
           btn.dataset.state = 1;
        }
        let allowed = state;
        let div = btn.closest('div.um_app');
        let app_id = div.dataset.id;
        onAppStatusChange(btn,app_id, allowed);
    }

       function onAppStatusChange(btn,app_id, allowed ) {
           const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
           const p = {role_id: role_id, app_id: app_id, allowed : allowed};

           vsapi.post(`${main_view.base_url}/api/role/apps/set-status`,p,{loader:false}).then(res =>{

               if(res.status_code ==200){
                   return;
               }else {
                   btn.innerHTML ='<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
                   btn.dataset.state =0;
                   cv_interact.warning(res.error_message)
               };
           });
       }
 }
/**end:: AppPanel definition */


/** begin: UserPanel defintion */
 this.UserPanel = new function(){
    //NOTE  "mThis" refers to RoleTabView instance
    const that = this;
    let userSearchTimer = null;
    this.divSelf =  mThis.tabBody.querySelector('#view_users');
    this.btnAddRoleMember = this.divSelf.querySelector('#_um_role_add_member');
    this.btnCreateUser = this.divSelf.querySelector('#_um_role_create_user');
    this.btnPrintUser = this.divSelf.querySelector('#_um_role_print_user');
    this.elSearchUser = this.divSelf.querySelector('#_um_role_search_user');

    this.deleteUser = (user_id)=>{
       let p = {"id":user_id}
       if(!AuthManager.allowed(101,false)) return;
      cv_interact.confirm('Delete this user permanently?',{context:"delete",title:"Delete User"}, e=>{
         if(e){
             vsapi.post(`${main_view.base_url}/api/user/delete`,p,{loader:false}).then(res =>{
                 if(res.status_code ==200){
                    mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
                 }else cv_interact.error(res.error_message);
             })
         }
      });
    }

    this.getFilterData = ()=>{
         return {"role_id":mThis.selected_role? mThis.selected_role.role_id: -1, "search_value":that.elSearchUser.value};
    }

    this.btnAddRoleMember.onclick = e =>{
        e.preventDefault();
        if (!mThis.selected_role) {
            cv_interact.error('No role selected!');
            return;
        }

        let op = {
            "multiple_select": true,
            "user_class": null,
            "onClose":(users) =>{
                let ids = '';
                let cnt = 0;
                users.map(u =>{
                    ids = [ids, (ids? '|':'') ,(u.id || u.user_id)].join('');
                    if(u.id > 0) cnt++;
                });
               let p = {"role_id":mThis.selected_role.role_id, "user_ids":ids,'is_primary':1};
               vsapi.post([main_view.base_url, '/api/role/add-members'].join(''),p,{loader:false}).then(res =>{
                  if(res.status_code == 200){
                     let d = res.data;
                     mThis.userListView.showPage(RoleTabView.UserPanel.getFilterData());
                     cv_interact.success([d.success_count,' users have been added as members of ', (mThis.selected_role.name || 'the role. NOTE that any user is allowed to have only one role as primary role')].join(''));
                  } else cv_interact.error(res.error_message);
               });
            }
        };
        FindUserDialog.show(op);
    }

    this.btnPrintUser.addEventListener('click', e =>{
        e.preventDefault();
        let op = {
            role_id: mThis.selected_role.role_id,
            action: 'gen_user',
            onClose:(d)=>{
                // let p = mThis.getFilterData();
                // mThis.loadRoles(p, roles =>{
                //     let new_role = d.role;
                //     mThis.renderRoleCards(roles,null,new_role);
                // });
            }
        }
        if(!AuthManager.allowed(114,false)) return;
        PrintDialog.show(op);
    });

    this.btnCreateUser.onclick = e =>{
        e.preventDefault();

        let op = {
            id:null,
            btn: e.target,
            role_id: mThis.selected_role.role_id || mThis.selected_role.id,
            onClose: (user)=>{
               that.elSearchUser.value = user.login_name;
               const role_id = mThis.selected_role.id || mThis.selected_role.role_id;
               mThis.userListView.showPage({"role_id":role_id,"search_value":  that.elSearchUser.value});
            }
        }

        if(!AuthManager.allowed(100,false)) return;
        CreateLoginDialog.show(op);
    }

    that.elSearchUser.onkeyup = e => {
        const value = e.target.value;
        clearTimeout(userSearchTimer);

        userSearchTimer = setTimeout(() => {
            mThis.userListView.showPage(that.getFilterData());
        }, 300);
    };
 }
/** end: Userpanel defintion */

/** begin: ModulePanel defintion */
mThis.ModulePanel = new function(){
    const that = {};
    let searchModTimer = null;
    that.divSelf =  mThis.tabBody.querySelector('#view_modules');
    that.btnPrintModule = that.divSelf.querySelector('#_um_role_print_module');
    that.elAppFilter = mThis.self.querySelector('#mod_app_chooser');
    that.elSearchMod = mThis.self.querySelector('#mod_search_module');
    that.elAppFilter.onchange = e=>{
      e.preventDefault();
      that.def_app_id = e.target.value;
      that.displayModules(mThis.selected_role.role_id, that.def_app_id);
    }

    that.elSearchMod.onkeyup = e => {
    clearTimeout(searchModTimer);
    searchModTimer = setTimeout(() => {
        that.displayModules(
            mThis.selected_role.role_id,
            that.def_app_id,
            that.elSearchMod.value ?? null
        );
    }, 300);
  };

    //loadAppOptions
    this.loadAppChoices = async ()=>{
        let apps = await getAccessibleApps();
        let icon_apps = RoleManagementComponent.formatChoice_app(apps);
        that.def_app_id = that.def_app_id || (icon_apps[0]?  (icon_apps[0].value ?? null) : "");
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",'','(All Apps)',(that.def_app_id || ""));
        //Please add search Input for module
        that.displayModules(mThis.selected_role.role_id, that.def_app_id, that.elSearchMod.value ?? null);
    }

    that.displayModules = (role_id,app_id, search_value = null)=>{
        role_id = role_id || RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
        mThis.div_modules = mThis.div_modules || mThis.self.querySelector('#_um_role_mod_list');

        mThis.modulesList = mThis.modulesList || new  UMExpandItemView(mThis.div_modules,{
            emptyInfoText:"No module control list",
            headerClass:"mod-category",
            itemName:"Module",
            statuses:{
                1: {
                name:'Allowed',
                signClass:'fa fa-check text-success fs-5',
                //cssClass:'text-success',
                textColorClass:'text-success',
                backgroundClass:''
                },
            0:{
                name:'Denied',
                signClass:'fa fa-times text-danger fs-5',
                //cssClass:'text-danger',
                textColorClass:'text-danger',
                backgroundColorClass:''
            }
            },
            onStatusChange:(statusInfo,item_id,parent_id,checkBox)=>{
                //console.log('todo: save permission via api ', status, ' id: ',item_id, ' cat_id ',parent_id);

                const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;

                const p = {
                    "role_id":role_id,
                    "module_id":item_id,
                    "app_id": parent_id,
                    "status_id": (statusInfo.status_id || statusInfo.id)
                };
                vsapi.post(`${main_view.base_url}/api/role/modules/set-status`,p,{loader:false}).then(res =>{
                    if(res.status_code ==200){
                       return;
                    }else{
                        mThis.modulesList.setCheck(checkBox,0);
                        cv_interact.warning(res.error_message);
                    }
                });
            }
        });

        const p = {"role_id":role_id,"app_id":app_id,search_value: search_value,"order_by":"display_order"};
        vsapi.post(`${main_view.base_url}/api/role/modules`,p,{loader:false, cacheTTL: (search_value? 0:1500)}).then(res =>{
            const data = res.status_code ==200 ? res.data : [];
            mThis.modulesList.setData(data);
        });
    }

    that.btnPrintModule.addEventListener('click', e =>{
        e.preventDefault();
        let op = {
            role_id: mThis.selected_role.role_id,
            action: 'gen_modules',
            onClose:(d)=>{
                // let p = mThis.getFilterData();
                // mThis.loadRoles(p, roles =>{
                //     let new_role = d.role;
                //     mThis.renderRoleCards(roles,null,new_role);
                // });
            }
        }
        if (!AuthManager.allowed(108)) return;
        PrintDialog.show(op);
    });

}
/**end: Modulepanel definition */

/** begin: PermissionPanel defintion */
this.PermissionPanel = new function(){
    const that = this;
    let searchTimer = null;
    this.divSelf =  mThis.tabBody.querySelector('#view_permissions');
    this.btnPrintPermission = this.divSelf.querySelector('#_um_role_print_permission');
    this.elAppFilter = mThis.self.querySelector('#prn_app_chooser');
    this.elSearchPrn = mThis.self.querySelector('#prn_search');
    this.elAppFilter.onchange = e=>{
        e.preventDefault();
        that.def_app_id = e.target.value || "";
        that.displayPermissionList(mThis.selected_role.role_id, that.def_app_id, that.elSearchPrn.value);
    }

        this.elSearchPrn.onkeyup = e => {
            const value = e.target.value;

            clearTimeout(searchTimer);

            searchTimer = setTimeout(() => {
                that.displayPermissionList(
                    mThis.selected_role.id,
                    that.elAppFilter.value,
                    value
                );
            }, 300); // adjust delay if needed
        };

    this.loadAppChoices = async ()=>{
        let apps =  await getAccessibleApps();
        let icon_apps = RoleManagementComponent.formatChoice_app(apps);
        that.def_app_id = that.def_app_id || ((icon_apps[0].value ?? null )?? null);
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",null,null,that.def_app_id);
    }

    this.displayPermissionList = (role_id, app_id,search_value)=>{
        role_id = role_id || RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
        mThis.div_permissions = mThis.div_permissions || mThis.self.querySelector('#_um_role_prn_list');

        that.prnAttributes = ['category','module_id'];
        mThis.permissionList = mThis.permissionList || new UMExpandItemView( mThis.div_permissions,{
            emptyInfoText:"No permission control",
            headerClass:"prn-category",
            itemDataset: that.prnAttributes,
            itemName:"Permission",
            statuses:{
                1: {name:'Allowed',
                  signClass:'fa fa-check text-success fs-5',
                  //cssClass:'text-success',
                  textColorClass:'text-success',
                  backgroundClass:''
                },
               0:{
                name:'Denied',
                signClass:'fa fa-times text-danger fs-5',
                //cssClass:'text-danger',
                textColorClass:'text-danger',
                backgroundColorClass:''
              }
            },
            onStatusChange:(statusInfo,item_id,parent_id, checkBox)=>{

                const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;

                const p = {
                    role_id: role_id,
                    prn_id: item_id,
                    status_id: statusInfo.status_id
                };
                vsapi.post(`${main_view.base_url}/api/role/permissions/set-status`,p,{loader:false}).then(res =>{
                     if(res.status_code ==200){
                        return;
                     }else cv_interact.warning(res.error_message);
                });
                //console.log('todo: save permission via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
            }
        });

            const p = {"role_id":role_id,"app_id":app_id, "search_value":search_value,"order_by":"display_order"};
            vsapi.post(`${main_view.base_url}/api/role/permissions`,p,{loader:false,useCache:true, cacheTTL: (search_value? 0: 1500)}).then(res =>{
                let data = res.status_code ==200 ? res.data : [];
                mThis.permissionList.setData(data);
            });
    }

    this.btnPrintPermission.addEventListener('click', e =>{
        e.preventDefault();
        let op = {
            role_id: mThis.selected_role.role_id,
            action: 'gen_permissions',
            onClose:(d)=>{
                // let p = mThis.getFilterData();
                // mThis.loadRoles(p, roles =>{
                //     let new_role = d.role;
                //     mThis.renderRoleCards(roles,null,new_role);
                // });
            }
        }
        if (!AuthManager.allowed(116)) return;
        PrintDialog.show(op);
    });
}

/**end: PermissionPanel definition */

/** begin: ReportPanel defintion */
this.ReportPanel = new function(){
    const that = this;
    let reportSearchTimer = null;
    this.elAppFilter = mThis.self.querySelector('#rpt_app_chooser');
    this.elSearchRpt =mThis.self.querySelector('#rpt_search');

    this.elAppFilter.onchange = e=>{
        e.preventDefault();
        that.def_app_id = e.target.value;
        that.displayReportList(mThis.selected_role.role_id, that.def_app_id, that.elSearchRpt.value);
    }

    this.elSearchRpt.onkeyup = e => {
        const value = e.target.value;

        clearTimeout(reportSearchTimer);

        reportSearchTimer = setTimeout(() => {
            that.displayReportList(
                mThis.selected_role.id,
                that.elAppFilter.value,
                value
            );
        }, 300);
    };

    this.loadAppChoices = async ()=>{
        let apps =  await getAccessibleApps();;
        let icon_apps = RoleManagementComponent.formatChoice_app(apps);
        that.def_app_id = that.def_app_id || (icon_apps[0]? icon_apps[0].value: null);
        VSUtil.setComboItems(that.elAppFilter,icon_apps,"value","label",null,null,that.def_app_id);
        that.displayReportList(mThis.selected_role.role_id, that.def_app_id, that.elSearchRpt.value);

    }

    function hasMoreThanOneKey(obj) {
        let count = 0;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                count++;
                if (count > 1) return true; // Exit early if more than one key is found
            }
        }
        return false; // If the loop finishes without finding more than one key
    }

    this.displayReportList = async (role_id,app_id,search_value) => {
        const that = this;
        role_id = role_id || RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;
        mThis.div_reports = mThis.div_reports || mThis.self.querySelector('#_um_role_report_list');

        if (!that.reportActions){
            const res = that.reportActions || await vsapi.get(`${main_view.base_url}/api/settings/report/actions`,null,false);
            that.reportActions = res.data;
        }

        //ReportAttributes is only used for collecting report list when user Export report list to .json file, and used for Editing existing report.
        that.reportAttributes = ['report_id','category','module_id','report_group','code','params','export_pdf','export_excel','export_csv','display_order'];
        mThis.reportList = mThis.reportList || new  UMExpandItemView(mThis.div_reports,{
            emptyInfoText:"No controlled reports",
            headerClass:"rpt-category",
            permissionActions: that.reportActions,
            itemDataset: that.reportAttributes,
            itemName:"Report",
            statuses:{
                1: {name:'Allowed',
                  signClass:'fa fa-check text-success fs-5',
                  //cssClass:'text-success',
                  textColorClass:'text-success',
                  backgroundClass:''
                },
               0:{
                name:'Denied',
                signClass:'fa fa-times text-danger fs-5',
                //cssClass:'text-danger',
                textColorClass:'text-danger',
                backgroundColorClass:''
              }
            },
            onStatusChange:(statusInfo,item_id,parent_id)=>{
                const role_id = RoleManagementComponent.selected_role?.role_id || RoleManagementComponent.selected_role?.id;

                const p = {role_id: role_id, prn_id:item_id, app_id:null, status_id : statusInfo.status_id};
                vsapi.post([main_view.base_url,'/api/role/reports/set-status'].join(''),p, {loader:false}).then(res =>{
                    if (res.status_code==200){
                    }else cv_interact.warning(res.error_message);
                });
            }

        });

        const p = {role_id: mThis.selected_role.role_id, app_id:app_id, search_value:search_value,"order_by":"display_order"};
        vsapi.post([main_view.base_url, '/api/role/reports'].join(''), p,{loader:false,cacheTTL: (search_value? 0:1500)}).then(res =>{
             const d = res.status_code ==200? res.data: {};
             mThis.reportList.setData(d);
        });
    }
}
/**end: ReportPanel definition */

 async function getAccessibleApps(){
    const p = {id: (mThis.selected_role.role_id || mThis.selected_role.id)};
    const res = await vsapi.post(`${main_view.base_url}/api/role/accessible-apps`,p,{loader:false,useCache:true,cacheTTL:1500});
    return res.status_code ==200? res.data : [];
 }

    //begin::init RoleTabView
        this.initOnce = ()=>{
            if (mThis.initAlready) return;
            mThis.tabHeader.querySelectorAll('a.tab-button').forEach(lnk => {
                const page_id = lnk.dataset.target;
                const div = mThis.tabBody.querySelector(`#${page_id}`);
                if(div) mThis.tabPages[page_id] = div;
            });

            this.tabHeader.addEventListener('click', e=>{
                e.preventDefault();
                const lnk = VSUtil.closestLimited(e.target,'a.tab-button');
                if(lnk){
                    const view_name = lnk.dataset.target || lnk.dataset.view;
                    //let view_name = lnk.dataset.view || lnk.dataset.viewname;
                    mThis.displayContent(mThis.selected_role,view_name);
                    mThis.setActivePage(view_name, lnk);
                    return;
                }

            });

            mThis.userListView = new ListView('_um_role_user_list',{
              tableClass:'table user-table',
              columns: user_cols,
              perPage:10,
               fetchApi:[main_view.base_url,'/api/role/members'].join(''),
               processResponse:(res)=>{

                   return res.data;
               },
               apiCluster:null,
               rowCreated:(data,index,tr) => {
                 tr.dataset.id = data.id || data.user_id;
                 tr.dataset.login = data.login_name;
                 tr.dataset.fullname = data.full_name;
                 tr.dataset.userclass = data.user_class;
                 tr.dataset.roleid = data.role_id;
               }
            });

            mThis.tblUsers = mThis.userListView.getTable();

            const userActionOptions = {
                containerElement: mThis.tblUsers,
                // className:"",
                // menuItemClass:"",
                actionButtonClass:'user_action',
                menus:[
                    {
                        //text:"",
                        html:"<span>Change Login Name</span>",
                        icon:"<i class='fa fa-edit text-warning fs-6'></i>",
                        name:"change_login_name"
                    },
                    {
                        html:"<span>Reset Password</span>",
                        icon:"<i class='fa fa-key text-info fs-6'></i>",
                        name:"reset_password"
                    },
                    {
                        //text:"",
                        html:'<span>Delete user</span>',
                        icon:"<i class='fa fa-trash-can text-danger fs-6'></i>",
                        name:"delete_user"
                    }
                ],
                adjustPosition:{
                    top:0
                },
                // onShow:(me, downdownMenu)=>{
                //     //let d = downdownMenu.dataset;
                //     //let menus = me.getMenus();
                //     //menus.reset_password.style.display='none';
                //     // if(d.status_id ==3)
                //     //   menus.start_delivery.style.display = 'none';
                //     // else menus.start_delivery.style.display = 'block';
                // },
                onClick:( (lnk, id, name) =>{
                    switch(name){
                        case 'change_login_name':{
                            let tr = lnk.closest('tr');
                            let oldLoginName = '';
                            if(tr) oldLoginName = tr.querySelector('td.login_name').textContent;
                            let op = {
                                id: id,
                                login_name: oldLoginName,
                                onClose:(p)=>{
                                    mThis.UserPanel.elSearchUser.value = p.login_name;
                                    mThis.userListView.showPage({"search_value":p.login_name});
                                    return;
                                }
                            };

                            if (!AuthManager.allowed(103,false)) return;
                            ChangeLoginNameDialog.show(op);
                            break;
                       }
                       case 'reset_password':{
                        let oldLoginName = '';
                        if (!AuthManager.allowed(104)) return;
                         oldLoginName = lnk.dataset.loginname;
                         let op = {
                            login_name: oldLoginName,
                            id: lnk.dataset.id || lnk.dataset.userid,
                            onClose:(p)=>{
                                return;
                            }
                         };
                         if (!AuthManager.allowed(104,false)) return;
                         SetPasswordDialog.show(op);
                         break;
                       }
                       case 'delete_user':{
                         mThis.UserPanel.deleteUser(id,lnk);
                         break;
                       }
                    }
                    //alert(' is click on  ID '+ id + ' action: ' + action);
                })
             };

            //  mThis.btnPrint.addEventListener('click', e =>{
            //     e.preventDefault();
            //     let op = {
            //         id: null,
            //         // group_id:1,
            //         action: 'gen_user',
            //         onClose:(d)=>{
            //             // let p = mThis.getFilterData();
            //             // mThis.loadRoles(p, roles =>{
            //             //     let new_role = d.role;
            //             //     mThis.renderRoleCards(roles,null,new_role);
            //             // });
            //         }
            //     }
            //     PrintDialog.show(op);
            // });

            new VSDropdownMenu(userActionOptions);

            this.role_container = mThis.userListView.getListContainer();

            const role_parent = mThis.role_container.parentElement;
            role_parent.style.height = (window.innerHeight - 500) + 'px';
            role_parent.classList.add('overflow-y-auto');
            window.onresize = () => {
                role_parent.style.height = (window.innerHeight - 500) + 'px';
            }

            mThis.tblUsers.onclick = e=>{
               e.preventDefault();
              //Click on Remove User
               let lnk = VSUtil.closestLimited(e.target,'.lnk-remove-user');
               if (lnk){
                if(!AuthManager.allowed(113,false)) return;
                 cv_interact.confirm(['Are you sure to remove the selected user from ',mThis.selected_role.name || 'the role', '?'].join(''),{"title":"Remove User","context":'delete', "confirmButtonText":"Remove"},e =>{
                     if(e){
                         let user_id = lnk.dataset.id || lnk.dataset.userid;
                         let p = {"role_id":mThis.selected_role.role_id, "user_id":user_id};
                         vsapi.call([main_view.base_url, '/api/role/remove-member'].join(''),p,null,false).then(res =>{
                             if(res.status_code ==200){
                                 mThis.userListView.showPage(RoleTabView.UserPanel.getFilterData());
                             }else cv_interact.warning(res.error_message);
                         });
                     }
                 } );
                 return;
               }

               //Click on reset password
               lnk = VSUtil.closestLimited(e.target,'.lnk-reset-password');
               if(lnk){
                    if(!AuthManager.allowed(104)) return;
                    let op = {
                        login_name: lnk.dataset.loginname,
                        id: lnk.dataset.id || lnk.dataset.userid,
                        onClose:()=>{
                            return;
                        }
                    };
                    if (!AuthManager.allowed(104,false)) return;
                   SetPasswordDialog.show(op);
               }

               lnk = VSUtil.closestLimited(e.target,'.user-print');
               if(lnk){
                    // if(!AuthManager.allowed(109)) return;
                    const op = {
                        action: 'user-print',
                        role_id: mThis.selected_role.role_id,
                        id: lnk.dataset.id || lnk.dataset.userid,
                        onClose:()=>{
                            return;
                        }
                    };
                    PrintDialog.show(op)
               }

             //Click on lock user
             lnk = VSUtil.closestLimited(e.target,'.lnk-lock-user');
             if(lnk){
                if(!AuthManager.allowed(107,false)) return;
                    let user_id = lnk.dataset.id || lnk.dataset.userid;
                    let tr = VSUtil.closestLimited(e.target,'tr');
                    let user_name = tr.dataset.fullname;
                    let login_name = tr.dataset.login;
                    //let islocked = tr.dataset.islocked;
                    let action = lnk.dataset.action; //islocked ==1? 'unlock': 'lock';
                    let op = {
                        user_id: user_id,
                        user_name: user_name,
                        action: action,
                        status_code: action
                    };
                     action =(action || '').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                    cv_interact.confirm(['Do you want to ',action.toLowerCase() ,' user ',user_name.replace(/^\w/, (c) => c.toUpperCase()),'?'].join(''),{
                        title: `${action || ''} User`,
                        context: `update`,
                        confirmButtonText:`${action || ''} Now`
                    },(e) => {
                        if(e)
                        {
                            delete(op.user_name);
                            vsapi.call(`${main_view.base_url}/api/user/status/update`,op,lnk,false).then(res => {
                                if(res.status_code === 200)
                                {
                                    mThis.UserPanel.elSearchUser.value = login_name;
                                    mThis.userListView.showPage(mThis.UserPanel.getFilterData(),mThis.userListView.current_page);
                                }
                                else cv_interact.error(res.error_message);

                            });
                        }
                    });

                return;
             }


            // //Click on edit user
            //  lnk = VSUtil.closestLimited(e.target,'.lnk-edit-user');
            //  if(lnk){
            //       if(!AuthManager.allowed(112)) return;
            //       let user_id = lnk.dataset.id || lnk.dataset.userid;
            //       let tr = VSUtil.closestLimited(e.target,'tr');
            //       //get primary role_id. If user does not have primary role_id, then do not allow edit information
            //       const role_id = tr.dataset.roleid;
            //       const user_class = tr.dataset.userclass;
            //       // if(!role_id || role_id==0){
            //       //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
            //       //   return;
            //       // }
            //       let op = {
            //           user_id: user_id,
            //           role_id: role_id,
            //           default:{
            //               user_class: user_class
            //           },
            //           open: 'add-user',
            //           onClose: () => {
            //               mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
            //           }
            //       };
            //       if(op.user_id > 0) AddUserDialog.show(op); else cv_interact.error('User ID is unexpectedly missing or No user ID is selected');

            //      return;
            // }

            };


            mThis.initAlready = true ;
        }

       mThis.initOnce();
    //end::init RoleTabeView


    //Set active Tab or tab page
    this.setActivePage = (view_name, lnk = null) =>{
        const selectedDiv = this.tabPages[view_name];
        lnk = lnk || mThis.tabHeader.querySelector(`a.${view_name}`);
        if (lnk){
            if (selectedDiv) {
                selectedDiv.style.display = 'block';
                lnk.classList.add('active');

                lnk.parentElement.querySelectorAll('a').forEach(el =>{
                    if (el !== lnk && el.classList.contains('active')) {
                        el.classList.remove('active');
                    }
                });
            }

            Object.values(this.tabPages).forEach(div => {
                if (div && div !== selectedDiv) {
                    div.style.display = 'none';
                }
            });

            mThis.last_view_name = view_name; //remember the last selected view_name
        }
    }

    // @role = {"role_id","user_class"}
    this.displayContent = async (role,view_name = null,op=null) =>{
         op = op || {};
         //remember role_id
         mThis.selected_role = role;
         if(role.user_class ==='parent') RoleManagementComponent.parentId = true;
         else RoleManagementComponent.parentId = false;
    // console.log(4444,RoleManagementComponent.parentId);
        if(!role || (!role.role_id || role.role_id ==0)){
            RoleTabView.self.classList.remove('d-flex');
            RoleTabView.self.style.display='none';
            return;
        }
        view_name = view_name || mThis.last_view_name;
        const role_id = role.role_id;
        let apps = [], cfg = null;
        switch(view_name){
            case 'view_users':
              mThis.userListView.showPage({"role_id":role_id,"search_value":op.user_search_value});
              break;
            case 'view_applications':
            case 'view_apps':
               this.AppPanel.loadApps();
               break;
            case 'view_modules':
                //mThis.moduleListView.showPage({"role_id":role_id});
                this.ModulePanel.loadAppChoices();
               break;
            case 'view_permissions':
                this.PermissionPanel.loadAppChoices();
               break;
            case 'view_reports':
               this.ReportPanel.loadAppChoices();
              break;
            default:
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display='none';
                return;
                //break;
        }
        RoleTabView.self.classList.add('d-flex');
        //RoleTabViewself.style.display='block';
        mThis.setActivePage(view_name);
    }


}
RoleManagementComponent.RoleTabView = RoleTabView;
/**end:: vs-tab-view for role details */

const RoleDialog = (()=>{
    const self = {};
    let dialog = null;
    self.show = (op)=>{
      dialog = dialog || new GeneralDialog({
          cssClass:"vs-modal-dialog",
          fields:[
            {
               name:"group_id",
               label:"Role Group",
               inputType:"select",
               required:true
            },
            {
              name:"user_class",
              label:"User Class",
              inputType:"select",
              required:true
            },
            {
               name:"name",
               label:"Role Name",
               inputType:"text",
               required:true
            }
          ],
          configSelect:[
              {
                  name:"group_id",
                  data:"role_groups",
                  valueField:"id",
                  textField:"role_group_name",
                  defaultValue:"Official"
              },
              {
                  name:"user_class",
                  data:"user_classes",
                  valueField:"user_class",
                  textField:"user_class_name",
              }
          ],
          buttons:[
            {
               label:"Cancel",
               cssClass:"btn btn-vs-cancel",
               dismissModal:true
            },
            {
               label:"Save",
               cssClass:"btn btn-vs-save",
               click:(modal,btn,divModal)=>{
                   let p = modal.getData();
                   //let p = {id:mThis.options.id, group_id:mThis.elRoleGroup.value, name: mThis.elRoleName.value};
                   vsapi.call(`${main_view.base_url}/api/role/save`, p,null,false).then(res => {
                       if(res.status_code == 200){
                           const d = res.data;
                           modal.hide();
                           modal.dataOptions.onClose({role:d? d.new_role: null});
                          //  if(typeof mThis.options.onClose ==='function') mThis.options.onClose({role:d? d.new_role: null});
                       }else cv_interact.error(res.error_message);
                   });
               }
            }
          ],
          prepareFormOptions:{
            createTitle:"Add Role",
            modifyTitle :"Modify Role",
            targetProp:"role",
            api:{
              endpoint:`${main_view.base_url}/api/role/form-options`,
              params:(op)=>{
                  return {id: op.id};
              },
              // onResponse:(res)=>{
              // // console.log(res);
              // }
            }
          },
          // onClose:(canceled)=>{}
       });

       dialog.show(op);
    };

    return self;
  })();

  const PrintDialog = new function(){
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_print_');
    this.modal = new bootstrap.Modal(this.self);
    this.elBody = mThis.self.querySelector('div.modal-body');
    this.btnPrint = mThis.self.querySelector('#dlg_print_btn'); //** this btn use both print and receive payment */
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.htmlString = null;
    this.company_profile_url = [];
    this.controlButton = (div, op) => {


        mThis.btnPrint.onclick = e => {
        e.preventDefault();

        if (!mThis.htmlString) return;

        mThis.modal.hide();

        let style = `
                #_zoom {
                    zoom: 100%;
                }

                .zoom_table {
                    zoom: 100%;
                }
        `;

        windowPrintRole(mThis.htmlString, style);
    };


    }

    this.prepareRolePrint = (div, d) => {
        d = d || [];
        let html_option = '';
        const roles = d.roles ?? [],
        company_info = d.company_profile ?? {};
        if(d)
        {
            let html = `
            <div id="full_elbody" style="zoom:95%">
                <style>
                    #full_elbody {
                        background: #fff !important;
                        font-family: "Khmer OS Battambang", Arial, sans-serif !important;
                    }
                    .table-bordered th, .table-bordered td { border:1px solid #000 !important; padding:4px 6px; }

                </style>

                <div class="page">
                    <div class="row mb-3">
                        <div class="col-2">
                            <img src="${main_view.base_url}/assets/images/logo/ksm-logo.png" style="max-width:100px; max-height:100px;" alt="logo" />
                        </div>
                    </div>

                    <div class="text-center">
                        <h4 class="text-uppercase mb-1">List Of Roles</h4>
                        <p class="mb-0"></p>
                    </div>
                </div>
            `;

            const tHead = `
                        <thead>
                            <tr>
                                <th class="text-nowrap">No</th>
                                <th class="text-nowrap">Role Name</th>
                                <th class="text-nowrap">Member</th>
                                <th class="text-nowrap">Created By</th>
                                <th class="text-nowrap">Created Date</th>
                            </tr>
                        </thead>
                    `;

            let tBody = ``;
            let i = 1;
            roles.map( r =>{
                tBody +=`
                        <tr>
                            <td class="align-middle">${i}</td>
                            <td class="align-middle text-start">${r.name}</td>
                            <td class="align-middle">${r.user_count}</td>
                            <td class="align-middle">${r.create_user ?? ''}</td>
                            <td class="align-middle text-start">${r.created_at ?? ''}</td>
                        </tr>`;
                i++;
            });
            tBody = '<tbody>' + tBody + '</tbody>';
            html += '<table class = "table table-bordered text-center align-middle">' + tHead + tBody + '</table>';

            div.innerHTML =  html;
            mThis.htmlString = html;
            div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
            LocaleManager.translateZone(div);

        }
    }

    this.getCompanyLogo_url = ()=>{
            return vsapi.call(`${main_view.base_url}/api/company/details`,null,{loader:false,agent:null}).then(res => {
            if(res.status_code == 200){
                const d = res.data.logo_url ?? [];
                return d;
            }
        });
    }

    this.prepareUserPrint = (div, d, users) => {
        d = d || {};
        users = Array.isArray(users) ? users : [];

        if (!users.length) return;

        let html = `
        <div id="full_elbody" style="zoom:95%">
            <style>
                #full_elbody {
                    background: #fff !important;
                    font-family: "Khmer OS Battambang", Arial, sans-serif !important;
                }
                .table-bordered th, .table-bordered td { border:1px solid #000 !important; padding:4px 6px; }

            </style>

            <div class="page">
                <div class="row mb-3">
                    <div class="col-2">
                        <img src="${main_view.base_url}/assets/images/logo/ksm-logo.png" style="max-width:100px; max-height:100px;" alt="logo" />
                    </div>
                </div>

                <div class="text-center">
                    <h4 class="text-uppercase mb-1">Users List</h4>
                    <p class="mb-0"></p>
                </div>
            </div>
        `;

        const tHead = `
            <thead class="text-center">
                <tr>
                    <th>No</th>
                    <th>Full Name</th>
                    <th>Login Name</th>
                    <th>User Class</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Created By</th>
                </tr>
            </thead>
        `;

        let tBody = '';
        users.forEach((u, i) => {
            tBody += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${u.full_name ?? ''}</td>
                    <td>${u.login_name ?? ''}</td>
                    <td>${u.user_class ?? ''}</td>
                    <td>${u.role_name ?? ''}</td>
                    <td>${u.last_login_date ?? 'N/A'}</td>
                    <td>
                        <div>${u.create_user ?? ''}</div>
                        <small>${u.created_at ?? ''}</small>
                    </td>
                </tr>
            `;
        });

        html += `
                <table class="table table-bordered">
                    ${tHead}
                    <tbody>${tBody}</tbody>
                </table>
        </div>
        `;

        mThis.self.classList.remove('modal-custom-size');
        div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
        div.innerHTML = html;

        LocaleManager.translateZone(div);
        mThis.htmlString = html;
    };


    this.permissionUserPrint = (div, d , users) => {
        d = d || [];
        users = users || [];
        let u = users[0];
        let app = null,mod = null, per = null, tr = null;
        const company_info = d.company_profile ?? {};
        const check_icon = `<img style="max-width: 15px; max-height: 15px; color: green" class="" src="${main_view.base_url}/assets/images/icons/check-solid.svg" alt="check :"/>`,
        cross_icon = `<img style="max-width: 15px; max-height: 15px; color:red" class="" src="${main_view.base_url}/assets/images/icons/xmark-solid.svg" alt="xmark :"/>`;
        if(users)
        {
            let html = `
                <div id="full_elbody" style="zoom:95%">
                    <style>
                        #full_elbody {
                            background: #fff !important;
                            font-family: "Khmer OS Battambang", Arial, sans-serif !important;
                        }
                        .table-bordered th, .table-bordered td {padding:4px 6px; }

                    </style>

                    <div class="page">
                        <div class="row mb-3">
                            <div class="col-2">
                                <img src="${main_view.base_url}/assets/images/logo/ksm-logo.png" style="max-width:100px; max-height:100px;" alt="logo" />
                            </div>
                        </div>

                        <div class="text-center">
                            <h4 class="text-center text-uppercase">Permissions for ${users[0].full_name}</h4>
                            <h5 class="text-center w-100 get-subtitle">Role : ${users[0].role_name ?? ''}</h5>
                        </div>
                    </div>
                `;


            let tBody = ``;
            let i = 1;
        // console.log(JSON.stringify(d, null, 2));
            // users.map( u =>{
                tBody =`
                    <!-- <tr>
                        <td class="align-middle"><i class="fas fa-user"></i> ${u.full_name}</td>
                    </tr> -->

                    ${app=null,
                        Object.keys(d || {}).forEach(key => {
                            if(key == 'application_list'){
                                app = [app,`${tr=null,
                                    (d[key] || []).forEach(ap => {
                                        tr = [tr,`<tr class="text-nowrap"><td class="align-middle "><div class="ms-5 d-flex gap-2 align-items-center"> <span class="text-icon "> A </span> <span>${ap.app_name ?? ''}</span></div></td></tr>`].join('');
                                        tr += `${mod=null,
                                            Object.keys(d || {}).forEach(key => {
                                                if(key == 'module_list'){
                                                    mod = [mod,`${tr=null,
                                                        (d[key] || []).forEach(mo => {
                                                            if(mo.app_id == ap.app_id){
                                                                tr = [tr,`<tr class="text-nowrap"><td class="align-middle "><div class="ms-5"> <span class="ms-5 d-flex gap-2 align-items-center"> <span class="text-icon ">M</span> ${mo.module_name ?? ''}</span></div></td></tr>`].join('');
                                                                tr += `${per=null,
                                                                    Object.keys(d || {}).forEach(key => {
                                                                        if(key == 'permission_list'){
                                                                            per = [per,`${tr=null,
                                                                                (d[key] || []).forEach(pe => {
                                                                                    if(pe.module_id == mo.id){
                                                                                        const values = pe.action_string.split('|');
                                                                                        let status = null;
                                                                                        values[0] == 'primary:1' ? status = check_icon : values[0] == 'primary:0' ? status = cross_icon : '';
                                                                                        tr = [tr,`<tr class="text-nowrap"><td class="align-middle "><div class="ms-5 pe-5 d-flex justify-content-between"> <span class="ms-5 ps-5 d-flex gap-2 align-items-center"> <span class="text-icon ">P</span> ${pe.permission_name ?? ''}</span> ${status}</div></td></tr>`].join('');
                                                                                        // tr += ``;
                                                                                    }
                                                                                }),
                                                                            tr ?? ''}`].join('');
                                                                        }
                                                                    }),
                                                                    per ?? '<tr>no</tr>'
                                                                }`;
                                                            }
                                                        }),
                                                    tr ?? ''}`].join('');
                                                }
                                            }),
                                            mod ?? '<tr>no</tr>'
                                        }`;
                                    }),
                                tr ?? ''}`].join('');
                            }
                        }),
                        app ?? '<tr>no</tr>'
                    }
                    `;
            // });
            tBody = '<tbody>' + tBody + '</tbody>';
            // html += '<table class = "table w-100">' + tHead + tBody + '</table>';
            // let body = mThis.renderTableBody(d);
            html += `<table  class= "table table-bordered text-center align-middle">${tBody}</table>`;
            // html += body;
            mThis.self.classList.remove('modal-custom-size');
            div.innerHTML = html;
            mThis.htmlString = html;
            div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
            LocaleManager.translateZone(div);
            // mThis.getCompanyLogo_url().then(logoUrl => {
            //     let imgLogo = div.querySelector('.CompanyLogo');
            //     imgLogo.setAttribute('src', logoUrl);
            // });

        }

    }

    this.getHeaderText = (key)=>{
    let h = {
        'application_list':'Applications',
        'permission_list':'Permissions',
        'report_list':'Reports',
    };
    return h[key];
    }

    this.renderTableBody = (d) => {
    let table = ``;
    let thead = '';
    let tbody = '';
    // console.log('d',d);
    // const check_icon = `<i class="fa fa-check text-success fs-5 p-0 m-0"></i>`,
    // cross_icon = `<i class="fa fa-times text-danger fs-5 p-0 m-0"></i>`;

            // console.log(222,d);
            Object.keys(d || {}).forEach(key => {
                // const item = d[key];
                let headItem = mThis.getHeaderText(key);

                thead = `<thead>
                    <tr class="">
                        <th colspan="100%" class="text-nowrap text-uppercase text-center">${headItem}</th>
                    </tr>
                </thead>`;
                // table += thead;
                let module_id = '';
                if(!d[key] || d[key] == ''){
                    tbody = `<tr>
                            <td colspan="100%" class=" d-flex justify-content-center align-items-center"><span class="">No ${headItem} List </span> </td>
                        </tr>`;
                }else{
                    (d[key] || []).forEach(item => {
                        let item_name = item.name ?? item.app_name ?? item.module_name ?? item.permission_name ;
                        if(key=='permission_list')
                            module_id = `(${item.module_id})`;
                        else if (key =='module_list'){
                            module_id = `(${item.module_id})`;
                        }
                        // module_id = `(${item.module_id})`;

                        tbody += `<tr>
                            <td colspan="100%" class="align-middle text-uppercase  d-flex gap-3"><span class="ps-3">${item_name ?? ''} </span> <span class=""> ${module_id??''}</span></td>
                        </tr>`;
                    });
                }
                table += `<table  class= "table table-bordered w-100">${thead + tbody}</table>`;
                tbody = '';
            });

    return table;
    }

    this.prepareModulePrint = (div, d) => {
        const data = d || [];

        let table = ``;
        let thead = '';
        let tbody = '';
        const role_selected_info = RoleManagementComponent.selected_role;

        const check_icon = `<img style="max-width: 15px; max-height: 15px;" class="" src="${main_view.base_url}/assets/images/icons/check-solid.svg" alt="check :"/> `,
        cross_icon = ` <img style="max-width: 15px; max-height: 15px;" class="" src="${main_view.base_url}/assets/images/icons/xmark-solid.svg" alt="xmark :"/>`;
        if(data)
        {
            let html = `
            <div id="full_elbody" style="zoom:95%">
                <style>
                    #full_elbody {
                        background: #fff !important;
                        font-family: "Khmer OS Battambang", Arial, sans-serif !important;
                    }
                    .table-bordered th, .table-bordered td { border:1px solid #000 !important; padding:4px 6px; }

                </style>

                <div class="page">
                    <div class="row mb-3">
                        <div class="col-2">
                            <img src="${main_view.base_url}/assets/images/logo/ksm-logo.png" style="max-width:100px; max-height:100px;" alt="logo" />
                        </div>
                    </div>

                    <div class="text-center">
                        <h4 class="text-uppercase mb-1">Module List Role : ${role_selected_info?.name}</h4>
                        <p class="mb-0"></p>
                    </div>
                </div>
            `;

            let tBody = ``;
            Object.keys(d || {}).forEach(key => {
                // const item = d[key];
                // let headItem = mThis.getHeaderText(key);
            // console.log(4444,key);
                if(key == 'status') return;

                thead = `<thead>
                    <tr class="">
                        <th colspan="100%" class="text-nowrap text-uppercase fs-6 text-center">${key}</th>
                    </tr>
                    <tr class="">
                        <th class="text-nowrap text-capitalize text-center">No</th>
                        <th class="text-nowrap text-capitalize text-center">Module Name</th>
                        <th class="text-nowrap text-capitalize text-center">Allow</th>
                    </tr>
                </thead>`;
                table += thead;
                // let module_id = '';
                if(!d[key] || d[key] == ''){
                    tbody = `<tr>
                            <td colspan="100%" class=" d-flex justify-content-center align-items-center"><span class="">No ${key} List </span> </td>
                        </tr>`;
                }else{
                    let i = 1;
                    (d[key].items || []).forEach(item => {
                        let item_name = item.name ?? item.app_name ?? item.module_name;
                        let status = item.action_string == 'primary:1' ? check_icon : cross_icon;

                        tbody += `<tr>
                            <td class="align-middle text-center">
                                <span class="">${i} </span>
                            </td>
                            <td class="align-middle text-capitalize text-start"><span class="">${item_name ?? ''} </span></td>
                            <td class="align-middle text-center">
                                <span class="chg_icon">${status}</span>
                            </td>

                        </tr>`;
                        i++;
                    });
                }
                table += '<tbody>' + tbody + '</tbody>';
                tbody = '';
            });
            tBody = table ;
            html += '<table class = "table table-bordered text-center align-middle">' + tBody + '</table>';

            div.innerHTML = (html);
            mThis.htmlString = html;
            div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
            LocaleManager.translateZone(div);
            // mThis.getCompanyLogo_url().then(logoUrl => {
            //     let imgLogo = div.querySelector('.CompanyLogo');
            //     imgLogo.setAttribute('src', logoUrl);
            // });

        }
    }

    this.preparePermissionPrint_old = (div, d) => {
        const data = d || [];
    // console.log(2222,d);
        let table = ``;
        let thead = '';
        let tbody = '';
        const check_icon = `<img style="max-width: 15px; max-height: 15px; color: green" class="" src="${main_view.base_url}/assets/images/icons/check-solid.svg" alt="check :"/>`,
        cross_icon = `<img style="max-width: 15px; max-height: 15px; color:red" class="" src="${main_view.base_url}/assets/images/icons/xmark-solid.svg" alt="xmark :"/>`;
        if(data)
        {
            let html = `<div class="d-block position-relative">
                            <div class="height-logo-report position-absolute float-start">
                                <img style="max-width: 100px; max-height: 100px;" class="CompanyLogo object-fit-scale set-min-size-logo" src="" alt=""/>
                            </div>
                            <div class="d-flex flex-column gap-2 justify-content-center align-items-center set-min-size-container-title">
                                <h4 class="text-center text-uppercase">Permissions for Role System</h4>
                                <p class="text-center w-100 fs-5-1 get-subtitle"> </p>
                            </div>
                        </div>
                        <style>
                        thead tr th, tbody tr td{
                            border: solid 2px grey !important;
                            padding: 5px !important;
                        }
                        </style>`;

            let tBody = ``;
            Object.keys(d || {}).forEach(key => {
                // const item = d[key];
                // let headItem = mThis.getHeaderText(key);
            // console.log(4444,key);
                if(key == 'status') return;

                thead = `<thead>
                    <tr class="">
                        <th colspan="100%" class="text-nowrap text-uppercase fs-6 text-center">${key}</th>
                    </tr>
                    <tr class="">
                        <th class="text-nowrap text-capitalize text-center">No</th>
                        <th class="text-nowrap text-capitalize">Permission Name</th>
                        <th class="text-nowrap text-capitalize text-center">Allow</th>
                    </tr>
                </thead>`;
                table += thead;
                // let module_id = '';
                if(!d[key] || d[key] == ''){
                    tbody = `<tr>
                            <td colspan="100%" class=" d-flex justify-content-center align-items-center"><span class="">No ${key} List </span> </td>
                        </tr>`;
                }else{
                    let i = 1;
                    (d[key].items || []).forEach(item => {
                        let item_name = item.name ;

                        tbody += `<tr>
                            <td class="align-middle text-center">
                                <span class="">${i} </span>
                            </td>
                            <td class="align-middle text-capitalize"><span class="">${item_name ?? ''} </span></td>
                            <td class="align-middle text-center">
                                <span class="chg_icon">${item.status_id ? check_icon : cross_icon}</span>
                            </td>

                        </tr>`;
                        i++;
                    });
                }
                table += '<tbody>' + tbody + '</tbody>';
                tbody = '';
            });
            tBody = table ;
            html += '<table class = "table table--border w-100">' + tBody + '</table>';

            div.innerHTML = (html);
            mThis.htmlString = html;
            div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
            LocaleManager.translateZone(div);
            mThis.getCompanyLogo_url().then(logoUrl => {
                let imgLogo = div.querySelector('.CompanyLogo');
                imgLogo.setAttribute('src', logoUrl);
            });

        }
    }
    this.preparePermissionPrint = (div, d) => {
        const data = d || [];
    // console.log(2222,d);
        let table = ``;
        let thead = '';
        let tbody = '';
        const role_selected_info = RoleManagementComponent.selected_role;

        const check_icon = `<img style="max-width: 15px; max-height: 15px; color: green" class="" src="${main_view.base_url}/assets/images/icons/check-solid.svg" alt="check :"/>`,
        cross_icon = `<img style="max-width: 15px; max-height: 15px; color:red" class="" src="${main_view.base_url}/assets/images/icons/xmark-solid.svg" alt="xmark :"/>`;
        if(data)
        {
                let html = `
                <div id="full_elbody" style="zoom:95%">
                    <style>
                        #full_elbody {
                            background: #fff !important;
                            font-family: "Khmer OS Battambang", Arial, sans-serif !important;
                        }
                        .table-bordered th, .table-bordered td {padding:4px 6px; }

                    </style>

                    <div class="page">
                        <div class="row mb-3">
                            <div class="col-2">
                                <img src="${main_view.base_url}/assets/images/logo/ksm-logo.png" style="max-width:100px; max-height:100px;" alt="logo" />
                            </div>
                        </div>

                        <div class="text-center">
                            <h4 class="text-uppercase mb-1">Permissions for Role : ${role_selected_info?.name}</h4>
                            <p class="mb-0"></p>
                        </div>
                    </div>
                `;

            let tBody = ``;
            Object.keys(d || {}).forEach(key => {
                // const item = d[key];
                // let headItem = mThis.getHeaderText(key);
            // console.log(4444,key);
                if(key == 'status') return;

                thead = `
                    <tr class="">
                        <td colspan="" class="text-nowrap text-uppercase fs-6 text-start text-bold ps-5 d-flex gap-2 align-items-center" style="font-weight: 600;" ><span class="text-icon" > M </span> ${key}</td>
                    </tr>
                `;
                table += thead;
                // let module_id = '';
                if(!d[key] || d[key] == ''){
                    tbody = `<tr>
                            <td colspan="" class=" d-flex justify-content-start align-items-cente ps-5"><span class="">No ${key} List </span> </td>
                        </tr>`;
                }else{
                    let i = 1;
                    (d[key].items || []).forEach(item => {
                        let item_name = item.name ;
                        let status = item.action_string == 'primary:0' ? cross_icon : item.action_string == 'primary:1' ? check_icon : '';

                        tbody += `<tr>
                            <td class="d-flex justify-content-between align-items-center pe-5"><div class="align-middle text-capitalize ps-5"><span class="ms-5 d-flex gap-2 align-items-center "><span class="text-icon"> P </span> ${item_name ?? ''} </span></div> ${status}</td>
                        </tr>`;
                        i++;
                    });
                }
                table += '<tbody>' + tbody + '</tbody>';
                tbody = '';
            });
            tBody = table ;
            html += '<table class = "table table-bordered text-center align-middle">' + tBody + '</table>';

            div.innerHTML = (html);
            mThis.htmlString = html;
            div.classList.remove('d-flex', 'justify-content-center', 'align-items-center');
            LocaleManager.translateZone(div);
            mThis.getCompanyLogo_url().then(logoUrl => {
                let imgLogo = div.querySelector('.CompanyLogo');
                imgLogo.setAttribute('src', logoUrl);
            });

        }
    }

    this.loadFormDetails = (div, op, onFinish = null) => {
        mThis.controlButton(div, op);
        if (op.action === 'gen_role')
        {
            div.innerHTML = '';
            const modal = div.closest('.modal');
            modal.classList.add('modal-custom-size');
            const modal_dialog = modal.querySelector('.modal-dialog');
            modal_dialog.classList.add(['modal-lg']);
            modal_dialog.classList.remove('modal-xl');
            delete(op.action);

            vsapi.call(`${main_view.base_url}/api/role/listForPrint`, {
                // invoice_id: op.invoice_id
            }, null).then(res => {
                if(res.status_code === 200)
                {
                    const d = res.data || {};
                    d.status = op.status;
                    mThis.prepareRolePrint(div, d);
                    if(typeof onFinish === 'function') onFinish();
                }
                else
                {
                    console.error('Failed to load receipt details at api/role/listForPrint');
                    cv_interact.error(res.error_message || 'Failed to load receipt details!');
                }
            });
        }else if(op.action === 'gen_user'){
            div.innerHTML = '';
        // console.log(3333,op);
            const modal = div.closest('.modal');
            modal.classList.add('modal-custom-size');
            const modal_dialog = modal.querySelector('.modal-dialog');
            modal_dialog.classList.add(['modal-xl']);
            modal_dialog.classList.remove('modal-lg');
            delete(op.action);

            // api/role/members
            vsapi.call(`${main_view.base_url}/api/role/members`, {
                role_id: op.role_id
            }, null).then(res => {
                if(res.status_code === 200)
                {
                    const u = res.data || {};
                    // user.map( u =>{
                        // console.log(999,u);
                        mThis.prepareUserPrint(div, null ,u);

                        // vsapi.call(`${main_view.base_url}/api/user/authorization-report`, {
                        //     role_id: op.role_id,
                        //     user_id: u.id
                        // }, null).then(res => {
                        //     if(res.status_code === 200)
                        //     {
                        //         const d = res.data || {};
                        //     // console.log(2323,d);
                        //         // d.status = op.status;
                        //         // if(typeof onFinish === 'function') onFinish();
                        //     }
                        //     else
                        //     {
                        //         console.error('Failed to load receipt details at api/role/members');
                        //         cv_interact.error(res.error_message || 'Failed to load receipt details!');
                        //     }
                        // });
                    // });
                    if(typeof onFinish === 'function') onFinish();
                }
                else
                {
                    console.error('Failed to load receipt details at api/role/members');
                    cv_interact.error(res.error_message || 'Failed to load receipt details!');
                }
            });
            // vsapi.call(`${main_view.base_url}/api/user/authorization-report`, {
            //     role_id: op.role_id,
            //     user_id: op.role_id
            // }, null).then(res => {
            //     if(res.status_code === 200)
            //     {
            //         // console.log(2323,role_id);
            //         const d = res.data || {};
            //         d.status = op.status;
            //         mThis.prepareUserPrint(div, d);
            //         // if(typeof onFinish === 'function') onFinish();
            //     }
            //     else
            //     {
            //         console.error('Failed to load receipt details at api/role/members');
            //         cv_interact.error(res.error_message || 'Failed to load receipt details!');
            //     }
            // });
        }else if(op.action === 'gen_modules'){
            div.innerHTML = '';
        // console.log(3333,op);
            const modal = div.closest('.modal');
            modal.classList.add('modal-custom-size');
            const modal_dialog = modal.querySelector('.modal-dialog');
            modal_dialog.classList.add(['modal-lg']);
            modal_dialog.classList.remove('modal-xl');
            delete(op.action);

            vsapi.call(`${main_view.base_url}/api/role/modules`, {
                role_id: op.role_id, order_by : 'display_order'
            }, {loader:false,agent:null}).then(res => {
                if(res.status_code === 200)
                {
                    const d = res.data || {};
                    d.status = op.status;
                // console.log(3333,d);
                    mThis.prepareModulePrint(div, d);
                    if(typeof onFinish === 'function') onFinish();
                }
                else
                {
                    console.error('Failed to load receipt details at api/role/members');
                    cv_interact.error(res.error_message || 'Failed to load receipt details!');
                }
            });
        }else if(op.action === 'gen_permissions'){
            div.innerHTML = '';
        // console.log(3333,op);
            const modal = div.closest('.modal');
            modal.classList.add('modal-custom-size');
            const modal_dialog = modal.querySelector('.modal-dialog');
            modal_dialog.classList.add(['modal-lg']);
            modal_dialog.classList.remove('modal-xl');
            delete(op.action);

            vsapi.call(`${main_view.base_url}/api/role/permissions`, {
                role_id: op.role_id, order_by : 'display_order'
            }, null,{loader:false,agent:null}).then(res => {
                if(res.status_code === 200)
                {
                    const d = res.data || {};
                // console.log(1233434,JSON.stringify(d, null, 2));
                    d.status = op.status;
                    mThis.preparePermissionPrint(div, d);
                    if(typeof onFinish === 'function') onFinish();
                }
                else
                {
                    console.error('Failed to load receipt details at api/role/permissions');
                    cv_interact.error(res.error_message || 'Failed to load receipt details!');
                }
            });
        }else if(op.action === 'user-print'){
            div.innerHTML = '';
        // console.log(3333,op);
            const modal = div.closest('.modal');
            modal.classList.add('modal-custom-size');
            const modal_dialog = modal.querySelector('.modal-dialog');
            modal_dialog.classList.add(['modal-lg']);
            modal_dialog.classList.remove('modal-xl');
            delete(op.action);

            // api/role/members
            vsapi.call(`${main_view.base_url}/api/role/members`, {
                role_id: op.role_id
            }, null).then(res => {
                if(res.status_code === 200)
                {
                    const u = res.data || [];
                    // user.map( u =>{
                        console.log(999,op.role_id,222,res.data);
                        vsapi.call(`${main_view.base_url}/api/user/authization/report`, {
                            role_id: op.role_id,
                            user_id: u[0].id
                        }, null).then(res => {
                            if(res.status_code === 200)
                            {
                                const d = res.data || {};
                                console.log(2323,d);
                                    mThis.permissionUserPrint(div, d ,u);
                                // d.status = op.status;
                                // if(typeof onFinish === 'function') onFinish();
                            }
                            else
                            {
                                console.error('Failed to load receipt details at api/role/members');
                                cv_interact.error(res.error_message || 'Failed to load receipt details!');
                            }
                        });
                    // });
                    if(typeof onFinish === 'function') onFinish();
                }
                else
                {
                    console.error('Failed to load receipt details at api/role/members');
                    cv_interact.error(res.error_message || 'Failed to load receipt details!');
                }
            });

        }else{
            console.error('No action found');
        }
    }

    this.show = (options) => {
        if(!options) options = {};
        let title = null, btn_name = null;
        options.action === 'gen_user' ? (title = `Preveiw Users Print`, btn_name = 'Print Now') : options.action === 'gen_role' ? (title = `Preveiw Role Print`, btn_name = 'Print Now') : options.action === 'user-prin' ? (title = `User Permission Tree`, btn_name = 'Print Now') : (title = `Preveiw Dialog`, btn_name = 'Print Now');

        if(title)
        {
            mThis.elTitle.textContent = (LocaleManager.trans(title, 'titles'));
            mThis.btnPrint.textContent  = (LocaleManager.trans(btn_name, 'titles'));
        }
        mThis.loadFormDetails(mThis.elBody, options,() => {
            mThis.modal.show();
        });
    }

  }
