<div id="_main_importDataComponent" class="mobile-padding p-3" style="display:none">
  <div class="p-3 rounded-2" style="background-color: #e2e5e9;">
    <div class="row y-3 justify-content-between">
      <div class="col-12 ">
        <!-- <button id="_iht_btn_new" class="btnAddNewEdv w-100" type="button">
          <i class="fa-solid fa-file-import fs-6 me-2"></i>
          <span vslang="buttons.Import Students"></span>
        </button> -->
        <!-- Action Buttons Section -->
        <div class="d-flex flex-sm-row gap-3 mb-3">
            <!-- Existing "Import Students" Button Placeholder -->
            <button id="_iht_btn_new" class="btnAddNewPrm d-flex align-items-center justify-content-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="me-2" style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.904 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span vslang="buttons.import_employees"></span>
            </button>
            <button id="_iht_btn_new_benefit" class="btnAddNewPrm d-none align-items-center justify-content-center shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="me-2" style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.904 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                Import Employee Benefits
            </button>
            <!-- NEW Download Sample Button --> 
            <a href="{{ route('download.template') }}" 
               id="downloadButton"
               class="btn btn-success d-flex align-items-center justify-content-center shadow-sm" >
                <svg xmlns="http://www.w3.org/2000/svg" class="me-2" style="width: 1.25rem; height: 1.25rem;" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v7a1 1 0 11-2 0V3a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
               <span vslang="buttons.download_sample_template_excel_csv"></span>
            </a>
        </div>

        <p class="w-100 small mb-0 p-3 bg-warning-subtle rounded border border-warning" vslang="titles.import_employee_note">
            
        </p>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <button id="_iht_btn_old" class="d-none btn btnAddNewPrm w-100" type="button">
          <span vslang="buttons.Old Student"></span>
        </button>
      </div>

    </div>
  </div>

  <div id="_iht_container_tbl" class="table-responsive border p-3 rounded-2 bg-white table-responsive-hover mt-3"></div>
</div>
