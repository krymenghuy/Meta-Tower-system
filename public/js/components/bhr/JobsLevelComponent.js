"use strict";

var JobsLevelComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_jobsLevelComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Job Level";
    this.btnAdd = this.self.querySelector("#_btnAddJobLevel");
    this.elSearch = this.self.querySelector("#_job_level_search");
    this.elCard = this.self.querySelector(".top_level_card");
    this._searchJobLevel = this.self.querySelector("#container_jobLevel");
    this.cols = [
        {
            title: "",
            className: "align-middle text-capitalize text-nowrap",
            // data: (data, index, i) => {
            //     return index + 1;
            // },
        },
      
        {
            title: "Job Level",
            className: "align-middle ",
            data: (data)=>
                `<span class="text-primary-custom">${data.name ?? 'HD'}</span>`,
        },
       
        {
            title: "Ranking",
            className: "align-middle",
            data: (data)=>
                `<span class="text-primary-custom">${data.rank}</span>`,
         
        },
        {
            title: "Last Updated",
            className: "align-middle text-capitalize text-nowrap text-left",
            data: (data) => `
            <div style="display: block; align-items: center;">
                <span style="font-size: 14px; font-weight: bold;">${data.update_user ?? ""}</span><br/>
                <span style="font-size: 12px; color: #2b3991;">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            title: "Description",
            className: "align-middle",
            data: (data)=>
                `<div  class="text-remark" >${data.description}</div>`,
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

    this.init = function () {
        if (mThis.initAlready) return;

        mThis.JobLevelListView = new ListView("_job_level_list", {
            fetchApi: `${mThis.base_url}/hr/job_level/list-paginate`,
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
            JobLevelDialog.show(op);
        };
        const pr_tbl = mThis.JobLevelListView.getListContainer();
        const sh_parent = pr_tbl;
        sh_parent.style.height = window.innerHeight - 225 + "px";
        sh_parent.classList.add("overflow-y-auto");
        sh_parent.classList.add("overflow-x-hidden");

       

        mThis.initDropdownMenus(pr_tbl);

        mThis._searchJobLevel.addEventListener("change", (e) => {
            e.preventDefault();
            mThis.JobLevelListView.showPage(mThis.getFilterData());
        });
        mThis.initAlready = true;
    };
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

   
    this.setFilterPeriod = (p, name, start_date, end_date) => {
        return p;
    };

    this.getFilterData = () => {
        let p = {};
        p.search_value = mThis.elSearch.value;
        let main_filters =
            mThis._searchJobLevel.querySelectorAll(".filter-field");
        main_filters.forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(222, p.search_value, main_filters);

        return p;
    };
    this.initDropdownMenus = () => {
        addEventListener("click", (e) => {
            let btn = VSUtil.closestLimited(e.target, ".btn-job-level-modify");
            if (btn) {
                mThis.editJobLevel(btn.dataset.id, btn);
            }
            btn = VSUtil.closestLimited(e.target, ".btn-job-level-delete");
            if (btn) {
                mThis.deleteJobLevel(btn.dataset.id, btn);
            }
            console.log(123, btn);
        });
    };
    this.editJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        JobLevelDialog.show(op);
    };
    this.deleteJobLevel = (id, menulink) => {
        let op = {
            id: id,
            btn: menulink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        cv_interact.confirm(
            "Delete this Job level?",
            {
                title: "Delete this Job level?",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/hr/job_level/delete`,
                            op,
                            false,
                            false,
                            false
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Job level Delete Successfully"
                                );
                                mThis.JobLevelListView.showPage();
                            }
                        });
                }
            }
        );
    };

    this.prepareFormOptions = () => {
        vsapi
            .call(
                `${main_view.base_url}/hr/job_level/form-options`,
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log(1111, this.elSortBy);
            });
    };
    // Show component
    this.show = function () {
        this.init();
        main_view.setTitle(mThis.title_prop);
        mThis.JobLevelListView.showPage(null, null, () => {
            $(mThis.self).siblings().hide();
            $(mThis.self).fadeIn(200);
        });
    };
    this.show = function () {
        mThis.init();
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions();
        mThis.JobLevelListView.showPage();
        $(mThis.self).siblings().hide();
        $(mThis.self).fadeIn(200);
    };
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
                                        "/hr/job_level/save",
                                    ].join(""),
                                    jl,
                                    btn,
                                    null
                                )
                                .then((res) => {
                                    if (res.status_code == 200) {
                                        me.hide(true, jl);
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
                            "/hr/job_level/form-options",
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
