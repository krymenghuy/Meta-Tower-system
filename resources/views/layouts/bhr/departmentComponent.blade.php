<div id="_main_departmentComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddDepartment">
                <i class="fas fa-plus"></i>
                <span>Add Department</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-end w-50 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_department"
                    placeholder="Search Department">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
            </div>
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
                    <div class="col-lg-12 p-5">
                        <div class="form-group">
                            <label for="name" class="form-label "
                                vslang="titles.Name Of Department">Name</label>
                            <input type="text" class="form-control data-input" data-field="name" />
                        </div>
                        <div class="form-group">
                            <label for="shortcut" class="form-label "
                                vslang="titles.Short Name">Name</label>
                            <input type="text" class="form-control data-input" data-field="shortcut" />
                        </div>
                        <div class="form-group">
                            <label for="description" class="form-label "
                                vslang="titles.Description">Description</label>
                            <input type="text" class="form-control data-input" data-field="description" />
                        </div>

                        {{-- <div class="form-group col-lg-6">
                            <label for="name" class="form-label " vslang="titles.Status"></label>
                            <select class=" data-input" id="_sdl_status_id" data-field="status_id">
                               
                            </select>
                        </div> --}}

                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <span class="" vslang="titles.Cancel"></span>
                    </button>
                    <button id="dlg_sdl_add_department_btn_save" type="button" class="btn btn-sm btn-primary">
                        <span class="" vslang="titles.Save"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    #_main_departmentComponent {
        height: 600px;
        padding: 0px;
    }

    #_dep_list {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        justify-content: center;

    }

    #_dep_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }

    th,
    td {
        padding: 10px;
        vertical-align: middle;
        text-align: left;
        overflow: hidden;
        white-space: wrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 100px;
    }
</style>
