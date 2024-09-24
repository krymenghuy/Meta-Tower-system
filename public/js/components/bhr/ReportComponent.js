"use strict";

var ReportComponent = new (function () {
    let mThis = this;
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_reportComponent");
    this.self = this.jm[0];
    this.initAlready = false;

    this.init = function () {
        if (mThis.initAlready) return;
        mThis.initAlready = true;

        document
            .querySelector(".btnAddReport")
            .addEventListener("click", mThis.showPopup);
        document
            .querySelector("#addReportSubmit")
            .addEventListener("click", mThis.submitReport);
        document
            .querySelector("#closePopupAddReport")
            .addEventListener("click", mThis.hidePopup);
        document
            .querySelector("#_report_search")
            .addEventListener("input", mThis.searchReport);
    };

    this.searchReport = function () {
        let searchTerm = document
            .querySelector("#_report_search")
            .value.toLowerCase();

        let rows = document.querySelectorAll(".report_item");

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
            let reportDescription = row
                .querySelector(".description")
                .textContent.toLowerCase();
            let reportDate = row
                .querySelector(".date")
                .textContent.toLowerCase();
            let reportType = row
                .querySelector(".type")
                .textContent.toLowerCase();

            if (
                employeeName.includes(searchTerm) ||
                employeeEmail.includes(searchTerm) ||
                employeePosition.includes(searchTerm) ||
                reportDescription.includes(searchTerm) ||
                reportDate.includes(searchTerm) ||
                reportType.includes(searchTerm)
            ) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    };

    this.showPopup = function () {
        document.querySelector("#addReportPopup").classList.add("show");
        mThis.clearPopup();
    };

    this.hidePopup = function () {
        document.querySelector("#addReportPopup").classList.remove("show");
        mThis.editingRow = null;
    };

    this.clearPopup = function () {
        document.querySelector("#employeeImage").value = "";
        document.querySelector("#employeeName").value = "";
        document.querySelector("#employeeEmail").value = ""; // Clear email
        document.querySelector("#employeePosition").value = "";
        document.querySelector("#reportDate").value = "";
        document.querySelector("#reportType").value = "Internal";
        document.querySelector("#reportDescription").value = "";
    };

    this.submitReport = function () {
        let employeeName = document.querySelector("#employeeName").value;
        let employeeEmail = document.querySelector("#employeeEmail").value;
        let employeePosition =
            document.querySelector("#employeePosition").value;
        let reportDate = document.querySelector("#reportDate").value;
        let reportDescription =
            document.querySelector("#reportDescription").value;
        let employeeImage = document.querySelector("#employeeImage").files[0];
        let reportType = document.querySelector("#reportType").value;

        if (!employeeName || !reportDate || !reportDescription) {
            alert("Please fill in all required fields.");
            return;
        }

        let newReportItem = document.createElement("div");
        newReportItem.classList.add("report_item");

        newReportItem.innerHTML = `
            <div class="info">
                <div class="info_left">
                    <img src="${
                        employeeImage
                            ? URL.createObjectURL(employeeImage)
                            : "assets/images/skills/maketing.png"
                    }" alt="User">
                </div>
                <div class="info_right">
                    <h6>${employeeName}</h6>
                    <span class="email">${employeeEmail}</span>
                </div>
            </div>
            <div class="position">${employeePosition}</div>
            <div class="description">${reportDescription}</div>
            <div class="type">${reportType}</div>
            <div class="date">${reportDate}</div>
            <div class="action">
                <i class="fa fa-ellipsis-v"></i>
            </div>
        `;

        document.querySelector(".report_body").appendChild(newReportItem);

        mThis.clearPopup();
        mThis.hidePopup();
    };

    this.show = function () {
        mThis.init();
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(250);
        main_view.setTitle(mThis.title_prop);
    };
})();
