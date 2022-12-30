<style>
   .vs-docs-table td{
     padding:5px;     
   }
    .profile-photo-frame{
        border-radius:3px;
        border:1px solid grey;
        min-height:80%;
        padding:5px;
        margin-left:5px;
    }
    .photo-buttons{
        margin-top:10px;
        height:20%;
    }
    #_main_loanAppComponent .simple-label{
        font-size:0.8em;
        text-transform:uppercase;
    }
    
    .address-box{
        display:block;
        width:100%;
        padding:10px;
        border-radius:3px;
        border:1.5px dotted #A6B5C0;
    }
    #_main_loanAppComponent .alert{
       padding:4px;
       font-size:0.9em;
       font-weight:bold;
    }
    #_main_loanAppComponent .alert i{
        margin-top:3px;
        margin-right:5px;
        margin-left:5px;
    }
    .vs-current-address-title{
        color:grey;
        display:inline-block;
        padding:3px;
    }
    .loanapp-no-docs{
        padding:3px;
        color:grey;
        font-size:0.9em;
    }
</style>
<div id="_main_loanAppComponent" style="display:none;">
            <div class="border-style1" style="width:100%; padding:15px;">
                  <H4> PERSONAL INFORMATION</H4>  
                  <div id="_loanapp_personal_data_view" style="width:100%">
                            <div class="row">
                                <div class="col-lg-9 col-md-9">
                                            <div class="row">
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">National ID</span>
                                                        <div><input id="_loanapp_nid" type="text" data-ffield="National ID" data-field="n_id" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name</span>
                                                        <div><input id="_loanapp_first_name" type="text"  data-ffield="First Name" data-field="first_name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name</span>
                                                        <div><input id="_loanapp_last_name" type="text"  data-ffield="Last Name" data-field="last_name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >First Name (kh)</span>
                                                        <div><input type="text" data-field="first_name_kh"  data-ffield="Khmer First Name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Last Name (kh)</span>
                                                        <div><input type="text" data-field="last_name_kh"  data-ffield="Khmer Last Name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Sex</span>
                                                        <div><select type="text" data-field="sex"  data-ffield="Sex" data-datatype="sex" data-required="1" class="form-control data-input person-data">
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Date of Birth</span>
                                                        <div><input type="text"  data-ffield="Date of Birth" data-field="date_of_birth" data-datatype="dob" data-required="1" class="form-control data-input person-data" data-select="datepicker"></div>
                                                    </div>
                                    
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label" >Phone Number</span>
                                                        <div><input type="text"  data-ffield="Phone Number" data-field="phone_number" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Other Phone Number</span>
                                                        <div><input type="text"  data-ffield="Other Phone Number" data-field="phone_number1" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Address</span>
                                                        <div><input type="text" data-field="address" data-ffield="Address" data-datatype="address" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Email</span>
                                                        <div><input type="text"  data-ffield="Email" data-field="email" data-datatype="email" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label">Occupation&nbsp;<a id="_loanapp_lnkNewOccupation" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                        <div><select id="_loanapp_occupation"  data-ffield="Occupation" data-field="occupation_id" data-datatype="string" data-required="1" class="modal-select2 data-input person-data"></select></div>
                                                    </div>
            

                                    </div>

                                </div>

                                    <div class="col-lg-3 col-md-3">
                                                <div class="profile-photo-frame">
                                                    <img id="_loanapp_profile_img" src="" alt="" style="width:75%"></img>
                                                </div>
                                                
                                                <div class="photo-buttons">
                                                    &nbsp;<a href="#" id="_loanapp_lnkChoosePhoto" class="btn btn-sm btn-outline-success">Choose</a>
                                                    &nbsp;&nbsp;<a href="#" id="_loanapp_lnkDeletePhoto" class="btn btn-sm btn-outline-danger">Delete</a>
                                                    <input type="file" id="_loanapp_fileChooser" style="display:none"/>    
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
                                                            <div><input type="text" data-field="adr_street"  data-ffield="Current Address Street" class="form-control data-input person-data"></div>
                                                        </div>
                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label">City</span>
                                                            <div><select id="_loanapp_adr_city"  data-ffield="Current Address City" data-field="adr_city_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label">District</span>
                                                            <div><select id="_loanapp_adr_district"  data-ffield="Current Address District" data-field="adr_district_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label">Commune</span>
                                                            <div><select id="_loanapp_adr_commune"  data-ffield="Current Address Commune" data-field="adr_commune_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>
                                            </div>
                                </div>
                                
                                <div class="row">
                                        <div class="form-group col-lg-3">
                                                <span class="simple-label">Contact person name</span>
                                                <div><input type="text"  data-ffield="Contact Person Name" data-field="cp_name" class="form-control data-input person-data"></div>
                                            </div>
                                            
                                            <div class="form-group col-lg-3">
                                                <span class="simple-label">Relationship</span>
                                                <div><input type="text"  data-ffield="Contact Person Relationship" data-field="cp_relationship" class="form-control data-input person-data"></div>
                                            </div> 
                                            <div class="form-group col-lg-6">
                                                <span class="simple-label">Contact person phone</span>
                                                <div><input type="text"  data-ffield="Contact Person Phone" data-field="cp_phone_number" class="form-control data-input person-data"></div>
                                            </div> 

                            </div>
                  </div>
                       
                  <div style="width:100%;margin-top:10px">
                            <div id="_loanapp_employment_view" style="width:100%;">
                                            <div class="alert alert-warning" style="background-color:#80DFE0;border:none;"><i class="fas fa-user-graduate"></i> EMPLOYMENT INFORMATION &nbsp;<a href="javascript:void(0)" data-toggle="tooltip" data-tooltip="Employment History" data-placement="top"><i class="fa fa-list-alt"></i></a></div>
                                            <div id="_loanapp_view" class="flat-box" style="margin-top:-20px;">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-3">
                                                                            <span class="simple-label">Start date</a> </span>
                                                                            <div><input  data-ffield="Employment Start Date" type="text" data-required="1"  data-field="emp_start_date" class="form-control data-input person-data" data-select="datepicker"></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-5">
                                                                            <span class="simple-label">Employment Organization &nbsp;<a id="_loanapp_lnkNewOrg" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select id="_loanapp_emp_org"  data-ffield="Employer organization" data-field="emp_org_id" class="modal-select2 data-input person-data"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-4">
                                                                            <span class="simple-label">Position Title</span>
                                                                            <div><input  data-ffield="Position title" type="text" id="_loanapp_emp_position" data-field="emp_position" class="form-control data-input person-data"></div>
                                                                    </div>
                                                                   
                                                            </div>
                                            </div>
                            </div>
                    </div>

                    <div style="width:100%;margin-top:10px">
                            <div id="_loanapp_academic_view" style="width:100%;">
                                            <div class="alert alert-warning"><i class="fas fa-user-graduate"></i> ACADEMIC INFORMATION</div>
                                            <div id="_loanapp_view" class="flat-box" style="margin-top:-20px;">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-3">
                                                                            <span class="simple-label">Student ID</a> </span>
                                                                            <div><input  data-ffield="Student ID" type="text" data-required="1"  data-field="student_code" class="form-control data-input"></div>
                                                                    </div>
                                                                    <div class="form-group col-lg-6">
                                                                            <span class="simple-label">Program of study &nbsp;<a id="_loanapp_lnkNewProgram" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select  data-ffield="Program" id="_loanapp_program" data-field="program_id" class="form-control data-input modal-select2"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-2">
                                                                            <span class="simple-label">Cumulative GPA</span>
                                                                            <div><input  data-ffield="GPA" type="number" id="_loanapp_gpa" data-field="cgpa" class="form-control data-input"></div>
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

                           <div id="_loanapp_documents_view" style="width:100%">
                                    <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-receipt"></i> SUPPORT DOCUMENTS &nbsp; <a id="_loanapp_lnkAddDocument" href="#"> <i class="fa fa-plus"></i></a></div>
                                        <div id="_loanapp_docs" class="flat-box" style="margin-top:-20px">
                                            <input type="file" id="_loanapp_docs_input" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display:none"> 
                                            <table id="_loanapp_tblDocs" class="vs-docs-table">
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Salary statment</td>
                                                        <td><div class="width:80">
                                                        <a class="loanapp-btn-delete-doc" href="#"><i class="fa fa-times" style="color:red"></i></a>&nbsp;
                                                        <a class="loanapp-btn-download-doc" href="#"><i class="fa fa-download" style="color:green"></i></a>&nbsp;
                                                        <a class="loanapp-btn-open-doc" href="#"><i class="fas fa-file" style="color:grey"></i></a>
                                                        </div></td>
                                                    </tr>
                                                </tbody> 
                                            </table>         
                                        </div>
                           </div>

                           <div id="_loanapp_reqiest_view" style="width:100%">
                                    <div class="alert alert-info" style="margin-top:10px"> <i class="fas fa-list-alt"></i> REQUEST INFORMATION</div>
                                        <div id="_loanapp_request" class="flat-box" style="margin-top:-20px;">
                                                <div id="_loanapp_request_data" class="row">
                                                        <div class="form-group col-lg-3">
                                                                    <span class="simple-label">Loan Type</span>
                                                                        <div><select id="_loanapp_loan_type" data-field="loan_type_id" class="data-input modal-select2">
                                                                          
                                                                        </select></div>
                                                        </div>

                                                         <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Existing Loan</span>
                                                                        <div><select id="_loanapp_active_loan" data-field="loan_id" class="data-input modal-select2"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Request Amount</span>
                                                                        <div><input type="number" data-ffield="Request Amount" id="_loanapp_request_amount" data-field="request_amount" class="form-control data-input"></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                <span class="simple-label">Loan Purpose  &nbsp;<a id="_loanapp_lnkNewPurpose" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                                <div><select data-ffield="Purpose of loan" id="_loanapp_purpose" data-field="purpose_id" class="data-input modal-select2"></select></div>
                                                        </div>
                                                      
                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Monthly Interest (%)</span>
                                                                        <div><input type="number" data-ffield="Interest Rate" data-field="monthly_interest_rate" class="form-control data-input"></div>
                                                        </div>
                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Loan Period (months)</span>
                                                                        <div><input type="number" data-ffield="Loan period" data-field="period_months" class="form-control data-input"></div>
                                                        </div>
  
                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Repayment Option</span>
                                                                        <div><select data-ffield="Payment option" id="_loanapp_payback_option" data-field="payback_method_id" class="data-input modal-select2"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Minimum installment</span>
                                                                        <div><input type="number" data-ffield="Minimum Installment" data-field="minimum_installment" class="form-control data-input"></div>
                                                        </div>
 
                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label">First Pmt Date</span>
                                                                        <div><input type="text" data-ffield="First Payment Date" data-field="first_pmt_date" data-required="1" data-datatype="date" class="form-control data-input" data-select="datepicker"></div>
                                                        </div>

                                                        <div class="form-group col-lg-6">
                                                                        <span class="simple-label">Remarks</span>
                                                                        <div><input type="text" data-field="remarks" class="form-control data-input" placeholder="Remarks"></div>
                                                        </div>
                                                         
                                                </div>         

                                        </div>
                           </div>

                   </div>

                   <div style="width:100%;position:fixed;bottom:15px;">
                            <div class="form-inline" style="float:left;margin-left:7vw">
                                <button id="_loanapp_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id ="_loanapp_btnSave" type="button" class="vs-btn-lg  vs-btn-primary" style="min-width:100px"><i class="fa fa-save"></i> Save</button>&nbsp;
                                <button id ="_loanapp_btnApprove" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i> Approve</button>
                                <button id ="_loanapp_btnDisburse" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i> Disburse</button>
                            </div>
                 </div>

 
            </div>
 
           
</div> 

<!--begin::NewOrgDialog -->
<div class="modal fade" id="dlgNewOrg" tabindex="-1" role="dialog" aria-labelledby="dlgNewOrgTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
      <img src="{{asset('/assets/images/icons/company1.png')}}" style="width:38px;">&nbsp;<h5 class="modal-title" id="dlgNewOrgTitle">New Organization</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
                        <div class="form-group col-lg-12">
                            <span class="simple-label">Organization Name</span> 
                            <div><input id="_new_org_name" type="text" class="form-control"></div> 
                        </div>

                        <div class="form-group col-lg-12">
                            <span class="simple-label">Organization Type</span> 
                            <div><select id="_new_org_type" type="text" class="modal-select2">
                                    <option value="0">Inspecific</option>
                                    <option value="1">Private Sector</option>
                                    <option value="2">Public Sector / Government</option>
                                    <option value="3">Non-Government / NGOs</option>
                            </select></div> 
                        </div>

                        <div class="form-group col-lg-12">
                            <span class="simple-label">Industry</span> 
                            <div><select id="_new_org_industry" type="text" class="modal-select2"></select></div> 
                        </div>
                
                        <div>
                        <span style="margin-left:15px" id="dlgNewOrg_error" class="error_text"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> Cancel</button>
                        <button type="button" class="btn btn-primary" id="dlgNewOrg_btnOK"><i class="fa fa-check"></i> Create</button>
                    </div>
        </div>
    </div>
  </div>
</div>
<!--end::dlgNewOrg -->


<script  src="{{ asset('js/LoanAppComponent.js') }}"></script>