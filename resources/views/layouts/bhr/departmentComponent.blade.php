<div id="_main_departmentComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_department"
                    placeholder="Search Department">

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
            <button type="button" class="btn btn-primary" id="_btnAddDepartment">
                <i class="fas fa-plus"></i>
                <span>Add Department</span>
            </button>
        </div>

    </div>
    <div id="_dep_list" class="p-3"></div>
</div>

<div class="modal fade" id="dlg_sdl_add_Department" tabindex="-1" aria-labelledby="dlg_sdl_add_department_title"
    aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Department List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0" id="_sdl_department_info">
                    <div class="col-lg-9 p-5">
                        <div class="form-group">
                            <label for="name" class="form-label trans-text"
                                data-langprop="titles.Name Of Department">Name</label>
                            <input type="text" class="form-control data-input" data-field="name" />
                        </div>
                        <div class="form-group">
                            <label for="name" class="form-label trans-text"
                                data-langprop="titles.Short Name">Name</label>
                            <input type="text" class="form-control data-input" data-field="short_name" />
                        </div>

                        <div class="form-group col-lg-6">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Status"></label>
                            <select class=" data-input" id="_sdl_status_id" data-field="status_id"></select>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <span class="trans-text" data-langprop="titles.Cancel"></span>
                    </button>
                    <button id="dlg_sdl_add_department_btn_save" type="button" class="btn btn-sm btn-primary">
                        <span class="trans-text" data-langprop="titles.Save"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    #_dep_list{
        height: 620px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        gap: 10px;
        justify-content: center;
        padding: 20px;
    }
</style>
