"use strict";
var ItemsComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Purchase Items";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_item_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnItem");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_item");
    mThis.elFilter_Category = mThis.self.querySelector("#_item_category_id");
    mThis.elSearch = mThis.self.querySelector("#_search_item");

    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize",
        },
        {
            transTitle: "titles.Code",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom">${data.code ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom text-capitalize">${data.name ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Category",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom">${data.category_name ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-prm-custom text-capitalize">${data.unit ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options ${data.action_id > 1 ? "d-none" : "btn_leave_action"}" data-id="${data.id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ItemListView = new ListView("_item_list", {
            fetchApi: `${main_view.base_url}/prm/item/list-paginate`,
            perPage: 10,
            // rememberCurrentPage: false,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.status_id;
                tr.classList.add("item");
                tr.setAttribute("id", ["item_id", data.id].join(""));
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.ItemListView.showPage(mThis.getFilterData());
                },
            };
            // if (!AuthManager.allowed(240)) return;
            CreateItemsDialog.show(op);
        };

        mThis.pr_tbl = mThis.ItemListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 170 + "px";
        };
        mThis.tblItem = mThis.ItemListView.getTable();
        mThis.initDropdownMenus(mThis.tblItem);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.ItemListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ItemListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            item_category_id: mThis.elFilter_Category.value,
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
                    name: "edit_item",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_item",
                },
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_item": {
                        mThis.editItem(id, menuLink);
                        break;
                    }
                    case "delete_item": {
                        mThis.deleteItem(id, menuLink);
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

    mThis.editItem = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.ItemListView.showPage(mThis.getFilterData());
            },
        };

        CreateItemsDialog.show(op);
    };
    mThis.deleteItem = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.ItemListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Item??",
            {
                transTitle: "Delete Item",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/item/delete`,
                            op,
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Item deleted successfully",
                                );
                                mThis.ItemListView.showPage(
                                    mThis.getFilterData(),
                                );
                            }
                        });
                } else {
                    cv_interact.error(res.error_message);
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/item/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};

                VSUtil.setComboItems(
                    mThis.elFilter_Category,
                    d.item_categories,
                    "id",
                    "name",
                    "",
                    "All Categories",
                    "",
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ItemListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const CreateItemsDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3 justify-content-center">
                           <div class="col-12">
                                <div class="vs-material-field">
                                    <input type="text" name="name" class="data-input form-control" data-field="name" placeholder=" " />
                                    <label>Name</label>
                                </div>
                            </div>
                            <div class="col-8">
                                <select  data-style="material" name="category_id" class="data-input form-control" data-field="category_id" placeholder="Category">
                                </select>
                           </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <select name="unit" data-style="material" class="data-input form-control" data-field="unit" placeholder="Unit">
                                        <option value="">Select Unit</option>
                                        <option value="pcs">pcs</option>
                                        <option value="box">box</option>
                                        <option value="set">set</option>
                                        <option value="liter">liter</option>
                                        <option value="kg">kg</option>
                                        <option value="meter">meter</option>
                                    </select>

                                </div>
                            </div>




                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {},
                configSelect: [
                    {
                        name: "category_id",
                        data: "item_categories",
                        textField: "name",
                        valueField: "id",
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Create Item",
                    modifyTitle: "Modify Item",
                    targetProp: "item_details",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/prm/item/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                onPrepareForm: (me, data) => {
                    console.log(123, data);

                    me.controls.unit.value = data.item_details.unit ?? "";
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
                            vsapi
                                .call(
                                    [main_view.base_url, "/prm/item/save"].join(
                                        "",
                                    ),
                                    op,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success(
                                                "Item has been updated successfully",
                                            );
                                        } else {
                                            cv_interact.success(
                                                "New item has been added successfully",
                                            );
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
