"use strict";
var JobsLevelComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_jobsLevelComponent");
    
    mThis.initAlready = false;
    mThis.title_prop = "Job Levels";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddJobLevel");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_jobsLevelComponent");
    mThis.elSearch = mThis.self.querySelector("#_job_level_search");
    mThis.cols = [
        {
            transTitle: "",
            className: "align-middle",
        },

        {
            transTitle: "titles.Ranking",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991;width:30px; height:30px;"><span class="">${data.rank}</span></div>`,

        },
        {
            transTitle: "titles.Job Level",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<span class="text-primary-custom">${data.name ?? 'HD'}</span>`,
        },

        {
            transTitle: "titles.Description",
            className: "align-middle text-nowrap",
            data: (data)=>
                `<div  class="text-remark text-muted" >${data.description}</div>`,
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 12px; color: #2b3991;">${data.update_date ?? ""}</span>
            </div>`,
        },


        {
            className: "col_action align-middle",
            data: data => `
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-end gap-2 d-flex flex-wrap">
                    <a href="javascript:void(0)" class="${
                        data.action_id > 1 ? "d-none" : "btn_jobLevel_action"
                    }" data-id="${data.id}" data-statusid="${
                data.status_id
            }" aria-haspopup="true" aria-expanded="false">
                        <img src="${
                            main_view.asset_url
                        }/images/icons/more_vert (3).svg" />
                    </a>
                </div>
            </div>`
        }
    ];

    mThis.init = function () {
        if (mThis.initAlready) return;

        mThis.JobLevelListView = new ListView("_job_level_list", {
            fetchApi: `${mThis.base_url}/mhr/job_level/list-paginate`,
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
                    mThis.JobLevelListView.showPage();
                },
            };
            if (!AuthManager.allowed(204)) return;
            JobLevelDialog.show(op);
        };
        mThis.pr_tbl = mThis.JobLevelListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.height = (window.innerHeight - 170) + 'px';
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = (window.innerHeight - 170) + 'px';
        }
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.JobLevelListView) {
                    mThis.JobLevelListView.showPage(mThis.getFilterData());
                } else {
                    console.error("jobLevel is not defined");
                }
            }, 200);
        });

        mThis.initDropdownMenus(mThis.pr_tbl);

        mThis.initAlready = true;
    };

    mThis.initDropdownMenus = table => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_jobLevel_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2 " vslang="titles.Modify">Modify Job Level</span>',
                    icon: `<i class="fa-regular text-primary fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "edit_jobevel"
                },
                {
                    html:
                        '<span class="ps-2  " vslang="titles.Delete">Delete Job Level</span>',
                    icon: `<i class="fa-regular text-danger fa-trash-can fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_jobevel"
                }
            ],

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_jobevel": {
                        mThis.editJobLevel(id, menuLink);
                        break;
                    }
                    case "delete_jobevel": {
                        mThis.deleteJobLevel(id, menuLink);
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

    mThis.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        return p;
    };

    mThis.editJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        if (!AuthManager.allowed(205)) return;
        JobLevelDialog.show(op);
    };

    mThis.deleteJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        if (!AuthManager.allowed(206)) return;
        cv_interact.confirm(
            "Delete this job level?",
            {
                title: "Delete Job level",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/mhr/job_level/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Job level deleted successfully"
                                );
                                mThis.JobLevelListView.showPage();
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
                `${main_view.base_url}/mhr/job_level/form-options`,
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
        
        mThis.prepareFormOptions();
        mThis.JobLevelListView.showPage();
        main_view.setContentView(mThis.self, mThis.title_prop); 
    };
    return mThis;
})();

const JobLevelDialog = (() => {
    const self = {};
    let dialog = null;
    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static", 
                keyboard: true, 
                createContent: () => {
                    return [
                        `<div class="row g-3">
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="text"  name="name" class="form-control data-input" data-field="name" />
                                    <label vslang="titles.Name"></label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="vs-material-field">
                                    <input type="number"  name="rank" class="form-control data-input" data-field="rank" />
                                    <label vslang="titles.Rank"></label>
                                </div>  
                            </div>
                            <div class="col-12">
                                <div class="vs-material-field">
                                    <textarea type="text" class="form-control data-input" data-field="description" id="description" placeholder=""></textarea>
                                    <label vslang="titles.Description"></label>
                                </div>
                            </div>
                         </div>`,
                    ].join("");
                },
                buttons: [
                    {
                        label: '<span class="text-warning">Cancel</span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: "<span>Save</span>",
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const jl = me.getData();

                            jl.id = me.dataOptions.id;

                            vsapi
                                .call(
                                    [
                                        main_view.base_url,
                                        "/mhr/job_level/save",
                                    ].join(""),
                                    jl,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, jl);
                                        if(me.dataOptions.id > 0)
                                        {
                                            cv_interact.success('Updated job level successfully');
                                        }
                                        else
                                        {
                                            cv_interact.success('Added job level successfully');
                                        }
                                    } else cv_interact.error(res.error_message);
                                });
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveJobLevel = (jl) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "vslang:titles.Create Job Level",
                    modifyTitle: "vslang:titles.Modify Job Level",
                    targetProp: "job_levels",
                    api: {
                        endpoint: [
                            main_view.base_url,
                            "/mhr/job_level/form-options",
                        ].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
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