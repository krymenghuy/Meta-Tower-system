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
                    <div class="col-lg-12">
                        <div class="material-input outlined">
                            <input type="text" class="form-control data-input" data-field="name_kh">
                            <label vslang="titles.Association Name (khmer)">Association Name (Khmer)</label>
                        </div>
                        
                        
                    </div>
                    <div class="col-lg-12">
                        <div class="material-input outlined">
                            <input type="text" class="form-control data-input" data-field="name">
                            <label vslang="titles.Association Name (English)">Association Name (English)</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-lg-12">
                <div class="material-input outlined">
                    <textarea type="text" class="form-control data-input" data-field="address_kh"></textarea>
                    <label vslang="titles.Address (Khmer)">Address (Khmer)</label>
                </div>
            </div>
            <div class="col-lg-12">
                <div class="material-input outlined">
                    <textarea type="text" class="form-control data-input" data-field="address"></textarea>
                    <label vslang="titles.Address (Latin)">Address (Latin)</label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-3">
                 <div class="material-input outlined">
                    <input type="text" class="form-control data-input" data-field="email">
                    <label vslang="titles.Email">Email</label>
                </div>
            </div>
            <div class="col-lg-3">
                 <div class="material-input outlined">
                    <input type="text" class="form-control data-input" data-field="phone_number">
                    <label vslang="titles.Email">Phone Number</label>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="material-input outlined">
                    <input type="text" class="form-control data-input" data-field="first_cp_name">
                    <label vslang="titles.Contact Person Name">Contact Person Name</label>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="material-input outlined">
                    <input type="text" class="form-control data-input" data-field="first_cp_phone">
                    <label vslang="titles.Contact Person Phone">Contact Person Phone</label>
                </div>
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