 <style>
   i.trl-menu-icon{
     display:inline-block;
     width:10px;
     font-size:1.2em !important;
   }
   table#_trl_tblTrips>thead th{
     text-transform:uppercase;
     color:grey;
     font-size:0.8em;
   }
   table#_trl_tblTrips>tbody td{
     font-size:0.8em;
   }
   tr.dpl-selected{
      background:blue;  
   }
   tr.dpl-selected td{
     color:#fff !important;
     font-weight:bold;
     /* border-bottom:none !important; */
   }
   table.trl-package_table>thead th{
     color:lightgrey !important;
     font-weight:bold;
     font-size:0.8em;
     text-transform:uppercase; 
      border-bottom:1px solid grey;
      padding:3px;
   }
   
   .trl-sendername-text,.trl-senderphone-text,.trl-receivername-text, .trl-receiverphone-text .trl-zonecode-text, .trl-zonename-text{
    display:block;
    padding:0px;
    font-size:1em;
    color:#000;
   }
   table.trl-package_table>tbody td{
      border:none;
      font-size:0.9em !important;
      padding:7px;
      color:#120272;
   }
   
  div.package_list_wrapper{
    background:#F8F9F8;
    width:100%; 
  }
  
  table#_trl_trip_tblPackages>tbody span.zone_code, 
  table#_trl_trip_tblPackages>tbody span.zone_name, 
  table#_trl_trip_tblPackages>tbody span.sender_name,
  table#_trl_trip_tblPackages>tbody span.sender_phone, 
  table#_trl_trip_tblPackages>tbody span.receiver_address {
    display:block; 
    font-size:0.9em;
  }
  table#_trl_tblTrips>thead th, table#_trl_trip_tblPackages>thead th{
    font-size:0.8em;
    color:#74B1E2; 
    text-transform:uppercase;
  }
  #map {
    height: 90vh;
  }
 </style>
 <div id="_main_tripListComponent" style="display:none;padding:15px">
   <div id="_trl_trip_list_panel">
   <div style="display:flex;flex-direction:row">
                        <div style="width:50%">
                                <div class="form-inline">
                                                    <a id="_trl_btnNewTrip" href="#" data-toggle="modal" class="btn btn-primary">
                                                          <i class="la la-plus"></i>
                                                          <span class="kt-hidden-mobile">New Trip</span>
                                                    </a>
                                                  <div style="width:25px;"></div>
                                                  <input type="text" id="_trl_search" class="form-control" placeholder="Search package" autocomplete="false"> &nbsp;
                                                  <button type="button" id="_trl_btnSearch" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button>
                                                  <button type="button" id="_trl_btnShowTrackingMap" class="btn btn-outline-primary"><i class="fas fa-map"></i></button>
                                                  <div style="width:20px"></div>
                                                  <button role="button" id="_trl_btnToggleFilter" class="btn btn-outline-primary"><i class="fas fa-list-alt"></i></button>
                                </div>
                        </div>


                        <div style="width:50%">
                          <div class="btn-group" style="float:right">
                             <button id="_trl_btnPrint" role="button" class="btn btn-success"><i class="fas fa-print"></i> Print</button>
                             <button id="_trl_btnPDF" role="button" class="btn btn-primary"><i class="fas fa-file-pdf"></i> PDF</button>
                           </div>
                        </div>
 
                  </div>
                     
                    <div style="width:100%;padding:10px;margin-top:15px" class="border-style1">
                       <table id="_trl_tblTrips" class="table"></table>     
                    </div>

   </div>
    <div id="_trl_tracking_map_panel" style="display:none">
        <div class="form-inline" style="margin-left:25px">
            <button id="_trl_btnShowTrips" class="btn btn-sm btn-success"><i class="fa fa-list-alt"></i> Back to Fleets</button> 
            <select class="select2" id="_trl_filter_tracking_driver"></select>
          </div>
        <div class="container">
          <div id="map"></div>
        </div>
    </div>
</div>
<!--end::tripListComponent -->

  <!--begin::DeliveryTripDialog-->
 <div class="modal fade modal-fullscreen" id="_trl_dlgDeliveryTrip" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgDeliveryTripTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content" style="width:90%">
      <div class="modal-header">
        <h5 class="modal-title" id="_trl_dlgDeliveryTripTitle">New Delivery Ttrip</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="_trl_dlgDelivery_body" style="overflow:hidden !important">
           <div class="row">
              <div class="col-lg-3">
                  <label for="" class="col-form-label">Depart Time</label><span class="text-muted"> (Now)</span>
                  <input id="_trl_trip_depart_time"  class="form-control data-input" data-field="depart_time" data-select="timepicker" readOnly>
              </div>
              <div class="col-lg-3" style="display:none">
                  <label class="col-form-label">Delivery Type</label>
                  <select id="_trl_trip_delivery_type" class="form-control data-input" data-field="delivery_type">
                     <option value="Normal">Normal</option>
                     <option value="Fast">Fast</option>
                  </select>
              </div>
              <div class="col-lg-9">
                  <label class="col-form-label">Barcode</label>
                  <div class="form-inline">
                     <input type="text" class="form-control" id="_trl_trip_barcode" style="min-width:300" placeholder="barcode">
                     &nbsp;
                     <button id="_trl_trip_btnScan" role="button" class="btn btn-sm btn-outline-primary">Scan</button>
                     <div style="width:20px"></div> 
                     <button type="button" id="_trl_trip_btnPrintBarcode" style="float:left" class="btn btn-sm btn-outline-success"><i class="fa fa-barcode"></i></button> 
                  </div>
              </div>
              
          </div> 
          <div style="height:10px"></div>
          <div class="row">
             <div class="col-lg-3">
                  <label class="col-form-label">Vehicle Type</label>
                  <select class="form-control" id="_trl_trip_vehicle_type"></select>
             </div>
             <div class="col-lg-3">
                  <label class="col-form-label">Driver</label>&nbsp;<a href="#" id="_trl_trip_lnkFindDriver"><i class="fa fa-search" style="color:green;font-size:1.3em"></i></a>
                  <input id="_trl_trip_driver_name" type="text" class="form-control data-input" data-field="driver_name" readOnly>
                  <input id="_trl_trip_driver_id" type="hidden" class="form-control data-input" data-field="driver_id" readOnly>
                  <input id="_trl_trip_driver_code" type="hidden" class="form-control data-input" data-field="driver_code" readOnly>
              </div>
              <div class="col-lg-6">
              <span id="_trl_trip_error" class="error_text">Error test here</span>
              </div>
          </div> 
          <div class="row" style="">
              <div class="col-lg-12">
                    <div class="border-style1" style ="width:100%;height:450px;overflow-x:auto;overflow-y:hidden;padding:10px">
                      <table id="_trl_trip_tblPackages" class="table trl-package_table">
                           <thead>
                              <tr>
                                 <th></th>
                                 <th>Sender</th>
                                 <th>Receiver</th>
                                 <th>Zone</th>
                                 <th>Delivery Type</th>
                                 <th>COD</th>
                                 <th>Fees</th>
                                 <th>Total (USD)</th>
                                 <th>Total (KHR)</th>
                                 <th>Remarks</th>
                              </tr>
                           </thead>
                           <tbody id="_trl_trip_tblPackages_body"></tbody>
                      </table>
                    </div>
              </div> 
          </div>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-secondary" id="_trl_trip_btnClose"><i class="fa fa-times" style="font-size:1.3em;color:red"></i> Close</button>
         <button type="button" class="btn btn-success" id="_trl_trip_btnSaveTrip"><i class="fa fa-check" style="font-size:1.3em;color:green"></i> Start Delivery</button>
      </div>
    </div>
  </div>
</div>
 <!--end::DeliveryTripDialog-->

 
 <!--begin::FilterDialog_trip -->
<div class="modal fade" id="_trl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_trl_dlgFilterTitle">Filter Trips</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="">
                  <span class="simple-label">Warehouse</span>
                  <select id="_trl_filter_warehouse" class="modal-select2 dl_filter_field"></select>&nbsp;
            </div>
           <div class="row">
              <div class="form-group col-lg-6">
                   <span class="simple-label">From Date</span>
                   <input id="_trl_filter_startdate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
              </div>
              <div class="form-group col-lg-6">
                   <span class="simple-label">To Date</span>
                   <input id="_trl_filter_enddate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                <span class="simple-label">Driver</span>
                <select id="_trl_filter_driver" class="modal-select2 dl_filter_field"></select>
              </div>
              <div class="col-lg-6">
                <span class="simple-label">Status</span>
                <select id="_trl_filter_status" class="form-control dl_filter_field"></select>&nbsp;
              </div>
           </div>           
      </div>
      <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_trl_dlgFilter_btnOK"><i class="fa fa-list-alt" style="color:#fff"></i>OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_trip -->

<!--begin::ChangePackageStatus -->
<div class="modal fade" id="_trl_dlgPackageStatus" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgPackageStatusTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_trl_dlgPackageStatusTitle">Change Package Status</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="">
                  <span class="simple-label">Select Status</span>
                  <select id="_trl_ps_status" class="form-control"></select>
            </div>
           <div class="row">
              <div class="col-lg-12" style="display:none">
                   <span class="simple-label">Notes</span>
                   <input id="_trl_ps_notes" class="form-control" autocomplete="off">
              </div>
           </div>
           <div class="row">
              <span style="display:block;margin:15px;" class="error_text" id="_trl_ps_error"></span>&nbsp;&nbsp;
           </div>          
      </div>
      <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_trl_dlgPackageStatus_btnSave"><i class="fas fa-check" style="color:#fff"></i>Change Now</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_trip -->


<!--begin::AddItemToTripDialog-->
<div class="modal fade" id="_trl_dlgAddItemTotrip" tabindex="-1" role="dialog" aria-labelledby="_trl_dlgAddItemTotripTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_trl_dlgAddItemTotripTitle">Change Package to Trip</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <div class="">
                  <span class="simple-label">Barcode</span>
                  <input type="text" id="_trl_apt_barcode" class="form-control">
            </div>
             <div class="">
                  <span class="simple-label">Select Status</span>
                  <select id="_trl_apt_status" class="form-control"></select>
            </div>
           <div class="row">
              <div class="col-lg-12">
                   <span class="simple-label">Notes</span>
                   <input id="_trl_apt_notes" class="form-control" autocomplete="off">
              </div>
           </div>          
      </div>
      <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
         <span class="error_text" id="_trl_dlgAddItemTotrip_error"></span>&nbsp;&nbsp;
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_trl_dlgAddItemTotrip_btnSave"><i class="fas fa-check" style="color:#fff"></i>Add Now</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_trip -->

  <script  src="{{ asset('js/TripListComponent.js') }}"></script>
