<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap Invoice Template</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
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
</head>
<body>
    <div class="container my-5">
        <div class="invoice-wrapper">
            <!-- Company Header -->
            <div class="company-header text-center py-4">
                <h2 class="mb-2 fw-bold">META TOWER MANAGEMENT CO., LTD</h2>
                <p class="mb-1"><i class="bi bi-geo-alt-fill"></i> SBC Tower, Street 2004, Phnom Penh, Cambodia</p>
                <p class="mb-0 small">
                    <span class="me-3"><i class="bi bi-card-text"></i> Tax ID: 000123456</span>
                    <span><i class="bi bi-telephone-fill"></i> Tel: +855 23 999 888</span>
                </p>
            </div>

            <hr class="invoice-separator my-0">

            <!-- Invoice Title -->
            <div class="text-center py-3 bg-light">
                <h4 class="mb-0 fw-bold">
                    <span class="badge invoice-badge px-4 py-2">TAX INVOICE / វិក្កយបត្រ</span>
                </h4>
            </div>

            <!-- Invoice Meta Info -->
            <div class="container-fluid px-4 py-3 bg-white border-bottom">
                <div class="row">
                    <div class="col-md-8">
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <span class="info-label">Invoice No:</span>
                            </div>
                            <div class="col-sm-8">
                                <span class="info-value fw-semibold">INV-202602-00703</span>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="row mb-2">
                            <div class="col-sm-5">
                                <span class="info-label">Date:</span>
                            </div>
                            <div class="col-sm-7">
                                <span class="info-value">02 February 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-8"></div>
                    <div class="col-md-4">
                        <div class="row">
                            <div class="col-sm-5">
                                <span class="info-label">Due Date:</span>
                            </div>
                            <div class="col-sm-7">
                                <span class="info-value fw-semibold text-danger">15 February 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Billing and Property Information -->
            <div class="container-fluid px-4 py-4">
                <div class="row g-4">
                    <!-- Bill To -->
                    <div class="col-md-6">
                        <div class="card border-0 h-100">
                            <div class="card-body">
                                <h6 class="section-title">
                                    <i class="bi bi-person-circle me-2"></i>Bill To
                                </h6>
                                <p class="mb-1 fw-semibold">Prasat Soth</p>
                                <p class="mb-1">Sovann Dana Co., Ltd.</p>
                                <p class="mb-1">
                                    <i class="bi bi-telephone"></i> Phone: 011 226 644
                                </p>
                                <p class="mb-0">
                                    <i class="bi bi-envelope"></i> Email: prasatsoth@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Property Details -->
                    <div class="col-md-6">
                        <div class="card border-0 h-100">
                            <div class="card-body">
                                <h6 class="section-title">
                                    <i class="bi bi-building me-2"></i>Property
                                </h6>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <small class="info-label d-block">Space:</small>
                                        <span class="info-value">MT-F2-R1112</span>
                                    </div>
                                    <div class="col-6">
                                        <small class="info-label d-block">Type:</small>
                                        <span class="info-value">Office</span>
                                    </div>
                                    <div class="col-6">
                                        <small class="info-label d-block">Floor:</small>
                                        <span class="info-value">2</span>
                                    </div>
                                    <div class="col-6">
                                        <small class="info-label d-block">Building:</small>
                                        <span class="info-value">SBC Tower</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contract Information -->
            <div class="container-fluid px-4 py-3 bg-light border-top border-bottom">
                <div class="row">
                    <div class="col-md-6 mb-2 mb-md-0">
                        <span class="badge bg-primary badge-custom">
                            <i class="bi bi-calendar-range"></i> Contract Period
                        </span>
                        <span class="ms-2 info-value">01 Jan 2026 – 31 Dec 2026</span>
                    </div>
                    <div class="col-md-3 mb-2 mb-md-0">
                        <span class="badge bg-info badge-custom">
                            <i class="bi bi-rulers"></i> Area
                        </span>
                        <span class="ms-2 info-value">12.00 m²</span>
                    </div>
                    <div class="col-md-3">
                        <span class="badge bg-success badge-custom">
                            <i class="bi bi-cash"></i> Unit Price
                        </span>
                        <span class="ms-2 info-value">$12.00 / m²</span>
                    </div>
                </div>
            </div>

            <!-- Items Table -->
            <div class="container-fluid px-4 py-4">
                <h6 class="section-title">
                    <i class="bi bi-list-ul me-2"></i>Invoice Items
                </h6>
                <div class="table-responsive">
                    <table class="table table-invoice table-hover mb-0">
                        <thead>
                            <tr>
                                <th scope="col" style="width: 50%;">Description</th>
                                <th scope="col" class="text-end" style="width: 15%;">Qty</th>
                                <th scope="col" class="text-end" style="width: 17%;">Unit Price</th>
                                <th scope="col" class="text-end" style="width: 18%;">Amount (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <strong>1. Monthly Office Rent – February 2026</strong>
                                </td>
                                <td class="text-end">12.00 m²</td>
                                <td class="text-end">12.00</td>
                                <td class="text-end fw-semibold">144.00</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>2. Common Area Service Charge (security)</strong>
                                </td>
                                <td class="text-end">1</td>
                                <td class="text-end">35.00</td>
                                <td class="text-end fw-semibold">35.00</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>3. Cleaning Service (recurring)</strong>
                                </td>
                                <td class="text-end">1</td>
                                <td class="text-end">20.00</td>
                                <td class="text-end fw-semibold">20.00</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>4. Extra Deep Cleaning – 18 Jan 2026</strong>
                                    <div class="item-note">
                                        <i class="bi bi-arrow-return-right"></i> (Service Request #SR-048)
                                    </div>
                                </td>
                                <td class="text-end">1</td>
                                <td class="text-end">60.00</td>
                                <td class="text-end fw-semibold">60.00</td>
                            </tr>
                            <tr>
                                <td>
                                    <strong>5. Air-conditioner Maintenance – 25 Jan 2026</strong>
                                    <div class="item-note">
                                        <i class="bi bi-arrow-return-right"></i> (Service Request #SR-051)
                                    </div>
                                </td>
                                <td class="text-end">1</td>
                                <td class="text-end">45.00</td>
                                <td class="text-end fw-semibold">45.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Totals Section -->
            <div class="container-fluid px-4 py-4 bg-light">
                <div class="row justify-content-end">
                    <div class="col-lg-5 col-md-6">
                        <div class="card totals-card">
                            <div class="card-body">
                                <div class="total-row d-flex justify-content-between">
                                    <span class="info-label">Subtotal:</span>
                                    <span class="info-value fw-semibold">$304.00</span>
                                </div>
                                <div class="total-row d-flex justify-content-between">
                                    <span class="info-label">VAT (10%):</span>
                                    <span class="info-value fw-semibold">$30.40</span>
                                </div>
                                <div class="grand-total-row d-flex justify-content-between">
                                    <span>Total Amount Due:</span>
                                    <span>$334.40 USD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Instructions -->
            <div class="container-fluid px-4 py-4">
                <h6 class="section-title">
                    <i class="bi bi-credit-card me-2"></i>Payment Instructions
                </h6>

                <div class="row g-3">
                    <div class="col-md-6">
                        <div class="payment-method p-3">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-bank2 fs-4 text-primary me-3"></i>
                                <div>
                                    <strong class="d-block">ABA Bank Account</strong>
                                    <small class="text-muted">Bank Transfer</small>
                                </div>
                            </div>
                            <p class="mb-0 ms-5 ps-2">
                                <span class="badge bg-secondary">Account:</span>
                                <span class="ms-2">123 456 789</span><br>
                                <small class="text-muted">META TOWER MANAGEMENT</small>
                            </p>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="payment-method p-3">
                            <div class="d-flex align-items-center mb-2">
                                <i class="bi bi-phone fs-4 text-success me-3"></i>
                                <div>
                                    <strong class="d-block">Mobile Payment</strong>
                                    <small class="text-muted">Wing / ABA Pay</small>
                                </div>
                            </div>
                            <p class="mb-0 ms-5 ps-2">
                                <span class="badge bg-secondary">Number:</span>
                                <span class="ms-2">098 765 432</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="alert alert-info mt-3 d-flex align-items-start">
                    <i class="bi bi-info-circle-fill fs-5 me-3"></i>
                    <div>
                        <strong>Payment Reference:</strong><br>
                        Please include <code class="bg-white px-2 py-1">INV-202602-00703 + Your Tenant Name</code> in the payment reference.
                    </div>
                </div>
            </div>

            <!-- Footer Notes -->
            <div class="container-fluid px-4 py-3 footer-notes">
                <div class="d-flex align-items-start">
                    <i class="bi bi-exclamation-triangle-fill fs-5 text-warning me-3"></i>
                    <div>
                        <p class="mb-1 fw-semibold">Thank you for your prompt payment.</p>
                        <p class="mb-0 small">
                            <i class="bi bi-clock-history"></i> Late payment after due date will incur <strong>2% monthly interest</strong>.
                        </p>
                    </div>
                </div>
            </div>

            <hr class="invoice-separator my-0">

            <!-- Action Buttons -->
            <div class="container-fluid px-4 py-3 text-center no-print">
                <button class="btn btn-primary me-2" onclick="window.print()">
                    <i class="bi bi-printer"></i> Print Invoice
                </button>
                <button class="btn btn-outline-secondary">
                    <i class="bi bi-download"></i> Download PDF
                </button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
