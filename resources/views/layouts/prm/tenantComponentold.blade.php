<div id="_main_tenant_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_tenant" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-1700">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field" id="_search_tenant" placeholder="Search">
                    <i class="fa fa-search fs-6 text-muted position-absolute"
                        style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>
            {{-- View Toggle Buttons  --}}
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

    <div id="_tenant_list" class="table-responsive mt-3  rounded-2 border"></div>
    <div id="_tenant_cards" class="px-3 pb-3"></div>
</div>

