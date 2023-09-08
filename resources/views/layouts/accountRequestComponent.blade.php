<div id="_main_accountRequestComponent" class="mobile-padding p-3" style="display:none">
    <div class="d-flex gap-2 bg-white rounded-3 p-3">
        <button id="_arq_btn_new" class="btn btn-sm btn-primary" type="button">
            <span class="trans-text text-nowrap" data-langprop="buttons.Add Parent"></span>
        </button>
        <div class="input-group flex-nowrap width--search-inner">
            <input type="search" class="form-control"/>
            <div class="input-group-text">
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
    </div>
    <div id="tbl_arq_" class="table-resposive p-3 bg-white p-3 rounded-3 mt-3"></div>
</div>

<div class="modal fade" id="dlg_arq_" tabindex="-1" aria-labelledby="dlg_arq_title" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Name"></label>
                            <input type="text" class="form-control data-input" data-field="name"/>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="sex" class="form-label trans-text" data-langprop="titles.Sex"></label>
                            <div class="width-select-dialog">
                                <select class="modal-select2 data-input" data-field="sex">
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="national_id" class="form-label trans-text" data-langprop="titles.National ID"></label>
                            <input type="text" class="form-control data-input" data-field="national_id"/>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                            <input type="text" class="form-control data-input" data-field="phone_number"/>
                        </div>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                            <input type="email" class="form-control data-input" data-field="email"/>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="address" class="form-label trans-text" data-langprop="titles.Address"></label>
                            <textarea class="form-control data-input" data-field="address"></textarea>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="student_id" class="form-label trans-text" data-langprop="titles.Connect To Student"></label>
                    <div class="style-to-select2-multiple">
                        <select id="dlg_el_student" class="modal-select2 data-input" data-field="student_id" multiple></select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_arq_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>