<div id="_main_orderImageComponent" style="display:none;padding:15px">
    <div class="d-flex align-items-center gap-2">
        <div class="input-group flex-nowrap">
            <input type="search" class="form-control" placeholder="Search" id="_odi_search_input" />
            <div class="input-group-text pe-auto" id="_odi_btnSearch">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
        <div class="input-group flex-nowrap">
            <div class="input-group-text">
                <span class="trans-text" data-langprop="titles.Start Date">Start Date</span>
            </div>
            <div class="w-100">
                <input data-select="datepicker" class="form-control" placeholder="Start Date" id="_odi_filter_start_date" />
            </div>
        </div>
        <div class="input-group flex-nowrap">
            <div class="input-group-text">
                <span class="trans-text" data-langprop="titles.End Date">End Date</span>
            </div>
            <div class="w-100">
                <input data-select="datepicker" class="form-control" placeholder="End Date" id="_odi_fliter_end_date" />
            </div>
        </div>
        <div class="min-width-select">
            <select class="modal-select2 height custom-width" id="_ido_filter_sender"></select>
        </div>
    </div>
    <div class="table-responsive border rounded-3 p-3 mt-3 bg-white table-responsive-hover">
        <table class="table light-blue-header header-uppercase" id="_ido_tblOrderImage"></table>
    </div>
</div>

<div id="_odi_dlgOrderImages" class="modal fade" aria-labelledby="_odi_dlgOrderImages_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="modal-body" id="_ido_insert_image"></div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Close"></span>
                </button>
            </div>
        </div>
    </div>
</div>