const InvoiceNoTaxDialog = (() => {
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
        
        // Ensure all required weights (400 to 800) are requested
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
                        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
                        body {
                            font-family: 'Inter', sans-serif;
                            background: #fff;
                            color: #111;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .pi-action-bar { display:none!important; }
                        @page { size: A4 landscape; margin: 1rem; }
                        
                        /* Strict Print Styles to enforce font weights */
                        @media print {
                            body { 
                                background: #fff !important; 
                                margin: 8mm; 
                                font-family: 'Inter', sans-serif !important;
                                -webkit-font-smoothing: antialiased;
                                -moz-osx-font-smoothing: grayscale;
                            }
                            .pi-action-bar { display:none!important; }
                            .pi-tbl-wrap { overflow: visible !important; }
                            .pi-table { min-width: unset !important; }
                            
                            /* Enforce crisp rendering for bold elements on paper */
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
        
        iframe.onload = () => {
            // Use an explicit check for the font loading API to avoid premature printing
            if (iframe.contentWindow.document.fonts) {
                iframe.contentWindow.document.fonts.ready.then(() => {
                    setTimeout(() => {
                        iframe.contentWindow.focus();
                        iframe.contentWindow.print();
                        setTimeout(() => document.body.removeChild(iframe), 2000);
                    }, 400);
                });
            } else {
                // Fallback if document.fonts isn't supported by the client browser
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                    setTimeout(() => document.body.removeChild(iframe), 2000);
                }, 800);
            }
        };
    };

    const buildInvoiceHTML = (invoice, setting) => {
        const subTotal      = parseFloat(invoice.amount         || 0);
        const totalDiscount = parseFloat(invoice.discount_value || 0);
        const netTotal      = parseFloat(invoice.amount_payable || 0);
        const paid          = parseFloat(invoice.paid_amount    || 0);
        const balance       = parseFloat(invoice.due_amount     || 0);

        // Visibility Settings mapped from settings
        const showPayStatus  = setting.show_pay_status;
        const showBalance    = setting.show_balance;
        const showAmountPaid = setting.show_amount_paid;
        const QR_file        = setting.QR_file;
        const QR_file_name      = setting.QR_file_name;

        const buildRepresentation  = setting.build_representative ;
        const representativePhone  = setting.representative_phone;
        const representativeAddress  = setting.representative_address;

        const discType     = (invoice.discount_type || "percent").toLowerCase();
        const isAmountDisc = (discType === "amount" || discType === "$");
        let discDisplay = `<span style="color:#9CA3AF;font-size:12px;">—</span>`;
        if (totalDiscount > 0) {
            discDisplay = `<span style="color:#DC2626;font-size:12px;font-weight:600;">
                ${isAmountDisc ? currency : ''}${fmt(totalDiscount)}${!isAmountDisc ? '%' : ''}
            </span>`;
        }

        const statusLabel = balance <= 0 ? "PAID" : (paid > 0 ? "PARTIALLY PAID" : "UNPAID");
        const statusColor = balance <= 0 ? "#166534" : (paid > 0 ? "#92400E" : "#991B1B");
        const statusBg    = balance <= 0 ? "#DCFCE7" : (paid > 0 ? "#FEF3C7" : "#FEE2E2");

        const typeConfig = {
            rent:    { bg: "#EFF6FF", fg: "#1D4ED8", dot: "#3B82F6" },
            utility: { bg: "#FFF7ED", fg: "#C2410C", dot: "#F97316" },
            service: { bg: "#F0FDF4", fg: "#166534", dot: "#22C55E" },
        };
              
        const validItems = (invoice.items || []).filter(
            (item) => parseFloat(item.price || 0) > 0 || parseFloat(item.total || 0) > 0
        );
        
        const itemRows = validItems.map((item, i) => {
            const qty   = parseFloat(item.qty   || 1);
            const price = parseFloat(item.price || 0);
            const total = parseFloat(item.total || (qty * price));
            const disc  = parseFloat(item.discount || item.special_discount_value || 0);

            const itemDiscType = (item.discount_type || item.special_discount_type || "percent").toLowerCase();
            const rawType = (item.type || "service").toLowerCase();
            const cfg = typeConfig[rawType] || typeConfig.service;

            let itemDiscDisplay = `<span style="color:#9CA3AF;font-size:12px;">—</span>`;
            if (disc > 0) {
                const isAmount = (itemDiscType === "amount" || itemDiscType === "$");
                const displayValue = isAmount ? `${currency}${fmt(disc)}` : `${fmt(disc)}%`;
                itemDiscDisplay = `<span style="color:#DC2626;font-size:12px;font-weight:600;">${displayValue}</span>`;
            }

            const rowBg = i % 2 !== 0 ? "#FAFAFA" : "#FFFFFF";

            return `
            <tr style="background:${rowBg};">
                <td style="padding:10px 24px;text-align:start;border-bottom:1px solid #EEF0F5;font-size:12px;color:#555;">
                    ${item.remarks || item.item_name  || "—"}
                </td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:12px;color:#555;">${qty} ${item.unit_type ? item.unit_type.trim() : " "}</td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:11px;color:#777;">${formatDate(item.start_date)}</td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:11px;color:#777;">${formatDate(item.end_date)}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;font-size:12px;color:#333;">${currency}${fmt(price)}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;">${itemDiscDisplay}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;font-size:13px;font-weight:700;color:#111;">${currency}${fmt(total)}</td>
            </tr>`;
        }).join("");

        return `
            <style>
                .pi-root {
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    background: #fff;
                    color: #111;
                    max-width: 100%;
                }
                .pi-action-bar button {
                    cursor: pointer;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .pi-action-bar button:hover { opacity: 0.8; }
                .pi-tbl-wrap { overflow-x: auto; }
                .pi-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 820px;
                }
                .pi-table thead th {
                    padding: 10px 24px;
                    font-size: 10.5px;
                    font-weight: 600;
                    letter-spacing: 0.8px;
                    text-transform: uppercase;
                    color: #6B7280;
                    background: #F8FAFF;
                    border-bottom: 2px solid #E5E9F5;
                    font-family: 'Inter', sans-serif;
                }
                .pi-table thead th:first-child { text-align: left; }
                .pi-table thead th:nth-child(2),
                .pi-table thead th:nth-child(3),
                .pi-table thead th:nth-child(4),
                .pi-table thead th:nth-child(5) { text-align: center; }
                .pi-table thead th:nth-child(6),
                .pi-table thead th:nth-child(7),
                .pi-table thead th:nth-child(8) { text-align: right; }
                .pi-table tbody tr:hover { background: #F0F4FF !important; }
                .pi-totals-row td {
                    padding: 10px 16px;
                    font-size: 13px;
                    border-top: 1px solid #EBEBEB;
                    font-family: 'Inter', sans-serif;
                }
            </style>

            <!--<div class="pi-root" id="pi-invoice-content">

                <div style="padding:0px 32px 16px 32px;border-bottom:2px solid #E5E9F5;display:flex;justify-content:space-between;align-items:center;">
                    <div style="display:flex;align-items:center;gap:14px;">
                        <div style="display:flex;flex-direction:column;gap:2px;">
                            <div style="font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1A3D91;font-family:'Inter',sans-serif;">INVOICE</div>
                            <div style="font-size:14px;font-weight:700;color:#1A3D91;letter-spacing:0.2px;font-family:'Inter',sans-serif;">
                                ${buildRepresentation}
                            </div>
                             <div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">
                                ${representativePhone}
                            </div>
                             <div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">
                                ${representativeAddress}
                            </div>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
                        <div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;font-family:'Inter',sans-serif;">Invoice No.</div>
                        <div style="font-size:18px;font-weight:800;color:#0F2060;font-family:'Inter',sans-serif;">${invoice.code || "—"}</div>
                        
                        <div style="display:${showPayStatus ? 'block' : 'none'}; padding:4px 14px;border-radius:99px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',sans-serif;">
                            ${statusLabel}
                        </div>
                    </div>
                </div> -->

                <div class="pi-root" id="pi-invoice-content">

                    <div style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
                        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);pointer-events:none;"></div>
                        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

                        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;">
                            
                            <div>
                                <div style="font-family:'Inter',serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">Invoice</div>
                                <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px;">
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                         ${buildRepresentation}
                                    </div>
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                        ${representativePhone}
                                    </div>
                                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                                        ${representativeAddress}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="text-align:right;position:relative;">
                            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:6px;letter-spacing:0.5px;text-transform:uppercase;">Invoice Number</div>
                            <div style="font-size:16px;font-weight:700;color:#FDE68A;margin-top:2px;letter-spacing:0.3px;">${invoice.code || "—"}</div>
                            
                            ${showPayStatus ? `
                            <div style="display:inline-block;margin-top:6px;padding:4px 12px;border-radius:20px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                                ${statusLabel}
                            </div>
                            ` : ''}
                        </div>
                    </div>

                <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px 32px;border-bottom:1px solid #E8E8E8;background:#FAFBFF;">
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#9CA3AF;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.8px;font-family:'Inter',sans-serif;">Customer</div>
                        <div style="font-size:14px;font-weight:600;color:#111;margin-bottom:3px;font-family:'Inter',sans-serif;">${invoice.tenant_name || "—"}</div>
                        ${invoice.space_code   ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">Space: ${invoice.space_code}</div>` : ""}
                        ${invoice.tenant_email ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">${invoice.tenant_email}</div>` : ""}
                        ${invoice.tenant_phone ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">${invoice.tenant_phone}</div>` : ""}
                    </div>
                    <div style="padding:18px 0px;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;min-width:160px;text-align:right;">
                        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:3px;">Due Date</div>
                        <div style="font-size:15px;font-weight:600;color:#111827;">${formatDate(invoice.due_date)}</div>
                    </div>
                </div>

                <div class="pi-tbl-wrap">
                    <table class="pi-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Description</th>
                                <th style="text-align:center;">Qty</th>
                                <th style="text-align:center;">Start</th>
                                <th style="text-align:center;">End</th>
                                <th style="text-align:right;">Unit Price</th>
                                <th style="text-align:right;">Discount</th>
                                <th style="text-align:right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows || `<tr><td colspan="7" style="text-align:center;padding:48px;color:#999;font-size:13px;font-family:'Inter',sans-serif;">No items found</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:24px 0px;gap:16px;">

                        ${QR_file_name != null && QR_file
                            ? `<div style="width:100px;height:100px;border:1px solid #E5E9F5;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.03);flex-shrink:0;">
                                    <img src="${QR_file}" alt="QR Code" style="width:100px;height:100px;object-fit:contain;" />
                            </div>`
                            : ''
                        }

                        <div style="flex:1;"></div>

                        <div style="width:340px;flex-shrink:0;border:1px solid #E5E9F5;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
                            <table style="width:100%;border-collapse:collapse;">
                                <tr class="pi-totals-row">
                                    <td style="padding:12px 16px;color:#666;">Sub Total</td>
                                    <td style="padding:12px 16px;text-align:right;font-weight:600;">${currency}${fmt(subTotal)}</td>
                                </tr>
                                <tr class="pi-totals-row">
                                    <td style="padding:12px 16px;color:#DC2626;">
                                        Discount ${totalDiscount > 0 ? `(${discDisplay})` : ''}
                                    </td>
                                    <td style="padding:12px 16px;text-align:right;font-weight:600;color:#DC2626;">
                                        ${currency}${fmt(subTotal - netTotal)}
                                    </td>
                                </tr>
                                <tr class="pi-totals-row" style="background:#F8FAFF;border-top:2px solid #E5E9F5;">
                                    <td style="padding:12px 16px;color:#111;font-weight:700;">Total (Net)</td>
                                    <td style="padding:12px 16px;text-align:right;font-weight:700;color:#111;font-size:14px;">${currency}${fmt(netTotal)}</td>
                                </tr>
                                ${showAmountPaid ? `
                                <tr class="pi-totals-row">
                                    <td style="padding:12px 16px;color:#059669;">Amount Paid</td>
                                    <td style="padding:12px 16px;text-align:right;font-weight:600;color:#059669;">${currency}${fmt(paid)}</td>
                                </tr>
                                ` : ''}
                                ${showBalance ? `
                                <tr style="background:linear-gradient(135deg,#0F2060,#1A3D91);">
                                    <td style="padding:14px 16px;color:#fff;font-weight:700;">Balance Due</td>
                                    <td style="padding:14px 16px;text-align:right;font-weight:800;color:#FDE68A;font-size:16px;">${currency}${fmt(balance)}</td>
                                </tr>
                                ` : ''}
                            </table>
                        </div>

                    </div>

                ${invoice.general_remark ? `
                <div style="margin:8px 0px 16px;padding:12px 16px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:0 8px 8px 0;">
                    <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#92400E;margin-bottom:4px;">Remarks</div>
                    <div style="font-size:12px;color:#78350F;line-height:1.5;">${invoice.general_remark}</div>
                </div>` : ""}

                <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:14px 24px;background:#F8FAFF;border-top:1px solid #E5E9F5;flex-wrap:wrap;gap:12px;">
                    <div>
                        <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1A3D91;margin-bottom:4px;">Terms &amp; Conditions</div>
                        <div style="font-size:10px;color:#9CA3AF;line-height:1.6;">Payment is due by the date shown above.<br>Late payments may incur additional charges.</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:10px;color:#9CA3AF;">Generated by Landlord</div>
                        <div style="font-size:11px;font-weight:600;color:#4B5563;margin-top:2px;">${formatDate(invoice.issue_date)}</div>
                    </div>
                </div>
                <div class="pi-action-bar" style="display:flex;justify-content:flex-end;gap:10px;padding:14px 0px;border-top:1px solid #EBEBEB;background:#fff;">
                    <button id="pi-print-btn"
                        style="padding:9px 20px;border-radius:8px;border:1.5px solid #1A3D91;background:#fff;color:#1A3D91;font-weight:600;display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;">
                        <i class="bi bi-printer-fill"></i> Print Invoice
                    </button>
                    <button id="pi-download-btn"
                        style="padding:9px 20px;border-radius:8px;border:none;background:linear-gradient(135deg,#0F2060,#1A3D91);color:#fff;font-weight:600;display:inline-flex;align-items:center;gap:7px;font-family:'Inter',sans-serif;">
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
        console.log(333, op);
        if (!op || !op.invoice_id) {
            cv_interact?.error("Invoice ID is missing");
            return;
        }

        const dlg = new GeneralDialog({
            title: "No Tax Invoice",
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
                container.innerHTML = buildInvoiceHTML(op.invoice, op.setting);
                wireButtons(container);
            },
            buttons: [{ label: "Close", cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });
        dlg.show(op);
    };

    return self;
})();