<div id="_main_tenant_component" class="mobile-padding p-3" style="display:none;">
    <div id="_tenant_list_container" style ="display:none">
        <div id="_divFilter_tenant" class="rounded-2 p-3 bg-white shadow-sm">
            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="position-relative w-100">
                        <input type="text" class="rounded-2 filter-field input-search" id="_search_tenant_" placeholder="Search by name code or phone">
                        {{-- <i class="fa fa-search fs-6 text-muted position-absolute"
                            style="right: 15px; top: 50%; transform: translateY(-50%);"></i> --}}
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select id="_el_tenant_status" class="data-input filter-field form-control" data-field="status_id" placeholder="Status"></select>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="btn-group btn-group-sm gap-2 rounded" role="group">
                        <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewCard" checked>
                        <label class="btn btn-outline-prm-custom rounded-3 " for="tenantViewCard">
                            <i class="fa-solid fa-grip me-1"></i>
                            <span vslang="buttons.View Card">View Card</span>
                        </label>

                        <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewList">
                        <label class="btn btn-outline-prm-custom rounded-3 " for="tenantViewList">
                            <i class="fa-solid fa-rectangle-list me-1"></i>
                            <span vslang="buttons.View List">View List</span>
                        </label>
                    </div>
                </div>
                <div class="col-12 col-md-auto ms-md-auto text-md-end">
                    <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAddTenant">
                        <i class="fa fa-user-plus me-2"></i>
                        <span vslang="buttons.Create Tenant">Create Tenant</span>
                    </button>
                </div>
            </div>
        </div>
        <div id="_tenant_card_view" class="my-3 px-3"></div>
        <div id="tenant_card_container_pagination" class="px-3 justify-content-start"></div>
        <div id="_tenant_list_view" class="mt-3 overflow-y-auto rounded-2"></div>
    </div>
</div>

<div id="_ten_profile_view" class="px-3" style ="display:none">
    <div class="d-flex justify-content-between align-items-center rounded-3 bg-white shadow-sm p-3 mt-2" id="view_buttons">
        <div class="d-flex align-items-center gap-3 flex-wrap">
            <a href="javascript:void(0)" id="_btn_back_tenant" class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 shadow-sm">
                <i class="fa-solid fa-angles-left fs-5"></i>
                Back to Tenants
            </a>
            <div class="vr d-none d-sm-block"></div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0 align-items-center">
                    <li class="breadcrumb-item">
                        <a href="javascript:void(0)" class="text-decoration-none text-muted fw-medium">Tenants</a>
                    </li>
                    <li class="breadcrumb-item active fw-semibold text-muted" aria-current="page">
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
        height:120px;
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
        url('../assets/images/default/bg-card1.jpg'); */
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
    .btn-check:checked+.btn{
        background-color: #1a1647;
    color: #fff;

    }




</style>

