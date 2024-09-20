"use strict";

var LeaveRequestComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_leave_request_component");
    this.self = this.jm[0];
    this.title_prop = "Leave Request";
    this.initAlready = false;
    this.editingRow = null; // Track the row being edited

    // Initialize
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        // Add event listener for the Add button
        document
            .querySelector("#_main_leave_request_btn_add")
            .addEventListener("click", mThis.showPopup);

        // Handle popup submission
        document
            .querySelector("#addLeaveSubmit")
            .addEventListener("click", mThis.submitLeaveEntry);

        // Handle popup close button
        document
            .querySelector("#closePopup")
            .addEventListener("click", mThis.hidePopup);
        document
            .querySelector("#searchLeaveRequest")
            .addEventListener("input", mThis.searchLeaveEntries);

        // Handle action buttons (approve, edit, view, delete)
        mThis.addActionListeners();
    };

    // Add action listeners to all icons
    this.addActionListeners = function () {
        document.querySelectorAll(".fa-check-circle").forEach((icon) => {
            icon.addEventListener("click", mThis.approveLeave);
        });
        document.querySelectorAll(".fa-times-circle").forEach((icon) => {
            icon.addEventListener("click", mThis.rejectLeave);
        });
        document.querySelectorAll(".fa-pencil-square").forEach((icon) => {
            icon.addEventListener("click", mThis.editLeave);
        });

        document.querySelectorAll(".fa-eye").forEach((icon) => {
            icon.addEventListener("click", mThis.viewLeave);
        });

        document.querySelectorAll(".fa-trash").forEach((icon) => {
            icon.addEventListener("click", mThis.deleteLeave);
        });
    };

    // Approve leave action
    this.approveLeave = function (event) {
        let statusButton = event.target
            .closest(".table_footer")
            .querySelector(".status button");

        // Remove any previously applied status classes
        statusButton.classList.remove("rejected");

        // Update text and add the "approved" class
        statusButton.textContent = "Approved";
        statusButton.classList.add("approved");
    };

    // Reject leave action
    this.rejectLeave = function (event) {
        let statusButton = event.target
            .closest(".table_footer")
            .querySelector(".status button");

        // Remove any previously applied status classes
        statusButton.classList.remove("approved");

        // Update text and add the "rejected" class
        statusButton.textContent = "Rejected";
        statusButton.classList.add("rejected");
    };
    this.searchLeaveEntries = function () {
        let searchTerm = document
            .querySelector("#searchLeaveRequest")
            .value.toLowerCase();

        // Get all the rows of leave requests
        let rows = document.querySelectorAll(".table_footer");

        rows.forEach((row) => {
            // Check if employee name, position, or leave duration matches the search term
            let employeeName = row
                .querySelector(".em_right h6")
                .textContent.toLowerCase();
            let employeePosition = row
                .querySelector(".em_right span")
                .textContent.toLowerCase();
            let leaveDuration = row
                .querySelector(".duration span")
                .textContent.toLowerCase();

            // If any match the search term, show the row, otherwise hide it
            if (
                employeeName.includes(searchTerm) ||
                employeePosition.includes(searchTerm) ||
                leaveDuration.includes(searchTerm)
            ) {
                row.style.display = ""; // Show the row
            } else {
                row.style.display = "none"; // Hide the row
            }
        });
    };
    // Edit leave action
    this.editLeave = function (event) {
        mThis.editingRow = event.target.closest(".table_footer"); // Store reference to the row
        let employeeName =
            mThis.editingRow.querySelector(".em_right h6").textContent;
        let employeePosition =
            mThis.editingRow.querySelector(".em_right span").textContent;
        let leaveDuration =
            mThis.editingRow.querySelector(".duration span").textContent;
        let permissionDetail =
            mThis.editingRow.querySelector(".permission_detail").textContent;

        // Pre-fill the form with current data
        document.querySelector("#employeeName").value = employeeName;
        document.querySelector("#employeePosition").value = employeePosition;
        document.querySelector("#leaveDuration").value = leaveDuration;
        document.querySelector("#permissionDetail").value = permissionDetail;

        // Show the popup for editing
        mThis.showPopup();
    };

    // View leave action (simply alert or display a modal with details)
    this.viewLeave = function (event) {
        let row = event.target.closest(".table_footer");

        // Get the details from the selected row
        let employeeName = row.querySelector(".em_right h6").textContent;
        let employeePosition = row.querySelector(".em_right span").textContent;
        let leaveDuration = row.querySelector(".duration span").textContent;
        let permissionDetail =
            row.querySelector(".permission_detail").textContent;
        let employeeImageSrc = row.querySelector(".em_left img").src; // Get the image source

        // Populate the modal fields
        document.querySelector("#viewEmployeeName").textContent = employeeName;
        document.querySelector("#viewEmployeePosition").textContent =
            employeePosition;
        document.querySelector("#viewLeaveDuration").textContent =
            leaveDuration;
        document.querySelector("#viewPermissionDetail").textContent =
            permissionDetail;

        // Set the employee image in the modal
        document.querySelector("#viewEmployeeImage").src = employeeImageSrc;

        // Show the modal
        document.querySelector("#viewLeavePopup").classList.add("show");
    };

    // Handle closing the view modal
    document
        .querySelector("#closeViewPopup")
        .addEventListener("click", function () {
            document.querySelector("#viewLeavePopup").classList.remove("show");
        });

    // Delete leave action
    this.deleteLeave = function (event) {
        if (confirm("Are you sure you want to delete this leave request?")) {
            let row = event.target.closest(".table_footer");
            row.remove();
        }
    };

    // Show the component
    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };

    // Show the popup form
    this.showPopup = function () {
        document.querySelector("#addLeavePopup").classList.add("show");
    };

    // Hide the popup form
    this.hidePopup = function () {
        document.querySelector("#addLeavePopup").classList.remove("show");
        mThis.editingRow = null; // Reset editingRow after closing the popup
    };

    // Submit (add or edit) a leave entry
    this.submitLeaveEntry = function () {
        let employeeName = document.querySelector("#employeeName").value;
        let employeePosition =
            document.querySelector("#employeePosition").value;
        let leaveDuration = document.querySelector("#leaveDuration").value;
        let permissionDetail =
            document.querySelector("#permissionDetail").value;
        let employeeImage = document.querySelector("#employeeImage").files[0];

        if (!employeeName || !leaveDuration || !permissionDetail) {
            alert("Please fill out all fields.");
            return;
        }

        let imageUrl = "assets/images/skills/default.png"; // Default image if no image is chosen

        // If an image is selected, create an object URL
        if (employeeImage) {
            imageUrl = URL.createObjectURL(employeeImage);
        }

        if (mThis.editingRow) {
            // Update the existing row
            mThis.editingRow.querySelector(".em_right h6").textContent =
                employeeName;
            mThis.editingRow.querySelector(".em_right span").textContent =
                employeePosition;
            mThis.editingRow.querySelector(".duration span").textContent =
                leaveDuration;
            mThis.editingRow.querySelector(".permission_detail").textContent =
                permissionDetail;

            // Update image in the editing row
            if (employeeImage) {
                mThis.editingRow.querySelector(".em_left img").src = imageUrl;
            }
        } else {
            // Create a new entry
            let newEntry = `
            <div class="table_footer">
                <div class="table_id">New</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="${imageUrl}" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>${employeeName}</h6>
                        <span>${employeePosition}</span>
                    </div>
                </div>
                <div class="duration">
                    <span>${leaveDuration}</span>
                </div>
                <div class="permission_detail">${permissionDetail}</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>
            </div>`;

            // Insert the new entry into the DOM
            document
                .querySelector(".table_footers")
                .insertAdjacentHTML("beforeend", newEntry);

            // Re-add action listeners for the newly added entry
            mThis.addActionListeners();
        }

        // Hide the popup
        mThis.hidePopup();

        // Clear the form fields
        document.querySelector("#employeeName").value = "";
        document.querySelector("#employeePosition").value = "";
        document.querySelector("#leaveDuration").value = "";
        document.querySelector("#permissionDetail").value = "";
        document.querySelector("#employeeImage").value = ""; // Clear the file input
    };
})();
