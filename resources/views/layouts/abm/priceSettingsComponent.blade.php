<style>
  .ps-dtype-normal-text,
  .ps-dtype-fast-text {
    display: block;
    font-weight: bold;
    font-size: 0.9em;
  }

  .ps-dtype-normal-text {
    color: blue;
    display: block;
    border-bottom: 1.1px solid blue;
  }

  .ps-dtype-fast-text {
    color: red;
    display: block;
    border-bottom: 1.1px solid red;
    margin-right: 15px;
  }

  table#ps-tbl_prices>thead th {
    border-bottom: none;
    padding: 0px;
  }

  table#ps-tbl_prices>tbody td:last-child {
    border-left: 1.2px solid #D2D9DA !important;
  }

  .ps-zones {
    font-size: 0.9em;
  }

  .dd-label,
  .dd-value {
    font-size: 0.8em;
  }

  div.ps-zones {
    padding-top: 10px;
    padding-bottom: 5px;
    font-weight: bold;
    color: grey;
    font-size: 0.9em;
    /* text-align: center; */
  }

  .dd-field-container {
    width: 100%;
  }

  .dd-field-container .dd-label {
    display: inline-block;
    color: grey;
    width: 120px;
  }

  .dd-field-container .dd-value::before {
    content: ':';
    padding-right:10px;
  }

  .ps-below-kg {
    padding: 3px;
    text-align: center;
    font-weight: bold;
    color: #000;
    display: block;
    background-color: orange;
  }

  .ps-above-kg {
    padding: 3px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    display: block;
    background-color: green;
  }

  .ps-item-label {
    display: block;
    font-size: 0.9em;
    font-weight: bold;
  }

  .has-error {
    border: 1px solid red !important;
  }

  .ps-is-member>td {
    color: green;
  }
</style>

<div id="_sttn_priceSettingsComponent" style="display:none;padding-right:15px">
  <div class="d-flex flex-column shadow rounded-3 justify-content-between bg-white p-3">
    <div class="d-flex gap-2">
      <div class="d-flex gap-2">
        <label class="control-label">Price list</label>
        <a href="javascript:void(0)" id="ps-lnk_add_price_list">
          <i class="fa fa-plus-circle fs-5 text-success"></i>
        </a>
        <a href="javascript:void(0)" id="ps-lnk_delete_price_list" style="display:none">
          <i class="fa fa-trash fs-5 text-danger"></i>
        </a>
        <a href="javascript:void(0)" id="ps-lnk_rename_price_list" style="display:none">
          <i class="fa fa-edit fs-5 text-warning"></i>
        </a>
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <div class="d-flex gap-2">
        <div class="d-flex gap-2">
          <div class="min-width-select">
            <select id="ps_filter_price_list" class="modal-select2"></select>
          </div>
          <div class="d-flex align-items-start">
            <button style="display:none" id="ps-lnk_merchant_list" type="button" class="btn btn-sm btn-primary">
              <i class="fa fa-users"></i>
            </button>
          </div>
        </div>
        <div class="form-group">
          <input id="ps_pl_search_merchant" type="text" class="form-control" placeholder="Search merchant">
        </div>
      </div>
      <div class="d-flex align-items-center">
        <button id="ps-btnNewPriceZones" class="btn btn-sm btn-primary">
          <i class="fa fa-plus fs-5"></i>
          <span>New Zones</span>
        </button>
      </div>
    </div>
  </div>
  <div class="table-responsive shadow rounded-3 border pe-3 ps-3 pt-0 bg-white mt-3 table-responsive-hover position-relative">
    <table class="table" id="ps-tbl-prices">
      <thead class="position-sticky top-0 bg-white">
        <tr>
          <th scope="col" class="border-0 p-0">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th style=" width: 20%;">
                    <span class=" rounded py-2">Zone Code</span>
                  </th>
                  <th style=" width: 20%;">
                    <span class=" rounded py-2">Country</span>
                  </th>
                  <th style=" width: 20%;">
                    <span class=" rounded py-2">Doc Price</span>
                  </th>
                  <th style=" width: 20%;">
                    <span class=" rounded py-2">Non-Doc Price</span>
                  </th>
                  <th style=" width: 20%;">
                    <span class=" rounded py-2">Action</span>
                  </th>
                </tr>
              </thead>
            </table>
          </th>
          
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</div>

<div class="modal fade" id="_ps_dlgPriceLine" tabindex="-1" role="dialog" aria-labelledby="_ps_dlgPriceLineTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="_ps_dlgPriceLineTitle">Add Zones</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-lg-6">
            <label for="" class="control-label">Country</label>
            <select id="_ps_newzone_zone" class="modal-select2 data-input" data-field="country_id"></select>
          </div>
          <!-- <div class="form-group col-lg-6">
            <a href="javascript:void(0)" id="_ps_btnAddZone">
              <i class="fa fa-plus-circle text-success" style="font-size:1.2em"></i>
            </a>
          </div> -->
          
          <div class="form-group col-lg-6">
            <label for="" class="control-label">Zone Number</label>
            <input type="number" id="_ps_newzone_zone_codes" class="form-control data-input" data-field="zone_codes">
          </div>
          <div class="form-group col-lg-6">
            <label for="" class="control-label">Doc Price</label>
            <input type="number" id="_ps_doc_price" class="form-control data-input" data-field="doc_price">
          </div>
          <div class="form-group col-lg-6">
            <label for="" class="control-label">Non-Doc Price</label>
            <input type="number" id="_ps_non_doc_price" class="form-control data-input" data-field="non_doc_price">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <span id="_ps_dlgPriceLine_error" class="error_text"></span>
        <button type="button" class="btn btn-warning height" data-dismiss="modal">
          <i class="fa fa-times fs-5 text-danger"></i>
          <span>Cancel</span>
        </button>
        <button type="button" class="btn btn-success height" id="_ps_dlgPriceLine_btnOK">
          <i class="fa fa-check fs-5 text-success"></i>
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="ps_dlgPriceList" tabindex="-1" role="dialog" aria-labelledby="ps_dlgPriceListTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ps_dlgPriceListTitle">Create Price List</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-lg-12">
            <span class="simple-label">Price list name</span>
            <input type="text" class="form-control" id="ps-newpl_name">
          </div>
          <div class="form-group col-lg-12">
            <span class="simple-label">Marker Weight (kg)</span>
            <input type="number" class="form-control" id="ps-newpl_kg_marker">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <span id="ps_dlgPriceList_error" class="error_text"></span>
        <button type="button" class="btn btn-warning height" data-dismiss="modal">
          <i class="fa fa-times fs-5 text-danger"></i>
          <span>Cancel</span>
        </button>
        <button type="button" class="btn btn-success height" id="ps_dlgPriceList_btnOK">
          <i class="fa fa-check fs-5 text-success"></i>
          <span>Add</span>
        </button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="ps_dlgMerchantList" tabindex="-1" role="dialog" aria-labelledby="ps_dlgMerchantListTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg vs-modal-dialog modal-dialog-scrollable" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="ps_dlgMerchantListTitle">Merchant List</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body position-relative">
        <div class="input-group flex-nowrap bg-white p-2 position-sticky top-0">
          <input id="ps-search_merchant" type="text" class="form-control" placeholder="Search by phone, name">
          <div class="input-group-text" id="ps-btnSearchMerchant" role="button">
            <i class="la la-search fs-5 text-success"></i>
          </div>
        </div>
        <table class="table fixed-body-table" id="ps-tblMerchants">
          <thead>
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>
                <a href="javascript:void(0)" id="ps-lnkAddMerchant" class="btn btn-sm btn-outline-primary">
                  <i class="fa fa-user-plus"></i>
                </a>
              </th>
            </tr>
          </thead>
          <tbody id="ps-tblMerchants_body" style="max-height:450px; overflow-y:auto"></tbody>
        </table>
      </div>
      <div class="modal-footer">
        <span id="ps_dlgMerchantList_error" class="error_text"></span>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">
          <i class="fa fa-times fs-5 text-danger"></i>
          <span>Close</span>
        </button>
      </div>
    </div>
  </div>
</div>