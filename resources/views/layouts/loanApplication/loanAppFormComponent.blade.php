<style>
  
  /* .select2-container--default.select2-container--focus .select2-selection--single{
   border: 1px solid red !important;;
  } */
   .vs-docs-table td{
     padding:5px;     
   }
    .profile-photo-frame{
        border-radius:3px;
        border:1px solid grey;
        padding:5px;
        margin-left:5px;
        width:230px;
        height:250px;
        overflow:hidden;
    }
    .photo-buttons{
        margin-top:10px;
        height:20%;
    }
    #_main_loanAppComponent .simple-label{
        font-size:0.8em;
        text-transform:uppercase;
    }
    .profile-photo-frame> img{
        width:100%;
        display:block;
        margin:auto;
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

    .vs-card{
        padding:15px;
        margin:15px !important;
        width:100%;
        border-color:grey !important;
    }
    .vs-card h5{
        color:#4D5453;
        font-size:1em;
        font-weight:bold;
    }
    table#_loanapp_tblCols th{
         color:grey !important;
         border-bottom:none !important; 
         font-size:0.9em;      
    }
    
    table#_loanapp_tblCols td{
         color:#000;       
    }
</style>
<div id="_main_loanAppFormComponent" style="display:none;">
            <div style="width:100%;">
                  <div id="_loanapp_personal_data_view" class="card vs-card">
                           <h5 class="trans-text" data-langprop="loan_app_form.personal info">PERSONAL INFORMATION</h5>
                            <div class="row">
                                <div class="col-lg-9 col-md-9">
                                            <div class="row">
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text"  data-langprop="loan_app_form.national id">National ID</span>
                                                        <div><input id="_loanapp_nid" type="text" data-ffield="National ID" data-field="national_id" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.first name">First Name</span>
                                                        <div><input id="_loanapp_first_name" type="text"  data-ffield="" data-field="first_name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text"  data-langprop="loan_app_form.last name">Last Name</span>
                                                        <div><input id="_loanapp_last_name" type="text"  data-ffield="Last Name" data-field="last_name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text"  data-langprop="loan_app_form.first name kh">First Name (kh)</span>
                                                        <div><input type="text" data-field="first_name_kh"  data-ffield="Khmer First Name" data-datatype="firstname" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.last name kh" >Last Name (kh)</span>
                                                        <div><input type="text" data-field="last_name_kh"  data-ffield="Khmer Last Name" data-datatype="lastname"  data-required="1" class="form-control data-input person-data"></div>
                                                    </div>
                            
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Sex">Sex</span>
                                                        <div><select type="text" data-field="sex"  data-ffield="Sex" data-datatype="sex" data-required="1" class="form-control data-input person-data">
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Date of Birth" >Date of Birth</span>
                                                        <div><input type="text"  data-ffield="Date of Birth" data-field="date_of_birth" data-datatype="dob" data-required="1" class="form-control data-input person-data" data-select="datepicker"></div>
                                                    </div>
                                    
                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Phone Number" >Phone Number</span>
                                                        <div><input type="text"  data-ffield="Phone Number" data-field="phone_number" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Other Phone Number" >Other Phone Number</span>
                                                        <div><input type="text"  data-ffield="" data-field="phone_number1" data-datatype="phone" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Address" >Address</span>
                                                        <div><input type="text" data-field="address" data-ffield="Address" data-datatype="address" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Email" >Email</span>
                                                        <div><input type="text"  data-ffield="Email" data-field="email" data-datatype="email" data-required="1" class="form-control data-input person-data"></div>
                                                    </div>

                                                    <div class="form-group col-lg-3">
                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Occupation" >Occupation&nbsp;<a id="_loanapp_lnkNewOccupation" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                        <div><select id="_loanapp_occupation"  data-ffield="Occupation" data-field="occupation_id" data-datatype="string" data-required="1" class="modal-select2 data-input person-data"></select></div>
                                                    </div>
            

                                    </div>

                                </div>

                                    <div class="col-lg-3 col-md-3">
                                                <div class="profile-photo-frame">
                                                    <img id="_loanapp_profile_img" src="" alt=""></img>
                                                </div>
                                                
                                                <div class="photo-buttons">
                                                    <input type="file" id="_loanapp_fileChooser" style="display:none"/>
                                                    &nbsp;<a href="javascript:void(0)" id="_loanapp_lnkChoosePhoto" class="btn btn-sm btn-outline-success off-when-readonly">Choose</a>
                                                    &nbsp;&nbsp;<a href="#" id="_loanapp_lnkDeletePhoto" class="btn btn-sm btn-outline-danger off-when-readonly">Delete</a>
                                                 
                                                </div>

                                    </div>

                            </div>

                            <div class="">
                                        <div style="margin-top:-10px">
                                        <span class="vs-current-address-title trans-text" data-langprop="loan_app_form.Current Address" >Current address</span>
                                        </div> 
                                        <div class="row">
                                                    <div class="form-group col-lg-1">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.House No" >House#</span>
                                                            <div><input type="text" data-field="adr_house" class="form-control data-input person-data"></div>
                                                        </div> 
                                                        <div class="form-group col-lg-1">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Street" >Street</span>
                                                            <div><input type="text" id="_loanapp_street" data-field="adr_street"  data-ffield="Current Address Street" class="form-control data-input person-data"></div>
                                                        </div>
                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.City" >City</span>
                                                            <div><select id="_loanapp_adr_city"  data-ffield="Current Address City" data-field="adr_city_id" data-required="1" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.District" >District</span>
                                                            <div><select id="_loanapp_adr_district"  data-ffield="Current Address District" data-field="adr_district_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Commune" >Commune</span>
                                                            <div><select id="_loanapp_adr_commune"  data-ffield="Current Address Commune" data-field="adr_commune_id" class="data-input modal-select2 person-data"></select></div>
                                                        </div>
                                            </div>
                                </div>
                                
                                <div class="row">
                                        <div class="form-group col-lg-3">
                                                <span class="simple-label trans-text" data-langprop="loan_app_form.cp name" >Contact person name</span>
                                                <div><input type="text"  data-ffield="Contact Person Name" data-field="cp_name" class="form-control data-input person-data"></div>
                                            </div>
                                            
                                            <div class="form-group col-lg-3">
                                                <span class="simple-label trans-text" data-langprop="loan_app_form.cp relationship" >Relationship</span>
                                                <div><input type="text"  data-ffield="Contact Person Relationship" data-field="cp_relationship" class="form-control data-input person-data"></div>
                                            </div> 
                                            <div class="form-group col-lg-6">
                                                <span class="simple-label trans-text" data-langprop="loan_app_form.cp phone" >Contact person phone</span>
                                                <div><input type="text"  data-ffield="Contact Person Phone" data-field="cp_phone_number" class="form-control data-input person-data"></div>
                                            </div> 

                            </div>
                  </div>
                       
                  <div style="width:100%;margin-top:10px">
                            <div id="_loanapp_employment_view" class="card vs-card">
                                            <h5 class="trans-text" data-langprop="loan_app_form.Employment Information"> EMPLOYMENT INFORMATION</h5>
                                            <div id="_loanapp_view">
                                                            <div class="row">
                                                                    <div class="form-group col-lg-3">
                                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Start Date" >Start date</a> </span>
                                                                            <div><input  data-ffield="Employment Start Date" type="text" data-required="0"  data-field="emp_start_date" class="form-control data-input person-data" data-select="datepicker"></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-5">
                                                                            <span class="simple-label"><span class="trans-text" data-langprop="loan_app_form.Emp Org">Employment Organization </span>&nbsp;<a id="_loanapp_lnkNewOrg" href="javascript:void(0)" class="off-when-readonly"><i class="fa fa-plus" style="color:green"></i></a> </span>
                                                                            <div><select id="_loanapp_emp_org"  data-ffield="Employer organization" data-field="emp_org_id" class="modal-select2 data-input person-data"></select></div>
                                                                    </div>

                                                                    <div class="form-group col-lg-4">
                                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Emp Position" >Position Title</span>
                                                                            <div><input  data-ffield="Position title" type="text" id="_loanapp_emp_position" data-field="emp_position" class="form-control data-input person-data"></div>
                                                                    </div>
                                                                   
                                                            </div>
                                            </div>
                            </div>
                    </div>

                    <div style="width:100%;margin-top:10px">
                        
                            <div id="_loanapp_income_view" class="card vs-card" style="display:none">
                                    <h4> <i class="fa fa-tasks"></i> INCOME INFORMATION</h4>
                                    <div id="_loanapp_income">
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
 
                           <div id="_loanapp_request_view" class="card vs-card" style="border:1.5px dotted orange !important">
                                        <div id="_loanapp_request">
                                                <h5 class="trans-text" data-langprop="loan_app_form.Loan Information">LOAN INFORMATION</h5>
                                                <div id="_loanapp_request_data" class="row">
                                                        <div class="form-group col-lg-3">
                                                                    <span class="simple-label trans-text" data-langprop="loan_app_form.Loan Type" >Loan Type</span>
                                                                        <div><select id="_loanapp_loan_type" data-required="1" data-type="positive" data-ffield="Loan type" data-field="loan_type_id" class="data-input modal-select2" placeholder="Select Loan type">
                                                                          
                                                                        </select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                <span class="simple-label"><span class="trans-text" data-langprop="loan_app_form.Loan Purpose"> Loan Purpose</span>  &nbsp;<a id="_loanapp_lnkNewPurpose" class="off-when-readonly" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a></span>
                                                                <div><select data-ffield="Purpose of loan" id="_loanapp_purpose" data-field="purpose_id" class="data-input modal-select2"></select></div>
                                                        </div>

                                                       <!-- <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Existing Loan</span>
                                                                        <div><select id="_loanapp_active_loan" data-field="loan_id" class="data-input modal-select2"></select></div>
                                                        </div> -->

                                                        <div class="form-group col-lg-3">
                                                            <input type="hidden" data-field ="currency_code" class="data-input" value="USD">           
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Principal USD">Principal</span>
                                                            <div><input type="number" data-ffield="principal" id="_loanapp_request_amount" data-field="principal" class="form-control data-input"></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Tenure" >Loan Tenure</span>
                                                                        <div class="input-group">
                                                                            <input type="number" data-ffield="Loan tenure" data-required="1" data-field="loan_tenure" class="form-control data-input">
                                                                            <select style="margin-left:3px;" class="form-control data-input" data-required="1" data-ffield="Period type" data-field="loan_tenure_unit" id="_loanapp_tenure_unit">
                                                                                <option value="days" class="trans-text" data-langprop="loan_app_form.days">days</option>
                                                                                <option value="weeks" class="trans-text" data-langprop="loan_app_form.weeks">weeks</option>
                                                                                <option value="months" class="trans-text" data-langprop="loan_app_form.months">months</option>
                                                                            </select>
                                                                        </div>
                                                        </div>
 
                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Interest Rate" >Interest Rate (%)</span>
                                                            <div class="input-group">
                                                                <input type="number" data-ffield="Interest Rate" data-field="period_interest_rate" class="form-control data-input">
                                                                <select style="margin-left:3px;" class="form-control data-input" data-ffield="Compound cycle" data-field="compound_cycle" id="_loanapp_compound_cycle">
                                                                   <option value="daily" class="trans-text" data-langprop="loan_app_form.daily">daily</option>
                                                                   <option value="weekly" class="trans-text" data-langprop="loan_app_form.weekly">weekly</option>
                                                                   <option value="monthly" class="trans-text" data-langprop="loan_app_form.monthly">monthly</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                      
                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Payback Option" >Repayment Option</span>
                                                            <div><select data-ffield="Payment option" id="_loanapp_payback_option" data-field="payback_method_id" class="data-input modal-select2"></select></div>
                                                        </div>

                                                        <!-- <div class="form-group col-lg-3">
                                                                        <span class="simple-label">Minimum installment</span>
                                                                        <div><input type="number" data-ffield="Minimum Installment" data-field="minimum_installment" class="form-control data-input"></div>
                                                        </div> -->
                                                        <div class="form-group col-lg-3">
                                                                        <span class="simple-label trans-text" data-langprop="loan_app_form.Start Date" >Start Date</span>
                                                                        <div><input type="text" data-ffield="Start Date" data-field="start_date" data-required="0" data-datatype="date" class="form-control data-input" data-select="datepicker"></div>
                                                        </div>
 
                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.First Pmt Date" >First Pmt Date</span>
                                                            <div><input type="text" data-ffield="First Payment Date" data-field="first_pmt_date" data-required="0" data-datatype="date" class="form-control data-input" data-select="datepicker"></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Credit Officer">Credit Officer</span>
                                                            <div><select id="_loanapp_credit_officer" data-ffield="Credit officer" data-field="credit_officer_id" class="modal-select2 data-input"></select></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label trans-text" data-langprop="loan_app_form.Remarks" >Remarks</span>
                                                            <div><input type="text" data-field="remarks" class="form-control data-input" placeholder="Remarks"></div>
                                                        </div>

                                                        <div class="form-group col-lg-3">
                                                            <span class="simple-label">&nbsp;</span>
                                                            <div class="form-inline"><div class="btn-group">
                                                                <button id="_loanapp_btnPrintPmtSched" class="btn btn-outline-success"><i class="fa fa-print"></i><span class="trans-text" data-langprop="loan_app_form.View Pmt Schedule"> Pmt Schedule</button>&nbsp;
                                                                <button id="_loanapp_btnPrintContract" class="btn btn-outline-primary"><i class="fa fa-print"></i><span class="trans-text" data-langprop="loan_app_form.View Contract"> Contract</button>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                         
                                                </div>         

                                        </div>
                           </div>

                   </div>

                   <div id="_loanapp_guarantors_view" class="card vs-card">
                        <div class="form-inline"><h5 class="trans-text" data-langprop="loan_app_form.Guarantor Information">GUARANTORS</h5>&nbsp;&nbsp;<a style="display:none" id="_loanapp_lnkAddGuarantor" class="vs-btn-round" style="margin-top:-5px;padding:0px" href="javascript:void(0)"><i class="fa fa-plus"></i></a></div>
                        <div class="row">
                            <div class="form-group col-md-3">
                                <input type="hidden" class="data-input" data-field="id" name="" id="_loanapp_gid"> 
                                <span class="simple-label trans-text" data-langprop="loan_app_form.Guarantor Name" >Guarantor Name</span>
                                <div><input type="text" data-ffield="Guarantor name" data-field="name" class="form-control data-input"></div>
                            </div>
                            <div class="form-group col-md-3">
                                <span class="simple-label trans-text" data-langprop="loan_app_form.Guarantor Address" >Guarantor Address</span>
                                <div><input type="text" data-ffield="Guarantor Address" data-field="address" class="form-control data-input"></div>
                            </div>
                            <div class="form-group col-md-3">
                                <span class="simple-label trans-text" data-langprop="loan_app_form.Guarantor Phone" >Guarantor Phone</span>
                                <div><input type="text" data-ffield="Guarantor phone number" data-field="phone_number" class="form-control data-input"></div>
                            </div>
                            <div class="form-group col-md-3">
                                <span class="simple-label trans-text" data-langprop="loan_app_form.Guarantor NID" >Guarantor NID</span>
                                <div><input type="text" data-ffield="Guarantor NID" data-field="national_id" class="form-control data-input"></div>
                            </div>
                        </div>           
                    </div>

                   <div id="_loanapp_collateral_view" class="card vs-card">
                                        <div class="form-inline"><h5 class="trans-text" data-langprop="loan_app_form.Collateral Information">COLLATERAL INFORMATION</h5>&nbsp;&nbsp;<a id="_loanapp_lnkAddCollateral" href="javascript:void(0)" class="vs-btn-round off-when-readonly" style="padding:0px;margin-top:-5px;"><i class="fa fa-plus"></i></a></div>
                                        <div>
                                                <table class="table" id="_loanapp_tblCols">
                                                    <thead>
                                                        <tr>
                                                            <th class="trans-text" data-langprop="collateral.Numero">No</th>
                                                            <th class="trans-text" data-langprop="collateral.Type">Type</th>
                                                            <th class="trans-text" data-langprop="collateral.Description">Description</th>
                                                            <th class="trans-text" data-langprop="collateral.Owner">Owner</th>
                                                            <th class="trans-text" data-langprop="collateral.Identification Number">Identification Number</th>
                                                            <th class="trans-text" data-langprop="collateral.Estimate Value">Estimate Value</th>
                                                            <th class="trans-text" data-langprop="collateral.Action">Action</th>
                                                        </tr> 
                                                    </thead>
                                                    <tbody id="_loanapp_tblCols_body"></tbody>  
                                                </table>

                                        </div>
                    </div>

                   <div id="_loanapp_documents_view" class="card vs-card">
                                   <div class="form-inline"><h5 class="trans-text" data-langprop="loan_app_form.Support Documents">SUPPORT DOCUMENTS</h5>&nbsp;&nbsp;<a id="_loanapp_lnkAddDoc" class="vs-btn-round off-when-readonly" style="margin-top:-5px;padding:0px" href="javascript:void(0)"><i class="fa fa-plus"></i></a></div>
                                        <div id="_loanapp_docs" style="width:50%">
                                            <table id="_loanapp_tblDocs" class="vs-docs-table fixed-body-table">
                                                <tbody style="max-height:350px" id="_loanapp_tblDocs_body">
                                                    <tr>
                                                        <td style="width:50px">1</td>
                                                        <td>Salary statment</td>
                                                        <td>
                                                            <div style="min-width:80px">
                                                            <a class="loanapp-btn-delete-doc" href="#"><i class="fa fa-times" style="color:red"></i></a>&nbsp;
                                                            <a class="loanapp-btn-download-doc" href="#"><i class="fa fa-download" style="color:green"></i></a>&nbsp;
                                                            <a class="loanapp-btn-open-doc" href="#"><i class="fas fa-file" style="color:grey"></i></a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody> 
                                            </table>         
                                    </div>
                    </div>
 
                   <div style="width:100%;position:fixed;bottom:15px;">
                            <div class="form-inline" style="float:left;margin-left:7vw">
                                <button id="_loanapp_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Close">Close</span></button>&nbsp;
                                <button id ="_loanapp_btnSave"  type="button" class="vs-btn-lg  vs-btn-primary off-when-readonly" style="min-width:100px"><i class="fa fa-save"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Save">Save</span></button>&nbsp;
                                <button id ="_loanapp_btnApprove" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Approve">Approve</span></button>
                                <button id ="_loanapp_btnDisburse" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Disburse">Disburse</span></button>
                                <button id ="_loanapp_btnApproveDisburse" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-check"></i>&nbsp;<span class="trans-text" data-langprop="buttons.Approve & Disburse">Approve & Disburse</span></button>
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


<!--begin::CollateralDialog -->
<div class="modal fade" id="dlgCollateral" tabindex="-1" role="dialog" aria-labelledby="dlgCollateralTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
      <img src="{{asset('/assets/images/icons/collateral.png')}}" style="width:38px;">&nbsp;<h5 class="modal-title trans-text" data-langprop="titles.New Collateral" id="dlgCollateralTitle">New Collateral</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        <div class="row" id="dlgCollateral_body">
                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="collateral.Collateral Type">Collateral Type</span> 
                            <div><select id="_coll_type" class="modal-select2 data-input" data-required="1" data-field="collateral_type_id"></select></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="collateral.Identification Number">Identification Number</span> 
                            <div><input class="form-control data-input" data-field="identification_number"></div>  
                        </div>    

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="collateral.Description">Description</span> 
                            <div><textarea class="form-control data-input" data-type="string" data-required="1" data-field="description"></textarea></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="collateral.Owner">Owner</span> 
                            <div><textarea class="form-control data-input" data-field="owner_name"></textarea></div>  
                        </div>
 
                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="collateral.Estimate Value">Estimate Value</span> 
                            <div><input type="number" class="form-control data-input" data-field="estimate_value" value="0"></div>  
                        </div>       

                        <div class="form-group col-lg-6" style="display:none">
                            <span class="simple-label trans-text" data-langprop="collateral.Expiration">Expiration Date</span> 
                            <div><input class="form-control data-input" data-field="expiration_date" data-select="datepicker"></div>  
                        </div>       

                        <div class="form-group col-lg-6">
                           <span class="simple-label">&nbsp;</span>  
                           <a style="display:none" href="#" class="vs-btn-round" id="_loanapp_lnkAddFile"> <i class="fa fa-file-plus"></i> <span data-langprop="buttons.Add File" class="trans-text">Add file</span></a>
                           <a style="display:none" href="#" class="vs-btn-round vs-btn-danger" id="_loanapp_lnkRemoveFile"> <i class="fa fa-file-times"></i> <span data-langprop="buttons.Remove File" class="trans-text">Remove file</span></a>
                           <input id="_loanapp_fileInput" type="file" style="display:none">  
                        </div>       

                        <div class="form-group col-lg-12">
                            <ul id="_loanapp_file_list" style="list-style:none;">
                                <li></li>
                            </ul>
                        </div>
                        <div>
                           <span style="margin-left:15px" id="dlgCollateralError" class="error_text"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                        <button type="button" class="btn btn-primary" id="dlgCollateral_btnOK"><i class="fa fa-check"></i><span class="trans-text" data-langprop="buttons.Add"></span></button>
                    </div>
        </div>
    </div>
  </div>
</div>
<!--end::CollateralDialog -->

<!--begin::NewFileDialog -->
<div class="modal fade" id="dlgAttach" tabindex="-1" role="dialog" aria-labelledby="dlgAttachTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
      <img src="{{asset('/assets/images/icons/file.png')}}" style="width:38px;">&nbsp;<h5 class="modal-title​ trans-text" data-langprop="titles.New Attachment" id="dlgAttachTitle">New File</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
        <div class="row" id="dlgCollateral_body">
                        <div class="form-group col-lg-12">
                            <span class="simple-label trans-text" data-langprop="loan_app_form.Description">Description</span> 
                            <div><input type="text" class="form-control" id="_attach_description"></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="loan_app_form.File Type">File Type</span> 
                            <div><input type="text" class="form-control" id="_attach_filetype" readOnly></div> 
                        </div>

                        <div class="form-group col-lg-6">
                            <span class="simple-label trans-text" data-langprop="loan_app_form.File Size MB">Size (MB)</span> 
                            <div><input type="text" class="form-control" id="_attach_filesize" readOnly></div> 
                        </div>

                        <div class="form-group col-lg-12">
                              <button type="button" class="btn btn-primary" id="dlgAttach_btnChooseFile"><span class="trans-text" data-langprop="buttons.Choose File">Choose File</span></button>
                              <input type="file" style="display:none" id="dlgAttach_fileInput" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                        </div>    
 
                        <div>
                           <span style="margin-left:15px" id="dlgCollateral_error" class="error_text"></span>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i> <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span></button>
                        <button type="button" class="btn btn-primary" id="dlgAttach_btnOK"><i class="fa fa-check"></i><span class="trans-text" data-langprop="buttons.Add"></span></button>
                    </div>
        </div>
    </div>
  </div>
</div>
<!--end::NewFileDialog -->