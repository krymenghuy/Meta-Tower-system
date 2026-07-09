<div id="_main_employee_benefit_component" class="mobile-padding px-3" style="display:none;">
    <div class="bg-white p-3 rounded-2 shadow" id="_divFilter_employee_benefit">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_sdl_search_bonus" placeholder="Search by name">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_benefit" class="filter-field data-input" data-field="benefit_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_tax_option" class="data-input filter-field" data-field="tax_option_id"></select>
            </div>
            <div class="ms-md-auto col-12 col-md-6 col-lg-5">
                <div class="justify-content-end row g-2">
                    <div class="col-12 col-md-auto d-none">
                        <button type="button" class="w-100 btnAddNewPrm" id="_btn_import_benefit">
                            <i class="fa-solid fa-download"></i>
                            <span class="text-white" vslang="buttons.Import Benefit"></span>
                        </button>
                    </div>

                    <div class="col-12 col-md-auto">
                        <button type="button" class="w-100 btnAddNewPrm" id="_btn_add_benefit">
                            <i class="fa-solid fa-layer-group"></i>
                            <span vslang="buttons.Add Benefit"></span>
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

    <div id="_employee_bonus_list" class="mt-3"></div>
</div>
