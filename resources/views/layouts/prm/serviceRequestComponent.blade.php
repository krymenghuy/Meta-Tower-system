<div id="_main_service_request_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_service_request" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                <input type="text" class="form-control rounded-2 pe-5 filter-field " id="_search_service_request" placeholder="Search by Name or Room">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
        </div>
            <div class="col-12 col-md-6 col-lg-2 ">
                <select id="_service_request_status" class="data-input filter-field form-control" data-field="requeststatus_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-3 ">
                <select id="_service_request_type_id" class="data-input filter-field form-control" data-field="service_type_id"></select>
            </div>
            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnServiceRequest">
                        <i class="fa-solid fa-gears mr-2"></i>
                    <span vslang="buttons.Create Request"></span>
                </button>
            </div>
        </div>
    </div>

    <div id="_service_request_list" class="table-responsive  mt-3 bg-white rounded-2 border"></div>
</div>
<style>
/* Modal Structure */
.invoice-modal-custom .modal-content {
    border-radius: 12px;
    border: none;
    overflow: hidden;
}

.invoice-modal-custom .modal-header {
    background: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 20px 24px;
}

.invoice-modal-custom .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}

.invoice-modal-custom .modal-body {
    padding: 24px;
    background: #ffffff;
}

/* Service Request Info Card */
.sr-info-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 24px;
}

.sr-info-title {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.sr-info-value {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
}

/* Form Styling */
.form-group-custom {
    margin-bottom: 16px;
}

.form-label-custom {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
}

.form-label-custom .text-danger {
    color: #dc2626;
    margin-left: 2px;
}

.form-control-invoice {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    transition: all 0.15s ease;
    background: white;
}

.form-control-invoice:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control-invoice:disabled,
.form-control-invoice[readonly] {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
}

.form-text-muted {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
    display: block;
}

/* Section Divider */
.section-divider {
    border: 0;
    border-top: 1px solid #e5e7eb;
    margin: 24px 0 16px 0;
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 16px;
}

/* Totals Card */
.totals-card-invoice {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    margin-top: 20px;
}

.totals-row-invoice {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
}

.totals-label-invoice {
    font-size: 14px;
    color: #6b7280;
}

.totals-value-invoice {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.totals-value-invoice.discount {
    color: #dc2626;
}

.totals-row-invoice.total-row {
    border-top: 1px solid #e5e7eb;
    margin-top: 8px;
    padding-top: 12px;
}

.totals-row-invoice.total-row .totals-label-invoice {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
}

.totals-row-invoice.total-row .totals-value-invoice {
    font-size: 20px;
    font-weight: 700;
    color: #3b82f6;
}

/* Modal Footer */
.invoice-modal-custom .modal-footer {
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 16px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

/* Buttons */
.btn-invoice {
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-cancel-invoice {
    background: #f3f4f6;
    color: #374151;
}

.btn-cancel-invoice:hover {
    background: #e5e7eb;
}

.btn-preview-invoice {
    background: white;
    color: #3b82f6;
    border: 1px solid #3b82f6;
}

.btn-preview-invoice:hover {
    background: #eff6ff;
}

.btn-create-invoice {
    background: #3b82f6;
    color: white;
    padding: 10px 28px;
}

.btn-create-invoice:hover {
    background: #2563eb;
}
</style>

