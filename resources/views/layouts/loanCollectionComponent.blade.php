<style>    
  table#_tblPmts> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid #86DDF3; 
     font-size:0.8em;
  }
  .inline-label{
      display:inline-block;
      padding:3px;
      color:grey;
    }
    .pmt-loan-field{
        margin-right:20px;
    }
    #pmt_loan_fields .loan-info-value{
      color:#0D64AE;
    }
    .lc-pmt-date{
      width:100px;
      border-radius:3px;
      padding:3px;
      color:orange;
      text-align:'center'
    }

    .lc-amount{
      color:green;
      font-weight:bold;
      padding:3px;
      text-align:'center'
    }
</style>
<div id="_main_loanCollectionComponent" style="display:none;">
            <div class="d-flex justify-content-between" style="padding:15px;">
                <div class="d-flex col-md-6">
                  <button class="btn btn-sm btn-outline-success" id="_collect_back" style="min-width:80px;border-radius:20px"><i class="fa fa-angle-double-left"></i> Back</button>
                    <!-- <button class="vs-btn-md vs-btn-md-success" style="width:120px" id="_collect_btnNewPmt"><i class="fa fa-list-alt"></i> Receive Pmt</button>  -->
                    <div style="min-width:25vw"><select id="_collect_filter_loan" class="modal-select2"></select></div>
                    <input id="_collect_search" style="width:100vw;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search Loan">
                   <div> <a id="_collect_btnSearch" class="btn btn-sm btn-outline-success" href="javascript:void(0)"><i class="fas fa-sync-alt"></i></a></div>
                    &nbsp;<div><a id="_collect_btnFilter" class="btn btn-sm btn-outline-primary" href="javascript:void(0)"><i class="fas fa-list-alt"></i></a></div>
                </div>

                <div class="d-flex justify-content-end col-md-6">
                    <a href="javascript:void(0)" id="_collect_btnPDF" class="btn btn-sm btn-primary" style="border-radius:10px;"><i class="fa-solid fas fa-pdf"></i> PDF</a>&nbsp;
                    <a href="javascript:void(0)" id="_collect_btnExcel" class="btn btn-sm btn-success" style="border-radius:10px"><i class="fa-solid fas fa-file-excel"></i> Excel</a>&nbsp;
                    <!-- <a id="_collect_btnExcel" class="btn btn-sm btn-default" style="border-radius:10px" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a> -->
                </div>
            </div>
             <div style="width:100%;display:none">
               <div id="pmt_loan_fields" class="pmts-loan-details flat-box" style="display:flex;flex-direction:row; margin-left:25px;margin-right:25px;border:1.2px solid #3498DB; background:#EAFAF1">
                        
                        <div class="pmt-loan-field">
                          <span class="inline-label">Loan#</span>
                          <span class="loan-info-value"  data-field="loan_code"></span>
                        </div>

                        <div class="pmt-loan-field">
                          <span class="inline-label">Borrower</span>
                          <span class="loan-info-value" data-field="borrower_name"></span>
                        </div>

                        <div class="pmt-loan-field">
                          <span class="inline-label">ID</span>
                          <span class="loan-info-value"  data-field="student_code"></span>
                        </div>
                          
                        <div class="pmt-loan-field">
                          <span class="inline-label">First Pmt</span>
                          <span class="loan-info-value"  data-field="first_pmt_date"></span>
                        </div>
                        
                        <div class="pmt-loan-field">
                          <span class="inline-label">Principal</span>
                          <span class="loan-info-value"  data-field="principal"></span>
                        </div>   
                       
                        <div class="pmt-loan-field">
                          <span class="inline-label">Prin. Disc</span>
                          <span class="loan-info-value"  data-field="discount_principal">:0</span>
                        </div>

                        <div class="pmt-loan-field">
                          <span class="inline-label">Total Paid</span>
                          <span class="loan-info-value"  data-field="total_paid">:0</span>
                        </div>

                        <div class="pmt-loan-field">
                          <span class="inline-label">Rem. Principal</span>
                          <span class="loan-info-value"  data-field="outstanding_principal"></span>
                        </div>  

                        <!-- <div class="pmt-loan-field">
                          <span class="inline-label">Pmt. count</span>
                          <span class="loan-info-value"  data-field="pmt_count">0</span>
                        </div> -->
          
                        <div class="pmt-loan-field">
                            <button id="pmts_lnkNewPmt" type="button" class="btn btn-sm btn-primary" style="width:100px;margin-bottom:5px"><i class="fa fa-plus"></i> Payment</button>
                            <button id="pmts_lnkPayOff" type="button" class="btn btn-sm btn-success" style="width:100px"><i class="fa fa-plus"></i> Pay Off</button>
                        </div>
              </div>
             </div> 
            <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                <table class="table" id="_tblPmts" style="margin-top:-25px !important;"></table>
            </div>
</div>
<script  src="{{ asset('js/LoanCollectionComponent.js') }}"></script>