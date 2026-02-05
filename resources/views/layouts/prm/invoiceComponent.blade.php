<div id="_main_invoice_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_invoice" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_invoice" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
         </div>

            <div class="col-12 col-md-6 col-lg-2 ">
                <select id="building_id" class="data-input filter-field form-control" data-field="building_id"></select>
            </div>
           <div class="col-12 col-md-6 col-lg-2">
                <select id="payment_status" class="data-input filter-field form-control" data-field="status_id"></select>
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btn btn--Options w-70 w-md-auto" id="_btnInvoice">
                      <i class="fa-solid fa-file-invoice-dollar mr-2"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>

        </div>

    </div>

    <div id="_invoice_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        :root {
            --invoice-primary: #2c3e50;
            --invoice-secondary: #34495e;
            --invoice-border: #dee2e6;
        }

        body {
            font-family: 'IBM Plex Mono', monospace;
            background-color: #f8f9fa;
        }

        .invoice-wrapper {
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .invoice-separator {
            border: 0;
            border-top: 2px dashed var(--invoice-primary);
            opacity: 0.5;
        }

        .company-header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
        }

        .invoice-badge {
            background-color: #e74c3c;
            color: white;
            font-weight: 600;
            letter-spacing: 1px;
        }

        .info-label {
            font-weight: 600;
            color: var(--invoice-primary);
            font-size: 0.85rem;
        }

        .info-value {
            color: #6c757d;
            font-size: 0.85rem;
        }

        .section-title {
            color: var(--invoice-primary);
            font-weight: 700;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid var(--invoice-primary);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
        }

        .table-invoice {
            font-size: 0.85rem;
        }

        .table-invoice thead {
            background-color: var(--invoice-primary);
            color: white;
        }

        .table-invoice tbody tr {
            border-bottom: 1px solid var(--invoice-border);
        }

        .table-invoice tbody tr:hover {
            background-color: #f8f9fa;
        }

        .item-note {
            font-size: 0.75rem;
            color: #6c757d;
            font-style: italic;
            margin-left: 1.5rem;
        }

        .totals-card {
            background-color: #f8f9fa;
            border-left: 4px solid var(--invoice-primary);
        }

        .total-row {
            font-size: 0.9rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid var(--invoice-border);
        }

        .grand-total-row {
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--invoice-primary);
            padding: 0.75rem 0;
            border-top: 3px double var(--invoice-primary);
            border-bottom: none;
        }

        .payment-info-card {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-left: 4px solid #28a745;
        }

        .payment-method {
            background: white;
            border: 1px solid var(--invoice-border);
            border-radius: 0.375rem;
            transition: all 0.3s ease;
        }

        .payment-method:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border-color: var(--invoice-primary);
        }

        .badge-custom {
            font-size: 0.7rem;
            padding: 0.4rem 0.8rem;
            letter-spacing: 0.5px;
        }

        .footer-notes {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
        }

        @media print {
            body {
                background: white;
            }
            .invoice-wrapper {
                box-shadow: none;
            }
            .no-print {
                display: none;
            }
        }
    </style>
