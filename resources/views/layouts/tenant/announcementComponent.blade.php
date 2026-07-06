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
        gap: 24px;
        align-items: stretch;
    }

    .ann-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-top: 4px solid var(--ann-accent, #4f46e5);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
        transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .ann-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04);
        border-color: #cbd5e1;
    }

    .ann-card__banner {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        border-bottom: 1px solid #f1f5f9;
    }

    .ann-card__title {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        line-height: 1.4;
        color: #0f172a;
        word-break: break-word;
    }

    /* ---------- Category Badge ---------- */
    .ann-cat {
        align-self: flex-start;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 3px 10px;
        border-radius: 999px;
        display: inline-block;
    }

    /* Category styles */
    .ann-cat-notice {
        background-color: #fee2e2;
        color: #991b1b;
        border: 1px solid #fca5a5;
    }
    .ann-cat-policy,
    .ann-cat-policy-update {
        background-color: #ffedd5;
        color: #c2410c;
        border: 1px solid #fed7aa;
    }
    .ann-cat-maintenance {
        background-color: #d1fae5;
        color: #065f46;
        border: 1px solid #a7f3d0;
    }
    .ann-cat-event {
        background-color: #f3e8ff;
        color: #6b21a8;
        border: 1px solid #e9d5ff;
    }
    .ann-cat-general {
        background-color: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
    }

    /* ---------- Body ---------- */
    .ann-card__body {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 20px;
    }

    .ann-desc-text {
        font-size: 13.5px;
        line-height: 1.6;
        color: #475569;
        overflow-wrap: anywhere;
        word-break: break-word;
        margin-bottom: 16px;
    }
    .ann-desc-text.collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        margin-bottom: 8px;
    }
    .btn-read-more {
        color: #1a1647;
        font-size: 13.0px;
        font-weight: 700;
        cursor: pointer;
        margin-top: 14px;
        display: inline-block;
        text-decoration: none;
        transition: opacity 0.2s;
    }
    .btn-read-more:hover {
        opacity: 0.8;
        text-decoration: underline;
        color: #1a1647;
    }
    .ann-meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .ann-meta-icon {
        color: #94a3b8;
    }

    /* ---------- Footer ---------- */
    .ann-card__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: auto;
        border-top: 1px dashed #e2e8f0;
        padding-top: 14px;
        font-size: 12px;
        color: #64748b;
    }

    .ann-priority {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
    }

    .ann-card-count {
        color: #94a3b8;
        font-size: 11px;
        font-weight: 500;
    }

    /* ---------- Responsive columns ---------- */
    @media (max-width: 1024px) {
        .ann-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 640px) {
        .ann-grid { grid-template-columns: 1fr; }
    }

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
