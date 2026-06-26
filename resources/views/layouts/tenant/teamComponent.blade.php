<div id="_main_team_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_team_list_container">

        <!-- Filter Bar -->
        <div id="_divFilter_team" class="bg-white shadow-sm p-3 rounded-3 mb-4">
            <div class="row align-items-center g-3">
                <div class="col-12 col-md-5">
                    <div class="position-relative">
                        <input type="text" class="filter-field form-control rounded-2 ps-5" 
                               id="_search_team" placeholder="Search by name, code or phone">
                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    </div>
                </div>
                <div class="col-12 col-md-3">
                    <select id="_el_team_status" class="filter-field form-control" data-field="status_id"></select>
                </div>
                <div class="col-12 col-md-4 text-md-end">
                    <button type="button" class="btn btn-primary px-4" id="_btnAddTeam">
                        <i class="me-2 fa fa-plus"></i>
                        <span vslang="buttons.Create Team">Create Team</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Two Column Layout -->
        <div class="row g-3">

            <!-- LEFT COLUMN: Team Cards (≈35%) -->
            <div class="col-lg-5 col-xl-4">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-header bg-white py-3">
                        <h6 class="mb-0 text-muted">Teams Overview</h6>
                    </div>
                    <div class="card-body p-3" style="height: calc(100vh - 240px); overflow-y: auto;">
                        <div id="_team_card_view"></div>
                    </div>
                </div>
            </div>

            <!-- RIGHT COLUMN: Table / List (≈65%) -->
            <div class="col-lg-7 col-xl-8">
                <div class="card h-100 shadow-sm border-0">
                    <div class="card-header bg-white py-3">
                        <h6 class="mb-0 text-muted">Team Members</h6>
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
<div id="_team_profile_view" class="px-3" style="display:none">
    <div class="d-flex align-items-center bg-white shadow-sm mt-2 p-3 rounded-3">
        <a href="javascript:void(0)" id="_btn_back_team" class="btn btn-outline-secondary btn-sm">
            <i class="fa-solid fa-arrow-left me-2"></i> Back to Teams
        </a>
    </div>
    <div class="mt-3" id="sub_view_profile">
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
</style>
