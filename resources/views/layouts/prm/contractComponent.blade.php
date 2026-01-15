<div id="_main_contract_component" class="mobile-padding p-3" style="display: none;">
   <div id="_divFilter_contract" class= "rounded-2 p-3" style="background-color:#eaeaea;">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class=" position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_contract" placeholder="Search">
                    <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>
           
            <div class="col-12 col-md-6 col-lg-2">
                <select id="business_type_id" class="data-input filter-field form-control" data-field="business_type_id"></select>
            </div>  
             <div class="col-12 col-md-6 col-lg-2">
                <select id="space_type_id" class="data-input filter-field form-control" data-field="space_type_id"></select>
            </div>
        
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end mt-2">
            <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAddContract">
                <i class="fa-regular fa-building fa-lg me-2 pt-1"></i>
                <span vslang="buttons.Create Contract"></span>
            </button>
            </div>
        </div>
    </div> 
    <div id="_contract_list" class="table-responsive border bg-white rounded-2 mt-3"></div>
</div>

