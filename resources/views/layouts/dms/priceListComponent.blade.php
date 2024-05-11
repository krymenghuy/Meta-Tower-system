<div id="_main_priceListComponent" style="display:none;">
    <div class="d-flex flex-column">
        <div class="d-flex justify-content-between border shadow rounded-3 p-3 bg-white">
            <div>
               <select class="modal-select2" id="_qpl_filter_pricelist"></select>
            </div>
            <div class="d-flex flex-row gap-2">
                <button class="btn btn-success height" id="_dpl_btnNewPriceList">
                    <i class="fa-solid fa-plus"></i>
                    <span class="trans-text" data-langprop="buttons.New Price List"></span>
                </button>
                <button class="btn btn-secondary height" id="_dpl_btnEditPriceList">
                    <i class="fa-solid fa-edit"></i>
                    <span class="trans-text" data-langprop="buttons.Edit"></span>
                </button>
                <button class="btn btn-danger height" id="_dpl_btnDeletePriceList">
                    <i class="fa-solid fa-trash-can"></i>
                    <span class="trans-text" data-langprop="buttons.Delete"></span>
                </button>
           </div>
        </div>
        <div class="mt-3 d-flex flex-column border rounded-3 p-3 shaow-lg bg-white mt-2">
             <div class="d-flex flex-row gap-3">
                  <button type="button" id="_qpl_btnNewItem" class="btn btn-sm btn-info"><span>Add Price</span></button>
             </div>
             <div id="_qpl_div_pricelist" class="w-100">

             </div>
        </div>
    </div>
</div>

<div id="_qpl_dlgPriceItem" class="modal fade" aria-labelledby="_qpl_dlgPriceItem_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_qpl_dlgPriceItem_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="form-group col-lg-12">
                      <label for="_qpl_elPriceList" class="form-label trans-text" data-langprop="titles.Price List"></label>
                       <div> <select id="_qpl_elPriceList" class="modal-select2 data-input" data-field="price_list_id"></select></div> 
                   </div>

                   <div class="form-group col-lg-12">
                      <label for="_qpl_elZone" class="form-label trans-text" data-langprop="titles.Zone"></label>
                      <div> <select id="_qpl_elZone" class="modal-select2 data-input" data-field="zone_code"></select> </div> 
                   </div>

                   <div class="form-group col-lg-6">
                      <label for="price" class="form-label trans-text" data-langprop="titles.Price"></label>
                      <div> <input type="number" class="form-control data-input" data-field="price"/> </div> 
                   </div>
                   <div class="form-group col-lg-6">
                      <label for="currency_code" class="form-label trans-text" data-langprop="titles.Currency"></label>
                      <div> <input class="form-control data-input" data-field="currency_code" value="USD" readOnly/> </div> 
                   </div>
                   <div class="form-group col-lg-12">
                      <label for="remarks" class="form-label trans-text" data-langprop="titles.Remarks"></label>
                      <div> <input class="form-control data-input" data-field="remarks"/> </div> 
                   </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default height" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span>
                </button>
                <button class="btn btn-primary height" type="button" id="_qpl_dlgPriceItem_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save">Save</span>
                </button>
            </div>
        </div>
    </div>
</div>