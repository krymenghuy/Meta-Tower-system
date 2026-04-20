"use strict";

var BillPaymentComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Payment Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_payment_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBillPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_category = mThis.self.querySelector("#_bill_expense_type_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elFilter_date = mThis.self.querySelector("#_payment_date");
    mThis.elSearch = mThis.self.querySelector("#_search_bill_payment"); 

    mThis.cols = [
        { title: "", className: "align-middle" },
        
        {
            transTitle: "titles.Payment Date",
            className: "align-middle",
            data: (data) => {
                return `
                    <span class="d-block text-prm-custom text-nowrap mb-2">${data.payment_date}</span>`;
            },
        },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => {
                return `
                    <span class="d-block text-nowrap text-prm-custom ">${data.bill_number ?? ""}</span>`;
            },
        },
        // {
        //     transTitle: "titles.Vendor",
        //     className: "align-middle",
        //     data: (data) => `<span class="d-block text-prm-custom text-capitalize">${data.vendor_name ?? ""}</span>`,
        // },
        // {
        //     transTitle: "titles.Expense Type",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="d-block text-prm-custom ">${data.expense_type_name ?? "_"}</span>`;
        //     },
        // },
        {
            transTitle: "titles.Payer",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom text-capitalize">${data.payer ?? ""}</span>`,
        },
        // {
        //     transTitle: "titles.Reference No",
        //     className: "align-middle",
        //     data: (data) => `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`,
        // },
        
        {
            title: " Amount",
            className: "align-middle text-end",
            data: (data) => {
                const amount = VSMoney.formatAmount(data.amount, data.currency_code ?? 'USD');
                return `<span class="d-block text-primary">${amount}</span>`;
            },
        },
        {
            transTitle: "titles.Payment Method",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom text-capitalize">${data.payment_method ?? ""}</span>`,
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: (data, index, tr) => {
                return `
                    <div class="text-prm-custom" style="width:100px;">
                        <span class="small text-wrap text-break" style ="word-break:break-word;">${data.note ?? ''}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Cashier",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_bill_action"
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

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
            payment_date:    mThis.elFilter_date?.value ?? "",
            // expense_type_id: mThis.elFilter_category.value, 
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
        });
        console.log("Filter data:", p);
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_bill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Delete Payment"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_payment",
                },
                // {
                //     html: '<span class="ps-2">Cancel Payment</span>',
                //     icon: `<i class="fa-solid fa-print" style="color: rgb(22, 80, 137);"></i>`,
                //     cssClass: "border-bottom pb-2",
                //     name: "cancel_payment",
                // },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "delete_payment": mThis.deletePayment(id, menuLink); break;
                    case "cancel_payment":   mThis.cancelPayment(id, menuLink);   break;
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
            bill_id: tr?.dataset.billid || null,
            vendorid: tr?.dataset.vendorid || null,
            btn: menuLink,
            onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        BillPaymentDialog.show(op);
    };

    mThis.deletePayment = (id, menuLink) => {
        const op = {
             id,
             btn: menuLink,
             onClose: () =>
             mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        }
        cv_interact.confirm("Delete this Payment?",
            { context: "delete", confirmButtonText: "Delete" },
            function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/bill-payment/delete`, { id }, false, false, false)
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

    mThis.cancelPayment = (id, menuLink) => {
        const op = {
            id,
            btn: menuLink,
            onClose: () =>
                mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        }
        cv_interact.confirm("Cancel this Bill Payment?",
            { context: "warning", confirmButtonText: "Cancel Bill" },
            function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/bill-payment/cancel`, { id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(res.message || "Bill payment has been cancelled.");
                                mThis.BillPaymentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message || "Failed to cancel bill payment.");
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
                VSUtil.setComboItems(mThis.elFilter_category, d.expense_types, "id", "expense_category", "", "All Categories", "");
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
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <input style="cursor: not-allowed;" name="vendor" class="data-input form-control" data-field="vendor_name" placeholder="Payee (Vendor)" readonly>
                                <label style="color:#777777;padding-left:6px;">Pay To</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <input type="text" data-type="date" name="payment_date" required class="data-input form-control" data-field="payment_date" />
                                <label style="color:#777777;padding-left:6px;">Payment Date</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="material-input outlined">
                               <select data-style="material" name="payment_method" class="data-input form-control" data-field="payment_method" placeholder="Payment Method">
                                    <option value="cash">Cash</option>
                                    <option value="bank">Bank Transfer</option>
                                    <option value="cheque">Cheque</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="material-input outlined">
                                <input type="text" name="payer" class="data-input form-control" data-field="payer" placeholder=" " >
                                <label style="color:#777777;padding-left:6px;">Payer</label>
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
                                <input name="amount" data-field="amount" class="data-input form-control text-end fw-bold" placeholder="0.00 $">
                                <label class="text-primary px-2">Paying Now</label>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="material-input outlined bg-light rounded">
                                <input name="balance" class="form-control text-end fw-bold" style="cursor:not-allowed; color:#dc3545;" readonly>
                                <label class="fw-bold px-2" style="color:#dc3545;">Remaining</label>
                            </div>
                        </div>
                        <div class="col-12" id="_dlg_conv_row" style="display:none;">
                            <div style="border:1px dashed #bfdbfe; border-radius:6px; padding:8px 14px; background:#eff6ff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                                <div class="d-flex align-items-center gap-2">
                                    <span style="font-size:11px; color:#1d4ed8; white-space:nowrap;">1 USD =</span>
                                    <input id="_dlg_conv_rate" type="number" min="1" value="4100"
                                        style="width:80px; border:1px solid #93c5fd; border-radius:4px; background:#fff; padding:2px 8px; font-size:12px; color:#1d4ed8; font-weight:500; text-align:right; outline:none;">
                                    <span style="font-size:11px; color:#1d4ed8;">KHR</span>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span style="font-size:11px; color:#3b82f6;">Paying Now</span>
                                    <span style="font-size:13px; color:#1d4ed8;">→</span>
                                    <span id="_dlg_conv_result" style="font-size:14px; color:#1d4ed8; font-weight:500;">៛ 0</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="material-input outlined">
                                <textarea class="data-input form-control" data-field="note" placeholder=" "></textarea>
                                <label style="color:#777777;padding-left:6px;">Remarks</label>
                            </div>
                        </div>
                    </div>`
                ].join("");
            },

            prepareFormOptions: {
                createTitle: "Bill Payment Voucher",
                modifyTitle: "Pay Bill",
                targetProp: "bill",
                api: {
                    endpoint: `${main_view.base_url}/prm/bill-payment/form-options`,
                    params: (op) => ({
                        bill_id: op.bill_id || op.id || null
                    })
                }
            },
             onShow: (me) => {
                const title = me.divModal.querySelector('.modal-title');
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h2 class="text-prm-custom text-start fw-bold">Pay Bills</h2>'
                        : '<h2 class="text-prm-custom text-start fw-bold">Pay Bill</h2>';
                }
            },
            onPrepareForm: (me, data) => {
                const bill = data?.bill || data?.bill_details;

                // if (!bill || !bill.id) {
                //     console.error("Bill data is missing in response", data);
                //     cv_interact.warning("Could not load bill details.");
                //     return;
                // }

                // if (me.controls.vendor)       me.controls.vendor.value       = '';
                // if (me.controls.phone_number) me.controls.phone_number.value = '';
                // if (me.controls.expense_type) me.controls.expense_type.value = '';
                // if (me.controls.bill_number)  me.controls.bill_number.value  = '';
                if (me.controls.total_amount) me.controls.total_amount.value = '';
                if (me.controls.paid_amount)  me.controls.paid_amount.value  = '';
                if (me.controls.balance)      me.controls.balance.value      = '';
                if (me.controls.amount)       me.controls.amount.value       = '';
                // if (me.controls.payer)        me.controls.payer.value        = '';
                // if (me.controls.note)         me.controls.note.value         = '';

                // if (me.controls.vendor)       { me.controls.vendor.value       = bill.vendor_name || '';                    me.controls.vendor.readOnly       = true; }
                // if (me.controls.phone_number) { me.controls.phone_number.value = bill.phone_number || '';                   me.controls.phone_number.readOnly = true; }
                // if (me.controls.expense_type) { me.controls.expense_type.value = bill.expense_type_name || '';              me.controls.expense_type.readOnly = true; }
                // if (me.controls.bill_number)  { me.controls.bill_number.value  = bill.bill_number || '';                    me.controls.bill_number.readOnly  = true; }
                if (me.controls.total_amount) { me.controls.total_amount.value = Number(bill.total_amount || 0).toFixed(2); me.controls.total_amount.readOnly = true; }
                if (me.controls.paid_amount)  { me.controls.paid_amount.value  = Number(bill.paid_amount  || 0).toFixed(2); me.controls.paid_amount.readOnly  = true; }
                if (me.controls.balance)      { me.controls.balance.value      = Number(bill.balance      || 0).toFixed(2); me.controls.balance.readOnly      = true; }
                // if (me.controls.due_date)     {me.controls.due_date.value      = bill.due_date || '';                       me.controls.due_date.readOnly     = true; }

                // if (me.controls.payment_date) {
                //     me.controls.payment_date.value = new Date().toISOString().split('T')[0];
                // }

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

                // if (me.controls.note) {
                //     me.controls.note.value = data?.bill_details?.note || '';
                // }
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
                        console.log(9988,me.dataOptions);

                        op.bill_id = me.dataOptions.bill_id;
                        op.vendor_id = me.dataOptions.vendorId;

                        console.log(9988,op);
                        
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