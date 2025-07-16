ChangeLoginNameDialog = (()=>{
   const self = {}; 
   let dialog = null;
   
   self.show = (op)=>{
        dialog  = dialog || new GeneralDialog({
            //dialogId:"cahngelogin",
            title:"Change Login Name",
            cssClass:"modal-md vs-modal-dialog",
            // fields:[
            //     {
            //         name:"login_name",
            //         dataType:"string",
            //         required:true
            //     }
            // ],
            createContent:()=>{
                return `
                <div class="row w-100 m-0 p-0">

                    <div class="col-12">
                        <div class="material-input outlined">
                            <input name="login_name" class="form-control data-input" data-field="login_name" placeholder=" " />
                            <label>Login Name</label>
                        </div>
                    </div>


                </div>
                `

            },
            contentCreated:(me)=>{
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = me.divModal.querySelector('.modal-title');
                const btnClose = me.divModal.querySelector('button');

                btnClose.classList.add('d-none');
                header.classList.add('bg-yp-custom','modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important';
                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);

                header.innerHTML = '';
                header.appendChild(headerWrapper);
            },
            buttons:[
                {
                    action:"cancel",
                    cssClass:"btn btn-sm text-white btn-warning",
                    label:"<span>Cancel</span>",
                    dismissModal:true, 
                },
                {
                    cssClass:"btn btn-sm btn-yp-custom",
                    label:"<span>Change Now</span>",
                    click:(me,btn,divModal)=>{
                        let p = me.getData();
                        vsapi.call(`${main_view.base_url}/api/user/change-login-name`,p,btn,false,false).then(res =>{
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
