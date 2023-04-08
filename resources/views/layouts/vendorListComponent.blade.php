<div id="_main_vendorListComponent" class="mobile-padding" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex align-items-center gap-2 ms-3">
            <button class="vs-btn-custom-primary" type="button" id="_vdr_btnNew">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-plus me-1"></i>
                    <span class="trans-text text-nowrap" data-langprop="buttons.New Vendor"></span>
                </div>
            </button>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;min-height:350px">
            <table class="table header-light-blue header-uppercase" id="_vdr_tblVendors"></table>
        </div>
    </div>
</div>

<div id="_vdr_dlgVendors" class="modal fade" tabindex="-1" aria-labelledby="_vdr_dlgVendors_title" aria-hidden="true">
    <div class="modal-dialog modal-xl vs-modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="_vdr_dlgVendors_title"></h4>
            </div>
            <div class="modal-body">
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="vendor" class="form-label trans-text" data-langprop="vendor.Name"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-required="1" data-ffield="name" placeholder="Name"/>
                    </div>
                    <div class="col-lg-6">
                        <span>
                           <label for="vendor_type" class="form-label trans-text" data-langprop="vendor.Vendor Type"></label>
                           <span>
                            <a href="javascript:void(0)" id="_ven_lnk_add_vendor_type"><i class="fa fa-plus-circle"></i></a> &nbsp; <a id="_ven_lnk_edit_vendor_type" href="javascript:void(0)"><i class="fa fa-pencil"></i></a> &nbsp; <a id ="_ven_lnk_delete_vendor_type" href="javascript:void(0)"><i class="fa fa-trash"></i></a>
                           </span>
                        </span>
                        <select id="_ven_vendor_type" class="modal-select2 data-input" data-field="vendor_type_id" data-required="1" data-ffield="Vendor Type">
                        </select>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="balance" class="form-label trans-text" data-langprop="vendor.Phone number"></label>
                        <input type="number" class="form-control data-input" data-field="phone_number" data-ffield="Phone number" placeholder="phone"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="tax_number" class="form-label trans-text" data-langprop="vendor.Email"></label>
                        <input type="text" class="form-control data-input" data-field="email" data-ffield="Email" placeholder="email"/>
                    </div>
                </div>
                <div class="row gy-2 py-2">
                    <div class="col-lg-6">
                        <label for="address" class="form-label trans-text" data-langprop="vendor.Address"></label>
                        <input type="text" class="form-control data-input" data-field="address" data-ffield="Address" placeholder="Address"/>
                    </div>
                    <div class="col-lg-6">
                        <label for="address" class="form-label trans-text" data-langprop="vendor.Tax number"></label>
                        <input type="text" class="form-control data-input" data-field="tax_number" data-ffield="Tax number" placeholder="Tax Number"/>
                    </div>
                </div>
                <div class="_vdr_dlgVendors-error" id="_vdr_dlgVendors_error"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary btn-default" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button class="btn btn-primary" type="button" id="_vdr_dlgVendors_btnSave">
                    <span class="trans-text" data-langprop="buttons.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>