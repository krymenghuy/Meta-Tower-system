'use strict';
var UserManagementComponent = new function(){
    const mThis = this;
    this.title_prop = "User Management";
    this.base_url = main_view.base_url;
    this.self = main_view.VSAppContent.querySelector('#_um_userManagementComponent');
    this.modal = new bootstrap.Modal(this.self);
    this.btnNewUser = mThis.self.querySelector('#_um_btn_new');
    this.elSearch = mThis.self.querySelector('#_um_search_user');
    this.elFilterUserRole = mThis.self.querySelector('#_um_filter_user_role');
    this.elFilterUserBranch = mThis.self.querySelector('#_um_filter_user_branch');
    this.btnPdf = mThis.self.querySelector('#_um_btn_pdf');
    this.btnPdf.style.display = 'none';
    this.containerPagination = mThis.self.querySelector('#container_pagination_um');
    this.div_userlistView = mThis.self.querySelector('#_um_container');

    this.init = () => {
        if(mThis.initAlready) return;
        mThis.userListView = new ListView(mThis.div_userlistView,{
            fetchApi: `${main_view.base_url}/api/user/list-paginate`,
            perPage: 5,
            paginationContainer: mThis.containerPagination, 
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                mThis.renderUserList(list_container,items);
            },
            listContainerClass: null
        });

        mThis.btnNewUser.onclick = function(e)
        {
            e.preventDefault();
     
            let op = {
                id:null,
                btn: e.target,
                role_id: mThis.elFilterUserRole.value,
                branch_id: mThis.elFilterUserBranch.value,
                onClose: (user)=>{
                   mThis.userListView.showPage(mThis.getFilterData());           
                }
            }

            // if(op.role_id == 0 || !op.role_id || op.role_id == '' || op.branch_id == 0 || !op.branch_id || op.branch_id == '')
            // {
            //     cv_interact.warning('Please select a role and a branch, under which to create the new user');
            //     return;
            // }
            if(!AuthManager.allowed(100,false)) return;
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

        mThis.elFilterUserRole.onchange = function(e)
        {
            e.preventDefault();
           // console.log(mThis.getFilterData());
            mThis.userListView.showPage(mThis.getFilterData());
        }
        mThis.elFilterUserBranch.onchange = function(e)
        {
            e.preventDefault();
           // console.log(mThis.getFilterData());
            mThis.userListView.showPage(mThis.getFilterData());
        }

        mThis.btnPdf.onclick = function(e)
        {
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
            FilterDialog(e,{},html,(div) => {
                div.classList.remove('p-3'),
                div.style.left = 'unset',
                div.style.right = 10+'px';
                mThis.setPrint(div);
            });
        }

        mThis.initAlready = true;
    }
  

    this.editUser = (user_id, lnk)=>{
            const role_id = lnk.dataset.roleid;
                // if(!role_id || role_id==0){
                //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                //   return;
                // }
                let op = {
                    id: user_id,
                    user_id: user_id,
                    default:{
                        user_class: mThis.elFilterUserRole.value
                    },
                    open: 'add-user',
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                if(!AuthManager.allowed(102,false)) return;
                
                if(op.user_id && op.user_id !== 'undefined') EditUserDialog.show(op);
                else return cv_interact.error('Unknown user id!');
   
    }

    this.deleteUser = (user_id, lnk =null)=>{
            if(!AuthManager.allowed(101,false)) return;
            cv_interact.confirm('Delete this user?',{
                title: 'Delete User',
                context: 'delete'
            },(e) => {
                if(e)
                {
                    let p = {id: user_id};
                    vsapi.call(`${main_view.base_url}/api/user/delete`,p,false,false).then(res => {
                        if(res.status_code === 200)
                        {
                            mThis.userListView.showPage(mThis.getFilterData());
                        }
                        else
                        {
                            cv_interact.error(res.error_message );
                        }
                    });
                }
            });
    }

    this.initDropdownMenus = (buttons)=>{
        mThis.actionMenus = null;
        buttons.forEach(actionButton =>{
            const menuOptopns = {
                menus:[
                    {
                        //label:"for normal text, NOT html",
                        html:'<i class="fa-solid fa-user-tag fs-5 text-dark"></i> <span class="ps-2" vslang="titles.Asign Branch">Asign Campus</span>',
                        name:"asign_branch",
                        visible:true
                    },
                    {
                     divider:true,html: null
                    },
                    {
                        html:'<i class="fa-solid fa-user-pen fs-5 text-primary"></i><span class="ps-2 " vslang="titles.Change Login Name">Change Login Name</span>',
                        name:"change_login_name",
                        visible:true
                    },
                    {
                    //text:"",
                        html:'<i class="fa-regular fa-list-alt fs-5 text-success"></i><span class="ps-2 " vslang="titles.Set Password">Set Password</span>',
                        name:"change_password"
                    },
                    {
                        html:'<i class="fa-regular fa-edit fs-5 text-warning"></i><span class="ps-2  " vslang="titles.Modify User">Modify User</span>',
                        name:"edit_user"
                    },
                    {
                        html:'<i class="fa-regular fa-trash-can fs-5 text-danger"></i><span class="ps-2  " vslang="titles.Delete User">Delete User</span>',
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
                onClick:(me,action, menuLink)=>{
                    const id = menuLink.dataset.id;
                    switch(action){
                        //set_password
                        case 'asign_branch':{
                            if (!AuthManager.allowed(106)) return;
                            mThis.assignBranch(id, menuLink); //Not yet defined
                            break;
                        }
                        case 'link_user':{
                            mThis.createLinkedUser(id, menuLink); //Not yet defined
                            break;
                        }
                        case 'change_password':{
                            if (!AuthManager.allowed(104,false)) return;
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
                            if (!AuthManager.allowed(103,false)) return;
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
            const btnConfig = new  VSDropdownButton(actionButton,menuOptopns);
            mThis.actionMenus = mThis.actionMenus || [];
            mThis.actionMenus.push(btnConfig);
        });
    }

    this.createLinkedUser = (user_id,menuLink)=>{
        let op = {
            id: user_id,
            login_name:menuLink.dataset.loginname,
            onClose:(p)=>{
                 mThis.elSearch.value = op.login_name;
                 mThis.userListView.showPage(mThis.getFilterData());
            }
        };
        mThis.LinkDialog = mThis.LinkDialog || new GeneralDialog({
         createContent:()=>{
           return [
             `<div class="form-group col-md-12">
                <label class="form-label" vslang="titles.User Name">User Name</label>
                <div><input name="user_name" class="form-control data-input" data-field="user_id" placeholder="${menuLink.dataset.loginname}" readonly /></div>
                </div>`,
              `<div class="form-group col-md-12">
                <label class="form-label" vslang="titles.User Class">Application</label>
                <div><select class="form-control data-input" name="app" data-field="target_app_id"></select></div>
               </div>`,
               `<div class="form-group col-md-12">
                 <label class="form-label" vslang="titles.Target User">Target User</label>
                 <div><select class="form-control data-input" name="target_user" data-field="target_user_id"></select></div>
               </div>`,
               `<div class="form-group col-md-12">
                <p name="info" class="p-2"></p> 
               </div>`
            ].join('');
         },
         contentCreated:(me)=>{
            me.setNotes = () => {
                let x = null;
                x = me.controls.app.options[me.controls.app.selectedIndex];
                let app_name = x? x.textContent: '';
                x = me.controls.target_user.options[me.controls.target_user.selectedIndex];
                let target_user_name = x? x.textContent: '';
                let login_name = me.dataOptions.login_name;
                let notes = `<span class="text-primary">${login_name} </span> can log in to <span class="text-primary">${app_name}</span> on behalf of <span class="text-primary">${ target_user_name} </span>`;
                me.controls.info.innerHTML = notes;
            };
            
            for( let name in me.controls){
                const el = me.controls[name];
                if(el && el.tagName ==='SELECT'){
                    el.onchange = e=>{
                        me.setNotes();
                    }
                }
            }
           
         },
         showCancelButton:true,
         configSelect:[
           {
             name:'app',
             data:'apps',
             textField:'app_name',
             valueField:'id'
           },
            {
                name:"target_user",
                // data:"modules",
                // filterOptions:{
                //     triggerBy:"app",
                //     filter:(me,data,controls)=>{
                //       return data.filter(x =>{
                //          return x.app_id === controls.app.value;
                //       }); 
                //     }
                // },

                valueField:"id",
                textField:"target_user",
                depends:{
                    triggerBy:"app",
                    api:{
                        /** get eligible users based on app and user_class*/
                        endpoint:`${main_view.base_url}/api/application/eligible-users`,
                        params: (me,dataOptions,controls)=>{
                            return {"app_id": controls.app.value};
                        }
                    }
                }
            }
         ],
         buttons:[
            {
                cssClass:"btn btn-primary",
                label:"<span>Save</span",
                click:(me, btn,divModal)=>{
                     let p = me.getData();
                     p.id = me.dataOptions.id || me.dataOptions.user_id;
                     p.subs_id = main_view.subs_id;
                     p.target_user_id = me.controls.target_user.value;
                     if(!p.subs_id){
                        cv_interact.error('subs_id is missing!');
                        return;
                     }
                     vsapi.call(`${main_view.base_url}/api/user/linked-user/create`,p,btn,false).then(res =>{
                          if(res.status_code ==200){
                             me.hide(true,p);
                             cv_interact.success('Linked user has been created successfully!');
                             UserManagementComponent.userListView.showPage();
                            //  mThis.AppPanel.loadApps();
                          }else cv_interact.error(res.error_message);
                     });
                }
            }
         ],
         prepareFormOptions:{
             modifyTitle:"Create Linked-user",
             createTitle:"Create Linked-user",
             api:{
                targetProp:"apps",
                endpoint: `${main_view.base_url}/api/user/linked-user/form-options`,
                params:(dataOption)=>{
                    return {"id":dataOption.id};
                }, 
             }
         },
        //  onShow:(me)=>{
        //     me.controls.name.focus();
        //     me.controls.name.select();
        // },
        //  onPrepareForm:(me,data)=>{
        //      let fields = me.getFields();
             
        //     //  const app_types = [
        //     //     {value:0, label:"Web Application"},
        //     //     {value:1, label:"Mobile App"}
        //     //  ];
        //     //  VSUtil.setComboItems(fields.app_id,data.apps,"id","app_name",null,null,0);
        //  }
             
       });
      
       mThis.LinkDialog.show(op);
     }
    this.assignBranch = (user_id, lnk,onFinish = null)=>{
        
        if (lnk) {
                // if(!role_id || role_id==0){
                //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                //   return;
                // }
                let op = {
                    user_id: lnk.dataset.id,
                    default:{
                        user_class: mThis.elFilterUserRole.value
                    },
                    onClose: () => {
                        UserManagementComponent.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                let d = [];
                mThis.getDataBranch(user_id,onFinish =>{
                    d = onFinish;
                    let AssignBranchDialog = '';
                    if(op.user_id && op.user_id !== 'undefined')
                        AssignBranchDialog = new GeneralDialog({
                        title:"Assign Branch", 
                        cssClass: "modal-lg assign-branch-modal",
                        // showCancelButton:true,
                        createFields:() =>{
                            return mThis.renderAssignBranchTableBody(d);
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
                            createTitle:"Assign User Branch",
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
                            cssClass:"btn btn-vs-save",
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
                                        me.hide(true);
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
                    AssignBranchDialog.show(op);
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
           btn.innerHTML ='<i class="fa fa-times text-danger fs-6 fw-bold "></i>';
           btn.dataset.state =0;
        }else if (state ==1){
           btn.innerHTML ='<i class="fa fa-check text-success fs-6 fw-bold "></i>';
           btn.dataset.state = 1;  
        }

        let allowed = state;
        let div = btn.closest('div.um_branch');
        let branch_id = div.dataset.id;  
        onAppStatusChange(branch_id, allowed ,user_id);
    }

    function onAppStatusChange(branch_id, allowed ,user_id) {
        let p = {user_id: user_id, branch_id: branch_id, allowed : allowed};
        vsapi.call(`${main_view.base_url}/api/user/branch/set`,p,false,false,false).then(res =>{
            if(res.status_code ==200){
                //branch has been set successfully
            }else cv_interact.warning(res.error_message);
        });
    }
    this.getDataBranch = (user_id,onFinish) => {
        vsapi.call(`${main_view.base_url}/api/branch/form-options`,{user_id : user_id},null,false).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data ?? [];
                if(typeof onFinish === 'function') onFinish(d);
             }
             else cv_interact.error('error');
        });
    }
    this.renderAssignBranchTableBody = (d) => {
        let table = ``;
        let thead = '';
        let tbody = '';
        

                Object.keys(d || {}).forEach(key => {
                    if(key=='branches'){
                        thead = `<thead>
                            <div class="border-bottom ">
                                <h6 class=" text-nowrap text-uppercase">${key}</h6>
                            </div>
                        </thead>`;
                        table += thead;
                        let module_id = '';
                        if(!d['users'] || d['users'] == ''){
                            tbody = `<div>
                                    <span class=" d-flex align-items-center justify-content-center align-items-center"><span class="">No ${key} List </span> </span>
                                </div>`;
                        }else{
                      
                      (d[key] || []).forEach(item => {
                            const allowed = (item.allowed || 0);
                            let checkStatus = (allowed == 1)
                                ? '<i class="fa fa-check text-success fs-5 fw-bold"></i>'
                                : '<i class="fa fa-times text-danger fs-5 fw-bold"></i>';

                            tbody += `
                                <div data-id="${item.id}" class="um_branch d-flex align-items-center justify-content-between gap-3 py-2 border-bottom">

                                    <div class="um_branch_check d-flex align-items-center justify-content-center rounded-circle border border-secondary" style="width:36px; height:36px;">
                                        <a href="javascript:void(0)" data-state="${allowed}" class="link_check_branch text-decoration-none">
                                            ${checkStatus}
                                        </a>
                                    </div>

                                    <div class="flex-grow-1 text-uppercase fw-semibold">
                                        <span class="align-middle">${item.branch_name ?? ''}</span>
                                    </div>

                                </div>
                            `;
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

    this.renderUserList = (div,items) => {
        items = items ?? [];
        if(!AuthManager)
        {
            console.error('Authentication Management does not seems to work properly. You may need to refresh page');
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then(user => {
            // console.log(user);
           mThis.beginRenderUsers(div,items,user)
        });
    }
    this.beginRenderUsers = (div, items, current_user) => {
        const d = current_user;
        let html = '';
        let cnt = 0;
        let search_value = mThis.elSearch;
        div.innerHTML = '';

        items.forEach(user => {
            const cls_lock_class = (user.status && user.status.toLowerCase() === 'active') ? '' : 'border-danger border-2';
            const login_name_text = current_user.id === user.id 
                ? `${user.login_name} <span class="text-danger">(You)</span>` 
                : user.login_name;

            html += `
            <div class="user-card w-100 rounded-2 p-3 shadow bg-white mb-3 position-relative" data-roleid="${user.role_id || user.primary_role_id}">
                <div class="row gy-3 align-items-start">
                    <div class="col-12 col-md-2 d-flex justify-content-center">
                        <div class="width-profile-container rounded-4 set-user-profile">
                            <img src="${user.image_url}" alt="" class="img-user-profile object-fit-scale shadow ${cls_lock_class}" style="border-radius:50%" />
                        </div>
                    </div>
                    <div class="col-12 col-md-5">
                        <p class="text-nowrap"><span class="text-width-user">Full Name:</span> <span style="color:#554150;">${user.full_name || 'N/A'}</span></p>
                        <p class="text-nowrap"><span class="text-width-user">Login:</span> <span style="color:#554150;">${login_name_text}</span>
                            <span class="ms-1"><a href="javascript:void(0)" data-id="${user.id}" data-loginname="${user.login_name}" class="btn-um-login-name"><span class="tool-tip"><i class="fa-solid fa-user-pen text-primary-custom fs-5"></i><span class="tool-tiptext">Change Login</span></span></a></span>
                        </p>
                        <p class="text-nowrap"><span class="text-width-user">User Class:</span> <span style="color:#554150;">${user.user_class === 'admin' ? 'Staff' : user.user_class}</span></p>
                        <p class="text-nowrap"><span class="text-width-user">Role:</span> ${(user.primary_role || user.role_name) || 'N/A'}
                            <span class="ms-1"><a href="javascript:void(0)" data-id="${user.id}" data-user="${user.login_name}" class="btn-um-roles"><span class="tool-tip"><i class="fa fa-edit text-primary-custom fs-5"></i><span class="tool-tiptext">Change Role</span></span></a></span>
                        </p>
                         <p class="text-nowrap"><span class="text-width-user">Campuses:</span> <span style="color:#554150;">${user.branches ?? ''}</span>
                    </div>
                    <div class="col-12 col-md-5">
                        <p><span class="text-width-user">Start Date:</span> ${user.start_date || 'N/A'}</p>
                        <p><span class="text-width-user">Last Login:</span> ${user.last_login_date || 'N/A'}</p>
                        <p><span class="text-width-user">Phone Number:</span> ${user.phone_number || 'N/A'}</p>
                        <p><span class="text-width-user">${user.user_class ? VSUtil.properCase(user.user_class) : 'Official'} ID:</span> ${user.official_id || 'N/A'}</p>
                    </div>
                </div>

                <div class="d-flex justify-content-start flex-wrap gap-2 mt-3 border-top border-secondary pt-2">
                    ${user.is_locked ? '<i class="fa-solid fa-ban fs-4 text-danger align-self-center"></i>' : ''}
                    
                    <button class="btn-um-permissions btnAddNewEdv d-none" data-id="${user.id}" data-user="${user.login_name}">${LocaleManager.trans('Permissions','titles')}</button>
                    <button class="btn-um-modules btnAddNewEdv d-none" data-id="${user.id}" data-user="${user.login_name}">${LocaleManager.trans('Modules','titles')}</button>
                    <button class="btn-um-reports btnAddNewEdv" data-id="${user.id}" data-roleid="${user.role_id}" data-user="${user.login_name}">${LocaleManager.trans('Authorization','titles')}</button>
                    <button class="btn-um-lock btnAddNewEdv" data-id="${user.id}" data-user="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">${user.is_locked ? LocaleManager.trans('Unlock','titles') : LocaleManager.trans('Lock','titles')}</button>
                    <button class="btn-um-set-password btnAddNewEdv" data-id="${user.id}" data-user="${user.login_name}">${LocaleManager.trans('Change Password','titles')}</button>
                    <button class="btn_user_action ms-auto btnAddNewEdv" type="button" data-roleid="${user.role_id || user.primary_role_id || ''}" data-id="${user.id}" data-loginname="${user.login_name}" data-lock="${user.is_locked ? 'unlock' : 'lock'}">Action <i class="fa-solid fa-caret-down ms-1"></i></button>
                    <div class="link-user-container ${user.linked_app_name ? 'd-flex' : 'd-none'} flex-wrap align-items-center gap-2 ms-2">
                        <span class="fw-bold text-primary">Linked to:</span>
                        <span class="rounded-4 p-2 border border-primary text-primary">User Name: ${user.linked_user_name || 'N/A'}</span>
                        <span class="rounded-4 p-2 border border-primary text-primary">App Name: ${user.linked_app_name || 'N/A'}</span>
                        <div class="d-flex gap-1 flex-wrap">
                            <a href="javascript:void(0)" data-id="${user.id}" data-targetuserid="${user.linked_user_id}" data-loginname="${user.login_name}" class="change_linked_user"><i class="fas fa-pen text-white fs-6 bg-primary rounded-5 p-2"></i></a>
                            <a href="javascript:void(0)" data-id="${user.id}" data-loginname="${user.login_name}" class="delete_linked_user"><i class="fas fa-times text-white fs-6 bg-danger rounded-5 p-2"></i></a>
                        </div>
                    </div>
                </div>
            </div>`;
            
            cnt++;
        });

        if (cnt === 0) {
            html = `
            <div class="w-100 d-flex flex-column justify-content-center align-items-center p-3" style="height:60vh">
                <div class="no-data text-center">
                    <img src="${main_view.asset_url}/images/icons/no_data.webp" alt="No Data" class="mb-2">
                    <p>${search_value ? 'There seems to be no matched users found' : 'No users to show.<br>You may choose different role or branch'}</p>
                </div>
            </div>`;
        }

        div.innerHTML = html;

        const parent = div.parentElement;
        parent.style.height = (window.innerHeight - 240) + 'px';
        window.onresize = () => parent.style.height = (window.innerHeight - 240) + 'px';

        if (cnt > 0) {
            mThis.initDropdownMenus(div.querySelectorAll('.btn_user_action'));
            mThis.setEvent(div);
        }
    };



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
                        <li class="p-2 text-nowrap btn-um-modify" data-roleid="${role_id}" data-id="${id}" data-user="${user_name}">
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
                    // FilterDialog(e,{},html,(div) => {
                    //     mThis.setEvent(div);
                    // });
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
                            vsapi.call(`${main_view.base_url}/api/user/delete`,op,null).then(res => {
                                if(res.status_code === 200)
                                {
                                    UserManagementComponent.userListView.showPage(mThis.getFilterData());
                                }
                                else
                                {
                                    cv_interact.error(res.error_message );
                                }
                            });
                        }
                    });
                }
                return;
            }
 
            btn = VSUtil.closestLimited(e.target,'.btn-um-lock');
            if(btn)
            {
                const op = {
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                    action: btn.dataset.lock,
                    status_code:btn.dataset.lock
                };
                if(!AuthManager.allowed(107,false)) return;
                const action =(op.action || '').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
                cv_interact.confirm(['Do you want to ',op.action || '',' user ',op.user_name.replace(/^\w/, (c) => c.toUpperCase()),'?'].join(''),{
                    title: `${op.action || ''} User`,
                    context: `update`,
                    confirmButtonText:`${action || ''} Now`
                },(e) => {
                    if(e)
                    {
                        delete(op.user_name);
                        vsapi.call(`${main_view.base_url}/api/user/status/update`,op,null,false).then(res => {
                            if(res.status_code === 200)
                            {
                                //const parentElement = btn ? btn.closest('.scope-user') : div.previousElementSibling;
                                //btn = button ? button : btn;
                                mThis.resetUserStatus(div,btn,op);
                            }
                            else
                            {
                                cv_interact.error(res.error_message ?? 'Something went wrong!');
                            }
                        });
                    }
                });
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-set-password');
            if(btn)
            {
                const op = {
                    button:null,
                    user_id: btn.dataset.id,
                    login_name: btn.dataset.loginname,
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData());
                    }
                };
                if(!AuthManager.allowed(104,false)) return;
                if(op.user_id && op.user_id !== 'undefined')
                    // AddUserDialog.show(op);
                    SetPasswordDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-roles');
            if(btn)
            {
                const op = {
                    button:null,
                    id: btn.dataset.id,
                    user_name: btn.dataset.user,
                };
               
               // console.log(123,op);
                if (!AuthManager.allowed(108,false)) return;
                if(op.id && op.id !== 'undefined')
                    mThis.ChangeRoleDialog = mThis.ChangeRoleDialog || new GeneralDialog({
                    title:"Change User Role", 
                    cssClass:"modal-md",
                    showCancelButton:true,
                    createFields:() =>{
                        return [`<div class="row">
                                    <div class="form-group col-md-12">
                                        <label class="form-label" vslang="titles.User">User</label>
                                        <input type="text" value = "`,op.user_id,`" class="form-control data-input" data-field="user_id" placeholder="`,op.user_name,`" readonly />
                                    </div>
                                    <div class="form-group col-md-12 ">
                                        <label for="role_id" class="form-label " vslang="titles.Roles">Roles</label>
                                        <select name="role_id" class="form-control data-input" data-field="role_id"></select>
                                    </div>                        
                                </div>`].join('');
                    },
                    
                    prepareFormOptions:{
                        createTitle:"Modify UM Role",
                        modifyTitle:"Edit Role",
                        api:{
                        targetProp:"data",
                        endpoint:`${mThis.base_url}/api/role/list`,
                        //    params:(dataOptions)=>{
                        //         return {'id':1};
                        //     }
                            // params: {id:1}
                        }
                    },
                    buttons:[
                    {
                        label:"Cancel",
                        cssClass:"btn-vs-cancel",
                        action:"cancel",
                        dismissModal:true,
                        icon:""
                    },
                    {
                        label:"OK",
                        cssClass:"btn-vs-save",
                        icon:"",
                        click:(me,btn,divModal)=>{
                            const p = me.getData();
                            p.user_id = op.user_id;
 
                            // p.category =lnk.dataset.category??'bill_payment';
    
                            vsapi.call(`${main_view.base_url}/api/user/role/change`,p,false,false,false).then(res=>{
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
                    onPrepareForm:(instance,data,fields,divModal)=>{
                        // console.log('fields',data);
                        // fields.role_id.onchange = (e)=>{
                        //     // console.log('date chang');
                        // }
                        
                        VSUtil.setComboItems(fields.role_id,data,'id','name','','All Roles',null);
                    },
                    // onClose:(canceled)=>{
                    // //   alert(' Closing with cancel = ' + canceled);
                    // }
                });
                mThis.ChangeRoleDialog.show(op); 
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-login-name');
            if(btn)
            {
                let op = {
                    button:null,
                    id: btn.dataset.id,
                    login_name: btn.dataset.loginname,
                      onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData());
                    }
                };
                
                // mThis.changeUserLoginName(op);
                if (!AuthManager.allowed(103,false)) return;
                ChangeLoginNameDialog.show(op);
              return;   
            }

            btn = VSUtil.closestLimited(e.target,'.change_linked_user');
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    role_id: btn.dataset.roleid,
                    login_name: btn.dataset.loginname,

                };
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.delete_linked_user');
            if(btn)
            {
                const btn1 = btn;
                cv_interact.confirm('Delete this linked user?',{"context":"delete",title:"Delete Linked User"},e =>{
                     if(e){
                         let p = {id: btn1.dataset.id,subs_id:main_view.subs_id};
                         vsapi.call(`${main_view.base_url}/api/user/linked-user/delete`,p,false,false).then(res =>{
                             if(res.status_code ==200){
                               const div = btn1.closest('div.link-user-container');
                               if(div) div.remove();
                             }else cv_interact.error(res.error_message);
                         });
                     }
                }); 
            }
            // btn = VSUtil.closestLimited(e.target,'.btn-um-permissions');
            // if(btn)
            // {
            //     let op = {
            //         button:null,
            //         user_id: btn.dataset.id,
            //         user_name: btn.dataset.user,
            //         open: 'permissions'
            //     };
            //     if(op.user_id && op.user_id !== 'undefined')
            //         AddUserDialog.show(op);
            //     return;
            // }

            // btn = VSUtil.closestLimited(e.target,'.btn-um-modules');
            // if(btn)
            // {
            //     let op = {
            //         button:null,
            //         user_id: btn.dataset.id,
            //         user_name: btn.dataset.user,
            //         open: 'modules'
            //     };
            //     if(op.user_id && op.user_id !== 'undefined')
            //         AddUserDialog.show(op);
            //     return;
            // }

            btn = VSUtil.closestLimited(e.target,'.btn-um-reports');
            if(btn)
            {
                let op = {
                    button:null,
                    id: btn.dataset.id,
                    role_id: btn.dataset.roleid,
                    user_name: btn.dataset.user,
                    open: 'reports'
                };
                if(op.id && op.id !== 'undefined')
                    if(!AuthManager.allowed(106,false)) return;
                    ReportDialog.show(op);
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
            {
                btn.dataset.lock = 'unlock',
               // btnAction.dataset.lock = 'unlock';
                btn.children[0].textContent = 'Unlock';
                containerIcon.innerHTML = '<i class="fa-solid fa-ban fs-4 text-danger"></i>';
                if(img) img.classList.add('border-2','border-danger');
            }
            else
            {
                btn.dataset.lock = 'lock',
               // btnAction.dataset.lock = 'lock';
                btn.children[0].textContent = 'Lock';
                containerIcon.innerHTML = '';
                if(img) img.classList.remove('border-danger','border-2');
            }
        }
    }

    this.getFilterData = () => {
        return {
            role_id: mThis.elFilterUserRole.value,
            branch_id: mThis.elFilterUserBranch.value,
            search_value: mThis.elSearch.value
        }
    }

    this.prepareFormOption = (onFinish=null) => {
        vsapi.call(`${main_view.base_url}/api/user/form-options`,null,null,false).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data ?? [],
                el = mThis.elFilterUserRole;
                VSUtil.setComboItems(el,d.roles,'id','role_name',true,'All Roles',null);
                VSUtil.setComboItems(mThis.elFilterUserBranch,d.branches,'id','branch_name',true,'All Branches',null);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

    this.show = (options) => {
        mThis.init(); //NOTE: initOnce init one time only
        if(!options) options = {};
        main_view.setContentView(mThis.self,mThis.title_prop);
        mThis.prepareFormOption(() => {
            mThis.userListView.showPage(mThis.getFilterData(),null,() => {
                
            });
        });
    }
}

const ReportDialog = new function(){
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_um_');
    this.modal = new bootstrap.Modal(this.self);
    this.elTitle = mThis.self.querySelector('.modal-title');
    this.btnSave = mThis.self.querySelector('#dlg_um_btn_save');
    this.btnPrint = mThis.self.querySelector('#dlg_um_btn_print');

    this.btnClose = mThis.self.querySelector('#dlg_um_btn_close');
    this.selected_options = {};

    this.renderPermissions = (modalDiv,options,onFinish) => {
        const div = modalDiv.querySelector('.modal-body');
        const purpose = options.open === 'roles' ? 'role' : options.open === 'modules' ? 'modules' : options.open === 'reports' ? 'reports' : 'permissions';
        const type = options.open.toLowerCase();

        let op_html = '',
        option_list_html = '';
        const option_list = ['Roles','Permissions','Modules','Reports'];
        option_list.forEach(op => {
            op_html += `<option value="${op.toLowerCase()}" ${op.toLowerCase() === options.open ? 'selected' : ''}>${op || ''}</option>`;
        });

        mThis.controlApiDisplay(options,(d) => {
           // console.log('d1',d);
            modalDiv.style.display ='none';
            const html = [`<div class="d-flex justify-content-center">
                <div class="d-flex gap-2 align-items-center mb-2 custom-buttons container-tab">
                    ${option_list_html='',
                        (option_list || []).forEach(op => {
                            option_list_html  =[option_list_html, `<button style="width:109px" class="btn d-none btn-sm rounded-5 btn-${op.toLowerCase() === options.open ? 'primary' : 'outline-primary'}" type="button" role="button">${op || ''}</button>`].join('');
                        }),
                    option_list_html}
                </div>
            </div>
            <div class="d-flex- d-none">
                <select class="d-none form-select w-25 rounded-end-0 border-end-0" disabled>${op_html}</select>
                <input type="search" class="form-control data-input w-100" placeholder="Search ${purpose} by number or name"/>
            </div>
            <div class="table-responsive p-2 border rounded-3 table-responsive-hover mt-3">
                <table class="table">
                    <thead>
                        <tr class="d-none">
                            <th class="text-nowrap">Status</th>
                            ${(type ==='roles' || type === 'reports')? '': `<th class="text-nowrap">Code</th>`}
                            <th class="text-nowrap text-capitalize">${options.open ?? 'Permissions'}</th>
                            ${((type === 'permissions')) ? `<th class="text-nowrap text-capitalize">Modules</th>` : ''}
                            <th class="text-nowrap">Action</th>
                        </tr>
                    </thead>`,
                //    ` <tbody>`,
                    mThis.renderTableBody(d,options),
                //    ` </tbody>`,
                `</table>
                <div class="container-pagination"></div>
            </div>`].join('');

            div.innerHTML = html;
            const tbody = div.querySelector('tbody'),
            containerPagination = div.querySelector('.container-pagination');
            // mThis.controlActionOnTbody(tbody,options);
            //mThis.createPagination(containerPagination,d);
            modalDiv.style.display ='none';
            onFinish();

            const inputSearch = div.querySelector('input.data-input');
            let timeOut = null;
            inputSearch.onkeyup = function(e)
            {
                e.preventDefault();
                options.search_value = this.value;
                clearTimeout(timeOut);
                timeOut = setTimeout(() => {
                    mThis.controlApiDisplay(options,(d) => {
                        tbody.innerHTML = mThis.renderTableBody(d.data,options);
                        mThis.createPagination(containerPagination,d);
                    });
                },250);
            }

        });
    }

    this.getHeaderText = (key)=>{
        let h = {
            'application_list':'Applications',
            'permission_list':'Permissions',
            'report_list':'Reports',
            'module_list':'Modules'
        };
        return h[key];
    }

    this.renderTableBodyOld = (d,options) => {
        let table = ``;
        let thead = '';
        let tbody = '';
        // console.log('d',d);
        const check_icon = `<i class="fa fa-check text-success fs-5 p-0 m-0"></i>`,
        cross_icon = `<i class="fa fa-times text-danger fs-5 p-0 m-0"></i>`;
        switch(options.open){
            case 'reports':
                console.log(222,d);
                Object.keys(d || {}).forEach(key => {
                    // const item = d[key];
                    let headItem = mThis.getHeaderText(key);

                    thead = `<thead>
                        <tr class="">
                            <th class="text-nowrap text-uppercase">${headItem}</th>
                        </tr>
                    </thead>`;
                    table += thead;
                    let module_id = '';
                    if(!d[key] || d[key] == ''){
                        tbody = `<tr>
                                <td class="  d-flex justify-content-center align-items-center"><span class="">No ${headItem} List </span> </td>
                            </tr>`;
                    }else{
                        (d[key] || []).forEach(item => {
                            let item_name = item.name ?? item.app_name ?? item.module_name ?? item.permission_name ;
                            if(key=='permission_list')  
                               module_id = `(${item.module_id})`;
                            else if (key =='module_list'){
                                module_id = `(${item.module_id ?? item.id})`;  
                            } 
                            // module_id = `(${item.module_id})`;  
      
                            tbody += `<tr>
                                <td class="align-middle d-none">
                                    <div class="text-center btn-action p-2 rounded-3 " data-status="${item.allowed}" data-id="${item.id}"><span class="chg_icon">${item.allowed ? check_icon : cross_icon}</span></div>
                                </td>
                                <td class="align-middle text-uppercase  d-flex gap-3"><span class="ps-3">${item_name ?? ''} </span> <span class=""> ${module_id??''}</span></td>
                                <td class="align-middle d-none">
                                    <button class="btn-action btn btn-sm btn-outline-${item.allowed ? 'warning' : 'primary'}" data-id="${item.id}" data-status="${item.allowed}">
                                    <span class="chg_text">${item.allowed ? 'Remove' : 'Add'}</span>
                                </button>
                                </td>
                            </tr>`;
                        });
                    }
                    table += tbody;
                    tbody = '';
                });
                
                break;
            default:
                break;
        }
        return table;
    }
    this.renderTableBody = (d,options) => {
        let table = ``;
        switch(options.open){
            case 'reports':
                d = d || [];
                let app = null,mod = null, per = null, tr = null;
                const check_icon = `<img style="max-width: 15px; max-height: 15px; color: green" class="" src="${main_view.base_url}/assets/images/icons/check-solid.svg" alt="check :"/>`,
                cross_icon = `<img style="max-width: 15px; max-height: 15px; color:red" class="" src="${main_view.base_url}/assets/images/icons/xmark-solid.svg" alt="xmark :"/>`;
                if(d)
                {
                    let html = ``;
                    let tBody = ``;
                    let i = 1;
                // console.log(JSON.stringify(d, null, 2));
                    // users.map( u =>{
                        tBody =`
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
                    tBody = '<tbody>' + tBody + '</tbody>';
                    
                    table += `<table  class= "table table-bordered w-100 mt-3">${tBody}</table>`;
                    
                    
                }
                
                break;
            default:
                break;
        }
        return table;
    }

    this.controlApiDisplay = (options,onFinish=null) => {
        let end_point = null, params = null;
         const user_id = options.id ?? options.user_id;
        switch(options.open)
        {
            case 'roles':
                end_point = 'api/role/list';
                params = {
                    id: user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'permissions':
                end_point = 'api/permission/list';
                params = {
                    id: user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'modules':
                end_point = 'api/module/list';
                params = {
                    id: user_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            case 'reports':
                end_point = 'api/user/authorization-report';
                params = {
                    id: user_id,
                    role_id: options.role_id,
                    search_value: options.search_value,
                    current_page: options.current_page
                };
                break;
            default:
                end_point = null;
                break;
        }

        if(end_point)
        {
            // console.log('params',params);
            vsapi.call(`${main_view.base_url}/${end_point}`,params,options.button,false).then(res => {
                if(res.status_code === 200)
                {
                    const d = res.data;
                // console.log('data',d);
                    if(typeof onFinish === 'function') onFinish(d);
                }
                else
                {
                    cv_interact.error(res.error_message || 'Failed to loaded resources!');
                }
            });
        }
    }

    this.controlModalBody = (options, modal, onFinish) => {
        const open = options.open;
        switch(open)
        {
            case 'reports':
                mThis.btnClose.innerHTML = `<span>${LocaleManager.trans('OK','buttons')}</span>`;
                const purpose = open === 'roles' ? 'Role' : (open === 'modules' ? 'Modules' : (open === 'reports' ? 'Reports' : 'Permissions'));
                mThis.elTitle.innerHTML = LocaleManager.trans(`Authorization for <b>${options.user_name ? options.user_name.replace(/^\w/, (c) => c.toUpperCase()) : 'Unknown User'} </b>`,'titles');
                modal.querySelector('.modal-dialog').classList.add('modal-lg');
                modal.querySelector('.modal-dialog').classList.remove('modal-xl');
                mThis.btnSave.style.display = 'none';
                // mThis.btnPrint.classList.remove('d-none');

                mThis.renderPermissions(modal,options,onFinish);
                break;
            default:
                break;
        }
    }
    this.show = (options=null) => {
        if(!options) options = {};
        mThis.controlModalBody(options,this.self,() => {
            mThis.modal.show();
        });
    }
}

    // const EditUserDialog = (()=>{
    //     const self = {};
    //     let dialog = null;

    //     self.show = (op)=>{

    //         dialog = dialog || new GeneralDialog({
    //             title:"Edit User Information",
    //             createContent:()=>{
    //                 return `<div class="w-100 d-flex flex-wrap flex-row align-items-center justify-content-center gap-2">
    //                     <div name="div_user_photo"></div>
    //                     <div style="visibility:hidden" class="d-none align-items-center justify-content-center border border-secondary rounded-5 p-3 flex-grow">
    //                     <h5 class="p-2">User may have an official profile details</h5>
    //                     </div>
    //                 </div>

    //                 <div class="row mt-2">
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Role Name"></label>
    //                         <select name="role_id" class="data-input" data-field="role_id"></select>
    //                     </div>
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Branch Name"></label>
    //                         <select name="branch_id" class="data-input" data-field="branch_id"></select>
    //                     </div>
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.User Class"></label>
    //                         <select name="user_class" class="modal-select2 data-input" data-field="user_class"></select>
    //                     </div>
                    
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Official ID"></label>
    //                         <input name="official_code" class="form-control data-input" data-field="official_code" />
    //                     </div>

    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Full Name"></label>
    //                         <input name="full_name" class="form-control data-input" data-field="full_name" />
    //                     </div>

    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Phone Number"></label>
    //                         <input name="phone_number" class="form-control data-input" data-field="phone_number" />
    //                     </div>

    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Email"></label>
    //                         <input name="email" class="form-control data-input" data-field="email" />
    //                     </div>
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Login Name"></label>
    //                         <input name="login_name" class="form-control data-input" data-field="login_name" />
    //                     </div>
    //                 </div>

    //                 <div class="row">
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Password"></label>
    //                         <input name="password" type="password" class="form-control data-input" data-field="password" />
    //                     </div>
    //                     <div class="form-group col-6">
    //                         <label for="" class="form-label " vslang="titles.Confirm Password"></label>
    //                         <input name="confirm_password" type="password" class="form-control data-input" data-field="confirm_password" />
    //                     </div>
    //                 </div>`;
    //             },
    //             contentCreated:()=>{

    //             },
    //             prepareFormOptions:{

    //             }
    //         });

    //         dialog.show(op); 
    //     };

    
    //     return self;
    // })();

const EditUserDialog = new function(){
    const mThis = this;
    this.self = main_view.VSAppContent.querySelector('#dlg_edit_user');
    this.modal = new bootstrap.Modal(this.self);
    this.btnSave = mThis.self.querySelector('#dlg_edit_users_btn_save');
    this.divImg = mThis.self.querySelector('#_div_user_photo');
    this.options ={};
    this.imgBox = new ImageBox(mThis.divImg,{
        "dataField":"photo",
        "cssClass":"data-input border border-success ",
        containerClass:null,
        // onDeleteImage:()=>{
        //   alert('Deleting image');
        //   return false;
        // },
        "onLoadImage":(photo) =>{
            let p = {"id": mThis.options.id,"id":mThis.options.id,"photo":photo};
            if(!p.id) return; 
            vsapi.call(`${main_view.base_url}/api/user/save-profile-picture`,p,null,null,false).then(res =>{
                if(res.status_code ===200){
                    mThis.imgBox.setImage(photo);
                    // cv_interact.success('Photo has been saved');
                }else cv_interact.error(res.error_message);
            });
        },
        "deleteAPI":{
            "endPoint":`${main_view.base_url}/api/user/delete-profile-picture`,
            "params":()=>{
                return {"id":mThis.options.id}
            }
        }
    });

    mThis.btnSave.onclick = function(e)
    {
        e.preventDefault();
        let op = mThis.getDataForm();
        // console.log(222,op);
        vsapi.call(`${main_view.base_url}/api/user/update`,op,null).then(res => {
            if(res.status_code === 200)
            {
                mThis.modal.hide();
                if(typeof mThis.options.onClose === 'function') mThis.options.onClose();
            }
            else
            {
                cv_interact.error(res.error_message );
            }
        });
    };

    // this.userImageBox = new ImageBox(mThis.div_user_photo,{cssClass:"data-input",dataset:{"field":"photo"}});

    this.getDataForm = () => {
        const div = mThis.self;
        let p = {
            id: mThis.options.id
        };

        div.querySelectorAll('.data-get').forEach(el =>
        {
            const f = el.getAttribute('data-field');
            p[f] = el.value;
        });

        if(p.term_id == 0)
            p.term_id = null;
        return p;
    }

    this.loadFormDetails = (op,onFinish=null) => {
        vsapi.call(`${main_view.base_url}/api/user/form-options`,{
            id: op.id
        },null).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data.user;
                console.log(3333,d);
                mThis.setDataForm(d);
                if(typeof onFinish === 'function') onFinish();
            }
        });
    }

   this.setDataForm = (d) => {
    d = d ?? {};
    const div = mThis.self;
    div.querySelectorAll('.data-input').forEach(el => {
        const f = el.getAttribute('data-field');
        if (el.tagName.toLowerCase() === 'select' && f === 'term_id') {
            VSUtil.setComboItems(el, d.term_options, 'id', 'name', true, 'None', null);
        } else {
            el.value = d[f] ?? '';
        }
    });
}


    this.show = (options) => {
    console.log(44444444,mThis.divImg);
        if(!options) options = {};
        mThis.options = options;
        console.log(2222,options);
        mThis.loadFormDetails(options,() => {
            // mThis.self.modal({
            //     backdrop: 'static'
            // });
            mThis.modal.show();
        });
    }
}

 