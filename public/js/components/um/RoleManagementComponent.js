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
                console.log(p);
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
                    let page_id = lnk.dataset.target;
                    let view_name = lnk.dataset.view;
                    mThis.displayContent(mThis.selected_role,view_name);
                    mThis.setActivePage(page_id, lnk); 
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
                 cv_interact.confirm(['Are you sure to remove the selected user from ',mThis.selected_role_name || 'the role', '?'].join(''),{"title":"Remove User","context":'delete', "confirmButtonText":"Remove"},e =>{
                     if(e){
                         let user_id = lnk.dataset.id || lnk.dataset.userid;
                         let p = {"role_id":mThis.selected_role.role_id, "user_id":user_id};
                         console.log(p);
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
                //mThis.permissionListView.showPage({"role_id":role_id});
               break;
            case 'view_reports':
                //mThis.reportListView.showPage({"role_id":role_id});
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

    // this.findUsers = () => {
    //     let val = mThis.elSearch.value;
    //     let p = { 'user_class': mThis.options.user_class, 'search_value': val };
    //     vsapi.call(`${main_view.base_url}/api/user/list`, p, null, false).then(res => {
    //         if (res.status_code === 200) {
    //             let d = StringSanitizer.sanitizeObject(res.data, null, ['image_url', 'login_name']);
    //             mThis.renderUsers(d);
    //         }
    //     })
    // }

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
//         this.div_role_info =  this.body.querySelector('#_role_dlg_body');
      
        
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
//         });
      
// }
// }

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
    
