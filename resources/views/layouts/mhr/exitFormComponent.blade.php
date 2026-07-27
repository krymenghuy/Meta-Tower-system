<div id="_main_exit_form_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_exit_form" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_exit_form"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name or code', 'titles') }}">
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddExitForm">
                    <i class="fa-solid fa-file-export" style="color: rgb(249, 251, 255);"></i>
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
