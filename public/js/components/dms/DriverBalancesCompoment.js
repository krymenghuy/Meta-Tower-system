var DriverBalancesCompoment = new (function () {
    let mThis = this;
    // this.module_id =206;
    this.title_prop = "Driver Balances";
    this.current_type = "receivable"; //By default, show Payables page
    this.self = main_view.appContent.find("#_mainDriverBalancesCompoment");
    //this.tblBalances = this.self.find('#_dbl_tblBalances');
    this.btnExport = this.self.find("#_dbl_btnExportExcel");

    this.btnToggleView = this.self.find("#_dbl_btnToggleView")[0];

    //this.elFilter_type = this.self.find('#_dbl_filter_type');
    this.elFilter_driver = this.self.find("#_dbl_filter_driver");
    this.elFilter_startDate = this.self.find("#_dbl_filter_startdate");
    this.elFilter_endDate = this.self.find("#_dbl_filter_enddate");
    this.elSearch = this.self.find("#_dbl_search_driver");
    this.div_container = this.self.find("#div_driver_balances");

    this.div_summary = this.self[0].querySelector("#_dbl_div_summary");
    this.div_alert_list = this.self[0].querySelector('#_dbl_alert_list');
    this.elDriverAmount = this.div_summary.querySelector("#_dbl_driver_amount");

    this.elDriverAmountCurrency = this.div_summary.querySelector("#_dbl_driver_currency");
    this.elPackageCount = this.div_summary.querySelector("#_dbl_package_count");
     
    this.view_name = "date";

    mThis.cols = [
        {
            title: "Finish Date",
            className: "finish_date",
            data: (data, index, tr) => {
                return [
                    '<span class="finish_date">',
                    data.finish_date,
                    "</span",
                ].join("");
            },
        },
        {
            title: "ID",
            className: "driver-code",
            data: (data, index, tr) => {
                return data.driver_code;
            },
        },
        {
            title: "Driver",
            className: "driver",
            data: (data, index, tr) => {
                return [
                    `<span data-code="`,
                    data.driver_code,
                    `" class="driver-name d-block">`,
                    data.driver_name,
                    `</span><span class="driver-phone d-block text-left text-muted">`,
                    data.phone_number,
                    `</span>`,
                ].join("");
            },
        },
        {
            title: "Package Count",
            className: "package-count",
            data: (data, index, tr) => {
                const cod_change_count = data.cod_change_count> 0? [`<span class="d-block p-1 text-danger">(`,data.cod_change_count,` COD changes)</span>`].join('') : ``;
                return [
                    '<span class="package-count">',
                    data.package_count,
                    "</span> pcs",cod_change_count
                ].join("");
            },
        },
        {
            title: "Amount",
            className: "amount",
            data: (data, index, tr) => {
                const cur_symbol = data.currency_symbol || "$";
                const amount = Number(data.amount).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                return [
                    "<span><span>",
                    cur_symbol,
                    ' </span><span class="amount">',
                    amount,
                    "</span></span>",
                ].join("");
            },
        },
        {
            title: "Remarks",
            className: "remarks",
            data: (data, index, tr) => {
                let color_class = "text-danger";
                if ((data.trx_status + "").toLowerCase() == "pending")
                    color_class = "text-warning";
                return [
                    '<span class="d-block fw-semibold ',
                    color_class,
                    '">',
                    data.trx_status,
                    "</span>",
                    '<span class="d-block dark-text">',
                    data.trx_remarks,
                    "</span>",
                ].join("");
            },
        },
        {
            title: "Action",
            data: (data, index, tr) => {
                let btn_receive_pmt = data.driver_trx_id
                    ? ""
                    : `<a href="javascript:void(0)" data-id ="${data.id}" class="lnk-receive-pmt">
              <i class="fa fa-credit-card fs-5 text-success"></i>
            </a>`;
                return [
                    `<div class="d-flex gap-2">`,
                    ,
                    btn_receive_pmt,
                    `<a href="javascript:void(0)" data-id ="${data.id}" class="lnk-view-packages">
                <i class="fa fa-list-alt text-primary fs-5"></i>
              </a>
            </div>`,
                ].join("");
            },
        },
    ];

    this.setAlertInfo = (d)=>{
       mThis.div_alert_list.innerHTML = '';
       let total_count = 0, html = [`<div class="d-flex flex-row gap-2 p-1 mt-1">
         <a href="javascript:void(0)" class="lnk-list-driver" data-name="overude-all"><span class="dbl-alert-title text-info">All Dues</span></a>
       </div>`].join('');

       (d || []).map(m =>{
         let text_color = m.driver_count > 0 ? 'text-danger':'text-success';
         total_count += m.driver_count; 
         html =  [html,`<div class="d-flex flex-row gap-2 p-1 mt-1">
              <a href="javascript:void(0)" class="lnk-list-driver" data-name="`,m.name,`"><span class="dbl-alert-title ${text_color}">`,m.title,`</span><span class="prefix-colon dbl-alert-value ${text_color}">`,m.driver_count,`</span></a>
           </div>`].join(''); 
       });
       mThis.spanOverdueDriverCount = mThis.spanOverdueDriverCount || main_view.side_menus.querySelector("#overdue_driver_count");
       mThis.spanOverdueDriverCount.textContent = total_count;
       let vs_show =  (total_count <=0 || !total_count)? 'none':'block'; 
       mThis.spanOverdueDriverCount.parentNode.style.display = vs_show; 
       mThis.div_alert_list.innerHTML = html;
    }

    /** toggle view => view_name = date | merchant*/
    this.initToggleView = (toggle = false) => {
        const icon = this.btnToggleView.querySelector("i");
        if (toggle) {
            if (this.view_name === "date") this.view_name = "driver";
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
        
        mThis.listView = new ListView("div_driver_balances", {
            clientSidePagination: true,
            fetchApi: `${main_view.base_url}/dms/driver/balances`,
            processResponse: (res) => {
                let d = res.status_code === 200 ? res.data : {};

                const total_amount = Number(d.total).toLocaleString("en-US",{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });
                mThis.elDriverAmount.textContent = total_amount;
                mThis.elDriverAmountCurrency.textContent = d.currency_code;
                mThis.elPackageCount.textContent = [d.total_count, " pcs"].join(
                    ""
                );
                //console.log(d.od_cards);
                //NOTE: od_cards must be array = [{title,value, driver_count,package_count,amount,currency}, {title,value, driver_count,package_count,amount,currency}, ...]
                mThis.setAlertInfo(d.od_cards);
                return d.items;
            },
            rowCreated:(data,index,tr)=>{
                 //tr.dataset.trxid = (data.driver_trx_id || '').toLowerCase() =='null'? '' : data.driver_trx_id;
                 if(data.driver_trx_id)  tr.dataset.trxid = data.driver_trx_id;
            },
            apiCluster: main_view.apiCluster,
            tableClass: "table header-uppercase",
            perPage: 10,
            columns: mThis.cols,
            listContainerClass: null,
        });

        mThis.div_summary.addEventListener('click', e=>{
             e.preventDefault();
             //Click on each alert link to view details, listing overdue drivers
             let lnk = VSUtil.closestLimited(e.target,'.lnk-list-driver');
             if(lnk){
                let alert_name = lnk.dataset.name;
                let p = mThis.getFilterData();
                p.alert_name = alert_name;
                p.no_cache =1;
                mThis.listView.showPage(p); 
                return;
             }
        });

        mThis.tblBalances = mThis.listView.getTable();

        mThis.tblBalances.addEventListener("click", (e) => {
            e.preventDefault();

            let btn = VSUtil.closestLimited(e.target, ".lnk-receive-pmt");
            if (btn) {
                if (mThis.view_name === "date") {
                    cv_interact.warning(
                        "Please choose view by Driver, not by date"
                    );
                    return;
                }

                //Assume always receive money from Driver, no payment. NOTE that list_type = "receivable|payable"
                //const list_type = 'receivable'; // (mThis.elFilter_type.value+'').toLowerCase(); => depends on "d.total"

                //Get latest payment info for the driver
                mThis.getlastPmtInfo(btn.dataset.id, (d) => {
                    let trans_type = d.total < 0 ? "pay" : "receive";
                    let unpaid_total = Math.abs(d.unpaid_total);
                    let tr = btn.closest("tr");
                    let td = tr.querySelector("td.driver");
                    let id = btn.dataset.id;
                    const span_driver = td.querySelector("span.driver-name");
                    let name = span_driver.textContent;
                    let code = span_driver.dataset.code;
                    let driver = { id: id, name: name, code: code };

                    if (unpaid_total == 0 && d.driver_id > 0) {
                        let p = {
                            packages: d.packages,
                            driver_id: id,
                            package_count: d.total_count,
                            currency_code: "USD",
                            total: unpaid_total,
                            //"remarks":"Zero settlement"
                        };
                        cv_interact.confirm(
                            `ទូទាត់បញ្ចប់ទឹកប្រាក់ 0 USD សំរាប់ ${d.unpaid_count} កញ្ចប់`,
                            { context: "update", title: "Driver Settlement" },
                            (e) => {
                                if (e) {
                                    vsapi
                                        .call(
                                            `${main_view.base_url}/dms/driver/payment/settle-zero`,
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
                                                    "Driver settlement for zero amount failed"
                                                );
                                        });
                                }
                            }
                        );
                        return;
                    }

                    const op = {
                        id: id,
                        prep_api: `${main_view.base_url}/dms/driver/payment/form-options`,
                        type: trans_type,
                        agent_name: driver.name,
                        showCheck: false,
                        currency: mThis.currency_code,
                        amount: unpaid_total,
                        exchangeInfo: {
                            currencyPair: d.exchange_info.currency_pair,
                            buyRate: d.exchange_info.buy_rate,
                        },
                        autoClose: false,
                        extraField: {
                            label: "Package Count: ",
                            value: [d.unpaid_count, " pcs"].join(""),
                        },
                        onClose: (p, btnOK) => {
                            p.agent_id = id;
                            p.agent_type = "driver";
                            //p.trx_type='Receipt';//Never add this trx_type to avoid problem
                            p.package_count = d.unpaid_count;
                            p.packages = d.packages;
                            const api_method =
                                trans_type == "receive" ? "receive" : "pay";
                            vsapi
                                .call(
                                    `${main_view.base_url}/dms/driver/payment/${api_method}`,
                                    p,
                                    btnOK
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        const no_cache = 1;
                                        mThis.listView.showPage(
                                            mThis.getFilterData(no_cache)
                                        );
                                        PmtDialog.close();
                                        cv_interact.success("Payment success");
                                    } else
                                        cv_interact.warning(res.error_message);
                                });
                        },
                    };
                    PmtDialog.show(op);
                });
                return;
            }

            //Click on view package list
            btn = VSUtil.closestLimited(e.target, ".lnk-view-packages");
            if (btn) {
                let finish_date = null;
                const tr = btn.closest('tr');
                let trx_id = tr? tr.dataset.trxid: null;
                if (mThis.view_name === "date") {
                    finish_date = '';
                    if(tr){
                        finish_date = tr.querySelector("td.finish_date").querySelector("span.finish_date").textContent;
                    }
                }
                let p = {
                    warehouse_id: 1 /** default static warehouse 1*/,
                    driver_id: btn.dataset.id,
                    start_date: finish_date
                        ? finish_date
                        : mThis.elFilter_startDate.val(),
                    end_date: finish_date
                        ? finish_date
                        : mThis.elFilter_endDate.val(),
                    driver_name: null,
                    trx_id:trx_id
                };
                let params = [
                    "rtype=dr_unpaid_packages&wid=",
                    p.warehouse_id,
                    "&driverid=",
                    p.driver_id,
                    "&startdate=",
                    p.start_date,
                    "&enddate=",
                    p.end_date,
                    "&driverpmtstatusid=0",
                    "&drivername=",
                    p.driver_name,
                    "&trxid=",
                    p.trx_id
                ].join("");
                pdfReport.getEncryptData(encodeURI(params), (d) => {
                    window.open(
                        [main_view.base_url, "/dms-gen-report/", d].join(""),
                        "_blank"
                    );
                });
                return;
            }
        });

        // this.btnExport.on("click", (e) => {
        //     e.preventDefault();
        //     VSRoute.loadScript(
        //         `${main_view.asset_url}/js/xlsx/xlsx.full.min.js`
        //     ).then(() => {
        //         mThis.exportToExcel_payables();
        //     });
        //     mThis.initAlready = true;
        // });

        // mThis.elSearch.on("keyup", (e) => {
        //     e.preventDefault();
        //     setTimeout(() => {
        //         mThis.listView.showPage(mThis.getFilterData());
        //     }, 250);
        // });

        mThis.elFilter_driver.on("change", function (e) {
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
        });

        mThis.elFilter_startDate.on("change", function (e) {
            e.preventDefault();
            mThis.listView.showPage(mThis.getFilterData());
        });

        // mThis.elFilter_type.on('change',e=>{
        //     e.preventDefault();
        //     mThis.current_type = e.target.value;
        //     mThis.listView.showPage(mThis.getFilterData());
        // });

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

    this.getlastPmtInfo = (driver_id, onFinish) => {
        let p = mThis.getFilterData();
        p.driver_id = driver_id;
        vsapi
            .call(`${main_view.base_url}/dms/driver/balances`, p, false)
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
                `${main_view.base_url}/dms/settings/options-driver`,
                null,
                null,
                false
            )
            .then((res) => {
                let drivers = StringSanitizer.sanitizeObject(res.data, null);
                VSUtil.setComboItems(
                    mThis.elFilter_driver,
                    drivers,
                    "id",
                    "driver_name",
                    false,
                    null,
                    null
                );
                onFinish();
            });
    };

    this.getFilterData = (no_cache= 0) => {
        let p = {
            warehouse_id: 1,
            view_name: mThis.view_name,
            driver_id: mThis.elFilter_driver.val(),
            start_date: mThis.elFilter_startDate.val(),
            end_date: mThis.elFilter_endDate.val(),
            search_value:
                mThis.elFilter_driver.val() > 0
                    ? ""
                    : mThis.elSearch.val() /** If driver_id is provided then DO NOT use search_value*/,
        };
        //In case of user search => Ensure the database query starts with first page
        if (p.search_value || p.driver_id > 0) p.current_page = 1;
        p.no_cache = no_cache;
        return p;
    };

    this.show = (options = null) => {
        mThis.init(); //NOTE: initOnce only
        mThis.options = options ? options : {};

        mThis.loadFilterOptions(() => {
            mThis.initToggleView(false);
            //mThis.listView.showPage(mThis.getFilterData());
            mThis.self.siblings().hide();
            main_view.setTitle(mThis.title_prop);
            mThis.self.fadeIn(200);
        });
    };

    // this.processMerchantPaybales = (data)=>{
    //     let titles = ['date','sender_name','package_count','cod_amount','total_fees','forwarding_cost','amount','account_number','account_name','bank_name'];
    //     let i=0, c = null;
    //     let rows = [];
    //     do{
    //         c = data[i];
    //         if(!c) break;
    //          let item = {};
    //          titles.map(col=>{
    //             if(col==='forwarding_cost'){
    //                 item['taxi'] = c[col];
    //             }else if (col==='sender_name'){
    //                 item['merchant'] = c[col];
    //             }
    //             else{
    //                 const f_col = col.replace(/_/g,' ',col);
    //                 item[f_col] =c[col];
    //             }
    //          });
    //          rows.push(item);
    //         rows.push();
    //         i++;
    //     }while(c);
    //     return rows;
    // }

    // this.exportToExcel_payables = ()=>{
    //    let p = {'type':mThis.elFilter_type.val(),'driver_id':mThis.elFilter_driver.val(),'start_date':mThis.elFilter_startDate.val(),'end_date':mThis.elFilter_endDate.val()};
    //     vsapi.call(`${main_view.base_url}/dms/merchant/outstanding-balances`,p,null,false).then(res => {
    //         if(res.status_code===200){
    //             let items = res.data;
    //             let file_name ='merchant-payables';
    //             const data = mThis.processMerchantPaybales(items);
    //             JsonToExcel.exportToExcel(data,file_name,null);
    //         }
    //     });
    // }
})();
//END:: DriverBalancesComponent

const PmtDialog = new (function () {
    const mThis = this;
    this.self = main_view.appContent.children("#_pmt_dlgPmt");
    this.btnOK = this.self.find("#_pmt_dlgPmt_btnOK");
    this.lnkAddMethod = this.self.find("#_pmt_dlgPmt_lnkAddMethod");
    this.divOthers = this.self.find("div.pmt-other-methods")[0];
    this.divPmtInfo = this.self.find(".div-pmt-info")[0];
    this.elExchangeRate = this.divPmtInfo.querySelector(".exchange-rate");
    this.elTotal = this.divPmtInfo.querySelector(".amount");
    this.elExtraFieldLabel =
        this.divPmtInfo.querySelector(".extra-field-label");
    this.elExtraFieldText = this.divPmtInfo.querySelector(".extra-field-text");
    this.elTotalPaid = this.divPmtInfo.querySelector(".pmt-total-paid");
    this.divInputs = this.self.find("#pmt-inputs")[0];
    this.divPrimaryMethods = this.divInputs.querySelector("#primary_methods");
    this.divCheck = this.self.find("#pmt_method_check")[0];
    this.pmtMethods = [];

    this.elTitle = this.self.find(".modal-title")[0];
    this.elRemarks = this.divInputs.querySelector("input.remarks");

    this.lnkAddMethod.on("click", (e) => {
        e.preventDefault();
        if (!mThis.cnt) mThis.cnt = 0;
        mThis.cnt++;
        let m_id = ["_pmt_m_", mThis.cnt].join("");

        let html = [
            `<div id="${m_id}" class="mt-3 div-item d-flex flex-row justify-content-end align-items-center gap-2">`,
            `<div class="d-flex flex-column" style="min-width:150px">
                <label for="check_number" class="form-label control-label">Method</label>
                <select class="modal-select2 pmt-method data-input" data-field="pmt-method"></select>
            </div>`,
            `<div class="d-flex flex-column">
              <label for="amount_usd" class="form-label control-label">USD</label>
              <input type="number" class="amount-input form-control data-input" data-field="amount" data-currency="USD">
            </div>`,

            `<div class="d-flex flex-column">
              <label for="amount" class="form-label control-label">KHR</label>
              <input type="number" class="amount-input form-control data-input" data-field="amount" data-currency="KHR">
            </div>`,

            `<div class="d-flex flex-column">
            <label for="notes" class="form-label control-label">Notes</label>
            <input type="text" class="form-control data-input pmt-notes" data-field="notes">
          </div>`,
            `<div class="mt-4"><a href="javascript:void(0)" class="lnk-delete-pmt-method text-danger btn btn-sm btn-outline-danger">Remove</a></div>`,
            `</div>`,
        ].join("");
        this.divOthers.insertAdjacentHTML("beforeend", html);
        const div = mThis.self.find(`#${m_id}`);
        const el = div.find(`.pmt-method`);
        VSUtil.setComboItems(
            el,
            mThis.pmtMethods,
            "pmt_method",
            "pmt_method",
            false,
            null,
            null
        );
        el.select2({
            width: "100%",
        });

        div.find("a.lnk-delete-pmt-method").on("click", (e) => {
            e.preventDefault();
            div.remove();
            mThis.getData();
        });

        div[0].querySelectorAll("input.amount-input").forEach((el) => {
            el.addEventListener("keyup", (e) => {
                e.preventDefault();
                mThis.getData();
            });
        });
    });

    this.btnOK.on("click", (e) => {
        e.preventDefault();
        let p = mThis.getData();
        if (mThis.rem_amount > 0) {
            cv_interact.warning(
                [
                    "នៅខ្វះចំនួន ",
                    mThis.rem_amount,
                    " ",
                    mThis.options.currency_code,
                ].join("")
            );
            return;
        } else if (mThis.rem_amount < 0) {
            cv_interact.warning(
                [
                    "លើសចំនួន ",
                    Math.abs(mThis.rem_amount),
                    " ",
                    mThis.options.currency_code,
                ].join("")
            );
            return;
        } else {
            if (!mThis.rem_amount) {
                cv_interact.warning("សូមបញ្ចូលចំនួនទឹប្រាក់");
                return;
            }
        }

        if (typeof mThis.options.onClose === "function")
            mThis.options.onClose(p, mThis.btnOK);
        if (mThis.options.autoClose) mThis.self.modal("hide");
    });

    this.close = () => {
        mThis.self.modal("hide");
    };

    /** cconvert the amount to USD if it is not given in USD*/
    this.convertAmount = (amount, f_currency) => {
        if (
            f_currency.toUpperCase() ==
            mThis.options.currency_code.toUpperCase()
        ) {
            return parseFloat(amount);
        } else {
            let x_rate = parseFloat(mThis.elExchangeRate.textContent);
            if (x_rate === 0 || !x_rate) {
                x_rate = 1;
                mThis.elExchangeRate.textContent = x_rate;
            }
            return parseFloat(amount) / x_rate;
        }
    };
    //Get total amount including (Cash, Check, Bank in USD and KHR) input by user
    this.getData = () => {
        let total = 0;
        /** Every breakdown_item is {"pmt_method":"Cash","amount":0,"currency":"USD","notes":" some notes"} */
        let breakdowns = [];

        //Get Total amount from Primary method list
        mThis.divPrimaryMethods
            .querySelectorAll("div.pmt-method")
            .forEach((m_div) => {
                let elNotes = null;
                m_div.querySelectorAll(".amount-input").forEach((el) => {
                    let item = { pmt_method: m_div.dataset.name };
                    item.amount = el.value;
                    item.currency_code = el.dataset.currency;
                    elNotes = elNotes || m_div.querySelector("input.notes");
                    item.notes = elNotes.value;
                    if (item.amount > 0) {
                        item.exchange_rate = mThis.elExchangeRate.textContent;
                        total += mThis.convertAmount(
                            item.amount,
                            item.currency_code
                        );
                        breakdowns.push(item);
                    }
                });
            });

        //*** Get Check Amount
        if (mThis.options.showCheck) {
            let item = { pmt_method: "Check" };
            let c_currency = "";
            mThis.divCheck.querySelectorAll(".data-input").forEach((el) => {
                let f = el.dataset.field;
                item[f] = el.value;
                if (f === "amount") {
                    c_currency = el.dataset.currency;
                    total += mThis.convertAmount(item[f], item.currency_code);
                }
            });

            //Set default currency for the Check or Cheque
            item.currency_code = c_currency;
            item.exchange_rate = mThis.elExchangeRate.textContent;
            if (item.amount > 0 && item.currency_code) breakdowns.push(item);
        }

        //Get amounts from other pmt methods
        this.divOthers.querySelectorAll("div.div-item").forEach((div) => {
            let elPmtMethod = null;
            let elNotes = null;

            div.querySelectorAll(".amount-input").forEach((el) => {
                let item = {};
                if (!elPmtMethod)
                    elPmtMethod = div.querySelector(".pmt-method");
                if (!elNotes) elNotes = div.querySelector("input.pmt-notes");

                item.pmt_method = elPmtMethod.value;
                item.amount = el.value;
                if (item.amount > 0) {
                    item.currency_code = el.dataset.currency;
                    item.exchange_rate = mThis.elExchangeRate.textContent;
                    total += mThis.convertAmount(
                        item.amount,
                        item.currency_code
                    );
                    item.notes = elNotes.value;
                    breakdowns.push(item);
                }
            });
        });
        total = Number(total).toFixed(2);
        let org_total = parseFloat(mThis.elTotal.textContent);
        let rem_amount = Number(org_total - total).toFixed(2);
        let rem_text = "";
        if (rem_amount > 0) {
            rem_text = [
                `<span class="border border-warning text-warning mt-2 p-2 rounded-4">នៅខ្វះ `,
                rem_amount,
                " ",
                mThis.options.currency_code,
                "</span>",
            ].join("");
        } else {
            if (rem_amount == 0 || rem_amount == 0.0) {
                rem_text = [
                    `<span class="border border-success text-success p-2 rounded-4">គ្រប់ចំនួន</span>`,
                ].join("");
            } else {
                rem_text = [
                    `<span class="text-danger border border-danger mt-2 p-2 rounded-4">លើស `,
                    Math.abs(rem_amount),
                    " ",
                    mThis.options.currency_code,
                    "</span>",
                ].join("");
            }
        }
        mThis.rem_amount = rem_amount;
        mThis.elTotalPaid.innerHTML = rem_text;
        return {
            total: total,
            currency_code: mThis.options.currency
                ? mThis.options.currency
                : mThis.options.currency_code,
            remarks: mThis.elRemarks.value,
            breakdowns: breakdowns,
        };
    };

    /** User can add one primary payment method (most visbile method) such as ABA, or CASH
    * methodInfo = {
        "name":"ABA",
        "currencies": [ {name:'American Dollar',code:'USD','amount'}]
      }
    * pmt_method's name = "Cash|ABA|..."
    * currencies = [ {name:'American Dollar',code:'USD','amount'}]*/
    this.addPrimaryMethod = (methodInfo) => {
        let html_cur_amounts = null;
        methodInfo.currencies.map((c) => {
            html_cur_amounts = [
                html_cur_amounts,
                `<div class="d-flex flex-column">
        <label for="amount" class="form-label">`,
                c.name ? c.name : c.code,
                `</label>
          <input type="number" value="`,
                c.amount ? c.amount : 0,
                `" class="amount-input form-control data-input" data-field="amount" data-currency="`,
                c.code,
                `">
        </div>`,
            ].join("");
        });

        let html = [
            `<div data-name="${methodInfo.name}" class="pmt-method ${methodInfo.name} d-flex flex-row justify-conten-center align-items-center gap-2">`,
            `<div class="pt-3" style="width:100px">
              <span class="fw-semibold">${methodInfo.name.toUpperCase()}</span>
          </div>`,
            html_cur_amounts,
            `<div class="d-flex flex-column">
              <label for="amount" class="form-label">Notes</label>
              <input type="text" class="notes form-control" data-field="notes">
          </div>`,
            `</div>`,
        ].join("");
        mThis.divPrimaryMethods.innerHTML = html;

        mThis.divPrimaryMethods
            .querySelectorAll(".amount-input")
            .forEach((el) => {
                el.addEventListener("keyup", (e) => {
                    e.preventDefault();
                    mThis.getData();
                });
            });

        //Refresh to the Total amount displays
        mThis.getData();
    };

    this.prepareForm = (options, onFinish) => {
        let p = { id: options.id };
        const formOptionsApi = options.prep_api
            ? options.prep_api
            : options.formOptionsApi;
        vsapi.call(formOptionsApi, p, false).then((res) => {
            let d = res.status_code == 200 ? res.data : {};
            const ps = d.pmtMethods ? d.pmtMethods : [];
            mThis.pmtMethods = ps.filter((f) => {
                const x = f.pmt_method.toLowerCase();
                if (options.showCheck)
                    return x != "cheque" && x != "check" && x != "cash";
                else return x != mThis.options.primaryMethod.name.toLowerCase();
            });
            onFinish(d);
        });
    };

    this.show = (options = null) => {
        mThis.rem_amount = null;
        mThis.divOthers.innerHTML = "";
        mThis.options = options;
        mThis.options.currency_code = options.currency_code || options.currency;
        mThis.elTotalPaid.textContent = "";

        mThis.elExtraFieldLabel.innerHTML = options.extraField.label;
        if (!options.extraField.value)
            options.extraField.value = options.extraField.html;
        mThis.elExtraFieldText.innerHTML = options.extraField.value;

        if (!mThis.options.primaryMethod) {
            mThis.options.primaryMethod = {
                name: "Cash",
                image: "",
                currencies: [
                    {
                        name: "USD",
                        code: "USD",
                        amount: mThis.options.amount,
                    },
                    {
                        name: "KHR",
                        code: "KHR",
                        amount: 0,
                    },
                ],
            };
        }

        mThis.prepareForm(options, (d) => {
            if (!mThis.options.currency_code) {
                mThis.options.currency_code = d.currency_code;
                mThis.options.local_currency = d.local_currency;
            }
            if (!mThis.options.exchangeInfo) {
                mThis.options.exchangeInfo = {
                    date: d.exchange_info.x_date
                        ? d.exchange_info.x_date
                        : d.exchange_info.date,
                    currencyPair: d.exchange_info.currency_pair,
                    buyRate: d.exchange_info.buy_rate,
                    sellRate: d.exchange_info.sell_rate,
                };
            }
            //Set default currency to USD if no currency is provided
            if (!mThis.options.currency_code)
                mThis.options.currency_code = "USD";
            let exchange_rate =
                mThis.divPmtInfo.querySelector(".exchange-rate").textContent;
            //Set default exchange rate to 1 if it is not provided
            if (!exchange_rate || exchange_rate == 0) exchange_rate = 1;

            if (options.type === "receive") {
                mThis.divPmtInfo.querySelector(".amount").className =
                    "amount text-success";
                mThis.divPmtInfo.querySelector(".currency").className =
                    "currency text-success";
                mThis.elTitle.textContent = "Receive Payment";
            } else {
                mThis.elTitle.textContent = [
                    "Pay to ",
                    options.agent_name,
                ].join("");
                mThis.divPmtInfo.querySelector(".amount").className =
                    "amount text-danger";
                mThis.divPmtInfo.querySelector(".currency").className =
                    "currency text-danger";
            }

            mThis.divPmtInfo.querySelector(".agent-name").textContent =
                options.agent_name ? options.agent_name : " Unknown";
            mThis.divPmtInfo.querySelector(".agent-label").textContent =
                options.type == "receive" ? "Payer Name :" : "Payee :";
            mThis.divPmtInfo.querySelector(".amount").textContent = Math.abs(
                options.amount
            );
            mThis.divPmtInfo.querySelector(".currency").textContent =
                mThis.options.currency_code;
            mThis.divPmtInfo.querySelector(".exchange-rate-text").textContent =
                [
                    LocaleManager.trans("Exchange Rate", "titles"),
                    ` (${mThis.options.exchangeInfo.currencyPair}) : `,
                ].join("");
            mThis.elExchangeRate.textContent =
                mThis.options.exchangeInfo.buyRate;
            ////mThis.divPmtInfo.querySelector('.exchange-rate').textContent = [d.exchange_rate,' ',d.local_currency].join('');

            if (mThis.options.showCheck) {
                //mThis.divCheck.style.display="block";
                mThis.divCheck.innerHTML = [
                    `<div class="pt-3" style="width:100px">
                    <span class="fw-semibold">CHEQUE</span>
              </div>`,
                    `<div class="d-flex flex-column">
                <label for="amount" class="form-label control-label">Cheque Amount</label>
                <input type="number" class="data-input form-control" data-field="amount" data-currency="USD">
            </div>`,
                    `<div class="d-flex flex-column">
                <label for="check_number" class="form-label control-label">Cheque Number</label>
                <input type="text" class="form-control data-input" data-field="check_number">
            </div>`,
                    `<div class="d-flex flex-column">
                <label for="check_number" class="form-label control-label">Notes</label>
                <input type="text" class="form-control data-input" data-field="notes">
            </div>`,
                ].join("");
            } else {
                //mThis.divCheck.style.display ="none";
                mThis.divCheck.innerHTML = null;
            }

            /** Set the primary or Most visible Payment method such Cash in USD and KHR currencies. Sometime primary method is "ABA Bank" */
            mThis.addPrimaryMethod(mThis.options.primaryMethod);

            mThis.elRemarks.value = "";
            // let div = mThis.divInputs.querySelector('div.pmt-method-cash');
            // div.querySelectorAll('.data-input').forEach(el =>{
            //    let f = el.dataset.field;
            //    if(f === 'amount') el.value = 0;
            //    else el.value ='';
            // });

            mThis.self.modal({
                backdrop: "static",
            });
        });
    };
})();
