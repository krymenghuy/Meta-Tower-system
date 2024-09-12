"use strict";

var JobsLevelComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_jobsLevelComponent");
    this.self = this.jm[0];
    this.title_prop = "Job Level";

    // Show component
    this.show = function () {
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };

    // Search functionality for Job Title
    this.searchJobTitle = function () {
        $("#searchSkill").on("input", function () {
            let searchTerm = $(this).val().toLowerCase();
            $(".list_job_level tbody tr").each(function () {
                let jobTitle = $(this).find("td:first").text().toLowerCase();
                $(this).toggle(jobTitle.includes(searchTerm));
            });
        });
    };

    // Action menu (view, edit, delete) functionality
    this.setupActions = function () {
        // Handle action menu click
        $(".list_job_level").on("click", ".actions i", function (e) {
            e.stopPropagation(); // Prevent click event from bubbling up

            let actionMenu = $(this).siblings(".action-menu");

            // Remove any open action menu, except for the current one
            if (actionMenu.length) {
                actionMenu.remove();
            } else {
                $(".action-menu").remove();

                let newActionMenu = `
                    <div class="action-menu">
                        <i class="fa fa-eye" title="View"></i>
                        <i class="fa fa-pen" title="Edit"></i>
                        <i class="fa fa-trash" title="Delete"></i>
                    </div>
                `;

                // Append the action menu near the clicked icon
                $(this).closest("td").append(newActionMenu);

                // Action menu click handlers
                $(".action-menu .fa-eye").on("click", function () {
                    alert("View job details!");
                });

                $(".action-menu .fa-pen").on("click", function () {
                    let row = $(this).closest("tr");
                    let jobTitle = row.find("td:nth-child(2)").text();
                    let newJobTitle = prompt("Edit Job Title", jobTitle);
                    if (newJobTitle) {
                        row.find("td:nth-child(2)").text(newJobTitle);
                    }
                });

                $(".action-menu .fa-trash").on("click", function () {
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

    // Initialize all functions
    this.init = function () {
        $("#btnAdd").on("click", mThis.addForm);
        mThis.searchJobTitle();
        mThis.setupActions();
    };
})();

// Initialize the component
$(document).ready(function () {
    JobsLevelComponent.init();
});
