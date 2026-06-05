<div id="_main_contract_component" class="mobile-padding p-3" style="display: none;">
    <div id="_divFilter_contract" class="contract-filter-bar rounded-2 p-2 shadow-sm">
         <div class="row g-2 align-items-center">
             <div class="col-12 col-md-6 col-lg-4">
                 <div class="position-relative w-100">
                    <input type="text" class="rounded-2 filter-field input-search" id="_search_contract" placeholder="Search by unit">
                 </div>
             </div>
             <div class="col-12 col-md-6 col-lg-4">
                 <select id="business_type_id" class="data-input filter-field form-control" data-field="business_type_id"></select>
             </div>
             <div class="col-12 col-md-6 col-lg-4">
                 <select id="el_contract_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
             </div>
         </div>
     </div>
     <div id="_contract_list" class="contract-list-wrap mt-3"></div>
 </div>

<style>
.contract-filter-bar {
    background-color: #fff;
    border: 1px solid #e8ecf2;
}

.contract-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.contract-card-grid {
    --contract-navy: #1A1647;
    --contract-blue: #0C447C;
    --contract-muted: #8b95a5;
    --contract-border: #e8ecf2;
    --contract-surface: #f6f8fb;
}

.contract-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(26, 22, 71, 0.06);
    overflow: visible;
    border: 1px solid var(--contract-border);
    transition: box-shadow 0.15s ease;
    position: relative;
}

.contract-card:hover {
    box-shadow: 0 6px 16px rgba(26, 22, 71, 0.1);
}

.contract-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: linear-gradient(135deg, #1A1647 0%, #25206a 100%);
    color: #fff;
    padding: 10px 12px;
    border-radius: 10px 10px 0 0;
    position: relative;
    z-index: 1;
    overflow: visible;
}

.contract-card__menu-wrap {
    position: relative;
    flex-shrink: 0;
    z-index: 3;
}

.contract-card__body {
    border-radius: 0 0 10px 10px;
    background: #fff;
    padding: 10px 12px 11px;
}

.contract-card__header-main {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    min-width: 0;
    flex: 1;
}

.contract-card__title {
    font-size: 0.78rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1.3;
}

.contract-card__unit-pill {
    display: inline-block;
    background-color: var(--contract-blue);
    color: #fff;
    padding: 1px 7px;
    border-radius: 5px;
    font-weight: 700;
    font-size: 0.72rem;
}

.contract-card__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    color: #fff !important;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.1);
    font-size: 0.8rem;
    flex-shrink: 0;
}

.contract-card__menu-btn:hover {
    background: rgba(255, 255, 255, 0.2);
}

.contract-card__status {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 600;
    border: 1px solid transparent;
    white-space: nowrap;
}

.contract-card__status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #22c55e;
    flex-shrink: 0;
}

.contract-card__status--active {
    color: #15803d;
    background-color: #ecfdf3;
    border-color: #bbf7d0;
}

.contract-card__status--pending {
    color: #a16207;
    background-color: #fefce8;
    border-color: #fde68a;
}

.contract-card__status--expired,
.contract-card__status--terminated {
    color: #b91c1c;
    background-color: #fef2f2;
    border-color: #fecaca;
}

/* Dropdown menu — fix hover gap and item highlight */
.contract-list-wrap .vsa-dropdown.contract-card__dropdown,
.contract-list-wrap .contract-card__dropdown.vsa-dropdown {
    margin-top: 4px !important;
    padding: 6px;
    min-width: 190px;
    border-radius: 10px;
    border: 1px solid var(--contract-border);
    box-shadow: 0 8px 24px rgba(26, 22, 71, 0.14) !important;
    z-index: 2000;
    background: #fff;
}

.contract-list-wrap .contract-card__dropdown::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 0;
    right: 0;
    height: 8px;
}

.contract-list-wrap .contract-card__dropdown .menu-item {
    margin: 0;
}

.contract-list-wrap .contract-card__dropdown .menu-item a,
.contract-list-wrap .contract-card__dropdown .contract-card__dropdown-item a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 8px;
    color: var(--contract-navy) !important;
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.contract-list-wrap .contract-card__dropdown .menu-item a:hover,
.contract-list-wrap .contract-card__dropdown .menu-item:hover a,
.contract-list-wrap .vsa-dropdown a:hover {
    background-color: #eef2f8;
    color: var(--contract-blue) !important;
    cursor: pointer;
}

.contract-list-wrap .contract-card__dropdown .menu-item span {
    font-size: 0.82rem;
    font-weight: 500;
    padding: 0;
}

.contract-card__label {
    display: block;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--contract-muted);
    text-transform: uppercase;
    margin-bottom: 1px;
    line-height: 1.2;
}

.contract-card__meta {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
}

.contract-card__meta-item {
    min-width: 0;
}

.contract-card__meta-item--end {
    text-align: right;
    flex-shrink: 0;
    max-width: 42%;
}

.contract-card__business {
    display: block;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--contract-blue);
    line-height: 1.25;
    word-break: break-word;
}

.contract-card__type {
    display: block;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--contract-navy);
    line-height: 1.25;
}

.contract-card__dates {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-bottom: 8px;
}

.contract-card__date-box {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--contract-surface);
    border: 1px solid var(--contract-border);
    border-radius: 6px;
    padding: 6px 8px;
    min-width: 0;
}

.contract-card__date-icon {
    color: var(--contract-muted);
    font-size: 0.72rem;
    flex-shrink: 0;
}

.contract-card__date-value {
    display: block;
    font-weight: 700;
    color: var(--contract-navy);
    font-size: 0.74rem;
    line-height: 1.2;
    white-space: nowrap;
}

.contract-card__finance {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 8px;
    padding-top: 8px;
    margin-bottom: 8px;
    border-top: 1px solid var(--contract-border);
}

.contract-card__finance-item {
    min-width: 0;
}

.contract-card__finance-item--end {
    text-align: right;
    flex-shrink: 0;
}

.contract-card__price-value {
    display: block;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--contract-navy);
    line-height: 1.2;
}

.contract-card__price-value small {
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--contract-muted);
    margin-left: 2px;
}

.contract-card__price-sub {
    display: block;
    font-size: 0.68rem;
    margin-top: 1px;
    font-weight: 600;
    color: var(--contract-blue);
    line-height: 1.2;
}

.contract-card__deposit {
    display: block;
    font-size: 0.88rem;
    font-weight: 800;
    color: var(--contract-navy);
    line-height: 1.2;
}

.contract-card__comment {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding-top: 8px;
    border-top: 1px solid var(--contract-border);
    color: #5f6b7a;
    font-size: 0.72rem;
    line-height: 1.35;
}

.contract-card__comment-icon {
    color: var(--contract-blue);
    font-size: 0.75rem;
    margin-top: 1px;
    flex-shrink: 0;
}

.contract-card__comment-text {
    word-break: break-word;
    min-width: 0;
}

.contract-card__comment-text strong {
    color: var(--contract-navy);
    font-weight: 600;
}

.contract-card-empty__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: var(--contract-surface);
    color: var(--contract-blue);
    border: 1px solid var(--contract-border);
    font-size: 1.1rem;
}

@media (max-width: 575.98px) {
    .contract-card__dates {
        grid-template-columns: 1fr;
    }

    .contract-card__meta,
    .contract-card__finance {
        flex-direction: column;
        align-items: flex-start;
    }

    .contract-card__meta-item--end,
    .contract-card__finance-item--end {
        text-align: left;
        max-width: 100%;
    }
}
</style>
