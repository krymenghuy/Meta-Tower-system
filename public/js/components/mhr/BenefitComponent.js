"use strict";

var BenefitComponent =  (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_benefit_component");
    mThis.title_prop = "benefit_list";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddBenefit");
    mThis.divFilter = mThis.self.querySelector("#_divFilter");
    mThis.elSearch = mThis.self.querySelector("#_benefit_search");
    mThis.elBenefitType = mThis.self.querySelector("#el_benefit_type");

    mThis.cols = [
        {
            transTitle: "titles.No",
            className: "align-middle",
            data: (data, index) =>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991; width: 30px; height: 30px;">
                    <span>${index + 1}</span>
                </div>`,
        },
        {
            transTitle: "titles.Name",
            className: 'align-middle text-nowrap',
            data: (data, index, tr) => {
                return `
                    <div class="text-primary-custom" style="width:180px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.name ?? "_"}</span>
                    </div>
                `;
             }
        },
        {
            transTitle: "titles.Type",
            className: 'type text-nowrap',
            data: function (data, index, tr) {
                let cls_class = "text-info";
                if (data.type_id == 1) {
                    cls_class = 'badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis';
                } else if (data.type_id == 2) {
                    cls_class = 'badge text-danger-emphasis bg-danger-emphasis border border-danger-emphasis';
                }

                return `<div class="text-primary-custom" style="width:80px;">
                            <span class="${cls_class} text-capitalize d-inline-block text-center" style="min-width:70px">
                                ${data.type_id == 1 ? 'Remuneration' : 'Fringe Benefit'}
                            </span>
                        </div>`;
            }
        },
        {
            transTitle: "titles.Last Updated",
            className: 'align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom">${data.update_user ?? '_'}</span>
                <span class="text-muted small">${data.updated_at ?? '_'}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_benefit_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        },
        
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BenefitListView = new ListView("_benefit_list", {
            fetchApi: `${main_view.base_url}/mhr/benefit/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            let op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BenefitListView.showPage(mThis.getFilterData());
                },
            };
            if (!AuthManager.allowed(398,false)) return;
            BenefitDialog.show(op);
        };
        mThis.pr_tbl = mThis.BenefitListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.BenefitListView.showPage(mThis.getFilterData());
        });
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BenefitListView.showPage(mThis.getFilterData());
            }, 200);
        });
        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };
     mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_benefit_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular text-warning fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_benefit"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_benefit"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_benefit": {
                        mThis.editBenefit(id, menuLink);
                        break;
                    }
                    case "delete_benefit": {
                        mThis.deleteBenefit(id, menuLink);
                        break;
                    }
                    default: {
                        break;
                    }
                }
            }
        };
        new VSDropdownMenu(menuOptopns);
    };
 
    

    mThis.editBenefit = (id, btn) => {
        if (!AuthManager.allowed(399,false)) return;
        BenefitDialog.show({ id, btn, onClose: () => mThis.BenefitListView.showPage(mThis.getFilterData()),});
    };

    mThis.deleteBenefit = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BenefitListView.showPage(mThis.getFilterData());
            },
        };
        if (!AuthManager.allowed(400,false)) return;
        cv_interact.confirm(
            "confirm_delete",
            {
                title: "Delete",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call( `${main_view.base_url}/mhr/benefit/delete`, op, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success("delete_success_benefit");
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

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch.value,
            type_id: mThis.elBenefitType.value,

        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;

        });
        
        return p;
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/mhr/benefit/form-options`,null,null,null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elBenefitType,d.benefit_types,"id","name","",LocaleManager.trans("All Types", "titles"),"");
                if (typeof onFinish === "function") onFinish();
            });
    };
    mThis.show =  (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(()=>{
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BenefitListView.showPage(mThis.getFilterData());

        });
       
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
                cssClass: "modal-md vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name" required class="data-input form-control" data-field="name" placeholder=" " />
                                    <label vslang="labels.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text" name="name_kh" required class="data-input form-control" data-field="name_kh" placeholder=" " />
                                    <label vslang="labels.Name Kh"></label>
                                </div>
                            </div>
                            <div class="col-12">
                                <select data-style="material" name="type_id" class="data-input form-control" data-field="type_id" placeholder="${LocaleManager.trans('Type', 'labels')}">
                                    <option value="1" >Remuneration</option>
                                    <option value="2">Fringe Benefit</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea name="description" class="form-control data-input form_input" placeholder=" " data-field="description"></textarea>
                                    <label vslang="labels.Description"></label>
                                </div>
                            </div> 
                        </div>`,
                    ].join("");
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn-vs-cancel",
                        click: (me, btn) => {
                            //Close with Cancel button
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Save"></span>',
                        cssClass: "btn-vs-save",
                        click: (me, btn) => {
                            const p = me.getData();

                            p.id = me.dataOptions.id; //get "id" from op
                            vsapi.call([main_view.base_url,"/mhr/benefit/save"].join(""),p,{loader:false,agent:btn})
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, p);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success("update_success_benefit");
                                        }
                                        else{
                                        cv_interact.success("create_success_benefit");
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Benefit",
                    modifyTitle: "vslang:titles.Modify Benefit",
                    targetProp: "benefits",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/benefit/form-options",
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
                },
            });

        dialog.show(op);
    };

    return self;
})();
