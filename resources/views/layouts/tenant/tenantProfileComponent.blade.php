<div id="_main_tenant_profile_component" class="px-3 mobile-padding" style="display:none;">
    <div id="_tenant_profile_content" class="tp-scroll">
        <div class="text-center py-5 text-muted" id="_tenant_profile_loading">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2 mb-0" vslang="titles.Loading">Loading...</p>
        </div>
    </div>
</div>

<style>
    #_main_tenant_profile_component {
        --tp-navy: #0f1b3d;
        --tp-teal: #0f4a45;
        --tp-text: #1a2566;
        --tp-muted: #8b92a5;
        --tp-border: #e8ecf2;
        --tp-bg: #f4f6fa;
    }

    #_main_tenant_profile_component .tp-scroll {
        height: calc(100vh - 110px);
        overflow-y: auto;
        padding: 12px 0 24px;
    }

    /* ===== Hero header ===== */
    #_main_tenant_profile_component .tp-hero {
        position: relative;
        overflow: hidden;
        border-radius: 20px;
        padding: 26px 28px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 28px;
        flex-wrap: wrap;
        color: #fff;
        background: linear-gradient(100deg, #0a1028 0%, #0c2a36 45%, #0a3a34 100%);
        box-shadow: 0 16px 36px rgba(8, 14, 36, .32);
        margin-bottom: 18px;
    }

    #_main_tenant_profile_component .tp-hero:before {
        content: "";
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(255, 255, 255, .11) 1px, transparent 1px);
        background-size: 16px 16px;
        opacity: .4;
        pointer-events: none;
    }

    #_main_tenant_profile_component .tp-hero > * {
        position: relative;
        z-index: 1;
    }

    #_main_tenant_profile_component .tp-hero-left {
        display: flex;
        align-items: center;
        gap: 20px;
        min-width: 0;
        flex: 1 1 420px;
    }

    #_main_tenant_profile_component .tp-avatar-wrap {
        position: relative;
        flex-shrink: 0;
        width: 92px;
        height: 92px;
    }

    #_main_tenant_profile_component .tp-avatar {
        width: 92px;
        height: 92px;
        border-radius: 14px;
        object-fit: cover;
        border: 2.5px solid #fff;
        background: #fff;
        display: block;
    }

    #_main_tenant_profile_component .tp-avatar-cam {
        position: absolute;
        right: -5px;
        bottom: -5px;
        width: 28px;
        height: 28px;
        border-radius: 8px;
        border: none;
        background: #fff;
        color: #2f3648;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0, 0, 0, .22);
        cursor: pointer;
        padding: 0;
    }

    #_main_tenant_profile_component .tp-avatar-cam i {
        font-size: 12px;
    }

    #_main_tenant_profile_component .tp-hero-name-row {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 14px;
    }

    #_main_tenant_profile_component .tp-hero-name {
        margin: 0;
        font-size: 30px;
        font-weight: 700;
        line-height: 1.1;
        color: #fff;
        letter-spacing: -.02em;
    }

    #_main_tenant_profile_component .tp-status {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .05em;
        text-transform: uppercase;
        background: rgba(6, 78, 59, .55);
        border: 1px solid rgba(52, 211, 153, .35);
        color: #34d399;
    }

    #_main_tenant_profile_component .tp-status.is-pending {
        background: rgba(120, 53, 15, .5);
        border-color: rgba(251, 191, 36, .4);
        color: #fbbf24;
    }

    #_main_tenant_profile_component .tp-status.is-inactive {
        background: rgba(127, 29, 29, .5);
        border-color: rgba(248, 113, 113, .4);
        color: #f87171;
    }

    #_main_tenant_profile_component .tp-meta {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    #_main_tenant_profile_component .tp-meta-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 22px;
    }

    #_main_tenant_profile_component .tp-meta-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: rgba(255, 255, 255, .82);
        line-height: 1.2;
    }

    #_main_tenant_profile_component .tp-meta-item i {
        width: 15px;
        text-align: center;
        opacity: .7;
        font-size: 13px;
        color: rgba(255, 255, 255, .75);
    }

    #_main_tenant_profile_component .tp-hero-stats {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        flex: 0 0 auto;
        margin-left: auto;
    }

    #_main_tenant_profile_component .tp-stat-card {
        min-width: 132px;
        padding: 18px 20px;
        border-radius: 14px;
        background: rgba(255, 255, 255, .07);
        border: 1px solid rgba(255, 255, 255, .1);
        backdrop-filter: blur(8px);
        text-align: left;
    }

    #_main_tenant_profile_component .tp-stat-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, .5);
        margin-bottom: 8px;
    }

    #_main_tenant_profile_component .tp-stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        line-height: 1.2;
        word-break: break-word;
    }

    /* ===== Personal info card ===== */
    #_main_tenant_profile_component .tp-info-card {
        background: #fff;
        border: 1px solid var(--tp-border);
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(15, 27, 61, .04);
        overflow: hidden;
    }

    #_main_tenant_profile_component .tp-info-head {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 18px 22px;
        cursor: pointer;
        user-select: none;
        border-bottom: 1px solid transparent;
    }

    #_main_tenant_profile_component .tp-info-card.is-open .tp-info-head {
        border-bottom-color: var(--tp-border);
    }

    #_main_tenant_profile_component .tp-info-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: #eef1f6;
        color: #5b6478;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    #_main_tenant_profile_component .tp-info-icon i {
        font-size: 16px;
    }

    #_main_tenant_profile_component .tp-info-titles {
        flex: 1;
        min-width: 0;
    }

    #_main_tenant_profile_component .tp-info-title {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: var(--tp-text);
    }

    #_main_tenant_profile_component .tp-info-sub {
        margin: 2px 0 0;
        font-size: 13px;
        color: var(--tp-muted);
    }

    #_main_tenant_profile_component .tp-info-chevron {
        color: #a0a7b8;
        transition: transform .2s ease;
        font-size: 14px;
    }

    #_main_tenant_profile_component .tp-info-card.is-open .tp-info-chevron {
        transform: rotate(180deg);
    }

    #_main_tenant_profile_component .tp-info-body {
        display: none;
        padding: 8px 22px 26px;
    }

    #_main_tenant_profile_component .tp-info-card.is-open .tp-info-body {
        display: block;
    }

    #_main_tenant_profile_component .tp-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px 28px;
    }

    #_main_tenant_profile_component .tp-field-label {
        display: block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: var(--tp-muted);
        margin-bottom: 8px;
    }

    #_main_tenant_profile_component .tp-field-value {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        font-size: 15px;
        font-weight: 600;
        color: #24304d;
        line-height: 1.35;
        word-break: break-word;
    }

    #_main_tenant_profile_component .tp-field-value i {
        margin-top: 2px;
        color: #9aa3b5;
        font-size: 14px;
        width: 16px;
        text-align: center;
        flex-shrink: 0;
    }

    #_main_tenant_profile_component .tp-field-value--empty {
        color: #9aa3b5;
        font-weight: 500;
    }

    @media (max-width: 991px) {
        #_main_tenant_profile_component .tp-hero {
            padding: 22px;
        }

        #_main_tenant_profile_component .tp-hero-stats {
            width: 100%;
        }

        #_main_tenant_profile_component .tp-stat-card {
            flex: 1;
        }

        #_main_tenant_profile_component .tp-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @media (max-width: 575px) {
        #_main_tenant_profile_component .tp-hero-left {
            flex-direction: column;
            align-items: flex-start;
        }

        #_main_tenant_profile_component .tp-hero-name {
            font-size: 22px;
        }

        #_main_tenant_profile_component .tp-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
