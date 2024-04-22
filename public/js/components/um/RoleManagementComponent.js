'use strict';
var RoleManagementComponent = new function(){
    const mThis = this;
    this.base_url = main_view.base_url;
    this.title_prop = 'Role Management';
    this.self = main_view.appContent.children('#_um_roleManagementComponent')[0];
    this.onClose = null;

    // this.allow_add_remove_users = true;
    // this.allow_add_remove_role = true;

    this.renderCard = (container, data) => {
        let html = '';
        let cnt = 0;
        // container.style.display = 'none';
        // mThis.store_senders = {};
        (data || []).map(item => {
            html += ` <div class="col-sm-2 box">
            <div class="card bg-white shadow p-3 border rounded-3 m-3">
              <div class="d-flex flex-column justify-content-center flex-wrap align-items-center p-2">
                <span class="data-input text-success fs-5 fw-semibold" data-field="user_class">Customer</span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >User Class: Admin</span>
                <span class=" role_name_title"> 
                  <script>
                    document.write("Customer".charAt(0).toUpperCase());
                  </script>
                </span>
              </div>
                <span class="pg-alert-card-line" style="width:100%"></span>
                <span class="data-input text-muted p-1" style="font-size:0.8em" >Total Member: 31</span>
            </div> 
        </div> 
            
            
      
              
        
            
            `
        });
        container.innerHTML = html;
    }
    this.init = () => {
        if(mThis.initAlready) return;
        let div = document.getElementById('_um_roleListPanel');
        console.log(div);
        mThis.userListView = new ListView('_um_roleListPanel',{
            fetchApi: `${main_view.base_url}/api/role/list`,
            perPage: 5,
            display:'card',
            clientSidePagination:true,
            //agpinationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                console.log(items); 
                mThis.renderCard(list_container,items);
            },
            listContainerClass: null
        });
        mThis.initAlready = true;
    }
    this.show = function(options = {}){
        mThis.init();
        if(options){
            if(options.title) mThis.title = options.title;
            mThis.onClose = options.onClose;
        }
        main_view.setTitle(mThis.title_prop);
        mThis.userListView.showPage(null,null,() => {
            
        });
        $(mThis.self).siblings().hide();

            $(mThis.self).fadeIn(200);
        // $(mThis.self).siblings().hide();
        // // RoleListPanel.show();
        // $(mThis.self).fadeIn(200);
    };

    // this.hide = function(){
    //     $(mThis.self).hide();
    // };
};

// const RoleListPanel = new function(){
//     const mThis = this;
//     this.self = RoleManagementComponent.self.querySelector('#_um_roleListPanel');
//     this.btnClose = mThis.self.querySelector('#_um_btnCloseRoleList');
//     this.lnkNewRole = mThis.self.querySelector('#_um_lnkNewRole');
//     this.elSearchUser = mThis.self.querySelector('#_um_search_user_role');
//     if(!RoleManagementComponent.allow_add_remove_role) mThis.lnkNewRole.style.display = 'none';
//     this.tblRoles = mThis.self.querySelector('#_um_tblRoles');
//     this.tblRoles_body = mThis.self.querySelector('#_um_tblRoles_body');

//     /** initOnce | init_roleList  **/
//     this.init = () => {
//         if(mThis.initAlready) return;

//         mThis.elSearchUser.onkeyup = function(e){
//             e.preventDefault();
//             setTimeout(() => {
//                 mThis.displayRoleList();
//             }, 200);
//         };

//         mThis.lnkNewRole.onclick = function(e){
//             e.preventDefault();
//             let onClose = function(e){}
//             EditRolePanel.show({
//                 title: "Creating a new role",
//                 role_id: null
//             }, onClose);
//         };

//         mThis.initAlready = true;
//     }

//     this.setEvent = () => {
//         const trList = mThis.tblRoles_body.querySelectorAll('tr');
//         trList.forEach(tr => {
//             tr.onclick = function(e){
//                 e.preventDefault();
//                 if(!(e.target.classList.contains('btn_role_action') || e.target.parentElement.classList.contains('btn_role_action'))){
//                     let role_id = this.dataset.roleid;
//                     mThis.selected_role_name = this.dataset.rolename;
//                     mThis.selected_role_id = role_id;
//                     if(mThis.prev_selected_role_row) mThis.prev_selected_role_row.classList.remove('row-selected');
//                     this.classList.toggle('row-selected');
//                     if(this.classList.contains('row-selected')) mThis.prev_selected_role_row = this;
//                     RoleTabView.show(role_id, null);
//                 }
//             }
//         });

//         trList.forEach(tr => {
//             tr.onmouseover = function(e){
//                 e.preventDefault();
//                 let td_action = this.querySelector('td.col_action');
//                 td_action.querySelector('a').style.display = 'block';
//             }

//             tr.onmouseleave = function(e){
//                 e.preventDefault();
//                 let td_action = this.querySelector('td.col_action');
//                 td_action.querySelector('a').style.display = 'none';
//                 let btn_class_action = td_action.querySelector('a.dropdown-item');
//                 if(btn_class_action){
//                     btn_class_action.style.display = 'none';
//                     btn_class_action.closest('.dropdown-menu').classList.remove('show');
//                 }
//             }
//         });

//         const btnRoleList = mThis.tblRoles_body.querySelectorAll('a.btn_role_action');
//         btnRoleList.forEach(btn => {
//             btn.onclick = function(e){
//                 console.log(e);
//                 e.preventDefault();
//                 let p = this.parentElement;
//                 let role_id = this.dataset.roleid,
//                 role_name = this.dataset.rolename;

//                 let dropdownMenu = p.querySelector('.dropdown-menu');
//                 if(!dropdownMenu){
//                     p.innerHTML += mThis.createDropdownMenuHtml_role(role_id, role_name);
//                     dropdownMenu = p.querySelector('.dropdown-menu');
//                 }
//                 if(mThis.prev_dropdownMenu) mThis.prev_dropdownMenu.classList.remove('show');

//                 dropdownMenu.classList.toggle('show');
//                 dropdownMenu.style.top = e.clientY+'px';
//                 dropdownMenu.style.left = e.clientX+'px';

//                 if(dropdownMenu.classList.contains('show')) mThis.prev_dropdownMenu = dropdownMenu;
//                 e.stopImmediatePropagation();

//                 const btnDelete = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_delete');
//                 btnDelete.onclick = function(e){
//                     e.preventDefault();
//                     let role_id = this.parentElement.dataset.roleid;
//                     cv_interact.confirm('Delete this role?', {
//                         title: 'Delete Role',
//                         context: 'delete'
//                     },(e) => {
//                         if(e){
//                             mThis.deleteRole(role_id);
//                         }
//                     });
//                     e.stopImmediatePropagation();
//                 };

//                 const btnModify = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_modify');
//                 btnModify.onclick = function(e){
//                     e.preventDefault();
//                     let role_id = this.parentElement.dataset.roleid;
//                     EditRolePanel.show({
//                         title: "Renaming existing role",
//                         role_id: role_id
//                     });
//                     e.stopImmediatePropagation();
//                 };

//                 const btnAddMember = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_add_member');
//                 btnAddMember.onclick = function(e){
//                     e.preventDefault();
//                     e.stopImmediatePropagation();
//                     let role_id = this.parentElement.dataset.roleid;
//                     let role = {
//                         id: role_id,
//                         name: RoleListPanel.selected_role_name
//                     };
//                     mThis.addRoleMember(role, function(new_user_count){
//                         if(new_user_count){
//                             mThis.updateSelectRole('col_user_count', new_user_count);
//                             RoleTabView.show(role_id, 'users');
//                         }
//                     });
//                 };

//                 const btnAddModule = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_add_module');
//                 btnAddModule.onclick = function(e){
//                     e.preventDefault();
//                     let role_id = this.parentElement.dataset.roleid;
//                     mThis.addAccessibleModule(role_id, function(e){
//                         if(e){
//                             RoleTabView.show(role_id, 'modules');
//                         }
//                     });
//                     e.stopImmediatePropagation();
//                 };

//                 const btnPrns = mThis.tblRoles_body.querySelector('tr > td.col_action a._um_ra_role_prns');
//                 btnPrns.onclick = function(e){
//                     e.preventDefault();
//                     RoleManagementComponent.self.querySelector('#_um_roleprn_lnk_add').dispatchEvent(new Event('click'));
//                     e.stopImmediatePropagation();
//                 };
//             }
//         });
//     }

//     this.createDropdownMenuHtml_role = function(role_id, role_name){
//         const html = `<div class="dropdown-menu bg-white shadow position-fixed /*top-left-unset*/" data-roleid="${role_id}" data-rolename="${role_name}">
//             <a class="dropdown-item _um_ra_delete" href="javascript:void(0)">
//                 <i class="fa fa-times text-danger pe-2"></i>
//                 <span>Delete Role</span>
//             </a>
//             <a class="dropdown-item _um_ra_modify" href="javascript:void(0)">
//                 <i class="fa fa-edit text-secondary pe-2"></i>
//                 <span>Modify Role</span>
//             </a>
//             <div class="dropdown-divider"></div>
//             <a class="dropdown-item _um_ra_add_member" href="javascript:void(0)">
//                 <i class="fa fa-user text-primary pe-2"></i>
//                 <span>Add Member<span>
//             </a>
//             <a class="dropdown-item _um_ra_add_module" href="javascript:void(0)">
//                 <i class="fa fa-list-alt text-secondary pe-2"></i>
//                 <span>Add Access Module</span>
//             </a>
//             <a class="dropdown-item _um_ra_role_prns" href="javascript:void(0)">
//                 <i class="fa fa-list-alt text-secondary pe-2"></i>
//                 <span>Manage Permissions</span>
//             </a>
//         </div>`;
//         return html;
//     }

//     this.addRoleMember = function(role = {}, onFinish = null){
//         let role_id = role.id;
//         let p = {};
//         p.role_id = 0;

//         vsapi.call(`${main_view.base_url}/api/getComboItems_user`,p).then(res => {
//             if(res.status_code === 200){
//                 let rows = res.data;
//                 let option = {};
//                 option.title = `Add user to ${role.name} role`;
//                 option.data = StringSanitizer.sanitizeObject(rows, ['(', ')', '@', '.', '-'], ['login_name']);
//                 option.valueMember = "id";
//                 option.textMember = "login_name";
//                 option.dataLabel = "Select User";
//                 option.blankErrorMessage = "Choose a user login";

//                 InputBox2.show(option,function(d){
//                     if(d){
//                         let p = {};
//                         p.role_id = role_id;
//                         p.user_id = d.value;
//                         vsapi.call(`${main_view.base_url}/api/addRoleMember`,p).then(res => {
//                             if(res.status_code === 200){
//                                 let d = res.data;
//                                 onFinish(d.user_count);
//                             }
//                             else
//                                 cv_interact.error(res.error_message);
//                         });
//                     }
//                 });
//             }
//             else
//                 cv_interact.error(res.error_message);
//         });
//     }

//     this.addAccessibleModule = function (role_id, onFinish) {
//         vsapi.call(`${main_view.base_url}/api/getComboItems_module`,null).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 let option = {};
//                 option.title = "Choose Module";
//                 option.dataLabel = "Select Module";
//                 rows.unshift({
//                     id: null,
//                     name: '(Select Application Module)'
//                 });
//                 option.data = rows;
//                 option.valueMember = "id";
//                 option.textMember = "name";
//                 option.btnOKText = "Add Now";
//                 option.defaultValue = null;
//                 option.blankErrorMessage = 'Please choose a module';
//                 InputBox2.show(option,function(d){
//                     if(d){
//                         let p = {};
//                         p.role_id = role_id;
//                         p.module_id = d.value;
//                         vsapi.call(`${main_view.base_url}/api/addAccessibleModule`,p).then(res => {
//                             if(res.status_code === 200){
//                                 onFinish(true);
//                             }
//                             else
//                                 cv_interact.error(res.error_message);
//                         });
//                     }
//                 });
//             }
//         });
//     }

//     this.show = function(options = {}){
//         mThis.init(); //init once or one time only
//         mThis.selected_role_id = null;
//         mThis.selected_role_name = null;

//         mThis.displayRoleList();
//         $(mThis.self).siblings().hide();
//         $(mThis.self).fadeIn(200);
//     }

//     this.displayRoleList = function(){
//         vsapi.call(`${main_view.base_url}/api/role/list`,{
//             search_value: mThis.elSearchUser.value
//         },main_view.apiCluster).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 mThis.tblRoles_body.innerHTML = '';
//                 let i = 0, c;
//                 do{
//                     c = rows[i];
//                     if(!c) break;
//                     if(!c.user_count) c.user_count = 0;

//                     let dropdown_container_html = `<div class="dropdown">
//                         <a href="javascript:void(0)" data-roleid="${c.id}" data-rolename="${c.name}" class="vs-btn-sm-outline-round btn_role_action" aria-haspopup="true" aria-expanded="false" style="display:none">
//                             <i class="fa fa-chevron-down text-danger fs-5"></i>
//                         </a>
//                     </div>`;

//                     let display_user_class = (c.user_class + '').replace(/\_/g,' ');
//                     let html = `<tr data-roleid="${c.id}" data-rolename="${c.name}">
//                         <td class="col_action" style="width:70px">${dropdown_container_html}</td>
//                         <td>
//                             <span class="fw-bold" style="font-size:1.1em">${c.name}</span>
//                             <div>
//                                 <span class="set-text-gray">User class: </span>
//                                 <span class="ps-2 fw-bold text-capitalize set-text-green">${display_user_class}</span>
//                             </div>
//                         </td>
//                         <td class="col_user_count">
//                             <span class="d-block" style="padding-top:15px">${c.user_count} members</span>
//                         </td>
//                     </tr>`;
//                     mThis.tblRoles_body.innerHTML += html;
//                     i++;
//                 }while(c);
                
//                 if(mThis.tblRoles_body.querySelector('._um_item_action_button')){
//                     mThis.tblRoles_body.querySelector('._um_item_action_button').style.display = 'none';
//                 }
//                 RoleTabView.show(0, 'users');
//                 mThis.setEvent();
//             }
//         });
//     };

//     this.updateSelectRole = function(col_name, data){
//         let selected_class_name = 'row-selected';
//         mThis.tblRoles_body.querySelector(`tr.${selected_class_name}>td.${col_name}`).innerHTML = data;
//     }

  

//     this.deleteRole = function(id){
//         let p = {};
//         p.role_id = id ? id : 0;
//         vsapi.call(`${main_view.base_url}/api/deleteRole`,p).then(res => {
//             if(res.status_code === 200){
//                 mThis.displayRoleList();
//             }
//             else
//                 cv_interact.error(re.error_message);
//         });
//     }
// };

// const EditRolePanel = new function(){
//     const mThis = this;
//     this.self = RoleManagementComponent.self.querySelector('#_um_edit_role');
//     this.lnkBackToRoleList = mThis.self.querySelector('#_um_role_backToRoleList');
//     this.btnBack = mThis.self.querySelector('#_um_btnBackToRoleList');
//     this.btnSave = mThis.self.querySelector('#_um_btnSaveRole');
//     this.elRoleName = mThis.self.querySelector('#_um_edit_role_name');
//     this.elUserClass = mThis.self.querySelector('#_um_edit_userclass');
//     this.elError = mThis.self.querySelector('#_um_edit_role_error');
//     this.elTitle = mThis.self.querySelector('#_um_edit_role_title');

//     mThis.lnkBackToRoleList.onclick = function(e){
//         e.preventDefault();
//         let options = {};
//         options.title = "Manage Roles";
//         RoleListPanel.show(options);
//     };

//     mThis.btnBack.onclick = function(e){
//         e.preventDefault();
//         mThis.lnkBackToRoleList.dispatchEvent(new Event('click'));
//     };

//     mThis.btnSave.onclick = function(e){
//         e.preventDefault();
//         mThis.elError.innerHTML = '';
//         let p = {};
//         p.id = mThis.role_id;
//         p.name = mThis.elRoleName.value;
//         p.user_class = mThis.elUserClass.value;
//         if(!p.id) p.id = 0;
//         if(!p.name) p.name = '';
//         if(!p.name){
//             mThis.elError.innerHTML = 'Role Name cannot be empty';
//             return;
//         }
//         vsapi.call(`${main_view.base_url}/api/role/save`, p).then(res => {
//             if(res.status_code === 200){
//                 mThis.lnkBackToRoleList.dispatchEvent(new Event('click'));
//             }
//             else
//                 mThis.elError.textContent = res.error_message;
//         });
//     };

//     this.prepareData = (def, onFinish) => {
//         if(!def) def = {};
//         if(mThis.user_classes){
//             VSUtil.setComboItems(mThis.elUserClass, mThis.user_classes, 'user_class', 'user_class', true, '(Select User Class)', def.user_class);
//             if(typeof onFinish == 'function') onFinish();
//             return;
//         }

//         vsapi.call(`${main_view.base_url}/api/user/options-user-class`, null).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 VSUtil.setComboItems(mThis.elUserClass, rows, 'user_class', 'user_class', true, '(Select User Class)', def.user_class);
//                 mThis.user_classes = rows;
//                 if(typeof onFinish == 'function') onFinish();
//             }
//         });
//     }

//     this.show = function(options, onClose){
//         mThis.elError.innerHTML = '';
//         mThis.onClose = onClose;
//         mThis.role_id = options.role_id;

//         mThis.prepareData(null, () => {
//             if(options.role_id > 0){
//                 mThis.displayRole(options.role_id);
//             }
//             mThis.elTitle.textContent = options.title;
//             $(mThis.self).show().siblings().hide();
//         });
//     }

//     this.displayRole = function () {
//         let p = {};
//         p.role_id = mThis.role_id;
//         vsapi.call(`${main_view.base_url}/api/getRoleById`, p).then(res => {
//             if(res.status_code === 200){
//                 let d = res.data;
//                 let name = StringSanitizer.sanitizeOut(d.name);
//                 mThis.elRoleName.value = name;
//                 mThis.elUserClass.value = d.user_class;
//             }
//         });
//     }
// };

// const RoleTabView = new function(){
//     const mThis = this;
//     this.self = RoleManagementComponent.self[0].querySelector('#_um_roleTabView');
//     this.tabHeader = mThis.self.querySelector('div.tab-header');
//     this.cur_view = 'users';

//     let previousTabButton = null;
//     const tabButtonList = mThis.tabHeader.querySelectorAll('a.tab-button');
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

//                 if(view_name == 'users'){
//                     mThis.displayRoleMembers(mThis.role_id);
//                 }
//                 else if(view_name === 'modules'){
//                     mThis.displayAccessibleModules(mThis.role_id);
//                 }
//                 else if(view_name === 'permissions'){
//                     mThis.displayRolePermissions(mThis.role_id);
//                 }
//                 return;
//             }
//         });
//         if(!previousTabButton) tabButtonList[0].dispatchEvent(new Event('click'));
//     }

//     const div = RoleManagementComponent.self;
//     this.tblPrns1 = div.querySelector('#_um_roleprn_tblPrns');
//     this.tblPerns1_body = div.querySelector('#_um_roleprn_tblPrns_body');
//     this.tblModules = div.querySelector('#_um_tblRoleModules');
//     this.tblModules_body = div.querySelector('#_um_tblRoleModules_body');
//     this.lnkAddModule = div.querySelector('#_um_lnkAddModule');
//     this.lnkAddRoleMember = div.querySelector('#_um_lnkAddRemMember');
//     if(!RoleManagementComponent.allow_add_remove_users) mThis.lnkAddRoleMember.style.display = 'none';
//     this.lnk_roleprn_add = div.querySelector('#_um_roleprn_lnk_add');
//     this.lnk_roleprn_largeview = div.querySelector('#_um_roleprn_lnkLargeView');

//     this.cols = [
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
//             title: "Official ID",
//             className: "text-capitalize align-middle",
//             data: (user, a, b) => {
//                 return user.official_code ? user.official_code : 'None';
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
//                     let role_id = RoleListPanel.selected_role_id;
        
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
//                             vsapi.call(`${mThis.base_url}/api/removeRoleMember`, p).then(res => {
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
//                     let role_id = RoleListPanel.selected_role_id;

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
//                     let role_id = RoleListPanel.selected_role_id;

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
//         if(!RoleListPanel.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }

//         let role_id = RoleListPanel.selected_role_id;
//         let role = {
//             role_id: role_id,
//             role_name: RoleListPanel.selected_role_name
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
//             if(!RoleListPanel.selected_role_id){
//                 cv_interact.error('No role selected!');
//                 return;
//             }
//             let option = {
//                 title: 'Role Permissions',
//                 role_id: RoleListPanel.selected_role_id,
//                 role_name: RoleListPanel.selected_role_name
//             };
    
//             PermissionList.show(option)
//         };
//     }

//     mThis.lnkAddModule.onclick = function(e){
//         e.preventDefault();
//         if(!RoleListPanel.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }
//         RoleListPanel.addAccessibleModule(mThis.role_id,function(e){
//             if(e){
//                 mThis.displayAccessibleModules(mThis.role_id);
//             }
//         });
//     };

//     mThis.lnkAddRoleMember.onclick = function(e){
//         e.preventDefault();
//         if(!RoleListPanel.selected_role_id){
//             cv_interact.error('No role selected!');
//             return;
//         }

//         let role = {
//             id: mThis.role_id,
//             name: RoleListPanel.selected_role_name
//         };
//         RoleListPanel.addRoleMember(role,function(new_user_count){
//             if(new_user_count){
//                 RoleListPanel.updateSelectRole('col_user_count', new_user_count);
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

//     this.displayAccessibleModules = function(role_id){
//         let p = {};
//         p.role_id = role_id ? role_id : 0;
//         mThis.tblModules_body.innerHTML = '';
//         let role_name = RoleListPanel.selected_role_name;
//         if(!role_name) role_name = "This role";
//         RoleManagementComponent.self.querySelector('#_um_roletab_module_text').textContent = `${role_name} can use these modules`;

//         vsapi.call(`${main_view.base_url}/api/role/access-module/list-all`,p).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 let i = 0, c;
//                 do{
//                     c = rows[i];
//                     if(!c) break;
//                     let html = `<tr data-moduleid="${c.id}">
//                         <td style="width:50px !important">
//                             <i class="icon-module-default"></i>
//                         </td>
//                         <td>${c.name}</td>
//                         <td class="col_action">
//                             <a href="javascript:void(0)" class="_um_ma_remove" data-moduleid="${c.id}">
//                                 <i class="fa fa-times text-danger"></i>
//                             </a>
//                         </td>
//                     </tr>`;
//                     mThis.tblModules_body.innerHTML += html;
//                     i++;
//                 }while(c);
//                 mThis.setEventModules();
//             }
//         });
//     }

//     this.displayRoleMembers = function(role_id){
//         let p = {};
//         p.role_id = role_id;
//         p.search_value = RoleListPanel.elSearchUser.value;
//         RoleManagementComponent.self.querySelector('#_um_roletab_users_text').textContent = `Members of ${RoleListPanel.selected_role_name} role`;
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

// const PermissionList = new function(){
//     const mThis = this;
//     this.self = main_view.appContent.find('#_um_permissionList')[0];
//     this.tblPrns = mThis.self.querySelector('#_um_tblPrns');
//     this.tblPrns_body = mThis.self.querySelector('#_um_tblPrns_body');
//     this.lnkCreatePrn = mThis.self.querySelector('#_um_prnlist_lnkCreatePrn');
//     this.lnkRefreshPrns = mThis.self.querySelector('#_um_prnlist_lnkRefeshPrn');
//     this.lnkAddPrnByCode = mThis.self.querySelector('#_um_prnlist_lnkAddPrn');
//     this.lblTitle = mThis.self.querySelector('#_um_prnlist_lblTitle');

//     mThis.lnkCreatePrn.onclick = function(e){
//         e.preventDefault();
//         CreatePermissionDialog.show(mThis.role_id,function(e){
//             if(e){
//                 mThis.displayPermissionList(mThis.role_id);
//             }
//         });
//     };

//     mThis.lnkRefreshPrns.onclick = function(e){
//         e.preventDefault();
//         vsapi.call(`${main_view.base_url}/api/localizePermissions`, null).then(res => {});
//     };

//     mThis.lnkAddPrnByCode.onclick = function(e){
//         e.preventDefault();
//         AddPermissionDialog.show(mThis.role_id, function(ids){
//             if(ids){
//                 RoleTabView.addPermissionsToRole(ids, mThis.role_id, () => {
//                     mThis.displayPermissionList(mThis.role_id);
//                 });
//             }
//         });
//     };

//     mThis.tblPrns_body.addEventListener('click',e =>{
//         e.preventDefault();
        
//         //Click on Remove Permission button
//         let btn = VSUtil.getElementByClass(e.target,'_um_pa_remove');
//         if(btn){
//             let p = {};
//             p.role_id = mThis.role_id;
//             p.ids = btn.dataset.prnid;
    
//             vsapi.call(`${main_view.base_url}/api/removePermissionFromRole`, p).then(res => {
//                 if(res.status_code === 200){
//                     mThis.displayPermissionList(mThis.role_id);
//                 }
//                 else
//                     cv_interact.error(res.error_message);
//             });
//             return;
//         }
       
//     });

//    $(mThis.tblPrns_body).on('mouseover', 'tr',function(e){
//         $(this).find('td.col_action>a').show();
//     }).on('mouseleave', 'tr', function(e){
//         $(this).find('td.col_action>a').hide();
//     });

//     this.show = function(option){
//         if(option){
//             if(option.title) mThis.lblTitle.html(option.title);
//             mThis.role_id = option.role_id;
//         }

//         mThis.displayPermissionList(mThis.role_id);
//         mThis.self.siblings().hide();
//         mThis.self.fadeIn(250);
//     }

//     this.displayPermissionList = function(role_id){
//         let p = {};
//         p.role_id = role_id;
//         mThis.tblPrns_body.empty();

//         vsapi.call(`${main_view.base_url}/api/getPermissionsByRole`, p).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 let i = 0, c;
//                 do{
//                     c = rows[i];
//                     if(!c) break;
//                     let html = `<tr data-prnid="${c.id}">
//                         <td>${c.id}</td>
//                         <td>${c.name}</td>
//                         <td>${c.module_name}</td>
//                         <td class="col_action">
//                             <a data-prnid="${c.id}" href="javascript:void(0)" class="_um_pa_remove" style="display:none">
//                                 <i class="fa fa-times text-danger"></i>
//                             </a>
//                         </td>
//                     </tr>`;
//                     mThis.tblPrns_body.innerHTML += html;
//                     i++;
//                 }while(c);
//             }
//         });
//     }
// };

// const AddPermissionDialog = new function(){
//     const mThis = this;
//     this.self = main_view.appContent.children('#_um_dlgAddPrn')[0];
//     this.lnkBackToRoleList = mThis.self.querySelector('#_um_prnlist_backToRoleList');
//     this.btnAdd = mThis.self.querySelector('#_um_addprn_btnOK');
//     this.elTitle = mThis.self.querySelector('#_um_dlgAddPrnTitle');
//     this.elSearchPrn = mThis.self.querySelector('#_um_addprn_search');
//     this.tblPrns = mThis.self.querySelector('#_um_addprn_tblPrns');
//     this.tblPrns_body = mThis.self.querySelector('#_um_addprn_tblPrns_body');
//     this.elError = mThis.self.querySelector('#_um_addprn_error');

//     if(mThis.lnkBackToRoleList){
//         mThis.lnkBackToRoleList.onclick = function(e){
//             e.preventDefault();
//             let options = {};
//             options.title = "Manage Roles";
//             RoleListPanel.show(options);
//         };
//     }

//     mThis.elSearchPrn.onkeyup = function(e){
//         e.preventDefault();
//         mThis.elError.innerHTML = '';
//         let d = this.value;
//         let p = {};
//         p.search_value = d;
//         p.role_id = mThis.role_id;
//         p.show_all = 1;
//         mThis.tblPrns_body.innerHTML = '';
//         vsapi.call(`${main_view.base_url}/api/getPermissionsByRole`, p).then(res => {
//             let rows = StringSanitizer.sanitizeObject(res.data);
//             mThis.displayPermissions(rows);
//         });
//     };

//     if(mThis.btnAdd){
//         mThis.btnAdd.onclick = function(e){
//             e.preventDefault();
//             let ids = mThis.getSelectedPrns();
//             if(!ids){
//                 mThis.elError.innerHTML = 'No permissions selected';
//                 return;
//             }
    
//             if(typeof mThis.onClose == 'function') mThis.onClose(ids);
//             mThis.self.modal('hide');
//         };
//     }

//     mThis.tblPrns.onclick = function(e){
//         e.preventDefault();
//         console.log('.prn_btn_action');
//         let prn_id = this.dataset.prnid;
//         let tr = this.closest('tr');
//         let action = this.dataset.action;
//         mThis.addRemovePermission(tr, mThis.role_id, prn_id, action);
//     };

//     this.addRemovePermission = (tr, role_id, prn_id, action) => {
//         let p = {
//             role_id: role_id,
//             id: prn_id
//         };
//         let m = 'addPermissionToRole';

//         if(action == 'remove') m = 'removePermissionFromRole';
//         vsapi.call(`${main_view.base_url}/api/${m}`, p).then(res => {
//             if(res.status_code === 200){
//                 if(action == 'add'){
//                     let btn = tr.querySelector('.prn_btn_action');
//                     btn.dataset.action = 'remove';
//                     btn.classList.remove('btn-outline-success').add('btn-outline-danger').textContent = 'Remove';
//                     tr.dataset.hasprn = 1;
//                     tr.classList.remove('tr-disallowed').add('tr-allowed');
//                 }
//                 else{
//                     let btn = tr.querySelector('.prn_btn_action');
//                     btn.dataset.action = 'add';
//                     btn.classList.remove('btn-outline-danger').add('btn-outline-success').textContent = 'Add';
//                     tr.dataset.hasprn = 0;
//                     tr.classList.remove('tr-allowed').add('tr-disallowed');
//                 }
//                 mThis.data_changed = true;
//             }
//             else{
//                 cv_interact.error(res.error_message);
//             }
//         });
//     }

//     this.displayPermissions = (items) => {
//         if(!items) items = [];
//         let i = 0, c;
//         mThis.tblPrns_body.innerHTML = '';
//         do{
//             c = items[i];
//             if(!c) break;
//             let btn_action = `<td class="col_action">
//                 <a data-action="add" href="javascript:void(0)" class="btn btn-sm btn-outline-success prn_btn_action prn_btn_add" data-roleid="${c.role_id}" data-prnid="${c.id}">Add</a>
//             </td>`;
//             if(c.has_prn == 1)
//                 btn_action = `<td class="col_action">
//                     <a href="javascript:void(0)" data-action="remove" class="btn btn-sm btn-outline-danger prn_btn_action prn_btn_remove" data-roleid="${c.role_id}" data-prnid="${c.id}">Remove</a>
//                 </td>`;
//             let tr_class = 'tr-disallowed';
//             if(c.has_prn == 1)
//                 tr_class = 'tr-allowed';
//             let html = `<tr class="${tr_class}" data-id="${c.id}" data-hasprn="${c.has_prn ? c.has_prn : 0}">
//                 <td class="prn-icon">
//                     <img src="" width="80px"/>
//                 </td>
//                 <td class="prn-id">${c.id}</td>
//                 <td class="prn-name">${c.name}</td>
//                 <td class="mod-name">${c.module_name}</td>
//                 ${btn_action}
//             </tr>`;
//             mThis.tblPrns_body.innerHTML += html;
//             i++;
//         }while(c);
//     }

//     this.getSelectedPrns = function(){
//         let prns = null;
//         mThis.tblPrns_body.querySelectorAll('tr').forEach(el => {
//             let cb_cell = el.querySelector('td.col_checkbox > input[type="checkbox"]');
//             if(cb_cell.contains(':checked')){
//                 let sp = '';
//                 if(prns)
//                     sp = '|';
//                 else
//                     sp = '';
//                 prns = prns+sp+(this.dataset.id);
//             }
//         });
//         return prns;
//     }

//     this.loadPermissions = (onFinish) => {
//         let p = {
//             role_id: mThis.role_id,
//             search_value: mThis.elSearchPrn.value,
//             show_all: 1
//         };
//         vsapi.call(`${main_view.base_url}/api/getPermissionsByRole`, p).then(res => {
//             if(res.status_code === 200){
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 onFinish(rows);
//             }
//         });
//     }

//     this.show = function(role, onClose){
//         mThis.elError.innerHTML = '';
//         mThis.role_id = role.role_id;
//         mThis.role_name = role.role_name;
//         mThis.onClose = onClose;
//         mThis.data_changed = false;

//         mThis.elTitle.textContent = `Add/Remove Permissions for ${mThis.role_name}`;
//         mThis.loadPermissions((items) => {
//             mThis.displayPermissions(items);
//             $(mThis.self).modal({
//                 backdrop: 'static'
//             }).on('hidden.bs.modal', function(){
//                 if(typeof mThis.onClose == 'function') mThis.onClose(mThis.data_changed);
//             });
//         });
//     }
// }

// const CreatePermissionDialog = new function(){
//     const mThis = this;
//     this.self = main_view.appContent.children('#_um_dlgCreatePrn')[0];
//     this.btnCreate = mThis.self.querySelector('#_um_createprn_btnOK');
//     this.elPrn = mThis.self.querySelector('#_um_createprn_prn');
//     this.elPrnNumber = mThis.self.querySelector('#_um_createprn_prn_id');
//     this.elModule = mThis.self.querySelector('#_um_createprn_module');
//     this.elError = mThis.self.querySelector('#_um_createprn_error');

//     mThis.btnCreate.onclick = function(e){
//         e.preventDefault();
//         mThis.elError.innerHTML = '';
//         let p = {};
//         p.module_id = mThis.elModule.value;
//         p.name = mThis.elPrn.value;
//         p.prn_id = mThis.elPrnNumber.value;
//         p.role_id = mThis.role_id;
//         if(!p.prn_id){
//             mThis.elError.textContent = 'Permission Number cannot be empty';
//             return;
//         }

//         if(!p.name){
//             mThis.elError.textContent = 'Permission name cannot be empty';
//             return;
//         }

//         if(!p.module_id){
//             mThis.elError.textContent = 'Please select a module';
//             return;
//         }

//         vsapi.call(`${main_view.base_url}/api/createPermission`, p).then(res => {
//             if(res.status_code === 200){
//                 if(typeof mThis.onClose === 'function') mThis.onClose(true);
//                 mThis.self.modal('hide');
//             }
//             else
//                 mThis.elError.textContent = res.error_message;
//         });
//     };

//     this.loadModules = function(onFinish){
//         vsapi.call(`${main_view.base_url}/api/getComboItems_module`,null).then(res => {
//             if(res.status_code === 200){
//                 let i = 0, c;
//                 let rows = StringSanitizer.sanitizeObject(res.data);
//                 mThis.elModule.innerHTML = '';
//                 mThis.elModule.append($('<option/>').val(null).text('(Select Application Module)'));
//                 do{
//                     c = rows[i];
//                     if(!c) break;
//                     mThis.elModule.append($('<option/>').val(c.id).text(c.name));
//                     i++;
//                 }while (c);
//                 onFinish();
//             }
//         });
//     }

//     this.show = function(role_id, onClose){
//         mThis.elError.html(null);
//         mThis.role_id = role_id;
//         mThis.onClose = onClose;

//         mThis.loadModules(function(){
//             mThis.self.modal({
//                 backdrop: 'static'
//             });
//         });
//     }
// }