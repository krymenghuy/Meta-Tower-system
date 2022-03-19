<style>
    div#_rpc_fields .simple-label{
        color:#CBD1D1;
        font-weight:0.01em;
    }
    div.pg-list_container{
        width:100%;
        border:1px solid #DFE3E3; 
        height:470px;
        flex:1;
        display:flex;
        flex-wrap: wrap;
        flex-direction:column;
        overflow-x:auto;
        border-radius:3px;
        background:#76767C;
    }
    div.pg-prop{
        width:100%;
        display:flex;flex-direction:row;
        border-bottom:1px solid #DFE3E3;
    }
    div.pg-prop:last{
        border-bottom:none;
    }
    span.pg-prop-label{
        width:45%;
        display:block;
        font-size:0.9em;
        color:#9DA1A1;
        padding-top:3px;
        padding-bottom:3px;
    }
    span.pg-prop-value{
        width:55%;
        display:block;
        font-size:0.9em;
        margin-top:auto;
        margin-bottom:auto;
    }
    div.pg-item{
        background:#fff;
        border:1px solid #DFE3E3;
        height:95%;
        width:300px;
        margin:5px;
        padding:10px;
        display:flex;
        flex-direction:column;
        border-radius:3px;
    }
    span.label-header-info{
        display:block;
        border-bottom:1.5px solid orange;
        font-family:'verdana','Arial';
        padding:10px;
    }
    span.label-header-text{
        font-weight:bold;
        display:inline-block;
    } 

</style>
<div id="_main_receivePackageComponent" style="display:none;padding:15px;margin-left:2px;">
    <div style="width:90%;display:flex;flex-direction:row;margin:auto;padding-bottom:15px;">
        <div class="form-inline" style="width:50%">
            <button id="_main_rpi_btnBack" role="button" class="btn btn-default"><i class="fa fa-angle-double-left"></i> Back</button>
            <!-- &nbsp;<button id="_main_rpi_btnOK_close" role="button" class="btn btn-outline-primary"><i class="fa fa-check"></i> Receive & Close</button>
            &nbsp;<button id="_main_rpi_btnOK_new" role="button" class="btn btn-outline-success"><i class="fa fa-check"></i> Receive & New</button> -->
        </div>
        <div style="width:50%">
           
        </div>
    </div> 

    <div style="width:90%;padding:10px;border:1.2px solid #D2DADA;border-radius:3px;margin:auto">
            <!--begin::header_fields--> 
            <div id="_rpc_header_fields">
                    <div class="col-lg-6">
                       <select id="_rpc_warehouse" class="modal-select2 data-input" style="margin-bottom:10px" data-field="warehouse_id"></select>
                    </div>
                    <div class="row">
                       <div class="col-lg-3">
                           <span class="label-header-info">ORDER ID:
                               <span class="label-header-text" id="_rpc_order_code"></span>
                           </span>
                       </div>
                       <div class="col-lg-3">
                           <span class="label-header-info">MERCHANT:
                             <span class="label-header-text" id="_rpc_sender_name"></span>
                             <!-- &nbsp; <button id="_rpc_lnkFindSender" type="button" class="btn btn-sm btn-outline-success"><i class="fa fa-search"></i></button> -->
                             &nbsp; <a id="_rpc_lnkFindSender" href="javascript:;"><i class="fa fa-search"></i></a>
                           </span>
                       </div>
                       <div class="col-lg-6">
                                    <span id="_rpc_success" style="font-weight:bold;color:green;display:block;margin:auto"></span>    
                                    <div class="form-inline" style="display:none;width:100%">
                                           <span class="badge badge-circle badge-danger" style="display:block;padding:3px;margin-top:25px"><i class="fas fa-exclamation"></i></span> &nbsp;<span id="_rpc_error" class="error_text" style="margin-top:25px"> some error here</span>
                                        
                                    </div>
                        </div>

                    </div><!--end::row-->
                    <div class="row" style="display:none">
                                <div class="col-lg-3">
                                    <span class="control-label">Delivery Time</span>
                                    <input id="_rpc_delivery_time" class="form-control data-input" data-field="delivery_date" data-select="datepicker">
                                </div>
                                <div class="col-lg-3">
                                </div>
                              
                    </div><!--end::row-->   
            </div>
            <!--end::header_fields-->
            <div style="height:15px"></div>
            <div id="_rpc_detail_panel" style="width:100%;margin-top:10px">
                    <div id="div_rpc_package_list" style="width:100%">
                        <div class="form-inline">
                            <!-- <input id="_rpc_search_package" class="input-sm" placeholder="Search phone"> &nbsp;
                            <button id="_rpc_btnSearchPackage" type="button" class="btn btn-sm btn-outline-primary"><i class="fa fa-sync-alt"></i></button> -->
                            &nbsp;<button id="_rpc_btnNewPackage" type="button" class="btn btn-sm btn-outline-success"><i class="fa fa-plus"></i> New Package</button>
                        </div>
                        <div id="_rpc_package_list_wrapper" class="pg-list_container" style="margin-top:5px;" > 
                        </div>
                    </div> 
                    <div id="_rpc_package_detail" class="border-style1" style="display:none">
                                <div class="row">
                                        <div class="form-group col-lg-3">
                                            <span class="control-label">Delivery Type</span>
                                            <select id="_rpc_delivery_type" class="form-control data-input" data-field="delivery_type">
                                                <option value="normal">Normal</option>
                                                <option value="fast">Fast</option>
                                            </select>
                                        </div>
                                        
                                        <div class="form-group col-lg-3">
                                            <span class="control-label">Zone</span>
                                            <select id="_rpc_zone_code" class="modal-select2 data-input" data-field="zone_code">
                                            </select>
                                        </div>

                                        <div class="form-group col-lg-3">
                                            <span class="control-label">Receiver Phone</span>
                                            <input type="number"  class="form-control data-input" data-field="receiver_phone">
                                        </div>
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Price</span>
                                            <input type="number" class="form-control data-input" data-field="price">
                                        </div>

                                        <div class="form-group col-lg-3">
                                            <span class="control-label">DFP</span>
                                            <select id="_rpc_df_payer" class="form-control data-input" data-field="df_payer">
                                                <option value="Sender">Sender</option>
                                                <option value="Receiver">Receiver</option>
                                            </select>
                                        </div>
 
                                        <div class="form-group col-lg-3">
                                            <span class="control-label">Receiver Address</span>
                                            <input class="form-control data-input" data-field="receiver_address">
                                        </div>
    
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">COD</span>
                                            <select id="_rpc_cod" class="form-control data-input" data-field="cod">
                                                <option value="0">No</option>
                                                <option value="1">Yes</option>
                                            </select>
                                        </div>
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Fees</span>
                                            <input id="_rpc_fees" type="number" class="form-control data-input" data-field="fees" readonly>
                                        </div> 

                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Base Fee</span>
                                            <input id="_rpc_base_fee" type="number" class="form-control data-input" data-field="base_fee" readonly>
                                        </div> 
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Additional Fee</span>
                                            <input id="_rpc_delivery_fee" class="form-control data-input" data-field="delivery_fee" readonly>
                                        </div>       
                                        
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Size</span>
                                            <input id="_rpc_size" class="form-control data-input" data-field="size">
                                        </div>
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Actual KG</span>
                                            <input id="_rpc_actual_kg" type="number" class="form-control data-input" data-field="actual_kg">
                                        </div>
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">Billed KG</span>
                                            <input id="_rpc_billed_kg" type="number" class="form-control data-input" data-field="billed_kg">
                                        </div>
                                        <div class="form-group col-lg-3">
                                            <span  class="control-label">COD Fee</span>
                                            <input id="_rpc_cod_fee" type="number" class="form-control data-input" data-field="cod_fee" readOnly>
                                        </div>
                                        <div class="form-group col-lg-12">
                                                <div class="form-inline" style="margin-top:35px">
                                                    <button id="_rpc_package_detail_btnClose" role="button" class="btn btn-default"><i class="fa fa-times" style="color:red"></i> Close</button>
                                                    &nbsp;<button id="_rpc_package_detail_btnSaveClose" role="button" class="btn btn-outline-primary"><i class="fa fa-check"></i> Save & Close</button>
                                                    &nbsp;<button id="_rpc_package_detail_btnSaveNew" role="button" class="btn btn-outline-success"><i class="fa fa-check"></i> Save & New</button>
                                                </div>
                                        </div>
                                    </div><!--end::row-->
                    </div><!--end::_rpc_package_Detail-->
            </div>
            
    </div>
</div>
<script  src="{{ asset('js/ReceivePackageComponent.js') }}"></script>
