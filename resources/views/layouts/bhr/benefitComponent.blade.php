<div id="_main_benefit_component" style="display:none;padding:20px">
    <div class="d-flex py-3 mt-3 shadow rounded-3  justify-content-between w-100 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start px-3 w-100">
            <button type="button" class="btn_add" id="_btnAddBenefit">
                <i class="fas fa-plus"></i>
                <span>Create Benefit</span>
            </button>
        </div>
        <div class="d-flex align-items-center w-50 gap-2">
            <input type="text" class="form-control filter-field btn_search" id="_benefit_search" placeholder="Search benefit....">
        </div>
    </div>
    <div id="_benefit_list" class="mt-4"></div>
</div>
<style>

    #_benefit_list{
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        max-height: 500px;
    }
</style>
