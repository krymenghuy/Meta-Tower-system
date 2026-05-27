"use strict";
const ChangePasswordDialog = (()=>{
  const self = {};
  let dialog = null;

  self.show = (op)=>{
     dialog = dialog || new GeneralDialog({
        title: LocaleManager.trans("Change Password",'titles'),
        cssClass:null,
        createContent:(me)=>{
            return [`<div class="form-group">
                    <label for="old_password" class="form-label  " vslang="titles.Current Password">Current Password</label>
                    <div class="input-group flex-nowrap">
                        <input name="old_password" type="password" class="form-control data-input" data-field="old_password" autocomplete="off">
                        <div class="input-group-text" role="button">
                            <i class="fa-regular fa-eye fs-5 text-muted"></i>
                        </div>
                    </div>
                </div>`,
                `<div class="form-group">
                    <label for="new_password" class="form-label  " vslang="titles.New Password">New Password</label>
                    <div class="input-group flex-nowrap">
                        <input name="new_password" type="password" class="form-control data-input" data-field="new_password" autocomplete="off">
                        <div class="input-group-text" role="button">
                            <i class="fa-regular fa-eye fs-5 text-muted"></i>
                        </div>
                    </div>
                </div>`,
            `<div class="form-group">
            <label for="confirm_password" class="form-label  " vslang="titles.Confirm New Password">Confirm New Password</label>
            <div class="input-group flex-nowrap">
                <input name="confirm_password" type="password" class="form-control data-input" data-field="confirm_password" autocomplete="off">
                <div class="input-group-text" role="button">
                    <i class="fa-regular fa-eye fs-5 text-muted"></i>
                </div>
            </div>
            </div>`
            ].join('');
        },
        // afterInit:(me,divModal)=>{
        //     me.fieldList.forEach(input=>{
        //        input.onInput = function(){
        //             if((me.controls.password.value === me.controls.confirm_password.value) && !(input.value == ''))
        //             {
        //                 input.classList.remove('border-danger');
        //                 input.classList.remove('border-danger');
        //             }
        //             else
        //             {
        //                 input.classList.add('border-danger');
        //                 input.classList.add('border-danger');
        //             }
        //        }
        //        input.nextElementSibling.onclick = e=>{
        //            let type = input.type ==='password' ? 'text' : 'password';
        //            input.type = type;
        //        }
        //     });
        // },
        contentCreated:(me) => {
            me.fieldList.forEach(input=>{
               input.onInput = function(){
                    if((me.controls.password.value === me.controls.confirm_password.value) && !(input.value == ''))
                    {
                        input.classList.remove('border-danger');
                        input.classList.remove('border-danger');
                    }
                    else
                    {
                        input.classList.add('border-danger');
                        input.classList.add('border-danger');
                    }
               }
               input.nextElementSibling.onclick = e=>{
                   let type = input.type ==='password' ? 'text' : 'password';
                   input.type = type;
               }
            });
        },
        buttons:[
            {
                label:"<span>Cancel</span>",
                cssClass:"btn-vs-cancel",
                click:(me,btn)=>{
                    me.hide(false);
                }
            },
            {
                label:"<span>Change</span>",
                cssClass:"btn-vs-save",
                click:(me,btn)=>{
                    let p = me.getData();
                    p.id = me.dataOptions.user_id || me.dataOptions.id;
                    if(p.new_password !== p.confirm_password){
                        cv_interact.warning(LocaleManager.trans('Password and confirmed password do not match!','titles'));
                        return;
                    }
                    delete(p.confirm_password);
                    
                    let login_name = me.dataOptions.login_name ?? "";
                    vsapi.call([main_view.base_url,'/api/user/password/change'].join(''),p,btn,false).then(res => {
                        if(res.status_code === 200)
                        {
                            me.hide(true);
                            let msg = LocaleManager.trans('Password has been changed successfully','titles');
                            cv_interact.success(msg);
                        }
                        else cv_interact.error(res.error_message);
                        
                    });
                }
            }
        ] 
        
      });
       dialog.show(op);
  };

  return self;
})();