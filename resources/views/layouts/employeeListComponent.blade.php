<div id="_main_employeeListComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2">
            <button class="vs-btn-custom-primary" type="button" id="_epl_btnNew">
                <span class="trans-text" data-langprop="buttons.New Employee"></span>
            </button>
            <button class="vs-btn-custom-export" type="button" id="_epl_btnExport">
                <span class="trans-text" data-langprop="buttons.Export"></span>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
            <table class="table" id="_epl_tblEmployee"></table>
        </div>
    </div>
</div>

<div id="_epl_dlgEmployee" class="modal fade" tabindex="-1" aria-labelledby="_epl_dlgEmployee_title" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_epl_dlgEmployee_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="code" class="form-label trans-text" data-langprop="employees.Code"></label>
                        <input type="text" class="form-control data-input" data-field="code" readonly/>
                    </div>
                    <div class="col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="employees.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="Name"/>
                    </div>
                </div>
                <div class="row gy-2">
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
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="phone_number" class="form-label trans-text" data-langprop="employees.Phone Number"></label>
                        <input type="text" class="form-control data-input" data-field="phone_number" data-ffield="Phone Number" data-required="1"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="date_of_birth" class="form-label trans-text" data-langprop="employees.Date Of Birth"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth" data-ffield="Date Of Birth" data-required="1"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="employment_type" class="form-label trans-text" data-langprop="employees.Employment Type"></label>
                        <select class="form-select data-input" data-field="employment_type" data-ffield="Employee Type" data-required="1">
                            <option value="full time">Full Time</option>
                            <option value="part time">Part Time</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
                <div class="dialog-error" id="_epl_dlgEmployee_error"></div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_epl_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>