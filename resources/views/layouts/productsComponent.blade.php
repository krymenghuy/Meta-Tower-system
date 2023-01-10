<div id="_main_productsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <input type="search" class="form-control" id="_pcd_search"/>
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                </div>
                <button class="btn btn-outline-primary py-1 px-2" type="button">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="container-fluid d-flex align-items-center justify-content-end">
                <button id="_pdc_btnNew"class="vs-btn-custom-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.New Product"></span>
                </button>
            </div>
        </div>
        <div>
             <table class="table header-light-blue header-uppercase" id="_pdc_tblItem"></table>
        </div>
    </div>
</div>

<div id="_pcd_dlgProduct" class="modal fade" tabindex="-1" aria-labelledby="_pcd_dlgProduct_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pcd_dlgProduct_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                      <div class="forn-group col-lg-6">
                          <span class="simple-label trans-text" id="_pcd_item_code" data-langprop="item.Item Code">Item Code</span>
                          <input placeholder="Auto" type="text" data-field="code" data-ffield="Item code" class="form-control data-input" readOnly>
                     </div>
                     <div class="forn-group col-lg-6">
                          <span class="simple-label trans-text" data-langprop="item.Item Name">Item Name</span>
                          <input type="text" data-required="1" data-field="name" data-ffield="Item name" class="form-control data-input">
                     </div>

                     <div class="forn-group col-lg-6">
                          <span class="simple-label trans-text" data-langprop="item.Description">Description</span>
                          <input type="text" data-field="description" data-ffield="Description" class="form-control data-input">
                     </div>

                     <div class="forn-group col-lg-6">
                          <span class="simple-label trans-text" data-langprop="item.Group">Item Group</span>
                           <select id="_pcd_item_group" data-required="1" class="modal-select2 form-select data-input" data-field="group_id" data-ffield="Item group"></select>
                     </div>

                     <div class="forn-group col-lg-6">
                          <span class="simple-label trans-text" data-langprop="item.SKU">SKU</span>
                           <select id="_pcd_item_unit" data-required="1" class="modal-select2 form-select data-input" data-field="unit_id" data-ffield="SKU"></select>
                     </div>
                     <div class="forn-group col-lg-12">
                        <div class="dialog-error" id="_pcd_dlgProduct_error">
                        </div>
                     </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_pcd_dlgProduct_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>