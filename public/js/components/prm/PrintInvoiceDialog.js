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
        const fontLink = `
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>`;
        const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
${fontLink}${biLink}${styleHTML}
<style>
    *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
    body {
        font-family: 'DM Sans', sans-serif;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    .pi-action-bar { display:none!important; }
    @page { size: A4 landscape; margin: 0; }
    @media print {
        body { background: #fff !important; margin: 8mm; }
        .pi-action-bar { display:none!important; }
        .pi-tbl-wrap { overflow: visible !important; }
        .pi-table { min-width: unset !important; }
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
            const taxRate  = parseFloat(item.tax_rate || 0);
            const cfg      = typeConfig[rawType] || typeConfig.service;

            let discDisplay = `<span style="color:#9CA3AF;">—</span>`;
            if (disc > 0) {
                discDisplay = (discType === "amount" || discType === "$")
                    ? `<span style="color:#EF4444;font-weight:600;">${currency}${fmt(disc)}</span>`
                    : `<span style="color:#EF4444;font-weight:600;">${fmt(disc)}%</span>`;
            }

            const rowBg = i % 2 !== 0 ? '#FAFBFF' : '#FFFFFF';

            return `
            <tr style="background:${rowBg};transition:background 0.15s;">
                <td style="padding:11px 14px;border-bottom:1px solid #EEF0F5;">
                    <div style="font-weight:600;color:#111827;font-size:12.5px;font-family:'DM Sans',sans-serif;">
                        ${item.description || item.remarks || item.item_name || "—"}
                    </div>
                </td>
                <td style="padding:11px 10px;text-align:center;border-bottom:1px solid #EEF0F5;">
                    <span style="display:inline-flex;align-items:center;gap:5px;background:${cfg.bg};color:${cfg.fg};padding:3px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;">
                        <span style="width:5px;height:5px;border-radius:50%;background:${cfg.dot};flex-shrink:0;"></span>
                        ${rawType}
                    </span>
                </td>
                <td style="padding:11px 10px;text-align:center;color:#4B5563;font-size:12px;border-bottom:1px solid #EEF0F5;">${qty}</td>
                <td style="padding:11px 10px;text-align:center;color:#6B7280;font-size:11px;border-bottom:1px solid #EEF0F5;">${item.unit_type ? item.unit_type.trim() : "—"}</td>
                <td style="padding:11px 10px;text-align:center;color:#6B7280;font-size:11px;border-bottom:1px solid #EEF0F5;">${formatDate(item.start_date)}</td>
                <td style="padding:11px 10px;text-align:center;color:#6B7280;font-size:11px;border-bottom:1px solid #EEF0F5;">${formatDate(item.end_date)}</td>
                <td style="padding:11px 14px;text-align:right;color:#374151;font-size:12px;border-bottom:1px solid #EEF0F5;">${currency}${fmt(price)}</td>
                <td style="padding:11px 14px;text-align:right;border-bottom:1px solid #EEF0F5;">${discDisplay}</td>
                <td style="padding:11px 10px;text-align:center;font-size:11px;border-bottom:1px solid #EEF0F5;color:${taxRate > 0 ? '#2563EB' : '#9CA3AF'};">${taxRate > 0 ? `${taxRate}%` : "—"}</td>
                <td style="padding:11px 14px;text-align:right;font-weight:700;color:#1A3D91;font-size:13px;border-bottom:1px solid #EEF0F5;">${currency}${fmt(total)}</td>
            </tr>`;
        }).join("");

        const statusColor = balance <= 0 ? "#059669" : "#DC2626";
        const statusLabel = balance <= 0 ? "PAID" : "Partially Paid";
        const statusBg    = balance <= 0 ? "#ECFDF5" : "#FEF2F2";

        return `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

    .pi-root {
        font-family: 'DM Sans', 'Segoe UI', sans-serif;
        color: #1f2937;
        background: #fff;
        max-width: 100%;
    }
    .pi-action-bar button {
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
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
        min-width: 900px;
    }
    .pi-table thead th {
        padding: 11px 14px;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: #6B7280;
        background: #F8FAFF;
        border-bottom: 2px solid #E5E9F5;
    }
    .pi-table tbody tr:hover { background: #F0F4FF !important; }
    .pi-totals-row td {
        padding: 13px 16px;
        font-size: 13px;
        border-top: 1px solid #E5E9F5;
    }
</style>

<div class="pi-root" id="pi-invoice-content">

    <!-- ═══ HEADER BAND ═══ -->
    <div style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
        <!-- decorative circles -->
        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);pointer-events:none;"></div>
        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;">
            <div style="width:70px;height:76px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                <img src="../assets/images/meta/Meta_logo1.png" alt="Logo"
                    style="width:60px;height:63px;object-fit:contain;"
                    onerror="this.parentElement.innerHTML='<span style=\'font-size:22px;font-weight:900;color:#fff;font-family:Playfair Display,serif;\'>M</span>'">
            </div>
            <div>
                <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">META TOWER</div>
                <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px;">
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                        <i class="bi bi-envelope-fill" style="font-size:9px;"></i> info@metatower.com
                    </div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                        <i class="bi bi-telephone-fill" style="font-size:9px;"></i> +855 12 345 678
                    </div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;">
                        <i class="bi bi-geo-alt-fill" style="font-size:9px;"></i> Phnom Penh, Cambodia
                    </div>
                </div>
            </div>
        </div>

        <div style="text-align:right;position:relative;">
            <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1;">INVOICE</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.5);margin-top:6px;letter-spacing:0.5px;text-transform:uppercase;">Invoice Number</div>
            <div style="font-size:16px;font-weight:700;color:#FDE68A;margin-top:2px;letter-spacing:0.3px;">${invoice.code || "—"}</div>
            <div style="margin-top:10px;display:inline-block;padding:4px 12px;border-radius:20px;background:${statusBg};color:${statusColor};font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;">
                ${statusLabel}
            </div>
        </div>
    </div>

    <!-- ═══ META BAR ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:stretch;gap:0;border-bottom:2px solid #E5E9F5;flex-wrap:wrap;">

        <!-- Bill To -->
        <div style="padding:18px 24px;flex:1;min-width:200px;border-right:1px solid #EEF0F5;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:7px;">Bill To</div>
            <div style="font-size:17px;font-weight:700;color:#111827;line-height:1.2;">${invoice.tenant_name || "—"}</div>
            ${invoice.space_code ? `<div style="margin-top:5px;font-size:11px;color:#6B7280;display:flex;align-items:center;gap:4px;"><i class="bi bi-building" style="color:#1A3D91;font-size:10px;"></i> Space: <strong style="color:#374151;">${invoice.space_code}</strong></div>` : ""}
            ${invoice.tenant_email ? `<div style="margin-top:3px;font-size:11px;color:#6B7280;display:flex;align-items:center;gap:4px;"><i class="bi bi-envelope" style="color:#1A3D91;font-size:10px;"></i> ${invoice.tenant_email}</div>` : ""}
            ${invoice.tenant_phone ? `<div style="margin-top:3px;font-size:11px;color:#6B7280;display:flex;align-items:center;gap:4px;"><i class="bi bi-telephone" style="color:#1A3D91;font-size:10px;"></i> ${invoice.tenant_phone}</div>` : ""}
        </div>

        <!-- Dates -->
        <div style="padding:18px 24px;display:flex;flex-direction:column;justify-content:center;min-width:160px;border-right:1px solid #EEF0F5;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:3px;">Due Date</div>
            <div style="font-size:15px;font-weight:600;color:#111827;">${formatDate(invoice.due_date)}</div>
        </div>

        <!-- Amount Due -->
        <div style="padding:18px 24px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;min-width:180px;background:#F8FAFF;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:6px;">Amount Due</div>
            <div style="font-size:28px;font-weight:800; color:#0F2060;letter-spacing:-0.5px;line-height:1;">
                ${currency}${fmt(balance > 0 ? balance : grandTotal)}
            </div>
            <div style="margin-top:4px;font-size:11px;color:#6B7280;">
                ${paid > 0 ? `<span style="color:#059669;font-weight:600;">${currency}${fmt(paid)} paid</span>` : 'No payments yet'}
            </div>
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
                    <th style="text-align:center;">Tax</th>
                    <th style="text-align:right;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows || `<tr><td colspan="10" style="text-align:center;padding:48px;color:#9CA3AF;font-size:13px;">No items found</td></tr>`}
            </tbody>
        </table>
    </div>

    <!-- ═══ TOTALS ═══ -->
    <div style="display:flex;justify-content:flex-end;padding:16px 20px 8px;">
        <div style="min-width:260px;border:1px solid #E5E9F5;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(15,32,96,0.06);">
            <table style="width:100%;border-collapse:collapse;">
                <tr class="pi-totals-row">
                    <td style="color:#6B7280;">Grand Total</td>
                    <td style="text-align:right;font-weight:600;color:#111827;">${currency}${fmt(grandTotal)}</td>
                </tr>
                <tr class="pi-totals-row">
                    <td style="color:#059669;display:flex;align-items:center;gap:5px;">
                        <i class="bi bi-check-circle-fill" style="font-size:11px;"></i> Amount Paid
                    </td>
                    <td style="text-align:right;font-weight:600;color:#059669;">- ${currency}${fmt(paid)}</td>
                </tr>
                <tr>
                    <td colspan="2" style="padding:0;"></td>
                </tr>
                <tr style="background:linear-gradient(135deg,#0F2060,#1A3D91);">
                    <td style="padding:14px 16px;color:#fff;font-weight:700;font-size:13px;letter-spacing:0.3px;">Balance Due</td>
                    <td style="padding:14px 16px;text-align:right;font-weight:800;color:#FDE68A;font-size:15px;">${currency}${fmt(balance)}</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- ═══ REMARKS ═══ -->
    ${invoice.remarks ? `
    <div style="margin:8px 20px 16px;padding:12px 16px;background:#FFFBEB;border-left:3px solid #F59E0B;border-radius:0 8px 8px 0;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#92400E;margin-bottom:4px;">Remarks</div>
        <div style="font-size:12px;color:#78350F;line-height:1.5;">${invoice.remarks}</div>
    </div>` : ""}

    <!-- ═══ FOOTER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:14px 24px;background:#F8FAFF;border-top:1px solid #E5E9F5;flex-wrap:wrap;gap:12px;">
        <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1A3D91;margin-bottom:4px;">Terms &amp; Conditions</div>
            <div style="font-size:10px;color:#9CA3AF;line-height:1.6;">Payment is due by the date shown above.<br>Late payments may incur additional charges.</div>
        </div>
        <div style="text-align:right;">
            <div style="font-size:10px;color:#9CA3AF;">Generated by Property Manager</div>
            <div style="font-size:11px;font-weight:600;color:#4B5563;margin-top:2px;">${today}</div>
        </div>
    </div>

    <!-- ═══ ACTION BAR ═══ -->
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
        const invoiceEl  = container.querySelector("#pi-invoice-content");
        const printBtn   = container.querySelector("#pi-print-btn");
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
                    <div style="display:flex;align-items:center;justify-content:center;padding:80px 0;gap:14px;color:#6B7280;font-size:13px;">
                        <div style="width:28px;height:28px;border:3px solid #E5E9F5;border-top-color:#1A3D91;border-radius:50%;animation:pi-spin .7s linear infinite;"></div>
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
