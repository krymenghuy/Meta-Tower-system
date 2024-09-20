"use strict";

var JobsLevelComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_jobsLevelComponent");
    this.self = this.jm[0];
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
                    <button class="btn-view">View</button>
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
                const rating = Math.min(Math.max(parseInt(data), 1), maxStars);
                return "★".repeat(rating) + "☆".repeat(maxStars - rating);
            },
        },
        {
            title: "",
            className: "align-middle",
            render: function () {
                return `<i class="fa fa-ellipsis-v actions"></i>`;
            },
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
            const jobTitle = $("#jobTitle").val();
            const jobLevel = $("#jobLevel").val();
            const jobRating = $("#jobRating").val();

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

    // Search functionality for Job Title
    this.searchJobTitle = function () {
        $("#searchJobLevel").on("input", function () {
            const searchQuery = $(this).val().toLowerCase();

            $("#_job_level_list tbody tr").each(function () {
                const jobTitle = $(this)
                    .find("td:nth-child(1)")
                    .text()
                    .toLowerCase();

                if (jobTitle.includes(searchQuery)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    };

    console.log(document.getElementById("btnAdd"));
    
    // Initialize all functions
    this.init = function () {
        // Initialize modal and add job functionality
        mThis.setupModal();
        mThis.searchJobTitle();
        mThis.setupActions();

        if (mThis.initAlready) return;

        // Initialize ListView (Assuming you have the ListView initialized correctly)
        mThis.JobLevelListView = new ListView("_job_level_list", {
            fetchApi: `${mThis.base_url}/hr/job_level/list-paginate`,
            perPage: 5,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--blue header-uppercase",
            listContainerClass: null,
            onFetched: function (data) {
                console.log("Data fetched:", data);
            },
        });

        // Apply style to the table
        $(".table--blue").css("width", "97%");
        $(".table--blue").css("margin", "20px");

        mThis.initAlready = true;
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
})();

// Initialize the component
$(document).ready(function () {
    JobsLevelComponent.init();
});
