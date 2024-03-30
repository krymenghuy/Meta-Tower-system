<div id="_main_exchangeRatesComponent" style="display:none; padding:15px">
    <div class="d-flex gap-2 custom-bootstrap">
        <button class="btn btn-primary text-nowrap" type="button" id="_ecr_btnNew">
            <i class="fas fa-plus fs-5"></i>
            <span>Add</span>
        </button>
        <div class="min-width-select">
            <select class="modal-select2 height" id="_ecr_list_select"></select>
        </div>
        <div class="input-group flex-nowrap">
            <div class="min-width-select">
                <select class="modal-select2" id="_ecr_list_pair">
                    <option value="USDKHR">USD-KHR</option>
                </select>
            </div>
            <div class="input-group-text d-none" id="_ecr_currency">
                <i class="fa-solid fa-plus"></i>
            </div>
        </div>
    </div>
    <div class="table-responsive mt-3 border rounded-3 p-3 border-success bg-white table-responsive-hover">
        <table class="table header-uppercase" id="tbl_ecr_exchangeRate"></table>
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
                <div class="form-group">
                    <label for="date" class="form-label">Currency</label>
                    <div class="min-width-select max-width-select">
                        <select class="modal-select2 form-control data-input" data-field="currency_pair" data-required="1" data-ffield="Currency pair">
                            <option value="USDKHR">USD-KHR</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="date" class="form-label">Date</label>
                    <div class="w-100">
                        <input data-select="datepicker" class="form-control data-input" data-field="x_date" data-required="1" data-ffield="Date" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="buy_rate" class="form-label">Buy</label>
                    <div class="w-100">
                        <input type="number" class="form-control data-input" data-required="1" data-field="buy_rate" data-ffield="Buy rate" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="sell_rate" class="form-label">Sell</label>
                    <div class="w-100">
                        <input type="number" class="form-control data-input" data-required="1" data-field="sell_rate" data-ffield="Sell rate" />
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