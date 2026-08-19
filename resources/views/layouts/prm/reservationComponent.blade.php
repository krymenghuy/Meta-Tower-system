<div id="_main_reservation_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_reservation" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="rounded-2 filter-field input-search" id="_search_reservation" placeholder="{{ \Vsd\Locales\Localization::trans('Search by tenant, amenity or phone', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_reservation_status" class="data-input filter-field" data-field="status_id" placeholder='vslang="titles.All Statuses"'></select>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div id="_dateFilter_receipt" class="d-flex gap-3 align-items-center">
                    <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="booking_date" />
                        <label vslang="titles.Select From Date" class="form-label">Select From Date</label>
                    </div>

                    <div class="material-input outlined flex-fill" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="form-control filter-field range-filter" placeholder=" " data-field="booking_date_to" />
                        <label vslang="titles.Select To Date" class="form-label">Select To Date</label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-auto  ms-md-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnReservation">
                    <i class="fa-solid fa-calendar me-2" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Create Reservation"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_reservation_list" class="mt-3  rounded-2"></div>
</div>
