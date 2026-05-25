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

    // Convert number to words (USD)
    const numberToWords = (amount) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
            'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        if (amount === 0) return 'Zero Dollars Only';
        const dollars = Math.floor(amount);
        const cents = Math.round((amount - dollars) * 100);
        const toWords = (n) => {
            if (n === 0) return '';
            if (n < 20) return ones[n] + ' ';
            if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '') + ' ';
            return ones[Math.floor(n / 100)] + ' Hundred ' + toWords(n % 100);
        };
        const thousands = Math.floor(dollars / 1000);
        const remainder = dollars % 1000;
        let result = '';
        if (thousands > 0) result += toWords(thousands) + 'Thousand ';
        if (remainder > 0) result += toWords(remainder);
        result = result.trim() + ' Dollar' + (dollars !== 1 ? 's' : '');
        if (cents > 0) result += ' and ' + toWords(cents).trim() + ' Cent' + (cents !== 1 ? 's' : '');
        return result + ' Only';
    };

    // Determine payment status label
    const getPaymentStatus = (paid, netTotal) => {
        if (paid <= 0) return { label: 'Unpaid', color: '#DC2626' };
        if (paid >= netTotal) return { label: 'Paid', color: '#16A34A' };
        return { label: 'Partially Paid', color: '#D97706' };
    };

const printViaIframe = (receiptEl) => {
    const styleHTML = Array.from(document.querySelectorAll("style"))
        .map(s => s.outerHTML).join("\n");
    
    const biLink = Array.from(document.querySelectorAll('link[href*="bootstrap-icons"]'))
        .map(l => l.outerHTML).join("\n");

    const fontLink = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

    const fullDoc = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${fontLink}
        ${biLink}
        ${styleHTML}
        
        <style>
            *, *::before, *::after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            body {
                font-family: 'Inter', 'DM Sans', sans-serif;
                background: #fff;
                color: #111;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                padding: 0;
                margin: 0;
            }

            .pi-root {
                max-width: 100%;
                margin: 0 auto;
            }

            .pi-action-bar { 
                display: none !important; 
            }

            /* Better Print Settings */
            @page {
                size: A4 portrait;           /* Changed to portrait - better for receipts */
                margin: 8mm;
            }

            @media print {
                body {
                    background: #fff !important;
                    margin: 0;
                    padding: 0;
                }

                .pi-action-bar,
                .pi-action-bar * {
                    display: none !important;
                }

                .pi-root {
                    box-shadow: none !important;
                }

                /* Improve font rendering on paper */
                strong, b, .font-bold, [style*="font-weight:600"], 
                [style*="font-weight:700"], [style*="font-weight:800"] {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    font-weight: 700 !important;
                }

                table {
                    break-inside: auto;
                }

                tr {
                    break-inside: avoid;
                }
            }
        </style>
    </head>
    <body>
        ${receiptEl.outerHTML}
    </body>
    </html>`;

    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.cssText = `
        position: fixed; 
        top: 0; left: 0; 
        width: 0; height: 0; 
        border: none; 
        opacity: 0; 
        pointer-events: none; 
        z-index: -9999;
    `;

    document.body.appendChild(iframe);

    const iDoc = iframe.contentWindow.document;
    iDoc.open();
    iDoc.write(fullDoc);
    iDoc.close();

    iframe.onload = () => {
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Cleanup after printing
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 1500);
        }, 500);
    };
};

    const buildReceiptHTML = (receipt, invoice = null) => {
        const data = { ...receipt, ...(invoice || {}) };
        const items = data.items || [];
        const breakdowns = data.breakdowns || [];

        console.log("🔍 Items Count:", items.length);
        console.log("🔍 Breakdowns Count:", breakdowns.length);

        // Totals
        const subTotal      = parseFloat(data.amount || 0);
        const totalDiscount = parseFloat(data.discount_value || 0);
        const netTotal      = parseFloat(data.amount_payable || 0);
        const paymentAmount = parseFloat(receipt.total_received || 0);
        const paid          = parseFloat(data.paid_amount || 0);
        const balance       = parseFloat(data.due_amount || 0);
        const discValue     = subTotal - netTotal;
        const discType      = (data.discount_type || "percent").toLowerCase();
        const isAmountDisc  = discType === "amount" || discType === "$";

        const status = getPaymentStatus(paymentAmount, netTotal);
        const today  = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

        // Item Rows
        const itemRows = items.map((item, i) => {
            const qty   = parseFloat(item.qty || 1);
            const price = parseFloat(item.price || 0);
            const total = parseFloat(item.total || item.amount || (qty * price));
            const disc  = parseFloat(item.discount || 0);

            console.log("🔍 Item discount:1111", disc);
            const tax   = parseFloat(item.tax_rate || 0);
            return `
            <tr style="background:${i % 2 !== 0 ? '#F9FAFB' : '#FFFFFF'};">
                <td style="padding:9px 12px;border:1px solid #D1D5DB;font-size:12px;color:#111;">${item.remarks || item.item_name || "—"}</td>
                <td style="padding:9px 8px;border:1px solid #D1D5DB;text-align:center;font-size:12px;color:#111;">${qty}${item.unit_type ? ' ' + item.unit_type.trim() : ''}</td>
                <td style="padding:9px 8px;border:1px solid #D1D5DB;text-align:center;font-size:11px;color:#374151;">${formatDate(item.start_date)}</td>
                <td style="padding:9px 8px;border:1px solid #D1D5DB;text-align:center;font-size:11px;color:#374151;">${formatDate(item.end_date)}</td>
                <td style="padding:9px 10px;border:1px solid #D1D5DB;border-left:none;text-align:right;font-size:12px;color:#111;">${fmt(price)}$</td>
                <td style="padding:9px 10px;border:1px solid #D1D5DB;text-align:right;font-size:12px;color:#DC2626;">${disc > 0 ? `${(disc)}${(item.discount_type || '').toLowerCase() === 'percent' ? '%' : ''}` : '—'}</td>
                <td style="padding:9px 10px;border:1px solid #D1D5DB;text-align:right;font-size:12px;color:#374151;">${tax > 0 ? `${(tax)}%` : "—"}</td>
                <td style="padding:9px 10px;border:1px solid #D1D5DB;border-left:none;text-align:right;font-size:12px;font-weight:700;color:#1A3D91;">${fmt(total)}$</td>
            </tr>`;
        }).join("");

        // Payment method rows
        const paymentRows = breakdowns.length > 0
            ? breakdowns.map(b => {
                let method = b.method || 'Cash';
                let detail = '';
                if (b.registered_bank_name || b.manual_bank_name) detail += `Bank (${b.registered_bank_name || b.manual_bank_name})`;
                if (b.account_number || b.card_number) detail += ` By ( ${b.account_number || b.card_number} )`;
                if (b.card_type) detail += ` ${b.card_type}`;
                return `
                <tr>
                    <td style="padding:6px 10px;font-size:12px;color:#374151;width:80px;white-space:nowrap;">${method} :</td>
                    <td style="padding:6px 8px;font-size:12px;width:150px;">
                        <span style="display:block;border:1px solid #D1D5DB;border-radius:3px;padding:2px 10px;text-align:right;font-weight:600;color:#1A3D91;">$ ${fmt(b.amount)}</span>
                    </td>
                    <td style="padding:6px 10px;font-size:12px;color:#6B7280;">${detail}</td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="3" style="padding:6px 10px;font-size:12px;color:#6B7280;">Cash</td></tr>`;

        return `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    .pi-root { font-family: 'DM Sans', sans-serif; color: #1f2937; background: #fff; }
    .pi-doc-table { width:100%; border-collapse:collapse; }
    .pi-doc-table th {
        padding: 9px 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px;
        text-transform: uppercase; background:#F3F4F6; border:1px solid #D1D5DB; color:#374151;
    }
    @keyframes pi-spin { to { transform:rotate(360deg) } }
</style>

<div class="pi-root" id="pi-receipt-content">

    <!-- ═══ HEADER (kept as-is) ═══ -->
    <div style="background:linear-gradient(135deg,#0F2060 0%,#1A3D91 55%,#2254C5 100%);padding:10px;display:flex;justify-content:space-between;align-items:flex-start;gap:20px;position:relative;overflow:hidden;">
        <div style="position:absolute;right:-40px;top:-40px;width:180px;height:180px;border-radius:50%;background:rgba(255,255,255,0.04);"></div>
        <div style="position:absolute;right:60px;top:20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,0.05);"></div>
        <div style="display:flex;gap:18px;align-items:flex-start;position:relative;">
            <div style="width:70px;height:76px;background:rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0;">
                <img src="../assets/images/meta/Meta_logo1.png" alt="Logo"
                    style="width:60px;height:63px;object-fit:contain;"
                    onerror="this.parentElement.innerHTML='<span style=&quot;font-size:22px;font-weight:900;color:#fff;font-family:Playfair Display,serif;&quot;>M</span>'">
            </div>
            <div>
                <div style="font-family:'Playfair Display',serif;font-size:22px;font-weight:900;color:#FFFFFF;letter-spacing:0.5px;line-height:1.1;">META HOLDING</div>
                <div style="margin-top:6px;display:flex;flex-direction:column;gap:3px;">
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;"><i class="bi bi-envelope-fill" style="font-size:9px;"></i> metaholding@gmail.com</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;"><i class="bi bi-telephone-fill" style="font-size:9px;"></i> +855 12 345 678</div>
                    <div style="font-size:11px;color:rgba(255,255,255,0.65);display:flex;align-items:center;gap:5px;"><i class="bi bi-geo-alt-fill" style="font-size:9px;"></i> #S8-0 2, Financial Street, Phum 7, Sangkat Veal Vong, Khan 7 Makara, Phnom Penh</div>
                </div>
            </div>
        </div>
        <div style="text-align:right;">
            <div style="font-family:'Playfair Display',serif;font-size:32px;font-weight:900;color:#FFFFFF;">RECEIPT</div>
            <div style="font-size:16px;font-weight:700;color:#FDE68A;">${data.code || "—"}</div>
        </div>
    </div>

    <!-- ═══ META BAR (kept as-is) ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:stretch;gap:0;flex-wrap:wrap;border-bottom:2px solid #E5E7EB;">
        <div style="padding:14px 20px;flex:1;min-width:200px;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:5px;">Received From</div>
            <div style="font-size:16px;font-weight:700;color:#111827;">${data.tenant_name || "—"}</div>
            ${data.tenant_phone ? `<div style="margin-top:3px;font-size:11px;color:#6B7280;">${data.tenant_phone}</div>` : ""}
        </div>
        <div style="padding:14px 20px;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;min-width:180px;text-align:right;">
            <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9CA3AF;margin-bottom:3px;">Receipt Date</div>
            <div style="font-size:14px;font-weight:600;color:#111827;">${formatDate(data.receipt_date || data.issue_date)}</div>
        </div>
    </div>

    <!-- ═══ ITEMS TABLE (formal bordered) ═══ -->
    <div style="overflow-x:auto;">
        <table class="pi-doc-table">
            <thead>
                <tr>
                    <th style="text-align:left;min-width:120px;">Description</th>
                    <th style="text-align:center;width:80px;">Qty</th>
                    <th style="text-align:center;width:100px;">Start Date</th>
                    <th style="text-align:center;width:100px;">End Date</th>
                    <th style="text-align:center;width:100px;">Price</th>
                    <th style="text-align:right;width:40px;">Discount</th>
                    <th style="text-align:right;width:40px;">Tax</th>
                    <th style="text-align:right;width:90px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows || `<tr><td colspan="10" style="padding:50px;text-align:center;color:#9CA3AF;font-size:13px;border:1px solid #D1D5DB;">No items found</td></tr>`}
            </tbody>
        </table>
    </div>

    <!-- ═══ PAYMENT + SUMMARY (side by side, reference style) ═══ -->
    <div style="display:flex;align-items:flex-start;border-top:1px solid #D1D5DB;position:relative;min-height:120px;">

        <!-- Diagonal watermark stamp -->
        <div style="position:absolute;left:35%;top:50%;transform:translate(-50%,-50%) rotate(-25deg);font-size:26px;font-weight:900;color:${status.color};opacity:0.15;letter-spacing:2px;white-space:nowrap;pointer-events:none;text-transform:uppercase;font-family:'Playfair Display',serif;z-index:0;text-align:center;line-height:1.3;">
            ${status.label}<br><span style="font-size:15px;">${today}</span>
        </div>

        <!-- LEFT: Method of Payment -->
        <div style="flex:1;padding:14px 20px;border-right:1px solid #D1D5DB;position:relative;z-index:1;min-width:220px;">
            <div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:10px;text-decoration:underline;text-underline-offset:3px;">* Method of Payment</div>
            <table style="border-collapse:collapse;">
                <tbody>${paymentRows}</tbody>
            </table>
        </div>

        <!-- RIGHT: Card summary + Khmer formal table -->
        <div style="min-width:340px;position:relative;z-index:1;">

            <!-- Card-style summary rows -->
            <div style="border:1px solid #E5E9F5;border-radius:0;overflow:hidden;border-left:none;border-right:none;">

                <div style="display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #EEF0F5;">
                    <span style="font-size:12px;color:#6B7280;">Sub Total</span>
                    <span style="font-size:12px;font-weight:600;color:#111827;">${currency}${fmt(subTotal)}</span>
                </div>

                <div style="display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #EEF0F5;">
                    <span style="font-size:12px;color:#A32D2D;">Discount ${totalDiscount > 0 ? `(${isAmountDisc ? currency : ''}${fmt(totalDiscount)}${!isAmountDisc ? '%' : ''})` : ''}</span>
                    <span style="font-size:12px;font-weight:600;color:#A32D2D;">− ${currency}${fmt(discValue)}</span>
                </div>

                <div style="display:flex;justify-content:space-between;padding:12px 16px;background:#F8FAFF;border-top:2px solid #E5E9F5;border-bottom:1px solid #EEF0F5;">
                    <span style="font-size:13px;font-weight:700;color:#111;">Total (Net)</span>
                    <span style="font-size:14px;font-weight:700;color:#111;">${currency}${fmt(netTotal)}</span>
                </div>

                <div style="display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #EEF0F5;">
                    <span style="font-size:12px;color:#3B6D11;">Payment Amount</span>
                    <span style="font-size:12px;font-weight:600;color:#3B6D11;">${currency}${fmt(paymentAmount)}</span>
                </div>

                <div style="display:flex;justify-content:space-between;padding:10px 16px;border-bottom:1px solid #EEF0F5;">
                    <span style="font-size:12px;color:#3B6D11;">Total Paid</span>
                    <span style="font-size:12px;font-weight:600;color:#3B6D11;">${currency}${fmt(paid)}</span>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;background:#0F2060;">
                    <span style="font-size:12px;font-weight:500;color:rgba(255,255,255,0.8);">Balance</span>
                    <span style="font-size:16px;font-weight:700;color:#FDE68A;">${currency}${fmt(balance)}</span>
                </div>

            </div>

            
        </div>
    </div>

    <!-- ═══ AMOUNT IN WORDS + REMARKS ═══ -->
    <div style="padding:12px 20px;border-top:1px solid #E5E7EB;background:#FAFAFA;">
        <div style="font-size:12px;color:#374151;">
            <span style="font-weight:700;">Amount In Words:</span>
            <span style="margin-left:8px;">${numberToWords(paymentAmount)}</span>
        </div>
        <div style="font-size:12px;color:#374151;margin-top:10px;display:flex;align-items:baseline;gap:6px;">
            <span style="font-weight:700;white-space:nowrap;">*Remarks:</span>
            <span style="flex:1;border-bottom:1px solid #9CA3AF;padding-bottom:2px;">&nbsp;${data.remarks || ''}</span>
        </div>
    </div>

    <!-- ═══ SIGNATURE LINES ═══ -->
    <div style="display:flex;justify-content:space-between;padding:24px 60px 16px;gap:60px;">
        <div style="flex:1;text-align:center;">
            <div style="font-size:12px;color:#374151;margin-bottom:2px;">ហត្ថលេខា និងឈ្មោះអតិថិជន</div>
            <div style="font-size:11px;color:#6B7280;margin-bottom:36px;">Customer's Signature &amp; Name</div>
            <div style="border-bottom:1px dashed #6B7280;"></div>
        </div>
        <div style="flex:1;text-align:center;">
            <div style="font-size:12px;color:#374151;margin-bottom:2px;">ហត្ថលេខា និងឈ្មោះបេញ្ចូរ</div>
            <div style="font-size:11px;color:#6B7280;margin-bottom:36px;">Issued By</div>
            <div style="border-bottom:1px dashed #6B7280;"></div>
        </div>
    </div>

    <!-- ═══ FOOTER (kept as-is) ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:12px 20px;background:#F8FAFF;border-top:1px solid #E5E9F5;flex-wrap:wrap;gap:12px;">
        <div>
            <div style="font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#1A3D91;">Thank You</div>
            <div style="font-size:10px;color:#9CA3AF;">Payment received and acknowledged.</div>
        </div>
        <div style="text-align:right;">
            <div style="font-size:10px;color:#9CA3AF;">Generated by Property Manager</div>
            <div style="font-size:11px;font-weight:600;color:#4B5563;">${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
        </div>
    </div>

    <!-- ACTION BAR -->
    <div class="pi-action-bar" style="display:flex;justify-content:flex-end;gap:10px;padding:14px 20px;border-top:1px solid #E5E9F5;background:#fff;">
        <button id="pi-print-btn" style="padding:9px 22px;border-radius:8px;border:1.5px solid #1A3D91;background:#fff;color:#1A3D91;font-weight:600;cursor:pointer;">
            <i class="bi bi-printer-fill"></i> Print Receipt
        </button>
    </div>

</div>`;
    };

    const wireButtons = (container) => {
        const receiptEl = container.querySelector("#pi-receipt-content");
        const printBtn  = container.querySelector("#pi-print-btn");
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
                            container.innerHTML = `<div class="alert alert-danger m-4">Error loading receipt.</div>`;
                            return;
                        }
                        const receiptData = res.data || {};
                        console.log("receiptData", receiptData);
                        const invoiceId = receiptData.invoice_id || op.invoice_id;

                        if (invoiceId) {
                            vsapi.call(`${main_view.base_url}/prm/invoice/details`, { id: invoiceId })
                                .then((invRes) => {
                                    const invoiceData = (invRes.status_code === 200) ? invRes.data : null;
                                    container.innerHTML = buildReceiptHTML(receiptData, invoiceData);
                                    wireButtons(container);
                                })
                                .catch(() => {
                                    container.innerHTML = buildReceiptHTML(receiptData);
                                    wireButtons(container);
                                });
                        } else {
                            container.innerHTML = buildReceiptHTML(receiptData);
                            wireButtons(container);
                        }
                    })
                    .catch(() => {
                        container.innerHTML = `<div class="alert alert-danger m-4">Network error.</div>`;
                    });
            },
            buttons: [{ label: "Close", cssClass: "btn btn-secondary", click: (me) => me.hide() }]
        });

        dlg.show(op);
    };

    return self;
})();