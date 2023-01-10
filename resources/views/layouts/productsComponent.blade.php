<div id="_main_productsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center gap-2">
                <div class="input-group flex-nowrap">
                    <input type="search" class="form-control" id="_pcd_search"/>
                    <div class="input-group-text">
                        <span class="trans-text" data-langprop="titles.Search"></span>
                    </div>
                </div>
                <button class="btn btn-outline-primary py-1 px-2" type="button">
                    <i class="fa-solid fa-bars-staggered"></i>
                </button>
            </div>
            <div class="container-fluid d-flex align-items-center justify-content-end">
                <button id="_pdc_btnNew"class="vs-btn-custom-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.New Product"></span>
                </button>
            </div>
        </div>
        <div>
             <table class="table" id="_pdc_tblItem"></table>
        </div>
    </div>
</div>

<div id="_pcd_dlgProduct" class="modal fade" tabindex="-1" aria-labelledby="_pcd_dlgProduct-title" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_pcd_dlgProduct-title"></h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="" type="button" id="_pcd_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>