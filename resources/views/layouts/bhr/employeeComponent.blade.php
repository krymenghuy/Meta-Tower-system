<style>
    .progress-bar {
        background-color: #6c63ff;
    }

    .progress {
        background-color: #e0e0ff;
        height: 6px;
    }

    .card-body p {
        margin: 0;
    }


    .ellipsis {
        font-size: 18px;
    }
    .experience-company {
        font-weight: bold;
        font-size: 16px;

    }

    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;


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

    .bg-secondary-custom {
        background-color: red;
    }

    .social-icons a {
        display: inline-block;
        width: 40px;
        /* Adjust size as needed */
        height: 40px;
        transition: transform 0.2s ease;
    }

    .social-icons a:hover {
        transform: scale(1.1);
        /* Slight zoom on hover */
    }

    .social-icon {
        width: 100%;
        height: 100%;
    }

    .social-icons img {
        display: block;
        width: 100%;
        height: auto;
    }
</style>

<div id="_main_employeeComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content">
        <div class="d-flex  p-3 justify-content-between w-200 " id="_divFilter_emp">
            <div class="d-flex align-items-center w-100 gap-2">
                <div class="d-flex align-items-center w-100 gap-2">
                    <input type="text" class="form-control filter-field" id="_sdl_search_employee" placeholder="Search Employee">

                    <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                        <i class="la la-search"></i>
                    </button>
                    <div class="d-flex align-items-center w-50 gap-2form-group w-50">
                        <label for="" class="form-label trans-text p-2" data-langprop="titles.Status"></label>
                        <select type="id" id="el_status" class="data-input filter-field" data-field="status"></select>
                    </div>
                    <div class="d-flex align-items-center w-50 gap-2form-group w-50">
                        <label for="" class="form-label trans-text p-2" data-langprop="titles.Role"></label>
                        <select type="id" id="el_role" class="data-input filter-field" data-field="role"></select>
                    </div>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end gap-2 w-100">
                <button type="button" class="btn btn-primary" id="_btnAddEmployee">
                    <i class="fas fa-plus"></i>
                    <span>Add Employee </span>
                </button>
            </div>
        </div>
        <div id="_employee_list" class="bg-white"></div>
        <div id="container_pagination" class="px-3 bg-white"></div>

    </div>
    <div class="p-3">
        <div class=" mb-2" id="btn_back">
            <button id="_btn_backTo_employee" style="background-color:rgba(236, 29, 39, 1); width:100px;"
                class="btn text-white shadow rounded-4 m-2 p-2" type="button">
                <span class="" vslang="buttons.Back">Back</span>
            </button>
        </div>
        <div id="_view_profile_container">
            <div class="mt-3 px-3 overflow-y-auto overflow-x-hidden " style="height:550px;" id="sub_view_profile">
                <div id="profile_info_emp" class="employee-card d-flex p-3 bg-secondary h-info-student mb-2" data-id="" data-merchantname="" data-pricelistid="">
                    <div class="d-block ms-3 w-100">
                        <div class="row row-cols-3 mb-0">
                            <div class="col-2">
                                <div class="div-img" data-id="" data-imageurl="">
                                    <img src="http://127.0.0.1:8000/uploads/public/1F70F792E749483492D8830538CC77E1/employees/images/0_file_06700bdaf6b9f120241005_111047.png"
                                        alt="">
                                </div>
                                <div class="social-icons d-flex justify-content-start mt-3">
                                    <a href="https://www.facebook.com/houexpress.est.2022" class="mx-2" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="assets/images/bhr/facebook.svg" alt="Facebook" class="social-icon">
                                    </a>
                                    <a href="https://www.instagram.com/YOUR_INSTAGRAM_PAGE" class="mx-2" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="assets/images/bhr/facebook.svg" alt="Instagram" class="social-icon">
                                    </a>
                                    <a href="https://wa.me/YOUR_PHONE_NUMBER" class="mx-2" target="_blank"
                                        rel="noopener noreferrer">
                                        <img src="assets/images/bhr/facebook.svg" alt="WhatsApp" class="social-icon">
                                    </a>

                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Name">Name</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize data-get" data-field="full_name">Kry Mengchhorng</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Position">Position</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">Web-developer</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Email">Email</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap">mengchhorng@gmail.com</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Tel">Tel</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize data-get" data-field="phone_number">0712126288</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.ID">ID</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">EMP1000001</p>
                                </div>
                                <div class="d-flex justify-content-start mt-3">


                                    <div class="dropdown">
                                        <button class="btn btn-sm btn-warning rounded-2 me-3 dropdown-toggle" type="button"
                                            id="movementDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            Movement
                                        </button>
                                        <ul class="dropdown-menu bg-danger" aria-labelledby="movementDropdown">
                                            <li><a class="dropdown-item" href="#">Action 1</a></li>
                                            <li><a class="dropdown-item" href="#">Action 2</a></li>
                                            <li><a class="dropdown-item" href="#">Action 3</a></li>
                                        </ul>
                                    </div>
                                    <button type="button" class="btn btn-sm btn-primary rounded-2 ">
                                        <span>Update Profile</span>
                                    </button>
                                </div>
                            </div>
                            <div class="col">
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Nationality">Nationality</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">Khmer</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Date of Birth">Date of Birth</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">01/03/2004</p>
                                </div>
                                <div class="d-flex align-items-center">
                                    <p class="text-nowrap text-muted   width-bp" vslang="titles.Address">Address</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">TBOUNG KHMUM</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.NSSF">NSSF</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">000 000 0001</p>
                                </div>
                                <div class="d-flex">
                                    <p class="text-nowrap text-muted   width-p" vslang="titles.Identity Card">Identity Card</p>
                                    <p class="px-2">:</p>
                                    <p class="text-nowrap text-capitalize">000 000 0000</p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div class="row mt-3 p-3" id="profile_card_detail">
                    <div class="col-md-4">
                        <div class="card" style="height:487px;">
                            <div class="card-header">
                                <h4>Skills</h4>
                                <span class="ellipsis">...</span>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <p>PHP</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 85%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>JavaScript</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 70%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Node.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 50%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Vue.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 65%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Laravel</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 60%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>OOP</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 80%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>Next.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 40%;"></div>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <p>React.Js</p>
                                    <div class="progress" style="width: 60%;">
                                        <div class="progress-bar" style="width: 60%;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card" style="height:487px;">
                            <div class="card-header">
                                <h4>Education</h4>
                                <span class="ellipsis">...</span>
                            </div>
                            <div class="card-body">
                                <div class="">
                                    <h5>2022-2024</h5>
                                    <div class="d-flex justify-content-between">
                                        <p class="w-50">Associate Degree</p>
                                        <p class="text-primary w-75">University of Oxford</p>
                                    </div>
                                    <span class="text-muted">Web Development</span>
                                </div>
                                <div class="mt-3">
                                    <h5>2022-2024</h5>
                                    <div class="d-flex justify-content-between">
                                        <p class="w-50">Associate Degree</p>
                                        <p class="text-primary w-75">University of Cambridge</p>
                                    </div>
                                    <span class="text-muted">Web Development</span>
                                </div>
                                <div class="mt-3">
                                    <h5>2022-2024</h5>
                                    <div class="d-flex justify-content-between">
                                        <p class="w-50">Associate Degree</p>
                                        <p class="text-primary w-75">Royal University of Phnom penh</p>
                                    </div>
                                    <span class="text-muted">Web Development</span>
                                </div>
                                <div class="mt-3">
                                    <h5>2022-2024</h5>
                                    <div class="d-flex justify-content-between">
                                        <p class="w-50">Associate Degree</p>
                                        <p class="text-primary w-75">Massachusetts Institute of Technology</p>
                                    </div>
                                    <span class="text-muted">Web Development</span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card" style="height:487px;">
                            <div class="card-header">
                                <h4>Experience</h4>
                                <span class="ellipsis">...</span>
                            </div>
                            <div class="card-body">
                            <div class="">
                                <h6>02-02-2023 - 14-11-2024</h6>
                                <h5>Web Developer</h5>
                                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Expedita.</p>
                                <p class="experience-company">Vectorasoft Company</p>
                                <hr class="border border-warning">
                            </div>
                            <div class="">
                                <h6>02-02-2023 - 14-11-2024</h6>
                                <h5>Web Developer</h5>
                                <p>Lorem ipsum dolor sit amet consectetur adipiscing elit. Expedita.</p>
                                <p class="experience-company">Vectorasoft Company</p>
                            </div>

                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>

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
            <div class="modal-body overflow-x-hidden">
                <div class="row gap-0" id="_sdl_employee_info">
                        <div class="row">
                            <div class="col-3">
                                <div class="width-height-social-icon d-flex align-items-center justify-content-center border rounded-3 position-relative"
                                    style="height: 170px;" aria-label="image">
                                    <div id="dlg_image_chooser"
                                        class="d-flex align-items-center justify-content-center w-100 h-100"
                                        role="button">
                                        <i class="fa-regular fa-image fs-4"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="col-9">
                                <div class="row">
                                    <div class="form-group col-6">
                                        <label for="name" class="form-label">
                                             Name <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control data-input" data-field="name" />
                                    </div>

                                    <div class="form-group col-6">
                                        <label for="name" class="form-label">
                                             Name KH <span class="text-danger">*</span>
                                        </label>
                                        <input type="text" class="form-control data-input" data-field="name_kh" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="gender" class="form-label">
                                            Gender <span class="text-danger">*</span>
                                        </label>
                                        <div class="min-width-select custom-modal-select">
                                            <select class="modal-select data-input" data-field="gender">
                                                <option value="">(Gender)</option>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="O">Other</option>
                                            </select>
                                        </div>

                                    </div>
                                    <div class="form-group col-4">
                                        <label for="date_of_birth" class="form-label">
                                            Date of Birth
                                        </label>
                                        <input type="date" class="form-control data-input" data-field="date_of_birth" />
                                    </div>
                                    <div class="form-group col-4">
                                        <label for="nationality" class="form-label">
                                            Nationality
                                        </label>
                                        <input type="text" class="form-control data-input" data-field="nationality" />
                                    </div>

                                </div>

                            </div>
                            <div class="form-group col-3">
                                <label for="nid" class="form-label">
                                    Identity Card
                                </label>
                                <input type="text" class="form-control data-input"
                                    data-field="nid" />
                            </div>
                            <div class="form-group col-4">
                                <label for="phone_number" class="form-label">
                                    Phone Number <span class="text-danger">*</span>
                                </label>
                                <input type="number" class="form-control data-input" data-field="phone_number" />
                            </div>
                            <div class="form-group col-5">
                                <label for="email" class="form-label">
                                    Email <span class="text-danger">*</span>
                                </label>
                                <input type="email" class="form-control data-input" placeholder="example@gmail.com" data-field="email" />
                            </div>
                            <div class="form-group col-6">
                                <label for="joining_date" class="form-label">
                                    Joining Date
                                </label>
                                <input type="date" class="form-control data-input" data-field="joining_date" />
                            </div>
                        <div class="form-group col-6">
                            <label for="position" class="form-label">
                                Position
                            </label>
                            <select class="form-control data-input" id="_sdl_position_id"
                                data-field="positions_id"></select>
                        </div>

                        <div class="form-group col-6">
                            <label for="roles" class="form-label">
                                Role
                            </label>
                            <select class="form-control data-input" id="_sdl_role_id"
                                data-field="emp_role_id"></select>
                        </div>
                        <div class="form-group col-6">
                            <label for="work_shift" class="form-label">
                                Work Shift
                            </label>
                            <select class="form-control data-input" id="_sdl_work_shift_id"
                                data-field="work_shift_id"></select>
                        </div>


                        <div class="form-group col-6">
                            <label for="nssf" class="form-label">
                                NSSF
                            </label>
                            <input type="text" class="form-control data-input" data-field="nssf_id" />
                        </div>
                        <div class="form-group col-6">
                            <label for="address" class="form-label">
                                Address
                            </label>
                            <textarea type="text" class="form-control data-input" data-field="address"></textarea>
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



<!-- <div class="modal fade" id="addEducation_dlg" tabindex="-1" role="dialog" aria-labelledby="addEducation_dlgTitle" aria-hidden="true">
  <div class="modal-dialog modal-lg" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="addEducation_dlgTitle">Create Education</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="form-group col-lg-12">
            <span class="simple-label">Price list name</span>
            <input type="text" class="form-control" id="ps-newpl_name">
          </div>
          <div class="form-group col-lg-12">
            <span class="simple-label">Marker Weight (kg)</span>
            <input type="number" class="form-control" id="ps-newpl_kg_marker">
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <span id="addEducation_dlg_error" class="error_text"></span>
        <button type="button" class="btn btn-warning height" data-bs-dismiss="modal">
          <i class="fa fa-times fs-5 text-danger"></i>
          <span>Cancel</span>
        </button>
        <button type="button" class="btn btn-success height" id="addEducation_dlg_btnOK">
          <i class="fa fa-check fs-5 text-success"></i>
          <span>Add</span>
        </button>
      </div>
    </div>
  </div>
</div> -->
