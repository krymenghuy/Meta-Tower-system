<style>
   .loan-info-item{
       display:block;
       padding:3px;
       margin-bottom:3px;
   }
   .loan-info-label{
       width:120px;
       color:#B6BDBD;
       display:inline-block;
       text-align:right;
       font-size:1em;
       padding:3px;
   }
   .loan-info-value{
       color:#7ACDE3;
       display:inline-block;
       padding:3px;
   }
   .loan-info-value::before{
       content:': ';
   }
   #_pmt_fields .simple-label{
       text-transform:uppercase;
       font-size:0.8em;
   }
 .card-loan-info{
    padding:10px;
    border-radius:20px;
    border:1px solid #3BE5E3;
 }

</style>
<div id="_main_receivePmtComponent" style="width:100%;display:none">
    <div class="border-style1" style="margin:35px;padding:15px;min-height:20vw;border-radius:7px">
         <div id="_pmt_loan_fields" class="row">

         <div class="form-group col-md-4">
                        <div class="card-loan-info">
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Borrower name</span>
                                        <span class="loan-info-value" data-field="borrower_name"> SDSFSFSF</span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Occupation</span>
                                        <span class="loan-info-value" data-field="occupation">Financial Manager</span>
                                    </span>
                                
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Sex</span>
                                        <span class="loan-info-value" data-field="sex">Male</span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Email</span>
                                        <span class="loan-info-value" data-field="email"></span>
                                    </span>
                        </div>
             </div>
             
             <div class="form-group col-md-4">
                       <div class="card-loan-info">
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Loan Number</span>
                                        <span class="loan-info-value" data-field="loan_code">006456</span>
                                    </span>
                                     
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Type</span>
                                        <span class="loan-info-value" data-field="loan_type"></span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">First Pmt Date</span>
                                        <span class="loan-info-value" data-field="first_pmt_date"></span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Period</span>
                                        <span class="loan-info-value" data-field="period_months">12 months</span>
                                    </span>
                                 
                        </div>
             </div>
  
             <div class="form-group col-md-4">
                       <div class="card-loan-info">
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Principal</span>
                                        <span class="loan-info-value" data-field="principal">$350</span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Monthly Rate(%)</span>
                                        <span class="loan-info-value" data-field="monthly_interest_rate">0%</span>
                                    </span>

                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Total Paid</span>
                                        <span class="loan-info-value" data-field="total_paid">$0</span>
                                    </span>
                                    
                                    <!-- <span class="loan-info-item"> 
                                        <span class="loan-info-label">Other due</span>
                                        <span class="loan-info-value" data-field="other_due">$0</span>
                                    </span> -->
                                    
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Rem. Total</span>
                                        <span class="loan-info-value" data-field="outstanding_total">$0</span>
                                    </span>

                                    
                        </div>
             </div>
         </div>  
         <div id="_pmt_input_fields" class="row">
            <div class="form-group col-lg-3">
                 <span class="simple-label">Receipt Number</span>
                 <div><input type="text" class="form-control data-input" data-field="receipt_number" placeholder="Auto" readonly></div>
             </div> 

             <div class="form-group col-lg-3">
                 <span class="simple-label">Payment Date</span>
                 <div><input id="_pmt_pmt_date" type="text" class="form-control data-input" data-required="1" data-field="payment_date" data-select="datepicker"></div>
             </div> 

            <div class="form-group col-lg-3">
                 <span class="simple-label">Payment method</span>
                 <div><select id="_pmt_pmt_method" data-required="1" data-field="pmt_method_id" class="modal-select2 data-input"></select></div>
             </div>
 
             <div class="form-group col-lg-3">
                 <span class="simple-label">Payment type</span>
                 <div><select id="_pmt_pmt_type" class="modal-select2 data-input" data-field="pmt_type" data-required="1">
                     <option value="installment">Installment</option> 
                     <option value="adjustment">Adjustment</option>
                 </select></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Interest rate(%) &nbsp;<a id="_pmt_lnlChangeInterest" href="javascript:void(0)"><i class="fa fa-edit" style="color:green"></i></a></span>
                 <div><input id="_pmt_interest_rate" type="number" class="form-control data-input" data-field="monthly_interest_date" readonly value=0></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Last pmt date</span>
                 <div><input id="_pmt_last_pmt_date" class="form-control data-input" data-field="os_interest_date" readonly readOnly></div>
             </div>
 
             <div class="form-group col-lg-3">
                 <span class="simple-label">Min. Installment</span>
                 <div><input id="_pmt_min_installment" type="number" class="form-control data-input" data-field="minimum_installment" placeholder="minimum amount" readonly></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Amount</span>
                 <div><input id="_pmt_amount" type="number" class="form-control data-input" data-required="1" data-field="amount" placeholder="Amount"></div>
             </div>
             
             <div class="form-group col-lg-3">
                 <span class="simple-label">principal</span>
                 <div><input id="_pmt_principal_amt" type="number" class="form-control data-input" data-field="principal_amount" data-required="1" placeholder="principal amount"></div>
             </div> 

             <div class="form-group col-lg-3">
                 <span class="simple-label">Interest (USD)</span>
                 <div><input id="_pmt_interest_amt" type="number" class="form-control data-input" data-required="0" data-field="interest_amount" placeholder="interest amount"></div>
             </div> 

             <div class="form-group col-lg-3">
                 <span class="simple-label">Penalty (USD)</span>
                 <div><input id="_pmt_penalty" type="number" class="form-control data-input" data-required="0" data-field="penalty_fee" placeholder="Penalty fee"></div>
             </div> 
 
             <div class="form-group col-lg-6">
                 <span class="simple-label">Remarks</span>
                 <div><input type="text" class="form-control data-input" data-field="remarks" placeholder="remarks"></div>
             </div>

         </div>
    </div>

       <div style="width:100%;position:fixed;bottom:15px;">
                        <div class="form-inline" style="float:left;margin-left:7vw">
                                <button id="_pmt_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id ="_pmt_btnSave" type="button" class="vs-btn-lg  vs-btn-primary" style="min-width:100px"><i class="fa fa-save"></i> Save</button>&nbsp;
                                <button id ="_pmt_btnPrint" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-print"></i> Print</button>
                                <button id ="_pmt_btnSaveAndSendEmail" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-send"></i> Save & Send</button>
                        </div>
      </div>

</div>

<!--begin::ChangeInterestDialog-->
<div class="modal fade" id="_loan_dlgChangeInterest" tabindex="-1" role="dialog" aria-labelledby="_loan_dlgChangeInterestTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_loan_dlgChangeInterestTitle">Interest Rate and Date</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
          <div class="form-group">
            <span class="simple-label">Monthly Interest rate (%)</span>
            <input id="_loan_m_interest" type="number" class="form-control">
          </div>
          <div class="form-group">
            <span class="simple-label">Last payment date</span>
            <input id="_loan_last_pmt_date"  class="form-control" data-select="datepicker">
          </div>

        <div>
          <span id="_loan_dlgChangeInterest_error" class="error_text"></span>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" id="_loan_dlgChangeInterest_btnSave">Save</button>
      </div>
    </div>
  </div>
</div>
<!--end::ChangeInterestDialog -->

<script  src="{{ asset('js/ReceivePaymentComponent.js') }}"></script>
