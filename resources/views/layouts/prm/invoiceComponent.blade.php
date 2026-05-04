<div id="_main_invoice_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_invoice" class="rounded-2 p-3 bg-white shadow-sm" >
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4" >
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_invoice" placeholder="Search By Tenant or Invoice No" >
            </div>
         </div>


           <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnInvoice">
                        <i class="fa-solid fa-file-invoice-dollar mr-2"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>

        </div>

    </div>

    <div id="_invoices_list" class="table-r esponsive  mt-3 bg-white rounded-2 border"></div>
</div>

<script src="{{ asset('js/components/prm/PrintInvoiceDialog.js') }}"></script>
<style>
.status-overdue {
    color: #990000 !important;
    background-color: rgba(178, 34, 34, 0.1);
    border: 1px solid #fd397a;
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 400;
    display: inline-block;
}
/* Professional Green for Paid Status */
.status-paid {
    color: #157347 !important;                /* Deep green for text */
    background-color: rgba(25, 135, 84, 0.1); /* Subtle green tint (10% opacity) */
    border: 1px solid rgba(25, 135, 84, 0.3); /* Subtle green border */
    padding: 0.25rem 0.6rem;
    border-radius: 4px;
    font-weight: 600;
    display: inline-block;
    text-transform: capitalize;
}
</style>



