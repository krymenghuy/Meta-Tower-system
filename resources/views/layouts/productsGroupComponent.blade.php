<div id="_main_productsGroupComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <div class="input-group flex-nowrap">
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search"></span>
                </div>
                <input type="search" id="_pdg_search" class="form-control custom-width" placeholder="search..."/>
            </div>
            <button class="vs-btn-custom-primary text-nowrap" type="button" id="_pdg_btnNew">
                <span class="trans-text" data-langprop="buttons.New Product Group"></span>
            </button>
        </div>
        <div>
            <table class="table" id="_pdg_tblProductGroup"></table>
        </div>
    </div>
</div>

<div id="_pdg_dlgProductGroup" class="modal fade" tabindex="-1" aria-labelledby="_pdg_dlgProductGroup_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pdg_dlgProductGroup_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-12">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="Name"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="titles.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="0" data-ffield="Description" placeholder="Description"></textarea>
                    </div>
                </div>
               <div class="dialog-error" id="_pdg_dlgProductGroup_error">
               </div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_pdg_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>