const PrintInvoiceDialog = (() => {
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
        const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
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
                                font-family: 'Inter','Segoe UI', sans-serif;
                                background: #fff;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .pi-action-bar { display:none!important; }

                            @page {
                                size: A4 landscape;
                                margin: 0;
                            }

                            @media print {
                                body {
                                    background: #fff !important;
                                    margin: 10mm;
                                }
                                .pi-action-bar { display:none!important; }
                                .pi-tbl-wrap { overflow: visible !important; }
                                .pi-table { min-width: unset !important; }

                                .pi-root { font-size: 13px !important; }
                                .pi-table tbody td { font-size: 12px !important; padding: 9px 8px !important; }
                                .pi-table thead th { font-size: 11px !important; }
                                .pi-item-name { font-size: 13px !important; }
                                .pi-company-name { font-size: 20px !important; }
                                .pi-inv-word { font-size: 28px !important; }
                                .pi-tenant-name { font-size: 18px !important; }
                                .pi-due-amt { font-size: 22px !important; }
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
            if (itemTotal > 0) {
                grandTotal += itemTotal;
            } else {
                const qty = parseFloat(item.qty || 1);
                const price = parseFloat(item.price || 0);
                grandTotal += qty * price;
            }
        });

        const paid    = parseFloat(invoice.paid_amount || 0);
        const balance = Math.max(0, grandTotal - paid);
        const today   = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        const itemRows = validItems.map((item, i) => {
            const qty       = parseFloat(item.qty || 1);
            const price     = parseFloat(item.price || 0);
            const total     = parseFloat(item.total || item.amount || (qty * price));
            const rawType   = (item.type || "service").toLowerCase();
            const disc      = parseFloat(item.discount || item.special_discount_value || 0);
            const discType  = (item.discount_type || item.special_discount_type || "percent").toLowerCase();
            const taxRate   = parseFloat(item.tax_rate || 0);

            let discDisplay = "—";
            if (disc > 0) {
                discDisplay = (discType === "amount" || discType === "$")
                    ? `-${currency}${fmt(disc)}`
                    : `-${fmt(disc)}%`;
            }

            const typeColors = {
                rent:    ["#dbeafe", "#1d4ed8"],
                utility: ["#ffedd5", "#c2410c"],
                service: ["#f3f4f6", "#374151"],
            };
            const [tbg, tfg] = typeColors[rawType] || typeColors.service;
            const rowStyle = i % 2 !== 0 ? 'style="background:#f8faff;"' : '';

            return `
            <tr ${rowStyle}>
                <td class="pi-td-desc">
                    <div class="pi-item-name">${item.description || item.remarks || item.item_name || "—"}</div>
                </td>
                <td class="pi-td-c">
                    <span class="pi-type-badge" style="background:${tbg};color:${tfg};">${rawType}</span>
                </td>
                <td class="pi-td-c">${qty}</td>
                <td class="pi-td-c">${item.unit_type ? item.unit_type.trim() : "—"}</td>
                <td class="pi-td-c">${formatDate(item.start_date)}</td>
                <td class="pi-td-c">${formatDate(item.end_date)}</td>
                <td class="pi-td-r">${currency}${fmt(price)}</td>
                <td class="pi-td-r pi-disc-cell">${discDisplay}</td>
                <td class="pi-td-c pi-tax-cell">${taxRate > 0 ? `+${taxRate}%` : "—"}</td>
                <td class="pi-td-r pi-bold pi-total-cell">${currency}${fmt(total)}</td>
            </tr>`;
        }).join("");

        return `
                <style>
                .pi-root *, .pi-root *::before, .pi-root *::after { box-sizing: border-box; }
                .pi-root {
                    font-family: 'Inter', 'Segoe UI', sans-serif;
                    color: #1f2937;
                    background: #fff;
                    overflow: hidden;
                }
                .pi-head { background: linear-gradient(135deg, rgba(26,86,219,0.9), rgba(96,165,250,0.8)), url('../assets/images/meta/background.jpg') no-repeat; background-size: cover; background-position: center; display: flex; justify-content: space-between; align-items: flex-start; padding: 15px; gap: 12px; border-bottom: 3px solid #fde68a; }
                .pi-head-left { display: flex; gap: 20px; align-items: flex-start; }
                .pi-logo-icon { width: 72px; height: 72px; }
                .pi-logo-icon img { width: 72px; height: 72px; object-fit: fill; background: rgba(255,255,255,0.15); }
                .pi-company-info { color: #fff; }
                .pi-company-name { font-size: 18px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px; }
                .pi-company-contact { font-size: 11px; color: #e0e7ff; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
                .pi-company-contact i { font-size: 10px; opacity: 0.8; }

                .pi-title-block { text-align: right; }
                .pi-inv-word { font-size: 26px; font-weight: 800; color: #fff; line-height: 1; }
                .pi-inv-num { font-size: 13px; color: #e0e7ff; margin-top: 8px; }
                .pi-inv-num span { font-weight: 800; color: #fde68a; font-size: 15px; }

                .pi-meta {
                    display: flex; justify-content: space-between; align-items: flex-start; padding: 15px; gap: 16px; flex-wrap: wrap;
                    background: #f8faff; border-top: 1px solid #e8ecf0; border-bottom: 1px solid #e8ecf0;
                }
                .pi-meta-label { font-size: 9px; font-weight: 700; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; }
                .pi-bill-to { flex: 1; min-width: 180px; }
                .pi-tenant-name { font-size: 17px; font-weight: 700; color: #111827; }
                .pi-tenant-detail { font-size: 11px; color: #6b7280; margin-top: 3px; display: flex; align-items: center; gap: 5px; }
                .pi-tenant-detail i { color: #1a56db; font-size: 10px; }
                .pi-amount-due { min-width: 150px; text-align: right; }
                .pi-due-box { display: inline-block; background: #1a56db; color: #fff; border-radius: 10px; padding: 8px 18px; text-align: center; }
                .pi-due-lbl { font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: .75; }
                .pi-due-amt { font-size: 20px; font-weight: 800; letter-spacing: -.5px; margin-top: 2px; }

                .pi-tbl-wrap { overflow-x: auto; }
                .pi-table { width: 100%; border-collapse: collapse; min-width: 950px; }
                .pi-table thead tr { background: #ebedf2; }
                .pi-table thead th { padding: 9px 8px; font-size: 10px; font-weight: 700; color: #1A1647; text-transform: uppercase; letter-spacing: .7px; border-bottom: 2px solid #c7d2fe; }
                .pi-th-l { text-align: left; } .pi-th-r { text-align: right; } .pi-th-c { text-align: center; }
                .pi-table tbody td { padding: 8px 8px; font-size: 11px; vertical-align: middle; border-bottom: 1px solid #f3f4f6; }
                .pi-item-name { font-size: 12px; font-weight: 600; color: #1f2937; }
                .pi-total-cell { color: #1a56db !important; font-weight: 700; }
                .pi-disc-cell { color: #ef4444; }
                .pi-tax-cell  { color: #3b82f6; }
                .pi-type-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; text-transform: capitalize; }

                .pi-totals-wrap { padding: 16px 10px 20px; display: flex; justify-content: flex-end; }
                .pi-totals-card { min-width: 280px; border: 1px solid #e8ecf0; border-radius: 10px; overflow: hidden; }
                .pi-totals-card table { width: 100%; border-collapse: collapse; }
                .pi-totals-card td { padding: 8px 14px; font-size: 12px; border-bottom: 1px solid #f3f4f6; }
                .pi-total-row td { background: #1a56db !important; color: #fff !important; font-weight: 700 !important; }

                .pi-remarks { margin: 0 32px 16px; padding: 10px 14px; background: #fffbeb; border-left: 4px solid #fbbf24; border-radius: 6px; }
                .pi-footer { padding: 16px 32px; background: #f0f5ff; border-top: 1px solid #e0e7ff; display: flex; justify-content: space-between; align-items: flex-end; }
                .pi-action-bar { padding: 12px 32px; border-top: 1px solid #e8ecf0; background: #fff; display: flex; justify-content: flex-end; gap: 8px; }

                .pi-btn-outline, .pi-btn-primary {
                    padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
                    display: inline-flex; align-items: center; gap: 6px;
                }
                .pi-btn-outline { border: 1px solid #d1d5db; background: #fff; color: #374151; }
                .pi-btn-primary { border: none; background: #1a56db; color: #fff; }

                @media (max-width: 580px) {
                    .pi-head-left { flex-direction: column; gap: 10px; }
                    .pi-head, .pi-meta, .pi-action-bar { padding: 14px; }
                }
                </style>



                <div class="pi-root" id="pi-invoice-content">
                    <div class="pi-head">
                        <div class="pi-head-left">
                            <div class="pi-logo-icon">
                                <img src="../assets/images/meta/Meta_logo1.png" alt="Company Logo" onerror="this.style.display='none'">
                            </div>
                            <div class="pi-company-info">
                                <div class="pi-company-name">META TOWER</div>
                                <div class="pi-company-contact"><i class="bi bi-envelope-fill"></i> info@metatower.com</div>
                                <div class="pi-company-contact"><i class="bi bi-telephone-fill"></i> +855 12 345 678</div>
                                <div class="pi-company-contact"><i class="bi bi-geo-alt-fill"></i> Phnom Penh, Cambodia</div>
                            </div>
                        </div>
                        <div class="pi-title-block">
                            <div class="pi-inv-word"> វិក័យប័ត្រ / Invoice</div>
                            <div class="pi-inv-num">ចំនួនវិក័យប័ត្រ: /Invoice No <span>${invoice.code || "—"}</span></div>
                        </div>
                    </div>

                    <div class="pi-meta">
                        <div class="pi-bill-to">
                            <div class="pi-meta-label">Bill To</div>
                            <div class="pi-tenant-name">${invoice.tenant_name || "—"}</div>
                            ${invoice.space_code ? `<div class="pi-tenant-detail"><i class="bi bi-geo-alt-fill"></i>&nbsp;Space: <strong>${invoice.space_code}</strong></div>` : ""}
                            ${invoice.tenant_email ? `<div class="pi-tenant-detail"><i class="bi bi-envelope-fill"></i>&nbsp;${invoice.tenant_email}</div>` : ""}
                            ${invoice.tenant_phone ? `<div class="pi-tenant-detail"><i class="bi bi-telephone-fill"></i>&nbsp;${invoice.tenant_phone}</div>` : ""}
                        </div>
                        <div class="pi-meta-dates">
                            ${invoice.due_date ? `<div class="pi-date-item"><div class="pi-meta-label">Due Date</div><div class="pi-date-val">${formatDate(invoice.due_date)}</div></div>` : ""}
                            ${invoice.updated_at ? `<div class="pi-date-item"><div class="pi-meta-label">Issued</div><div class="pi-date-val">${formatDate(invoice.updated_at)}</div></div>` : ""}
                        </div>
                        <div class="pi-amount-due">
                            <div class="pi-meta-label">Amount Due</div>
                            <div class="pi-due-box">
                                <div class="pi-due-lbl">Account Due</div>
                                <div class="pi-due-amt">${currency}${fmt(balance > 0 ? balance : grandTotal)}</div>
                            </div>
                        </div>
                    </div>

                    <div class="pi-tbl-wrap">
                        <table class="pi-table">
                            <thead>
                                <tr>
                                    <th class="pi-th-l">Item Description</th>
                                    <th class="pi-th-c" style="width:80px;">Type</th>
                                    <th class="pi-th-c" style="width:60px;">Qty</th>
                                    <th class="pi-th-c" style="width:70px;">Unit</th>
                                    <th class="pi-th-c" style="width:85px;">Start Date</th>
                                    <th class="pi-th-c" style="width:80px;">End Date</th>
                                    <th class="pi-th-r" style="width:85px;">Unit Price</th>
                                    <th class="pi-th-r" style="width:80px;">Discount</th>
                                    <th class="pi-th-c" style="width:60px;">Tax</th>
                                    <th class="pi-th-r" style="width:85px;">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemRows || `<tr><td colspan="10" style="text-align:center;padding:40px;color:#9ca3af;">No items found</td></tr>`}
                            </tbody>
                        </table>
                    </div>

                    <!-- Only One Total - Now correctly equals sum of item totals -->
                    <div class="pi-totals-wrap">
                        <div class="pi-totals-card">
                            <table>
                                <tr class="pi-total-row"><td>Total</td><td>${currency}${fmt(grandTotal)}</td></tr>
                                <tr><td>Paid</td><td class="pi-green">${currency}${fmt(paid)}</td></tr>
                                <tr><td>Balance Due</td><td class="pi-red">${currency}${fmt(balance)}</td></tr>
                            </table>
                        </div>
                    </div>

                    ${invoice.remarks ? `<div class="pi-remarks"><div class="pi-remarks-lbl">Remarks</div><div class="pi-remarks-txt">${invoice.remarks}</div></div>` : ""}

                    <div class="pi-footer">
                        <div class="pi-footer-left">
                            <div class="pi-footer-title">Terms &amp; Conditions</div>
                            <div class="pi-footer-body">Payment is due by the date shown above.<br>Late payments may incur additional charges.</div>
                        </div>
                        <div class="pi-footer-right">
                            <div>Generated by Property Manager</div>
                            <div>${today}</div>
                        </div>
                    </div>

                    <div class="pi-action-bar">
                        <button class="pi-btn-outline" id="pi-print-btn"><i class="bi bi-printer"></i> Print Invoice</button>
                        <button class="pi-btn-primary" id="pi-download-btn"><i class="bi bi-download"></i> Download PDF</button>
                    </div>

                </div>`;
    };


    const wireButtons = (container) => {
        const invoiceEl = container.querySelector("#pi-invoice-content");
        const printBtn = container.querySelector("#pi-print-btn");
        const downloadBtn = container.querySelector("#pi-download-btn");

        if (printBtn) printBtn.addEventListener("click", () => printViaIframe(invoiceEl));
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
            createContent: () => `<div name="pi_container" style="min-height:260px;border-radius:8px;border:1px solid #d1d5db;overflow:hidden;">
                <div style="display:flex;align-items:center;justify-content:center;padding:60px 0;gap:14px;color:#6b7280;font-size:14px;">
                    <div style="width:32px;height:32px;border:4px solid #dbeafe;border-top-color:#1a56db;border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
                    Loading invoice…
                </div><style>@keyframes pi-spin{to{transform:rotate(360deg)}}</style></div>`,
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
