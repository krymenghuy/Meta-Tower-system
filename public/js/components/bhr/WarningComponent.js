"use strict";

var WarningComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_warningComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Warning";
    this.btnAddWarning = this.self.querySelector("#_btnAddWarning");
    this.elSearch = this.self.querySelector("#_warning_search");

    // Define the columns for the warning list view
    this.cols = [
        {
            title: "NO",
            className: "align-middle",
            data: "id",
        },
        {
            title: "Name",
            className: "align-middle text-start",
            data: (data) => `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${
                        data.image_url
                    }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.name ?? ""
                        } ${data.name_kh ?? ""}</span><br/>
                        <span style="font-size: 12px; color: gray;">${
                            data.email ?? ""
                        }</span>
                    </div>
                </div>`,
        },
        {
            title: "POSITION",
            className: "align-middle",
            data: "position",
        },
        {
            title: "ISSUES",
            className: "align-middle",
            data: "issues",
        },
        {
            title: "PROMISES",
            className: "align-middle",
            data: "promises",
        },
        {
            title: "WARNING",
            className: "align-middle",
            data: (data) => `Warning: ${data.warning}`,
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1 ? "d-none" : "btn_warning_action"
                        }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                            <img src="${
                                main_view.asset_url
                            }/images/icons/more_vert (3).svg" />
                        </a>
                    </div>
                </div>`,
        },
    ];

    // Initialize component
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.WarningListView = new ListView("_warning_list", {
            fetchApi: `${mThis.base_url}/hr/warning/list-paginate`,
            perPage: 6,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
            listContainerClass: null,
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id; // recode data
            },
            renderComplete: () => {
                mThis.initDropdownMenus(mThis.WarningListView.getTable());
            },
        });

        // Event binding for add warning button
        mThis.btnAddWarning.onclick = () => {
            let op = {
                id: null,
                onClose: (p) => {
                    mThis.WarningListView.showPage(mThis.getFilterData());
                },
            };
            WarningDialog.show(op);
        };
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.WarningListView) {
                    mThis.WarningListView.showPage(mThis.getDataFormFilter());
                } else {
                    console.error("WarningListView is not defined");
                }
            }, 200);
        });

        this.getDataFormFilter = () => {
            let p = {};
            p.search_value = mThis.elSearch.value;
            return p;
        };
        mThis.initAlready = true;
    };

    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit Warning">Edit Warning</span>',
                    icon: `<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "edit_warning",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Warning">Delete Warning</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_warning",
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
                    case "edit_warning": {
                        mThis.editWarning(id, menuLink);
                        break;
                    }
                    case "delete_warning": {
                        mThis.deleteWarning(id, menuLink);
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

    this.getFilterData = () => {
        return {};
    };

    this.editWarning = (id) => {
        let op = {
            id: id,
            onClose: (p) => {
                mThis.WarningListView.showPage(mThis.getFilterData());
            },
        };
        WarningDialog.show(op);
    };
    this.deleteWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        cv_interact.confirm(
            "Do you want to delete this Warning?",
            {
                title: "Delete Warning",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/warning/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted Successfully");
                                mThis.WarningListView.showPage();
                            }
                        });
                }
            }
        );
    };

    // Show component
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.WarningListView.showPage(mThis.getFilterData(), null, () => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(200);
        });
    };

    // Save warning function
    this.saveWarning = function () {
        return new Promise((resolve, reject) => {
            // Get form values
            let employeeId = document.getElementById("employeeId").value;
            let employeePosition =
                document.getElementById("employeePositions").value;
            let warningIssues = document.getElementById("warningIssues").value;
            let warningPromises =
                document.getElementById("warningPromises").value;
            let warningQuantity =
                document.getElementById("c").value;
            let subs_id = document.getElementById("subs_id").value;

            // Validate the inputs
            if (
                !employeeId ||
                !employeePosition ||
                !warningIssues ||
                !warningPromises ||
                !warningQuantity
            ) {
                return cv_interact.error("Please fill all required fields.");
            }

            let warningData = {
                emp_id: employeeId,
                position: employeePosition,
                issues: warningIssues,
                promises: warningPromises,
                warning: warningQuantity,
                subs_id: subs_id,
            };

            // API call to save the warning to the database
            vsapi
                .call(`${mThis.base_url}/hr/warning/save`, warningData)
                .then((response) => {
                    if (response.status_code === 200) {
                        cv_interact.success("New warning saved successfully.");
                        resolve();
                    } else {
                        cv_interact.error(response.error_message);
                        reject(response.error_message);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                    cv_interact.error(
                        "Failed to save warning. Please try again."
                    );
                    reject(error);
                });
        });
    };
})();

const WarningDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: "Add Warning",
                createContent: () => {
                    return [
                        `<form id="warningForm">
                            <div class="mb-3">
                                <label for="empId" class="form-label">Employee Id</label>
                                <input type="number" class="form-control data-input" data-field="id" id="employeeId" placeholder="Input Employee Id" required>
                            </div>
                            <div class="mb-3">
                                <label for="employeePosition" class="form-label">Position</label>
                                <input type="number" class="form-control" id="employeePositions" placeholder="">
                            </div>
                            <div class="mb-3">
                                <label for="warningIssues" class="form-label">Issues</label>
                                <textarea class="form-control data-input" data-field="issues" id="warningIssues" rows="2" placeholder="Input issues here" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="warningPromises" class="form-label">Promises</label>
                                <textarea class="form-control data-input" data-field="promises" id="warningPromises" rows="2" placeholder="Input promises here" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="c" class="form-label">Warning</label>
                                <select class="form-select" id="c" aria-label="Warning select" required>
                                    <option value="" disabled selected>Select Warning</option>
                                    <option value="1">Warning 1</option>
                                    <option value="2">Warning 2</option>
                                    <option value="3">Warning 3</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="subs_id" class="form-label">Subs ID</label>
                                <input type="number" class="form-control" id="subs_id" placeholder="Input Subs ID" required>
                            </div>
                        </form>`,
                    ].join("");
                },
                buttons: [
                    {
                        name: "cancel",
                        label: "Cancel",
                        click: (me, btn, divModal) => {
                            me.hide(true);
                        },
                    },
                    {
                        name: "save",
                        label: "Save",
                        click: (me, btn, divModal) => {
                            // Validate form before saving
                            const warningForm =
                                document.getElementById("warningForm");
                            if (!warningForm.checkValidity()) {
                                warningForm.reportValidity();
                                return;
                            }

                            // Call saveWarning function to save data to the database
                            WarningComponent.saveWarning();

                            // Hide dialog after saving
                            me.hide(true);
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveWarning = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add warning",
                    modifyTitle: "Edit warning",
                    targetProp: "warning",
                    api: {
                        endpoint:
                            main_view.base_url + "/hr/warning/form-options",
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (res) => {
                        console.log(2355, res);
                    },
                },
            });

        dialog.show(op);
    };
    return self;
})();
