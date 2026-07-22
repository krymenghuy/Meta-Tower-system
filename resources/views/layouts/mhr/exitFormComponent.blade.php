<div id="_main_exit_form_component" class="mobile-padding px-3" style="display:none;">
    <div class="bg-white p-3 rounded-2 shadow" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_exit_form_search"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="ms-md-auto col-12 col-md-auto">
                <button type="button" class="w-100 btnAddNewPrm" id="_btnAddExitForm">
                    <span vslang="buttons.Create Exit Form"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_exit_form_list" class="mt-3"></div>
</div>
<style>
    .custom-modal-size {
        max-width: 70%;
        margin: 20px auto;
    }

    .employee-info-section {
        margin-top: 10px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .exit_form_check_box {
        margin-top: 4px;
    }
</style>
