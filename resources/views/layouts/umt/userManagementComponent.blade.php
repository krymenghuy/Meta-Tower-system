<style>
    .btn-action {
        min-width: 83px;
    }
    .assign-branch-modal .modal-body {
    max-height: 70vh;
    overflow-y: auto;
}

.assign-branch-modal .modal-content {
    height: auto;
}

</style>

<div id="_um_userManagementComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 rounded-2" style="background-color:#e2e5e9;">
        <div class="row gy-2 align-items-center">
            <div class="col-12 col-md-auto">
                <button id="_um_btn_new" class="btnAddNewEdv w-100 w-md-auto" type="button">
                    <i class="fa-solid fa-plus me-2"></i>
                    <span class="text-nowrap" vslang="buttons.New User"></span>
                </button>
            </div>
            <div class="col-12 col-md-3 col-lg-3">
                <div class="input-group input-group-sm">
                    <input role="input" type="text" class="form-control filter-field" placeholder="Search user" id="_um_search_user" name="search_query" autocomplete="off" />
                    <span class="input-group-text">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
            </div>
            <div class="col-12 col-md-3 col-lg-2">
                <select id="_um_filter_user_role" class="modal-select2 w-100"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2">
                <select id="_um_filter_user_branch" class="modal-select2 w-100"></select>
            </div>
            <div class="col-12 col-md-auto ms-auto text-end">
                <button id="_um_btn_pdf" class="d-none btn btn-sm btn-danger w-100 w-md-auto" type="button">
                    <span vslang="buttons.PDF"></span>
                </button>
            </div>
        </div>
    </div>

    <div class="table-responsive mt-3 table-responsive-hover">
        <div id="_um_container" class="me-3"></div>
    </div>

    <div class="py-2" id="container_pagination_um"></div>
</div>


<div class="modal fade" id="dlg_um_" tabindex="-1" aria-labelledby="dlg_um_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content rounded-4">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close"  data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer border-top-0">
                <button id="dlg_um_btn_close" type="button" class="btn-vs-cancel" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_um_btn_print" type="button" class="d-none btn-vs-save">
                    <span class="" vslang="buttons.Print"></span>
                </button>
                <button id="dlg_um_btn_save" type="button" class="btn-vs-save">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlg_edit_user" tabindex="-1" aria-labelledby="dlg_edit_user_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content rounded-4">
            <div class="modal-header border-bottom-0">
                <h5 class="modal-title " vslang="titles.Modify User"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="col-md-4 d-flex flex-column align-items-center justify-content-center">
                        <div name="div_user_photo" id="_div_user_photo" class="border border-ypg-custom rounded-3 overflow-hidden" style="width: 150px; height: 150px; background-color: #f0f0f0;"></div>
                        <div style="visibility: hidden;" class="d-none align-items-center justify-content-center border border-secondary rounded-5 p-3 mt-3 text-center">
                           <h5 class="p-2">User may have an official profile details</h5>
                        </div>
                        <label class="mt-2 text-muted small d-none text-center">User Profile Photo</label>
                  </div>
                  <div class="col-md-8">
                        <div class="row">
                           <div class="col-12">
                              <div class="form-group">
                                 <label>Full Name</label>
                                 <input name="full_name" class="form-control data-get data-input" data-field="full_name" placeholder=" " />
                              </div>
                           </div>
                           <div class="col-12">
                              <div class="form-group">
                                 <label>Phone Number</label>
                                 <input name="phone_number" class="form-control data-get data-input" data-field="phone_number" placeholder=" " />
                              </div>
                           </div>
                        </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn-vs-cancel" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_edit_users_btn_save" type="button" class="btn-vs-save">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
