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

                
               <div class="dialog-error" id="_pdg_dlgProductGroup_error">

               </div>
            </div>
            <div class="modal-footer">
                <button class="" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="" type="button" id="_pdg_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>