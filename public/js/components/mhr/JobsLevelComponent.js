"use strict";
var JobsLevelComponent = new (function () {
    const mThis = {};
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_jobsLevelComponent");
    
    mThis.initAlready = false;
    mThis.title_prop = "Job Levels";
    mThis.btnAdd = mThis.self.querySelector("#_btnAddJobLevel");
    mThis.elSearch = mThis.self.querySelector("#_job_level_search");
    mThis.elCard = mThis.self.querySelector(".top_level_card");
    mThis.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap",
            // data: (data, index, i) => {
            //     return index + 1;
            // },
        },

        {
            title: "Ranking",
            className: "align-middle",
            data: (data)=>
                `<div class="rounded-circle text-center p-1 text-white" style="background-color: #2b3991;width:30px; height:30px;"><span class="">${data.rank}</span></div>`,

        },
        {
            title: "Job Level",
            className: "align-middle ",
            data: (data)=>
                `<span class="text-primary-custom">${data.name ?? 'HD'}</span>`,
        },

        {
            title: "Description",
            className: "align-middle",
            data: (data)=>
                `<div  class="text-remark text-muted" >${data.description}</div>`,
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 12px; color: #2b3991;">${data.update_date ?? ""}</span>
            </div>`,
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex align-items-center justify-content-center gap-3">
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-job-level-modify">
                            <i class="fa-solid fa-pencil text-warning fs-6"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-job-level-delete">
                            <i class="fa-solid fa-xmark text-danger fs-6"></i>
                        </a>
                    </div>
                `;
            },
        },
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



    mThis.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    mThis.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        return p;
    };
    mThis.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-job-level-modify");
            if (btn) {
                mThis.editJobLevel(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-job-level-delete");
            if (btn) {
                mThis.deleteJobLevel(btn.dataset.id, btn);
            }
        });
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
                                    "Job level delete successfully"
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
                cssClass: "modal-md",
                backdrop: "static", //User click outside form, do not close form
                keyboard: true, //prevent user from using ESC key
                createContent: () => {
                    return [
                        `<div class="row">
                            <div class="form-group col-md-6">
                                <label for="name" class="form-label">Name</label>
                                <span class="text-danger">*</span>
                                <input type="text" class="form-control data-input" data-field="name" id="name" required>
                            </div>
                             <div class="form-group col-md-6">
                                <label for="rank" class="form-label">Rank</label>
                                <span class="text-danger">*<small>(1-100)</small></span>
                                <input type="number" class="form-control data-input" data-field="rank" id="job_ranking" rows="2" placeholder="" required>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="description" class="form-label">Description</label>
                                <textarea type="text" class="form-control data-input" data-field="description" id="description" placeholder="job description"></textarea>
                            </div>



                         </div>`,
                    ].join("");
                },
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
                    createTitle: "Add Job Level",
                    modifyTitle: "Edit Job Level",
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
