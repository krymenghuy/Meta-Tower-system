"use strict";

var TenantProfileComponent =  new (function () {
    const mThis = this;
    mThis.title_prop = "Tenant Profile";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_profile_component");
    mThis.init = function () {
        
    };
 mThis.renderTenantProfile = function () {
    const div = mThis.self;

    // const imageUrl = data.image_url || `${main_view.base_url}/assets/images/default/placeholder.svg`;

    // const cls_class = data.status === "Active"
    //     ? "badge bg-success"
    //     : data.status === "Inactive"
    //         ? "badge bg-secondary"
    //         : "badge bg-warning text-dark";

    const html = `
    <div class="meta-dashboard">
        <div class="row g-4 align-items-stretch">

            <div class="col-12 col-lg-3">
                <div class="card shadow-sm mb-3 h-100">
                    <div class="card-body text-center d-flex flex-column">

                        <div class="position-relative d-inline-block mb-3">
                            <img src="${main_view.base_url}/assets/images/default/placeholder.svg"
                                class="rounded-circle border shadow-sm"
                                width="140"
                                height="140"
                                style="object-fit:cover;object-position:center;">
                        </div>

                        <h4 class="fw-bold mb-2 text-capitalize">Hong Heng</h4>

                        <div class="mb-3">
                            <span class=" px-3 py-2">Active</span>
                        </div>

                        <hr class="my-3">

                        <div class="mt-auto">
                            <div class="row g-3 text-center">

                                <div class="col-6">
                                    <div class="p-3 bg-light rounded">
                                        <div class="text-muted small" vslang="labels.ID">ID</div>
                                        <div>T-10001</div>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="p-3 bg-light rounded">
                                        <div class="text-muted small" vslang="labels.Unit">Unit</div>
                                        <div>Zone14</div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="p-3 bg-light rounded">
                                        <h6 class="mb-3" vslang="labels.Lease Terms">Lease Terms</h6>

                                        <div class="row text-center">
                                            <div class="col-6 border-end border-info">
                                                <div class="text-muted mb-1 small" vslang="labels.Start Date">
                                                    Start Date
                                                </div>
                                                <div class="small">10-06-2026</div>
                                            </div>

                                            <div class="col-6">
                                                <div class="text-muted mb-1 small" vslang="labels.End Date">
                                                    End Date
                                                </div>
                                                <div class="small">10-06-2026</div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-9">
                <div class="card shadow-sm h-100">
                    <div class="card-body tab-content">

                        <div class="tab-pane py-2 active" id="overview_tenant_detail">

                            <h5 class="fw-bold mb-2 d-flex align-items-center">
                                <i class="fa fa-user me-2 text-primary"></i>
                                <span vslang="titles.Personal Information">Personal Information</span>
                            </h5>

                            <div class="row g-4 mb-5">

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Name">Name</small>
                                    <div class="text-capitalize">Hong Heng</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Gender">Gender</small>
                                    <div>Male</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Date of Birth">Date of Birth</small>
                                    <div>10-10-2026</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Legal Name">Legal Name</small>
                                    <div>Hong Heng Shop</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.National ID">National ID</small>
                                    <div>123456</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Passport Number">Passport Number</small>
                                    <div>123456</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Phone">Phone</small>
                                    <div class="text-primary">123456</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Email">Email</small>
                                    <div class="text-primary">123456</div>
                                </div>

                                <div class="col-md-4">
                                    <small class="text-muted" vslang="labels.Relationship">Relationship</small>
                                    <div>1234567</div>
                                </div>

                                <div class="col-12">
                                    <small class="text-muted" vslang="labels.Address">Address</small>
                                    <div class="text-capitalize">Phnom Penh</div>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    </div>
    `;

    div.innerHTML = html;
    LocaleManager.translateZone(div);
};

  





  
    mThis.show = function () {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
       
        mThis.renderTenantProfile();
             
    };

    return mThis;
})();