<div id="_main_registrationComponent" class="mobile-padding p-3" style="display:none">
    <div id="st-register--list" class="st-register--list">
        <div class="bg-white p-4 rounded-4">
            <div class="row row-cols-lg-4 gy-2">
                <div class="col">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-select" data-field="academic_year"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-select" data-field="campus_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-select" data-field="level_id"></select>
                    </div>
                </div>
                <div class="col">
                    <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                    <div class="width-select-dialog">
                        <select class="modal-select2 data-select" data-field="session_id"></select>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center gap-2 mt-3">
            <button id="_rgs_btnRegister" class="btn btn-primary" type="button">
                <i class="fa-solid fa-plus"></i>
                <span class="trans-text" data-langprop="buttons.Register"></span>
            </button>
            <input type="search" class="form-control width--search" placeholder="Search by Name or ID..."/>
        </div>
        <div id="_rgs_list" class="_rgs_list"></div>
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
                        <input type="text" class="form-control data-input" data-field="name_kh"/>
                    </div>
                    <div class="form-group">
                        <label for="name_kh" class="form-label trans-text" data-langprop="titles.Student Name (Latin)"></label>
                        <input type="text" class="form-control data-input" data-field="name"/>
                    </div>
                    <div class="form-group">
                        <label for="sex" class="form-label trans-text" data-langprop="titles.Gender"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 form-control data-input" data-field="sex">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                                <option selected></option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="date_of_birth" class="form-label trans-text" data-langprop="titles.Date of Birth"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="date_of_birth"/>
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
                        <input type="text" class="form-control data-input" data-field="phone_number"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <input type="text" class="form-control data-input" data-field="address"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="photo" class="form-label trans-text" data-langprop="titles.Photo"></label>
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
            <div class="row row-cols-lg-4">
                <div class="col">
                    <div class="form-group">
                        <label for="student_code" class="form-label trans-text" data-langprop="titles.Student Code"></label>
                        <input type="text" class="form-control data-input" data-field="student_code" readonly/>
                    </div>
                    <div class="form-group">
                        <label for="campus_id" class="form-label trans-text" data-langprop="titles.Campus"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 form-control data-input" data-field="campus_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="level_id" class="form-label trans-text" data-langprop="titles.Class"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="level_id"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="session_id" class="form-label trans-text" data-langprop="titles.Session"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 form-control data-input" data-field="session_id"></select>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="previous_school" class="form-label trans-text" data-langprop="titles.Previous School"></label>
                        <input type="text" class="form-control data-input" data-field="previous_school"/>
                    </div>
                    <div class="form-group">
                        <label for="admission_date" class="form-label trans-text" data-langprop="titles.Admission Date"></label>
                        <input data-select="datepicker" class="form-control data-input" data-field="admission_date"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                        <div class="width-select-dialog">
                            <select class="modal-select2 data-input" data-field="academic_year"></select>
                        </div>
                    </div>
                </div>
            </div>
            <label for="parent_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Parent Information"></label>
            <div class="row row-cols-lg-4">
                <div class="col">
                    <div class="form-group">
                        <label for="father_name" class="form-label trans-text" data-langprop="titles.Father Name"></label>
                        <input type="text" class="form-control data-input" data-field="father_name"/>
                    </div>
                    <div class="form-group">
                        <label for="father_id_card" class="form-label trans-text" data-langprop="titles.Father ID Card"></label>
                        <input type="text" class="form-control data-input" data-field="father_nid"/>
                    </div>
                    <div class="form-group">
                        <label for="Religion" class="form-label trans-text" data-langprop="titles.Father Religion"></label>
                        <input type="text" class="form-control data-input" data-field="father_religion"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="father_email" class="form-label trans-text" data-langprop="titles.Father Email"></label>
                        <input type="text" class="form-control data-input" data-field="father_email"/>
                    </div>
                    <div class="form-group">
                        <label for="father_phone" class="form-label trans-text" data-langprop="titles.Father Phone"></label>
                        <input type="text" class="form-control data-input" data-field="father_phone"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <textarea class="form-control data-input" data-field="father_address"></textarea>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="mother_name" class="form-label trans-text" data-langprop="titles.Mother Name"></label>
                        <input type="text" class="form-control data-input" data-field="mother_name"/>
                    </div>
                    <div class="form-group">
                        <label for="mother_id_card" class="form-label trans-text" data-langprop="titles.Mother ID Card"></label>
                        <input type="email" class="form-control data-input" data-field="mother_nid"/>
                    </div>
                    <div class="form-group">
                        <label for="religion" class="form-label trans-text" data-langprop="titles.Mother Religion"></label>
                        <input type="text" class="form-control data-input" data-field="mother_religion"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="mother_email" class="form-label trans-text" data-langprop="titles.Mother Email"></label>
                        <input type="email" class="form-control data-input" data-field="mother_email"/>
                    </div>
                    <div class="form-group">
                        <label for="mother_phone" class="form-label trans-text" data-langprop="titles.Mother Phone"></label>
                        <input type="text" class="form-control data-input" data-field="mother_phone"/>
                    </div>
                    <div class="form-group">
                        <label for="address" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <textarea class="form-control data-input" data-field="mother_address"></textarea>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button id="btn--save" class="btn btn-primary" type="button">
                            <span class="trans-text" data-langprop="buttons.Add Student"></span>
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
                            <div class="w-75 d-flex gap-2">
                                <div class="w-50">
                                    <img class="data-show" alt="" data-field="mother_profile"/>
                                </div>
                                <div class="w-50">
                                    <img class="data-show" alt="" data-field="father_profile"/>
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
                            <span class="trans-text" data-langprop="titles.Student Name"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="name"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text" data-langprop="titles.Sex"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="sex"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text" data-langprop="titles.Date of Birth"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="date_of_birth"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text" data-langprop="titles.Phone Number"></span>
                            <span class="px-2">:</span>
                            <strong>
                                <span class="data-show" data-field="phone_number"></span>
                            </strong>
                        </p>
                        <p class="mb-1">
                            <span class="trans-text" data-langprop="titles.Email"></span>
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
                    <span class="trans-text" data-langprop="titles.Home Address"></span>
                    <span class="px-2">:</span>
                    <strong>
                        <span class="data-show" data-field="address"></span>
                    </strong>
                </p>
                <hr class="line-bottom"/>
                <p class="fs-5 fw-bold text-primary trans-text" data-langprop="titles.Academic Information"></p>
                <div class="d-block">
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Student ID"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="student_code"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Class"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="level"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Previous School"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="previous_school"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Campus"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="campus"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Session"></span>
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
                        <span class="trans-text" data-langprop="titles.Father Name"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_name"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Mother Name"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_name"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Father Email"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_email"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Mother Email"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_email"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Father Phone"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_phone"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Mother Phone"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_phone"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Father ID Card"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="father_nid"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Mother ID Card"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="mother_nid"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Religion"></span>
                        <span class="px-2">:</span>
                        <strong>
                            <span class="data-show" data-field="religion"></span>
                        </strong>
                    </p>
                    <p class="mb-1">
                        <span class="trans-text" data-langprop="titles.Address"></span>
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