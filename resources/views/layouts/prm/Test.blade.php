<div id="_main_tenant_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_tenant" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field" id="_search_tenant" placeholder="Search">
                    <i class="fa fa-search fs-6 text-muted position-absolute"
                       style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>

            {{-- View Toggle Buttons --}}
            <div class="col-12 col-md-3 col-lg-2">
                <div class="button-select-enhanced">
                    <button class="btn btn-list-enhanced active" id="_btnCardView">
                        <i class="fa-solid fa-grip"></i>
                    </button>
                    <button class="btn btn-list-enhanced" id="_btnListView">
                        <i class="fa-solid fa-list"></i>
                    </button>
                </div>
            </div>

            <div class="col-12 col-md-3 col-lg-2 ms-auto text-md-end">
                <button type="button" class="btnAddNewPrm w-100 w-md-auto" id="_btnAddTenant">
                    <i class="fa fa-user-plus me-2"></i>
                    <span vslang="buttons.Create Tenant">Create Tenant</span>
                </button>
            </div>
        </div>
    </div>

    {{-- List View Container --}}
    <div id="_tenant_list" class="table-responsive mt-3 bg-white rounded-2 border d-none"></div>

    {{-- Card View Container --}}
    <div id="_tenant_cards" class="mt-3"></div>
</div>

<style>
/* Button Select Enhanced Styles */
.button-select-enhanced {
    background: linear-gradient(145deg, #1e1b4b, #1a1647);
    padding: 5px;
    width: 110px;
    height: 50px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-shadow: 0 6px 20px rgba(26, 22, 71, 0.5),
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.btn-list-enhanced {
    background: transparent;
    border: none;
    border-radius: 8px;
    width: 48px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    padding: 0;
    position: relative;
    overflow: hidden;
}

.btn-list-enhanced::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 8px;
}

.btn-list-enhanced i {
    color: #fff;
    font-size: 18px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.btn-list-enhanced:hover::before {
    opacity: 1;
}

.btn-list-enhanced:hover {
    transform: translateY(-2px);
}

.btn-list-enhanced:hover i {
    transform: scale(1.1);
}

.btn-list-enhanced:active {
    transform: translateY(0);
}

.btn-list-enhanced.active::before {
    opacity: 1;
}

.btn-list-enhanced.active {
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

/* List View Styles */
.btn--Options {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #1a1647;
    color: #fff;
    border: none;
    border-radius: 6px;
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    padding: 0.55rem 1.5rem;
    font-weight: 500;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.btn--Options:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 14px rgba(0, 0, 0, 0.2);
}

/* Card View Styles */
.tenant-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.tenant-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.tenant-card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.tenant-avatar {
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.tenant-avatar i {
    font-size: 28px;
    color: white;
}

.tenant-card-actions {
    position: relative;
    z-index: 10;
}

.btn--Options-card {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
}

.btn--Options-card:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.tenant-card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tenant-name {
    font-size: 18px;
    font-weight: 600;
    color: #1a1647;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tenant-gender {
    font-size: 13px;
    color: #666;
    margin: 0;
    display: flex;
    align-items: center;
}

.tenant-info-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #555;
}

.tenant-info-item i {
    width: 18px;
    text-align: center;
    flex-shrink: 0;
}

.tenant-info-item span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.tenant-contact {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 8px;
}

.tenant-card-footer {
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}

.tenant-card-footer small {
    display: flex;
    align-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .btn--Options {
        width: 100%;
    }

    .button-select-enhanced {
        width: 100px;
        height: 48px;
    }

    .tenant-card {
        margin-bottom: 15px;
    }
}

@media (max-width: 576px) {
    .tenant-card-body {
        padding: 15px;
    }

    .tenant-name {
        font-size: 16px;
    }
}
</style>

<script>
// Toggle active state for view buttons
function toggleActiveEnhanced(button) {
    const parent = button.parentElement;
    const buttons = parent.querySelectorAll('.btn-list-enhanced');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}
</script>
