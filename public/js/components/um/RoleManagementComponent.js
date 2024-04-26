'use strict';
var RoleManagementComponent = new function(){
    const mThis = this;
    this.title_prop = 'Role Management';
    this.base_url = main_view.base_url;
    this.self = main_view.appContent.children('#_um_roleManagementComponent');
    this.tblRoles_body = this.self[0].querySelector('div#_um_rolelist');    
    this.tblCard_body = this.self[0].querySelector('div#_um_card');    
//  console.log(mThis.tblCard_body);
    this.lnkNewRole = this.self[0].querySelector('#_lnkNewRole');
    this.elSearch = this.self[0].querySelector('#_search_role');
    this.btnPrint = this.self[0].querySelector('#_cul_btnPrint');
    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
    console.log(mThis.tblRoles_body);

    this.renderRoleCards = (data, container = null) => {
        console.log(data);
        let html = '';
        let cnt = 0;
        container = container || mThis.tblRoles_body;
       console.log('html',container);
        
        (data || []).map(item => { 
            html = [ html,`<div data-roleid="${item.id}" data-role data-rolecreatedate="${item.create_date}" data-rolecreateuser="${item.create_user}" data-roleuserclass="${item.user_class}" data-rolename="${item.name}" class="col-sm-2 lnk_card">
            <div class="card bg-white shadow p-2 border rounded-3 d-flex flex-column justify-content-between" data-roleid="${item.id}" style="height:20vh;min-width:120px;">
               <div class="d-flex flex-column justify-content-center align-items-center p-2">
                  <span class="data-input text-success text-center" style="font-size:1em" data-field="user_class">${item.name}</span>
                  <span class="role_name_title mt-2">
                    ${item.name.charAt(0).toUpperCase()} 
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: ${item.user_count}</span>

                <div class="border-top border-1">
                 <span class="text-muted p-1">${item.user_class}</span>
                </div>
            </div>
           
         </div>`].join('');

        });
        container.innerHTML = html;
   

    }

    this.displayCards = (item, container) => {
        let html = '';
        let cnt = 0;
        console.log(item);
        container = container || mThis.tblRoles_body;

            html += [ html,`
            <div class="col-6 border border-1 rounded-5 border-secondary  p-3 ">
                <div  class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted"> Role name     : </span>
                    <span class="fw-sembold">${item.rolename}</span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted"> User Class    : </span>
                    <span class="fw-sembold">${item.roleuserclass}</span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted"> Create Date    : </span>
                    <span class="fw-sembold">${item.rolecreatedate}</span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted"> Created By     : </span>
                    <span class="fw-sembold">${item.rolecreateuser}</span>
                </div>

                <div class="d-flex flex-row gap-2 justify-content-start mt-2">
                    <button class="btn btn-sm btn-primary rounded-4 ml-3"><span class="trans-text" data-langprop="buttons.Edit">Edit</span></button>
                    <button class="btn btn-sm btn-warning text-white rounded-4 ml-3"><span class="trans-text" data-langprop="buttons.Lock">Lock</span></button>
                    <button class="btn btn-sm btn-danger rounded-4 ml-3"><span class="trans-text" data-langprop="buttons.Delete">Delete</span></button>
                </div>
            </div>
            <div class=" col-6 border border-1 rounded-5 border-secondary p-3 ">
                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted">Members : </span>
                    <span class="fw-sembold">${item.user_count} </span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted">Applications and Modules : </span>
                    <span class="fw-sembold">20 </span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted">Permissions : </span>
                    <span class="fw-sembold">110 </span>
                </div>

                <div class="d-flex flex-row justify-content-between p-2">
                    <span class="fw-sembold text-muted">Reports : </span>
                    <span class="fw-sembold">30 </span>
                </div>

                <div class="d-flex flex-row gap-2 justify-content-start mt-2">
                    <button class="btn btn-sm btn-primary ml-3 rounded-4"><span class="trans-text" data-langprop="buttons.Authorization">Authorization</span></button>
                </div>

            </div>
        

       
       `].join('');
       
    //    console.log('html',html);

        container.innerHTML = html;
   

    }


    this.loadRoles = (filter, onFinish)=>{
        vsapi.call(`${main_view.base_url}/api/role/list`,filter,null,false).then(res =>{
           const roles = res.status_code ==200? res.data : [];
           onFinish(roles); 
        });
       
    }

    this.init = () => {
        if(mThis.initAlready) return;
        
        mThis.lnkNewRole.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                'id': null,
                'onclose':(d)=>{
                    mThis.loadRoles(mThis.getFilterData(), roles =>{
                        this.renderRoleCards(roles);
                    }); 
                }
            }
            RoleDialog.show(op);
        });

        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.loadRoles(mThis.getFilterData(), roles =>{
                    this.renderRoleCards(roles);
                });
            }
        });

        mThis.elSearch.addEventListener('keyup',e =>{
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                mThis.loadRoles(mThis.getFilterData(), roles =>{
                    this.renderRoleCards(roles);
                });

            },250);
        });     
          
        mThis.initAlready = true;
    }
    this.setEvent = () => {
        const cardList = mThis.tblRoles_body.querySelectorAll('div.lnk_card');
        const card1 = mThis.tblCard_body.querySelectorAll('div#card1');
        console.log(card1[0]);
        cardList.forEach(card => {
            card.onclick = function(e){
                e.preventDefault();
                // if(!(e.target.classList.contains('btn_role_action') || e.target.parentElement.classList.contains('btn_role_action'))){
                    let role_id = this.dataset.roleid;
                    console.log(role_id);


                    mThis.selected_role_name = this.dataset.rolename;
                    // console.log('name',selected_role_name);
                    mThis.selected_role_id = role_id;
                    if(mThis.prev_selected_role_row) mThis.prev_selected_role_row.classList.remove('row-selected');
                    this.classList.toggle('row-selected');
                    if(this.classList.contains('row-selected')) mThis.prev_selected_role_row = this;
                    let p = {
                        roleid:this.dataset.roleid,
                        rolename:this.dataset.rolename,
                        roleuserclass:this.dataset.roleuserclass,
                        rolecreateuser:this.dataset.rolecreateuser,
                        rolecreatedate:this.dataset.rolecreatedate

                    
                    };
                    mThis.displayCards(p,card1[0]);
                    // RoleDialog.show();
                // }
            }
        });

        cardList.forEach(card => {
            card.onmouseover = function(e){
                e.preventDefault();
                // let td_action = this.querySelector('td.col_action');
                // td_action.querySelector('a').style.display = 'block';
            }

            card.onmouseleave = function(e){
                e.preventDefault();
                // let td_action = this.querySelector('td.col_action');
                // td_action.querySelector('a').style.display = 'none';
                // let btn_class_action = td_action.querySelector('a.dropdown-item');
                // if(btn_class_action){
                //     btn_class_action.style.display = 'none';
                //     btn_class_action.closest('.dropdown-menu').classList.remove('show');
                // }
            }
        });

        const btnRoleList = mThis.tblRoles_body.querySelectorAll('a.btn_role_action');
        btnRoleList.forEach(btn => {
            btn.onclick = function(e){
                console.log(e);
                e.preventDefault();
                let p = this.parentElement;
                let role_id = this.dataset.roleid,
                role_name = this.dataset.rolename;

                let dropdownMenu = p.querySelector('.dropdown-menu');
                if(!dropdownMenu){
                    p.innerHTML += mThis.createDropdownMenuHtml_role(role_id, role_name);
                    dropdownMenu = p.querySelector('.dropdown-menu');
                }
                if(mThis.prev_dropdownMenu) mThis.prev_dropdownMenu.classList.remove('show');

                dropdownMenu.classList.toggle('show');
                dropdownMenu.style.top = e.clientY+'px';
                dropdownMenu.style.left = e.clientX+'px';

                if(dropdownMenu.classList.contains('show')) mThis.prev_dropdownMenu = dropdownMenu;
                e.stopImmediatePropagation();

                const btnDelete = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_delete');
                btnDelete.onclick = function(e){
                    e.preventDefault();
                    let role_id = this.parentElement.dataset.roleid;
                    cv_interact.confirm('Delete this role?', {
                        title: 'Delete Role',
                        context: 'delete'
                    },(e) => {
                        if(e){
                            mThis.deleteRole(role_id);
                        }
                    });
                    e.stopImmediatePropagation();
                };

                const btnModify = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_modify');
                btnModify.onclick = function(e){
                    e.preventDefault();
                    let role_id = this.parentElement.dataset.roleid;
                    EditRolePanel.show({
                        title: "Renaming existing role",
                        role_id: role_id
                    });
                    e.stopImmediatePropagation();
                };

                const btnAddMember = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_add_member');
                btnAddMember.onclick = function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    let role_id = this.parentElement.dataset.roleid;
                    let role = {
                        id: role_id,
                        name: RoleManagementComponent.selected_role_name
                    };
                    mThis.addRoleMember(role, function(new_user_count){
                        if(new_user_count){
                            mThis.updateSelectRole('col_user_count', new_user_count);
                            RoleTabView.show(role_id, 'users');
                        }
                    });
                };

                const btnAddModule = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_add_module');
                btnAddModule.onclick = function(e){
                    e.preventDefault();
                    let role_id = this.parentElement.dataset.roleid;
                    mThis.addAccessibleModule(role_id, function(e){
                        if(e){
                            RoleTabView.show(role_id, 'modules');
                        }
                    });
                    e.stopImmediatePropagation();
                };

                const btnPrns = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_role_prns');
                btnPrns.onclick = function(e){
                    e.preventDefault();
                    RoleManagementComponent.self.querySelector('#_um_roleprn_lnk_add').dispatchEvent(new Event('click'));
                    e.stopImmediatePropagation();
                };
            }
        });
    }
    this.getFilterData = ()=>{
        let p = {};
       
       p.search_value = mThis.elSearch.value;
       return p; 
    }
    this.addRoleMember = function(role = {}, onFinish = null){
        let role_id = role.id;
        let p = {};
        p.role_id = 0;

        vsapi.call(`${main_view.base_url}/api/getComboItems_user`,p).then(res => {
            if(res.status_code === 200){
                let rows = res.data;
                let option = {};
                option.title = `Add user to ${role.name} role`;
                option.data = StringSanitizer.sanitizeObject(rows, ['(', ')', '@', '.', '-'], ['login_name']);
                option.valueMember = "id";
                option.textMember = "login_name";
                option.dataLabel = "Select User";
                option.blankErrorMessage = "Choose a user login";

                InputBox2.show(option,function(d){
                    if(d){
                        let p = {};
                        p.role_id = role_id;
                        p.user_id = d.value;
                        vsapi.call(`${main_view.base_url}/api/addRoleMember`,p).then(res => {
                            if(res.status_code === 200){
                                let d = res.data;
                                onFinish(d.user_count);
                            }
                            else
                                cv_interact.error(res.error_message);
                        });
                    }
                });
            }
            else
                cv_interact.error(res.error_message);
        });
    }
    this.addAccessibleModule = function (role_id, onFinish) {
        vsapi.call(`${main_view.base_url}/api/getComboItems_module`,null).then(res => {
            if(res.status_code === 200){
                let rows = StringSanitizer.sanitizeObject(res.data);
                let option = {};
                option.title = "Choose Module";
                option.dataLabel = "Select Module";
                rows.unshift({
                    id: null,
                    name: '(Select Application Module)'
                });
                option.data = rows;
                option.valueMember = "id";
                option.textMember = "name";
                option.btnOKText = "Add Now";
                option.defaultValue = null;
                option.blankErrorMessage = 'Please choose a module';
                InputBox2.show(option,function(d){
                    if(d){
                        let p = {};
                        p.role_id = role_id;
                        p.module_id = d.value;
                        vsapi.call(`${main_view.base_url}/api/addAccessibleModule`,p).then(res => {
                            if(res.status_code === 200){
                                onFinish(true);
                            }
                            else
                                cv_interact.error(res.error_message);
                        });
                    }
                });
            }
        });
    }
  
    this.show = (options)=>{
        mThis.init();
        mThis.selected_role_id = null;
        mThis.selected_role_name = null;
        if(!options) options={};
        main_view.setTitle(mThis.title_prop);
         
        main_view.setTitle(mThis.title_prop);

        mThis.loadRoles(this.getFilterData(), roles =>{
            mThis.renderRoleCards(roles,null);
            mThis.setEvent();

        });

        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
    }
    this.updateSelectRole = function(col_name, data){
        let selected_class_name = 'row-selected';
        mThis.tblRoles_body.querySelector(`tr.${selected_class_name}>td.${col_name}`).innerHTML = data;
    }

};

const RoleDialog = new function(){
        const mThis = this;
        this.self = main_view.appContent.find('#roleDialog');
        this.base_url = main_view.base_url;
        this.options = {};
        
        this.elTitle = this.self.find('#_role_dlgTitle');
        this.btnSave =  this.self.find('#_role_dlg_btnOK');
       
        this.elUserClass = this.self.find('#user_class') ;
        this.onClose = null;
        this.body =  this.self.find('.modal-body')[0];
        this.div_role_info =  this.body.querySelector('#_role_dlg_body');
      
        
        // this.body = this.self.find('.modal-body')[0];
      
        this.prepareData = (def, onFinish) => {
            if(!def) def = {};
            if(mThis.user_classes){
                VSUtil.setComboItems(mThis.elUserClass, mThis.user_classes, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
                if(typeof onFinish == 'function') onFinish();
                return;
            }
    
            vsapi.call(`${main_view.base_url}/api/user/options-user-class`, null).then(res => {
                if(res.status_code === 200){
                    let rows = StringSanitizer.sanitizeObject(res.data);
                    VSUtil.setComboItems(mThis.elUserClass, rows, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
                    mThis.user_classes = rows;
                    if(typeof onFinish == 'function') onFinish();
                }
            });
        }
        this.btnSave.on('click',function(e){
            e.preventDefault();
            let p = mThis.getData();
            vsapi.call(`${mThis.base_url}/api/role/save`,p).then(res =>{
                if(res.status_code === 200){
                    mThis.self.modal('hide');
                    if(typeof mThis.options.onclose === ' function') mThis.options.onclose(p);
                }else
                    cv_interact.error(res.error_message);
                
            });
        });

    this.setData = (d) =>{
        d = d || {};
        //console.log(d);
        mThis.div_role_info.querySelectorAll(' .data-input').forEach(el =>{
            const data_member = el.dataset.field;
            //console.log(data_member);
            if(el.tagName.toLowerCase() === 'select'){

                el.value = d[data_member];
                let event = new Event('change',{
                    bubbles: true,
                    cancelable: true
                });
                el.dispatchEvent(event);
            }
            else{
                el.value = d[data_member]?? '';
            }
        });
    }
    
    this.getData = () => {
        let p = {};
        p.id = mThis.options;
        mThis.self[0].querySelectorAll('.data-input').forEach(el=>{
            let f = el.dataset.field;
            
            p [f] = el.value;
        });
        
        
        return p;
    }

    this.show = (options)=>{
        if (!options) options = {};
        mThis.options = options;
        mThis.prepareData(mThis.options,()=>{
            mThis.setData();
            mThis.self.modal({
                backdrop: 'static'
        });
        });
      
}
}

// const RoleTabView = new function(){
//     const mThis = this;
//     this.self = RoleManagementComponent.self[0].querySelector('#_um_roleTabView');
//     this.tabHeader = mThis.self.querySelector('div.tab-header');
//     this.cur_view = 'users';

//     let previousTabButton = null;
//     const tabButtonList = mThis.tabHeader.querySelectorAll('a.tab-button');
//     // console.log('tabButtonList',tabButtonList);
//     tabButtonList.forEach(el => {
//         el.onclick = function(e){
//             e.preventDefault();
//             if(previousTabButton) previousTabButton.classList.remove('active');
//             this.classList.add('active');
//             previousTabButton = this;
//             const view_name = this.dataset.viewname.toLowerCase();
//             mThis.show(mThis.role_id, view_name);
//         }
//     });

//     let previousTabPanel = null;
//     this.show = function(role_id, view_name){
//         mThis.role_id = role_id;
//         if(!view_name) view_name = mThis.cur_view;
//         view_name = (view_name + '').toLowerCase();

//         mThis.self.querySelectorAll('div.tab-body > div.tab-panel').forEach(el => {
//             let this_view_name = (el.dataset.viewname + '').toLowerCase();
//             if(view_name == this_view_name){
//                 mThis.cur_view = view_name;
//                 if(previousTabPanel) previousTabPanel.style.display = 'none';
//                 el.style.display = 'block';
//                 previousTabPanel = el;
//             if(view_name == 'users'){
//                 mThis.displayRoleMembers(mThis.role_id);
//             }
//                 else if(view_name == 'applications'){
//                     mThis.displayApplication(mThis.role_id);
//                 }
//                 else if(view_name === 'permissions'){
//                     mThis.displayRolePermissions(mThis.role_id);
//                 }
//                 else if(view_name == 'reports'){
//                     mThis.displayAccessibleModules(mThis.role_id);
//                 }
//                 return;
//             }
//         });
//         if(!previousTabButton) tabButtonList[0].dispatchEvent(new Event('click'));
//     }

//     const div = RoleManagementComponent.self[0];
//     this.tblPrns1 = div.querySelector('#_um_roleprn_tblPrns');
//     this.tblPerns1_body = div.querySelector('#_um_roleprn_tblPrns_body');
//     this.tblApplications = div.querySelector('#_um_tblRoleApplications');
//     this.tblApplications_body = div.querySelector('#_um_tblRoleApplication_body');
//     this.lnkAddApplication = div.querySelector('#_um_lnkAddApplication');
//     this.tblModules = div.querySelector('#_um_tblRoleModules');
//     this.tblModules_body = div.querySelector('#_um_tblRoleModules_body');
//     this.lnkAddModule = div.querySelector('#_um_lnkAddModule');
//     this.lnkAddRoleMember = div.querySelector('#_um_lnkAddRemMember');
//     //if(!RoleManagementComponent.allow_add_remove_users) mThis.lnkAddRoleMember.style.display = 'none';
//     this.lnk_roleprn_add = div.querySelector('#_um_roleprn_lnk_add');
//     this.lnk_roleprn_largeview = div.querySelector('#_um_roleprn_lnkLargeView');

//     this.cols = [
//         {
//             title: "Official ID",
//             className: "text-capitalize align-middle",
//             data: (user, a, b) => {
//                 return user.official_code ? user.official_code : 'None';
//             }
//         },
//         {
//             title: 'Login name',
//             className: "text-capitalize align-middle",
//             data: (item, a, b) => {
//                 return item.login_name.replace(/\s/g,'');
//             }
//         },
//         {
//             title: 'Full Name',
//             className: "text-capitalize align-middle",
//             data: (user, a, b) => {
//                 return user.full_name ? user.full_name : 'Unspecified';
//             }
//         },
//         {
//             title: "Status",
//             className: 'align-middle text-capitalize',
//             data: (data, a, b) => {
//               const status = (data.status || '').toLowerCase()==='active'? 'border-success text-success text-center': 'border-danger text-danger text-center';  
//               return ['<a href="javascript:void(0)" class="d-block lnk-agent-status" data-id ="data.id" data-status="data.status"><span style="display:block;width:80px;" class="border rounded-5 p-2 ',status,'">',(data.status),'</span></a>'].join('');
//             }
//         },
       
//         {
//             title: "Action",
//             className: "text-capitalize align-middle",
//             data: function (item, a, b) {
//                 return `<div class="d-flex gap-2">
//                     <a href="javascript:void(0)" class="btn-role-user-modify" data-loginname="${item.login_name}" data-id="${item.id}" data-rolename="${item.role_name}">
//                         <i class="fa fa-edit text-warning fs-5"></i>
//                     </a>
//                     <a href="javascript:void(0)" data-id="${item.id}" data-rolename="${item.role_name}" class="btn-role-user-remove">
//                         <i class="fa-regular fa-circle-xmark text-danger fs-5"></i>
//                     </a>
//                     <a href="javascript:void(0)" data-id="${item.id}" data-rolename="${item.role_name}" class="btn-role-user-delete">
//                         <i class="fa-regular fa-trash-can text-danger fs-5"></i>
//                     </a>
//                 </div>`;
//             }
//         }
//     ];

//     this.roleMemberListView = new ListView('_div_role_members',{
//         fetchApi: `${main_view.base_url}/api/role/members/list`,
//         clientSidePagination:true,
//         perPage: 10,
//         columns: mThis.cols,
//         rowCreated: (data, index, tr) => {
//            tr.dataset.id = data.id;
//         },
//         listContainerClass: null,
//         renderComplete: function(){
//             mThis.setEventRole();
//         }
//     });
//     mThis.tblRoleMember = mThis.roleMemberListView.getTable();

//     this.setEventRole = () => {
//         const btnRoleRemoveList = mThis.tblRoleMember.querySelectorAll('.btn-role-user-remove');
//         if(btnRoleRemoveList[0]){
//             btnRoleRemoveList.forEach(btn => {
//                 btn.onclick = function(e){
//                     let id = e.target.dataset.id;
//                     let role_name = e.target.dataset.rolename || e.target.parentElement.dataset.rolename;
//                     let role_id = RoleManagementComponent.selected_role_id;
        
//                     cv_interact.confirm(`Remove this user from ${role_name} role?`,{
//                         title: 'Unenroll User',
//                         confirmButtonText: 'Remove',
//                         cancelButtonText: 'Close'
//                     },function(e){
//                         if(e){
//                             let p = {
//                                 user_id: id,
//                                 role_id: role_id
//                             };
//                             vsapi.call(`${mThis.base_url}/api/role//members/remove`, p).then(res => {
//                                 if(res.status_code === 200)
//                                     mThis.displayRoleMembers(role_id);
//                                 else
//                                     cv_interact.error(res.error_message);
//                             });
//                         }
//                     });
//                 };
//             });
//         }

//         const btnRoleModifyList = mThis.tblRoleMember.querySelectorAll('.btn-role-user-modify');
//         if(btnRoleModifyList[0]){
//             btnRoleModifyList.forEach(btn => {
//                 btn.onclick = function(e){
//                     e.preventDefault();
//                     let role_id = RoleManagementComponent.selected_role_id;

//                     let login_name = e.target.dataset.loginname || e.target.parentElement.dataset.loginname;
//                     let option = {
//                         blankErrorMessage: 'Login name cannot be blank',
//                         btnOKText: 'Commit Change',
//                         defaultValue: login_name,
//                         title: 'Change Login Name',
//                         dataLabel: 'New login name'
//                     };

//                     InputBox1.show(option,function(d){
//                         if(d){
//                             if(d !== login_name){
//                                 let p = {};
//                                 p.login_name = login_name;
//                                 p.new_login_name = d;
//                                 vsapi.call(`${mThis.base_url}/api/changeLoginName`,p).then(res => {
//                                     if(res.status_code === 200){
//                                         mThis.displayRoleMembers(role_id);
//                                     }
//                                     else
//                                         cv_interact.error(res.error_message);
//                                 });
//                             }
//                         }
//                     });
//                 }
//             });
//         }

//         const btnRoleDeleteList = mThis.tblRoleMember.querySelectorAll('.btn-role-user-delete');
//         if(btnRoleDeleteList[0]){
//             btnRoleDeleteList.forEach(btn => {
//                 btn.onclick = function(e){
//                     e.preventDefault();
//                     let id = e.currentTarget.dataset.id;
//                     let role_name = e.target.dataset.rolename || e.target.parentElement.dataset.rolename;
//                     let role_id = RoleManagementComponent.selected_role_id;

//                     cv_interact.confirm(`Delete this user from ${role_name} permanently?`,{
//                         title: 'Delete User',
//                         context: 'delete'
//                     },function(e){
//                         if(e){
//                             let p = {
//                                 user_id: id
//                             };
//                             vsapi.call(`${mThis.base_url}/api/deleteUser`,p).then(res => {
//                                 if(res.error_message)
//                                     cv_interact.error(error_message);
//                                 else
//                                     mThis.displayRoleMembers(role_id);
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     }

//     mThis.lnk_roleprn_add.onclick = function(e){
//         e.preventDefault();
//         if(!RoleManagementComponent.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }

//         let role_id = RoleManagementComponent.selected_role_id;
//         let role = {
//             role_id: role_id,
//             role_name: RoleManagementComponent.selected_role_name
//         };
//         AddPermissionDialog.show(role,function(e){
//             if(e){
//                 mThis.displayRolePermissions(role_id);
//             }
//         });
//     };

//     if(mThis.lnk_roleprn_largeview){
//         mThis.lnk_roleprn_largeview.onclick = function(e){
//             e.preventDefault();
//             if(!RoleManagementComponent.selected_role_id){
//                 cv_interact.error('No role selected!');
//                 return;
//             }
//             let option = {
//                 title: 'Role Permissions',
//                 role_id: RoleManagementComponent.selected_role_id,
//                 role_name: RoleManagementComponent.selected_role_name
//             };
    
//             PermissionList.show(option)
//         };
//     }

//     mThis.lnkAddModule.onclick = function(e){
//         e.preventDefault();
//         if(!RoleManagementComponent.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }
//         RoleManagementComponent.addAccessibleModule(mThis.role_id,function(e){
//             if(e){
//                 mThis.displayAccessibleModules(mThis.role_id);
//             }
//         });
//     };

//     mThis.lnkAddApplication.onclick = function(e){
//         e.preventDefault();
//         if(!RoleManagementComponent.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }
//         RoleManagementComponent.addAccessibleModule(mThis.role_id,function(e){
//             if(e){
//                 mThis.displayAccessibleModules(mThis.role_id);
//             }
//         });
//     };

//     mThis.lnkAddRoleMember.onclick = function(e){
//         e.preventDefault();
//         if(!RoleManagementComponent.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }

//         let role = {
//             id: mThis.role_id,
//             name: RoleManagementComponent.selected_role_name
//         };
//         RoleManagementComponent.addRoleMember(role,function(new_user_count){
//             if(new_user_count){
//                 RoleManagementComponent.updateSelectRole('col_user_count', new_user_count);
//                 mThis.displayRoleMembers(mThis.role_id);
//             }
//         });
//     };

//     this.setEventModules = () => {
//         const btnModuleRemoveList = mThis.tblModules_body.querySelectorAll('a._um_ma_remove');
//         if(btnModuleRemoveList[0]){
//             btnModuleRemoveList.forEach(btn => {
//                 btn.onclick = function(e){
//                     e.preventDefault();
//                     let p = {};
//                     p.module_id = this.dataset.moduleid;
//                     p.role_id = mThis.role_id;
//                     cv_interact.confirm('Remove this Accessible Module',{
//                         title: 'Remove Access Module',
//                         context: 'delete'
//                     },function(e){
//                         if(e){
//                             vsapi.call(`${main_view.base_url}/api/role/access-module/remove`, p).then(res => {
//                                 if(res.status_code === 200){
//                                     mThis.displayAccessibleModules(mThis.role_id);
//                                 }
//                                 else
//                                     cv_interact.error(res.error_message);
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     }

//     mThis.tblPerns1_body.onmouseover = function(){
//         console.log('tr');
//         this.querySelector('td.col_action').querySelector('a._um_roleprn_delete').style.display = 'block';
//     }.onmouseleave = function(){
//         console.log('tr');
//         this.querySelector('td.col_action').querySelector('a._um_roleprn_delete').style.display = 'none';
//     };

//     mThis.tblPerns1_body.onclick = function(e){
//         e.preventDefault();
//         console.log('a._um_roleprn_delete');
//         let ids = this.dataset.prnid;
//         cv_interact.confirm('Remove this permission?',{
//             title: 'Remove Permission',
//             context: "delete"
//         },function(e){
//             if(e){
//                 let p = {
//                     role_id: mThis.role_id,
//                     ids: ids
//                 };
//                 vsapi.call(`${main_view.base_url}/api/removePermissionFromRole`,p).then(res => {
//                     if(res.status_code === 200){
//                         mThis.displayRolePermissions(mThis.role_id);
//                     }
//                     else
//                         cv_interact.error(res.error_message);
//                 });
//             }
//         });
//     };

//     // const btnRmRemove = mThis.tblRoleMember.querySelector('a._um_rm_remove');
//     // btnRmRemove.onclick = function(e){
//     //     e.preventDefault();
//     //     let p = {};
//     //     p.user_id = $(this).data('userid');
//     //     p.role_id = mThis.role_id;
//     //     cv_interact.confirm('Remove this user from the selected role?',{
//     //         title: 'Remove User',
//     //         context: 'delete'
//     //     },function(e){
//     //         if(e){
//     //             vsapi.call(`${mThis.base_url}/api/removeRoleMember`,p).then(res => {
//     //                 if(res.status_code === 200){
//     //                     let d = res.data;
//     //                     mThis.displayRoleMembers(mThis.role_id);
//     //                     let col_name = 'col_user_count';
//     //                     RoleListPanel.updateSelectRole(col_name, d.user_count);
//     //                 }
//     //                 else
//     //                     cv_interact.error(res.error_message);
//     //             });
//     //         }
//     //     });
//     // }

//     // this.tblRoleMembers_body.on('mouseover', 'tr',function(e){
//     //     $(this).find('td.col_action').find('a._um_rm_remove').show();
//     // }).on('mouseleave', 'tr', function(e){
//     //     $(this).find('td.col_action').find('a._um_rm_remove').hide();
//     // });

//     // this.displayApplication = function(role_id){
//     //     let p = {};
//     //     p.role_id = role_id ? role_id : 0;
//     //     mThis.tblApplications_body.innerHTML = '';
//     //     let role_name = RoleManagementComponent.selected_role_name;
//     //     if(!role_name) role_name = "All";
//     //     RoleManagementComponent.self[0].querySelector('#_um_roletab_application_text').textContent = `${role_name} Application`;

//     //     vsapi.call(`${main_view.base_url}/api/role/access-module/list-all`,p).then(res => {
//     //         if(res.status_code === 200){
//     //             let rows = StringSanitizer.sanitizeObject(res.data);
//     //             let i = 0, c;
//     //             do{
//     //                 c = rows[i];
//     //                 if(!c) break;
//     //                 let html = `<tr data-moduleid="${c.id}">
//     //                     <td style="width:50px !important">
//     //                         <i class="icon-module-default"></i>
//     //                     </td>
//     //                     <td>${c.name}</td>
//     //                     <td class="col_action">
//     //                         <a href="javascript:void(0)" class="_um_ma_remove" data-moduleid="${c.id}">
//     //                             <i class="fa fa-times text-danger"></i>
//     //                         </a>
//     //                     </td>
//     //                 </tr>`;
//     //                 mThis.tblApplications_body.innerHTML += html;
//     //                 i++;
//     //             }while(c);
//     //             mThis.setEventModules();
//     //         }
//     //     });
//     // }

//     this.displayRoleMembers = function(role_id){
//         let p = {};
//         p.role_id = role_id;
//         // p.search_value = RoleListPanel.elSearchUser.value;
//         RoleManagementComponent.self[0].querySelector('#_um_roletab_users_text').textContent = `Members of ${RoleManagementComponent.selected_role_name} role`;
//         console.log(RoleManagementComponent);
//         mThis.roleMemberListView.showPage(p);  
//     }
//     this.addPermissionsToRole = (prn_ids, role_id, onFinish) => {
//         let p = {
//             role_id: role_id,
//             ids: prn_ids
//         };
//         vsapi.call(`${main_view.base_url}/api/addPermissionToRole`, p).then(res => {
//             let d = {};
//             if(res.status_code === 200) d = res.data ? res.data : {};
//             if(d.success_count > d.fail_count){
//                 if (typeof onFinish === 'function') onFinish();
//             }
//             if(d.fail_count > 0){
//                 let i = 0, c, html = '';
//                 do{
//                     c = d.errors[i];
//                     if(!c) break;
//                     if(c) html += `<li>${StringSanitizer.sanitizeOut(c)}<li>`;
//                     i++;
//                 }while (c);

//                 Swal.fire({
//                     title: '',
//                     icon: 'error',
//                     html: `<ul>${html}</ul>`,
//                     showCancelButton: true
//                 });
//             }
//         });
//     }
//     this.displayRolePermissions = function(role_id){
//         let p = {
//             role_id: role_id
//         };
//         vsapi.call(`${main_view.base_url}/api/getPermissionsByRole`, p).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 let i = 0, c;
//                 mThis.tblPerns1_body.innerHTML = '';
//                 do{
//                     c = rows[i];
//                     if(!c) break;
//                     let html = `<tr data-prnid="${c.id}">
//                         <td class"col_permission_id" style="width:25%">${c.id}</td>
//                         <td style="width:50%">${c.name}</td>
//                         <td class="col_action">
//                             <a data-prnid="${c.id}" href="javascript:void(0)" class="_um_roleprn_delete btn btn-sm btn-outline-secondary" style="display:none">
//                                 <span class="trans-text" data-langprop="buttons.Remove">Remove</span>
//                             </a>
//                         </td>
//                     <tr>`;
//                     mThis.tblPerns1_body.insertAdjacentElement('afterend',html);
//                     i++;
//                 }while(c);
//                 const permissionElement = mThis.tblPerns1_body.querySelector('td.col_permission_id');
//                 if(permissionElement)
//                     permissionElement.style.width = '70px';
//             }
//         });
//     }
// }
    
