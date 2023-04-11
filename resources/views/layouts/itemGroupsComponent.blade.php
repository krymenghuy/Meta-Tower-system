<div id="_main_itemGroupsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <div class="input-group flex-nowrap">
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search"></span>
                </div>
                <input type="search" id="_pdg_search" class="form-control custom-width" placeholder="search..."/>
            </div>
            <button class="vs-btn-custom-primary text-nowrap" type="button" id="_pdg_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text" data-langprop="buttons.Add Product Group"></span>
                </div>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_pdg_tblProductGroup"></table>
        </div>
    </div>
</div>

<div id="_pdg_dlgProductGroup" class="modal fade" tabindex="-1" aria-labelledby="_pdg_dlgProductGroup_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pdg_dlgProductGroup_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                   <div class="col-6">
                        <label for="code" class="form-label trans-text" data-langprop="item_group.Code"></label>
                        <input type="text" class="form-control data-input" data-field="code" data-required="1" data-ffield="Code" placeholder="Code"/>
                    </div>

                    <div class="col-6">
                        <label for="name" class="form-label trans-text" data-langprop="item_group.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="Name"/>
                    </div>
                </div>
 
                <div class="row gy-2 py-2">
                   <div class="col-6">
                        <label for="code" class="form-label trans-text" data-langprop="item_group.Category"></label>
                        <select id="_pdg_dlgProductGroup_cat" class="modal-select2 form-select data-input" data-field="category_id" data-required="1" data-ffield="Category"></select>
                    </div>

                    <div class="col-6">
                        <label for="code" class="form-label trans-text" data-langprop="item_group.SKU"></label>
                        <select id="_pdg_dlgProductGroup_unit" class="modal-select2 form-select data-input" data-field="unit_id" data-required="1" data-ffield="unit_id"></select>
                    </div>
                </div>

                <div class="row gy-2 py-2">
                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="item_group.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="0" data-ffield="Description" placeholder="Description"></textarea>
                    </div>
                </div>
               <div class="dialog-error" id="_pdg_dlgProductGroup_error">
               </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_pdg_dlgProductGroup_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>