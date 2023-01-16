<div id="_main_itemsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <input type="search" class="form-control" id="_itm_search"/>
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                </div>
                <button class="btn btn-outline-primary py-1 px-2" type="button">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="container-fluid d-flex align-items-center justify-content-end">
                <button id="_itm_btnNew" class="vs-btn-custom-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.New Product"></span>
                </button>
            </div>
        </div>
        <div>
             <table class="table header-light-blue header-uppercase" id="_itm_tblItem"></table>
        </div>
    </div>
</div>

<div id="_itm_dlgProduct" class="modal fade" tabindex="-1" aria-labelledby="_itm_dlgProduct_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_itm_dlgProduct_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                     <div class="forn-group col-lg-12">
                           <span class="simple-label"><span class="trans-text" data-langprop="item.General Name"></span>&nbsp; <a href="javascript:void(0)" id="_itm_lnkAddGroup"><i class="fa fa-plus-circle" style="color:green"></i></a></span>
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
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_itm_dlgProduct_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>