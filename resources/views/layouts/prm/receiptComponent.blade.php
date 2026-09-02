<div id="_main_receipt_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_receipt" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input  type="text" class="rounded-2 filter-field input-search" id="_search_receipt" placeholder="{{ \Vsd\Locales\Localization::trans('search_invoice_no_receipt_no', 'labels') }}">
            </div>
         </div>
        <div class="col-12 col-md-6 col-lg-5">
            <div id="_dateFilter_receipt" class="d-flex gap-3 align-items-center">
                <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="date_from" />
                    <label vslang="titles.From Date" class="form-label">From Date</label>
                </div>

                <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                    <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="date_to" />
                    <label vslang="titles.To Date" class="form-label">To Date</label>
                </div>
            </div>
        </div>
        <div class="col-12 col-md-6 col-lg-2">
            <select id="_receipt_status" class="data-input filter-field form-control" data-field="status_id" placeholder='vslang="titles.All Statuses"'></select>
        </div>

        </div>

    </div>
    <div id="_receipt_list" class="table-responsive  mt-3 rounded-2"></div>
</div>
<script src="{{ asset('js/components/prm/PrintReceipt.js') }}"></script>
