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
    this.elSearchRole = this.self[0].querySelector('#_search_role');
    this.btnPrint = this.self[0].querySelector('#_cul_btnPrint');
    this.div_filter_fields = this.self[0].querySelector('#div_filter_fields');
     
    this.renderRoleCards = (data, container = null) => {;
        let html = '';
        let cnt = 0;
        container = container || mThis.tblRoles_body;
        
        container.innerHTML =  '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><div class="animation-line" style="height:2px;margin:0;"></div></div>';
        (data || []).map(item =>{ 
            html = [ html,`<div data-roleid="${item.id}" data-usersearchvalue="`,item.user_search_value,`" data-userclass="${item.user_class}" data-rolename="${item.name}" class="col-sm-2 role-card">
            <div class="card-content card bg-white shadow p-2 border rounded-3 d-flex flex-column justify-content-between" data-roleid="${item.id}" style="height:20vh;min-width:120px;">
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
          cnt++;
        });
        container.innerHTML = html;

        /** Hide RoleTabView if there initially because there is no Role selected at first */
          if(!mThis.selected_role){
            try{
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display= 'none';
            }catch (e){
                console.error(e);
            };
          }   
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
                let role_name = card.dataset.rolename || card.dataset.name; 
                RoleTabView.displayContent({"role_id":role_id,"user_class":user_class, "name":role_name});
                return;
            }
        };

       let card = null; 
       let user_search_value = null;
       if(cnt ===1){
            card = container.querySelector('div.role-card');
            if(card) user_search_value = card.dataset.usersearchvalue;
       }else if (cnt >1 ){
            card = container.querySelectorAll('div.role-card')[0]; 
       }else{
          container.innerHTML = '<div class="d-flex flex-column justify-content-center align-items-center h-100 w-100"><h5>No roles were found!</h5></div>'
       }

       let role = null;
       if(card){
         role = {
            "role_id":card.dataset.roleid || card.dataset.id,
            "name":card.dataset.rolename || card.dataset.name,
            "user_class":card.dataset.userclass
         }
         card.classList.add('selected');
       }
       RoleTabView.displayContent(role,null,{"user_search_value":user_search_value}); 
    }
 

    /** displayItems() display items by category as its header similiar to Report Center's reports display layout */
    this.displayItems = (data, div) => {
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

    this.loadRoles = (filter, onFinish)=>{
        filter = filter || {"search_value":mThis.elSearchRole.value};
        vsapi.call(`${main_view.base_url}/api/role/list`,filter,null,false).then(res =>{
           const roles = res.status_code ==200? res.data : [];
           onFinish(roles); 
        });
    }

    this.init = () => {
        if(mThis.initAlready) return;
        
        mThis.elSearchRole.onkeyup = e =>{
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(()=>{
                let p = mThis.getFilterData();
                mThis.loadRoles(p, roles =>{
                    mThis.renderRoleCards(roles);
                });
            },250);
        };

        mThis.lnkNewRole.addEventListener('click', e =>{
            e.preventDefault();
            let op = {
                'id': null,
                'onclose':(d)=>{
                    mThis.loadRoles(mThis.getFilterData(), roles =>{
                        mThis.renderRoleCards(roles);
                    }); 
                }
            }
            //RoleDialog.show(op);
        });

        mThis.div_filter_fields.querySelectorAll('.filter-field').forEach(el=>{
            el.onchange = (e)=>{
                e.preventDefault();
                mThis.loadRoles(mThis.getFilterData(), roles =>{
                    mThis.renderRoleCards(roles);
                });
            }
        });
     
        mThis.initAlready = true;
    }
 
    this.getFilterData = ()=>{
        let p = {};
        p.search_value = mThis.elSearchRole.value;
        return p; 
    }
    
    this.show = (options)=>{
        options = options || {};
        mThis.init();
        mThis.selected_role = null;
        mThis.options = options;

        main_view.setTitle(mThis.title_prop);
         
        main_view.setTitle(mThis.title_prop);

        mThis.loadRoles(this.getFilterData(), roles =>{
            mThis.renderRoleCards(roles,null);
           // mThis.setEvent();

        });

        mThis.self.siblings().hide();
        mThis.self.fadeIn(200);
    }
    this.updateSelectRole = function(col_name, data){
        let selected_class_name = 'row-selected';
        mThis.tblRoles_body.querySelector(`tr.${selected_class_name}>td.${col_name}`).innerHTML = data;
    }

};

/** begin:: vs-tab-view for role details */
const RoleTabView = new function(){
    const mThis = this;
    this.self = RoleManagementComponent.self[0].querySelector('#_um_role_tab');
    this.tabHeader = this.self.querySelector('div.vs-tab-header');
    this.tabBody = this.self.querySelector('div.vs-tab-body');
    this.userListView = null;
    this.tabPages = {};
    this.last_view_name = 'view_users';
   
    const user_cols = [
        {
            title:"Photo",
            data:(data,index,tr)=>{
                return [`<img src="`,data.image_url,`" class="image-student-tbl">`].join('');
            }
 
         },
        {
           title:"Loin Name",
           data:(data,index,tr)=>{
               let lock_html = data.is_locked ==1? '<span class="d-block text-danger fw-sembold p-1">Locked</span>' : '';
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
            title:"Primary Role",
            data:(data,index,tr)=>{
                return ['<span class="d-block">',data.role_name,'</span>','<span class="text-left p-1">',`<span class="text-muted">`,` ID: </span>`,(data.official_code || 'NA'),'</span>'].join('');
            }
 
         },
        {
           title:"Last Login",
           data:(data,index,tr)=>{
               return [`<span class="d-block p-1">Last login: `,data.last_login_date,`</span>`].join('');
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
                return [`<div class="d-flex gap-2 flex-wrap">`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-edit-user"><i class="fa fa-edit"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-reset-password"><i class="fa fa-key text-warning"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" data-action="`,(data.is_locked ==1? 'unlock':'lock'),`" class="lnk-lock-user"><i class="${data.is_locked==1? 'fa fa-unlock text-info':'fa fa-lock text-danger'}"></i></a>`,
                `<a data-id="`,data.id,`" href="javascript:void(0)" class="lnk-remove-user"><i class="fa fa-trash text-danger"></i></a>`,
                `</div>`].join('');
            }
 
         }
  ]; 

 
/** begin: UserPanel defintion */
 this.UserPanel = new function(){
    //NOTE  "mThis" refers to RoleTabView instance
    const that = this;
    this.divSelf =  mThis.tabBody.querySelector('#view_users');
    this.btnAddRoleMember = this.divSelf.querySelector('#_um_role_add_member');
    this.btnCreateUser = this.divSelf.querySelector('#_um_role_create_user');
    this.elSearchUser = this.divSelf.querySelector('#_um_role_search_user');
 
    //createUser
    this.createLogin = (user_class=null)=>{
        const op = {
            user_id: null,
            open: 'add-user',
            default: {
                official_code: "",
                user_class: mThis.selected_role.user_class,
                role_id:mThis.selected_role.role_id,
                phone_number: "",
                full_name: ""
            },
            onClose: (user) => {
                if (user){
                    that.elSearchUser.value =  user.login_name;
                    mThis.userListView.showPage(that.getFilterData());
                }
            }
        };
        if(!AuthManager.allowed(100)) return;
        AddUserDialog.show(op);
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
               vsapi.call([main_view.base_url, '/api/role/add-members'].join(''),p,null,false).then(res =>{
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

    this.btnCreateUser.onclick = e =>{
        e.preventDefault();
        that.createLogin(null);
        //alert('Create user in role ID = ' + mThis.selected_role_id);
    }
   
    this.elSearchUser.onkeyup = e =>{
        e.preventDefault();
        setTimeout(()=>{
           mThis.userListView.showPage(that.getFilterData());
        },250);
    };  
 }
/** end: Userpanel defintion */
  
    //begin::init RoleTabView
        this.initOnce = ()=>{
            if (mThis.initAlready) return;
            mThis.tabHeader.querySelectorAll('a.tab-button').forEach(lnk => {
                let page_id = lnk.dataset.target;
                const div = mThis.tabBody.querySelector(`#${page_id}`);
                if(div) mThis.tabPages[page_id] = div;         
            });
        
            this.tabHeader.addEventListener('click', e=>{
                e.preventDefault();
                const lnk = VSUtil.closestLimited(e.target,'a.tab-button');
                if(lnk){
                    let view_name = lnk.dataset.target || lnk.dataset.view;
                    //let view_name = lnk.dataset.view || lnk.dataset.viewname;
                    mThis.displayContent(mThis.selected_role,view_name);
                    mThis.setActivePage(view_name, lnk); 
                    return;
                }
                
            });

            mThis.userListView = new ListView('_um_role_user_list',{     
              tableClass:'table user-table',
              columns: user_cols,
              perPage:6,        
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
            mThis.tblUsers.onclick = e=>{
               e.preventDefault();

              //Click on Remove User
               let lnk = VSUtil.closestLimited(e.target,'.lnk-remove-user');
               if (lnk){
                 cv_interact.confirm(['Are you sure to remove the selected user from ',mThis.selected_role.name || 'the role', '?'].join(''),{"title":"Remove User","context":'delete', "confirmButtonText":"Remove"},e =>{
                     if(e){
                         let user_id = lnk.dataset.id || lnk.dataset.userid;
                         let p = {"role_id":mThis.selected_role.role_id, "user_id":user_id};
        
                         vsapi.call([main_view.base_url, '/api/role/remove-member'].join(''),p,null,false).then(res =>{
                             if(res.status_code===200){
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
                    if(!AuthManager.allowed(109)) return;
                    let user_id = lnk.dataset.id || lnk.dataset.userid;
                    let tr = VSUtil.closestLimited(e.target,'tr');
                    let user_name = tr.dataset.fullname;

                    let op = {
                        button:lnk,
                        user_id: user_id,
                        user_name: user_name,
                        open: 'reset-password',
                        onClose: () => {
                            mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
                        }
                    };
                    if(op.user_id && op.user_id !== 'undefined') AddUserDialog.show(op);
                    return;
               }

             //Click on lock user
             lnk = VSUtil.closestLimited(e.target,'.lnk-lock-user');
             if(lnk){
                if(!AuthManager.allowed(113)) return;
                    let user_id = lnk.dataset.id || lnk.dataset.userid;
                    let tr = VSUtil.closestLimited(e.target,'tr');
                    let user_name = tr.dataset.fullname;
                    let login_name = tr.dataset.login;
                    //let islocked = tr.dataset.islocked;
                    let action = lnk.dataset.action; //islocked ==1? 'unlock': 'lock';
                    let op = {
                        user_id: user_id,
                        user_name: user_name,
                        action: action
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
                            vsapi.call(`${main_view.base_url}/api/user/set-lock-status`,op,lnk,false).then(res => {
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


            //Click on edit user
             lnk = VSUtil.closestLimited(e.target,'.lnk-edit-user');
             if(lnk){
                  if(!AuthManager.allowed(112)) return;
                  let user_id = lnk.dataset.id || lnk.dataset.userid;
                  let tr = VSUtil.closestLimited(e.target,'tr'); 
                  //get primary role_id. If user does not have primary role_id, then do not allow edit information
                  const role_id = tr.dataset.roleid;
                  const user_class = tr.dataset.userclass;
                  // if(!role_id || role_id==0){
                  //   cv_interact.warning('This user must have one role, so that it is possible to view or edit user information');
                  //   return;
                  // }
                  let op = {
                      user_id: user_id,
                      role_id: role_id,
                      default:{
                          user_class: user_class
                      },
                      open: 'add-user',
                      onClose: () => {
                          mThis.userListView.showPage(mThis.UserPanel.getFilterData(), mThis.userListView.current_page);
                      }
                  };
                  if(op.user_id > 0) AddUserDialog.show(op); else cv_interact.error('User ID is unexpectedly missing or No user ID is selected');
             
                 return;
            } 

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
    this.displayContent = (role,view_name = null,op=null) =>{
         op = op || {};
         //remember role_id
         mThis.selected_role = role;
        if(!role || (!role.role_id || role.role_id ==0)){
            RoleTabView.self.classList.remove('d-flex');
            RoleTabView.self.style.display='none';
            return;
        }
        view_name = view_name || mThis.last_view_name;
        const role_id = role.role_id;  
        switch(view_name){
            case 'view_users':
                mThis.userListView.showPage({"role_id":role_id,"search_value":op.user_search_value});
                
              break;
            case 'view_applications':
                //mThis.appListView.showPage({"role_id":role_id});
               break;
            case 'view_apps':
                //mThis.moduleListView.showPage({"role_id":role_id});
               break;   
            case 'view_modules':
                //mThis.moduleListView.showPage({"role_id":role_id});
               break;   
            case 'view_permissions':
                mThis.displayPermissionList();
               break;
            case 'view_reports':
               mThis.displayReportList();  
              break;
            default:
                RoleTabView.self.classList.remove('d-flex');
                RoleTabView.self.style.display='none';
                return;
                //break;                        
        }
        RoleTabView.self.classList.add('d-flex');
        //RoleTabView.self[0].style.display='block';
        mThis.setActivePage(view_name);
        //console.log('Active Page: ',view_name, ' Role: ', role_id);
        //let p = {"role_id":role_id};
  
      
        // vsapi.call(api,p,null,false).then(res =>{
        //    if(res.status_code ==200){
        //       console.log(res.data); 
        //    }else cv_interact.error(res.error_message); 
        // });
    }
 

    this.displayReportList = ()=>{
        let data = {
            "Company Reports":{
                id:1,
                name:"Company Reports",
                items:[
                    {
                        id:1,
                        name:"Daily Operation Summary",
                        status_id:1
                    },
                    {
                        id:2,
                        name:"Daily Incomes",
                        status_id:1
                    }
                ]
            },
         "Operations":{
            id:2,
            name:"Operations",
            items:[
                {
                    id:3,
                    name:"Daily package counts",
                    status_id:0
                },
                {
                    id:4,
                    name:"Active Merchants",
                    status_id:0
                },
            ]
         }
        };
 
        mThis.div_reports = mThis.div_reports || mThis.self.querySelector('#_um_role_report_list');
        mThis.reportList = mThis.reportList || new  UMExpandItemView( mThis.div_reports,{
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
            onStatusChange:(status,item_id,parent_id)=>{
                console.log('todo: save via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
            }
        });

        let p = {role_id: mThis.selected_role.id, app_id:null, search_value:null};
        vsapi.call([main_view.base_url, '/api/role/reports'].join(''), p,false,false).then(res =>{
             const d = res.status_code ==200? res.data: {};
             mThis.reportList.setData(d);
        });

       
    }


    this.displayPermissionList = ()=>{
        let data = {
            "Sales Team":{
                id:1,
                name:"Sales Team",
                items:[
                    {
                        id:1,
                        name:"Create team member",
                        status_id:1
                    },
                    {
                        id:2,
                        name:"Delete Tema member",
                        status_id:1
                    }
                ]
            },
         "Driver Balances":{
            id:2,
            name:"Driver Balances",
            items:[
                {
                    id:3,
                    name:"Receive driver payments",
                    status_id:0
                },
                {
                    id:4,
                    name:"Delete driver payment",
                    status_id:0
                },
            ]
         }
        };

        mThis.div_permissions = mThis.div_permissions || mThis.self.querySelector('#_um_role_prn_list');
        mThis.permissionList = mThis.permissionList || new  UMExpandItemView( mThis.div_permissions,{
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
            onStatusChange:(status,item_id,parent_id)=>{
                console.log('todo: save permission via api ', status, ' id: ',item_id, ' cat_id ',parent_id);
            }
        });
        mThis.permissionList.setData(data);
    }

}
/**end:: vs-tab-view for role details */


//begin:: FindUserDialog
const FindUserDialog = new function () {
    let mThis = this;
    this.self = main_view.appContent.children('#_um_dlgFindUser');
    this.elTitle = this.self[0].querySelector('.modal-title');
    this.elSearch = this.self[0].querySelector('.search-user');
    this.btnOK = this.self[0].querySelector('#_um_dlgFindUser_btnOK');
 
    this.options = {};
    const found_student_cols = [
       {
         "title":"Login Name",
         "data":(data,index,tr)=>{
            return data.login_name;
         }
       },
       {
        "title":"Full Name",
        "data":(data,index,tr)=>{
           return data.full_name;
        }
      },
      {
        "title":"ID",
        "data":(data,index,tr)=>{
           return data.official_code;
        }
      },
      {
        "title":"Phone Number",
        "data":(data,index,tr)=>{
           return data.phone_number;
        }
      },
      {
        "title":"User Class",
        "data":(data,index,tr)=>{
           return data.user_class;
        }
      },
      {
        "title":"Role Name",
        "data":(data,index,tr)=>{
           return data.role_name;
        }
      }
    ];

    this.foundUserList = new ListView('_um_role_found_user_list',{
         columns:found_student_cols,
         fetchApi:[main_view.base_url, '/api/user/list'].join(''),
         apiCluster:null,
         clientSidePagination:false,
         perPage:5,
         rowCreated:(data,index,tr)=>{
            tr.dataset.id = data.id || data.user_id;
            tr.dataset.login =  data.login_name;
            tr.dataset.name = data.full_name;
            tr.dataset.officialcode = data.official_code;
            tr.dataset.phonenumber = data.phone_number;
            tr.dataset.email = data.email;
            tr.dataset.rolename = data.role_name;
            tr.dataset.roleid = data.role_id;
            tr.dataset.userclass = data.user_class;
         }
    });

    mThis.tblUsers = this.foundUserList.getTable();

    /** find User on FindUserDialog */
    mThis.elSearch.addEventListener('keyup', e => {
        e.preventDefault();
        setTimeout(()=>{
            mThis.foundUserList.showPage({"search_value":mThis.elSearch.value});
        },250);
       
    });

    this.tblUsers.addEventListener('click', e => {
        e.preventDefault();
        let tr = e.target.closest('tr');
        if (tr) {
            tr.classList.toggle('selected');
            tr.querySelector('td:first-child').classList.toggle('checked');
        }
    });
    
 
    this.btnOK.onclick =  e => {
        e.preventDefault();
        let users = mThis.getSelection();
        if (!users[0]) {
            cv_interact.warning("No users selected");
            return;
        }
        if (typeof mThis.options.onClose === 'function') mThis.options.onClose(users);
        mThis.self.modal('hide');
    };

    this.getSelection = () => {
        let ps = [];
        mThis.tblUsers.querySelectorAll('tr.selected').forEach(tr => {
            const d = tr.dataset;
            ps.push({ "id": d.id, "login_name":d.login, "name": d.name, "user_class": d.userclass, "role_name":d.rolename, "role_id":d.roleid });
        }); 
        return ps;
    }
 
    this.renderUsers = (users = []) => {
        const tbody = mThis.tblUsers.querySelector('tbody');
        tbody.innerHTML = '';
        let cnt = 0;
        let html = '';
        (users || []).map(user => {
            html = [html, `<tr data-id="${user.id}"><td class="checkbox"></td>`,
            `<td>`, user.login_name, `</td>`,
            `<td>`, user.full_name, `</td>`,
            `<td>`, user.phone_number ? user.phone_number : 'Not Available', `</td>`,
            `<td>`, user.user_class, `</td>`,
            `<td>`,user.role_name,`</td>`,
            `</tr>`].join('');
            cnt++;
        });
        if (cnt === 0) html = `<tr><td colspan="100%"><div class="p-3 text-center text-secondary w-100"> No matched users!</div></td></tr>`;
        tbody.innerHTML = html;
    }
 
    this.show = (options = null) => {
        options = options || {};
        mThis.options = options;
        mThis.onSelect = options.onSelect;
        mThis.elSearch.value  = '';
        //mThis.tblUsers.querySelector('tbody').innerHTML = '<tr><td colspan="100%"><div class="w-100 d-flex flex-wrap justify-content-center p-3"><h5>Search for users</h5> </div></td></tr>';

        mThis.self.modal({
            'backdrop': "static"
        });
    }
}
//end:: FindUserDialog
 
// const RoleDialog = new function(){
//         const mThis = this;
//         this.self = main_view.appContent.find('#roleDialog');
//         this.base_url = main_view.base_url;
//         this.options = {};
        
//         this.elTitle = this.self.find('#_role_dlgTitle');
//         this.btnSave =  this.self.find('#_role_dlg_btnOK');
       
//         this.elUserClass = this.self.find('#user_class') ;
//         this.onClose = null;
//         this.body =  this.self.find('.modal-body')[0];
//       //  this.div_role_info =  this.body.querySelector('#_role_dlg_body');
      
        
//         // this.body = this.self.find('.modal-body')[0];
      
//         this.prepareData = (def, onFinish) => {
//             if(!def) def = {};
//             if(mThis.user_classes){
//                 VSUtil.setComboItems(mThis.elUserClass, mThis.user_classes, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
//                 if(typeof onFinish == 'function') onFinish();
//                 return;
//             }
    
//             vsapi.call(`${main_view.base_url}/api/user/options-user-class`, null).then(res => {
//                 if(res.status_code === 200){
//                     let rows = StringSanitizer.sanitizeObject(res.data);
//                     VSUtil.setComboItems(mThis.elUserClass, rows, 'user_class', 'user_class_name', true, '(Select User Class)', def.user_class);
//                     mThis.user_classes = rows;
//                     if(typeof onFinish == 'function') onFinish();
//                 }
//             });
//         }
//         this.btnSave.on('click',function(e){
//             e.preventDefault();
//             let p = mThis.getData();
//             vsapi.call(`${mThis.base_url}/api/role/save`,p).then(res =>{
//                 if(res.status_code === 200){
//                     mThis.self.modal('hide');
//                     if(typeof mThis.options.onclose === ' function') mThis.options.onclose(p);
//                 }else
//                     cv_interact.error(res.error_message);
                
//             });
//         });

//     this.setData = (d) =>{
//         d = d || {};
//         //console.log(d);
//         mThis.div_role_info.querySelectorAll(' .data-input').forEach(el =>{
//             const data_member = el.dataset.field;
//             //console.log(data_member);
//             if(el.tagName.toLowerCase() === 'select'){

//                 el.value = d[data_member];
//                 let event = new Event('change',{
//                     bubbles: true,
//                     cancelable: true
//                 });
//                 el.dispatchEvent(event);
//             }
//             else{
//                 el.value = d[data_member]?? '';
//             }
//         });
//     }
    
//     this.getData = () => {
//         let p = {};
//         p.id = mThis.options;
//         mThis.self[0].querySelectorAll('.data-input').forEach(el=>{
//             let f = el.dataset.field;
            
//             p [f] = el.value;
//         });
        
        
//         return p;
//     }

//     this.show = (options)=>{
//         if (!options) options = {};
//         mThis.options = options;
//         mThis.prepareData(mThis.options,()=>{
//             mThis.setData();
//             mThis.self.modal({
//                 backdrop: 'static'
//         });
//       });
      
//     }
// }  