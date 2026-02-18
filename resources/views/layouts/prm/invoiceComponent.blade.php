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
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnInvoice">
                        <i class="fa-solid fa-file-invoice-dollar mr-2"></i>
                    <span vslang="buttons.Generate Invoice"></span>
                </button>
            </div>

        </div>

    </div>

    <div id="_invoice_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>


<style>
    /* Invoice Dialog Styling */

.invoice-creation-container {
    padding: 1rem;
}

/* Quick Actions Buttons */
.invoice-creation-container .btn-outline-primary:hover,
.invoice-creation-container .btn-outline-success:hover,
.invoice-creation-container .btn-outline-info:hover,
.invoice-creation-container .btn-outline-warning:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

/* Card Styling */
.invoice-creation-container .card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
}

.invoice-creation-container .card-header {
    border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 1.5rem;
}

.invoice-creation-container .card-header h6 {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.5px;
}

/* Form Labels */
.invoice-creation-container .form-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: #495057;
}

.invoice-creation-container .form-label i {
    font-size: 0.875rem;
}

/* Table Styling */
.invoice-creation-container .table thead th {
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 1rem 0.75rem;
    border-bottom: 2px solid #dee2e6;
}

.invoice-creation-container .table tbody td {
    padding: 0.75rem;
    vertical-align: middle;
}

.invoice-creation-container .invoice-item-row {
    transition: background-color 0.2s ease;
}

.invoice-creation-container .invoice-item-row:hover {
    background-color: #f8f9fa;
}

/* Add Item Form */
.invoice-creation-container #add_item_row .bg-light {
    background-color: #f8f9fa !important;
    border-radius: 8px;
}

.invoice-creation-container #add_item_row .form-select,
.invoice-creation-container #add_item_row .form-control {
    border-radius: 6px;
    border: 1px solid #ced4da;
    padding: 0.5rem 0.75rem;
}

.invoice-creation-container #add_item_row .form-select:focus,
.invoice-creation-container #add_item_row .form-control:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

/* Totals Footer */
.invoice-creation-container tfoot {
    font-size: 1rem;
    background-color: #f8f9fa;
}

.invoice-creation-container tfoot td {
    padding: 1rem 0.75rem;
    border-top: 2px solid #dee2e6;
}

/* Items Count Badge */
#items_count {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
}

/* Button Styling */
.invoice-creation-container .btn-sm {
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    border-radius: 6px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .invoice-creation-container {
        padding: 0.5rem;
    }
    
    .invoice-creation-container .card-header h6 {
        font-size: 0.875rem;
    }
    
    .invoice-creation-container .table {
        font-size: 0.875rem;
    }
}

/* Animation for adding items */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.invoice-creation-container .invoice-item-row {
    animation: slideIn 0.3s ease;
}

/* Empty State */
.invoice-creation-container .empty-state {
    padding: 3rem 1rem;
    text-align: center;
    color: #6c757d;
}

.invoice-creation-container .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.3;
}

/* Success/Error States */
.invoice-creation-container .text-success {
    color: #28a745 !important;
}

.invoice-creation-container .text-danger {
    color: #dc3545 !important;
}

.invoice-creation-container .text-info {
    color: #17a2b8 !important;
}

.invoice-creation-container .text-warning {
    color: #ffc107 !important;
}

/* Modal Adjustments */
.modal-xl .modal-dialog {
    max-width: 1200px;
}

@media (min-width: 1400px) {
    .modal-xl .modal-dialog {
        max-width: 1400px;
    }
}
</style>