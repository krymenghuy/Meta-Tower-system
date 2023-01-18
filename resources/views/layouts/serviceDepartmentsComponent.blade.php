<div id="_main_serviceDepartmentsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <button class="vs-btn-custom-primary" type="button" id="_svd_btnNew">
                <span class="trans-text" data-langprop="buttons.New Department"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
            <table class="table" id="_svd_tblItem"></table>
        </div>
    </div>
</div>

<div id="_svd_dlgDepartment" class="modal fade" tabindex="-1" aria-labelledby="_svd_dlg_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_svd_dlgDepartment_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-12">
                        <label for="name" class="form-label trans-text" data-langprop="Departments.Name"></label>
                        <input type="text" data-required="1" data-field="name" data-ffield="Department name" class="form-control data-input" placeholder="Name"/>
                    </div>
                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="Departments.Description"></label>
                        <textarea data-required="1" data-field="description" data-ffield="Description of department" class="form-control data-input" placeholder="Department"></textarea>
                    </div>

                    <div class="col-12">
                        <div class="dialog-error" id="_svd_dlgDepartment_error">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_svd_dlgDepartment_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>