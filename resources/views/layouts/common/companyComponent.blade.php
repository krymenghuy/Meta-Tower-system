<style>
    #_main_companyComponent>.data-input {
        font-size: 0.8em !important;
        color: red;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }
</style>

<div id="_main_companyComponent" class="m-3" style="display:none;">
    <div class="d-flex flex-column p-3 mt-4 bg-white border rounded-3 shadow">
        <div class="row">
            <div class="col-lg-3">
                <div class="d-flex flex-column">
                    <div class="w-100 d-flex justify-content-center border rounded-4" style="height:160px;overflow:hidden">
                        <img id="com_imgLogo" class="data-input thumnail" style="max-height:160px" class="data-input" data-field="logo" alt="Logo" />
                    </div>
                    <div class="d-flex flex-row gap-2 mt-1">
                        <button id="com_btnChooseLogo" class="btn btn-sm btn-outline-primary-custom">
                            <i class="fa fa-image fs-5"></i>
                            <span>Choose</span>
                        </button>
                        <button id="com_btnDeleteLogo" class="btn btn-sm btn-outline-danger">
                            <i class="fa-regular fa-trash-can fs-5"></i>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-9">
                <div class="row">
                    <div class="form-group col-lg-12">
                        <label for="name_kh" class="control-label text-text" vslang="titles.Company Name (khmer)">Company Name (Khmer)</label>
                        <input type="text" class="form-control data-input" data-field="name_kh">
                    </div>
                    <div class="form-group col-lg-12">
                        <label for="name" class="control-label " vslang="titles.Company Name (English)">Company Name (English)</label>
                        <input type="text" class="form-control data-input" data-field="name">
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="form-group col-lg-12">
                <label for="address_kh" class="control-label">Address (Khmer)</label>
                <textarea type="text" class="form-control data-input" data-field="address_kh"></textarea>
            </div>
            <div class="form-group col-lg-12">
                <label for="address" class="control-label">Address (Latin)</label>
                <textarea type="text" class="form-control data-input" data-field="address"></textarea>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3">
                <label for="email" class="control-label">Email</label>
                <input type="text" class="form-control data-input" data-field="email">
            </div>
            <div class="col-lg-3">
                <label for="phone_number" class="control-label">Phone Number</label>
                <input type="text" class="form-control data-input" data-field="phone_number">
            </div>
            <div class="col-lg-3">
                <label for="first_cp_name" class="control-label">Contact Pereson Name</label>
                <input type="text" class="form-control data-input" data-field="first_cp_name">
            </div>
            <div class="col-lg-3">
                <label for="first_cp_phone" class="control-label">contact person Phone</label>
                <input type="text" class="form-control data-input" data-field="first_cp_phone">
            </div>
        </div>
        <div class="d-flex align-items-center mt-2">
            <button id="_main_comp_btnSaveProfile" type="button" class="btn btn-sm btn-primary-custom">
                <i class="la la-save fs-5"></i>
                <span>Save Changes</span>
            </button>
        </div>
    </div>
</div>