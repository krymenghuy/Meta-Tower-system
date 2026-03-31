// ==================== PrintInvoiceDialog.js ====================

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

    /* ── Print only the invoice via hidden iframe ── */
    const printViaIframe = (invoiceEl) => {
        const styleHTML  = Array.from(document.querySelectorAll("style")).map(s => s.outerHTML).join("\n");
        const biLink     = Array.from(document.querySelectorAll('link[href*="bootstrap-icons"]')).map(l => l.outerHTML).join("\n");
        const fontLink   = `<link rel="preconnect" href="https://fonts.googleapis.com"/>
                            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>`;

        const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Invoice</title>
${fontLink}${biLink}${styleHTML}
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter','Segoe UI',sans-serif;background:#fff;padding:0;
       -webkit-print-color-adjust:exact;print-color-adjust:exact;}
  .pi-action-bar{display:none!important}
  @media print{body{background:#fff!important}.pi-action-bar{display:none!important}}
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

    /* ── Build invoice HTML ── */
    const buildInvoiceHTML = (invoice) => {
        const validItems = (invoice.items || []).filter(
            (item) => parseFloat(item.price || 0) > 0 || parseFloat(item.total || 0) > 0 || parseFloat(item.amount || 0) > 0
        );

        /* Recalculate totals */
        let subtotal = 0, totalDiscount = 0, totalTax = 0;
        validItems.forEach((item) => {
            const qty       = parseFloat(item.qty   || 1);
            const price     = parseFloat(item.price || 0);
            const disc      = parseFloat(item.discount || item.special_discount_value || 0);
            const discType  = (item.discount_type || item.special_discount_type || "percent").toLowerCase();
            const taxRate   = parseFloat(item.tax_rate || 0);
            const lineBase  = qty * price;
            const discAmt   = (discType === "amount" || discType === "$") ? disc : (lineBase * disc / 100);
            const afterDisc = lineBase - discAmt;
            subtotal       += lineBase;
            totalDiscount  += discAmt;
            totalTax       += (afterDisc * taxRate / 100);
        });

        const grandTotal = subtotal - totalDiscount + totalTax;
        const paid       = parseFloat(invoice.paid_amount || 0);
        const balance    = Math.max(0, grandTotal - paid);

        const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        /* ── Line item rows — all 10 columns ── */
        const itemRows = validItems.map((item, i) => {
            const qty      = parseFloat(item.qty   || 1);
            const price    = parseFloat(item.price || 0);
            const total    = parseFloat(item.total || item.amount || 0);
            const rawType  = (item.type || "service").toLowerCase();
            const disc     = parseFloat(item.discount || item.special_discount_value || 0);
            const discType = (item.discount_type || item.special_discount_type || "percent").toLowerCase();
            const taxRate  = parseFloat(item.tax_rate || 0);

            /* Discount display */
            let discDisplay = "—";
            if (disc > 0) {
                discDisplay = (discType === "amount" || discType === "$")
                    ? `-${currency}${fmt(disc)}`
                    : `-${fmt(disc)}%`;
            }

            /* Type badge colours */
            const typeColors = {
                rent:    ["#dbeafe", "#1d4ed8"],
                utility: ["#ffedd5", "#c2410c"],
                service: ["#f3f4f6", "#374151"],
            };
            const [tbg, tfg] = typeColors[rawType] || typeColors.service;

            /* Alternating row background */
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

        const discRow = totalDiscount > 0
            ? `<tr><td>Discount</td><td class="pi-red">-${currency}${fmt(totalDiscount)}</td></tr>` : "";
        const taxRow  = totalTax > 0
            ? `<tr><td>Tax</td><td class="pi-blue">+${currency}${fmt(totalTax)}</td></tr>` : "";

        return `
<style>
.pi-root *, .pi-root *::before, .pi-root *::after { box-sizing: border-box; }
.pi-root {
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #1f2937;
    background: #fff;
    overflow: hidden;
}

/* ── HEADER ── */
.pi-head {
    background: linear-gradient(135deg, #1a56db, #60a5fa);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 32px;
    gap: 12px;
    flex-wrap: wrap;
}
.pi-logo-icon {
    width: 72px; height: 72px;
    display: flex; align-items: center; justify-content: center;
}
.pi-logo-icon img {
    width: 72px; height: 72px;
    border-radius: 10px;
    object-fit: contain;
    background: rgba(255,255,255,0.15);
}
.pi-title-block { text-align: right; }
.pi-inv-word {
    font-size: 26px; font-weight: 800;
    color: #fff; letter-spacing: 1px; line-height: 1;
}
.pi-inv-num {
    font-size: 13px; color: #e0e7ff; margin-top: 6px;
}
.pi-inv-num span { font-weight: 800; color: #fde68a; font-size: 15px; }

/* ── META ROW ── */
.pi-meta {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 16px 32px; gap: 16px; flex-wrap: wrap;
    background: #f8faff;
    border-top: 1px solid #e8ecf0;
    border-bottom: 1px solid #e8ecf0;
}
.pi-meta-label { font-size: 9px; font-weight: 700; color: #9ca3af; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 5px; }
.pi-bill-to    { flex: 1; min-width: 180px; }
.pi-tenant-name   { font-size: 17px; font-weight: 700; color: #111827; }
.pi-tenant-detail { font-size: 11px; color: #6b7280; margin-top: 3px; display: flex; align-items: center; gap: 5px; }
.pi-tenant-detail i { color: #1a56db; font-size: 10px; }
.pi-meta-dates { min-width: 110px; }
.pi-date-val   { font-size: 12px; font-weight: 600; color: #374151; }
.pi-date-item  { margin-bottom: 8px; }
.pi-amount-due { min-width: 150px; text-align: right; }
.pi-due-box {
    display: inline-block; background: #1a56db; color: #fff;
    border-radius: 10px; padding: 8px 18px; text-align: center;
}
.pi-due-lbl { font-size: 9px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; opacity: .75; }
.pi-due-amt { font-size: 20px; font-weight: 800; letter-spacing: -.5px; margin-top: 2px; }

/* ── TABLE ── */
.pi-tbl-wrap { overflow-x: auto; }
.pi-table {
    width: 100%; border-collapse: collapse; min-width: 700px;
}
.pi-table thead tr { background: #ebedf2; }
.pi-table thead th {
    padding: 9px 8px;
    font-size: 10px; font-weight: 700; color: #1A1647;
    text-transform: uppercase; letter-spacing: .7px;
    border-bottom: 2px solid #c7d2fe;
    white-space: nowrap;
}
.pi-th-l { text-align: left; }
.pi-th-r { text-align: right; }
.pi-th-c { text-align: center; }

.pi-table tbody tr { border-bottom: 1px solid #f3f4f6; }
.pi-table tbody tr:last-child { border-bottom: none; }
.pi-table tbody td { padding: 8px 8px; font-size: 11px; vertical-align: middle; }

.pi-td-desc   { min-width: 160px; text-align: left; }
.pi-item-name { font-size: 12px; font-weight: 600; color: #1f2937; }
.pi-td-c { text-align: center; color: #374151; }
.pi-td-r { text-align: right; color: #374151; white-space: nowrap; }
.pi-bold { font-weight: 700; }
.pi-total-cell { color: #1a56db !important; font-weight: 700; }
.pi-disc-cell  { color: #dc3545; }
.pi-tax-cell   { color: #0284c7; }

.pi-type-badge {
    display: inline-block; padding: 2px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 600; text-transform: capitalize; white-space: nowrap;
}

/* ── TOTALS ── */
.pi-totals-wrap { padding: 16px 32px 20px; display: flex; justify-content: flex-end; }
.pi-totals-card {
    min-width: 270px;
    border: 1px solid #e8ecf0;
    border-radius: 10px;
    overflow: hidden;
}
.pi-totals-card table { width: 100%; border-collapse: collapse; }
.pi-totals-card tr    { border-bottom: 1px solid #f3f4f6; }
.pi-totals-card tr:last-child { border-bottom: none; }
.pi-totals-card td    { padding: 8px 14px; font-size: 12px; }
.pi-totals-card td:first-child { color: #6b7280; }
.pi-totals-card td:last-child  { text-align: right; font-weight: 600; color: #374151; }
.pi-total-row td {
    background: #1a56db !important; color: #fff !important;
    font-weight: 700 !important; font-size: 13px !important;
}
.pi-red   { color: #dc3545 !important; }
.pi-blue  { color: #0284c7 !important; }
.pi-green { color: #198754 !important; }

/* ── REMARKS ── */
.pi-remarks {
    margin: 0 32px 16px; padding: 10px 14px;
    background: #fffbeb; border-left: 4px solid #fbbf24; border-radius: 6px;
}
.pi-remarks-lbl { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #b45309; margin-bottom: 3px; }
.pi-remarks-txt { font-size: 11px; color: #92400e; }

/* ── FOOTER ── */
.pi-footer {
    padding: 16px 32px;
    background: #f0f5ff;
    border-top: 1px solid #e0e7ff;
    display: flex; justify-content: space-between; align-items: flex-end;
    gap: 16px; flex-wrap: wrap;
    position: relative; overflow: hidden;
}
.pi-footer-wave {
    position: absolute; bottom: 0; right: 0; width: 50%; height: 100%;
    background: linear-gradient(135deg, #1a56db18, #60a5fa28);
    border-radius: 80% 0 0 0; pointer-events: none;
}
.pi-footer-left  { position: relative; z-index: 1; }
.pi-footer-title { font-size: 10px; font-weight: 700; color: #1a56db; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 3px; }
.pi-footer-body  { font-size: 10px; color: #6b7280; line-height: 1.6; }
.pi-footer-right { position: relative; z-index: 1; text-align: right; font-size: 10px; color: #9ca3af; }

/* ── ACTION BAR ── */
.pi-action-bar {
    padding: 12px 32px; border-top: 1px solid #e8ecf0; background: #fff;
    display: flex; justify-content: flex-end; align-items: center; gap: 8px; flex-wrap: wrap;
}
.pi-btn-outline {
    padding: 7px 16px; border-radius: 8px; border: 1px solid #d1d5db;
    background: #fff; color: #374151; font-size: 12px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: background .15s;
}
.pi-btn-outline:hover { background: #f9fafb; }
.pi-btn-primary {
    padding: 7px 18px; border-radius: 8px; border: none;
    background: #1a56db; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: background .15s;
}
.pi-btn-primary:hover { background: #1648c0; }

@media (max-width: 580px) {
    .pi-head, .pi-meta, .pi-tbl-wrap, .pi-totals-wrap,
    .pi-remarks, .pi-footer, .pi-action-bar { padding-left: 14px; padding-right: 14px; }
    .pi-inv-word  { font-size: 20px; }
    .pi-totals-card { width: 100%; }
    .pi-footer-wave { display: none; }
}
</style>

<div class="pi-root" id="pi-invoice-content">

    <!-- HEADER -->
    <div class="pi-head">
        <div class="pi-logo-icon">
            <img src="../assets/images/meta/Meta_logo1.png" alt="Company Logo"
                 onerror="this.style.display='none'">
        </div>
        <div class="pi-title-block">
            <div class="pi-inv-word">Invoice / វិក័យប័ត្រ</div>
            <div class="pi-inv-num">Invoice No / ចំនួនវិក័យប័ត្រ: <span>${invoice.code || "—"}</span></div>
        </div>
    </div>

    <!-- BILL TO / DATES / AMOUNT DUE -->
    <div class="pi-meta">
        <div class="pi-bill-to">
            <div class="pi-meta-label">Bill To</div>
            <div class="pi-tenant-name">${invoice.tenant_name || "—"}</div>
            ${invoice.space_code   ? `<div class="pi-tenant-detail"><i class="bi bi-geo-alt-fill"></i>&nbsp;Space: <strong>${invoice.space_code}</strong></div>`   : ""}
            ${invoice.email        ? `<div class="pi-tenant-detail"><i class="bi bi-envelope-fill"></i>&nbsp;${invoice.email}</div>`                               : ""}
            ${invoice.phone_number ? `<div class="pi-tenant-detail"><i class="bi bi-telephone-fill"></i>&nbsp;${invoice.phone_number}</div>`                       : ""}
        </div>
        <div class="pi-meta-dates">
            ${invoice.due_date   ? `<div class="pi-date-item"><div class="pi-meta-label">Due Date</div><div class="pi-date-val">${formatDate(invoice.due_date)}</div></div>`   : ""}
            ${invoice.updated_at ? `<div class="pi-date-item"><div class="pi-meta-label">Issued</div><div class="pi-date-val">${formatDate(invoice.updated_at)}</div></div>`   : ""}
        </div>
        <div class="pi-amount-due">
            <div class="pi-meta-label">Amount Due</div>
            <div class="pi-due-box">
                <div class="pi-due-lbl">Account Due</div>
                <div class="pi-due-amt">${currency}${fmt(balance > 0 ? balance : grandTotal)}</div>
            </div>
        </div>
    </div>

    <!-- LINE ITEMS — 10 columns -->
    <div class="pi-tbl-wrap">
        <table class="pi-table">
            <thead>
                <tr>
                    <th class="pi-th-l"  style="min-width:140px;">Item Description</th>
                    <th class="pi-th-c"  style="width:85px;">Type</th>
                    <th class="pi-th-c"  style="width:85px;">Qty</th>
                    <th class="pi-th-c"  style="width:85px;">Unit</th>
                    <th class="pi-th-c"  style="width:85px;">Start Date</th>
                    <th class="pi-th-c"  style="width:85px;">End Date</th>
                    <th class="pi-th-r"  style="width:85px;">Unit Price</th>
                    <th class="pi-th-r"  style="width:85px;">Discount</th>
                    <th class="pi-th-c"  style="width:85px;">Tax</th>
                    <th class="pi-th-r"  style="width:90px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows || `<tr><td colspan="10" style="text-align:center;padding:28px;color:#9ca3af;font-size:12px;">No items found</td></tr>`}
            </tbody>
        </table>
    </div>

    <!-- TOTALS -->
    <div class="pi-totals-wrap">
        <div class="pi-totals-card">
            <table>
                <tr><td>Subtotal</td><td>${currency}${fmt(subtotal)}</td></tr>
                ${discRow}
                ${taxRow}
                <tr class="pi-total-row"><td>Total</td><td>${currency}${fmt(grandTotal)}</td></tr>
                <tr><td>Paid</td><td class="pi-green">${currency}${fmt(paid)}</td></tr>
                <tr><td>Balance Due</td><td class="pi-red">${currency}${fmt(balance)}</td></tr>
            </table>
        </div>
    </div>

    <!-- REMARKS -->
    ${invoice.remarks ? `
    <div class="pi-remarks">
        <div class="pi-remarks-lbl">Remarks</div>
        <div class="pi-remarks-txt">${invoice.remarks}</div>
    </div>` : ""}

    <!-- FOOTER -->
    <div class="pi-footer">
        <div class="pi-footer-wave"></div>
        <div class="pi-footer-left">
            <div class="pi-footer-title">Terms &amp; Conditions</div>
            <div class="pi-footer-body">Payment is due by the date shown above.<br>Late payments may incur additional charges.</div>
        </div>
        <div class="pi-footer-right">
            <div>Generated by Property Manager</div>
            <div>${today}</div>
        </div>
    </div>

    <!-- ACTION BUTTONS (hidden on print) -->
    <div class="pi-action-bar">
        <button class="pi-btn-outline" id="pi-print-btn">
            <i class="bi bi-printer"></i> Print Invoice
        </button>
        <button class="pi-btn-primary" id="pi-download-btn">
            <i class="bi bi-download"></i> Download PDF
        </button>
    </div>

</div>`;
    };

    /* ── Wire print buttons after DOM injection ── */
    const wireButtons = (container) => {
        const invoiceEl  = container.querySelector("#pi-invoice-content");
        const printBtn   = container.querySelector("#pi-print-btn");
        const downloadBtn= container.querySelector("#pi-download-btn");
        if (printBtn)     printBtn.addEventListener("click",    () => printViaIframe(invoiceEl));
        if (downloadBtn)  downloadBtn.addEventListener("click", () => printViaIframe(invoiceEl));
    };

    /* ── Public API ── */
    self.show = (op) => {
        if (!op || !op.invoice_id) {
            cv_interact.error("Invoice ID is missing");
            return;
        }

        const dlg = new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                <div name="pi_container" style="min-height:260px;border-radius:8px;border:1px solid #d1d5db;overflow:hidden;">
                    <div style="display:flex;align-items:center;justify-content:center;padding:60px 0;gap:14px;
                                color:#6b7280;font-family:'Segoe UI',sans-serif;font-size:14px;">
                        <div style="width:32px;height:32px;border:4px solid #dbeafe;border-top-color:#1a56db;
                                    border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
                        Loading invoice…
                    </div>
                    <style>@keyframes pi-spin{to{transform:rotate(360deg)}}</style>
                </div>`,

            contentCreated: (me) => {
                const container = me.divModal.querySelector('[name="pi_container"]');
                vsapi
                    .call(`${main_view.base_url}/prm/invoice/details`, { id: op.invoice_id })
                    .then((res) => {
                        if (res.status_code !== 200) {
                            container.innerHTML = `<div class="alert alert-danger m-4">Failed to load invoice: ${res.error_message || "Unknown error"}</div>`;
                            return;
                        }
                        container.innerHTML = buildInvoiceHTML(res.data || {});
                        wireButtons(container);
                    })
                    .catch(() => {
                        container.innerHTML = `<div class="alert alert-danger m-4">Network error — could not load invoice.</div>`;
                    });
            },

            buttons: [
                {
                    label: "Close",
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide()
                }
            ]
        });

        dlg.show(op);
    };

    return self;
})();
