<style>
    .tableFixHead thead th {
        position: sticky;
        top: 0;
    }
</style>
<div id="_main_campusManagementComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 rounded-2" style="background-color:#e2e5e9;">
        <button id="_cps_btn_new" class="btnAddNewEdv" type="button">
            <i class="fa-solid fa-plus me-1"></i>
            <span class="" vslang="buttons.Add Campus">Add Campus</span>
        </button>
    </div>
    <div id="_campus_list" class="table-responsive border p-3 mt-3 rounded-3 bg-white table-responsive-hover"></div>
</div>

<div id="dlg_cps_um" class="modal fade" tabindex="-1" aria-labelledby="dlg_cps_um_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4">
            <div class="modal-header border-bottom-0">
                <h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id='div_cps_body' class="modal-body">
                <div class="form-group">
                    <label for="name" class="form-label " vslang="titles.Campus Name"></label>
                    <input type="text" class="form-control data-input" data-field="name" />
                </div>
                <div class="form-group">
                    <label for="name" class="form-label " vslang="titles.Shortcut"></label>
                    <input type="text" class="form-control data-input" data-field="shortcut" />
                </div>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-secondary btn-sm rounded-5" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_cps_um_btn_save" type="button" class="btn btn-primary btn-sm rounded-5">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>