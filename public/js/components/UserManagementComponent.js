'use strict';
var UserManagementComponent = new function(){
    const mThis = this;
    this.title_prop = "User Management";
    this.self = main_view.appContent.children('#_um_userManagementComponent')[0];
    this.btnNew = mThis.self.querySelector('#_um_btn_new');
    this.elSearch = mThis.self.querySelector('#_um_search_user');
    this.elfilter_userclass = mThis.self.querySelector('#_um_filter_userclass');
    this.btnPdf = mThis.self.querySelector('#_um_btn_pdf');
    this.containerPagination = mThis.self.querySelector('#container_pagination_um');

    this.init = () => {
        if(mThis.initAlready) return;

        mThis.userListView = new ListView('_um_container',{
            fetchApi: `${main_view.base_url}/api/user/list-paginate`,
            perPage: 5,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                mThis.renderUserList(list_container,items);
            },
            listContainerClass: null
        });
 
        mThis.btnNew.onclick = function(e){
            e.preventDefault();
            const op = {
                user_id: null,
                user_class: mThis.elfilter_userclass.value, 
                default: {
                    user_class: mThis.elfilter_userclass.value
                },
                open: 'add-user',
                onClose: () => {
                    mThis.userListView.showPage(mThis.getFilterData());
                }
            };
            if (op.user_class == 0 || !op.user_class || op.user_class == ''){
                cv_interact.warning('Please select a user class');
                return;
            }
            if(!AuthManager.allowed(100)) return;
            AddUserDialog.show(op);
        };

        let timeOut = null;
        mThis.elSearch.onkeyup = function(e){
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                mThis.userListView.showPage(mThis.getFilterData());
            },250);
        }

        mThis.elfilter_userclass.onchange = function(e){
            e.preventDefault();
            mThis.userListView.showPage(mThis.getFilterData());
        }

        mThis.btnPdf.onclick = function(e){
            e.preventDefault();
            const html = `<ul class="list-filter-um">
                <li class="_um_permissions">
                    <i class="fa-solid fa-user-lock fs-5 text-warning pe-2" role="button"></i>
                    <a href="javascript:void(0)">Permissions</a>
                </li>
                <li class="_um_modules">
                    <i class="fa-solid fa-user-minus fs-5 text-danger pe-2" role="button"></i>
                    <a href="javascript:void(0)">Modules</a>
                </li>
            </ul>`;
            DialogFilter(e,{},html,(div) => {
                div.classList.remove('p-3'),
                div.style.left = 'unset',
                div.style.right = 10+'px';
                mThis.setPrint(div);
            });
        }

        mThis.initAlready = true;
    }
    //END::UserManagementComponnet.init()

    this.setPrint = (div) => {
        div.onclick = function(e){
            e.preventDefault();

            let lnk = VSUtil.getElementByClass(e.target,'_um_permissions');
            if(lnk){
                mThis.loadFormPrint('permissions','api/permission/list');
                return;
            }

            lnk = VSUtil.getElementByClass(e.target,'_um_modules');
            if(lnk){
                mThis.loadFormPrint('modules','api/module/list');
                return;
            }
        }
    }

    this.loadFormPrint = (open,end_point) => {
        vsapi.call(`${main_view.base_url}/${end_point}`,null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                let html = '', tbody = '';
                switch(open){
                    case 'permissions':
                        html = `<table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-white text-nowrap text-bg-warning">Code</th>
                                    <th class="text-white text-nowrap text-bg-warning">Permissions</th>
                                    <th class="text-white text-nowrap text-bg-warning">Modules</th>
                                </tr>
                            </thead>
                            <tbody>
                                <h3 class="text-center">User Permissions</h3>
                                ${tbody='',
                                d && d.forEach(item => {
                                    tbody += `<tr>
                                        <td class="fw-bold">${item.id ? item.id : ''}</td>
                                        <td>${item.name ? item.name : ''}</td>
                                        <td>${item.module_name ? item.module_name : ''}</td>
                                    </tr>`;
                                }), tbody}
                            </tbody>
                        </table>`;
                        break;
                    case 'modules':
                        html = `<table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th class="text-white text-nowrap text-bg-warning">Code</th>
                                    <th class="text-white text-nowrap text-bg-warning">Shortcut</th>
                                    <th class="text-white text-nowrap text-bg-warning">Modules</th>
                                </tr>
                            </thead>
                            <tbody>
                                <h3 class="text-center">User Modules</h3>
                                ${tbody='',
                                d && d.forEach(item => {
                                    tbody += `<tr>
                                        <td class="fw-bold">${item.id ? item.id : ''}</td>
                                        <td>${item.ref_code ? item.ref_code : ''}</td>
                                        <td>${item.module_name ? item.module_name : ''}</td>
                                    </tr>`;
                                }), tbody}
                            </tbody>
                        </table>`;
                        break;
                    default:
                        break;
                }

                if(html){
                    let myWindow = window.open('','PRINT');
                    myWindow.document.write(`<!DOCTYPE html>
                    <html >
                        <head>
                            <title class="text-capitalize">User ${open ? open : ''}</title>
                            <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"/>
                            <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/ksm_style.css"/>
                            <link rel="stylesheet" type="text/css" href="${main_view.base_url}/assets/css/vsstyle.css"/>
                        </head>
                        <body>${html}</body>
                    </html>`);
                    myWindow.document.close();
                    setTimeout(() => {
                        myWindow.focus();
                        myWindow.print();
                        myWindow.close();
                    },500);
                }
            }
            else{
                cv_interact.error(res.error_message);
            }
        });
    }

    this.renderUserList = (div,items) => {
        items = items ? items : [];
        if (!AuthManager){
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        AuthManager.init((user_data)=>{
           mThis.beginRenderUsers(div,items,user_data.user);
        });
    }

    this.beginRenderUsers = (div,items,current_user)=>{
        const d = current_user;
        let html = '';
        items.forEach(user => {
            let cls_lock_class = (user.status.toLowerCase() =='active')? '':'border-danger border-2';
            const login_name_text = current_user.id == user.id? [user.login_name,' <span class="text-danger">(You)</span>'].join('') : user.login_name; 
            html = [html,`<div data-roleid="`,(user.role_id || user.primary_role_id),`" class="${user.id === d.id ? 'set-half-border ' : ''}w-100 rounded-2 p-3 shadow-lg bg-white mb-3 position-relative">
                <div class="scope-user row gy-2">
                    <div class="col-lg-2">
                        <div class="d-flex h-100">
                            <div class="width-profile-container rounded-4 set-user-profile">
                                <img style="border-radius:50%" class="img-user-profile object-fit-scale shadow `,cls_lock_class,`" src="`,user.image_url,`" alt="user-profile"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="d-block">
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Login :</span>
                                <span class="text-capitalize">`,login_name_text,`</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Full Name :</span>
                                <span class="text-capitalize">${user.full_name ? user.full_name : 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">User Class :</span>
                                <span class="text-capitalize">${user.user_class ? user.user_class : 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Role :</span>
                                <span class="text-capitalize">${(user.primary_role || user.role_name) || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="d-block">
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Start Date :</span>
                                <span class="text-capitalize">${user.start_date || 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Last Login :</span>
                                <span class="text-capitalize">${user.last_login_date || 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Phone Number :</span>
                                <span class="text-capitalize">${user.phone_number || 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">${user.user_class ? VSUtil.properCase(user.user_class) : 'Offical'} ID :</span>
                                <span class="text-capitalize">${user.official_code || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-2">
                        <div class="d-flex align-items-center justify-content-end h-100">
                        <div class="d-flex flex-row width-locked-icon">
                          ${user.is_locked ? '<i class="fa-solid fa-ban fs-4 text-danger"></i>' : ''}
                        </div>
                            <button class="btn-action btn btn-sm btn-info rounded-5 text-nowrap" type="button" data-roleid = "${(user.role_id || user.primary_role_id) ||''}" data-id="${user.id}" data-user="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">
                                <span class="trans-text" data-langprop="buttons.Action">Action</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div style="min-height:35px" class="d-flex justify-content-left gap-3 pl-2 pt-2 w-100 custom-btn border-top border-secondary">
                    <button class="btn-um-roles btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">Roles</span>
                    </button>
                    <button class="btn-um-permissions btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">Permissions</span>
                    </button>
                    <button class="btn-um-modules btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">Modules</span>
                    </button>
                    <button class="btn-um-reports btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">Reports</span>
                    </button>
                    <button class="btn-um-lock btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">
                        <span class="text-nowrap">${user.is_locked ? 'Unlock' : 'Lock'}</span>
                    </button>
                    <button class="btn-um-set-password btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">Set Password</span>
                    </button>
                </div>
            </div>`].join('');
        });
        
        div.innerHTML = html;
        const parent = div.parentElement;
        parent.style.height = (window.innerHeight - 240)+'px';
        window.onresize = function(e){
            e.preventDefault();
            parent.style.height = (window.innerHeight - 240)+'px';
        }
        mThis.setMenuAction(div.querySelectorAll('.btn-action'));
        div.querySelectorAll('.custom-btn').forEach(contain => {
            mThis.setEvent(contain);
        });
    }

    this.setMenuAction = (buttons) => {
        buttons.forEach(btn => {
            btn.onclick = function(e){
                e.preventDefault();
                const id = e.target.parentElement.dataset.id,
                user_name = e.target.parentElement.dataset.user,
                is_locked = e.target.parentElement.dataset.lock,
                role_id = e.target.parentElement.dataset.roleid;

                if(id){
                    const html = [`<ul class="list-unstyled set-bottom-border pb-0 mb-0">
                        <li class="p-2 text-nowrap btn-um-delete" data-id="${id}" data-user="${user_name}">
                            <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                            <span class="ps-2">Delete</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-modify" data-roleid="${role_id}" data-id="${id}" data-user="${user_name}">
                            <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                            <span class="ps-2">Edit</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-lock" data-id="${id}" data-user="${user_name}" data-lock="${is_locked}">
                            ${is_locked === 'lock' ? '<i class="fa-solid fa-ban text-danger fs-5"></i>' : '<i class="fa-solid fa-lock-open text-success fs-5"></i>'}
                            <span class="ps-2 text-capitalize">${is_locked}</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-set-password" data-id="${id}" data-user="${user_name}">
                            <i class="fa-solid fa-user-lock fs-5 text-primary-emphasis"></i>
                            <span class="ps-2">Set Password</span>
                        </li>`,
                        //`<li role="separator" class="dropdown-divider"></li>`,
                        `<li class="p-2 text-nowrap btn-um-permissions" data-id="${id}" data-user="${user_name}">
                            <i class="fa-solid fa-user-pen fs-5 text-warning-emphasis"></i>
                            <span class="ps-2">Permissions</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-modules" data-id="${id}" data-user="${user_name}">
                          <i class="fa-solid fa-user-pen fs-5 text-warning-emphasis"></i>
                          <span class="ps-2">Modules</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-reports" data-id="${id}" data-user="${user_name}">
                            <i class="fa-regular fa-rectangle-list fs-5 text-primary"></i>
                            <span class="ps-2">Reports</span>
                        </li>
                    </ul>`].join('');
                    //const btn = VSUtil.closestLimited(e.target,'.btn-action');
                    DialogFilter(e,{},html,(div) => {
                        div.classList.remove('p-3');
                        div.classList.add('p-2');
                        div.style.left = 'unset',
                        mThis.setEvent(div,btn);
                    });
                }
            };
        });
    }

    this.setEvent = (div,button=null) => {
        div.onclick = function(e){
            e.preventDefault();
            let btn = VSUtil.getElementByClass(e.target,'btn-um-delete');
            if(btn){
                let op = {
                    user_id: btn.dataset.id
                };
                if(!AuthManager.allowed(101)) return;
                if(op.user_id){
                    cv_interact.confirm('Delete this user?',{
                        title: 'Delete User',
                        context: 'delete'
                    },(e) => {
                        if(e){
                            vsapi.call(`${main_view.base_url}/api/user/delete`,op,null).then(res => {
                                if(res.status_code === 200){
                                    mThis.userListView.showPage(mThis.getFilterData());
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    });
                }
                return;
            }

            btn = VSUtil.getElementByClass(e.target,'btn-um-modify');
            if(btn){
                //get primary role_id. If user does not have primary role_id, then do not allow edit information
                const role_id = div.dataset.roleid; 
                // if(!role_id || role_id==0){
                //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                //   return;
                // } 
                let op = {
                    user_id: btn.dataset.id,
                    default:{
                        user_class: mThis.elfilter_userclass.value
                    },
                    open: 'add-user',
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                if(!AuthManager.allowed(112)) return;
                if(op.user_id && op.user_id !== 'undefined') AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.getElementByClass(e.target,'btn-um-lock');
            if(btn){
                let op = {
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    action: btn.dataset.lock
                };
                if(!AuthManager.allowed(113)) return;
                const action =(op.action || '').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                cv_interact.confirm(['Do you want to ',op.action,' user ',op.user_name.replace(/^\w/, (c) => c.toUpperCase()),'?'].join(''),{
                    title: `${op.action} User`,
                    context: `update`,
                    confirmButtonText:`${action} Now`
                },(e) => {
                    if(e){
                        delete(op.user_name);
                        vsapi.call(`${main_view.base_url}/api/user/set-lock-status`,op,null,false).then(res => {
                            if(res.status_code === 200){
                                const parentElement = button ? button.closest('.scope-user') : div.previousElementSibling;
                                btn = button ? btn = button : btn;
                                mThis.resetUserStatus(parentElement,btn,op);
                            }
                            else{
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-set-password');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'reset-password',
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData());
                    }
                };
                if(!AuthManager.allowed(109)) return;
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-roles');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'roles'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-permissions');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'permissions'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.getElementByClass(e.target,'btn-um-modules');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'modules'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }
            
            btn = VSUtil.getElementByClass(e.target,'btn-um-modules');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'modules'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.getElementByClass(e.target,'btn-um-reports');
            if(btn){
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'reports'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    AddUserDialog.show(op);
                return;
            }
        };
    }

    this.resetUserStatus = (div,btn,options) => {
        const containerIcon = div.querySelector('.width-locked-icon');
        const img = div.querySelector('img.img-user-profile');
        let btnAction = null;
        if(btn.classList.contains('btn-action')){
            btnAction = div.nextElementSibling.querySelector('.btn-um-lock');
            if(options.action === 'lock'){
                btn.dataset.lock = 'unlock',
                btnAction.dataset.lock = 'unlock',
                btnAction.children[0].textContent = 'Unlock';
                containerIcon.innerHTML = '<i class="fa-solid fa-ban fs-4 text-danger"></i>';
                if(img) img.classList.add('border-2','border-danger');
            }
            else{
                btn.dataset.lock = 'lock',
                btnAction.dataset.lock = 'lock',
                btnAction.children[0].textContent = 'Lock';
                containerIcon.innerHTML = '';
                if(img) img.classList.remove('border-danger','border-2');
            }
        }
        else{
            btnAction = div.querySelector('.btn-action');
            if(options.action === 'lock'){
                btn.dataset.lock = 'unlock',
                btnAction.dataset.lock = 'unlock';
                btn.children[0].textContent = 'Unlock';
                containerIcon.innerHTML = '<i class="fa-solid fa-ban fs-4 text-danger"></i>';
                if(img) img.classList.add('border-2','border-danger');
            }
            else{
                btn.dataset.lock = 'lock',
                btnAction.dataset.lock = 'lock';
                btn.children[0].textContent = 'Lock';
                containerIcon.innerHTML = '';
                if(img) img.classList.remove('border-danger','border-2');
            }
        }
    }

    this.getFilterData = () => {
        return {
            user_class: mThis.elfilter_userclass.value,
            search_value: mThis.elSearch.value
        }
    }

    this.prepareFormOption = (onFinish=null) => {
        vsapi.call(`${main_view.base_url}/api/user/options-user-class`,null,null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data,
                el = mThis.elfilter_userclass;
                VSUtil.setComboItems(el,d,'user_class','user_class_name',true,'All',0);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.show = (options) => {
        mThis.init(); //NOTE: initOnce init one time only
        if(!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOption(() => {
            mThis.userListView.showPage(mThis.getFilterData(),null,() => {
                $(mThis.self).siblings().hide();
                $(mThis.self).fadeIn(200);
            });
        });
    }
}

const AddUserDialog = new function(){
    const mThis = this;
    this.self = main_view.appContent.children('#dlg_um_')[0];
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.btnSave = mThis.self.querySelector('#dlg_um_btn_save');
    this.btnClose = mThis.self.querySelector('#dlg_um_btn_close');
    this.selected_options = {};
    
    /** Set event handlers */
    this.saveData = (modal,btnSave,end_point,options) => {
        btnSave.onclick = function(e){
            e.preventDefault();
            let p = null;
            if(options.open === 'add-user'){
                p = mThis.getDataForm(modal);
                //p.user_id = options.user_id;
                p.id = options.user_id;
                if(p.password === p.confirm_password){
                    delete(p.confirm_password);
                    vsapi.call([main_view.base_url,end_point].join(''),p,btnSave).then(res => {
                        if(res.status_code === 200){
                            $(mThis.self).modal('hide');
                            let msg =['New login "',p.login_name,'"', (p.full_name? ` for ${p.full_name}`:''),' has been created successfully!'].join('');
                            if(p.id > 0 || p.user_id > 0) msg = ['Account info for user ',(p.full_name? p.full_name: p.login_name),' was successfully updated'].join('');
                            cv_interact.success(msg);
                            if(typeof options.onClose === 'function') options.onClose();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
                else{
                    cv_interact.warning("Password and confirm password not match");
                }
            }
            else{
                p = mThis.getDataForm(modal);
                p.login_name = options.user_name;
                if(p.password == p.confirm_password){
                    delete(p.confirm_password);
                    vsapi.call(`${main_view.base_url+end_point}`,p,btnSave).then(res => {
                        if(res.status_code === 200){
                            $(mThis.self).modal('hide');
                            if(typeof options.onClose === 'function') options.onClose();
                        }
                        else{
                            cv_interact.error(res.error_message);
                        }
                    });
                }
                else{
                    cv_interact.warning("Passwords do not match");
                }
            }
        }
    }

    this.getDataForm = (div) => {
        let p = {};
        div.querySelectorAll('.data-input').forEach(el => {
            const f = el.dataset.field;
            if(el.tagName === 'IMG')
                p[f] = el.src;
            else
                p[f] = el.value;
        });
        return p;
    }

    this.setImage = (btn_chooser,image) => {
        const div = btn_chooser.parentElement;
        let html = '';
        if(image){
            html = `<img class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="" data-field="photo"/>
            <div class="position-absolute top-0 end-0 rounded-3 bg-dark p-2">
                <a href="javascript:void(0)" class="btn-um-delete-img">
                    <i class="fa-regular fa-trash-can text-danger fs-5"></i>
                </a>
            </div>`;
        }
        else{
            html = `<div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
                <i class="fa-regular fa-image text-muted fs-5"></i>
            </div>`;
        }

        div.innerHTML = html;
        mThis.setDeleteImage(div);
    }

    this.setDeleteImage = (div) => {
        const btn_delete = div.querySelector('.btn-um-delete-img');
        btn_delete.onclick = function(e){
            e.preventDefault();
            const html = `<div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
                <i class="fa-regular fa-image text-muted fs-5"></i>
            </div>`;
            div.innerHTML = html;
            mThis.setChooseImage(div);
        };
    }

    this.setChooseImage = (div) => {
        const btn_chooser = div.querySelector('#_um_profile_show');
        btn_chooser.onclick = function(e){
            e.preventDefault();
            FileChooser.chooseFile(null,(d) => {
                if(d){
                    mThis.setImage(btn_chooser,d.dataUrl);
                }
            });
        };
    }

    this.validatePassword = (div) => {
        let inputList = [];

        div.querySelectorAll('.data-validate').forEach(el => {
            el.nextElementSibling.onclick = function(e){
                e.preventDefault();
                const elChild = this.children[0];
                if(el.type === 'password'){
                    el.type = 'text';
                    elChild.classList.add('text-success'),
                    elChild.classList.remove('text-muted');
                    return;
                }
                else{
                    el.type = 'password';
                    elChild.classList.remove('text-success'),
                    elChild.classList.add('text-muted');
                }
            };
            inputList.push(el);
        });
        if(!inputList[0]) return;

        inputList[0].oninput = function(e){
            e.preventDefault();
            if((this.value === inputList[1].value) && !(this.value === '')){
                this.classList.remove('border-danger');
                inputList[1].classList.remove('border-danger');
            }
            else{
                this.classList.add('border-danger');
                inputList[1].classList.add('border-danger');
            }
        };

        inputList[1].oninput = function(e){
            e.preventDefault();
            if((this.value === inputList[0].value) && !(this.value === '')){
                this.classList.remove('border-danger');
                inputList[0].classList.remove('border-danger');
            }
            else{
                this.classList.add('border-danger');
                inputList[0].classList.add('border-danger');
            }
        };
 }
      
    this.renderCreateUser = (modalDiv,options, onFinish) => {
        const def = options.default || {};
        const div = modalDiv.querySelector('.modal-body');
        vsapi.call(`${main_view.base_url}/api/user/form-options`,null,options.button,false).then(res => {
            if(res.status_code === 200){
                const d = res.data;
                let option = '';
                let user_id = options.user_id > 0?options.user_id:options.id;
                let user_class = user_id > 0? 'Official': (def.user_class? def.user_class:' Official');
                user_class = user_class.replace(/_/g,' ');
                let password_fields = '';
                
                if(!user_id || user_id == 0){
                    password_fields = `<div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="password" class="form-label trans-text" data-langprop="titles.Password"></label>
                            <div class="input-group flex-nowrap">
                                <input type="password" class="form-control ${user_id > 0 ? '' : 'data-input'} data-validate" ${user_id > 0 ? '' : 'data-field="password"'} autocomplete="off" ${user_id >0 ? 'readonly' : ''}/>
                                <div class="input-group-text" role="button">
                                    <i class="fa-regular fa-eye fs-5 text-muted"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="confirm_password" class="form-label trans-text" data-langprop="titles.Confirm Password"></label>
                            <div class="input-group flex-nowrap">
                                <input type="password" class="form-control ${user_id > 0 ? '' : 'data-input'} data-validate" ${user_id > 0? '' : 'data-field="confirm_password"'} autocomplete="off" ${user_id >0 ? 'readonly' : ''}/>
                                <div class="input-group-text" role="button">
                                    <i class="fa-regular fa-eye fs-5 text-muted"></i>
                                </div>
                            </div>
                        </div>
                     </div>
                    </div>`;
                }
                const html = `<form action="" method="POST" autocomplete="off">
                    <div class="row gy-2 align-items-end">
                        <div class="col-lg-6">
                            <div class="row gy-2 align-items-end">
                                <div class="col-lg-5">
                                    <div class="form-group">
                                        <label for="user_profile" class="form-label trans-text" data-langprop="titles.Profile Photo"></label>
                                        <div class="container-user-profile">
                                            <div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
                                                <i class="fa-regular fa-image text-muted fs-5"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-7">
                                    <div class="form-group">
                                        <label for="user_class" class="form-label trans-text" data-langprop="titles.User Class"></label>
                                        <div class="width-select-dialog">
                                            <select class="modal-select2 data-input user-class" data-field="user_class" ${options.user_id ? ' disabled' : ''}>
                                                ${option=null,
                                                d && d.user_classes.forEach(op => {
                                                    option += `<option value="${op.user_class}">${op.user_class_name}</option>`;
                                                }),option+'<option value="" selected></option>'}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="role_id" class="form-label trans-text" data-langprop="titles.Role"></label>
                                <div class="width-select-dialog">
                                    <select class="modal-select2 user-role data-input" data-field="role_id">
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="login_name" class="form-label trans-text" data-langprop="titles.Login Name"></label>
                                <input type="text" class="form-control data-input" data-field="login_name"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="full_name" class="form-label trans-text" data-langprop="titles.Full Name"></label>
                                <input type="text" class="form-control data-input" data-field="full_name"/>
                            </div>
                        </div>
                    </div>
                    <div class="row gy-2">
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="offical_id" class="um_label_official_code form-label trans-text" data-langprop="titles.${user_class? VSUtil.properCase(user_class):'Official'} ID"></label>
                                <input type="text" class="form-control data-input" data-field="official_code"/>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="form-group">
                                <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                                <input type="text" class="form-control data-input" data-field="phone_number"/>
                            </div>
                       </div>
                    </div>
                    ${password_fields}
                </form>`;
                div.innerHTML = html;
                let labelOfficialId = div.querySelector('.um_label_official_code');
                let elUserClass = null;
                let elUserRole = null;
                const selectList = div.querySelectorAll('select.modal-select2');
                selectList.forEach(el => {
                    let f = el.dataset.field;
                    if(f === "user_class")
                        elUserClass = el;
                    else if(f==="role_id")
                        elUserRole = el;
                    $(el).select2({
                        tag: true
                    });
                });

                if(options.user_id > 0){
                   mThis.loadFormDetails(div,options);
                }
                else{
                    mThis.setUserFormData(div,def);
                }
                
                LocaleManager.translateZone(div);

                onFinish();
                /** Set select' events => when user choose User class, show only suitable roles */
                if(elUserClass){
                    elUserClass.onchange = (e)=>{
                        e.preventDefault();
                        vsapi.call(`${main_view.base_url}/api/role/options-role`,{
                            user_class: elUserClass.value
                        },null,false).then(res=>{
                            let roles = res.status_code === 200 ? res.data: [];
                            let def_role_id = mThis.selected_options.role_id? mThis.selected_options.role_id: ((roles[0]? roles[0].id:null));
                            if(labelOfficialId){
                                let u_class = (elUserClass.value || '').replace(/_/g,' ');
                                labelOfficialId.textContent = [VSUtil.properCase(u_class),' ID'].join('');
                            }
                            VSUtil.setComboItems(elUserRole,roles,'id','name',null,null, def_role_id);
                        });
                    }
                }
                elUserClass.dispatchEvent(new Event('change',{bubbles:true}));
                mThis.validatePassword(div);
                mThis.setChooseImage(div);
                mThis.saveData(div,mThis.btnSave,'/api/user/save',options);
              
            }
        });
    }

    this.setUserFormData = (div,d)=>{
        d = d || {};
        const btn_chooser = div.querySelector('#_um_profile_show');
        if(d.image_url) mThis.setImage(btn_chooser, d.image_url);
        if(!d.login_name) d.login_name = d.phone_number || d.email;
        div.querySelectorAll('.data-input').forEach(el => {
            const f = el.dataset.field;
            if(el.nodeName.toLowerCase() === 'select'){
                el.value = d[f] ? d[f] : '';
                if(f === 'official_code') el.setAttribute('readOnly',(d[f]?true:false));  
                /* because when user_class changes then role list also change */
                else if(f ==='user_class') mThis.selected_options.role_id = d.role_id;
                el.dispatchEvent(new Event('change'));
            }
            else
                el.value = d[f] ? d[f] : '';
        });
    }

    this.loadFormDetails = (div, options) => {
        vsapi.call(`${main_view.base_url}/api/user/details`,{
            id: options.id || options.user_id 
        },null,false).then(res => {
            if(res.status_code === 200){
                const d = res.data || {};
                mThis.setUserFormData(div,d);
            }
        });
    }

    this.renderResetPassword = (modalDiv,options,onFinish) => {
        const div = modalDiv.querySelector('.modal-body');
        const html = `<form action="" method="POST" autocomplete="off">
            <div class="form-group">
                <label for="password" class="form-label trans-text" data-langprop="titles.New Password"></label>
                <div class="input-group flex-nowrap">
                    <input type="password" class="form-control data-input data-validate" data-field="password" autocomplete="off"/>
                    <div class="input-group-text" role="button">
                        <i class="fa-regular fa-eye fs-5 text-muted"></i>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="confirm_password" class="form-label trans-text" data-langprop="titles.Confirm New Password"></label>
                <div class="input-group flex-nowrap">
                    <input type="password" class="form-control data-input data-validate" data-field="confirm_password" autocomplete="off"/>
                    <div class="input-group-text" role="button">
                        <i class="fa-regular fa-eye fs-5 text-muted"></i>
                    </div>
                </div>
            </div>
        </form>`;
        div.innerHTML = html;
        mThis.validatePassword(div);
        //Set btnSave's event handler
        mThis.saveData(div,mThis.btnSave,'/api/user/security/set-pwd',options);
        LocaleManager.translateZone(div);
        onFinish();
    }

    this.renderPermissions = (modalDiv,options,onFinish) => {
        const div = modalDiv.querySelector('.modal-body');
        const purpose = options.open === 'roles' ? 'role' : options.open === 'modules' ? 'modules' : options.open === 'reports' ? 'reports' : 'permissions';
        const type = options.open.toLowerCase(); 
        mThis.controlApiDisplay(options,(d) => {
            const html = `<div class="form-group">
                <input type="search" class="form-control data-input" placeholder="Search ${purpose} by number or name"/>
            </div>
            <div class="table-responsive p-2 border rounded-3 table-responsive-hover">
                <table class="table">
                    <thead>
                        <tr>
                            <th class="text-nowrap">Status</th>
                            ${(type ==='roles' || type==='reports')? '': `<th class="text-nowrap">Code</th>`}
                            <th class="text-nowrap text-capitalize">${options.open ? options.open : 'Permissions'}</th>
                            ${((type === 'permissions')) ? `<th class="text-nowrap text-capitalize">Modules</th>` : ''}
                            <th class="text-nowarp">Action</th>
                        </tr>
                    </thead>
                    <tbody>${mThis.renderTableBody(d.data,options)}</tbody>
                </table>
                <div class="container-pagination"></div>
            </div>`;
            div.innerHTML = html;
            const tbody = div.querySelector('tbody'),
            containerPagination = div.querySelector('.container-pagination');
            mThis.controlActionOnTbody(tbody,options);
            mThis.createPagination(containerPagination,d);
            
            onFinish();

            const inputSearch = div.querySelector('input.data-input');
            let timeOut = null;
            inputSearch.onkeyup = function(e){
                e.preventDefault();
                options.search_value = this.value;
                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    mThis.controlApiDisplay(options,(d) => {
                        tbody.innerHTML = mThis.renderTableBody(d.data,options);
                        mThis.controlActionOnTbody(tbody,options);
                        mThis.createPagination(containerPagination,d);
                    });
                },250);
            }

            containerPagination.onclick = function(e){
                e.preventDefault();
                const target = e.target;
                if((target.nodeName.toLowerCase() === 'a') || (target.parentElement.nodeName.toLowerCase() === 'a')){
                    options.current_page = target.dataset.page;
                    mThis.controlApiDisplay(options,(d) => {
                        tbody.innerHTML = mThis.renderTableBody(d.data,options);
                        mThis.controlActionOnTbody(tbody,options);
                        mThis.createPagination(containerPagination,d);
                    });
                }
            }
        });
    }

    this.createPagination = (div,d) => {
        let startPage = 1,
        currentPage = d.current_page,
        endPage = d.last_page,
        list = null;

        if((startPage === currentPage) && (currentPage < endPage)){
            list = `<li>
                <a href="javascript:void(0)" data-page="${startPage}">
                    <i class="fa-solid fa-chevron-left"></i>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            </li>
            <li>${d.to ? d.to : ''} of ${d.total ? d.total : ''}</li>`;
        }
        else if((startPage < currentPage) && (currentPage < endPage)){
            list = `<li>
                <a href="javascript:void(0)" data-page="${parseInt(currentPage)-1}">
                    <i class="fa-solid fa-chevron-left"></i>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            </li>
            <li>${d.to ? d.to : ''} of ${d.total ? d.total : ''}</li>`;
        }
        else if((startPage < currentPage) && (currentPage === endPage)){
            list = `<li>
                <a href="javascript:void(0)" data-page="${parseInt(currentPage)-1}">
                    <i class="fa-solid fa-chevron-left"></i>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            </li>
            <li>${d.to ? d.to+' of' : ''}  ${d.total ? d.total : ''}</li>`;
        }
        else if((startPage === currentPage) && (currentPage === endPage)){
            list = `<li>
                <a href="javascript:void(0)" data-page="${currentPage}">
                    <i class="fa-solid fa-chevron-left"></i>
                </a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
            </li>
            <li>
                <a href="javascript:void(0)" data-page="${currentPage}">
                    <i class="fa-solid fa-chevron-right"></i>
                </a>
            </li>
            <li>${d.to ? d.to+' of' : ''}  ${d.total ? d.total : ''}</li>`;
        }

        div.innerHTML = `<ul>${list ? list : ''}</ul>`;
    }

    this.renderTableBody = (d,options) => {
        let tbody = '';
        const check_icon = `<i class="fa fa-check text-success fs-5 p-0 m-0"></i>`,
        cross_icon = `<i class="fa fa-times text-danger fs-5 p-0 m-0"></i>`;

        switch(options.open){
            case 'roles':
                (d || []).forEach(item => {
                    tbody = [`<tr>
                        <td class="align-middle">
                            <span class="p-2 rounded-3 d-flex align-items-center justify-content-center bg-success-subtle" style="width:33px">${item.allowed ? check_icon : cross_icon}</span>
                        </td>
                        <td class="align-middle text-capitalize">${item.name ? item.name : ''}</td>
                        <td class="align-middle">`,
                          `<button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
                             <span>${item.allowed ? 'Remove' : 'Add'}</span>
                          </button>`,
                        `</td>
                    </tr>`].join('');
                });
                break;
            case 'permissions':
                (d || []).forEach(item => {
                    tbody += `<tr>
                        <td class="align-middle">
                            <span class="p-2 rounded-3 bg-${item.allowed ? 'success text-white' : 'dark-subtle'}">${item.allowed ? 'Allowed' : 'Denied'}</span>
                        </td>
                        <td class="align-middle">${item.id ? item.id : ''}</td>
                        <td class="align-middle text-capitalize">${item.name ? item.name : ''}</td>
                        <td class="align-middle text-capitalize">${item.module_name ? item.module_name : ''}</td>
                        <td class="align-middle">
                            <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
                                <span>${item.allowed ? 'Remove' : 'Add'}</span>
                            </button>
                        </td>
                    </tr>`;
                });
                break;
            case 'modules':
                (d || []).forEach(item => {
                    tbody += `<tr>
                        <td class="align-middle">
                            <span class="p-2 rounded-3 bg-${item.access ? 'success text-white' : 'dark-subtle'}">${item.access ? 'Allowed' : 'Denied'}</span>
                        </td>
                        <td class="align-middle">${item.id ? item.id : ''}</td>
                        <td class="align-middle text-capitalize">${item.module_name ? item.module_name : ''}</td>
                        <td class="align-middle">
                            <button class="btn-action btn btn-sm btn-outline-${item.access ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.access}">
                                <span>${item.access ? 'Remove' : 'Add'}</span>
                            </button>
                        </td>
                    </tr>`;
                });
                break;
            case 'reports':
                (d || []).forEach(item => {
                    tbody += `<tr>
                        <td class="align-middle">
                            <span class="p-2 rounded-3 bg-${item.allowed ? 'success text-white' : 'dark-subtle'}">${item.allowed ? 'Allowed' : 'Denied'}</span>
                        </td>
                        <td class="align-middle text-uppercase">${item.name ? item.name : ''}</td>
                        <td class="align-middle">
                            <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
                                <span>${item.allowed ? 'Remove' : 'Add'}</span>
                            </button>
                        </td>
                    </tr>`;
                });
                break;
            default:
                break;
        }
        return tbody;
    }

    this.controlActionOnTbody = (tbody,options) => {
        let btnList = null;
        switch(options.open){
            case 'roles':
                let previousRole = null, previousRoleId = null, previousBtn = null;
                btnList = tbody.querySelectorAll('.btn-action');
                btnList.forEach(btn => {
                    if(parseInt(btn.dataset.status)){
                        previousRoleId = btn.dataset.id,
                        previousRole = btn.closest('tr').cells[2].textContent,
                        previousBtn = btn;
                    }

                    btn.onclick = function(e){
                        e.preventDefault();
                        const allowed = parseInt(this.dataset.status),
                        p = {
                            user_id: options.user_id,
                            role_id: this.dataset.id
                        };

                        if(allowed){
                            if(!AuthManager.allowed(108)) return;
                            vsapi.call(`${main_view.base_url}/api/user/role/delete`,p, null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRowForRole(this,{
                                        btn: previousBtn,
                                        roles: previousRole,
                                        role_id: previousRoleId
                                    },(d) => {
                                        previousBtn = d.btn,
                                        previousRole = d.roles,
                                        previousRoleId = d.role_id;
                                    });
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                        else{
                            if(parseInt(previousRoleId)){
                                if(!AuthManager.allowed(107)) return;
                                cv_interact.confirm(`${previousRole.replace(/^\w/, (c) => c.toUpperCase())} previous role must be removed before adding new role. Continue now?`,{
                                    title: 'Delete Role',
                                    context: 'delete',
                                    confirmButtonText: 'Remove'
                                },(e) => {
                                    if(e){
                                        vsapi.call(`${main_view.base_url}/api/user/role/delete`,{
                                            user_id: p.user_id,
                                            role_id: previousRoleId
                                        },btn,false).then(res => {
                                            if(res.status_code === 200){
                                                vsapi.call(`${main_view.base_url}/api/user/role/add`,p,null,false).then(res => {
                                                    if(res.status_code === 200){
                                                        mThis.resetRowForRole(this,{
                                                            btn: previousBtn,
                                                            roles: previousRole,
                                                            role_id: previousRoleId
                                                        },(d) => {
                                                            previousBtn = d.btn,
                                                            previousRole = d.roles,
                                                            previousRoleId = d.role_id;
                                                        });
                                                    }
                                                    else{
                                                        cv_interact.error(res.error_message);
                                                    }
                                                });
                                            }
                                            else{
                                                cv_interact.error(res.error_message);
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                vsapi.call(`${main_view.base_url}/api/user/role/add`,p,btn,false).then(res => {
                                    if(res.status_code === 200){
                                        mThis.resetRowForRole(this,{
                                            btn: previousBtn,
                                            roles: previousRole,
                                            role_id: previousRoleId
                                        },(d) => {
                                            previousBtn = d.btn,
                                            previousRole = d.roles,
                                            previousRoleId = d.role_id;
                                        });
                                    }
                                    else{
                                        cv_interact.error(res.error_message);
                                    }
                                });
                            }
                        }
                    }
                });
                break;
            case 'permissions':
                btnList = tbody.querySelectorAll('.btn-action');
                btnList.forEach(btn => {
                    btn.onclick = function(e){
                        e.preventDefault();
                        const allowed = parseInt(this.dataset.status),
                        p = {
                            user_id: options.user_id,
                            prn_id: this.dataset.id
                        };

                        if(allowed){
                            if(!AuthManager.allowed(111)) return;
                            vsapi.call(`${main_view.base_url}/api/user/permission/delete`,p, null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                        else{
                            if(!AuthManager.allowed(105)) return;
                            vsapi.call(`${main_view.base_url}/api/user/permission/add`,p,null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    }
                });
                break;
            case 'modules':
                btnList = tbody.querySelectorAll('.btn-action');
                btnList.forEach(btn => {
                    btn.onclick = function(e){
                        e.preventDefault();
                        const allowed = parseInt(this.dataset.status),
                        p = {
                            user_id: options.user_id,
                            mod_id: this.dataset.id
                        };

                        if(allowed){
                            if(!AuthManager.allowed(115)) return;
                            vsapi.call(`${main_view.base_url}/api/user/module/delete`,p,null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                        else{
                            if(!AuthManager.allowed(114)) return;
                            vsapi.call(`${main_view.base_url}/api/user/module/add`,p,null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    }
                });
                break;
            case 'reports':
                btnList = tbody.querySelectorAll('.btn-action');
                btnList.forEach(btn => {
                    btn.onclick = function(e){
                        e.preventDefault();
                        const allowed = parseInt(this.dataset.status),
                        p = {
                            user_id: options.user_id,
                            prn_id: this.dataset.id
                        };

                        if(allowed){
                            if(!AuthManager.allowed(111)) return;
                            vsapi.call(`${main_view.base_url}/api/user/permission/delete`,p,null,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                        else{
                            if(!AuthManager.allowed(105)) return;
                            vsapi.call(`${main_view.base_url}/api/user/permission/add`,p,btn,false).then(res => {
                                if(res.status_code === 200){
                                    mThis.resetRow(this);
                                }
                                else{
                                    cv_interact.error(res.error_message);
                                }
                            });
                        }
                    }
                });
                break;
            default:
                break;
        }
    }

    this.resetRow = (btn) => {
        const tr = btn.closest('tr'),
        status = btn.dataset.status,
        firstCol = tr.cells[0];

        if(parseInt(status)){
            btn.dataset.status = 0,
            btn.classList.add('btn-outline-primary'),
            btn.classList.remove('btn-outline-warning'),
            btn.children[0].textContent = 'Add',
            firstCol.children[0].classList.add('bg-dark-subtle'),
            firstCol.children[0].classList.remove('bg-success','text-white'),
            firstCol.children[0].textContent = 'Denied';
        }
        else{
            btn.dataset.status = 1,
            btn.classList.add('btn-outline-warning'),
            btn.classList.remove('btn-outline-primary'),
            btn.children[0].textContent = 'Remove',
            firstCol.children[0].classList.add('bg-success','text-white'),
            firstCol.children[0].classList.remove('bg-dark-subtle'),
            firstCol.children[0].textContent = 'Allowed';
        }
    }

    this.resetRowForRole = (btn, previousObject, onFinish = null) => {
        const tr = btn.closest('tr'),
        status = btn.dataset.status,
        firstCol = tr.cells[0];

        let previousRow = null,previousRowFirstCol = null;
        if(previousObject.btn){
            previousRow = previousObject.btn.closest('tr');
            previousRowFirstCol = previousRow.cells[0];
        }

        let check_icon = `<i class="fa fa-check text-success fs-5"></i>`;
        let cross_icon = `<i class="fa fa-times text-danger fs-5"></i>`;

        if(parseInt(status)){
            btn.classList.add('btn-outline-primary'),
            btn.classList.remove('btn-outline-warning'),
            btn.children[0].textContent = 'Add',
            btn.dataset.status = 0,
            firstCol.children[0].innerHTML = cross_icon;

            if(previousObject.btn && (parseInt(previousObject.btn.dataset.status) === parseInt(status))){
                previousObject.btn.classList.add('btn-outline-warning'),
                previousObject.btn.classList.remove('btn-outline-primary'),
                previousObject.btn.children[0].textContent = 'Remove',
                previousObject.btn.dataset.status = 1,
                previousRowFirstCol.children[0].innerHTML = check_icon;
            }

            if(typeof onFinish === 'function'){
                onFinish({
                    btn: null,
                    roles: null,
                    role_id: null
                });
            }
        }
        else{
            btn.classList.add('btn-outline-warning'),
            btn.classList.remove('btn-outline-primary'),
            btn.children[0].textContent = 'Remove',
            btn.dataset.status = 1,
            firstCol.children[0].innerHTML = check_icon;

            if(previousObject.btn){
                previousObject.btn.classList.add('btn-outline-primary'),
                previousObject.btn.classList.remove('btn-outline-warning'),
                previousObject.btn.children[0].textContent = 'Add',
                previousObject.btn.dataset.status = 0,
                previousRowFirstCol.children[0].innerHTML = cross_icon;
            }

            if(typeof onFinish === 'function'){
                onFinish({
                    btn: btn,
                    roles: tr.cells[2].textContent,
                    role_id: btn.dataset.id
                });
            }
        }
    }

    this.controlApiDisplay = (options,onFinish=null) => {
        let end_point = null, params = null;
        switch(options.open){
            case 'roles':
                end_point = 'api/user/role/list';
                params = {
                    user_id: options.user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'permissions':
                end_point = 'api/user/permission/list';
                params = {
                    user_id: options.user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'modules':
                end_point = 'api/user/module/list';
                params = {
                    user_id: options.user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'reports':
                end_point = 'api/user/report/permission';
                params = {
                    user_id: options.user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            default:
                end_point = null;
                break;
        }
        if(end_point){
            vsapi.call(`${main_view.base_url}/${end_point}`,params,options.button,false).then(res => {
                if(res.status_code === 200){
                    const d = res.data;
                    if(typeof onFinish === 'function') onFinish(d);
                }
            });
        }
    }

    this.controlModalBody = (options, modal, onFinish) => {
        const open = options.open;
        switch(open){
            case 'add-user':
                mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('Cancel','buttons')}</span>`;
                if(options.user_id > 0)
                {
                    mThis.elTitle.textContent = LocaleManager.trans('Modify User Account','titles');
                    mThis.btnSave.innerHTML = `<span>${LocaleManager.trans('Save','buttons')}</span>`;
                }   
                else
                {
                    mThis.elTitle.textContent = LocaleManager.trans('New User Account','titles');
                    mThis.btnSave.innerHTML = `<span>${LocaleManager.trans('Create','buttons')}</span>`;
                }
                modal.querySelector('.modal-dialog').classList.add('modal-lg');
                mThis.btnSave.removeAttribute('style');
                mThis.renderCreateUser(modal,options,onFinish); 
                break;
            case 'reset-password':
                mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('Cancel','buttons')}</span>`;
                mThis.elTitle.textContent = LocaleManager.trans('Set New Password','titles');
                modal.querySelector('.modal-dialog').classList.remove('modal-lg');
                mThis.btnSave.innerHTML =  `<span>${LocaleManager.trans('OK','buttons')}</span>`;
                mThis.btnSave.removeAttribute('style');
                mThis.renderResetPassword(modal,options,onFinish);
                break;
            case 'roles':
            case 'permissions':
            case 'modules':
            case 'reports':
                mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('OK','buttons')}</span>`;
                const purpose = open === 'roles' ? 'Role' : open === 'modules' ? 'Modules' : open === 'reports' ? 'Reports' : 'Permissions';
                mThis.elTitle.textContent = LocaleManager.trans(`Add/Remove ${purpose} for ${options.user_name ? options.user_name.replace(/^\w/, (c) => c.toUpperCase()) : 'Super Admin'}`,'titles');
                modal.querySelector('.modal-dialog').classList.add('modal-lg');
                mThis.btnSave.style.display = 'none';
                mThis.renderPermissions(modal,options,onFinish);
                break;
            default:
                break;
        }
    }
    /** 
     * For AddUserDialog can also be called from Merchant List or Driver List screen by providing with the default values in "options.default". 
     * The "options.default" is the default values to fill in the Create User Form.  options.default = {"official_code":sender.code,"user_class":"merchant","phone_number":sender.phone_number,"full_name":sender.name}
    */
    this.show = (options=null) => {
        if(!options) options = {};
        mThis.controlModalBody(options,this.self,()=>{
            const modalDiv = $(this.self);
            modalDiv.modal({
                backdrop: 'static'
            });
        });
    }
}