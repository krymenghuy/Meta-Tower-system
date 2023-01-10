<div id="_main_patientInvoicesComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 py-2">
            <button class="vs-btn-custom-primary" type="button" id="_pic_btnNew">
                <span class="trans-text" data-langprop="patient.New Invoice"></span>
            </button>
            <button class="vs-btn-custom-secondary" type="button" id="_pic_btnExport">
                <span class="trans-text" data-langprop="patient.Export"></span>
            </button>
        </div>
        <div>
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                    <input id="_pic_search" type="search" class="form-control custom-width" placeholder="search..."/>
                </div>
                <button id="_pic_group_filter" type="button" class="btn btn-outline-primary">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div>
                <table class="table" id="_pic_tblInvoice"></table>
            </div>
        </div>
    </div>
</div>

<div id="_pic_dlgInvoice" class="modal fade" tabindex="-1" aria-labelledby="_pic_dlgInvoice-title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_pic_dlgInvoice-title"></h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_pic_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>