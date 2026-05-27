const ChangeRoleDialog = (()=>{
    let self = {};
    let dialog = null;

    /** op = {id:number , login_name:""} */
    self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            title:"Change User Role", 
            cssClass:"modal-md",
            showCancelButton:true,
            createContent:() =>{
                return [`<div class="row">
                            <div class="form-group col-md-12">
                                <label class="form-label" vslang="titles.User"></label>
                                <input name="login_name" type="text" value = "`,op.login_name,`" class="form-control data-input" data-field="login_name" readonly />
                            </div>
                            <div class="form-group col-md-12 ">
                                <label for="payee_id" class="form-label" vslang="titles.Roles"></label>
                                <div><select name="role_id" class="data-input" data-field="role_id"></select></div>
                            </div>                        
                        </div>`].join('');
            },
            configSelect:[
                {
                    name:"role_id",
                    data:'roles',
                    valueField:'id',
                    textField:'role_name'
                }
            ],
            prepareFormOptions:{
                createTitle:'Set Role',
                modifyTitle:'Change Role',
                targetProp:"user",
                api:{
                  endpoint:`${main_view.base_url}/api/user/role/form-options`,
                  params:(dataOptions)=>{
                     return {"id":dataOptions.id};
                  } 
                }
            },
            onPrepareForm:(me)=>{
               LocaleManager.translateZone(me.divModal); 
               me.controls.role_id.value = parseInt(me.dataOptions.role_id);
               me.controls.role_id.dispatchEvent(new Event('change'));
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
                label:"<span>Change Now</span>",
                cssClass:"btn-vs-cancel",
                icon:"",
                click:(me,btn,divModal)=>{
                    let p = me.getData();
                    p.id = me.dataOptions.id || me.dataOptions.user_id;
                    vsapi.call(`${main_view.base_url}/api/user/role/change`,p,false,false,false).then(res=>{
                        if (res.status_code === 200) 
                            me.hide(true,res.data);
                        else
                            cv_interact.error(res.error_message);
                    }); 
                }
             }
            ],
        });
        dialog.show(op);
    }

    return self;
})();