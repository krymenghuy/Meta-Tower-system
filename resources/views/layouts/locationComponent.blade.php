<div id="_sttn_locationsComponent" style="display:none">
  <div class="row">
      <div class="col-lg-6">
        <div id="_sttn_loc_countryListpanel" class="border-style1" style="margin-top:40px;background-color:#F6FAFA;padding:10px;height:40vw;">
             <span class="py-2" style="font-size:15px;font-weight:bold;color:green">Countries</span>
             <a id="_sttn_loc_lnkNewCountry" href="#">(<i class="fa fa-plus" style="color:green"></i>)</a> 
             <table id="_sttn_loc_tblCountries" class="table fixed-body-table">
               <thead>
               </thead>
               <tbody id="_sttn_loc_tblCountries_body" style="max-height:350px">
               </tbody>
            </table>
        </div>
     </div>
     
       <div class="col-lg-6">
          <div class="tab-view" id="_sttn_loc_subLocationTabView">
             <div class="tab-header py-2">
               <a href="#" class="tab-button" data-viewname="cities" data-target="_sttn_tabpanel_cities">CITIES (PROVINCE)</a>
               <a href="#" class="tab-button" data-viewname="districts" data-target="_sttn_tabpanel_districts">DISTRICTS (KHAN)</a>
               <a href="#" class="tab-button" data-viewname="communes" data-target="_sttn_tabpanel_communes">COMMUNES(SANGKAT)</a>
             </div>
             <div class="tab-body">
                 <div class="tab-panel border-style1" id="_sttn_tabpanel_cities" style="height:40vw;padding:10px" data-viewname="cities">
                     <a id="_sttn_loc_lnkNewCity" href="javascript:void(0)" class="btn btn-outline-success btn-hover">Add City</a>
                      <table id="_sttn_loc_tblCities" class="table fixed-body-table">
                        <thead>
                        </thead>
                        <tbody id="_sttn_loc_tblCities_body" style="height:430px">
                        </tbody>
                      </table>
                 </div>

                 <div class="tab-panel border-style1" id="_sttn_tabpanel_districts" style="height:40vw;padding:10px" data-viewname="districts">
                    <div class="row">
                        <div class="col-8">
                          <select class="select2" style="width:300px; min-width:300px" id="_sttn_loc_filter_city"></select>
                        </div>
                        <div class="col-4">
                           <a id="_sttn_loc_lnkNewDistrict" class="btn btn-outline-success btn-hover" href="#"><span class="text-no-wrap">Add district</span></a>
                        </div>                        
                      </div>
                      <table id="_sttn_loc_tblDistricts" class="table fixed-body-table">
                        <thead>
                          <tr>
                            <th>District<th>
                            <th>City<th>
                            <th>Country<th>
                            <th><th>
                          </tr>
                        </thead>
                        <tbody id="_sttn_loc_tblDistricts_body" style="height:430px">
                        </tbody>
                      </table>
                 </div>

                 <div class="tab-panel border-style1" id="_sttn_tabpanel_communes" style="height:40vw;padding:10px" data-viewname="communes">
                      <div class="row">
                          <div class="form-group col-lg-4">
                             <select class="modal-select2"   id="_sttn_loc_filter_city_district"></select>
                          </div>
                          <div class="form-group col-lg-4">
                             <select class="modal-select2"  id="_sttn_loc_filter_district"></select>
                          </div>
                          <div class="form-group col-lg-4">
                              <a id="_sttn_loc_lnkNewCommune" href="javascript:void(0)" class="btn btn-outline-success font-weight-bolder">Add commune</a>                       
                          </div>
                          </div> 
                      <table id="_sttn_loc_tblCommunes" class="table fixed-body-table">
                        <thead>
                          <tr>
                            <th>Commune (Sangkat)<th>
                            <th>District (Khan)<th>
                            <th>City (Province)<th>
                          </tr>
                        </thead>
                        <tbody id="_sttn_loc_tblCommunes_body" style="height:395px">
                        </tbody>
                      </table>
                 </div>

             </div>
             <!--end::div.tab-body-->
          </div> 
      </div>       

  </div>

  <!-- <div class="row" style="margin-top:15px;">
      <div class="col-lg-12">
          <div style="float:right">
             <button type="button" class="btn btn-primary" id="_sttn_loc_btnBack"><i class="fa fa-angle-double-left"></i> Back </button> 
          </div>
      </div>
  </div> -->
</div>