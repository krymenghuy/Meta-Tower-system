<div id="_sttn_deliveryZoneComponent" style="display:none;padding:15px">
  <div class="d-flex justify-content-between p-2 bg-white rounded-3 p-3 shadow">
    <div class="d-flex gap-2">
      <input id="_sttn_zone_search" type="text" class="form-control" placeholder="Search zone">
      <button type ="button" id="_sttn_btnSearch" class="btn btn-primary">
        <i class="la la-search fs-5"></i>
      </button>
    </div>
    <div class="d-flex gap-2">
      <button id="_sttn_zon_lnkNewZone" class="btn btn-primary">
        <i class="fas fa-plus fs-5"></i>
        <span class="trans-text" data-langprop="buttons.New Zone"></span>
      </button>
      <button id="_zone_btnPrint" type="button" class="btn btn-outline-success">
        <i class="fas fa-print fs-5"></i>
        <span class="trans-text" data-langprop="buttons.Print"></span>
      </button>
    </div>
  </div>
  <div id="_sttn_delivery_zones" class="d-flex flex-column shadow rounded-3 bg-white p-3 mt-3"></div>
</div>

<div class="modal fade" id="_sttn_dlgZon" tabindex="-1" role="dialog" aria-labelledby="_sttn_dlgZoneTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
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
            <div class="form-group">
              <label for="country_code" class="col-form-label">Country Code</label>
              <input type="text" class="form-control data-input" data-field="country_code" placeholder="country code ">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="country_name" class="col-form-label">Country Name</label>
              <input type="text" class="form-control data-input" data-field="country_name" placeholder="name country">
            </div>
          </div>
          
        </div>
        <div class="row">
        <div class="col-lg-6">
            <div class="form-group">
              <label for="standard_zone" class="col-form-label">Standard Zone</label>
              <input type="text" class="form-control data-input" data-field="standard_zone" placeholder="standard zone">
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