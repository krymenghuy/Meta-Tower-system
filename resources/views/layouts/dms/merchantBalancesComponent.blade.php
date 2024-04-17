<style>
 
</style>

<div id="_mainMerchantBalancesCompoment" style="display:none;padding:15px">
  <div class="d-flex flex-row justify-content-between bg-white rounded-3 p-3 border">
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
         <div class="d-flex flex-column flex-wrap justify-content-between align-items-center">  
            <div class="d-flex align-items-start gap-5">
                <div class="d-flex gap-2">
                  <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Packages:"></span>
                  <span id="_mbl_package_count" class="fw-semibold package-count fs-5 text-nowrap">0 pcs</span>
                </div>

                <div class="d-flex gap-2">
                  <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Amount:"></span>
                  <span id="_mbl_merchant_amount" class="fw-semibold merchant-amount fs-5">0</span>
                  <span id="_mbl_merchant_currency" class="fw-semibold merchant-currency fs-6 mt-1">USD</span>
                </div>
            </div>
              <div class="line-3d w-100"></div> 
               <div id="_mbl_alert_list" class="d-flex flex-row align-items-between justify-content-between w-100 mt-1">
                   <div class="d-flex flex-row gap-2">
                      <span class="mbl-alert-title">Overdue AR</span><span class="prefix-colon mbl-alert-value">3</span>
                   </div>
                   <div class="d-flex flex-row gap-2">
                      <span class="mbl-alert-title">Overdue AP</span><span class="prefix-colon mbl-alert-value">1</span>
                   </div>      
               </div>
          </div>
        <div class="d-flex gap-2">
              <!-- <button id="_mbl_btnPrint" class="btn btn-sm btn-outline-success">
                <i class="fa fa-print fs-5"></i>
                <span>Print</span>
              </button> -->
             <div> 
                  <button id="_mbl_btnExportExcel" class="btn btn-sm btn-outline-danger rounded-5 bg-danger">
                     <i class="fa fa-file-excel fs-5 text-white"></i>
                     <span class="text-white">Export</span>
                  </button> 
            </div>
        </div>
  </div>
  <div id="div_merchant_balances" class="table-responsive bg-white rounded-3 p-3 shadow merchan-balance mt-3 table-responsive-hover"></div>
</div>