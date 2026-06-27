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
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 32px 64px rgba(15, 23, 42, 0.14);
}

.contract2-detail-modal .modal-dialog {
    max-width: 960px;
}

.contract2-detail-modal .modal-header {
    display: none !important;
}

.contract2-detail-modal .modal-body {
    position: relative;
    padding: 0;
    background: #eef1f5;
}

.contract2-detail-modal .modal-footer {
    display: none;
}

.contract2-detail {
    position: relative;
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 14px;
    padding: 14px;
    align-items: stretch;
}

.contract2-detail__close-btn {
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 40;
    width: 34px;
    height: 34px;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    background: #fff;
    color: #64748b;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.contract2-detail__close-btn:hover {
    background: #f8fafc;
    color: #0f172a;
    transform: scale(1.04);
}

.contract2-detail__sidebar,
.contract2-detail__main {
    background: #fff;
    border: 1px solid #e4e9f0;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.contract2-detail__sidebar {
    padding: 18px 14px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.contract2-detail__profile {
    text-align: center;
    padding: 4px 0 2px;
}

.contract2-detail__avatar {
    width: 72px;
    height: 72px;
    margin: 0 auto 10px;
    border-radius: 50%;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
    font-size: 1.45rem;
}

.contract2-detail__unit {
    font-size: 1.02rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
    line-height: 1.25;
}

.contract2-detail__status-wrap {
    display: flex;
    justify-content: center;
}

.contract2-detail__status-wrap .contract2-status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 62px;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 4px 11px;
    border-radius: 999px;
    line-height: 1.2;
}

.contract2-detail__status-wrap .contract2-status--active {
    background: #dcfce7;
    color: #15803d;
    border: 1px solid #bbf7d0;
}

.contract2-detail__status-wrap .contract2-status--pending {
    background: #fef9c3;
    color: #a16207;
    border: 1px solid #fde68a;
}

.contract2-detail__status-wrap .contract2-status--expired,
.contract2-detail__status-wrap .contract2-status--terminated {
    background: #fee2e2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

.contract2-detail__mini-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.contract2-detail__mini-box {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    padding: 10px 8px;
    text-align: center;
    min-height: 58px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.contract2-detail__mini-label {
    display: block;
    font-size: 0.68rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 3px;
    line-height: 1.2;
}

.contract2-detail__mini-value,
.contract2-detail__lease-value {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: #0f172a;
    word-break: break-word;
    line-height: 1.25;
}

.contract2-detail__lease-box {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    padding: 12px 10px 10px;
    margin-top: auto;
}

.contract2-detail__lease-title {
    font-size: 0.8rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 9px;
    text-align: center;
}

.contract2-detail__lease-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
}

.contract2-detail__lease-col {
    padding: 0 5px;
    text-align: center;
}

.contract2-detail__lease-col + .contract2-detail__lease-col {
    border-left: 1px solid #dbe2ea;
}

.contract2-detail__main {
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
    padding-right: 36px;
}

.contract2-detail__tabs {
    display: flex;
    gap: 22px;
    padding: 0 18px;
    border-bottom: 1px solid #edf0f4;
    background: #fff;
    border-radius: 16px 16px 0 0;
}

.contract2-detail__tab {
    background: none;
    border: none;
    padding: 14px 0 11px;
    font-size: 0.86rem;
    font-weight: 600;
    color: #64748b;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color 0.15s ease, border-color 0.15s ease;
}

.contract2-detail__tab:hover {
    color: #334155;
}

.contract2-detail__tab.is-active {
    color: #2563eb;
    border-bottom-color: #2563eb;
}

.contract2-detail__panel {
    padding: 14px 16px 16px;
    flex: 1;
}

.contract2-detail__section-card {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    padding: 13px 14px 14px;
    margin-bottom: 10px;
}

.contract2-detail__section-card:last-child {
    margin-bottom: 0;
}

.contract2-detail__section-head {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-bottom: 12px;
    font-size: 0.88rem;
    font-weight: 700;
    color: #0f172a;
}

.contract2-detail__section-icon {
    width: 26px;
    height: 26px;
    border-radius: 8px;
    background: #eff6ff;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.78rem;
    flex-shrink: 0;
}

.contract2-detail__info-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contract2-detail__info-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px 18px;
}

.contract2-detail__info-grid--single {
    margin-top: 0;
}

.contract2-detail__field {
    min-width: 0;
}

.contract2-detail__field-label {
    display: block;
    font-size: 0.72rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 4px;
    line-height: 1.2;
}

.contract2-detail__field-value {
    display: block;
    font-size: 0.86rem;
    font-weight: 700;
    color: #0f172a;
    word-break: break-word;
    line-height: 1.35;
}

.contract2-detail__field-value small {
    font-size: 0.76rem;
    font-weight: 600;
    color: #64748b;
}

.contract2-detail__field-value--empty {
    font-weight: 500;
    color: #94a3b8;
    font-style: italic;
}

.contract2-detail__empty-tab {
    text-align: center;
    padding: 36px 16px;
    color: #64748b;
}

.contract2-detail__empty-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto 10px;
    border-radius: 12px;
    background: #f1f5f9;
    color: #94a3b8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
}

/* Renewal timeline modal */
.contract2-renewal-modal .modal-content {
    border: none;
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 32px 64px rgba(15, 23, 42, 0.14);
}

.contract2-renewal-modal .modal-dialog {
    max-width: 620px;
}

.contract2-renewal-modal .modal-header {
    display: none !important;
}

.contract2-renewal-modal .modal-body {
    padding: 14px;
    background: #eef1f5;
}

.contract2-renewal-modal .modal-footer {
    display: none;
}

.contract2-renewal-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 220px;
}

.contract2-renewal-shell {
    position: relative;
}

.contract2-renewal__close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 20;
    width: 34px;
    height: 34px;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    background: #fff;
    color: #64748b;
    box-shadow: 0 4px 14px rgba(15, 23, 42, 0.1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.82rem;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.15s ease;
}

.contract2-renewal__close-btn:hover {
    background: #f8fafc;
    color: #0f172a;
    transform: scale(1.04);
}

.contract2-renewal {
    background: #fff;
    border: 1px solid #e4e9f0;
    border-radius: 16px;
    padding: 18px 16px 14px;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.contract2-renewal__head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    padding-right: 36px;
}

.contract2-renewal__title {
    font-size: 0.98rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 3px;
    line-height: 1.3;
}

.contract2-renewal__sub {
    font-size: 0.78rem;
    color: #64748b;
}

.contract2-renewal__active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.72rem;
    font-weight: 700;
    color: #15803d;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    border-radius: 999px;
    padding: 5px 11px;
    line-height: 1.2;
    white-space: nowrap;
}

.contract2-renewal__timeline {
    position: relative;
    padding-left: 24px;
}

.contract2-renewal__timeline::before {
    content: "";
    position: absolute;
    left: 6px;
    top: 10px;
    bottom: 28px;
    width: 2px;
    background: #e5e7eb;
}

.contract2-renewal__item {
    position: relative;
    padding-bottom: 16px;
}

.contract2-renewal__item:last-child {
    padding-bottom: 4px;
}

.contract2-renewal__dot {
    position: absolute;
    left: -24px;
    top: 5px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #cbd5e1;
    box-sizing: border-box;
}

.contract2-renewal__item.is-current .contract2-renewal__dot {
    background: #2563eb;
    border-color: #2563eb;
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
    color: #0f172a;
    line-height: 1.25;
}

.contract2-renewal__item:not(.is-current) .contract2-renewal__item-label {
    font-weight: 600;
    color: #334155;
}

.contract2-renewal__item-date {
    font-size: 0.74rem;
    color: #64748b;
    white-space: nowrap;
}

.contract2-renewal__item-box {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    padding: 11px 12px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px 12px;
}

.contract2-renewal__item-field {
    min-width: 0;
}

.contract2-renewal__field-label {
    display: block;
    font-size: 0.68rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 3px;
    line-height: 1.2;
}

.contract2-renewal__field-value {
    display: block;
    font-size: 0.82rem;
    font-weight: 700;
    color: #0f172a;
    word-break: break-word;
    line-height: 1.3;
}

.contract2-renewal__foot {
    display: flex;
    justify-content: center;
    padding-top: 10px;
}

.contract2-renewal__scroll-hint {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    pointer-events: none;
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
