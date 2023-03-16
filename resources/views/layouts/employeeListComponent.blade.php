<div id="_main_employeeListComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_epl_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text text-nowrap" data-langprop="buttons.Add New"></span>
                </div>
            </button>
            <div class="input-group flex-nowrap">
                <input type="search" class="form-control custom-width" placeholder="search" id="_epl_search"/>
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="employees.Search"></span>
                </div>
            </div>
            <button class="vs-btn-custom-export" type="button" id="_epl_btnExport">
                <span class="trans-text" data-langprop="buttons.Export"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase table-hover" id="_epl_tblEmployee"></table>
        </div>
    </div>
</div>

<div id="_epl_dlgEmployee" class="modal fade" tabindex="-1" aria-labelledby="_epl_dlgEmployee_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_epl_dlgEmployee_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-9">
                        <div class="row gy-2 py-2">
                        <div class="col-lg-6">
                            <label for="code" class="form-label trans-text" data-langprop="employees.Code"></label>
                            <input type="text" class="form-control data-input" data-field="code" readonly/>
                        </div>
                        <div class="col-lg-6">
                            <label for="name" class="form-label trans-text" data-langprop="employees.Name"></label>
                            <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="Name"/>
                        </div>
                        </div>
                        <div class="row gy-2 py-2">
                            <div class="col-lg-6">
                                <label for="sex" class="form-label trans-text" data-langprop="employees.Sex"></label>
                                <select class="form-select data-input" data-field="sex" data-required="1" data-ffield="Sex">
                                    <option value='M'>Male</option>
                                    <option value='F'>Female</option>
                                    <option value='O'>Other</option>
                                </select>
                            </div>
                            <div class="col-lg-6">
                                <label for="email" class="form-label trans-text" data-langprop="employees.Email"></label>
                                <input type="email" class="form-control data-input" data-field="email" data-required="1" data-ffield="Email"/>
                            </div>
                        </div>
                        <div class="row gy-2 py-2">
                            <div class="col-lg-6">
                                <label for="phone_number" class="form-label trans-text" data-langprop="employees.Phone Number"></label>
                                <input type="text" class="form-control data-input" data-field="phone_number" data-ffield="Phone Number" data-required="1"/>
                            </div>
                            <div class="col-lg-6">
                                <label for="date_of_birth" class="form-label trans-text" data-langprop="employees.Date Of Birth"></label>
                                <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth" data-ffield="Date Of Birth" data-required="1"/>
                            </div>
                        </div>
                        <div class="row gy-2 py-2">
                            <div class="col-lg-6">
                                <label for="employment_type" class="form-label trans-text" data-langprop="employees.Employment Type"></label>
                                <select class="form-select data-input" data-field="employment_type" data-ffield="Employee Type" data-required="1">
                                    <option value="full time">Full Time</option>
                                    <option value="part time">Part Time</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="d-block">
                            <div class="frame-photo"></div>
                            <div class="d-flex align-items-center gap-2">
                                <button class="btn btn-outline-success trans-text" data-langprop="buttons.Choose">
                                    <input type="file" class="data-input" data-field="picture" data-required="0"/>
                                </button>
                                <button class="btn btn-outline-danger trans-text" data-langprop="buttons.Delete"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialog-error" id="_epl_dlgEmployee_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_epl_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>