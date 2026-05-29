'use strict';
var UserManagementComponent = new function(){
    const mThis = this;
    this.title_prop = "User Management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_um_userManagementComponent');
    this.self = this.jm[0];
    this.btnNewUser = mThis.self.querySelector('#_um_btn_new');
    this.elSearch = mThis.self.querySelector('#_um_search_user');
    this.elfilter_user_role = mThis.self.querySelector('#_um_filter_userclass');
    this.btnPdf = mThis.self.querySelector('#_um_btn_pdf');
    this.btnPdf.style.display = 'none';
    this.containerPagination = mThis.self.querySelector('#container_pagination_um');
  
    this.init = () => {
        if(mThis.initAlready) return;
        mThis.userListView = new ListView('_um_container',{
            fetchApi: `${main_view.base_url}/api/user/list-paginate`,
            perPage: 5,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                // console.log('items',items);
                mThis.renderUserList(list_container,items);
            },
            listContainerClass: null
        });

        mThis.btnNewUser.onclick = function(e)
        {
            e.preventDefault();
     
            let op = {
                id:null,
                open:'add-user',
                btn: e.target,
                role_id: mThis.elfilter_user_role.value,
                onClose: (user)=>{
                   mThis.userListView.showPage(mThis.getFilterData());           
                }
            }

            if(op.role_id == 0 || !op.role_id || op.role_id == '')
            {
                cv_interact.warning('Please select a role, under which to create the new user');
                return;
            }
           
            CreateLoginDialog.show(op);

        };

        let timeOut = null;
        mThis.elSearch.onkeyup = function(e)
        {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(()=>{
                mThis.userListView.showPage(mThis.getFilterData());
            },250);
        }

        mThis.elfilter_user_role.onchange = function(e)
        {
            e.preventDefault();
            mThis.userListView.showPage(mThis.getFilterData());
        }

        // mThis.btnPdf.onclick = function(e)
        // {
        //     e.preventDefault();
        //     const html = `<ul class="list-filter-um">
        //         <li class="_um_permissions">
        //             <i class="fa-solid fa-user-lock fs-5 text-warning pe-2" role="button"></i>
        //             <a href="javascript:void(0)">Permissions</a>
        //         </li>
        //         <li class="_um_modules">
        //             <i class="fa-solid fa-user-minus fs-5 text-danger pe-2" role="button"></i>
        //             <a href="javascript:void(0)">Modules</a>
        //         </li>
        //     </ul>`;
        //     FilterDialog(e,{},html,(div) => {
        //         div.classList.remove('p-3'),
        //         div.style.left = 'unset',
        //         div.style.right = 10+'px';
        //         mThis.setPrint(div);
        //     });
        // }

        //this.listContainer = mThis.userListView.getListContainer();
        this.listContainer = mThis.userListView.getListContainer();
        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    }
    //END::UserManagementComponnet.init()
    this.changeUserLoginName = (op)=>{
        let dlg = '';
        if(op.user_id && op.user_id !== 'undefined')
            dlg = new GeneralDialog({
            title:"Modify UM Login Name", 
            cssClass:"modal-md",
            // fields:[
            //     {
            //         name:"from_date",
            //         label:"From Date",
            //         type:"string",
            //         required:true
            //     },
            //     {
            //         name:"to_date",
            //         label:"To Date",
            //         type:"string",
            //         required:true
            //     },
            //    {
            //      name:"amount",
            //      label:"Amount",
            //      type:"number",
            //      required:true
            //    },
            //    {
            //     name:"currency_code",
            //     label:"Currency",
            //     // type:"string",
            //     displayType:"select",
            //     required:true,
            //     // config:{
            //     //     data:'currency_code',
            //     //     valueField:'currency_code',
            //     //     textField:'currency_code',
            //     //     default:'USD',
            //     // }
            //    }
            // ],
            createFields:() =>{
                return [`<div class="row">
                            <div class="form-group col-md-12">
                                <label class="form-label" vslang="titles.User">Old Login Name</label>
                                <input type="text" value = "`,op.login_name,`" class="form-control data-input" data-field="user_id" placeholder="`,op.login_name,`" readonly />
                            </div>
                            <div class="form-group col-md-12">
                                <label class="form-label" vslang="titles.User">New Login Name</label>
                                <input type="text" class="form-control data-input" data-field="login_name" />
                            </div>                     
                        </div>`].join('');
            },
            // configSelect:[
            //     {
            //         name:"currency_code",
            //         data:'currency_code',
            //         valueField:'currency_code',
            //         textField:'currency_code',
            //         default:'USD',
            //         onChange:(selectElement,value)=>{}
            //     }
            // ],
            // prepareFormOptions:{
            //     createTitle:"Modify UM Role",
            //     modifyTitle:"Edit Role",
            //     api:{
            //     targetProp:"data",
            //     endpoint:`${mThis.base_url}/api/role/list`,
            //     //    params:()=>{
            //     //         return {'id':1};
            //     //     }
            //         // params: {id:1}
            //     }
            // },
            buttons:[
            {
                label:"Cancel",
                cssClass:"btn btn-secondary",
                action:"cancel",
                dismissModal:true,
                icon:""
            },
            {
                label:"OK",
                cssClass:"btn btn-info",
                icon:"",
                click:(me,btn,divModal)=>{
                    const p = dlg.getData();
                    p.user_id = op.user_id;
                    // console.log('p',p);

                    vsapi.call(`${main_view.base_url}/api/user/change-login-name`,p,false,false,false).then(res=>{
                        if (res.status_code === 200) {
                            cv_interact.success('Success!');
                            mThis.userListView.showPage(mThis.getFilterData());
                            me.hide();
                        }
                        else
                            cv_interact.error(res.error_message);
                    }); 
                }
            }
            ],
            // onPrepareForm:(instance,data,fields,divModal)=>{
            //     // console.log('fields',fields);
            //     fields.role_id.onchange = (e)=>{
            //         // console.log('date chang');
            //     }
            //     VSUtil.setComboItems(fields.role_id, data ,'id','name',false,null,null);
            // },
            onClose:(canceled)=>{
            //   alert(' Closing with cancel = ' + canceled);
            }
        });
        dlg.show(); 
        return;
    }

    // this.setLoginName = (user_id, lnk)=>{
    //     if (lnk) {
    //         let op = {
    //             button:null,
    //             user_id: lnk.dataset.id,
    //             login_name: lnk.dataset.user,
    //             onClose: () => {
    //                 mThis.userListView.showPage(mThis.getFilterData());
    //             }
    //         };
    //         if(!AuthManager.allowed(109)) return;
    //         if(op.user_id && op.user_id !== 'undefined')
    //            mThis.changeUserLoginName(op);
    //         return;
    //     }
    // }
 
    // this.editUser = (customer_id, lnk)=>{
    //     if (lnk) {
    //         const role_id = lnk.dataset.roleid;
    //             // if(!role_id || role_id==0){
    //             //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
    //             //   return;
    //             // }
    //             let op = {
    //                 user_id: lnk.dataset.id,
    //                 default:{
    //                     user_class: mThis.elfilter_user_role.value
    //                 },
    //                 open: 'add-user',
    //                 onClose: () => {
    //                     mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
    //                 }
    //             };
    //             // if(!AuthManager.allowed(112)) return;
    //             if(op.user_id && op.user_id !== 'undefined') UserDialog.show(op);
    //         return;
    //     }
    // }

    this.deleteUser = (user_id, lnk)=>{
        if (lnk) {
            let op = {
                user_id: user_id
            };
            if(!AuthManager.allowed(101)) return;
            if(op.user_id)
            {
                if (AuthManager.user.id == (op.user_id ?? op.id)) {
                    cv_interact.warning('Cannot delete yourself!');
                    return;
                }
                cv_interact.confirm('Delete this user?',{
                    title: 'Delete User',
                    context: 'delete'
                },(e) => {
                    if(e)
                    {
                       
                        vsapi.call(`${main_view.base_url}/api/user/delete`,op,null).then(res => {
                            if(res.status_code === 200)
                            {
                                mThis.userListView.showPage(mThis.getFilterData());
                            }
                            else
                            {
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
            }
            return;
        }
    }
 
    this.initDropdownMenus = (Container)=>{
        const menuOptopns = {
            containerElement: Container,
            actionButtonClass:"btn_um_action",
            cssClass:"bg-white shadow",
            //menuItemClass:"",
            menus:[
                {
                    html:'<span class="ps-2  " vslang="titles.Set Base Campus">Set Base Campus</span>',
                    icon:`<i class="fa-solid fa-user-pen fs-5 text-info"></i>`,
                    cssClass:"border-bottom pb-2",
                    name:"assign_branch"
                },
                {
                //text:"",
                html:'<span class="ps-2 " vslang="titles.Change Login Name">Change Login Name</span>',
                icon:`<i class="fas fa-pen-square fs-5 text-success"></i>`,
                cssClass:"border-bottom pb-2",
                name:"change_login_name"
                },
                {
                //text:"",
                html:'<span class="ps-2 " vslang="titles.Set Password">Set Password</span>',
                icon:`<i class="fa-regular fa-list-alt fs-5 text-success"></i>`,
                cssClass:"border-bottom pb-2",
                name:"change_password"
                },
                // {
                //     html:'<span class="ps-2  " vslang="titles.Modify User">Modify User</span>',
                //     icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                //     cssClass:"border-bottom pb-2",
                //     name:"edit_user"
                // },
                {
                html:'<span class="ps-2  " vslang="titles.Delete User">Delete User</span>',
                icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                cssClass:"border-bottom pb-2",
                name:"delete_user"
                },
                    
            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick:(menuLink, id, name)=>{
                switch(name){
                    //set_password
                    case 'assign_branch':{
                        mThis.assignCampus(id, menuLink); //Not yet defined
                        break;
                    }
                    case 'change_password':{
                        if (!AuthManager.allowed(109)) return;
                        let login_name = menuLink.dataset.loginname;
                        let op = {
                           user_id: id, 
                           login_name:login_name, 
                           onClose:()=>{
                             return;
                           }
                        }
                        SetPasswordDialog.show(op);
                        break;
                    }
                    case 'change_login_name':{
                        let prev_login_name = menuLink.dataset.loginname;
                        let op = {
                           login_name: prev_login_name,
                           id:id,
                           onClose:(p)=>{
                              return;
                           }
                        };
                        ChangeLoginNameDialog.show(op);
                        break;
                    }
                    case 'edit_user':{
                      mThis.editUser(id, menuLink);
                      break;
                    }
                    case 'delete_user':{
                        mThis.deleteUser(id, menuLink);
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

    this.assignCampus = (user_id, lnk,onFinish = null)=>{
        
        if (lnk) {
                // if(!role_id || role_id==0){
                //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                //   return;
                // }
                let op = {
                    user_id: lnk.dataset.id,
                    default:{
                        user_class: mThis.elfilter_user_role.value
                    },
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                let d = [];
                mThis.getDataCampus(user_id,onFinish =>{
                    d = onFinish;
                    let AssignCampusDialog = '';
                    if(op.user_id && op.user_id !== 'undefined')
                        AssignCampusDialog = new GeneralDialog({
                        title:"Set Base Campus", 
                        cssClass:"modal-md",
                        // showCancelButton:true,
                        createFields:() =>{
                            console.log(1111,d);
                            return mThis.renderAssignCampusTableBody(d);
                        },
                        configSelect:[
                            {
                                name:"currency_code",
                                data:'currency_code',
                                valueField:'currency_code',
                                textField:'currency_code',
                                default:'USD',
                                onChange:(selectElement,value)=>{}
                            }
                        ],
                        prepareFormOptions:{
                            createTitle:"Set Base Campus",
                            api:{
                            // targetProp:"users",
                            endpoint:`${mThis.base_url}/api/branch/form-options`,
                            //    params:()=>{
                            //         return {'id':1};
                            //     }
                                // params: {id:1}
                            }
                        },
                        buttons:[
                        // {
                        //     label:"Cancel",
                        //     cssClass:"btn btn-secondary",
                        //     action:"cancel",
                        //     dismissModal:false,
                        //     icon:""
                        // },
                        {
                            label:"OK",
                            cssClass:"btn btn-info",
                            icon:"",
                            click:(me,btn,divModal)=>{
                                // const p = me.getData();
                                // p.user_id = op.user_id;
                                // console.log('p',p);
                                // cv_interact.error("Not yet allow");
                                // p.category =lnk.dataset.category??'bill_payment';
        
                                // vsapi.call(`${main_view.base_url}/api/user/role-change`,p,false,false,false).then(res=>{
                                //     if (res.status_code === 200) {
                                //         cv_interact.success('Success!');
                                //         mThis.userListView.showPage(mThis.getFilterData());
                                        me.hide();
                                //     }
                                //     else
                                //         cv_interact.error(res.error_message);
                                // }); 
                            }
                        }
                        ],
                        onPrepareForm:(instance,data,fields,divModal)=>{
                            // console.log('data',data);
                            // VSUtil.setComboItems(fields.user_id, data.users ,'id','user_name',false,null,null);
                            divModal.onclick = e =>{
                                e.preventDefault();
                                let btn = VSUtil.closestLimited( e.target,'.link_check_branch');
                                if(btn){
                                   mThis.toggleCheck(btn,user_id);
                                   return;
                                }
                           }
                        },
                        onClose:(canceled)=>{
                        //   alert(' Closing with cancel = ' + canceled);
                        }
                    });
                    AssignCampusDialog.show(op);
                });
                // if(!AuthManager.allowed(112)) return;

            return;
        }
    }
    this.toggleCheck = (btn,user_id)=>{
        let state = btn.dataset.state;
        state = state ==1? 0:1;
        //let x = btn.querySelector('a.link_check_app'); 
        if(state == 0){
           btn.innerHTML ='<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
           btn.dataset.state =0;
        }else if (state ==1){
           btn.innerHTML ='<i class="fa fa-check text-success fs-3 fw-bold "></i>';
           btn.dataset.state = 1;  
        }

        let allowed = state;
        let div = btn.closest('div.um_branch');
        let branch_id = div.dataset.id;  
        onAppStatusChange(branch_id, allowed ,user_id);
    }
    function onAppStatusChange(branch_id, allowed ,user_id) {
        let p = {user_id: user_id, branch_id: branch_id, allowed : allowed};
        console.log(444,p);
        vsapi.call(`${main_view.base_url}/api/user/branch/set`,p,false,false,false).then(res =>{
            if(res.status_code ==200){
            }else cv_interact.warning(res.error_message);
        });
    }
    this.getDataCampus = (user_id,onFinish) => {
        vsapi.call(`${main_view.base_url}/api/branch/form-options`,{user_id : user_id},null,false).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data ?? [];
                console.log(222,d);
                if(typeof onFinish === 'function') onFinish(d);
             }
             else cv_interact.error('error');
        });
    }
    this.renderAssignCampusTableBody = (d) => {
        let table = ``;
        let thead = '';
        let tbody = '';
        console.log('d',d);
       

                Object.keys(d || {}).forEach(key => {
                    if(key=='branches'){
                        thead = `<thead>
                            <div class="border-bottom ">
                                <h6 class=" text-nowrap text-uppercase">${key}</h6>
                            </div>
                        </thead>`;
                        table += thead;
                        let module_id = '';
                        if(!d['branches'] || d['branches'] == ''){
                            tbody = `<div>
                                    <span class=" d-flex align-items-center justify-content-center align-items-center"><span class="">No ${key} List </span> </span>
                                </div>`;
                        }else{
                            (d[key] || []).forEach(item => {
                                const allowed = (item.allowed || 0);    
                                let checkStatus = (allowed ==1) ? '<i class="fa fa-check text-success fs-3 fw-bold "></i>' : '<i class="fa fa-times text-danger fs-3 fw-bold "></i>';
                                tbody += [`<div data-id="`,item.id,`" class ="um_branch d-flex align-items-center gap-3 border-bottom">`,
                                            `<div class="um_branch_check ps-3 d-flex justify-items-center justify-content-center border border-secondary rounded-5 p-1" style="width:35px;height:35px"><a href="javascript:void(0)" data-state="`,allowed,`" class="link_check_branch">`,checkStatus,`</a></div>`,
                                            `<div class=" text-uppercase "><span class="align-middle ">${item.branch_name ?? ''} </span></div>`,
                                        `</div>`].join('');
                            });
                        }
                    }
                    table += tbody;
                    tbody = '';
                });

        return table;
    }

    this.setPrint = (div) => {
        div.onclick = function(e)
        {
            e.preventDefault();

            let lnk = VSUtil.getElementByClass(e.target,'_um_permissions');
            if(lnk)
            {
                mThis.loadFormPrint('permissions','api/permission/list');
                return;
            }

            lnk = VSUtil.getElementByClass(e.target,'_um_modules');
            if(lnk)
            {
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
                switch(open)
                {
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
                                (d || []).forEach(item => {
                                    tbody += `<tr>
                                        <td class="fw-bold">${item.id || ''}</td>
                                        <td>${item.name || ''}</td>
                                        <td>${item.module_name || ''}</td>
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
                                (d || []).forEach(item => {
                                    tbody += `<tr>
                                        <td class="fw-bold">${item.id || ''}</td>
                                        <td>${item.ref_code || ''}</td>
                                        <td>${item.module_name || ''}</td>
                                    </tr>`;
                                }), tbody}
                            </tbody>
                        </table>`;
                        break;
                    default:
                        break;
                }

                if(html)
                {
                    let myWindow = window.open('','PRINT');
                    myWindow.document.write(`<!DOCTYPE html>
                    <html >
                        <head>
                            <title class="text-capitalize">User ${open || ''}</title>
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
            else
            {
                cv_interact.error(res.error_message ?? 'Failed to load data!');
            }
        });
    }

    this.renderUserList = async (div,items) => {
        items = items ?? [];
        if(!AuthManager || typeof AuthManager ==='undefined')
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        AuthManager.init().then(user => {
           mThis.beginRenderUsers(div,items,user)
        });
    }

    this.beginRenderUsers = (div,items,current_user) => {
        const d = current_user;
        let html = '';
        let cnt = 0;
        items.forEach(user => {
            let cls_lock_class = (user.status && user.status.toLowerCase() == 'active' ) ? '' : 'border-danger border-2';
            const login_name_text = current_user.id == user.id ? [user.login_name,' <span class="text-danger">(You)</span>'].join('') : user.login_name;
            html = [html,`<div data-roleid="`,(user.role_id || user.primary_role_id),`" class="user-card ${user.id === d.id ? 'set-half-border ' : ''}w-100 rounded-2 p-3 shadow bg-white mb-3 position-relative">
                <div class="scope-user row gy-2">
                    <div class="col-lg-2">
                        <div class="d-flex h-100">
                            <div class="width-profile-container rounded-4 set-user-profile">
                                <img style="border-radius:50%" class="img-user-profile object-fit-scale shadow `,cls_lock_class,`" src="`,user.image_url,`" alt=" " />
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="d-block">
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Login :</span>
                                <span class="text-capitalize">`,login_name_text,`</span>
                                <span class="text-capitalize ms-3 custom-buttons" >
                                    <a href="javascript:void(0)" data-id="${user.id}" data-user="${user.login_name}" class="btn-um-login-name">
                                        <i class="fas fa-pen-square text-info fs-4"></i>
                                    </a>
                                </span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Full Name :</span>
                                <span class="text-capitalize">${user.full_name || 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">User Class :</span>
                                <span class="text-capitalize">${user.user_class || 'N/A'}</span>
                            </p>
                            <p class="text-nowrap">
                                <span class="text-capitalize text-width-user">Role :</span>
                                <span class="text-capitalize">${(user.primary_role || user.role_name) || 'N/A'}</span>
                                <span class="text-capitalize ms-3 custom-buttons" >
                                    <a href="javascript:void(0)" data-id="${user.id}" data-roleid="${user.role_id}" data-loginname="${user.login_name}" class="lnk_change_role">
                                        <i class="fa fa-edit text-success fs-5"></i>
                                    </a>
                                </span>
                                
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
                            <button class="btn_um_action btn btn-sm btn-info rounded-5 text-nowrap" type="button" data-loginname="${user.login_name}" data-roleid = "${(user.role_id || user.primary_role_id) ||''}" data-id="${user.id}" data-user="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">
                                <span class=" " vslang="buttons.Action">Action</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div style="min-height:35px" class="d-flex justify-content-left gap-3 pl-2 pt-2 w-100 custom-buttons border-top border-secondary">
                   
                    <button class="btn-um-permissions d-none btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">`,LocaleManager.trans('Permissions','titles'),`</span>
                    </button>
                    <button class="btn-um-modules d-none btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">`,LocaleManager.trans('Modules','titles'),`</span>
                    </button>
                    <button class="btn-um-reports btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-roleid="${user.role_id}" data-user="${user.login_name}">
                        <span class="text-nowrap">`,LocaleManager.trans('Authorization','titles'),`</span>
                    </button>
                    <button class="btn-um-lock btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">
                        <span class="text-nowrap">`,user.is_locked ? LocaleManager.trans('Unlock','titles') : LocaleManager.trans('Lock','titles') ,`</span>
                    </button>
                    <button class="btn-um-set-password btn btn-sm btn-outline-primary rounded-4" data-id="${user.id}" data-user="${user.login_name}">
                        <span class="text-nowrap">`,LocaleManager.trans('Set Password','titles'),`</span>
                    </button>
                </div>
            </div>`].join('');
            cnt++;
        });
        if (cnt ===0) { 
            let text = mThis.elSearch.value ?  LocaleManager.trans('No matched users found!','titles') : LocaleManager.trans('There are no users yet in this role','titles');
             html = ['<div class="d-flex justify-content-center align-items-center p-3 p-4 border-secondary rounded-3 m-2"><span class="fs-4 text-muted fw-semibold">',text,'</span></div>'].join('');
        }
        div.innerHTML = html;

        
        const parent = div.parentElement;
        parent.style.height = (window.innerHeight - 210)+'px';
        window.onresize = function(e)
        {
            e.preventDefault();
            parent.style.height = (window.innerHeight - 210)+'px';
        }
        // mThis.setMenuAction(div.querySelectorAll('.btn-action'));
        div.querySelectorAll('.custom-buttons').forEach(ctn => {
            mThis.setEvent(ctn);
        });
        const cards = div.querySelectorAll('.user-card');
        //mThis.initDropdownMenusButton(cards);
    }

    
    // this.initDropdownMenusButton = (cards)=>{
    //     cards.forEach(card=>{
    //         const dMenu = new VSDropdownButton({
    //             menus:[
    //                 {
    //                     label:` <i class="fa-regular fa-pen-to-square fs-5"></i><span class="ps-2  " vslang="titles.Modify Merchant"></span>`,
    //                     name:"edit_merchant"
    //                 },
    //                 {
    //                     label:'<i class="fa-regular fa-list-alt fs-5"></i><span class="ps-2 menu-text" vslang="titles.Set Price List"></span>',
    //                     name:"set_price_list"
    //                 },
    //                 {
    //                     label:' <i class="fa-regular fa-trash-can fs-5 text-warning"></i><span class="ps-2  " vslang="titles.Delete Merchant"></span>',
    //                     name:"delete_merchant"
    //                 },
    //                 {
    //                     label:' <i class="fa-regular fa-refresh fs-5 text-warning"></i><span class="ps-2  " vslang="titles.Reverse to Prospect"></span>',
    //                     name:"reverse_to_lead"
    //                 },
    //             ],
    //             click:(me, btn)=>{
    
    //             }
    //         });

    //     });

    //     mThis.dMenus = mThis.dMenus || [];
    //     mThis.dMenus.push(dMenu);
    // }
    
    this.setMenuAction = (buttons) => {
        buttons.forEach(btn => {
            btn.onclick = function(e)
            {
                e.preventDefault();
                const id = (e.target.dataset.id || e.target.parentElement.dataset.id),
                user_name = e.target.parentElement.dataset.user,
                is_locked = e.target.parentElement.dataset.lock,
                role_id = e.target.parentElement.dataset.roleid;
                if(id)
                {
                    const html = [`<ul class="list-unstyled set-bottom-border pb-0 mb-0">
                        <li class="p-2 text-nowrap btn-um-delete" data-id="${id}" data-user="${user_name}">
                            <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                            <span class="ps-2">Delete</span>
                        </li>
                        <li class="p-2 text-nowrap btn-um-modify" data-loginname="" data-roleid="${role_id}" data-id="${id}" data-user="${user_name}">
                            <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                            <span class="ps-2">Edit</span>
                        </li>
                    </ul>`].join('');
                    // const html = [`<ul class="list-unstyled set-bottom-border pb-0 mb-0">
                    //     <li class="p-2 text-nowrap btn-um-delete" data-id="${id}" data-user="${user_name}">
                    //         <i class="fa-regular fa-trash-can fs-5 text-danger"></i>
                    //         <span class="ps-2">Delete</span>
                    //     </li>
                    //     <li class="p-2 text-nowrap btn-um-modify" data-roleid="${role_id}" data-id="${id}" data-user="${user_name}">
                    //         <i class="fa-regular fa-pen-to-square fs-5 text-warning"></i>
                    //         <span class="ps-2">Edit</span>
                    //     </li>
                    //     <li class="p-2 text-nowrap btn-um-lock" data-id="${id}" data-user="${user_name}" data-lock="${is_locked}">
                    //         ${is_locked === 'lock' ? '<i class="fa-solid fa-ban text-danger fs-5"></i>' : '<i class="fa-solid fa-lock-open text-success fs-5"></i>'}
                    //         <span class="ps-2 text-capitalize">${is_locked}</span>
                    //     </li>
                    //     <li class="p-2 text-nowrap btn-um-set-password" data-id="${id}" data-user="${user_name}">
                    //         <i class="fa-solid fa-user-lock fs-5 text-primary-emphasis"></i>
                    //         <span class="ps-2">Set Password</span>
                    //     </li>`,
                    //     `<li class="p-2 text-nowrap btn-um-permissions" data-id="${id}" data-user="${user_name}">
                    //         <i class="fa-solid fa-user-pen fs-5 text-warning-emphasis"></i>
                    //         <span class="ps-2">Permissions</span>
                    //     </li>
                    //     <li class="p-2 text-nowrap btn-um-modules" data-id="${id}" data-user="${user_name}">
                    //       <i class="fa-solid fa-user-pen fs-5 text-warning-emphasis"></i>
                    //       <span class="ps-2">Modules</span>
                    //     </li>
                    //     <li class="p-2 text-nowrap btn-um-reports" data-id="${id}" data-user="${user_name}">
                    //         <i class="fa-regular fa-rectangle-list fs-5 text-primary"></i>
                    //         <span class="ps-2">Reports</span>
                    //     </li>
                    // </ul>`].join('');
                    // const dynamicBtnsListCtn = document.body;
                    FilterDialog(e,{},html,(div) => {
                        mThis.setEvent(div);
                    });
                }
            };
        });
    }

    this.setEvent = (div) => {
        if(!div) return;
        div.onclick = function(e)
        {
            e.preventDefault();
            let btn = VSUtil.closestLimited(e.target,'.btn-um-delete');
            if(btn)
            {
                let op = {
                    user_id: btn.dataset.id
                };
                if(!AuthManager.allowed(101)) return;
                if(op.user_id)
                {
                    cv_interact.confirm('Delete this user?',{
                        title: 'Delete User',
                        context: 'delete'
                    },(e) => {
                        if(e)
                        {
            
                            if (AuthManager.user.id == (op.id ?? op.user_id)) {
                                cv_interact.warning('Cannot delete yourself!');
                                return;
                            } 
                            vsapi.call(`${main_view.base_url}/api/user/delete`,op,false).then(res => {
                                if(res.status_code === 200)
                                {
                                    mThis.userListView.showPage(mThis.getFilterData());
                                }
                                else
                                {
                                    cv_interact.error(res.error_message ?? 'Something went wrong 312!');
                                }
                            });
                        }
                    });
                }
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-modify');
            if(btn)
            {
                //get primary role_id. If user does not have primary role_id, then do not allow edit information
                const role_id = div.dataset.roleid;
                // if(!role_id || role_id==0){
                //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                //   return;
                // }
                let op = {
                    user_id: btn.dataset.id,
                    default:{
                        user_class: mThis.elfilter_user_role.value
                    },
                    open: 'add-user',
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                if(!AuthManager.allowed(112)) return;
                if(op.user_id && op.user_id !== 'undefined') UserDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-lock');
            if(btn)
            {
                let op = {
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    action: btn.dataset.lock
                };
                if(!AuthManager.allowed(113)) return;
                const action =(op.action || '').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                cv_interact.confirm(['Do you want to ',op.action || '',' user ',op.user_name.replace(/^\w/, (c) => c.toUpperCase()),'?'].join(''),{
                    title: `${op.action || ''} User`,
                    context: `update`,
                    confirmButtonText:`${action || ''} Now`
                },(e) => {
                    if(e)
                    {
                        delete(op.user_name);
                        vsapi.call(`${main_view.base_url}/api/umt-settings/set-lock-status`,op,null,false).then(res => {
                            if(res.status_code === 200)
                            {
                                const parentElement = button ? button.closest('.scope-user') : div.previousElementSibling;
                                btn = button ? button : btn;
                                mThis.resetUserStatus(parentElement,btn,op);
                            }
                            else
                            {
                                cv_interact.error(res.error_message);
                            }
                        });
                    }
                });
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-set-password');
            if(btn)
            {
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
                    // UserMDialog.show(op);
                    SetPasswordDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.lnk_change_role');
            if(btn)
            {
                let d = btn.dataset
                let op = {
                    button:null,
                    id: d.id,
                    role_id: d.roleid,
                    login_name: d.loginname,
                    onClose:(d)=>{
                        btn.dataset.roleid = d.id;
                        cv_interact.success(['Role has been changed successfully',(d ? ` to ${d.role_name}`: '')].join(''));
                        mThis.userListView.showPage(mThis.getFilterData());
                    }
                };
                ChangeRoleDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-login-name');
            if(btn)
            {
                let op = {
                    button:null,
                    id: btn.dataset.id,
                    login_name: btn.dataset.user,
                };
                // mThis.changeUserLoginName(op);
                ChangeLoginNameDialog.show(op);
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-permissions');
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'permissions'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    UserMDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-modules');
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    open: 'modules'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    UserMDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-reports');
            console.log(123,btn);
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    role_id: btn.dataset.roleid,
                    user_name: btn.dataset.user,
                    open: 'reports'
                };
                if(op.user_id && op.user_id !== 'undefined')
                    UserMDialog.show(op);
                return;
            }
        };
       
    }

    this.resetUserStatus = (div,btn,options) => {
        const containerIcon = div.querySelector('.width-locked-icon');
        const img = div.querySelector('img.img-user-profile');
        let btnAction = null;
        if(btn.classList.contains('btn-action'))
        {
            btnAction = div.nextElementSibling.querySelector('.btn-um-lock');
            if(options.action === 'lock')
            {
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
        else
        {
            btnAction = div.querySelector('.btn-action');
            if(options.action === 'lock')
            {btn-um-permissions
                btn.dataset.lock = 'unlock',
                btnAction.dataset.lock = 'unlock';
                btn.children[0].textContent = 'Unlock';
                containerIcon.innerHTML = '<i class="fa-solid fa-ban fs-4 text-danger"></i>';
                if(img) img.classList.add('border-2','border-danger');
            }
            else
            {
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
            role_id: mThis.elfilter_user_role.value,
            search_value: mThis.elSearch.value
        }
    }

    this.prepareFormOption = (onFinish=null) => {
        vsapi.call(`${main_view.base_url}/api/role/list`,null,null,false).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data ?? [],
                el = mThis.elfilter_user_role;
                VSUtil.setComboItems(el,d,'id','name',true,'All',null);
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
                mThis.jm.siblings().hide();
                mThis.jm.fadeIn(250);
            });
        });
    }
}
 
// const SetPasswordDialog = new GeneralDialog({
//     //dialogId:"resetpass", 
//     title:"Set Password",
//     showCancelButton:false,
//     //dialogId:"resetpwd",
//     fields:[
//        {
//          name:"password",
//          label:"Password",
//          type:"password",
//          required:true
//        },
//        {
//         name:"confirm_password",
//         label:"Conform Password",
//         type:"password",
//         required:true
//        },
//     ],
//     buttons:[
//      {
//          label:"<span>Set Now</span>",
//          cssClass:"btn btn-info",
//          icon:"",
//          click:(me,btn,divModal)=>{
//             let p = me.getData();
//             if(!p.password || p.password ==''){
//              cv_interact.error('Password is required');
//              return;
//            }

//             if(p.password !== p.confirm_password){
//                cv_interact.error('Password and confirmed password do not match');
//                return;
//             }
//             vsapi.call(`${main_view.base_url}/api/user/set-password`,p,btn,false,false).then(res=>{
//                  if (res.status_code ==200){
//                      me.hide();
//                      cv_interact.success('Password has been changed');
//                  }else cv_interact.error(res.error_message);
//             }); 
//          }
//      }
//     ],
//     //    override:{
//     //      getData:(me,divModal)=>{
//     //         return {new_prop:"111", newOne:"222"};
//     //      }
//     //    },
//     //    extendMethod:{
//     //      setData:(me,data,divModal)=>{
            
//     //      }
//     //    },
//     // onClose:(canceled)=>{
//     //    return;
//     // }
//  });

//  const UserMDialog = new function(){
//     const mThis = this;
//     this.self = main_view.appContent.children('#_dlg_um_')[0];
//     this.modal = new bootstrap.Modal(this.self);
//     this.elTitle = mThis.self.querySelector('.modal-title');
//     this.btnSave = mThis.self.querySelector('#dlg_um_btn_save');
//     this.btnClose = mThis.self.querySelector('#dlg_um_btn_close');
//     this.selected_options = {};

//     /** Set event handlers */
//     this.DBX::saveData = (modal,btnSave,end_point,options) => {
//         btnSave.onclick = function(e)
//         {
//             e.preventDefault();
//             let p = null;
//             if(options.open === 'add-user')
//             {
//                 p = mThis.getDataForm(modal);
//                 //p.user_id = options.user_id;
//                 p.id = options.user_id;
//                 if(p.password === p.confirm_password)
//                 {
//                     delete(p.confirm_password);
//                     vsapi.call([main_view.base_url,end_point].join(''),p,btnSave).then(res => {
//                         if(res.status_code === 200)
//                         {
//                             $(mThis.self).modal('hide');
//                             let msg =['New login "',p.login_name || '','"', (p.full_name ? ` for ${p.full_name}`:''),' has been created successfully!'].join('');
//                             if(p.id > 0 || p.user_id > 0) msg = ['Account info for user ',(p.full_name ?? p.login_name),' was successfully updated'].join('');
//                             cv_interact.success(msg);
//                             if(typeof options.onClose === 'function') options.onClose();
//                         }
//                         else
//                         {
//                             cv_interact.error(res.error_message );
//                         }
//                     });
//                 }
//                 else
//                 {
//                     cv_interact.warning("Password and confirm password not match");
//                 }
//             }
//             else
//             {
//                 p = mThis.getDataForm(modal);
//                 // p.login_name = options.user_name;
//                 p.user_id = options.user_id;
//                 if(p.password == p.confirm_password)
//                 {
//                     delete(p.confirm_password);
//                    // console.log(123,p);

//                     vsapi.call(`${main_view.base_url+end_point}`,p,btnSave).then(res => {
//                         if(res.status_code === 200)
//                         {
//                             $(mThis.self).modal('hide');
//                             cv_interact.success('successfully!')
//                             if(typeof options.onClose === 'function') options.onClose();
//                         }
//                         else
//                         {
//                             cv_interact.error(res.error_message );
//                         }
//                     });
//                 }
//                 else
//                 {
//                     cv_interact.warning("Passwords do not match");
//                 }
//             }
//         }
//     }

//     this.getDataForm = (div) => {
//         let p = {};
//         div.querySelectorAll('.data-input').forEach(el => {
//             const f = el.dataset.field;
//             if(el.tagName === 'IMG')
//                 p[f] = el.src;
//             else
//                 p[f] = el.value;
//         });
//         return p;
//     }

//     this.setImage = (btn_chooser,image) => {
//         const div = btn_chooser.parentElement;
//         let html = '';
//         if(image)
//         {
//             html = `<img class="w-100 h-100 object-fit-scale data-input" src="${image}" alt="" data-field="photo"/>
//             <div class="position-absolute top-0 end-0 rounded-3 bg-dark p-2">
//                 <a href="javascript:void(0)" class="btn-um-delete-img">
//                     <i class="fa-regular fa-trash-can text-danger fs-5"></i>
//                 </a>
//             </div>`;
//         }
//         else
//         {
//             html = `<div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
//                 <i class="fa-regular fa-image text-muted fs-5"></i>
//             </div>`;
//         }

//         div.innerHTML = html;
//         mThis.setDeleteImage(div);
//     }

//     this.setDeleteImage = (div) => {
//         const btn_delete = div.querySelector('.btn-um-delete-img');
//         btn_delete.onclick = function(e)
//         {
//             e.preventDefault();
//             const html = `<div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
//                 <i class="fa-regular fa-image text-muted fs-5"></i>
//             </div>`;
//             div.innerHTML = html;
//             mThis.setChooseImage(div);
//         };
//     }

//     this.setChooseImage = (div) => {
//         const btn_chooser = div.querySelector('#_um_profile_show');
//         btn_chooser.onclick = function(e)
//         {
//             e.preventDefault();
//             FileChooser.chooseFile(null,(d) => {
//                 if(d)
//                 {
//                     mThis.setImage(btn_chooser,d.dataUrl);
//                 }
//             });
//         };
//     }

//     this.validatePassword = (div) => {
//         let inputList = [];

//         div.querySelectorAll('.data-validate').forEach(el => {
//             el.nextElementSibling.onclick = function(e)
//             {
//                 e.preventDefault();
//                 const elChild = this.children[0];
//                 if(el.type === 'password')
//                 {
//                     el.type = 'text';
//                     elChild.classList.add('text-success'),
//                     elChild.classList.remove('text-muted');
//                     return;
//                 }
//                 else
//                 {
//                     el.type = 'password';
//                     elChild.classList.remove('text-success'),
//                     elChild.classList.add('text-muted');
//                 }
//             };
//             inputList.push(el);
//         });
//         if(!inputList[0]) return;

//         inputList[0].oninput = function(e)
//         {
//             e.preventDefault();
//             if((this.value === inputList[1].value) && !(this.value === ''))
//             {
//                 this.classList.remove('border-danger');
//                 inputList[1].classList.remove('border-danger');
//             }
//             else
//             {
//                 this.classList.add('border-danger');
//                 inputList[1].classList.add('border-danger');
//             }
//         };

//         inputList[1].oninput = function(e)
//         {
//             e.preventDefault();
//             if((this.value === inputList[0].value) && !(this.value === ''))
//             {
//                 this.classList.remove('border-danger');
//                 inputList[0].classList.remove('border-danger');
//             }
//             else
//             {
//                 this.classList.add('border-danger');
//                 inputList[0].classList.add('border-danger');
//             }
//         };
//     }

//     this.renderCreateUser = (modalDiv,options, onFinish) => {
//         const def = options.default || {};
//         const div = modalDiv.querySelector('.modal-body');
//         vsapi.call(`${main_view.base_url}/api/user/form-options`,null,options.button,false).then(res => {
//             if(res.status_code === 200)
//             {
//                 const d = res.data;
//                // console.log('d',d);
//                 let option = '';
//                 let option_roles = '';
//                 let user_id = options.user_id > 0 ? options.user_id : options.id;
//                 let user_class = user_id > 0 ? 'Official': (def.user_class ?? ' Official');
//                 user_class = user_class.replace(/\_/g,' ');
//                 let password_fields = '';

//                 if(!user_id || user_id == 0)
//                 {
//                     password_fields = `<div class="row gy-2">
//                     <div class="col-lg-6">
//                         <div class="form-group">
//                             <label for="password" class="form-label  " vslang="titles.Password"></label>
//                             <div class="input-group flex-nowrap">
//                                 <input type="password" class="form-control ${user_id > 0 ? '' : 'data-input'} data-validate" ${user_id > 0 ? '' : 'data-field="password"'} autocomplete="off" ${user_id > 0 ? 'readonly' : ''}/>
//                                 <div class="input-group-text" role="button">
//                                     <i class="fa-regular fa-eye fs-5 text-muted"></i>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="col-lg-6">
//                         <div class="form-group">
//                             <label for="confirm_password" class="form-label  " vslang="titles.Confirm Password"></label>
//                             <div class="input-group flex-nowrap">
//                                 <input type="password" class="form-control ${user_id > 0 ? '' : 'data-input'} data-validate" ${user_id > 0? '' : 'data-field="confirm_password"'} autocomplete="off" ${user_id >0 ? 'readonly' : ''}/>
//                                 <div class="input-group-text" role="button">
//                                     <i class="fa-regular fa-eye fs-5 text-muted"></i>
//                                 </div>
//                             </div>
//                         </div>
//                      </div>
//                     </div>`;
//                 }
//                 const html = `<form action="" method="POST" autocomplete="off">
//                     <div class="row gy-2 align-items-end">
//                         <div class="col-lg-6">
//                             <div class="row gy-2 align-items-end">
//                                 <div class="col-lg-5">
//                                     <div class="form-group">
//                                         <label for="user_profile" class="form-label  " vslang="titles.Profile Photo"></label>
//                                         <div class="container-user-profile">
//                                             <div id="_um_profile_show" class="d-flex align-items-center justify-content-center rounded-3 w-100 h-100">
//                                                 <i class="fa-regular fa-image text-muted fs-5"></i>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div class="col-lg-7">
//                                     <div class="form-group">
//                                         <label for="user_class" class="form-label  " vslang="titles.User Class"></label>
//                                         <div class="width-select-dialog custom-modal-select">
//                                             <select class="modal-select2 bg-white border-0 data-input user-class" data-field="user_class" ${options.user_id ? ' disabled' : ''}>
//                                                 ${option=null,
//                                                 (d.user_classes || []).forEach(op => {
//                                                     option += `<option value="${op.user_class}">${op.user_class_name || ''}</option>`;
//                                                 }),option+'<option value="" selected></option>'}
//                                             </select>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div class="col-lg-6">
//                             <div class="form-group">
//                                 <label for="role_id" class="form-label  " vslang="titles.Role"></label>
//                                 <div class="width-select-dialog">
//                                     <select class="modal-select2 user-role data-input" data-field="role_id" ${options.user_id ? ' disabled' : ''}>
                                        
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row gy-2">
//                         <div class="col-lg-6">
//                             <div class="form-group">
//                                 <label for="login_name" class="form-label  " vslang="titles.Login Name"></label>
//                                 <input type="text" class="form-control data-input" data-field="login_name" ${options.user_id ? ' disabled' : ''}/>
//                             </div>
//                         </div>
//                         <div class="col-lg-6">
//                             <div class="form-group">
//                                 <label for="full_name" class="form-label  " vslang="titles.Full Name"></label>
//                                 <input type="text" class="form-control data-input" data-field="full_name"/>
//                             </div>
//                         </div>
//                     </div>
//                     <div class="row gy-2">
//                         <div class="col-lg-6">
//                             <div class="form-group">
//                                 <label for="offical_id" class="um_label_official_code form-label  " vslang="titles.${user_class ? VSUtil.properCase(user_class) : 'Official'} ID"></label>
//                                 <input type="text" class="form-control data-input" data-field="official_code"/>
//                             </div>
//                         </div>
//                         <div class="col-lg-6">
//                             <div class="form-group">
//                                 <label for="phone_number" class="form-label  " vslang="titles.Phone Number"></label>
//                                 <input type="text" class="form-control data-input" data-field="phone_number"/>
//                             </div>
//                        </div>
//                     </div>
//                     ${password_fields}
//                 </form>`;
//                 div.innerHTML = html;
//                 let labelOfficialId = div.querySelector('.um_label_official_code');
//                 let elUserClass = null;
//                 let elUserRole = null;
//                 const selectList = div.querySelectorAll('select.modal-select2');
//                 selectList.forEach(el => {
//                     let f = el.dataset.field;
//                     if(f === "user_class")
//                         elUserClass = el;
//                     else if(f==="role_id")
//                         elUserRole = el;
//                     // $(el).select2({
//                     //     tag: true
//                     // });
//                 });

//                 if(options.user_id > 0)
//                 {
//                     mThis.loadFormDetails(div,options);
//                 }
//                 else
//                 {
//                     mThis.setUserFormData(div,def);
//                 }

//                 LocaleManager.translateZone(div);

//                 onFinish();
//                 /** Set select' events => when user choose User class, show only suitable roles */
//                 if(elUserRole)
//                 {
//                     // elUserClass.onchange = (e) => {
//                     //     e.preventDefault();
//                         vsapi.call(`${main_view.base_url}/api/role/options-role`,{
//                             user_class: elUserClass.value
//                         },null,false).then(res => {
//                             let roles = res.status_code === 200 ? res.data: [];
//                             let def_role_id = mThis.selected_options.role_id ? mThis.selected_options.role_id: ((roles[0]? roles[0].id : null));
//                             if(labelOfficialId)
//                             {
//                                 let u_class = (elUserClass.value || '').replace(/\_/g,' ');
//                                 labelOfficialId.textContent = [VSUtil.properCase(u_class),' ID'].join('');
//                             }
//                             VSUtil.setComboItems(elUserRole,roles,'id','name',null,null, def_role_id);
//                         });
//                     // }
//                 }
//                 elUserClass.dispatchEvent(new Event('change',{
//                     bubbles:true,
//                     cancelable: false
//                 }));
//                 mThis.validatePassword(div);
//                 mThis.setChooseImage(div);
//                 mThis.DBX::saveData(div,mThis.btnSave,'/api/user/save',options); 
//             }
//         });
//     }

//     this.setUserFormData = (div,d)=>{
//         d = d || {};
//         const btn_chooser = div.querySelector('#_um_profile_show');
//         if(d.image_url) mThis.setImage(btn_chooser, d.image_url);
//         if(!d.login_name) d.login_name = d.phone_number || d.email;
//         div.querySelectorAll('.data-input').forEach(el => {
//             const f = el.dataset.field;
//             if(el.nodeName.toLowerCase() === 'select')
//             {
//                 el.value = d[f] ?? '';
//                 if(f === 'official_code') el.setAttribute('readOnly',(d[f] ? true : false));
//                 /* because when user_class changes then role list also change */
//                 else if(f ==='user_class') mThis.selected_options.role_id = d.role_id;
//                 el.dispatchEvent(new Event('change',{
//                     bubbles: true,
//                     cancelable: false
//                 }));
//             }
//             else
//                 el.value = d[f] ?? '';
//         });
//     }

//     this.loadFormDetails = (div, options) => {
//         vsapi.call(`${main_view.base_url}/api/user/details`,{
//             id: options.id || options.user_id
//         },null,false).then(res => {
//             if(res.status_code === 200)
//             {
//                 const d = res.data || {};
//                 mThis.setUserFormData(div,d);
//             }
//         });
//     }

//     this.renderResetPassword = (modalDiv,options,onFinish) => {
//         const div = modalDiv.querySelector('.modal-body');
//         const html = `<form action="" method="POST" autocomplete="off">
//             <div class="form-group">
//                 <label for="password" class="form-label  " vslang="titles.New Password"></label>
//                 <div class="input-group flex-nowrap">
//                     <input type="password" class="form-control data-input data-validate" data-field="password" autocomplete="off"/>
//                     <div class="input-group-text" role="button">
//                         <i class="fa-regular fa-eye fs-5 text-muted"></i>
//                     </div>
//                 </div>
//             </div>
//             <div class="form-group">
//                 <label for="confirm_password" class="form-label  " vslang="titles.Confirm New Password"></label>
//                 <div class="input-group flex-nowrap">
//                     <input type="password" class="form-control data-input data-validate" data-field="confirm_password" autocomplete="off"/>
//                     <div class="input-group-text" role="button">
//                         <i class="fa-regular fa-eye fs-5 text-muted"></i>
//                     </div>
//                 </div>
//             </div>
//         </form>`;
//         div.innerHTML = html;
//         mThis.validatePassword(div);
//         //Set btnSave's event handler
//         mThis.DBX::saveData(div,mThis.btnSave,'/api/user/security/set-pwd',options);
//         LocaleManager.translateZone(div);
//         onFinish();
//     }

//     this.renderPermissions = (modalDiv,options,onFinish) => {
//         const div = modalDiv.querySelector('.modal-body');
//         const purpose = options.open === 'roles' ? 'role' : options.open === 'modules' ? 'modules' : options.open === 'reports' ? 'reports' : 'permissions';
//         const type = options.open.toLowerCase();

//         let op_html = '',
//         option_list_html = '';
//         const option_list = ['Roles','Permissions','Modules','Reports'];
//         option_list.forEach(op => {
//             op_html += `<option value="${op.toLowerCase()}" ${op.toLowerCase() === options.open ? 'selected' : ''}>${op || ''}</option>`;
//         });

//         mThis.controlApiDisplay(options,(d) => {
//            // console.log('d1',d);
//             modalDiv.style.display ='none';
//             const html = [`<div class="d-flex justify-content-center">
//                 <div class="d-flex gap-2 align-items-center mb-2 custom-buttons container-tab">
//                     ${option_list_html='',
//                         (option_list || []).forEach(op => {
//                             option_list_html  =[option_list_html, `<button style="width:109px" class="btn d-none btn-sm rounded-5 btn-${op.toLowerCase() === options.open ? 'primary' : 'outline-primary'}" type="button" role="button">${op || ''}</button>`].join('');
//                         }),
//                     option_list_html}
//                 </div>
//             </div>
//             <div class="d-flex">
//                 <select class="d-none form-select w-25 rounded-end-0 border-end-0" disabled>${op_html}</select>
//                 <input type="search" class="form-control data-input w-100 rounded-4" placeholder="Search ${purpose} by number or name"/>
//             </div>
//             <div class="table-responsive p-2 border rounded-3 table-responsive-hover mt-2">
//                 <table class="table">
//                     <thead>
//                         <tr class="d-none">
//                             <th class="text-nowrap">Status</th>
//                             ${(type ==='roles' || type === 'reports')? '': `<th class="text-nowrap">Code</th>`}
//                             <th class="text-nowrap text-capitalize">${options.open ?? 'Permissions'}</th>
//                             ${((type === 'permissions')) ? `<th class="text-nowrap text-capitalize">Modules</th>` : ''}
//                             <th class="text-nowarp">Action</th>
//                         </tr>
//                     </thead>`,
//                 //    ` <tbody>`,
//                     mThis.renderTableBody(d,options),
//                 //    ` </tbody>`,
//                 `</table>
//                 <div class="container-pagination"></div>
//             </div>`].join('');

//             div.innerHTML = html;
//             const tbody = div.querySelector('tbody'),
//             containerPagination = div.querySelector('.container-pagination');
//             mThis.controlActionOnTbody(tbody,options);
//             //mThis.createPagination(containerPagination,d);
//             modalDiv.style.display ='none';
//             onFinish();

//             const inputSearch = div.querySelector('input.data-input');
//             let timeOut = null;
//             inputSearch.onkeyup = function(e)
//             {
//                 e.preventDefault();
//                 options.search_value = this.value;
//                 clearTimeout(timeOut);
//                 timeOut = setTimeout(() => {
//                     mThis.controlApiDisplay(options,(d) => {
//                         tbody.innerHTML = mThis.renderTableBody(d.data,options);
//                         mThis.controlActionOnTbody(tbody,options);
//                         mThis.createPagination(containerPagination,d);
//                     });
//                 },250);
//             }

//             containerPagination.onclick = function(e)
//             {
//                 e.preventDefault();
//                 const target = e.target;
//                 // if click by id or tag <i>
//                 if((target.id == 'btn_incre') || target.tagName == 'I' || (target.id == 'btn_decre'))
//                 {
//                     options.current_page = target.dataset.page;
//                     //** if click on <i> mean child is trigged so get the current from parent */
//                     if(target.tagName == 'I') options.current_page = target.parentElement.dataset.page;
//                     mThis.controlApiDisplay(options,(d) => {
//                         tbody.innerHTML = mThis.renderTableBody(d.data,options);
//                         mThis.controlActionOnTbody(tbody,options);
//                         mThis.createPagination(containerPagination,d);
//                     });
//                 }
//             }

//             mThis.setEventSelect(div,tbody,containerPagination,options);
//             mThis.setEventToTab(div,tbody,containerPagination,options); 
//         });
//     }

//     this.setEventToTab = (div,tbody,containerPagination,options) => {
//         const containerTab = div.querySelector('div.container-tab'),
//         btnTabList = containerTab.querySelectorAll('button.btn');
//         let is_active = containerTab.querySelector('button.btn-primary');

//         btnTabList.forEach(btn => {
//             btn.onclick = function(e)
//             {
//                 e.preventDefault();
//                 if(is_active) is_active.classList.replace('btn-primary','btn-outline-primary');
//                 this.classList.replace('btn-outline-primary','btn-primary');
//                 is_active = this;
//                 mThis.setSelectOption(div,this.textContent);
//             }
//         });
//     }

//     this.setEventSelect = (div,tbody,containerPagination,op) => {
//         const elSelect = div.querySelector('select.form-select'),
//         elThead = div.querySelector('thead'),
//         containerTab = div.querySelector('div.container-tab');

//         elSelect.onchange = function(e)
//         {
//             e.preventDefault();
//             const elInput = this.nextElementSibling;
//             elInput.placeholder = `Search ${this.value} by number or name`;

//             mThis.elTitle.innerHTML = '';
//             // mThis.elTitle.textContent = LocaleManager.trans(`Add/Remove ${this.value.replace(/^\w/, (c) => c.toUpperCase()) || ''} for ${op.user_name ? op.user_name.replace(/^\w/g,c => c.toUpperCase()) : ''}`,'titles');

//             op.open = this.value;
//             op.current_page = 1;
//             // mThis.setTableHeader(elThead,op);
//             // mThis.setTabButton(containerTab,op);
//             mThis.controlApiDisplay(op,(d) => {
//                 tbody.innerHTML = mThis.renderTableBody(d.data,op);
//                 mThis.controlActionOnTbody(tbody,op);
//                 // mThis.createPagination(containerPagination,d);
//             });
//         }
//     }

//     this.setSelectOption = (div,value) => {
//         const elSelect = div.querySelector('select.form-select');
//         elSelect.value = value.toLowerCase();
//         elSelect.dispatchEvent(new Event('change',{
//             bubbles: true,
//             cancelable: false
//         }));
//     }

//     this.setTabButton = (div,op) => {
//         const btnTabList = div.querySelectorAll('button.btn');
//         btnTabList.forEach(btn => {
//             if(btn.textContent.toLowerCase() === op.open)
//             {
//                 btn.classList.add('btn-primary');
//                 btn.classList.remove('btn-outline-primary');
//             }
//             else
//             {
//                 btn.classList.remove('btn-primary');
//                 btn.classList.add('btn-outline-primary');
//             }
//         });
//     }

//     this.setTableHeader = (thead,op) => {
//         const type = op.open.toLowerCase();

//         // thead.innerHTML = `<tr>
//         //     <th class="text-nowrap">Status</th>
//         //     ${(type ==='roles' || type === 'reports')? '': `<th class="text-nowrap">Code</th>`}
//         //     <th class="text-nowrap text-capitalize">${op.open ?? 'Permissions'}</th>
//         //     ${((type === 'permissions')) ? `<th class="text-nowrap text-capitalize">Modules</th>` : ''}
//         //     <th class="text-nowarp">Action</th>
//         // </tr>`;
//         // thead.innerHTML = `<tr>
//         //     <th class="text-nowrap">Status</th>
//         //     ${(type ==='roles' || type === 'reports')? '': `<th class="text-nowrap">Code</th>`}
//         //     <th class="text-nowrap text-capitalize">${op.open ?? 'Permissions'}</th>
//         //     ${((type === 'permissions')) ? `<th class="text-nowrap text-capitalize">Modules</th>` : ''}
//         //     <th class="text-nowarp">Action</th>
//         // </tr>`;
//     }

//     // this.createPagination = (div,d) => {
//     //     let startPage = 1,
//     //     currentPage = d.current_page,
//     //     endPage = d.last_page,
//     //     list = null;

//     //     //** show pagination props if list have more than 1 page */
//     //     if(endPage > 1 && currentPage > 0){
//     //         const disableATag = 'pointer-events:none;opacity:0.6;';
//     //         list = `<li >
//     //                 <a id="btn_decre" href="javascript:void(0)" data-page="${currentPage - 1}" style="${currentPage <=1 ? disableATag:''}">
//     //                     <i class="fa-solid fa-chevron-left"></i>
//     //                 </a>
//     //             </li>
//     //                 <li>
//     //                     <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
//     //                 </li>
//     //                <li >
//     //                <a id="btn_incre" href="javascript:void(0)" data-page="${parseInt(currentPage) + 1}"  style="${currentPage == endPage ? disableATag : ''}">
//     //                     <i class="fa-solid fa-chevron-right"></i>
//     //                 </a>
//     //             </li>
//     //         <li>${d.to ? d.to+' of' : ''}  ${d.total> 0?  d.total : ''}</li>`;
//     //     }
//     //     // if((startPage === currentPage) && (currentPage < endPage))
//     //     // {
//     //     //     list = `${ currentPage <=1 ? '': `<li>
//     //     //     <a href="javascript:void(0)" data-page="${startPage}">
//     //     //         <i class="fa-solid fa-chevron-left"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>
//     //     //         <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
//     //     //     </li>
//     //     //     ${endPage == currentPage ? '' : `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
//     //     //         <i class="fa-solid fa-chevron-right"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>${d.to ?? ''} of ${d.total ?? ''}</li>`;
//     //     // }
//     //     // else if((startPage < currentPage) && (currentPage < endPage))
//     //     // {
//     //     //     list = `${currentPage <= 1? '' : `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)-1}">
//     //     //         <i class="fa-solid fa-chevron-left"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>
//     //     //         <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
//     //     //     </li>
//     //     //     ${endPage == currentPage ? '' : `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
//     //     //         <i class="fa-solid fa-chevron-right"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>${d.to ?? ''} of ${d.total ?? ''}</li>`;
//     //     // }
//     //     // else if((startPage < currentPage) && (currentPage === endPage))
//     //     // {
//     //     //     list = `${currentPage <= 1 ? '': `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)-1}">
//     //     //         <i class="fa-solid fa-chevron-left"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>
//     //     //         <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
//     //     //     </li>
//     //     //     ${endPage == currentPage ? '' : `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
//     //     //         <i class="fa-solid fa-chevron-right"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>${d.to ? d.to+' of' : ''}  ${d.total ?? ''}</li>`;
//     //     // }
//     //     // else if((startPage === currentPage) && (currentPage === endPage))
//     //     // {
//     //     //     list = `${currentPage <= 1 ? '':`<li>
//     //     //     <a href="javascript:void(0)" data-page="${currentPage}">
//     //     //         <i class="fa-solid fa-chevron-left"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>
//     //     //         <a href="javascript:void(0)" data-page="${currentPage}">${currentPage}</a>
//     //     //     </li>
//     //     //     ${endPage == currentPage ? '' : `<li>
//     //     //     <a href="javascript:void(0)" data-page="${parseInt(currentPage)+1}">
//     //     //         <i class="fa-solid fa-chevron-right"></i>
//     //     //     </a>
//     //     // </li>`}
//     //     //     <li>${d.to ? d.to+' of' : ''}  ${d.total> 0?  d.total : ''}</li>`;
//     //     // }

//     //     div.innerHTML = `<ul>${list ?? ''}</ul>`;
//     // }

//     this.getHeaderText = (key)=>{
//         let h = {
//             'application_list':'Applications',
//             'permission_list':'Permissions',
//             'report_list':'reports',
//         };
//         return h[key];
//     }
//     this.renderTableBody = (d,options) => {
//         let table = ``;
//         let thead = '';
//         let tbody = '';
//         // console.log('d',d);
//         const check_icon = `<i class="fa fa-check text-success fs-5 p-0 m-0"></i>`,
//         cross_icon = `<i class="fa fa-times text-danger fs-5 p-0 m-0"></i>`;
//         switch(options.open){
//             case 'roles':
//                 (d || []).forEach(item => {
//                     tbody = `<tr>
//                         <td class="align-middle">
//                             <div class="text-center btn-action p-2 rounded-3 " style="width:fit-content;" data-status="${item.allowed}" data-id="${item.id}"><span class="chg_icon">${item.allowed ? check_icon : cross_icon}</span></div>
//                         </td>
//                         <td class="align-middle text-capitalize">${item.name ?? ''}</td>
//                         <td class="align-middle">
//                             <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
//                                 <span>${item.allowed ? 'Remove' : 'Add'}</span>
//                             </button>
//                         </td>
//                     </tr>`;
//                 });
//                 break;
//             case 'permissions':
//                 (d || []).forEach(item => {
//                     tbody += `<tr>
//                         <td class="align-middle">
//                             <div class="text-center btn-action p-2 rounded-3 " data-status="${item.allowed}" data-id="${item.id}"><span class="chg_icon">${item.allowed ? check_icon : cross_icon}</span></div>
//                         </td>
//                         <td class="align-middle">${item.id ?? ''}</td>
//                         <td class="align-middle text-capitalize">${item.name ?? ''}</td>
//                         <td class="align-middle text-capitalize">${item.module_name ?? ''}</td>
//                         <td class="align-middle">
//                             <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
//                                 <span class="chg_text">${item.allowed ? 'Remove' : 'Add'}</span>
//                             </button>
//                         </td>
//                     </tr>`;
//                 });
//                 break;
//             case 'modules':
//                 (d || []).forEach(item => {
//                     tbody += `<tr>
//                         <td class="align-middle">
//                             <div class="text-center btn-action p-2 rounded-3 " data-status="${item.allowed}" data-id="${item.id}"><span class="chg_icon">${item.allowed ? check_icon : cross_icon}</span></div>
//                         </td>
//                         <td class="align-middle">${item.id ?? ''}</td>
//                         <td class="align-middle text-capitalize">${item.module_name ?? ''}</td>
//                         <td class="align-middle">
//                                 <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
//                                 <span class="chg_text">${item.allowed ? 'Remove' : 'Add'}</span>
//                             </button>
//                         </td>
//                     </tr>`;
//                 });
//                 break;
//             case 'reports':
//                 Object.keys(d || {}).forEach(key => {
//                     // const item = d[key];
//                     let headItem = mThis.getHeaderText(key);

//                     thead = `<thead>
//                         <tr class="">
//                             <th class="text-nowrap">${headItem}</th>
//                         </tr>
//                     </thead>`;
//                     table += thead;
//                     let module_id = '';
//                     (d[key] || []).forEach(item => {
//                         if(key=='permission_list')  module_id = `(${item.module_id})`;
//                         tbody += `<tr>
//                             <td class="align-middle d-none">
//                                 <div class="text-center btn-action p-2 rounded-3 " data-status="${item.allowed}" data-id="${item.id}"><span class="chg_icon">${item.allowed ? check_icon : cross_icon}</span></div>
//                             </td>
//                             <td class="align-middle text-uppercase  d-flex gap-3"><span class="ps-3">${item.name ?? ''} </span> <span class=""> ${module_id??''}</span></td>
//                             <td class="align-middle d-none">
//                                 <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
//                                 <span class="chg_text">${item.allowed ? 'Remove' : 'Add'}</span>
//                             </button>
//                             </td>
//                         </tr>`;
//                     });
//                     table += tbody;
//                     tbody = '';
//                 });
                
//                 break;
//             default:
//                 break;
//         }
//         return table;
//     }

//     this.controlActionOnTbody = (tbody,options) => {
//         let btnList = null;
//         switch(options.open)
//         {
//             case 'roles':
//                 let previousRole = null,
//                 previousRoleId = null,
//                 previousBtn = null;

//                 btnList = tbody.querySelectorAll('.btn-action');
//                 btnList.forEach(btn => {
//                     if(parseInt(btn.dataset.status))
//                     {
//                         previousRoleId = btn.dataset.id,
//                         previousRole = btn.closest('tr').cells[2].textContent,
//                         previousBtn = btn;
//                     }

//                     btn.onclick = function(e)
//                     {
//                         e.preventDefault();
//                         const allowed = parseInt(this.dataset.status),
//                         p = {
//                             user_id: options.user_id,
//                             role_id: this.dataset.id
//                         };

//                         if(allowed)
//                         {
//                             if(!AuthManager.allowed(108)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/role/delete`,p, null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRowForRole(this,{
//                                         btn: previousBtn,
//                                         roles: previousRole,
//                                         role_id: previousRoleId
//                                     },(d) => {
//                                         previousBtn = d.btn,
//                                         previousRole = d.roles,
//                                         previousRoleId = d.role_id;
//                                     });
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 221!');
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             if(parseInt(previousRoleId))
//                             {
//                                 if(!AuthManager.allowed(107)) return;
//                                 cv_interact.confirm(`${previousRole.replace(/^\w/, (c) => c.toUpperCase())} previous role must be removed before adding new role. Continue now?`,{
//                                     title: 'Delete Role',
//                                     context: 'delete',
//                                     confirmButtonText: 'Remove'
//                                 },(e) => {
//                                     if(e)
//                                     {
//                                         vsapi.call(`${main_view.base_url}/api/umt-settings/role/delete`,{
//                                             user_id: p.user_id,
//                                             role_id: previousRoleId
//                                         },false,false,false).then(res => {
//                                             if(res.status_code === 200)
//                                             {
//                                                 vsapi.call(`${main_view.base_url}/api/umt-settings/role/add`,p,false,false,false).then(res => {
//                                                     if(res.status_code === 200)
//                                                     {
//                                                         mThis.resetRowForRole(this,{
//                                                             btn: previousBtn,
//                                                             roles: previousRole,
//                                                             role_id: previousRoleId
//                                                         },(d) => {
//                                                             previousBtn = d.btn,
//                                                             previousRole = d.roles,
//                                                             previousRoleId = d.role_id;
//                                                         });
//                                                     }
//                                                     else
//                                                     {
//                                                         cv_interact.error(res.error_message ?? 'Something went wrong 111!');
//                                                     }
//                                                 });
//                                             }
//                                             else
//                                             {
//                                                 cv_interact.error(res.error_message ?? 'Something went wrong 112!');
//                                             }
//                                         });
//                                     }
//                                 });
//                             }
//                             else
//                             {
//                                 vsapi.call(`${main_view.base_url}/api/umt-settings/role/add`,p,btn,false).then(res => {
//                                     if(res.status_code === 200)
//                                     {
//                                         mThis.resetRowForRole(this,{
//                                             btn: previousBtn,
//                                             roles: previousRole,
//                                             role_id: previousRoleId
//                                         },(d) => {
//                                             previousBtn = d.btn,
//                                             previousRole = d.roles,
//                                             previousRoleId = d.role_id;
//                                         });
//                                     }
//                                     else
//                                     {
//                                         cv_interact.error(res.error_message ?? 'Something went wrong 113!');
//                                     }
//                                 });
//                             }
//                         }
//                     }
//                 });
//                 break;
//             case 'permissions':
//                 btnList = tbody.querySelectorAll('.btn-action');
//                 btnList.forEach(btn => {
//                     btn.onclick = function(e)
//                     {
//                         e.preventDefault();
//                         const allowed = parseInt(this.dataset.status),
//                         p = {
//                             user_id: options.user_id,
//                             prn_id: this.dataset.id
//                         };

//                         if(allowed)
//                         {
//                             if(!AuthManager.allowed(111)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/permission/delete`,p, null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message );
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             if(!AuthManager.allowed(105)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/permission/add`,p,null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 114!');
//                                 }
//                             });
//                         }
//                     }
//                 });
//                 break;
//             case 'modules':
//                 btnList = tbody.querySelectorAll('.btn-action');
//                 btnList.forEach(btn => {
//                     btn.onclick = function(e)
//                     {
//                         e.preventDefault();
//                         const allowed = parseInt(this.dataset.status),
//                         p = {
//                             user_id: options.user_id,
//                             mod_id: this.dataset.id
//                         };

//                         if(allowed)
//                         {
//                             if(!AuthManager.allowed(115)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/module/delete`,p,null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 116!');
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             if(!AuthManager.allowed(114)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/module/add`,p,null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 117!');
//                                 }
//                             });
//                         }
//                     }
//                 });
//                 break;
//             case 'reports':
//                 btnList = tbody.querySelectorAll('.btn-action');
//                 btnList.forEach(btn => {
//                     btn.onclick = function(e)
//                     {
//                         e.preventDefault();
//                         const allowed = parseInt(this.dataset.status),
//                         p = {
//                             user_id: options.user_id,
//                             prn_id: this.dataset.id
//                         };

//                         if(allowed)
//                         {
//                             if(!AuthManager.allowed(111)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/permission/delete`,p,null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 118!');
//                                 }
//                             });
//                         }
//                         else
//                         {
//                             if(!AuthManager.allowed(105)) return;
//                             vsapi.call(`${main_view.base_url}/api/umt-settings/permission/add`,p,null,false).then(res => {
//                                 if(res.status_code === 200)
//                                 {
//                                     mThis.resetRow(this);
//                                 }
//                                 else
//                                 {
//                                     cv_interact.error(res.error_message ?? 'Something went wrong 119!');
//                                 }
//                             });
//                         }
//                     }
//                 });
//                 break;
//             default:
//                 break;
//         }
//     }

//     this.resetRow = (btn) => {
//         const tr = btn.closest('tr'),
//         status = btn.dataset.status,
//         firstCol = tr.cells[0],
//         lstCol = tr.cells[tr.cells.length - 1];
//         const check_icon = `<i class="fa fa-check text-success fs-5 p-0 m-0"></i>`,
//         cross_icon = `<i class="fa fa-times text-danger fs-5 p-0 m-0"></i>`;
//         // firstCol.children[0].innerHTML = parseInt(status) ? check_icon : cross_icon;
//         if(parseInt(status))
//         {

//             // btn.dataset.status = 0
//             firstCol.children[0].dataset.status = 0;
//             lstCol.children[0].dataset.status = 0;
           
//             // btn.children[0].textContent = 'Add'
//             // firstCol.children[0].classList.add('bg-dark-subtle')
//             // firstCol.children[0].classList.remove('bg-success','text-white')
//             firstCol.children[0].innerHTML = cross_icon;
//             lstCol.children[0].textContent = 'Add';
//             lstCol.children[0].classList.add('btn-outline-primary')
//             lstCol.children[0].classList.remove('btn-outline-warning')
//         }
//         else
//         {

//             // btn.dataset.status = 1,
//             firstCol.children[0].dataset.status = 1;
//             lstCol.children[0].dataset.status = 1;
           
//             // btn.children[0].textContent = 'Remove',
//             // firstCol.children[0].classList.add('bg-success','text-white'),
//             // firstCol.children[0].classList.remove('bg-dark-subtle'),
//             firstCol.children[0].innerHTML = check_icon;
//             lstCol.children[0].classList.add('btn-outline-warning'),
//             lstCol.children[0].classList.remove('btn-outline-primary'),
//             lstCol.children[0].textContent = 'Remove';
//         }
//     }

//     this.resetRowForRole = (btn, previousObject, onFinish = null) => {
//         const tr = btn.closest('tr'),
//         firstCol = tr.cells[0],lstCol = tr.cells[tr.cells.length - 1];
//         const status = btn.dataset.status;
//         let previousRow = null,previousRowFirstCol = null;
//         if(previousObject.btn)
//         {
//             previousRow = previousObject.btn.closest('tr');
//             previousRowFirstCol = previousRow.cells[0];
//         }

//         let check_icon = `<i class="fa fa-check text-success fs-5"></i>`;
//         let cross_icon = `<i class="fa fa-times text-danger fs-5"></i>`;

//         if(parseInt(status))
//         {
//             lstCol.children[0].classList.add('btn-outline-primary'),
//             lstCol.children[0].classList.remove('btn-outline-warning'),
//             lstCol.children[0].textContent = 'Add',
//             lstCol.children[0].dataset.status = 0,
//             firstCol.children[0].dataset.status = 0,
//             firstCol.children[0].innerHTML = cross_icon;
            

//             if(previousObject.btn && (parseInt(previousObject.btn.dataset.status) === parseInt(status)))
//             {
//                 previousObject.btn.classList.add('btn-outline-warning'),
//                 previousObject.btn.classList.remove('btn-outline-primary'),
//                 previousObject.btn.children[0].textContent = 'Remove',
//                 previousObject.btn.dataset.status = 1,
//                 previousRowFirstCol.children[0].innerHTML = check_icon;
//             }

//             if(typeof onFinish === 'function')
//             {
//                 onFinish({
//                     btn: null,
//                     roles: null,
//                     role_id: null
//                 });
//             }
//         }
//         else
//         {
//             lstCol.children[0].classList.add('btn-outline-warning'),
//             lstCol.children[0].classList.remove('btn-outline-primary'),
//             lstCol.children[0].textContent = 'Remove',
//             lstCol.children[0].dataset.status = 1,
//             firstCol.children[0].dataset.status = 1,
//             firstCol.children[0].innerHTML = check_icon;

//             if(previousObject.btn)
//             {
//                 previousObject.btn.classList.add('btn-outline-primary'),
//                 previousObject.btn.classList.remove('btn-outline-warning'),
//                 previousObject.btn.children[0].textContent = 'Add',
//                 previousObject.btn.dataset.status = 0,
//                 previousRowFirstCol.children[0].innerHTML = cross_icon;
//             }

//             if(typeof onFinish === 'function')
//             {
//                 onFinish({
//                     btn: btn,
//                     roles: tr.cells[2].textContent,
//                     role_id: btn.dataset.id
//                 });
//             }
//         }
//     }

//     this.controlApiDisplay = (options,onFinish=null) => {
//         let end_point = null, params = null;
//        // console.log(0,options);
//         switch(options.open)
//         {
//             case 'roles':
//                 end_point = 'api/role/list';
//                 params = {
//                     user_id: options.user_id,
//                     search_value: options.search_value,
//                     current_page: options.current_page
//                 };
//                 break;
//             case 'permissions':
//                 end_point = 'api/permission/list';
//                 params = {
//                     user_id: options.user_id,
//                     search_value: options.search_value,
//                     current_page: options.current_page
//                 };
//                 break;
//             case 'modules':
//                 end_point = 'api/module/list';
//                 params = {
//                     user_id: options.user_id,
//                     search_value: options.search_value,
//                     current_page: options.current_page
//                 };
//                 break;
//             case 'reports':
//                 end_point = 'api/user/authorization-report';
//                 params = {
//                     user_id: options.user_id,
//                     role_id: options.role_id,
//                     search_value: options.search_value,
//                     current_page: options.current_page
//                 };
//                 break;
//             default:
//                 end_point = null;
//                 break;
//         }

//         if(end_point)
//         {
//             // console.log('params',params);
//             vsapi.call(`${main_view.base_url}/${end_point}`,params,options.button,false).then(res => {
//                 if(res.status_code === 200)
//                 {
//                     const d = res.data;
//                     console.log('data',d);
//                     if(typeof onFinish === 'function') onFinish(d);
//                 }
//                 else
//                 {
//                     cv_interact.error(res.error_message || 'Failed to loaded resources!');
//                 }
//             });
//         }
//     }

//     this.controlModalBody = (options, modal, onFinish) => {
//         const open = options.open;
//         switch(open)
//         {
//             case 'add-user':
//                 mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('Cancel','buttons')}</span>`;
//                 if(options.user_id > 0)
//                 {
//                     mThis.elTitle.innerHTML = LocaleManager.trans('Modify User Account','titles');
//                     mThis.btnSave.innerHTML = `<span>${LocaleManager.trans('Save','buttons')}</span>`;
//                 }
//                 else
//                 {
//                     mThis.elTitle.innerHTML = LocaleManager.trans('New User Account','titles');
//                     mThis.btnSave.innerHTML = `<span>${LocaleManager.trans('Create','buttons')}</span>`;
//                 }
//                 modal.querySelector('.modal-dialog').classList.add('modal-lg');
//                 modal.querySelector('.modal-dialog').classList.remove('modal-md');
//                 mThis.btnSave.removeAttribute('style');
//                 mThis.renderCreateUser(modal,options,onFinish);
//                 break;
//             case 'reset-password':
//                 mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('Cancel','buttons')}</span>`;
//                 mThis.elTitle.innerHTML = LocaleManager.trans('Set New Password','titles');
//                 modal.querySelector('.modal-dialog').classList.add('modal-md');
//                 modal.querySelector('.modal-dialog').classList.remove('modal-lg');
//                 mThis.btnSave.innerHTML =  `<span>${LocaleManager.trans('OK','buttons')}</span>`;
//                 mThis.btnSave.removeAttribute('style');
//                 mThis.renderResetPassword(modal,options,onFinish);
//                 break;
//             case 'roles':
//             case 'permissions':
//             case 'modules':
//             case 'reports':
//                 mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('OK','buttons')}</span>`;
//                 const purpose = open === 'roles' ? 'Role' : (open === 'modules' ? 'Modules' : (open === 'reports' ? 'Reports' : 'Permissions'));
//                 mThis.elTitle.innerHTML = LocaleManager.trans(`Authorization for <b>${options.user_name ? options.user_name.replace(/^\w/, (c) => c.toUpperCase()) : 'Admin'} </b>`,'titles');
//                 modal.querySelector('.modal-dialog').classList.add('modal-md');
//                 modal.querySelector('.modal-dialog').classList.remove('modal-lg');
//                 mThis.btnSave.style.display = 'none';
//                 mThis.renderPermissions(modal,options,onFinish);
//                 break;
//             default:
//                 break;
//         }
//     }
//     /**
//      * For UserMDialog can also be called from Merchant List or Driver List screen by providing with the default values in "options.default".
//      * The "options.default" is the default values to fill in the Create User Form.  options.default = {"official_code":sender.code,"user_class":"merchant","phone_number":sender.phone_number,"full_name":sender.name}
//     */
//     this.show = (options=null) => {
//         if(!options) options = {};
//        // console.log(options);
//        console.log(12345,options);
//         mThis.controlModalBody(options,this.self,() => {
//             // const modalDiv = $(this.self);
//             // modalDiv.modal({
//             //     backdrop: 'static'
//             // });
//             mThis.modal.show();

//         });
//     }
 
// }
