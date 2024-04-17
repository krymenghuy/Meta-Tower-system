<style>
  div#div_driver_balances.receivable {
    border: 1.2px solid green;
  }

  div#div_driver_balances.payable {
    border: 1.2px solid red;
  }

  #_mbl_tblBalances.payable th {
    color: red;
  }

  #_mbl_tblBalances.receivable th {
    color: green;
  }
  /* .overdue-card{
    display:flex;
    flex-direction: column;
    border-radius: 3px;
    border: 1.2px solid red;
  }
  .overdue-card .od-title{
     font-weight: bold;
     padding: 2px;
     display: block;
     color:orange;
  }
  .overdue-card .od-category{
     font-weight: bold;
     padding: 2px;
     display: block;
  } */
  .prefix-colon::before{
     content:': ';
  }
</style>

<div id="_mainDriverBalancesCompoment" style="display:none;padding:15px">
  <div class="d-flex justify-content-between bg-white rounded-3 p-3 border">
    <div class="d-flex gap-2 justify-content-start align-items-start flex-wrap">
      <button id="_dbl_btnToggleView" class="btn btn-primary" data-toolip="true" data-title="View by date" data-placement="top">
        <span><i class="la la-user"></i> </span>
      </button> 
      <div class="">
        <input style="display:none" type="text" class="form-control" id="_dbl_search_driver" placeholder="Search">  
      </div>
      <div style="min-width:200px">
        <select class="modal-select2" id="_dbl_filter_driver"></select>
      </div>
      <div>
        <input type="text" class="form-control" id="_dbl_filter_startdate" data-select="datepicker">
      </div>
      <div>
        <input type="text" class="form-control" id="_dbl_filter_enddate" data-select="datepicker">
      </div>
    </div>
  </div>

  <div id="_dbl_div_summary" class="d-flex flex-wrap justify-content-between bg-white rounded-3 p-3 border gap-3 mt-1">
        <div class="d-flex align-items-start gap-5">
            <div class="d-flex flex-column flex-wrap justify-content-start">
               <div class="d-flex flex-row gap-5 align-items-start">
                  <div class="d-flex gap-2">
                      <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Package count:"></span>
                      <span id="_dbl_package_count" class="fw-semibold package-count fs-5">0 pcs</span>
                  </div>

                   <div class="d-flex gap-2">
                      <span class="fw-semibold trans-text fs-5 text-muted" data-langprop="titles.Amount:"></span>
                      <span id="_dbl_driver_amount" class="fw-semibold driver-amount fs-5">0</span>
                      <span id="_dbl_driver_currency" class="fw-semibold driver-currency fs-5">USD</span>
                   </div>
               </div>
               <div class="line-3d"></div>
               
               <div id="_dbl_alert_list" class="d-flex flex-row gap-5 align-items-between justify-content-between">
                   <div class="d-flex flex-row gap-2">
                      <span class="dbl-alert-title">Overdue (4h-24h)</span><span class="prefix-colon dbl-alert-value">3</span>
                   </div>
                   <div class="d-flex flex-row gap-2">
                      <span class="dbl-alert-title">Overdue (over 24h)</span><span class="prefix-colon dbl-alert-value">1</span>
                   </div>      
               </div>

            </div>
      
        </div>
        
        <div style="visibility:hidden" class="d-flex flex-column align-items-center justify-content-center flex-wrap">
            <div class="d-flex gap-2">
              <button id="_dbl_btnPrint" class="btn btn-sm btn-outline-success">
                  <i class="fa fa-print fs-5"></i>
                  <span>Print</span>
              </button>
              <button id="_dbl_btnExportExcel" class="btn btn-sm btn-outline-primary">
                  <i class="fa fa-file-excel fs-5"></i>
                  <span>Export to Excel</span>
              </button>
            </div>
        </div>
  </div>

  <div class=" bg-white rounded-3 p-3 shadow mt-3">
      <div id="div_driver_balances" class="table-responsive table-responsive-hover"></div>
  </div>
</div>

<div class="modal fade" id="_pmt_dlgPmt" tabindex="-1" role="dialog" aria-labelledby="_pmt_dlgPmtTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
         <h4 class="modal-title fw-semibold">Receive Payment</h4>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="div-pmt-info d-flex flex-column border-bottom w-100">
            <div class="d-flex flex-row justify-content-between flex-row align-items-center gap-3 p-2" style="background-color:#F9F9F7">
               <div class="d-flex flex-row gap-2">
                  <span class="fw-semibold fs-5 text-muted text-right agent-label" style="width:120px">Payer Name: </span> 
                    <span class="fw-semibold fs-5 text-left agent-name" data-field="agent_name">Chamroun</span>
               </div>

               <div class="d-flex flex-row gap-2">
                  <span class="fw-semibold fs-5 text-muted text-right extra-field-label" style="width:180px">Package count: </span> 
                    <span class="fw-semibold fs-5 text-left extra-field-text" data-field="agent_name">102 pcs</span>
               </div>
            </div>
            <div class="div-pmt-amount d-flex flex-row p-2 justify-content-between mt-1" style="background-color:#F3F7F3">
                <div class="d-flex justify-content-start flex-row align-items-center gap-3 p-2"> 
                   <span class="fw-semibold fs-5 text-muted text-right" style="width:120px">Amount: </span> 
                   <span class="fw-semibold fs-5 text-left"><span class="amount" data-field="amount">0</span class="fw-semibold">&nbsp;<small class="currency">USD</small></span>
                </div>
                <span class="mt-2 pmt-total-paid fw-semibold fs-6"></span>
                <span class="mt-2 fw-semibold"><span class="exchange-rate-text">Exchange rate:</span><span class="exchange-rate"></span></span>
            </div>
        </div>
        <hr>
        <div id="pmt-inputs" class="d-flex flex-column mt-2">
          <div id="primary_methods" class="d-flex flex-column w-100">
          </div> 

            <div id="pmt_method_check" class="d-flex align-items-center gap-2 mt-3">  
            </div>

            <div class="w-100 mt-2">
               <span class="d-block fw-semibold border-bottom border-secondary w-100 pb-3 pt-3 text-primary">OTHER METHODS<a class="ml-3 border border-success rounded-4 p-1 text-success" href="javascript:void(0)" id="_pmt_dlgPmt_lnkAddMethod">Add</a></span>
               <div class="pmt-other-methods d-flex flex-column mt-1">
               </div>
            </div>

            <div class="d-flex flex-column w-100 mt-3">
               <label class="form-label control-label">Remarks</label>
               <input type="text" class="form-control remarks" data-field="remarks">
            </div>
        </div>
     
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-default height trans-text" data-langprop="buttons.Cancel" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary height" id="_pmt_dlgPmt_btnOK"><span class="trans-text" data-langprop="buttons.OK"></span></button>
      </div>
    </div>
  </div>
</div>