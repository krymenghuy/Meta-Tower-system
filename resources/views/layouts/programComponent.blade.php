<div id="_main_programComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <button id="_pgm_btn_new" class="btn btn-primary" type="button">
            <span class="trans-text" data-langprop="buttons.Add Program"></span>
        </button>
    </div>
    <div class="table-responsive p-3 rounded-3 mt-3 bg-white">
        <table id="_pgm_tbl" class="table"></table>
    </div>
</div>

<div class="modal fade" id="dlg_pgm_" tabindex="-1" aria-labelledby="dlg_pgm_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                    <input type="text" class="form-control data-input" data-field="name"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_pgm_btn_save" type="button" class="btn btn-primary">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>