<script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>

<div id="_main_announcement_component" class="p-3 mobile-padding" style="display:none;">
    <div id="_divFilter_announcement" class="bg-white shadow-sm p-3 rounded-2">
        <div class="align-items-center row g-3">
            <div class="col-12 col-md-6 col-lg-3">
                <input type="text" class="filter-field rounded-2 input-search" id="_search_announcement" data-field="search_value" placeholder="{{ \Vsd\Locales\Localization::trans('Search announcement', 'titles') }}">
            </div>
            
            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_category" class="filter-field data-input" data-field="category" placeholder='vslang="titles.All Categories"'></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_priority" class="filter-field data-input" data-field="priority" placeholder='vslang="titles.All Priorities"'></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_status" class="filter-field data-input" data-field="status" placeholder='vslang="titles.All Statuses"'></select>
            </div>

            <div class="col-12 col-md-6 col-lg-2">
                <select type="id" id="_filter_sort" class="filter-field data-input" data-field="sort" placeholder='vslang="titles.Sort By"'></select>
            </div>
            <div class="ms-md-auto text-md-end col-12 col-md-auto">
                <button type="button" class="w-100 w-md-auto btnAddNewPrm" id="_btnAnnouncement">
                    <i class="me-2 fa-solid fa-plus"></i>
                    <span vslang="buttons.New Announcement">New Announcement</span>
                </button>
            </div>
        </div>
        
    </div> 
    <div id="_announcement_list" class="mt-3 rounded-2"></div>
</div>

<style>
    .announcement-card {
        border: 1px solid #e2e8f0;
        transition: transform 0.2s, box-shadow 0.2s;
        font-family: inherit;
    }
    .ann-card-low             { border-left: 6px solid #3b82f6 }
    .ann-card-medium          { border-left: 6px solid #f59e0b }
    .ann-card-high            { border-left: 6px solid #dc2626 }
    .ann-card-critical        { border-left: 6px solid #b91c1c }

    .announcement-card .badge {
        font-family: inherit;
        font-weight: 400;
    }
    .ann-badge-general     { background-color: #f0f4f8; color: #3f609f; border: 1px solid #dbe3ec; }
    .ann-badge-maintenance { background-color: #ecfdf5; color: #10b981; border: 1px solid #d1fae5; }
    .ann-badge-notice      { background-color: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
    .ann-badge-event       { background-color: #f5f3ff; color: #8b5cf6; border: 1px solid #ede9fe; }
    .ann-badge-policy,
    .ann-badge-policy-update { background-color: #fff7ed; color: #f97316; border: 1px solid #ffedd5; }

    .ann-badge-neutral  { background-color: #f8fafc; color: #707486; border: 1px solid #e2e8f0; }
    .ann-badge-low      { background-color: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
    .ann-badge-medium   { background-color: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
    .ann-badge-high     { background-color: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
    .ann-badge-critical { background-color: #fca5a5; color: #b91c1c; border: 1px solid #f87171; }

    .announcement-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02);
    }

    .announcement-card .ann-meta-sidebar {
        width: 20%;
        border-left: 1px solid #e2e8f0;
        font-size: 11.5px;
        color: #64748b;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .announcement-card .ann-meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .announcement-card .ann-meta-item i {
        color: #94a3b8;
        font-size: 11px;
        width: 12px;
        text-align: center;
    }
    .announcement-card .ann-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 3px 8px;
        border-radius: 30px;
        font-size: 10px;
        font-weight: 500;
        width: fit-content;
    }
    .announcement-card .ann-status-active {
        background-color: #e6fcf5;
        color: #0ca678;
        border: 1px solid #c3fae8;
    }
    .announcement-card .ann-status-draft {
        background-color: #f1f3f5;
        color: #495057;
        border: 1px solid #e9ecef;
    }
    .announcement-card .ann-status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        display: inline-block;
    }
    .announcement-card .ann-status-active .ann-status-dot {
        background-color: #0ca678;
    }
    .announcement-card .ann-status-draft .ann-status-dot {
        background-color: #495057;
    }
    .announcement-desc i, .announcement-desc em {
        font-style: italic;
    }
    body .cke_chrome {
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        box-shadow: none;
        overflow: hidden;
        background: #fff;
    }
    body .cke_top {
        background: #f8fafc;
        border-bottom: 1px solid #f1f5f9;
        padding: 8px 12px;
    }
    body .cke_toolgroup {
        background: none;
        border: none;
        box-shadow: none;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        margin: 0;
    }
    body .cke_button {
        border-radius: 6px;
        padding: 4px 6px;
        transition: background 0.15s ease;
    }
    body .cke_button:hover, body .cke_button_on {
        background: #e2e8f0;
        box-shadow: none;
        border: none;
    }
    body .cke_combo {
        margin: 0;
    }
    body .cke_combo_button {
        background: none;
        border: none;
        box-shadow: none;
        border-radius: 6px;
        padding: 4px 8px;
    }
    body .cke_combo_button:hover {
        background: #e2e8f0;
    }
    body .cke_bottom {
        display: none;
    }
    body .cke_wysiwyg_frame, body .cke_wysiwyg_div {
        background-color: #fff;
    }
</style>
