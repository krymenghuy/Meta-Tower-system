"use strict";

var WorkshiftComponent = new (function () {
    const mThis = this;
    this.title_prop = "Workshifts";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_workshiftComponent");
    this.self = this.jm[0];
    this.elSearch = this.self.querySelector("#_work_shift_search");
    this.btnAdd = this.self.querySelector("#_btnAddWorkShift");
    this.divFilter = this.self.querySelector("#_divFilter");
    this.work_shift_header = this.self.querySelector("#_work_shift_header");
    // this.cols = [
    //     {
    //         title: "No",
    //         className: "align-middle text-capitalize text-nowrap",
    //         data: (data, index, i) => {
    //             return index + 1;
    //         },
    //     },
    //     {
    //         title: "Name",
    //         className: "align-middle text-start",
    //         data: "name",
    //     },
    //     {
    //         className: "col_action align-middle",
    //         data: (data) => `
    //             <div class="d-flex justify-content-center align-items-center">
    //                 <div class="text-center gap-2 d-flex flex-wrap">
    //                     <a href="javascript:void(0)" class="${
    //                         data.action_id > 1
    //                             ? "d-none"
    //                             : "btn_work-shifts_action"
    //                     }" data-id="${data.id}" data-statusid="${
    //             data.status_id
    //         }" aria-haspopup="true" aria-expanded="false">
    //                         <img src="${
    //                             main_view.asset_url
    //                         }/images/icons/more_vert (3).svg" />
    //                     </a>
    //                 </div>
    //             </div>`,
    //     },
    // ];
    this.init = function () {
        if (mThis.initAlready) return;

        mThis.WorkshiftListView = new ListView("_work_shift_list", {
            fetchApi: `${mThis.base_url}/hr/work-shifts/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            // columns: mThis.cols,
            // tableClass: "table table--white header-uppercase",
            processResponse: (res) => {
                console.log(1234, res.data.data);

                return res.data;
            },
            renderItems: (data, list_container) => {
                mThis.renderWorkshift(list_container, data);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    cv_interact.success("Add work-shifts successfully");
                    mThis.WorkshiftListView.showPage();
                },
            };
            WorkShiftDialog.show(op);
        };
        const pr_tbl = mThis.WorkshiftListView.getListContainer();
        const sh_parent = pr_tbl;
        // sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

        mThis.initDropdownMenus(pr_tbl);
        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.WorkshiftListView) {
                mThis.WorkshiftListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("work-shifts is not defined");
            }
        }, 200);
    });

    this.setFilterPeriod = (p, name) => {
        return p;
    };
    this.renderWorkshift = (div, data) => {
        data = data ?? [];
        if (!AuthManager) {
            console.error(
                "Authentication Management does not seems to work properly. You may need to refresh page"
            );
            return;
        }

        AuthManager.init().then((user) => {
            mThis.beginRenderWorkShift();
        });
    };
    this.beginRenderWorkShift = (container, data) => {
        console.log(1223, container, 321, data);

        let html = "";
        html += mThis.renderHeader();
    };

    this.renderHeader = () => {
        let html = "";

        html = [
            `
            <div id="work_shift_type" class="col-12 p-3 border d-flex gap-2" >
            <div class="col-2 w-100 shift_header">Work Shift Type</div>
            <div class="shift_date col-1-5">Monday</div>
            <div class="shift_date col-1-5">Tuesday</div>
            <div class="shift_date col-1-5">Wednesday</div>
            <div class="shift_date col-1-5">Thusday</div>
            <div class="shift_date col-1-5">Friday</div>
            <div class="shift_date col-1-5">Saturday</div>
            <div class="shift_date col-1-5">Sunday</div>
        </div>
            `,
        ].join("");
        this.work_shift_header.innerHTML = html;
    };

    this.getDataFormFilter = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchWorkShift.querySelectorAll(".filter-field");
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
            actionButtonClass: "btn_work-shifts_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit WorkShift">Edit WorkShift</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_work-shifts",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete WorkShift">Delete WorkShift</span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_work-shifts",
                },
            ],
            onClick: (menulink, id, name) => {
                switch (name) {
                    case "edit_work-shifts": {
                        console.log(98787653, id);

                        mThis.editWorkShift(id, menulink);
                        break;
                    }
                    case "delete_work-shifts": {
                        mThis.deleteWorkShift(id, menulink);
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

    this.editWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkshiftListView.showPage();
            },
        };
        WorkShiftDialog.show(op);
    };
    this.deleteWorkShift = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.WorkshiftListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this WorkShift?",
            {
                title: "Delete this WorkShift?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/work-shifts/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "WorkShifts Delete Successfully"
                                );
                                mThis.WorkshiftListView.showPage();
                            }
                        });
                }
            }
        );
    };
    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/work-shifts/form-options`,
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
        mThis.WorkshiftListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
})();

const WorkShiftDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-md-12">
                                <label for="name" class="form-label" vslang="titles.Name"></label>
                                <span class="text-danger" >*</span>
                                <input type="text" class="form-control data-input" data-field="name">
                            </div>                                               
                         </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span class="text-work-shifts">Cancel</span>',
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
                                        "/hr/work-shifts/save",
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
                    me.saveWorkShift = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add WorkShift",
                    modifyTitle: "Edit WorkShift",
                    targetProp: "work-shiftss",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/work-shifts/form-options",
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
