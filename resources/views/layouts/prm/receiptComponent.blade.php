<div id="_main_receipt_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_receipt" class="rounded-2 p-3 bg-white shadow-lg">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_receipt" placeholder="Search By Name or Invoice No">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>
            <div class="col-12 col-md-6 col-lg-2">
                <div class="material-input outlined" style="min-width: 180px;">
                    <input type="text" data-type="date" name="due_date" class="form-control data-input" required placeholder="dd-mm-yy">
                    <label class="form-label">Due Date <span class="text-danger">*</span></label>
                </div>

            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_method_id" class="data-input filter-field form-control" data-field="payment_method_id"></select>
            </div>

        </div>



    </div>
    <div id="_receipt_list" class="table-responsive  mt-3 rounded-2"></div>
</div>

