<div id="_main_reservation_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_reservation" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_reservation" placeholder="Search By Name or Phone">
            </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select type="id" id="_reservation_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2">
                <input id="booking_date" data-select="datepicker" class="form-control data-input filter-field" placeholder="Booking Date" data-field="booking_date">
            </div>
            
            
            {{-- <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnReservation">
                      <i class="fa-solid fa-gears mr-2"></i>
                    <span vslang="buttons.New Reservation"></span>
                </button>
            </div> --}}

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
