"use strict";

const PrintReceiptDialog = (() => {
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
    const printViaIframe = (receiptEl) => {
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
    @page { size: A4 portrait; margin: 10mm; }
    @media print {
        body { margin: 8mm; }
        .pi-action-bar { display:none!important; }
    }
</style>
</head>
<body>${receiptEl.outerHTML}</body>
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

    /* ── Build Receipt HTML (Matching Invoice Style) ── */
    const buildReceiptHTML = (receipt) => {
        const breakdowns = receipt.breakdowns || [];
        let paymentDetails = breakdowns.map(b => {
            let method = b.method || 'Cash';
            if (b.registered_bank_name || b.manual_bank_name) method += ` (${b.registered_bank_name || b.manual_bank_name})`;
            if (b.card_type) method += ` ${b.card_type}`;
            return `${method}: ${currency}${fmt(b.amount)}`;
        }).join('<br>') || '—';

        const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

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
</style>

<div class="pi-root" id="pi-receipt-content">

    <!-- HEADER BAND (Same style as Invoice) -->
    <div style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:15px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
        <!-- decorative circles -->
        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);pointer-events:none;"></div>
        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);pointer-events:none;"></div>

        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;">
            <div style="width:60px;height:60px;border-radius:14px;background:rgba(255,255,255,0.12);border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                <img src="../assets/images/meta/Meta_logo1.png" alt="Logo"
                    style="width:54px;height:54px;object-fit:contain;"
                    onerror="this.parentElement.innerHTML='<span style=\'font-size:22px;font-weight:900;color:#fff;font-family:Playfair Display,serif;\'>M</span>'">
            </div>
            <div>
                <div style="font-family:'Playfair Display',serif;font-size:24px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">META TOWER</div>
                <div style="margin-top:6px;font-size:11px;color:rgba(255,255,255,0.75);">Phnom Penh, Cambodia</div>
            </div>
        </div>

        <div style="text-align:right;position:relative;">
            <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;line-height:1;">RECEIPT</div>
            <div style="font-size:15px;font-weight:700;color:#FDE68A;margin-top:4px;">${receipt.code || "—"}</div>
        </div>
    </div>

    <!-- META BAR -->
    <div style="display:flex;justify-content:space-between;align-items:stretch;gap:0;border-bottom:2px solid #E5E9F5;flex-wrap:wrap;">

        <!-- Received From -->
        <div style="padding:18px 24px;flex:1;min-width:200px;border-right:1px solid #EEF0F5;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:7px;">Received From</div>
            <div style="font-size:17px;font-weight:700;color:#111827;line-height:1.2;">${receipt.tenant_name || "—"}</div>
            ${receipt.tenant_phone ? `<div style="margin-top:5px;font-size:11px;color:#6B7280;">${receipt.tenant_phone}</div>` : ""}
        </div>

        <!-- Receipt Date -->
        <div style="padding:18px 24px;display:flex;flex-direction:column;justify-content:center;min-width:160px;border-right:1px solid #EEF0F5;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:3px;">Receipt Date</div>
            <div style="font-size:15px;font-weight:600;color:#111827;">${formatDate(receipt.receipt_date)}</div>
        </div>

        <!-- Total Received -->
        <div style="padding:18px 24px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;min-width:180px;background:#F8FAFF;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:6px;">Total Received</div>
            <div style="font-size:28px;font-weight:800;font-family:'Playfair Display',serif;color:#0F2060;letter-spacing:-0.5px;">
                ${currency}${fmt(receipt.total_received || 0)}
            </div>
        </div>
    </div>

    <!-- PAYMENT DETAILS -->
    <div style="padding:24px;">
        <div style="font-size:13px;font-weight:700;color:#1A3D91;margin-bottom:12px;">Payment Method(s)</div>
        <div style="background:#fff;border:1px solid #E5E9F5;border-radius:8px;padding:18px;line-height:1.7;font-size:13.5px;">
            ${paymentDetails}
        </div>

        ${receipt.remarks ? `
        <div style="margin-top:20px;padding:14px 18px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:4px;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#92400E;margin-bottom:6px;">Remark</div>
            <div style="color:#78350F;">${receipt.remarks}</div>
        </div>` : ""}
    </div>

    <!-- FOOTER -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:18px 24px;background:#F8FAFF;border-top:1px solid #E5E9F5;flex-wrap:wrap;gap:12px;">
        <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1A3D91;margin-bottom:4px;">Thank You</div>
            <div style="font-size:10px;color:#9CA3AF;line-height:1.5;">Payment received and acknowledged.<br>Official receipt for your records.</div>
        </div>
        <div style="text-align:right;">
            <div style="font-size:10px;color:#9CA3AF;">Generated by Property Manager</div>
            <div style="font-size:11px;font-weight:600;color:#4B5563;margin-top:4px;">${today}</div>
        </div>
    </div>

    <!-- ACTION BAR -->
    <div class="pi-action-bar" style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid #E5E9F5;background:#fff;">
        <button id="pi-print-btn"
            style="padding:9px 22px;border-radius:8px;border:1.5px solid #1A3D91;background:#fff;color:#1A3D91;font-weight:600;display:inline-flex;align-items:center;gap:7px;">
            <i class="bi bi-printer-fill"></i> Print Receipt
        </button>
    </div>

</div>`;
    };

    const wireButtons = (container) => {
        const receiptEl = container.querySelector("#pi-receipt-content");
        const printBtn = container.querySelector("#pi-print-btn");
        if (printBtn) printBtn.addEventListener("click", () => printViaIframe(receiptEl));
    };

    self.show = (op) => {
        if (!op || !op.receipt_id) {
            cv_interact?.error("Receipt ID is missing");
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
                        Loading receipt…
                    </div>
                    <style>@keyframes pi-spin{to{transform:rotate(360deg)}}</style>
                </div>`,
            contentCreated: (me) => {
                const container = me.divModal.querySelector('[name="pi_container"]');
                vsapi.call(`${main_view.base_url}/prm/receipts/details`, { id: op.receipt_id })
                    .then((res) => {
                        if (res.status_code !== 200) {
                            container.innerHTML = `<div class="alert alert-danger m-4">Error: ${res.error_message || "Unknown error"}</div>`;
                            return;
                        }
                        container.innerHTML = buildReceiptHTML(res.data || {});
                        wireButtons(container);
                    })
                    .catch(() => {
                        container.innerHTML = `<div class="alert alert-danger m-4">Network error — could not load receipt.</div>`;
                    });
            },
            buttons: [{ label: "Close", cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });

        dlg.show(op);
    };

    return self;
})();
