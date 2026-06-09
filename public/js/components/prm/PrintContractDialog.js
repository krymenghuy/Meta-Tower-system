"use strict";
const CreateContractDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        console.log(9090,op);
        
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    ` <div class="row g-3 justify-content-start">
                        <div class="p-3 bg-white border rounded shadow-sm">
                            <h6 class="mb-3 text-golden" vslang="labels.Tenant Details">Tenant Details</h6>
                            <div class="row g-3 justify-content-center">
                                <div class="col-6">
                                    <div class="vs-material-field">
                                        <input type="text" name="name" class="data-input form-control" data-field="name" disabled placeholder="" />
                                        <label vslang="labels.Tenant">Tenant</label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select data-style="material" name="sex" class="data-input form-control" data-field="sex" disabled placeholder="Gender">
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                                <div class="col-md-3">
                                    <div class="vs-material-field">
                                        <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" disabled data-field="date_of_birth" placeholder=" " />
                                        <label vslang="labels.Date of Birth">Date of Birth</label>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="vs-material-field">
                                        <input type="text" name="legal_name" class="data-input form-control" data-field="legal_name" disabled placeholder=" " />
                                        <label vslang="labels.Legal Name">Legal Name</label>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" disabled placeholder="Nationality"></select>
                                </div>
                                <div class="col-3">
                                    <div class="vs-material-field">
                                        <input type="text" name="national_id" class="data-input form-control" data-field="national_id" disabled placeholder=" " />
                                        <label vslang="labels.National ID"></label>
                                    </div>
                                </div>
                                 <div class="col-6">
                                    <div class="vs-material-field">
                                        <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" disabled placeholder=" " />
                                        <label vslang="labels.Start Date">Start Date</label>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="vs-material-field">
                                        <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" disabled placeholder=" " />
                                        <label vslang="labels.End Date">End Date</label>
                                    </div>
                                </div>
                                
                                <div class="col-12 pt-2">
                                    <div class="vs-material-field">
                                        <textarea name="address" class="data-input form-control" data-field="address" rows="3" disabled placeholder=" "></textarea>
                                        <label vslang="labels.Current Address">Current Address</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="p-3 bg-white border rounded shadow-sm">
                            <h6 class="mb-3 text-golden" vslang="labels.Represented by Meta Tower">Represented by Meta Tower</h6>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="vs-material-field">
                                        <input name="com_rep_name" class="data-input form-control" data-field="com_rep_name"  placeholder="Company Representative" />
                                        <label vslang="labels.Company Representative">Company Representative</label>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="vs-material-field">
                                        <input type="text" data-type="date" name="signature_date" class="data-input form-control" data-field="issue_date" disabled placeholder=" " />
                                        <label vslang="labels.Signature Date"></label>
                                    </div>
                                </div>
                      
                                
                               

                            </div>
                        </div>
                </div>`,
                ].join("");
            },
            contentCreated:(me)=>{

            },
            configSelect: [
                {
                    name: "nationality_id",
                    data: "nationalities",
                    textField: "nationality",
                    valueField: "id",
                },
            ],
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
                    console.log(444,op);
                    return { id: op.id,tenant_id:op.tenant_id};
                },
            },
            },
            onPrepareForm:(me,data)=>{
              console.log(5555,data);

              me.dataOptions.tenant_id = data.contractInfo.id;
              
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
                op.id= me.dataOptions.tenant_id;
                console.log(555555,op);

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
