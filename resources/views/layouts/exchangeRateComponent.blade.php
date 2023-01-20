<div id="_main_exchangeRateComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_ecr_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text" data-langprop="buttons.Add New"></span>
                </div>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
            <table class="table" id="_ecr_tblexchangeRate"></table>
        </div>
    </div>
</div>

<!--Begin::ExchangRateDialog-->
<div id="_ecr_dlgexchangeRate" class="modal fade" tabindex="-1" aria-labelledby="_ecr_dlgexchangeRate_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_ecr_dlgexchangeRate_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="currencies.Code"></label>
                        <input type="text" class="form-control data-input" data-field="code" data-required="1" data-ffield="Code" placeholder="code"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="currencies.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="name"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="cur_symbol" class="form-label trans-text" data-langprop="currencies.Symbol"></label>
                        <input type="text" class="form-control data-input" data-field="cur_symbol" data-required="1" data-ffield="Symbol" placeholder="symbol"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="symbol_after" class="form-label trans-text" data-langprop="currencies.Symbol After"></label>
                        <select class="form-select data-input" data-field="symbol-after" data-required="1" data-ffield="Symbol After">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
                <div class="dialog-error" id="_ecr_dlgexchangeRate_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_ecr_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::ExchangeRateDialog-->

<!--Begin::ExchangeRateDetailsDialog-->
<div id="_ecr_dlgExchangeRate_detail" class="modal fade" tabindex="-1" aria-labelledby="_ecr_dlgExchangeRate_detail_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_ecr_dlgExchangeRate_detail_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-12">
                        <label for="date" class="form-label trans-text" data-langprop="currencies.Date"></label>
                        <input data-select="datepicker" class="form-control input-data" data-field="date" data-required="1" data-ffield="Date"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="co-12">
                        <label for="buy_rate" class="form-label trans-text" data-langprop="currencies.Buy Rate"></label>
                        <input type="number" class="form-control input-data" data-field="buy_rate" data-required="1" data-ffield="Buy Rate"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-12">
                        <label for="sell_rate" class="form-label trans-text" data-langprop="currencies.Sell Rate"></label>
                        <input type="number" class="form-control input-data" data-field="sell_rate" data_required="1" data-ffield="Sell Rate"/>
                    </div>
                </div>
                <div class="dialog-error" id="_ecr_dlgExchangeRate_detail_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_ecr_detail_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--End::ExchangeRateDetailsDialog-->