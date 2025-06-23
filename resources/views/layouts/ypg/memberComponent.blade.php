<div id="_main_member_component" class="m-3 pt-2" style="display:none;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-3 mt-2" style="background-color:#27444a;" id="_divFilter_member">
        <div class="d-flex align-items-center justify-content-start w-50 gap-2">
            <div class="d-flex align-items-center w-50">
                <input type="text" class="form-control rounded-5 filter-field" id="_search_member" placeholder="Search Member">

            </div>
            <div class="d-flex align-items-center justify-content-end w-25">
                <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
            </div>

        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <button type="button" class="btn_add" id="_btnAddMember">
                <i class="fa fa-street-view mr-2"></i>
                <span>Add Member</span>
            </button>
        </div>
    </div>
    <div id="_member_list" class="mt-3"></div>
</div>
