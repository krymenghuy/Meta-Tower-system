<div id="_main_reservation_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_reservation" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_reservation" placeholder="Search by amenity or phone number">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_reservation_status" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-5">
                <div id="_dateFilter_receipt" class="d-flex align-items-center gap-3">
                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="booking_date" />
                        <label class="form-label">From Date</label>
                    </div>

                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="booking_date_to" />
                        <label class="form-label">To Date </label>
                    </div>
                </div>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnReservation">
                    <i class="me-2 fa-solid fa-calendar" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Create Reservation"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_reservation_list" class="mt-3 rounded-2"></div>
</div>