<div id="_main_announcement_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_announcement" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_announcement" data-field="search_value" placeholder="{{ \Vsd\Locales\Localization::trans('Search announcement', 'titles') }}">
            </div>

            <div class="ms-lg-auto text-md-end col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_category" class="filter-field data-input" data-field="category" placeholder=""></select>
            </div>

            {{-- <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_priority" class="filter-field data-input" data-field="priority" placeholder=""></select>
            </div> --}}

            <div class="text-md-end col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_sort" class="filter-field data-input" data-field="sort" placeholder=""></select>
            </div>
        </div>
    </div>
    <div id="_announcement_list" class="mt-3 rounded-2"></div>
</div>


<style>
    .announcement-desc i, .announcement-desc em {
        font-style: italic !important;
    }

    .ann-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px;
        align-items: start;
    }

    .ann-card {
        display: flex;
        flex-direction: column;
        background: #fff;
        border: 1px solid #eaeef4;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(15, 23, 42, .05);
        transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    }

    .ann-card:hover {
        transform: translateY(-4px);
        border-color: #dfe5ef;
        box-shadow: 0 20px 40px rgba(15, 23, 42, .13);
    }

    /* ---------- Banner ---------- */
    .ann-card__banner {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        min-height: 150px;
        padding: 18px 20px 20px;
        overflow: hidden;
        color: #fff;
    }

    .ann-card__banner-icon {
        position: absolute;
        right: 6px;
        bottom: -18px;
        font-size: 120px;
        color: rgba(255, 255, 255, .14);
        transform: rotate(-10deg);
        pointer-events: none;
    }

    .ann-badge {
        position: absolute;
        z-index: 2;
        top: 16px;
        left: 20px;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 6px 13px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 700;
        background: rgba(255, 255, 255, .95);
        box-shadow: 0 2px 8px rgba(15, 23, 42, .14);
    }

    .ann-badge:before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
    }

    .ann-badge--active { color: #10b981; }
    .ann-badge--emergency { color: #ef4444; }
    .ann-badge--scheduled { color: #64748b; }
    .ann-badge--draft { color: #94a3b8; }
    .ann-badge--expired { color: #ef4444; }

    .ann-cat {
        position: absolute;
        z-index: 2;
        top: 16px;
        right: 20px;
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .02em;
        color: #fff;
        background: rgba(255, 255, 255, .18);
        border: 1px solid rgba(255, 255, 255, .3);
        backdrop-filter: blur(4px);
    }

    .ann-banner-content {
        position: relative;
        z-index: 2;
        margin-top: 34px;
    }

    .ann-card__title {
        margin: 0 0 10px;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -.02em;
        line-height: 1.15;
        text-transform: capitalize;
        word-break: break-word;
    }

    .ann-ref {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
    }

    .ann-ref-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, .7);
    }

    .ann-card__id {
        font-size: 12px;
        font-weight: 700;
        color: #fff;
        background: rgba(255, 255, 255, .2);
        border: 1px solid rgba(255, 255, 255, .28);
        padding: 3px 10px;
        border-radius: 7px;
        white-space: nowrap;
    }

    /* ---------- Body ---------- */
    .ann-card__body {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 18px 20px 20px;
    }

    .ann-desc-block {
        padding-left: 14px;
        border-left: 3px solid var(--ann-accent, #4f46e5);
        margin-bottom: 18px;
    }

    .ann-desc-text {
        font-size: 13.5px;
        line-height: 1.6;
        color: #64748b;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    /* ---------- Meta panel ---------- */
    .ann-meta-panel {
        background: #f8fafc;
        border: 1px solid #eef2f7;
        border-radius: 14px;
        padding: 16px;
        margin-bottom: 18px;
    }

    .ann-meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 14px;
    }

    .ann-meta__item {
        display: flex;
        align-items: center;
        gap: 11px;
        min-width: 0;
    }

    .ann-meta__icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        background: var(--ann-soft, #eef0fe);
        color: var(--ann-accent, #4f46e5);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        flex-shrink: 0;
        box-shadow: 0 1px 3px rgba(15, 23, 42, .06);
    }

    .ann-meta__text {
        min-width: 0;
    }

    .ann-meta__label {
        display: block;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .06em;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 2px;
    }

    .ann-meta__value {
        font-size: 13.5px;
        font-weight: 700;
        color: #1e293b;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* ---------- Footer ---------- */
    .ann-card__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: auto;
    }

    .ann-priority {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 13px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
    }

    .ann-card-count {
        color: #64748b;
        font-size: 12px;
        font-style: italic;
        font-weight: 600;
        letter-spacing: .02em;
        white-space: nowrap;
    }

    /* ---------- Responsive columns ---------- */
    @media (max-width: 1024px) {
        .ann-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 640px) {
        .ann-grid { grid-template-columns: 1fr; }
        .ann-meta { grid-template-columns: 1fr; }
    }
</style>
