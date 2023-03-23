<div id="_main_exchangeRatesComponent" style="display:none; padding:35px;">
    <div>
        <div class="row d-flex gx-1 custom-bootstrap">
            <div class="col-1">
                <button class="btn btn-primary height" type="button" id="_ecr_btnNew">
                    <span class="text-nowrap">Add Rate</span>
                </button>
            </div>
            <div class="col-3">
                <select class="modal-select2 height" id="_ecr_list_select"></select>
            </div>
            <div class="col-3">
                <div class="input-group flex-nowrap">
                    <select class="modal-select2 height" id="_ecr_list_pair">
                        <option value="USDKHR">USD-KHR</option>
                    </select>
                    <div class="input-group-text d-none" id="_ecr_currency">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-responsive mt-3 border-1 border-success">
            <table class="table header-uppercase" id="tbl_ecr_exchangeRate">
            </table>
        </div>
    </div>
</div>

<div id="_ecr_dlgExchangeRate" class="modal fade" tabindex="-1" aria-labelledby="_ecr_dlgExchangeRate_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-flex align-items-center">
                    <h4 class="modal-title" id="_ecr_dlgExchangeRate_title"></h4>
                    <div class="px-2">
                        <span id="_ecr_currency_pair" class="p-2 border border-primary rounded"></span>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-12">
                        <label for="date" class="form-label">Currency</label>
                        <div>
                            <select class="modal-select2 form-control data-input" data-field="currency_pair" data-required="1" data-ffield="Currency pair">
                                <option value="USDKHR">USD-KHR</option>
                            </select>
                        </div>
                    </div>

                    <div class="col-12">
                        <label for="date" class="form-label">Date</label>
                        <div>
                            <input data-select="datepicker" class="form-control data-input" data-field="x_date" data-required="1" data-ffield="Date"/>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="buy" class="form-label">Buy</label>
                        <div>
                            <input type="number" class="form-control data-input" data-field="buy_rate" data-required="1" data-ffield="Buy rate"/>
                        </div>
                    </div>
                    <div class="col-12">
                        <label for="sell" class="form-label">Sell</label>
                        <div>
                            <input type="number" class="form-control data-input" data-field="sell_rate" data-required="1" data-ffield="Sell rate"/>
                        </div>
                    </div>
                </div>
                <div id="_ecr_dlgExchangeRate_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default height" type="button" data-dismiss="modal">
                <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span>
                </button>
                <button class="btn btn-primary height" type="button" id="_ecr_dlgExchangeRate_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save">Save</span>
                </button>
            </div>
        </div>
    </div>
</div>