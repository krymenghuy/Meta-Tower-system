<div id="_main_campusComponent" class="mobile-padding p-3" style="display:none">
    <div class="p-3 bg-white rounded-3">
        <button id="_cps_btn_new" class="btn btn-primary btn-sm" type="button">
            <i class="fa-solid fa-plus"></i>
            <span class="trans-text" data-langprop="buttons.Add Campus"></span>
        </button>
    </div>
    <div id="_campus_list" class="p-3 mt-3 rounded-3 bg-white">
    </div>
</div>

<div id="dlg_cps_" class="modal fade" tabindex="-1" aria-labelledby="dlg_cps_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title"></h4>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="name" class="form-label trans-text" data-langprop="titles.Campus Name"></label>
                    <input type="text" class="form-control data-input" data-field="name"/>
                </div>
                <div class="form-group">
                    <label for="name" class="form-label trans-text" data-langprop="titles.Shortcut"></label>
                    <input type="text" class="form-control data-input" data-field="shortcut"/>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_cps_btn_save" type="button" class="btn btn-primary btn-sm btn-animate">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>