  <style>
    a._dpmt_print_barcode>i:hover{
       transform:scale(1.7);
       transition-property:transform;
       color:green;
    }
    input.checkbox-lg{
       width:18px;
       height:18px;
    }
    .billing-paid-text{
      color:green !important;
      font-size:1.1em; 
      font-weight:bold;
    }
    .billing-unpaid-text{
      color:red !important;
      font-size:1.1em; 
      font-weight:bold;
    }
    span.billing-pmt-notes{
      color:grey;
      font-size:0.9em;
    }
    span#_dpmt_filter_driver_name, span.billing-forwarding_cost, span.billing-cod_amount{
      color:#ABEBC6;
      font-size:1.2em;
      font-weight:bold;
    }
    span.billing-balance-due{
      font-weight:bold;
      color:blue;
      font-size:1.2em;
    }
    span.bl-section-title{
      color:#D0D8D7;
      font-weight:bold;
      font-size:1em;
    }
    ul.bl-report-list>li{
       list-style:none;
    }
    ul.bl-report-list>li>a{
      display:block;
      padding:5px;
      font-size:1.2em;
      border-bottom:1.5px solid #CDD7D6;
    }
    div.bl-report_filter_panel{
      border:1px inset #E0E7E6;
      border-radius:2px;
    }
   a.bl-report-selected{
      font-weight:bold;
   }
   table#_dpmt_tblItems>thead th, table#_dpmt_tblPmts>thead th{
      font-size:0.9em;
      text-transform:uppercase;
      color:#C7D4D7;
   }
   table#_dpmt_tblItems> .col-input{
     min-width:100px;
   }
   .trx-img{
     min-width:80px;
     min-height:80px;
   }
  </style>
  <div id="_main_driverPmtComponent" style="display:none;padding:5px">    
            <div id="_dpmt_content" style="width:100%;padding:10px;margin-top:-10px">
                 <div class="tab-view" id="_dpmt_driverTabView">
                          <div class="tab-header">
                            <a href="javascript:;" class="tab-button active" data-viewname="dpmt_deliveries" data-target="_dpmt_panel_deliveries">DELIVERIES</a>
                            <a href="javascript:;" class="tab-button" data-viewname="dpmt_payments" data-target="_dpmt_panel_payments">PAYMENTS</a>
                            <a href="javascript:;" class="tab-button" data-viewname="dpmt_reports" data-target="_dpmt_panel_reports">REPORTS</a> 
                          </div><!--end::tab-header-->
                          
                          <div class="tab-body">
                              <div class="tab-panel" id="_dpmt_panel_deliveries" style="height:650px;padding:10px" data-viewname="dpmt_deliveries">
                                  <div class="row">
                                     <div class="col-lg-6">
                                        <div class="form-inline" id="_dpmt_filter_panel" style="float:left;margin-right:15px">
                                            <select class="select2 dpmt_filter_field" id="_dpmt_filter_warehouse" data-placeholder="Choose warehouse"></select>&nbsp;
                                            <select class="select2 dpmt_filter_field" id="_dpmt_filter_driver" data-placeholder="Choose driver"></select>&nbsp; 
                                            <button role="button" id="_dpmt_btnToggleFilter" class="btn btn-outline-primary"><i class="fas fa-list-alt"></i></button>
                                        </div>
                                          <div class="form-inline" style="float:left;">
                                              <a id="_dpmt_btnSelectAll" role="button" href="javascript:;" class="btn btn-sm btn-outline-primary"><i class="fa fa-check"></i> All</a>
                                                &nbsp;
                                              <a id="_dpmt_btnReceivePmt" role="button" href="javascript:;" class="btn btn-sm btn-outline-success">Receive Pmt</a>
                                              <!-- <div style="width:20px"></div> -->
                                              <!-- <span id="_dpmt_balance_due" class="billing-balance-due">Balance Due: $55</span> -->
                                          </div> 
                                     </div>
                                     <div class="col-lg-6">
                                            <div class="form-inline" style="float:right">
                                                  <input type="text" id="_dpmt_search" class="form-control" placeholder="Search package" autocomplete="false"> &nbsp;
                                                  <button type="button" id="_dpmt_btnSearch" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
                                                  <!-- <div style="width:15px"></div> -->
                                                  <!-- <div class="btn-group">
                                                      <button role="button" class="btn btn-success"><i class="fas fa-print"></i> Print</button>
                                                      &nbsp;
                                                      <button role="button" class="btn btn-primary"><i class="fas fa-file-pdf"></i> PDF</button>
                                                  </div> -->
                                            </div>
                                     </div>
                                  </div>  
                                  <div class="row">
                                     <div class="col-lg-12">
                                          <table id="_dpmt_tblItems" class="table"></table>   
                                     </div>
                                   </div>  
                              </div>
                              <div class="tab-panel" id="_dpmt_panel_payments" style="height:650px;padding:10px" data-viewname="dpmt_payments">
                                   <div class="row">
                                          <div class="col-lg-12">
                                              <div class="form-inline" id="_dpmt_filter_panel">
                                                   <div><select class="select2 dpmt_filter_field" id="_dpmt_filter_pmt_driver"></select></div>
                                                    &nbsp;
                                                   <div> <input id="_dpmt_filter_pmt_startdate" class="form-control dpmt_filter_field" data-select="datepicker"></div>
                                                    &nbsp;
                                                    <div><input id="_dpmt_filter_pmt_enddate" class="form-control dpmt_filter_field" data-select="datepicker"></div>
                                              </div>
                    
                                          </div>
                                   </div>
                                   <div class="row">
                                      <div class="col-lg-12">
                                         <table id="_dpmt_tblPmts" class="table table-stripped"></table>
                                      </div>
                                   </div>
                                   
                              </div>
                                
                              <div class="tab-panel flat-box" id="_dpmt_panel_reports" style="height:650px;px;padding:10px" data-viewname="dpmt_reports">  
                                  <span class="bl-section-title">DRIVER REPORT</span>
                                  <div class="div-line" style="border-color:#E7ECEC; width:30%"></div>
                                  <div class="row">
                                     <div class="col-lg-6">
                                        <ul class="bl-report-list" id="_dpmt_report_list">
                                              <li>
                                                 <a data-rptname="dr_package_list" class="report-item" href="javascript:;">Delivered Packages Report</a>   
                                              </li>
                                            <li><a data-rptname="dr_summarized_deliveries" class="report-item" href="javascript:;">Summarized Deliveries Report</a></li>
                                            <li><a data-rptname="dr_driver_pmts" class="report-item" href="javascript:;">Payments by Driver</a></li>
                                            <li><a data-rptname="dr_driver_commissions" class="report-item" href="javascript:;">Commissions to Driver</a></li>
                                            <li style="display:none"><a data-rptname ="dr_pmts_to_driver" class="report-item" href="javascript:;">Payments to Driver</a></li>
                                        </ul>
                                     </div>
                                     <div class="col-lg-6">
                                        <div class="bl-report_filter_panel" style="padding:15px;">
                                            <div style="width:100%">
                                                  <div>
                                                      <span class="simple-label">Report on driver</span>
                                                      <select class="select2" id="_dpmt_rptfilter_driver" data-placeholder="Choose driver"></select>
                                                  </div> 
                                            </div> 
                                            <div class="form-inline">
                                                  <div>
                                                      <span class="simple-label">From</span>
                                                      <input id="_dpmt_rptfilter_start_date" class="form-control" data-select="datepicker">
                                                  </div>&nbsp; 
                                                  <div>
                                                      <span class="simple-label">To</span>
                                                      <input id="_dpmt_rptfilter_end_date" class="form-control" data-select="datepicker">
                                                  </div> 
                                            </div>
                                            <div style="height:10px;"></div>
                                            <div class="form-inline">
                                                <button id="_dpmt_btnRunReport" role="button" class="btn btn-success"><i class="fa fa-list-alt"></i> Run Report</button>
                                            </div> 
                                        </div>
                                     </div>
                                  </div>
                               </div>
                          </div>
                            
               </div><!--end::tab-view-->
          </div> <!--end::div#_dpmt_content-->
 </div>
<!--end::DriverPaymentComponent -->
 
<!--begin::ReceivePmtDialog -->
<div class="modal fade" id="_dpmt_dlgReceivePmt1" tabindex="-1" role="dialog" aria-labelledby="_dpmt_dlgReceivePmt1_title" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dpmt_dlgReceivePmt1_title">Receive Payment</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="row">
                <div class="form-group col-lg-6">
                      <span class="simple-label">Payer</span>
                      <input id="_dpmt_receive_payer" class="form-control" readonly>
                </div>
                <div class="form-group col-lg-6">
                      <span class="simple-label">Package count</span>
                      <input id="_dpmt_receive_package_count" class="form-control" readonly>
                </div>
             </div>
            
           <div class="row">
              <div class="col-lg-6">
                   <span class="simple-label">Balance Due</span>
                   <input id="_dpmt_receive_amount_due" type="number" class="form-control" autocomplete="off" readonly>
              </div>
              <div class="col-lg-6">
                   <span class="simple-label">Amount</span>
                   <input id="_dpmt_receive_amount" type="number" class="form-control" autocomplete="off">
              </div>
           </div>
           <div class="row">
              <div class="form-group col-md-6">
                   <span class="simple-label">Payment method</span>
                   <select id="_dpmt_receive_pmt_method1" class="form-control" disabled>
                     <option value="Cash" selected>Cash</option>
                   </select>
              </div>
              <div class="form-group col-md-6">
                  <span class="simple-label">Amount in cash</span>
                  <input type="number" class="form-control" id="_dpmt_receive_cash">
              </div>              
            </div>
           <div class="row">
              <div class="form-group col-md-6">
                   <span class="simple-label">Payment method</span>
                   <select id="_dpmt_receive_pmt_method2" class="form-control">
                     <option value="Wing">Wing</option>
                     <option value="ABA">ABA</option>
                     <option value="ACLEDA">ACLEDA</option>
                   </select>
              </div>
              <div class="form-group col-md-6">
                  <span class="simple-label">Amount (bank transfer)</span>
                  <input type="number" class="form-control" id="_dpmt_receive_noncash">
              </div>
            </div>          
           <div class="row">
              <div class="col-lg-12">
                   <span class="simple-label">Description</span>
                   <input id="_dpmt_receive_des" type="text" class="form-control" autocomplete="off">
              </div>
            </div>       
      </div>
      
      <div class="modal-footer">
        <span id="_dpmt_error" class="error_text"></span>&nbsp;&nbsp; 
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_dpmt_dlgReceivePmt_btnOK"><i class="fas fa-check" style="color:#fff"></i> OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::ReceivePmtDialog -->


 <!--begin::FilterDialog_dpmt -->
 <div class="modal fade" id="_dpmt_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_dpmt_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dpmt_dlgFilterTitle">Filter Transactions</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="row">
              <div class="col-lg-12">
                <span id="_dpmt_filter_driver_name"></span>
              </div>
            </div>  
           <div class="row">
                 <div class="col-lg-6">
                        <span class="simple-label">Delivery Status</span>
                        <select id="_dpmt_filter_package_status" data-field="status_id" class=" form-control dpmt_filter_field">
                          <option value="-1">(All)</option>
                          <option value="8" selected>Delivered</option>
                          <option value="6">On Delivery</option>
                          <option value="9">Failed</option>
                        </select>
                  </div>
                  <div class="col-lg-6">
                        <span class="simple-label">Payment Status</span>
                        <select id="_dpmt_filter_pmt_status" data-field="driver_pmt_status_id" class=" form-control dpmt_filter_field">
                          <option value="-1">(All)</option>
                          <option value="0" selected>Unpaid</option>
                          <option value="1">Paid</option>
                        </select>
                  </div>
           </div>
           <div class="row">
               <div class="col-lg-6">
                    <span class="simple-label">Delivery Type</span>
                     <select id="_dpmt_filter_dtype" data-field="delivery_type" class=" form-control dpmt_filter_field">
                          <option value="">All Types</option>
                           <option value="Normal">Normal</option>
                          <option value="Fast">Fast</option>
                    </select>
              </div> 
           </div>
           <div class="row">
              <div class="col-lg-6">
                   <span class="simple-label">From</span>
                   <input id="_dpmt_filter_start_date" data-field="start_date" class=" form-control dpmt_filter_field" data-select="datepicker" autocomplete="off">
              </div>
              <div class="col-lg-6">
                  <span class="simple-label">To</span>
                  <input id="_dpmt_filter_end_date" data-field="end_date" class=" form-control dpmt_filter_field" data-select="datepicker" autocomplete="off">
              </div>
           </div>  
      </div>
        <!--end::FilterDialog_dpmt modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_dpmt_dlgFilter_btnOK"><i class="fa fa-list-alt" style="color:#fff"></i>OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_dpmt -->
  <script  src="{{ asset('js/DriverPaymentComponent.js') }}"></script>
