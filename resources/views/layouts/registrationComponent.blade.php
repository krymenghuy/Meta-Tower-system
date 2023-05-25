<div id="_main_registrationComponent" class="mobile-padding p-3" style="display:none">
    <div class="st-register--list">
        <div class="bg-white p-4 rounded-4">
            <div class="row row-cols-lg-4 gy-2">
                <div class="col">
                    <label for="academic_year" class="form-label trans-text" data-langprop="titles.Academic Year"></label>
                    <select class="modal-select2"></select>
                </div>
                <div class="col">
                    <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                    <select class="modal-select2"></select>
                </div>
                <div class="col">
                    <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                    <select class="modal-select2"></select>
                </div>
                <div class="col">
                    <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                    <select class="modal-select2"></select>
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
        <div class="mt-3 div-registrated">
            <div class="d-flex p-3 bg-white h-info-student">
                <div class="div-img">
                    <img src="{{ asset('assets/images/slides/student.png') }}" alt=""/>
                </div>
                <div class="d-block ms-3 w-100">
                    <div class="row row-cols-3 mb-0">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Student ID"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">ST0001</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Kea Kanhchana</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Female"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Female</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Date of Birth"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">10-10-2010</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Name"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Koko</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Phone"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">086000000</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-p" data-langprop="titles.Parent Email"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">parentname@gmail.com</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex align-items-start justify-content-end gap-2">
                                <button class="btn btn-sm btn-primary rounded-3" type="button">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Ganerate Card"></span>
                                </button>
                                <button class="btn btn-sm btn-danger rounded-3" type="button">
                                    <span class="text-nowrap trans-text" data-langprop="buttons.Options"></span>
                                    <i class="fa-solid fa-caret-down ps-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <hr class="bg-dark m-1 p-0"/>
                    <div class="row row-cols-5 mt-2">
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Academic Year"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">2023 - 2024</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Campus"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Main Campus</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Class"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Pre-Nersery</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Section"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">Half Day</p>
                            </div>
                        </div>
                        <div class="col">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted trans-text width-bp" data-langprop="titles.Student Type"></p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">New</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="st-register--input" style="display:none">
        <div class="bg-primary rounded-top-3">
            <div class="py-2 px-3">
                <i class="fa-solid fa-arrow-left-long fs-3 text-white back--rgs" role="button"></i>
            </div>
        </div>
        <div class="bg-white px-3 py-2 rounded-bottom-3 h-register-input">
            <label for="student_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Student Information"></label>
            <div class="row row-cols-lg-3 mt-2">
                <div class="col">
                    <div class="form-group">
                        <label for="student_name_kh" class="form-label trans-text" data-langprop="titles.Student Name (Khmer)"></label>
                        <input type="text" class="form-control data-input" data-field="student_name_kh"/>
                    </div>
                    <div class="form-group">
                        <label for="student_name_lt" class="form-label trans-text" data-langprop="titles.Student Name (Latin)"></label>
                        <input type="text" class="form-control data-input" data-field="student_name_lt"/>
                    </div>
                    <div class="form-group">
                        <label for="gender" class="form-label trans-text" data-langprop="titles.Gender"></label>
                        <select class="modal-select2 form-control data-input" data-field="gender"></select>
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
                        <label for="home_address_son" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <input type="text" class="form-control data-input" data-field="home_address_son"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="photo" class="form-label trans-text" data-langprop="titles.Photo"></label>
                        <div class="d-flex align-items-center justify-content-center">
                            <div class="border-outside-img">
                                <div class="contain-img"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <label for="academic_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Academic Information"></label>
            <div class="row row-cols-lg-3">
                <div class="col">
                    <div class="form-group">
                        <label for="student_code" class="form-label trans-text" data-langprop="titles.Student Code"></label>
                        <input type="text" class="form-control data-input" data-field="student_code"/>
                    </div>
                    <div class="form-group">
                        <label for="campus" class="form-label trans-text" data-langprop="titles.Campus"></label>
                        <select class="modal-select2 form-control data-input" data-field="campus"></select>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="class" class="form-label trans-text" data-langprop="titles.Class"></label>
                        <input type="text" class="form-control data-input" data-field="class"/>
                    </div>
                    <div class="form-group">
                        <label for="section" class="form-label trans-text" data-langprop="titles.Section"></label>
                        <select class="modal-select2 form-control data-input" data-field="section"></select>
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
            </div>
            <label for="parent_information" class="form-label trans-text fs-5 text-primary" data-langprop="titles.Parent Information"></label>
            <div class="row row-cols-lg-3">
                <div class="col">
                    <div class="form-group">
                        <label for="father_name" class="form-label trans-text" data-langprop="titles.Father Name"></label>
                        <input type="text" class="form-control data-input" data-field="father_name"/>
                    </div>
                    <div class="form-group">
                        <label for="father_id_card" class="form-label trans-text" data-langprop="titles.Father ID Card"></label>
                        <input type="text" class="form-control data-input" data-field="father_id_card"/>
                    </div>
                    <div class="form-group">
                        <label for="Religion" class="form-label trans-text" data-langprop="titles.Religion"></label>
                        <input type="text" class="form-control data-input" data-field="religion"/>
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
                        <label for="home_address_pr" class="form-label trans-text" data-langprop="titles.Home Address"></label>
                        <input type="text" class="form-control data-input" data-field="home_address_pr"/>
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="mother_name" class="form-label trans-text" data-langprop="titles.Mother Name"></label>
                        <input type="text" class="form-control data-input" data-field="mother_name"/>
                    </div>
                    <div class="form-group">
                        <label for="mother_phone" class="form-label trans-text" data-langprop="titles.Mother Phone"></label>
                        <input type="text" class="form-control data-input" data-field="mother_phone"/>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button class="btn btn-primary" type="button">
                            <span class="trans-text" data-langprop="buttons.Add Student"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>