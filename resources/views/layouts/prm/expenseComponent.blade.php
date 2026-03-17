<div id="_main_expense_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_expense" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_expense" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>

            <div class="col-12 col-md-auto col-lg-auto">
                <button type="button" class="btn btn-outline-secondary rounded-2 filter-field" id="_btnFilter_expense" title="Filter">
                    <i class="fa fa-filter me-1"></i>
                    <span vslang="buttons.Filter">Filter</span>
                </button>
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btn btn--Options w-60 w-md-auto" id="_btnExpense">
                    <i class="fa-solid fa-receipt mr-2"></i>
                    <span vslang="buttons.New Expense"></span>
                </button>
            </div>
        </div>
    </div> 

    <div id="_expense_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>