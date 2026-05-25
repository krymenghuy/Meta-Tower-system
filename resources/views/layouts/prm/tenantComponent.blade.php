<div id="_main_tenant_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_tenant_list_container" style ="display:none">
        <div id="_divFilter_tenant" class="bg-white shadow-sm p-3 rounded-2">
            <div class="align-items-center row g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="position-relative w-100">
                        <input type="text" class="filter-field rounded-2 input-search" id="_search_tenant_"
                            placeholder="Search by name, code or phone">
                        {{-- <i class="position-absolute text-muted fa fa-search fs-6"
                            style="right: 15px; top: 50%; transform: translateY(-50%);"></i> --}}
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select id="_el_tenant_status" class="filter-field data-input form-control" data-field="status_id"
                        placeholder="Status"></select>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="btn-group btn-group-sm gap-2 rounded" role="group">
                        <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewCard" checked>
                        <label class="rounded-3 btn-outline-prm-custom btn" for="tenantViewCard">
                            <i class="me-1 fa-solid fa-grip"></i>
                            <span vslang="buttons.View Card">View Card</span>
                        </label>

                        <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewList">
                        <label class="rounded-3 btn-outline-prm-custom btn" for="tenantViewList">
                            <i class="me-1 fa-solid fa-rectangle-list"></i>
                            <span vslang="buttons.View List">View List</span>
                        </label>
                    </div>
                </div>
                <div class="ms-md-auto text-md-end col-12 col-md-auto">
                    <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAddTenant">
                        <i class="me-2 fa fa-user-plus"></i>
                        <span vslang="buttons.Create Tenant">Create Tenant</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="_tenant_card_view" class="my-3 px-3"></div>
        <div id="tenant_card_container_pagination" class="justify-content-start px-3"></div>
        <div id="_tenant_list_view" class="mt-3 rounded-2 overflow-y-auto"></div>
    </div>
</div>

<div id="_ten_profile_view" class="px-3" style ="display:none">
    <div class="d-flex align-items-center justify-content-between bg-white shadow-sm mt-2 p-3 rounded-3"
        id="view_buttons">
        <div class="d-flex flex-wrap align-items-center gap-3">
            <a href="javascript:void(0)" id="_btn_back_tenant"
                class="d-flex align-items-center gap-2 shadow-sm btn-outline-secondary btn btn-sm">
                <i class="fa-angles-left fa-solid fs-5"></i>
                Back to Tenants
            </a>
            <div class="d-sm-block vr d-none"></div>
            <nav aria-label="breadcrumb">
                <ol class="align-items-center mb-0 breadcrumb">
                    <li class="breadcrumb-item">
                        <a href="javascript:void(0)" class="text-muted text-decoration-none fw-medium">Tenants</a>
                    </li>
                    <li class="text-muted breadcrumb-item active fw-semibold" aria-current="page">
                        Personal Information
                    </li>
                </ol>
            </nav>

        </div>
    </div>

    <div class="mt-3 mb-5" style="max-height: 600px;" id="sub_view_profile">
        <div id="profile_info_tenant">
        </div>
    </div>

</div>


<style>
    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;
    }

    .card-header-tenant {
        display: flex;
        height: 120px;
        justify-content: space-between;
        padding: 18px 16px;
        border: none;
        align-items: center;
        /* background-color: #fff; */
        background:
            /* linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), */
            url('../assets/images/default/bg_card7.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }

    .card-body {
        /* background:
        /* linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), */
        url('../assets/images/default/bg-card1.jpg');
        */
        /* background-size: cover; */
        /* background-repeat: no-repeat; */
    }


    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* background-color: #e9eaea; */
        padding: 10px;
        border-radius: 10px;

    }

    .btn-check:checked+.btn {
        background-color: #0c399e;
        color: #fff;

    }
</style>
