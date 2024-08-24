const CreateLoginDialog = (()=>{
  const self = {};
  let dialog = null;
  self.show = (op)=>{
     dialog = dialog || new GeneralDialog({
            title: LocaleManager.trans("Create Login","titles"),
            cssClass:"modal-lg",
            createContent:()=>{
               return `<div class="w-100 d-flex flex-wrap flex-row align-items-center justify-content-center gap-2">
                     <div name="div_user_photo"></div>
                     <div style="visibility:hidden" class="d-none align-items-center justify-content-center border border-secondary rounded-5 p-3 flex-grow">
                     <h5 class="p-2">User may have an official profile details</h5>
                     </div>
               </div>

               <div class="row mt-2">
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Role Name"></label>
                     <select name="role_id" class="data-input" data-field="role_id"></select>
                  </div>
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Branch Name"></label>
                     <select name="branch_id" class="data-input" data-field="branch_id"></select>
                  </div>
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.User Class"></label>
                     <select name="user_class" class="modal-select2 data-input" data-field="user_class"></select>
                  </div>
               
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Official ID"></label>
                     <input name="official_code" class="form-control data-input" data-field="official_code" />
                  </div>

                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Full Name"></label>
                     <input name="full_name" class="form-control data-input" data-field="full_name" />
                  </div>

                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Phone Number"></label>
                     <input name="phone_number" class="form-control data-input" data-field="phone_number" />
                  </div>

                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Email"></label>
                     <input name="email" class="form-control data-input" data-field="email" />
                  </div>
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Login Name"></label>
                     <input name="login_name" class="form-control data-input" data-field="login_name" />
                  </div>
               </div>

               <div class="row">
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Password"></label>
                     <input name="password" type="password" class="form-control data-input" data-field="password" />
                  </div>
                  <div class="form-group col-6">
                     <label for="" class="form-label " vslang="titles.Confirm Password"></label>
                     <input name="confirm_password" type="password" class="form-control data-input" data-field="confirm_password" />
                  </div>
               </div>`;
            },
            configSelect:[
               {
               name:"role_id",
               data:"roles",
               textField:"role_name",
               valueField:"id"
               },
               {
                  name:"branch_id",
                  data:"branches",
                  textField:"branch_name",
                  valueField:"id"
               },
               {
               name:"user_class",
               data:"user_classes",
               textField:"user_class",
               valueField:"user_class"
               }
            ],
            contentCreated:(me)=>{
               //initialize div_user_photo, making it become an ImageBox that contains functionality (upload image, display image of user)
               me.controls.userImageBox = new ImageBox(me.controls.div_user_photo,{cssClass:"data-input",dataset:{"field":"photo"}});
               me.showProfile =  (code) =>{
                     let fields = ['full_name','email','phone_number','login_name']; 
                     let p = {"official_code":code,'user_class': me.controls.user_class.value}; 
                     vsapi.call([main_view.base_url,'/api/user/profile-by-code'].join(''),p,false,false).then(res =>{
                     let d = res.status_code ==200? res.data: {};
                     d = d || {}; 
                     me.fieldList.forEach(el =>{
                        const f =el.dataset.field;
                        if(fields.indexOf(f)>=0){
                              el.value = d[f] || "";
                        }
                        
                     });
            
                     });
                  };

               me.controls.official_code.addEventListener('blur',e =>{
                     e.preventDefault();
                     let official_code = me.controls.official_code.value;
                     me.showProfile(official_code);
                  });
            
                  me.controls.user_class.onchange = e=>{
                     e.preventDefault();
                     let official_code = me.controls.official_code.value;
                     me.showProfile(official_code);
                  }
            },
            onPrepareForm:(me)=>{
               LocaleManager.translateZone(me.divModal);
               me.controls.role_id.value = parseInt(me.dataOptions.role_id);
               me.controls.role_id.dispatchEvent(new Event('change'));
               me.controls.branch_id.value = parseInt(me.dataOptions.branch_id);
               me.controls.branch_id.dispatchEvent(new Event('change'));
            },
            // extendMethods:{
            //     "getData":(me,dataOptions)=>{
            //        return {"photo":me.controls.userImageBox.getImage()};
            //     }
            // },
            prepareFormOptions:{
               createTitle:LocaleManager.trans("Create Login","titles"),
               api:{
                  endpoint:[main_view.base_url,'/api/user/form-options'].join(''),
                  params:(me,dataOptions)=>{
                     return {};
                  }
               }
            },
            
            buttons:[
               {
                  label:"<span>Cancel</span>",
                  cssClass:"btn btn-warning",
                  click:(me)=>{
                     me.hide(false);
                  }
               },
               {
               label:"<span>Create</span>",
               cssClass:"btn btn-primary",
               click:(me)=>{
                  let p = me.getData();
                  // p.photo = me.controls.userImageBox.getImage();
                  console.log(p);
                     // vsapi.call([main_view.base_url,'/api/user/save'].join(''),p,false,false).then(res =>{
                     //     if(res.status_code ==200){
                     //         mThis.modal.hide(true,p);
                     //     }else cv_interact.error(res.error_message);
                     // });

               }
               }  
            ],
         });

         dialog.show(op);
  }

  return self;
})();