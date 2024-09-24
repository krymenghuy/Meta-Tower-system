"use strict";

var WarningComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_warningComponent");
    this.self = this.jm[0];
    this.initAlready = false;
    this.title_prop = "Warning";

    // Initialize component
    this.init = function () {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        // Event binding for add warning button
        document
            .querySelector(".btnAddWarning")
            .addEventListener("click", function () {
                let addWarningModal = new bootstrap.Modal(
                    document.getElementById("addWarningModal"),
                    {}
                );
                addWarningModal.show();
            });

        // Event binding for save warning button
        document
            .getElementById("saveWarningBtn")
            .addEventListener("click", mThis.saveWarning);
        document
            .querySelector("#_warning_search")
            .addEventListener("input", mThis.searchWarning);
    };

    // Show component
    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
    //search warning
    this.searchWarning = function () {
        let searchTerm = document
            .querySelector("#_warning_search")
            .value.toLowerCase();

        let rows = document.querySelectorAll(".warning_item");

        rows.forEach((row) => {
            let employeeName = row
                .querySelector(".info_right > h6")
                .textContent.toLowerCase();
            let employeeEmail = row
                .querySelector(".info_right > .email")
                .textContent.toLowerCase();
            let employeePosition = row
                .querySelector(".position")
                .textContent.toLowerCase();
            let warningIssues = row
                .querySelector(".issues")
                .textContent.toLowerCase();
            let warningPromises = row
                .querySelector(".promises")
                .textContent.toLowerCase();

            if (
                employeeName.includes(searchTerm) ||
                employeeEmail.includes(searchTerm) ||
                employeePosition.includes(searchTerm) ||
                warningIssues.includes(searchTerm) ||
                warningPromises.includes(searchTerm)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };
    // Save the new warning and add a row
    this.saveWarning = function () {
        // Get form values
        let employeeName = document.getElementById("employeeNames").value;
        let employeeEmail = document.getElementById("employeeEmails").value;
        let employeePosition =
            document.getElementById("employeePositions").value;
        let warningIssues = document.getElementById("warningIssues").value;
        let warningPromises = document.getElementById("warningPromises").value;
        let warningQuntity = document.getElementById("warningSelect1").value;

        // Create a new warning row
        let warningBody = document.querySelector(".warning_body");
        let newRow = document.createElement("div");
        newRow.className = "warning_item";
        newRow.innerHTML = `
            <div class="info">
                <div class="info_left">
                    <img src="assets/images/skills/maketing.png" alt="User">
                </div>
                <div class="info_right">
                    <h6>${employeeName}</h6>
                    <span class="email">${employeeEmail}</span>
                </div>
            </div>
            <div class="position">${employeePosition}</div>
            <div class="issues">${warningIssues}</div>
            <div class="promises">${warningPromises}</div>
            <div class="warning">
                <select class="form-select" id="warningSelect1" aria-label="Warning select">
                    ${warningQuntity.value}
                    <option selected>Choose a warning</option>
                    <option value="1">Warning 1</option>
                    <option value="2">Warning 2</option>
                    <option value="3">Warning 3</option>
                </select>
            </div>
            <div class="action">
                <i class="fa fa-ellipsis-v"></i>
            </div>
        `;

        // Append the new row to the warning body
        warningBody.appendChild(newRow);

        // Hide the modal after adding
        let addWarningModal = bootstrap.Modal.getInstance(
            document.getElementById("addWarningModal")
        );
        addWarningModal.hide();

        // Clear the form fields after submission
        document.getElementById("warningForm").reset();

        console.log("New warning row added");
    };
})();
