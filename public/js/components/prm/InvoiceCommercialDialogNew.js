const InvoiceCommercialDialogNew = (() => {
    const self = {};

    const currency = "$";

    const fmt = (n) =>
        Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };

    /* ── Print via hidden iframe ── */
    const printViaIframe = (invoiceEl) => {
        const styleHTML = Array.from(document.querySelectorAll("style")).map(s => s.outerHTML).join("\n");
        const biLink = Array.from(document.querySelectorAll('link[href*="bootstrap-icons"]')).map(l => l.outerHTML).join("\n");
        const fontLink = `
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;
        
        const fullDoc = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
                    ${fontLink}${biLink}${styleHTML}
                    <style>
                        *, *::before, *::after { 
                            box-sizing: border-box; 
                            margin: 0; 
                            padding: 0; 
                        }
                        html, body {
                            background: #fff !important;
                            font-family: 'Inter', sans-serif;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        .pi-action-bar { display: none !important; }
                        
                        @page { 
                            size: A4 portrait; 
                            margin: 0; 
                        }
                        
                        @media print {
                            body { 
                                padding: 2rem !important; 
                                margin: 0 !important;
                            }
                            .pi-root { 
                                padding: 0 !important; 
                                width: 100% !important;
                                max-width: 100% !important;
                            }
                            .pi-tbl-wrap { 
                                overflow: visible !important; 
                            }
                            .pi-table { 
                                width: 100% !important; 
                                table-layout: fixed !important;
                            }
                            /* Prevent awkward page breaks during multi-page printing */
                            .pi-table tr, .pi-summary-block, .pi-signatures, .pi-footer {
                                page-break-inside: avoid;
                            }
                        }
                    </style>
                    </head>
                    <body>${invoiceEl.outerHTML}</body>
                    </html>`;

        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;pointer-events:none;z-index:-9999;";
        document.body.appendChild(iframe);
        const iDoc = iframe.contentWindow.document;
        iDoc.open(); iDoc.write(fullDoc); iDoc.close();
        iframe.onload = () => {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => document.body.removeChild(iframe), 2000);
            }, 400);
        };
    };

    const buildInvoiceHTML = (invoice, setting, company) => {
        const subTotal      = parseFloat(invoice.amount         || 0);
        const totalDiscount = parseFloat(invoice.discount_value || 0);
        const netTotal      = parseFloat(invoice.amount_payable || 0);
        const paid          = parseFloat(invoice.paid_amount    || 0);
        const balance       = parseFloat(invoice.due_amount     || 0);

        const showPmtStatus  = setting.show_pmt_status;
        const showBalance    = setting.show_balance;
        const showAmountPaid = setting.show_amount_paid;
        const QR_file        = setting.QR_file;
        const qr_file_name   = setting.qr_file_name;
        const showSign       = setting.show_sign;

        const companyContactPerson = company.first_cp_name;
        const companyContactEmail  = company.first_cp_email;
        const companyContactPhone  = company.first_cp_phone;
        const companyAddress       = company.address;
        const companyLogo          = company.logo_url;

        const discType = (invoice.discount_type || "percent").toLowerCase();
        const isAmountDisc = (discType === "amount" || discType === "$");
        let discDisplay = `<span style="color:#9CA3AF;font-size:12px;">—</span>`;
        if (totalDiscount > 0) {
            discDisplay = `<span style="color:#DC2626;font-size:12px;font-weight:600;">
                ${isAmountDisc ? currency : ''}${fmt(totalDiscount)}${!isAmountDisc ? '%' : ''}
            </span>`;
        }

        const statusLabel = balance <= 0 ? "PAID" : (paid > 0 ? "PARTIALLY PAID" : "UNPAID");
        const statusColor = balance <= 0 ? "#15803D" : (paid > 0 ? "#B45309" : "#B91C1C");
        const statusBg    = balance <= 0 ? "#DCFCE7" : (paid > 0 ? "#FEF3C7" : "#FEE2E2");

        const validItems = (invoice.items || []).filter(
            (item) => parseFloat(item.price || 0) > 0 || parseFloat(item.total || 0) > 0
        );

        const itemRows = validItems.map((item, i) => {
            const rowBg     = i % 2 !== 0 ? "#FAFAFA" : "#FFFFFF";
            const itemTotal = parseFloat(item.total || 0);
            const qty       = parseFloat(item.qty || 0);

            return `
            <tr style="background:${rowBg}; border-bottom: 1px solid #E5E7EB;">
                <td style="padding:12px 16px;text-align:left;font-size:13px;color:#374151;line-height:1.5;vertical-align:top;">
                    <div style="font-weight:600;color:#111827;">${item.remarks || item.item_name || "—"}</div>
                    <div style="font-size:11px;color:#6B7280;margin-top:2px;">
                        Period: ${formatDate(item.start_date)} – ${formatDate(item.end_date)}
                    </div>
                </td>
                <td style="padding:12px 16px;text-align:center;font-size:13px;color:#4B5563;vertical-align:top;">
                    ${qty} ${item.unit_type ? item.unit_type.trim() : ""}
                </td>
                <td style="padding:12px 16px;text-align:right;font-size:13px;font-weight:600;color:#111827;vertical-align:top;">
                    ${currency}${fmt(itemTotal)}
                </td>
            </tr>`;
        }).join("");

        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                .pi-root {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    background: #fff;
                    color: #1F2937;
                    width: 100%;
                    max-width: 100%;
                    padding: 24px;
                    box-sizing: border-box;
                }
                .pi-action-bar button {
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .pi-action-bar button:hover { opacity: 0.85; }
                .pi-tbl-wrap { width: 100%; margin-top: 20px; }
                .pi-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .pi-table thead th {
                    padding: 12px 16px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    color: #4B5563;
                    background: #F3F4F6;
                    border-bottom: 2px solid #E5E7EB;
                }
                .pi-totals-row td {
                    padding: 10px 16px;
                    font-size: 13px;
                    border-top: 1px solid #E5E7EB;
                }
            </style>

            <div class="pi-root" id="pi-invoice-content">
                 <div style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:1rem;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
                        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);pointer-events:none;"></div>
                        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

                        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;z-index:2;">
                            <div style="width:70px;height:76px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;border-radius:6px;">
                                <img src="${companyLogo}" alt="Logo"
                                    style="width:60px;height:63px;object-fit:contain;"
                                    onerror="this.parentElement.innerHTML='<span style=\'font-size:22px;font-weight:900;color:#fff;font-family:Inter,serif;\'>M</span>'">
                            </div>
                            <div>
                                <div style="font-size:16px;font-weight:800;color:#FFFFFF;margin-bottom:4px;">${companyContactPerson || "Company Name"}</div>
                                <div style="font-size:12px;color:rgba(255,255,255,0.85);line-height:1.4;">
                                    ${companyAddress ? `<div>${companyAddress}</div>` : ""}
                                    ${companyContactPhone ? `<div>Tel: ${companyContactPhone}</div>` : ""}
                                    ${companyContactEmail ? `<div>Email: ${companyContactEmail}</div>` : ""}
                                </div>
                        </div>
                        </div>

                        <div style="text-align:right;position:relative;z-index:2;">
                             <div style="font-family:'Inter',serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.7px;line-height:1.1;">INVOICE</div>
                            <div class="invoice-num" style="font-size:15px;font-weight:700;color:#FDE68A;margin-top:2px;letter-spacing:0.3px;">${invoice.code || "—"}</div>
                            
                            ${showPmtStatus ? `
                            <div style="display:inline-block;margin-top:6px;padding:4px 12px;border-radius:20px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                                ${statusLabel}
                            </div>
                            ` : ''}
                        </div>
                    </div>

                <!-- Invoice Details Section -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem; background: #F8FAFF; border-bottom: 1px solid #E2E8F0;">
                    <div>
                        <div class="section-label" style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                            Billed To
                        </div>
                        <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 2px;">
                            ${invoice.tenant_name || "—"}
                        </div>
                        <div style="font-size: 12px; color: #475569; line-height: 1.5;">
                            ${invoice.space_code   ? `<div>Space: <strong>${invoice.space_code}</strong></div>` : ''}
                            ${invoice.tenant_email ? `<div>${invoice.tenant_email}</div>` : ''}
                            ${invoice.tenant_phone ? `<div>${invoice.tenant_phone}</div>` : ''}
                        </div>
                    </div>

                    <div style="text-align: right;">
                        <div class="section-label" style="font-size: 10px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                            Important Dates
                        </div>
                        <div style="font-size: 12px; color: #475569; line-height: 1.6;">
                            <div>Issue Date: <strong>${formatDate(invoice.issue_date)}</strong></div>
                            <div>Due Date: <strong style="color: #DC2626;">${formatDate(invoice.due_date)}</strong></div>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="pi-tbl-wrap">
                    <table class="pi-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;width:55%;">Description</th>
                                <th style="text-align:center;width:20%;">Qty</th>
                                <th style="text-align:right;width:25%;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows || `<tr><td colspan="3" style="text-align:center;padding:32px;color:#9CA3AF;">No items found</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <!-- Summary & QR Code Section -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 1rem; gap: 24px;">
                    <div>
                        ${qr_file_name != null && QR_file ? `
                        <div style="width: 100px; height: 100px; border: 1px solid #E2E8F0; border-radius: 8px; padding: 6px; background: #FFF; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                            <img src="${QR_file}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;" />
                        </div>` : ''}
                    </div>

                    <div style="width: 320px; border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; background: #FFFFFF;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr class="pi-totals-row">
                                <td style="padding: 1rem; color: #4B5563;">Sub Total</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 600; color: #111827;">${currency}${fmt(subTotal)}</td>
                            </tr>
                            <tr class="pi-totals-row">
                                <td style="padding: 1rem; color: #DC2626;">Discount ${totalDiscount > 0 ? `(${discDisplay})` : ''}</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 600; color: #DC2626;">-${currency}${fmt(totalDiscount)}</td>
                            </tr>
                            <tr class="pi-totals-row" style="background: #F8FAFF; border-top: 2px solid #E2E8F0;">
                                <td style="padding: 1rem; font-weight: 700; color: #0F172A;">Net Total</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 800; color: #0F172A; font-size: 15px;">${currency}${fmt(netTotal)}</td>
                            </tr>
                            ${showAmountPaid ? `
                            <tr class="pi-totals-row">
                                <td style="padding: 1rem; color: #16A34A; font-weight: 600;">Amount Paid</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 700; color: #16A34A;">${currency}${fmt(paid)}</td>
                            </tr>` : ''}
                            ${showBalance ? `
                            <tr style="background:linear-gradient(135deg,#0F2060,#1A3D91);">
                                <td style="padding: 1rem; color:#fff; font-weight: 700;">Balance Due</td>
                                <td style="padding: 1rem; text-align: right; font-weight: 800; color: #FDE68A; font-size: 15px;">${currency}${fmt(balance)}</td>
                            </tr>` : ''}
                        </table>
                    </div>
                </div>

                <!-- Remarks -->
                ${invoice.general_remark ? `
                <div style="margin-top:20px;padding:12px 16px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:4px;">
                    <div style="font-size:10px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;color:#92400E;margin-bottom:2px;">Remarks</div>
                    <div style="font-size:12px;color:#78350F;line-height:1.4;">${invoice.general_remark}</div>
                </div>` : ""}

                <!-- Signature Section -->
                ${showSign ? `
                <div class="pi-signatures" style="display:flex;justify-content:space-between;margin-top:40px;padding-top:16px;gap:60px;">
                    <div style="flex:1;text-align:center;">
                        <div style="font-size:12px;font-weight:500;color:#4B5563;margin-bottom:48px;">Customer's Signature</div>
                        <div style="border-bottom:1px dashed #9CA3AF;"></div>
                    </div>
                    <div style="flex:1;text-align:center;">
                        <div style="font-size:12px;font-weight:500;color:#4B5563;margin-bottom:48px;">Authorized Signature</div>
                        <div style="border-bottom:1px dashed #9CA3AF;"></div>
                    </div>
                </div>
                ` : ''}

                <!-- Footer Terms -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 1rem; background: #F8FAFF; border-top: 1px solid #E2E8F0; border-radius: 0 0 8px 8px; margin-top: 1rem;">
                    <div>
                        <div class="section-label" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1E3A8A; margin-bottom: 4px;">Terms & Conditions</div>
                        <div style="font-size: 11px; color: #64748B; line-height: 1.5;">
                            1. This invoice is for the monthly office rental fee.<br>
                            2. Payment is due by 05th every month.<br>
                            3. Late payments may incur 2% per day as outlined in the lease agreement.<br>
                            4. The security deposit is held separately and will only be refunded after lease termination.
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: #94A3B8;">Generated by Property Manager</div>
                        <div style="font-size: 11px; font-weight: 600; color: #475569; margin-top: 2px;">${formatDate(invoice.issue_date)}</div>
                    </div>
                </div>

                <!-- Action Bar -->
                <div class="pi-action-bar" style="display:flex;justify-content:flex-end;gap:10px;padding-top:20px;margin-top:16px;border-top:1px solid #E5E7EB;background:#fff;">
                    <button id="pi-print-btn"
                        style="padding:8px 16px;border-radius:6px;border:1px solid #D1D5DB;background:#fff;color:#374151;font-weight:600;display:inline-flex;align-items:center;gap:6px;">
                        <i class="bi bi-printer-fill"></i> Print Invoice
                    </button>
                    <button id="pi-download-btn"
                        style="padding:8px 16px;border-radius:6px;border:none;background:#2563EB;color:#fff;font-weight:600;display:inline-flex;align-items:center;gap:6px;">
                        <i class="bi bi-download"></i> Download PDF
                    </button>
                </div>

            </div>`;
    };

    const wireButtons = (container) => {
        const invoiceEl   = container.querySelector("#pi-invoice-content");
        const printBtn    = container.querySelector("#pi-print-btn");
        const downloadBtn = container.querySelector("#pi-download-btn");
        if (printBtn)    printBtn.addEventListener("click",    () => printViaIframe(invoiceEl));
        if (downloadBtn) downloadBtn.addEventListener("click", () => printViaIframe(invoiceEl));
    };

    self.show = (op) => {
        if (!op || !op.invoice_id) {
            cv_interact?.error("Invoice ID is missing");
            return;
        }

        const dlg = new GeneralDialog({
            title: "Commercial Invoice",
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div name="pi_container" style="min-height:280px;border-radius:8px;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:center;padding:80px 0;gap:14px;color:#6B7280;font-size:13px;font-family:'Inter',sans-serif;">
                        <div style="width:28px;height:28px;border:3px solid #E5E7EB;border-top-color:#2563EB;border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
                        Loading invoice…
                    </div>
                    <style>@keyframes pi-spin{to{transform:rotate(360deg)}}</style>
                </div>`,
            contentCreated: (me) => {
                const container = me.divModal.querySelector('[name="pi_container"]');
                container.innerHTML = buildInvoiceHTML(op.invoice, op.setting, op.company);
                wireButtons(container);
            },
            buttons: [{ label: "Close", cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });
        dlg.show(op);
    };

    return self;
})();