<div id="_main_deposit_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_deposit" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12">
                <div class="align-items-center row g-3">
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_deposit_building_id" class="filter-field data-input form-control"
                            data-field="building_id"></select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_deposit_vendor_id" class="filter-field data-input form-control"
                            data-field="tenant_id"></select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_deposit_status_id" class="filter-field data-input form-control"
                            data-field="status_id"></select>
                    </div>
                    <div class="ms-md-auto text-md-end col-12 col-md-auto d-none">
                        <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnDeposit">
                            <span>Receive Deposit</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_deposit"
                    placeholder="Search tenant, unit">
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div id="_dateFilter_deposit" class="d-flex align-items-center gap-3">
                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="deposit_date_start" />
                        <label class="form-label">From Deposit Date</label>
                    </div>

                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="deposit_date_end" />
                        <label class="form-label">To Deposit Date</label>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div id="_deposit_list" class="table-responsive mt-3 rounded-2"></div>
</div>

