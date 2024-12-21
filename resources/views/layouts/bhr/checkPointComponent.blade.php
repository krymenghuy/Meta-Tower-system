<div id="_main_check_point_component" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between bg-white rounded-3 shadow mt-3 w-100 p-4" id="container_check_point">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_check_point_search"
                    placeholder="Search Check Points ...">
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <button type="button" class="btn_add" id="_btnAddCheckPoint">
                <span vslang="titles.Create Check Point"></span>
            </button>
        </div>

    </div>
    <div id="_check_point_list" class="mt-4 p-4">
    </div>
</div>
<style>
    #_check_point_list {
        height: 520px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
</style>