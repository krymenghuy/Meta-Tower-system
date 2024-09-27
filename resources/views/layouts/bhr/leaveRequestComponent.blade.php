<div id="_main_leave_request_component">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter_leave">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_leave" placeholder="Search Leave">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
                <div class="d-flex align-items-center w-50 gap-2form-group w-50">
                    <label for="" class="form-label trans-text p-2" data-langprop="titles.Status"></label>
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddLeave">
                <i class="fas fa-plus"></i>
                <span>Add Leave Request </span>
            </button>
        </div>
    </div>
    <div id="_leave_request_list" class="p-3"></div>
</div>
{{-- dialog --}}
<div class="modal fade" id="dlg_sdl_add_Leave_Request" tabindex="-1" aria-labelledby="dlg_sdl_add_Leave_Request_title"
    aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Leave Request List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0 p-5" id="_sdl_Leave_Request_info">
                    <div class="form-group col-12">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                        <select class=" data-input" id="_sdl_name_id" data-field="emp_id"></select>
                    </div>
                    <div class="form-group  col-12 d.none">

                        <div id="info"></div>
                    </div>
                    <div class="form-group col-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                        <input type="date" class="form-control data-input" data-field="start_date" />
                    </div>
                    <div class="form-group col-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.End Date"></label>
                        <input type="date" class="form-control data-input" data-field="end_date" />
                    </div>
                    <div class="form-group col-12">
                        <label for="name" class="form-label trans-text"
                            data-langprop="titles.Permission Detail"></label>
                        <input type="text" class="form-control data-input" data-field="permission_details" />
                    </div>

                </div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="trans-text" data-langprop="titles.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_Leave_Request_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="titles.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
