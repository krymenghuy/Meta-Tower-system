"use strict";

var WarningComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_warningComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Warning";
    this.btnAdd = this.self.querySelector("#_btnAddWarning");
    this.elSearch = this.self.querySelector("#_warning_search");
    this._searchWarning = this.self.querySelector("#_warning_component");
    this.btnSearch = mThis.self.querySelector("#_sdl_btnSearch");
    // Define the columns for the warning list view
    this.cols = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, i) => {
                return index + 1;
            },
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
                        }</span><br/>
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
            title: "Remarks",
            className: "align-middle",
            data: "remarks",
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
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.WarningListView = new ListView("_warning_list", {
            fetchApi: `${mThis.base_url}/hr/warning/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
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
            WarningDialog.show(op);
        };
        const pr_tbl = mThis.WarningListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

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

    mThis.btnSearch.onclick = (e) => {
        if (mThis.WarningListView) {
            mThis.WarningListView.showPage(mThis.getDataFormFilter());
        } else {
            console.error("warning  is not defined");
        }
    };
    this.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchWarning.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p.search_value, main_filters);

        return p;
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
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_warning": {
                        console.log(98787653,id);
                        
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

    this.editWarning = (id, menulink) => {
        
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        WarningDialog.show(op);
    };
    this.deleteWarning = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WarningListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Warning?",
            {
                title: "Delete this Warning?",
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
                                cv_interact.success(
                                    "Warnings Delete Successfully"
                                );
                                mThis.WarningListView.showPage();
                            }
                        });
                }
            }
        );
    };
    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/warning/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log(1111, this.elSortBy);
            });
    };

    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.WarningListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const WarningDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-12">
                                <label for="employee" class="form-label" vslang="titles.Employee"></label>
                                <select name="employee" class=" data-input"  data-field="emp_id"></select>
                            </div>
                            <div class="form-group col-12">
                                <label for="position" class="form-label">Position</label>
                                <input type="text" class="form-control data-input" data-field= "position" id="position" placeholder="Input position here"></input>
                            </div>
                            <div class="form-group  col-12 d.none">
                               <div id="info"></div>
                            </div>
                            <div class="form-group col-6">
                                <label for="warningPromises" class="form-label">Promises</label>
                                <input class="form-control data-input" data-field="promises" id="warningPromises" rows="2" placeholder="Input promises here" required></input>                            
                            </div>
                            <div class="form-group col-6">
                                <label for="warning" class="form-label">Warning</label>
                                <input class="form-control data-input" data-field="warning" id="warning" rows="2"></input>                            
                            </div>
                            <div class="form-group col-6">
                                <label for="warningIssues" class="form-label">Issues</label>
                                <textarea class="form-control data-input" data-field="issues" id="warningIssues" rows="2" placeholder="Input issues here" required></textarea>
                            </div>
                             <div class="form-group col-6">
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
                            return `<div class="d-flex gap-2"><img style="width:80px;height:50px margin-top:100px;margin-right:10px; object-fit:cover" src="${d.image_url}" /> <div class="d-flex flex-column"><span> ${d.name} </span> <span>${d.email}</span><span>${d.phone_number}</span><span> ${d.position} </span> </div></div>`;
                        },
                        // textField:"name",
                        valueField: "id",
                    },
                ],
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-default",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/hr/warning/save",
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
                },
                prepareFormOptions: {
                    createTitle: "Add Warning",
                    modifyTitle: "Edit Warning",
                    targetProp: "warnings",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/warning/form-options",
                        ].join(""),
                        params: (op) => {                           
                            return { id: op.id };
                        },
                    },
                    onResponse: (me, res) => {
                        console.log('result from api "/form-options": ', res);
                    },
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
