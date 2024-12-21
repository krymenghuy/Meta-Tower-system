<div id="_main_exit_form_item_component" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between bg-white rounded-3 shadow mt-3 w-100 p-4" id="container_exit_form_item">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_exit_form_item_search"
                    placeholder="Search exit form items ...">
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <button type="button" class="btn_add" id="_btnAddExitFormItem">
                <span vslang="titles.Create Exit Form Item"></span>
            </button>
        </div>

    </div>
    <div id="_exit_form_item_list" class="mt-4 p-4">
    </div>
</div>
<style>
    #_exit_form_item_list {
        height: 520px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
</style>