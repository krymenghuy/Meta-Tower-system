'use strict';
var BranchManagementComponent = new function(){
    const mThis = this;
    this.title_prop = "Branch Management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children('#_um_branchManagementComponent');
    this.self = this.jm[0];
    this.btnNewBranch = mThis.self.querySelector('#_bm_btn_new');
    this.elSearch = mThis.self.querySelector('#_um_search_branch');
    this.elFilter_user_role = mThis.self.querySelector('#_um_filter_user_role');
    this.elFilter_user_branch = mThis.self.querySelector('#_um_filter_user_branch');
    this.btnPdf = mThis.self.querySelector('#_um_btn_pdf');
    this.btnPdf.style.display = 'none';
    this.containerPagination = mThis.self.querySelector('#container_pagination_um');
   
    this.init = () => {
        if(mThis.initAlready) return;
        mThis.userListView = new ListView('_branch_container',{
            fetchApi: `${main_view.base_url}/api/branch/list`,
            perPage: 5,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items,list_container) => {
                list_container.classList.add('pe-3');
                console.log('items',items);
                mThis.renderUserList(list_container,items);
            },
            listContainerClass: null
        });

        mThis.btnNewBranch.onclick = function(e)
        {
            e.preventDefault();
     
            let op = {
                id:null,
                btn: e.target,
                onClose: (user)=>{
                   mThis.userListView.showPage(mThis.getFilterData());           
                }
            }
           
            CreateBranchDialog.show(op); 

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

        this.listContainer = mThis.userListView.getListContainer();
        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    }

    this.assignUser = (id, lnk)=>{
        if (lnk) {
                console.log(12,lnk);
                let op = {
                    id: lnk.dataset.id,
                    branch_id: lnk.dataset.id,
 
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                let AssignUserDialog = '';
                if(op.id && op.branch_id !== 'undefined')
                AssignUserDialog = new GeneralDialog({
                    title:"Change User Role", 
                    cssClass:"modal-md",
                    showCancelButton:true,
                    createFields:() =>{
                        return [`<div class="row">
                                    <div class="form-group col-md-12">
                                        <label class="form-label" vslang="titles.Branch Name">Branch Name</label> <span class = 'text-danger' > *</span>
                                        <input type="text" class="form-control data-input" data-field="branch_id" placeholder="Branch Name" readonly />
                                    </div>
                                    <div class="form-group col-md-12 ">
                                        <label for="payee_id" class="form-label " vslang="titles.User">User</label> <span class = 'text-danger' > *</span>
                                        <select id="__user" class="modal-select2 data-input filter-field" data-field="user_id"></select>
                                    </div>                        
                                </div>`].join('');
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
                        targetProp:"users",
                        endpoint:`${mThis.base_url}/api/branch/form-options`,
                        //    params:()=>{
                        //         return {'id':1};
                        //     }
                            // params: {id:1}
                        }
                    },
                    buttons:[
                    {
                        label:"Cancel",
                        cssClass:"btn btn-secondary",
                        action:"cancel",
                        dismissModal:true,
                        icon:""
                    },
                    {
                        label:"Assign",
                        cssClass:"btn btn-info",
                        icon:"",
                        click:(me,btn,divModal)=>{
                            const p = me.getData();
                            p.user_id = op.user_id;
                            console.log('p',p);
                            cv_interact.error("Not yet allow");
                            // p.category =lnk.dataset.category??'bill_payment';
    
                            // vsapi.call(`${main_view.base_url}/api/user/role-change`,p,false,false,false).then(res=>{
                            //     if (res.status_code === 200) {
                            //         cv_interact.success('Success!');
                            //         mThis.userListView.showPage(mThis.getFilterData());
                            //         me.hide();
                            //     }
                            //     else
                            //         cv_interact.error(res.error_message);
                            // }); 
                        }
                    }
                    ],
                    onPrepareForm:(instance,data,fields,divModal)=>{
                        console.log('data',data);
                        VSUtil.setComboItems(fields.user_id, data.users ,'id','user_name',false,null,null);
                    },
                    onClose:(canceled)=>{
                    //   alert(' Closing with cancel = ' + canceled);
                    }
                });
                AssignUserDialog.show(op);
            return;
        }
    }

    this.editBranch = (id, lnk)=>{
        if (lnk) {
                let op = {
                    id: lnk.dataset.id,
                    branch_id: lnk.dataset.id,
                    title:'Modify Branch',
                    default:{
                    },
                    onClose: () => {
                        mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
                    }
                };
                CreateBranchDialog.show(op);
            return;
        }
    }

    this.deleteBranch = (branch_id, lnk)=>{
        if (lnk) {
            let op = {
                branch_id: branch_id
            };
            if(!AuthManager.allowed(101)) return;
            if(op.branch_id)
            {
                cv_interact.confirm('Delete this Branch?',{
                    title: 'Delete Branch',
                    context: 'delete'
                },(e) => {
                    if(e)
                    {
                        vsapi.call(`${main_view.base_url}/api/branch/delete`,op,null).then(res => {
                            if(res.status_code === 200)
                            {
                               cv_interact.success('success!');
                                mThis.userListView.showPage(mThis.getFilterData(), mThis.userListView.current_page);
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
    }

    this.initDropdownMenus = (Container)=>{
        const menuOptopns = {
            containerElement: Container,
            actionButtonClass:"btn_um_action",
            cssClass:"bg-white box-shadow ",
            //menuItemClass:"",
            menus:[
                // {
                // html:'<span class="ps-2  " vslang="titles.Asign Branch">Asign User</span>',
                // icon:`<i class="fa-solid fa-user-pen fs-5 text-info"></i>`,
                // cssClass:"border-bottom pb-2",
                // name:"asign_user"
                // },
                 {
                html:'<span class="ps-2  " vslang="titles.Set Director"></span>',
                icon:`<i class="fa-solid fa-user-pen fs-5 text-info"></i>`,
                cssClass:"border-bottom pb-2",
                name:"set_director"
                },
                {
                html:'<span class="ps-2  " vslang="titles.Modify Branch">Modify Branch</span>',
                icon:`<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                cssClass:"border-bottom pb-2",
                name:"edit_branch"
                },
                {
                html:'<span class="ps-2  " vslang="titles.Delete Branch">Delete Branch</span>',
                icon:`<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                cssClass:"border-bottom pb-2",
                name:"delete_branch"
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
                    case 'asign_user':{
                        mThis.assignUser(id, menuLink); //Not yet defined
                        break;
                      }
                    case 'edit_branch':{
                      mThis.editBranch(id, menuLink); //Not yet defined
                      break;
                    }
                    case 'delete_branch':{
                        mThis.deleteBranch(id, menuLink); //Not yet defined
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
           mThis.beginRenderBranch(div,items,user)
        });
    }

    this.renderHeaderList = () =>{
        return [`<div data-roleid="" class="w-100 rounded-3 bg-primary-custom p-3 pb-0 box-shadow text-white mb-3 position-relative">
                <div class="scope-user d-flex align-items-center row gy-2">
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Name</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Website</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Phone Number</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Address</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Fst cp Name</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Fst cp Phone</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Snd cp Name</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Snd cp Phone</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize"></span>
                            </h6>
                        </div>
                    </div>
                    
                </div>
            </div>`].join('');
    }

    this.beginRenderBranch = (div,items,current_user) => {
        const d = current_user;
        let html = '';
        html = mThis.renderHeaderList();
        div.innerHTML = html;
        let search_value = mThis.elSearch.value;
        let cnt = 0;
        items.forEach(branch => {

            html = [html,`<div data-id="${branch.id}" class="w-100 rounded-3 border-start border-5 border-info-custom p-3 box-shadow bg-white mb-3 position-relative">
                <div class="scope-user d-flex align-items-center row gy-2">
                    
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.name || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col" >
                        <div class="d-block" >
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">`,branch.website?`<a href="javascript:void(0)" data-link ="${branch.website||'#'}" onClick= class="webite-view"> View <i class="fas fa-eye text-info fs-6"></i></a>`: 'N/A',`</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.phone_number || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                            <span class="text-capitalize">`,branch.address?`<a href="javascript:void(0)" data-link ="#" class="address-view"><i class="fa-solid fa-map-location-dot fs-6"></i> Address </a>`: 'N/A',`</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.first_cp_name || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.first_cp_phone || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.second_cp_name || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.second_cp_phone || 'N/A'}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-flex align-items-center justify-content-end h-100">
                        <div class="d-flex flex-row width-locked-icon">
                          ${branch.is_locked ? '<i class="fa-solid fa-ban fs-4 text-danger"></i>' : ''}
                        </div>
                            <button class="btn_um_action btn btn-sm btn-outline-primary-custom rounded-5 text-nowrap" type="button" data-roleid = "${(branch.role_id || branch.primary_role_id) ||''}" data-id="${branch.id}" data-loginname="${branch.login_name}" data-lock="${branch.is_locked ? 'unlock' : 'lock'}">
                                <span class=" " vslang="buttons.Action">Action</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`].join('');
            cnt++;
        });
        if (cnt ===0){
            html = `<div class="d-flex justify-content-center align-items-center" style="height:50vh">
            <div class="no_data">
              <img style="width:200px" src="${main_view.asset_url}/images/icons/no_data.webp" alt="No Data">
              <p>${search_value? 'There seems to be no matched branches found!': 'No branches to show yet!'}</p>
            </div>
           </div>`;
        }
        div.innerHTML = html;
        const parent = div.parentElement;
        parent.style.height = (window.innerHeight - 200)+'px';
        window.onresize = function(e)
        {
            e.preventDefault();
            parent.style.height = (window.innerHeight - 200)+'px';
        }
        mThis.setMenuAction(div.querySelectorAll('.btn-action'));
        div.querySelectorAll('.custom-buttons').forEach(ctn => {
            mThis.setEvent(ctn);
        });
    }

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
                            vsapi.call(`${main_view.base_url}/api/umt-settings/delete`,op,null).then(res => {
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
                        user_class: mThis.elFilter_user_role.value
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
                    // AddUserDialog.show(op);
                    SetPasswordDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-roles');
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    user_name: btn.dataset.user,
                };
                let dlg = '';
               // console.log(123,op);
                if(op.user_id && op.user_id !== 'undefined')
                    dlg = new GeneralDialog({
                    title:"Change User Role", 
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
                    showCancelButton:true,
                    createFields:() =>{
                        return [`<div class="row">
                                    <div class="form-group col-md-12">
                                        <label class="form-label" vslang="titles.User">User</label>
                                        <input type="text" value = "`,op.user_id,`" class="form-control data-input" data-field="user_id" placeholder="`,op.user_name,`" readonly />
                                    </div>
                                    <div class="form-group col-md-12 ">
                                        <label for="payee_id" class="form-label " vslang="titles.Roles">Roles</label>
                                        <select id="_plq_supplier" class="modal-select2 data-input filter-field" data-field="role_id"></select>
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
                    prepareFormOptions:{
                        createTitle:"Modify UM Role",
                        modifyTitle:"Edit Role",
                        api:{
                        targetProp:"data",
                        endpoint:`${mThis.base_url}/api/role/list`,
                        //    params:()=>{
                        //         return {'id':1};
                        //     }
                            // params: {id:1}
                        }
                    },
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
                            // p.category =lnk.dataset.category??'bill_payment';
    
                            vsapi.call(`${main_view.base_url}/api/user/role-change`,p,false,false,false).then(res=>{
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
                        // console.log('fields',fields);
                        fields.role_id.onchange = (e)=>{
                            // console.log('date chang');
                        }
                        VSUtil.setComboItems(fields.role_id, data ,'id','name',false,null,null);
                    },
                    onClose:(canceled)=>{
                    //   alert(' Closing with cancel = ' + canceled);
                    }
                });
                dlg.show(); 
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-login-name');
            if(btn)
            {
                let op = {
                    button:null,
                    user_id: btn.dataset.id,
                    login_name: btn.dataset.loginname,
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
                    AddUserDialog.show(op);
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
                    AddUserDialog.show(op);
                return;
            }

            btn = VSUtil.closestLimited(e.target,'.btn-um-reports');
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

            search_value: mThis.elSearch.value
        }
    }

    this.prepareFormOption = (onFinish=null) => {
        vsapi.call(`${main_view.base_url}/api/user/form-options`,null,null,false).then(res => {
            if(res.status_code === 200)
            {
                const d = res.data ?? [],
                el = mThis.elFilter_user_role;
                // VSUtil.setComboItems(el,d.roles,'id','role_name',true,'All Roles',null);
                // VSUtil.setComboItems(mThis.elFilter_user_branch,d.branches,'id','branch_name',true,'All Branches',null);
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