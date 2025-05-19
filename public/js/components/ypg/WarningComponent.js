"use strict";

var WarningComponent = (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_warningComponent");
    mThis.self = mThis.jm[0];
    mThis.initAlready = false;
    mThis.title_prop = "Employee Warning";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddWarning");
    mThis.elSearch = mThis.self.querySelector("#_warning_search");
    mThis._searchWarning = mThis.self.querySelector("#_warning_component");
    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap",
            // data: (data, index, i) => {
            //     return index + 1;
            // },
        },
        {
            title: "Name",
            className: "align-middle text-start",
            data: (data) => `
                <div style="display: flex; align-items: center;">
                    <img class="image-student-tbl" src="${ data.image_url || main_view.asset_url + "/images/default/default-staff.png" }" alt="" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;"/>
                    <div>
                        <span style="font-size: 14px; font-weight: bold;">${
                            data.name ?? ""
                        }</span><br/>

                    </div>
                </div>`,
        },
        {
            title: "Warning Date",
            className: "align-middle",
            data: (data) =>
                `<span class="text-danger">${data.warning_date}</span>`,
        },
        {
            title: "Type",
            className: "align-middle",
            data: (data) =>
                `<span class="text-primary-custom  px-2 text-center rounded-5">${data.warning_type}</span>`,
        },
        {
            title: "Reason",
            className: "align-middle",
            data: "reason",
        },
        {
            title: "Remarks",
            className: "align-middle",
            data: (data) =>
                `<span class="text-danger">${
                    data.remarks ?? "take time"
                }</span>`,
        },
        {
            title: "Create By",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${
                    data.update_user ?? ""
                }</span><br/>
                <span style="font-size: 10px; color: #2b3991;">${
                    data.updated_at ?? ""
                }</span>
            </div>`,
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
    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.WarningListView = new ListView("_warning_list", {
            fetchApi: `${mThis.base_url}/ypg/warning/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-3 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.WarningListView.showPage();
                },
            };
            if (!AuthManager.allowed(244)) return;
            WarningDialog.show(op);
        };
        const pr_tbl = mThis.WarningListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 235) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 235) + 'px';
        }


        mThis.initDropdownMenus(pr_tbl);

        mThis._searchWarning.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.WarningListView.showPage(mThis.getDataFormFilter());
        });
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WarningListView) {
                mThis.WarningListView.showPage(
                    mThis.getDataFormFilter()
                );
            } else {
                console.error("warning is not defined");
            }
        }, 200);
    });


    mThis.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    mThis.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchWarning.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };
    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_warning_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit Warning">Edit Warning</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_warning",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Warning">Delete Warning</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_warning",
                },
            ],
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_warning": {
                        mThis.editWarning(id, menulink);
                        break;
                    }
                    case "delete_warning": {
                        mThis.deleteWarning(id, menulink);
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

    mThis.editWarning = (id, menulink) => {

        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        if (!AuthManager.allowed(245)) return;
        WarningDialog.show(op);
    };
    mThis.deleteWarning = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        if (!AuthManager.allowed(246)) return;
        cv_interact.confirm(
            "Delete this warning?",
            {
                title: "Delete mThis Warning?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/ypg/warning/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Warnings delete successfully"
                                );
                                mThis.WarningListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/ypg/warning/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
            });
    };

    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.WarningListView.showPage();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();

const WarningDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-md-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class=" data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="warning_type" class="form-label">Warning Type</label>
                                <select class="form-control data-input" data-field="warning_type" id="warning_type">
                                    <option value="" disabled selected>Select Warning Type</option>
                                    <option value="First Warning">First Warning</option>
                                    <option value="Second Warning">Second Warning</option>
                                    <option value="Last Warning">Last Warning</option>
                                </select>
                            </div>

                            <div class="form-group col-md-6">
                                <label for="warning_date" class="form-label" vslang="titles.Warning Date"></label>
                                <span class="text-danger" >*</span>
                                <input name="warning_date" class="form-control form_input data-input" data-field="warning_date">
                            </div>

                            <div class="form-group col-md-12">
                                <label for="reason" class="form-label">reason</label>
                                <input class="form-control data-input" data-field="reason" id="reason"></input>
                            </div>

                             <div class="form-group col-md-12">
                                <label for="remarks" class="form-label">Remarks</label>
                                <textarea class="form-control data-input" data-field="remarks" id="remarks"></textarea>
                            </div>

                         </div>`,
                    ].join("");
                },
                configSelect: [
                    {
                        name: "employee",
                        data: "employees",
                        textField: (me, d) => {
                            return `<div class="d-flex gap-2"><img class="img_select" style="object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column" style="color:#2b3991;font-size:11px;"><span class=""> ${d.name} </span> <span> ${d.position} </span> </div></div>`;
                        },

                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {

                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/ypg/warning/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveWarning = (p) => {
                        alert("Data saved.");
                    };
                    DateTimePicker.init(me.controls.warning_date);
                },
                prepareFormOptions: {
                    createTitle: "Add Warning",
                    modifyTitle: "Edit Warning",
                    targetProp: "warnings",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/ypg/warning/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    // onResponse: (me, res) => {
                    //     console.log('result from api "/form-options": ', res);
                    // },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
