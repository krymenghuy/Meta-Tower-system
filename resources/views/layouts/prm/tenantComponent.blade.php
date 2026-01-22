<div id="_main_tenant_component" class="mobile-padding p-3" style="display:none;">
    <div id="_divFilter_tenant" class="rounded-2 p-3 bg-white shadow-sm">
        <div class="row g-3 align-items-center">
            <div class="col-12 col-md-6 col-lg-4">
                <div class="position-relative w-100">
                    <input type="text" class="form-control rounded-2 pe-5 filter-field" id="_search_tenant_" placeholder="Search">
                    <i class="fa fa-search fs-6 text-muted position-absolute"
                        style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
                </div>
            </div>
           <div class="col-12 col-md-6 col-lg-3">
                <div class="btn-group btn-group-sm bg-light p-1 rounded" role="group">
                    <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewCard" checked>
                    <label class="btn btn-outline-secondary px-3" for="tenantViewCard">
                        <i class="fa-solid fa-grip me-1"></i> Card
                    </label>

                    <input type="radio" class="btn-check" name="tenant_view_mode" id="tenantViewList">
                    <label class="btn btn-outline-secondary px-3" for="tenantViewList">
                        <i class="fa-solid fa-rectangle-list me-1"></i> List
                    </label>
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
    <div id="_tenant_card_view" class="mt-3"></div>

    <div id="_tenant_list_view" class="table-responsive mt-3  rounded-2 border"></div>
</div>

<style>
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
.btn-group .btn {
    border-radius: 0.375rem;
}

.btn-check:checked + .btn {
    background-color: #fff;
    color: #212529;
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
}


@media (max-width: 768px) {
    .btn--Options {
        width: 100%;
    }
}






 .tenant-card {
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    background-color: #c9c8cb;
    position: relative;
  }
  .tenant-card .avatar-wrapper {
    width: 120px;
    height: 120px;
    margin: 0 auto 1rem;
    position: relative;
  }
  .tenant-card .avatar-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 3px solid #f8f9fa;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  .tenant-card .status-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: #28a745;
    color: white;
    border-radius: 50%;
    border: 2px solid #fff;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tenant-card .info p {
    margin-bottom: 0.5rem;
  }
  .tenant-card .info span {
    color: #6c757d;
    font-size: 0.9rem;
  }
  .tenant-card .action-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
.tenant-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: 0.3s;
}
.status_tenant{
    background: linear-gradient(rgb(12 32 126), rgb(22 119 196));
    color: #fff;
    border: 1px solid #fffbff;
    padding: 3px;
    border-radius: 114px;
}

</style>
