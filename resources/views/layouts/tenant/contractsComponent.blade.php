<div id="_main_contract_component" class="mobile-padding p-3" style="display: none;">
    <div id="_divFilter_contract" class="contract-filter-bar rounded-2 p-2 shadow-sm d-none">
        <div class="row g-2 align-items-center">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                    <input type="text" class="rounded-2 filter-field input-search" id="_search_contract" placeholder="Search by unit">
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <select id="business_type_id" class="data-input filter-field form-control" data-field="business_type_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="el_contract_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>
        </div>
    </div>
    <div id="_contract_list" class="contract2-list-wrap"></div>
</div>

<style>
.contract-filter-bar {
    background-color: #fff;
    border: 1px solid #e8ecf2;
}

.contract2-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.contract-card-grid {
    --c2-text: #111827;
    --c2-muted: #6b7280;
    --c2-border: #e5e7eb;
    --c2-surface: #f9fafb;
    --c2-blue: #2563eb;
    --c2-green-bg: #ecfdf3;
    --c2-green-text: #15803d;
}

.contract-card-grid > [class*="col-"] {
    align-self: flex-start;
}

.contract-card {
    background: #fff;
    border: 1px solid var(--c2-border);
    border-radius: 14px;
    box-shadow: 0 2px 8px rgba(17, 24, 39, 0.06);
    overflow: hidden;
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.35s ease;
}

.contract-card.is-collapsed {
    box-shadow: 0 1px 4px rgba(17, 24, 39, 0.04);
}

.contract-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px 12px;
    border-bottom: 1px solid #f1f5f9;
    transition: border-color 0.35s ease, padding-bottom 0.35s ease;
}

.contract-card.is-collapsed .contract-card__header {
    border-bottom-color: transparent;
    padding-bottom: 14px;
}

.contract-card__header-left {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    flex: 1;
}

.contract-card__icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: var(--c2-surface);
    border: 1px solid var(--c2-border);
    color: #475569;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 0.95rem;
}

.contract-card__header-text {
    min-width: 0;
}

.contract-card__title-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 2px;
}

.contract-card__title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--c2-text);
    line-height: 1.25;
}

.contract-card__subtitle {
    font-size: 0.8rem;
    color: var(--c2-muted);
    line-height: 1.35;
}

.contract-card__header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}

.contract-card__toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    cursor: pointer;
    user-select: none;
}

.contract-card__toggle-label {
    font-size: 0.68rem;
    color: #94a3b8;
    white-space: nowrap;
}

.contract-card__toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}

.contract-card__toggle-track {
    width: 36px;
    height: 20px;
    border-radius: 999px;
    background: #cbd5e1;
    position: relative;
    transition: background 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
}

.contract-card__toggle-track::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.contract-card__toggle-input:checked + .contract-card__toggle-track {
    background: #22c55e;
}

.contract-card__toggle-input:checked + .contract-card__toggle-track::after {
    transform: translateX(16px);
}

.contract-card__body {
    display: grid;
    grid-template-rows: 1fr;
    padding: 14px 16px;
    transition:
        grid-template-rows 0.45s cubic-bezier(0.4, 0, 0.2, 1),
        padding 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.contract-card.is-collapsed .contract-card__body {
    grid-template-rows: 0fr;
    padding-top: 0;
    padding-bottom: 0;
}

.contract-card__body-grid {
    margin-left: 0;
    margin-right: 0;
    overflow: hidden;
    min-height: 0;
    opacity: 1;
    transform: translateY(0);
    transition:
        opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.contract-card.is-collapsed .contract-card__body-grid {
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
    .contract-card,
    .contract-card__header,
    .contract-card__body,
    .contract-card__body-grid,
    .contract-card__toggle-track,
    .contract-card__toggle-track::after {
        transition: none !important;
    }

    .contract-card.is-collapsed .contract-card__body-grid {
        transform: none;
    }
}

.contract-card__col-left {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    padding: 12px;
}

.contract-card__col-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 100%;
}

.contract-card__panel--contacts {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.contract-card__detail-wrap {
    /* margin-top: auto; */
    padding: 20px 12px 10px 12px;
}

.contract-card__detail-wrap .contract-card__action--detail {
    width: 100%;
}

.contract-card__panel {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 12px;
    padding: 12px;
}

.contract-card__photo {
    position: relative;
    height: 136px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 12px;
}

.contract-card__photo-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.contract-card__photo-fallback {
    display: none;
    position: absolute;
    inset: 0;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.95);
    font-size: 1.5rem;
}

.contract-card__photo.is-fallback .contract-card__photo-img {
    display: none;
}

.contract-card__photo.is-fallback .contract-card__photo-fallback {
    display: flex;
}

.contract-card__photo-label {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 20px 10px 8px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #fffbeb;
    text-align: center;
    background: linear-gradient(180deg, transparent 0%, rgba(15, 23, 42, 0.65) 100%);
    z-index: 1;
    pointer-events: none;
}

.contract-card__address {
    margin-bottom: 10px;
}

.contract-card__address-head {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--c2-text);
    margin-bottom: 4px;
}

.contract-card__address-head i {
    color: #64748b;
    font-size: 0.72rem;
}

.contract-card__address p {
    margin: 0;
    font-size: 0.72rem;
    color: var(--c2-muted);
    line-height: 1.45;
}

.contract-card__floorplan {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 8px;
    padding: 8px;
    margin-bottom: 10px;
    overflow: hidden;
}

.contract-card__floorplan-img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 150px;
    object-fit: contain;
    object-position: center;
    border-radius: 4px;
}

.contract-card__sqft {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e8edf3;
}

.contract-card__sqft-label {
    display: block;
    font-size: 0.68rem;
    color: var(--c2-muted);
    margin-bottom: 3px;
}

.contract-card__sqft-value {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--c2-text);
}

.contract-card__section-title {
    font-size: 1rem;
    font-weight: 700;
    color: var(--c2-text);
    margin-bottom: 8px;
}

.contract-card__panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 10px;
}

.contract-card__panel-head .contract-card__section-title {
    margin-bottom: 0;
}

.contract-card__panel-head .contract2-status {
    flex-shrink: 0;
}

.contract-card__duration {
    font-size: 0.72rem;
    color: var(--c2-muted);
    margin-bottom: 8px;
    line-height: 1.4;
}

.contract-card__duration strong {
    color: var(--c2-text);
    font-weight: 600;
}

.contract-card__renewal-date {
    font-size: 0.72rem;
    color: #92400e;
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 8px;
    padding: 8px 10px;
    line-height: 1.35;
}

.contract-card__renewal-date strong {
    color: #78350f;
}

.contract-card__finance-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 140px;
    gap: 12px;
    align-items: start;
}

.contract-card__price-big {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--c2-text);
    margin-bottom: 8px;
    line-height: 1.2;
}

.contract-card__price-big small {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--c2-muted);
}

.contract-card__finance-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.contract-card__finance-list li {
    font-size: 0.7rem;
    color: var(--c2-muted);
    margin-bottom: 4px;
    line-height: 1.4;
}

.contract-card__finance-list strong {
    color: var(--c2-text);
    font-weight: 600;
}

.contract-card__chart {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 8px;
    padding: 6px 8px 4px;
}

.contract-card__chart-title {
    font-size: 0.58rem;
    font-weight: 600;
    color: var(--c2-muted);
    margin-bottom: 4px;
    text-align: center;
}

.contract-card__chart-bars {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 4px;
    height: 60px;
}

.contract-card__chart-bar-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    justify-content: flex-end;
}

.contract-card__chart-bar {
    width: 100%;
    max-width: 14px;
    background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
    border-radius: 3px 3px 0 0;
    min-height: 4px;
}

.contract-card__chart-bar-wrap span {
    font-size: 0.58rem;
    color: #94a3b8;
    margin-top: 3px;
}

.contract-card__contact {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 8px 10px;
}

.contract-card__contact-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #dbeafe;
    color: #2563eb;
    font-size: 0.82rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.contract-card__contact-info {
    flex: 1;
    min-width: 0;
}

.contract-card__contact-info strong {
    display: block;
    font-size: 0.78rem;
    color: var(--c2-text);
    line-height: 1.25;
}

.contract-card__contact-info span {
    display: block;
    font-size: 0.68rem;
    color: var(--c2-muted);
}

.contract-card__contact-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid #dbeafe;
    background: #eff6ff;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    flex-shrink: 0;
}

.contract-card__footer {
    padding: 12px 16px 14px;
    border-top: 1px solid #f1f5f9;
    background: #fafbfc;
}

.contract-card__actions-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--c2-text);
    margin-bottom: 8px;
}

.contract-card__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.contract-card__action {
    flex: 1;
    min-width: 0;
    padding: 10px 14px;
    border-radius: 999px;
    font-size: 0.74rem;
    font-weight: 600;
    line-height: 1.2;
    cursor: pointer;
    transition: background 0.15s ease, opacity 0.15s ease;
    text-align: center;
}

.contract-card__action--outline {
    background: #fff;
    border: 1px solid #d1d5db;
    color: #374151;
}

.contract-card__action--outline:hover {
    background: #f9fafb;
}

.contract-card__action--detail {
    background: #2563eb;
    border: 1px solid #1d4ed8;
    color: #fff;
}

.contract-card__action--detail:hover {
    background: #1d4ed8;
}

.contract-card__action--renew {
    background: #22c55e;
    border: 1px solid #16a34a;
    color: #fff;
}

.contract-card__action--renew:hover:not(:disabled) {
    background: #16a34a;
}

.contract-card__action--renew:disabled {
    background: #e5e7eb;
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
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
    /* display: grid; */
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 14px;
    /* padding: 14px; */
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

.contract2-detail__renew-panel {
    min-height: 140px;
}

.contract2-renewal--inline {
    background: #f8fafc;
    border: 1px solid #e8edf3;
    border-radius: 14px;
    padding: 13px 14px 12px;
    box-shadow: none;
}

.contract2-renewal--inline .contract2-renewal__head--inline {
    padding-right: 0;
    margin-bottom: 12px;
    align-items: center;
}

.contract2-renewal__head-main {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
    flex: 1;
}

.contract2-renewal__head-icon {
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
    margin-top: 1px;
}

.contract2-renewal--inline .contract2-renewal__title {
    font-size: 0.88rem;
    margin-bottom: 2px;
}

.contract2-renewal--inline .contract2-renewal__sub {
    font-size: 0.74rem;
}

.contract2-renewal--inline .contract2-renewal__active-badge {
    font-size: 0.68rem;
    padding: 4px 10px;
}

.contract2-renewal__timeline-wrap {
    position: relative;
}

.contract2-renewal--inline .contract2-renewal__timeline-wrap {
    max-height: 340px;
    overflow-y: auto;
    padding-right: 2px;
    margin-right: -2px;
}

.contract2-renewal--inline .contract2-renewal__timeline-wrap::-webkit-scrollbar {
    width: 5px;
}

.contract2-renewal--inline .contract2-renewal__timeline-wrap::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
}

.contract2-renewal--inline .contract2-renewal__item-box {
    background: #fff;
    border-color: #e2e8f0;
    padding: 12px 14px;
}

.contract2-renewal--inline .contract2-renewal__item {
    padding-bottom: 14px;
}

.contract2-renewal--inline .contract2-renewal__item:last-child {
    padding-bottom: 2px;
}

.contract2-renewal--inline .contract2-renewal__item-head {
    margin-bottom: 7px;
}

.contract2-renewal--inline .contract2-renewal__field-label {
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.contract2-renewal--inline .contract2-renewal__field-value {
    font-size: 0.84rem;
}

.contract2-renewal-loading--inline {
    min-height: 140px;
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
    padding-left: 26px;
}

.contract2-renewal__timeline::before {
    content: "";
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 10px;
    width: 2px;
    background: linear-gradient(180deg, #dbeafe 0%, #e5e7eb 55%, #e5e7eb 100%);
}

.contract2-renewal__item {
    position: relative;
    padding-bottom: 18px;
}

.contract2-renewal__item:last-child {
    padding-bottom: 2px;
}

.contract2-renewal__dot {
    position: absolute;
    left: -26px;
    top: 4px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #cbd5e1;
    box-sizing: border-box;
    z-index: 1;
}

.contract2-renewal__item.is-current .contract2-renewal__dot {
    background: #2563eb;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
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
    font-size: 0.72rem;
    color: #94a3b8;
    white-space: nowrap;
    font-weight: 500;
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

@media (max-width: 1199.98px) {
    .contract-card__toggle-label {
        display: none;
    }
}

@media (max-width: 991.98px) {
    .contract2-detail {
        grid-template-columns: 1fr;
    }

    .contract2-detail__info-grid,
    .contract2-renewal__item-box {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .contract-card__finance-grid {
        grid-template-columns: 1fr;
    }

    .contract-card__toggle-label {
        display: none;
    }
}

@media (max-width: 575.98px) {
    .contract-card__header {
        flex-wrap: wrap;
    }

    .contract-card__header-right {
        width: 100%;
        justify-content: space-between;
    }

    .contract2-detail__info-grid,
    .contract2-renewal__item-box {
        grid-template-columns: 1fr;
    }
}
.contract-card__finance-card {
    height: 100%;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    background: #fff;
}

.contract-card__finance-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 6px;
}

.contract-card__finance-value {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}
</style>
