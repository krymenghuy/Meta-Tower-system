<style>
    table#_sttn_zon_tblZones>thead th{
      font-size:0.7em;
      text-transform:uppercase;
    }
   table#_sttn_zon_tblZones>tbody td{
    font-family:'Khmer OS Content','DaunPenh','Francois One','Bayon','Verdana','Arial Black (sans-serif)','Arial (sans-serif)','Tahoma (sans-serif)';
    font-size:0.8em;
   }
</style>
<div id="_sttn_deliveryZoneComponent" style="width:auto;display:none;;padding:15px;margin:15px 15px 15px">
  <div class="row">
      <div class="col-lg-12">
        <div id="_sttn_zon_deliveryZoneList" class="border-style1" style=" background-color:#EAFAF1;padding:10px;height:450px">
             <span style="font-size:15px;font-weight:bold;color:green">ZONES</span>
             <a id="_sttn_zon_lnkNewZone" href="#">(<i class="fa fa-plus" style="color:green"></i>)</a>
             <div style="height:2;border-bottom:2px solid orange;width:50%;"></div>  
             <table id="_sttn_zon_tblZones" class="table fixed-body-table">
               <thead>
                  <tr>
                    <th>Type</th> 
                    <th>Zone Code</th>
                    <th>Zone Name</th>
                    <th>Sangkat</th>
                    <th>Khan</th>
                    <th>City</th>
                    <th>Country</th>
                    <th></th>
                  </tr>
               </thead>
               <tbody id="_sttn_zon_tblZones_body" style="max-height:350px">
               </tbody>
            </table>
        </div>
     </div>
     
  </div>

  <!-- <div class="row" style="margin-top:15px;">
      <div class="col-lg-12">
          <div style="float:right">
             <button type="button" class="btn btn-primary" id="_sttn_zon_btnBack"><i class="fa fa-angle-double-left"></i> Back </button> 
          </div>
      </div>
  </div> -->
</div> 

 <!--begin::ZoneDialo-->
 <div class="modal fade" id="_sttn_dlgZone" tabindex="-1" role="dialog" aria-labelledby="_sttn_dlgZoneTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_sttn_dlgZoneTitle">Delivery Zone</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
           <div class="row">
              <div class="col-lg-6">
                  <label for="" class="col-form-label">Zone Type</label>
                    <select class="form-control data-input" data-field="zone_type">
                      <option value="Local">Local</option>
                      <option value="International">International</option>
                    </select>
              </div>
              <div class="col-lg-6">
                  <label for="" class="col-form-label">Zone Code</label>
                    <input type="text" class="form-control data-input" data-field="zone_code" placeholder="zone code">
              </div>
          </div> 
          <div class="row">
              <div class="col-lg-6">
                   <label for="" class="col-form-label">Zone Name</label><span class="text-muted"> (usu. Sangkat)</span>
                    <input type="text" class="form-control data-input" data-field="zone_name" placeholder="zone name">
              </div>
              <div class="col-lg-6">
                  <label for="" class="col-form-label">Country</label>
                    <select id="_sttn_zon_country" class="form-control data-input" data-field="country_id">
                    </select>
              </div>
          </div> 

          <div class="row">
              <div class="col-lg-6">
                   <label  class="col-form-label">City</label>
                    <select id="_sttn_zon_city" type="text" class="modal-select2 data-input" data-field="city_id"></select>
              </div>
              <div class="col-lg-6">
                  <label class="col-form-label">District (Khan)</label>
                    <select id="_sttn_zon_district" class="modal-select2 data-input" data-field="district_id">
                    </select>
              </div>
          </div> 

          <div class="row">
              <div class="col-lg-6">
                   <label  class="col-form-label">Commune (Sangkat)</label>
                    <select id="_sttn_zon_commune" type="text" class="modal-select2 data-input" data-field="commune_id"></select>
              </div>
              <div class="col-lg-6">
                  <label class="col-form-label">Description </label>
                  <input type ="text" class="form-control data-input" data-field="description">
              </div>
              <div class="col-lg-6" style="display:none">
                  <label class="col-form-label">Price</label>
                  <input type ="number" class="form-control data-input" data-field="price">
              </div>
          </div>
      </div>
      <div class="modal-footer">
         <span class="error_text" id="_sttn_dlgZone_error"></span>&nbsp;&nbsp;
        <button type="button" class="btn btn-warning" data-dismiss="modal">Cancel</button>
         <button type="button" class="btn btn-primary" id="_sttn_dlgZone_btnOK">OK</button>
      </div>
    </div>
  </div>
</div>
 <!--end::ZoneDialog-->
  <script async src="{{ asset('js/DeliveryZoneComponent.js') }}"></script>