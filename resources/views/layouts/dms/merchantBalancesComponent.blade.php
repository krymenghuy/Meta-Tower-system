<style>
  div#div_merchant_balances.receivable {
    border: 1.2px solid green;
  }

  div#div_merchant_balances.payable {
    border: 1.2px solid red;
  }

  #_mbl_tblBalances.payable th {
    color: red;
  }

  #_mbl_tblBalances.receivable th {
    color: green;
  }
</style>

<div id="_mainMerchantBalancesCompoment" style="display:none;padding:15px">
  <div class="d-flex justify-content-between bg-white rounded-3 p-3 border">
    <div class="d-flex gap-2">
      <button id="_mbl_btnToggleView" class="btn btn-primary" data-toolip="true" data-title="View by date" data-placement="top">
        <span><i class="la la-user"></i> </span>
      </button> 
      <div class="min-width-select">
        <select class="modal-select2" id="_mbl_filter_type">
          <option value="payable">វេចេញ (Payables)</option>
          <option value="receivable">ទទួល (Receivables)</option>
        </select>
      </div>
      <div class="min-width-select">
        <select class="modal-select2" id="_mbl_filter_sender"></select>
      </div>
      <div>
        <input type="text" class="form-control" id="_mbl_filter_startdate" data-select="datepicker">
      </div>
      <div>
        <input type="text" class="form-control" id="_mbl_filter_enddate" data-select="datepicker">
      </div>
    </div>
  </div>
  <div id="_mbl_div_summary" class="d-flex justify-content-between bg-white rounded-3 p-3 border gap-3 mt-1">
        <div class="d-flex align-items-start gap-5">
            <div class="d-flex gap-2">
              <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Package count:"></span>
              <span id="_mbl_package_count" class="fw-semibold package-count fs-5">0 pcs</span>
            </div>

            <div class="d-flex gap-2">
              <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Amount:"></span>
              <span id="_mbl_merchant_amount" class="fw-semibold merchant-amount fs-5">0</span>
              <span id="_mbl_merchant_currency" class="fw-semibold merchant-currency fs-5">USD</span>
            </div>
        </div>
        
        <div class="d-flex gap-2">
            <!-- <button id="_mbl_btnPrint" class="btn btn-sm btn-outline-success">
              <i class="fa fa-print fs-5"></i>
              <span>Print</span>
           </button> -->
          <button id="_mbl_btnExportExcel" class="btn btn-sm btn-outline-primary">
              <i class="fa fa-file-excel fs-5"></i>
              <span>Export to Excel</span>
          </button>
        </div>
  </div>
  <div id="div_merchant_balances" class="table-responsive bg-white rounded-3 p-3 shadow merchan-balance mt-3 table-responsive-hover"></div>
</div>