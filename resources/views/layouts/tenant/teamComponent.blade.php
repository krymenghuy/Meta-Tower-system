<div id="_main_team_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_team_list_container">

        <!-- Two Column Layout -->
     <div class="row g-3">

        <div class="col-lg-3">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-header bg-white py-3 d-flex align-items-center justify-content-between">
                    <h6 class="mb-0 text-muted">Teams</h6>
                    <button type="button" class="btn btn-primary btn-sm vs-icon-btn" id="_btnAddTeam" aria-label="Create Team">
                        <i class="fa fa-user-plus p-0" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="card-body p-3" style="height: calc(100vh - 240px); overflow-y: auto;">
                    <div id="_team_card_view"></div>
                </div>
            </div>
        </div>

        <div class="col-lg-9">
            <div class="card h-100 shadow-sm border-0">
                <div class="card-header bg-white py-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                    <h6 class="mb-0 text-muted">Team Members</h6>
                    <div class="d-flex align-items-center gap-2" style="width: 450px; max-width: 100%;">
                        <div class="position-relative flex-grow-1">
                            <input type="text" class="filter-field form-control rounded-2 ps-5"
                                   id="_search_member" placeholder="Search by name, code or phone">
                            <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        </div>
                        <select id="_el_member_status" class="filter-field form-select flex-shrink-0"
                                data-field="status_id"></select>
                    </div>
                </div>
                <div class="card-body p-0" style="height: calc(100vh - 240px); overflow-y: auto;">
                    <div id="_team_list_view"></div>
                </div>
            </div>
        </div>

    </div>

    </div>
</div>

<!-- Profile View -->
<div id="_team_profile_view" class="px-3" style="display:none; height: calc(100vh - 90px); overflow-y: auto;">
    <div class="vs-profile-topbar mt-2 mb-3">
        <nav class="vs-breadcrumb" aria-label="breadcrumb">
            <a href="javascript:void(0)" class="vs-breadcrumb-link" id="_btn_back_team_dashboard">Team</a>
            <span class="vs-breadcrumb-sep">/</span>
            <a href="javascript:void(0)" id="_btn_back_team" class="vs-breadcrumb-link">Staff Directory</a>
            <span class="vs-breadcrumb-sep">/</span>
            <span class="vs-breadcrumb-current" id="_team_profile_breadcrumb_name">&nbsp;</span>
        </nav>
        <div class="mt-1">
            <h4 class="vs-profile-page-title mb-0">Staff Member Profile</h4>
        </div>
    </div>
    <div id="sub_view_profile">
        <div id="profile_info_team"></div>
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

    .vs-profile-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #eceef3;
        height: 100%;
    }

    .vs-profile-avatar {
        width: 110px;
        height: 110px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid #eceef3;
    }

    .vs-status-badge {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 14px;
        border-radius: 20px;
    }

    .vs-status-success {
        background-color: #e7f8ef;
        color: #16a34a;
        border: 1px solid #b9ecd0;
    }

    .vs-status-danger {
        background-color: #fdecec;
        color: #dc2626;
        border: 1px solid #f6c5c5;
    }

    .vs-status-warning {
        background-color: #fff7e6;
        color: #b45309;
        border: 1px solid #fde4ad;
    }

    .vs-stat-box {
        background-color: #f7f8fb;
        border-radius: 8px;
        padding: 10px 12px;
    }

    .vs-stat-label {
        font-size: 11px;
        color: #8a8d99;
        text-transform: uppercase;
        letter-spacing: .02em;
        margin-bottom: 2px;
    }

    .vs-stat-value {
        font-size: 14px;
        font-weight: 600;
        color: #1a2566;
    }

    .vs-profile-tabs {
        border-bottom: 1px solid #eceef3;
        gap: 24px;
    }

    .vs-profile-tabs .nav-link {
        color: #8a8d99;
        font-weight: 600;
        font-size: 14px;
        padding: 0 0 12px;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
    }

    .vs-profile-tabs .nav-link.active {
        color: #2d4acb;
        border-bottom-color: #2d4acb;
    }

    .vs-field-label {
        font-size: 12px;
        color: #8a8d99;
        margin-bottom: 4px;
    }

    .vs-field-value {
        font-size: 14px;
        font-weight: 600;
        color: #1a2566;
    }

    .vs-field-link {
        color: #2563eb;
        font-weight: 500;
    }

    /* ===== Icon-only button (e.g. Create Team in card header) ===== */
    .vs-icon-btn {
        width: 34px !important;
        height: 34px !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 8px;
        line-height: 0 !important;
    }

    .vs-icon-btn i {
        margin: 0 !important;
        font-size: 14px;
        line-height: 1;
    }

    /* ===== Status filter selects: guard against global .filter-field width
       rules truncating the option text ===== */
    #_el_team_status,
    #_el_member_status {
        width: auto !important;
        min-width: 160px;
        max-width: 100%;
        padding-right: 34px !important;
        white-space: nowrap;
        text-overflow: clip;
    }

    /* ===== New Profile Header (gradient banner) ===== */
    .vs-profile-card.vs-profile-card--flush {
        overflow: hidden;
        padding: 0 !important;
    }

    .vs-profile-header {
        --vs-hero-primary: #1f1c3d;
        --vs-hero-primary2: #473e63;

        position: relative;
        overflow: hidden;
        z-index: 0;
        border-radius: 12px;
        padding: 28px 32px;
        display: flex;
        align-items: center;
        gap: 20px;
        color: #fff;
        flex-wrap: wrap;
        background:
            radial-gradient(circle at 85% 10%, rgba(246, 214, 115, .45), transparent 28%),
            radial-gradient(circle at 10% 100%, rgba(14, 165, 233, .22), transparent 32%),
            linear-gradient(135deg, var(--vs-hero-primary), var(--vs-hero-primary2));
        box-shadow: 0 22px 55px rgba(26, 22, 71, .28);
    }

    .vs-profile-header:after {
        content: "";
        position: absolute;
        inset: auto -80px -110px auto;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .08);
        z-index: 0;
    }

    .vs-profile-header > * {
        position: relative;
        z-index: 1;
    }

    .vs-profile-header-avatar {
        width: 74px;
        height: 74px;
        border-radius: 16px;
        object-fit: cover;
        border: 3px solid rgba(255, 255, 255, .55);
        background: #fff;
        flex-shrink: 0;
    }

    .vs-profile-header-name {
        font-size: 20px;
        font-weight: 700;
        margin: 0;
        color: #fff;
    }

    .vs-profile-header-meta {
        display: flex;
        gap: 18px;
        margin-top: 6px;
        font-size: 13px;
        opacity: .92;
        flex-wrap: wrap;
    }

    .vs-profile-header-actions .btn {
        width: 32px;
        height: 32px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
    }

    .vs-profile-header-actions .btn i {
        margin: 0 !important;
        font-size: 13px;
    }

    .vs-status-pill {
        background: rgba(255, 255, 255, .18);
        border: 1px solid rgba(255, 255, 255, .45);
        padding: 3px 12px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: .03em;
        color: #fff;
    }

    .vs-status-pill.vs-status-pill-danger {
        background: rgba(255, 90, 90, .25);
        border-color: rgba(255, 150, 150, .5);
    }

    .vs-status-pill.vs-status-pill-warning {
        background: rgba(255, 200, 80, .25);
        border-color: rgba(255, 210, 120, .5);
    }

    .vs-status-pill.vs-status-pill-success {
        background: rgba(74, 222, 128, .25);
        border-color: rgba(134, 239, 172, .55);
    }

    /* ===== Section title ===== */
    .vs-section-title {
        font-size: 12px;
        font-weight: 700;
        color: #1a2566;
        text-transform: uppercase;
        letter-spacing: .04em;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .vs-section-title i {
        font-size: 13px;
    }

    /* ===== Soft field boxes ===== */
    .vs-field-box {
        background: #f7f8fb;
        border-radius: 10px;
        padding: 12px 14px;
        height: 100%;
    }

    .vs-field-box .vs-field-label {
        margin-bottom: 3px;
    }

    .vs-field-box .vs-field-value {
        word-break: break-word;
    }

    /* ===== Administrative notes ===== */
    .vs-notes-box {
        background: #fffaf0;
        border: 1px solid #fde4ad;
        border-radius: 10px;
        padding: 14px 16px;
    }

    /* ===== Quick stat tiles (bottom row) ===== */
    .vs-quick-stat-card {
        background: #fff;
        border-radius: 12px;
        border: 1px solid #eceef3;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        height: 100%;
    }

    .vs-quick-stat-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        color: #fff;
        flex-shrink: 0;
    }

    .vs-quick-stat-icon.bg-blue { background: #2947ff; }
    .vs-quick-stat-icon.bg-teal { background: #16a34a; }
    .vs-quick-stat-icon.bg-purple { background: #7b3bf5; }

    .vs-quick-stat-label {
        font-size: 11px;
        color: #8a8d99;
        text-transform: uppercase;
        letter-spacing: .02em;
        margin-bottom: 2px;
    }

    .vs-quick-stat-value {
        font-size: 14px;
        font-weight: 700;
        color: #1a2566;
    }

    /* ===== Breadcrumb + page header ===== */
    .vs-breadcrumb {
        font-size: 12px;
        color: #8a8d99;
        margin-bottom: 4px;
    }

    .vs-breadcrumb-link {
        color: #8a8d99;
        text-decoration: none;
    }

    .vs-breadcrumb-link:hover {
        color: #2947ff;
        text-decoration: underline;
    }

    .vs-breadcrumb-sep {
        margin: 0 6px;
        color: #c7c9d4;
    }

    .vs-breadcrumb-current {
        color: #4b4f5f;
        font-weight: 600;
    }

    .vs-profile-page-title {
        font-size: 22px;
        font-weight: 700;
        color: #1a2566;
    }

    /* ===== Side cards (elevator access / quick stats) ===== */
    .vs-side-card {
        background: #fff;
        border-radius: 14px;
        border: 1px solid #eceef3;
        padding: 18px;
        height: 100%;
    }

    /* ===== Elevator access QR placeholder ===== */
    .vs-qr-box {
        width: 130px;
        height: 130px;
        margin: 10px auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 8px;
    }

    .vs-qr-solid {
        background: #1a2566;
        border-radius: 8px;
    }

    .vs-qr-checker {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(3, 1fr);
        gap: 3px;
    }

    .vs-qr-checker span {
        border-radius: 2px;
    }

    .vs-qr-checker span.on {
        background: #1a2566;
    }

    .vs-qr-frame {
        border: 1px solid #e2e5f5;
        border-radius: 12px;
        background: #f7f8fb;
    }

    .vs-qr-expires {
        background: #eef1ff;
        border-radius: 8px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
    }

    .vs-qr-refresh {
        color: #2947ff;
        font-weight: 700;
        cursor: pointer;
        border: none;
        background: none;
        font-size: 12px;
    }

    /* ===== Attendance progress ===== */
    .vs-progress-track {
        width: 100%;
        height: 6px;
        border-radius: 6px;
        background: #eceef3;
        overflow: hidden;
    }

    .vs-progress-fill {
        height: 100%;
        border-radius: 6px;
        background: linear-gradient(90deg, #2947ff, #7b3bf5);
    }

    #_team_profile_view {
        padding-bottom: 24px;
    }
</style>