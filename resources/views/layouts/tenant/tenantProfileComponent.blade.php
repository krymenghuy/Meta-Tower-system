<div id="_main_tenant_profile_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_tp_loading" class="tp-loading">
        <i class="fa fa-spinner"></i>
        <span vslang="labels.Loading">Loading...</span>
    </div>

    <div id="_tp_profile_content" class="tp-profile" style="display:none;">
        <section class="tp-hero">
            <div class="tp-hero-inner">
                <div class="tp-hero-main">
                    <div class="tp-avatar-wrap">
                        <img src="{{ asset('assets/images/default/placeholder.svg') }}"
                            class="tp-avatar"
                            id="_tp_profile_avatar"
                            alt="Profile">
                        <button type="button" class="tp-avatar-camera" id="_tp_avatar_camera" title="Upload photo">
                            <i class="fa fa-camera"></i>
                        </button>
                        <input type="file" id="_tp_photo_input" accept="image/*" style="display:none;">
                    </div>
                    <div class="tp-hero-info">
                        <div class="tp-hero-name-row">
                            <h2 class="tp-hero-name" id="_tp_hero_name">_</h2>
                            <span class="tp-status-badge" id="_tp_status_badge">_</span>
                        </div>
                        <div class="tp-hero-pills">
                            <span class="tp-pill">
                                <i class="fa fa-phone"></i>
                                <span id="_tp_pill_phone">_</span>
                            </span>
                            <span class="tp-pill">
                                <i class="fa fa-envelope"></i>
                                <span id="_tp_pill_email">_</span>
                            </span>
                            <span class="tp-pill">
                                <i class="fa fa-location-dot"></i>
                                <span id="_tp_pill_address">_</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="tp-hero-stats">
                    <div class="tp-stat-card">
                        <i class="fa fa-id-card"></i>
                        <div class="tp-stat-label" vslang="labels.Tenant ID">Tenant ID</div>
                        <div class="tp-stat-value" id="_tp_stat_code">_</div>
                    </div>
                    <div class="tp-stat-card">
                        <i class="fa fa-building"></i>
                        <div class="tp-stat-label" vslang="labels.Unit">Unit</div>
                        <div class="tp-stat-value" id="_tp_stat_unit">_</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="tp-personal">
            <div class="tp-personal-header">
                <h5 class="tp-personal-title">
                    <i class="fa fa-user"></i>
                    <span vslang="titles.Personal Information">Personal Information</span>
                </h5>
                <p class="tp-personal-subtitle" vslang="labels.Basic tenant details for this account">
                    Basic tenant details for this account
                </p>
            </div>
            <div class="row g-3">
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-user"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Full Name">Full Name</small>
                            <div class="tp-field-value text-capitalize" id="_tp_field_name">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-venus-mars"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Gender">Gender</small>
                            <div class="tp-field-value" id="_tp_field_gender">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-briefcase"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Legal Name">Legal Name</small>
                            <div class="tp-field-value" id="_tp_field_legal_name">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-calendar"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Date of Birth">Date of Birth</small>
                            <div class="tp-field-value" id="_tp_field_dob">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-id-card"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.National ID">National ID</small>
                            <div class="tp-field-value" id="_tp_field_national_id">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-envelope"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Email">Email</small>
                            <div class="tp-field-value" id="_tp_field_email">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-passport"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Passport Number">Passport Number</small>
                            <div class="tp-field-value" id="_tp_field_passport">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-users"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Relationship">Relationship</small>
                            <div class="tp-field-value" id="_tp_field_relationship">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-phone"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Phone">Phone</small>
                            <div class="tp-field-value" id="_tp_field_phone">_</div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="tp-field-card">
                        <div class="tp-field-icon"><i class="fa fa-location-dot"></i></div>
                        <div>
                            <small class="tp-field-label" vslang="labels.Address">Address</small>
                            <div class="tp-field-value text-capitalize" id="_tp_field_address">_</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
#_main_tenant_profile_component {
    overflow-y: auto;
    overflow-x: hidden;
}

.tp-profile {
    --tp-primary: #1A1647;
    --tp-primary2: #2E2A72;
    --tp-accent: #F6D673;
    --tp-success: #10B981;
    --tp-warning: #F59E0B;
    --tp-danger: #EF4444;
    --tp-muted: #64748B;
    --tp-border: #E8ECF3;
    --tp-bg: #F7F8FC;
    --tp-text: #0F172A;

    min-height: 100%;
    padding: 18px;
    background:
        radial-gradient(circle at top right, rgba(79,70,229,.08), transparent 28%),
        linear-gradient(180deg, #FAFBFF 0%, var(--tp-bg) 100%);
}.tp-profile * {
    box-sizing: border-box;
}

.tp-hero {
    position: relative;
    overflow: hidden;
    border-radius: 28px;
    padding: 28px 32px;
    margin-bottom: 24px;
    color: #fff;
    background:
        radial-gradient(circle at 85% 10%, rgba(246,214,115,.45), transparent 28%),
        radial-gradient(circle at 10% 100%, rgba(14,165,233,.22), transparent 32%),
        linear-gradient(135deg, var(--tp-primary), var(--tp-primary2));
    box-shadow: 0 22px 55px rgba(26,22,71,.28);
}

.tp-hero:after {
    content: "";
    position: absolute;
    inset: auto -80px -110px auto;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: rgba(255,255,255,.08);
}

.tp-hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
}

.tp-hero-main {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;
    min-width: 0;
}

.tp-avatar-wrap {
    position: relative;
    flex-shrink: 0;
}

.tp-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    border: 4px solid rgba(255,255,255,.25);
    box-shadow: 0 8px 24px rgba(0,0,0,.2);
    background: #e2e8f0;
}

.tp-avatar-camera {
    position: absolute;
    right: 4px;
    bottom: 4px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,.9);
    background: rgba(26,22,71,.85);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 13px;
    transition: background .15s ease, transform .15s ease;
}

.tp-avatar-camera:hover {
    background: var(--tp-primary2);
    transform: scale(1.05);
}

.tp-hero-info {
    min-width: 0;
}

.tp-hero-name-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 14px;
}

.tp-hero-name {
    margin: 0;
    font-size: 28px;
    font-weight: 900;
    line-height: 1.15;
    letter-spacing: -.02em;
    text-transform: capitalize;
}

.tp-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    background: rgba(255,255,255,.14);
    border: 1px solid rgba(255,255,255,.2);
}

.tp-status-badge:before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: currentColor;
}

.tp-status-badge.is-active { color: #6ee7b7; }
.tp-status-badge.is-pending { color: #fcd34d; }
.tp-status-badge.is-inactive { color: #fca5a5; }

.tp-hero-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.tp-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.16);
    font-size: 13px;
    color: rgba(255,255,255,.9);
    backdrop-filter: blur(8px);
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tp-pill i {
    opacity: .8;
    flex-shrink: 0;
}

.tp-hero-stats {
    display: grid;
    grid-template-columns: repeat(2, minmax(130px, 1fr));
    gap: 12px;
    flex-shrink: 0;
}

.tp-stat-card {
    padding: 16px 18px;
    border-radius: 18px;
    background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.16);
    backdrop-filter: blur(10px);
}

.tp-stat-card i {
    font-size: 14px;
    opacity: .75;
    margin-bottom: 6px;
    display: block;
}

.tp-stat-label {
    font-size: 11px;
    color: rgba(255,255,255,.7);
    text-transform: uppercase;
    letter-spacing: .04em;
    margin-bottom: 4px;
}

.tp-stat-value {
    font-size: 18px;
    font-weight: 900;
    line-height: 1.2;
}

.tp-personal {
    background: #fff;
    border: 1px solid var(--tp-border);
    border-radius: 24px;
    padding: 28px 32px;
    box-shadow: 0 8px 24px rgba(15,23,42,.055);
}

.tp-personal-header {
    margin-bottom: 24px;
}

.tp-personal-title {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 800;
    color: var(--tp-primary);
    display: flex;
    align-items: center;
    gap: 10px;
}

.tp-personal-title i {
    color: var(--tp-primary2);
}

.tp-personal-subtitle {
    margin: 0;
    font-size: 14px;
    color: var(--tp-muted);
}

.tp-field-card {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 20px;
    background: #fff;
    border: 1px solid var(--tp-border);
    border-radius: 16px;
    box-shadow: 0 4px 14px rgba(15,23,42,.04);
    height: 100%;
    transition: box-shadow .15s ease, border-color .15s ease;
}

.tp-field-card:hover {
    border-color: rgba(46,42,114,.18);
    box-shadow: 0 8px 22px rgba(15,23,42,.08);
}

.tp-field-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(26,22,71,.08);
    color: var(--tp-primary2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
}

.tp-field-label {
    display: block;
    font-size: 12px;
    color: var(--tp-muted);
    margin-bottom: 4px;
}

.tp-field-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--tp-primary);
    word-break: break-word;
}

.tp-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 320px;
    color: var(--tp-muted);
    font-size: 15px;
    gap: 10px;
}

.tp-loading i {
    animation: tp-spin 1s linear infinite;
}

@keyframes tp-spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 991px) {
    .tp-hero-inner {
        flex-direction: column;
        align-items: stretch;
    }

    .tp-hero-stats {
        width: 100%;
    }

    .tp-hero-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .tp-hero-name-row,
    .tp-hero-pills {
        justify-content: center;
    }
}

@media (max-width: 575px) {
    .tp-profile {
        padding: 12px;
    }

    .tp-hero {
        border-radius: 22px;
        padding: 20px;
    }

    .tp-hero-name {
        font-size: 22px;
    }

    .tp-hero-stats {
        grid-template-columns: 1fr;
    }

    .tp-personal {
        padding: 20px 16px;
        border-radius: 20px;
    }
}
</style>
