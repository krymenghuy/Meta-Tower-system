<style>
    .labo-test-list-container{
        padding:10px;
        border-radius:5px;
        border:1.2px solid #F8F6F5;
        display:flex;
        flex-direction:row;
        align-items:flex-start;
        overflow-y:auto;
    }
    .tbl-partner-tests th{
      font-weight:bold;
    }
    .pn-test-item{
        margin:3px;
        width:190px;
      }
</style>
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
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px;">
            <table class="table header-light-blue header-uppercase" id="_lbp_tblLaboPartners"></table>
        </div>
    </div>
</div>

<!--begin:: PartnerDialog -->
<div id="_lbp_dlgPartners" class="modal fade" tabindex="-1" aria-labelledby="_lbp_dlgPartners_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_lbp_dlgPartners_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="partners.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="Name" placeholder="name"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="email" class="form-label trans-text" data-langprop="partners.Email"></label>
                        <input type="text" class="form-control data-input" data-field="email" data-required="1" data-ffield="Email" placeholder="email"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="phone" class="form-label trans-text" data-langprop="partners.Phone"></label>
                        <input type="text" class="form-control data-input" data-field="phone_number" data-required="1" data-ffield="Phone" placeholder="phone number"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="cp_name" class="form-label trans-text" data-langprop="partners.CP Name"></label>
                        <input type="text" class="form-control data-input" data-field="cp_name" data-required="1" data-ffield="Contact Person Name" placeholder="Contact Person Name"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="cp_phone_number" class="form-label trans-text" data-langprop="partners.CP Phone"></label>
                        <input type="text" class="form-control data-input" data-field="cp_phone_number" data-required="1" data-ffield="Contact Person Phone" placeholder="Contact Person Phone"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="address" class="form-label trans-text" data-langprop="partners.Address"></label>
                        <input type="text" class="form-control data-input" data-field="address" data-required="1" data-ffield="Address" placehoder="Address"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
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
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_lbp_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--end:: PartnerDialog -->

<!--begin:: LaboTest Selector Dialog -->
<div id="_lbp_dlgTestSelector" class="modal fade" tabindex="-1" aria-labelledby="_lbp_dlgTestSelector_title" aria-hidden="true">
    <div class="modal-dialog vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_lbp_dlgTestSelector_title">Choose Labo Test</h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-12">
                        <label for="name" class="form-label trans-text" data-langprop="partners.Test Name"></label>
                        <select id="_lbp_test" class="modal-select2 data-input" data-field="test_id" data-required="1" data-ffield="Labo Test"></select>
                    </div>
                    <div class="col-lg-12">
                        <label for="email" class="form-label trans-text" data-langprop="partners.Price"></label>
                        <input id="_lbp_test_price" type="number" class="form-control data-input" data-field="price" data-required="1" data-ffield="Price" placeholder="0.00"/>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_lbp_dlgTestSelector_btnOK">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
<!--end:: labo Test select dialog -->