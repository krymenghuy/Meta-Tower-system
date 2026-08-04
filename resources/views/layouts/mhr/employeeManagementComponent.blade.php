<div id="_main_employee_management_component" class="mobile-padding px-3" style="display:none;">
    <div id="_employee_list_container">
        <div id="div_filter_filed" class="bg-white rounded-2 shadow p-3">
            <div class="align-items-center row g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <input type="text" class="filter-field rounded-2 input-search" id="_search_employee" placeholder="{{ \Vsd\Locales\Localization::trans('Search by name, code', 'labels') }}">
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
                        <span vslang="buttons.Create Employee"></span>
                    </button>
                </div>
            </div>
        </div>

        <div id="_employee_list" class="table-responsive mt-3 rounded-2"></div>
        <div id="container_pagination" class="px-3 d-flex justify-content-start bg-light"></div>
    </div>

    <div id="_emp_profile_view" class="" style="display:none;">
        <div class="d-flex align-items-center justify-content-between bg-white shadow-sm mt-2 p-3 rounded-3">
            <div class="d-flex flex-wrap align-items-center gap-3">
                <a href="javascript:void(0)" id="_btn_back_employee"
                    class="d-flex align-items-center gap-2 shadow-sm btn-outline-secondary btn btn-sm">
                    <i class="fa-angles-left fa-solid fs-5"></i><span vslang="buttons.Back">Back</span>
                </a>
                <div class="d-sm-block vr d-none"></div>
                <nav aria-label="breadcrumb">
                    <ol class="align-items-center mb-0 breadcrumb">
                        <li class="breadcrumb-item">
                            <a href="javascript:void(0)" class="text-muted text-decoration-none"></a><span class="text-muted" vslang="titles.Employee">Employee</span>
                        </li>
                        <li class="text-muted breadcrumb-item active fw-semibold" aria-current="page">
                            <span vslang="titles.Personal Information">Personal Information</span>
                        </li>
                    </ol>
                </nav>
                
            </div>
        </div>

        <div class="mt-3 pb-4" id="sub_view_employee_profile">
            <div id="profile_info_employee"></div>
            <div id="profile_cards_employee" class="row gy-3"></div>
        </div>
    </div>
</div>

<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_list_card.css') }}?v=3">
<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_skill.css') }}">
<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_education.css') }}?v=3">
<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_experience.css') }}?v=3">
<link rel="stylesheet" href="{{ asset('assets/css/mhr/employee_document.css') }}?v=3">
<link rel="stylesheet" href="{{ asset('assets/css/mhr/tax_allowance.css') }}?v=3">

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
        margin: 0 -0.75rem;
        padding: 0 0.75rem 1.5rem;
        overflow-y: auto;
        overflow-x: hidden;
        --emp-primary: #1A1647;
        --emp-primary2: #2E2A72;
        --emp-accent: #F6D673;
        --emp-muted: #64748B;
        --emp-border: #E8ECF3;
        --emp-bg: #F7F8FC;
        --emp-col-label-width: 162px;
        background:
            radial-gradient(circle at top right, rgba(79, 70, 229, .08), transparent 28%),
            linear-gradient(180deg, #FAFBFF 0%, var(--emp-bg) 100%);
    }

  

    .emp-hero {
        position: relative;
        overflow: hidden;
        border-radius: 28px;
        padding: 26px 28px 22px;
        margin-bottom: 24px;
        color: #fff;
        background:
            radial-gradient(circle at 85% 10%, rgba(246, 214, 115, .45), transparent 28%),
            radial-gradient(circle at 10% 100%, rgba(14, 165, 233, .22), transparent 32%),
            linear-gradient(135deg, var(--emp-primary), var(--emp-primary2));
        box-shadow: 0 22px 55px rgba(26, 22, 71, .28);
    }

    .emp-hero:after {
        content: "";
        position: absolute;
        inset: auto -80px -110px auto;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .08);
        pointer-events: none;
    }

    .emp-hero-top {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
    }

    .emp-hero-identity {
        display: flex;
        align-items: center;
        gap: 14px;
        flex: 1;
        min-width: 0;
    }

    .emp-avatar-wrap {
        position: relative;
        flex-shrink: 0;
        width: 72px;
        height: 72px;
    }

    .emp-avatar {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        object-fit: cover;
        object-position: center;
        border: 3px solid rgba(255, 255, 255, .28);
        box-shadow: 0 6px 18px rgba(0, 0, 0, .2);
        background: #e2e8f0;
    }

    .emp-avatar-placeholder {
        display: none;
        position: absolute;
        inset: 0;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: linear-gradient(145deg, #eef2ff 0%, #dbe4ff 100%);
        color: #7c8db5;
        font-size: 1.5rem;
    }

    .emp-avatar-wrap.is-empty .emp-avatar {
        display: none;
    }

    .emp-avatar-wrap.is-empty .emp-avatar-placeholder {
        display: flex;
        width: 72px;
        height: 72px;
        border: 3px solid rgba(255, 255, 255, .28);
        box-shadow: 0 6px 18px rgba(0, 0, 0, .2);
    }

    .emp-hero-info {
        min-width: 0;
        display: flex;
        align-items: center;
    }

    .emp-hero-name-block {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        min-width: 0;
    }

    .emp-hero-name-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 0;
    }

    .emp-hero-name {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -.02em;
        color: #fff;
    }

    .emp-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 700;
        background: rgba(255, 255, 255, .14);
        border: 1px solid rgba(255, 255, 255, .2);
        color: #fff;
        white-space: nowrap;
    }

    .emp-status-badge:before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
    }

    .emp-status-badge.is-active { color: #6ee7b7; }
    .emp-status-badge.is-pending { color: #fcd34d; }
    .emp-status-badge.is-inactive { color: #fca5a5; }

    .emp-hero-social {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 4px;
    }

    .emp-social-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: linear-gradient(180deg, #4a90e2 0%, #2f6fbf 100%);
        border: 2px solid #fff;
        color: #fff;
        font-size: 0.78rem;
        text-decoration: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        transition: transform 0.15s ease, filter 0.15s ease;
    }

    .emp-social-btn:hover {
        color: #fff;
        transform: translateY(-1px);
        filter: brightness(1.08);
    }

    .emp-social-btn--facebook { background: linear-gradient(180deg, #5b9bd5 0%, #3b6ea8 100%); }
    .emp-social-btn--linkedin { background: linear-gradient(180deg, #4a90e2 0%, #2f6fbf 100%); }
    .emp-social-btn--telegram { background: linear-gradient(180deg, #54a9eb 0%, #2a8cd4 100%); }

    .emp-hero-stats {
        display: grid;
        grid-template-columns: repeat(3, minmax(88px, 1fr));
        gap: 8px;
        flex-shrink: 0;
        min-width: 0;
        max-width: 320px;
    }

    .emp-stat-card {
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(255, 255, 255, .12);
        border: 1px solid rgba(255, 255, 255, .16);
        backdrop-filter: blur(10px);
        min-width: 0;
    }

    .emp-stat-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 8px;
        margin-bottom: 6px;
        background: rgba(255, 255, 255, .12);
        color: #fff;
        font-size: 11px;
    }

    .emp-stat-label {
        font-size: 8px;
        color: rgba(255, 255, 255, .72);
        text-transform: uppercase;
        letter-spacing: .05em;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
    }

    .emp-stat-value {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.2;
        color: #fff;
        word-break: break-word;
    }

    .emp-hero-contact {
        position: relative;
        z-index: 2;
        margin-top: 16px;
        padding-top: 14px;
        border-top: 1px solid rgba(255, 255, 255, .12);
        --bs-gutter-x: 0.75rem;
        --bs-gutter-y: 0.75rem;
    }

    .emp-hero-contact > [class*="col-"] {
        display: flex;
    }

    .emp-contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
        min-height: 56px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255, 255, 255, .08);
        border: 1px solid rgba(255, 255, 255, .1);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, .06);
        backdrop-filter: blur(12px);
        width: 100%;
    }

    .emp-contact-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 10px;
        background: rgba(255, 255, 255, .1);
        border: 1px solid rgba(255, 255, 255, .08);
        color: rgba(255, 255, 255, .92);
        font-size: 13px;
        flex-shrink: 0;
    }

    .emp-contact-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
        min-width: 0;
    }

    .emp-contact-label {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, .58);
        line-height: 1.2;
    }

    .emp-contact-value {
        font-size: 13px;
        font-weight: 700;
        line-height: 1.3;
        color: #fff;
        word-break: break-word;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .emp-personal {
        background: #fff;
        border: 1px solid var(--emp-border);
        border-radius: 6px;
        padding: 22px 24px 24px;
        box-shadow: 0 4px 18px rgba(15, 23, 42, .05);
        margin-bottom: 8px;
    }

    .emp-personal-header {
        margin-bottom: 18px;
        padding-bottom: 16px;
        border-bottom: 1px solid #e8edf4;
    }

    .emp-personal-title {
        margin: 0;
        font-size: 1rem;
        color: var(--emp-primary);
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .emp-personal-title-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: linear-gradient(165deg, #254278 0%, #1a3058 100%);
        color: #f2cb5c;
        font-size: 0.9rem;
        flex-shrink: 0;
    }

    .emp-personal-info {
        display: flex;
        flex-direction: column;
        line-height: 1.3;
    }

 

    .emp-personal-subtitle {
        margin: 0;
        font-size: 0.82rem;
        color: var(--emp-muted);
    }

    .emp-profile-groups {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
    }

    .emp-profile-group {
        background: #f8fafc;
        border: 1px solid #e8edf4;
        border-radius: 14px;
        padding: 14px 14px 12px;
        min-width: 0;
    }

    .emp-profile-group-title {
        margin: 0 0 12px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #7a90b0;
    }

    .emp-profile-field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
    }
    .emp-profile-field-full {
        grid-column: 1 / -1;
    }

    .emp-profile-field {
        background: #fff;
        border: 1px solid #eef2f7;
        border-radius: 10px;
        padding: 10px 12px;
        min-width: 0;
    }

    .emp-profile-field-label {
        display: block;
        margin-bottom: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: #94a3b8;
        line-height: 1.2;
    }

    .emp-profile-field-value {
        display: block;
        color: var(--emp-primary);
        word-break: break-word;
    }

    .emp-profile-field-value.is-gold { color: #b8860b; }
    .emp-profile-field-value.is-capitalize { text-transform: capitalize; }
    .emp-profile-field-value.is-muted {
        color: var(--emp-muted);
        font-style: italic;
        font-weight: 500;
    }

    .group_action_movement .btn {
        width: 38px;
        height: 38px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: .5rem;
    }


    .resign-dialog .modal-header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 12px;
    }

    .resign-dialog .modal-title {
        font-weight: 700;
        color: #111827;
    }

    .resign-dialog-body {
        padding: 4px 2px 8px;
    }

    .resign-field-label {
        display: block;
        margin-bottom: 8px;
        font-size: 0.95rem;
        font-weight: 600;
        color: #111827;
    }

    .resign-field-input {
        border-radius: 8px;
        border: 1px solid #d1d5db;
        min-height: 42px;
        box-shadow: none;
    }

    .resign-field-input:focus {
        border-color: #93c5fd;
        box-shadow: 0 0 0 0.15rem rgba(59, 130, 246, 0.15);
    }

    .resign-field-remarks {
        min-height: 110px;
        resize: vertical;
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

    /* Employee photo uploader (same interaction as Tenant dialog) */
    .emp-photo-container {
        width: 100%;
        height: 100%;
        min-height: 180px;
        max-width: 180px;
        margin: 0 auto;
    }

    .emp-image-card {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 180px;
        border: 1px solid #ced4da;
        border-radius: 12px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .emp-upload-trigger {
        width: 100%;
        height: 100%;
        min-height: 180px;
        border: 1px dashed #c5c9d4;
        border-radius: 12px;
        background: transparent;
        color: #6c757d;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease, border-color 0.2s ease;
    }

    .emp-upload-trigger:hover {
        border-color: #4f5cd1;
        background-color: #f4f6ff;
    }

    .emp-photo-placeholder-icon {
        width: 48px;
        height: 48px;
    }

    .emp-photo-preview {
        width: 100%;
        height: 100%;
        min-height: 180px;
        overflow: hidden;
        border-radius: 11px;
    }

    .emp-photo-preview img {
        width: 100%;
        height: 100%;
        min-height: 180px;
        object-fit: cover;
        cursor: pointer;
    }

    .emp-photo-remove {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 10;
        width: 28px;
        height: 28px;
        padding: 0;
        border: 2px solid #fff;
        border-radius: 50%;
        background-color: #dc3545;
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    }

    .emp-photo-remove:hover {
        background-color: #bd2130;
    }

    .emp-photo-remove span {
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
    }

    @media (max-width: 991.98px) {
        .emp-hero-top {
            flex-direction: column;
            align-items: stretch;
        }

        .emp-hero-stats {
            width: 100%;
            max-width: none;
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .emp-hero-identity {
            align-items: flex-start;
        }

        .emp-profile-groups {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 767.98px) {
        .emp-hero-stats {
            grid-template-columns: 1fr;
        }

        .emp-profile-field-grid {
            grid-template-columns: 1fr;
        }

        .emp-personal {
            padding: 16px;
            border-radius: 14px;
        }

        .emp-hero-contact > [class*="col-"] {
            flex: 0 0 100%;
            max-width: 100%;
        }
    }

    @media (max-width: 575.98px) {
        .emp-hero {
            padding: 20px 16px 18px;
            border-radius: 22px;
        }

        .emp-hero-name {
            font-size: 20px;
        }

        .emp-hero-identity {
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .emp-hero-name-block {
            align-items: center;
        }

        .emp-hero-name-row {
            justify-content: center;
        }

        .emp-hero-social {
            justify-content: center;
        }

        .emp-personal {
            padding: 16px;
            border-radius: 14px;
        }

        .emp-profile-line {
            --emp-col-label-width: 118px;
        }
    }
</style>
