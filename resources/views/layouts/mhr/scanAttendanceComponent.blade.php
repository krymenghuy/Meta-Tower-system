<div id="_main_attendanceScanComponent" class="p-3 vh-100 vw-100 bg-light">
    <div class="d-flex align-items-center justify-content-center w-100 h-100">
        <div class="d-flex flex-column align-items-center justify-content-start w-100 h-100 bg-white overflow-auto px-3 py-4">
            <!-- Logo -->
            <div class="mb-3 text-center">
                <img src="{{ asset('assets/images/meta/Meta_logo.png') }}" alt="company-logo"
                    style="max-width: 100px; max-height: 100px; object-fit: contain;" />
            </div>

            <!-- Title -->
            <h3 class="fw-bold text-center">ATTENDANCE SCAN</h3>
            <p class="text-center mb-4">Please scan your card ID in this box</p>

            <div class="row d-none">
                <div class="form-group col-lg-12">
                    <label for="employee_code" class="form-label text-center ">Options</label>
                    <select id="_scan_option" class="modal-select2" data-field="force_scan">
                        <option value="regular">Regular</option>
                        <option value="force_checkin">Force Checkin</option>
                        <option value="force_checkout">Force Checkout</option>
                    </select>
                </div>
                <div class="form-group col-lg-12">
                    <label for="employee_code" class="form-label text-center ">Current Date</label>
                    <input id="_scan_current_date" class="form-control" data-field="current_date"
                        data-select="datepicker" />
                </div>
                <div class="form-group col-lg-12">
                    <label for="employee_code" class="form-label text-center ">Current Time</label>
                    <input id="_scan_current_time" type="text" class="form-control" data-field="current_time"
                        placeholder="<?php echo date('H:i'); ?>" />
                </div>
            </div>

            <!-- Input -->
                <div class="form-group w-100 d-flex justify-content-center mb-4">
                    <input id="_scan_employee_code" type="text" class="form-control text-center shadow-sm"
                        data-field="employee_code" style="max-width: 600px;" placeholder="Card ID here..." />
                </div>

            <!-- Table -->
            <div class="row w-100" style="height: 200px;">
                <div id="employee_Info_container" class="img-container gap-3 mt-3" style="min-height:45vh"></div>
            </div>
            <div style="position: absolute;top: 40px;left: 150px;">
                <div id="employee_img_box" class=""></div>
            </div>
        </div>
    </div>
</div>
