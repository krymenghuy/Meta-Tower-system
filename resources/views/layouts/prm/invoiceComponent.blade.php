<div id="_main_invoice_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_invoice" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_invoice" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>
         <div class="col-6 col-md-3 col-lg-2  text-md-end">
                <input data-select="datepicker" class="form-control filter-field" placeholder="Select Date" data-field="start_date" />
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btn btn--Options w-70 w-md-auto" id="_btnInvoice">
                      <i class="fa-solid fa-file-invoice-dollar mr-2"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>
        </div>

    </div> 

    <div id="_invoice_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>
<style>
.btn--Options {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(89deg, #3c2fa3 0%, #1a1647 100%);
    color: #fff;
    border: none;
    border-radius: 6px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    padding: 0.55rem 1.5rem;
    font-weight: 500;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.btn--Options:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
    .btn--Options {
        width: 100%;
    }
}
</style>
