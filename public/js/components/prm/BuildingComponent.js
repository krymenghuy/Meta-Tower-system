"use strict";

var BuildingComponent = new (function () {
    const mThis = this;

    // Component title
    this.title_prop = "Building & Floor Management";

    // Base and DOM references
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_building_component");
    mThis.btnAddBuilding = mThis.self.querySelector("#_btnBuilding");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_building");
    mThis.elFilter_status = mThis.self.querySelector('#el_status');
    mThis.elSearch = mThis.self.querySelector("#_search_building");

    // Column definitions
    mThis.cols = [
        {
            title: "No",
            className: "align-middle text-center",
            data: (data, index) => {
                return `<small>${index + 1}</small>`;
            }
        },
        {
            title: "Building Name",
            className: "align-middle",
            data: (data) => `<span>${data.name}</span>`
        },
        {
            title: "Address",
            className: "align-middle",
            data: (data) => `<span>${data.address}</span>`
        },
        {
            title: "Floors",
            className: "align-middle text-center",
            data: (data) => `<span>${data.floors}</span>`
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                let badgeClass = data.status === "Occupied" ? "bg-success" : "bg-warning";
                return `<span class="badge ${badgeClass}">${data.status}</span>`;
            }
        },
        {
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-center">
                    <button class="btn btn-sm btn-outline-primary rounded-3 me-1 btn-edit" data-id="${data.id}">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger rounded-3 btn-delete" data-id="${data.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `
        }
    ];

    // Initialize component
    mThis.init = () => {
        // Example: load table data
        mThis.loadTable();

        // Example: attach event listeners
        mThis.btnAddBuilding.addEventListener("click", () => {
            console.log("Add building clicked");
            // open modal / form here
        });

        mThis.elSearch.addEventListener("input", (e) => {
            console.log("Searching:", e.target.value);
            // filter table here
        });
    };

    // Load table data
    mThis.loadTable = () => {
        const data = [
            { id: 1, name: "Sunrise Tower", address: "123 Main St", floors: 15, status: "Occupied" },
            { id: 2, name: "Skyline Plaza", address: "456 Elm St", floors: 20, status: "Vacant" },
            { id: 3, name: "Riverfront Residences", address: "789 River Rd", floors: 12, status: "Occupied" }
        ];

        const tbody = mThis.self.querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach((row, index) => {
            const tr = document.createElement("tr");
            mThis.cols.forEach((col) => {
                const td = document.createElement("td");
                td.className = col.className || "";
                td.innerHTML = typeof col.data === "function" ? col.data(row, index) : "";
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    };

    // Show component
    mThis.show = (options) => {
        mThis.options = options;
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
    };

    return mThis;
})();
