'use strict';

var DashboardComponent = new (function () {
    const mThis = this;
    this.title_prop = "Dashboard";
    this.base_url = main_view.base_url;
    this.jm = main_view.appContent.children("#_main_dashboardComponent");
    this.self = this.jm[0];
    this.circle_card_row = mThis.self.querySelector("#db_circle_card");
    this.normal_card_row = mThis.self.querySelector("#db_normal_cards");
    this.progress_card_row = mThis.self.querySelector("#db_progress_cards");
    this.country_card_row = mThis.self.querySelector("#db_country_cards");
    this.supplier_card_row = mThis.self.querySelector("#db_supplier_cards");
    this.divShipmentsBySupplier = this.self.querySelector(
        "#db_shipments_by_supplier"
    );
    this.divShipmentsByCountry = this.self.querySelector(
        "#db_shipments_by_country"
    );

    this.init = () => {
        if (mThis.initAlready) return;

        mThis.initAlready = true;
    };

    this.initCircleCards = (div) => {
        const pie = div.querySelectorAll(".pie");

        // start the animation when the element is in the page view
        const elements = [].slice.call(pie);
        const circle = new CircularProgressBar("pie");

        // circle.initial();

        if ("IntersectionObserver" in window) {
            const config = {
                root: null,
                rootMargin: "0px",
                threshold: 0.75,
            };

            const ovserver = new IntersectionObserver((entries, observer) => {
                entries.map((entry) => {
                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio > 0.75
                    ) {
                        circle.initial(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, config);

            elements.map((item) => {
                ovserver.observe(item);
            });
        } else {
            elements.map((element) => {
                circle.initial(element);
            });
        }

        setInterval(() => {
            const typeFont = [100, 200, 300, 400, 500, 600, 700];
            const colorHex = `#${Math.floor(
                (Math.random() * 0xffffff) << 0
            ).toString(16)}`;
            const options = {
                index: 17,
                percent: Math.floor(Math.random() * 100 + 1),
                colorSlice: colorHex,
                fontColor: colorHex,
                fontSize: `${Math.floor(Math.random() * (1.4 - 1 + 1) + 1)}rem`,
                fontWeight:
                    typeFont[Math.floor(Math.random() * typeFont.length)],
            };
            // circle.animationTo(options);
        }, 3000);
    };
    this.renderCircleCards = (d) => {
        let html = "";
        d.map((c) => {
            html += `<div class="col-4 overview-section">
             <div class="bg-white d-flex justify-item-center align-items-center p-3 shadow rounded-3 ">
                <div class="card-content d-flex justify-content-center w-100">
                
                    <div class="section-title mb-0 fs-5 text-center w-100 d-flex align-items-center"><div class="w-100 fs-6" style="color: #9B96A2;">Shipment <p class="fs-5 m-0" style="color: ${c.colorSlice};">${c.status}</p> <p class="fs-5"style="color: ${c.colorSlice};">${c.value}</p></div>  </div>
                    <div class="pie"
                        data-pie='{ "animationSmooth": "1s ease-out", "percent": ${c.percentage} , "colorSlice" : "${c.colorSlice}", "colorCircle": "#f1f1f1" }'>
                    </div>
                    <div class="code">
                        <pre>
                            <code class="language-json">data-pie='{ 
                                "animationSmooth": "1s ease-out",
                                "percent": ${c.percentage},
                                "colorSlice": "${c.colorSlice}",
                                "colorCircle": "#f1f1f1",
                                "fontWeight": 50
                                }'
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        </div>`;
        });
        this.circle_card_row.innerHTML = html;
        this.initCircleCards(this.circle_card_row);
    };
    this.rederNormalCards = (d) => {
        let html = "";
        d.map((c) => {
            html = [
                html,
                `<div class="col-md-4 ">
            <div class="overview-card card">
                <div class="w-100 d-flex justify-content-between ">
                    <p class="section-title mb-2 fs-5">${c.title}</p>`,
                // `<i class="fas fa-ellipsis-v fs-5"></i>`,
                `</div>
                <div class="w-100 d-flex justify-content-between ">
                    <p class="text-center fs-2">${c.value}</p>
                    ${c.icon}
                </div>
            </div>
            </div>`,
            ].join("");
        });

        this.normal_card_row.innerHTML = html;
    };

    this.renderShipmentsBySupplier = (rows = [], height = null) => {
        let styleHeight = height > 0 ? `style="height:${height}px;"` : "";
        let html = [
            `<div `,
            styleHeight,
            ` data-field="supplier_name" class="card-col links-overview d-block text-start w-50 p-0">
                <p class="w-50 p-0 text-warning">Carrier</p>
            </div>

            <div data-field="shipping_count" class="card-col links-overview d-block w-50 p-0">
              <p class="w-50 p-0 text-warning">Shipping</p>
            </div>

            <div data-field="success_count" class="card-col links-overview d-block w-50 p-0">
                <p class="w-50 p-0 text-warning">Success</p>
                
            </div>

            <div data-field="unpaid_count" class="card-col links-overview d-block w-50 p-0">
                <p class="w-50 p-0 text-warning">Unpaid</p>
            </div>`,
        ].join("");

        mThis.divShipmentsBySupplier.innerHTML = html;
        let divs = {};
        mThis.divShipmentsBySupplier
            .querySelectorAll(".card-col")
            .forEach((div) => {
                let f = div.dataset.field;
                if (f) divs[f] = div;
            });

        const cols = [
            "supplier_name",
            "shipping_count",
            "success_count",
            "unpaid_count",
        ];
        rows.map((row) => {
            cols.map((col_name) => {
                console.log(col_name, "= ", row[col_name]);
                let html = `<div class="w-100 d-flex justify-content-between"><p>${
                    row[col_name] || "មិនមាន"
                }</p></div>`;

                divs[col_name].insertAdjacentHTML(`beforeend`, html);
            });
        });
    };

    this.renderShipmentByCustomer = (d) => {
        return;
    };

    this.renderProgressBars = (bars, card_height = 0) => {
        let html = "<h5>Payment Overview</h5>";
        let progress_bar_html = "";
        for (let bar_name in bars) {
            if (bars.hasOwnProperty(bar_name)) {
                let d = bars[bar_name];
                progress_bar_html = [
                    progress_bar_html,
                    `<div class="flex-wrap d-flex flex-column gap-1 mb-2">`,
                    `<div class="d-flex flex-row gap-2"><span class="shadow rounded-2" style="width:50px;height:5px;background:`,
                    d.alt_color,
                    `;"></span> <span style="margin-top:-7px">`,
                    d.alt_notes,
                    `</span></div>`,
                    //`<div class="d-flex flex-row gap-2"><span class="shadow rounded-2" style="width:50px;height:5px;background:red;"></span> <span style="margin-top:-7px"><small>60% of $100</small></span></div>`,
                    `</div>`,
                    // `<p>Invoice Summary (60%)</p>`,
                    `<div class="progress">
                                    <div class="progress-bar progress-bar-interactive" role="progressbar" style="width:100%;background-color:${
                                        d.background_color ||
                                        d.default_background_color
                                    };"  aria-valuenow="100";aria-valuemin="0" aria-valuemax="100">`,
                    `<div style="width:`,
                    d.alt_percent,
                    `%; color:`,
                    d.alt_text_color || "#000",
                    `; text-align: center; background-color:`,
                    d.alt_color,
                    `;">`,
                    d.alt_percent,
                    `% `,
                    d.alt_percent > 40 ? d.alt_notes : "",
                    `</div>`,
                    `</div>`,
                    `</div>`,
                    `<br><br>`,
                ].join("");
            }
        }
        let styleHeight =
            card_height > 0 ? `style="height:${card_height}px;"` : "";
        html = [
            `<div class="card" `,
            styleHeight,
            `>
                <div class="card-header">
                    <p class="section-title mb-0 fs-5">Payment Overview</p>
                </div>
                <div class="card-body">`,
            progress_bar_html,
            `</div>`,
            `</div>`,
        ].join("");

        mThis.progress_card_row.innerHTML = html;
    };

    this.renderTableSummaries = (d) => {
        let title = d.title || "Shipments by country";
        this.country_card_row.innerHTML = "";
        let html = "";

        (html += `<div class="card">
             <div class="card-header">
                 <p class="section-title mb-0 fs-5">${title}</p>
             </div>
                 
             <div class="card-body ">
                 <div class=" gap-3 d-flex">
                     <div class="links-overview d-block text-start w-50 p-0">
                        <div class="w-100 d-flex justify-content-between">
                            <p class="fs-6 p-0">Country</p>
                            <p class="fs-6 p-0">Shippments</p>
                        </div>`),
            d.map((c) => {
                html += `<div class="w-100 d-flex justify-content-between"><p>${c.country_name} :</p> <p >${c.shipment_count}</p></div>`;
            });

        (html += `   </div>
                    <div class="links-overview d-block text-start w-50 p-0">
                        <div class="w-100 d-flex justify-content-between">
                            <p class="fs-6 p-0">status</p>
                            <p class="fs-6 p-0">Number</p>
                        </div>`),
            d.map((c) => {
                html += `<div class="w-100 d-flex justify-content-between"><p>${c.country_name} :</p> <p >${c.shipment_count}</p></div>`;
            });
        html += `   </div>   
                 </div>
             </div>
             
         </div>`;

        this.country_card_row.innerHTML = html;
    };

    this.renderSupplierCards = (d) => {
        let html = "";
        html = `<div class="card">
            <div class="card-header">
                <p class="section-title mb-0 fs-5">Shippments by carrier</p>
            </div>
            <div class="card-body">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Supplier</th>
                            <th scope="col">Pending</th>
                            <th scope="col">Shipping</th>
                            <th scope="col">Validated</th>
                            <th scope="col">Paid</th>
                            <th scope="col">Unpaid</th>
                        </tr>
                    </thead>
                    <tbody>`;
        d.map((c) => {
            html += ` <tr>
                            <td class="w-50">${c.supplier_name || "NA"}</td>
                            <td>${c.pending || "0"}</td>
                            <td>${c.shipping || "0"}</td>
                            <td>${c.validated || "0"}</td>
                            <td>${c.paid || "0"}</td>
                            <td>${c.un_paid || "0"}</td>
                        </tr>`;
        });
        html += `</tbody>
                </table>
            </div>
        </div>`;
        this.supplier_card_row.innerHTML = html;
    };

    this.loadCards = (onFinish) => {
        let p = {};
        vsapi
            .call(
                `${mThis.base_url}/abm/dashboard/cards`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let d =
                    res.status_code === 200
                        ? StringSanitizer.sanitizeObject(res.data, null, [
                              "icon",
                          ])
                        : {};
                mThis.renderCircleCards(d.circle_cards);
                mThis.rederNormalCards(d.normal_cards);

                onFinish();
            });
    };

    /** render second part of dashboard: "Payment Overview", and "Shipments by Cuuntry", "Shipments by Carrier"  */
    this.loadOverviewData = (onFinish) => {
        let p = {};
        vsapi
            .call(
                `${mThis.base_url}/abm/dashboard/overview-data`,
                p,
                null,
                false,
                false
            )
            .then((res) => {
                let d =
                    res.status_code === 200
                        ? StringSanitizer.sanitizeObject(res.data, null, [
                              "icon",
                              "alt_notes",
                          ])
                        : {};
                mThis.renderProgressBars(d.progress_bars, 255);
                mThis.renderShipmentsBySupplier(d.supplier_table, 170);
                mThis.renderShipmentByCustomer(d.customer_table);
                onFinish();
            });
    };

    this.prepareFormOptions = (data, onFinish) => {
        // let p={'id' : data.id }
        mThis.loadCards(onFinish);
        mThis.loadOverviewData(onFinish);
    };

    this.show = (options) => {
        if (!options) options = {};
        mThis.options = options;
        main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null, (d) => {
            // mThis.workSpaceListView.showPage(null, null, () => {
            mThis.jm.siblings().hide();
            mThis.jm.fadeIn(250);
            // });
        });
    };
})();