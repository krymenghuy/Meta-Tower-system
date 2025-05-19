<div id="_main_benefit_disbursement_component" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 mt-2 rounded-2 shadow" id="container_benefit_disburse">

        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <div class="position-relative w-100">
                    <input type="text" class="form-control filter-field btn_search ps-5" id="_benefit_disburse_search" placeholder="Search...">
                    <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-25 pr-2">
                <select type="id" id="el_benefit" class="data-input filter-field" data-field="benefit_id"></select>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100">
            <button type="button" class="btn_add" id="_btnAddBenefitDisburse">
                <span><i class="fa fa-exchange mr-2"></i>Add Special Plan</span>
            </button>
        </div>

    </div>
    <div id="_benefit_disburse_list" class="mt-4">
    </div>
</div>
