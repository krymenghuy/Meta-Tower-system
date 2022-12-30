 <div id="_main_payoffComponent" style="width:100%;display:none">
    <div class="border-style1" style="margin:35px;padding:15px;min-height:20vw;border-radius:7px">
         <div id="_payoff_loan_fields" class="row">

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
                                        <span class="loan-info-label">Phone Number</span>
                                        <span class="loan-info-value" data-field="phone_number"></span>
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
                                        <span class="loan-info-label">Loan number</span>
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
                                        <span class="loan-info-value" data-field="period_months"></span>
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
                                    
                                    <span class="loan-info-item"> 
                                        <span class="loan-info-label">Rem. Total</span>
                                        <span class="loan-info-value" data-field="outstanding_total">$0</span>
                                    </span>

                                    
                        </div>
             </div>
         </div>  
         <div class="alert alert-success">PAYOFF LOAN #90890</div> 
         <div id="_payoff_input_fields" class="row">

            <div class="form-group col-lg-3">
                 <span class="simple-label">Receipt Number</span>
                 <div><input type="text" class="form-control data-input" data-field="receipt_number" placeholder="Auto" readonly></div>
             </div> 

             <div class="form-group col-lg-3">
                 <span class="simple-label">Payment Date</span>
                 <div><input id="_payoff_pmt_date" type="text" class="form-control data-input" data-required="1" data-field="payment_date" data-select="datepicker"></div>
             </div> 
 
             <div class="form-group col-lg-3">
                 <span class="simple-label">Payment method</span>
                 <div><select id="payoff_pmt_method" data-required="1" data-field="pmt_method_id" class="modal-select2 data-input"></select></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Payment type</span>
                 <div><select id="payoff_pmt_type" class="modal-select2 data-input" data-field="pmt_type" data-required="1">
                     <option value="installment" selected>Installment</option> 
                 </select></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Interest rate(%)</span>
                 <div><input id="_payoff_monthly_rate" type="number" class="form-control data-input" data-field="monthly_interest_date" readonly value=0></div>
             </div>

             <div class="form-group col-lg-3">
                 <span class="simple-label">Amount</span>
                 <div><input id="_payoff_total" type="number" class="form-control data-input" data-required="1" data-field="amount" placeholder="Amount" value="0" readOnly></div>
             </div>
             
             <div class="form-group col-lg-3">
                 <span class="simple-label">principal</span>
                 <div><input id="_payoff_principal_amount" type="number" class="form-control data-input" data-field="principal_amount" data-required="1" placeholder="principal amount" readOnly></div>
             </div> 

             <div class="form-group col-lg-3">
                 <span class="simple-label">Interest (USD)</span>
                 <div><input id="_payoff_interest_amount" type="number" class="form-control data-input" data-required="0" data-field="interest_amount" placeholder="interest amount" readOnly></div>
             </div> 
             
             <div class="form-group col-lg-6">
                 <span class="simple-label">Discount(%)</span>
                 <div><input id="_payoff_discount_percent" type="number" class="form-control data-input" data-field="discount_percent" placeholder="discount percent" value="0"></div>
             </div>

             <div class="form-group col-lg-6">
                 <span class="simple-label">Amount (net)</span>
                 <div><input id="_payoff_total_net" type="number" class="form-control data-input" data-field="net_amount" value="0" readOnly></div>
             </div>

             <div class="form-group col-lg-6">
                 <span class="simple-label">Remarks</span>
                 <div><input type="text" class="form-control data-input" data-field="remarks" placeholder="remarks"></div>
             </div>

         </div>
    </div>

       <div style="width:100%;position:fixed;bottom:15px;">
                            <div class="form-inline" style="float:left;margin-left:13vw">
                                <button id="_payoff_btnClose" type="button" class="vs-btn-lg vs-btn-danger" style="min-width:100px"><i class="fa fa-times"></i> Close</button>&nbsp;
                                <button id ="_payoff_btnSave" type="button" class="vs-btn-lg  vs-btn-primary" style="min-width:100px"><i class="fa fa-save"></i> Save</button>&nbsp;
                                <button id ="_payoff_btnPrint" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-user-print"></i> Print</button>
                                <button id ="_payoff_btnSaveAndSendEmail" type="button" class="vs-btn-lg  vs-btn-success" style="min-width:100px"><i class="fa fa-send"></i> Save & Send</button>
                            </div>
      </div>

</div>
<script  src="{{ asset('js/PayoffComponent.js') }}"></script>
