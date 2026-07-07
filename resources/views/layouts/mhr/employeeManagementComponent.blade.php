<div id="_main_employee_management_component" class="mobile-padding px-3" style="display:none;">
    <div id="div_filter_filed" class="bg-white rounded-2 shadow p-3">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_employee" placeholder="Search here....">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_emp_status_id" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_emp_type_id" class="filter-field data-input" data-field="emp_type_id"></select>
            </div>
            
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddEmployee">
                    <i class="fa-solid fa-user-plus" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Add Employee"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_employee_list" class="table-responsive mt-3 rounded-2"></div>
        <div id="container_pagination" style="background:#f5f5f5" class="px-3  d-flex justify-content-start"></div>

</div>


<style>
    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;
    }

    .card-header-tenant {
        display: flex;
        height: 150px;
        justify-content: space-between;
        padding: 18px 16px;
        border: none;
        align-items: center;
        background: url('../assets/images/default/bg_card8.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        border-radius: 10px;
         background: url('../assets/images/bhr/backposition.png');
        background-size: cover;
        background-repeat: no-repeat;
    }

    .btn-check:checked+.btn {
        background-color: #0c399e;
        color: #fff;
    }

    .tenant-image-card {
        position: relative;
        width: 100%;
        height: 100%;
        border: 1px solid #ced4da;
        border-radius: 12px;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .tenant-profile-container{
        width:150px;
        height: 160px;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .upload-trigger-area {
        width: 100%;
        height: 100%;
        background: transparent;
        border: 1px solid #000;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 12px;
    }

    .upload-trigger-area:hover {
        background-color: #f8f9fa;
    }

    .placeholder-icon {
        width: 48px;
        height: 48px;
        color: #6c757d;
    }

    .preview-crop-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 11px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .preview-crop-box img {
        width: auto;
        height: 100%;
        object-fit: contain;
    }

    .close-badge-btn {
        position: absolute;
        top: -10px;
        right: -10px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: #dc3545;
        border: 2px solid #ffffff;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
        padding: 0;
    }

    .close-badge-btn:hover {
        background-color: #bd2130;
    }

    .close-icon {
        font-size: 18px;
        font-weight: bold;
        line-height: 1;
        margin-top: -2px;
    }
</style>