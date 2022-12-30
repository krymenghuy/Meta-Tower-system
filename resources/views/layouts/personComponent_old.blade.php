<style>
  
    .profile-photo-frame{
        border-radius:3px;
        border:1px solid grey;
        height:80%;
        padding:5px;
        margin-left:5px;
    }
    .photo-buttons{
        margin-top:10px;
        height:20%;
    }
    #_main_personComponent .simple-label{
        font-size:0.8em;
        text-transform:uppercase;
    }

    .address-box{
        display:block;
        width:100%;
        padding:10px;
        border-radius:3px;
        background:#DFF4F7;
    }
    #_main_personComponent .alert{
       padding:4px;
       font-size:0.9em;
       font-weight:bold;
    }
    #_main_personComponent .alert i{
        margin-top:3px;
        margin-right:5px;
        margin-left:5px;
    }
    .vs-current-address-title{
        color:grey;
        display:inline-block;
        padding:3px;
    }
</style>
<div id="_main_personComponent" style="display:none;">
            <div class="border-style1" style="width:100%; padding:15px;">
                  <div class="alert alert-info"><i class="fa fa-list-alt"></i> PERSONAL INFORMATION</div>  
                  <div id="_per_personal_info_panel" style="width:100%">
                            <div class="row">
                                <div class="col-lg-10 col-md-10">
                                            <div class="row">
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">National ID</span>
                                                        <div><input type="text" data-field="n_id" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name</span>
                                                        <div><input type="text" data-field="first_name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name</span>
                                                        <div><input type="text" data-field="last_name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name (kh)</span>
                                                        <div><input type="text" data-field="first_name_kh" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name (kh)</span>
                                                        <div><input type="text" data-field="last_name_kh" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Sex</span>
                                                        <div><select type="text" data-field="sex" data-datatype="sex" data-required="1" class="form-control data-input person-data">
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Date of Birth</span>
                                                        <div><input type="text" data-field="date_of_birth" data-datatype="dob" data-required="1" class="form-control data-input person-data" data-select="datepicker"></div>
                                                    </div>
                                    
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Phone Number 1</span>
                                                        <div><input type="text" data-field="phone_number" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Phone Number 2</span>
                                                        <div><input type="text" data-field="phone_number1" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Address</span>
                                                        <div><input type="text" data-field="address" data-datatype="address" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Email</span>
                                                        <div><input type="text" data-field="email" data-datatype="email" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Occupation&nbsp;<a id="_per_lnkNewOccupation" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                        <div><select id="_per_occupation" data-field="occupation" data-datatype="string" data-required="1" class="modal-select2 data-input person-data"></select></div>
                                                    </div>
            

                                    </div>

                                </div>

                                    <div class="col-lg-2 col-md-2">
                                                <div class="profile-photo-frame">
                                                    <img id="_per_profile_img" src="" alt="" style="width:100%"></img>
                                                </div>
                                                
                                                <div class="photo-buttons">
                                                    &nbsp;<a href="#" id="_per_lnkChoosePhoto" class="btn btn-sm btn-outline-success">Choose</a>
                                                    &nbsp;&nbsp;<a href="#" id="_per_lnkRemovePhoto" class="btn btn-sm btn-outline-danger">Delete</a>
                                                    <input type="file" id="_per_fileChooser" style="display:none"/>    
                                                </div>

                                    </div>

                            </div>

                            <div class="address-box">
                                        <div style="margin-top:-10px">
                                        <span class="vs-current-address-title">Current address</span>
                                        </div> 
                                        <div class="row">
                                                    <div class="form-group col-lg-1">
                                                            <span class="simple-label">House#</span>
                                                            <div><input type="text" data-field="adr_house" class="form-control data-input person-data"></div>
                                                        </div> 
                                                        <div class="form-group col-lg-1">
                                                            <span class="simple-label">Street</span>
                                                            <div><input type="text" data-field="adr_street" class="form-control data-input person-data"></div>
                                                        </div>
                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">City</span>
                                                            <div><select id="_per_adr_city" data-field="adr_city_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">District</span>
                                                            <div><select id="_per_adr_district" data-field="adr_district_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-2">
                                                            <span class="simple-label">Commune</span>
                                                            <div><select id="_per_adr_commune" data-field="adr_commune_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>
                                            </div>
                                </div>
                                
                                <div class="row">
                                        <div class="form-group col-lg-3">
                                                <span class="simple-label">Contact person name</span>
                                                <div><input type="text" data-field="cp_name" class="form-control data-input person-data"></div>
                                            </div>
                                            
                                            <div class="form-group col-lg-3">
                                                <span class="simple-label">Relationship</span>
                                                <div><input type="text" data-field="cp_relationship" class="form-control data-input person-data"></div>
                                            </div> 
                                            <div class="form-group col-lg-6">
                                                <span class="simple-label">Contact person phone</span>
                                                <div><input type="text" data-field="cp_phone_number" class="form-control data-input person-data"></div>
                                            </div> 

                            </div>
                  </div>
                       
                    <div style="width:100%;margin-top:10px">
                            <div id="_loanapp_income_view" style="width:100%;">
                                            <div class="alert alert-warning"><i class="fas fa-user-graduate"></i> ACADEMIC INFORMATION</div>
                                            <div id="_loanapp_view" class="flat-box" style="margin-top:-20px;">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-6">
                                                                            <span class="simple-label">Program of study &nbsp;<a id="_loanapp_lnkNewProgram" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select id="_loanapp_program" data-field="program_id" class="form-control data-input modal-select2"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-2">
                                                                            <span class="simple-label">GPA</span>
                                                                            <div><select id="_loanapp_gpa" data-field="cgpa" class="form-control modal-select2 data-input"></select></div>
                                                                    </div>
                                                            </div>
                                            </div>
                            </div>
    
                        
                            <div id="_loanapp_income_view" style="width:100%;display:none">
                                    <div class="alert alert-success"><i class="fas fa-file-invoice-dollar"></i> INCOME SECTION</div>
                                    <div id="_loanapp_income" class="flat-box" style="margin-top:-20px;">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Source</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead> 
                                        </table>         
                                    </div>
                            </div>

                            <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-receipt"></i> SUPPORT DOCUMENTS</div>
                            <div id="_loanapp_docs" class="flat-box" style="margin-top:-20px">
                                   <table class="table">
                                       <thead>
                                           <tr>
                                               <th>No</th>
                                               <th>Description</th>
                                           </tr>
                                       </thead> 
                                   </table>         
                            </div>

                           <div id="_loanapp_request_view" style="width:100%">
                                    <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-list-alt"></i> REQUEST INFORMATION</div>
                                        <div id="_loanapp_request" class="flat-box" style="margin-top:-20px;">
                                                <div id="_loanapp_request_data" class="row">
                                                        <div class="form-group col-lg-3">
                                                                    <span class="simple-label">Request Type</span>
                                                                        <div><select id="_loanapp_request_type" data-field="request_type_id" class="data-input modal-select2">
                                                                            <option value="1">New Loan</option>
                                                                            <option value="1">Add Loan</option>
                                                                        </select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Existing Loan</span>
                                                                        <div><select id="_loanapp_existing_loan" data-field="loan_id" class="data-input modal-select2"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Request Amount</span>
                                                                        <div><input type="number" id="_loanapp_request_amount" data-field="request_amount" class="form-control data-input"></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Loan Purpose</span>
                                                                        <div><select id="_loanapp_purpose" data-field="loan_purpose" class="data-input modal-select2"></select></div>
                                                        </div>   
                                                </div>         

                                        </div>
                           </div>

                   </div>

                   <div style="width:100%;position:fixed;right:15;bottom:15px;">
                            <div class="form-inline">
                                <button id="_per_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id ="_per_btnSave" type="button" class="vs-btn-lg  vs-btn-primary" style="min-width:100px"><i class="fa fa-save"></i> Save</button>&nbsp;
                                <button id ="_per_btnApproveLoan" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i> Approve</button>
                            </div>
                 </div>

 
            </div>
 
           
</div> 
<script  src="{{ asset('js/PersonComponent.js') }}"></script>