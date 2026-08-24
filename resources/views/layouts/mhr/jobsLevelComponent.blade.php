
<div id="_main_jobsLevelComponent" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter_jobsLevelComponent" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_job_level_search"
                    placeholder="{{ \Vsd\Locales\Localization::trans('search_name', 'labels') }}">
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddJobLevel">
                    <i class="fa-solid fa-right-from-bracket" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Create Job Level"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_job_level_list" class="mt-3"></div>
</div>

