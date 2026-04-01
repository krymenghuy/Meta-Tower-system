"use strict";

var BillPaymentComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Payment Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_payment_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBillPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill_payment");

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };

    mThis.cols = [
        { title: "", className: "align-middle" },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => {
                return `
                    <span class="d-block text-nowrap text-prm-custom fw-semibold">${data.bill_number ?? ""}</span>
                    <span class="d-block text-prm-custom text-nowrap">${data.payment_date}</span>`;
            },
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.vendor_name ?? ""}</span>`,
        },
        {
            transTitle: "titles.Payer",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.payer ?? ""}</span>`,
        },
        {
            transTitle: "titles.Reference No",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Payment Method",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.payment_method ?? "_"}</span>`,
        },
        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.total_amount)}</span>`,
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`,
        },
        {
            title: "Balance",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.balance)}</span>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action"
                        data-id="${data.id}" data-vendorId="${data.vendor_id || ''}"
                        data-statusid="${data.status_id || ''}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];
    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillPaymentListView = new ListView("_bill_payment_list", {
            fetchApi: `${main_view.base_url}/prm/bill-payment/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                tr.dataset.vendorid = data.vendor_id;
                tr.dataset.billid = data.bill_id;
                tr.dataset.fileurl = data.file_image_url ?? "";
                tr.classList.add("bill");
                tr.setAttribute("id", `bill_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
            };
            BillPaymentDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillPaymentListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => { sh_parent.style.maxHeight = window.innerHeight - 200 + "px"; };

        const tblBill = mThis.BillPaymentListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_payment_list_table";
        mThis.initDropdownMenus(tblBill);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            }, 250);
        });

        new ExpandableRowConfig(tblBill.id, {
            dontExpandByClickingOn: ["btn_dropdown_vendor_action"],
            onOpen: (container, detail_tr, parent_tr) => {
                const bill_id = parent_tr.dataset.billid;
                if (bill_id && !isNaN(bill_id)) mThis.displayBillDetail(container, bill_id);
            }
        });

        mThis.initAlready = true;
    };

    mThis.displayBillDetail = (container, bill_id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;

        vsapi.call(`${main_view.base_url}/prm/bill-payment/form-options`, { bill_id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load bill details</div>`;
                    return;
                }
                mThis.renderBillDetail(container, res.data || {});
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading bill details</div>`;
            });
    };

    mThis.renderBillDetail = (container, data) => {
        const bill     = data.bill || {};
        const payments = data.payments || [];
        const currency = "$";
        const fmt = n => Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

        const paymentsHtml = payments.map(p => `
            <tr>
                <td class="text-center text-nowrap">${p.payment_date ?? "—"}</td>
                <td>${p.payer ?? "—"}</td>
                <td class="text-center text-capitalize">${p.payment_method ?? "—"}</td>
                <td class="text-center">${p.currency_code ?? "USD"}</td>
                <td class="text-end fw-semibold text-success">${currency}${fmt(p.amount)}</td>
            </tr>
        `).join("");

        container.innerHTML = `
        <div class="bg-white rounded shadow-sm p-3">

            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h6 class="fw-bold mb-1 text-uppercase text-primary">Bill Payment Receipt</h6>
                    <small class="text-muted">Bill No: <span class="fw-semibold text-dark">${bill.bill_number ?? "—"}</span></small>
                </div>
                <span class="badge fs-6 px-3 py-2 ${
                    bill.status_id == 2 ? 'bg-success' :
                    bill.status_id == 3 ? 'bg-warning text-dark' : 'bg-danger'
                }">
                    ${bill.status ?? "Unpaid"}
                </span>
            </div>

            <hr class="my-2">

            <div class="row g-2 mb-3">
                <div class="col-md-6">
                    <small class="text-muted text-uppercase fw-semibold" style="font-size:0.7rem;">Vendor</small>
                    <p class="mb-1 fw-semibold">${bill.vendor_name ?? "—"}</p>
                    <small class="text-muted">${bill.phone_number ?? ""}</small>
                </div>
                <div class="col-md-6 text-md-end">
                    <small class="text-muted text-uppercase fw-semibold" style="font-size:0.7rem;">Expense Type</small>
                    <p class="mb-1">${bill.expense_type_name ?? "—"}</p>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-sm table-bordered mb-0">
                    <thead style="background:#f0f4ff;">
                        <tr>
                            <th class="text-center" style="width:120px;">Payment Date</th>
                            <th class="text-center">Payer</th>
                            <th class="text-center" style="width:130px;">Method</th>
                            <th class="text-center" style="width:80px;">Currency</th>
                            <th class="text-end"    style="width:120px;">Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paymentsHtml || '<tr><td colspan="5" class="text-center py-4 text-muted">No payments recorded</td></tr>'}
                    </tbody>
                    <tfoot class="table-light fw-bold">
                        <tr>
                            <td colspan="4" class="text-end text-muted small">Total Amount</td>
                            <td class="text-end text-primary">${currency}${fmt(bill.total_amount)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-end text-muted small">Amount Paid</td>
                            <td class="text-end text-success">${currency}${fmt(bill.paid_amount)}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="text-end text-muted small">Remaining Balance</td>
                            <td class="text-end fw-bold fs-6 text-success">
                                ${currency}${fmt(bill.balance)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="text-end mt-3 no-print">
                <button class="btn btn-sm btn-outline-primary" onclick="window.print()">
                    <i class="bi bi-printer me-1"></i> Print Receipt
                </button>
            </div>
        </div>`;
    };

    mThis.getFilterData = () => {
        let p = {
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
                {
                    html: '<span class="ps-2">View Detail</span>',
                    icon: `<i class="fa-solid fa-print" style="color: rgb(22, 80, 137);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_bill",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "delete_bill": mThis.deleteBill(id, menuLink); break;
                    case "view_bill":   mThis.viewBill(id, menuLink);   break;
                    default: break;
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.viewBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const bill_id = tr?.dataset.billid;
        if (!bill_id) return cv_interact.error("Bill ID not found.");

        const expandedContainer = tr?.nextElementSibling?.querySelector(".expandable-content");
        if (expandedContainer) {
            mThis.displayBillDetail(expandedContainer, bill_id);
        }
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
            bill_id: tr?.dataset.billid || null,
            vendorid: tr?.dataset.vendorid || null,
            btn: menuLink,
            onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        BillPaymentDialog.show(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm("Delete this Bill Record?",
            { transTitle: "Delete Bill Record", context: "delete", confirmButtonText: "Delete" },
            function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/bill/delete`, { id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(res.message || "Bill record has been deleted.");
                                mThis.BillPaymentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message || "Failed to delete bill record.");
                            }
                        });
                }
            }
        );
    };

    mThis.viewAttachment = (id) => {
        vsapi.call(`${main_view.base_url}/prm/bill/view-attachment`, { id }, false, false, false)
            .then((res) => {
                if (res.status_code !== 200) { cv_interact.error(res.error_message || "No attachment found."); return; }
                const { data_url, ext } = res.data;
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;";
                const wrapper = document.createElement("div");
                wrapper.style.cssText = "position:relative;max-width:90vw;max-height:90vh;";
                const isImage = ["png","jpg","jpeg"].includes(ext);
                const isPdf   = ext === "pdf";
                if (isImage) {
                    const img = document.createElement("img");
                    img.src = data_url;
                    img.style.cssText = "max-width:100%;max-height:90vh;border-radius:8px;box-shadow:0 4px 32px #000;";
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data_url;
                    iframe.style.cssText = "width:80vw;height:85vh;border:none;border-radius:8px;";
                    wrapper.appendChild(iframe);
                } else {
                    document.body.removeChild(overlay);
                    window.open(data_url, "_blank");
                    return;
                }
                const btnClose = document.createElement("button");
                btnClose.style.cssText = "position:absolute;top:-16px;right:-16px;border:none;background:#fff;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;line-height:1;";
                btnClose.innerHTML = "&times;";
                btnClose.onclick = (e) => { e.stopPropagation(); document.body.removeChild(overlay); };
                wrapper.appendChild(btnClose);
                overlay.appendChild(wrapper);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
            });
    };

    mThis.printBill = (id, menuLink) => {
        let op = {
            id: null,
            btn: menuLink,
            onClose: () => mThis.BillPaymentListView.showPage(),
        };
        alert("coming soon!");
    };

    mThis.billPayment = (id) => {
        BillPaymentDialog.show({
            id: null,
            bill_id: id,
            btn: null,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            },
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, "id", "vendor", "", "All Vendor", "");
                VSUtil.setComboItems(mThis.elFilter_status, d.bill_statuses, "id", "bill_status", "", "All Statuses", "");
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.btnAdd.classList.add("d-none");
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillPaymentListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();


const BillPaymentDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => {
                return [
                    `<div class="row g-3">
                        <input name="vendorid" class="d-none data-input form-control" data-field="vendor_id">

                        <div class="col-md-5">
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="vendor" class="data-input form-control" data-field="vendor_name" placeholder="Payee (Vendor)" readonly>
                                <label style="color:#777777;padding-left:6px;">Vendor</label>
                            </div>
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " readonly>
                                <label style="color:#777777;padding-left:6px;">Contact</label>
                            </div>
                            <div class="material-input outlined">
                                <input type="text" name="payer" class="data-input form-control" data-field="payer" placeholder=" " >
                                <label style="color:#777777;padding-left:6px;">Payer</label>
                            </div>
                            <div class="material-input outlined">
                               <select data-style="material" name="payment_method" class="data-input form-control" data-field="payment_method" placeholder="Payment Method">
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-2"></div>
                        <div class="col-md-5">
                            <div class="material-input outlined">
                                <input type="text" data-type="date" name="payment_date" required class="data-input form-control" data-field="payment_date" />
                                <label style="color:#777777;padding-left:6px;">Payment Date</label>
                            </div>
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="bill_number" class="data-input form-control" data-field="bill_number" placeholder=" " readonly>
                                <label style="color:#777777;padding-left:6px;">Bill Number</label>
                            </div>
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="expense_type" class="data-input form-control" placeholder=" " readonly>
                                <label style="color:#777777;padding-left:6px;">Expense Type</label>
                            </div>
                            <div class="material-input outlined">
                                <select data-style="material" name="currency_code" class="data-input form-control" data-field="currency_code" placeholder="Currency">
                                    <option value="USD">USD - $</option>
                                    <option value="KHR">KHR - ៛</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="material-input outlined bg-light rounded">
                                <input name="total_amount" class="form-control text-end" style="cursor:not-allowed;" readonly>
                                <label class="text-muted small px-2">Total Amount</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="material-input outlined bg-light rounded">
                                <input name="paid_amount" data-field="paid_amount" class="form-control text-end" style="cursor:not-allowed;" readonly>
                                <label class="text-muted small px-2">Already Paid</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="material-input outlined border-primary">
                                <input name="amount" data-field="amount" class="data-input form-control text-end fw-bold" placeholder="0.00">
                                <label class="text-primary px-2">Paying Now</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="material-input outlined bg-light rounded">
                                <input name="balance" class="form-control text-end fw-bold" style="cursor:not-allowed; color:#dc3545;" readonly>
                                <label class="fw-bold px-2" style="color:#dc3545;">Remaining</label>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="note" placeholder=" "></textarea>
                                <label style="color:#777777;padding-left:6px;">Description</label>
                            </div>
                        </div>
                    </div>`
                ].join("");
            },

            prepareFormOptions: {
                createTitle: "Bill Payment Voucher",
                modifyTitle: "Process Payment",
                targetProp: "bill",
                api: {
                    endpoint: `${main_view.base_url}/prm/bill-payment/form-options`,
                    params: (op) => ({
                        bill_id: op.bill_id || op.id || null
                    })
                }
            },

            onPrepareForm: (me, data) => {
                const bill = data?.bill || data?.bill_details;

                if (!bill || !bill.id) {
                    console.error("Bill data is missing in response", data);
                    cv_interact.warning("Could not load bill details.");
                    return;
                }

                if (me.controls.vendor)       me.controls.vendor.value       = '';
                if (me.controls.phone_number) me.controls.phone_number.value = '';
                if (me.controls.expense_type) me.controls.expense_type.value = '';
                if (me.controls.bill_number)  me.controls.bill_number.value  = '';
                if (me.controls.total_amount) me.controls.total_amount.value = '';
                if (me.controls.paid_amount)  me.controls.paid_amount.value  = '';
                if (me.controls.balance)      me.controls.balance.value      = '';
                if (me.controls.amount)       me.controls.amount.value       = '';
                if (me.controls.payer)        me.controls.payer.value        = '';
                if (me.controls.note)         me.controls.note.value         = '';

                if (me.controls.vendor)       { me.controls.vendor.value       = bill.vendor_name || '';                    me.controls.vendor.readOnly       = true; }
                if (me.controls.phone_number) { me.controls.phone_number.value = bill.phone_number || '';                   me.controls.phone_number.readOnly = true; }
                if (me.controls.expense_type) { me.controls.expense_type.value = bill.expense_type_name || '';              me.controls.expense_type.readOnly = true; }
                if (me.controls.bill_number)  { me.controls.bill_number.value  = bill.bill_number || '';                    me.controls.bill_number.readOnly  = true; }
                if (me.controls.total_amount) { me.controls.total_amount.value = Number(bill.total_amount || 0).toFixed(2); me.controls.total_amount.readOnly = true; }
                if (me.controls.paid_amount)  { me.controls.paid_amount.value  = Number(bill.paid_amount  || 0).toFixed(2); me.controls.paid_amount.readOnly  = true; }
                if (me.controls.balance)      { me.controls.balance.value      = Number(bill.balance      || 0).toFixed(2); me.controls.balance.readOnly      = true; }

                if (me.controls.payment_date) {
                    me.controls.payment_date.value = new Date().toISOString().split('T')[0];
                }

                if (me._amountHandler && me.controls.amount) {
                    me.controls.amount.removeEventListener('input', me._amountHandler);
                }

                const remaining    = Number(bill.balance || 0);
                const amountInput  = me.controls.amount;
                const balanceInput = me.controls.balance;

                if (amountInput && balanceInput) {
                    me._amountHandler = () => {
                        let paying = parseFloat(amountInput.value) || 0;
                        if (paying > remaining) { amountInput.value = remaining.toFixed(2); paying = remaining; }
                        balanceInput.value = Math.max(0, remaining - paying).toFixed(2);
                    };
                    amountInput.addEventListener('input', me._amountHandler);
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false)
                },
                {
                    label: '<span vslang="buttons.Confirm Payment"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const op = me.getData();
                        op.bill_id = me.dataOptions.bill_id || null;

                        if (!op.bill_id) {
                            cv_interact.error("Bill ID is missing.");
                            return;
                        }

                        vsapi.call(`${main_view.base_url}/prm/bill-payment/save`, op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success("Payment recorded successfully.");
                                } else {
                                    cv_interact.error(res.error_message || "Failed to record payment.");
                                }
                            })
                            .catch(() => {
                                cv_interact.error("Network error while saving payment.");
                            });
                    }
                }
            ]
        });

        dialog.show(op);
    };

    return self;
})();