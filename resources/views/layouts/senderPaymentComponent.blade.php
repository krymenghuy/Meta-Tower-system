<style>
   .billing-balance-due{
     display:inline-block;
     color:orange;
     font-size:1.2em;
     font-weight:bold;
     padding:5px;
   }
  span.dms-sender_not_confirmed{
     content:'Unconfirmed';  
     display:block;
     color:orange;
     padding:3px;
     font-size:0.7em;
  }
  span.dms-sender_not_confirmed:before{
    content:'Unconfirmed';
  }
  span.dms-sender_confirmed{
     display:block;
     color:green;
     padding:3px;
     font-size:0.7em;
  }
  span.dms-sender_confirmed:before{
    content:'Confirmed';
  }
  .trx-img{
    max-width:80px;
    max-height:80px;
    border:1px solid grey;
  }
  table#_spmt_tblItems>thead th, table#_spmt_tblPmts>thead th{
     text-transform:uppercase;
     font-size:0.8em;
     color:#BEC7C9;
  }
  div.bl-report_filter_panel{
    border-radius:3px;
    border:1.1px solid #E1E5E5;
    padding:10px;
  }
  table#_spmt_tblItems>.col-input{
     min-width:100px;
   }
   a#_spmt_trx_delete_attachment{
     color:red;
   }
</style>
<div id="_main_senderPmtComponent" style="display:none;padding:5px">    
            <div id="_spmt_content" style="width:100%;padding:10px;margin-top:-10px">
                 <div class="tab-view" id="_spmt_senderTabView">
                          <div class="tab-header">
                            <a href="javascript:;" class="tab-button active" data-viewname="spmt_deliveries" data-target="_spmt_panel_deliveries">DELIVERIES</a>
                            <a href="javascript:;" class="tab-button" data-viewname="spmt_payments" data-target="_spmt_panel_payments">TRANSACTIONS</a>
                            <a href="javascript:;" class="tab-button" data-viewname="spmt_reports" data-target="_spmt_panel_reports">REPORTS</a> 
                          </div><!--end::tab-header-->
                          
                          <div class="tab-body">
                              <div class="tab-panel" id="_spmt_panel_deliveries" style="height:520px;padding:10px" data-viewname="spmt_deliveries">
                                  <div class="row">
                                     <div class="col-lg-6">
                                        <div class="form-inline" id="_spmt_filter_panel" style="float:left;margin-right:15px">
                                            <select class="select2" id="_spmt_filter_deliveries_warehouse" data-placeholder="Choose Warehouse"></select>&nbsp;
                                            <select class="select2" id="_spmt_filter_deliveries_sender" data-placeholder="Choose Merchant"></select>&nbsp; 
                                            <button role="button" id="_spmt_btnToggleFilter" class="btn btn-outline-primary"><i class="fas fa-list-alt"></i></button>
                                        </div>
                                     </div>
                                     <div class="col-lg-6">
                                            <div class="form-inline" style="float:right">
                                                  <input type="text" id="_spmt_search" class="form-control" placeholder="Search package" autocomplete="false"> &nbsp;
                                                  <button type="button" id="_spmt_btnSearch" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
                                            </div>
                                     </div>
                                  </div>
                                  <div class="row">
                                      <div class="col-lg-12">
                                      <div class="form-inline" style="float:left;">
                                              <a id="_spmt_btnSelectAll" role="button" href="javascript:;" class="btn btn-sm btn-outline-success"><i class="fa fa-check"></i> All</a>
                                                &nbsp;
                                              <div class="form-inline">
                                                  <a style="display:none" id="_spmt_btnPay" role="button" href="javascript:;" class="btn btn-sm btn-success">Pay Vendor</a>
                                                  &nbsp;
                                                  <a style="display:none" id="_spmt_btnReceivePmt" role="button" href="javascript:;" class="btn btn-sm btn-success">Receive Pmt</a>
                                                  &nbsp;
                                                  <a style="display:none" id="_spmt_btnSettleZero" role="button" href="javascript:;" class="btn btn-sm btn-success">Settle</a>
                                              </div>

                                              <div style="width:20px"></div>
                                              <div class="form-inline">
                                                 <span id="_spmt_balance_due" class="billing-balance-due">$0</span>
                                              </div>
                                          </div> 
                                      </div>
                                  </div>  
                                  <div class="row">
                                     <div class="col-lg-12">
                                          <table id="_spmt_tblItems" class="table"></table>   
                                     </div>
                                   </div>  
                              </div>
                          
                              <div class="tab-panel" id="_spmt_panel_payments" style="height:520px;padding:10px" data-viewname="spmt_payments">
                                   <div class="row">
                                          <div class="col-lg-12">
                                              <div class="form-inline" id="_spmt_filter_panel">
                                                    <div><select class="select2 spmt_filter_field" id="_spmt_filter_pmt_sender"></select></div>
                                                    &nbsp;
                                                    <div><input id="_spmt_filter_pmt_startdate" class="form-control spmt_filter_field" data-select="datepicker"></div>
                                                    &nbsp;
                                                    <div><input id="_spmt_filter_pmt_enddate" class="form-control spmt_filter_field" data-select="datepicker"></div>
                                              </div>
                    
                                          </div>
                                   </div>
                                   <div class="row">
                                      <input type="file" id="_spmt_fileChooser" style="display:none">
                                      <div class="col-lg-12">
                                         <table id="_spmt_tblPmts" class="table table-stripped"></table>
                                      </div>
                                   </div>
                                   
                              </div>
                                
                              <div class="tab-panel flat-box" id="_spmt_panel_reports" style="height:520px;padding:10px" data-viewname="spmt_reports">  
                                  <span class="bl-section-title">MERCHANT REPORTS</span>
                                  <div class="div-line" style="border-color:#E7ECEC; width:30%"></div>
                                  <div class="row">
                                     <div class="col-lg-6">
                                        <ul class="bl-report-list" id="_spmt_report_list">
                                              <li>
                                                 <a data-rptname="vd_deliveries" class="report-item" href="javascript:;">Delivered Packages Report</a>   
                                              </li>
                                            <li><a data-rptname="vd_summarized_deliveries" class="report-item" href="javascript:;">Summarized Deliveries Report</a></li>
                                            <li><a data-rptname="vd_transactions" class="report-item" href="javascript:;">Transactions Report</a></li>
                                            <!-- <li><a data-rptname="sr_received_pmts" class="report-item" href="javascript:;">Payment From Merchants</a></li> -->                     
                                        </ul>
                                     </div>
                                     <div class="col-lg-6">
                                        <div class="bl-report_filter_panel" style="padding:15px;">
                                            <div style="width:100%">
                                                  <div>
                                                      <span class="simple-label">Report on merchant</span>
                                                      <select class="select2" id="_spmt_rptfilter_sender" data-placeholder="Choose driver"></select>
                                                  </div> 
                                            </div> 
                                            <div class="form-inline">
                                                  <div>
                                                      <span class="simple-label">From</span>
                                                      <input id="_spmt_rptfilter_start_date" class="form-control" data-select="datepicker">
                                                  </div>&nbsp; 
                                                  <div>
                                                      <span class="simple-label">To</span>
                                                      <input id="_spmt_rptfilter_end_date" class="form-control" data-select="datepicker">
                                                  </div> 
                                            </div>
                                            <div style="height:10px;"></div>
                                            <div class="form-inline">
                                                <button id="_spmt_btnRunReport" role="button" class="btn btn-success"><i class="fa fa-list-alt"></i> Run Report</button>
                                            </div> 
                                        </div>
                                     </div>
                                  </div>
                               </div>
                          </div>
                            
               </div><!--end::tab-view-->
          </div> <!--end::div#_spmt_content-->
 </div>
<!--end::DriverPaymentComponent -->
 
<!-- begin::ReceivePmtDialog -->
<div class="modal fade" id="_spmt_dlgPayToVendor" tabindex="-1" role="dialog" aria-labelledby="_spmt_dlgPayToVendor_title" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_spmt_dlgPayToVendor_title">Pay To Vendor</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="row">
                <div class="form-group col-lg-6">
                    <span class="simple-label">Payee</span>
                    <input id="_spmt_pv_payee_name" class="form-control" readonly>
                </div>
                <div class="form-group col-lg-6">
                    <span class="simple-label">Package Count</span>
                    <input type="number" class="form-control" id="_spmt_pv_package_count" readOnly>                   
                </div>
            </div>
           <div class="row">
              <div class="col-lg-6">
                   <span class="simple-label">Balance Due</span>
                   <input id="_spmt_pv_amount_due" type="number" class="form-control" autocomplete="off" readonly>
              </div>
              <div class="col-lg-6">
                   <span class="simple-label">Amount</span>
                   <input id="_spmt_pv_amount" type="number" class="form-control" autocomplete="off">
              </div>
           </div>
           <div class="row">
              <div class="col-lg-12">
                   <span class="simple-label">Payment method</span>
                   <select id="_spmt_pv_pmt_method" class="form-control">
                     <option value="Cash">Cash</option>
                     <option value="Wing">Wing</option>
                     <option value="ABA">ABA</option>
                     <option value="ACLEDA">ACLEDA</option>
                   </select>
              </div>
            </div>          
           <div class="row">
              <div class="col-lg-12">
                   <span class="simple-label">Description</span>
                   <input id="_spmt_pv_des" type="text" class="form-control" autocomplete="off">
              </div>
            </div>       
      </div>
      
      <div class="modal-footer">
        <span id="_spmt_pv_error" class="error_text"></span>&nbsp;&nbsp; 
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_spmt_dlgPayToVendor_btnOK"><i class="fas fa-check" style="color:#fff"></i> OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::ReceivePmtDialog -->


 <!--begin::FilterDialog_spmt -->
 <div class="modal fade" id="_spmt_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_spmt_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_spmt_dlgFilterTitle">Filter Transactions</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="row">
              <div class="col-lg-12">
                <span id="_spmt_filter_sender_name"></span>
              </div>
            </div>  
           <div class="row">
               <div class="form-group col-lg-6">
                   <span class="simple-label">From</span>
                  <div>  <input id="_spmt_filter_start_date" data-field="start_date" class=" form-control spmt_filter_field" data-select="datepicker" autocomplete="off"></div>
              </div>

              <div class="form-group col-lg-6">
                  <span class="simple-label">To</span>
                  <div> <input id="_spmt_filter_end_date" data-field="end_date" class=" form-control spmt_filter_field" data-select="datepicker" autocomplete="off"></div>
              </div>

                 <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Status</span>
                        <select id="_spmt_filter_package_status" data-field="status_id" class=" form-control spmt_filter_field">
                          <option value="-1">(All)</option>
                          <option value="8" selected>Delivered</option>
                          <option value="6">On Delivery</option>
                          <option value="9">Failed</option>
                        </select>
                  </div>

                  <div class="form-group col-lg-6">
                        <span class="simple-label">Payment Status</span>
                        <select id="_spmt_filter_pmt_status" data-field="sender_pmt_status_id" class=" form-control spmt_filter_field">
                          <option value="-1">(All)</option>
                          <option value="0" selected>Unpaid</option>
                          <option value="1">Paid</option>
                        </select>
                  </div>

                  <div class="form-group col-lg-6">
                        <span class="simple-label">Delivery Type</span>
                        <select id="_spmt_filter_dtype" data-field="delivery_type" class=" form-control spmt_filter_field">
                              <option value="">All Types</option>
                              <option value="Normal">Normal</option>
                              <option value="Fast">Fast</option>
                        </select>
                </div>
 
           </div>
      </div>
        <!--end::FilterDialog_spmt modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_spmt_dlgFilter_btnOK"><i class="fa fa-list-alt" style="color:#fff"></i>OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_spmt -->
<script  src="{{ asset('js/SenderPaymentComponent.js') }}"></script>
