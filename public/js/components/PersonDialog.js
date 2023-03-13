//begin::PersonDialog| EditPersonDialog (for Edit only, Not for Creating New person profile)
let PersonDialog = new function(){
    //this.base_url = main_view.base_url;     
    let mThis = this;
    this.self = $('#_cul_dlgCustomer');
    this.options = {};

    let html = `
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
    `;

    document.body.insertAdjacentHTML( 'beforeend', html);
    
    //PersonDialog
    this.formUntil = new FormUntil({
        "itemName":"Person",
        "formId":'_per_dlgPerson',
        "instance":this,
        "apiSave":`${main_view.base_url}/api/person/save`,
        "apiGet":`${main_view.base_url}/api/person/info`,
        //Tell formUtil that the primary key name is "id". This is used to update or create customer record
        //"identityProp":"id", //if not mentioned here as "id", formUtil will use default identityProp as "id",
        "identityProps":['appt_id','id'], //If "id" is not found in this options then formUtil will use one of these props as identity property. In this case, formUtil will use "appt_id" instead of "id" (person_id)
        "modifyTitle":"Modify Person",
        //"createTitle":"New Person",
        //Set additional data props for method getFormData() to collect data inputs from this dialog form,
        //"form_data_props":['appt_id'], //Tells formUtil to include additional props (id,appt_id) in the data input collected from the dialog form
        "sanitize_excepts":['email'],
        'use_alert_error':true,
        "init": ()=>{
               //init code here
               return;
        }
        //,"beforeShow":beforeShow
    });
 
    //options = {id,appt_id}
    this.show = (options=null)=>{
        options = options?options:{};
        mThis.options =  options;
        mThis.formUntil.show(options);
    }
     
} 
//end::PersonDialog