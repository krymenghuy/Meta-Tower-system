"use strict";
var BranchManagementComponent = new (function () {
    const mThis = this;
    this.title_prop = "Branch Management";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_um_branchManagementComponent");
    this.self = this.jm[0];
    this.btnNewBranch = mThis.self.querySelector("#_bm_btn_new");
    this.elSearch = mThis.self.querySelector("#_um_search_branch");
    this.containerPagination = mThis.self.querySelector(
        "#container_pagination_um",
    );

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.branchListView = new ListView("_branch_container", {
            fetchApi: `${main_view.base_url}/api/branch/list`,
            perPage: 5,
            paginationContainer: mThis.containerPagination,
            apiCluster: main_view.apiCluster,
            renderItems: (items, list_container) => {
                list_container.classList.add("pe-3");
                console.log("items", items);
                mThis.renderBranchList(list_container, items);
            },
            listContainerClass: null,
        });

        mThis.btnNewBranch.onclick = function (e) {
            e.preventDefault();

            let op = {
                id: null,
                btn: e.target,
                onClose: (user) => {
                    mThis.branchListView.showPage(mThis.getFilterData());
                },
            };
            CreateBranchDialog.show(op);
        };
        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.branchListView.showPage(mThis.getFilterData());
            }, 250);
        };

        this.listContainer = mThis.branchListView.getListContainer();
        mThis.initDropdownMenus(mThis.listContainer);
        mThis.initAlready = true;
    };
    this.setDirector = (id, lnk) => {
        if (!lnk || !lnk.dataset) return;
        const op = {
            role: "employee",
            title: "Find Staff",
            singleSelect: true,
            onClose: (emp, canceled) => {
                console.log("test::", emp);
                //This "id" is branch_id
                const data = { branch_id: id, emp_id: emp.id };
                vsapi
                    .call(
                        `${main_view.base_url}/api/branch/set-director`,
                        data,
                        false,
                        null,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            mThis.branchListView.showPage(
                                mThis.getFilterData(),
                            );
                            cv_interact.success(
                                "Branch director has been set successfully!",
                            );
                        } else cv_interact.warning(res.error_message);
                    });

                //mThis.branchListView.showPage(mThis.getFilterData());
                // d.student_id = btn.dataset.id;
                // d.referal_id = btn.dataset.referalid;
                // d.referrer_id = d.id;
                // vsapi.call(`${main_view.base_url}/api/student/set-referrer`,d,false,false,false).then(res =>{
                //     if(res.status_code ==200){
                //         EnrolledStudentsComponent.studentListView.showPage(mThis.getFilterData());
                //         cv_interact.success('Referrer has been updated!');
                //     }else cv_interact.error(res.error_message);
                // });
            },
        };
        FindPersonDialog.show(op);
        return;
    };

    this.editBranch = (id, lnk) => {
        if (lnk) {
            let op = {
                id: lnk.dataset.id,
                branch_id: lnk.dataset.id,
                title: "Modify Branch",
                default: {},
                onClose: () => {
                    mThis.branchListView.showPage(
                        mThis.getFilterData(),
                        mThis.branchListView.current_page,
                    );
                },
            };
            CreateBranchDialog.show(op);
            return;
        }
    };

    this.deleteBranch = (branch_id, lnk) => {
        if (lnk) {
            let op = {
                branch_id: branch_id,
            };
            if (!AuthManager.allowed(101)) return;
            if (op.branch_id) {
                cv_interact.confirm(
                    "Delete this Branch?",
                    {
                        title: "Delete Branch",
                        context: "delete",
                    },
                    (e) => {
                        if (e) {
                            vsapi
                                .call(
                                    `${main_view.base_url}/api/branch/delete`,
                                    op,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        cv_interact.info("Branch was deleted!");
                                        mThis.branchListView.showPage(
                                            mThis.getFilterData(),
                                            mThis.branchListView.current_page,
                                        );
                                    } else {
                                        cv_interact.error(
                                            res.error_message ??
                                                "Something went wrong 312!",
                                        );
                                    }
                                });
                        }
                    },
                );
            }
            return;
        }
    };

    this.initDropdownMenus = (Container) => {
        const menuOptions = {
            containerElement: Container,
            actionButtonClass: "btn_um_action",
            cssClass: "bg-white box-shadow ",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Set Director"></span>',
                    icon: `<i class="fa-solid fa-user-pen fs-5 text-info"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "set_director",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Modify Branch">Modify Branch</span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_branch",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Branch">Delete Branch</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_branch",
                },
            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "set_director": {
                        mThis.setDirector(id, menuLink);
                        break;
                    }
                    case "edit_branch": {
                        mThis.editBranch(id, menuLink);
                        break;
                    }
                    case "delete_branch": {
                        mThis.deleteBranch(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    this.renderBranchList = (div, items) => {
        items = items ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seems to work properly. You may need to refresh page",
            );
            return;
        }
        //AuthManager() provides current user information
        // console.log(AuthManager.init);

        AuthManager.init().then((user) => {
            // console.log(user);
            mThis.beginRenderBranch(div, items, user);
        });
    };

    this.renderHeaderList = () => {
        return [
            `<div data-roleid="" style="background-color:#38373a;" class="w-100 rounded-3  p-3 pb-0 box-shadow text-white mb-3 position-relative">
                <div class="scope-user d-flex align-items-center row gy-2">
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Branch</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Branch Type</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Director</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Contact Info</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Address</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Last Update</span>
                            </h6>
                        </div>
                    </div>
                  <!--  <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Fst cp Phone</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Snd cp Name</span>
                            </h6>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize">Snd cp Phone</span>
                            </h6>
                        </div>
                    </div>
                -->
                    <div class="col">
                        <div class="d-block">
                            <h6 class="text-nowrap">
                                <span class="text-capitalize"></span>
                            </h6>
                        </div>
                    </div>
                    
                </div>
            </div>`,
        ].join("");
    };

    this.beginRenderBranch = (div, items, current_user) => {
        const d = current_user;
        let html = "";
        html = mThis.renderHeaderList();
        div.innerHTML = html;
        let search_value = mThis.elSearch.value;
        let cnt = 0;
        items.forEach((branch) => {
            html = [
                html,
                `<div data-id="${branch.id}" class="w-100 rounded-3 border-start border-5 border-info-custom p-3 box-shadow bg-white mb-3 position-relative">
                <div class="scope-user d-flex align-items-center row gy-2">
                    
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.name ?? "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.branch_type ?? "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col" >
                        <div class="d-block" >
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">`,
                branch.director_name || "N/A",
                `</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.phone_number ?? ""}</span>
                            </p>
                              <p class="text-nowrap m-0">
                                <span class="text-primary">${branch.email ?? ""}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-truncate m-0" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="`,
                branch.address,
                `">
                                <span class="text-capitalize">`,
                branch.address
                    ? branch.address
                    : '<span class="text-danger">Not yet</span>',
                `</span>
                            </p>
                        </div>
                    </div>

                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.update_user}</span>
                            </p>
                            <p class="text-nowrap m-0">
                                <small class="text-muted">${branch.updated_at}</small>
                            </p>
                        </div>
                    </div>
                  <!--  <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.first_cp_phone || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.second_cp_name || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                    <div class="col">
                        <div class="d-block">
                            <p class="text-nowrap m-0">
                                <span class="text-capitalize">${branch.second_cp_phone || "N/A"}</span>
                            </p>
                        </div>
                    </div>
                -->
                    <div class="col">
                        <div class="d-flex align-items-center justify-content-end h-100">
                        <div class="d-flex flex-row width-locked-icon">
                          ${branch.is_locked ? '<i class="fa-solid fa-ban fs-4 text-danger"></i>' : ""}
                        </div>
                            <button class="btn_um_action btn btn-sm btn-outline-secondary rounded-2 text-nowrap" type="button"   data-roleid = "${branch.role_id || branch.primary_role_id || ""}" data-id="${branch.id}" data-loginname="${branch.login_name}" data-lock="${branch.is_locked ? "unlock" : "lock"}">
                                <span class=" " vslang="buttons.Action">Action</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>`,
            ].join("");
            cnt++;
        });
        if (cnt === 0) {
            html = `<div class="d-flex justify-content-center align-items-center" style="height:50vh">
            <div class="no_data">
              <img style="width:200px" src="${main_view.asset_url}/images/icons/no_data.webp" alt="No Data">
              <p>${search_value ? "There seems to be no matched branches found!" : "No branches to show yet!"}</p>
            </div>
           </div>`;
        }
        div.innerHTML = html;
        const parent = div.parentElement;
        parent.style.height = window.innerHeight - 200 + "px";
        window.onresize = function (e) {
            e.preventDefault();
            parent.style.height = window.innerHeight - 200 + "px";
        };
    };

    this.getFilterData = () => {
        return {
            search_value: mThis.elSearch.value,
        };
    };

    this.prepareFormOption = (onFinish = null) => {
        vsapi
            .call(
                `${main_view.base_url}/api/user/form-options`,
                null,
                null,
                false,
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data ?? [],
                        el = mThis.elFilter_user_role;
                    // VSUtil.setComboItems(el,d.roles,'id','role_name',true,'All Roles',null);
                    // VSUtil.setComboItems(mThis.elFilter_user_branch,d.branches,'id','branch_name',true,'All Branches',null);
                    if (typeof onFinish === "function") onFinish();
                }
            });
    };

    this.show = (options) => {
        mThis.init(); //NOTE: initOnce init one time only
        if (!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOption(() => {
            mThis.branchListView.showPage(mThis.getFilterData(), null, () => {
                mThis.jm.siblings().hide();
                mThis.jm.fadeIn(250);
            });
        });
    };
})();
