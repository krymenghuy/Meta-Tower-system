"use strict";

var BenefitComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_benefit_component");
    mThis.self = mThis.jm[0];
    mThis.title_prop = "Benefit";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_benefit_search");
    mThis.elBenefitType = mThis.self.querySelector("#el_benefit_type");

    mThis.cols = [
        {
            title: "No",
            className: "align-middle text-capitalize text-nowrap ",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Benefit",
            className: "align-middle text-capitalize text-nowrap",
            data: "name",
        },
        {
            title: "Type",
            className: 'type text-nowrap align-middle w-15',
            data: function (data, index, tr) {
                let cls_class = "text-white text-center border rounded-5";
                let bg_color = '';

                if (data.type_id === 1) {
                    cls_class = 'text-white text-center border border-success rounded-5 p-1';
                    bg_color = '#28a745';
                } else if (data.type_id === 2) {
                    cls_class = 'text-white text-center border border-warning rounded-5 p-1';
                    bg_color = '#4CC9FE';
                }

                return `<div><a class="d-block" data-type_id="${data.type_id}" data-id="${data.id}" href="javascript:void(0)">
                            <span style="display:block;width:auto; background: ${bg_color}" class="p-1 ${cls_class}">
                                ${data.type_id == 1 ? 'Remuneration' : 'Fringe'}
                            </span>
                        </a></div>`;
            }
        },
        {
            title: "Last Updated",
            className: "align-middle justify-content-center text-capitalize text-nowrap ",
            data: "update_date",
        },
        {
            title: "Updated By",
            className: "align-middle text-capitalize text-nowrap ",
            data: "update_user",
        },
        {
            title: "",
            className: "col_action align-middle",
            data: (data) => {
                return `
                <div class="d-flex justify-content-start align-items-middle">
                    <div class="text-middle gap-2 d-flex flex-wrap">
                        <button class="btn rounded-3 p-1 btn-primary-custom btn_edit_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 fa-pen-to-square"></i>
                        </button>
                        <button class="btn rounded-3 p-1 btn-warning btn_delete_benefit" data-id="${data.id}">
                            <i class="fa-regular fs-6 ml-2 text-white fa-trash-can"></i>
                        </button>
                    </div>
                </div>`;
            },
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BenefitListView = new ListView("_benefit_list", {
            fetchApi: `${main_view.base_url}/hr/benefit/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.divFilter.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.BenefitListView.showPage(mThis.getDataFormFilter());
        });
        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BenefitListView.showPage(mThis.getDataFormFilter());
                },
            };
            BenefitDialog.show(op);
        };
        const pr_tbl = mThis.BenefitListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = (window.innerHeight - 220) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 220) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BenefitListView.showPage(mThis.getDataFormFilter());
        });
        mThis.setActionListeners();

        mThis.initAlready = true;
    };
    mThis.elSearch.addEventListener("keyup", (e) => {
        clearTimeout(mThis.search_timeout);
        mThis.search_timeout = setTimeout(() => {
            if (mThis.BenefitListView) {
                mThis.BenefitListView.showPage(mThis.getDataFormFilter());
            } else {
                console.error("Benefit is not defined");
            }
        }, 200);
    });
    mThis.setActionListeners = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn_delete_benefit");
            if (btn) {
                mThis.deleteBenefit(btn.dataset.id, btn);
            }

            btn = VSUtil.closestLimited(e.target, ".btn_edit_benefit");
            if (btn) {
                mThis.editBenefit(btn.dataset.id, btn);
            }
        });
    };

    mThis.editBenefit = (id, btn) => {
        BenefitDialog.show({ id, btn, onClose: () => mThis.BenefitListView.showPage(mThis.getDataFormFilter()),});
    };

    mThis.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage(mThis.getFilterData());
            },
        };
        cv_interact.confirm(
            "Delete this Benefit ?",
            {
                title: "Delete Benefit",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call( `${main_view.base_url}/hr/benefit/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("Deleted successfully");
                                mThis.BenefitListView.showPage();
                            }
                            else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            }
        );
    };

    mThis.getDataFormFilter = () => {
        let filters = { search_value: mThis.elSearch.value};
        console.log(39292,mThis.elSearch);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            filters[el.dataset.field] = el.value;
        });
        return filters;
    };
    mThis.prepareFormOptions = () => {
        vsapi
            .call(`${main_view.base_url}/hr/benefit/form-options`,null,null,null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefitType,d.benefit_types,"id","name",true,"All Types",null);
            });
    };
    mThis.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.BenefitListView.showPage();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();

const BenefitDialog = (() => {
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
                            <div class="form-group col-6">
                                <label for="name" class="form-label" vslang="titles.Benefit Name"></label>
                                <input name="name" class="form-control data-input" data-field="name" />
                            </div>
                            <div class="form-group col-6">
                                <label for="type_id" class="form-label" vslang="titles.Type"></label>
                                <select class="modal-select data-input" name="type_id" data-field="type_id">
                                    <option value="">(Select Type)</option>
                                    <option value="1">Remuneration</option>
                                    <option value="2">Fringe</option>
                                </select>
                            </div>
                        </div>`,
                    ].join("");
                },

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
                                        "/hr/benefit/save",
                                    ].join(""),
                                    p,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("Updated benefit successfully");
                                        }
                                        else{
                                        cv_interact.success("Added benefit successfully");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "Create Benefit",
                    modifyTitle: "Edit Benefit",
                    targetProp: "benefits",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/hr/benefit/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    //    onResponse: (me, res)=>{
                    //      console.log('result from api "/form-options": ', res);
                    //    }
                },

                onPrepareForm: (me, data) => {
                    LocaleManager.translateZone(me.divModal);
                },
            });

        dialog.show(op);
    };

    return self;
})();
