<div id="_main_itemsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center gap-2 ms-3">
                <div class="input-group flex-nowrap">
                    <input type="search" class="form-control" id="_itm_search" style="min-width:250px"/>
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                    &nbsp;
                    <div>
                        <select class="modal-select2 form-select" id="_itm_filter_category" style="min-width:250px"></select>
                    </div>
                </div>
                <button class="btn btn-outline-primary py-1 px-2" type="button">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="container-fluid d-flex align-items-center justify-content-end">
                <button id="_itm_btnNew" class="vs-btn-custom-primary" type="button">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-plus me-1"></i>
                        <span class="trans-text" data-langprop="buttons.Add New"></span>
                    </div>
                </button>
            </div>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
             <table class="table header-light-blue header-uppercase" id="_itm_tblItems"></table>
        </div>
    </div>
</div>

<div id="_itm_dlgProduct" class="modal fade" tabindex="-1" aria-labelledby="_itm_dlgProduct_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_itm_dlgProduct_title"></h4>
            </div>
            <div class="modal-body d-flex">
              <div class="d-flex col-6">
                        <div class="row gy-2 py-2">
                                <div class="forn-group col-lg-12">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.General Name"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddGroup"><i class="fa fa-plus-circle" style="color:green;font-size:0.8em"></i></a> 
                                      &nbsp; <a href="javascript:void(0)" id="_itm_lnkEditGroup"><i class="fa fa-edit" style="color:grey;font-size:0.8em"></i></a>
                                      &nbsp; <a href="javascript:void(0)" id="_itm_lnkDeleteGroup"><i class="fa fa-trash" style="color:red;font-size:0.8em"></i></a>
                                    </span>
                                    <select id="_itm_item_group" data-required="1" class="modal-select2 form-select data-input" data-field="group_id" data-ffield="Item group"></select>
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label trans-text" id="_itm_item_code" data-langprop="item.Item Code">Item Code</span>
                                    <input placeholder="Auto" type="text" data-field="code" data-ffield="Item code" class="form-control data-input">
                                </div>
                                <div class="forn-group col-lg-6">
                                    <span class="simple-label trans-text" data-langprop="item.Item Name">Item Name</span>
                                    <input type="text" data-required="1" data-field="name" data-ffield="Item name" class="form-control data-input">
                                </div>
            
                                <div class="forn-group col-lg-12">
                                    <span class="simple-label trans-text" data-langprop="item.Description">Description</span>
                                    <input type="text" data-field="description" data-ffield="Description" class="form-control data-input">
                                </div>

                                <div class="forn-group col-lg-12">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.Category"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddCategory"><i class="fa fa-plus-circle" style="color:green"></i></a></span>
                                    <select id="_itm_item_category" data-required="1" class="modal-select2 form-select data-input" data-field="category_id" data-ffield="Category"></select>
                                </div>
                                
                                <div class="forn-group col-lg-12" id="_itm_detail_type_panel" style="display:none">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.Detail Type"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddDetailType"><i class="fa fa-plus-circle" style="color:green"></i></a></span>
                                    <select id="_itm_item_detail_type" data-required="1" class="modal-select2 form-select data-input" data-field="detail_type_id" data-ffield="Detail type"></select>
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.SKU"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddUnit"><i class="fa fa-plus-circle" style="color:green"></i></a></span>
                                    <select id="_itm_item_unit" data-required="1" class="modal-select2 form-select data-input" data-field="unit_id" data-ffield="SKU"></select>
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label trans-text" data-langprop="item.Brand Name">Brand Name</span>
                                    <input type="text" id="_itm_brand_name" class="form-control data-input" data-field="brand_name" data-ffield="Brand name"/>
                                </div>

                                <div class="forn-group col-lg-6">
                                <span class="simple-label"><span class="trans-text" data-langprop="item.Manufacturer"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddManufacturer"><i class="fa fa-plus-circle" style="color:green"></i></a></span>
                                    <select id="_itm_item_manufacturer" data-required="1" class="modal-select2 form-select data-input" data-field="manufacturer_id" data-ffield="Manufacturer"></select>
                                </div>
            
                                <div class="forn-group col-lg-12">
                                    <div class="dialog-error" id="_itm_dlgProduct_error">
                                    </div>
                                </div>
                            </div>     
              </div>

              <div class="d-flex col-6">
                        <div class="row">
                                <div class="forn-group col-lg-6">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.Cost"></span> 
                                    <input type="number" class="form-control data-input" data-field="cost" data-ffield="Cost" value="0"> 
                                </div>
                                <div class="forn-group col-lg-6">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.Retail Price"></span> 
                                    <input type="number" class="form-control data-input" data-field="selling_price" data-ffield="Retail price" value="0"> 
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label text-nowrap"><span class="trans-text" data-langprop="item.Wholesale Price"></span> 
                                    <div>  <input type="number" class="form-control data-input" data-field="ws_selling_price" data-ffield="Wholesale price" value="0"></div> 
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label text-no-wrap"><span class="trans-text" data-langprop="item.Sales tax"></span> 
                                   <div> <input type="number" class="form-control data-input" data-field="sales_tax_rate" data-ffield="Sales tax" value="0"></div> 
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label"><span class="trans-text" data-langprop="item.Cost Account"></span> 
                                  <div>  <select class="modal-select2 data-input" data-field="cost_account_id" data-ffield="Cost account"></select> </div>
                                </div>
 
                                <div class="forn-group col-lg-6">
                                    <span class="simple-label text-nowrap"><span class="trans-text" data-langprop="item.Revenue Account"></span> 
                                   <div> <select  class="modal-select2" data-field="revenue_account_id" data-ffield="Revenue account"></select> </div>
                                </div>

                                <div class="forn-group col-lg-6">
                                    <span class="simple-label text-nowrap"><span class="trans-text" data-langprop="item.Inventory Account"></span> 
                                   <div> <select  class="modal-select2" data-field="inventory_account_id" data-ffield="Inventory account"></select></div> 
                                </div>
 
                                <div class="forn-group col-lg-6">
                                    <span class="simple-label text-nowrap"><span class="trans-text" data-langprop="item.Tax account"></span> 
                                   <div> <select  class="modal-select2" data-field="tax_account_id" data-ffield="tax account"></select> </div>
                                </div>
                        </div>            
              </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_itm_dlgProduct_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>