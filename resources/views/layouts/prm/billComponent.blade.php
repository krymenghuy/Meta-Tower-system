<div id="_main_bill_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_bill" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12">
                <div class="align-items-center row g-3">
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_bill_building_id" class="filter-field data-input form-control"
                            data-field="building_id"></select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-2">
                        <select type="id" id="_bill_vendor_id" class="filter-field data-input form-control"
                            data-field="vendor_id"></select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                        <select type="id" id="_bill_expense_type_id" class="filter-field data-input form-control"
                            data-field="expanse_type_id"></select>
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                        <select type="id" id="_bill_status_id" class="filter-field data-input form-control"
                            data-field="status_id"></select>
                    </div>
                    <div class="ms-md-auto text-md-end col-12 col-md-auto">
                        <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnBill">
                            <!-- <i class="me-2 fa-solid fa-bars-staggered"></i> -->
                            <span vslang="buttons.Generate New Bill"></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_bill"
                    placeholder="Search by Reference No">
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div id="_dateFilter_receipt" class="d-flex align-items-center gap-3">
                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="bill_date_start" />
                        <label class="form-label">From Issue Date</label>
                    </div>

                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="bill_date_end" />
                        <label class="form-label">To Issue Date </label>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div id="_dateFilter_receipt" class="d-flex align-items-center gap-3">
                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="due_date" />
                        <label class="form-label">From Due Date</label>
                    </div>

                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" "
                            data-field="due_date_end" />
                        <label class="form-label">To Due Date </label>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <div id="_bill_list" class="table-responsive mt-3 rounded-2"></div>
</div>

<style>
    .bill-section-title {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6c757d;
        margin-bottom: 12px;
        padding-bottom: 6px;
        border-bottom: 1px solid #e9ecef;
    }

    .bill-field-group {
        margin-bottom: 14px;
    }

    .bill-field-group label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #495057;
        margin-bottom: 4px;
    }

    .bill-field-group .form-control,
    .bill-field-group select {
        font-size: 13px;
        height: 36px;
        border-color: #dee2e6;
        border-radius: 6px;
        background-color: #fff;
        transition: border-color 0.15s ease;
    }

    .bill-field-group textarea.form-control {
        height: auto;
    }

    .bill-field-group .form-control:focus,
    .bill-field-group select:focus {
        border-color: #86b7fe;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
    }

    .bill-card {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 10px;
        padding: 18px 20px;
        margin-bottom: 16px;
    }

    .bill-upload-box {
        border: 2px dashed #ced4da;
        border-radius: 8px;
        background: #fff;
        height: 90px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #adb5bd;
        font-size: 13px;
        transition: border-color 0.2s, color 0.2s;
    }

    .bill-upload-box:hover {
        border-color: #86b7fe;
        color: #0d6efd;
    }

    .bill-upload-box img {
        max-height: 80px;
        border-radius: 4px;
        display: none;
    }

    .bill-summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        font-size: 13px;
    }

    .bill-summary-row .label {
        color: #6c757d;
        font-weight: 500;
    }

    .bill-divider {
        border: none;
        border-top: 1px solid #e9ecef;
        margin: 8px 0;
    }

    .bill-amount-input {
        width: 130px;
        border-radius: 6px;
        font-size: 13px;
        text-align: right;
        height: 34px;
        border: 1px solid #dee2e6;
        padding: 0 10px;
        transition: border-color 0.15s ease;
    }

    .bill-amount-input:focus {
        outline: none;
        border-color: #86b7fe;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
    }

</style>
