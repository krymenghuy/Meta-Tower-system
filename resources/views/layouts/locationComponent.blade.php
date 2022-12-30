<div id="_sttn_locationsComponent" style="width:auto;display:none;margin:15px 15px 15px">

  <div class="row">
      <div class="col-lg-6">
        <div id="_sttn_loc_countryListpanel" class="border-style1" style=" background-color:#EAFAF1;padding:10px;height:570px">
             <span style="font-size:15px;font-weight:bold;color:green">Countries</span>
             <a id="_sttn_loc_lnkNewCountry" href="#">(<i class="fa fa-plus" style="color:green"></i>)</a>
             <div style="height:2;border-bottom:1.5px solid green;width:50%;"></div>  
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
             <div class="tab-header">
               <a href="#" class="tab-button" data-viewname="cities" data-target="_sttn_tabpanel_cities">CITIES (PROVINCE)</a>
               <a href="#" class="tab-button" data-viewname="districts" data-target="_sttn_tabpanel_districts">DISTRICTS (KHAN)</a>
               <a href="#" class="tab-button" data-viewname="communes" data-target="_sttn_tabpanel_communes">COMMUNES(SANGKAT)</a>
             </div>
             <!--begin::tab-body-->
             <div class="tab-body">
                 <div class="tab-panel border-style1" id="_sttn_tabpanel_cities" style="height:520px;padding:10px" data-viewname="cities">
                     <a id="_sttn_loc_lnkNewCity" href="#" class="btn btn-sm btn-outline-success btn-hover" >Add City</a>
                      <table id="_sttn_loc_tblCities" class="table fixed-body-table">
                        <thead>
                        </thead>
                        <tbody id="_sttn_loc_tblCities_body" style="height:430px">
                        </tbody>
                      </table>
                 </div>

                 <div class="tab-panel border-style1" id="_sttn_tabpanel_districts" style="height:520px;padding:10px" data-viewname="districts">
                    <div class="form-inline">
                         <select class="select2" style="min-width:200px" id="_sttn_loc_filter_city"></select> &nbsp;&nbsp;
                         <a id="_sttn_loc_lnkNewDistrict" class="btn btn-sm btn-outline-success btn-hover" href="#">Add district</a>                       
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

                 
                 <div class="tab-panel border-style1" id="_sttn_tabpanel_communes" style="height:530px;padding:10px" data-viewname="communes">
                      <div class="form-inline">
                      <select class="select2" style="min-width:200px" id="_sttn_loc_filter_city_district"></select> &nbsp;
                      <select class="select2" style="min-width:200px" id="_sttn_loc_filter_district"></select> &nbsp;&nbsp;
                         <a id="_sttn_loc_lnkNewCommune" href="#" class="btn btn-sm btn-outline-success font-weight-bolder" >Add commune</a>                       
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