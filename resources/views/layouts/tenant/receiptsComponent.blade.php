<div id="_main_receipts_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_receipts" class="rounded-2 p-3 bg-white shadow-lg">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="rounded-2 filter-field input-search" id="_search_receipts" placeholder="Search by invoice no or receipt no">
            </div>
         </div>
        <div class="col-12 col-md-6 col-lg-5">
            <div id="_dateFilter_receipts" class="d-flex gap-3 align-items-center">
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
        {{-- <div class="col-12 col-md-6 col-lg-2">
            <select id="_receipts_status" class="data-input filter-field form-control" data-field="status_id" placeholder="Status"></select>
        </div> --}}

        </div>

    </div>
    <div id="_receipts_list" class="table-responsive  mt-3 rounded-2"></div>
</div>
<script src="{{ asset('js/components/prm/PrintReceipt.js') }}"></script>
