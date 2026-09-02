<div id="_main_access_control_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_access_control" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="rounded-2 filter-field input-search form-control" id="_search_access" data-field="search_value" placeholder="{{ \Vsd\Locales\Localization::trans('search_name', 'labels') }}">
            </div>
            
            <!-- Status Filter: Hidden in Access Log view, shown in Access Card view -->
            <div class="col-12 col-md-6 col-lg-2" id="_container_status_filter_card">
                <select id="_status_id_card" class="data-input filter-field form-select" data-field="status"></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2" id="_container_status_filter_log">
                <select id="_status_id_log" class="data-input filter-field form-select" data-field="status"></select>
            </div>

            <div class="col-12 col-md-6 col-lg-3">
                <div class="btn-group btn-group-sm gap-2 rounded" role="group">
                    <input type="radio" class="btn-check" name="access_control_view_mode" id="accessLogView" checked>
                    <label class="rounded-3 btn-outline-prm-custom btn" for="accessLogView">
                        <i class="me-1 fa-solid fa-list"></i>
                        <span vslang="buttons.Access Log">Access Log</span>
                    </label>

                    <input type="radio" class="btn-check" name="access_control_view_mode" id="accessCardView">
                    <label class="rounded-3 btn-outline-prm-custom btn" for="accessCardView">
                        <i class="me-1 fa-solid fa-rectangle-list"></i>
                        <span vslang="buttons.Access Card">Access Card</span>
                    </label>
                </div>
            </div>

            <!-- Create Button: Hidden in Access Log view, shown in Access Card view -->
            <div class="col-12 col-md-auto ms-md-auto text-md-end" id="_container_btn_add">
                <button type="button" class="btnAddNewPrm btn btn-primary w-100 w-md-auto" id="_btnAccessCard">
                    <i class="fa-solid fa-circle-plus me-2"></i>
                    <span vslang="buttons.Create Access Card"></span>
                </button>
            </div>

            {{-- <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm btn btn-primary w-100 w-md-auto" id="_btnGenerateQR">
                    <i class="fa-solid fa-qrcode me-2"></i>
                    <span vslang="buttons.Gernerate QR Code">Generate QR Code</span>
                </button>
            </div> --}}
        </div>
    </div>

    <!-- Container for Access Log List View -->
    <div id="_access_log_list" class="mt-3 rounded-2"></div>

    <!-- Container for Access Card List View -->
    <div id="_access_control_list" class="mt-3 rounded-2" style="display: none;"></div>
</div>