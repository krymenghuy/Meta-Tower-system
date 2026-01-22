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
    <div id="_tenant_card_view" class="mt-3 px-3 mb-2"></div>

    <div id="_tenant_list_view" class="table-responsive mt-3  rounded-2 border"></div>
</div>

<style>

    .card {
        border-radius: 5px;
        box-shadow: 0px 0px 3px 0px grey;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        padding: 8px 16px;
        border: none;
        align-items: center;
        background-color: #647686;
    }

    .card-body {

        /* background-image:url('https://img.freepik.com/free-vector/ombre-blue-curve-light-blue-background-vector_53876-140344.jpg'); */
        background-color: #fff;
        /* background-size: cover;  background-repeat: no-repeat;background-image:url('${d.bg_image ?? '/assets/images/default/bg-card2.jpg'}'); */
    }

    .card_container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        background-color: #8b8b8b;
        padding: 10px;
        border-radius: 10px;
        font-size: 10px;

    }
    .container_bottom {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-items: flex-start;
        width: 100%;
    }
    


</style>

