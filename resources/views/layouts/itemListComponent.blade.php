<style>
  table#_itemlist_tblItems>thead th{
     color:#66BAF2;
     border-bottom:1.5px inset #92D7EC;
     text-transform:uppercase;
     font-size:0.8em;
  }
  table#_itemlist_tblItems>tbody td span{
    font-size:0.9em;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
  }
  table#_itemlist_tblItems>tbody td{
    font-size:0.9em;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
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
    font-size:1em !important;
  }
  .pg-receiver_phone::before{
    content:'Receiver: ';
  }
  .pg-product_type{
     color:#8B8887;
     font-weight:bold;
     display:block;
     font-size:1em;
  }
  .pg-sender_name{
    color:#41CCCE;
    font-size:1.1em !important;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
  }
  .pg-sender_type{
    color:#97AEAE;
    font-size:1em; 
  }
  .pg-zone_code{
    display:block;
    color:grey;
    font-size:1em;
  }
  .pg-zone_name{
    display:inline-block;
    color:#000;
    font-size:1em
  }
 
  .package_detail{
    background:#F8F9F9;
  }
 
  .pg-selected{
    background:#E8F6F3;
  }
  .vc-label{
    color:#85929E;
    display:block;
    font-size:0.9em;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
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
    background:transparent;
    border:2.5px solid green;
    border-radius: 45%;
    color:#000;
    width:65px;
    height:38px;
    padding:8px 4px 4px 4px;
    font-size:0.8em !important; 
 }

 span.total-label{
   font-weight:bold;
   display:inline-block;
   font-size:1.2em;
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
    margin-top:5px; 
    display:block;
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    font-size:0.9em !important;
    padding:3px;
 }
 span.pg-barcode{
   display:block;
   margin-right:20px;
   font-size:1em;
   color:orange;
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
   padding:3px;
   font-size:0.9em;
 }
</style>

  <div id="_main_itemListComponent" style="display:none;padding:15px;margin-left:2px">
      <!--begin::Portlet-->
                  <div style="display:flex;flex-direction:row">
                      
                                        <div class="form-inline" style="width:60%;">
                                                  <div class="btn-group">
                                                      <button type="button" class="btn btn-primary" id="_itemlist_btnNew"><i class="fa fa-plus"></i> New Item</button> 
                                                  </div>
                                                     <div style="width:25px;"></div>
                                                  <input type="text" id="_itemlist_search" class="form-control" placeholder="Search package"> &nbsp;<button type="button" id="_itemlist_btnSearch" class="btn btn-outline-primary"><i class="fas fa-sync-alt"></i></button> &nbsp;&nbsp;
                                                  <button id="_itemlist_btnToggleFilter" role="button" class="btn btn-outline-success"><i class="fas fa-list-alt"></i></button>

                                        </div>
                                        <div style="width:40%;margin-right:15px">
                                           <div style="float:right">
                                               <div class="btn-group">
                                                    <button type="button" id="_itemlist_btnPrint" class="btn btn-success"><i class="fas fa-print"></i> Print</button>&nbsp;
                                                    <button type="button" id="_itemlist_btnPDF" class="btn btn-primary"><i class="fas fa-file-pdf"></i> PDF</button>&nbsp;
                                                    <!-- <button type="button" id="_itemlist_btnExcel" class="btn btn-default"><i class="fas fa-file-excel"></i> Excel</button>   -->
                                               </div>
                                           </div>      
                                        </div>
 
                  </div>
                    <div style="width:100%;padding:10px 5px 10px 10px;margin-top:5px;border:1px solid #EAEDED;border-radius:5px;min-height:43vw">
                       <table id="_itemlist_tblItems" class="table"></table>     
                    </div>          
       <!--end::Portlet-->
 </div>
<!--end::packageListComponent -->

 

 <!--begin::FilterDialog_package -->
<div class="modal fade" id="_itemlist_dlgFilter" tabindex="-1" role="dialog" aria-labelledby="_itemlist_dlgFilterTitle" aria-hidden="true">
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_itemlist_dlgFilterTitle">Filter Packages</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
             <div class="form-group">
                  <span class="simple-label">Warehouse</span>
                  <select id="_itemlist_filter_warehouse" class="form-control dl_filter_field"></select>&nbsp;
            </div>
           <div class="row">
              <div class="col-lg-3">
                   <span class="simple-label">From date</span>
                   <div> <input id="_itemlist_filter_startdate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off"></div>
              </div>
              <div class="col-lg-3">
                   <span class="simple-label">To date</span>
                   <div><input id="_itemlist_filter_enddate" class="form-control dl_filter_field" data-select="datepicker" autocomplete="off"></div>
              </div>
              <div class="col-lg-6">
                  <span class="simple-label">Merchant</span>
                  <select id="_itemlist_filter_sender" class="modal-select2 dl_filter_field"></select>
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                <span class="simple-label">Driver</span>
                <select id="_itemlist_filter_driver" class="modal-select2 dl_filter_field"></select>              </div>
              <div class="col-lg-6">
                 <span class="simple-label">Destination</span>
                 <select id="_itemlist_filter_zone" class="modal-select2 dl_filter_field"></select>
              </div>
           </div>

           <div class="row">
              <div class="col-lg-6">
                                    <span class="simple-label">Type</span>
                                    <select id="_itemlist_filter_dtype" class="v-select form-control dl_filter_field">
                                       <option value="">All Types</option>
                                       <option value="Normal">Normal</option>
                                       <option value="Fast">Fast</option>
                                    </select>
              </div>
              <div class="col-lg-6">
                <span class="simple-label">Status</span>
                <select id="_itemlist_filter_status" class="v-select form-control dl_filter_field"></select>&nbsp;
              </div>
           </div>              
      </div>
        <!--end::dlgFilter modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i>Cancel</button>
        <button type="button" class="btn btn-primary" id="_itemlist_dlgFilter_btnOK"><i class="fa fa-list-alt" style="color:#fff"></i>OK</button>
      </div>
    </div>
  </div>
</div>
<!--end::FilterDialog_package -->
 <script  src="{{ asset('js/itemListComponent.js') }}"></script>
