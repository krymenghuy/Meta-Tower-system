<div id="_main_vendorsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_vdr_btnNew">
                <span class="trans-text" data-langprop="buttons.New Vendor"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px">
            <table class="table" id="_vdr_tblVendors"></table>
        </div>
    </div>
</div>

<div id="_vdr_dlgVendors" class="modal fade" tabindex="-1" aria-labelledby="_vdr_dlgVendors_title" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_vdr_dlgVendors_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="vendor" class="form-label trans-text" data-langprop="vendors.Vendor"></label>
                        <input type="text" class="form-control data-input" data-field="vendor" data-required="1" data-ffield="Vendor" placeholder="Vendor"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="vendor_type" class="form-label trans-text" data-langprop="vendors.Vendor Type"></label>
                        <select class="modal-select2 data-input" data-field="vendor_type" data-required="1" data-ffield="Vendor Type"></select>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="balance" class="form-label trans-text" data-langprop="vendors.Balance"></label>
                        <input type="number" class="form-control data-input" data-field="balance" data-required="1" data-ffield="Balance" placeholder="Balance"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="tax_number" class="form-label trans-text" data-langprop="vendors.Tax Number"></label>
                        <input type="text" class="form-control data-input" data-field="tax_number" data-required="1" data-ffield="Tax Number" placeholder="Tax Number"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="vendors.Email"></label>
                        <input type="email" class="form-control data-input" data-field="email" data-required="1" data-ffield="Email" placeholder="Email"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="phone" class="form-label trans-text" data-langprop="vendors.Phone"></label>
                        <input type="text" class="form-control data-input" data-field="phone" data-required="1" data-ffield="Phone" placeholder="Phone"/>
                    </div>
                </div>
                <div class="_vdr_dlgVendors-error" id="_vdr_dlgVendors_error"></div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_vdr_dlgVendors_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>