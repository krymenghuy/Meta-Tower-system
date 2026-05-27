"use strict";
const BranchDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-lg",
            createContent:()=>{
                return [`<div data-roleid="" class=" w-100 bg-white position-relative">
                <div class="scope-user row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Branch Name"> </label> <span class = 'text-danger' > *</span>
                            <input name="name" class="form-control data-input" data-field="name" placeholder="Name " />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Shortcut"> </label> <span class = 'text-danger' > *</span>
                            <input name="shortcut" class="form-control data-input" data-field="shortcut" placeholder="Shortcut" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Address::(Khmer)"></label> <span class = 'text-danger' ></span>
                            <input class="form-control data-input" data-field="address_kh" placeholder="" />
                        </div>
                         <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Address (English)"></label> <span class = 'text-danger' ></span>
                            <input name="address_en" class="form-control data-input" data-field="address" placeholder="" />
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label" vslang="titles.Phone Number"></label>
                            <input class="form-control data-input" data-field="phone_number" placeholder="" />
                        </div>
                         <div class="form-group w-100">
                            <label for="" class="form-label" vslang="titles.Email"></label>
                            <input class="form-control data-input" data-field="email" placeholder="" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Website"></label> <span class = 'text-danger'></span>
                            <input name="full_name" class="form-control data-input" data-field="website" placeholder=" Enter website" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Contact Person"></label> <span class = 'text-danger'></span>
                            <input class="form-control data-input" data-field="first_cp_name" placeholder="" />
                        </div>
                    </div>

                </div>

            </div>`].join('');
            },
            configSelect:[

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
                  },
                  onResponse:(res)=>{
                    const warning = res.data?.warning ?? null;
                    if(warning) cv_interact.warning(warning);
                  }

               }
            },
            onPrepareForm:(me,data)=>{
               const id = me.dataOptions.id ?? null;
                 console.log('tt::',data);
               if(id > 0){

               }
            },
            buttons:[
               {
                 label:`<span vslang="buttons.Cancel"></span>`,
                 cssClass:"btn-vs-cancel",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:"<span vslang='buttons.Save'></span>",
                cssClass:"btn-vs-save",
                click:(me,btn)=>{
                  const p = me.getData();
                  p.id = me.dataOptions.id||'';


                    vsapi.call([main_view.base_url,'/api/branch/save'].join(''),p,{loader:false,agent:btn}).then(res =>{
                        if(res.status_code ==200){
                            //cv_interact.success('Branch has been saved!');
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
