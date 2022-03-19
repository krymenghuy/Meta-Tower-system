<style>
table.package-table {
    width: 1500px;
    height:390px;
    display:fixed;
}
  table.package-table > thead>tr{
     display:table;
     width: calc(1500px - 1em );
     table-layout: fixed;
  }
  table.package-table > tbody{
    overflow-y:scroll !important;
  }
  table.package-table > tbody> tr {
    display: table;
    width: calc(1500px - 1em );/* scrollbar is average 1em/16px width, remove it from thead width *
    /* even columns width , fix width of table too*/
    table-layout: fixed;
}
table.package-table > thead {
    width: calc(1500px - 1em )/* scrollbar is average 1em/16px width, remove it from thead width */
}  
.package-table > tbody {
    display: block;
    /* height: 390px; */
    overflow: auto;
}
.package_count{
  font-weight:bold;
  font-size:1.1em;
}
.pk-badge-delivery_type {
    padding:7px;
    font-size:0.8em; 
    background:transparent;
    border:2.5px solid green;
    border-radius: 45%;
    display: inline-block;
    color:#000;
 }
 
 table#_pl_tblPickups>thead{
    background:#F7FAFB;
    color:#2C44A8;
 }
 table#_pl_tblPickups>thead th{
    color:#2C44A8;
    font-size:0.8em;
    text-transform: uppercase;
 }
 table#_pl_tblPickups>thead>tr th{
   border-bottom:1.1px solid #62CAD8;
 }
 table#_pl_tblPickups th td{
   border-left: none !important;
   border-right:0.5px solid #FAFAFC !important;
 }
 table#_pl_tblPickups td{
   font-size:0.9em;
   font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
 }
 span.pl-request_date{
   color:grey;
   display:block;
   padding:5px;
 }
 span.pl-request_time{
   color:#1E38A4;
   font-size:0.8em;
   display:block;
   border-top:1px solid #1E38A4;
   padding:5px;
 }
 .pl-order-status-5::before{
   content:'ដល់ឃ្លាំង';
 }
 .pl-order-status-5{
   color:green;
 }
 .pl-order-pending{
   color:orange;
 }
 .pl-order-pending::before{
   content:'នៅតាមផ្លូវ';
 }

 .pl-order-status-1{
   color:orange;
 }
 .pl-order-status-1::before{
   content:'មិនទាន់ទៅយក';
 }
 .pl-order-status-0{
   color:red;
 }
 .pl-order-status-0::before{
   content:'លុបវិញហើយ';
 }
 .pl-order-status-2{
   color:blue;
 }
 .pl-order-status-2::before{
   content:'មានអ្នកទៅយក';
 }
 div.package_list_wrapper{
   max-width:1200px;
   background:#fff !important;
   max-height:450px;
   min-height:250px;
   overflow:auto;
 }
 table.pkl-package-list-table{
    width:1500px;
    background:#fff;
 }
 table.pkl-package-list-table>thead th{
    color:#8EC3D5 !important;
    font-size:0.8em;
 }
 table.pkl-package-list-table>tbody td{
   font-size:0.9em !important;
 }
 tr.package_list>td{
   padding-top:0px;
   border-top:none;
 }
 /** begin:: scrollbar for package_list **/
 .package_list_wrapper::-webkit-scrollbar-track
{
	border: 0.5px solid #218CB0;
	background-color: #fff;
}

.package_list_wrapper::-webkit-scrollbar
{
  height:8px;
	width: 8px;
	background-color: #F5F5F5;
}

.package_list_wrapper::-webkit-scrollbar-thumb
{
	background-color:#218CB0;	
}
/**end:: scrollbar for package_list**/
td.td-has_error> .col-input{
   border:1.2px solid red;
}
td.td-has_error>span.select2-container{
    border-color: 1px red;
    border-radius:3px;
    padding:0px !important;
    -webkit-box-shadow: 0 0 0 0.8px red;
    box-shadow: 0 0 0 0.8px red;
}
td.td-has_error> .select2-selection::after,td.td-has_error> .col-input::after{
    content:'Required';
    color:red;
}
</style>
<div id="_main_lnkPickupListComponent" style="display:none;background-color:#fff;">
      <!--begin::Portlet-->
      <div style="width:100%;padding:15px;">
                    <div class="kt-portlet__head kt-portlet__head--lg" style="padding-top:15px;">
                      <div class="kt-portlet__head-toolbar form-inline" id="_dl_filter_panel"> 
                            
                           <div style="display:flex;flex-direction:row;width:100%">
                                    <div style="width:50%">
                                          <div class="form-inline">  
                                                <a id="_pl_btnNewPickup" href="#" data-toggle="modal" class="btn btn-primary">
                                                          <i class="la la-plus"></i>
                                                          <span class="kt-hidden-mobile">New Request</span>
                                                </a><div style="width:20px"></div>
                                                  <input type="text" id="_pl_search" class="form-control" placeholder="Search request"> &nbsp;  
                                                  <button type="button" id="_pl_btnSearch" class="btn btn-primary"><i class="fa fa-sync-alt"></i></button>&nbsp;
                                                  <button type="button" class="btn btn-outline-success" id="_pl_btnToggleFilter">
                                                      <i class="fa fa-list-alt"></i>
                                                </button>      
                                          </div>
                                    </div>
                                    <div style="width:50%;float:right">
                                         <div style="float:right">
                                              <div class="btn-group" style="margin-right:15px">
                                                    <button type="button" id="_pl_btnPrint" class="btn btn-success"><i class="fa fa-print"></i> Print</button>&nbsp;
                                                    <button type="button" id="_pl_btnPDF" class="btn btn-primary"><i class="fa fa-file-pdf"></i> PDF</button>&nbsp;
                                                    <button type="button" id="_pl_btnExcel" class="btn btn-default"><i class="fa fa-file-excel"></i> Excel</button>  
                                                </div>
                                         </div> 
                                    </div>
                           </div>
                      </div> 
                    </div> 
                    
                    <div style="padding:5px 10px 10px 10px;margin-top:10px;overflow:auto;" class="border-style1">
                        <!-- <div class="form-inline"><input class="form-control" id="" data-select="datepicker"> </div> -->
                        <table id="_pl_tblPickups" class="table">
                            <thead>
                            </thead>
                            <tbody id="_pl_tblPickups_body">
                            </tbody>
                        </table>                 
                    </div>
         </div>
       <!--end::Portlet-->
 </div>
 
 <!--begin::ChangePickupStatusDialog-->
 <div class="modal fade" id="_pl_dlgPickupStatus" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPickupStatusTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_pl_dlgPickupStatusTitle">Set Pickup Status</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
           <div class="row">
              <div class="col-md-6">
              <label for="" class="col-form-label">Order ID</label>
                <input type="text" id="_pl_ps_order_code" class="form-control" readOnly>
                <input type="hidden" id="_pl_ps_order_id" class="data-input" data-field="order_id">
              </div>
              <div class="col-md-6">
                <label for="" class="col-form-label">Merchant Name</label>
                <input type="text" id="_pl_ps_sender_name" class="form-control" readOnly>
                <input type="hidden" id="_pl_ps_order_id" class="data-input" data-field="order_id">
              </div>
          </div> 
          <div class="row" style="display:none">
             <div class="col-md-6">
                 <label for="" class="col-form-label">Request Date</label>
                 <input type="text" id="_pl_ps_request_date" class="form-control" readOnly>
              </div>
          </div>
           <div class="row">
              <div class="col-md-6">
                  <label class="col-form-label">Status</label>
                  <select class="form-control" id="_pl_ps_status"></select>
              </div>
              <div class="col-md-6">
                  <label class="col-form-label">Driver</label>
                  <select class="form-control" id="_pl_ps_driver"></select>
              </div>
              
          </div>
      </div>
      <div class="modal-footer">
         <span class="error_text" id="_pl_ps_error"></span> &nbsp;&nbsp;
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-primary" id="_pl_ps_btnOK">OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::ChangePickupStatusDialog-->

  <!--begin::PickupRequestDialog-->
  <div class="modal fade modal-fullscreen" id="_pl_dlgPickupRequest" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPickupRequestTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content" style="width:90%">
      <div class="modal-header">
        <h5 class="modal-title" id="_pl_dlgPickupRequestTitle">Create Pickup Request</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_pl_dlgPickupRequest_body" style="overflow:hidden !important">
           <div class="row">
              <div class="form-group col-lg-3" style="display:none">
                  <label for="" class="col-form-label">Order ID</label>
                  <input id="_pl_pr_order_code" type="text" class="form-control data-input" data-field="order_code" readOnly>
                  <input id="_pl_pr_order_id" type="hidden" class="form-control data-input" data-field="order_id" readOnly>
              </div>
              <div class="form-group col-lg-3">
                  <label for="" class="col-form-label">Merchant</label>
                  <select class="modal-select2" id="_pl_pr_sender"></select> 
              </div>
              <div style="display:none" class="form-group col-lg-3">
                  <label class="col-form-label">Sender Name</label>&nbsp;<a href="#" id="_pl_pr_lnkFindSender"><i class="fa fa-search" style="color:green;font-size:1.3em"></i></a>
                  <input id="_pl_pr_sender_name" type="text" class="form-control data-input" data-field="sender_name" readOnly>
                  <input id="_pl_pr_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readOnly>
                  <input id="_pl_pr_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readOnly>
              </div>

              <div class="form-group col-lg-3">
                  <label class="col-form-label">Delivery Type</label>
                  <select id="_pl_pr_delivery_type" class="form-control data-input" data-field="delivery_type" >
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
              </div>
              <div class="form-group col-lg-3" style="display:none">
                  <label class="col-form-label">Condition</label>
                  <select id="_pl_pr_delivery_condition" class="form-control data-input" data-field="delivery_condition"></select>
              </div>

              <div class="form-group col-lg-3">
                  <label class="col-form-label">Product Type</label>&nbsp;<a id="_pl_pr_lnkAddProductType" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a>
                  <select id="_pl_pr_product_type" class="modal-select2 data-input" data-field="product_type" placeholder="Product type" ></select>
              </div>
          </div> 
          <div class="row">
              <div class="form-group col-lg-3"> 
                  <label class="col-form-label">Vehicle Type</label>&nbsp;<a id="_pl_pr_lnkAddVehicleType" href="javascript:void(0)"><i class="fa fa-plus" style="color:green"></i></a>
                  <select id="_pl_pr_vehicle_type" class="form-control data-input" data-field="request_vehicle_type"></select>
              </div>
              <div class="form-group col-lg-3">
                  <label class="col-form-label">Number of packages</label>
                  <input id="_pl_pr_qty" type="number" class="form-control data-input" data-field="qty" value ="1">
              </div>
              <div class="form-group col-lg-6">
                  <label class="col-form-label">Pickup Address</label>
                  <input id="_pl_pr_pickup_address" type="text" class="form-control data-input" data-field="pickup_address" placeholder="Pickup address">
              </div>
          </div>
          <div class="row" style="display:none">
              <div class="form-group col-lg-6">
                  <label class="col-form-label">Request Date</label>
                  <input id="_pl_pr_request_date" type="text" class="form-control data-input" data-field="request_date" data-select="datepicker">
              </div>
              <div class="form-group col-lg-6">
                  <label class="col-form-label">Pickup Date</label>
                  <input id="_pl_pr_pickup_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
              </div>
          </div>
          <div class="row">
              <div class="col-lg-12"> 
                 <div style="height:30px;"></div>
                 <div class="form-inline">
                   <button id="_pl_pr_add_package" class="btn btn-sm btn-outline-success"><i class="fa fa-plus"></i> Add</button>
                 </div>
                   <div style="height:5px"></div>
                    <div style ="width:100%;height:450px;overflow-x:auto;overflow-y:auto;border:1px solid #CCD1D1;padding:10px;border-radius:3px">
                      <table id="_pl_pr_tblPackages" class="table">
                      </table>
                    </div>
              </div> 
          </div>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-success" id="_pl_pr_btnSaveRequest">OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::PickupRequestDialog-->
 <!--begin::PerformPickupDialog-->
 <div class="modal fade modal-fullscreen" id="_pl_dlgPerformPickup" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgPerformPickupTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content" style="width:90%">
      <div class="modal-header">
        <h5 class="modal-title" id="_pl_dlgPerformPickupTitle">Perform Pickup</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_pl_dlgPerformPickup_body" style="overflow:hidden !important">
           <div class="row">
             <div class="col-lg-3">
                  <label class="col-form-label">Receiving Warehouse</label>
                  <select id="_pl_dd_to_warehouse" class="modal-select2 data-input" data-field="to_warehouse_id"></select>
              </div>
              <div class="col-lg-3">
                  <label for="" class="col-form-label">Order ID</label>
                  <input id="_pl_dd_order_code" type="text" class="form-control data-input" data-field="order_code" readOnly>
                  <input id="_pl_dd_order_id" type="hidden" class="form-control data-input" data-field="order_id" readOnly>
              </div>
              <div class="col-lg-6">
                  <label class="col-form-label">Sender Name</label>
                  <input id="_pl_dd_sender_name" type="text" class="form-control data-input" data-field="sender_name" readOnly>
                  <input id="_pl_dd_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readOnly>
                  <input id="_pl_dd_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readOnly>
              </div>
          </div> 
          <div class="row">
              <div class="col-lg-6">
                  <label class="col-form-label">Pickup Date</label>
                  <input id="_pl_dd_pickup_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
              </div>
              <div class="col-lg-3" style="display:none">
                 <label class="col-form-label">Delivery Type</label>
                 <select id="_pl_dd_delivery_type" class="form-control" data-field="delivery_type">
                      <option value="Normal">Normal</option>
                      <option value="Fast">Fast</option>
                 </select>
              </div>
              <div class="col-lg-3">
                  <label class="col-form-label">Picked up By (Driver)</label>&nbsp;&nbsp;<a href="#" id="_pl_pp_lnkFindDriver"><i class="fa fa-search" style="color:green;font-size:1.1em"></i></a>
                  <select id="_pl_dd_driver" class="modal-select2 data-input" data-field="driver"></select>
                  <input type="hidden" id="_pl_dd_driver_code">
              </div>
          </div> 
          <div class="row">
              <div class="col-lg-12"> 
                 <div style="height:30px;"></div>
                 <div class="form-inline">
                   <button id="_pl_pp_add_package" class="btn btn-sm btn-outline-success"><i class="fa fa-plus"></i> Add</button> &nbsp;&nbsp;
                   <span id="_pl_dd_pickup_context" style="color:green;font-weight:bold;font-size:1.3em">The following packages were not picked up by an agent or driver.</span>
                 </div>
                   <div style="height:5px"></div>
                    <div class="flat-box" style ="width:100%;height:450px;overflow-x:auto;overflow-y:auto;">
                      <table id="_pl_dd_tblPackages" class="table">
                      </table>
                    </div>
              </div> 
          </div>
      </div>
      <div class="modal-footer">
         <span id="_pl_dd_pickup_type" style="color:orange;font-weight:bold;font-size:1.2em"></span> 
         &nbsp;&nbsp;
         <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-primary" id="_pl_pp_btnPickup">Pick Now</button>
         <button type="button" class="btn btn-success" id="_pl_pp_btnPickOnArrival">Pick on Arrival</button>
      </div>
    </div>
  </div>
</div>
 <!--end::PerformPickupDialog-->
 
 <!--begin::ReceivePackageDialog-->
 <div class="modal fade modal-fullscreen" id="_pl_dlgReceivePackages" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgReceivePackagesTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content" style="width:90%">
      <div class="modal-header">
        <h5 class="modal-title" id="_pl_dlgReceivePackagesTitle">Verify Packages</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_pl_dlgReceivePackages_body" style="overflow:hidden !important">
           <div class="row">
             <div class="col-lg-3">
                  <label for="" class="col-form-label">Receiving Warehouse</label>
                  <select id="_pl_rps_to_warehouse" class="modal-select2 data-input" data-field="to_warehouse_id"></select>
                  
              </div>
              <div class="col-lg-3">
                  <label for="" class="col-form-label">Order ID</label>
                  <input id="_pl_rps_order_code" type="text" class="form-control data-input" data-field="order_code" readOnly>
                  <input id="_pl_rps_order_id" type="hidden" class="form-control data-input" data-field="order_id" readOnly>
              </div>
              <div class="col-lg-6">
                  <label class="col-form-label">Sender Name</label>&nbsp;<a href="#" id="_pl_rps_lnkFindSender"><i class="fa fa-search" style="color:green;font-size:1.3em"></i></a>
                  <input id="_pl_rps_sender_name" type="text" class="form-control data-input" data-field="sender_name" readOnly>
                  <input id="_pl_rps_sender_id" type="hidden" class="form-control data-input" data-field="sender_id" readOnly>
                  <input id="_pl_rps_sender_code" type="hidden" class="form-control data-input" data-field="sender_code" readOnly>
              </div>
          </div> 
          <div style="height:15px"></div>
          <div class="row">
              <div class="col-lg-3">
                  <label class="col-form-label">Delivery Date</label>
                  <input id="_pl_rps_delivery_date" type="text" class="form-control data-input" data-field="pickup_date" data-select="datepicker">
              </div>
              <div class="col-lg-3">
                  <label class="col-form-label">Delivery Type</label>
                  <select id="_pl_rps_delivery_type" class="form-control data-input" data-field="delivery_type">
                    <option value ="fast">Fast</option>
                    <option value ="normal">Normal</option>
                  </select>
              </div>
              <div class="col-lg-6" style="display:none;">
                  <div style="display:flex;flex-direction:row;">
                     <div>
                        <img src="" style="margin-top:-10px;width:130px;height:100px"></img>
                     </div>
                     <div style="width:50%">
                        <label class="col-form-label">Delivery Agent/Driver</label>&nbsp;&nbsp;<a href="#" id="_pl_rps_lnkFindDriver"><i class="fa fa-search" style="color:green;font-size:1.1em"></i></a>
                        <select id="_pl_rps_driver" class="modal-select2 data-input" data-field="driver"></select>
                        <input type="hidden" id="_pl_rps_driver_code">
                     </div>   
                   </div>
              </div>
          </div> 
          <div class="row">
              <div class="col-lg-12"> 
                 <div style="height:15px;"></div>
                 <div class="form-inline">
                   <button id="_pl_rps_add_package" class="btn btn-sm btn-outline-success"><i class="fa fa-plus"></i> Add</button>
                   &nbsp;&nbsp;<span id="_pl_rps_error" class="error_text"></span>
                  </div>
                   <div style="height:5px"></div>
                    <div style ="width:100%;height:450px;overflow-x:auto;overflow-y:auto;border:1px solid #CCD1D1;padding:10px;border-radius:3px">
                      <table id="_pl_rps_tblPackages" class="table">
                      </table>
                    </div>
              </div> 
          </div>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-times" style="font-size:1.3em;color:red"></i> Close</button>
         <button type="button" class="btn btn-success" id="_pl_rps_btnVerify"><i class="fa fa-check" style="font-size:1.3em;color:green"></i> OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::ReceivepackageDialog-->

<!--begin::FilterDialog_pickup -->
<div class="modal fade" id="_pl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_pl_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_pl_dlgFilterTitle">Filter Pickups</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
         <div class="modal-body">
                        <div class="row">
                                 <div class="form-group col-md-6">
                                      <span class="simple-label">From Date</span>
                                      <input id="_pl_filter_startdate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
                                  </div>
                                  <div class="form-group col-md-6">
                                      <span class="simple-label">To Date</span>
                                      <input id="_pl_filter_enddate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
                                  </div>
                         </div>     
                          
                         <div class="row">
                                 <div class="form-group col-md-6">
                                    <span class="simple-label">Merchant</span>
                                    <select id="_pl_filter_sender" class="modal-select2 form-control dl_filter_field"></select>
                                </div>
                                <div class="form-group col-md-6">
                                    <span class="simple-label">Driver</span>
                                    <select id="_pl_filter_driver" class="modal-select2 form-control dl_filter_field"></select>
                                </div>
                         </div>
                              
                          <div class="row">
                               <div class="form-group col-md-6">
                                    <span class="simple-label">Type</span>
                                    <select id="_pl_filter_dtype" class="form-control dl_filter_field">
                                       <option value="">All Types</option>
                                       <option value="normal">Normal</option><!-- d-type must be all in lower case-->
                                       <option value="fast">Fast</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-6">
                                  <span class="simple-label">Status</span>
                                    <select id="_pl_filter_status" class="v-select form-control dl_filter_field"></select>&nbsp;
                                </div>
                          </div>     
                          <div class="form-group col-md-12">
                                  <span class="simple-label">Warehouse</span>
                                    <select id="_pl_filter_warehouse" class="modal-select2 form-control dl_filter_field"></select>&nbsp;
                         </div>     
                </div>
        <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary" id="_pl_dlgFilter_btnOK">OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_pickup -->
 <script src="{{ asset('js/PickupListComponent.js') }}"></script>
