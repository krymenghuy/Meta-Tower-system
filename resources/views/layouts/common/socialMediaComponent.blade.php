<div id="_main_socialMediaComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex p-3 rounded-3 bg-white">
        <button id="_scm_btn_new" class="btn btn-sm btn-primary" type="button">
            <span class="" vslang="buttons.Add"></span>
        </button>
    </div>
    <div id="container_tbl_scm" class="table-responsive p-3 bg-white rounded-3 border table-responsive-hover mt-3"></div>
</div>

<div class="modal fade" id="dlg_scm_" tabindex="-1" aria-labelledby="dlg_scm_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="dlg_scm_title"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="d-sm-block d-md-block d-lg-flex gap-3">
                    <div class="logo-social-media">
                        <div id="dlg_scm_logo_social" class="d-flex align-items-center justify-content-center w-100 h-100">
                            <i class="fa-regular fa-image fs-4 text-muted"></i>
                        </div>
                    </div>
                    <div class="d-block w-100 set-margin-from-group">
                        <div class="form-group">
                            <label for="name" class="form-label" vslang="titles.Name"></label>
                            <input type="text" class="form-control data-input" data-field="name"/>
                        </div>
                        <div class="form-group">
                            <label for="url" class="form-label" vslang="titles.URL"></label>
                            <input type="url" class="form-control data-input" data-field="url"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="" vslang="buttons.Cancel"></span>
                </button>
                <button id="dlg_scm_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="" vslang="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>