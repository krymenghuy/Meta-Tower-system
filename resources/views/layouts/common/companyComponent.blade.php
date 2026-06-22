
<div id="_main_companyComponent" class="m-3" style="display:none;">
    <div class="cpn-wrapper d-flex gap-3 p-3 mt-4">
 
        <!-- ═══ LEFT PANEL ═══ -->
        <div class="cpn-left d-flex flex-column gap-3">
 
            <!-- Account Management -->
            <div class="cpn-card">
                <p class="cpn-section-title">Logo Building</p>
                <div class="d-flex flex-column align-items-center gap-3">
                    <div class="cpn-logo-box" id="_logo_box">
                        <!-- Uploaded Logo -->
                        <img id="com_imgLogo" 
                            class="data-input thumbnail"
                            data-field="logo"
                            alt="Company Logo"
                            style="display: none; width:100%; height:100%; object-fit: cover; border-radius:10px;" />

                        <!-- Placeholder -->
                        <div id="_logo_placeholder" class="logo-placeholder">
                            <i class="fa-regular fa-image cpn-logo-icon"></i>
                            <span class="cpn-logo-text">Company Logo</span>
                        </div>
                    </div>
                    <input type="file" id="_logo_file_input" accept="image/*" style="display:none" />
                    <button id="com_btnChooseLogo" class="cpn-btn-upload w-100">
                        <i class="fa fa-upload me-2"></i> Upload Photo
                    </button>
                    <button id="com_btnDeleteLogo" class="cpn-btn-delete w-100">
                        <i class="fa-regular fa-trash-can me-2"></i> Delete Logo
                    </button>
                </div>
            </div>

            <!-- Password -->
            <div class="d-none cpn-card">
                <p class="cpn-section-title">Website and Facebook </p>
                <div class=" mb-3">
                    <label class="cpn-field-label">Old Password</label>
                    <input type="password" class="cpn-input" id="_old_password" placeholder="••••••••" />
                </div>
                <div class=" mb-3">
                    <label class="cpn-field-label">New Password</label>
                    <input type="password" class="cpn-input" id="_new_password" placeholder="••••••••" />
                </div>
                <button class="cpn-btn-upload w-100" id="_btn_change_password">Change Password</button>
            </div>
 
        </div>
 
        <!-- ═══ RIGHT PANEL ═══ -->
        <div class="cpn-right cpn-card flex-fill" id="_div_cpn_scroll">
 
            <!-- Profile Information -->
            <p class="cpn-section-title">Profile Information</p>
            <div class="row g-4 mb-3">
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <input class="data-input form-control" data-field="name_kh" placeholder=" " autocomplete="off">
                        <label>Association Name (Khmer)</label>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <input class="data-input form-control" data-field="name" placeholder=" " autocomplete="off">
                        <label>Association Name (English)</label>
                    </div>
                </div>
            </div>
            <div class="row g-3 mb-3">
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <input class="data-input form-control" data-field="email" placeholder=" " autocomplete="off">
                        <label>Email</label>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <input class="data-input form-control" data-field="phone_number" placeholder=" " autocomplete="off">
                        <label>Phone Number</label>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <textarea class="data-input form-control" data-field="address_kh" placeholder=" "></textarea>
                        <label>Address (Khmer)</label>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="vs-material-field">
                        <textarea class="data-input form-control" data-field="address" placeholder=" "></textarea>
                        <label>Address (Latin)</label>
                    </div>
                </div>
            </div>
            <!-- Contact Persons -->
            <!-- <div class="d-flex align-items-center justify-content-between mb-3">
                <p class="cpn-section-title mb-0">Contact Persons</p>
                <span class="cpn-count-label" id="_cp_count_label">2 persons</span>
            </div> -->
            <div id="_cp_list">
                <!-- Contact Person 1 (Primary) -->
                <div class="cpn-cp-card mb-2" data-cp="1">
                    <p class="cpn-section-title mb-3">Primary Contact</p>
                    <div class="row g-3 ">
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="first_cp_name" placeholder=" " />
                                <label>Full Name</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="first_cp_phone" placeholder=" " />
                                <label>Phone</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="first_cp_email" placeholder=" " />
                                <label>Email</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="first_cp_position" placeholder=" " />
                                <label>Position</label>
                            </div>
                        </div>
                    </div>
                </div>
 
                <!-- Contact Person 2 -->
                <div class="cpn-cp-card mb-2" data-cp="2">
                    <p class="cpn-section-title mb-3">Secondary Contact</p>
                    <div class="row g-3 ">
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="second_cp_name" placeholder=" " />
                                <label>Full Name</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="second_cp_phone" placeholder=" " />
                                <label>Phone</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="second_cp_email" placeholder=" " />
                                <label>Email</label>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="vs-material-field">
                                <input class="data-input form-control" data-field="second_cp_position" placeholder=" " />
                                <label>Position</label>
                            </div>
                        </div>
                    </div>
                </div>
 
            </div>

 
            <!-- Save -->
            <div class="d-flex align-items-center mt-4">
                <button id="_main_comp_btnSaveProfile" type="button" class="cpn-btn-save">
                    <i class="la la-save fs-5 me-1"></i> Save Changes
                </button>
            </div>
 
        </div>
    </div>
</div>
 
<style>
    /* ── Root theme ── */
    #_main_companyComponent {
        --cpn-bg-page:    #f8f9fd;
        --cpn-bg-card:    #fff;
        --cpn-bg-input:   #f0f5f8;
        --cpn-bg-cp:      #fff;
        --cpn-border:     #e2e5ef;
        --cpn-border-inp: rgba(140, 76, 76, 0.15);
        --cpn-text:       #2b2f3a;
        --cpn-text-muted: #2b2f3a;
        --cpn-text-label: #cbd5e1;
        --cpn-accent:     #3b82f6;
        --cpn-accent-hover: #2563eb;
        --cpn-radius:     12px;
        --cpn-radius-sm:  8px;
        font-family: 'Khmer OS Content', 'Segoe UI', 'Verdana', 'Arial', sans-serif;
    }


 
    /* ── Wrapper ── */
    #_main_companyComponent .cpn-wrapper {
        background: var(--cpn-bg-page);
        border-radius: var(--cpn-radius);
        min-height: 100vh;
        align-items: flex-start;
    }

 
    /* ── Left panel width ── */
    #_main_companyComponent .cpn-left {
        width: 350px;
        flex-shrink: 0;
    }
        /* ── Right panel: fixed height + scroll ── */
    #_main_companyComponent .cpn-right {
        height: 80vh;          /* adjust this value to your preference */
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* Optional: custom scrollbar styling */
    #_main_companyComponent .cpn-right::-webkit-scrollbar {
        width: 5px;
    }
    #_main_companyComponent .cpn-right::-webkit-scrollbar-track {
        background: transparent;
    }
    #_main_companyComponent .cpn-right::-webkit-scrollbar-thumb {
        background: var(--cpn-border);
        border-radius: 10px;
    }
    #_main_companyComponent .cpn-right::-webkit-scrollbar-thumb:hover {
        background: var(--cpn-accent);
    }
 
    /* ── Cards ── */
    #_main_companyComponent .cpn-card {
        background: var(--cpn-bg-card);
        border: 1px solid var(--cpn-border);
        border-radius: var(--cpn-radius);
        padding: 20px;
    }
 
    /* ── Panel label ── */
    #_main_companyComponent .cpn-panel-label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .08em;
        color: var(--cpn-text-muted);
        text-transform: uppercase;
        margin-bottom: 16px;
    }
 
    /* ── Logo box ── */
   /* Logo Box */
#_main_companyComponent .cpn-logo-box {
    width: 200px;
    height: 200px;
    background: #eaeff2;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Placeholder */
#_main_companyComponent .logo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

#_main_companyComponent .cpn-logo-icon {
    font-size: 48px;
    color: #94a3b8;
}

#_main_companyComponent .cpn-logo-text {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

/* Uploaded Image */
#_main_companyComponent #com_imgLogo {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    object-fit: cover;
}
 
    /* ── Buttons ── */
    #_main_companyComponent .cpn-btn-upload {
        background: transparent;
        color: white;
        background-color: rgb(12, 57, 158);
        border: 1px solid var(--cpn-border-inp);
        border-radius: var(--cpn-radius-sm);
        padding: 9px 14px;
        font-size: 13px;
        cursor: pointer;
        transition: background .18s;
        text-align: center;
    }
    #_main_companyComponent .cpn-btn-upload:hover {
        color: white;
        background-color: rgb(8, 35, 98);
    }
    #_main_companyComponent .cpn-btn-delete {
        background: transparent;
        color: #f87171;
        border: 1px solid rgba(248,113,113,0.35);
        border-radius: var(--cpn-radius-sm);
        padding: 9px 14px;
        font-size: 13px;
        cursor: pointer;
        transition: background .18s;
        text-align: center;
    }
    #_main_companyComponent .cpn-btn-delete:hover {
        background: rgba(248,113,113,0.1);
    }
    #_main_companyComponent .cpn-btn-save {
        color: white;
        background-color: rgb(12, 57, 158);
        border: none;
        border-radius: var(--cpn-radius-sm);
        padding: 10px 24px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: background .18s;
    }
    #_main_companyComponent .cpn-btn-save:hover {
        color: white;
        background-color: rgb(8, 35, 98);
    }

    /* ── Contact Person cards ── */
    #_main_companyComponent .cpn-cp-card {
        background: var(--cpn-bg-cp);
        border: 1px solid var(--cpn-border);
        border-radius: var(--cpn-radius-sm);
        padding: 14px 16px;
    }
 
    /* ── Badges ── */
    #_main_companyComponent .cpn-badge-primary {
        font-size: 11px;
        font-weight: 500;
        background: rgba(59,130,246,0.18);
        color: #93c5fd;
        padding: 3px 10px;
        border-radius: 20px;
        border: 1px solid rgba(59,130,246,0.25);
    }
    #_main_companyComponent .cpn-badge-secondary {
        font-size: 11px;
        font-weight: 500;
        background: rgba(255,255,255,0.06);
        color: var(--cpn-text-muted);
        padding: 3px 10px;
        border-radius: 20px;
        border: 1px solid var(--cpn-border);
    }
 
    /* ── data-input font override ── */
    #_main_companyComponent .data-input {
        font-size: 1em !important;
        font-family: 'Khmer OS Content', 'Francois One', 'Bayon', 'Verdana', 'Arial Black', 'Arial', 'Tahoma', sans-serif;
    }
</style>
 






