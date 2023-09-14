<div id="_main_onLeaveStudentsComponent" class="mobile-padding p-3" style="display:none">
    <div id="st-leave--list" class="st-register--list">
        <div class="bg-white p-3 rounded-3">
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
                        <select id="_onleave_filter_campus" class="modal-select2 data-select filter-field"
                            data-field="campus_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Program"></label>
                    <div class="width-select-dialog">
                        <select id="_onleave_filter_program" class="modal-select2 data-select filter-field"
                            data-field="program_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Level"></label>
                    <div class="width-select-dialog">
                        <select id="_onleave_filter_level" class="modal-select2 data-select filter-field"
                            data-field="level_id"></select>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3 mb-1">
            <div class="d-flex justify-content-between w-100">
                <input id="_onleave_search_student" type="search" class="form-control width--search"
                    placeholder="Search by Name or ID" />
                <div class="d-flex flex-row gap-2">
                    <button id="_onleave_btnPrint" class="btn btn-primary" type="button">
                        <i class="fa fa-print"></i>
                        <span class="trans-text" data-langprop="buttons.Print"></span>
                    </button>
                </div>
            </div>
        </div>
        <div id="_onleave_list_view" class="border bg-white mt-3 rounded-3 shadow p-2"></div>
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
                            <img class="background-card"
                                src="{{ asset('assets/images/logo/background_card.png') }}"
                                alt="">
                            <div class="w-100 h-100 d-flex align-items-center flex-column position-relative z-3 p-2">
                                <div class="w-100 d-flex align-items-center flex-column">
                                    <img class="w-75"
                                        src="{{ asset('assets/images/logo/front_card.png') }}"
                                        alt="" />
                                </div>
                                <p class="fs-5 fw-bold text-primary text-uppercase mb-1">Student ID Card</p>
                                <div class="student-image">
                                    <img class="data-show w-100 h-100 rounded-3" alt="" data-field="image_url" />
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
                                    <img class="data-show w-100 h-100" alt="" data-field="mother_profile" />
                                </div>
                                <div class="student-image">
                                    <img class="data-show w-100 h-100" alt="" data-field="father_profile" />
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
                                    <p>Please inform the school administrator in case of invalidity, stolen, lost or
                                        damaged</p>
                                </li>
                                <li>
                                    <p>Please contact (855) 81 888 305 or (855) 78 888 307 for an urgent report</p>
                                </li>
                                <li>
                                    <p>Loss of the student ID card shall be reported to school immediately and 5 USD
                                        will be charged for replacement of the card</p>
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
                            <img class="data-show" alt="" data-field="image_url" />
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
                <hr class="line-bottom" />
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
                <hr class="line-bottom" />
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