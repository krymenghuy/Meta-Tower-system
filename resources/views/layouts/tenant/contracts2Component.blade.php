<div id="_main_contract2_component" class="mobile-padding p-3" style="display: none;">
    <div id="_divFilter_contract2" class="contract2-filter-bar rounded-2 p-2 shadow-sm">
        <div class="row g-2 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                    <input type="text" class="rounded-2 filter-field input-search" id="_search_contract2" placeholder="Search by unit">
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <select id="business_type2_id" class="data-input filter-field form-control" data-field="business_type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <select id="el_contract2_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
        </div>
    </div>
    <div id="_contract2_list" class="contract2-list-wrap mt-3"></div>
</div>

<style>
.contract2-filter-bar {
    background-color: #fff;
    border: 1px solid #e8ecf2;
}

.contract2-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.contract2-list {
    --c2-text: #111827;
    --c2-muted: #6b7280;
    --c2-border: #e5e7eb;
    --c2-surface: #f9fafb;
    --c2-blue: #2563eb;
    --c2-green-bg: #ecfdf3;
    --c2-green-text: #15803d;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contract2-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: #fff;
    border: 1px solid var(--c2-border);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(17, 24, 39, 0.04);
    transition: box-shadow 0.15s ease;
}

.contract2-row:hover {
    box-shadow: 0 4px 12px rgba(17, 24, 39, 0.08);
}

.contract2-row__icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    background: var(--c2-surface);
    border: 1px solid var(--c2-border);
    color: #4b5563;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
}

.contract2-row__main {
    flex: 1;
    min-width: 0;
}

.contract2-row__title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 2px;
}

.contract2-row__title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--c2-text);
    line-height: 1.3;
}

.contract2-row__subtitle {
    font-size: 0.82rem;
    color: var(--c2-muted);
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.contract2-row__price {
    flex-shrink: 0;
    text-align: right;
    padding-right: 4px;
}

.contract2-row__price-value {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--c2-text);
}

.contract2-row__price-value small {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--c2-muted);
}

.contract2-row__menu-wrap {
    position: relative;
    flex-shrink: 0;
}

.contract2-row__menu-btn {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    border: 1px solid #dbeafe;
    background: #eff6ff;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.contract2-row__menu-btn:hover {
    background: #dbeafe;
}

.contract2-status {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    line-height: 1.4;
}

.contract2-status--active {
    background: var(--c2-green-bg);
    color: var(--c2-green-text);
}

.contract2-status--pending {
    background: #fefce8;
    color: #a16207;
}

.contract2-status--expired,
.contract2-status--terminated {
    background: #fef2f2;
    color: #b91c1c;
}

.contract2-list-empty {
    background: #fff;
    border: 1px dashed var(--c2-border);
    border-radius: 12px;
}

.contract2-list-wrap .contract2-row__dropdown.vsa-dropdown,
.contract2-list-wrap .vsa-dropdown.contract2-row__dropdown {
    min-width: 210px;
    padding: 6px;
    border-radius: 12px;
    border: 1px solid var(--c2-border);
    box-shadow: 0 10px 28px rgba(17, 24, 39, 0.12) !important;
    z-index: 2000;
}

.contract2-list-wrap .contract2-row__dropdown .menu-item a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 8px;
    color: var(--c2-text) !important;
    text-decoration: none;
}

.contract2-list-wrap .contract2-row__dropdown .menu-item a:hover {
    background: var(--c2-surface);
}

.contract2-list-wrap .contract2-row__dropdown .menu-item--divider {
    border-top: 1px solid var(--c2-border);
    margin-top: 4px;
    padding-top: 4px;
}

/* Detail modal */
.contract2-detail-modal .modal-content {
    border: none;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(17, 24, 39, 0.16);
}

.contract2-detail-modal .modal-header {
    padding: 10px 14px;
    background: #eef1f5;
    border-bottom: none;
}

.contract2-detail-modal .modal-title {
    display: none;
}

.contract2-detail-modal .modal-header .btn-close {
    opacity: 0.45;
    margin-right: 2px;
}

.contract2-detail-modal .modal-body {
    padding: 0;
    background: #eef1f5;
}

.contract2-detail-modal .modal-footer {
    display: none;
}

.contract2-detail {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 18px;
    padding: 18px;
    min-height: 460px;
    align-items: stretch;
}

.contract2-detail__sidebar,
.contract2-detail__main {
    background: #fff;
    border: 1px solid #e8ebf0;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);
}

.contract2-detail__sidebar {
    padding: 22px 18px 18px;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.contract2-detail__avatar {
    width: 84px;
    height: 84px;
    margin: 0 auto 14px;
    border-radius: 50%;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    font-size: 1.65rem;
}

.contract2-detail__unit {
    font-size: 1.12rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 10px;
    line-height: 1.25;
}

.contract2-detail__status-wrap {
    margin-bottom: 4px;
}

.contract2-detail__divider {
    border-top: 1px solid #eef0f3;
    margin: 16px 0 14px;
}

.contract2-detail__mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 12px;
}

.contract2-detail__mini-box {
    background: #f8f9fb;
    border: 1px solid #eceff3;
    border-radius: 12px;
    padding: 12px 10px;
    text-align: center;
    min-height: 68px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.contract2-detail__mini-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 5px;
    line-height: 1.2;
}

.contract2-detail__mini-value,
.contract2-detail__lease-value {
    display: block;
    font-size: 0.88rem;
    font-weight: 700;
    color: #111827;
    word-break: break-word;
    line-height: 1.25;
}

.contract2-detail__lease-box {
    background: #f8f9fb;
    border: 1px solid #eceff3;
    border-radius: 12px;
    padding: 14px 12px 12px;
    margin-top: auto;
}

.contract2-detail__lease-title {
    font-size: 0.88rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 12px;
    text-align: center;
}

.contract2-detail__lease-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
}

.contract2-detail__lease-col {
    padding: 0 8px;
    text-align: center;
}

.contract2-detail__lease-col + .contract2-detail__lease-col {
    border-left: 1px solid #e5e7eb;
}

.contract2-detail__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
}

.contract2-detail__tabs {
    display: flex;
    gap: 22px;
    padding: 0 22px;
    border-bottom: 1px solid #eef0f3;
    background: #fff;
}

.contract2-detail__tab {
    background: none;
    border: none;
    padding: 16px 0 13px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
}

.contract2-detail__tab:hover {
    color: #374151;
}

.contract2-detail__tab.is-active {
    color: #2563eb;
    border-bottom-color: #2563eb;
}

.contract2-detail__panel {
    padding: 18px 22px 10px;
    flex: 1;
    overflow-y: auto;
}

.contract2-detail__section {
    margin-bottom: 22px;
}

.contract2-detail__section:last-child {
    margin-bottom: 0;
}

.contract2-detail__section-head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    font-size: 0.92rem;
    font-weight: 700;
    color: #111827;
}

.contract2-detail__section-head i {
    color: #2563eb;
    font-size: 0.95rem;
}

.contract2-detail__info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px 22px;
}

.contract2-detail__field-label {
    display: block;
    font-size: 0.78rem;
    font-weight: 500;
    color: #6b7280;
    margin-bottom: 4px;
    line-height: 1.2;
}

.contract2-detail__field-value {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: #111827;
    word-break: break-word;
    line-height: 1.35;
}

.contract2-detail__field-value small {
    font-size: 0.82rem;
    font-weight: 500;
    color: #6b7280;
}

.contract2-detail__panel-foot {
    display: flex;
    justify-content: center;
    padding: 8px 0 14px;
    border-top: 1px solid transparent;
}

.contract2-detail__scroll-hint {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #9ca3af;
    box-shadow: 0 2px 8px rgba(17, 24, 39, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
}

.contract2-detail__empty-tab {
    text-align: center;
    padding: 48px 16px;
    color: #6b7280;
}

.contract2-detail__empty-tab i {
    color: #9ca3af;
}

/* Renewal timeline modal */
.contract2-renewal-modal .modal-body {
    padding: 16px 18px 18px;
}

.contract2-renewal {
    background: #fff;
    border: 1px solid var(--c2-border);
    border-radius: 14px;
    padding: 16px;
}

.contract2-renewal__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
}

.contract2-renewal__title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--c2-text);
    margin-bottom: 2px;
}

.contract2-renewal__sub {
    font-size: 0.78rem;
    color: var(--c2-muted);
}

.contract2-renewal__timeline {
    position: relative;
    padding-left: 22px;
}

.contract2-renewal__timeline::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: #e5e7eb;
}

.contract2-renewal__item {
    position: relative;
    padding-bottom: 18px;
}

.contract2-renewal__item:last-child {
    padding-bottom: 0;
}

.contract2-renewal__dot {
    position: absolute;
    left: -22px;
    top: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #d1d5db;
}

.contract2-renewal__item.is-current .contract2-renewal__dot {
    background: var(--c2-blue);
    border-color: var(--c2-blue);
}

.contract2-renewal__item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
}

.contract2-renewal__item-label {
    font-size: 0.84rem;
    font-weight: 700;
    color: var(--c2-text);
}

.contract2-renewal__item-date {
    font-size: 0.74rem;
    color: var(--c2-muted);
    white-space: nowrap;
}

.contract2-renewal__item-box {
    background: var(--c2-surface);
    border: 1px solid var(--c2-border);
    border-radius: 10px;
    padding: 10px 12px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
}

@media (max-width: 991.98px) {
    .contract2-detail {
        grid-template-columns: 1fr;
    }

    .contract2-detail__info-grid,
    .contract2-renewal__item-box {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 575.98px) {
    .contract2-row {
        flex-wrap: wrap;
    }

    .contract2-row__price {
        width: 100%;
        text-align: left;
        padding-left: 56px;
    }

    .contract2-row__subtitle {
        white-space: normal;
    }

    .contract2-detail__info-grid,
    .contract2-renewal__item-box {
        grid-template-columns: 1fr;
    }
}
</style>
