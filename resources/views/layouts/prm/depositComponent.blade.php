<div id="_main_deposit_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_deposit" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12">
                <div class="align-items-center row g-3">
                    <div class="col-12 col-md-6 col-lg-3">
                        <input type="text" class="filter-field rounded-2 input-search" id="_search_deposit"
                            placeholder="{{ \Vsd\Locales\Localization::trans('Search by Tenant, Unit', 'titles') }}">
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_deposit_status_id" class="filter-field data-input form-control"
                            data-field="status_id" placeholder='vslang="titles.All Statuses"'></select>
                    </div>

                    <div class="col-12 col-md-3 col-lg-2">
                        <input data-select="datepicker" class="form-control data-input filter-field" placeholder="Select from date" data-field="start_date">
                    </div>
                    <div class="col-12 col-md-3 col-lg-2">
                        <input data-select="datepicker" class="form-control data-input filter-field" placeholder="Select to date" data-field="end_date">
                    </div>
                    <div class="ms-md-auto text-md-end col-12 col-md-auto d-none">
                        <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnDeposit">
                            <span>Receive Deposit</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_deposit"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search tenant, unit', 'titles') }}">
            </div> -->

        </div>
    </div>
    <div id="_deposit_list" class="table-responsive mt-3 rounded-2"></div>
</div>

