"use strict";
var ReportCenterComponent = new (function () {
    const mThis = this;
    this.title_prop = "Report Center";
    this.self = main_view.appContent.children("#_main_reportCenterComponent");
    this.options = {};
    this.permissionID = null;

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.initAlready = true;
    };

    this.filter_fields = [
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "group_id",
            value_field: "id",
            text_field: "name",
            required: true,
            dot_object: "groups",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/reports/options-receiver`,
            api_params: {},
            name: "receiver_uid",
            value_field: "id",
            text_field: "name",
            required: false,
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "is_paid",
            value_field: "is_paid",
            text_field: "name",
            required: false,
            dot_object: "pmt_status",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "campus_id",
            value_field: "id",
            text_field: "campus",
            required: false,
            dot_object: "campuses",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "from_campus_id",
            value_field: "id",
            text_field: "campus",
            required: false,
            dot_object: "campuses",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "to_campus_id",
            value_field: "id",
            text_field: "campus",
            required: false,
            dot_object: "campuses",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "fee_type_id",
            value_field: "id",
            text_field: "name",
            required: false,
            dot_object: "non_fee_types",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "level_id",
            value_field: "id",
            text_field: "level",
            required: false,
            dot_object: "levels",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "leave_type_id",
            value_field: "id",
            text_field: "name",
            required: false,
            dot_object: "leave_types",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "student_id",
            value_field: "id",
            text_field: "name",
            required: false,
            dot_object: "students",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/api/form-option`,
            api_params: {},
            name: "request_type_id",
            value_field: "id",
            text_field: "name",
            required: false,
            dot_object: "request_type",
        },
        {
            type: "date",
            name: "start_date",
        },
        {
            type: "date",
            name: "end_date",
        },
    ];

    this.displayMainOptions = (onFinish = null) => {
        const op = { app_id: main_view.app_id };
        vsapi
            .call(
                `${main_view.base_url}/api/report-center/report-list`,
                op,
                null,
                null,
                main_view.apiCluster
            )
            .then((res) => {
                let data = [];
                if (res.status_code === 200) {
                    data = res.data;
                }
                // console.log(6666,data);
                mThis.renderPanelBox(data);
            });
        if (typeof onFinish === "function") onFinish();
    };

    this.renderPanelBox = (data) => {
        const html = [
            `<div id="_div_filter" class="d-none">
            <div class="d-flex p-3 justify-content-between align-items-center bg-white rounded-3 overflow-hidden">
                <div>
                    <button id="_rpt_filter" class="btn-filter me-2" style="width: 80px;" type="button">
                        <span class="" vslang="buttons.Filter"></span>
                    </button>
                </div>
                <div id="_div_filter_top" style="height:  ; max-width: 80% overflow-y: scroll;"></div>

                <div>
                    <div class="d-flex justify-content-end gap-2">
                        <button id="_rpt_pdf" class="btn-print" type="button">
                            <i class="fa-solid fa-print"></i>
                            <span class="" vslang="buttons.Print"></span>
                        </button>
                        <button id="_rpt_excel" class="btn-pdf" type="button">
                            <i class="fa-regular fa-file-pdf"></i>
                            <span class="" vslang="buttons.Export"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="_rpt_container" style="position: ; z-index: 99;">
            <div class="row row-cols-lg-2 gy-2 d-flex mt-3" >
                <div id="_rpt_list" class="col-sm-12 col-md-6 col-lg-6">
                    <div class="card-report">
                        <div class="row gy-2 w-100 h-100">
                            <div id="_rpt_name" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                <h6 class="text-uppercase">List of report</h6>
                                <ul class="del-marker h-100" style=" max-height: ${
                                    window.innerHeight - 160 + "px"
                                }; ">  `,
            mThis.renderReportType(data),
            `</ul>
                            </div>`,
            // `<div class="col-sm-12 col-md-12 col-lg-6 d-none d-sm-none d-md-none d-lg-none d-xl-block d-xxl-block">
            //     <div class="h-img-report">
            //         <img src="${main_view.base_url}/assets/images/logo/report.png" alt=""/>
            //     </div>
            //  </div>`,
            `</div>
                    </div>
                </div>
                <!-- <div class="col-sm-12 col-md-6 col-lg-6 m-0">
                    <div id="_rpt_input_filter" class="card-report d-block"></div>
                </div> -->
                <div class="col">
                <div id="_rpt_input_filter" class=" d-block"></div>
                </div> 
            </div>
        </div>
        <div id="_rpt_table" class="container-table overflow-hover-auto" ></div>`,
        ].join("");

        mThis.self.html(html);
        mThis.getValueWhenClick(mThis.self.find("#_rpt_name"));
        mThis.controlPanel(mThis.self);
        LocaleManager.translateZone(mThis.self);
    };


    this.controlPanel = (container) => {
        const reportTable = container.find("#_rpt_table").children();
        container.find("#_rpt_filter").on("click", function (e) {
            e.preventDefault();

            const reportList = container.find("#_rpt_list");
            const filterContainer = mThis.self.find("#_div_filter");
            const filterInputs = mThis.self.find("#_rpt_input_filter");
            const filterElements =
                filterInputs[0]?.querySelectorAll("div.el_filter");

            if (reportList.length) reportList.slideToggle("slow");
            if (filterContainer.length) filterContainer.toggleClass("d-none");

            if (filterElements) {
                filterElements.forEach((element) => {
                    element.classList.toggle("col-lg-2");
                    element.classList.toggle("col-lg-6");
                });
            }

            filterInputs.find("#_rpt_btn_list").slideToggle("slow");
            filterInputs.find("#_rpt_btn_print").slideToggle("slow");
            filterInputs.children().slideToggle("slow");
        });

        container
            .find("#_rpt_pdf")
            .off("click")
            .on("click", function (e) {
                e.preventDefault();
                if (!AuthManager.allowed(`${mThis.permissionID}.print`)) return;
                windowPrint();
            });

        container
            .find("#_rpt_excel")
            .off("click")
            .on("click", function (e) {
                e.preventDefault();
                if (!AuthManager.allowed(`${mThis.permissionID}.excel`)) return;
                exportToExcel();
            });
    };

    this.renderReportType = (d) => {
        d = d || [];
        let html = null;
        d.map((item) => {
            console.log(3434,item)
            const filter = JSON.stringify(item.params).replace(/\"/g, "'");
            html = [
                html,
                `<li class="report-name" data-filter="${filter}" data-code="${
                    item.code
                }" data-permissionid="${item.permission_id}">
                <i class="fa-regular fa-rectangle-list"></i>
                <span class="text-capitalize">${item.name || ""}</span>
            </li>`,
            ].join("");
        });
        return html || "";
    };

    this.getFormGroupLabelText = (key) => {
        let label = {
            student_id: "Student",
            campus_id: "Campus",
            level_id: "Level",
            leave_type_id: "Leave Type",
            is_paid: "Pmt Status",
            from_campus_id: "From Campus",
            to_campus_id: "To Campus",
            fee_type_id: "Fee Type",
            start_date: "Start Date",
            end_date: "End Date",
            group_id: "Group",
        };
        return label[key] ?? key;
    };

    this.renderFilters = (div, p) => {
        p = p || {};
        let html = null,
            inner_html = null;
        if (p.param) {
            const values = p.param.split("|");
            // Trim whitespace from each value (optional, but recommended)
            const param = values.map((value) => value.trim());
            param.map((item) => {
                // // console.log(111,item.key);
                mThis.filter_fields.map((f) => {
                    //console.log(222,f.type,'|',f.name,'|',item);
                    if (f.type === "select" && f.name === item) {
                        const id = ["select_", f.name].join("");
                        inner_html = [
                            inner_html,
                            `<div class="el_filter col-lg-6">
                            <div class="form-group">
                                <label for="${
                                    item.key
                                }" class="form-label text-capitalize " vslang="titles.${
                                mThis.getFormGroupLabelText(item) || ""
                            }"></label>
                                <div class="width-select-in-form">
                                    <select id="${id}" class="${
                                f.name
                            } modal-select2 data-input data-filter" data-field="${item}"></select>
                                </div>
                            </div>
                        </div>`,
                        ].join("");
                        mThis.getDataOption(
                            f.api_fetch,
                            f.api_params,
                            f.value_field,
                            f.text_field,
                            f.required,
                            f.dot_object,
                            id
                        );
                    } else if (f.type === "date" && f.name === item) {
                        inner_html = [
                            inner_html,
                            `<div class="el_filter col-lg-6">
                            <div class="form-group">
                                <label for="${item}" class="form-label text-capitalize " vslang="titles.${
                                mThis.getFormGroupLabelText(item) || ""
                            }"></label>
                                <input data-select="datepicker" class="form-control data-input data-filter" data-field="${item}"/>
                            </div>
                        </div>`,
                        ].join("");
                    }
                });
            });
        } else {
            inner_html = `<div class="col">
                <div class="d-flex align-items-center justify-content-center">
                    <h4 class="text-muted">No Filter</h4>
                </div>
            </div>`;
        }
        // console.log(333,inner_html);
        html = `<div class="row card-report m-0" style="max-height:; display: none;">
                <div id="_div_filter" class="col d-flex row-cols-lg-2 justify-content-between align-items-center" >
                    <div id="_rpt_btn_list" class="p-0 text-end" style="display: none; width: 80px">
                        <button  class="btn-filter" type="button">
                            <span class="" vslang="buttons.Filter"></span>
                        </button>
                    </div>
                    ${
                        inner_html ||
                        `<div class="col">
                        <h4 class="text-muted text-center">No Filter</h4>
                    </div>`
                    }
                    
                    <div id="_rpt_btn_print" class="col text-nowrap" style="display: none;">
                        <button data-name="btn_pdf" class="btn-print" type="button">
                            <i class="fa-solid fa-print"></i>
                            <span class="" vslang="buttons.Print"></span>
                        </button>
                        <button data-name="btn_excel" class="btn-pdf" type="button">
                            <i class="fa-regular fa-file-pdf"></i>
                            <span class="" vslang="buttons.Export"></span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="">
                <button id="_rpt_btn_report" class="btn-filter d-none" type="button">
                    <span class="" vslang="buttons.Run Report"></span>
                </button>
            </div>`;

        div.html(html);
        mThis.renderSelect(div, p.code);
        mThis.runReport(div, p.code);

        div.find("[data-select='datepicker']").each(function () {
            DateTimePicker.init($(this));
        });
        div.find("select.modal-select2").select2();
        LocaleManager.translateZone("_rpt_input_filter");
    };

    this.getDataOption = (
        api,
        param,
        value,
        text,
        required,
        dot_object,
        id
    ) => {
        mThis.options.params = mThis.options.params ? mThis.options.params : [];
        mThis.options.params.push({
            api: api,
            param: param,
            value: value,
            text: text,
            required: required,
            dot_object: dot_object,
            dom_id: id,
        });
    };

    this.renderSelect = (div, code = null) => {
        mThis.options.params.map((item, index, array) => {
            let data = [];
            vsapi.call(item.api, item.param, null, false).then((res) => {
                if (res.status_code === 200) {
                    data = res.data;
                    data = item.dot_object ? data[item.dot_object] : data;
                    const el = div.find(`#${item.dom_id}`);
                    if (el) {
                        item.required
                            ? el.attr("data-required", item.required)
                            : false;
                        let has = null,
                            all_text = null,
                            default_id = null;
                        if (
                            code === "total_student_payment_history" &&
                            item.text == "level"
                        ) {
                            has = true;
                            all_text = "All Level";
                        } else if (
                            code === "income_by_class" &&
                            item.text == "level"
                        ) {
                            has = true;
                            all_text = "All Level";
                        } else if (
                            code === "non_tuition_fee" &&
                            item.text == "level"
                        ) {
                            has = true;
                            all_text = "All Level";
                        } else if (code === "referral" && item.text == "name") {
                            console.log(1234,item.api);
                        }
                        // console.log(234,item);
                        VSUtil.setComboItems(
                            el,
                            data || [],
                            item.value,
                            item.text,
                            has,
                            all_text,
                            null
                        );
                        if (el.hasClass("fee_type_id")) {
                            el.find("option").each(function () {
                                const option = this;
                                if (option.textContent == "Tuition Fee")
                                    option.remove();
                            });
                        }
                        if (index === array.length - 1) {
                            const btn =
                                div[0].querySelector("#_rpt_btn_report");
                            if (btn) {
                                btn.click();
                            }
                        }
                    }
                }
            });
        });
    };

    this.getDataFilter = (div = null) => {
        div = div || mThis.self.find("#_rpt_input_filter");
        let p = {};
        div.find(".data-input").each(function () {
            const el = $(this);
            const title = el.is("input")
                ? el.prev().text()
                : el.parent().prev().text();
            const f = el.data("field");
            if (el.data("required")) {
                p["required"] = {
                    text: [mThis.capitalize(title), "cannot empty!"].join(" "),
                    value: el.val(),
                };
            }
            if (el.data("form") == "simple") {
                p["simple"] = true;
            }
            p[f] = el.val();
        });
        return p;
    };

    this.runReport = (div, code) => {
        div.find("#_rpt_btn_report").on("click", function (e) {
            e.preventDefault();
            let p = {};
            div.find(".data-input").each(function () {
                const el = $(this);
                const title = el.is("input")
                    ? el.prev().text()
                    : el.parent().prev().text();
                const f = el.data("field");
                if (el.data("required")) {
                    p["required"] = {
                        text: [mThis.capitalize(title), "cannot empty!"].join(
                            " "
                        ),
                        value: el.val(),
                    };
                }
                if (el.data("form") == "simple") {
                    p["simple"] = true;
                }
                p[f] = el.val();
                p.code = code;
            });
            // console.log(222333,p);

            if (p.required && !p.required.value && p.required.text)
                cv_interact.warning(p.required.text);
            else mThis.getDataTable(div.closest(".main-container"), p);
        });

        div[0].querySelectorAll(".data-filter").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                let op = mThis.getDataFilter();
                // console.log(9999,e);
                const btn = div[0].querySelector("#_rpt_btn_report");
                if (
                    e.target.dataset.field == "start_date" ||
                    e.target.dataset.field == "end_date"
                )
                    if (op.start_date == "" || op.end_date == "") return;
                if (btn) btn.click();
                else if (btn) btn.click();
            };
        });     

        div.find("#_rpt_btn_list").on("click", function (e) {
            e.preventDefault();
            const filterTop = mThis.self.find("#_rpt_filter");
            filterTop.click();
        });

        div.find("#_rpt_btn_print").on("click", function (e) {
            e.preventDefault();
            let btn = e.target.closest("button");
            // console.log(3,btn);
            if (btn.dataset.name == "btn_pdf") {
                mThis.self.find("#_rpt_pdf").click();
            } else if (btn.dataset.name == "btn_excel") mThis.self.find("#_rpt_excel").click();
        });
    };

    this.capitalize = (str, lower = false) =>
        (lower ? str.toLowerCase() : str).replace(
            /(?:^|\s|["'([{])+\S/g,
            (match) => match.toUpperCase()
        );

    this.getDataTable = (div, p) => {
        let end_point = null;
        if (mThis.isBusy) {
            setTimeout(() => {
                mThis.getDataTable(div, p);
            }, 500);
            return;
        }
        mThis.isBusy = true;
        switch (p.code) {
            case "staff_attendance":
                end_point = "/hr/reports/employee/list";
                break;
            case "daily_cash":
                end_point = "api/hr/attendances/list";
                break;
            case "monthly_cash":
                end_point = "api/reports/leave/list";
                break;
            case "referral":
                end_point = "api/reports/finance/referral-fee-list";
                break;
            case "non_tuition_fee":
                end_point = "api/reports/finance/non-tuition-fee-list";
                break;
            case "income_by_category":
                end_point = "api/reports/finance/income-by-categories";
                break;
            case "deposit":
                end_point = "api/reports/finance/deposite-list";
                break;
            case "payment_by_month":
                end_point = "api/reports/finance/total-by-month";
                break;
            case "payment_by_year":
                end_point = "api/reports/finance/total-by-year";
                break;
            case "total_student_payment_history":
                end_point = "api/reports/finance/total-student-payment-history";
                break;
            case "total_payment_history_by_year":
                end_point = "api/reports/finance/total-payment-history-year";
                break;
            case "leave_students":
                end_point = "api/reports/enrollment/dropped-out-students";
                break;
            case "comeback_student":
                end_point = "api/reports/enrollment/comeback-students";
                break;
            case "school_fee":
                end_point = "api/reports/finance/school-fee-list";
                break;
            case "student_payment_history":
                end_point = "api/reports/finance/student-payment-history";
                break;
            case "income_by_class":
                end_point = "api/reports/finance/income-by-class";
                break;
            case "transferred_in_student_by_campus":
                end_point = "api/reports/enrollment/request-change";
                break;
            case "cross_year_payment":
                end_point = "api/reports/finance/cross-year-payment";
                break;
            case "upgrade_fees":
                end_point = "api/reports/finance/upgrade-fee";
                break;
            default:
                end_point = null;
                break;
        }

        if (end_point) {
            const containerTable = div.find("#_rpt_table");

            ["required", "code"].forEach((key) => {
                delete p[key];
            });
            Object.keys(p).forEach((key) => {
                if (p[key] === "null") p[key] = null;
            });

            vsapi
                .call(`${main_view.base_url}/${end_point}`, p, null, false)
                .then((res) => {
                    let d = {};

                    if (res.status_code === 200) {
                        d = res.data;
                    } else {
                        cv_interact.error(
                            res.error_message || "Something went wrong!"
                        );
                        mThis.isBusy = false;
                    }
                    // console.log(22223,d);

                    if (d && !$.isEmptyObject(d)) {
                        switch (d.form) {
                            case "simple":
                                jsonToTable(containerTable, d);
                                break;
                            case "referral":
                                referralFeeTable(containerTable, d);
                                break;
                            case "school_fee":
                            case "non_tuition":
                                nonTuitionFeeTable(containerTable, d);
                                break;
                            case "income_by_category":
                                incomeByCategoryTable(containerTable, d);
                                break;
                            case "payrolls":
                                totalPaymentByYear(containerTable, d);
                                break;
                            case "total_student_payment_history":
                                totalStudentPaymentHistory(containerTable, d);
                                break;
                            case "leave_student":
                                leaveStudent(containerTable, d);
                                break;
                            case "attendanceList":
                                attendanceList(containerTable, d);
                                break;
                            case "student_payment_history":
                                studentPaymentHistory(containerTable, d);
                                break;
                            case "income_by_class":
                                incomeByClassTable(containerTable, d);
                                break;
                            case "student_change_campus":
                                studentChangeCampus(containerTable, d);
                                break;
                            case "cross_year_payment":
                                crossYearPayment(containerTable, d);
                                break;
                            case "upgrade_fee":
                                upgradeFee(containerTable, d);
                                break;
                            default:
                                studentAttendance(containerTable, d);
                                break;
                        }
                        mThis.isBusy = false;
                    }
                });

            containerTable[0].style.height = window.innerHeight - 240 + "px";
            window.onresize = () => {
                containerTable[0].style.height =
                    window.innerHeight - 240 + "px";
            };
        } else {
            cv_interact.warning("This report doesn't exist!");
            mThis.isBusy = false;
        }
    };

    this.getValueWhenClick = (div) => {
        div.on("click", "li.report-name", function (e) {
            e.preventDefault();
            mThis.permissionID = e.currentTarget.dataset.permissionid;
            console.log(2342,$(this));
            
            let params = $(this).data("filter").replaceAll("'", '"');
            params = JSON.parse(params);
            mThis.options.params = [];
            $(this)
                .addClass("text-primary")
                .siblings()
                .removeClass("text-primary");
            let p = {
                code: $(this).data("code"),
                param: params,
            };
            mThis.renderFilters(mThis.self.find("#_rpt_input_filter"), p);
            mThis.self.find(".div_filter_top").html = "<div></div>";
        });
    };

    this.show = (options) => {
        mThis.init(); //NOTE: initOnce init one time only
        if (!options) options = {};
        main_view.setTitle(mThis.title_prop);
        mThis.displayMainOptions(() => {
            mThis.self.siblings().hide();
            mThis.self.fadeIn(200);
        });
    };
})();
