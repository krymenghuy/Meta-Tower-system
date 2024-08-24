"use strict";
const CreateBranchDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            title: "Create Branch",
            cssClass:"modal-lg",
            createContent:()=>{
                return [`<div data-roleid="" class=" w-100 bg-white position-relative">
                <div class="scope-user row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Full Name"> </label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="name" placeholder=" Enter Full Name " />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Address"></label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="address" placeholder=" Enter address" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.First cp name"></label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="first_cp_name" placeholder=" Enter first cp name" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Second cp name"></label>
                            <input name="full_name" class="form-control data-input" data-field="second_cp_name" placeholder=" Enter second cp name" />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Website"></label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="website" placeholder=" Enter website" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Phone Number"></label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="phone_number" placeholder=" Enter phone number" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.First cp phone"></label> <span class = 'text-danger' > *</span>
                            <input name="full_name" class="form-control data-input" data-field="first_cp_phone" placeholder=" Enter first cp phone" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Second cp phone"></label>
                            <input name="full_name" class="form-control data-input" data-field="second_cp_phone" placeholder=" Enter second cp phone" />
                        </div>
                    </div>
                    
                </div>
               
            </div>`].join('');
            },
            configSelect:[
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
              //   me.controls.userImageBox = new ImageBox(me.controls.div_user_photo,{cssClass:"data-input",dataset:{"field":"photo"}});
              //   me.showProfile =  (code) =>{
              //       let fields = ['full_name','email','phone_number','login_name']; 
              //       let p = {"official_code":code,'user_class': me.controls.user_class.value}; 
              //       vsapi.call([main_view.base_url,'/api/user/profile-by-code'].join(''),p,false,false).then(res =>{
              //         let d = res.status_code ==200? res.data: {};
              //         d = d || {}; 
              //         me.fieldList.forEach(el =>{
              //            const f =el.dataset.field;
              //            if(fields.indexOf(f)>=0){
              //                el.value = d[f] || "";
              //            }
                        
              //         });
             
              //       });
              //     };
        
              //   me.controls.official_code.addEventListener('blur',e =>{
              //       e.preventDefault();
              //       let official_code = me.controls.official_code.value;
              //       me.showProfile(official_code);
              //    });
            
              //    me.controls.user_class.onchange = e=>{
              //       e.preventDefault();
              //       let official_code = me.controls.official_code.value;
              //       me.showProfile(official_code);
              //    }
            },
            
            // extendMethods:{
            //     "getData":(me,dataOptions)=>{
            //        return {"photo":me.controls.userImageBox.getImage()};
            //     }
            // },
            prepareFormOptions:{
                modifyTitle:"Modify Branch",
                createTitle:"Create Branch",
               api:{
                  targetProp:"branch",
                  endpoint:[main_view.base_url,'/api/branch/form-options'].join(''),
                  params:(dataOptions)=>{
                     return {id:dataOptions.id};
                  }
                    // params: {id:3}
               }
            },
            onPrepareForm:(me,data,fields,divModal)=>{
                LocaleManager.translateZone(me.divModal);
                me.options.title = me.dataOptions.title||"Create Branch";
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
                label:"<span>Save</span>",
                cssClass:"btn btn-primary",
                click:(me)=>{
                  let p = me.getData();
                  p.id = me.dataOptions.id||'';
                    vsapi.call([main_view.base_url,'/api/branch/save'].join(''),p,false,false).then(res =>{
                        if(res.status_code ==200){
                            cv_interact.success('success!');
                            me.hide(true,p);
                        }else cv_interact.error(res.error_message);
                    });
                }
              }  
            ],
        
         });
        
        dialog.show(op);
     }

   return self;
})();