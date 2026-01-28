"use strict";

var TenantComponent = new(function () {
    const mThis = this;
    mThis.title_prop = "Tenant Management";
    this.defaultPage = 'tenant_list';
    mThis.self = main_view.VSAppContent.querySelector("#_main_tenant_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnAddTenant");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_tenant");
    mThis.elSearch = mThis.self.querySelector("#_search_tenant_");
    mThis.btnBack = document.querySelector("#_btn_back_tenant");

    mThis.divTenantListContainer = mThis.self.querySelector("#_tenant_list_container");
    mThis.divProfileView = document.querySelector('#_ten_profile_view');
    
    mThis.cardViewContainer = mThis.self.querySelector("#_tenant_card_view");
    mThis.listViewContainer = mThis.self.querySelector("#_tenant_list_view");
    mThis.currentViewMode = 'card';
    mThis.paginationContainer = mThis.self.querySelector("#tenant_card_container_pagination");
    this.pages = {
        tenant_list: this.divTenantListContainer,
        profile_view: this.divProfileView
    };  
    // console.log(8989,this.pages);
    

    mThis.profile_info_tenant = this.divProfileView.querySelector("#profile_info_tenant");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "photo",
            className: "align-middle",
            data: (data) => `<img class="btn-view-tenant-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/default/default-staff1.png`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px;"/>`,
        },
        {
            title: "Name",
            className: "align-middle",
            data: (data) => {
                const sexLabel = data.sex === 'M' ? 'Male' : data.sex === 'F' ? 'Female' : 'Other';
                return `<span class="d-block text-yp-custom" style="font-size:12px;">${data.name ?? ''}</span>
                        <small class="d-block text-muted">${sexLabel}</small>`;
            }
        },
        {
            title: "National ID",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.national_id ?? ''}</span>`;
            }
        },
        {
            title: "Passport Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.passport_number ?? ''}</span>`;
            }
        },
        {
            title: "Legal Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-yp-custom">${data.legal_name ?? ''}</span>`;
            }
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-primary" style="font-size:12px;"><i class="fa-solid text-success px-1 fa-envelope"></i> ${data.email ?? ""}</span>
                <span class="d-block" style="font-size:12px;"><i class="fa-solid text-warning px-1 fa-phone"></i> ${data.phone_number ?? ""}</span>`,
        },
        {
            title: "Address",
            className: "align-middle",
            data: (data) => {
                return `
                    <div class="text-yp-custom" style="width:150px;">
                        <i class="fa-solid fa-location-dot text-primary me-2"></i>
                        <span class="text-wrap text-break" style="word-break:break-word;">${data.address ?? 'N/A'}</span>
                    </div>
                `;
            }
        },
        {
            title: "Updated By",
            className: 'align-middle',
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-yp-custom fw-semibold"><small>${data.update_user ?? ''}</small></span>
                    <small class="text-muted">${data.updated_at ?? ''}</small>
                </div>`;
            }
        },
        {
            className: 'col_action align-middle',
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                    class="btn-tenant-dropdown-action"
                    data-id="${data.id}"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="cursor: pointer; padding: 8px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" ></i>
                    </a>
                </div>`
        },
    ];



    mThis.init = () => {
        if (mThis.initAlready) return;
        mThis.tenantCardView = new ListView(mThis.cardViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 8,
            apiCluster: main_view.apiCluster,
            paginationContainer: mThis.paginationContainer,
            renderItems: (items, container) => {
                mThis.renderTenantCard(container, items);
            },
            listContainerClass: null
        });
        mThis.tenantListView = new ListView(mThis.listViewContainer, {
            fetchApi: `${main_view.base_url}/prm/tenant/list-paginate`,
            perPage: 10,
            columns: mThis.cols,
            apiCluster: main_view.apiCluster,
            tableClass: 'table table--white rounded-2 overflow-hidden header-uppercase',
            rowCreated: (data, index, tr) => {
                // console.log(9090,tr);
                
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                mThis.initDropdownMenus(tr);
            }
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.renderView();
                    mThis.tenantListView.showPage(mThis.getFilterData());
                }
            };
            CreateTenantDialog.show(op);
        };
         mThis.btnBack.onclick = function (e) {
            e.preventDefault();
            mThis.showPage('tenant_list',mThis.getFilterData());
        };
        const cardTab = document.getElementById('tenantViewCard');
        const listTab = document.getElementById('tenantViewList');

        if (cardTab && listTab) {
            cardTab.addEventListener('change', () => {
                mThis.currentViewMode = 'card';
                mThis.renderView();
            });

            listTab.addEventListener('change', () => {
                mThis.currentViewMode = 'list';
                mThis.renderView();
            });
        }

      

        mThis.pr_tbl = mThis.tenantListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = (window.innerHeight - 190) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 190) + 'px';
        }
        mThis.tblTenant = mThis.tenantListView.getTable();

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            el.onchange = () => mThis.renderView();
        });
        mThis.elSearch.addEventListener('keyup', () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.renderView();
            }, 250);
        });
        mThis.initDropdownMenus(mThis.cardViewContainer);
        mThis.initAlready = true;
    };

     mThis.initDropdownMenus = (listContainer) => {
        const menuOptopns = {
            containerElement: listContainer,
            actionButtonClass: "btn-tenant-dropdown-action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [

               {
                    html: '<span class="ps-2">Edit Tenant</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_tenant"
                },
                {
                    html: '<span class="ps-2">Delete Tenant</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_tenant"
                },
            ],
            // adjustPosition: {
            //     top: -200,
            //     left: -300
            // },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case 'edit_tenant': {
                        mThis.editTenant(id, menuLink);
                        break;
                    }
                    case 'delete_tenant': {
                        mThis.deleteTenant(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };
    mThis.editTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            }
        };
        CreateTenantDialog.show(op);
    };
    mThis.deleteTenant = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();
            }
        };
        // if (!AuthManager.allowed(242)) return;
        cv_interact.confirm('Delete this Tenant?', {
            title: 'Delete Tenant',
            context: 'delete',
            confirmButtonText: "Delete"
        }, function (e) {
            if (e) {
                vsapi.call(`${main_view.base_url}/prm/tenant/delete`, op, false, false, false).then(res => {
                    if (res.status_code == 200) {
                        mThis.renderView();
                        cv_interact.success('Tenant deleted');
                    } else {
                        cv_interact.error(res.error_message);
                    }
                });
            }
        });
    };
    mThis.renderTenantCard = (div, data) => {
        data = data ?? [];
        // if (!AuthManager) {
        //     cv_interact.info("It seems that you have problem with connection, you may need to refresh page and try again!");
        //     return;
        // }
        AuthManager.init().then((user) => {
            mThis.renderCard(data, user);
        });
    };
    mThis.renderCard = (items) => {
            let cnt = 0;
        let html = `<div class="row g-3">`;
        if (Array.isArray(items) && items.length > 0) {

            items.forEach(d => {
                const status = d.status || "Pending";
                let statusClass = "badge rounded-3 px-3 py-1 ";
                switch (status) {
                    case "Active":
                        statusClass += " bg-success-subtle text-success border border-success-subtle";
                        break;
                    case "Inactive":
                        statusClass += " bg-secondary-subtle text-grey border border-secondary-subtle";
                        break;
                    case "Pending":
                    default:
                        statusClass += " bg-warning-subtle text-warning border border-warning-subtle";
                        break;
                }

                cnt++;
                html += `
                    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <div class="card h-100 shadow-sm border-0 rounded-2">
                            <div class="card-header-tenant border-0 rounded-top-2 d-flex justify-content-center align-items-center">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="d-flex gap-3 align-items-start">
                                        <div class="flex-shrink-0 rounded-3 shadow-sm overflow-hidden d-flex align-items-center justify-content-center"
                                            style="width:80px;height:80px;">
                                            <img src="${d.image_url || main_view.asset_url + '/images/default/default-staff1.png'}" alt="Profile" class="img-fluid w-100 h-100 object-fit-cover">
                                        </div>
                                        <div class="flex items-start justify-between mb-6">
                                            <h6 class="fw-semibold text-start mb-1 text-dark">${d.name}</h6>
                                            <span class="text-muted">#${d.code ?? ''} • Unit #</span>
                                            <div class="d-flex align-items-center mt-1 gap-2">
                                                <small class="${statusClass}">${status}</small>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0"> <a href="javascript:void(0)" class="btn-tenant-dropdown-action" data-id="${d.id}" aria-haspopup="true" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                                        </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body text-center" style="background-color:#fbfcfd; padding: 1rem;">
                                <div class="row g-4 py-2 border-bottom border-gray">
                                    <div class="col-6">
                                        <div class="d-flex flex-column text-center gap-1">
                                            <span class="text-nowrap text-muted fw-bold mb-1">
                                                Lease Expiry
                                            </span>
                                            <small class="fw-semibold mb-0 text-dark">
                                                Dec 15, 2024
                                            </small>
                                        </div>
                                    </div>

                                    <div class="col-6">
                                        <div class="d-flex flex-column text-center gap-1">
                                            <span class="text-nowrap fw-bold mb-1 text-muted" >
                                                Next Payment
                                            </span>
                                            <small class="fw-semibold mb-0 text-center text-dark">
                                                Oct 01, 2024
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div class="card_container" style="max-width: 250px;" >
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-phone me-2 text-muted"></i>
                                        ${d.phone_number || "?"}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-solid fa-at me-2 text-muted"></i>
                                        ${d.email || "?"}
                                    </p>
                                    <p class="ps-3 mb-2 text-prm-custom">
                                        <i class="fa-regular fa-building me-2 text-muted"></i>
                                        <span>Unit 502, Meta Tower</span>
                                    </p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between rounded-bottom-2  align-items-center bg-secondary px-3 p-2 small">
                                <span class="text-muted">
                                    Create By : ${d.update_user || ""}
                                </span>
                                <a href="javascript:void(0)"
                                class="text-primary-custom see-tenant-detail"
                                data-id="${d.id}">
                                    View Details <small><i class="fa-solid fa-chevron-right fw-6"></i></small>
                                </a>
                            
                            </div>

                        </div>
                    </div>
                    `;
                });

            } else {
                html += `
                <div class="col-12">
                    <div class="alert alert-light border text-center text-danger">
                        Tenant not found!
                    </div>
                </div>
                `;
            }
            html += `</div>`;
            mThis.cardViewContainer.innerHTML = html;
            const seeProfileInfo = mThis.cardViewContainer.querySelectorAll(".see-tenant-detail");
            seeProfileInfo.forEach((link) => {
                link.addEventListener("click", (e) => {
                    const tenantId = e.target.dataset.id;
                    mThis.tenant_id = tenantId;
                    mThis.showPage('profile_view',tenantId);
                    //const employeeData = data.find((emp) => emp.id == employeeId);
                    // if (employeeData) {
                    //     let sub_content = mThis.self.querySelector("#sub_content");
                    //     sub_content.classList.add("d-none");
                    //     let view_see_info =
                    //         mThis.self.querySelector("#view_see_info__");
                    //     view_see_info.classList.remove("d-none");

                    //     mThis.renderProfile(employeeData);
                    //     mThis.renderCardCenter(employeeId);
                    //     mThis.renderCardLeft(employeeId);
                    //     mThis.renderCardRight(employeeId);
                    //     mThis.renderCardTaxAllowance(employeeId);
                    //     mThis.renderEmpDocuments(employeeId);
                    // } else {
                    //     console.error(
                    //         "Employee data not found for ID:",
                    //         employeeId
                    //     );
                    // }
                });
            });
            if (cnt > 0) {
                const container = mThis.cardViewContainer;
                const te_parent = container;
                te_parent.style.maxHeight = (window.innerHeight - 250) + 'px';
                te_parent.classList.add("overflow-y-auto");
                window.onresize = () => {
                    te_parent.style.maxHeight = (window.innerHeight - 250) + 'px';
                };
            }
    };

    mThis.renderView = () => {
        const params = mThis.getFilterData();

        if (mThis.currentViewMode === 'card') {
            mThis.cardViewContainer.classList.remove('d-none');
            mThis.listViewContainer.classList.add('d-none');
            mThis.paginationContainer.style.display = 'block';
           

            mThis.tenantCardView.showPage(params);
        } else {
            console.log(3333, mThis.paginationContainer);
            
            mThis.cardViewContainer.classList.add('d-none');
            mThis.listViewContainer.classList.remove('d-none');
            mThis.paginationContainer.style.display = 'none';
            mThis.tenantListView.showPage(params);
        }
    };
    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value
        };

        mThis.divFilter.querySelectorAll('.filter-field').forEach(el => {
            p[el.dataset.field] = el.value;
        });

        return p;
    };
     mThis.getPageContainer =(pageName)=>{
        return mThis.pages[pageName];
    };
    mThis.showPage = async (pageName, op = {})=>{
       if(this.self.style.display !=='block'){
         main_view.setContentView(this.self, this.title_prop);
       }
       switch(pageName){
         case 'tenant_list':{
            mThis.currentPage = 'tenant_list';
            mThis.renderView();
            break;
         }
         case 'profile_view':
            {
                mThis.currentPage = 'profile_view';
                const tenant_id = (op.tenant_id || op.id || op);
                const p = {"id": tenant_id};
                const res = await vsapi.call([main_view.base_url, '/prm/tenant/details'].join(''),p,false,null);
                const data = res.data || {};
                mThis.renderProfile(data);
                // mThis.renderCardCenter(emp_id);
                // mThis.renderCardLeft(emp_id);
                // mThis.renderCardRight(emp_id);
                // mThis.renderCardTaxAllowance(emp_id);
                // mThis.renderEmpDocuments(emp_id);

                break;
            }
          default:{
             return;
          }
       }
       const targetPage = mThis.getPageContainer(pageName);
       console.log(9090,targetPage);
       
       const siblings = Array.from(targetPage.parentElement.children);
       // Hide all siblings smoothly
       siblings.forEach((div) => {
           if (div !== targetPage && div.style.display !== 'none') {
               div.style.display = 'none';
           }
       });
       targetPage.style.display = 'block';
    };
   mThis.renderProfile = (data) => {
    console.log(90909090, data);
    let html = `
    <div class="row g-4">
        <div class="col-12 col-lg-3">
            <div class="card shadow-sm mb-4">
                <div class="card-body text-center">
                    <div class="position-relative d-inline-block mb-3">
                        <img src="${data.image_url || `${main_view.base_url}/assets/images/default/default-staff1.png`}"
                            class="rounded-circle border" width="130" height="130">
                        <span class="position-absolute d-none bottom-0 end-0 bg-success rounded-circle border border-white"
                            style="width:14px;height:14px;"></span>
                    </div>
                    <h4 class="fw-bold mb-1">${data.name}</h4>
                    <div class="mb-3">
                        <span class="badge bg-success me-1">Verified</span>
                        <span class="badge bg-primary">Active</span>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between mb-2">
                        <small class="text-muted">Move-in Date</small>
                        <strong>Oct 12, 2022</strong>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <small class="text-muted">Rent Status</small>
                        <span class="badge bg-success">PAID</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <small class="text-muted">Security Deposit</small>
                        <strong>$2,400.00</strong>
                    </div>
                </div>
            </div>

            <!-- Quick Stats -->
            <div class="row g-3">
                <div class="col-6">
                    <div class="card text-center shadow-sm">
                        <div class="card-body">
                            <small class="text-muted">Lease Terms</small>
                            <div class="fw-bold fs-5">12 Months</div>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card text-center shadow-sm">
                        <div class="card-body">
                            <small class="text-muted">Unit Number</small>
                            <div class="fw-bold fs-5 text-primary">402-B</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="col-12 col-lg-9">
            <div class="card shadow-sm h-100">

                <!-- Tabs -->
                <div class="card-header bg-white">
                    <ul class="nav nav-tabs card-header-tabs" id="tenantTabs">
                        <li class="nav-item">
                            <a class="nav-link active fw-semibold" href="#overview">Overview</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link fw-semibold" href="#lease-history">Lease History</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link fw-semibold" href="#documents">Documents</a>
                        </li>
                    </ul>
                </div>

                <!-- Tab Content -->
                <div class="card-body tab-content">
                    <div class="tab-pane active" id="overview">
                        <h5 class="fw-bold mb-4"><i class="fa fa-user me-1 text-primary"></i> Personal Information</h5>
                        <div class="row g-4 mb-5">
                            <div class="col-md-4"><small class="text-muted">Name</small><div class="fw-semibold">${data.name ?? ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">Sex</small><div class="fw-semibold">${data.sex == 'M' ? 'Male' : data.sex == 'F' ? 'Female' : ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">Legal Name</small><div class="fw-semibold">${data.legal_name ?? ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">National ID</small><div class="fw-semibold">${data.national_id ?? ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">Passport Number</small><div class="fw-semibold">${data.passport_number ?? ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">Phone</small><div class="fw-semibold text-primary">${data.phone_number ?? ''}</div></div>
                            <div class="col-md-4"><small class="text-muted">Email</small><div class="fw-semibold text-primary">${data.email ?? ''}</div></div>
                            <div class="col-md-8"><small class="text-muted">Address</small><div class="fw-semibold text-primary">${data.address ?? ''}</div></div>
                        </div>

                        <h5 class="fw-bold mb-4"><i class="fa fa-phone me-1 text-primary"></i> Emergency Contact</h5>
                        <div class="row g-4">
                            <div class="col-md-6"><small class="text-muted">Contact Name</small><div class="fw-semibold">${data.name}</div></div>
                            <div class="col-md-6"><small class="text-muted">Relationship</small><div class="fw-semibold">Partner</div></div>
                            <div class="col-md-12"><small class="text-muted">Emergency Phone</small><div class="fw-semibold">${data.phone_number}</div></div>
                        </div>
                    </div>

                    <div class="tab-pane" id="lease-history">
                        <h5 class="fw-bold mb-4"><i class="fa fa-file-text me-1 text-primary"></i> Lease History</h5>
                        <p>Lease history content goes here...</p>
                    </div>

                    <div class="tab-pane" id="documents">
                        <h5 class="fw-bold mb-4"><i class="fa fa-folder me-1 text-primary"></i> Documents</h5>
                        <p>Tenant documents content goes here...</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="card-footer bg-light d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <small class="text-muted">Managed by <strong>Admin: chhorng</strong></small>
                    <div>
                        <a href="javascript:void(0)" class="btn btn-prm-custom btn-sm me-2 d-none">View Logs</a>
                        <a href="javascript:void(0)" class="btn edit_tenant_profile_info btn-prm-custom btn-sm rounded-2" data-id="${data.id}" data-status ="${data.status_id}"><i class="fa fa-edit me-1"></i> Edit Profile</a>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="text-center text-muted small mt-4">
        Profile ID: TEN-992834-2023 · Created Oct 24, 2023 · Updated 2 days ago
    </div>
    `;

    mThis.profile_info_tenant.innerHTML = html;

    // ===== Tabs JS =====
    const tabLinks = mThis.profile_info_tenant.querySelectorAll('#tenantTabs a');
    const tabPanes = mThis.profile_info_tenant.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').replace('#','');

            // remove active class
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // add active to selected
            link.classList.add('active');
            mThis.profile_info_tenant.querySelector(`#${target}`).classList.add('active');
        });
    });

    mThis.setActionsProfileInfo(mThis.profile_info_tenant);
};

    mThis.setActionsProfileInfo = (divProfile) => {
        console.log(33,divProfile);
        
        divProfile.addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".edit_tenant_profile_info ");
            if (btn) {
                mThis.editTenantInfo(btn.dataset.id, btn);
                return;
            }
            // btn = VSUtil.closestLimited(e.target, ".delete_employee");
            // if (btn) {
            //     mThis.deleteEmployee(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".set_resign");
            // if (btn) {
            //     mThis.setResign(btn.dataset.id, btn);
            //     return;
            // }
            // btn = VSUtil.closestLimited(e.target, ".movement");
            // if (btn) {
            //     mThis.movement(btn.dataset.id, btn);
            //     return;
            // }
        });
    };
       mThis.editTenantInfo = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.renderView();

            },
        };
        CreateTenantDialog.show(op);
    };




    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/tenant/form-options`, null, null, null)
            .then(res => {
                if (typeof onFinish === 'function') onFinish();
            });
    };
    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            // main_view.setContentView(mThis.self, mThis.title_prop);
            // mThis.renderView();
             mThis.showPage(mThis.defaultPage,mThis.getFilterData());
        });
    };

    return mThis;
})();

   



const CreateTenantDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg",
            backdrop: "static",
            keyboard: true,
            createContent: () => {
                return `
                <div class="tenant-form row p-1">

                    <!-- Profile Section -->
                        <div class="col-md-4 text-center d-flex flex-column justify-content-center">
                            <div class="tenant-photo-wrapper border border-prm-custom rounded-3 d-flex align-items-center justify-content-center mx-auto"
                                style="width: 210px; height: 140px; cursor: pointer; background-color: #f8f8f8;">
                                <div name="div_tenant_photo"
                                    class="w-100 h-100">
                                </div>
                            </div>
                            <small class="text-muted d-block mt-2">Profile Photo</small>
                        </div>
                        <div class="col-md-8 row pb-3">
                            <div class="col-12 ">
                                <label style="color:#777777;padding-left:6px;">Full Name</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="name"
                                        class="data-input form-control"
                                        data-field="name"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Gender</label>
                                <div class="material-input outlined">
                                    <select name="sex"
                                        class="data-input form-control"
                                        data-field="sex">
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-12 col-md-6">
                                <label style="color:#777777;padding-left:6px;">Date of Birth</label>
                                <div class="material-input outlined">
                                    <input type="date" name="date_of_birth"
                                        class="data-input form-control form_input"
                                        data-field="date_of_birth" />
                                </div>
                            </div>
                            
                        </div>
                        <div class="col-12 row pb-3">
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">Legal Name</label>
                                <div class="material-input outlined">
                                    <input type="text"
                                        name="legal_name"
                                        class="data-input form-control"
                                        data-field="legal_name"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">Nationality</label>
                                <div class="material-input outlined">
                                    <select name="nationality_id" class="data-input form-control" data-field="nationality_id"></select>
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">National ID </label>
                                <div class="material-input outlined">
                                    <input type="number"
                                        name="national_id"
                                        class="data-input form-control"
                                        data-field="national_id"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">Passport Number </label>
                                <div class="material-input outlined">
                                    <input type="number"
                                        name="passport_number"
                                        class="data-input form-control"
                                        data-field="passport_number"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">Phone Number </label>
                                <div class="material-input outlined">
                                    <input type="number"
                                        name="phone_number"
                                        class="data-input form-control"
                                        data-field="phone_number"
                                        placeholder=" " />
                                </div>
                            </div>
                            <div class="col-12 col-md-4">
                                <label style="color:#777777;padding-left:6px;">Email</label>
                                <div class="material-input outlined">
                                    <input type="email"
                                        name="email"
                                        class="data-input form-control"
                                        data-field="email"
                                        placeholder=" " />
                                </div>
                            </div>
                        <div class="col-12">
                            <label style="color:#777777;padding-left:6px;">Address</label>
                            <div class="material-input outlined">
                                <textarea class="data-input form-control"
                                    data-field="address"
                                    rows="3"
                                    placeholder=" ">
                                </textarea>
                            </div>
                        </div>
                    

                </div>
                `;
            },

            contentCreated: (me) => {
                const footer = me.divModal.querySelector('.modal-footer');
                const header = me.divModal.querySelector('.modal-header');
                const headerTitle = header.querySelector('.modal-title');
                const btnClose = header.querySelector('button');

                if (btnClose) btnClose.classList.add('d-none');
                header.classList.add('bg-prm-custom', 'modal-header-custom');
                header.parentElement.classList.add('overflow-hidden');
                header.parentElement.style = 'border-radius: 20px !important;';

                const headerWrapper = document.createElement('div');
                headerWrapper.classList.add('d-flex', 'flex-column', 'align-items-center', 'w-100');
                headerTitle.classList.add('text-white', 'text-center', 'w-100');
                headerWrapper.appendChild(headerTitle);
                header.innerHTML = '';
                header.appendChild(headerWrapper);



                const div_tenant_photo = me.controls.div_tenant_photo;
                me.tenantImageBox = new ImageBox(div_tenant_photo, {
                    defaultPhotoName: "default-skill",
                    containerClass: "tenant-profile-container",
                    imgClass: "data-input",
                    dataset: {
                        field: "photo",
                    } /** please set field: photo so that we can use for both Edit and Create easily */,
                    //dataset: { field: "image_url" },
                    beforeDeleteImage: async () => {
                        if (me.dataOptions.id > 0) {
                            const yes = await cv_interact.confirm(
                                "Are you sure to delete this profile photo?",
                                { title: "Delete Photo", context: "delete" }
                            );
                            if (yes) {
                                //delete member's photo from backend
                                me.deleteProfilePhoto(me.dataOptions.id);
                                return true;
                            } else
                                return false;
                        } else {
                            //Case of Create new member, just clear photo
                            me.tenantImageBox.setImage(null);
                        }
                        return true;
                    },
                    //When user browse new photo and loads it in the IMG element
                    onOpenImage: (img) => {
                        if (me.dataOptions.id > 0) {
                            //This is case of Editing Existing member information
                            me.saveProfilePhoto(img, me.dataOptions.id);
                        }
                    },

                });

                me.deleteProfilePhoto = (id) => {
                    const p = { id: id };
                    vsapi
                        .call(
                            [
                                main_view.base_url,
                                "/prm/tenant/profile/photo/delete",
                            ].join(""),
                            p,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                me.tenantImageBox.setImage(null);
                                cv_interact.info(
                                    "Profile photo was deleted!"
                                );
                            } else cv_interact.error(res.error_message);
                        });
                };

                me.saveProfilePhoto = (photo, id) => {
                    const p = { "photo": photo, "id": id };
                    vsapi
                        .call(
                            [
                                main_view.base_url,
                                "/prm/tenant/profile/photo/save",
                            ].join(""),
                            p,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                me.tenantImageBox.setImage(res.data.image_url); 
                                cv_interact.success(
                                    "Profile photo was saved!"
                                );
                            } else cv_interact.error(res.error_message);
                        });
                };

            },
            configSelect: [
                    {
                        name: "nationality_id",
                        data: "nationalities",
                        textField: "nationality",
                        valueField: "id", // "id" is the country_id
                    },
            ],
            prepareFormOptions: {
                createTitle: "Create New Tenant",
                modifyTitle: "Modify Tenant",
                targetProp: "tenant",
                api: {
                    endpoint: [main_view.base_url, "/prm/tenant/form-options"].join(""),
                    params: (op) => {
                        return { id: op.id };
                    },
                },
            },
            onPrepareForm: (me, data) => {
                const header = me.divModal.querySelector('.modal-header');
                const btnClose = header.querySelector('button');
                if (btnClose) btnClose.classList.add('d-none');
            },

            extendMethod: {
                setData: (me, data) => {
                    // console.log(data);

                    me.tenantImageBox.setImage(data.image_url);

                }
            },
            buttons: [
                {
                    label: '<span>Cancel</span>',
                    cssClass: 'btn-vs-cancel',
                    click: (me, btn) => {
                        me.hide(false);
                    },
                },
                {
                    label: '<span>Submit</span>',
                    cssClass: 'btn-vs-save',
                    click: (me, btn) => {
                        const op = me.getData();
                        op.id = me.dataOptions.id;
                        op.photo = me.tenantImageBox ? me.tenantImageBox.getImage() : '';
                        vsapi.call([main_view.base_url, "/prm/tenant/create"].join(""), op, btn, null).then((res) => {
                            if (res.status_code === 200) {
                                me.hide(true, op);
                                if (me.dataOptions.id > 0) {
                                    cv_interact.success("Tenant has been updated successfully");
                                } else {
                                    cv_interact.success("New tenant has been added successfully");
                                }
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                    },
                },
            ],
        });
        dialog.show(op);
    };
    return self;
})();



