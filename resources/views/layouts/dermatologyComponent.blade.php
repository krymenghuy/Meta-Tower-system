<div id="_main_dermatologyComponent" style="display:none;padding-top:15px">
    <div class="d-flex align-items-center gap-2">
        <button id="_dml_btnNew">New</button>
        <input type="search" id="_dml_search"/>
    </div>
    <div>
        <table class="table" id="_dml_tblItems"></table>
    </div>
</div>

<div class="modal fade" tabindex="-1" aria-labelledby="_dlg_dml" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="trans-text" data-langprop="titles.Modify"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                        <input type="text" class="form-control" placeholder="Name"/>
                    </div>
                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="titles.Description"></label>
                        <textarea class="form-control" placeholder="Description"></textarea>
                    </div>
                    <div class="col-12">
                        <label for="price" class="form-label trans-text" data-langprop="titles.Price"></label>
                        <input type="number" class="form-control" placeholder="Price"/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="_dml_btnNew" class="vs-btn-custom-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
            </div>
        </div>
    </div>
</div>