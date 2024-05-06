<style>
table.comm-pmt-table th{
    text-transform: uppercase;
    font-size: 0.9em !important;
    color:#6C695E !important;
}
</style>

<div id="_main_commissionPaymentsComponent" class="m-3" style="display:none;">
    <div class="d-flex flex-column">
        <div class="mt-3">
            <div class="tab-view" id="_comm_tabview">
                    <div class="tab-header gap-1 mb-3 set-parent-active">
                        <a href="javascript:void(0)" class="tab-button active" data-viewname="summary" data-target="_commpmt_panel_summary">
                            <span class="p-2 border rounded-3 bg-white">SUMMARY</span>
                        </a>
                        <a href="javascript:void(0)" class="tab-button" data-viewname="payments" data-target="_commpmt_panel_payments">
                            <span class="p-2 border rounded-3 bg-white">PAYMENTS</span>
                        </a>
                        <a style="display:none" href="javascript:void(0)" class="tab-button" data-viewname="reports" data-target="_comm_panel_reports">
                            <span class="p-2 border rounded-3 bg-white">REPORTS</span>
                        </a>
                    </div>
                    <div class="tab-body shadow rounded-3 p-2 bg-white mt-2">
                        <div class="tab-panel tab-content-summary" id="_commpmt_panel_summary"  data-viewname="summary">
                            <div class="w-100 d-flex flex-column">
                                    <div class="row summary-header p-1 pb-2">
                                        <div class="col-xs-12 col-lg-3 p-1" style="display:none">
                                                <select class="modal-select2 .filter-field" id="_cmms_filter_summary_type">
                                                    <option value="all">Closed & Real-time</option>
                                                    <option value="closed">Closed Summary</option>
                                                    <option value="real-time">Real-time Summary</option>
                                                </select> 
                                            </div>
                                            <div class="col-xs-12 col-lg-3">
                                                <label for="" class="form-label">Agent name</label> 
                                                <select class="modal-select2 .filter-field" id="_cmms_filter_agent"></select> 
                                            </div>
                                            <div class="col-xs-12 col-lg-3">
                                                <label for="" class="form-label">From Month</label> 
                                                <div>
                                                    <select class="modal-select2" id="_cmms_filter_start_month"></select>
                                                </div>
                                            </div>

                                            <div class="col-xs-12 col-lg-3">
                                                <label for="" class="form-label">To Month</label> 
                                                <div>
                                                    <select class="modal-select2" id="_cmms_filter_end_month"></select>
                                                </div>
                                            </div>
                                  </div>
                                <span id="_filter_info_text" class="text-danger ml-2" style="display:none"><small>Showing closed commissions only. Choose an agent to view closed and real-time commissions </small></span> 
                                <div class="summary-list" id="comm_summary_list"></div> 
                            </div>
                        </div>

                        <div class="tab-panel tab-content-payments" id="_commpmt_panel_payments"   data-viewname="payments">
                            <div class="w-100 d-flex flex-column">
  
                                <div class="row payments-header p-1">
                                            <div class="col-lg-3">
                                                <label for="" class="form-label">Agent name</label> 
                                                <select class="modal-select2 .filter-field" id="_cpmt_filter_agent"></select> 
                                            </div>
                                            <div class="col-lg-3">
                                                <label for="" class="form-label">From Date</label> 
                                                <div>
                                                <input class="form-control" id="_cpmt_filter_start_date" data-select="datepicker" />
                                                </div>
                                            </div>

                                            <div class="col-lg-3">
                                                <label for="" class="form-label">To Date</label> 
                                                <div>
                                                    <input class="form-control" id="_cpmt_filter_end_date" data-select="datepicker" />
                                                </div>
                                            </div>

                                  </div>

                                <div class="payments-list" id="comm_payments_list"></div> 
                            </div>
                       </div>
                        
                       <div class="tab-panel tab-content-reports" id="_comm_panel_reports" data-viewname="report">
                            <div class="w-100 d-flex flex-column">
                                <div class="reports-header"></div>
                                <div class="reports-list" id="comm_reports_list"></div> 
                            </div>
                       </div>

                    </div>
            </div>
        </div>
    </div>
</div>


<div class="modal fade" id="_cpmt_dlgPay" tabindex="-1" role="dialog" aria-labelledby="_cpmt_dlgPay_title" aria-hidden="true">
    <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="_cpmt_dlgPay_title">Commission Payment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="readonly-fields d-flex flex-row flex-wrap justify-content-between gap-3">
                    <div class="">
                         <div class="d-flex gap-2"><span class="fs-5 fw-semibold trans-text" data-langprop="titles.Pay To:"></span> <span class="fs-5 fw-semibold label-text" data-field="agent_name">Som Sotheara</span></div>
                    </div>
                    <div class="">
                         <div class="d-flex gap-2"><span class="fs-5 fw-semibold trans-text"  data-langprop="titles.Total:"> </span> <span class="fs-5 fw-semibold label-text" data-field="amount">$250</span> <span class="mt-1">USD</span></div>
                    </div>
                    <div class="">
                         <div class="d-flex gap-2"><span class="fs-5 fw-semibold trans-text" data-langprop="titles.Month:"> </span> <span class="fs-5 fw-semibold label-text" data-field="month">Mar 2024</span></div>
                    </div>
                </div>

                <div class="input-fields row">
                    <div class="form-group col-md-6">
                        <label for="" class="col-form-label">Amount</label>
                      <div>  <input type="number" class="form-control data-input" data-field="amount"></div>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="" class="col-form-label">Payment Method</label>
                       <div> <select id="" class="modal-select2 data-input pmt_method" data-field="pmt_method"></select></div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="form-group col-md-12">
                        <label class="col-form-label">Remarks</label>
                       <div>
                          <input type="text" class="form-control data-input" data-field="remarks">
                       </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <span class="error_text" id="_pl_ps_error"></span>
                <button type="button" class="btn btn-secondary height" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary height" id="_cpmt_dlgPay_btnSave"><span class="trans-text" data-langprop="buttons.Pay Now"></span</button>
            </div>
        </div>
    </div>
</div>
