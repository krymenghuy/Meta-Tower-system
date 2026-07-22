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

    /* Movement history timeline (Detail Movement dialog) */
    .mv-history-dialog .modal-body {
        padding-top: 1rem;
        padding-bottom: 0.75rem;
        background: #f7f9fc;
    }

    .mv-history-body {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .mv-history-header {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 16px;
        background: #fff;
        border: 1px solid #e8edf4;
        border-radius: 12px;
    }

    .mv-history-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(145deg, #dbe7ff, #c5d6ff);
        color: #1e3a8a;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        flex-shrink: 0;
        font-weight: 700;
        font-size: 1.15rem;
        border: 2px solid #fff;
        box-shadow: 0 0 0 1px #d7e0ef;
    }

    .mv-history-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .mv-history-header-text {
        min-width: 0;
        flex: 1;
    }

    .mv-history-title {
        font-weight: 700;
        font-size: 1.05rem;
        color: #111827;
        line-height: 1.3;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mv-history-subtitle {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
        font-size: 0.82rem;
        color: #6b7280;
    }

    .mv-history-role {
        max-width: 220px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mv-history-count {
        display: inline-flex;
        align-items: center;
        padding: 2px 10px;
        border-radius: 999px;
        background: #eef2ff;
        color: #355cff;
        font-weight: 600;
        font-size: 0.75rem;
        line-height: 1.4;
    }

    .mv-history-timeline {
        position: relative;
        max-height: 420px;
        overflow-y: auto;
        padding: 2px 2px 4px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .mv-history-item {
        position: relative;
        display: flex;
        gap: 12px;
        align-items: stretch;
    }

    .mv-history-rail {
        position: relative;
        width: 36px;
        flex-shrink: 0;
        display: flex;
        justify-content: center;
    }

    .mv-history-item:not(:last-child) .mv-history-rail::after {
        content: "";
        position: absolute;
        top: 36px;
        bottom: -14px;
        left: 50%;
        width: 2px;
        transform: translateX(-50%);
        background: #e5eaf2;
    }

    .mv-history-dot {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        position: relative;
        z-index: 1;
        font-size: 0.78rem;
        color: #fff;
        background: #64748b;
        box-shadow: 0 0 0 4px #f7f9fc;
    }

    .mv-history-item--branch .mv-history-dot {
        background: #3b82f6;
    }

    .mv-history-item--position .mv-history-dot {
        background: #6366f1;
    }

    .mv-history-item--salary .mv-history-dot {
        background: #f59e0b;
    }

    .mv-history-item--shift .mv-history-dot {
        background: #14b8a6;
    }

    .mv-history-item--default .mv-history-dot {
        background: #64748b;
    }

    .mv-history-card {
        flex: 1;
        min-width: 0;
        background: #fff;
        border: 1px solid #e8edf4;
        border-radius: 12px;
        padding: 12px 14px;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .mv-history-item.is-latest .mv-history-card {
        border-color: #c7d7ff;
        box-shadow: 0 4px 14px rgba(53, 92, 255, 0.08);
    }

    .mv-history-card-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
    }

    .mv-history-event-wrap {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .mv-history-event {
        font-weight: 700;
        font-size: 0.92rem;
        color: #111827;
        line-height: 1.3;
    }

    .mv-history-badge {
        display: inline-flex;
        align-items: center;
        padding: 1px 8px;
        border-radius: 999px;
        background: #eef2ff;
        color: #355cff;
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.02em;
        text-transform: uppercase;
    }

    .mv-history-date {
        font-size: 0.78rem;
        color: #94a3b8;
        white-space: nowrap;
        flex-shrink: 0;
        padding-top: 2px;
    }

    .mv-history-change {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
    }

    .mv-history-pill {
        display: inline-flex;
        align-items: center;
        max-width: 100%;
        padding: 5px 10px;
        border-radius: 8px;
        font-size: 0.8rem;
        line-height: 1.35;
        word-break: break-word;
    }

    .mv-history-pill--from {
        background: #f1f5f9;
        color: #64748b;
        text-decoration: line-through;
        text-decoration-color: #cbd5e1;
    }

    .mv-history-pill--to {
        background: #ecfdf5;
        color: #047857;
        font-weight: 600;
    }

    .mv-history-arrow {
        color: #94a3b8;
        font-size: 0.7rem;
        flex-shrink: 0;
    }

    .mv-history-empty {
        padding: 2rem 1rem;
        text-align: center;
        background: #fff;
        border: 1px dashed #d7dce5;
        border-radius: 12px;
    }

    .mv-history-empty-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 10px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        color: #94a3b8;
        font-size: 1.1rem;
    }

    .mv-history-empty-title {
        font-weight: 700;
        color: #334155;
        font-size: 0.95rem;
    }

    .mv-history-empty-text {
        margin-top: 4px;
        font-size: 0.82rem;
        color: #94a3b8;
    }

    .mv-history-dialog .mv-history-btn-close {
        min-width: 96px;
        border-radius: 10px;
        border-color: #d7dce5;
        color: #334155;
        background: #fff;
        font-weight: 600;
    }

    .mv-history-dialog .mv-history-btn-close:hover {
        background: #f8fafc;
        border-color: #c5ccd8;
        color: #111827;
    }

    @media (max-width: 576px) {
        .mv-history-card-top {
            flex-direction: column;
            gap: 4px;
        }

        .mv-history-date {
            padding-top: 0;
        }

        .mv-history-change {
            flex-direction: column;
            align-items: flex-start;
        }

        .mv-history-arrow {
            transform: rotate(90deg);
            margin-left: 6px;
        }
    }
</style>
