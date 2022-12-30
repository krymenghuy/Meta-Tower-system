<style>
    #_main_companyComponent> .data-input{
        font-size:0.8em !important;
        color:red;
        font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    }

</style>
<div id="_main_companyComponent" style="display:none;padding:35px">
   <div class="flat-box" style="padding:20px;">
            <div class="row">
                <div class="col-lg-3">
                    <label class="control-label">Company Name (Khmer)</label>
                    <input type="text" class="form-control data-input" data-field="name_kh"> 
                </div>
                <div class="col-lg-3">
                    <label class="control-label">Company Name</label>
                    <input type="text" class="form-control data-input" data-field="name"> 
                </div>
                <div class="col-lg-3">
                    <label class="control-label">Address (Khmer)</label>
                    <textarea type="text" class="form-control data-input" data-field="address_kh"></textarea> 
                </div>
                <div class="col-lg-3">
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

   </div>


  <div style="height:25px"></div>
 <div class="row">
     <div class="col-lg-6">
            <img src="<?php if(isset($logodata)) echo $logodata; ?>" id="com_imgLogo"   class="img-thumbnail" alt="" style="margin:-10px;height:235px;"/>
            <input id="com_logoFileChooser" type="file"  accept="image/*" style="display:none"/>
    
            <div style="margin-top:30px">
                <a href="#" id="com_btnChooseLogo" class="btn btn-primary">Choose Logo</a>
                <a href="#" id="com_btnDeleteLogo" class="btn btn-default">Delete Logo</a>
            </div>
      </div>
 
      <div class="row"> 
          <div class="form-inline">
                      <button id="_main_comp_btnSaveProfile" type="button" class="btn btn-success">
                              <i class="la la-save"></i>
                              <span class="kt-hidden-mobile">Save Changes</span>
                      </button>
      
          </div>
      </div>
</div>

</div>
 