<div id="_main_positionsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <button class="vs-btn-custom-primary" type="button" id="_pos_btnNew">
                <span class="trans-text" data-langprop="buttons.New Position"></span>
            </button>
            <input type="text" class="form-control custom-width" id="_pos_search" placeholder="search"/>
        </div>
        <div>
            <table class="table" id="_pos_tblPosition"></table>
        </div>
    </div>
</div>

<div id="_pos_dlgPosition" class="modal fade" tabindex="-1" aria-labelledby="_pos_dlgPosition_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pos_dlgPosition_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-12">
                        <label for="position" class="form-label trans-text" data-langprop="employees.Position"></label>
                        <input type="text" class="form-control data-input" data-field="position" data-required="1" data-ffield="Position" placeholder="Positions"/>
                    </div>
                    <div class="col-12">
                        <label for="department" class="form-label trans-text" data-langprop="employees.Department"></label>
                        <input type="text" class="form-control data-input" data-field="department" data-required="1" data-ffield="Department" placeholder="Department"/>
                    </div>
                </div>
                <div class="_pos_dlgPosition-error" id="_pos_dlgPosition_error"></div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_pos_dlgPosition_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>