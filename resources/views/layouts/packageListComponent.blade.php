<style>
  table#_dl_tblPackages>thead th{
     color:#66BAF2;
     border-bottom:1.5px inset #92D7EC;
     text-transform:uppercase;
     font-size:0.8em;
  }
  table#_dl_tblPackages>tbody td span{
    font-size:1em;
  }
  .pg-no_customer_phone{
      color:orange;
      font-size:1em;
  }
  .pg-receiver_phone{
     color:green;
     font-size:0.9em !important;
  }
  .pg-sender_phone{
    color:#34A1C3;
    padding:3px;
    font-size:0.9em !important;
  }
  .pg-receiver_phone::before{
    content:'Receiver: ';
  }
  .pg-product_type{
     color:#8B8887;
     font-weight:bold;
     display:block;
     font-size:0.9em;
  }
  .pg-sender_name{
    color:#41CCCE;
    font-size:1em;
  }
  .pg-sender_type{
    color:#97AEAE;
    font-size:0.9em; 
  }
  .pg-zone_code{
    display:block;
    color:grey;
    font-size:0.9em;
  }
  .pg-zone_name{
    display:inline-block;
    color:#000;
    font-size:1em
  }
 
  .package_detail{
    background:#F4F6F7;
  }
 
  .pg-selected{
    background:#E8F6F3;
  }
  .vc-label{
    color:#85929E;
    display:block;
  }
  .vc-value:hover{
    border-bottom:1.1px solid red;
    /* transform:scale(1.0); */
    /* transition: border-bottom 0.5s ease-in; */
  }
  .vc-value{
    color:#000;
    display:block;
    max-width:200px;
    overflow:hidden;  
    padding-left:5px;
    margin-bottom:10px;
  }
  .pg-badge-delivery_type {
    display: block;
    text-align:center;
    text-transform:uppercase;
    font-size:0.8em !important; 
    background:transparent;
    border:2.5px solid green;
    border-radius: 45%;
    color:#000;
    width:55px;
    height:35px;
    padding:8px 3px 3px 3px;
 }

 span.total-label{
   font-weight:bold;
   display:inline-block;
   font-size:1.1em;
   width:60px;
 }
 span.total-value{
   font-weight:bold;
   font-size:1.1em;
 }
 span.total-value:before{
   content:'$';
 }
 /** style for input box class on the expanded detail EDIT view**/
 .vc-value-edit{
    border:1px solid #F4F9F9;
    border-radius:3px;
    background:#fff;
    padding:5px;   
 }
 .vc-value-edit:focus{
  border:1.2px solid green;
  outline:1.2px green;
 }
 span.pg-pickup_time{
    display:block;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    font-size:0.9em !important;
    padding:3px;
 }
 span.pg-barcode{
   display:block;
   margin-right:20px;
   font-size:0.9em;
 }
 span.pg-pickup_time::before{
   content:'មកដល់: ';
 }
 .btn-on-delivery{
    border-bottom:1.2px solid green;
 }
 ._pol_status{
    min-width:100.18px;
 }
 ._pol_driver_name{
   display:block;
   font-size:0.9em;
 }
</style>

  <div id="_main_packageListComponent" style="display:none;padding:15px;margin-left:2px">
      <!--begin::Portlet-->
                  <div style="display:flex;flex-direction:row">
                      
                                        <div class="form-inline" style="width:60%;">
                                                  <div class="btn-group">
                                                    <!-- <a id="_dl_lnkReceivePackage" href="#" data-toggle="modal" class="btn btn-success">
                                                            <i class="la la-plus"></i>
                                                            <span class="kt-hidden-mobile">Receive Packages</span>
                                                    </a> -->
                                                    <button role="button" id="_dl_lnkReceivePackage" class="btn btn-success"><i class="fa fa-plus"></i> Receive Pacakges</button>
                                                    &nbsp;
                                                    <button role="button" id="_dl_btnScanBackIn" class="btn btn-primary"><i class="fa fa-check"></i> Scan In</button >
                                                  </div>
                                                    <div style="width:25px;"></div>
                                                     <input type="text" id="_dl_search" class="form-control" placeholder="Search package"> &nbsp;<button type="button" id="_dl_btnSearch" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button> &nbsp;&nbsp;
                                                    <button id="_dl_btnToggleFilter" role="button" class="btn btn-outline-success"><i class="fas fa-list-alt"></i></button>

                                        </div>
                                        <div style="width:40%;margin-right:15px">
                                           <div style="float:right">
                                               <div class="btn-group">
                                                    <button type="button" id="_dl_btnPrint" class="btn btn-success"><i class="fas fa-print"></i> Print</button>&nbsp;
                                                    <button type="button" id="_dl_btnPDF" class="btn btn-primary"><i class="fas fa-file-pdf"></i> PDF</button>&nbsp;
                                                    <button type="button" id="_dl_btnExcel" class="btn btn-default"><i class="fas fa-file-excel"></i> Excel</button>  

                                               </div>
                                           </div>      
                                        </div>
 
                  </div>
                    <div style="width:100%;padding:10px 5px 10px 10px;margin-top:5px" class="border-style1">
                       <table id="_dl_tblPackages" class="table"></table>     
                    </div>          
       <!--end::Portlet-->
 </div>
<!--end::packageListComponent -->
 <div id="_dl_pg_pop_view" style="display:none">
   <h3>This is a test</h3>
 </div>
 <!--begin::FindPersonDialog-->
 <div class="modal fade" id="dg_dlgFindPerson" tabindex="-1" role="dialog" aria-labelledby="dg_dlgFindPersonTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="dg_dlgFindPersonTitle">Find Person</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
           <div class="row">
                <div class="col-lg-6">
                  <input class="form-control" type="text" id="dg_person_search" placeholder="id, name, phone number"> 
                </div>
                <div class="col-lg-6">
                   <button type="button" id="dg_btnFindPerson" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </div>
           </div>

           <div class="row">
                <div class="col-lg-12">
                  <div style="height:15px"></div> 
                  <span style="font-weight:bold;font-size:1.3em">Looking for someone?</span>
                  <div class="div-line" style="width:50%;border-color:green"></div>
                  <div id="dg_tblPersons_wrapper">
                      <table id ="dg_tblPersons" class="table fixed-body-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Phone Number</th>
                              </tr>
                        </thead>
                        <tbody id="dg_tblPersons_body" style="height:250px"></tbody>
                      </table> 
                  </div>
                  <div><span style="font-size:1.3em;color:green;font-weight:bold" id="dg_lblInfo">No Person Found!</span></div>
                </div>
           </div>
      </div>
      <div class="modal-footer">
         <button type="button" class="btn btn-secondary" data-dismiss="modal" id="dg_findperson_btnClose">Cancel</button>
         <button type="button" class="btn btn-primary" id="dg_btnChoosePerson">OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::FindPersonDialog-->

 <!--begin::FilterDialog_package -->
<div class="modal fade" id="_dl_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_dl_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dl_dlgFilterTitle">Filter Packages</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="form-group">
                  <span class="simple-label">Warehouse</span>
                  <select id="_dl_filter_warehouse" class="form-control dl_filter_field"></select>&nbsp;
            </div>
           <div class="row">
              <div class="col-lg-6">
                   <span class="simple-label">Date</span>
                   <input id="_dl_filter_date" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off">
              </div>
              <div class="col-lg-6">
                  <span class="simple-label">Merchant</span>
                  <select id="_dl_filter_sender" class="modal-select2 dl_filter_field"></select>
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                <span class="simple-label">Driver</span>
                <select id="_dl_filter_driver" class="modal-select2 dl_filter_field"></select>              </div>
              <div class="col-lg-6">
                 <span class="simple-label">Destination</span>
                 <select id="_dl_filter_zone" class="modal-select2 dl_filter_field"></select>
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                                    <span class="simple-label">Type</span>
                                    <select id="_dl_filter_dtype" class="v-select form-control dl_filter_field">
                                       <option value="">All Types</option>
                                       <option value="Normal">Normal</option>
                                       <option value="Fast">Fast</option>
                                    </select>
              </div>
              <div class="col-lg-6">
                <span class="simple-label">Status</span>
                <select id="_dl_filter_status" class="v-select form-control dl_filter_field"></select>&nbsp;
              </div>
           </div>              
      </div>
        <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_dl_dlgFilter_btnOK"><i class="fa fa-list-alt" style="color:#fff"></i>OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_package -->

<!--begin::ScanInDialog -->
<div class="modal fade" id="_dl_dlgScanIn" tabindex="-1" role="dialog" aria-labelledby="_dl_dlgScanIn_title" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_dl_dlgScanIn_title">Scan In (Failed Deliveries)</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="form-group">
                  <span class="simple-label">Warehouse</span>
                  <select id="_dl_scanin_warehouse" class="modal-select2"></select>&nbsp;
            </div>
           <div class="row">
              <div class="col-lg-6">
                   <span class="simple-label">Remarks</span>
                   <input id="_dl_scanin_remarks" class="form-control dl_filter_field" autocomplete="off">
              </div>
              <div class="col-lg-6">
                  <span class="simple-label">Change to status</span>
                  <select id="_dl_scanin_status" class="form-control"></select>
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                <span class="simple-label">Barcode</span>
                <input id="_dl_scanin_barcode" class="form-control"> 
              </div>
              <div class="col-lg-6">
              </div>
           </div>
           <div class="row">
              <div class="col-lg-12">
                <span class="error_text" id="_dl_dlgScanin_error"></span>
              </div>
           </div>                     
      </div>
        <!--end::ScanInDialog modal-body -->
      <div class="modal-footer">
         <button type="button" id="_dl_dlgScanIn_btnClose" class="btn btn-secondary"><i class="fa fa-times" style="color:red"></i>Close</button>
      </div>
    </div>
  </div>
</div>
<!--end::ScanInDialog -->
 <script  src="{{ asset('js/PackageListComponent.js') }}"></script>
