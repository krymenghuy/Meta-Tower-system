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
        <div class="item-group-container flat-box" id="_pdg_list_container"></div>
        
    </div>
</div>

<div id="_pdg_dlgProductGroup" class="modal fade" tabindex="-1" aria-labelledby="_pdg_dlgProductGroup_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pdg_dlgProductGroup_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                   <div class="col-6">
                        <label for="code" class="form-label trans-text" data-langprop="item_group.Code"></label>
                        <input type="text" class="form-control data-input" data-field="code" data-required="1" data-ffield="Code" placeholder="Auto" readOnly/>
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
                        <div id="_pdg_label_uom"></div>
                        <select id="_pdg_dlgProductGroup_unit" class="modal-select2 form-select data-input" data-field="uom" data-required="1" data-ffield="UOM"></select>
                    </div>
                </div>

                <div class="row gy-2 py-2">
                                <div class="col-6">
                                <div id="_pdg_label_manufacturer"></div>
                                    <select id="_pdg_manufacturer" data-required="1" class="modal-select2 form-select data-input" data-field="manufacturer_id" data-ffield="Manufacturer"></select>
                                </div>                             
                                <div class="col-6">
                                     <div id="_pdg_label_brand"></div>
                                    <select id="_pdg_brand" class="modal-select2 data-input" data-field="brand_id" data-ffield="Brand name">  
                                    </select>
                                </div>
                </div>

                <div class="row gy-2 py-2">
                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="item_group.Description"></label>
                        <textarea class="form-control data-input" data-field="description" data-required="0" data-ffield="Description" placeholder="Description"></textarea>
                    </div>
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