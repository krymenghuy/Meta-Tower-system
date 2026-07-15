<div id="_main_employeeMovementComponent" class="mobile-padding px-3" style="display:none;">
    <div class="bg-white p-3 rounded-2 shadow" id="_divFilter">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_emp_movement"
                    placeholder="{{ \Vsd\Locales\Localization::trans('Search by name', 'titles') }}">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_employee" class="filter-field data-input" data-field="emp_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="el_event" class="data-input filter-field" data-field="event_id"></select>
            </div>
        </div>
    </div>
    <div class="mt-3" id="_emp_movement_list"></div>
</div>

<style>
    .movement-dialog .modal-body {
        padding-top: 0.75rem;
    }

    .movement-dialog-body {
        padding: 4px 2px 8px;
    }

    .movement-check-row {
        padding-bottom: 12px;
        margin-bottom: 14px !important;
        border-bottom: 1px solid #e8edf4;
    }

    .movement-check .form-check-input {
        margin-top: 0.2rem;
        cursor: pointer;
    }

    .movement-check .form-check-label {
        margin-left: 4px;
        font-size: 0.9rem;
        color: #334155;
        cursor: pointer;
        user-select: none;
    }

    .movement-section {
        overflow: hidden;
        max-height: 20px;
        opacity: 0;
        margin-bottom: 0 !important;
        transition: max-height 0.28s ease, opacity 0.22s ease, margin 0.22s ease;
    }

    .movement-section.is-open {
        max-height: none;
        overflow: visible;
        opacity: 1;
        margin-bottom: 0.5rem !important;
    }

    .movement-section.is-open .form-control,
    .movement-section.is-open .vs-material-field,
    .movement-section.is-open .select2-container {
        position: relative;
        z-index: 1;
    }

    .movement-dialog .modal-body {
        overflow: visible;
    }

    .movement-section .form-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: #475569;
        margin-bottom: 6px;
    }

    .movement-section .form-control {
        border-radius: 8px;
        border-color: #d7dce5;
        min-height: 40px;
    }

    .movement-section .movement-readonly,
    .movement-section .form-control[readonly] {
        background: #f3f4f6;
        color: #334155;
    }

    .movement-dialog-btn-cancel {
        background: #e8913a;
        border: none;
        color: #fff;
        min-width: 96px;
        border-radius: 8px;
    }

    .movement-dialog-btn-cancel:hover {
        background: #d67f28;
        color: #fff;
    }

    .movement-dialog-btn-save {
        background: #4f6bed;
        border: none;
        color: #fff;
        min-width: 96px;
        border-radius: 8px;
    }

    .movement-dialog-btn-save:hover {
        background: #3f58d4;
        color: #fff;
    }
</style>
