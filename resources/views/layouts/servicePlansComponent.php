<div id="_main_servicePlansComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" id="_spl_btnNewPlan">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.New Plan">New Plan</span>
            </button>
            <input type="search" class="search-box" id="_spl_search" placeholder="Search"/>
            <div class="custom-width" style="display:none">
                <select id="_spl_filter_status" class="modal-select2">
                    <option value="0">Active Plan</option>
                    <option value="1">Inactive Plan</option>
                </select>
            </div>
        </div>
        <div style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
           <div id="service_plan_container" class="d-flex flex-column" style="overflow-y:auto;">
 
           </div>  
        </div>
    </div>
</div>

<div id="_spl_dlgServicePlan" class="modal fade" tabindex="-1" aria-labelledby="_spl_dlgServicePlan_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_spl_dlgServicePlan_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-12">
                        <label for="name" class="form-label trans-text" data-langprop="service.Plan Name"></label>
                        <input class="form-control data-input" data-field="name" data-required="1" data-ffield="Plan Name"/>
                    </div>
                    <div class="form-group col-6">
                        <label for="price" class="form-label trans-text" data-langprop="service.Price"></label>
                        <input type="number" class="form-control data-input" data-field="price" data-required="1" data-ffield="Price"/>
                    </div>
                    <div class="form-group col-6">
                        <label for="name" class="form-label trans-text" data-langprop="service.Currency"></label>
                        <input class="form-control" data-field="currency_code" data-required="0" data-ffield="Currency" value="USD" readOnly/>
                    </div>
                    <div class="form-group col-12">
                        <label for="description" class="form-label trans-text" data-langprop="service.Description"></label>
                        <input class="form-control data-input" data-field="description" data-ffield="Description"/>
                    </div>
                    
                    <div class="col-12">
                       <div class="dialog-error" id="_spl_dlgServicePlan_error">
                       </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="_spl_dlgServicePlan_btnSave" class="btn btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>