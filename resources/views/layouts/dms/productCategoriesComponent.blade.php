<div id="_main_productCategoriesComponent" class="m-3" style="display:none;">
    <div class="d-flex flex-column">
        <div class="d-flex align-items-center border shadow rounded-3 p-2 bg-white">
            <button class="btn btn-primary height" id="_pdc_btnNew">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.Add Category">Add Category</span>
            </button>
        </div>
        <div id="div_category_list" class="mt-3 border rounded-3 p-3 shaow-lg bg-white mt-2">    
        </div>
    </div>
</div>

<div id="_pdc_dlgProductCategory" class="modal fade" aria-labelledby="_pdc_dlgProductCategory_title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pdc_dlgProductCategory_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="form-group col-lg-12">
                     <label for="category" class="form-label trans-text" data-langprop="products.Category"></label>
                     <div> <input type="text" class="form-control data-input" data-field="name" data-required="1"/> </div>
                    </div>
                </div>
                <div id="_pdc_dlgProductCategory_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default height" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel">Cancel</span>
                </button>
                <button class="btn btn-primary height" type="button" id="_pdc_dlgProductCategory_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save">Save</span>
                </button>
            </div>
        </div>
    </div>
</div>