<div id="_main_vendorsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <button class="vs-btn-custom-primary" type="button" id="_vdr_btnNew">
                <span class="trans-text" data-langprop="buttons.New Vendor"></span>
            </button>
        </div>
        <div>
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
                    <div class="col-lg-6"></div>
                    <div class="col-lg-6"></div>
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