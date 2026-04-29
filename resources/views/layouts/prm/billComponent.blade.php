<div id="_main_bill_component" class="mobile-padding p-3" style="display:none;">
     <div id="_divFilter_bill" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <input type="text" class="form-control rounded-2 pe-5 filter-field input-search" id="_search_bill" placeholder="Search by Bill No or Ref No" >
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end" style="overflow:visible;">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnBill">
                    <i class="fa-solid fa-bars-staggered"></i>
                    <span vslang="buttons.Generate Bill"></span>
                </button>
            </div>

            <div class="row g-3 align-items-center">
                <div class="col-12 col-md-6 col-lg-2  ">
                    <select type="id" id="_bill_vendor_id" class="data-input filter-field form-control" data-field="vendor_id"></select>
                </div>
                <div class="col-12 col-md-6 col-lg-2">
                    <select type="id" id="_bill_status_id" class="data-input filter-field form-control" data-field="status_id"></select>
                </div>
                <div class="d-none col-12 col-md-6 col-lg-2">
                    <select type="id" id="_bill_expense_type_id" class="data-input filter-field form-control" data-field="expanse_type_id"></select>
                </div>
                <div class="col-6 col-md-3 col-lg-2">
                    <input 
                        data-select="datepicker" 
                        class="form-control filter-field" 
                        placeholder="From date" 
                        data-field="bill_date_start" />
                </div>

                <div class="col-6 col-md-3 col-lg-2">
                    <input 
                        data-select="datepicker" 
                        class="form-control filter-field" 
                        placeholder="To date" 
                        data-field="bill_date_end" />
                </div>

            </div>
        </div>
    </div>
    <div id="_bill_list" class="table-responsive mt-3  rounded-2"></div>
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
        box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
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
        box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
    }
    </style>
