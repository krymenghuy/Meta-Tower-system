"use strict";

var DashboardComponent =  (function () {
    const mThis = {};
    mThis.title_prop = "Dashboard";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_dashboardComponent");
    // mThis.self = mThis.jm[0];

    // *** When DashboardComponent is showing, create Dashboard Filter button near page title
    mThis.onShow = (options) => {
        if (!AuthManager.allowed(254,true)) return;
        mThis.dbFilterConfig = null; //reset Dashboard filter config to null to ensure Clean memory
        const divTitle = main_view.divTitle;
        let btn = divTitle.querySelector(".btn-db-fitler");
        if (btn) return;
        divTitle.insertAdjacentHTML(
            "beforeend",
            '<div class="d-none div-db-filter w-100 text-end"><button class="btn-db-fitler btn btn-sm btn-primary-custom rounded-circle p-2"><i class="fa-solid text-white fa-paper-plane"></i></button></div>'
        );
        btn = divTitle.querySelector(".btn-db-fitler");
    };

    mThis.init = () => {
        if (mThis.initAlready) return;
        if(AuthManager.allowed(254,true)){
            mThis.dbChartAll = mThis.self.querySelector("#dbChart_all_top");
            mThis.dbCards = mThis.self.querySelector("#db_cards");
            mThis.db_card_bottom = mThis.self.querySelector("#_db_card_bottom");
            mThis.dashboard_Bottom_left = mThis.self.querySelector("#_dashboard_bottom_left");
            mThis.dbCardOnLeave = mThis.self.querySelector("#_db_card_onLeave");
        }
        mThis.initAlready = true;
    };


    mThis.renderDBChartAllTop = (data) => {
        data = data ? data : {};
       let html = [
            `<div class="chart-row  py-5">`,
                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart">`,
                        `<span class="fw-semibold fs-5 text-primary-custom text-capitalize">`,
                            data.doughnutChart.title,
                        `</span>`,
                        `<canvas id="doughnutChart"></canvas>`,
                    `</div>`,
                `</div>`,

                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart bg-white shadow-sm">`,

                        // Member Never Expires
                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/bhr/dashboard/team.svg" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${data.cards.member_never_expired ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Member Never Expires</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        // Members Nearing Expiration
                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/deadline.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.member_near_expiry ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Members Nearing Expiration</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        // Member Has Expired
                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/expired.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.member_expired_date ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Member Has Expired</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                    `</div>`,
                `</div>`,

                `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart bg-white shadow-sm">`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100 mb-2" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow rounded-2" style="background-color:#27b7ff;">${data.cards.grave_slot_avialable ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Available</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 mb-2 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white px-2 border border-white shadow bg-warning rounded-2">${data.cards.grave_slot_reversed ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Reserve</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                        `<div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">`,
                            `<div class="d-flex align-items-center p-2 mb-1">`,
                                `<div class="bg--icon">`,
                                    `<img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/grave.png" alt="Icon">`,
                                `</div>`,
                                `<div class="ms-3 text-center flex-fill">`,
                                    `<span class="fw-semibold fs-5 text-white border border-white bg-danger rounded-2 px-2 shadow">${data.cards.grave_slot_used ?? 0}</span>`,
                                    `<div class="text-primary mt-1">Grave Used</div>`,
                                `</div>`,
                            `</div>`,
                            `<hr style="border:1px solid #fff; margin:0;">`,
                        `</div>`,

                    `</div>`,
                `</div>`,

                 `<div class="col-md-3">`,
                    `<div class="chart-container dashboard_chart">`,
                        `<span class="fw-semibold fs-5 text-primary-custom text-capitalize">`,
                            data.memberTasks.title,
                        `</span>`,
                        `<canvas id="memberTasks"></canvas>`,
                    `</div>`,
                `</div>`,

            `</div>`
        ].join("");

        mThis.dbChartAll.innerHTML = html;
        mThis.renderChartMember(data.doughnutChart);
        mThis.renderChartMemberAssign(data.memberTasks);
    };

    mThis.renderChartMember = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById("doughnutChart").getContext("2d");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.values,
                        backgroundColor: data.colors,
                        borderColor: ["#fff", "#fff", "#fff"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "top",
                    },

                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw;
                                return `${label} : ${value} នាក់`;
                            },
                        },
                    },
                    datalabels: {
                        color: "#000",
                        font: {
                            size: 12,
                            weight: "bold",
                        },
                        formatter: function (value, context) {
                            return `${
                                context.chart.data.labels[context.dataIndex]
                            }\n${value} នាក់`;
                        },
                    },
                },
            },
        });
    };

    mThis.renderChartMemberAssign = (data) => {
        data = data ? data : {};

        const ctx = document.getElementById("memberTasks").getContext("2d");

        new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        data: data.values,
                        backgroundColor: data.colors,
                        borderColor: ["#fff", "#fff", "#fff"],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: "top",
                    },

                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (tooltipItem) {
                                const label = tooltipItem.label || "";
                                const value = tooltipItem.raw;
                                return `${label} : ${value} នាក់`;
                            },
                        },
                    },
                    datalabels: {
                        color: "#000",
                        font: {
                            size: 12,
                            weight: "bold",
                        },
                        formatter: function (value, context) {
                            return `${
                                context.chart.data.labels[context.dataIndex]
                            }\n${value} នាក់`;
                        },
                    },
                },
            },
        });
    };


    mThis.renderDBCards = (data) => {
        let html = [
        `<div class="col-md-3">
            <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                <div class="d-flex align-items-center p-2 mb-1">
                    <div class="bg--icon">
                        <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/task.png" alt="Icon">
                    </div>
                    <div class="ms-3 text-center flex-fill">
                        <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.task_type ?? 0}</span>
                        <div class="text-primary mt-1">Task Type</div>
                    </div>
                </div>
                <hr style="border:1px solid #fff; margin:0;">
            </div>
        </div>`,

        `<div class="col-md-3">
            <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                <div class="d-flex align-items-center p-2 mb-1">
                    <div class="bg--icon">
                        <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/task_assign.png" alt="Icon">
                    </div>
                    <div class="ms-3 text-center flex-fill">
                        <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.task_assign ?? 0}</span>
                        <div class="text-primary mt-1">Task Assign</div>
                    </div>
                </div>
                <hr style="border:1px solid #fff; margin:0;">
            </div>
        </div>`,

        `<div class="col-md-3">
            <div class="card-db bg-white shadow rounded-3 w-100 d-flex flex-row align-items-center mb-2">
                <div class="d-flex w-100 flex-column justify-content-between rounded-3 h-100" style="background-color: #ededed;">
                    <div class="d-flex align-items-center p-2 mb-1">
                        <div class="bg--icon">
                            <img class="img--size" src="${main_view.base_url}/assets/images/yavpheng/deceased.png" alt="Icon">
                        </div>
                        <div class="ms-3 text-center flex-fill">
                            <span class="fw-semibold fs-5 text-white border border-white bg-info rounded-2 px-2 shadow">${data?.cards?.deceased ?? 0}</span>
                            <div class="text-primary mt-1">Register Deceased</div>
                        </div>
                    </div>
                    <hr style="border:1px solid #fff; margin:0;">
                </div>
            </div>
        </div>`
    ].join('');

        mThis.dbCards.innerHTML = html;
    };

    mThis.loadCards = (onFinish) => {
        const p = {};

        vsapi.call(`${main_view.base_url}/ypg/dashboard/data`,p,null,false,false).then((res) => {
            const data = res.status_code === 200 ? res.data : {};
            mThis.renderDBChartAllTop(data);
            mThis.renderDBCards(data);
            // mThis.renderDBCardBottom(data);

            onFinish();
        });
    };
    mThis.prepareFormOptions = (data, onFinish) => {
        mThis.loadCards(onFinish);
    };

    mThis.setDashboardScroll = () => {
        const parent = mThis.self;
        parent.style.height = window.innerHeight - 70 + "px";
        parent.classList.add("overflow-y-auto");
        parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            parent.style.height = window.innerHeight - 70 + "px";
        };
    };

    mThis.show = (options) => {
        if (!AuthManager.allowed(254,true)){
            mThis.self.innerHTML = renderUserHome();
            main_view.setContentView(mThis.self, mThis.title_prop);
            return;
        }

        mThis.setDashboardScroll();
        mThis.init();
        options = options || {};
        //main_view.setTitle(mThis.title_prop);
        mThis.prepareFormOptions(null, (d) => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            // mThis.jm.siblings().hide();
            // mThis.jm.fadeIn(200);
        });
    };

    const renderUserHome = ()=>{
        return [
            `<div class="user_home_page">
                <img src="../../../assets/images/default/default-dashboard.jpg" >
            </div>
            <style>
                .user_home_page img{
                    height: 88.6vh;
                    width: 99.2%;
                    margin:5px;
                    background-size: cover;
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>`,
        ].join("");

     };
    return mThis;
})();
