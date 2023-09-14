<style>
    #_main_companyComponent > .data-input {
        font-size: 0.8em !important;
        color: red;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }
</style>

<div id="_main_companyComponent" style="display:none;padding:35px">
    <div class="d-flex flex-column p-4 border rounded-3 shadow bg-white">
        <div class="row">
            <div class="col-lg-3">
                <div class="d-flex flex-column">
                    <div class="w-100 border rounded-3 p-1" style="height:160px">
                        <img id="com_imgLogo" class="data-input object-fit-scale w-100 h-100" data-field="logo" alt="Logo"/>
                    </div>
                    <div class="d-flex flex-row gap-2 mt-2">
                        <button id="com_btnChooseLogo" class="btn btn-sm btn-primary">
                            <i class="fa fa-image"></i>
                            <span class="trans-text" data-langprop="buttons.Choose"></span>
                        </button>
                        <button id="com_btnDeleteLogo" class="btn btn-sm btn-warning">
                            <i class="fa fa-tiems text-danger"></i>
                            <span class="trans-text" data-langprop="buttons.Delete"></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <label class="control-label trans-text" data-langprop="titles.Company Name (khmer)"></label>
                        <input type="text" class="form-control data-input" data-field="name_kh"/>
                    </div>
                    <div class="form-group col-lg-12">
                        <label class="control-label trans-text" data-langprop="titles.Company Name (English)"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="form-group col-lg-12">
                <label class="control-label trans-text" data-langprop="titles.Address (Khmer)"></label>
                <textarea type="text" class="form-control data-input" data-field="address_kh"></textarea>
            </div>
            <div class="form-group col-lg-12">
                <label class="control-label trans-text" data-langprop="titles.Address (Latin)"></label>
                <textarea type="text" class="form-control data-input" data-field="address"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3">
                <label class="control-label trans-text" data-langprop="titles.Email"></label>
                <input type="text" class="form-control data-input" data-field="email">
            </div>
            <div class="col-lg-3">
                <label class="control-label trans-text" data-langprop="titles.Phone Number"></label>
                <input type="text" class="form-control data-input" data-field="phone_number">
            </div>
            <div class="col-lg-3">
                <label class="control-label trans-text" data-langprop="titles.Contact Pereson Name"></label>
                <input type="text" class="form-control data-input" data-field="first_cp_name">
            </div>
            <div class="col-lg-3">
                <label class="control-label text-capitalize trans-text" data-langprop="titles.contact person Phone"></label>
                <input type="text" class="form-control data-input" data-field="first_cp_phone">
            </div>
        </div>
        <div class="d-flex align-items-center mt-2">
            <button id="_main_comp_btnSaveProfile" type="button" class="btn btn-sm btn-success">
                <i class="la la-save"></i>
                <span class="trans-text" data-langprop="buttons.Save Changes"></span>
            </button>
        </div>
    </div>
</div>