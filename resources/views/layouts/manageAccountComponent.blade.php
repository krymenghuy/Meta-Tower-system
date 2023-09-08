<div id="_main_manageAccountComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 p-3 bg-white rounded-3">
        <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
        <div class="d-flex justify-content-end w-100">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-primary" type="button">
                    <i class="fa-solid fa-print"></i>
                    <span class="trans-text" data-langprop="buttons.Print"></span>
                </button>
                <button class="btn btn-sm btn-success" type="button">
                    <i class="fa-regular fa-file-excel"></i>
                    <span class="trans-text" data-langprop="buttons.Excel"></span>
                </button>
                <button class="btn btn-sm btn-danger" type="button">
                    <i class="fa-regular fa-file-pdf"></i>
                    <span class="trans-text" data-langprop="buttons.PDF"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="tbl__mna" class="table-responsive p-3 bg-white rounded-3 mt-3 table-responsive-hover"></div>
</div>

<div id="dlg__mna" class="modal fade" tabindex="-1" aria-labelledby="dlg__mna_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div id="dlg_mna_body" class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_mna_btn_save" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>