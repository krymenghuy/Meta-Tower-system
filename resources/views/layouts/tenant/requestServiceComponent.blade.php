<div id="_main_service_request_component" class="p-3 mobile-padding" style="display:none;">
     <div id="_divFilter_service_request" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_service_request" placeholder="Search by request no. or tenant">
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_category_id" class="filter-field data-input form-control" data-field="category_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_status" class="filter-field data-input form-control" data-field="status_id" placeholder=" "></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnServiceRequest">
                    <i class="me-2 fa-brands fa-wpforms"></i>
                    <span vslang="buttons.Request Service"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="sr-list-wrap mt-3"></div>
</div>

<style>
.sr-list-wrap {
    --sr-page-bg: #f4f7f9;
    --sr-navy: #0c2d5c;
    --sr-blue: #2b6cb0;
    --sr-muted: #8b95a5;
    --sr-border: #e2e8f0;
}

.sr-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.sr-list__rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sr-card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 6px rgba(15, 23, 42, 0.06);
    overflow: hidden;
    min-height: auto;
}

.sr-card__accent {
    width: 4px;
    flex-shrink: 0;
    background: #cbd5e1;
}

.sr-card--pending .sr-card__accent {
    background: #f59e0b;
}

.sr-card--accepted .sr-card__accent {
    background: #3b82f6;
}

.sr-card--completed .sr-card__accent {
    background: #22c55e;
}

.sr-card--rejected .sr-card__accent {
    background: #ef4444;
}

.sr-card--expired .sr-card__accent {
    background: #94a3b8;
}

.sr-card--cancelled .sr-card__accent {
    background: #94a3b8;
}

.sr-card__body {
    flex: 1;
    display: flex;
    min-width: 0;
}

.sr-card__main {
    flex: 1;
    padding: 12px 16px;
    min-width: 0;
}

.sr-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding-bottom: 10px;
}

.sr-card__divider {
    height: 1px;
    background: var(--sr-border);
    margin-bottom: 10px;
}

.sr-card__title {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--sr-navy);
    line-height: 1.25;
    text-transform: capitalize;
}

.sr-card__subtitle {
    margin: 2px 0 0;
    font-size: 11px;
    font-weight: 500;
    color: var(--sr-blue);
    line-height: 1.25;
    text-transform: capitalize;
}

.sr-card__code {
    flex-shrink: 0;
    padding: 3px 10px;
    border-radius: 999px;
    background: #f1f5f9;
    color: #64748b;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
}

.sr-card__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 0;
    width: fit-content;
    max-width: 100%;
}

.sr-card__meta-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 0 0 auto;
    min-width: 0;
    padding: 0 14px;
}

.sr-card__meta-item:not(:first-child) {
    border-left: 1px solid var(--sr-border);
}

.sr-card__meta-item:first-child {
    padding-left: 0;
}

.sr-card__meta-item:last-child {
    padding-right: 0;
}

.sr-card__meta-icon-wrap {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    background: #f1f5f9;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.sr-card__meta-icon {
    color: var(--sr-muted);
    font-size: 11px;
}

.sr-card__meta-content {
    min-width: 0;
}

.sr-card__meta-label {
    display: block;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sr-muted);
    margin-bottom: 2px;
}

.sr-card__meta-value {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--sr-navy);
    line-height: 1.3;
    word-break: break-word;
}

.sr-card__meta-item:nth-child(1) .sr-card__meta-value,
.sr-card__meta-item:nth-child(2) .sr-card__meta-value {
    white-space: nowrap;
}

.sr-card__stub {
    position: relative;
    flex-shrink: 0;
    width: 148px;
    padding: 12px 14px 10px;
    border-left: 1px solid var(--sr-border);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 8px;
}

.sr-card__stub-top {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 4px;
}

.sr-card__fee-wrap {
    flex: 1;
    text-align: right;
}

.sr-card__fee-label {
    display: block;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--sr-muted);
    margin-bottom: 3px;
}

.sr-card__fee-value {
    display: block;
    line-height: 1.2;
    white-space: nowrap;
}

.sr-card__fee-amount {
    font-size: 20px;
    font-weight: 800;
    color: var(--sr-navy);
}

.sr-card__fee-unit {
    font-size: 12px;
    font-weight: 500;
    color: var(--sr-muted);
    margin-left: 2px;
    font-family: inherit;
    text-transform: lowercase;
}

.sr-card__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 4px;
    font-size: 12px;
    color: #94a3b8;
    text-decoration: none;
    flex-shrink: 0;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.sr-card__menu-btn:hover {
    background: #f1f5f9;
    color: #64748b;
}

.sr-card__status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.2;
    text-transform: capitalize;
}

.sr-card__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.sr-card__status-badge--pending {
    background: #fef9c3;
    color: #d97706;
}

.sr-card__status-badge--pending .sr-card__status-dot {
    background: #f59e0b;
}

.sr-card__status-badge--accepted {
    background: #dbeafe;
    color: #2563eb;
}

.sr-card__status-badge--accepted .sr-card__status-dot {
    background: #3b82f6;
}

.sr-card__status-badge--completed {
    background: #dcfce7;
    color: #16a34a;
}

.sr-card__status-badge--completed .sr-card__status-dot {
    background: #22c55e;
}

.sr-card__status-badge--rejected {
    background: #fee2e2;
    color: #dc2626;
}

.sr-card__status-badge--rejected .sr-card__status-dot {
    background: #ef4444;
}

.sr-card__status-badge--expired {
    background: #f1f5f9;
    color: #64748b;
}

.sr-card__status-badge--expired .sr-card__status-dot {
    background: #94a3b8;
}

.sr-card__status-badge--cancelled {
    background: #f1f5f9;
    color: #64748b;
}

.sr-card__status-badge--cancelled .sr-card__status-dot {
    background: #94a3b8;
}

.sr-list-empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f1f5f9;
    color: var(--sr-muted);
    font-size: 22px;
}

.sr-list-wrap .vsa-dropdown.sr-card__dropdown,
.sr-list-wrap .sr-card__dropdown.vsa-dropdown {
    border: 1px solid var(--sr-border);
    border-radius: 8px;
    overflow: hidden;
}

@media (max-width: 991.98px) {
    .sr-card {
        flex-direction: column;
    }

    .sr-card__accent {
        width: 100%;
        height: 4px;
    }

    .sr-card__body {
        flex-direction: column;
    }

    .sr-card__stub {
        width: 100%;
        border-left: none;
        border-top: 1px solid var(--sr-border);
        padding-top: 12px;
    }

    .sr-card__meta {
        flex-direction: column;
        width: 100%;
        gap: 0;
    }

    .sr-card__meta-item {
        width: 100%;
        padding: 12px 0 0;
        border-left: none !important;
        border-top: 1px solid var(--sr-border);
    }

    .sr-card__meta-item:first-child {
        border-top: none;
        padding-top: 0;
    }

    .sr-card__fee-wrap {
        text-align: left;
    }
}
</style>
