<!-- <style>    
.set-parent-active .active span {
    border:1px solid #ffb822 !important;
    background-color: #dfdfdf87 !important;
    color: #1167c9 !important;    
  }
</style> -->
<div id="_sttn_locationsComponent"   style="display:none;padding:15px; overflow: auto;height: 95.5%;">
  <div class="bg-white p-3 rounded-3">
    <div class="row">
      <div class="col-lg-6">
        <div id="_sttn_loc_countryListpanel" class="border-style1 rounded-3 border" style="margin-top:40px;background-color:#F6FAFA;padding:10px;height:40vw;">
          <span class="py-2 text-success fw-bold" style="font-size:15px">Countries</span>
          <a id="_sttn_loc_lnkNewCountry" href="javascript:void(0)">
            (<i class="fa fa-plus text-success"></i>)
          </a>
          <table id="_sttn_loc_tblCountries" class="table fixed-body-table">
            <thead></thead>
            <tbody id="_sttn_loc_tblCountries_body" style="max-height:350px"></tbody>
          </table>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="tab-view" id="_sttn_loc_subLocationTabView">
          <div class="tab-header gap-2  set-parent-active">
            <a href="javascript:void(0)" class="tab-button" data-viewname="cities" data-target="_sttn_tabpanel_cities">
              <span class="bg-white  rounded-3 p-2 border">CITIES (PROVINCE)</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="districts" data-target="_sttn_tabpanel_districts">
              <span class="bg-white rounded-3 p-2 border">DISTRICTS (KHAN)</span>
            </a>
            <a href="javascript:void(0)" class="tab-button" data-viewname="communes" data-target="_sttn_tabpanel_communes">
              <span class="bg-white rounded-3 p-2 border">COMMUNES(SANGKAT)</span>
            </a>
          </div>
          <div class="tab-body mt-3">
            <div class="tab-panel border-style1" id="_sttn_tabpanel_cities" style="height:40vw" data-viewname="cities">
              <a id="_sttn_loc_lnkNewCity" href="javascript:void(0)" class="btn btn-sm btn-outline-success btn-hover">
                <span>Add City</span>
              </a>
              <div id="_sttn_loc_tblCities" class="table-responsive p-3 rounded-3 border table-responsive-hover mt-2" style="height:95.5%">
                <table  class="table fixed-body-table">
                  <thead></thead>
                  <tbody id="_sttn_loc_tblCities_body"></tbody>
                </table>
              </div>
            </div>
            <div class="tab-panel border-style1" id="_sttn_tabpanel_districts" style="height:40vw" data-viewname="districts">
              <div class="d-flex gap-2">
                <div class="min-width-select">
                  <select class="select2" id="_sttn_loc_filter_city"></select>
                </div>
                <button id="_sttn_loc_lnkNewDistrict" class="btn btn-sm btn-outline-success btn-hover">
                  <span class="text-no-wrap">Add district</span>
                </button>
              </div>
              <div class="table-responsive p-3 rounded-3 border mt-2 table-responsive-hover" style="height:95.5%">
                <table id="_sttn_loc_tblDistricts" class="table fixed-body-table">
                  <thead>
                    <tr>
                      <th>District</th>
                      <th>City</th>
                      <th>Country</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody id="_sttn_loc_tblDistricts_body"></tbody>
                </table>
              </div>
            </div>
            <div class="tab-panel border-style1" id="_sttn_tabpanel_communes" style="height:40vw" data-viewname="communes">
              <div class="d-flex gap-2">
                <div class="min-width-select">
                  <select class="modal-select2" id="_sttn_loc_filter_city_district"></select>
                </div>
                <div class="min-width-select">
                  <select class="modal-select2" id="_sttn_loc_filter_district"></select>
                </div>
                <button id="_sttn_loc_lnkNewCommune" class="btn btn-sm btn-outline-success font-weight-bolder">
                  <span>Add commune</span>
                </button>
              </div>
              <div class="table-responsive rounded-3 border p-3 table-responsive-hover mt-2" style="height:95.5%">
                <table id="_sttn_loc_tblCommunes" class="table fixed-body-table">
                  <thead>
                    <tr>
                      <th>Commune (Sangkat)</th>
                      <th>District (Khan)</th>
                      <th>City (Province)</th>
                    </tr>
                  </thead>
                  <tbody id="_sttn_loc_tblCommunes_body"></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  </div>
</div>


<div class="modal fade" id="_sttn_dlgZon" tabindex="-1" role="dialog" aria-labelledby="_sttn_dlgZoneTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_sttn_dlgZoneTitle"> Zone</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        
      <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <label for="country_name" class="col-form-label">Country Name(EN) :</label>
              <p class="text-danger">*(ឈ្មោះប្រទេស)</p>
              <input type="text" class="form-control text-primary data-input" data-field="name" placeholder="Cambodia">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="country_name" class="col-form-label">Country Name(KH) :</label>
              <p class="text-danger">*(ឈ្មោះប្រទេស)</p>
              <input type="text" class="form-control text-primary data-input" data-field="name" placeholder="(ប្រទេសកម្ពុជា)">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="country_code" class="col-form-label">Code Country :</label>
              <p class="text-danger">(*ឈ្មោះប្រទេសជាអក្សរកាត់)</p>
              <input type="text" class="form-control text-primary data-input" data-field="code" placeholder="CAM">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="standard_zone" class="col-form-label">Zone Code :</label>
              <p class="text-danger">*លេខកូដប្រទេស</p>
              <input type="text" class="form-control text-primary data-input" data-field="standard_zone" placeholder="number">
            </div>
          </div>
          
        </div>
     
       
      </div>
      <div class="modal-footer">
        <span class="error_text" id="_sttn_dlgZone_error"></span>
        <button type="button" class="btn btn-warning" data-dismiss="modal">
          <span>Cancel</span>
        </button>
        <button type="button" class="btn btn-primary" id="_sttn_dlgZone_btnOK">
          <span>OK</span>
        </button>
      </div>
    </div>
  </div>
</div>