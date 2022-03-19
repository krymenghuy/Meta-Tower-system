 <style>
    .ps-dtype-normal-text,.ps-dtype-fast-text{
        display: block;
        font-weight:bold;
        font-size:0.9em;
    }
    .ps-dtype-normal-text{
      color:blue;
      display:block;
      border-bottom:1.1px solid blue;
    }
    .ps-dtype-fast-text{
      color:red;
      display:block;
      border-bottom:1.1px solid red;
      margin-right:15px;
    }
   table#ps-tbl_prices>thead th{
      border-bottom:none;
      padding:0px;
   }
   table#ps-tbl_prices>tbody td:last-child{
      border-left:1.2px solid #D2D9DA !important;
   }
   .ps-zones{
      font-size:0.9em;
   }
   .dd-label, .dd-value{
     font-size:0.8em; 
   }

   div.ps-zones{
     padding-top:10px;
     padding-bottom:5px;
     font-weight:bold;
     color:grey;
     font-size:0.9em;
     text-align:center;
   }
   .dd-field-container{
     width:100%;
   }
   .dd-field-container .dd-label{
      display:inline-block;
      color:grey;
      width:120px;
   }
   .dd-field-container .dd-value::before{
      content:':';
   }
   .ps-below-kg{
     padding:3px;
     text-align:center;
     font-weight:bold;
     color:#000;
     display:block;
     background-color:orange;
   }
   .ps-above-kg{
     padding:3px;
     text-align:center;
     font-weight:bold;
     color:#fff;
     display:block;
     background-color:green;
   }
   .ps-item-label{
      display:block;
      font-size:0.9em;
      font-weight:bold;
   }
   .has-error{
      border:1px solid red !important;
   }
   .ps-is-member>td{
     color:green;
   }
 </style>
 <div id="_sttn_priceSettingsComponent" style="width:auto;display:none;padding:15px;margin:15px 15px 15px">

  <div class="row">
     
     <div class="form-group col-lg-3">
        <div class="form-inline">
            <label class="control-label">Price list</label>&nbsp;&nbsp; <a href="javascript:void(0)" id="ps-lnk_add_price_list"><i class="fa fa-plus" style="color:green;font-size:0.9em"></i></a>&nbsp; <a href="javascript:void(0)" id="ps-lnk_delete_price_list"><i class="fa fa-trash" style="color:red;font-size:0.8em"></i></a> 
        </div>
         <div style="width:100%;display:flex;flex-direction:row">
            <select id="ps-filter_price_list" class="modal-select2" id=""></select>
            <button id="ps-lnk_merchant_list" type="button" class="btn btn-sm btn-default"><i class="fa fa-users"></i></button>
         </div>
     </div>
     
     <div class="form-group col-lg-3">
             <div class="form-inline">
                 <label class="control-label">&nbsp; </label>
            </div>
            <input id="ps_pl_search_merchant" type="text" class="form-control" placeholder="Search merchant">
     </div>

     <div class="form-group lg-3">
            <div class="form-inline">
                 <label class="control-label">&nbsp;</label>
            </div>
           <button id="ps-btnNewPriceZones" class="btn btn-default"><i class="fa fa-plus"></i> New Zones</button>
     </div>
  </div>

  <!--begin::priceSettings-body -->
  <div class="row">
      <div class="col-lg-12 flat-box">
          <table class="table" id="ps-tbl-prices">
             <thead>
                <tr>
                  <th><span class="ps-below-kg">Below 3 Kg</span></th>
                  <th><span class="ps-above-kg">Above 3 Kg</span></th>
                </tr>
             </thead>
             <tbody>
             </tbody>
          </table>
      </div> 
  </div> 
  <!--end::priceSettings-body -->

</div>    


 <!--begin::NewPriceLineDialog-->
 <div class="modal fade" id="_ps_dlgPriceLine" tabindex="-1" role="dialog" aria-labelledby="_ps_dlgPriceLineTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="_ps_dlgPriceLineTitle">Add Zones</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      <div class="modal-body">
          <div class="row">
             <div class="form-group col-lg-6">
                  <select id="_ps_newzone_zone" class="modal-select2"></select>
             </div>
             <div class="form-group col-lg-6">
                <button type="button" id="_ps_btnAddZone" class="btn btn-default"><i class="fa fa-plus"></i></button> 
             </div>
             <div class="form-group col-lg-12">
                <label for="" class="control-label">Zone codes</label> 
                <input id="_ps_newzone_zone_codes" class="form-control">
             </div>
          </div>
        </div>

      <div class="modal-footer">
         <span id="_ps_dlgPriceLine_error" class="error_text"></span> 
         <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i> Cancel</button>
         <button type="button" class="btn btn-success" id="_ps_dlgPriceLine_btnOK"><i class="fa fa-check" style="color:green"></i> Add</button>
      </div>
    </div>
  </div>
</div>
 <!--end::NewPriceLineDialog-->

  <!--begin::PriceListDialog-->
  <div class="modal fade" id="ps_dlgPriceList" tabindex="-1" role="dialog" aria-labelledby="ps_dlgPriceListTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ps_dlgPriceListTitle">Create Price List</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      <div class="modal-body">
          <div class="row">
             <div class="form-group col-lg-12">
                 <span class="simple-label">Price list name</span> 
                 <input type="text" class="form-control" id="ps-newpl_name">
             </div>
             <div class="form-group col-lg-12">
                 <span class="simple-label">Marker Weight (kg)</span> 
                 <input type="number" class="form-control" id="ps-newpl_kg_marker">
             </div> 
          </div>
        </div>

      <div class="modal-footer">
         <span id="ps_dlgPriceList_error" class="error_text"></span> 
         <button type="button" class="btn btn-warning" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i> Cancel</button>
         <button type="button" class="btn btn-success" id="ps_dlgPriceList_btnOK"><i class="fa fa-check" style="color:green"></i> Add</button>
      </div>
    </div>
  </div>
</div>
 <!--end::PriceListDialog-->

  <!--begin::MerchantListDialog-->
  <div class="modal fade" id="ps_dlgMerchantList" tabindex="-1" role="dialog" aria-labelledby="ps_dlgMerchantListTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ps_dlgMerchantListTitle">Merchant List</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-inline"><input id="ps-search_merchant" type="text" class="form-control">&nbsp;<button id="ps-btnSearchMerchant" type="button" class="btn btn-sm btn-default"><i class="fa fa-search"></i></button></div>  
          <table class="table" id="ps-tblMerchants">
            <thead>
               <tr>
                 <th>No</th>
                 <th>ID</th>
                 <th>Name</th>
                 <th>Phone Number</th>
                 <th><a href="javascript:void(0)" id="ps-lnkAddMerchant" class="btn btn-sm btn-outline-primary"><i class="fa fa-user-plus"></i></a></th>
               </tr>
            </thead>
             <tbody id="ps-tblMerchants_body" style="max-height:300px;overflow-y:auto">
                
             </tbody>
          </table>
        </div>

      <div class="modal-footer">
         <span id="ps_dlgMerchantList_error" class="error_text"></span> 
         <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times" style="color:red"></i> Close</button>
      </div>
    </div>
  </div>
</div>
 <!--end::MerchantListDialog-->

<script async="async" src="{{ asset('js/PriceSettingsComponent.js')}}"></script>


