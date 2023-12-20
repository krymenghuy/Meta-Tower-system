<div id="_um_userManagementComponent" class="mobile-padding p-3" style="display:none">
  <div class="d-flex">
    <div class="d-flex gap-2">
      <button id="_um_btn_new" class="btn btn-sm btn-primary shadow text-nowrap" type="button">
        <i class="fa-solid fa-plus"></i>
        <span class="trans-text text-nowrap" data-langprop="buttons.New User"></span>
      </button>
      <div class="input-group flex-nowrap width--search-inner shadow">
        <input type="search" class="form-control" placeholder="Search user" id="_um_search_user"/>
        <div class="input-group-text">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>
      <div class="width--search-inner-sm shadow">
        <select id="_um_filter_userclass" class="modal-select2"></select>
      </div>
    </div>
    <div class="d-flex justify-content-end w-100">
      <button id="_um_btn_pdf" class="btn btn-sm btn-danger" type="button">
        <span class="trans-text" data-langprop="buttons.PDF"></span>
      </button>
    </div>
  </div>
  <div id="_um_container" class="table-responsive mt-3 table-responsive-hover"></div>
  <div class="py-2" id="container_pagination_um"></div>
</div>

<div class="modal fade" id="dlg_um_" tabindex="-1" aria-labelledby="dlg_um_title" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <button type="button" id="dlg_um_btn_close" class=" btn btn-sm btn-secondary" data-dismiss="modal">
          <span class="trans-text" data-langprop="buttons.OK"></span>
        </button>
        <button id="dlg_um_btn_save" type="button" class="btn btn-sm btn-primary">
          <span class="trans-text" data-langprop="buttons.Save"></span>
        </button>
      </div>
    </div>
  </div>
</div>