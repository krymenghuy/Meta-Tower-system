"use strict";

var WarningComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_warningComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Warning";
    //render warning component
    this.cols = [
        {
            title: "NO",
            className: "align-middle",
            data: "id",
        },
        {
            title: "Name",
            className: "align-middle text-start",
            data: (data, index, tr) => {
                return `<div style="display: flex; align-items: center; margin-left:40px">
                            <img class="image-student-tbl" src="${
                                data.image_url
                            }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                            <div>
                                <span style="font-size: 14px; font-weight: bold;">${
                                    data.first_name ?? ""
                                } ${data.last_name ?? ""}</span>
                                <br/>
                                <span style="font-size: 12px; color: gray;">${
                                    data.email ?? ""
                                }</span>
                            </div>
                        </div>`;
            },
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
            data: "warning",
        },
        {
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                   <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center gap-2 d-flex flex-wrap">
                                <a href="javascript:void(0)" class="${
                                    data.action_id > 1
                                        ? "d-none"
                                        : "btn_warning_action"
                                }" data-id="${data.id}" data-statusid="${
                    data.status_id
                }" aria-haspopup="true" aria-expanded="false">
                                <img src="${
                                    main_view.asset_url
                                }/images/icons/more_vert (3).svg" />
                            </a>
                        </div>
                    </div>
                `;
            },
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
            onFetched: function (data) {
                console.log("Data fetched:", data);
            },
        });
        mThis.initAlready = true;

        // Event binding for add warning button
        document
            .querySelector(".btnAddWarning")
            .addEventListener("click", function () {
                let addWarningModal = new bootstrap.Modal(
                    document.getElementById("addWarningModal"),
                    {}
                );
                addWarningModal.show();
            });

        // Event binding for save warning button
        document
            .getElementById("saveWarningBtn")
            .addEventListener("click", mThis.saveWarning);
        document
            .getElementById("_warning_search")
            .addEventListener("input", mThis.searchWarning);
    };
    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Change Status">Change Status</span>',
                    icon: `<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "change_warning_status",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Modify warning">Modify warning</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_warning",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete warning">Delete warning</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_warning",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_warning_status": {
                        mThis.changeStatus(id, menuLink);
                        break;
                    }
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
    this.changeStatus = (id, lnk) => {
        let tr = lnk.closest("tr");
        let action_id = Validator.properCase(tr ? tr.dataset.action_id : "");
        let inputOptions = {
            title: "Set warning Status",
            dataLabel: "Warning status",
            valueMember: "action_id",
            textMember: "name",
            confirmButtonText: "Save",
            blankErrorMessage: "Status is not correct!",
            data: [
                {
                    action_id: "2",
                    name: "Approved",
                },
                {
                    action_id: "3",
                    name: "Reject",
                },
            ],
            defaultValue: action_id,
        };

        InputBox2.show(inputOptions, (d) => {
            if (d) {
                let p = {
                    id: id,
                    action_id: d.value,
                };
                console.log(123, p);

                vsapi
                    .call(`${mThis.base_url}/hr/warning/update-status`, p)
                    .then((res) => {
                        if (res.status_code === 200) {
                            // mThis.elFilter_warning_status.value = d.value;
                            InputBox2.close();
                            // mThis.elFilter_warning_status.dispatchEvent ( new Event('change'));
                            cv_interact.success(
                                "The warnign status has been updated"
                            );
                            // if(tr) tr.dataset.statuscode = d.value;
                            mThis.WarningListView.showPage(
                                mThis.getDataFormFilter()
                            );
                        } else cv_interact.error(res.error_message);
                    });
            }
        });
    };
    this.editWarning = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        WarningDailog.show(op);
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
            "Delete this warning?",
            {
                title: "Delete warning",
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
        mThis.WarningListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
        });
    };
    // Search warning
    this.searchWarning = function () {
        let searchTerm = document
            .querySelector("#_warning_search")
            .value.toLowerCase();
        let rows = document.querySelectorAll(".warning_item");
        rows.forEach((row) => {
            let employeeName = row
                .querySelector(".info_right > h6")
                .textContent.toLowerCase();
            let employeeEmail = row
                .querySelector(".info_right > .email")
                .textContent.toLowerCase();
            let employeePosition = row
                .querySelector(".position")
                .textContent.toLowerCase();
            let warningIssues = row
                .querySelector(".issues")
                .textContent.toLowerCase();
            let warningPromises = row
                .querySelector(".promises")
                .textContent.toLowerCase();
            let warningType = row
                .querySelector(".warning")
                .textContent.toLowerCase();

            if (
                employeeName.includes(searchTerm) ||
                employeeEmail.includes(searchTerm) ||
                employeePosition.includes(searchTerm) ||
                warningIssues.includes(searchTerm) ||
                warningPromises.includes(searchTerm) ||
                warningType.includes(searchTerm)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };
    // Save the new warning and add a row
    this.saveWarning = function () {
        // Get form values
        let employeeName = document.getElementById("employeeNames").value;
        let employeeEmail = document.getElementById("employeeEmails").value;
        let employeePosition =
            document.getElementById("employeePositions").value;
        let warningIssues = document.getElementById("warningIssues").value;
        let warningPromises = document.getElementById("warningPromises").value;
        let warningQuntity = document.getElementById("warningSelect").value;

        // Create a new warning row
        let warningBody = document.querySelector(".warning_body");
        let newRow = document.createElement("div");
        newRow.className = "warning_item";

        // Populate warning options dynamically from the existing select
        let warningOptions =
            document.getElementById("warningSelect").innerHTML;

        newRow.innerHTML = `
            <div class="warning_item">
            <div class="info">
                <div class="info_left">
                    <img src="assets/images/skills/maketing.png" alt="User">
                </div>
                <div class="info_right">
                    <h6>${employeeName}</h6>
                    <span class="email">${employeeEmail}</span>
                </div>
            </div>
            <div class="position">${employeePosition}</div>
            <div class="issues">${warningIssues}</div>
            <div class="promises">${warningPromises}</div>
            <div class="warning">
                <select class="form-select" id="warningSelect" aria-label="Warning select">
                    ${warningOptions}
                </select>
            </div>
            <div class="action">
                <i class="fa fa-ellipsis-v"></i>
            </div>
            </div>
        `;

        // Append the new row to the warning body
        warningBody.appendChild(newRow);

        // Hide the modal after adding
        let addWarningModal = bootstrap.Modal.getInstance(
            document.getElementById("addWarningModal")
        );
        addWarningModal.hide();

        // Clear the form fields after submission
        document.getElementById("warningForm").reset();

        console.log("New warning row added");
    };
})();
