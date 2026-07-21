<div id="_main_skillsComponent" class="px-3 mobile-padding" style="display:none;">
    <div class="bg-white shadow p-3 rounded-2" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_skills_list_search"
                placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="ms-md-auto col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddSkill">
                    <i class="fa-solid fa-brain" style="color: rgb(255, 255, 255);"></i>
                    <span vslang="buttons.Create Skill"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_skills_lists" class="mt-3"></div>
</div>
