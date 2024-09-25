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
        width: 200px;

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
        font-size: 12px;

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
