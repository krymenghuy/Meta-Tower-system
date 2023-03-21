let PersonDialog=new function(){let mThis=this;this.self=$('#_cul_dlgCustomer');this.options={};let html=`
            <div class="modal fade" id="_per_dlgPerson" tabindex="-1" role="dialog" aria-labelledby="_per_dlgPerson_title"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title​ trans-text" data-langprop="titles.Choose Service Department"
                            id="_per_dlgPerson_title">Modify Personal Information</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row" id="_qsd_dlgQService_body">
                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Name">Name</span>
                                <div>
                                    <input type="text" class="form-control data-input" data-required="1" data-field="name" data-ffield="Name">
                                </div>
                            </div>

                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Sex">Sex</span>
                                <div>
                                    <select data-ffield="Sex" data-field="sex" data-required="1"
                                        class="modal-select2 data-input">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Date of Birth">Date of Birth</span>
                                <div>
                                    <input data-select="datepicker" class="form-control data-input" data-required="1" data-field="date_of_birth" data-ffield="Date of Birth">
                                </div>
                            </div>

                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Phone Number">Phone Number</span>
                                <div>
                                    <input type="text" class="form-control data-input" data-required="1" data-field="phone_number" data-ffield="Phone Number">
                                </div>
                            </div>

                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Email">Email</span>
                                <div>
                                    <input type="text" class="form-control data-input" data-required="0" data-field="email" data-ffield="Email">
                                </div>
                            </div>

                            <div class="form-group col-lg-6">
                                <span class="simple-label trans-text" data-langprop="person.Address">Address</span>
                                <div>
                                    <input type="text" class="form-control data-input" data-required="0" data-field="address" data-ffield="Address">
                                </div>
                            </div>

                            <div class="dialog-error" style="right:15px">
                                    <i class="fa fa-exclamation-triangle" style="color:red"></i>&nbsp;<span
                                    style="margin-left:15px" class="dialog-error-text"></span>
                            </div>

                        </div>
                        <!--Close row-->
                    </div>
                    <!--close body-->
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span
                                class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                        <button type="button" class="btn btn-primary" id="_per_dlgPerson_btnSave"><i
                                class="fa fa-save"></i><span class="trans-text"
                                data-langprop="buttons.Save">Save</span></button>
                    </div>
                </div>
                <!--close Content-->
            </div>
        </div>
    `;document.body.insertAdjacentHTML('beforeend',html);this.formUntil=new FormUntil({"itemName":"Person","formId":'_per_dlgPerson',"instance":this,"apiSave":`${main_view.base_url}/api/person/save`,"apiGet":`${main_view.base_url}/api/person/info`,"identityProps":["appt_id","id"],"modifyTitle":"Modify Person","sanitize_excepts":['email'],'use_alert_error':true,"init":()=>{return;}});this.show=(options=null)=>{options=options?options:{};mThis.options=options;mThis.formUntil.show(options);}}