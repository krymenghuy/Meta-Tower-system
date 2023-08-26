<style>
    #_main_companyComponent > .data-input {
        font-size: 0.8em !important;
        color: red;
        font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
    }
</style>

<div id="_main_companyComponent" style="display:none;padding:35px">
    <div class="d-flex flex-column p-4 border rounded-3 shadow">
        <div class="row">
                <div class="col-lg-3">
                    <div class="d-flex flex-column">
                        <div class="w-100 border rounded-3" style="height:160px;overflow:hidden">
                           <img id="com_imgLogo" class="data-input thumnail" style="width:100%;max-height:160px" class="data-input" data-field="logo" alt="Logo"/>
                        </div> 
                        <div class="d-flex flex-row gap-2 mt-1">
                            <button id="com_btnChooseLogo" class="btn btn-sm btn-default"> <i class="fa fa-image"></i> Choose</button>
                            <button id="com_btnDeleteLogo" class="btn btn-sm btn-default btn-secondary"> <i class="fa fa-tiems text-danger"></i> Delete</button>
                        </div>
                    </div>
                </div>
                 <div class="col-lg-9">
                        <div class="row">
                            <div class="form-group col-lg-12">
                                <label class="control-label text-text" data-langprop="titles.Company Name (khmer)">Company Name (Khmer)</label>
                                <div><input type="text" class="form-control data-input" data-field="name_kh"></div>
                            </div>
                            <div class="form-group col-lg-12">
                                <label class="control-label trans-text" data-langprop="titles.Company Name (English)">Company Name (English)</label>
                                <div><input type="text" class="form-control data-input" data-field="name"></div>
                            </div>
                        </div>
                 </div>
        </div>

       <div class="row mt-3">
            <div class="form-group col-lg-12">
                <label class="control-label">Address (Khmer)</label>
                <textarea type="text" class="form-control data-input" data-field="address_kh"></textarea>
            </div>
            <div class="form-group col-lg-12">
                <label class="control-label">Address (Latin)</label>
                <textarea type="text" class="form-control data-input" data-field="address"></textarea>
            </div>
       </div>

        <div class="row">
            <div class="col-lg-3">
                <label class="control-label">Email</label>
                <input type="text" class="form-control data-input" data-field="email">
            </div>
            <div class="col-lg-3">
                <label class="control-label">Phone Number</label>
                <input type="text" class="form-control data-input" data-field="phone_number">
            </div>

            <div class="col-lg-3">
                <label class="control-label">Contact Pereson Name</label>
                <input type="text" class="form-control data-input" data-field="first_cp_name">
            </div>
            <div class="col-lg-3">
                <label class="control-label">contact person Phone</label>
                <input type="text" class="form-control data-input" data-field="first_cp_phone">
            </div>
        </div>

        <div class="d-flex align-items-center mt-2">
               <button id="_main_comp_btnSaveProfile" type="button" class="btn btn-success">
                    <i class="la la-save"></i>
                    <span>Save Changes</span>
                </button>
        </div>

    </div>
      
</div>