<div id="_main_payment_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_payment" class="rounded-2 p-3 bg-white shadow-lg">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_payment" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>
             <div class="col-12 col-md-6 col-lg-2 d-none">
                <select id="tenant_id" class="data-input filter-field form-control" data-field="tenant_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_method_id" class="data-input filter-field form-control" data-field="payment_method_id"></select>
            </div>  
             
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btn btn--Options w-70 w-md-auto" id="_btnPayment">
                      <i class="fa-solid fa-money-check-dollar mr-2"></i>
                    <span vslang="buttons. Payment"></span>
                </button>
            </div>
        </div>
    </div> 
    <div id="_summary_cards" class="mt-3 rounded-2 "></div>
    <div id="_payment_list" class="table-responsive  mt-3 bg-white shadow-lg rounded-2 border"></div>
</div>

