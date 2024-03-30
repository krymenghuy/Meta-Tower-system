var MerchantBalancesCompoment = new (function () {
    let mThis = this;
    // this.module_id =206;
    this.title_prop = "Merchant Balances";
    this.current_type = "receivable"; //By default, show Payables page
    this.self = main_view.appContent.find("#_mainMerchantBalancesCompoment");
    this.btnExport = this.self.find("#_mbl_btnExportExcel");
    this.btnToggleView = this.self.find("#_mbl_btnToggleView")[0];
    this.view_name = "date"; /** view_name = "date|merchant"  => date : "groub by date/merchant"  merchant: group by merchant regardless of any dates by summing up all amounts by merchant name */

    this.elFilter_type = this.self.find("#_mbl_filter_type");
    this.elFilter_sender = this.self.find("#_mbl_filter_sender");
    this.elFilter_startDate = this.self.find("#_mbl_filter_startdate");
    this.elFilter_endDate = this.self.find("#_mbl_filter_enddate");
    this.div_container = this.self.find("#div_merchant_balances")[0];
    this.div_summary = this.self.find("#_mbl_div_summary");
    this.elMerchantAmount = this.div_summary.find("#_mbl_merchant_amount");
    this.elMerchantAmountCurrency = this.div_summary.find("#_mbl_merchant_currency");
    this.elPackageCount = this.div_summary.find("#_mbl_package_count");

    this.currency_symbol = "$";
    this.currency_code = "USD";

    this.cols = [
        {
            title: "Date",
            className: "arrival_date",
            data: (data, index, tr) => {
                return [`<span class="arrival_date">`,
                    data.date,
                    `<span>`,
                ].join("");
            },
        },
        {
            title: "Merchant",
            className: "merchant",
            data: (data, index, tr) => {
                //let url = data.image_url ? data.image_url : '';
                return [
                    `<div class="d-flex flex-row">`,
                    //`<img class="img-thumbnail img-tbl-show" src="${url}" alt=""/>`,
                    ` <div class="p-1 d-flex flex-column"><span class="merchant-name">`,
                    data.sender_name,
                    `</span>`,
                    `<span class="merchant-code p-1 text-left text-muted">`,
                    data.code,
                    `</span></div>`,
                    `</div>`,
                ].join("");
            },
        },
        {
            title: "PCS",
            data: (data, a, b) => {
                return [data.package_count, ` pcs`].join("");
            },
        },
        {
            title: "COD",
            data: (data, a, b) => {
                if (data.cur_symbol) this.currency_symbol = data.cur_symbol;
                return [this.currency_symbol, " ", data.cod_amount].join("");
            },
        },
        {
            title: "Fees",
            data: (data, index, tr) => {
                if (data.cur_symbol) this.currency_symbol = data.cur_symbol;
                return [this.currency_symbol, " ", data.total_fees].join("");
            },
        },
        {
            title: "Taxi",
            data: (data, a, b) => {
                if (data.cur_symbol) this.currency_symbol = data.cur_symbol;
                return [this.currency_symbol, " ", data.forwarding_cost].join(
                    ""
                );
            },
        },
        {
            title: "Amount",
            className: "amount",
            data: (data, a, b) => {
                if (data.cur_symbol) this.currency_symbol = data.cur_symbol;
                let currency_code = data.currency_code
                    ? data.currency_code
                    : "USD";
                let cls_amount_color =
                    data.amount < 0 ? "text-success" : "text-danger";
                let amount = data.amount >= 0 ? data.amount : -data.amount;
                const formatted_amount = amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                return [
                    '<span class="fw-semibold ',
                    cls_amount_color,
                    '"><span>',
                    this.currency_symbol,
                    ' </span><span class="amount" data-currency="',
                    currency_code,
                    '">',
                    formatted_amount,
                    "</span></span>",
                ].join("");
            },
        },
        {
            title: "Account Info",
            data: (data, a, b) => {
                const bank_name = data.bank_name ? data.bank_name : "No Bank";
                return [
                    `<div class="d-flex flex-column">`,
                    `<div class="d-flex flex-row"><span class="p-1 text-success">`,
                    data.account_number,
                    `</span><span class="p-1"> (`,
                    bank_name,
                    `)</span></div>`,
                    `<div class="p-1">`,
                    data.account_name,
                    `</div>`,
                    `</div>`,
                ].join("");
            },
        },
        {
            title: "Action",
            data: (data, index, tr) => {
                //pmt_ clear payment
                return [
                    `<div class="d-flex gap-2">`,
                    `<a href="javascript:void(0)" data-id ="${data.id}" data-arrivaldate="${data.date}" class="_mbl_settle_pmt">
              <i class="fa fa-credit-card fs-5 text-success"></i>
            </a>`,
                    `<a href="javascript:void(0)" data-id ="${data.id}" data-arrivaldate="${data.date}" class="_mbl_merhant_invoice">
               <i class="fa fa-file-invoice fs-5 text-primary"></i>
            </a>`,
                    // `<a href="javascript:void(0)" data-id ="${data.id}" data-arrivaldate="${data.date}" class="_mbl_view_packages">
                    //   <i class="fa fa-list-alt text-warning fs-5"></i>
                    // </a>`,
                    `</div>`,
                ].join("");
            },
        },
    ];

    /** view_name = date|merchant*/
    this.initToggleView = (toggle = false) => {
        const icon = this.btnToggleView.querySelector("i");
        if (toggle) {
            if (this.view_name === "date") this.view_name = "merchant";
            else this.view_name = "date";
        }
        let clonedCols = [];
        icon.className = null;
        if (this.view_name === "date") {
            icon.classList.add("la", "la-calendar");
        } else {
            clonedCols = [...mThis.cols];
            clonedCols.shift();
            icon.classList.add("la", "la-user");
        }
        mThis.listView.showPage(mThis.getFilterData(), {
            columns: this.view_name === "date" ? mThis.cols : clonedCols,
        });
    };

    this.init = () => {
        if (mThis.initAlready) return;
        mThis.listView = new ListView("div_merchant_balances", {
            clientSidePagination: true,
            fetchApi: `${main_view.base_url}/api/merchant/outstanding-balances`,
            processResponse: (res) => {
                mThis.setColorTone(mThis.elFilter_type.val());
                if (res.status_code === 200) {
                    let d = StringSanitizer.sanitizeObject(res.data);

                    const total_amount = Number(d.total).toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    );

                    mThis.elMerchantAmount.text(total_amount);
                    mThis.elMerchantAmountCurrency.text(d.currency_code);
                    mThis.elPackageCount.text([d.total_count, " pcs"].join(""));
                    return d.items;
                } else {
                    cv_interact.warning(res.error_message);
                    return false;
                }
            },
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 5,
            columns: mThis.cols,
            listContainerClass: null,
            // 'beforeRender':()=>{
            //     mThis.setColorTone(mThis.elFilter_type.val());
            // }
        });

        this.tblBalances = mThis.listView.getTable();

        this.tblBalances.addEventListener("click", (e) => {
            e.preventDefault();

            /** Click on Settle Payment button => can be Receive or Pay to merchant */
            let btn = VSUtil.getElementByClass(e.target, "_mbl_settle_pmt");
            if (btn) {
                if (mThis.view_name === "date") {
                    cv_interact.warning(
                        "Please choose view by Merchant, not by date"
                    );
                    return;
                }

                //Get latest payment info for the merchant
                mThis.getlastPmtInfo(btn.dataset.id, (d) => {
                    let amount = Math.abs(d.total);
                    let tr = btn.closest("tr");
                    let td = tr.querySelector("td.merchant");
                    let id = btn.dataset.id;
                    const span_marchant =
                        td.querySelector("span.merchant-name");
                    let name = span_marchant.textContent;
                    let code = span_marchant.dataset.code;
                    let sender = { id: id, name: name, code: code };
                    if (amount == 0 && d.sender_id > 0) {
                        let p = {
                            packages: d.packages,
                            driver_id: id,
                            package_count: d.total_count,
                            currency_code: d.currency_code,
                            total: amount,
                            //"remarks":"Zero settlement"
                        };
                        cv_interact.confirm(
                            `ទូទាត់បញ្ចប់ទឹកប្រាក់ 0 USD សំរាប់ ${d.total_count} កញ្ចប់`,
                            { context: "update", title: "Merchant Settlement" },
                            (e) => {
                                if (e) {
                                    vsapi
                                        .call(
                                            `${main_view.base_url}/api/merchant/payment/settle-zero`,
                                            p,
                                            null
                                        )
                                        .then((res) => {
                                            if (res.status_code === 200) {
                                                mThis.listView.showPage(
                                                    mThis.getFilterData()
                                                );
                                                cv_interact.success(
                                                    "Settlement for zero amount succeeded!"
                                                );
                                            } else
                                                cv_interact.error(
                                                    "Merchant settlement for zero amount failed"
                                                );
                                        });
                                }
                            }
                        );
                        return;
                    }

                    const list_type = (
                        mThis.elFilter_type.val() + ""
                    ).toLowerCase();
                    if (["receivable", "payable"].indexOf(list_type) < 0) {
                        cv_interact.warning(
                            "Please choose list type as Payable or Receivable"
                        );
                        return;
                    }
                    const op = {
                        id: id,
                        prep_api: `${main_view.base_url}/api/merchant/payment/form-options`,
                        type: list_type == "payable" ? "pay" : "receive",
                        agent_name: sender.name,
                        showCheck: false,
                        currency: mThis.currency_code,
                        amount: amount,
                        primaryMethod: {
                            name: "ABA",
                            image: "",
                            currencies: [
                                {
                                    //"name":"USD",
                                    code: "USD",
                                    amount: amount,
                                },
                                {
                                    //"name":"KHR",
                                    code: "KHR",
                                    amount: 0,
                                },
                            ],
                        },
                        exchangeInfo: {
                            currencyPair: d.exchange_info.currency_pair,
                            buyRate: d.exchange_info.buy_rate,
                        },
                        extraField: {
                            label: "Package Count: ",
                            value: [d.total_count, " pcs"].join(""),
                        },
                        autoClose: false,
                        onClose: (p, btnOK) => {
                            p.agent_id = id;
                            p.agent_type = "merchant";
                            //p.trx_type='Disbursement'; //never add this trx_type to avoid critical problem
                            p.package_count = d.total_count;
                            p.packages = d.packages;
                            const api_method =
                                list_type == "payable" ? "pay" : "receive";
                            vsapi
                                .call(
                                    `${main_view.base_url}/api/merchant/payment/${api_method}`,
                                    p,
                                    btnOK,
                                    false
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        mThis.listView.showPage(
                                            mThis.getFilterData()
                                        );
                                        PmtDialog.close();
                                        cv_interact.success(
                                            "Merchant Settlement succeeded!"
                                        );
                                    } else
                                        cv_interact.warning(res.error_message);
                                });
                        },
                    };
                    PmtDialog.show(op);
                });

                return;
            }

            /** Click on View Merchant Invoices (for Unpaid items only) */
            btn = VSUtil.getElementByClass(e.target, "_mbl_merhant_invoice");
            if (btn) {
                const sender_id = btn.dataset.id;
                let p = mThis.getFilterData();
                if (!p.sender_id || p.sender_id == 0) p.sender_id = sender_id;
                p.sender_pmt_status_id = 0;
                //This hs_mermchant_invoice route recognize "wid" as warehouse_id
                p.wid = p.warehouse_id;
                if (!p.sender_id) {
                    cv_interact.warning(
                        "It seems that merchant identity is missing"
                    );
                    return;
                }

                if (mThis.view_name == "merchant") {
                    p.start_date = mThis.elFilter_startDate.val();
                    p.end_date = mThis.elFilter_endDate.val();
                } else {
                    //View by each Date
                    p.start_date = btn.dataset.arrivaldate;
                    p.end_date = p.start_date;
                }

                let qstring = ReportCenterComponent.translateToQueryString(p);
                let data = {
                    data: ["rtype=hs_merchant_invoice&", qstring].join(""),
                };
                vsapi
                    .call(
                        `${main_view.base_url}/api/encryptData`,
                        data,
                        false,
                        false
                    )
                    .then((res) => {
                        let d = {};
                        if (res.error_message) {
                            cv_interact.error(res.error_message);
                            return false;
                        } else {
                            d = res.data ? res.data : res;
                        }

                        window.open(
                            [
                                main_view.base_url,
                                "/hs-merchant-invoice/",
                                d,
                            ].join(""),
                            "_blank"
                        );
                        return false;
                    });

                return;
            }
        });

        this.btnExport.on("click", (e) => {
            e.preventDefault();
            VSRoute.loadScript(
                `${main_view.asset_url}/js/xlsx/xlsx.full.min.js`
            ).then(() => {
                mThis.exportToExcel_payables();
            });
        });

        mThis.elFilter_sender.on("change", function (e) {
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.elFilter_startDate.on("change", function (e) {
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.elFilter_type.on("change", (e) => {
            e.preventDefault();
            mThis.current_type = e.target.value;
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.elFilter_endDate.on("change", function (e) {
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.btnToggleView.addEventListener("click", (e) => {
            e.preventDefault();
            mThis.initToggleView(true);
        });

        mThis.initAlready = true;
    };

    this.getFilterData = () => {
        //static warehouse_id =1
        let p = {
            warehouse_id: 1,
            view_name: mThis.view_name,
            type: mThis.elFilter_type.val(),
            sender_id: mThis.elFilter_sender.val(),
            start_date: mThis.elFilter_startDate.val(),
            end_date: mThis.elFilter_endDate.val(),
        };
        if (p.search_value || p.sender_id > 0) p.current_page = 1;
        return p;
    };

    this.getlastPmtInfo = (sender_id, onFinish) => {
        let p = mThis.getFilterData();
        p.sender_id = sender_id;
        vsapi
            .call(
                `${main_view.base_url}/api/merchant/outstanding-balances`,
                p,
                null,
                false
            )
            .then((res) => {
                if (res.status_code === 200) {
                    let d = res.data;
                    onFinish(d);
                } else
                    cv_interact.warning(
                        "Failed to retrieve driver last payment summary"
                    );
            });
    };

    this.loadFilterOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/api/settings/options-sender`,
                null,
                null,
                false
            )
            .then((res) => {
                let senders = StringSanitizer.sanitizeObject(res.data, null);
                VSUtil.setComboItems(
                    mThis.elFilter_sender,
                    senders,
                    "id",
                    "sender_name",
                    true,
                    "(All Merchants)",
                    null
                );
                onFinish();
            });
    };

    this.show = (options = null) => {
        mThis.init(); //NOTE: initOnce only
        mThis.options = options ? options : {};
        mThis.loadFilterOptions(() => {
            //if(!AuthManager.access_mod(mThis.module_id,true)) return;
            mThis.initToggleView(false);
            mThis.elFilter_sender.val(0).trigger("change");
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop);
            mThis.self.fadeIn(250);
        });
    };

    this.setColorTone = (type) => {
        if (!mThis.tblBalances) return;
        mThis.div_container.classList.remove("payable", "receivable");
        mThis.div_container.classList.add(type);
        mThis.tblBalances.classList.remove("payable", "receivable");
        mThis.tblBalances.classList.add(type);
    };

    this.processMerchantPaybales = (data) => {
        let titles = [
            "date",
            "sender_name",
            "package_count",
            "cod_amount",
            "total_fees",
            "forwarding_cost",
            "amount",
            "account_number",
            "account_name",
            "bank_name",
        ];
        /** if group by Merchant name, then remove "Date" column */
        if (this.view_name === "date") titles.shift();

        let i = 0,
            c = null;
        let rows = [];
        do {
            c = data[i];
            if (!c) break;
            let item = {};
            titles.map((col) => {
                if (col === "forwarding_cost") {
                    item["taxi"] = c[col];
                } else if (col === "sender_name") {
                    item["merchant"] = c[col];
                } else {
                    const f_col = col.replace(/_/g, " ", col);
                    item[f_col] = c[col];
                }
            });
            rows.push(item);
            rows.push();
            i++;
        } while (c);
        return rows;
    };

    this.exportToExcel_payables = () => {
        let p = mThis.getFilterData();
        vsapi
            .call(
                `${main_view.base_url}/api/merchant/outstanding-balances`,
                p,
                null,
                false
            )
            .then((res) => {
                if (res.status_code === 200) {
                    const d = res.data ? res.data : {};
                    let items = d.items;
                    let file_name = `merchant-${p.type}`;
                    const data = mThis.processMerchantPaybales(items);
                    JsonToExcel.exportToExcel(data, file_name, null);
                } else cv_interact.warning(re.error_message);
            });
    };
})();
