<div id="_main_studentInformationComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2">
        <div class="height-select2">
            <select id="el_sin_filter" class="modal-select2"></select>
        </div>
        <input type="search" id="el_sin_search" class="form-control width--search-inner"/>
        <button class="btn btn-sm btn-primary" type="button">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span class="trans-text" data-langprop="buttons.Find"></span>
        </button>
    </div>
    <div id="tbl--sin" class="table-responsive mt-3 p-3 rounded-3 bg-white table-responsive-hover"></div>
</div>

<div class="modal fade" id="dlg_sin_" tabindex="-1" aria-labelledby="dlg_sin_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Modify Student Info"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="titles.Cancel"></span>
                </button>
                <button type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="titles.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>