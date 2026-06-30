<div id="_main_book_amenity_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_book_amenity" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_book_amenity" placeholder="Search by amenity">
            </div>
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_book_amenity_status" class="filter-field data-input" data-field="status_id"></select>
            </div>
            <div class="col-12 col-md-6 col-lg-5">
                <div id="_dateFilter_receipt" class="d-flex align-items-center gap-3">
                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="booking_date" />
                        <label class="form-label">From Date</label>
                    </div>

                    <div class="flex-fill material-input outlined" style="margin-bottom: 0;">
                        <input data-select="datepicker" class="filter-field form-control range-filter" placeholder=" " data-field="booking_date_to" />
                        <label class="form-label">To Date </label>
                    </div>
                </div>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto" style="overflow:visible;">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnBookNow">
                    <i class="me-2 fa-solid fa-calendar" style="color: rgb(249, 251, 255);"></i>
                    <span vslang="buttons.Book Now"></span>
                </button>
            </div>
        </div>
    </div>
    <div id="_reservation_list" class=" mt-3"></div>
</div>

<style>
.reservation-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.reservation-list {
    --reservation-navy: #1A1647;
    --reservation-muted: #8b95a5;
    --reservation-border: #e8ecf2;
    --reservation-surface: #f6f8fb;
    --reservation-header-bg: #eaeff2;
    --reservation-upcoming: #3b82f6;
    --reservation-completed: #22c55e;
}

.reservation-list-wrap .reservation-list {
    background: #fff;
    border: none;
    border-radius: 0;
    overflow: visible;
}

.reservation-list__header {
    display: flex;
    align-items: stretch;
    gap: 0;
    background: var(--reservation-header-bg);
    border: none;
    border-radius: 0;
    box-shadow: none;
    overflow: hidden;
    min-height: auto;
}

.reservation-list__header-accent {
    display: none;
}

.reservation-list__header-grid,
.reservation-row__grid {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(140px, 1.35fr) minmax(110px, 1fr) minmax(150px, 1.15fr) minmax(120px, 1fr) minmax(90px, 0.85fr);
    gap: 12px;
    align-items: center;
}

.reservation-list__header-grid {
    padding: 0;
    gap: 0;
}

.reservation-list__header-cell {
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 10px 16px;
}

.reservation-list__header-en {
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    color: #1a1647;
    line-height: 1.2;
    white-space: nowrap;
}

.reservation-list__header-action,
.reservation-row__action {
    width: 32px;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.reservation-list__rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.reservation-row {
    display: flex;
    align-items: stretch;
    gap: 12px;
    background: #fff;
    border: 1px solid var(--reservation-border);
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(26, 22, 71, 0.05);
    overflow: hidden;
    min-height: 56px;
}

.reservation-row__accent {
    width: 4px;
    flex-shrink: 0;
    background: #cbd5e1;
}

.reservation-row--upcoming .reservation-row__accent {
    background: var(--reservation-upcoming);
}

.reservation-row--in-progress .reservation-row__accent {
    background: #f59e0b;
}

.reservation-row--completed .reservation-row__accent {
    background: var(--reservation-completed);
}

.reservation-row--cancelled .reservation-row__accent {
    background: #ef4444;
}

.reservation-row__grid {
    padding: 12px 0;
}

.reservation-row__cell {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    font-size: 13px;
    color: #334155;
}

.reservation-row__cell--amenity {
    padding-right: 8px;
}

.reservation-row__amenity {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
    text-transform: capitalize;
    word-break: break-word;
}

.reservation-row__icon {
    color: var(--reservation-muted);
    font-size: 13px;
    flex-shrink: 0;
}

.reservation-row__cell--date,
.reservation-row__cell--time {
    color: #475569;
    white-space: nowrap;
}

.reservation-row__notes-pill {
    display: inline-block;
    max-width: 100%;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--reservation-surface);
    color: #64748b;
    font-size: 12px;
    line-height: 1.3;
    word-break: break-word;
}

.reservation-row__status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 88px;
    padding: 5px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;
}

.reservation-row__status-badge--upcoming {
    background: #dbeafe;
    color: #2563eb;
}

.reservation-row__status-badge--in-progress {
    background: #fef3c7;
    color: #d97706;
}

.reservation-row__status-badge--completed {
    background: #dcfce7;
    color: #16a34a;
}

.reservation-row__status-badge--cancelled {
    background: #fee2e2;
    color: #dc2626;
}

.reservation-list__header-action {
    padding-right: 8px;
}

.reservation-row__action {
    padding-right: 8px;
}

.reservation-row__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    color: #64748b;
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
}

.reservation-row__menu-btn:hover {
    background: var(--reservation-surface);
    color: #334155;
}

.reservation-list-empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--reservation-surface);
    color: var(--reservation-muted);
    font-size: 22px;
}

.reservation-list-wrap .vsa-dropdown.reservation-row__dropdown,
.reservation-list-wrap .reservation-row__dropdown.vsa-dropdown {
    border: 1px solid var(--reservation-border);
    border-radius: 8px;
    overflow: hidden;
}

@media (max-width: 991.98px) {
    .reservation-list__header {
        display: none;
    }

    .reservation-row {
        flex-direction: column;
        gap: 0;
        padding-bottom: 12px;
    }

    .reservation-row__accent {
        width: 100%;
        height: 4px;
    }

    .reservation-row__grid {
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 12px 14px 0;
    }

    .reservation-row__cell--status,
    .reservation-row__cell--notes {
        justify-content: flex-start;
    }

    .reservation-row__action {
        width: auto;
        justify-content: flex-end;
        padding: 0 14px;
    }
}
</style>
