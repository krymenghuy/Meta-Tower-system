<div id="_main_stockTransferComponent" class="mobile-padding" style="display:none; padding-top:15px">
    <div class="d-flex align-items-center px-3">
        <button class="btn btn-primary" type="button" id="_st_btnNew">
            <span class="trans-text" data-langprop="buttons.Transfer Stock"></span>
        </button>
    </div>
    <div class="table-responsive mt-3">
        <table class="table" id="_st_tblStockTransfer"></table>
    </div>
</div>

<div id="_st_dlgStockTransfer" class="modal fade" tabindex="-1" aria-labelledby="_st_dlgStockTransfer_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-title fs-5" id="_st_dlgStockTransfer_title">Transfer Stock</div>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-4">
                        <label for="date" class="form-label trans-text" data-langprop="item.Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="date"/>
                    </div>
                    <div class="col-lg-4">
                        <label for="item_code" class="form-label trans-text" data-langprop="item.Item Code"></label>
                        <input type="text" class="form-control data-input" data-field="item_code"/>
                    </div>
                    <div class="col-lg-4">
                        <label for="qty" class="form-label trans-text" data-langprop="item.Qty"></label>
                        <input type="number" class="form-control data-input" data-field="qty"/>
                    </div>
                </div>
                <div class="row gy-2 mt-2">
                    <div class="col-lg-4">
                        <label for="from" class="form-label trans-text" data-langprop="item.From"></label>
                        <select class="modal-select2 data-input" data-field="from"></select>
                    </div>
                    <div class="col-lg-4">
                        <label for="to" class="form-label trans-text" data-langprop="item.To"></label>
                        <select class="modal-select2 data-input" data-field="to"></select>
                    </div>
                    <div class="col-lg-4">
                        <label for="by" class="form-label trans-text" data-langprop="item.By"></label>
                        <select class="modal-select2 data-input" data-field="by"></select>
                    </div>
                </div>
                <div class="row gy-2 mt-2">
                    <div class="col-lg-12">
                        <label for="remark" class="form-label trans-text" data-langprop="item.Remark"></label>
                        <textarea class="form-control data-input" data-field="remark"></textarea>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_st_dlgStockTransfer_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>