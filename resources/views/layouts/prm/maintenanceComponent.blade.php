<div id="_main_maintenance_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_maintenance" class="rounded-2 p-3 bg-white shadow-sm">
       <div class="row g-3 align-items-center">
           <div class="col-12 col-md-6 col-lg-3">
               <input type="text" class="rounded-2 filter-field input-search" id="_search_maintenance" placeholder="Search by Unit">
           </div>
           <div class="col-12 col-md-6 col-lg-2">
               <select id="_maintenance_building_id" class="data-input filter-field form-control" data-field="building_id"></select>
           </div> 
           <div class="col-12 col-md-6 col-lg-2">
               <select id="_maintenance_type_id" class="data-input filter-field form-control" data-field="unit_type"></select>
           </div>
           <div class="col-12 col-md-6 col-lg-2">
               <select id="_maintenance_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
           </div>
           <div class="col-12 col-md-3 col-lg-auto ms-md-auto text-md-end">
               <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btn_maintenance">
                   <i class="fa-solid fa-wrench me-2"></i>
                   <span vslang="buttons.Create Maintenance"></span>
               </button>
           </div>
       </div>
   </div>
   <div id="_maintenance_list" class="table-responsive mt-3 rounded-2"></div>
</div>
