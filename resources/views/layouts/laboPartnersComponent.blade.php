<div id="_main_laboPartnersComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_lbp_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text text-nowrap" data-langprop="buttons.Add New"></span>
                </div>
            </button>
            <div class="input-group flex-nowrap">
                <input type="search" id="_lbp_input_search" class="form-control custom-width" placeholder="search..."/>
                <div class="input-group-text">
                    <span class="trans-text" data-langprop="titles.Search"></span>
                </div>
            </div>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#EEEA8D;min-height:350px;">
            <table class="table" id="_lbp_tblLaboPartners"></table>
        </div>
    </div>
</div>

<div id="_lbp_dlgPartners" class="modal fade" tabindex="-1" aria-labelledby="_lbp_dlgPartners_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_lbp_dlgPartners_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="partners.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="name"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="partners.Email"></label>
                        <input type="text" class="form-control data-input" data-field="email" data-required="1" data-ffield="Email" placeholder="email"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="phone" class="form-label trans-text" data-langprop="partners.Phone"></label>
                        <input type="text" class="form-control data-input" data-field="phone_number" data-required="1" data-ffield="Phone" placeholder="phone number"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="cp_name" class="form-label trans-text" data-langprop="partners.CP Name"></label>
                        <input type="text" class="form-control data-input" data-field="cp_name" data-required="1" data-ffield="Contact Person Name" placeholder="Contact Person Name"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="cp_phone_number" class="form-label trans-text" data-langprop="partners.CP Phone"></label>
                        <input type="text" class="form-control data-input" data-field="cp_phone_number" data-required="1" data-ffield="Contact Person Phone" placeholder="Contact Person Phone"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="address" class="form-label trans-text" data-langprop="partners.Address"></label>
                        <input type="text" class="form-control data-input" data-field="address" data-required="1" data-ffield="Address" placehoder="Address"/>
                    </div>
                </div>
                <div class="row gy-2">
                    <div class="col-lg-6">
                        <label for="partner_type" class="form-label trans-text" data-langprop="partners.Partner Type"></label>
                        <select class="form-select data-input" data-field="partner_type" data-required="1" data-ffield="Partner Type">
                            <option value="person">Person</option>
                            <option value="institution">Institution</value>
                        </select>
                    </div>
                </div>
                <div class="dialog-error" id="_lbp_dlgPartners_error"></div>
            </div>
            <div class="modal-footer">
                <button class="vs-btn-custom-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="vs-btn-custom-primary" type="button" id="_lbp_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>