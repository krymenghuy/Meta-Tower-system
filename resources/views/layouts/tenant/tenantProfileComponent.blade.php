<div id="_main_tenant_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_tenant_list_container" style="display:none">
        <div id="_divFilter_tenant" class="bg-white shadow-sm p-3 rounded-2">
            <div class="align-items-center row g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="position-relative w-100">
                        <input type="text" class="filter-field rounded-2 input-search" id="_search_tenant_"
                            placeholder="Search by name, code or phone">
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select id="_el_tenant_status" class="filter-field data-input form-control" data-field="status_id"
                        placeholder="Status"></select>
                </div>
                {{-- <div class="col-12 col-md-6 col-lg-3">
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
                </div> --}}
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

<div id="_ten_profile_view" class="px-3" style="display:none">
    <div class="d-flex align-items-center justify-content-between bg-white shadow-sm mt-2 p-3 rounded-3"
        id="view_buttons">
        <div class="d-flex flex-wrap align-items-center gap-3">
            <a href="javascript:void(0)" id="_btn_back_tenant"
                {{-- class="d-flex align-items-center gap-2 shadow-sm btn-outline-secondary btn btn-sm">
                <i class="fa-angles-left fa-solid fs-5"></i>
                Back to Tenants --}}
            </a>
            <div class="d-sm-block vr d-none"></div>
            <nav aria-label="breadcrumb">
                {{-- <ol class="align-items-center mb-0 breadcrumb">
                    {{-- <li class="breadcrumb-item">
                        <a href="javascript:void(0)" class="text-muted text-decoration-none fw-medium">Tenants</a>
                    </li> --}}
                    {{-- <li class="text-muted breadcrumb-item active fw-semibold" aria-current="page">
                        Personal Information
                    </li>
                </ol> --}}
            </nav>
        </div>
    </div>

    <div class="mt-3 mb-5" id="sub_view_profile">
        <div id="profile_info_tenant"></div>
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
        background: url('../assets/images/default/bg_card7.jpg');
        background-size: cover;
        background-repeat: no-repeat;
    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        border-radius: 10px;
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
        height: 140px;
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

    /* Tenant profile view */
    .tenant-profile-layout .profile-sidebar-card {
        border: none;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(26, 22, 71, 0.08);
    }

    .tenant-profile-layout .profile-sidebar-banner {
        height: 88px;
        background: linear-gradient(135deg, #0c399e 0%, #1a1647 100%);
    }

    .tenant-profile-layout .profile-avatar-wrap {
        margin-top: -56px;
    }

    .tenant-profile-layout .profile-avatar {
        width: 112px;
        height: 112px;
        object-fit: cover;
        object-position: center;
        border: 4px solid #fff;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .tenant-profile-layout .profile-quick-actions .btn {
        border-radius: 10px;
        font-size: 0.8125rem;
        font-weight: 500;
    }

    .tenant-profile-layout .profile-detail-card {
        border: none;
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(26, 22, 71, 0.08);
    }

    .tenant-profile-layout .profile-section-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #1a1647;
        padding-bottom: 0.75rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #f0f2f5;
    }

    .tenant-profile-layout .profile-field-box {
        background: #f8f9fb;
        border: 1px solid #eef0f4;
        border-radius: 12px;
        padding: 0.875rem 1rem;
        height: 100%;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .tenant-profile-layout .profile-field-box:hover {
        border-color: #d8deea;
        box-shadow: 0 2px 8px rgba(26, 22, 71, 0.04);
    }

    .tenant-profile-layout .profile-field-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        flex-shrink: 0;
    }

    .tenant-profile-layout .profile-field-label {
        font-size: 0.75rem;
        color: #8b8b8b;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        margin-bottom: 0.25rem;
    }

    .tenant-profile-layout .profile-field-value {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #38373a;
        word-break: break-word;
    }

    .tenant-profile-layout .profile-field-value a {
        color: #0c399e;
        text-decoration: none;
    }

    .tenant-profile-layout .profile-field-value a:hover {
        text-decoration: underline;
    }
</style>
