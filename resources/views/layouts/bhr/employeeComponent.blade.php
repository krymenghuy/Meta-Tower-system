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
        border: none;
        align-items: center;
        background-color: #89b5d6;
    }
    .card-body {
        /* background-image:url('https://img.freepik.com/free-vector/ombre-blue-curve-light-blue-background-vector_53876-140344.jpg'); */
        background-color: #dce5e5;
    }

    .status_employee {
        display: flex;
        gap: 5px;
        padding: 2px;
        align-items: center;
        text-align: center;
        justify-content: center;
        width: 40%;
        border-radius: 20px;
        color: #fff;
    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #21577f;
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
        gap: 10px;
        align-items: center;
        justify-content: center;
        text-align: left;
        width: 100%;
    }

    .email div,
    .phone div {
        background-color: #fffbff;
        padding: 5px;
        border-radius: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: small;

    }
    .address{
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: small;
    }
    .email div span,
    .phone div span {
        display: flex;
        align-self: center;
        margin-right: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: small;
    }

    .card_bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

    }

    .bg-secondary-custom {
        background-color: red;
    }

    .social-icons a {
        display: inline-block;
        width: 40px;
        height: 40px;
        transition: transform 0.2s ease;
    }

    .social-icons a:hover {
        transform: scale(1.1);
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

    #_view_profile_container {
        padding-bottom: 20%;
    }

    #profile_card_left,
    #profile_card_center,
    #profile_card_right {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
    }

    #_employee_list {
        display: flex;
        flex-direction: column;
        height: 400px;
        padding: 0;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .div-img {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 10px;
        width: 100%;
        text-align: center;
    }

    .div-img img {
        max-width: 100%;
        height: auto;
        border-radius: 50%;
    }
    .bhr-icons{
    width: 18;
    height: 18px;
    object-fit: contain;
    margin-right: 10px;
    }
</style>

<div id="_main_employeeComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content" class="pt-3">
        <div class="d-flex justify-content-between bg-white shadow p-3 rounded-3 w-100" id="div_filter_filed">
            <div class="d-flex align-items-start justify-content-start w-25">
                <button type="button" class="btn_add" style="background-color:#2b3991;" id="_btn_add_employee">
                <i class="fa-solid fa-share"></i>
                    <span>Add Employee </span>
                </button>
            </div>
            <div class="d-flex align-items-center justify-content-end w-75 gap-3">
                <div class="d-flex w-25 gap-3">
                    <div class="d-flex align-items-end w-100">
                        <input type="text" class="form-control filter-field btn_search" id="_search_employee"
                            placeholder="Search Employee">
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="el_branch" class="data-input  filter-field"
                        data-field="el_branch"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="el_work_shift" class="data-input  filter-field"
                        data-field="work_shift_id"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="filter_employee_status" class="data-input filter-field"
                        data-field="status"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="filter_employee_type" class="data-input filter-field"
                        data-field="emp_type"></select>
                </div>
            </div>
        </div>
        <div id="_employee_list" class="mt-3 px-3"></div>
        <div id="container_pagination" style="background:#f5f5f5" class="px-3 pb-5 d-flex justify-content-end"></div>
    </div>

    <div class="d-none" id="view_see_info__">
        <div class="d-flex px-3 pt-3" id="btn_back">
            <button id="_btn_backTo_employee" style="background-color:#2b3991; width:100px;"
                class="btn text-white shadow rounded-4 m-2 p-2"  type="button">
                <i class="fa-solid fa-angles-left "></i>
                <span class="" vslang="buttons.Back">Back</span>
            </button>
        </div>
        <div id="_view_profile_container">
            <div class="px-2 overflow-y-auto overflow-x-hidden " style="height:550px;" id="sub_view_profile">
                <div id="profile_info_emp">
                    <!-- <div class="d-block ms-3 w-100">
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

                    </div> -->
                </div>
                <div class="row mt-3 p-3">
                    <div class="col-md-4" id="profile_card_left">
                        <!-- <div class="card" style="height:487px;">
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
                        </div> -->
                    </div>
                    <div class="col-md-4" id="profile_card_center">

                        <!-- <div class="card" style="height:487px;">
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
                        </div> -->
                    </div>
                    <div class="col-md-4" id="profile_card_right">
                    </div>

                </div>


                <div class="col-md-4" id="tax_allownce_card">
                    {{-- <div class="card" style="height:487px;">
                            <div class="card-header">
                                <h4>Tax Allowance</h4>
                                <span class="ellipsis">...</span>
                            </div>
                            <div class="card-body">
                               <div class="d-flex justify-content-between">
                                   <p class="w-50">Amount = 100.000 VND</p>

                               </div>
                               <div class="d-flex justify-content-between">
                                <p class=" w-75">Remarks : 1 Wife 2 children</p>
                               </div>
                            </div>
                        </div> --}}
                </div>



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
