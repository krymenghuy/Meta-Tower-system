<style>    
  table#_tblLoanList> thead th{
     font-weight:normal;
     text-transform:uppercase;
     border-bottom:1px solid orange;
     font-size:0.8em; 
  }
  .loanlist-borrower-name{
     display:block;
     padding:3px;
     color:#0DC39B;
     font-size:1.1em;
  }
  .loanlist-studentcode{
     display:block;
     color:#F3B62A;
     font-size:1em;
  }
  .loanlist-studentcode::before{
    content:'(';
  }
  .loanlist-studentcode::after{
    content:')';
  }
  .loanlist-loancode{
    display:block;
    font-weight:bold;
    font-size:1.2em;
    padding:3px;
  }
  /* .dropdown-menu{  
    position: absolute; transform: translate3d(0px, -300px, 0px); top: 0px; left: 0px;
    will-change: transform;
  } */

</style>
<div id="_main_loanListComponent" style="display:none;">
            <div class="d-flex justify-content-between" style="padding:15px;">
                <div class="d-flex col-md-6">
                    <button style="display:none" class="vs-btn-md vs-btn-md-primary" id="_loanlist_btnNewLoan"><i class="fa fa-list-alt"></i> New Loan</button>
                    <input id="_loanlist_search" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search Loan">
                    <a id="_loanlist_btnSearch" class="btn btn-sm btn-outline-success" href="javascript:void(0)"><i class="fas fa-sync-alt"></i></a>
                </div>

                <div class="d-flex justify-content-end col-md-6">
                    <!-- <a id="_loanlist_btnPrint" class="btn btn-sm btn-primary" style="border-radius:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>&nbsp; -->
                    <a href="javascript:void(0)" id="_loanlist_btnPDF" class="btn btn-sm btn-default"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>&nbsp;
                    <a id="_loanlist_btnExcel" class="btn btn-sm btn-primary"  href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a>
                </div>
            </div>
            
            <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
                <table class="table" id="_tblLoanList" style="margin-top:-25px !important;"></table>
            </div>
</div>

<!--begin::discountPrincipalDialog -->
<div class="modal fade" id="_dlgDiscountPrincipal" tabindex="-1" role="dialog" aria-labelledby="_dlgDiscountPrincipal_title" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dlgDiscountPrincipal_title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        </button>
      </div>
      <div class="modal-body">
          <div class="form-group">
            <span class="simple-label">Amount</span>
            <div><input type="number" class="form-control" id="_dp_amount"></div>

            <span class="simple-label">Remarks</span>
            <div><input type="text" class="form-control" id="_dp_remarks"></div>
          </div>
           <div>
              <span id="_inputbox1_error" class="error_text"></span>
           </div>
      </div>
      <div class="modal-footer">
        <span class="error_text" id="_dlgDiscountPrincipal_error"></span>
        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_dlgDiscountPrincipal_btnOK">Save</button>
      </div>
    </div>
  </div>
</div>
<!--end::discountPrincipalDialog -->


<script  src="{{ asset('js/LoanListComponent.js') }}"></script>