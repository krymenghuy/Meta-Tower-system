<div id="_main_service_request_component" class="p-3 mobile-padding" style="display:none;">
     <div id="_divFilter_service_request" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="position-relative w-100">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_service_request" placeholder="{{ \Vsd\Locales\Localization::trans('search_request_no_tenant', 'labels') }}">
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_category_id" class="filter-field data-input form-control" data-field="category_id" ></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select id="_service_request_status" class="filter-field data-input form-control" data-field="status_id"  ></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnServiceRequest">
                    <i class="me-2 fa-brands fa-wpforms"></i>
                    <span vslang="buttons.Create New Request"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="sr-list-wrap mt-3"></div>
</div>

<style>
:root {
    --sr-navy: #0f172a;
    --sr-blue: #2563eb;
    --sr-muted: #64748b;
    --sr-border: #e2e8f0;
    --sr-bg-soft: #f8fafc;
}

.sr-filter-card {
    border-color: var(--sr-border) !important;
}

.input-search-wrap .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--sr-muted);
    font-size: 0.875rem;
    pointer-events: none;
}

.sr-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.sr-list__rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Card Container */
.sr-card {
    display: flex;
    background: #ffffff;
    border: 1px solid var(--sr-border);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(15, 23, 42, 0.04);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}



.sr-card__accent {
    width: 5px;
    flex-shrink: 0;
    background: #cbd5e1;
}

/* Status Accents */
.sr-card--pending .sr-card__accent { background: #f59e0b; }
.sr-card--accepted .sr-card__accent { background: #3b82f6; }
.sr-card--completed .sr-card__accent { background: #10b981; }
.sr-card--rejected .sr-card__accent { background: #ef4444; }
.sr-card--expired .sr-card__accent,
.sr-card--cancelled .sr-card__accent { background: #94a3b8; }

.sr-card__body {
    flex: 1;
    display: flex;
    min-width: 0;
}

.sr-card__main {
    flex: 1;
    padding: 16px 20px;
    min-width: 0;
}

.sr-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
}

.sr-card__title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--sr-navy);
    line-height: 1.3;
    text-transform: capitalize;
}

.sr-card__subtitle {
    margin: 2px 0 0;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--sr-blue);
    text-transform: capitalize;
}

.sr-card__code {
    flex-shrink: 0;
    padding: 3px 10px;
    border-radius: 20px;
    background: #f1f5f9;
    color: #475569;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
}

.sr-card__divider {
    height: 1px;
    background: var(--sr-border);
    margin-bottom: 14px;
}

/* Grid Layout for Metadata */
.sr-card__meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    width: 100%;
}

.sr-card__meta-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    min-width: 0;
}

.sr-card__meta-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f1f5f9;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--sr-muted);
    font-size: 0.875rem;
}

.sr-card__meta-content {
    min-width: 0;
}

.sr-card__meta-label {
    display: block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--sr-muted);
    margin-bottom: 2px;
}

.sr-card__meta-value {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--sr-navy);
    line-height: 1.35;
    word-break: break-word;
}

/* Card Stub (Right Side) */
.sr-card__stub {
    position: relative;
    flex-shrink: 0;
    width: 210px;
    padding: 16px;
    border-left: 1px solid var(--sr-border);
    background: #fafafa;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 12px;
}

/* .sr-card__stub-top {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 8px;
} */

.sr-card__fee-wrap {
    flex: 1;
    text-align: right;
}

.sr-card__fee-label {
    display: block;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--sr-muted);
    margin-bottom: 2px;
}

.sr-card__fee-value {
    display: block;
    line-height: 1.2;
    white-space: nowrap;
}

.sr-card__fee-amount {
    font-size: 1.35rem;
    font-weight: 800;
    color: var(--sr-navy);
}

.sr-card__fee-unit {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--sr-muted);
    margin-left: 2px;
    text-transform: lowercase;
}

.sr-card__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    font-size: 0.875rem;
    color: var(--sr-muted);
    text-decoration: none;
    flex-shrink: 0;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.sr-card__menu-btn:hover {
    background: #e2e8f0;
    color: var(--sr-navy);
}

/* Status Badges */
.sr-card__status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.8125rem;
    font-weight: 600;
    line-height: 1.2;
    text-transform: capitalize;
}

.sr-card__status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
}

.sr-card__status-badge--pending { background: #fef3c7; color: #b45309; }
.sr-card__status-badge--pending .sr-card__status-dot { background: #f59e0b; }

.sr-card__status-badge--accepted { background: #dbeafe; color: #1d4ed8; }
.sr-card__status-badge--accepted .sr-card__status-dot { background: #3b82f6; }

.sr-card__status-badge--completed { background: #d1fae5; color: #047857; }
.sr-card__status-badge--completed .sr-card__status-dot { background: #10b981; }

.sr-card__status-badge--rejected { background: #fee2e2; color: #b91c1c; }
.sr-card__status-badge--rejected .sr-card__status-dot { background: #ef4444; }

.sr-card__status-badge--expired,
.sr-card__status-badge--cancelled { background: #f1f5f9; color: #64748b; }
.sr-card__status-badge--expired .sr-card__status-dot,
.sr-card__status-badge--cancelled .sr-card__status-dot { background: #94a3b8; }

.sr-list-empty__icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: #f1f5f9;
    color: var(--sr-muted);
}

/* Responsive Adjustments */
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
        background: #ffffff;
        padding-top: 14px;
    }

    .sr-card__fee-wrap {
        text-align: left;
    }
}
</style>