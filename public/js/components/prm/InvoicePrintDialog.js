"use strict";

/**
 * InvoicePrintDialog
 * ------------------
 * Usage in invoice.js → renderInvoiceDetail():
 *
 * STEP 1 – put a placeholder button in the HTML string:
 *
 *   <div class="text-end mt-4 no-print">
 *       ${InvoicePrintDialog.renderPrintButton()}
 *   </div>
 *
 * STEP 2 – after container.innerHTML is set, bind the data:
 *
 *   InvoicePrintDialog.bind(container, invoice, validItems, foot.total);
 */
const InvoicePrintDialog = new (function () {
    const self = {};

    /* ─────────────────────────────────────────────────────────
       PUBLIC API
    ───────────────────────────────────────────────────────── */

    /**
     * Returns a plain HTML button string (no data, no onclick attr).
     * Always call bind() after container.innerHTML is assigned.
     */
    self.renderPrintButton = () => {
        self._ensureStyles();
        return `
        <button
            type="button"
            class="inv-print-btn btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 no-print"
            title="Print Invoice"
        >
            <i class="fa-solid fa-print"></i>
            <span>Print Invoice</span>
        </button>`;
    };

    /**
     * Binds the print data to the button rendered inside `container`.
     * Call this immediately after container.innerHTML = `...` is set.
     *
     * @param {Element} container  - The DOM element that holds the HTML string
     * @param {Object}  invoice    - invoice object from API (res.data)
     * @param {Array}   items      - validItems array from renderInvoiceDetail()
     * @param {Number}  grandTotal - foot.total
     */
    self.bind = (container, invoice = {}, items = [], grandTotal = 0) => {
        const btn = container.querySelector('.inv-print-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            self._openPrint(invoice, items, grandTotal);
        });
    };

    /* ─────────────────────────────────────────────────────────
       PRIVATE – print window
    ───────────────────────────────────────────────────────── */

    self._openPrint = (invoice, items, grandTotal) => {
        const html = self._buildPrintDocument(invoice, items, grandTotal);
        const win  = window.open('', '_blank', 'width=960,height=720');
        if (!win) { alert('Please allow popups to print the invoice.'); return; }
        win.document.open();
        win.document.write(html);
        win.document.close();
        win.onload = () => { win.focus(); win.print(); };
    };

    /* ─────────────────────────────────────────────────────────
       PRIVATE – helpers
    ───────────────────────────────────────────────────────── */

    const fmt = (n) =>
        Number(n || 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const fmtDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const discountDisplay = (item) => {
        const val  = parseFloat(item.discount || item.special_discount_value || 0);
        const type = (item.discount_type || item.special_discount_type || 'percent').toLowerCase().trim();
        if (val <= 0) return '—';
        return (type === 'amount' || type === '$') ? `-$${fmt(val)}` : `-${fmt(val)}%`;
    };

    const logoUrl = () =>
        typeof main_view !== 'undefined'
            ? `${main_view.base_url}/assets/images/logo/ksm-logo.png`
            : '';

    const typeBadgeStyle = (type) => {
        const t = (type || 'service').toLowerCase().trim();
        if (t === 'rent')    return 'background:#3b82f6;color:#fff;border:none;';
        if (t === 'utility') return 'background:#f59e0b;color:#111;border:none;';
        return 'background:#f3f4f6;color:#374151;border:1px solid #d1d5db;';
    };

    const statusClass = (name) => {
        const s = (name || '').toLowerCase();
        if (s === 'paid')          return 'inv-status--paid';
        if (s === 'unpaid')        return 'inv-status--unpaid';
        if (s.includes('partial')) return 'inv-status--partial';
        return 'inv-status--default';
    };

    /* ─────────────────────────────────────────────────────────
       PRIVATE – build full print HTML document
    ───────────────────────────────────────────────────────── */

    self._buildPrintDocument = (invoice, items, grandTotal) => {
        const logo = logoUrl();

        const itemRows = items.length > 0
            ? items.map(item => `
                <tr>
                    <td>${item.description || item.remarks || item.item_name || '—'}</td>
                    <td class="c">
                        <span class="badge" style="${typeBadgeStyle(item.type)}">${item.type || 'service'}</span>
                    </td>
                    <td class="c">${parseFloat(item.qty || 1)}</td>
                    <td class="c">${item.unit_type ? item.unit_type.trim() : '—'}</td>
                    <td class="c">${fmtDate(item.start_date)}</td>
                    <td class="c">${fmtDate(item.end_date)}</td>
                    <td class="r">$${fmt(item.price)}</td>
                    <td class="r danger">${discountDisplay(item)}</td>
                    <td class="c info">+${parseFloat(item.tax_rate || 0)}%</td>
                    <td class="r bold">$${fmt(item.total || item.amount)}</td>
                </tr>`).join('')
            : `<tr><td colspan="10" class="c muted" style="padding:24px;">No items found</td></tr>`;

        const totalDiscount = items.reduce(
            (acc, i) => acc + parseFloat(i.discount || i.special_discount_value || 0), 0
        );

        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice ${invoice.code || ''}</title>
<style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; color: #333; background: #f0f0f0; }
    .page { background: #fff; max-width: 860px; margin: 24px auto; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 28px rgba(0,0,0,0.12); }

    /* Header */
    .inv-header { background: #6b21a8; color: #fff; display: flex; justify-content: space-between; align-items: flex-end; padding: 28px 36px 22px; }
    .inv-header__left { display: flex; flex-direction: column; gap: 8px; }
    .inv-logo { width: 54px; height: 54px; object-fit: contain; background: rgba(255,255,255,0.15); border-radius: 50%; padding: 5px; }
    .inv-title { font-size: 30px; font-weight: 800; line-height: 1; }
    .inv-company { text-align: right; line-height: 1.7; }
    .inv-company strong { font-size: 15px; }

    /* Meta */
    .inv-meta { display: flex; justify-content: space-between; align-items: flex-start; padding: 22px 36px; border-bottom: 1px solid #e5e7eb; gap: 24px; }
    .section-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: #9ca3af; text-transform: uppercase; margin-bottom: 6px; }
    .tenant-name { font-size: 16px; font-weight: 700; color: #111; }
    .inv-meta__details { text-align: right; line-height: 2; min-width: 250px; }
    .meta-row { display: flex; justify-content: flex-end; gap: 16px; align-items: center; }
    .meta-key { font-size: 10px; font-weight: 700; letter-spacing: 0.7px; color: #9ca3af; text-transform: uppercase; white-space: nowrap; }
    .meta-val { font-weight: 600; color: #111; white-space: nowrap; }
    .inv-status { display: inline-block; padding: 2px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
    .inv-status--paid    { background: #dcfce7; color: #16a34a; }
    .inv-status--unpaid  { background: #fee2e2; color: #dc2626; }
    .inv-status--partial { background: #fef9c3; color: #92400e; }
    .inv-status--default { background: #f3f4f6; color: #374151; }

    /* Table */
    .inv-table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f0f4ff; }
    th { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; color: #374151; padding: 10px 12px; border-bottom: 2px solid #e5e7eb; white-space: nowrap; }
    td { padding: 11px 12px; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: middle; }
    tbody tr:last-child td { border-bottom: none; }
    tfoot td { font-weight: 700; font-size: 12px; background: #f9fafb; padding: 10px 12px; }
    .r { text-align: right; } .c { text-align: center; } .bold { font-weight: 700; }
    .muted { color: #9ca3af; } .danger { color: #dc2626; } .info { color: #0891b2; } .success { color: #16a34a; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; text-transform: capitalize; }

    /* Footer */
    .inv-footer { display: flex; align-items: stretch; border-top: 1px solid #e5e7eb; }
    .inv-footer__notes { flex: 1; padding: 20px 36px; background: #f9fafb; font-size: 12px; color: #4b5563; line-height: 1.7; }
    .inv-footer__notes-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #374151; margin-bottom: 6px; }
    .inv-footer__total { background: #6b21a8; color: #fff; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding: 20px 36px; min-width: 240px; gap: 4px; }
    .total-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; opacity: 0.8; }
    .total-amount { font-size: 28px; font-weight: 800; }

    @media print {
        body { background: #fff; }
        .page { margin: 0; box-shadow: none; border-radius: 0; max-width: 100%; }
        .inv-header, .inv-footer__total { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
</style>
</head>
<body>
<div class="page">

    <div class="inv-header">
        <div class="inv-header__left">
            ${logo ? `<img src="${logo}" alt="Logo" class="inv-logo">` : ''}
            <span class="inv-title">Invoice</span>
        </div>
        <div class="inv-company">
            <strong>Your Company Name</strong><br>
            Your Business Address<br>
            City, Country
        </div>
    </div>

    <div class="inv-meta">
        <div>
            <p class="section-label">Bill To</p>
            <p class="tenant-name">${invoice.tenant_name || '—'}</p>
            ${invoice.space_code ? `<p>${invoice.space_code}</p>` : ''}
        </div>
        <div class="inv-meta__details">
            <div class="meta-row">
                <span class="meta-key">Invoice #</span>
                <span class="meta-val">${invoice.code || '—'}</span>
            </div>
            <div class="meta-row">
                <span class="meta-key">Invoice Date</span>
                <span class="meta-val">${fmtDate(invoice.created_at || invoice.invoice_date)}</span>
            </div>
            <div class="meta-row">
                <span class="meta-key">Due Date</span>
                <span class="meta-val">${fmtDate(invoice.due_date)}</span>
            </div>
            <div class="meta-row">
                <span class="meta-key">Status</span>
                <span class="meta-val">
                    <span class="inv-status ${statusClass(invoice.payment_status_name)}">
                        ${invoice.payment_status_name || '—'}
                    </span>
                </span>
            </div>
        </div>
    </div>

    <div class="inv-table-wrap">
        <table>
            <thead>
                <tr>
                    <th style="min-width:140px;">Description</th>
                    <th style="width:85px;">Type</th>
                    <th style="width:55px;">Qty</th>
                    <th style="width:75px;">Unit</th>
                    <th style="width:98px;">Start Date</th>
                    <th style="width:98px;">End Date</th>
                    <th class="r" style="width:85px;">Price</th>
                    <th class="r" style="width:90px;">Discount</th>
                    <th style="width:55px;">Tax%</th>
                    <th class="r" style="width:100px;">Total</th>
                </tr>
            </thead>
            <tbody>${itemRows}</tbody>
            <tfoot>
                <tr>
                    <td colspan="7" class="r" style="text-transform:uppercase;letter-spacing:0.5px;font-size:11px;color:#6b7280;">Summary</td>
                    <td class="r danger">-$${fmt(totalDiscount)}</td>
                    <td></td>
                    <td class="r success" style="font-size:15px;">$${fmt(grandTotal)}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="inv-footer">
        <div class="inv-footer__notes">
            ${invoice.remarks ? `<p class="inv-footer__notes-label">Remarks</p><p>${invoice.remarks}</p>` : ''}
        </div>
        <div class="inv-footer__total">
            <span class="total-label">Total</span>
            <span class="total-amount">$${fmt(grandTotal)}</span>
        </div>
    </div>

</div>
</body>
</html>`;
    };

    self._ensureStyles = () => {
        if (document.getElementById('inv-print-btn-style')) return;
        const s = document.createElement('style');
        s.id = 'inv-print-btn-style';
        s.textContent = `@media print { .no-print { display: none !important; } }`;
        document.head.appendChild(s);
    };

    return self;
})();
