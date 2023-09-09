<div id="_main_invoicesComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 bg-white rounded-3 p-3">
        <div class="height-select2">
            <select class="modal-select2"></select>
        </div>
        <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
        <button class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="trans-text" data-langprop="buttons.Find"></span>
        </button>
    </div>
    <div id="tbl_inv_"class="table-responsive mt-3 p-3 bg-white rounded-3 table-responsive-hover"></div>
</div>

<div class="modal fade modal-custom-size" id="dlg_inv_" tabindex="-1" aria-labelledby="dlg_inv_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Preview Invoice"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="dlg_elBody" class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_inv_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="buttons.Print Now"></span>
                </button>
            </div>
        </div>
    </div>
</div>