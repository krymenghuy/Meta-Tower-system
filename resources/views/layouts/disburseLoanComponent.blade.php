<style>
    #_main_disburseLoanComponent .alert{
       padding:5px;
       font-size:0.9em;
       font-weight:bold;
    }
</style>
<div id="_main_disburseLoanComponent" style="display:none;width:100%">
   <div style="margin:35px">
                <div class="alert alert-success">BORROWER`S INFORMATION</div> 
                <div id="_disburse_borrower_fields" class="flat-box" style="padding:15px;margin-top:-20px">
                        <div class="row">
                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">Borrower Name &nbsp; <a id="_disburse_lnkFindPerson" href="javascript:void()"> <i class="fa fa-search" style="color:green"></i> </a></span>
                                        <div>  <input type="text"  class="form-control data-input" data-field="name" data-required="1"></div> 
                                    </div>
                                    
                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">Academic Program</span>
                                        <div><select id="_disburse_program" class="modal-select2 data-input" data-field="program_id" data-required="1"></select></div> 
                                    </div>
                                    
                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">National ID</span>
                                        <div><input type="text" class="form-control data-input" data-field="n_id" data-required="1"></div> 
                                    </div>
                                    
                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">Occupation</span>
                                        <div><select id="_disburse_occupation" class="modal-select2 data-input" data-field="occupation_id" data-required="1"></select></div> 
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">Email</span>
                                        <div> <input type="text" class="form-control data-input" data-field="email" data-required="1"></div> 
                                    </div>

                                    <div class="form-group col-lg-3">
                                        <span class="simple-label">Phone number</span>
                                        <div>  <input type="text" class="form-control data-input" data-field="phone_number" data-required="1"></div> 
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <span class="simple-label">Address</span>
                                        <div>  <input type="text" class="form-control data-input" data-field="address" data-required="1"></div> 
                                    </div>
                    </div>
                
                </div>

   </div> 


   <div style="margin:35px">
            <div class="alert alert-warning">LOAN DETAILS</div> 
            <div id="_disburse_loan_fields" class="flat-box" style="padding:15px;margin-top:-20px">
                <div class="row">
                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Application Number</span>
                                    <div><input data-readonly="1" type="number" class="form-control data-input" data-field="loan_app_code" data-required="1"></div> 
                                </div>

                               <div class="form-group col-lg-3">
                                    <span class="simple-label">Loan Type</span>
                                    <div><select  data-readonly="1" id="_disburse_loan_type" class="modal-select2 data-input" data-field="loan_type_id" data-required="1"></select></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Full Tuition Fee</span>
                                    <div><input type="number" class="form-control data-input" data-field="item_full_price"></div> 
                                </div>
                                
                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Loan Percentage</span>
                                    <div><input type="number" class="form-control data-input" data-field="price_loan_percent"></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Principal</span>
                                    <div><input data-readonly="1" type="number" class="form-control data-input" data-field="principal" data-required="1"></div> 
                                </div>

                            <div class="form-group col-lg-3">
                                    <span class="simple-label">Monthly Interest (%)</span>
                                    <div><input  data-readonly="1" type="number" class="form-control data-input" data-field="monthly_interest_rate" data-required="1"></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Effective Date</span>
                                    <div>  <input type="text" data-select="datepicker" class="form-control data-input" data-field="effective_date" data-required="1"></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Period (months)</span>
                                    <div><input  data-readonly="1" type="number" class="form-control data-input" data-field="period_months" data-required="1"></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Maturity Date</span>
                                    <div><input type="text" data-select="datepicker" class="form-control data-input" data-field="maturity_date"></div> 
                                </div>
 
                                 <div class="form-group col-lg-3">
                                    <span class="simple-label">Repayment Option</span>
                                    <div><select  data-readonly="1" id="_disburse_payback_option" class="modal-select2 data-input" data-field="payback_method_id" data-required="1"></select></div> 
                                </div>

                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Loan Purpose</span>
                                    <div><select  data-readonly="1" id="_disburse_loan_purpose" class="modal-select2 data-input" data-field="purpose_id"></select></div> 
                                </div> 
             
                                <div class="form-group col-lg-3">
                                    <span class="simple-label">Remarks</span>
                                    <div><input type="number" class="form-control data-input" data-field="remarks"></div> 
                                </div> 
            
                </div>
            </div>

   </div>
   
        <div style="width:100%;position:fixed;bottom:20px;">
                            <div class="form-inline" style="float:left;margin-left:7vw">
                                <button id="_disburse_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id ="_disburse_btnSave" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-save"></i> Disburse Now</button>&nbsp; 
                            </div>
        <div>

</div>
<script async src="{{ asset('js/DisburseLoanComponent.js') }}"></script>