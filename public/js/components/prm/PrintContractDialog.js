"use strict";
const CreateContractDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent:()=>{
                return `<div  class=" w-100 bg-white position-relative">
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

            </div>`;
            },
            // configSelect:[

            // ],
            contentCreated:(me)=>{

            },


            prepareFormOptions:{
                modifyTitle:"vslang:titles.Prepare Print Contract",
                createTitle:"vslang:titles.Print Contract",
                targetProp:"contractInfo",
               api: {
                endpoint: [
                    main_view.base_url,
                    "/prm/tenant/contract-form-option",
                ].join(""),
                params: (me,op) => {
                    return { id: op.id };
                },
            },
            },
            onPrepareForm:(me,data)=>{
              console.log(5555,data);
              
            },

            buttons:[
               {
                 label:'<span vslang="buttons.Cancel"></span>',
                 cssClass:"btn btn-secondary",
                 click:(me)=>{
                    me.hide(false);
                 }
               },
               {
                label:'<span vslang="buttons.Print"></span>',
                cssClass:"btn btn-primary",
                click:(me)=>{
                let op = me.getData();
                const queryString = new URLSearchParams(op).toString();
                main_view.getEncryptData(queryString,d=>{
                    const url = `${main_view.base_url}/create-contract/${d}`;
                    window.open(url, '_blank', 'noopener,noreferrer');
                    me.modal.hide(true, op);

                });



                }
              }
            ],

         });

        dialog.show(op);
     }

   return self;
})();
