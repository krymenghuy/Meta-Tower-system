<div id="_main_positionComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter">
        <div class="d-flex align-items-center justify-content-start gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddPosition">
                <i class="fas fa-plus"></i>
                <span>Add Position</span>
            </button>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_position"
                    placeholder="Search Position">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
                <div class="d-flex align-items-center">
                    <!-- <label for="" class="form-label  p-2" vslang="titles.Status"></label> -->
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
                </div>
            </div>
        </div>
    </div>
    <div id="_position_list" class="p-3"></div>
</div>


<div class="modal fade" id="dlg_sdl_add_Position" tabindex="-1" aria-labelledby="dlg_sdl_add_positon_title"
    aria-hidden="true">
    <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Position List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0" id="_sdl_position_info">
                    <div class="col p-5">
                        <div class="form-group">
                            <label for="name" class="form-label "
                                vslang="titles.Title Of Position">Name</label>
                            <input type="text" class="form-control data-input w-100" data-field="title" />
                        </div>
                        <div class="form-group">
                            <label for="name" class="form-label "
                                vslang="titles.Name Of Department">Name</label>
                            <select class=" data-input w-100" id="_sdl_department_id" data-field="department_id"></select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                        <span class="" vslang="titles.Cancel"></span>
                    </button>
                    <button id="dlg_sdl_add_position_btn_save" type="button" class="btn btn-sm btn-primary">
                        <span class="" vslang="titles.Save"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    #_position_list_paginator {
        display: flex;
        position: fixed;
        bottom: 0;
    }

    #_position_list {
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        height: 550px;
        gap: 10px;
        justify-content: center;
        padding: 20px;
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
