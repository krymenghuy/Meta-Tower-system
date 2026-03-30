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
            title: "Payment Date",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom text-nowrap">${data.payment_date}</span>`,
        },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.bill_number ?? ""}</span>`,
        },
        
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.vendor_name}</span>`,
        },
        // {
        //     transTitle: "titles.Phone Number",
        //     className: "align-middle",
        //     data: (data) => `<span class="d-block text-prm-custom">${data.phone_number}</span>
        //                      <span class="d-block text-prm-custom">${data.email ?? "_"}</span>`,
        // },
        {
            transTitle: "titles.Reference No",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`,
        },
        {
            title: "Total Amount ",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.amount_total)}</span>`,
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`,
        },
        {
            title: "balance",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.amount)}</span>`,
        },
        {
            transTitle: "titles.Payment Method",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.payment_method ?? "_"}</span>`,
        },
        {
            title: "Description",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.remark ?? "__"}</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status_id = data.status_id;
                let cls = "badge text-warning bg-danger-subtle border border-danger";
                if (status_id == 3) cls = "badge text-warning bg-warning-subtle border border-warning";
                else if (status_id == 2) cls = "badge text-success bg-success-subtle border border-success";
                else if (status_id == 1) cls = "badge text-danger bg-danger-subtle border border-danger";
                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">${data.status ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom fw-semibold">${data.update_user ?? ""}</span>
                <span class="text-muted">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action"
                        data-id="${data.id}" data-vendorId="${data.vendor_id}"
                        data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
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

        mThis.initAlready = true;
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
                // {
                //     html: '<span class="ps-2" vslang="titles.Modify Bill Record"></span>',
                //     icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "modify_bill",
                // },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
                // {
                //     html: '<span class="ps-2">View Attachment</span>',
                //     icon: `<i class="fa-regular fa-eye fa-lg" style="color:rgb(56,49,111);"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "view_attachment",
                // },
                {
                    html: '<span class="ps-2">Print</span>',
                    icon: `<i class="fa-solid fa-print" style="color: rgb(22, 80, 137);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_bill",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill":   mThis.editBill(id, menuLink); break;
                    case "delete_bill":   mThis.deleteBill(id, menuLink); break;
                    case "view_attachment": mThis.viewAttachment(id); break;
                    case "print_bill":  mThis.printBill(id); break;
                    default: break;
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
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
                                <select data-style="material" name="payment_method" class="data-input form-control" data-field="payment_method">
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="other">Other</option>
                                </select>
                                <label style="color:#777777;padding-left:6px;">Payment Method</label>
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
                                <input name="payer" class="data-input form-control" data-field="payer" placeholder=" "> 
                                <label style="color:#777777;padding-left:6px;">Payer</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="total_amount" class="data-input form-control" data-field="total_amount" placeholder=" " readonly>
                                <label style="color:#777777;padding-left:6px;">Total Amount</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="material-input outlined">
                                <input name="amount" class="data-input form-control" data-field="amount" placeholder=" " required>
                                <label style="color:#777777;padding-left:6px;">Amount Paid</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed; color:red;" name="balance" class="data-input form-control" data-field="balance" placeholder=" " readonly>
                                <label style="color:red;padding-left:6px;">Balance</label>
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
                modifyTitle: "Record Payment",
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

                if (bill && bill.id) {

                    if (me.controls.vendor)       me.controls.vendor.value       = bill.vendor_name || '';
                    if (me.controls.phone_number) me.controls.phone_number.value = bill.phone_number || '';
                    if (me.controls.bill_number)  me.controls.bill_number.value  = bill.bill_number || '';
                    if (me.controls.total_amount) me.controls.total_amount.value = Number(bill.total_amount || 0).toFixed(2);

                    if (me.controls.vendor)       me.controls.vendor.readOnly = true;
                    if (me.controls.phone_number) me.controls.phone_number.readOnly = true;
                    if (me.controls.bill_number)  me.controls.bill_number.readOnly = true;
                    if (me.controls.total_amount) me.controls.total_amount.readOnly = true;
                    if (me.controls.balance) { 
                        me.controls.balance.value    = bill.balance ?? '';
                        me.controls.balance.readOnly = true;
                    }

                    if (me.controls.payment_date) {
                        const today = new Date().toISOString().split('T')[0];
                        me.controls.payment_date.value = today;
                    }

                    // Auto calculate balance
                    const totalAmount = Number(bill.total_amount || 0);
                    const amountInput = me.controls.amount;
                    const balanceInput = me.controls.balance;

                    if (amountInput && balanceInput) {
                        amountInput.addEventListener('input', () => {
                            let paid = parseFloat(amountInput.value) || 0;
                            let remaining = Math.max(0, totalAmount - paid);
                            balanceInput.value = remaining.toFixed(2);
                        });
                    }

                } else {
                    console.error("Bill data is missing in response", data);
                    cv_interact.warning("Could not load bill details.");
                }
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false)
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
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

