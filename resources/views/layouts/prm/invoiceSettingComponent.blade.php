<div id="_main_invoiceSetting_component" class="mobile-padding p-3" style="display:none;">
    <div class="is-grid">

        <div class="is-card">

            {{-- Exchange Rate row --}}
            <div class="is-card-row border-bottom pb-3 mb-3">
                <div class="is-icon-wrap">
                    <i class="fa-solid fa-dollar-sign"></i>
                </div>
                <div class="is-card-info">
                    <p class="is-label">Exchange Rate (USD - KHR)</p>
                    <p class="is-value" id="_is_exchange_rate">—</p>
                </div>
                <button type="button" class="is-edit-btn" id="_btnEditInvoiceSetting">
                    <i class="fa-regular fa-pen-to-square"></i>
                    Edit
                </button>
            </div>

            {{-- Representative Info --}}
            <div class="d-flex flex-column gap-3">

                {{-- Row 1: icon + title + edit button --}}
                <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                        <div class="is-icon-wrap">
                            <i class="fa-solid fa-user"></i>
                        </div>
                        <p class="is-section-title mb-0">Representative Info</p>
                    </div>
                    <button type="button" class="is-edit-btn" id="_btnEditRepresentative">
                        <i class="fa-regular fa-pen-to-square"></i>
                        Edit
                    </button>
                </div>

                {{-- Row 2: fields, single column --}}
                <div class="d-flex flex-column gap-3">
                    <div class="is-card-info">
                        <p class="is-label"> Name</p>
                        <p class="is-value fs-6 " id="_is_representative">—</p>
                    </div>
                    <div class="is-card-info">
                        <p class="is-label"> Phone</p>
                        <p class="is-value fs-6 " id="_is_representative_phone">—</p>
                    </div>
                    <div class="is-card-info">
                        <p class="is-label"> Address</p>
                        <p class="is-value fs-6 " id="_is_representative_address">—</p>
                    </div>
                </div>

            </div>
        </div>

        <div class="is-card">
            <p class="is-section-title">Invoice Display Options</p>

            <div class="is-row">
                <span class="is-row-label">
                    <i class="fa-solid fa-receipt"></i>
                    Show Commission Tax
                </span>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-setting" type="checkbox"
                           data-field="show_comm_tax" id="_is_show_comm_tax">
                </div>
            </div>

            <div class="is-row">
                <span class="is-row-label">
                    <i class="fa-solid fa-credit-card"></i>
                    Show Payment Status
                </span>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-setting" type="checkbox"
                           data-field="show_pay_status" id="_is_show_pay_status">
                </div>
            </div>

            <div class="is-row">
                <span class="is-row-label">
                    <i class="fa-solid fa-scale-balanced"></i>
                    Show Balance
                </span>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-setting" type="checkbox"
                           data-field="show_balance" id="_is_show_balance">
                </div>
            </div>

            <div class="is-row">
                <span class="is-row-label">
                    <i class="fa-solid fa-money-bill-wave"></i>
                    Show Amount Paid
                </span>
                <div class="form-check form-switch">
                    <input class="form-check-input toggle-setting" type="checkbox"
                           data-field="show_amount_paid" id="_is_amount_paid">
                </div>
            </div>
        </div>

    </div>
</div>

<style>
.is-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: 14px;
}

@media (max-width: 768px) {
    .is-grid {
        grid-template-columns: 1fr;
    }
}

.is-card {
    background: #fff;
    border: 0.5px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* ── Exchange Rate card internals ───────────────────── */
.is-card-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.is-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #E6F1FB;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 18px;
    color: #185FA5;
}

.is-card-info {
    flex: 1;
    min-width: 0;
}

.is-label {
    font-size: 12px;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 2px;
}

.is-value {
    font-size: 22px;
    font-weight: 500;
    color: #1a1a2e;
    margin: 0;
    line-height: 1.2;
}

.is-card-footer {
    font-size: 12px;
    color: #adb5bd;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 0.5px solid rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 5px;
}

/* ── Edit button ────────────────────────────────────── */
.is-edit-btn {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    padding: 6px 14px;
    border-radius: 8px;
    border: 0.5px solid rgba(0, 0, 0, 0.2);
    background: transparent;
    color: #1a1a2e;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
}

.is-edit-btn:hover {
    background: #f5f5f5;
}

/* ── Toggle Settings card internals ─────────────────── */
.is-section-title {
    font-size: 11px;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0 0 1rem;
}

.is-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
}

.is-row + .is-row {
    border-top: 0.5px solid rgba(0, 0, 0, 0.08);
}

.is-row-label {
    font-size: 14px;
    color: #1a1a2e;
    display: flex;
    align-items: center;
    gap: 8px;
}

.is-row-label i {
    font-size: 15px;
    color: #6c757d;
}

/* ── On / Off badges (used by renderToggleBadge) ────── */
.is-badge-on {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    background: #EAF3DE;
    color: #27500A;
    border: 0.5px solid #97C459;
}

.is-badge-off {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
    background: #f5f5f5;
    color: #6c757d;
    border: 0.5px solid rgba(0, 0, 0, 0.15);
}



</style>