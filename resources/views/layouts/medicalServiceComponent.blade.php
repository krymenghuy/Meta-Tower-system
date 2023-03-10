<div id="_main_medicalServiceComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" id="_msl_btnNew">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.Add New"></span>
            </button>
            <input type="search" class="search-box" id="_msl_search" placeholder="Search"/>
            <select id="_msl_filter_service" class="form-select custom-width">
                <option value="1">Test</option>
            </select>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_msl_tblItems"></table>
        </div>
    </div>
</div>

<div id="_msl_dlgService" class="modal fade" tabindex="-1" aria-labelledby="_msl_dlgService_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 id="_msl_dlgService_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row">
                  <div class="col-12">
                        <label for="name" class="form-label trans-text" data-langprop="service.Department Name"></label>
                        <select class="modal-select2 data-input" id="_msl_dlgService_department" data-field="department_id" data-required="1" data-ffield="Department"></select>
                    </div>

                    <div class="col-12">
                        <label for="name" class="form-label trans-text" data-langprop="service.Name"></label>
                        <input type="text" data-required="1" data-field="name" data-ffield="Service name" class="form-control data-input" placeholder="Name"/>
                    </div>

                    <div class="col-12">
                        <label class="form-label trans-text" data-langprop="service.Treatment method"></label>
                        <select data-required="1" data-field="treatment_method" data-ffield="Treatment method" class="form-select data-input">
                           <option value="none">NA</option>
                           <option value="nonsurgery">Non-surgery</option>
                           <option value="minor surgery">Minor Surgery</option>
                           <option value="surgery">Surgery</option>
                        </select>
                    </div>

                    <div class="col-12">
                        <label class="form-label trans-text" data-langprop="service.Type"></label>
                        <select data-required="1" data-field="service_type" data-ffield="Service type" class="form-select data-input">
                           <option value="consultation">Consultation</option>
                           <option value="treatment">Treatment</option>
                           <option value="labo">Labo Test</option>
                        </select>
                    </div>

                    <div class="col-12">
                        <label for="description" class="form-label trans-text" data-langprop="service.Description"></label>
                        <textarea class="form-control data-input" data-required="0" data-field="description" placeholder="Description"></textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label trans-text" data-langprop="service.Price"></label>
                        <input type="number" data-required="1" data-field="price" class="form-control data-input" placeholder="Price"/>
                    </div>
                    <div class="col-12">
                       <div class="dialog-error" id="_msl_dlgService_error">
                       </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>

                <button id="_msl_dlgService_btnSave" class="btn btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>