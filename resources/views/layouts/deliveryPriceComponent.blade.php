<style>
   .po-fixed{
     font-size:1.1em;
     font-weight:bold;
     color:orange;
     display:block
   }
   .po-per_kg{
     font-size:1.1em;
     font-weight:bold;
     color:green;
     display:block
   }
   .po-cod_fee_percent , .po-cod_sender{
     font-size:1.5em;
     outline:none;
     font-weight:bold;
     --webkit-outline:none;
   }
   span.cod-info-text{
      display:block;
      font-size:1em;
      width:100%;
   }
   select.newprice-delivery_type{
        --webkit-outline:none;
        border:none;
        border-bottom:1.2px solid grey;
        outline:none;
        font-size:1.2em;
        font-weight:bold;
        display:block;
        width:100%;
   } 
   @keyframes border_ani{
      from{
        transform:scale(0);
      }
      to{
        transform:scale(1.2);
      }
   }
   select.newprice-delivery_type:hover{
      border-bottom:1.5px solid green;
      animation-name:border_ani;
      transition-property:border-bottom, transform 0.5s ease-in;
   }

   div.price-zone-list, div.price-sender-list{
     height:350px;
     display:block;
     border:1px inset #DCE0DD;
     overflow-y:auto;
   }
   table.price-innter-table{
     background:#fff;
   }
   table.price-innter-table th td{
     background:#fff !important;
     border:none;
   }
   table.price-innter-table{
     width:50% !important;
   }
   .price-inner-title{
     color:#CECFC1 !important;
     font-size:1.1em !important;
   }
</style>
<div id="_sttn_deliveryPriceComponent" style="width:auto;display:none;padding:15px;margin:15px 15px 15px">
   <div class="row">
      <div class="col-lg-12" id="_sttn_price_container">
             <div class="tab-view" id="_sttn_priceTabView">
                <div class="tab-header">
                  <a href="#" class="tab-button" data-viewname="prices" data-target="_sttn_tabpanel_prices">PRICES BY ZONE</a>
                  <a href="#" class="tab-button" data-viewname="price_script" data-target="_sttn_tabpanel_price_script">PRICES SCRIPT</a>
                  
                  <a href="#" class="tab-button" data-viewname="other_fees" data-target="_sttn_tabpanel_other_fees">COD FEE</a>
                  <a style="display:none" href="#" class="tab-button" data-viewname="promotions" data-target="_sttn_tabpanel_promotions">PROMOTIONS</a> 
                </div><!--end::tab-header-->
                
                <div class="tab-body">
                    <div class="tab-panel border-style1" id="_sttn_tabpanel_prices" style="height:650px;padding:10px" data-viewname="prices">
                               <div style="display:flex;flext-direction:row">
                                    <div class="form-inline" id="_dl_d_filter_panel">
                                        <div class="v-control-group">
                                            <span class="v-label">Type</span>
                                            <select id="_sttn_price_filter_dtype" class="v-select form-control price_filter_field" autocomplete="off">
                                              <option value="Normal">Normal</option>
                                              <option value="Fast">Fast</option>
                                            </select> &nbsp;
                                        </div> &nbsp;&nbsp; 
                                        <div class="v-control-group">
                                          <span class="v-label">Zone</span>
                                            <select id="_sttn_price_filter_zone" class="modal-select2 price_filter_field"></select>&nbsp;
                                        </div>&nbsp;&nbsp;
                                        <div class="v-control-group">
                                          <span class="v-label">Sender</span>
                                            <select id="_sttn_price_filter_sender" class="modal-select2 price_filter_field"></select>&nbsp;
                                        </div>&nbsp;&nbsp; 
                                    </div>
                                
                                    <div style="display:block;margin-left:25px;">
                                        <span style="display:block">&nbsp;</span>
                                        <a id="_sttn_price_lnkNewPrice" href="#" class="btn btn-sm btn-outline-primary btn-hover"><i class="fas fa-plus"></i> New Price Line</a>
                                    </div>

                                </div>  
                                <div id="_sttn_tblPrices_wrapper" style="width:100%">
                                     <table id="_sttn_price_tblPrices" class="table fixed-body-table">
                                        <thead>
                                            <tr>
                                              <th>Merchants</th>
                                              <th>Zones</th>
                                              <th>Delivery Type</th> 
                                              <th>Weight Range</th> 
                                              <th>Base Fee</th>                               
                                              <th>Additional</th>
                                              <th>Price Per Kg</th>
                                              <th>Price Option</th>
                                              <th><i class="fa fa-tasks" style="color:green"></i></th>
                                            </tr>
                                        </thead>
                                      <tbody id="_sttn_price_tblPrices_body" style="max-height:350px">
                                      </tbody>
                                    </table>
                                </div>
                    </div>
                    <div  class="tab-panel border-style1" id="_sttn_tabpanel_price_script" style="height:650px;padding:10px" data-viewname="price_script">
                         <div clss="form-group col-lg-6">
                              <span class="simple-label">Price Script</span> 
                              <textarea id="_sttn_price_script_text" class="form-control" style="width:100%;min-height:200px"></textarea>
                              <div class="form-inline" style="margin-top:10px">
                                  <button type="button" id="_sttn_btnGetSample" class="btn btn-sm btn-default"> <i class="fa fa-code"></i> Get Sample</button> 
                                  &nbsp;&nbsp;<button type="button" id="_sttn_btnRunScript" class="btn btn-sm btn-primary"> <i class="fa fa-exchange-alt"></i> Translate</button>
                                  &nbsp;&nbsp;<button type="button" id="_sttn_btnImportScript" class="btn btn-sm btn-success"> <i class="fa fa-file-import"></i> Import</button>  
                                  &nbsp;&nbsp;<span class="error_text" id="_sttn_script_error"></span>
                              </div>
                         </div>
                          <div clss="form-group col-lg-6">
                              <span class="simple-label">Meaning</span>
                              <div id="_sttn_price_script_meaning" class="flat-box" style="width:100%;min-height:250px;padding:10px"></div>
                          </div>
                    </div> <!--end:: tab-panel. PRICE SCRIPT -->
                    <div class="tab-panel border-style1" id="_sttn_tabpanel_other_fees" style="height:650px;padding:10px" data-viewname="other_fees">
                        <div class="row">
                            <div class="col-lg-12" style="margin:35px">
                                  <div id="_sttn_tblcods_wrapper" style="width:100%">
                                        <div class="display:flex;flex-direction:row">
                                            <div class="buttons" style="float:left">
                                                 <div class ="form-inline">
                                                     <button type="button" id="_sttn_btnNewCOD" class="btn btn-outline-primary"><i class="fa fa-plus"></i> New COD Charge</button>
                                                      <select class="select2 form-control" id="_sttn_filter_cod_sender" style="margin-left:30px"></select>
                                                      <select class="form-control" id="_sttn_filter_cod_dtype" style="margin-left:25px">
                                                         <option value="Normal">Normal</option>
                                                         <option value="Fast">Fast</option>
                                                      </select>
                                                 </div>
                                                
                                            </div>
                                            <!-- <div style="float:right">
                                               <input class="form-control" id="_sttn_cod_search" placeholder="Search name, delivery type">
                                            </div> -->
                                           
                                        </div> 
                                       <div class="dms-flat-box" style="padding:10px">
                                         <table id="_sttn_price_tblcods" class="table" style="width:90%">
                                            <thead>
                                                <tr>
                                                  <th>Merchant</th>
                                                  <th>Delivery Type</th> 
                                                  <th>COD Fee</th>
                                                  <th>Remarks</th>            
                                                  <th><i class="fa fa-tasks" style="color:green"></i></th>
                                                </tr>
                                            </thead>
                                          <tbody id="_sttn_price_tblcods_body" style="max-height:390px">
                                          </tbody>
                                        </table>
                                       </div>
                                    </div>
                            </div>
                                  
                           <!-- <div class="col-lg-6" style="margin:35px">
                               <h3>What is COD Fee Charge?</h3>
                               <span class="cod-info-text">COD Fee Charge is the fee charge by carrier company to Vendor or Sender. The charge is normally 0.05% of total transaction amount of a package being delivered</span> 
                           </div> -->
                           <!-- <div class="col-lg-6" style="margin:35px">     
                               <h3>COD Fee Rate</h3>
                               <input type="number" class="form-control po-cod_fee_percent" id="_sttn_CODFeeChargePercent" value="0">
                               <div style="height:15px"></div>
                               <button id="_sttn_btnSaveCODCharge" type="button" class="btn btn-success"> Save Changes</button>
                           </div> -->
                        </div>
                    </div>
                      
                    <div class="tab-panel border-style1" id="_sttn_tabpanel_promotions" style="height:650px;padding:10px" data-viewname="promotions">  
                       <div class="form-inline"><button id="_sttn_btnNewBaseFee" class="btn btn-primary"><i class="fa fa-plus"></i> New Promotion</button></div>  
                       <table id="_sttn_tblBaseFees" class="table fixed-body-table"></table>  
                    </div>
                </div>
                  
            </div><!--end::tab-view-->
             
             <div id="sttn_price_line_panel" style="display:none;height:500px">
                                  <div class="row">
                                    <div class="col-lg-12">
                                      <div class="form-inline">
                                          <a href="#" id="_sttn_btnBack"><i class="fa fa-angle-double-left" style="color:grren"></i> Back</a>
                                      </div>
                                      <div class="div-line" style="border-color:red;width:50%"></div>
                                    </div>
                                  </div>

                                  <div class="row">
                                     <div class="col-lg-6">
                                             <span class="simple-label" style="color:#C5DAD6;margin-bottom:5px">Delivery Type</span>
                                              <select class="data-input newprice-delivery_type" data-field="delivery_type" id="_sttn_newprice_filter_delivery_type">
                                                  <option value="Normal">Normal</option>
                                                  <option value="Fast">Fast</option>
                                              </select>
                                      </div>
                                  </div>
                                  
                                      <div class="row"> 
                                           <div class="col-lg-6">
                                                  <div class="row">
                                                          <div class="col-lg-6">
                                                            <span class="simple-label">Base Fee</span>
                                                            <input type="number" class="form-control data-input" data-field="base_fee" id="_sttn_newprice_base_fee">
                                                          </div>

                                                          <div class="col-lg-6">
                                                                <span class="simple-label">KG Range<span class="text-muted"> (-1 means Below or Above)</span></span>
                                                                <div style="display:flex;flex-direction:row">
                                                                    <input type="number" class="form-control data-input" data-field="start_kg"  id="_sttn_newprice_start_kg" placeholder="From(-1 means Below)">&nbsp;
                                                                    <input type="number" class="form-control data-input" data-field="end_kg" id="_sttn_newprice_end_kg"  placeholder="To(-1 means Above)">
                                                                </div>      
                                                          </div>
                                                  </div>

                                                  <div class="row">  
                                                            <div class="col-lg-6">
                                                                <span class="simple-label">Price Option</span>
                                                                <select class="form-control data-input" data-field="price_option" id="_sttn_newprice_price_option">
                                                                    <option value="fixed">Fixed Price</option>
                                                                    <option value="per_kg">Per KG</option>
                                                                </select>
                                                             </div>

                                                          <div class="col-lg-6">
                                                                <div id="_sttn_price_per_kg_field" style="display:none"> 
                                                                   <span class="simple-label">Price Per KG</span>
                                                                   <input type="number" class="form-control data-input" data-field="price_per_kg" id="_sttn_newprice_price_per_kg" placeholder="price per kg" value="0">
                                                                </div>
                                                                <div id="_sttn_fixed_price_field" style="display:none"> 
                                                                    <span class="simple-label">Additional Fee</span>
                                                                    <input type="number" class="form-control data-input" data-field="delivery_fee" id="_sttn_newprice_delivery_fee" value="0" placeholder="fixed price">
                                                                </div> 
                                                          </div>
                                                  </div>    
                                                  
                                                     <div class="row">
                                                          <div class="col-lg-6">
                                                                  <span class="simple-label">ZONES</span>   
                                                                  <div style="height:5px;"></div>
                                                                  <div id="_sttn_newprice_zone_list"></div>
                                                          </div>  
                                                          <div class="col-lg-6">
                                                                  <span class="simple-label">MERCHANTS / VENDORS</span>
                                                                  <div style="height:5px;"></div>
                                                                  <div id="_sttn_newprice_sender_list"></div>
                                                          </div>
                                                      </div>
                                                </div>   
                                          </div><!--end:col-lg-6-->
                                          <div class="col-lg-6" style="display:grey">
                                              <div style="float:left;margin-top:15px"><span id="_sttn_price_error" class="error_text"></span></div> 
                                              <div style="float:right;margin-top:15px">
                                                    <button id="_sttn_btnBack1" class="btn btn-outline-primary"><i class="fa fa-angle-double-left" style="color:grey"></i> Back</button> 
                                                    &nbsp; &nbsp;
                                                    <button id="_sttn_btnSavePrice" class="btn btn-outline-success"><i class="fa fa-save"></i> <span style="color:green">Save</span></button>
                                            </div>
                                          </div>
                                        
                                  </div> 

                                  <div class="row" style="margin-top:15px">
                                     <div class="col-lg-12">    
                                     </div>
                                  </div>     
             </div>

      </div><!--end::col-lg-12-->
    </div>


<!--begin::CODDialog-->
<div class="modal fade" id="_sttn_cod_dlgcod" tabindex="-1" role="dialog" aria-labelledby="_sttn_cod_dlgcod_title" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_sttn_cod_dlgcod_title">NEW COD CHARGE</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
         </button>
      </div>
      <div class="modal-body">
           <div class="row">
              <div class="col-lg-6">
                  <label   class="col-form-label">Delivery Type</label>
                    <select class="form-control data-input" data-field="delivery_type">
                      <option value="Normal">Normal</option>
                      <option value="Fast">Fast</option>
                    </select>
              </div>
              <div class="col-lg-6">
                    <label   class="col-form-label">Merchant</label>&nbsp;<a href="#" id="_sttn_cod_lnkFindSender"><i class="fa fa-search" style="color:green"></i></a>
                    <input id="_sttn_cod_sender_name" type="text" class="form-control data-input" data-field="sender_name" placeholder="Merchant name">
              </div>
          </div> 
          <div class="row">
              <div class="col-lg-6">
                    <label   class="col-form-label">COD Fee (%)</label>
                    <input type="number" class="form-control data-input" data-field="cod_fee_percent">
              </div>
              <div class="col-lg-6">
                  <label   class="col-form-label">Remarks</label>
                  <input type="text" class="form-control data-input" data-field="remarks">
              </div>
          </div>
      </div>
      <div class="modal-footer">
         <span class="error_text" id="_sttn_cod_error"></span>&nbsp;&nbsp;
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-primary" id="_sttn_cod_btnOK">OK</button>
      </div>
    </div>
  </div> 
  </div>    
<script async="async" src="{{ asset('js/DeliveryPriceComponent.js') }}"></script>
