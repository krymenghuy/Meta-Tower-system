<div id="_mainRepaymentsComponent" style="display:none;">
    <div class="d-flex justify-content-between" style="padding:15px;">
        <div class="d-flex col-md-6">
          <button style="margin-right:10px;background:#d5e9f6;font-weight:bold;" class="btn btn-default" id="btnAddRepayment">+ Add Repayment</button>
          <input style="width:50%;margin-right:10px;" type="text" class="form-control" placeholder="Search repayment">
          <a style="padding:5px 10px 0 10px;border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fas fa-sync-alt"></i></a>
        </div>

        <div class="d-flex justify-content-end col-md-6">
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#e6ecff;margin-right:10px;" href="#"><i class="fa-solid fas fa-print"></i> Print</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ffe6e6;margin-right:10px;" href="#"><i class="fa-solid fas fa-file-pdf"></i> PDF</a>
          <a style="padding:5px; 10px 0 10px; border-radius:3px;background:#ccffcc;" href="#"><i class="fa-solid fas fa-file-pdf"></i> Excel</a>
        </div>
    </div>
    

    <div style="padding-left:15px;padding-right:15px;">
        <table class="table" id="_mainRepaymentsComponent_table"></table>
    </div>
</div>


  <!-- Modal -->
  <div class="modal fade" id="modalRepayment" tabindex="-1" role="dialog" aria-labelledby="modalRepayment_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
    
      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalRepayment_title">Add Repayment</h5>
          <button type="button" class="close" data-dismiss="modal"></button>
        </div>
        <div  class="modal-body">
            <div class="row">
                <div class="col-md-12 d-flex">
                <div style="width:100%">
                      <label for="">Loan Number</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div>  

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Borrower Number</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Amount</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 
                </div>
            </div>

            <div class="row" style="margin-top:10px;">
                <div class="col-md-12 d-flex">
                <div style="width:100%">
                      <label for="">Payment Method</label>
                      <select class="form-control">
                          <option value="">Cash</option>
                          <option value="">Bank Transfer</option>
                      </select>
                  </div>  

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Principle</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Interest</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 
                </div>
            </div>


            <div class="row" style="margin-top:10px;">
                <div class="col-md-12 d-flex">
                <div style="width:100%">
                      <label for="">Outstanding principle</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div>  

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Target Month</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 

                  <div style="width:100%;margin-left:15px;">
                      <label for="">Lateness Day</label>
                      <input type="text" data-field="name" data-required="1" class="form-control data-input">
                  </div> 
                </div>
            </div>



        </div>
        <div class="modal-footer">
          <span class="error_text" id="modalAddLoan_error"></span>
          <button type="button" style="background:#e6ecff;" class="btn btn-default" id="modalAddLoan_btnSave">SAVE</button>
        </div>
      </div>
      
    </div>
  </div>


<script  src="{{ asset('js/RepaymentsComponent.js') }}"></script>