const CreateLoginDialog = (()=>{
  const self = {};
  let dialog = null;
  self.show = (op)=>{
     dialog = dialog || new GeneralDialog({
            title: LocaleManager.trans("Create Login","titles"),
            cssClass:"modal-lg",
             createContent: () => {
               return `
               <div class="row">
                  <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <div name="div_user_photo" class="border border-primary rounded-3 overflow-hidden" style="width: 150px; height: 150px; background-color: #f0f0f0;"></div>
                        <div style="visibility: hidden;" class="d-none align-items-center justify-content-center border border-secondary rounded-5 p-3 mt-3 text-center">
                           <h5 class="p-2">User may have an official profile details</h5>
                        </div>
                        <label class="mt-2 text-muted small d-none text-center">User Profile Photo</label>
                  </div>
                  <div class="col-md-8">
                        <div class="row">
                              <div class="col-6">
                                 <div class="form-group">
                                    <label>Full Name</label>
                                    <input name="full_name" class="form-control rounded-1 data-input" data-field="full_name" placeholder=" " />
                                 </div>
                              </div>
                              <div class="col-6">
                                 <div class="form-group">
                                    <label>Login Name</label>
                                    <input name="login_name" class="form-control rounded-1 data-input" data-field="login_name" placeholder=" " />
                                 </div>
                              </div>
                              <div class="form-group col-6">
                                 <label class="">Role Name</label>
                                 <select name="role_id" class="data-input rounded-1 form-control" data-field="role_id"></select>
                              </div>
                              <div class="col-6">
                                 <div class="form-group">
                                    <label class="">User Class</label>
                                    <select name="user_class" class="modal-select2 data-input form-control" data-field="user_class"></select>
                                 </div>
                              </div>
                              <div class="form-group col-6">
                                 <label class="">Branch Name</label>
                                 <select name="branch_id" class="data-input rounded-1 form-control" data-field="branch_id"></select>
                              </div>
                         
                           <div class="col-6">
                              <div class="form-group">
                                 <label>Official ID</label>
                                 <input name="official_code" class="form-control rounded-1 data-input" data-field="official_code" placeholder=" " />
                              </div>
                           </div>
                          
                           <div class="col-6">
                              <div class="form-group">
                                 <label>Phone Number</label>
                                 <input name="phone_number" class="form-control rounded-1 data-input" data-field="phone_number" placeholder=" " />
                              </div>
                           </div>
                           <div class="col-6">
                              <div class="form-group">
                                 <label>Email</label>
                                 <input name="email" class="form-control data-input" data-field="email" placeholder=" " />
                              </div>
                           </div>
                           
                           <div class="col-6">
                              <div class="form-group">
                                 <label>Password</label>
                                 <input name="password" type="password" class="form-control rounded-1 data-input" data-field="password" placeholder=" " />
                              </div>
                           </div>
                           <div class="col-6">
                              <div class="form-group">
                                 <label>Confirm Password</label>
                                 <input name="confirm_password" type="password" class="form-control rounded-1 data-input" data-field="confirm_password" placeholder=" " />
                              </div>
                           </div>
                        </div>
                  </div>
               </div>`;
            },
            contentCreated:(me)=>{
                    const footer = me.divModal.querySelector('.modal-footer');
                    const header = me.divModal.querySelector('.modal-header');
                    const headerTitle = header.querySelector('.modal-title');
                    const btnClose = header.querySelector('button');

                    btnClose.classList.add('d-none');
                    header.classList.add('bg-primary-custom', 'modal-header-custom');
                    header.parentElement.classList.add('overflow-hidden');
                    header.parentElement.style = 'border-radius: 20px !important;';

                    const headerWrapper = document.createElement('div');
                    headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');

                  //   const logo = document.createElement('img');
                  //   logo.src = '/assets/images/yavpheng/logo_yp.jpg';
                  //   logo.alt = 'Logo';
                  //   logo.classList.add('img-logo', 'mb-2');
                  //   logo.style.height = '80px';

                    headerTitle.classList.add('text-white', 'text-center', 'w-100');
                  //   headerWrapper.appendChild(logo);
                    headerWrapper.appendChild(headerTitle);

                    header.innerHTML = '';
                    header.appendChild(headerWrapper);

                    const div_user_photo = me.controls.div_user_photo;
                    me.userImageBox = new ImageBox(div_user_photo,{
                     defaultPhotoName: "default-user",
                     containerClass: "user-profile-container",
                     imgClass: "data-input",
                     dataset:{
                        "field":"photo",
                     }/** please set field: photo so that we can use for both Edit and Create easily */,
                        //dataset: { field: "image_url" },
                     beforeDeleteImage: async() =>{
                        if(me.dataOptions.id > 0){
                           const yes = await cv_interact.confirm("Are you sure to delete this photo?",
                              {title: "Delete Photo",context:"delete"}
                           );
                           if(yes){
                              //delete user photo from backend
                              me.deleteProfilePhoto(me.dataOptions.id);
                              return true;
                           }else return false;
                        }else{
                           me.userImageBox.setImage(null);
                        }
                        return true;
                     },
                     //When user browse new photo and loads it in the IMG element
                     onPenImage: (img) =>{
                        if(me.dataOptions.id > 0){
                           me.saveProfilePhoto(img,me.dataOptions.id);
                        }
                     },
                    });
                    me.deleteProfilePhoto = (id) =>{
                     const p = {id:id};
                     vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/api/user/delete-profile-picture",
                                ].join(""),
                                p,
                                false,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.userImageBox.setImage(null);
                                    cv_interact.info(
                                        "Profile photo was deleted!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };
                      me.saveProfilePhoto = (photo, id) => {
                        const p = { "photo": photo, "id": id };
                        vsapi
                            .call(
                                [
                                    main_view.base_url,
                                    "/api/user/save-profile-picture",
                                ].join(""),
                                p,
                                false
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    me.userImageBox.setImage(res.data.image_url);
                                    cv_interact.success(
                                        "Profile photo was saved!"
                                    );
                                } else cv_interact.error(res.error_message);
                            });
                    };

               // console.log(222,div_user_photo);
               // //initialize div_user_photo, making it become an ImageBox that contains functionality (upload image, display image of user)
               // me.controls.userImageBox = new ImageBox(me.controls.div_user_photo,{cssClass:"data-input",dataset:{"field":"photo"}});
               // me.showProfile =  (code) =>{
               //    let fields = ['full_name','email','phone_number','login_name']; 
               //    let p = {"official_code":code,'user_class': me.controls.user_class.value}; 
               //    vsapi.call([main_view.base_url,'/api/user/profile-by-code'].join(''),p,false,false).then(res =>{
               //    let d = res.status_code ==200? res.data: {};
               //    d = d || {}; 
               //    me.fieldList.forEach(el =>{
               //       const f =el.dataset.field;
               //       if(fields.indexOf(f)>=0){
               //             el.value = d[f] || "";
               //       }
                     
               //    });
         
               //    });
               // };

               // me.controls.official_code.addEventListener('blur',e =>{
               //    e.preventDefault();
               //    let official_code = me.controls.official_code.value;
               //    me.showProfile(official_code);
               // });
               // me.controls.user_class.onchange = e=>{
               //    e.preventDefault();
               //    let official_code = me.controls.official_code.value;
               //    console.log(222,me.controls.user_class);
               //    if(me.controls.user_class.value=='admin')
               //       me.controls.official_code.disable = true;
               //    me.showProfile(official_code);
               // }
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
               textField:"user_class_name",
               valueField:"user_class"
               }
            ],
           
            prepareFormOptions:{
               createTitle:LocaleManager.trans("Create Login","titles"),
               modifyTitle:LocaleManager.trans("Modify User","titles"),
               targetProp:"user",
               api:{
                  endpoint:[main_view.base_url,'/api/user/form-options'].join(''),
                  params:(op)=>{
                     return {id:op.id};
                  },
               },
            },
             onPrepareForm:(me,data)=>{
               LocaleManager.translateZone(me.divModal);
               //initialize div_user_photo, making it become an ImageBox that contains functionality (upload image, display image of user)
               // me.controls.userImageBox = new ImageBox(me.controls.div_user_photo,{ containerClass:'user-profile-container', imgClass:"data-input",dataset:{"field":"photo"}});
               // me.showProfile =  (code) =>{
               //    let fields = ['full_name','email','phone_number','login_name']; 
               //    let p = {"official_code":code,'user_class': me.controls.user_class.value}; 
               //    vsapi.call([main_view.base_url,'/api/user/profile-by-code'].join(''),p,false,false).then(res =>{
               //    let d = res.status_code ==200? res.data: {};
               //    d = d || {}; 
               //    // me.fieldList.forEach(el =>{
               //    //    const f =el.dataset.field;
               //    //    if(fields.indexOf(f)>=0){
               //    //          el.value = d[f] || "";
               //    //    }
               //    // });
               //    });
               // };
               // if(!me.dataOptions.id){
               //    me.divModal.children[0].classList.replace('modal-md','modal-lg');
               //    me.controls.role_id.value = parseInt(me.dataOptions.role_id);
               //    me.controls.role_id.dispatchEvent(new Event('change'));
               //    me.controls.branch_id.value = parseInt(me.dataOptions.branch_id);
               //    me.controls.branch_id.dispatchEvent(new Event('change'));

               //    me.controls.official_code.addEventListener('blur',e =>{
               //       e.preventDefault();
               //       let official_code = me.controls.official_code.value;
               //       me.showProfile(official_code);
               //    });
               //    me.divModal.querySelectorAll('.data-input').forEach(el => {

               //       let field = el.dataset.field;
               //       if (el.tagName.toLowerCase() === 'select') 
               //          VSUtil.closestLimited(el,'.form-group').classList.remove('d-none');
               //       if(field == 'full_name'||field == 'phone_number')
               //          el.parentElement.classList.replace('col-12','col-6');
               //       else
               //          el.parentElement.classList.remove('d-none');
               //   });
               //    me.controls.user_class.onchange = e=>{
               //       e.preventDefault();
               //       let official_code = me.controls.official_code.value;
               //       // console.log(222,me.controls.official_code);
               //       if(me.controls.user_class.value == 'admin')
               //          me.controls.official_code.disabled = true;
               //       else
               //          me.controls.official_code.disabled = false;
               //       me.showProfile(official_code);
               //    }
               // }
               // if(me.dataOptions.id != null){
               //    console.log(222,me.divModal.children);   
               //    me.divModal.children[0].classList.replace('modal-lg','modal-md');
               //    // me.divModal.children[0].classList.remove('modal-lg');
               //    // me.divModal.children[0].classList.add('modal-md');
               //    me.divModal.querySelectorAll('.data-input').forEach(el => {

               //       let field = el.dataset.field;
               //       if (el.tagName.toLowerCase() === 'select') 
               //          VSUtil.closestLimited(el,'.form-group').classList.add('d-none');
               //       if(field == 'full_name'||field == 'phone_number'){
               //          el.parentElement.classList.replace('col-6','col-12');
               //          el.parentElement.classList.remove('d-none');
               //       }
               //       else
               //          el.parentElement.classList.add('d-none');
               //   });
               // }
            },
            extendMethod: {
               setData: (me, data) => {
                  
                  me.userImageBox.setImage(data.image_url);
               }
            },
            // extendMethods:{
            //     "getData":(me,dataOptions)=>{
            //        return {"photo":me.controls.userImageBox.getImage()};
            //     }
            // },
            
            buttons:[
               {
                  label:"<span vslang='titles.Cancel'></span>",
                  cssClass:"btn btn-vs-cancel",
                  click:(me)=>{
                     me.hide(false);
                  }
               },
               {
               label:"<span vslang='titles.Create'></span>",
               cssClass:"btn btn-vs-save",
               click:(me,btn)=>{
                  const p = me.getData();
                     p.photo = me.userImageBox ? me.userImageBox.getImage(): '';
                     console.log(JSON.stringify(p,null,2));
                     vsapi.call([main_view.base_url,'/api/user/save'].join(''),p,{useCache:false,loader:true,agent:btn}).then(res =>{
                         if(res.status_code == 200){
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