const InvoiceTaxDialogNew = (() => {
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
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>`;
            
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
                            font-family: 'Inter', sans-serif !important; 
                        }
                        body {
                            font-family: 'Inter', sans-serif !important;
                            background: #fff;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .pi-action-bar { display:none!important; }
                        @page { size: A4 portrait; margin: 1rem; }
                        @media print {
                            *, *::before, *::after { font-family: 'Inter', sans-serif !important; }
                            body { background: #fff !important; margin: 0; padding: 1rem !important; font-family: 'Inter', sans-serif !important; }
                            .pi-root { padding: 1rem !important; font-family: 'Inter', sans-serif !important; }
                            .pi-action-bar { display:none!important; }
                            .pi-tbl-wrap { overflow: visible !important; }
                            .pi-table { min-width: 100% !important; width: 100% !important; table-layout: fixed !important; border-collapse: collapse !important; }
                            
                            /* PRINT COLUMN WIDTH ADJUSTMENTS (5 COLUMNS TOTAL) */
                            .pi-table th.col-desc, .pi-table td.col-desc { width: 48% !important; }
                            .pi-table th.col-num, .pi-table td.col-num { width: 13% !important; }
                            
                            .pi-table th, .pi-table td { font-size: 11px !important; word-wrap: break-word !important; }
                            .pi-avoid-break { page-break-inside: avoid; }
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
        const showBalance     = setting.show_balance;
        const showAmountPaid = setting.show_amount_paid;
        const QR_file        = setting.QR_file;
        const qr_file_name   = setting.qr_file_name;
        const showSign        = setting.show_sign;

        const companyLogo  = company.logo_url;
        const email        = company.email ;
        const address      = company.address ;
        const phone        = company.phone_number ;  
        const companyName  = company.name ;  

        const discType     = (invoice.discount_type || "percent").toLowerCase();
        const isAmountDisc = (discType === "amount" || discType === "$");

        let discDisplay = `<span style="color:#9CA3AF;font-size:11px;">—</span>`;
        if (totalDiscount > 0) {
            discDisplay = `<span style="color:#DC2626;font-size:11px;font-weight:600;">
                ${isAmountDisc ? currency : ''}${fmt(totalDiscount)}${!isAmountDisc ? '%' : ''}
            </span>`;
        }

        const statusColor = balance <= 0 ? "#059669" : (paid > 0 ? "#D97706" : "#DC2626");
        const statusLabel = balance <= 0 ? "PAID"    : (paid > 0 ? "PARTIALLY PAID" : "UNPAID");
        const statusBg    = balance <= 0 ? "#ECFDF5" : (paid > 0 ? "#FFFBEB" : "#FEF2F2");

        const validItems = (invoice.items || []).filter(
            (item) => parseFloat(item.price || 0) > 0 || parseFloat(item.total || 0) > 0
        );

        const itemRows = validItems.map((item, i) => {
            const qty   = parseFloat(item.qty   || 1);
            const price = parseFloat(item.price || 0);
            const total = parseFloat(item.total || item.amount || (qty * price));
            const disc  = parseFloat(item.discount || item.special_discount_value || 0);
            const tax   = parseFloat(item.tax_rate || 0);

            const itemDiscType = (item.discount_type || item.special_discount_type || "percent").toLowerCase();

            let itemDiscDisplay = `<span style="color:#9CA3AF;font-size:11px;">—</span>`;
            if (disc > 0) {
                const isAmount = (itemDiscType === "amount" || itemDiscType === "$");
                const displayValue = isAmount ? `${currency}${fmt(disc)}` : `${fmt(disc)}%`;
                itemDiscDisplay = `<span style="color:#EF4444;font-size:11px;font-weight:500;">${displayValue}</span>`;
            }

            const rowBg = i % 2 !== 0 ? '#FAFBFF' : '#FFFFFF';
            const unitTypeStr = item.unit_type ? item.unit_type.trim() : '';

            return `
            <tr style="background:${rowBg};vertical-align:middle;">
                <td class="col-desc" style="width:48%;padding:10px 8px;text-align:left;border-bottom:1px solid #E5E7EB;font-size:11px;color:#374151;word-break:break-word;">
                    <div style="font-weight:600;color:#111827;font-size:11px;">${item.remarks || item.item_name || "—"}</div>
                    <div style="font-size:10px;color:#6B7280;margin-top:2px;">
                        Period: ${formatDate(item.start_date)} – ${formatDate(item.end_date)} (${qty} ${unitTypeStr})
                    </div>
                </td>
                <td class="col-num" style="width:13%;padding:10px 8px;text-align:right;color:#374151;font-size:11px;border-bottom:1px solid #EEF0F5;word-break:break-word;">${currency}${fmt(price)}</td>
                <td class="col-num" style="width:13%;padding:10px 8px;text-align:right;font-size:11px;border-bottom:1px solid #EEF0F5;word-break:break-word;">${itemDiscDisplay}</td>
                <td class="col-num" style="width:13%;padding:10px 8px;text-align:right;color:#374151;font-size:11px;border-bottom:1px solid #EEF0F5;word-break:break-word;">${tax > 0 ? `${fmt(tax)}%` : "—"}</td>
                <td class="col-num" style="width:13%;padding:10px 8px;text-align:right;font-weight:700;color:#1A3D91;font-size:11px;border-bottom:1px solid #EEF0F5;word-break:break-word;">${currency}${fmt(total)}</td>
            </tr>`;
        }).join("");

        return `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
                    .pi-root {
                        font-family: 'Inter', sans-serif !important;
                        color: #1f2937;
                        background: #fff;
                        max-width: 100%;
                    }
                    .pi-action-bar button {
                        cursor: pointer;
                        font-family: 'Inter', sans-serif !important;
                        font-size: 13px;
                        font-weight: 500;
                        letter-spacing: 0.3px;
                        transition: all 0.2s ease;
                    }
                    .pi-action-bar button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    }
                    .pi-tbl-wrap { overflow-x: auto; }
                    .pi-table {
                        width: 100%;
                        border-collapse: collapse;
                        min-width: 100%;
                        table-layout: fixed;
                    }
                    .pi-table th.col-desc { width: 48%; }
                    .pi-table th.col-num { width: 13%; }
                    .pi-table thead th {
                        padding: 10px 8px;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        color: #6B7280;
                        background: #F8FAFF;
                        border-bottom: 2px solid #E5E9F5;
                        word-break: break-word;
                    }
                    .pi-table tbody tr:hover { background: #F0F4FF !important; }
                    .pi-totals-row td {
                        padding: 12px 14px;
                        font-size: 11px;
                        border-top: 1px solid #E5E9F5;
                    }
                </style>

                <div class="pi-root" id="pi-invoice-content">

                    <div class="pi-avoid-break" style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:16px 20px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
                        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);pointer-events:none;"></div>
                        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

                        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;">
                            <div style="width:70px;height:76px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                                <img src="${companyLogo}" alt="Logo"
                                    style="width:60px;height:63px;object-fit:contain;"
                                    onerror="this.parentElement.innerHTML='<span style=\'font-size:22px;font-weight:900;color:#fff;font-family:Inter,sans-serif;\'>M</span>'">
                            </div>
                            <div>
                                <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">${companyName}</div>
                                <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px;">
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                        ${email}
                                    </div>
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                        ${phone}
                                    </div>
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                        ${address}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="text-align:right;position:relative;">
                            <div style="font-family:'Inter',sans-serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.7px;line-height:1.1;">INVOICE</div>
                            <div style="font-size:16px;font-weight:700;color:#FDE68A;margin-top:2px;letter-spacing:0.3px;">${invoice.code || "—"}</div>
                            
                            ${showPmtStatus ? `
                            <div style="display:inline-block;margin-top:6px;padding:4px 12px;border-radius:20px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                                ${statusLabel}
                            </div>
                            ` : ''}
                        </div>
                    </div>

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

                    <div class="pi-tbl-wrap">
                        <table class="pi-table">
                            <thead>
                                <tr>
                                    <th class="col-desc" style="text-align:left;">Description</th>
                                    <th class="col-num" style="text-align:right;">Unit Price</th>
                                    <th class="col-num" style="text-align:right;">Discount</th>
                                    <th class="col-num" style="text-align:right;">Tax</th>
                                    <th class="col-num" style="text-align:right;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemRows || `<tr><td colspan="5" style="text-align:center;padding:48px;color:#9CA3AF;font-size:11px;">No items found</td></tr>`}
                            </tbody>
                        </table>
                    </div>

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

                    ${invoice.general_remark ? `
                    <div class="pi-avoid-break" style="margin:8px 0px 16px;padding:12px 16px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:0 8px 8px 0;">
                        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#92400E;margin-bottom:4px;">Remarks</div>
                        <div style="font-size:11px;color:#78350F;line-height:1.5;">${invoice.general_remark}</div>
                    </div>` : ""}

                    ${showSign ? `
                    <div class="pi-avoid-break" style="display:flex;justify-content:space-between;margin-top:10px; padding:24px 60px 16px;gap:120px; border-top:1px solid #E5E9F5">
                        <div style="flex:1;text-align:center;">
                            <div style="font-size:11px;color:#6B7280;margin-bottom:36px;">Customer's Signature </div>
                            <div style="border-bottom:1px dashed #E5E9F5;"></div>
                        </div>
                        <div style="flex:1;text-align:center;">
                            <div style="font-size:11px;color:#6B7280;margin-bottom:36px;">Authorized Signature</div>
                            <div style="border-bottom:1px dashed #E5E9F5;"></div>
                        </div>
                    </div>
                    ` : ''}

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

                    <div class="pi-action-bar" style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid #E5E9F5;background:#fff;">
                        <button id="pi-print-btn"
                            style="padding:9px 20px;border-radius:8px;border:1.5px solid #1A3D91;background:#fff;color:#1A3D91;font-weight:600;display:inline-flex;align-items:center;gap:7px;">
                            <i class="bi bi-printer-fill"></i> Print Invoice
                        </button>
                        <button id="pi-download-btn"
                            style="padding:9px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#0F2060,#1A3D91);color:#fff;font-weight:600;display:inline-flex;align-items:center;gap:7px;box-shadow:0 2px 8px rgba(15,32,96,0.25);">
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
        console.log(222, op);

        if (!op || !op.invoice_id) {
            cv_interact?.error("Invoice ID is missing");
            return;
        }

        const dlg = new GeneralDialog({
            title: "Tax Invoice",
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div name="pi_container" style="min-height:280px;border-radius:8px;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:center;padding:80px 0;gap:14px;color:#6B7280;font-size:13px;">
                        <div style="width:28px;height:28px;border:3px solid #E5E9F5;border-top-color:#1A3D91;border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
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