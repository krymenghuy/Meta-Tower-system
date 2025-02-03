<div id="_main_benefit_component" style="display:none;padding:20px 0 0">
    {{-- <div class="d-flex py-3 mt-3 shadow rounded-3  justify-content-between w-100 " id="_divFilter"> --}}
    <div class="d-flex justify-content-between w-100 p-4 mt-2 rounded-2 shadow" id="_divFilter">
        <div class="d-flex justify-content-between w-50 gap-2">
            <div class="d-flex align-items-start justify-content-start w-50">
                <input type="text" class="form-control filter-field btn_search" id="_benefit_search"
                    placeholder="Search benefit....">
            </div>
            <div class="d-flex align-items-start justify-content-end gap-2 w-50 pr-2">
                <select type="id" id="el_benefit_type" class="data-input filter-field" data-field="leave_type_id"></select>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end px-3 w-50">
            <button type="button" class="btn_add" id="_btnAddBenefit">
                <i class="fas fa-plus-circle"></i>
                <span>Create Benefit</span>
            </button>
        </div>
    </div>
    <div id="_benefit_list" class="px-4"></div>
</div>
<style>
</style>
