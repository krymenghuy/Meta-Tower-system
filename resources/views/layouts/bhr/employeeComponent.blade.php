<style>
    #_employee_list {
        display: flex;
        flex-wrap: wrap;
        height: 620px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        gap: 10px;
        justify-content: center;
        padding: 20px;
    }

    .card {
        border-radius: 10px;
        box-shadow: 0px 0px 10px 0px #000000;


    }

    .card-header {
        display: flex;
        justify-content: space-between;
        padding: 20px;
        align-items: center;
    }

    .status_employee {
        display: flex;
        gap: 5px;
        padding: 2px;
        align-items: center;
        text-align: center;
        justify-content: center;
        width: 30%;
        border-radius: 20px;
        /* background-color: #2B3991; */
        color: #fff;

    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #EAF0F7;
        padding: 10px;
        border-radius: 10px;
        font-size: 10px;

    }

    .container_top {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .container_bottom {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        width: 100%;

    }

    .email,
    .phone {
        display: flex;
        gap: 5px;
        padding: 2px;
        align-items: center;
        text-align: left;
        width: 100%;
    }

    .email span,
    .phone span {
        background-color: #DADADA;
        padding: 2px 5px;
        border-radius: 10px;
        width: 100%;
        color: #2B3991;
        font-weight: small;

    }

    .card_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

    }

    .joining {
        font-size: 10px;
    }
</style>

<div id="_main_employeeComponent">
    <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter_emp">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-100 gap-2">
                <input type="text" class="form-control filter-field" id="_sdl_search_employee"
                    placeholder="Search Employee">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                    <i class="la la-search"></i>
                </button>
                <div class="d-flex align-items-center w-50 gap-2form-group w-50">
                    <label for="" class="form-label trans-text p-2" data-langprop="titles.Status"></label>
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100">
            <button type="button" class="btn btn-primary" id="_btnAddEmployee">
                <i class="fas fa-plus"></i>
                <span>Add Employee</span>
            </button>
        </div>
    </div>
    <div id="_employee_list" class="p-3">

    </div>
</div>
{{-- end h --}}
<div class="modal fade" id="dlg_sdl_add_employee" tabindex="-1" aria-labelledby="dlg_sdl_add_employee_title"
    aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title " vslang="titles.Create Employee List"></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row gap-0" id="_sdl_employee_info">

                    <div class="col-12 p-0">
                        <div class="row">
                            <div class="col-3">
                                <div class="width-height-social-icon d-flex
                                align-items-center justify-content-center border-primary border rounded-3 overflow-hidden
                                position-relative"
                                    style="height: 150px" aria-label="image">
                                    <div id="dlg_image_chooser"
                                        class="d-flex align-items-center justify-content-center w-100 h-100"
                                        role="button">
                                        <i class="fa-regular fa-image fs-4 text-muted"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="col-9">
                                <div class="row">
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.First Name">First
                                            Name</label>
                                        <input type="text" class="form-control data-input" data-field="first_name" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Last Name">Last
                                            Name</label>
                                        <input type="text" class="form-control data-input" data-field="last_name" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="email" class="form-label trans-text"
                                            data-langprop="titles.Email">Email</label>
                                        <input type="text" class="form-control data-input"
                                            placeholder="example@gmail.com" data-field="email" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="phone_number" class="form-label trans-text"
                                            data-langprop="titles.Phone Number">Phone Number</label>
                                        <input type="text" class="form-control data-input"
                                            data-field="phone_number" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Gender"></label>
                                        <select class=" data-input" id="_sdl_gender_id" data-field="gender_id"></select>
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="date_of_birth" class="form-label trans-text"
                                            data-langprop="titles.Date of Birth">Date of Birth</label>
                                        <input type="date" class="form-control data-input"
                                            data-field="date_of_birth" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="nationality" class="form-label trans-text"
                                            data-langprop="titles.Nationality">Nationality</label>
                                        <input type="text" class="form-control data-input"
                                            data-field="nationality" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="address" class="form-label trans-text"
                                            data-langprop="titles.Address">Address</label>
                                        <input type="text" class="form-control data-input" data-field="address" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Position"></label>
                                        <select class=" data-input" id="_sdl_position_id"
                                            data-field="positions_id"></select>
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Session"></label>
                                        <select class=" data-input" id="_sdl_session_id"
                                            data-field="session_id"></select>
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="joining_date" class="form-label trans-text"
                                            data-langprop="titles.Joining Date"></label>
                                        <input type="date" class="form-control data-input"
                                            data-field="joining_date" />
                                    </div>

                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.NSSF"></label>
                                        <input type="text" class="form-control data-input" data-field="nssf" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Identity Card"></label>
                                        <input type="text" class="form-control data-input"
                                            data-field="identity_card_number" />
                                    </div>
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label trans-text"
                                            data-langprop="titles.Status"></label>
                                        <select class=" data-input" id="_sdl_status_id"
                                            data-field="status_id"></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">
                    <span class="trans-text" data-langprop="titles.Cancel"></span>
                </button>
                <button id="dlg_sdl_add_employee_btn_save" type="button" class="btn btn-sm btn-primary">
                    <span class="trans-text" data-langprop="titles.Save"></span>
                </button>
            </div>
        </div>
    </div>
</div>
