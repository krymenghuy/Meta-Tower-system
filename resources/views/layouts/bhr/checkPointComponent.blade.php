<div id="_main_check_point_component" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between w-100 p-3 mt-2 rounded-2 shadow" id="container_check_point">
        <div class="d-flex align-items-center w-100 gap-2">
            <button type="button" class="btn_add" id="_btnAddCheckPoint">
                <span vslang="titles.Create Check Point"></span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_check_point_search"
                    placeholder="Search Check Points ...">
            </div>
            <div class="d-flex align-center justify-content-end gap-2 w-50">
                <select type="id" id="el_checkPoint" class="data-input filter-field"
                    data-field="check_point_cat_id"></select>
            </div>
        </div>

    </div>
    <div id="_check_point_list" class="p-4">
    </div>
</div>
