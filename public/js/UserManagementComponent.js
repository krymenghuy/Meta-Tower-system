'use strict' 
//begin::UserManagementComponent
var UserManagementComponent = new function(){
    let mThis = this;
    this.elScreenTitle = $('#screen_title');
    mThis.base_url = $('#__base_url').val();
    mThis.initialized = false;
   
    this.init = function() {
        mThis.title ='Manage Users'; 
        mThis.self = $('#_um_userManagementComponent');
           
        mThis.initialized = true ;
     }; //end::UserManagementComponent.init()

    this.show = function(options) {
      if (!mThis.initialized) alert('UserManagementComponent.init() is not called for inialization');

        if(options){
            if (options.title) mThis.title = options.title; 
            mThis.onClose = options.onClose;
        }
        mThis.elScreenTitle.html(mThis.title);
         
        mThis.self.show().siblings().hide();
        UserListPanel.show(); 
    };
    
    this.hide = function() {
        mThis.self.hide();
    };     
};
//end::UserManagementCompment

//begin::UserListPanel
var UserListPanel = new function() {
    let mThis = this;
    this.self = $('#_um_userListPanel');
    mThis.base_url = $('#__base_url').val();
    this.lnkNewUser = $('#_um_lnkNewUser');
    
    this.elSearch = $('#_um_userlist_search');

    this.tblUsers = $('#_um_tblusers');
    this.tblUsers_body = $('#_um_tblUsers_body');
    this.div_extended_detail = $('#_um_extended_details_panel');

    this.lnkNewUser.on('click',function(e){
        e.preventDefault();
          AddUserPanel.show(null);
    });
    
    mThis.tblUsers_body.on('mouseover','tr',function(e){
        let el = $(this).find('._um_item_action_button');
        el.show();
    }).on('mouseleave','tr',function(e){
       let el = $(this).find('._um_item_action_button');
       el.hide();
    }); 
  
    this.elSearch.on('keyup',function(e){
        e.preventDefault();
        let d = $(this).val();
        mThis.displayUserList(d); 
    });

    mThis.tblUsers_body.on('click','a._um_delete_user',function(e){
        e.preventDefault();
        let id = $(this).data('userid');
        cv_interact.confirm('Delete this user?','Delete User',function(e){
            if(e){
                mThis.deleteUser(id);
            }
        })   
    });

    mThis.tblUsers_body.on('click','a._um_edit_user',function(e){
      e.preventDefault();
      let user_id = $(this).data('userid');
      AddUserPanel.show(user_id); 
   });

   /** begin::tblUsers's action dropdown menu **/
      
      /** When user clicks outside Groups table's dropdown menus, then hide the dropdown menus **/
         $(document).on('click',function(e) 
         {   
             let container = mThis.tblUsers_body.find('.dropdown'); 
             if (container) {
                 // if the target of the click isn't the container nor a descendant of the container
                 if (!container.is(e.target) && container.has(e.target).length === 0) 
                 {
                     mThis.tblUsers_body.find('.dropdown-menu').each(function(){
                         $(this).removeClass('show');
                     }); 
                     
                     //mThis.prev_dropdownMenu = null;
                 } //else alert("Clicked inside the DIV.dropdown");    
             }  
                 
             e.stopPropagation();
         }); 

   mThis.tblUsers_body.on('click','.btn_user_action',function(e) {
        e.preventDefault();
        let p = $(this).parent();
        let user_id = $(this).data('userid');  /** <div class="dropdown-menu" data-userid="##"> its parent is <div class="dropdown" ... its parent is <td ... **/
        let login_name = $(this).data('loginname'); 

        let dropdownMenu = p.find('.dropdown-menu');
        if (!dropdownMenu || dropdownMenu.length <= 0) {
        p.append(mThis.createDropdownMenuHtml_user(user_id,login_name));
        dropdownMenu = p.find('.dropdown-menu');
        }
        //style for "dropdown-menu" class style = "position: absolute; transform: translate3d(0px, -184px, 0px); top: 0px; left: 0px; will-change: transform;" 
        if (mThis.prev_dropdownMenu && mThis.prev_dropdownMenu.is(dropdownMenu) ==false) mThis.prev_dropdownMenu.removeClass('show');

        dropdownMenu.toggleClass('show');
        if (dropdownMenu.hasClass('show')) mThis.prev_dropdownMenu = dropdownMenu;

        //Toggle menu-text between "Lock User" and "Unlock User"
        let is_locked = $(this).closest('tr').data('islocked');
        let span = $(this).parent().find('a._um_ua_lock span.menu-text');
        if(is_locked ==1 || is_locked ==true)
           span.text('Unlock User');
        else span.text('Lock User');

    });

    mThis.tblUsers_body.on('mouseover','tr',function(e){
        let td_action = $(this).find('td.col_action');
        td_action.find('a').css('display','block');
   }).on('mouseleave','tr',function(e) {
      let td_action = $(this).find('td.col_action');
      let btn_class_action = td_action.find('a');
      btn_class_action.css('display','none');
      btn_class_action.closest('.dropdown-menu').removeClass('show');
       
   }) ;
   
    //Create dropdown menus html for table tblUsers> row  
    this.createDropdownMenuHtml_user = function(user_id, loginname) {
        //ga = 'groups_action' = > ga_delete, ga_modify
        let html = ['<div class="dropdown-menu" data-userid="',user_id,'" data-loginname="',loginname,'">',
            '<a class="dropdown-item _um_ua_delete" href="#"><i class="fa fa-times" style="color:red"></i> Delete User</a>',
            //'<a class="dropdown-item _um_ua_modify" href="#"><i class="fa fa-edit" style="color:grey"></i>  Modify User</a>',
            '<a class="dropdown-item _um_ua_change_name" href="#"><i class="fa fa-user" style="color:grey"></i> Change Login Name</a>',
            '<a class="dropdown-item _um_ua_lock" href="#"><i class="fa fa-lock" style="color:red"></i> <span class="menu-text">Lock User</span></a>',
            '<a class="dropdown-item _um_ua_setpwd" href="#"><i class="fa fa-lock" style="color:blue"></i>  Set Password</a>',
            '<div class="dropdown-divider"></div>',
            //'<a class="dropdown-item _um_ua_report" href="#"><i class="fa fa-list-alt" style="color:grey"></i>  Login Report</a>',
            '</div>'].join('');
        return html;
   }

   //end::tblUsers' action dropdown menu

   /*## begin::event handler for each user action menu ##*/
   mThis.tblUsers_body.on('click','tr>td.col_action a._um_ua_delete',function(e) {
       e.preventDefault();
      let user_id = $(this).parent().data('userid');
      if(!user_id) user_id =0;
      cv_interact.confirm('Delete this user?','Delete User',function(e){
        if(e){
           mThis.deleteUser(user_id);
        }
      }); 
   });

      //menu clicked to Change Login name
      mThis.tblUsers_body.on('click','tr>td.col_action a._um_ua_change_name',function(e) {
        e.preventDefault();   
        let login_name = $(this).parent().data('loginname');  
        let option = {
            'blankErrorMessage':'Login name cannot be blank',
            'btnOKText':'Commit Change',
            'defaultValue':login_name,
            'title':'Change Login Name',
            'dataLabel':'New login name'
        }; 
        InputBox1.show(option,function(d){
           if(d){
               if(d !== login_name) {
                    let p = {};
                    //p.user_id = $(this).parent().data('userid');
                    p.login_name = login_name;
                    p.new_login_name = d;
                    //if(!p.user_id) p.user_id =0;
                    post_ajax([mThis.base_url,'/api/changeLoginName'].join(''),p,function(err){  
                        if(!err || err =='') {
                          mThis.displayUserList();
                        } else cv_interact.alert(err,'','error');
                    });
               }
           }
        });

     });

   mThis.tblUsers_body.on('click','tr>td.col_action a._um_ua_setpwd',function(e) {
    e.preventDefault();  
        let login_name = $(this).parent().data('loginname');
        SetPasswordDialog.show(login_name);   
    });

   mThis.tblUsers_body.on('click','tr>td.col_action a._um_ua_lock',function(e) {
    e.preventDefault();  
    let is_locked = $(this).closest('tr').data('islocked');
    let action ='lock';
    if (is_locked ==1 || is_locked ==true){
        $(this).find('span.menu-text').text('Unlock User');
        action ='unlock';
    } else {
        $(this).find('span.menu-text').text('Lock User');
    }

    let p = {};
    p.user_id = $(this).parent().data('userid');

    if(!p.user_id) p.user_id =0;
       let msg = 'Unlock this user?';
       p.action ='unlock';

       if (action=='lock'){
         msg ='Lock this user?';
         p.action ='lock';
       }
        cv_interact.confirm(msg,'User Lockout',function(e){
            if(e){
                post_ajax([mThis.base_url,'/api/setLockStatus'].join(''),p,function(err){
                    if(!err){
                        mThis.displayUserList(mThis.elSearch.val());
                    } else cv_interact.alert(err);
                    });
            }
        }); 
    });

   //*end::event handler for each user action menu **/

   //option = {title, subTitle}
    mThis.show = function(option){
        mThis.displayUserList(); 
        //if(option) UserManagement.setTitles(option.title,option.subTitle);
        mThis.self.show().siblings().hide();
    }
 
    this.displayUserList = function(search_value){
        let div = $('#_um_tblUsers_wrapper'); // mThis.tblUsers.parent(); //div.table_wrapper
        div.removeClass('animate-slide-right');
        let p = {};
        p.search_value = search_value;
        post_ajax([mThis.base_url,'/api/getUserList'].join(''),p,function(rows){
            //rows = StringSanitizer.sanitizeObject(rows);
            mThis.tblUsers_body.empty();
            let i =0, c;
            do{
               c = rows[i];
               if(!c) break;
               c.login_name = StringSanitizer.sanitizeOut(c.login_name,'email');
               c.email =StringSanitizer.sanitizeOut(c.email,'email');
               c.id =StringSanitizer.sanitizeOut(c.id);
               c.is_locked =StringSanitizer.sanitizeOut(c.is_locked);
               c.user_class =StringSanitizer.sanitizeOut(c.user_class);
               c.full_name =StringSanitizer.sanitizeOut(c.full_name);
               c.official_code =StringSanitizer.sanitizeOut(c.official_code);
               c.phone_number =StringSanitizer.sanitizeOut(c.phone_number);
               c.status =StringSanitizer.sanitizeOut(c.status);

               let dropdown_container_html =['<div class="dropdown">',
               '<a href="#" data-userid="',c.id,'" data-loginname="',c.login_name,'" class="btn_user_action" aria-haspopup="true" aria-expanded="false" style="display:none">',
               '<i class="fa fa-chevron-down" style="color:red"></i>',
               //' Action',
               '</a>',
              '</div>'].join('');

                 let lock_icon ="";
                 if(c.is_locked==1 ||c.is_locked==true) lock_icon ='<div style="float:right"><span class="fa fa-lock" style="color:red"></span></div>';
      
                 let html = ['<tr data-islocked="',c.is_locked,'">',
                  '<td><span>',c.login_name,'</span>',lock_icon,'</td>',
                  '<td class="col_action">',dropdown_container_html,'</td>',
                  '<td>',c.user_class,'</td>',
                  '<td>',c.full_name,'</td>',
                  '<td>',c.official_code,'</td>',
                  '<td>',c.phone_number,'</td>',
                  '<td>',c.email,'</td>',
                  '<td>',c.status,'</td>',
                  '</tr>'].join('');
                 mThis.tblUsers_body.append(html);
                 i++;
            }while(c);
             //Hide action menus, wait until user move mouse over table row (tr)
             //mThis.tblUsers_body.find('._um_item_action_button').css('display','none');
             div.addClass('animate-slide-right');
        });
    };

   this.deleteUser = function(user_id =0) {
       let p = {'user_id':user_id};
        post_ajax([mThis.base_url,'/api/deleteUser'].join(''),p,function(err){
            if(!err){
                mThis.displayUserList(mThis.elSearch.val());
            } else cv_interact.alert(err);
        });
        
    }  
};
//end::UserListPanel

//begin::AddUserPanel. Used for New User and Edit User
var AddUserPanel = new function() {
    let mThis = this;
    
    this.self = $('#_um_addUserPanel');
    this.base_url = $('#__base_url').val();
    this.lnkBackToUserList = $('#_um_lnkbackToUserList');
    mThis.goBackFunction=null;
    this.lnkFindPerson = $('#_um_adduser_linkFindPerson');

    this.btnBack = $('#_um_btnBackToUserList');
    this.btnSave = $('#_um_btnSaveUser');
   
    this.elError = $('#_um_adduser_error');
   
    this.elRole = $('#_um_adduser_role');
    this.elUserClass = $('#_um_adduser_userclass');
    this.elLoginName = $('#_um_adduser_loginname');
    this.elOfficialCode = $('#_um_adduser_officialcode');
    this.elFullName = $('#_um_adduser_fullname');
    this.elPrevilegeType = $('#_um_adduser_previlege');

    this.elPassword = $('#_um_adduser_pwd');
    this.elConfirmPwd = $('#_um_adduser_confirmpwd');
   
    this.elPhoneNumber = $('#_um_adduser_phone');
    this.elEmail = $('#_um_adduser_email');
    this.elWorkLoc = $('#_um_adduser_workloc');
    this.elWorkLoc_type = $('#_um_adduser_workloc_type'); /* Not yet define in HTML element */
    this.elWorkLoc_map = $('#_um_adduser_workloc_map'); /*Not yet define in HTML element */
    
    this.div_extended_detail = $('#_um_extended_details_panel');

    this.lnkBackToUserList.on('click',function(e){
        e.preventDefault();
        if (typeof mThis.goBackFunction =='function') {
          mThis.goBackFunction();
        }else {
            let options ={};
            options.title ="Manage Users";
            UserListPanel.show(options);
        }
    });

    mThis.lnkFindPerson.on('click',(e)=>{
       e.preventDefault();
       let user_class = mThis.elUserClass.val().toLowerCase();
       let title =null;
       if(user_class ==='driver') title ='Find Driver';
       else if (user_class ==='merchant' || user_class ==='sender') {
         title ='Find Merchant';
         //FindPersonDialog accepts @user_class ='sender' , not merchant
         user_class ='sender';
       }
       else {
         cv_interact.alert('Admin staff does not have extended details or profile'); 
         return;
       }
       let option = {'title':title,'role':user_class,'singleSelect':true,'previousDialog':null};
       FindPersonDialog.show(option,(ps)=>{
           if(ps[0]){
               let p = ps[0];
               mThis.elOfficialCode.val(p.code).trigger('blur');
           }
       }); 
    });

    mThis.btnBack.on('click',function(e) {
        mThis.lnkBackToUserList.trigger('click');
    });

    //Creaing new user, when the phone number is entered => auto retrieve user extended details based on given user_class
    //Assuming that the login's name is the phone_name;
    mThis.elLoginName.on('blur',function(e){
        if(!mThis.user_id) {
            //Show extended details uses @User_class and @Official Code to get extended user details, but
            //if @official_code is empty, it uses phone_number, if entered (in case of creating new user) to get user's extended details 
            mThis.showUserExtendedDetails(null, mThis.elUserClass.val());
        }
    });

    mThis.elOfficialCode.on('blur',function(e){
        if(!mThis.user_id) {
            //Show extended details uses @User_class and @Official Code to get extended user details, but
            //if @official_code is empty, it uses phone_number, if entered (in case of creating new user) to get user's extended details 
            mThis.showUserExtendedDetails($(this).val(), mThis.elUserClass.val());
        }
    });

    mThis.elUserClass.on('change',()=>{
      let p = {"user_class":mThis.elUserClass.val()}; 
      post_ajax([mThis.base_url,'/api/getComboItems_role'].join(''),p,(rows)=>{
          rows = StringSanitizer.sanitizeObject(rows); 
          CommonLib.setComboItems(mThis.elRole,rows,'id','name',true,'(Select Role)',0);
          if (rows[0] && !rows[1]) mThis.elRole.val(rows[0].id);
          mThis.elOfficialCode.trigger('blur');
      });
    });

    mThis.btnSave.on('click',function(e) {
        mThis.elError.html(null);
        let p = {};
        p.user_id = mThis.user_id;
        p.role_id = mThis.elRole.val();
        p.login_name = mThis.elLoginName.val();
        p.user_class = mThis.elUserClass.val();
        p.official_code = mThis.elOfficialCode.val();
        p.full_name = mThis.elFullName.val();

        //Password and confirm Password are required for New User only
        p.password = mThis.elPassword.val();
        //p.confirmPwd = mThis.elConfirmPwd.val();

        //optional fields
         p.phone_number = mThis.elPhoneNumber.val();
         p.email = mThis.elEmail.val();
         p.work_location_id = mThis.elWorkLoc.val();

        if(!p.user_id) p.user_id = 0;
        // if (mThis.elPassword.val() != mThis.elConfirmPwd.val()) {

        //     mThis.elError.html("The password and confirmed password do not match!");
        //     return;
        // }

        if (!p.login_name) {
            mThis.elError.html('User Name cannot be empty');
            return;
        }
     
        if(p.user_class !='admin_support'){
            if(!p.official_code || p.official_code =='')
            {
                mThis.elError.html('Driver or Merchant must have a valid official ID');
                return;
            }
        }
 
        post_ajax([mThis.base_url,'/api/saveUser'].join(''),p,function(result) { 
          
            if (result.status =='OK'){
                mThis.lnkBackToUserList.trigger('click');
            } else mThis.elError.text(result.error_message);
        }); 
    });

    /*** AddUserPanel.show() method(option,onClose)
     @option ={user_id,official_code,user_class}
     if user_id > 0 then => display user info for editing
     else if "official_code" is not empty then check "user_class" => get user's details by user_class, example:
       - if user_class=='driver' => get driver details and prepare to create login for drvier (Delivery System)
       - if (user_class =='merchant') => get sender's details and prepare to create login for merchant or seller (Delivery System)        
       - if user_class != "merchant" and != "driver" => do nothing and return;
    ***/
    this.show = function(option,onClose){
        mThis.goBackFunction= null; //Clear GoBack Function
        if(!option) option = {};
        mThis.elError.html(null);
        mThis.onClose = onClose;
        mThis.goBackFunction = option.goBackFunction;
        mThis.user_id = option.user_id;
        if (mThis.user_id > 0){
            //UserManagement.title.html("Modify User Information");
            mThis.displayUserDetail(user_id);
        }else if ((option.official_code+'').trim() !='') {
            if (option.user_class=='merchant' || option.user_class=='sender' || option.user_class=='driver') {
                let onDetailShown = (d)=>{
                  if(d){
                    mThis.elOfficialCode.val(d.official_code);
                    mThis.elLoginName.val(d.phone_number);
                    mThis.elUserClass.val(d.user_class);
                    mThis.elUserClass.trigger('change');

                  //NOTE that "mThis.self" is div staying inside another parent DIV =>"userManagementComponent" 
                    let x = mThis.self.parent(); /** access to DIV that contains whole UserManagementComponent **/
                    
                    x.show().siblings().hide();
                    mThis.self.show().siblings().hide(); //Show AddUserPanel within the UserManagementComponent

                  } else cv_interact.alert(['Cannot find details for ',option.user_class,'. ID ',option.official_code?option.official_code:'(No ID found)'].join(''));
                } 
                mThis.showUserExtendedDetails(option.official_code,option.user_class,onDetailShown); 
               
            }
            // else {
            //     //Do nothing and return
            //     cv_interact.alert('The user class is not valid for creating a new login!');
            //     return;
            // }
        } 
        else {
            //UserManagement.setTitles("Add User",null);
            mThis.div_extended_detail.hide();
        }

        //Note that worklocation is applicable only for internal users such as Staff, but for public users , there is no worklocation attribute
        mThis.loadWorkLocationList(null,()=>{
            mThis.self.show().siblings().hide();
            mThis.elUserClass.trigger('change');
        });
    }
    
    // this.loadRoleList = function(role_id,onFinish){
    //     post_ajax([mThis.base_url,'/api/getComboItems_role'].join(''),null,function(rows){
    //         CommonLib.setComboItems(mThis.elRole,rows,'id','name',true,'(Select User Role)', role_id);
    //         if(typeof onFinish =='function') onFinish();
    //     });
    // }
    this.loadWorkLocationList = function(loc_id,onFinish){
        post_ajax([mThis.base_url,'/api/getComboItems_workloc'].join(''),null,function(rows){
            CommonLib.setComboItems(mThis.elWorkLoc,rows,'id','name',true,'(Select Work Location)', loc_id);
            if(typeof onFinish =='function') onFinish();
        });
    }
    
    this.showUserExtendedDetails = function(official_code,user_class, onFinish){
       let p = {};
       p.official_code = official_code?official_code:mThis.elOfficialCode.val();
       //Assuming that loginName is Phone number
       p.phone_number = mThis.elLoginName.val();
       p.user_class = user_class;
       
       //if(!p.official_code)  p.official_code='';
       //if(!p.user_class)  p.user_class ='';
       post_ajax([mThis.base_url,'/api/getUserExtendedDetails'].join(''),p,function(d){
           mThis.div_extended_detail.show();
           if(!d) {
                mThis.elOfficialCode.val(null);
                mThis.elFullName.val(d).prop('readOnly',false);
                mThis.elPhoneNumber.val(null).prop('readOnly',false);
                mThis.elEmail.val(null).prop('readOnly',false);
                //mThis.elAddress.val(d.address).prop('readOnly',false);
                if (typeof onFinish =='function') onFinish(null);
                return;
           }

           d = StringSanitizer.sanitizeObject(d,null,['email']); //sanitize all props except "email" prop
           d.email = StringSanitizer.sanitizeOut(d.email,'email');
           mThis.elOfficialCode.val(d.official_code);
           mThis.elFullName.val(d.name).prop('readOnly',true);
           mThis.elPhoneNumber.val(d.phone_number,'readOnly',true);
           mThis.elEmail.val(d.email,'readOnly',true);
           //mThis.elAddress.val(d.address).prop('readOnly',true);;
           if (typeof onFinish =='function') onFinish(d);
       });
    };

    this.displayUserDetail = function() {
        let p = {};
        p.user_id = mThis.user_id;
        post_ajax([mThis.base_url,'/api/getUserById'].join(''),p,function(d) {
            d = StringSanitizer.sanitizeObject(d);
            
            mThis.div_extended_detail.show();

            mThis.elUserClass.val(StringSanitizer.sanitizeOut(d.user_class));
            mThis.elLoginName.val(StringSanitizer.sanitizeOut(d.login_name));
            mThis.elOfficialCode.val(StringSanitizer.sanitizeOut(d.official_code));
            mThis.elFullName.val(StringSanitizer.sanitizeOut(d.full_name));
            mThis.elEmail.val(StringSanitizer.sanitizeOut(d.email,'email'));
            mThis.elPhoneNumber.val(StringSanitizer.sanitizeOut(d.phone_number));
            //mThis.elAddress.val(StringSanitizer.sanitizeOut(d.address));
            mThis.elWorkLocation.val(StringSanitizer.sanitizeOut(d.work_location)); // work_location ='Branch 271'
            mThis.elWorkLocation_type.val(StringSanitizer.sanitizeOut(d.work_location_type)); //work_location_type = 'Branch'
            mThis.elWorkLocation_map.val(StringSanitizer.sanitizeOut(d.work_location_map)); //work_location_map = 'Google map x,y'
            //mThis.elPrevilegeType.val(d.previlege_type); 
        });
    }
 }; 
//end::AddUserPanel

//begin::SetPasswordDialig
 var SetPasswordDialog = new function(){
     let mThis = this;
     this.self = $('#_um_dlgSetPwd');
     this.elPwd = $('#_um_setpwd_newpwd');
     this.elConfirmPwd = $('#_um_setpwd_confirmpwd');
     this.btnSave = $('#_um_setpwd_btnSave');
     mThis.elError = $('#_um_setpwd_error');
     
     mThis.base_url = $('#__base_url').val();

     this.btnSave.on('click',function(e){
        mThis.elError.html(null);
         let p = {};
         p.login_name = mThis.login_name;
         p.newPwd = mThis.elPwd.val();
         if(p.newPwd != mThis.elConfirmPwd.val()) {
             mThis.elError.text('New password and Confirm password do not match');
             return;
         }
         post_ajax([mThis.base_url,'/api/setPassword'].join(''),p,function(err){
             if(!err || err =='') 
                mThis.self.modal('hide');
             else {
                 mThis.elError.text(err);
             }
         });
     });

     this.show = function(login_name) {
          mThis.login_name = login_name;
          mThis.elError.html(null);
          mThis.elPwd.val(null);
          mThis.elConfirmPwd.val(null);

          mThis.self.modal({
              backdrop:'static'
          });
     }
 }
//end::SetPasswordDialog

$(document).ready(function(){
    UserManagementComponent.init(); 
});
