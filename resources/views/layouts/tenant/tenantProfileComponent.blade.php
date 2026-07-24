<div id="_main_tenant_profile_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_tenant_profile_content" class="tp-scroll py-3">
        <div class="text-center py-5 text-muted" id="_tenant_profile_loading">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0" vslang="titles.Loading">Loading...</p>
        </div>
    </div>
</div>

<style>
    /* Only styles Bootstrap cannot cover (theme + sizes) */
    #_main_tenant_profile_component {
        --tp-ink: #1f1c3d;
        --tp-cream: #f2e8d5;
        --tp-gold: #c4a574;
        --tp-gold-soft: #7c6a40;
    }

    #_main_tenant_profile_component .tp-scroll {
        height: calc(100vh - 110px);
        overflow-y: auto;
    }

    #_main_tenant_profile_component .tp-card {
        background: var(--tp-ink);
    }

    #_main_tenant_profile_component .tp-card.is-open {
        background: #fff;
    }

    #_main_tenant_profile_component .tp-hero {
        --tp-hero-primary: #1f1c3d;
        --tp-hero-primary2: #473e63;
        background:
            radial-gradient(circle at 85% 10%, rgba(246, 214, 115, .45), transparent 28%),
            radial-gradient(circle at 10% 100%, rgba(14, 165, 233, .22), transparent 32%),
            linear-gradient(135deg, var(--tp-hero-primary), var(--tp-hero-primary2));
        box-shadow: 0 22px 55px rgba(26, 22, 71, .28);
    }

    #_main_tenant_profile_component .tp-hero:before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, .1) 1px, transparent 1px);
        background-size: 14px 14px;
        opacity: .2;
        pointer-events: none;
    }

    #_main_tenant_profile_component .tp-hero:after {
        content: "";
        position: absolute;
        inset: auto -80px -110px auto;
        width: 280px;
        height: 280px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .08);
        z-index: 0;
        pointer-events: none;
    }

    #_main_tenant_profile_component .tp-hero > * {
        position: relative;
        z-index: 1;
    }

    #_main_tenant_profile_component .tp-serif {
        font-family: Georgia, "Times New Roman", serif;
    }

    #_main_tenant_profile_component .tp-gold {
        color: var(--tp-gold) !important;
    }

    #_main_tenant_profile_component .tp-avatar-wrap,
    #_main_tenant_profile_component .tp-avatar {
        width: 88px;
        height: 88px;
    }

    #_main_tenant_profile_component .tp-avatar {
        background: var(--tp-cream);
        display: block;
    }

    #_main_tenant_profile_component .tp-avatar--initials {
        color: var(--tp-gold-soft);
        font-size: 1.75rem;
    }

    #_main_tenant_profile_component .tp-avatar-cam {
        width: 28px;
        height: 28px;
        right: -4px;
        bottom: -4px;
        border: 2px solid var(--tp-ink);
        font-size: 11px;
    }

    #_main_tenant_profile_component .tp-toggle-btn {
        width: 40px;
        height: 40px;
        --bs-btn-border-color: rgba(255, 255, 255, .12);
        --bs-btn-bg: rgba(255, 255, 255, .06);
        --bs-btn-hover-bg: rgba(255, 255, 255, .12);
        --bs-btn-hover-border-color: rgba(255, 255, 255, .2);
        --bs-btn-color: #fff;
        --bs-btn-hover-color: #fff;
    }

    #_main_tenant_profile_component .tp-toggle-btn i {
        transition: transform .25s ease;
        transform: rotate(180deg);
    }

    #_main_tenant_profile_component .tp-card.is-open .tp-toggle-btn i {
        transform: rotate(0deg);
    }

    #_main_tenant_profile_component .tp-status {
        font-size: 10px;
        letter-spacing: .08em;
        background: rgba(6, 78, 59, .45) !important;
        border: 1px solid rgba(52, 211, 153, .28);
        color: #6ee7b7 !important;
        font-weight: 700;
    }

    #_main_tenant_profile_component .tp-status-dot {
        width: 7px;
        height: 7px;
        background: #34d399;
        box-shadow: 0 0 0 3px rgba(52, 211, 153, .2);
    }

    #_main_tenant_profile_component .tp-status.is-pending {
        background: rgba(120, 53, 15, .45) !important;
        border-color: rgba(251, 191, 36, .35);
        color: #fbbf24 !important;
    }

    #_main_tenant_profile_component .tp-status.is-pending .tp-status-dot {
        background: #fbbf24;
        box-shadow: 0 0 0 3px rgba(251, 191, 36, .2);
    }

    #_main_tenant_profile_component .tp-status.is-inactive {
        background: rgba(127, 29, 29, .45) !important;
        border-color: rgba(248, 113, 113, .35);
        color: #f87171 !important;
    }

    #_main_tenant_profile_component .tp-status.is-inactive .tp-status-dot {
        background: #f87171;
        box-shadow: 0 0 0 3px rgba(248, 113, 113, .2);
    }

    #_main_tenant_profile_component .tp-stat {
        min-width: 118px;
        background: rgba(255, 255, 255, .05);
        border: 1px solid rgba(255, 255, 255, .08);
    }

    #_main_tenant_profile_component .tp-info-icon {
        width: 40px;
        height: 40px;
        background: var(--tp-cream);
        color: var(--tp-gold-soft);
    }
</style>
