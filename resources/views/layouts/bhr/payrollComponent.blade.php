<div id="_main_payrollComponent">
    <div class="d-flex  p-3 justify-content-between w-100 " id="_divFilter">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="w-50">
                <input type="text" class="form-control filter-field" id="_sdl_search_payroll"
                    placeholder="Search Payroll">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>
            <button type="button" class="btn btn-primary" id="_btnAddSalary">
                <i class="fas fa-plus"></i>
                <span>Add Salary</span>
            </button>
        </div>

        <div class="d-flex align-items-center justify-content-end gap-2 w-50">
            <div class="form-group">
                <label for="" class="form-label trans-text" data-langprop="titles.Sort By"></label>
                <select type="id" id="el_sort_by" class="modal filter-field"></select>
            </div>
            <div class="form-group">
                <label for="" class="form-label trans-text" data-langprop="titles.Status"></label>
                <select type="id" id="el_status" class="modal filter-field "></select>
            </div>

        </div>

    </div>

    <div class="p-3">
        <div id="_payroll_list"></div>
    </div>
</div>

<div class="modal fade" id="dlg_sdl_add_Payroll" tabindex="-1" aria-labelledby="dlg_sdl_add_payroll_title"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Payroll List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0" id="_sdl_payroll_info">

                    <div class="col-lg-6">
                        <div class="width-height-social-icon d-flex align-items-center justify-content-center border-primary border rounded-3 overflow-hidden position-relative"
                            style="height: 280px" aria-label="image">
                            <div id="dlg_image_chooser"
                                class="d-flex align-items-center justify-content-center w-100 h-100" role="button">
                                <i class="fa-regular fa-image fs-4 text-muted"></i>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="name" class="form-label trans-text" data-langprop="titles.Name">Name</label>
                            <input type="text" class="form-control data-input" data-field="name" />
                        </div>
                        <div class="form-group">
                            <label for="email" class="form-label trans-text"
                                data-langprop="titles.Email">Email</label>
                            <input type="text" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                        </div>
                        <div class="form-group">
                            <label for="phone_number" class="form-label trans-text"
                                data-langprop="titles.Phone Number">Phone Number</label>
                            <input type="text" class="form-control data-input" data-field="phone_number" />
                        </div>
                    </div>


                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Position"></label>
                        <select class=" data-input" id="_sdl_position_id" data-field="position_id"></select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Rate"></label>
                        <input type="text" class="form-control data-input" data-field="rate" />
                    </div>

                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Start Date"></label>
                        <input type="date" class="form-control data-input" data-field="start_date" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.End Date"></label>
                        <input type="date" class="form-control data-input" data-field="end_date" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text"
                            data-langprop="titles.Working Hours"></label>
                        <select id="_sdl_cod" class="form-control data-input" data-field="working_hours">
                            <option value="Full Day">Full Day</option>
                            <option value="Half Day">Half Day</option>
                        </select>
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Salary"></label>
                        <input type="text" class="form-control data-input" data-field="salary" />
                    </div>
                    <div class="form-group col-lg-6">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Status"></label>
                        <select class=" data-input" id="_sdl_status_id" data-field="status_id"></select>
                    </div>

                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="trans-text" data-langprop="titles.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_payroll_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="titles.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
