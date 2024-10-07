"use strict";

var JobsLevelComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_jobsLevelComponent");
    this.self = this.jm[0];
    this.btnAddJobLevel = this.self.querySelector("#_btnAddJobLevel");
    this.elSearch = this.self.querySelector("#_job_level_search");
    this.title_prop = "Job Level";

    // Action menu (view, edit, delete) functionality
    this.setupActions = function () {
        $("#_job_level_list").on("click", ".actions", function (e) {
            e.stopPropagation(); // Prevent click event from bubbling up

            let actionMenu = $(this).siblings(".action-menu");

            // Remove any open action menu, except for the current one
            if (actionMenu.length) {
                actionMenu.remove();
            } else {
                $(".action-menu").remove();

                let newActionMenu = `
                <div class="action-menu">
                    <button class="btn-edit">Edit</button>
                    <button class="btn-delete">Delete</button>
                </div>
            `;

                // Append the action menu near the clicked icon
                $(this).closest("td").append(newActionMenu);

                // Action menu click handlers
                $(".btn-view").on("click", function () {
                    let row = $(this).closest("tr");
                    let jobTitle = row.find("td:nth-child(2)").text();
                    let level = row
                        .find("td:nth-child(3)")
                        .text()
                        .toLowerCase();
                    alert("Job Title: " + jobTitle + "\n" + "Level: " + level);
                });

                $(".btn-edit").on("click", function () {
                    let row = $(this).closest("tr");
                    let jobTitle = row.find("td:nth-child(2)").text();
                    let newJobTitle = prompt("Edit Job Title", jobTitle);
                    if (newJobTitle) {
                        row.find("td:nth-child(2)").text(newJobTitle);
                    }
                });

                $(".btn-delete").on("click", function () {
                    if (confirm("Are you sure you want to delete this job?")) {
                        $(this).closest("tr").remove();
                    }
                });
            }
        });

        // Close the action menu if clicking outside
        $(document).on("click", function (e) {
            if (!$(e.target).closest(".actions").length) {
                $(".action-menu").remove();
            }
        });
    };

    // Define table columns
    this.cols = [
        {
            title: "#",
            className: "align-middle",
            data: "id",
        },
        {
            title: "Job Title",
            className: "align-middle",
            data: "Job_Title",
        },
        {
            title: "Level",
            className: "align-middle",
            data: "Level",
        },
        {
            title: "Rating",
            className: "align-middle",
            data: "Ratting",
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
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="text-center gap-2 d-flex flex-wrap">
                        <a href="javascript:void(0)" class="${
                            data.action_id > 1
                                ? "d-none"
                                : "btn_jobLevel_action"
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

    // Modal handling for adding a job
    this.setupModal = function () {
        const modal = $("#addJobModal");
        const btnAdd = $("#btnAdd");
        const spanClose = $(".close");

        // Show the modal when 'Add' button is clicked
        btnAdd.on("click", function () {
            modal.show();
        });

        // Close the modal when the close button is clicked
        spanClose.on("click", function () {
            modal.hide();
        });

        // Close the modal when clicking outside the modal content
        $(window).on("click", function (e) {
            if (e.target === modal[0]) {
                modal.hide();
            }
        });

        // Handle adding a new job to the table
        $("#addJobForm").on("click", function (e) {
            e.preventDefault(); // Prevent form submission
            const jobTitle = $("#Job_Title").val();
            const jobLevel = $("#Level").val();
            const jobRating = $("#Ratting").val();

            // Ensure all fields are filled
            if (!jobTitle || !jobLevel || !jobRating) {
                alert("Please fill out all fields.");
                return;
            }

            // Create a new row
            const newRow = `
                <tr>
                    <td>${jobTitle}</td>
                    <td>${jobLevel}</td>
                    <td>${
                        "★".repeat(jobRating) + "☆".repeat(5 - jobRating)
                    }</td>
                    <td><i class="fa fa-ellipsis-v actions"></i></td>
                </tr>
            `;

            // Append the new row to the table
            $("#_job_level_list tbody").append(newRow);

            // Clear the form and hide the modal
            $("#addJobForm")[0].reset();
            modal.hide();
        });
    };

    console.log(document.getElementById("btnAdd"));

    this.init = function () {
        mThis.setupModal();
        mThis.setupActions();

        if (mThis.initAlready) return;
        mThis.JobLevelListView = new ListView("_job_level_list", {
            fetchApi: `${mThis.base_url}/hr/job_level/list-paginate`,
            perPage: 5,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id; // recode data
            },
            renderComplete: () => {
                mThis.initDropdownMenus(mThis.JobLevelListView.getTable());
            },
        });

        // Apply style to the table
        $(".table--blue").css("width", "97%");
        $(".table--blue").css("margin", "20px");

        mThis.btnAddJobLevel.onclick = () => {
            let op = {
                id: null,
                onClose: (p) => {
                    mThis.JobLevelListView.showPage(mThis.getFilterData());
                },
            };
            JobLevelDialog.show(op);
        };
        mThis.elSearch.addEventListener("keyup", (e) => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                if (mThis.JobLevelListView) {
                    mThis.JobLevelListView.showPage(mThis.getDataFormFilter());
                } else {
                    console.error("JobLevelListView is not defined");
                }
            }, 200);
        });

        this.getDataFormFilter = () => {
            let p = {};
            p.search_value = mThis.elSearch.value;
            return p;
        };

        mThis.initAlready = true;
    };
    this.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_jobLevel_action",
            cssClass: "bg-white shadow",
            //menuItemClass:"",
            menus: [
                {
                    html: '<span class="ps-2  " vslang="titles.Edit Job Level">Edit Job Level</span>',
                    icon: `<i class="fa-regular fa-exchange fs-5"></i>`,

                    cssClass: "border-bottom pb-2",
                    name: "edit_jobLevel",
                },
                {
                    html: '<span class="ps-2  " vslang="titles.Delete Job Level">Delete Job Level</span>',
                    icon: `<i class="fa-regular fa-edit fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_jobLevel",
                },
            ],
            // adjustPosition:{
            //         top:-90
            // },
            //onShow:(instance, menuContainer)=>{
            //     console.log('open: ', instance.getMenus());
            // },
            // onClose:(instance, menus)=>{
            // },
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "edit_jobLevel": {
                       
                        mThis.editJobLevel(id, menuLink);
                        break;
                    }
                    case "delete_jobLevel": {
                        mThis.deleteJobLevel(id, menuLink);
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

    this.getFilterData = () => {
        return {};
    };

    // Handling edit functionality
    this.editJobLevel = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {                
                mThis.JobLevelListView.showPage();
            },
        };
        JobLevelDialog.show(op);
    };
    
    this.deleteJobLevel = (id, menuLink) => {
        let op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.JobLevelListView.showPage();
            },
        };
        cv_interact.confirm(
            "Do you want to delete this Job Level?",
            {
                title: "Delete Job Level",
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
                                cv_interact.success("Deleted Successfully");
                                mThis.JobLevelListView.showPage();
                            }
                        });
                }
            }
        );
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
    this.saveJobLevel = function () {
        return new Promise((resolve, reject) => {
            // Get form values
            let Job_Title = document.getElementById("Job_Title").value;
            let Level = document.getElementById("Level").value;
            let Ratting = document.getElementById("Ratting").value;

            // Validate the inputs
            if (!Job_Title || !Level || !Ratting) {
                return cv_interact.error("Please fill all required fields.");
            }

            let jobLevelData = {
                Job_Title: Job_Title,
                Level: Level,
                Ratting: Ratting,
            };

            // API call to save the job_level to the database
            vsapi
                .call(`${mThis.base_url}/hr/job_level/save`, jobLevelData)
                .then((response) => {
                    if (response.status_code === 200) {
                        cv_interact.success(
                            "New job level saved successfully."
                        );
                        resolve();
                    } else {
                        cv_interact.error(response.error_message);
                        reject(response.error_message);
                    }
                })
                .catch((error) => {
                    console.error("API error:", error);
                    cv_interact.error(
                        "Failed to save job level. Please try again."
                    );
                    reject(error);
                });
        });
    };
})();

// Initialize the component
const JobLevelDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog =
            dialog ||
            new GeneralDialog({
                title: "Add Job Level",
                createContent: () => {
                    return [
                        `<form id="jobLevelForm">
                            <div class="mb-3">
                                <label for="Job_Title" class="form-label">Job Title</label>
                                <input type="text" class="form-control data-input" data-field="id" id="Job_Title" placeholder="job title" required>
                            </div>
                            <div class="mb-3">
                                <label for="Level" class="form-label">Job Level</label>
                                <input type="text" class="form-control" id="Level" placeholder="job level">
                            </div>
                            <div class="mb-3">
                                <label for="Ratting" class="form-label">Rating</label>
                                <select class="form-select" id="Ratting" aria-label="rating" required>
                                    <option value="" disabled selected>Rating</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </div>
                        </form>`,
                    ].join("");
                },
                buttons: [
                    {
                        name: "cancel",
                        label: "Cancel",
                        click: (me, btn, divModal) => {
                            me.hide(true);
                        },
                    },
                    {
                        name: "save",
                        label: "Save",
                        click: (me, btn, divModal) => {
                            // Validate form before saving
                            const jobLevelForm =
                                document.getElementById("jobLevelForm");
                            if (!jobLevelForm.checkValidity()) {
                                jobLevelForm.reportValidity();
                                return;
                            }

                            // Call JobLevel function to save data to the database
                            JobsLevelComponent.saveJobLevel();

                            // Hide dialog after saving
                            me.hide(true);
                        },
                    },
                ],
                contentCreated: (me, divModal) => {
                    me.saveWarning = (p) => {
                        alert("Data saved.");
                    };
                },
                prepareFormOptions: {
                    createTitle: "Add Job Level",
                    modifyTitle: "Edit Job Level",
                    targetProp: "job_level",
                    api: {
                        endpoint:
                            main_view.base_url + "/hr/job_Level/form-options",
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                    onResponse: (res) => {
                        console.log(2355, res);
                    },
                },
            });

        dialog.show(op);
    };
    return self;
})();
