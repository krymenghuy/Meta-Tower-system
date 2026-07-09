<div id="_main_employee_management_component" class="mobile-padding px-3" style="display:none;">
    <div id="_employee_list_container">
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
        <div id="container_pagination" class="px-3 d-flex justify-content-start bg-light"></div>
    </div>

    <div id="_emp_profile_view" class="emp-profile-page" style="display:none;">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-3">
            <a href="javascript:void(0)" id="_btn_back_employee"
                class="btn emp-profile-btn-back d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold text-uppercase text-white text-decoration-none">
                <i class="fa-solid fa-arrow-left"></i>
                <span vslang="buttons.Back">BACK</span>
            </a>
            <div class="d-flex flex-wrap align-items-center gap-2 ms-auto">
                <button type="button" class="btn emp-profile-btn-print d-inline-flex align-items-center gap-2 px-3 py-2 bg-white"
                    id="_btn_print_employee_cv">
                    <i class="fa-solid fa-print"></i>
                    <span vslang="buttons.Print CV">Print CV</span>
                </button>
                <button type="button" class="btn emp-profile-btn-edit d-inline-flex align-items-center gap-2 px-3 py-2"
                    id="_btn_edit_employee_profile">
                    <i class="fa-solid fa-pen"></i>
                    <span vslang="buttons.Edit Profile">Edit Profile</span>
                </button>
            </div>
        </div>

        <div class="pb-4" id="sub_view_employee_profile">
            <div id="profile_info_employee"></div>
            <div id="profile_skills_employee" class="row g-3 mt-3"></div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_skill.css') }}">

<style>
    /* List cards (same pattern as tenant) */
    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;
    }

    .card-header-tenant {
        height: 150px;
        padding: 18px 16px;
        background: url('../assets/images/default/bg_card8.jpg') center / cover no-repeat;
    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 10px;
        border-radius: 10px;
        background: url('../assets/images/bhr/backposition.png') center / cover no-repeat;
    }

    /* Profile page shell */
    .emp-profile-page {
        background: #eceef2;
        margin: 0 -0.75rem;
        padding: 0 0.75rem 1.5rem;
        min-height: calc(100vh - 120px);
        --emp-label-color: #8fa4c8;
        --emp-value-color: #ffffff;
        --emp-gold-color: #f2cb5c;
        --emp-muted-color: #7a90b0;
        --emp-subtitle-color: #a8bdd9;
        --emp-divider-color: rgba(143, 174, 220, 0.28);
        --emp-col-label-width: 162px;
    }

    .emp-profile-btn-back {
        border-radius: 10px;
        background: linear-gradient(180deg, #1a3a8f 0%, #0f2560 55%, #0a1845 100%);
        letter-spacing: 0.06em;
        box-shadow: 0 4px 10px rgba(10, 24, 69, 0.3);
    }

    .emp-profile-btn-back:hover {
        color: #fff;
        opacity: 0.92;
    }

    .emp-profile-btn-print {
        border: 1px solid #d7dce5;
        color: #334155;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
    }

    .emp-profile-btn-edit {
        border: none;
        border-radius: 10px;
        background: linear-gradient(180deg, #f8df7a 0%, #f2c94c 100%);
        color: #1a1647;
        box-shadow: 0 4px 10px rgba(242, 201, 76, 0.35);
    }

    /* Profile card (mockup design) */
    .emp-profile-card {
        background: linear-gradient(165deg, #254278 0%, #1f386b 42%, #1a3058 100%);
        border-radius: 18px;
        color: var(--emp-value-color);
        overflow: hidden;
        box-shadow: 0 18px 44px rgba(8, 18, 48, 0.32);
        border: 1px solid rgba(143, 174, 220, 0.12);
    }

    .emp-profile-side {
        flex: 0 0 252px;
        max-width: 252px;
        padding-right: 32px;
        margin-right: 32px;
        border-right: 1px solid var(--emp-divider-color);
    }

    .emp-profile-photo-wrap {
        position: relative;
        width: 156px;
        height: 156px;
        border-radius: 14px;
        overflow: hidden;
        border: 3px solid rgba(255, 255, 255, 0.95);
        background: linear-gradient(145deg, #2a4278 0%, #1e2d5a 100%);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
    }

    .emp-profile-photo-wrap img {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .emp-profile-photo-placeholder {
        display: none;
        position: absolute;
        inset: 0;
        font-size: 3.5rem;
        color: #8fa4c8;
        z-index: 0;
    }

    .emp-profile-photo-wrap.is-empty .emp-profile-photo-placeholder {
        display: flex;
    }

    .emp-profile-photo-wrap.is-empty img {
        display: none;
    }

    .emp-profile-status-dot {
        position: absolute;
        right: 8px;
        bottom: 8px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #22c55e;
        border: 3px solid #fff;
        z-index: 2;
    }

    .emp-profile-code {
        color: var(--emp-gold-color);
        font-size: 0.92rem;
        font-weight: 700;
        letter-spacing: 0.04em;
    }

    .emp-profile-name {
        font-size: 1.65rem;
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.01em;
    }

    .emp-profile-position {
        color: var(--emp-subtitle-color);
        font-size: 0.94rem;
        font-weight: 500;
    }

    .emp-profile-social-btn {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.95);
        color: #fff;
        font-size: 1.1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        transition: transform 0.15s ease;
    }

    .emp-profile-social-btn:hover {
        color: #fff;
        transform: translateY(-2px);
    }

    .emp-profile-social-facebook { background: #2d6cdf; }
    .emp-profile-social-linkedin { background: #1a6fba; }
    .emp-profile-social-telegram { background: linear-gradient(180deg, #38b0e3 0%, #229ed9 100%); }

    .emp-profile-details {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        column-gap: 36px;
    }

    .emp-profile-info-col--divided {
        padding-left: 36px;
        border-left: 1px solid var(--emp-divider-color);
    }

    .emp-profile-band-divider {
        grid-column: 1 / -1;
        height: 1px;
        background: var(--emp-divider-color);
        margin: 22px 0 20px;
    }

    .emp-profile-line {
        display: grid;
        grid-template-columns: var(--emp-col-label-width) 10px minmax(0, 1fr);
        align-items: baseline;
        margin-bottom: 14px;
        min-height: 1.5rem;
    }

    .emp-profile-line:last-child {
        margin-bottom: 0;
    }

    .emp-profile-line-label,
    .emp-profile-line-sep {
        color: var(--emp-label-color);
        font-size: 0.98rem;
        font-weight: 500;
    }

    .emp-profile-line-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .emp-profile-line-value {
        color: var(--emp-value-color);
        font-size: 1.02rem;
        font-weight: 700;
        line-height: 1.5;
        word-break: break-word;
    }

    .emp-profile-line-value.is-gold { color: var(--emp-gold-color); }
    .emp-profile-line-value.is-capitalize { text-transform: capitalize; }
    .emp-profile-line-value.is-muted {
        color: var(--emp-muted-color);
        font-style: italic;
        font-weight: 500;
    }

    .emp-profile-action-btn {
        width: 40px;
        height: 40px;
        border-radius: 9px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(12, 24, 52, 0.45);
        color: #c5d4ef;
        transition: background 0.15s ease, transform 0.15s ease;
    }

    .emp-profile-action-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
    }

    .emp-profile-action-btn-edit { color: #fff; }
    .emp-profile-action-btn-remove { color: #e85d4c; }
    .emp-profile-action-btn-alert { color: #f2cb5c; }
    .emp-profile-action-btn-message { color: #22c55e; }

    /* Dialog photo only — labels/inputs use Bootstrap form-* */
    .emp-dialog-photo-wrap {
        width: 100%;
        min-height: 170px;
        border: 1px solid #d9dbe3;
        border-radius: 10px;
        background: #f8f9fb;
        overflow: hidden;
    }

    .emp-dialog-btn-cancel {
        background: #d88994;
        border: none;
        color: #fff;
        min-width: 90px;
    }

    .emp-dialog-btn-cancel:hover {
        background: #c97783;
        color: #fff;
    }

    .emp-dialog-btn-save {
        background: #4f5fd0;
        border: none;
        color: #fff;
        min-width: 90px;
    }

    .emp-dialog-btn-save:hover {
        background: #3f4fc0;
        color: #fff;
    }

    @media (max-width: 991.98px) {
        .emp-profile-side {
            flex: none;
            max-width: 100%;
            width: 100%;
            padding-right: 0;
            margin-right: 0;
            padding-bottom: 24px;
            border-right: none;
            border-bottom: 1px solid var(--emp-divider-color);
        }

        .emp-profile-details {
            grid-template-columns: 1fr;
        }

        .emp-profile-info-col--divided {
            padding-left: 0;
            border-left: none;
            padding-top: 20px;
            margin-top: 20px;
            border-top: 1px solid var(--emp-divider-color);
        }

        .emp-profile-line {
            --emp-col-label-width: 132px;
        }
    }

    @media (max-width: 575.98px) {
        .emp-profile-line {
            --emp-col-label-width: 118px;
        }
    }
</style>
