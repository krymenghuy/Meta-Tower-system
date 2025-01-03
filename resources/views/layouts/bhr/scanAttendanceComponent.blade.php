<div id="_main_attendanceScanComponent" class="mobile-padding p-3 h-100">
    <div class="d-flex align-items-center justify-content-center w-100 h-100">
        <div class="d-flex align-items-center justify-content-center w-100 h-100 rounded-3 border bg-white overflow-hidden">
            <div class="d-flex flex-column gap-0">
                <div class="container-image-attendance w-25 mx-auto">
                    <img class="w-100 h-100 mt-auto object-fit-scale"
                        src="{{ asset('assets/images/logo/loc_logo.jpg') }}" alt="company-logo" />
                </div>
                <div class="w-75 mx-auto">
                    <h3 class="text-center">Attendance Scan</h3>
                </div>
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
                            placeholder="<?php echo date('H:i') ?>" />
                    </div>
                </div>
                <div class="row">
                    <div class="form-group mx-auto " style="max-width: 300px;">
                        <label for="employee_code" class="form-label text-center " vslang="titles.Enter Employee ID">Enter
                            Employee ID</label>
                        <input id="_scan_employee_code" type="text" class="form-control" data-field="employee_code"
                            plaeholder="Student ID" />
                    </div>
                    <div class="form-group mx-auto d-none" style="max-width: 300px;">
                        <label for="card_number" class="form-label text-center "
                            vslang="titles.Enter Enter Student Card Number">Please scan your card in this box</label>
                        <input id="_scan_card_number" type="text" class="form-control" data-field="card_number"
                            plaeholder="Student ID" />
                    </div>
                </div>
                <div class="row " style="height: 150px;">
                    <div id="employee_Info_container" class="img-container gap-3 mt-3" style="min-height:45vh"></div>
                </div>
            </div>
            <div style="position: absolute;top: 40px;left: 150px;" >
                <div id="employee_img_box"  class=""></div>
            </div>
        </div>
    </div>
</div>

