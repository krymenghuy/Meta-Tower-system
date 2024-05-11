<div id="_main_salesCommissionPolicyComponent" class="m-3" style="display:none;">
    <div class="d-flex flex-column">
        <div class="d-flex justify-content-between border shadow rounded-3 p-3 bg-white">
            <div>
               <select class="modal-select2" id="_scp_filter_policy" disabled></select>
            </div>
            <div>
                <button style="display:none" class="btn btn-success height" id="_scp_btnNewPolicy">
                    <i class="fa-solid fa-plus"></i>
                    <span class="trans-text" data-langprop="buttons.Add Policy"></span>
                </button>
           </div>
        </div>
        <div class="mt-3 d-flex flex-column border rounded-3 p-3 shaow-lg bg-white mt-2">
             <div class="d-flex flex-row gap-3">
                  <button type="button" id="_scp_btnNewItem" class="btn btn-sm btn-info"><span>Add Condition</span></button>
             </div>
             <div id="div_polItem_list" class="w-100">

             </div>
        </div>
    </div>
</div>

<div id="_scp_dlgPolicyItem" class="modal fade" aria-labelledby="_scp_dlgPolicyItem_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_scp_dlgPolicyItem_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="form-group col-lg-12">
                       <label for="_scp_elPolicy" class="form-label trans-text" data-langprop="titles.Policy"></label>
                       <div> <select id="_scp_elPolicy" class="modal-select2 data-input" data-field="policy_id"></select></div> 
                   </div>

                   <div class="form-group col-lg-6">
                      <label for="lower_count" class="form-label trans-text" data-langprop="titles.Lower Count"></label>
                      <div> <input type="number" class="form-control data-input" data-field="lower_count" data-required="1"/> </div> 
                   </div>

                   <div class="form-group col-lg-6">
                      <label for="upper_count" class="form-label trans-text" data-langprop="titles.Upper Count"></label>
                      <div> <input type="number" class="form-control data-input" data-field="upper_count" data-required="1"/> </div> 
                   </div>

                   <div class="form-group col-lg-6">
                      <label for="amount_per_unit" class="form-label trans-text" data-langprop="titles.Amount per unit"></label>
                      <div> <input type="number" class="form-control data-input" data-field="amount_per_unit" data-required="1"/> </div> 
                   </div>

                   <div class="form-group col-lg-6">
                      <label for="amount_per_unit" class="form-label trans-text" data-langprop="titles.Currency"></label>
                      <div> <input type="text" class="form-control data-input" data-field="currency_code" data-required="1" value="USD"/> </div> 
                   </div>

                </div>
                <div id="_scp_dlgPolicyItem_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default height" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span>
                </button>
                <button class="btn btn-primary height" type="button" id="_scp_dlgPolicyItem_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save">Save</span>
                </button>
            </div>
        </div>
    </div>
</div>