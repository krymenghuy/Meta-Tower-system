ChangeLoginNameDialog = (()=>{
   const self = {}; 
   let dialog = null;
   
   self.show = (op)=>{
        dialog  = dialog || new GeneralDialog({
            //dialogId:"cahngelogin",
            title:"Change Login Name",
            cssClass:"modal-md vs-modal-dialog",
            fields:[
                {
                    name:"login_name",
                    dataType:"string",
                    required:true
                }
            ],
            buttons:[
                {
                    action:"cancel",
                    cssClass:"btn btn-vs-cancel",
                    label:"<span>Cancel</span>",
                    dismissModal:true, 
                },
                {
                    cssClass:"btn btn-vs-save",
                    label:"<span>Change</span>",
                    click:(me,btn,divModal)=>{
                        let p = me.getData();
                        vsapi.call(`${main_view.base_url}/api/user/login-name/change`,p,btn,false,false).then(res =>{
                            if(res.status_code ==200){
                                me.hide(true,p);
                                cv_interact.success(['Login name has been changed to ',p.login_name].join(''));
                            }else cv_interact.error(res.error_message);
                        });
                    } 
                }
            ],
            onShow:(me)=>{
                me.fields.login_name.value = me.dataOptions.login_name;
            },
        });

        dialog.show(op);
   };

   return self;
})();
