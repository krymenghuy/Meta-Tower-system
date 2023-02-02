'use strict' 

//begin::RoleManagementComponent
let RoleManagementComponent = new function(){
    let mThis = this;
    //this.elScreenTitle = $('#screen_title');
    this.title_prop ='manage roles';
    mThis.base_url = main_view.base_url; // $('#__base_url').val();
    this.onClose = null;
    this.initialized = false;
    
    //Allow Add/Remove users from role
    this.allow_add_remove_users = false;

    this.init = function() {
        this.self = $('#_um_roleManagementComponent');
        mThis.initialized = true ; 
 };

 //end::RoleManagementComponent.init()

 this.show = function(options =null) {
      if (!mThis.initialized) alert('RoleListComponent.init() is not called for inialization');
         mThis.onClose = (options?options:{}).onClose; 
         main_view.setTitle(mThis.title_prop);
         mThis.self.show().siblings().hide(); 
        //Within the RoleManagementComponent, show RoleListPanel as default view 
        RoleListPanel.show();
    };
    
    this.hide = function() {
        mThis.self.hide();
    };
      
};
//end::RoleListComponent
 
//begin::RoleListPanel
let RoleListPanel = new function() {
    let mThis = this;
    this.self = $('#_um_roleListPanel');
    this.base_url = main_view.base_url; // $('#__base_url').val(); 
    this.btnClose = $('#_um_btnCloseRoleList');
    this.lnkNewRole = $('#_um_lnkNewRole');
     
    this.tblRoles = $('#_um_tblRoles');
    this.tblRoles_body = $('#_um_tblRoles_body');
  
        // mThis.btnClose.off('click').on('click',function(e) {
        //     UserManagement.showPrevious();
        // });

       mThis.lnkNewRole.on('click',function(e) {
          e.preventDefault();
          let onClose = function(e) {
              //do nothing on Closing Edit Form
              return;
          }

          EditRolePanel.show(null,onClose);
      });
      
    //   mThis.tblRoles_body.on('mouseover','tr',function(e){
    //       let el = $(this).find('._um_item_action_button');
    //       el.show();
    //   }).on('mouseleave','tr',function(e){
    //      let el = $(this).find('._um_item_action_button');
    //      el.hide();
    //   }); 

    /*** begin::btn_role_action's action event hendler  **/
        mThis.tblRoles_body.on('click','tr>td.col_action a._um_ra_role_prns',function(e) {
            e.preventDefault();
            let role_id = $(this).parent().data('roleid');
            let role_name = $(this).parent().data('rolename');    
            //Set Main screen's Title and Sub Title
             //UserManagement.setTitles('Role Permissions',role_name);
            //  UserManagement.goBackFunction = function(){
            //       //If go back, come to this screen (e.g: RoleList, that is RolemanagementComponent's sub_component)
            //       let option = {};
            //       option.title ="Manage Roles"; 
            //       option.subTitle =null;
            //       mThis.show(option);
            //  }

             //Show permission list screen, which is a sub component within the RoleManagementComponent
                let option = {};
                option.title = "Permission List";
                option.role_id = role_id;
                option.role_name = role_name;
                // option.onClose = function(e) {
                // }
                PermissionList.show(option); 
        });
    

        mThis.tblRoles_body.on('click','tr>td.col_action a._um_ra_delete',function(e) {
            e.preventDefault();
            
            let role_id = $(this).parent().data('roleid');
            cv_interact.confirm('Delete this role?','Delete Role',function(e){
                if(e){
                    mThis.deleteRole(role_id);
                }
            });
        });
        
        mThis.tblRoles_body.on('click','tr>td.col_action a._um_ra_modify',function(e) {
            e.preventDefault();
            let role_id = $(this).parent().data('roleid');
            EditRolePanel.show(role_id); 
        });

        mThis.tblRoles_body.on('click','tr>td.col_action a._um_ra_add_member',function(e) {
            e.preventDefault();
            let role_id = $(this).parent().data('roleid');
            mThis.addRoleMember(role_id,function(new_user_count){
                if(new_user_count){
                    //Refresh data in column "student_count"
                    mThis.updateSelectRole('col_user_count',new_user_count); 
                    //display user list on RoleTabView. NOTE there are three tabs on thie tabView: Users,Modules,Permissions, etc 
                    RoleTabView.show(role_id,'users');
                }
            });  
        });
       
        mThis.tblRoles_body.on('click','tr>td.col_action a._um_ra_add_module',function(e) {
            e.preventDefault();
            let role_id = $(this).parent().data('roleid');
            mThis.addAccessibleModule(role_id,function(e){
                if(e){
                    RoleTabView.show(role_id,'modules');
                }
            });  
        });
        
    /**end::btn_role_action's action event handler **/


    /** begin::tblRoles's action dropdown menu **/
            
            /** When user clicks outside tblRoles table's dropdown menus, then hide the dropdown menus **/
            $(document).on('click',function(e) 
            {   
                let container = mThis.tblRoles_body.find('.dropdown'); 
                if (container) {
                    // if the target of the click isn't the container nor a descendant of the container
                    if (!container.is(e.target) && container.has(e.target).length === 0) 
                    {
                        mThis.tblRoles_body.find('.dropdown-menu').each(function(){
                            $(this).removeClass('show');
                        });

                        //mThis.prev_dropdownMenu = null;
                    } //else alert("Clicked inside the DIV.dropdown");    
                }  
                    
                e.stopImmediatePropagation();
            }); 

        mThis.tblRoles_body.on('click','.btn_role_action',function(e) {
            e.preventDefault();
            let p = $(this).parent();
            let role_id = $(this).data('roleid');  /** <div class="dropdown-menu" data-roleid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
            let role_name = $(this).data('rolename'); 
                   
            let dropdownMenu = p.find('.dropdown-menu');
            if (!dropdownMenu || dropdownMenu.length <= 0) {
            p.append(mThis.createDropdownMenuHtml_role(role_id,role_name));
            dropdownMenu = p.find('.dropdown-menu');
            }
            //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
            if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

            dropdownMenu.toggleClass('show');
            if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

            //Toggle menu-text between "Lock User" and "Unlock User"
            //let is_locked = $(this).closest('tr').data('islocked');
            //let span = $(this).parent().find('a._um_ua_lock span.menu-text');
            // if(is_locked ==1 || is_locked ==true)
            //     span.text('Unlock User');
            // else span.text('Lock User');

        });

        mThis.tblRoles_body.on('mouseover','tr',function(e){
            let td_action = $(this).find('td.col_action');
            let btn_class_action = td_action.find('a.btn_role_action');
            btn_class_action.css('border-color','orange !important').html(`<i class="fa fa-user" style="color:red"></i`);
        }).on('mouseleave','tr',function(e) {
            let td_action = $(this).find('td.col_action');
            let btn_class_action = td_action.find('a.btn_role_action');
            let numero = btn_class_action.data('numero');
            btn_class_action.html(numero);
            //alert(td_action.find('a').text());
            //btn_class_action.html(numero);
            $(this).find('.dropdown-menu').removeClass('show');
        });

        ////Row selection and animation
        mThis.tblRoles_body.on('click','tr',function(e){
            e.preventDefault();
            let role_id = $(this).data('roleid');
            mThis.selected_role_name  = $(this).data('rolename');
            mThis.selected_role_id = role_id;
            if(mThis.prev_selected_role_row) mThis.prev_selected_role_row.removeClass('row-selected-light');
            $(this).toggleClass('row-selected-light');
            if($(this).hasClass('row-selected-light'))  mThis.prev_selected_role_row = $(this); 
            RoleTabView.show(role_id,null); 
        });

        //Create dropdown menus html for table tblUsers> row  
        this.createDropdownMenuHtml_role = function(role_id, role_name) {
            //ga = 'groups_action' = > ga_delete, ga_modify
            let html = ['<div class="dropdown-menu" data-roleid="',role_id,'" data-rolename="',role_name,'">',
                '<a class="dropdown-item _um_ra_delete" href="#"><i class="fa fa-times" style="color:red;margin-right:5px"></i>Delete Role</a>',
                '<a class="dropdown-item _um_ra_modify" href="#"><i class="fa fa-edit" style="color:grey;margin-right:5px"></i>Modify Role</a>',
                //'<a class="dropdown-item _um_ra_status" href="#"><i class="fa fa-edit" style="color:red;margin-right:5px"></i> <span class="menu-text">Lock Role</span></a>',
                '<div class="dropdown-divider"></div>',
                '<a class="dropdown-item _um_ra_add_member" href="#"><i class="fa fa-user" style="color:blue;margin-right:5px"></i>Add Member</a>',
                '<a class="dropdown-item _um_ra_add_module" href="#"><i class="fa fa-list-alt" style="color:grey;margin-right:5px"></i>Add Access Module</a>',
                '<a class="dropdown-item _um_ra_role_prns" href="#"><i class="fa fa-list-alt" style="color:grey;margin-right:5px"></i>Permission List</a>',
                '</div>'].join('');
            return html;
        }

        //end::tblRoles' action dropdown menu

      this.addRoleMember = function(role_id,onFinish){
        //let role_id = $(this).parent().data('roleid');
        let p = {};
        p.role_id = 0; //Choose users from all role (p.role_id =0)
        vsapi.call([mThis.base_url,'/api/getComboItems_user'].join(''),p).then((rows)=>{
            
           if(rows){
                let option = {};
                option.title ="Choose User";
                //option.def_value =null;
                option.data =StringSanitizer.sanitizeObject(rows,'email');
                option.valueMember= "id";
                option.textMember="login_name";
                option.dataLabel = "Select User";
                InputBox2.show(option,function(d) {
                    if(d){
                          //add user to the selected role here
                            let p = {};
                            p.role_id = role_id;
                            p.user_id = d.value;
                            vsapi.call([mThis.base_url,'/api/addRoleMember'].join(''),p).then((result)=>{    
                                if(result.status_code ===200) {
                                    onFinish(result.user_count);  
                                } else cv_interact.alert(err,'','error');
                            });
                    }
                });
           }
        });
      }  
 
    this.addAccessibleModule = function(role_id,onFinish){
        vsapi.call([mThis.base_url,'/api/getComboItems_module'].join(''),null).then((res)=>{
          //if(typeof rows =='string') alert(rows);
          let rows = [];
          if (res.status_code ===200) rows = res.data;
          if(rows) {
             let option = {};
             option.title="Choose Module";
             option.dataLabel = "Select Module";
             rows = StringSanitizer.sanitizeObject(rows);
             rows.unshift({id:null,name:'(Select Application Module)'});
             option.data = rows;
             option.valueMember ="id";
             option.textMember ="name";
             option.btnOKText = "Add Now";
             option.defaultValue =null; 
             option.blankErrorMessage ='Please choose a module';   
             InputBox2.show(option,function(d) {
               if(d){
                 let p = {};
                 p.role_id =role_id;
                 p.module_id = d.value;
                 vsapi.call([mThis.base_url,'/api/addAccessibleModule'].join(''),p).then((res)=>{
                     if(res.status_code ===200){
                        onFinish(true);
                     }else cv_interact.alert(res.error_message,'','error');
                 }); 
               }
             });
          }
        });
    }  

     /*option ={title}*/ 
    this.show = function(options) {
         mThis.selected_role_id= null;
         mThis.selected_role_name = null;
        //   if (options){
        //       if(options.title) UserManagement.setTitles(options.title, options.subTitle);
        //   }
            mThis.displayRoleList(()=>{
                mThis.self.show().siblings().hide();
            });
      }

    //col_name is the class name of <td>. Example, <td class="col_user_count">
    this.updateSelectRole = function(col_name,data) {
        let selected_class_name = 'row-selected-light';
        mThis.tblRoles_body.find(['tr.',selected_class_name,'>td.',col_name].join('')).html(data); 
    }

    this.displayRoleList = function(onFinish=null){
        //let div = mThis.tblRoles.parent(); //div.table_wrapper
        //if (!div.hasClass('effect-slide-down')) div.removeClass('effect-slide-down');
        vsapi.call([mThis.base_url,'/api/getRoleList'].join(''),null).then((res)=>{
            let rows = [];
            if (res.status_code ===200) rows = StringSanitizer.sanitizeObject(res.data);
            mThis.tblRoles_body.empty();
            let i =0, c;
            do{
               c = rows[i];
               if(!c) break;
                if(!c.user_count) c.user_count = 0;
                let numero = i+1;
                let dropdown_container_html =['<div class="dropdown">',
                '<a href="#" data-roleid="',c.id,'" data-numero="',numero,'" data-rolename="',c.name,'" class="vs-btn-sm-outline-round btn_role_action" aria-haspopup="true" aria-expanded="false">',
                 numero,
                //' Action',
                '</a>',
               '</div>'].join('');

                 let html = ['<tr data-roleid="',c.id,'" data-rolename="',c.name,'">',
                 '<td class="col_action" style="width:70px">',dropdown_container_html,'</td>',
                 '<td>',c.name,'<div><span style="color:grey">User class: </span><span style="color:green;font-weight:bold">',c.user_class,'</span></div></td>',
                 '<td class="col_user_count">',c.user_count,' members</td>',
                 '</tr>'].join('');
                 mThis.tblRoles_body.append(html);
                 i++;
            }while(c);
          
            //div.addClass('effect-slide-down');
             //Hide action menus, wait until user move mouse over table row (tr)
             mThis.tblRoles_body.find('._um_item_action_button').css('display','none');
             if (typeof onFinish ==='function') onFinish();
             RoleTabView.show(0,'users');
        });
    };

    this.deleteRole = function(id){
        let p = {};
        p.role_id = id?id:0; 
        vsapi.call([mThis.base_url,'/api/deleteRole'].join(''),p).then((res)=>{
            if (res.status_code ===200){
                mThis.displayRoleList();
            } else cv_interact.alert(res.error_message,'','error');
        }); 
    }

};
//end::RoleListPanel

//begin::EditRolePanel. Used for New role and Edit role
 let EditRolePanel = new function() {
    let mThis = this;
    
    this.self = $('#_um_edit_role');
    this.base_url = $('#__base_url').val();
    this.lnkBackToRoleList = $('#_um_role_backToRoleList');
    this.btnBack = $('#_um_btnBackToRoleList');
    this.btnSave = $('#_um_btnSaveRole');
    this.elRoleName = $('#_um_edit_role_name');
    this.elUserClass = $('#_um_edit_userclass');
    this.elError = $('#_um_edit_role_error');

    this.lnkBackToRoleList.on('click',function(e){
        e.preventDefault();
        let options ={};
        options.title ="Manage Roles";
        RoleListPanel.show(options);
    });

    mThis.btnBack.on('click',function(e) {
        mThis.lnkBackToRoleList.trigger('click');
    });

    mThis.btnSave.on('click',function(e) {
        mThis.elError.html(null);

        let p = {};
        p.id = mThis.role_id;
        p.name = mThis.elRoleName.val();
        p.user_class = mThis.elUserClass.val();
        if(!p.id) p.id = 0;
        if(!p.name) p.name ='';
        if (!p.name) {
            mThis.elError.html(LocaleManager.trans('Role name cannot be empty','um-validation'));
            return;
        }
        vsapi.call([mThis.base_url,'/api/saveRole'].join(''),p),then((result)=>{
            if (result.status_code ===200){
                mThis.lnkBackToRoleList.trigger('click');
            } else mThis.elError.text(result.error_message,'','error');
        }); 
    });
    
    this.prepareData = (def,onFinish)=>{
        if(!def) def = {};
        if(mThis.user_classes) {
            CommonLib.setComboItems(mThis.elUserClass,mThis.user_classes,'user_class','user_class',true,'(Select User Class)',def.user_class);
            if (typeof onFinish ==='function') onFinish();
            return;
        }
        vsapi.call([mThis.base_url,'/api/getComboItems_userclass'].join(''),null).then((res)=>{
             let rows = [];
             if(res.status_code ===200) rows = res.data;
              rows = StringSanitizer.sanitizeObject(rows);   
              CommonLib.setComboItems(mThis.elUserClass,rows,'user_class','user_class_name',true,'(Select User Class)',def.user_class);
              mThis.user_classes = rows;
              if (typeof onFinish ==='function') onFinish();   
             
        }); 
    }

    this.show = function(role_id,onClose){
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.role_id = role_id;
         
        mThis.prepareData(null,()=>{
            if (role_id > 0){
                //UserManagement.title.html("Edit Role");
                mThis.displayRole(role_id,()=>{
                    mThis.self.slideToggle().siblings().hide();
                });
            } 
             else mThis.self.slideToggle().siblings().hide();

            
        });
       
    }

    this.displayRole = function(role_id=null,onFinish) {
        let p = {};
        p.role_id = role_id?role_id:mThis.role_id;
        //p.id = mThis.role_id;
        vsapi.call([mThis.base_url,'/api/getRoleById'].join(''),p).then((res)=>{
            let d = {};
            if (res.status_code ===200) d = res.data;
            let name = StringSanitizer.sanitizeOut(d.name);
            mThis.elRoleName.val(name);
            mThis.elUserClass.val(d.user_class);
            if(typeof onFinish==='function') onFinish();
        });
    }
 }; 
//end::EditRolePanel

/**
 RoleTabView contains two tabs {USERS, MODULES,[PERMISSIONS]} the third tab is optional and not yet included 
 **/
//begin::RoleTabView 
 let RoleTabView = new function(){
     let mThis = this;
     this.self = $('#_um_roleTabView');
     this.base_url = $('#__base_url').val();

    //  this.tab_button_users = $('#_um_roletab_button_users'); //tab header button 
    //  this.tab_button_modules = $('#_um_roletab_button_modules'); 
    //  this.tab_button_prns = $('#_um_roletab_button_prns');
     
    //  this.tab_panel_users = $('#_um_roletab_panel_users');
    //  this.tab_panel_modules = $('#_um_roletab_panel_modules');
    //  this.tab_panel_prns = $('#_um_roletab_panel_prns');
    //  this.tab_container = $('#_um_roletab_container'); // container of each tab_panel
     this.cur_view = 'users';
     
    //  this.tabs = [
    //      {
    //          container: $('#_um_tab_panel_users'), //div class="tab-panel"
    //          viewName:'users',
    //          effect:'effect-zoomin'// "effect-zoomin" class defined in file appstyle.css    
    //      },
    //      {
    //         container: $('#_um_tab_panel_modules'), //div class="tab-panel"
    //         viewName:'users',
    //         effect:'effect-zoomin'// "effect-zoomin" class defined in file appstyle.css    
    //     },
    //     {
    //         container: $('#_um_tab_panel_prns'), //div class="tab-panel"
    //         viewName:'users',
    //         effect:'effect-zoomin'// "effect-zoomin" class defined in file appstyle.css    
    //     }
    //  ];

     this.self.on('click','div.tab-header>a.tab-button',function(e){
         e.preventDefault();
         //alert($(this).data('target'));
         $(this).addClass('active').siblings().removeClass('active');
         let view_name = $(this).data('viewname').toLowerCase();
         mThis.show(mThis.role_id,view_name,true);
     }); 

     this.show = function(role_id,view_name,tab_button_clicked = false){
          mThis.role_id = role_id;
          if (!view_name) view_name = mThis.cur_view;
          view_name = (view_name+'').toLowerCase(); 
          mThis.self.find('div.tab-body>div.tab-panel').each(function(){
              let this_view_name =($(this).data('viewname')+'').toLowerCase();
              if(view_name == this_view_name) {
                  mThis.cur_view =view_name;
                  $(this).show().siblings().hide();
                    
                   //begin:: display content data depending on current view_name. This code block is not part of General Script for TabView
                        if (view_name =='users') {
                            mThis.displayRoleMembers(mThis.role_id);
                        } else if (view_name =='modules') {
                            mThis.displayAccessibleModules(mThis.role_id);
                        }else if (view_name=='permissions')
                        { 
                            mThis.displayRolePermissions(mThis.role_id);
                        } 
                        // else {
                        //   //do nothing   
                        // }
                   //end:: dispay content data

                  return;
              } 
          }); 

          //If tab is open by calling this.show() and user did not click on Tab button => make corresponding Tab button appear Active
          if(!tab_button_clicked) {
            mThis.self.find('div.tab-header>a.tab-button').each(function() {
              let this_view_name =($(this).data('viewname')+'').toLowerCase();
              if (view_name === this_view_name){
                  $(this).addClass('active').siblings().removeClass('active');
              }
            });
          }
                   
     } 

     //begin::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
            //begin::define specific elements, tables for User Management tasks 
                this.tblRoleMembers = $('#_um_tblRoleMembers');
                this.tblRoleMembers_body = $('#_um_tblRoleMembers_body');
                this.tblPrns1 = $('#_um_roleprn_tblPrns');
                this.tblPerns1_body = $('#_um_roleprn_tblPrns_body');

                this.lnkAddRoleMember = $('#_um_lnkNewRoleMember');

                this.tblModules = $('#_um_tblRoleModules');
                this.tblModules_body  = $('#_um_tblRoleModules_body');
                this.lnkAddModule = $('#_um_lnkAddModule');
                this.lnkAddRoleMember = $('#_um_lnkAddRemMember');
                 
                this.lnk_roleprn_add = $('#_um_roleprn_lnk_add');
                this.lnk_roleprn_largeview = $('#_um_roleprn_lnkLargeView');

                //Add permission to selected role
                 this.lnk_roleprn_add.on('click',function(e){
                     e.preventDefault();
                     if(!RoleListPanel.selected_role_id) {
                        cv_interact.alert('No role selected!');
                        return ;
                    }

                    let role_id = RoleListPanel.selected_role_id; 
                    let role = {'role_id':role_id,'role_name':RoleListPanel.selected_role_name};
                    AddPermissionDialog.show(role,function(e){
                        if(e){
                            mThis.displayRolePermissions(role_id);
                        }
                    });
                 }); 

                 //Click to view Larger View of Permission List for the selected role
                 this.lnk_roleprn_largeview.on('click',function(e){
                     e.preventDefault();
                     if(!RoleListPanel.selected_role_id) {
                         cv_interact.alert('No role selected!');
                         return ;
                     }
                     let option = {
                        'title':'Role Permissions',
                        'role_id':RoleListPanel.selected_role_id,
                        'role_name':RoleListPanel.selected_role_name
                     };
                     
                     PermissionList.show(option)
                 });

                //link to Add Accessible module 
                this.lnkAddModule.on('click',function(e){
                    e.preventDefault();
                    if(!RoleListPanel.selected_role_id) {
                        cv_interact.alert('No role selected!');
                        return ;
                    }
                    RoleListPanel.addAccessibleModule(mThis.role_id,function(e){
                        if(e){
                            mThis.displayAccessibleModules(mThis.role_id);
                        }
                    });  
                });

                this.lnkAddRoleMember.on('click',function(e){
                    e.preventDefault();
                    if(!RoleListPanel.selected_role_id) {
                        cv_interact.alert('No role selected!');
                        return ;
                    }

                    RoleListPanel.addRoleMember(mThis.role_id,function(new_user_count){
                        if(new_user_count) {
                            RoleListPanel.updateSelectRole('col_user_count',new_user_count);
                            mThis.displayRoleMembers(mThis.role_id);
                        }
                    });
                }); 
                
                //click to remove accessible module
                this.tblModules_body.on('click','a._um_ma_remove',function(e){
                    e.preventDefault();
                    let p = {};
                    p.module_id = $(this).data('moduleid');
                    p.role_id = mThis.role_id;
                    cv_interact.confirm('Remove this Accessible Module','Remove Access Module',function(e){
                       if(e){
                            vsapi.call([mThis.base_url,'/api/removeAccessibleModule'].join(''),p).then((res)=>{
                              
                                if(res.status_code ===200) {
                                    mThis.displayAccessibleModules(mThis.role_id);
                                } else cv_interact.alert(res.error_message,'','error');
                            });
                       }
                    });
                });

                //Mouseover hover on tblPrns1>tr => show Delete icon on each tr
                mThis.tblPerns1_body.on('mouseover','tr',function(){
                    $(this).find('td.col_action').find('a._um_roleprn_delete').show();
                }).on('mouseleave','tr',function(){
                    $(this).find('td.col_action').find('a._um_roleprn_delete').hide();
                });

                //Click to remove role permission
                mThis.tblPerns1_body.on('click','a._um_roleprn_delete',function(e){
                    e.preventDefault();
                    let ids = $(this).data('prnid');
                    cv_interact.confirm('Remove this permission?','Remove Permission',function(e){
                        if(e){
                            let p = {'role_id':mThis.role_id,'ids':ids};    
                            vsapi.call([mThis.base_url,'/api/removePermissionFromRole'].join(''),p).then((result)=>{
                                if(result.status_code ===200) {
                                    mThis.displayRolePermissions(mThis.role_id);
                                } else cv_interact.alert(result.error_message,'','error');
                            });
                        }
                    });
                });

                //Click to remove role members
                this.tblRoleMembers_body.on('click','a._um_rm_remove',function(e){
                    e.preventDefault();
                    let p = {};
                    p.user_id = $(this).data('userid');
                    p.role_id = mThis.role_id;
                    cv_interact.confirm('Remove this user from the selected role?','Remove User',function(e){
                       if(e){
                            vsapi.call([mThis.base_url,'/api/removeRoleMember'].join(''),p).then((result)=>{
                                if(result.status_code ===200) {
                                    mThis.displayRoleMembers (mThis.role_id);
                                    let col_name ='col_user_count';
                                    RoleListPanel.updateSelectRole(col_name,result.user_count);
                                } else cv_interact.alert(result.error_message,'','error');
                            });
                       }
                    });
                });

                this.tblRoleMembers_body.on('mouseover','tr',function(e){  
                   $(this).find('td.col_action').find('a._um_rm_remove').show() 
                }).on('mouseleave','tr',function(e){ 
                    $(this).find('td.col_action').find('a._um_rm_remove').hide()
                });
            //end::define specific elements, tables for user Management tasks

            this.displayAccessibleModules = function(role_id) {
                    let p = {};
                    p.role_id = role_id?role_id:0;
                    mThis.tblModules_body.empty();
                    let role_name = RoleListPanel.selected_role_name;
                    if(!role_name) role_name ="This role";
                    $('#_um_roletab_module_text').text([role_name , ' can use these modules'].join(''));
                    vsapi.call([mThis.base_url,'/api/getAccessibleModules'].join(''),p).then((res)=>{
                        let rows = [];
                        if (res.status_code ===200) rows = res.data;
                        rows = StringSanitizer.sanitizeObject(rows);
                        if(rows){
                        let i=0, c;
                        do{
                            c = rows[i];
                            if(!c) break;
                                let html = ['<tr data-moduleid="',c.id,'">',
                                '<td style="width:50px !important"><i class="icon-module-default"></i></td>',
                                '<td>',c.name,'</td>',
                                '<td class="col_action"><a href="#" class="_um_ma_remove" data-moduleid="',c.id,'"><i class="fa fa-times" style="color:red"></i></a></td>',            
                                '</tr>'].join('');
                                mThis.tblModules_body.append(html);
                            i++;
                        }while(c); 
                        }       
                    });
            }  

            this.displayRoleMembers = function(role_id) {
                //let div = mThis.tblRoleMembers.parent();
                //div.removeClass('effect-zoomin');
                let p = {};
                p.role_id = role_id;
                mThis.tblRoleMembers_body.empty();
                $('#_um_roletab_users_text').text(['Members of ',RoleListPanel.selected_role_name].join(''));
                vsapi.call([mThis.base_url,'/api/getRoleMembers'].join(''),p).then((res)=>{
                  let rows = [];
                  if (res.status_code ===200) rows = res.data;
 
                   let i =0, c;
                   do{
                     c = rows[i];
                     if(!c) break;
                       c =StringSanitizer.sanitizeObject(c,null,['email']);
                       if(!Validator.isEmail(c.login_name)) c.login_name = StringSanitizer.sanitizeOut(c.login_name);
                       let html = ['<tr data-userid="',c.id,'"><td>',c.login_name,'</td><td>',c.full_name,'</td><td>',c.phone_number,'</td><td>',c.official_code,'</td>',
                       mThis.allow_add_remove_users? `<td class="col_action"><a href="#" class="btn btn-sm btn-outline-danger _um_rm_remove" data-userid="${c.id}" style="display:none;"><i class="fa fa-times"></i></a></td>`:null,
                       '</tr>'].join('');   
                       mThis.tblRoleMembers_body.append(html);
                     i++;
                   }while(c);
                   //div.addClass('effect-zoomin');
                  
                });
             };  

             this.addPermissionsToRole = (prn_ids, role_id,onFinish)=>{
                    let p = {'role_id':role_id,'ids':prn_ids};
                    vsapi.call([mThis.base_url,'/api/addPermissionToRole'].join(''),p).then((result)=>{
                        if(result.success_count >result.fail_count) {
                            if(typeof onFinish ==='function') onFinish();
                        }
                        if (result.fail_count >0) {
                            let i=0, c,html='';
                            do{
                            c = result.errors[i];
                            if(!c) break;
                                if(c) html = [html,'<li>',StringSanitizer.sanitizeOut(c),'<li>'].join('');  
                            i++;
                            }while(c);
                            cv_interact.alert(['<ul>',html,'</ul>'].join(''));
                        } 
                    });
             }

            this.displayRolePermissions = function(role_id){
                let p = {'role_id':role_id};
                vsapi.call([mThis.base_url,'/api/getPermissionsByRole'].join(''),p).then((res)=>{
                    let rows = [];
                    if (res.status_code ===200) rows = res.data;
                    rows = StringSanitizer.sanitizeObject(rows);
                    
                    let i=0, c;
                    mThis.tblPerns1_body.empty();
                    do{
                       c = rows[i];
                       if(!c) break;
                          let html = ['<tr data-prnid="',c.id,'"><td class"col_permission_id" style="width:25%">',c.id,'</td>',
                          '<td style="width:50%">',c.name,'</td>',
                          //'<td>',c.module_name,'</td>',
                          '<td class="col_action"><a data-prnid="',c.id,'" href="#" class="_um_roleprn_delete" style="display:none"><i class="fa fa-times" style="color:red"></i></a></td>',
                          '<tr>'].join('');
                          mThis.tblPerns1_body.append(html);

                       i++;
                    }while(c);
                    //make sure the corresponding <th> in .php file has same width of 70px
                    mThis.tblPerns1_body.find('td.col_permission_id').css('width:70px');
                });
            }    
     //end::THIS CODE BLOCK IS NOT PART OF GENERAL SRCRIPT FOR TAB_VIEW OBJECT
 }
//end::RoleTabview
 
//begin::PermissionList
 let PermissionList = new function(){
  let mThis = this;
  this.base_url = $('#__base_url').val();
  this.self = $('#_um_permissionList');
  this.tblPrns = $('#_um_tblPrns');
  this.tblPrns_body = $('#_um_tblPrns_body');
  this.lnkCreatePrn = $('#_um_prnlist_lnkCreatePrn');
  this.lnkRefreshPrns = $('#_um_prnlist_lnkRefeshPrn');
  this.lnkAddPrnByCode = $('#_um_prnlist_lnkAddPrn');
  this.lblTitle = $('#_um_prnlist_lblTitle');

  //create new permission (This menu is used only in Development time)
  this.lnkCreatePrn.on('click',function(e){
    e.preventDefault();
    
    CreatePermissionDialog.show(mThis.role_id,function(e) {
        if(e) {
            mThis.displayPermissionList(mThis.role_id);
        }
    }); 
  });

  //refresh Permission List (This menu is useful only if you update permissions of yourself being logged in right now)
  this.lnkRefreshPrns.on('click',function(e){
    e.preventDefault();
    vsapi.call([mThis.base_url,'/api/localizePermissions'].join(''),null).then((res)=>{

    });  
  });
  
  this.lnkAddPrnByCode.on('click',function(e){
    e.preventDefault(); 
    AddPermissionDialog.show(mThis.role_id,function(ids){
        if(ids){
              RoleTabView.addPermissionsToRole(ids,mThis.role_id,()=>{
                mThis.displayPermissionList(mThis.role_id);
              });       
        }
    });
  });

  mThis.tblPrns_body.on('click','a._um_pa_remove',function(e){
      e.preventDefault();

      let p = {};
      p.role_id = mThis.role_id;
      p.ids = $(this).data('prnid');
 
      vsapi.call([mThis.base_url,'/api/removePermissionFromRole'].join(''),p).then((res)=>{
          if(res.status_code ===200) {
          mThis.displayPermissionList(mThis.role_id);
          }else cv_interact.alert(res.error_message,'','error');
      });
  });

  mThis.tblPrns_body.on('mouseover','tr',function(e){
     $(this).find('td.col_action>a').show();
  }).on('mouseleave','tr',function(e){
    $(this).find('td.col_action>a').hide();
  });

  //option = {title,module_id,role_id,role_name,[onClose]}
  this.show = function(option) {
      if(Option){
        if (option.title) mThis.lblTitle.html(option.title);
        mThis.role_id = option.role_id;
      }
     mThis.self.show().siblings().hide();
     mThis.displayPermissionList(mThis.role_id);
  }

  this.displayPermissionList = function(role_id){
      let p = {};
      p.role_id = role_id;
      mThis.tblPrns_body.empty();
       
      vsapi.call([mThis.base_url,'/api/getPermissionsByRole'].join(''),p).then((res)=>{
         let rows = [];
         if (res.status_code ===200) rows = res.data;     
         rows = StringSanitizer.sanitizeObject(rows);
         //alert(JSON.stringify(rows));
         let i=0,c;
         do{
            c = rows[i];
            if(!c) break;
            let html = ['<tr data-prnid="',c.id,'">',
            '<td>',c.id,'</td>',
            '<td>',c.name,'</td>',
            '<td>',c.module_name,'</td>',
            '<td class="col_action"><a data-prnid="',c.id,'" href="#" class="_um_pa_remove" style="display:none"><i class="fa fa-times" style="color:red"></i></a></td>',
            '</tr>'].join('');
            mThis.tblPrns_body.append(html);
            i++;
         }while(c);
      });
  }

 };
//end::PermissionList

//begin::AddPermissionDialog
let AddPermissionDialog = new function() {
    let mThis = this;
    this.self = $('#_um_dlgAddPrn');
    this.base_url = $('#__base_url').val();
    this.lnkBackToRoleList = $('#_um_prnlist_backToRoleList');
    this.btnAdd = $('#_um_addprn_btnOK');
    this.elTitle = $('#_um_dlgAddPrnTitle');

    this.elSearchPrn = $('#_um_addprn_search');
    this.tblPrns = $('#_um_addprn_tblPrns');
    this.tblPrns_body = $('#_um_addprn_tblPrns_body');
    this.elError= $('#_um_addprn_error');
 
    this.lnkBackToRoleList.on('click',function(e) {
        e.preventDefault();
        let options ={};
        options.title ="Manage Roles";
        RoleListPanel.show(options);
    });

    this.elSearchPrn.on('keyup',function(e){
          mThis.elError.html(null);

          let d = $(this).val();
          let p = {};
          p.search_value = d;
          p.role_id = mThis.role_id;
          p.show_all =1;
          mThis.tblPrns_body.empty();
          //findPermissions
          vsapi.call([mThis.base_url,'/api/getPermissionsByRole'].join(''),p).then((res)=>{
            let rows = [];
            if (res.status_code ===200) rows = res.data;
             mThis.displayPermissions(rows);
          });
       
    });

    this.btnAdd.on('click',function(e) {
        let ids = mThis.getSelectedPrns();
        if(!ids) {
            mThis.elError.html('No permissions selected');
            return;
        }

        if(typeof mThis.onClose =='function') mThis.onClose(ids);
        mThis.self.modal('hide');
    });

    this.tblPrns.on('click','.prn_btn_action',function(e){
        e.preventDefault();
        let x = $(this);
        let prn_id = x.data('prnid');
        let tr = x.closest('tr');
        let action = x.data('action');
        mThis.addRemovePermission(tr,mThis.role_id,prn_id,action);
    });

    this.addRemovePermission = (tr, role_id,prn_id,action)=>{
        let p = {'role_id':role_id,'id':prn_id};
        let m = 'addPermissionToRole';
       
        if(action==='remove') m = 'removePermissionFromRole';
        vsapi.call(`${mThis.base_url}/api/${m}`,p).then((res)=>{
           if(res.status_code ===200){
                if (action ==='add') {
                    let btn = tr.find('.prn_btn_action');
                    btn.data('action','remove');
                    btn.removeClass('btn-outline-success').addClass('btn-outline-danger').text('Remove');
                    tr.data('hasprn',1).removeClass('tr-disallowed').addClass('tr-allowed');

                }else {
                    let btn = tr.find('.prn_btn_action');
                    btn.data('action','add');
                    btn.removeClass('btn-outline-danger').addClass('btn-outline-success').text('Add');
                    tr.data('hasprn',0).removeClass('tr-allowed').addClass('tr-disallowed');
                }

            mThis.data_changed = true;
              
           }else {
                cv_interact.alert(res.error_message,'','error');
                    // let i=0, c,html='';
                    // do{
                    // c = res.errors[i];
                    // if(!c) break;
                    //     if((c+'').trim() !='') html = [html,'<li>',StringSanitizer.sanitizeOut(c),'<li>'].join('');  
                    // i++;
                    // }while(c);
                    // cv_interact.alert(['<ul>',html,'</ul>'].join(''));
           } 
        });
    }

    this.displayPermissions = (items)=>{
        if(!items) items =[];
        let i=0,c;
        mThis.tblPrns_body.empty();
        do{
        c = items[i];
        if(!c) break;
                let btn_action = ['<td class="col_action">',`<a data-action="add" href="#" class="btn btn-sm btn-outline-success prn_btn_action prn_btn_add" data-roleid="${c.role_id}" data-prnid="${c.id}"> Add</a>`,'</td>'].join('');
                if(c.has_prn ==1) btn_action = ['<td class="col_action">',`<a href="#" data-action="remove" class="btn btn-sm btn-outline-danger prn_btn_action prn_btn_remove" data-roleid="${c.role_id}" data-prnid="${c.id}"> Remove</a>`,'</td>'].join('');
                let tr_class ='tr-disallowed';
                if(c.has_prn ==1) tr_class ='tr-allowed';
                let html = ['<tr class="',tr_class,'" data-id="',c.id,'" data-hasprn="',c.has_prn?c.has_prn:0,'">',
                '<td class="prn-icon"><img src="" width="80px" /></td>',
                //'<td class="col_checkbox"><input type="checkbox" style="width:18px;height:18px" checked></td>',
                '<td class="prn-id">',c.id,'</td>',
                '<td class="prn-name">',c.name,'</td>',
                '<td class="mod-name">',c.module_name,'</td>',
                  btn_action,
                '</tr>'].join('');
                mThis.tblPrns_body.append(html); 
        i++;
        }while(c);
    }

    this.getSelectedPrns = function(){
        let prns = null;
       mThis.tblPrns_body.find('tr').each(function() {
           let cb_cell = $(this).find('td.col_checkbox>input[type="checkbox"]');
            if (cb_cell.is(':checked')) {
               let sp = ''; 
               if(prns) sp ='|'; else sp =''; 
               prns = [prns,sp,$(this).data('id')].join('');   
            }
       });
       return prns; 
    } 

    this.loadPermissions = (onFinish)=>{
        let p = {'role_id':mThis.role_id,'search_value':mThis.elSearchPrn.val(),'show_all':1};
        vsapi.call([mThis.base_url,'/api/getPermissionsByRole'].join(''),p).then((res)=>{
            let rows = [];
            if (res.status_code ===200) rows = res.data;
            rows = StringSanitizer.sanitizeObject(rows);
            onFinish(rows);
        });
    }
  
    this.show = function(role,onClose){
        mThis.elError.html(null);
        mThis.role_id = role.role_id;
        mThis.role_name = role.role_name;
        mThis.onClose = onClose;
        mThis.data_changed = false;

        mThis.elTitle.text(['Add/Remove Permissions for ',mThis.role_name].join(''));
       mThis.loadPermissions((items)=>{
            mThis.displayPermissions(items);
            mThis.self.modal({
                backdrop:'static'
            }).on('hidden.bs.modal',function(){
                if(typeof mThis.onClose ==='function') mThis.onClose(mThis.data_changed);
            }); 
       });

     
    }
} 
//end::AddPermissionDialog

//begin::CreatePermissionDialog
let CreatePermissionDialog = new function() {
    let mThis = this;
    this.self = $('#_um_dlgCreatePrn');
    this.base_url = $('#__base_url').val();
    this.btnCreate = $('#_um_createprn_btnOK');
    
    this.elPrn = $('#_um_createprn_prn');
    this.elPrnNumber = $('#_um_createprn_prn_id');
    this.elModule = $('#_um_createprn_module');
    this.elError= $('#_um_createprn_error');

    this.btnCreate.on('click',function(e) {
        mThis.elError.html(null);
      let p = {};
      p.module_id = mThis.elModule.val();
      p.name = mThis.elPrn.val();
      p.prn_id = mThis.elPrnNumber.val();
      p.role_id = mThis.role_id;
      if(!p.prn_id) {
          mThis.elError.text('Permission Number cannot be empty');
          return;
      }

    if(!p.name) {
        mThis.elError.text('Permission name cannot be empty');
        return;
    }

    if(!p.module_id) {
        mThis.elError.text('Please select a module');
        return;
    }
      vsapi.call([mThis.base_url,'/api/createPermission'].join(''),p).then((res)=>{
          if(res.status_code ===200) {
            if(typeof mThis.onClose ==='function') mThis.onClose(true);
            mThis.self.modal('hide');
          } else mThis.elError.text(res.error_message,'','error');
      });

    });
    
    this.loadModules = function(onFinish) {
      vsapi.call([mThis.base_url,'/api/getComboItems_module'].join(''),null).then((res)=>{
          let rows = [];
          if (res.status_code ===200) rows = res.data;
          
          let i=0,c;
          rows = StringSanitizer.sanitizeObject(rows);
          mThis.elModule.empty();
          mThis.elModule.append($('<option/>').val(null).text('(Select Application Module)'));
          do{ 
            c = rows[i];
            if(!c) break;
             mThis.elModule.append($('<option/>').val(c.id).text(c.name));
            i++;
          }while(c);
          onFinish();
      });
    }

    this.show = function(role_id,onClose){
        mThis.elError.html(null);
        mThis.role_id = role_id;
        mThis.onClose = onClose;

       mThis.loadModules(function() {
        mThis.self.modal({
            backdrop:'static'
        }); 
       });
       
    }
} 
//end::CreatePermissionDialog
 
$(document).ready(function(){
    RoleManagementComponent.init();
});
