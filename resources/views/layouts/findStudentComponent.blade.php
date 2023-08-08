<div id="_main_findStudentComponent" class="mobile-padding p-3" style="display:none">
    <div id="div--ssp" class="div--ssp">
        <div class="d-flex align-items-center justify-content-center bg-white rounded-4 p-3">
            <div class="d-block">
                <h2 class="trans-text text-primary text-center" data-langprop="titles.Search Student for Payment"></h2>
                <div class="d-bf d-flex aling-items-center mt-5 gap-2">
                    <input type="search" class="form-control data-input width--search-inner" data-field="search_value" placeholder="Search by Name or ID..."/>
                    <div class="width--search-inner">
                        <select class="modal-select2 form-control data-input" data-field="academic_year"></select>
                    </div>
                    <button id="btn--find" class="btn btn-primary btn--find" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <span class="trans-text" data-langprop="buttons.Find"></span>
                    </button>
                </div>
            </div>
        </div>
        <div class="mt-4 p-3">
            <b class="trans-text fs-5" data-langprop="titles.Note"></b>
            <textarea class="form-control data-text" data-field="note"></textarea>
        </div>
    </div>
    <div id="div--fsd" class="div--fsd" style="display:none">
        <div class="d-flex gap-2">
            <button class="btn btn-primary btn-sm btn--select" type="button">
                <span></span>
                <i class="fa-solid fa-caret-down ps-2"></i>
            </button>
            <input type="search" class="form-control width--search-inner" placeholder="Search by Name or ID..."/>
            <button class="btn btn-primary btn-sm" type="button">
                <i class="fa-solid fa-magnifying-glass"></i>
                <span class="trans-text" data-langprop="buttons.Find"></span>
            </button>
        </div>
        <div id="_fns_list" class="overflow-auto p-3 mt-3 panel-student-list"></div>
    </div>
</div>

<div id="dlg__fns" class="modal fade" tabindex="-1" aria-labelledby="dlg__fns_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div class="d-block">
                    <h4 class="modal-title"></h4>
                    <small class="modal-title--sm"></small>
                </div>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-sm" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary btn-sm" type="button">
                    <span class="trans-text" data-langprop="buttons.Generate"></span>
                </button>
                <button class="btn btn-primary btn-sm" type="button">
                    <span class="trans-text" data-langprop="buttons.Generate and Receive"></span>
                </button>
            </div>
        </div>
    </div>
</div>