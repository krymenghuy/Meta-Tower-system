<div id="_main_departmentComponent" class="px-3 mobile-padding" style="display:none;">
    <div id="_divFilter" class="bg-white shadow p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_department"
                    placeholder="{{ \Vsd\Locales\Localization::trans('search_name', 'labels') }}">
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddDepartment">
                    <i class="fa-solid fa-cubes-stacked"></i>
                    <span vslang="buttons.Create Department"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_dep_list" class="mt-3"></div>
</div>
