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

<div class="modal fade" id="_sttn_dlgZone" tabindex="-1" role="dialog" aria-labelledby="_sttn_dlgZoneTitle" aria-hidden="true">
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
              <label for="zone_type" class="col-form-label">Zone Type</label>
              <div class="min-width-select max-width-select">
                <select id="_sttn_zoneType" class="modal-select2 data-input" data-field="zone_type">
                  <option value="Local">Local</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="zone_code" class="col-form-label">Zone Code</label>
              <input type="text" class="form-control data-input" data-field="zone_code" placeholder="zone code">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <label for="zone_name" class="col-form-label">Zone Name</label>
              <span class="text-muted"> (usu.Sangkat)</span>
              <input type="text" class="form-control data-input" data-field="zone_name" placeholder="zone name">
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label for="" class="col-form-label trans-text" data-langprop="zone.Country"></label>
              <div class="min-width-select max-width-select">
                <select id="_sttn_zon_country" class="modal-select2 data-input" data-field="country_id"></select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <label class="col-form-label trans-text" data-langprop="zone.City">City</label>
              <div class="min-width-select max-width-select">
                <select id="_sttn_zon_city" type="text" class="modal-select2 data-input" data-field="city_id"></select>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label class="col-form-label trans-text" data-langprop="zone.District (Khan)">District (Khan)</label>
              <div class="min-width-select max-width-select">
                <select id="_sttn_zon_district" class="modal-select2 data-input" data-field="district_id"></select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6">
            <div class="form-group">
              <label class="col-form-label trans-text" data-langprop="zone.Commune (Sangkat)">Commune (Sangkat)</label>
              <div class="min-width-select max-width-select">
                <select id="_sttn_zon_commune" type="text" class="modal-select2 data-input" data-field="commune_id"></select>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="form-group">
              <label class="col-form-label trans-text" data-langprop="zone.Description">Description</label>
              <input type ="text" class="form-control data-input" data-field="description">
            </div>
          </div>
          <div class="col-lg-6" style="display:none">
            <div class="form-group">
              <label class="col-form-label">Price</label>
              <input type ="number" class="form-control data-input" data-field="price">
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