<div id="_main_onLeaveStudentsComponent" class="mobile-padding p-3" style="display:none">
    <div id="st-leave--list" class="st-register--list">
        <div class="bg-white p-4 rounded-4">
            <div id="_onleave_filters" class="row row-cols-lg-4 gy-2">
                <div class="col">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Term"></label>
                    <div class="width-select-dialog">
                        <select id="_onleave_filter_term" class="modal-select2 data-select filter-field" data-field="term_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width-select-dialog">
                        <select id="_onleave_filter_campus" class="modal-select2 data-select filter-field" data-field="campus_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Program"></label>
                    <div class="width-select-dialog">
                        <select id ="_onleave_filter_program" class="modal-select2 data-select filter-field" data-field="program_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Level"></label>
                    <div class="width-select-dialog">
                        <select id="_onleave_filter_level" class="modal-select2 data-select filter-field" data-field="level_id"></select>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3 mb-1">
            <div class="d-flex justify-content-between w-100">
                    <input id="_onleave_search_student" type="search" class="form-control width--search" placeholder="Search by Name or ID"/>
                    <div class="d-flex flex-row gap-2">
                        <button id="_onleave_btnPrint" class="btn btn-primary" type="button">
                            <i class="fa fa-print"></i>
                            <span class="trans-text" data-langprop="buttons.Print"></span>
                        </button>
                    </div>
            </div>
           
        </div>
        <div id="_onleave_list_view" class="border rounded-3 shadow p-2"></div>
    </div>
    <div id="st-register--input" class="st-register--input" style="display:none">
        <div class="bg-primary rounded-top-3">
            <div class="py-2 px-3">
                <i id="back--rgs" class="fa-solid fa-arrow-left-long fs-3 text-white" role="button"></i>
            </div>
        </div>
        <div class="bg-white px-3 py-2 rounded-bottom-3 h-register-input">
            <label for="student_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Student Information"></label>
            <div class="row row-cols-lg-3 mt-2">
                <div class="col">
                    <div class="form-group">
                        <label for="name" class="form-label trans-text" data-langprop="titles.Student Name (Khmer)"></label>
                        <input type="text" class="form-control data-input" data-field="name_kh" data-required="1" data-ffield="Khmer name"/>
                    </div>
                    <div class="form-group">
                        <label for="name_kh" class="form-label trans-text" data-langprop="titles.Student Name (Latin)"></label>
                        <input type="text" class="form-control data-input" data-field="name" data-ffield="Name" data-required="1"/>
                    </div>
                    <div class="form-group">
                        <label for="sex" class="form-label trans-text" data-langprop="titles.Gender"></label>
                        <div class="width-select-dialog">
                            <select data-required="1" class="modal-select2 form-control data-input" data-field="sex">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option selected></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date_of_birth" class="form-label trans-text" data-langprop="titles.Date of Birth"></label>
                        <input data-required="1" data-select="datepicker" class="form-control data-input" data-field="date_of_birth"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="place_of_birth" class="form-label trans-text" data-langprop="titles.Place of Birth"></label>
                        <input type="text" class="form-control data-input" data-field="place_of_birth"/>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label trans-text" data-langprop="titles.Email"></label>
                        <input type="email" class="form-control data-input" data-field="email"/>
                    </div>
                    <div class="form-group">
                        <label for="phone_number" class="form-label trans-text" data-langprop="titles.Phone Number"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="phone_number" data-ffield="Phone number" data-required="1" data-type="phone"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <input type="text" class="form-control data-input" data-field="address"/>
                    </div>
                </div>
                <div class="col">
                   <div class="form-group">
                        <label for="student_code" class="form-label trans-text" data-langprop="titles.Student ID"></label>
                        <input type="text" class="form-control data-input" data-field="student_code" data-required="false" placeholder="auto" readonly/>
                   </div>

                    <div class="form-group">
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="border-outside-img">
                                <div id="contain_img" class="contain-img">
                                    <div id="clickable_img">
                                        <i class="fa-regular fa-image text-muted fs-3"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <label for="academic_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Academic Information"></label>
            <div class="row row-cols-lg-4" id="_onleave_div_enrollment_path">
                <div class="col">
                        <div class="form-group">
                            <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                            <div class="width-select-dialog">
                                <select  id="_onleave_acad_year"  data-required="1" class="modal-select2 data-input" data-field="academic_year"></select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="term_id" class="form-label trans-text" data-langprop="titles.Term"></label>
                            <div class="width-select-dialog">
                                <select id="_onleave_term" data-required="1" class="modal-select2 data-input g-filter" data-field="term_id"></select>
                            </div>
                        </div>
                    </div>

                <div class="col">
                    <div class="form-group">
                        <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                        <div class="width-select-dialog">
                            <select id="_onleave_campus" data-required="1" class="modal-select2 form-control data-input g-filter" data-field="campus_id"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="level_id" class="form-label trans-text" data-langprop="titles.Grade"></label>
                        <div class="width-select-dialog">
                            <select id="_onleave_level" data-required="1" class="modal-select2 data-input g-filter" data-field="level_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                        <div class="width-select-dialog">
                            <select id="_onleave_session" data-required="1" class="modal-select2 form-control data-input g-filter" data-field="session_id"></select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="group_id" class="form-label trans-text" data-langprop="titles.Group"></label>&nbsp;
                        <a href="javascript:void(0)" id="_onleave_lnkAddStudentGroup" class="">
                          <i class="fas fa-plus-circle text-success" style="font-size: 14px;"></i>
                        </a>
                        <div class="width-select-dialog">
                            <select  id="_onleave_group" data-required="1" class="modal-select2 data-input" data-field="group_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <span id="_onleave_prev_school_label" class="d-block p-1"></span>
                        <div class="width-select-dialog">
                          <select id="_onleave_prev_school" class="modal-select2 data-input" data-field="prev_school_id" data-ffield="Previous school" data-required="0"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="admission_date" class="form-label trans-text" data-langprop="titles.Admission Date"></label>
                        <input data-required="1" data-select="datepicker" class="form-control data-input" data-field="admission_date"/>
                    </div>
                </div>
            </div>
            <div class="d-flex gap-2 pb-3">
                <label for="parent_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Parent Information"></label>
                <div class="d-flex align-items-center">
                    <a href="javascript:void(0)" id="el_rgs_search">
                        <i class="fa-solid fa-magnifying-glass fs-5 text-success"></i>
                    </a>
                </div>
            </div>
            <div id="_onleave_parent_info" class="row row-cols-lg-4 gap-2">
                <div class="col">
                    <div class="form-group">
                        <label for="father_name" class="form-label trans-text" data-langprop="titles.Father Name"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="father_name"/>
                    </div>
                    <div class="form-group">
                        <label for="father_id_card" class="form-label trans-text" data-langprop="titles.Father ID Card"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="father_nid"/>
                    </div>
                    <div class="form-group">
                        <label for="Religion" class="form-label trans-text" data-langprop="titles.Father Religion"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="father_religion"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="father_email" class="form-label trans-text" data-langprop="titles.Father Email"></label>
                        <input type="email" class="form-control data-input" data-field="father_email"/>
                    </div>
                    <div class="form-group">
                        <label for="father_phone" class="form-label trans-text" data-langprop="titles.Father Phone"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="father_phone" data-phone="true"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <textarea class="form-control data-input" data-field="father_address"></textarea>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="mother_name" class="form-label trans-text" data-langprop="titles.Mother Name"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="mother_name"/>
                    </div>
                    <div class="form-group">
                        <label for="mother_id_card" class="form-label trans-text" data-langprop="titles.Mother ID Card"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="mother_nid"/>
                    </div>
                    <div class="form-group">
                        <label for="religion" class="form-label trans-text" data-langprop="titles.Mother Religion"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="mother_religion"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="mother_email" class="form-label trans-text" data-langprop="titles.Mother Email"></label>
                        <input type="email" class="form-control data-input" data-field="mother_email"/>
                    </div>
                    <div class="form-group">
                        <label for="mother_phone" class="form-label trans-text" data-langprop="titles.Mother Phone"></label>
                        <input data-required="1" type="text" class="form-control data-input" data-field="mother_phone" data-phone="true"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <textarea class="form-control data-input" data-field="mother_address"></textarea>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button id="btn--save" class="btn btn-primary  " type="button">
                            <span class="trans-text" data-langprop="buttons.Save"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div id="dlg_rgs_card" class="modal fade" tabindex="-1" aria-labelledby="dlg_rgs_card_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered custom-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"></h5>
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row row-cols-lg-2 gy-2">
                    <div class="col">
                        <div class="shadow-sm w-100 h-100 rounded-3 border position-relative overflow-hidden">
                            <img class="background-card" src="{{ asset('assets/images/logo/background_card.png') }}" alt="">
                            <div class="w-100 h-100 d-flex align-items-center flex-column position-relative z-3 p-2">
                                <div class="w-100 d-flex align-items-center flex-column">
                                    <img class="w-75" src="{{ asset('assets/images/logo/front_card.png') }}" alt=""/>
                                </div>
                                <p class="fs-5 fw-bold text-primary text-uppercase mb-1">Student ID Card</p>
                                <div class="student-image">
                                    <img class="data-show w-100 h-100 rounded-3" alt="" data-field="image_url"/>
                                </div>
                                <div class="w-75 fs-5-1 text-primary">
                                    <p class="mb-1">
                                        <span class="d-inline-block w-50">ID</span>
                                        <span>:</span>
                                        <span class="data-show" data-field="student_code"></span>
                                    </p>
                                    <p class="mb-1">
                                        <span class="d-inline-block w-50">ឈ្មោះ</span>
                                        <span>:</span>
                                        <span class="data-show" data-field="name_kh"></span>
                                    </p>
                                    <p class="mb-1">
                                        <span class="d-inline-block w-50">Name</span>
                                        <span>:</span>
                                        <span class="data-show" data-field="name"></span>
                                    </p>
                                    <p class="mb-1">
                                        <span class="d-inline-block w-50">Sex</span>
                                        <span>:</span>
                                        <span class="data-show" data-field="sex"></span>
                                    </p>
                                    <p class="mb-1">
                                        <span class="d-inline-block w-50">Starting Date</span>
                                        <span>:</span>
                                        <span class="data-show" data-field="admission_date"></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="shadow-sm w-100 h-100 rounded-3 border position-relative p-2">
                            <div class="w-100 d-flex justify-content-between gap-2">
                                <div class="student-image">
                                    <img class="data-show w-100 h-100" alt="" data-field="mother_profile"/>
                                </div>
                                <div class="student-image">
                                    <img class="data-show w-100 h-100" alt="" data-field="father_profile"/>
                                </div>
                            </div>
                            <p class="fs-5 fw-bold text-primary text-center">Terms and Usage Conditions</p>
                            <ul>
                                <li>
                                    <p>This card belongs to Kids World International School</p>
                                </li>
                                <li>
                                    <p>This card may only be used by the student who is in front photo</p>
                                </li>
                                <li>
                                    <p>Please inform the school administrator in case of invalidity, stolen, lost or damaged</p>
                                </li>
                                <li>
                                    <p>Please contact (855) 81 888 305 or (855) 78 888 307 for an urgent report</p>
                                </li>
                                <li>
                                    <p>Loss of the student ID card shall be reported to school immediately and 5 USD will be charged for replacement of the card</p>
                                </li>
                            </ul>
                            <p class="fs-5-1 fw-bold text-primary text-end">Kids World International School</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_rgs_card_btn_print" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Print Now"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div id="dlg_rgs_detail" class="modal fade" tabindex="-1" aria-labelledby="dlg_rgs_detail_title" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered custom-modal">
        <div class="modal-content">
            <div class="modal-header">
                <button class="btn-close" type="button" aria-label="Close" data-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p class="fs-5 fw-bold text-primary trans-text" data-langprop="titles.Student Information"></p>
                <div class="row gy-2">
                    <div class="col-md-8">
                        <p class="mb-1">
                            <span class="trans-text align-info-student" data-langprop="titles.Student Name"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="name"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text align-info-student" data-langprop="titles.Sex"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="sex"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text align-info-student" data-langprop="titles.Date of Birth"></span>
                            <span class="px-2">:</span>
                            <strong>
                               <span class="data-show" data-field="date_of_birth" data-ffield="Date of birth"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text align-info-student" data-langprop="titles.Phone Number"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="phone_number"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text align-info-student" data-langprop="titles.Email"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="email"></span>
                            </strong>
                        </p>
                    </div>
                    <div class="col-md-4">
                        <div class="container-image-student">
                            <img class="data-show" alt="" data-field="image_url"/>
                        </div>
                    </div>
                </div>
                <p class="mb-1">
                    <span class="trans-text align-info-student" data-langprop="titles.Home Address"></span>
                    <span class="px-2">:</span>
                    <strong>
                        <span class="data-show" data-field="address"></span>
                    </strong>
                </p>
                <hr class="line-bottom"/>
                <p class="fs-5 fw-bold text-primary trans-text" data-langprop="titles.Academic Information"></p>
                <div class="d-block">
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Student ID"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="student_code"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Class"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="level"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Previous School"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="prev_school_name"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Campus"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="campus"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Session"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="session"></span>
                        </strong>
                    </p>
                </div>
                <hr class="line-bottom"/>
                <p class="fs-5 fw-bold text-primary trans-text" data-langprop="titles.Parent Information"></p>
                <div class="d-block">
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Father Name"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_name"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Mother Name"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_name"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Father Email"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_email"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Mother Email"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_email"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Father Phone"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_phone"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Mother Phone"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_phone"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Father ID Card"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_nid"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Mother ID Card"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_nid"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Religion"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="religion"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text align-info-student" data-langprop="titles.Address"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_address"></span>
                        </strong>
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-sm btn-secondary" type="button" data-dismiss="modal">
                    <span class="trans-text" data-langprop="buttons.Cancel"></span>
                </button>
                <button id="dlg_rgs_detail_btn_print" class="btn btn-sm btn-primary" type="button">
                    <span class="trans-text" data-langprop="buttons.Print Now"></span>
                </button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="dlg_rgs_family_" tabindex="-1" aria-labelledby="dlg_rgs_family_title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title trans-text" data-langprop="titles.Choose Family ID"></h5>
                <button type="button" class="btn-close" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="family_id" class="form-label trans-text" data-langprop="titles.Family ID"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-input" data-field="family_code"></select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>