<div id="_main_book_amenity_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_book_amenity" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_book_amenity" placeholder="Search by amenity or phone number">
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
    <div id="_reservation_list" class="reservation-list-wrap mt-3"></div>
</div>

<style>
.reservation-list-wrap .listview-container {
    padding-bottom: 0.25rem;
}

.reservation-list {
    --reservation-date-bg: #262626;
    --reservation-muted: #a6a6a6;
    --reservation-text: #4d4d4d;
    --reservation-border: #e8e8e8;
    --reservation-upcoming-text: #8b5e3c;
    --reservation-in-progress-text: #b45309;
    --reservation-completed-text: #2e7d32;
    --reservation-cancelled-text: #c62828;
}

.reservation-list-wrap .reservation-list {
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: visible;
}

.reservation-list__rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.reservation-card {
    display: flex;
    align-items: stretch;
    background: #fff;
    border: 1px solid var(--reservation-border);
    border-radius: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    min-height: 88px;
}

.reservation-card__date {
    flex-shrink: 0;
    width: 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 14px 10px;
    background: var(--reservation-date-bg);
    color: #fff;
    text-align: center;
}

.reservation-card__date-day {
    font-family: "Marcellus", serif;
    font-size: 1.75rem;
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.02em;
}

.reservation-card__date-month {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    line-height: 1.2;
    text-transform: uppercase;
}

.reservation-card__date-year {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.62rem;
    font-weight: 400;
    line-height: 1.2;
    opacity: 0.85;
}

.reservation-card__content {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
    padding: 14px 18px 14px 20px;
    gap: 12px;
}

.reservation-card__info {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(140px, 1.4fr) minmax(120px, 1fr) minmax(100px, 1fr) auto;
    align-items: center;
    gap: 20px;
    min-width: 0;
}

.reservation-card__title-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.reservation-card__title {
    font-family: "Marcellus", serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: #000;
    line-height: 1.25;
    text-transform: capitalize;
    word-break: break-word;
}

.reservation-card__ref {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--reservation-muted);
    line-height: 1.2;
}

.reservation-card__field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
}

.reservation-card__field-label {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--reservation-muted);
    line-height: 1.2;
}

.reservation-card__field-value {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.84rem;
    font-weight: 400;
    color: var(--reservation-text);
    line-height: 1.35;
    word-break: break-word;
}

.reservation-card__field--status {
    min-width: 90px;
}

.reservation-card__status-value {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    line-height: 1.35;
    white-space: nowrap;
}

.reservation-card__status-value--upcoming {
    color: var(--reservation-upcoming-text);
}

.reservation-card__status-value--in-progress {
    color: var(--reservation-in-progress-text);
}

.reservation-card__status-value--completed {
    color: var(--reservation-completed-text);
}

.reservation-card__status-value--cancelled {
    color: var(--reservation-cancelled-text);
}

.reservation-card__action {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    min-width: 40px;
    padding-left: 8px;
}

.reservation-card__action--empty {
    visibility: hidden;
    pointer-events: none;
}

.reservation-card__menu-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--reservation-border);
    border-radius: 10px;
    color: #b0b0b0;
    text-decoration: none;
    font-size: 0.95rem;
    background: #fff;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.reservation-card__menu-btn:hover {
    background: #f5f5f5;
    border-color: #d4d4d4;
    color: #666;
}

.reservation-card__menu-btn:focus-visible {
    outline: 2px solid #b0b0b0;
    outline-offset: 2px;
}

.reservation-list-empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #f6f8fb;
    color: var(--reservation-muted);
    font-size: 22px;
}

.reservation-list-wrap .vsa-dropdown.reservation-card__dropdown,
.reservation-list-wrap .reservation-card__dropdown.vsa-dropdown {
    border: 1px solid var(--reservation-border);
    border-radius: 8px;
    overflow: hidden;
}

@media (max-width: 991.98px) {
    .reservation-card__info {
        grid-template-columns: 1fr 1fr;
        gap: 14px 16px;
    }

    .reservation-card__title-block {
        grid-column: 1 / -1;
    }
}

@media (max-width: 575.98px) {
    .reservation-card {
        flex-direction: column;
        min-height: 0;
    }

    .reservation-card__date {
        width: 100%;
        flex-direction: row;
        justify-content: center;
        gap: 8px;
        padding: 10px 14px;
    }

    .reservation-card__date-day {
        font-size: 1.35rem;
    }

    .reservation-card__content {
        flex-direction: column;
        align-items: stretch;
        padding: 14px 16px;
    }

    .reservation-card__info {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .reservation-card__action {
        align-self: flex-end;
        padding-left: 0;
    }
}
</style>
