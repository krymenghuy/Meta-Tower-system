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
                        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
                        body {
                            font-family: 'Inter', sans-serif;
                            background: #fff;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .pi-action-bar { display:none!important; }
                        @page { size: A4 portrait; margin: 1rem; }
                        @media print {
                            body { background: #fff !important; }
                            .pi-action-bar { display:none!important; }
                            .pi-tbl-wrap { overflow: visible !important; }
                            .pi-table { min-width: unset !important; }
                            .pi-footer-svg { display:block!important; }
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

    const buildInvoiceHTML = (invoice) => {
        const validItems = (invoice.items || []).filter(
            (item) => parseFloat(item.price || 0) > 0 || parseFloat(item.total || item.amount || 0) > 0
        );

        let grandTotal = 0;
        validItems.forEach((item) => {
            const itemTotal = parseFloat(item.total || item.amount || 0);
            grandTotal += itemTotal > 0 ? itemTotal : parseFloat(item.qty || 1) * parseFloat(item.price || 0);
        });

        const paid    = parseFloat(invoice.paid_amount || 0);
        const balance = Math.max(0, grandTotal - paid);
        const today   = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        const statusLabel = balance <= 0 ? "PAID" : (paid > 0 ? "PARTIALLY PAID" : "UNPAID");
        const statusColor = balance <= 0 ? "#166534" : (paid > 0 ? "#92400E" : "#991B1B");
        const statusBg    = balance <= 0 ? "#DCFCE7" : (paid > 0 ? "#FEF3C7" : "#FEE2E2");

        const typeConfig = {
            rent:    { bg: "#EFF6FF", fg: "#1D4ED8", dot: "#3B82F6" },
            utility: { bg: "#FFF7ED", fg: "#C2410C", dot: "#F97316" },
            service: { bg: "#F0FDF4", fg: "#166534", dot: "#22C55E" },
        };

        const itemRows = validItems.map((item, i) => {
            const qty      = parseFloat(item.qty || 1);
            const price    = parseFloat(item.price || 0);
            const total    = parseFloat(item.total || item.amount || (qty * price));
            const rawType  = (item.type || "service").toLowerCase();
            const disc     = parseFloat(item.discount || item.special_discount_value || 0);
            const discType = (item.discount_type || item.special_discount_type || "percent").toLowerCase();
            const cfg      = typeConfig[rawType] || typeConfig.service;

            let discDisplay = `<span style="color:#9CA3AF;font-size:12px;">—</span>`;
            if (disc > 0) {
                const isAmount = (discType === "amount" || discType === "$");
                const displayValue = isAmount ? `${currency}${fmt(disc)}` : `${fmt(disc)}%`;
                discDisplay = `<span style="color:#DC2626;font-size:12px;font-weight:600;">${displayValue}</span>`;
            }

            const rowBg = i % 2 !== 0 ? "#FAFAFA" : "#FFFFFF";

            return `
            <tr style="background:${rowBg};">
                <td style="padding:10px 24px;border-bottom:1px solid #EEF0F5;font-size:12.5px;font-weight:500;color:#111;">
                    ${item.description || item.remarks || item.item_name || "—"}
                </td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;">
                    <span style="display:inline-flex;align-items:center;gap:4px;background:${cfg.bg};color:${cfg.fg};padding:2px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;">
                        <span style="width:5px;height:5px;border-radius:50%;background:${cfg.dot};flex-shrink:0;"></span>
                        ${rawType}
                    </span>
                </td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:12px;color:#555;">${qty}</td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:12px;color:#555;">${item.unit_type ? item.unit_type.trim() : "—"}</td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:11px;color:#777;">${formatDate(item.start_date)}</td>
                <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #EEF0F5;font-size:11px;color:#777;">${formatDate(item.end_date)}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;font-size:12px;color:#333;">${currency}${fmt(price)}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;">${discDisplay}</td>
                <td style="padding:10px 24px;text-align:right;border-bottom:1px solid #EEF0F5;font-size:13px;font-weight:700;color:#111;">${currency}${fmt(total)}</td>
            </tr>`;
        }).join("");

        return `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

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
                .pi-table thead th:nth-child(5),
                .pi-table thead th:nth-child(6) { text-align: center; }
                .pi-table thead th:nth-child(7),
                .pi-table thead th:nth-child(8),
                .pi-table thead th:nth-child(9) { text-align: right; }
                .pi-table tbody tr:hover { background: #F0F4FF !important; }
                .pi-totals-row td {
                    padding: 10px 16px;
                    font-size: 13px;
                    border-top: 1px solid #EBEBEB;
                    font-family: 'Inter', sans-serif;
                }
                .pi-footer-svg {
                    display: block;
                    width: 100%;
                    height: 90px;
                    margin-top: 8px;
                }
            </style>

            <div class="pi-root" id="pi-invoice-content">

                <!-- ═══ HEADER BAND ═══ -->
                <div style="padding:0px 32px 16px 32px;border-bottom:2px solid #E5E9F5;display:flex;justify-content:space-between;align-items:center;">

                    <!-- LEFT: Logo + Title + Company stacked -->
                    <div style="display:flex;align-items:center;gap:14px;">
                        <!-- Logo -->
                        <div style="width:80px;height:80px;display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;border-radius:10px;border:1.5px solid #E5E9F5;">
                            <img src="../assets/images/meta/Meta_logo1.png" alt="Logo"
                                style="width:64px;height:64px;object-fit:contain;"
                                onerror="this.parentElement.innerHTML='<span style=&quot;font-size:24px;font-weight:900;color:#1A3D91;&quot;>M</span>'">
                        </div>
                        <!-- Title + company info -->
                        <div style="display:flex;flex-direction:column;gap:2px;">
                            <div style="font-size:30px;font-weight:800;letter-spacing:-1px;line-height:1;color:#1A3D91;font-family:'Inter',sans-serif;">INVOICE</div>
                            <div style="font-size:14px;font-weight:700;color:#1A3D91;letter-spacing:0.2px;font-family:'Inter',sans-serif;">
                                ${invoice.company_name || "META HOLDING"}
                            </div>
                            <div style="font-size:11px;color:#6B7280;margin-top:2px;font-family:'Inter',sans-serif;">
                                ${invoice.company_phone || "+855 12 345 678"}
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT: Invoice number + status -->
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
                        <div style="font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;font-family:'Inter',sans-serif;">Invoice No.</div>
                        <div style="font-size:18px;font-weight:800;color:#0F2060;font-family:'Inter',sans-serif;">${invoice.code || "—"}</div>
                        <div style="display:inline-block;padding:4px 14px;border-radius:99px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;font-family:'Inter',sans-serif;">
                            ${statusLabel}
                        </div>
                    </div>

                </div>

                <!-- ═══ BILLED TO / DATE LINE ═══ -->
                <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:14px 32px;border-bottom:1px solid #E8E8E8;background:#FAFBFF;">
                    <!-- Left: Billed To -->
                    <div>
                        <div style="font-size:10px;font-weight:700;color:#9CA3AF;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.8px;font-family:'Inter',sans-serif;">Billed to</div>
                        <div style="font-size:14px;font-weight:600;color:#111;margin-bottom:3px;font-family:'Inter',sans-serif;">${invoice.tenant_name || "—"}</div>
                        ${invoice.space_code   ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">Space: ${invoice.space_code}</div>` : ""}
                        ${invoice.tenant_email ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">${invoice.tenant_email}</div>` : ""}
                        ${invoice.tenant_phone ? `<div style="font-size:11px;color:#666;font-family:'Inter',sans-serif;">${invoice.tenant_phone}</div>` : ""}
                    </div>
                    <!-- Right: Dates -->
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
                        <div style="font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;font-family:'Inter',sans-serif;">Date</div>
                        <div style="font-size:12px;color:#333;font-weight:500;font-family:'Inter',sans-serif;">${today}</div>
                        ${invoice.due_date ? `
                        <div style="font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.8px;margin-top:6px;font-family:'Inter',sans-serif;">Due Date</div>
                        <div style="font-size:12px;color:#DC2626;font-weight:600;font-family:'Inter',sans-serif;">${formatDate(invoice.due_date)}</div>
                        ` : ""}
                    </div>
                </div>

                <!-- ═══ ITEMS TABLE ═══ -->
                <div class="pi-tbl-wrap">
                    <table class="pi-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Description</th>
                                    <th style="text-align:center;">Type</th>
                                    <th style="text-align:center;">Qty</th>
                                    <th style="text-align:center;">Unit</th>
                                    <th style="text-align:center;">Start</th>
                                    <th style="text-align:center;">End</th>
                                    <th style="text-align:right;">Unit Price</th>
                                    <th style="text-align:right;">Discount</th>
                                    <th style="text-align:right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemRows || `<tr><td colspan="9" style="text-align:center;padding:48px;color:#999;font-size:13px;font-family:'Inter',sans-serif;">No items found</td></tr>`}
                        </tbody>
                    </table>
                </div>

                <!-- ═══ TOTALS ═══ -->
                <div style="display:flex;justify-content:flex-end;padding:16px 0px 8px;">
                    <div style="min-width:260px;border:1px solid #E5E9F5;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,32,96,0.06);">
                        <table style="width:100%;border-collapse:collapse;">
                            <tr class="pi-totals-row">
                                <td style="color:#666;font-family:'Inter',sans-serif;">Grand Total</td>
                                <td style="text-align:right;font-weight:600;color:#111;font-family:'Inter',sans-serif;">${currency}${fmt(grandTotal)}</td>
                            </tr>
                            <tr class="pi-totals-row">
                                <td style="color:#059669;font-family:'Inter',sans-serif;">Amount Paid</td>
                                <td style="text-align:right;font-weight:600;color:#059669;font-family:'Inter',sans-serif;">− ${currency}${fmt(paid)}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="padding:0;border-top:2px solid #E5E9F5;"></td>
                            </tr>
                            <tr style="background:linear-gradient(135deg,#0F2060,#1A3D91);">
                                <td style="padding:14px 16px;color:#fff;font-weight:700;font-size:13px;letter-spacing:0.3px;font-family:'Inter',sans-serif;">Balance Due</td>
                                <td style="padding:14px 16px;text-align:right;font-weight:800;color:#FDE68A;font-size:15px;font-family:'Inter',sans-serif;">${currency}${fmt(balance)}</td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- ═══ REMARKS / NOTES ═══ -->
                <div style="padding:8px 32px 20px;display:flex;flex-direction:column;gap:6px;border-top:1px solid #F0F0F0;">
                    ${invoice.remarks ? `
                    <div style="font-size:12px;color:#333;font-family:'Inter',sans-serif;">
                        <strong style="font-weight:600;">Note:</strong> ${invoice.remarks}
                    </div>` : `
                    <div style="font-size:12px;color:#333;font-family:'Inter',sans-serif;">
                        <strong style="font-weight:600;">Note:</strong> Payment is due by the date shown above. Late payments may incur additional charges.
                    </div>`}
                    <div style="margin-top:4px;font-size:10px;color:#9CA3AF;line-height:1.6;font-family:'Inter',sans-serif;">
                        Location:${invoice.company_address || "Samdech Monireth Blvd (217), Phnom Penh"}
                    </div>
                </div>

                <!-- ═══ ACTION BAR ═══ -->
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
        if (!op || !op.invoice_id) {
            cv_interact?.error("Invoice ID is missing");
            return;
        }

        const dlg = new GeneralDialog({
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
                vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id: op.invoice_id })
                    .then((res) => {
                        if (res.status_code !== 200) {
                            container.innerHTML = `<div class="alert alert-danger m-4">Error: ${res.error_message || "Unknown error"}</div>`;
                            return;
                        }
                        container.innerHTML = buildInvoiceHTML(res.data || {});
                        wireButtons(container);
                    })
                    .catch(() => {
                        container.innerHTML = `<div class="alert alert-danger m-4">Network error — could not load invoice.</div>`;
                    });
            },
            buttons: [{ label: "Close", cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });
        dlg.show(op);
    };

    return self;
})();