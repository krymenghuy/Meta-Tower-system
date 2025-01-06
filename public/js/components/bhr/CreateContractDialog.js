"use strict";
const CreateContractDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            title: "Create Contract",
            cssClass:"modal-lg",
            createContent:()=>{
                return [`<div  class=" w-100 bg-white position-relative">
                <div class="scope-user row gy-2">
                    <div class="col-md-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Branch"></label>
                            <input name="director-branch" class="form-control data-input" data-field="branch_name" readonly />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Director"> </label>
                            <input name="director-name" class="form-control data-input" data-field="com_rep_name" readonly />
                        </div>
                        <!-- <div class="form-group w-100">
                            <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                            <select class="form-control data-input" data-field="com_rep_sex">
                                <option value="">(Select Sex)</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div> -->
                        
                           <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.ID Card"></label>
                            <input name="director-nid" class="form-control data-input" data-field="com_rep_nid"  />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Phone Number"></label>
                            <input name="director-phone" class="form-control data-input" data-field="com_rep_phone" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Location"></label>
                            <textarea name="com_address" class="form-control data-input" data-field="branch_address" ></textarea>
                        </div>
                   
                    </div>

                    <div class="col-lg-6">
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Staff Name"></label>
                            <input name="emp-name" class="form-control data-input" data-field="name_kh" readonly />
                        </div>

                        <!-- <div class="form-group w-100">
                            <label for="sex" class="form-label text-primary-custom" vslang="titles.Sex"></label>
                            <select class="form-control data-input" data-field="emp_sex">
                                <option value="">(Select Sex)</option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option value="O">Other</option>
                            </select>
                        </div> -->
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Position"></label>
                            <input name="emp-position" class="form-control data-input" data-field="emp_position"  readonly />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.ID Card"></label>
                            <input name="emp-nid" class="form-control data-input" data-field="emp_nid"  />
                        </div>
                       <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Phone Number"></label>
                            <input name="emp-phone" class="form-control data-input" data-field="emp_phone" />
                        </div>
                        <div class="form-group w-100">
                            <label for="" class="form-label " vslang="titles.Address"></label>
                            <textarea name="emp-address" class="form-control data-input" data-field="emp_address"></textarea>
                        </div>
                    
                    
                    </div>
                    
                </div>
               
            </div>`].join('');
            },
            // configSelect:[
              
            // ],
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
                modifyTitle:"Create Contract",
                createTitle:"Create Contract",
                targetProp:"contractInfo",
               api:{
                  endpoint:[main_view.base_url,'/hr/employee/contract-form-option'].join(''),
                  params: (op) => {
                    return { id: op.id };
                },
                  onResponse: (me, res) => {
                    // console.log(123,res.data);
                    
                    
                },
                    // params: {id:3}
               }
            },
            onPrepareForm:(me,data,fields,divModal)=>{
                LocaleManager.translateZone(me.divModal);
                
                
                // const branch = EmployeeComponent.getFilterData().branch_id;
                // console.log(12,branch);
                
                // if(branch) {
                //     me.controls.dir_branch.value = branch;
                // }
                // me.options.title = me.dataOptions.title||"Create Branch";
            },
            
            buttons:[
               {
                 label:"<span>Cancel</span>",
                 cssClass:"btn btn-sm btn-danger",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:"<span>Create</span>",
                cssClass:"btn btn-sm btn-primary",
                click:(me)=>{
                  let op = me.getData();
                    console.log(123456,JSON.stringify(op,null,2) );
                    
                const queryString = new URLSearchParams(op).toString();
                const url = `${main_view.base_url}/create-contract?${queryString}`;
                window.open(url, '_blank', 'noopener,noreferrer');
                me.modal.hide(true, op);

                
                }
              }  
            ],
        
         });
        // console.log(1,op);
        
        dialog.show(op);
     }

   return self;
})();