<style>
    .inner-item-table th{
       font-size:0.9em;
       font-weight:bold;
       border-bottom:1.2px dashed #C7CD39 !important;
       color:#409CBF !important;
       padding:10px !important;
    }
    .inner-item-table>tbody td{
       padding:10px;
    }
    .stock-items-panel{
        border:1.1px solid #4797C2;
        border-radius:5px;
        padding:10px !important;
    }
    #_stk_tblItems>tr.row-expanded td{
        font-weight:bold;
    }
</style>

<div id="_main_stockTrackingComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center w-100" style="overflow-x:auto; overflow-y:hidden">
            <div class="d-flex align-items-center gap-2 ms-3">
                <div class="input-group flex-nowrap">
                    <input type="search" class="form-control" id="_stk_search" placeholder="Search item" style="min-width:250px"/>
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                    &nbsp;
                    <div>
                        <select class="modal-select2 form-select" id="_stk_filter_category"></select>
                    </div>
                    &nbsp;
                    <div>
                       <select class="modal-select2 form-select" id="_stk_filter_class"></select>
                    </div>
                </div>
                <button class="btn btn-outline-primary py-1 px-2" type="button" id="_stk_dlg_filter">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="container-fluid d-flex align-items-center justify-content-end gap-2">
                <button class="vs-btn-custom-primary" type="button" id="_stk_btnNew_ReceiveStock">
                    <span class="trans-text text-nowrap" data-langprop="buttons.Receive Stock"></span>
                </button>
            </div>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_stk_tblItems"></table>
        </div>
    </div>
</div>

<!--Begin::FilterDialog-->
<div id="_stk_dlgFilterStockTracking" class="modal fade" tabindex="-1" aria-labelledby="_stk_dlgFilterStockTracking_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content vs-modal-dialog">
            <div class="modal-header">
                <h4 class="modal-title trans-text" data-langprop="inventory.Filter Stock"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-3 d-flex justify-content-end">
                        <p class="text-nowrap trans-text" data-langprop="inventory.Warehouse"></p>
                    </div>
                    <div class="col-lg-9">
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <p class="trans-text text-nowrap" data-langprop="inventory.Block"></p>
                    </div>
                    <div class="col-lg-9">
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <p class="trans-text text-nowrap" data-langprop="inventory.Class"></p>
                    </div>
                    <div class="col-lg-9">
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <p class="trans-text text-nowrap" data-langprop="inventory.Category"></p>
                    </div>
                    <div class="col-lg-9">
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-3">
                        <p class="trans-text text-nowrap" data-langprop="inventory.Group"></p>
                    </div>
                    <div class="col-lg-9">
                        <select class="modal-select2"></select>
                    </div>
                </div>
                <div class="_stk_dlgFilterStockTracking-error" id="_stk_dlgFilterStockTracking_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_stk_dlgFilterStockTracking_btnOK">
                    <span class="trans-text" data-langprop="buttons.OK"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::FilterDialog-->

<!--Begin::ReceiveStock-->
<div id="_stk_dlgReceiveStock" class="modal fade" tabindex="-1" aria-labelledby="_stk_dlgReceiveStock_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title trans-text" data-langprop="inventory.Receive Stock"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="po" class="form-label trans-text" data-langprop="inventory.PO"></label>
                        <input type="text" class="form-control data-input" data-field="po" data-required="1" data-ffield="PO" placeholder="PO"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="vendor" class="form-label trans-text" data-langprop="inventory.Vendor"></label>
                        <select class="modal-select2 data-input" data-field="vendor" data-required="1" data-ffield="Vendor" id="_stk_select_vendors" placeholder="vendor"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="warehouse" class="form-label trans-text" data-langprop="inventory.Warehouse"></label>
                        <select class="modal-select2 data-input" data-field="warehouse" data-required="1" data-ffield="Warehouse" placeholder="Warehouse" id="_stk_select_warehouse"></select>
                    </div>
                    <div class="col-lg-6">
                        <label for="class_stock" class="form-label trans-text" data-langprop="inventory.Warehouse"></label>
                        <select class="modal-select2 data-input" data-field="class_stock" data-required="1" data-ffield="Class of Stock" placeholder="class of stock" id="_stk_select_class_stock"></select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="date" class="form-label trans-text" data-langprop="inventory.Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="date" data-required="1" data-ffield="Date"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="description" class="form-label trans-text" data-langprop="inventory.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="1" data-ffield="Description"></textarea>
                    </div>
                </div>
                <div class="py-2" id="_stk_div_items_panel"></div>
                <div class="_stk_dlgReceiveStock-error" id="_stk_dlgReceiveStock_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_stk_dlgReceiveStock_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::ReceiveStock-->