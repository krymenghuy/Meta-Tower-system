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
            api_fetch: `${main_view.base_url}/ypg/reports/options-receiver`,
            api_params: {},
            name: "receiver_uid",
            value_field: "id",
            text_field: "name",
            required: false,
        },

        {
            type: "select",
            api_fetch: `${main_view.base_url}/ypg/form-option`,
            api_params: {},
            name: "status_id",
            value_field: "id",
            text_field: "member_status",
            required: false,
            dot_object: "statuses",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/ypg/form-option`,
            api_params: {},
            name: "task_status_id",
            value_field: "id",
            text_field: "status",
            required: false,
            dot_object: "task_statuses",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/ypg/form-option`,
            api_params: {},
            name: "task_id",
            value_field: "id",
            text_field: "task_type_title",
            required: false,
            dot_object: "task_types",
        },

        {
            type: "select",
            api_fetch: `${main_view.base_url}/ypg/form-option`,
            api_params: {},
            name: "branch_id",
            value_field: "id",
            text_field: "branch_name",
            required: false,
            dot_object: "branches",
        },
        {
            type: "select",
            api_fetch: `${main_view.base_url}/ypg/form-option`,
            api_params: {},
            name: "member_id",
            value_field: "id",
            text_field: "member_name",
            required: false,
            dot_object: "members",
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
        vsapi.call(`${main_view.base_url}/api/report-center/report-list`,op,false,null,main_view.apiCluster).then((res) => {
            const data = res.data || [];
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
                <div id="_rpt_list" class="col-sm-12 col-md-12 col-lg-12">
                    <div class="row">
                        <div class="card-report col-lg-6">
                            <div class="row gy-2 w-100 h-100">
                                <div id="_rpt_name" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                    <h6 class="text-uppercase" style="color:#eccf67;">List of report</h6>
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
                        <div class="d-flex col-lg-6">
                            <div class="gy-2 w-100 h-100">
                                <div class="bg-white border d-flex justify-content-center border-info h-100">
                                    <div id="" class=" my-auto rounded-3 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                        <h6 class="text-uppercase w-50 mt-4 mx-auto fs-4 text-center" style="color:#eccf67;">Veiw Report History</h6>
                                        <div class="d-none container w-50 mx-auto align-items-center">
                                            <i class="fa-solid fa-magnifying-glass fs-5" style="cursor: pointer; margin-right: -60px; z-index: 9;"></i>
                                        <input type="text" class=" rounded-5 py-2 ms-4 ps-5 box-shadow-dark product-search"
                                            placeholder="Search report...">
                                        </div>
                                        <div class="row w-75 mx-auto my-3">
                                            <div class="col-lg-3">
                                                <div class="btn-run-report border p-4 rounded-4 text-center" data-code="attendance_report">
                                                    <span class="p-2 border rounded-5"> A </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-3">
                                                <div class="btn-run-report border p-4 rounded-4 text-center" data-code="employee_benefits_report">
                                                    <span class="p-2 border rounded-5"> P </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-3">
                                                <div class="btn-run-report border p-4 rounded-4 text-center" data-code="wallet_account_list">
                                                    <span class="p-2 border rounded-5"> E </span>
                                                </div>
                                            </div>
                                            <div class="col-lg-3">
                                                <div class="btn-run-report border p-4 rounded-4 text-center" data-code="print_employee_CV">
                                                    <span class="p-2 border rounded-5"> E </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
        mThis.setEvent(mThis.self);

        mThis.self.html(html);
        mThis.getValueWhenClick(mThis.self.find("#_rpt_name"));
        mThis.controlPanel(mThis.self);
        LocaleManager.translateZone(mThis.self);
    };
    this.setEvent = (div)=>{
        div = div[0];
        div.onclick = function(e){
            e.preventDefault();
            let btn = VSUtil.getElementByClass(e.target,'btn-run-report');

            if(btn){
                const code =  btn.dataset.code;
                div.querySelectorAll('.report-name').forEach(btn=>{
                    if(btn.dataset.code == code){

                        btn.click();
                    }
                })

            }
        }

    }


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
            // if (filterContainer.length) filterContainer.toggleClass("d-none");

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

                if (!AuthManager.allowed(`${mThis.permissionID}`)) return;
                windowPrint(html);
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
            const filter = JSON.stringify(item.params).replace(/\"/g, "'");
            html = [
                html,
                `<li class="report-name" data-filter="${filter}" data-code="${
                    item.code
                }" data-permissionid="${item.permission_id}">
                <i class="fa-brands text-primary-custom fa-pushed"></i>
                <span class="text-capitalize text-primary-custom">${
                    item.name || ""
                }</span>
            </li>`,
            ].join("");
        });
        return html || "";
    };

    this.getFormGroupLabelText = (key) => {
        let label = {
           status_id: "Status",
           task_status_id: "Status",
           task_id: "Task Type",
           member_id: "Member",
           start_date: "Start Date",
           end_date: "End Date",
        };
        return label[key] ?? key;
    };

    this.renderFilters = (div, p) => {
        p = p || {};

        let html = null,
            inner_html = null;
        if (p.param) {
            const values = p.param.split("|");
            const param = values.map((value) => value.trim());
            param.map((item) => {
                mThis.filter_fields.map((f) => {
                    if (f.type === "select" && f.name === item) {
                        const id = ["select_", f.name].join("");
                        inner_html = [
                            inner_html,
                            `<div class="el_filter col-lg-6">
                            <div class="form-group">
                                <label for="${
                                    item.key
                                }" class="form-label text-capitalize " style="color:#eccf67;" vslang="titles.${
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
                                <label for="${item}" class="form-label text-capitalize" style="color:#eccf67;" vslang="titles.${
                                mThis.getFormGroupLabelText(item) || ""
                            }"></label>
                                <input data-select="datepicker" class="form-control rounded-5 data-input data-filter" data-field="${item}"/>
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
        html = `<div class="row card-report m-0" style="max-height:; display: none;">
                <div id="_div_filter" class="col d-flex row-cols-lg-2 justify-content-between align-items-center gap-3" >
                    <div id="_rpt_btn_list" class="p-0 text-end" style="display: none; width: 80px">
                        <button  class="btn-filter" type="button">
                            <i class="fa-solid px-1 fa-paper-plane"></i>
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
                            <i class="fa-solid px-1 fa-print"></i>
                            <span class="" vslang="buttons.Print"></span>
                        </button>
                        <button data-name="btn_excel" class="btn-pdf" id="btn_excel" type="button">
                            <i class="fa-solid px-1 text-primary-custom fa-file-pdf"></i>
                            <span class="text-primary-custom" vslang="buttons.Export"></span>
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
        // div.find("select.modal-select2").select2();
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
                            code === "print_employee_CV" &&
                            item.text == "employee_name"
                        ) {

                            default_id = data[0]?.id;
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
                        }
                        VSUtil.setComboItems(el,data || [],item.value,item.text,'','All',default_id);
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
        if (mThis.options.params.length == 0) {
            setTimeout(() => {
                const btn = div[0].querySelector("#_rpt_btn_report");
                if (btn) btn.click();
            }, 200);
        }
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
            let p = {code : code};

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
            // console.log(11,p);

            if (p.required && !p.required.value && p.required.text)
                cv_interact.warning(p.required.text);
            else mThis.getDataTable(div.closest(".main-container"), p);
        });

        div[0].querySelectorAll(".data-filter").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                let op = mThis.getDataFilter();
                const btn = div[0].querySelector("#_rpt_btn_report");
                if (
                    e.target.dataset.field == "start_date" ||
                    e.target.dataset.field == "end_date"
                )
                    // if (op.start_date == "" || op.end_date == "") return;
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
            case "member":
                end_point = "ypg/reports/member/list-by-status";
                break;
            case "expired_membership":
                end_point = "ypg/reports/expired-members";
                break;
            case "task_assign":
                end_point = "ypg/reports/task-assign";
                break;
            case "grave_ownership":
                end_point = "ypg/reports/grave-ownership";
                break;
            case "unused_grave_slot":
                end_point = "ypg/reports/unused-grave-slot";
                break;
            case "deceased_registration":
                end_point = "ypg/reports/deceased-registration";
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

            p.staff ? (p.emp_id = p.staff) : "";
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
                    if (res.data.title === "Print Employee CV") {
                        const btn_excel = mThis.self.find("#btn_excel");
                        if (btn_excel.length > 0 && btn_excel[0]) {
                            btn_excel[0].classList.add("d-none");
                        }
                    }
                    if (res.data.title === "Payslip Print") {
                        const btn_pdf = mThis.self.find("#btn_excel");
                        if (btn_pdf.length > 0 && btn_pdf[0]) {
                            btn_pdf[0].classList.add("d-none");
                        }
                    }

                    if (d && !$.isEmptyObject(d)) {
                        switch (d.form) {
                            case "simple":
                                jsonToTable(containerTable, d);
                                break;

                            case "member":
                                memberList(containerTable, d);
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

            let params = $(this).data("filter").replaceAll("'", '"');
            params = JSON.parse(params);
            mThis.options.params = [];
            $(this)
                .addClass("text-primary-custom")
                .siblings()
                .removeClass("text-primary-custom");
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
