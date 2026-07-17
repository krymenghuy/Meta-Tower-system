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

    /* Movement history timeline (body only — dialog chrome = vs-modal like Leave) */
    .mv-history-header {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .mv-history-avatar {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #cfe2ff;
        color: #1e3a8a;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
        font-weight: 700;
        font-size: 1.1rem;
    }

    .mv-history-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .mv-history-subtitle {
        font-size: 0.9rem;
        color: #6b7280;
    }

    .mv-history-title {
        font-weight: 700;
        font-size: 1.05rem;
        color: #111827;
        line-height: 1.25;
    }

    .mv-history-timeline {
        position: relative;
        padding-left: 4px;
        max-height: 360px;
        overflow-y: auto;
    }

    .mv-history-item {
        position: relative;
        display: flex;
        gap: 14px;
        padding: 0 0 22px 8px;
    }

    .mv-history-item:last-child {
        padding-bottom: 4px;
    }

    .mv-history-item:not(:last-child)::before {
        content: "";
        position: absolute;
        left: 15px;
        top: 14px;
        bottom: 0;
        width: 2px;
        background: #e5e7eb;
    }

    .mv-history-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #22c55e;
        margin-top: 4px;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        box-shadow: 0 0 0 3px #fff;
    }

    .mv-history-item-body {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        min-width: 0;
    }

    .mv-history-event {
        font-weight: 700;
        font-size: 0.95rem;
        color: #111827;
        line-height: 1.3;
    }

    .mv-history-change {
        font-size: 0.82rem;
        color: #9ca3af;
        margin-top: 2px;
        word-break: break-word;
    }

    .mv-history-date {
        font-size: 0.82rem;
        color: #9ca3af;
        white-space: nowrap;
        flex-shrink: 0;
        padding-top: 2px;
    }

    .mv-history-empty {
        padding: 1rem 0.5rem;
        text-align: center;
        font-size: 0.9rem;
    }
</style>
