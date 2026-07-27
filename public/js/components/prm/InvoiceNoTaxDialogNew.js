const InvoiceNoTaxDialogNew = (() => {
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

    /* ── Direct PDF Download or Print Fallback ── */
    const downloadPDF = (invoiceEl, filename = "Invoice.pdf") => {
        if (typeof html2pdf !== "undefined") {
            const actionBar = invoiceEl.querySelector('.pi-action-bar');
            if (actionBar) actionBar.style.display = 'none';

            const opt = {
                margin:       8,
                filename:     filename,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(invoiceEl).save().then(() => {
                if (actionBar) actionBar.style.display = 'flex';
            }).catch(() => {
                if (actionBar) actionBar.style.display = 'flex';
            });
        } else {
            printViaIframe(invoiceEl);
        }
    };

    /* ── Print via hidden iframe (A4 Portrait Optimized) ── */
    const printViaIframe = (invoiceEl) => {
        const styleHTML = Array.from(document.querySelectorAll("style")).map(s => s.outerHTML).join("\n");
        const biLink = Array.from(document.querySelectorAll('link[href*="bootstrap-icons"]')).map(l => l.outerHTML).join("\n");
        
        const fontLink = `
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;
        
        const fullDoc = `<!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
            ${fontLink}${biLink}${styleHTML}
            <style>
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Inter', sans-serif;
                    background: #fff;
                    color: #111827;
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
                .pi-action-bar { display: none !important; }

                @page { 
                    size: A4 portrait; 
                    margin: 8mm; 
                }
                
                @media print {
                    body { 
                        background: #fff !important; 
                        margin: 0 !important; 
                        padding: 0 !important;
                        font-family: 'Inter', sans-serif !important;
                        font-size: 12px !important;
                        -webkit-font-smoothing: antialiased;
                    }
                    
                    #pi-invoice-content {
                        width: 100% !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                    }

                    /* ── Enforce 1rem Padding When Printing ── */
                    .pi-table thead th,
                    .pi-table tbody td,
                    .pi-totals-row td,
                    .pi-root > div,
                    .pi-action-bar {
                        padding: 1rem !important;
                    }

                    /* ── Font Adjustments for Print ── */
                    h1, .header-title { font-size: 20px !important; }
                    .company-name { font-size: 16px !important; }
                    .invoice-num { font-size: 14px !important; }
                    .section-label { font-size: 10px !important; }
                    
                    .pi-table thead th { 
                        font-size: 11px !important; 
                    }
                    .pi-table tbody td { 
                        font-size: 12px !important; 
                    }
                    .pi-totals-row td { 
                        font-size: 12px !important; 
                    }

                    .pi-action-bar { display: none !important; }
                    .pi-tbl-wrap { overflow: visible !important; }
                    .pi-table { width: 100% !important; min-width: 100% !important; table-layout: fixed !important; }
                    
                    strong, b, [style*="font-weight:600"], [style*="font-weight:700"], [style*="font-weight:800"] {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
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
        
        const triggerPrint = () => {
            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => document.body.removeChild(iframe), 2000);
            }, 400);
        };

        iframe.onload = () => {
            if (iframe.contentWindow.document.fonts) {
                iframe.contentWindow.document.fonts.ready.then(triggerPrint);
            } else {
                triggerPrint();
            }
        };
    };

    const buildInvoiceHTML = (invoice = {}, setting = {}, company = {}) => {
        const subTotal      = parseFloat(invoice.amount         || 0);
        const totalDiscount = parseFloat(invoice.discount_value || 0);
        const netTotal      = parseFloat(invoice.amount_payable || 0);
        const paid          = parseFloat(invoice.paid_amount    || 0);
        const balance       = parseFloat(invoice.due_amount     || 0);

        const showPmtStatus  = setting?.show_pmt_status;
        const showBalance    = setting?.show_balance;
        const showAmountPaid = setting?.show_amount_paid;
        const QR_file        = setting?.QR_file;
        const qr_file_name   = setting?.qr_file_name;
        const showSign       = setting?.show_sign;

        const companyLogo          = company?.logo_url || "";
        const companyName          = company?.name || company?.company_name || "Company Name";
        const companyContactPerson = company?.first_cp_name || "";
        const companyContactEmail  = company?.first_cp_email || company?.email || "";
        const companyContactPhone  = company?.first_cp_phone || company?.phone || "";
        const companyAddress       = company?.address || "";

        const discType     = (invoice.discount_type || "percent").toLowerCase();
        const isAmountDisc = (discType === "amount" || discType === "$");
        let discDisplay = `<span style="color:#9CA3AF;font-size:13px;">—</span>`;
        if (totalDiscount > 0) {
            discDisplay = `<span style="color:#DC2626;font-size:13px;font-weight:600;">
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
            const qty   = parseFloat(item.qty   || 1);
            const price = parseFloat(item.price || 0);
            const total = parseFloat(item.total || (qty * price));
            const disc  = parseFloat(item.discount || item.special_discount_value || 0);

            const itemDiscType = (item.discount_type || item.special_discount_type || "percent").toLowerCase();

            let itemDiscDisplay = `<span style="color:#9CA3AF;font-size:13px;">—</span>`;
            if (disc > 0) {
                const isAmount = (itemDiscType === "amount" || itemDiscType === "$");
                const displayValue = isAmount ? `${currency}${fmt(disc)}` : `${fmt(disc)}%`;
                itemDiscDisplay = `<span style="color:#DC2626;font-size:13px;font-weight:600;">${displayValue}</span>`;
            }

            const rowBg = i % 2 !== 0 ? "#F9FAFB" : "#FFFFFF";

            return `
            <tr style="background:${rowBg};">
               <td style="width:36%;padding:1rem;text-align:left;border-bottom:1px solid #E5E7EB;font-size:13px;color:#374151;line-height:1.5;">
                    <div style="font-weight:600;color:#111827;">${item.remarks || item.item_name || "—"}</div>
                    <div style="font-size:12px;color:#6B7280;margin-top:2px;">
                        Period: ${formatDate(item.start_date)} – ${formatDate(item.end_date)}
                    </div>
                </td>
                <td style="width:16%;padding:1rem;text-align:center;border-bottom:1px solid #E5E7EB;font-size:13px;color:#4B5563;">
                    ${qty} ${item.unit_type ? item.unit_type.trim() : ""}
                </td>
                <td style="width:16%;padding:1rem;text-align:right;border-bottom:1px solid #E5E7EB;font-size:13px;color:#4B5563;">
                    ${currency}${fmt(price)}
                </td>
                <td style="width:16%;padding:1rem;text-align:right;border-bottom:1px solid #E5E7EB;">
                    ${itemDiscDisplay}
                </td>
                <td style="width:16%;padding:1rem;text-align:right;border-bottom:1px solid #E5E7EB;font-size:14px;font-weight:700;color:#111827;">
                    ${currency}${fmt(total)}
                </td>
            </tr>`;
        }).join("");

        const descTrans   = typeof LocaleManager !== "undefined" ? LocaleManager.trans('Description', 'titles') : 'Description';
        const qtyTrans    = typeof LocaleManager !== "undefined" ? LocaleManager.trans('Qty', 'titles') : 'Qty';
        const priceTrans  = typeof LocaleManager !== "undefined" ? LocaleManager.trans('Unit Price', 'titles') : 'Unit Price';
        const discTrans   = typeof LocaleManager !== "undefined" ? LocaleManager.trans('Discount', 'titles') : 'Discount';
        const totalTrans  = typeof LocaleManager !== "undefined" ? LocaleManager.trans('Total', 'titles') : 'Total';

        return `
            <style>
                .pi-root {
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    background: #ffffff;
                    color: #111827;
                    width: 100%;
                }
                .pi-action-bar button {
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 6px;
                    padding: 9px 18px;
                    transition: all 0.15s ease-in-out;
                }
                .pi-action-bar button:hover { opacity: 0.9; transform: translateY(-1px); }
                .pi-tbl-wrap { width: 100%; overflow-x: auto; }
                .pi-table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }
                .pi-table thead th {
                    padding: 1rem;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    color: #4B5563;
                    background: #F3F4F6;
                    border-bottom: 2px solid #E5E7EB;
                }
                .pi-totals-row td {
                    padding: 1rem;
                    font-size: 13px;
                    border-top: 1px solid #E5E7EB;
                }
            </style>

            <div class="pi-root" id="pi-invoice-content">
                <!-- Header Container -->
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
                                <div class="company-name" style="font-family:'Inter',serif;font-size:20px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">${companyName}</div>
                                <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px;">
                                    ${companyContactEmail ? `<div style="font-size:11px;color:rgba(255,255,255,0.85);">${companyContactEmail}</div>` : ''}
                                    ${companyContactPhone ? `<div style="font-size:11px;color:rgba(255,255,255,0.85);">${companyContactPhone}</div>` : ''}
                                    ${companyAddress ? `<div style="font-size:11px;color:rgba(255,255,255,0.85);">${companyAddress}</div>` : ''}
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

                    

                <!-- Customer & Info Bar -->
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

                <!-- Table Content -->
                <div class="pi-tbl-wrap">
                    <table class="pi-table">
                        <thead>
                            <tr>
                                <th style="width: 36%; text-align: left;">${descTrans}</th>
                                <th style="width: 16%; text-align: center;">${qtyTrans}</th>
                                <th style="width: 16%; text-align: right;">${priceTrans}</th>
                                <th style="width: 16%; text-align: right;">${discTrans}</th>
                                <th style="width: 16%; text-align: right;">${totalTrans}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows || `<tr><td colspan="5" style="text-align: center; padding: 1rem; color: #9CA3AF; font-size: 13px;">No items found</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <!-- Totals & QR Code -->
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

                <!-- General Remarks -->
                ${invoice.general_remark ? `
                <div style="margin: 0 1rem 1rem; padding: 1rem; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 0 6px 6px 0;">
                    <div class="section-label" style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #92400E; margin-bottom: 2px;">Remarks</div>
                    <div style="font-size: 12px; color: #78350F; line-height: 1.4;">${invoice.general_remark}</div>
                </div>` : ""}

                <!-- Signatures -->
                ${showSign ? `
                <div style="display: flex; justify-content: space-between; margin: 1rem 1rem 0; padding: 1rem; gap: 80px; border-top: 1px solid #E2E8F0;">
                    <div style="flex: 1; text-align: center;">
                        <div style="font-size: 11px; font-weight: 500; color: #64748B; margin-bottom: 36px;">Customer's Signature</div>
                        <div style="border-bottom: 1px dashed #CBD5E1;"></div>
                    </div>
                    <div style="flex: 1; text-align: center;">
                        <div style="font-size: 11px; font-weight: 500; color: #64748B; margin-bottom: 36px;">Authorized Signature</div>
                        <div style="border-bottom: 1px dashed #CBD5E1;"></div>
                    </div>
                </div>` : ''}

                <!-- Footer / Terms -->
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

                <!-- Modal Action Bar -->
                <div class="pi-action-bar" style="display: flex; justify-content: flex-end; gap: 12px; padding: 1rem 0 0; background: #FFFFFF;">
                    <button id="pi-print-btn" style="border: 1.5px solid #1E3A8A; background: #FFFFFF; color: #1E3A8A;">
                        <i class="bi bi-printer-fill"></i> Print Invoice
                    </button>
                    <button id="pi-download-btn" style="border: none; background: linear-gradient(135deg, #0F172A, #1E3A8A); color: #FFFFFF;">
                        <i class="bi bi-download"></i> Download PDF
                    </button>
                </div>
            </div>`;
    };

    const wireButtons = (container, invoiceCode) => {
        const invoiceEl   = container.querySelector("#pi-invoice-content");
        const printBtn    = container.querySelector("#pi-print-btn");
        const downloadBtn = container.querySelector("#pi-download-btn");
        
        if (printBtn) {
            printBtn.addEventListener("click", () => printViaIframe(invoiceEl));
        }
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => downloadPDF(invoiceEl, `Invoice_${invoiceCode || 'document'}.pdf`));
        }
    };

    self.show = (op) => {
        if (!op || (!op.invoice_id && !op.invoice?.id)) {
            if (typeof cv_interact !== "undefined" && cv_interact.error) {
                cv_interact.error("Invoice ID is missing");
            } else {
                alert("Invoice ID is missing");
            }
            return;
        }

        const titleText = typeof LocaleManager !== "undefined" 
            ? LocaleManager.trans('No Tax Invoice', 'titles') 
            : 'No Tax Invoice';

        const dlg = new GeneralDialog({
            title: titleText,
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div name="pi_container" style="min-height:280px;border-radius:8px;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:center;padding:80px 0;gap:14px;color:#6B7280;font-size:13px;font-family:'Inter',sans-serif;">
                        <div style="width:28px;height:28px;border:3px solid #E5E5E5;border-top-color:#1A3D91;border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
                        Loading invoice…
                    </div>
                    <style>@keyframes pi-spin{to{transform:rotate(360deg)}}</style>
                </div>`,
            contentCreated: (me) => {
                const container = me.divModal.querySelector('[name="pi_container"]');
                container.innerHTML = buildInvoiceHTML(op.invoice, op.setting, op.company);
                wireButtons(container, op.invoice?.code);
            },
            buttons: [{ label: '<span vslang="buttons.Close">Close</span>', cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });
        dlg.show(op);
    };

    return self;
})();