<div id="_main_contract_component" class="mobile-padding p-3" style="display: none;">
    <div id="_divFilter_contract" class= "rounded-2 p-3" style="background-color:white;">
         <div class="row g-3 align-items-center">
             <div class="col-12 col-md-6 col-lg-3">
                 <div class=" position-relative w-100">
                     <input type="text" class="rounded-2 filter-field input-search" id="_search_contract" placeholder="Search by tenant, phone or unit">
                 </div>
             </div>
             <div class="col-12 col-md-6 col-lg-3">
                 <select id="business_type_id" class="data-input filter-field form-control" data-field="business_type_id"></select>
             </div>
             <div class="col-12 col-md-6 col-lg-2">
                 <select id="el_contract_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
             </div>
             <div class="col-12 col-md-auto ms-md-auto text-md-end">
             <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAddContract">
                 <i class="fa-regular fa-file-lines me-2"></i>
                 <span vslang="buttons.Create Contract"></span>
             </button>
             </div>
         </div>
     </div>
     <div id="_contract_list" class="table-responsive rounded-2 mt-3"></div>
 </div>

