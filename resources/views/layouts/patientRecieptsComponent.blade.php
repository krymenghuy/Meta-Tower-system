<div id="_main_patientReceiptsComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 py-2">
            <button class="vs-btn-custom-primary" type="button" id="_prc_btnNew">
                <span class="trans-text" data-langprop="buttons.Save"></span>
            </button>
            <button class="vs-btn-custom-secondary" type="button" id="_prc_btnExport">
                <span class="trans-text" data-langprop="buttons.Export"></span>
            </button>
        </div>
        <div class="d-block">
            <div class="d-flex align-items-center gap-2">
                <div class="d-flex align-items-center gap-2">
                    <div class="input-group flex-nowrap">
                        <div class="input-group-text">
                            <span class="trans-text" data-langprop="titles.Search"></span>
                        </div>
                        <input id="_prc_search" type="search" class="form-control custom-width" placeholder="Search..."/>
                    </div>
                    <button id="_prc_filtergroup" class="btn btn-outline-primary" type="button">
                        <i class="fa-solid fa-bars-staggered"></i>
                    </button>
                </div>
            </div>
            <div>
                <table class="table" id="_prc_tblReciept"></table>
            </div>
        </div>
    </div>
</div>