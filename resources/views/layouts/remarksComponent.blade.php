<div id="_main_remarksComponent" style="display:none; padding:35px">
    <div class="d-flex flex-column">
        <div class="d-flex align-items-center border shadow rounded-3 p-2 bg-white">
            <button class="btn btn-primary height" id="_rmk_btnNew">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.Add Remarks"></span>
            </button>
        </div>
        <div id="div_remark_list" class="mt-3 border rounded-3 p-3 shaow-lg bg-white mt-2">    
        </div>
    </div>
</div>

<div id="_rmk_dlgRemarks" class="modal fade" aria-labelledby="_rmk_dlgRemarks_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_rmk_dlgRemarks_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                   <div class="form-group col-lg-12">
                      <label for="category" class="form-label trans-text" data-langprop="products.Description"></label>
                     <div> <input type="text" class="form-control data-input" data-field="description" data-required="1"/> </div> 
                   </div>
                   <div class="form-group col-lg-12">
                      <label for="category" class="form-label trans-text" data-langprop="products.Category"></label>
                     <div> 
                         <select type="text" class="modal-select2 data-input" data-field="category" data-required="1">
                             <option value="Failure">Failure</option>
                             <option value="Success">Success</option>
                       </select> 
                    </div> 
                   </div>
                </div>
                <div id="_rmk_dlgRemarks_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default height" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span>
                </button>
                <button class="btn btn-primary height" type="button" id="_rmk_dlgRemarks_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save">Save</span>
                </button>
            </div>
        </div>
    </div>
</div>