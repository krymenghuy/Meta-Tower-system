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
            title: "No",
            className: "align-middle text-capitalize text-nowrap",
            data: (data, index, i) => {
                return index + 1;
            },
        },
        {
            title: "Job Level",
            className: "align-middle",
            data: "name",
        },
        {
            title: "Description",
            className: "align-middle",
            data: "description",
        },
        {
            title: "Ranking",
            className: "align-middle",
            data: "rank",
            render: function (data) {
                const maxStars = 5;
                const rating = Math.min(Math.max(parseInt(data), 1), maxStars); // Ensures the rating is between 1 and maxStars

                // Generate the star icons using Font Awesome
                let starIcons = "";
                for (let i = 0; i < maxStars; i++) {
                    if (i < rating) {
                        starIcons += '<i class="fa fa-star"></i>'; // Filled star
                    } else {
                        starIcons += '<i class="fa fa-star-o"></i>'; // Empty star
                    }
                }

                return starIcons;
            },
        },
        {
            title: "Action",
            className: "col_action align-middle",
            data: function (data, row, display) {
                return `
                    <div class="d-flex align-items-center gap-3">
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-job-level-modify">
                            <i class="fa-regular fa-pen-to-square text-warning fs-5"></i>
                        </a>
                        <a href="javascript:void(0)" data-id="${data.id}" data-name="${data.name}" class="btn-job-level-delete">
                            <i class="fa-solid fa-trash-can text-danger fs-5"></i>
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
            tableClass: "table table--white header-uppercase",
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
        // sh_parent.style.height = window.innerHeight - 225 + "px";
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
                            <div class="form-group col-12">
                                <label for="name" class="form-label">Name</label>
                                <input type="text" class="form-control data-input" data-field="name" id="name" placeholder="job name" required>
                            </div>
                            <div class="form-group col-12">
                                <label for="description" class="form-label">Description</label>
                                <input type="text" class="form-control data-input" data-field="description" id="description" placeholder="job description">
                            </div>
                            <div class="form-group  col-12 d.none">
                               <div id="info"></div>
                            </div>
                            <div class="form-group col-12">
                                <label for="rank" class="form-label">Ranking</label>
                                <input type="number" class="form-control data-input" data-field="rank" id="job_ranking" rows="2" placeholder="Input ranking here" required></input>                            
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
                            const jl = me.getData();

                            jl.id = me.dataOptions.id; //get "id" from op

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
