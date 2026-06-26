"use strict";
const CreateContractDialog = (()=>{
   const self = {};
   let dialog = null;
     self.show = (op)=>{
        dialog = dialog || new GeneralDialog({
            cssClass:"modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return [
                    ` <div class="row g-3 justify-content-start">
                        <!-- Left Column (Original) -->
                        <div class="col-md-6">
                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Tenant Details">Tenant Details</h6>
                                <div class="row g-3 justify-content-center">
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="name" class="data-input form-control" data-field="name" disabled placeholder="" />
                                            <label vslang="labels.Tenant">Tenant</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <select data-style="material" name="sex" class="data-input form-control" data-field="sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="date_of_birth" class="data-input form-control form_input" disabled data-field="date_of_birth" placeholder=" " />
                                            <label vslang="labels.Date of Birth">Date of Birth</label>
                                        </div>
                                    </div>
                                    <!-- <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="legal_name" class="data-input form-control" data-field="legal_name" disabled placeholder=" " />
                                            <label vslang="labels.Legal Name">Legal Name</label>
                                        </div>
                                    </div> -->
                                    <div class="col-md-6">
                                        <select data-style="material" name="nationality_id" class="data-input form-control" data-field="nationality_id" disabled placeholder="${LocaleManager.trans("Nationality", "labels")}"></select>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="national_id" class="data-input form-control" data-field="national_id" disabled placeholder=" " />
                                            <label vslang="labels.National ID"></label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="nid_issue_date" class="data-input form-control form_input" data-field="nid_issue_date" disabled placeholder=" " />
                                            <label vslang="labels.National ID Issue Date"></label>
                                        </div>
                                    </div>
                                    <div class="col-6 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="lease_term" class="data-input form-control form_input" data-field="lease_term" disabled placeholder=" " />
                                            <label vslang="labels.Duration">Duration</label>
                                        </div>
                                    </div>
                                    
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="start_date" class="data-input form-control form_input" data-field="start_date" disabled placeholder=" " />
                                            <label vslang="labels.Start Date">Start Date</label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="end_date" class="data-input form-control form_input" data-field="end_date" disabled placeholder=" " />
                                            <label vslang="labels.End Date">End Date</label>
                                        </div>
                                    </div>
                                     <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="space_code" class="data-input form-control form_input" data-field="space_code" disabled placeholder=" " />
                                            <label vslang="labels.Unit Code"></label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="monthly_price" class="data-input form-control form_input" data-field="monthly_price" disabled placeholder=" " />
                                            <label vslang="labels.Monthly Price">Monthly Price</label>
                                        </div>
                                    </div>
                                    <div class="col-3 d-none">
                                        <div class="vs-material-field">
                                            <input type="text" name="deposit" class="data-input form-control form_input" data-field="deposit" disabled placeholder=" " />
                                            <label vslang="labels.Deposit">Deposit</label>
                                        </div>
                                    </div>
                                    
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="position" class="data-input form-control form_input" data-field="position" placeholder=" " />
                                            <label vslang="labels.Position"></label>
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
                                <h6 class="mb-3 text-golden" vslang="labels.Owner Details">Owner Details</h6>
                                <div class="row g-3">
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input name="com_rep_name" class="data-input form-control" data-field="com_rep_name" placeholder=" " />
                                            <label vslang="labels.Company Representative">Company Representative</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <select data-style="material" name="com_rep_sex" class="data-input form-control" data-field="com_rep_sex" placeholder="${LocaleManager.trans("Gender", "labels")}">
                                            <option value="M">${LocaleManager.trans("Male", "labels")}</option>
                                            <option value="F">${LocaleManager.trans("Female", "labels")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="com_rep_dob" class="data-input form-control form_input" disabled data-field="com_rep_dob" placeholder=" " />
                                            <label vslang="labels.Date of Birth">Date of Birth</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_nationality" class="data-input form-control" data-field="com_rep_nationality" placeholder=" " value="Khmer" />
                                            <label vslang="labels.Nationality">Nationality</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_national_id" class="data-input form-control" data-field="com_rep_nid" disabled placeholder=" " />
                                            <label vslang="labels.National ID">National ID</label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" data-type="date" name="com_rep_nid_issue_date" class="data-input form-control form_input" data-field="com_rep_nid_issue_date" disabled placeholder=" " />
                                            <label vslang="labels.National ID Issue Date"></label>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="vs-material-field">
                                            <input type="text" name="com_rep_position" class="data-input form-control form_input" data-field="com_rep_position" placeholder=" " value="Company Representative" />
                                            <label vslang="labels.Position"></label>
                                        </div>
                                    </div>
                                    <div class="col-12 pt-2">
                                        <div class="vs-material-field">
                                            <textarea name="com_rep_address" class="data-input form-control" data-field="com_rep_address" rows="3" disabled placeholder=" "></textarea>
                                            <label vslang="labels.Current Address">Current Address</label>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>


                        <!-- Right Column -->
                        <div class="col-md-6">
                            <div class="p-3 bg-white border rounded shadow-sm mb-3">
                                <h6 class="mb-3 text-golden" vslang="labels.Rental Info">Rental Info</h6>
                                <div class="row g-3 justify-content-center">
                                    <div class="col-6">
                                        <select data-style="material" placeholder="${LocaleManager.trans('Unit Code', 'labels')}" name="code" class="data-input form-control" data-field="space_id"> </select>
                                    </div>
                                    <div class="col-6">
                                        <select data-style="material" placeholder="${LocaleManager.trans('Floor', 'labels')}" name="floor_id" class="data-input form-control" data-field="floor_id"> </select>
                                    </div>
                                    <div class="col-12 pt-2">
                                        <div class="vs-material-field">
                                            <textarea name="address_kh" class="data-input form-control" data-field="address_kh" rows="3" disabled placeholder=" "></textarea>
                                            <label vslang="labels.Current Address">Current Address</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                </div>`,
                ].join("");
            },
            contentCreated:(me)=>{
                const inputs = me.divModal.querySelectorAll('.data-input');
                inputs.forEach(input => {
                    const syncValues = (e) => {
                        const target = e.target;
                        const fieldName = target.getAttribute('name');
                        if (!fieldName) return;
                        
                        let peerName;
                        if (fieldName.endsWith('_right')) {
                            peerName = fieldName.slice(0, -6);
                        } else {
                            peerName = fieldName + '_right';
                        }
                        
                        const peer = me.divModal.querySelector(`[name="${peerName}"]`);
                        if (peer && peer.value !== target.value) {
                            peer.value = target.value;
                            peer.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    };
                    input.addEventListener('input', syncValues);
                    input.addEventListener('change', syncValues);
                });
            },
            configSelect: [
                {
                    name: "nationality_id",
                    data: "nationalities",
                    textField: "nationality",
                    valueField: "id",
                },
                {
                    name: "nationality_id_right",
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
                    // console.log(444,op);
                    return { id: op.id,tenant_id:op.tenant_id};
                },
            },
            },
            onPrepareForm:(me,data)=>{
            //   console.log(5555,data);
 
              me.dataOptions.tenant_id = data.contractInfo.id;
              
              // Sync loaded data from left elements to right elements
              const leftInputs = me.divModal.querySelectorAll('.data-input:not([name$="_right"])');
              leftInputs.forEach(leftInput => {
                  const name = leftInput.getAttribute('name');
                  if (name) {
                      const rightInput = me.divModal.querySelector(`[name="${name}_right"]`);
                      if (rightInput) {
                          rightInput.value = leftInput.value;
                          rightInput.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                  }
              });
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
                     me.hide(true, op);
                });



                }
              }
            ],

         });

        dialog.show(op);
     }

   return self;
})();
