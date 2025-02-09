<style>
  
    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
        border: none;
        align-items: center;
        background-color: #323f6a;
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
        background-color: #467ba2;
        padding: 10px;
        border-radius: 10px;
        font-size: 10px;
    }

    .card_container span {
        font-size: 1.1em;
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

    .address {
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

    
 

    #_view_profile_container {
        padding-bottom: 20%;
    }

    #profile_card_left,
    #profile_card_center,
    #profile_card_right {
        display: flex;
        flex-direction: column;
        /* margin-bottom: 20px; */
    }

    #_employee_list {
        height: 450px;
        overflow-y: scroll;
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

    .bhr-icons {
        width: 18;
        height: 18px;
        object-fit: contain;
        margin-right: 10px;
    }
    .form-group{
        margin-bottom: 1rem;
    }
</style>



<div id="_main_employeeComponent" style="display:none;padding:20px 0 0;">
    <div id="_emplist_container" style ="display:none">
        <div class="d-flex justify-content-between shadow p-3 mt-2 rounded-2 w-100" id="div_filter_filed">
            <div class="d-flex align-items-center justify-content-start w-75 gap-3">
                <div class="d-flex w-25 gap-3">
                    <div class="position-relative w-100">
                        <input type="text" class="form-control filter-field btn_search ps-5" data-field="search_value" id="_search_employee" placeholder="Search...">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-4 text-muted"></i>
                    </div>


                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="el_branch" class="data-input  filter-field"
                        data-field="branch_id"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="el_work_shift" class="data-input  filter-field"
                        data-field="work_shift_id"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="filter_employee_status" class="data-input filter-field"
                        data-field="status_id"></select>
                </div>
                <div class="d-flex align-items-center">
                    <select type="id" id="filter_employee_type" class="data-input filter-field"
                        data-field="emp_type_id"></select>
                </div>
            </div>
            <div class="d-flex align-items-start justify-content-end w-25">
                <button type="button" class="btn_add" style="background-color:#2b3991;" id="_btn_add_employee">
                    <span><i class="fa fa-person mr-2"></i>Add Employee </span>
                </button>
            </div>
        </div>
        <div id="_employee_list" class="mt-3 px-3" style="height:45vh"></div>
        <div id="container_pagination" style="background:#f5f5f5" class="px-3  d-flex justify-content-start"></div>
    </div>

    <div style ="display:none" id="_emp_profile_view">
        <div class="d-flex shadow rounded-2 justify-content-between px-3 mt-2" id="view_buttons">
            <button id="_btn_backTo_employee" style="background-color:#2b3991; width:150px;"
                class="btn text-white shadow rounded-4 m-2" type="button">
                <i class="fa-solid fa-angles-left "></i>
                <span class="" vslang="buttons.Back">Back</span>
            </button>
            <button id="_print_emp_cv" style="background-color:#2b3991; width:150px;"
                class="btn text-white shadow rounded-4 m-2" type="button">
                <i class="fa-solid fa-print"></i>
                <span class="" vslang="buttons.Print CV">Print CV</span>
            </button>
        </div>
        <div>
            <div class="overflow-y-auto overflow-x-hidden mb-5" style="height:550px;" id="sub_view_profile">
                <div id="profile_info_emp">

                </div>
                <div class="row mt-3 px-3">
                    <div class="col-md-4" id="profile_card_left"></div>
                    <div class="col-md-4" id="profile_card_center"></div>
                    <div class="col-md-4" id="profile_card_right"></div>

                </div>

                <div class="row mt-3 px-3 mb-3">
                    <div class="col-md-4" id="emp_documents_card"></div>
                    <div class="col-md-4" id="tax_allowance_card"></div>

                </div>

            </div>
        </div>

    </div>
</div>
