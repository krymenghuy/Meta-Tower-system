<div id="_main_invoice_component" class="p-3 mobile-padding" style="display:none;">
     <div id="_divFilter_invoice" class="bg-white shadow-sm p-3 rounded-2" >
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-4" >
                <div class="position-relative w-100">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_invoice" placeholder="Search by tenant or invoice no" >
            </div>
         </div>

        <div class="col-12 col-md-6 col-lg-2">
            <select id="payment_status" class="filter-field data-input form-control" data-field="status_id"></select>
        </div>
        <div class="col-12 col-md-6 col-lg-2">
            <select id="invoice_type" class="filter-field data-input form-control" data-field="invoice_type"></select>
        </div>
        <div class="col-12 col-md-6 col-lg-5">
            <div id="_dateFilter_invoice" class="d-flex gap-3 align-items-center">
                <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="date_from" />
                    <label class="form-label">From Date</label>
                </div>

                <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="date_to" />
                    <label class="form-label">To Date </label>
                </div>
            </div>
        </div>

            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnInvoice">
                        <i class="mr-2 fa-solid fa-file-invoice-dollar"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>

        </div>

    </div>

    <div id="_invoices_list" class="table-responsive bg-white mt-3 border rounded-2"></div>
</div>

<script src="{{ asset('js/components/prm/InvoiceTaxDialog.js') }}"></script>
<script src="{{ asset('js/components/prm/InvoiceNoTaxDialog.js') }}"></script>
<script src="{{ asset('js/components/prm/InvoiceCommercialDialog.js') }}"></script>
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



