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
        align-items: stretch;
    }

    .ann-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 300px;
        background: #fff;
        border: 1px solid #eaeef4;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 6px 18px rgba(15, 23, 42, .05);
        transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        cursor: pointer;
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
        align-items: center;
        min-height: 60px;
        padding: 22px 26px;
        overflow: hidden;
        color: #fff;
    }

    .ann-card__banner-icon {
        position: absolute;
        right: 18px;
        top: 50%;
        transform: translateY(-50%) rotate(-10deg);
        font-size: 72px;
        color: rgba(255, 255, 255, .14);
        pointer-events: none;
    }

    .ann-banner-content {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
    }

    .ann-cat {
        flex-shrink: 0;
        padding: 7px 15px;
        border-radius: 999px;
        font-size: 12.5px;
        font-weight: 700;
        letter-spacing: .02em;
        color: #fff;
        background: rgba(255, 255, 255, .18);
        border: 1px solid rgba(255, 255, 255, .3);
        backdrop-filter: blur(4px);
    }

    .ann-card__title {
        margin: 0;
        font-size: 26px;
        font-weight: 500;
        /* letter-spacing: -.02em; */
        line-height: 1.2;
        text-transform: capitalize;
        word-break: break-word;
        min-width: 0;
    }

    /* ---------- Body ---------- */
    .ann-card__body {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        padding: 16px 20px 18px;
    }

    .ann-desc-block {
        display: flex;
        padding-left: 14px;
        border-left: 3px solid var(--ann-accent, #4f46e5);
        height: calc(1.6em * 3);
        margin-bottom: 14px;
    }

    .ann-desc-text {
        font-size: 13.5px;
        line-height: 1.6;
        color: #64748b;
        overflow-wrap: anywhere;
        word-break: break-word;
        width: 100%;
        max-height: calc(1.6em * 3);
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding-right: 6px;
    }

    /* ---------- Meta panel ---------- */
    .ann-meta-panel {
        background: #f8fafc;
        border: 1px solid #eef2f7;
        border-radius: 14px;
        padding: 14px;
        margin-bottom: 14px;
    }

    .ann-meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px 14px;
    }

    .ann-meta--two {
        grid-template-columns: repeat(2, minmax(0, 1fr));
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
        padding-top: 14px;
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

    /* ---------- Detail modal (matches booking details layout) ---------- */
    .ann-detail-profile {
        border: 1px solid #d8dee8;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(15, 23, 42, .06);
        padding: 6px;
        width: 100%;
        background: #fff;
    }

    .ann-detail-profile__title {
        text-align: center;
        padding: 10px 12px 18px;
        color: #2b3991;
        font-weight: 700;
    }

    .ann-detail-profile__body {
        border: 1px solid #d8dee8;
        border-radius: 6px;
        padding: 14px 16px;
    }

    .ann-detail-profile__row {
        display: flex;
        align-items: flex-start;
        gap: 0;
        margin-bottom: 8px;
    }

    .ann-detail-profile__label {
        flex: 0 0 118px;
        color: #94a3b8;
        font-size: 14px;
        white-space: nowrap;
    }

    .ann-detail-profile__sep {
        padding: 0 10px;
        color: #94a3b8;
    }

    .ann-detail-profile__value {
        flex: 1;
        min-width: 0;
        color: #1e293b;
        font-size: 14px;
        word-break: break-word;
        overflow-wrap: anywhere;
    }

    .ann-detail-profile__remark {
        margin-top: 4px;
        padding-top: 4px;
    }

    .ann-detail-profile__remark .ann-detail-profile__value {
        text-transform: none;
    }
</style>
