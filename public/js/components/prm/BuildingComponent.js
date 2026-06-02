"use strict";
var BuildingComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Buildings";

    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_building_component",
    );
    mThis.btnAddBuilding = mThis.self.querySelector("#_btnAddBuilding");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_building");
    mThis.elSearch = mThis.self.querySelector("#_search_building");
    function formatArea(value) {
        return value
            ? parseFloat(value).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })
            : "";
    }
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-row align-items-center">
                    <!-- <img class="btn-view-member-photo" data-id="${data.id}" src="${data.image_url || `${main_view.base_url}/assets/images/meta/building-default.jfif`}" alt="" style="width: 50px; height: 50px; border-radius: 6px; margin-right: 10px; object-fit: cover;"/> -->

                  <div class="d-flex flex-column">
                    <span class="text-prm-custom fs-bold d-inline-block text-capitalize" style="min-width:150px; ">
                        ${data.name ?? ""}
                    </span>
                    <small class="text-golden text-break" style="max-width:250px;">
                        ${data.address ?? ""}
                    </small>
                  </div>
                </div>
            `,
        },
        {
            transTitle: "titles.ShortCut",
            className: "align-middle",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-start text-prm-custom">${data.prefix ?? "__"}</span></span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Total Areas",
            className: "align-middle",
            data: (data) => {
                let area = formatArea(data.total_area);
                return `<div class="d-flex flex-column">
                    <span class="text-start  text-prm-custom"><span>${area}${area ? " m²" : ""}</span></span>

                </div>`;
            },
        },
        {
            transTitle: "titles.Total Floors",
            className: "align-middle",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.total_floor ?? "0"}</span></span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Total Units",
            className: "align-middle",
            data: (data) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom">${data.total_space ?? "0"}</span></span>
                </div>`;
            },
        },
        // {
        //     title: "Occupancy",
        //     className: "align-middle",
        //     data: (data) => {
        //         let occ = data.occupancy ?? 75;
        //         let space = data.total_space ?? 100;
        //         let percent = space > 0 ? Math.round((occ / space) * 100) : 0;

        //         return `
        //             <div class="d-flex align-items-center gap-2">
        //                 <div class="progress" style="width:120px; height:8px;">
        //                     <div class="progress-bar bg-primary" role="progressbar"
        //                         style="width: ${percent}%;"
        //                         aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
        //                     </div>
        //                 </div>
        //                 <span class="fw-semibold text-dark">${percent}%</span>
        //             </div>
        //         `;
        //     }
        // },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data) => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-prm-custom">${data.update_user ?? ""}</span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>
            `,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <a href="javascript:void(0)"
                       class="btn--Options ${data.action_id > 1 ? "d-none" : "btn_leave_action"}"
                       data-id="${data.id}"
                       data-statusid="${data.status_id}">
                       <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5" style="padding: 0 10px;"></i>
                    </a>
                </div>
            `,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BuildingListView = new ListView("_building_list", {
            fetchApi: `${main_view.base_url}/prm/building/list-paginate`,
            perPage: 7,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.dataset.totalfloor = data.total_floor ?? 0;
                tr.classList.add("building");
                tr.setAttribute("id", ["building_id", data.id].join(""));
            },
            listContainerClass: null,
        });

        mThis.btnAddBuilding.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BuildingListView.showPage(mThis.getFilterData());
                    // mThis.fetchSummaryData();
                },
            };
            BuildingDialog.show(op);
        };

        mThis.pr_tbl = mThis.BuildingListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

        mThis.tblBuilding = mThis.BuildingListView.getTable();
        mThis.initDropdownMenus(mThis.tblBuilding);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BuildingListView.showPage(mThis.getFilterData());
            };
        });
        mThis.cfg = new ExpandableRowConfig(
            mThis.tblBuilding.getAttribute("id"),
            {
                dontExpandByClickingOn: ["btn_leave_action"],
                // showExpandSignal: false,
                onOpen: (container, detail_tr, parent_tr) => {
                    const id = parent_tr.dataset.id;
                    const totalFloor = parseInt(
                        parent_tr.dataset.totalfloor || "0",
                        10,
                    );
                    console.log(123456, id);
                    if (id > 0) {
                        mThis.displayFloorNumber(container, id, totalFloor);
                    }
                },
            },
        );
        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };
    mThis.displayFloorNumber = (container, id, totalFloor = 0) => {
        container.innerHTML = "";

        vsapi
            .call(`${main_view.base_url}/prm/building/list-floor`, { id }, null)
            .then((res) => {
                const data = res.status_code === 200 ? res.data || [] : [];

                const maxFloorNo = data.reduce((max, level) => {
                    const floorNo = parseInt(level.floor_no || "0", 10);
                    return floorNo > max ? floorNo : max;
                }, 0);

                const canAddFloor =
                    parseInt(totalFloor || "0", 10) > 0 &&
                    maxFloorNo < parseInt(totalFloor || "0", 10);

                let html = "";

                if (data.length > 0) {
                    html += `
                ${
                    canAddFloor
                        ? `
                <div class="rounded-3 p-2 l mb-2">
                    <button data-buildingid="${id}" class="btn-add-floor btnAddNewPrm" type="button">
                        <span vslang="buttons.Create Floor">Create Floor</span>
                    </button>
                </div>`
                        : ""
                }

                <table class="table table-sm table-hover align-middle tbl_list_floor table--dropdown">
                    <thead class="table-light text-nowrap">
                        <tr>
                            <th vslang="titles.Floor">Floor</th>
                            <th vslang="titles.Floor Number">Floor Number</th>
                            <th vslang="titles.Total Space">Total Space</th>
                            <th vslang="titles.Description">Description</th>
                            <th vslang="titles.Last Updated">Last Updated</th>
                            <th vslang="titles.Action">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            `;
                } else {
                    html += `
                ${
                    canAddFloor
                        ? `
                <div class="rounded-3 p-2 l mb-2">
                    <button data-buildingid="${id}" class="btn-add-floor btnAddNewPrm" type="button">
                        <span vslang="buttons.Create Floor"></span>
                    </button>
                </div>`
                        : ""
                }

                <div class="text-center bg-light text-muted py-3">
                    ${LocaleManager.trans("No data to display.")}
                </div>
            `;
                }

                container.innerHTML = html;
                LocaleManager.translateZone(container);

                const tbody = container.querySelector("tbody");
                const btnNewFloor = container.querySelector(".btn-add-floor");

                if (btnNewFloor) {
                    btnNewFloor.addEventListener("click", (e) => {
                        e.preventDefault();

                        let op = {
                            id: 0,
                            building_id: parseInt(
                                btnNewFloor.dataset.buildingid,
                                10,
                            ),
                            onClose: (success) => {
                                if (!success) return;
                                mThis.displayFloorNumber(
                                    container,
                                    id,
                                    totalFloor,
                                );
                            },
                        };

                        CreateFloorDialog.show(op);
                    });
                }

                if (tbody) {
                    mThis.renderFloorList(tbody, data, id);

                    tbody.addEventListener("click", (e) => {
                        const btnEdit = e.target.closest(".btn-edit-floor");
                        const btnDelete = e.target.closest(".btn-delete-floor");

                        if (btnEdit) {
                            e.preventDefault();
                            mThis.editFloor(
                                {
                                    id: btnEdit.dataset.floorid,
                                    building_id: btnEdit.dataset.buildingid,
                                },
                                () => {
                                    mThis.displayFloorNumber(
                                        container,
                                        id,
                                        totalFloor,
                                    );
                                },
                            );
                            return;
                        }

                        if (btnDelete) {
                            e.preventDefault();
                            mThis.deleteFloor(
                                {
                                    id: btnDelete.dataset.id,
                                    building_id: btnDelete.dataset.buildingid,
                                },
                                () => {
                                    mThis.displayFloorNumber(
                                        container,
                                        id,
                                        totalFloor,
                                    );
                                },
                            );
                        }
                    });
                }
            });
    };
    mThis.renderFloorList = (tbody, data, buildingId) => {
        let html = "";
        if (!data) data = [];

        (data || []).map((level) => {
            let shortcut = level.floor_name
                ? `(${level.floor_name ?? "_"})`
                : "_";
            html = [
                html,
                `<tr>
                <td>
                    <span class="d-block">${level.floor_name ?? "_"}</span>
                    <span class="d-block text-muted">
                        <small>${shortcut ?? "_"}</small>
                    </span>
                </td>
                <td>${level.floor_no ?? "_"}</td>
                <td>${level.total_space ?? "_"}</td>
                <td style="width:350px; max-width:350px; white-space:normal; word-break:break-word;">
                    ${level.description ?? "_"}
                </td>
                <td>
                    <span class="d-block">${level.update_user ?? "_"}</span>
                    <span>
                        <small>${level.updated_at ?? "_"}</small>
                    </span>
                </td>
                <td class="text-nowrap">
                    <a href="javascript:void(0)" class="btn-edit-floor me-2 text-warning"
                       data-id="${level.id}" data-floorid="${level.floor_id}" data-buildingid="${buildingId}">
                        <i class="fa-regular fa-edit fs-6"></i>
                    </a>
                    <a href="javascript:void(0)" class="btn-delete-floor text-danger"
                       data-id="${level.id}" data-floorid="${level.floor_id}" data-buildingid="${buildingId}">
                        <i class="fa-regular fa-trash-can fs-6"></i>
                    </a>
                </td>
            </tr>`,
            ].join("");
        });
        tbody.innerHTML = html;
    };

    mThis.editFloor = (op, onDone) => {
        CreateFloorDialog.show({
            id: parseInt(op.id || 0, 10),
            building_id: parseInt(op.building_id || 0, 10),
            onClose: (success) => {
                if (success && typeof onDone === "function") onDone();
            },
        });
    };

    mThis.deleteFloor = (op, onDone) => {
        cv_interact.confirm(
            "confirm_delete_floor",
            {
                title: "delete_floor",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (isConfirm) {
                if (!isConfirm) return;
                vsapi
                    .call(
                        `${main_view.base_url}/prm/building/delete-floor`,
                        op,
                        false,
                        false,
                        false,
                    )
                    .then((res) => {
                        if (res.status_code === 200) {
                            cv_interact.success(
                                "floor_deleted",
                            );
                            if (typeof onDone === "function") onDone();
                        } else {
                            cv_interact.error(
                                res.error_message || "Delete failed",
                            );
                        }
                    });
            },
        );
    };

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_building",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_building",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_building": {
                        mThis.editBuilding(id, menuLink);
                        break;
                    }
                    case "delete_building": {
                        mThis.deleteBuilding(id, menuLink);
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

    mThis.editBuilding = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
                // mThis.fetchSummaryData();
            },
        };
        BuildingDialog.show(op);
    };

    mThis.deleteBuilding = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BuildingListView.showPage(mThis.getFilterData());
                // mThis.fetchSummaryData();
            },
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Building?",
            {
                title: "Delete Building",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/building/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                mThis.BuildingListView.showPage();
                                cv_interact.success(
                                    "Building has been deleted",
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message || "Delete failed",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/building/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        if (!options) options = {};
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BuildingListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const BuildingDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) => {
                    const title = me.dataOptions.id ? "Modify Building" : "Create Building";
                    if (title) {
                       return  `<h4 class="text-prm-custom text-start fw-bold">${LocaleManager.trans(title,'titles')}</h4>`;
                    }
                },
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="name" class="data-input form-control" data-field="name" placeholder=" " />
                                <label vslang="labels.Name"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="prefix" class="data-input form-control" data-field="prefix" placeholder=" " />
                                <label vslang="labels.Shortcut"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="total_floor" class="data-input form-control" data-field="total_floor" placeholder=" " />
                                <label vslang="labels.Total Floors"></label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="vs-material-field">
                                <input type="text" name="total_area" class="data-input form-control" data-field="total_area" placeholder=" " />
                                <label vslang="labels.Total Area"></label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea type="text" name="address" class="data-input form-control" data-field="address" placeholder=" "></textarea>
                                <label vslang="labels.Address"></label>
                            </div>
                        </div>
                    </div>`,
                    ].join("");
                },
                contentCreated: (me) => {
                    const floor = me.divModal.querySelector(
                        '[name="total_floor"]',
                    );
                    const area = me.divModal.querySelector(
                        '[name="total_area"]',
                    );

                    if (floor) {
                        floor.addEventListener("input", function () {
                            let start = this.selectionStart;
                            let v = this.value.replace(/[^0-9]/g, "");
                            v = v.replace(/^0+/, "");
                            if (v === "") {
                                v = "";
                            }
                            if (v.length > 2) {
                                v = v.slice(0, 2);
                            }
                            this.value = v;
                            this.setSelectionRange(start, start);
                        });
                    }
                    if (area) {
                        area.addEventListener("input", function () {
                            let start = this.selectionStart;

                            let v = this.value.replace(/[^0-9.]/g, "");

                            let parts = v.split(".");

                            if (parts.length > 2) {
                                v = parts[0] + "." + parts.slice(1).join("");
                                parts = v.split(".");
                            }

                            parts[0] = parts[0].replace(/^0+/, "");

                            if (parts[0] === "") {
                                parts[0] = "";
                            }

                            if (parts[1] !== undefined) {
                                parts[1] = parts[1].slice(0, 2);
                                v = parts[0] + "." + parts[1];
                            } else {
                                v = parts[0];
                            }

                            if (parts[0].length > 8) {
                                parts[0] = parts[0].slice(0, 8);
                                v = parts[0] + (parts[1] ? "." + parts[1] : "");
                            }

                            this.value = v;
                            this.setSelectionRange(start, start);
                        });
                    }
                },
                prepareFormOptions: {
                    targetProp: "building_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/building/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
                onShow: (me) => {
                    
                },
                onPrepareForm: (me, data) => {
                    const isReadOnly = me.dataOptions.id > 0;
                    console.log(4444, data, me.dataOptions.id);

                    me.setReadOnly(isReadOnly, ["total_floor"]);
                    const hasUnit = data.building_details.total_space > 0;
                    me.controls.prefix.disabled = hasUnit;
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;

                            vsapi.call(
                                [main_view.base_url, "/prm/building/save"].join(""),
                                op,
                                btn,
                                null
                            ).then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);

                                    cv_interact.success(
                                        me.dataOptions.id > 0
                                            ? "building_updated"
                                            : "building_created",
                                        {
                                            langSection: "message_box_default",
                                            title:{},
                                            translate: true
                                        }
                                    );
                                } else {
                                    cv_interact.error(
                                        res.error_message || "Failed"
                                    );
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
const CreateFloorDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                title: (me) => {
                    const title = me.dataOptions.id ? "Modify Floor" : "Create Floor";
                    if (title) {
                       return  `<h4 class="text-prm-custom text-start fw-bold">${LocaleManager.trans(title,'titles')}</h4>`;
                    }
                },
                createContent: () => `
                <div class="row justify-content-center">
                    <div class="col-6">
                        <div class="material-input outlined">
                            <input type="number" name="floor_number" required class="data-input form-control" data-field="floor_number" placeholder=" " />
                            <label vslang="labels.Floor Number">Floor Number</label>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="material-input outlined">
                            <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                            <label vslang="labels.Floor Name">Floor Name</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="material-input outlined">
                            <textarea name="description" class="data-input form-control" data-field="description" placeholder=" "></textarea>
                            <label vslang="labels.Description">Description</label>
                        </div>
                    </div>
                </div>
            `,
                contentCreated: (me) => {},
                prepareFormOptions: {
                    targetProp: "floor_details",
                    api: {
                        endpoint:
                            main_view.base_url + "/prm/building/form-options",
                        params: (op) => ({
                            id: op.id,
                            building_id: op.building_id,
                        }),
                    },
                },
                onShow: (me) => {
                    
                },
                onPrepareForm: (me, data) => {
                    const details = data?.floor_details || {};
                    const floorNumber = me.divModal.querySelector(
                        '[data-field="floor_number"]',
                    );
                    const floorName = me.divModal.querySelector(
                        '[data-field="name"]',
                    );

                    if (
                        floorNumber &&
                        details.floor_number != null &&
                        details.floor_number !== ""
                    ) {
                        floorNumber.value = details.floor_number;
                    }
                    if (floorName && details.name) {
                        floorName.value = details.name;
                    }

                    /* Floor identity is fixed once defined; only description should be editable in New and Modify flows */
                    if (floorNumber && floorName) {
                        floorNumber.setAttribute("disabled", "disabled");
                        floorName.setAttribute("disabled", "disabled");
                    }
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                   {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.building_id = me.dataOptions.building_id;
                            op.id = me.dataOptions?.id || 0;

                            vsapi.call(
                                main_view.base_url + "/prm/building/add-floor",
                                op,
                                btn
                            ).then((res) => {
                                if (res.status_code === 200) {
                                    if (typeof me.dataOptions?.onClose === "function") {
                                        me.dataOptions.onClose(true, res.data);
                                    }
                                    me.hide(true, op);
                                    cv_interact.success(
                                        op.id > 0
                                            ? "floor_updated"
                                            : "floor_created",
                                        {
                                            langSection: "message_box_default",
                                            translate: true
                                        }
                                    );
                                } else {
                                    cv_interact.error(res.error_message);
                                }
                            });
                        },
                    }
                ],
            });

        dialog.show(op);
    };

    return self;
})();
