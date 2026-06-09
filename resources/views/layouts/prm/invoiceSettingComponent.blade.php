<div id="_main_invoiceSetting_component" class="mobile-padding p-3" style="display:none;">
    
    <div class="row g-3 mb-3">
        <div class="col-md-6 d-flex">
            <div class="is-card w-100">
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

                    <div class="d-flex flex-column gap-3">
                        <div class="is-card-info">
                            <p class="is-label">Name</p>
                            <p class="is-value fs-6" id="_is_representative">—</p>
                        </div>
                        <div class="is-card-info">
                            <p class="is-label">Phone</p>
                            <p class="is-value fs-6" id="_is_representative_phone">—</p>
                        </div>
                        <div class="is-card-info">
                            <p class="is-label">Address</p>
                            <p class="is-value fs-6" id="_is_representative_address">—</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6 d-flex">
            <div class="is-card w-100">
                <p class="is-section-title">Invoice Display Options</p>

                <div class="is-row">
                    <span class="is-row-label">
                        <i class="fa-solid fa-receipt"></i>
                        Show Commission Tax
                    </span>
                    <div class="form-check form-switch">
                        <input class="form-check-input toggle-setting" type="checkbox" data-field="show_comm_tax" id="_is_show_comm_tax">
                    </div>
                </div>

                <div class="is-row">
                    <span class="is-row-label">
                        <i class="fa-solid fa-credit-card"></i>
                        Show Payment Status
                    </span>
                    <div class="form-check form-switch">
                        <input class="form-check-input toggle-setting" type="checkbox" data-field="show_pmt_status" id="_is_show_pmt_status">
                    </div>
                </div>

                <div class="is-row">
                    <span class="is-row-label">
                        <i class="fa-solid fa-scale-balanced"></i>
                        Show Balance
                    </span>
                    <div class="form-check form-switch">
                        <input class="form-check-input toggle-setting" type="checkbox" data-field="show_balance" id="_is_show_balance">
                    </div>
                </div>

                <div class="is-row">
                    <span class="is-row-label">
                        <i class="fa-solid fa-money-bill-wave"></i>
                        Show Amount Paid
                    </span>
                    <div class="form-check form-switch">
                        <input class="form-check-input toggle-setting" type="checkbox" data-field="show_amount_paid" id="_is_amount_paid">
                    </div>
                </div>
                <div class="is-row">
                    <span class="is-row-label">
                        <i class="fa-solid fa-signature"></i>
                        Show Signature
                    </span>
                    <div class="form-check form-switch">
                        <input class="form-check-input toggle-setting" type="checkbox" data-field="show_sign" id="_is_show_sign">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row g-3">
        <div class="col-md-6 d-flex">
            <div class="is-card w-50">
                <p class="is-section-title">Upload QR code </p>
                <div class="d-flex flex-column align-items-center gap-3 w-100 flex-grow-1 justify-content-center">
                    <div class="cpn-logo-box" id="_logo_box">
                        <img id="com_imgLogo" 
                             class="data-input thumbnail"
                             data-field="qr_file_path"
                             alt="Company Logo"
                             style="display: none; width:100%; height:100%; object-fit: cover; border-radius:10px;" />

                        <div id="_logo_placeholder" class="logo-placeholder">
                            <i class="fa-regular fa-image cpn-logo-icon"></i>
                            <span class="cpn-logo-text">Upload QR code</span>
                        </div>
                    </div>
                    <input type="file" id="_logo_file_input" accept="image/*" style="display:none" />
                    
                    <div class="w-100 mt-2">
                        <button id="com_btnChooseLogo" class="cpn-btn-upload w-100 mb-2">
                            <i class="fa fa-upload me-2"></i> Upload file
                        </button>
                        <button id="com_btnDeleteLogo" class="cpn-btn-delete w-100">
                            <i class="fa-regular fa-trash-can me-2"></i> Delete file
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            </div>
    </div>

</div>

<style>
#_main_invoiceSetting_component {
    --cpn-bg-page: #f8f9fd;
    --cpn-bg-card: #fff;
    --cpn-bg-input: #f0f5f8;
    --cpn-bg-cp: #fff;
    --cpn-border: #e2e5ef;
    --cpn-border-inp: rgba(140, 76, 76, 0.15);
    --cpn-text: #2b2f3a;
    --cpn-text-muted: #2b2f3a;
    --cpn-text-label: #cbd5e1;
    --cpn-accent: #3b82f6;
    --cpn-accent-hover: #2563eb;
    --cpn-radius: 12px;
    --cpn-radius-sm: 8px;
    font-family: 'Khmer OS Content', 'Segoe UI', 'Verdana', 'Arial', sans-serif;
}

.is-card {
    background: #fff;
    border: 0.5px solid rgba(0, 0, 0, 0.12);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
}

/* ── Card internal segments ───────────────────── */
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

/* ── Edit Button ──────────────────────────────── */
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

/* ── Headings & Rows ───────────────────────────── */
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
    padding: 12px 0;
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

/* ── Logo Box Elements ────────────────────────── */
#_main_invoiceSetting_component .cpn-logo-box {
    width: 100%;
    max-width: 180px;
    aspect-ratio: 1 / 1;
    background: #eaeff2;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

#_main_invoiceSetting_component .logo-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

#_main_invoiceSetting_component .cpn-logo-icon {
    font-size: 40px;
    color: #94a3b8;
}

#_main_invoiceSetting_component .cpn-logo-text {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}

#_main_invoiceSetting_component #com_imgLogo {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    object-fit: cover;
}

/* ── Action Buttons ───────────────────────────── */
#_main_invoiceSetting_component .cpn-btn-upload {
    background: transparent;
    color: white;
    background-color: rgb(12, 57, 158);
    border: 1px solid var(--cpn-border-inp);
    border-radius: var(--cpn-radius-sm);
    padding: 9px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: background .18s;
    text-align: center;
}

#_main_invoiceSetting_component .cpn-btn-upload:hover {
    color: white;
    background-color: rgb(8, 35, 98);
}

#_main_invoiceSetting_component .cpn-btn-delete {
    background: transparent;
    color: #f87171;
    border: 1px solid rgba(248,113,113,0.35);
    border-radius: var(--cpn-radius-sm);
    padding: 9px 14px;
    font-size: 13px;
    cursor: pointer;
    transition: background .18s;
    text-align: center;
}

#_main_invoiceSetting_component .cpn-btn-delete:hover {
    background: rgba(248,113,113,0.1);
}
</style>