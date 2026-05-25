"use strict";

var BillPaymentComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Payments";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_bill_payment_component",
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnBillPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_category = mThis.self.querySelector(
        "#_bill_expense_type_id",
    );
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
            transTitle: "titles.Ref No",
            className: "align-middle",
            data: (data) => {
                return `
                    <span class="d-block text-nowrap text-prm-custom ">${data.ref_no ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-capitalize">${data.vendor_name ?? ""}</span>`,
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-end",
            data: (data) => {
                const amount = VSMoney.formatAmount(
                    data.amount,
                    data.currency_code ?? "USD",
                );
                return `<span class="d-block fw-semibold text-primary">${amount}</span>`;
            },
        },
        {
            transTitle: "titles.Payment Method",
            className: "align-middle text-center ",
            data: (data) =>
                `<span class="d-block text-prm-custom text-capitalize ">${data.payment_method ?? ""}</span>`,
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remark ?? " __"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: (data) => {
                const isCancelled = parseInt(data.status_id) === 2;

                let cls =
                    "badge border border-success text-success bg-success-subtle";
                let label = "Active";

                if (isCancelled) {
                    cls =
                        "badge border border-danger text-danger bg-danger-subtle";
                    label = "Cancelled";
                }

                return `
                    <span class="${cls} px-3 py-2 d-inline-block text-center gap-2" style="min-width:90px">
                        ${label}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <small>${data.updated_at ?? ""}</small>
                </div>`;
            },
        },

        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_bill_action"
                        data-id="${data.id}" data-vendorId="${data.vendor_id || ""}"
                        data-statusid="${data.status_id || ""}" aria-haspopup="true" aria-expanded="false">
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
                onClose: () =>
                    mThis.BillPaymentListView.showPage(mThis.getFilterData()),
            };
            BillPaymentDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillPaymentListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

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
            payment_date: mThis.elFilter_date?.value ?? "",
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
                    html: '<span class="ps-2">Cancel Payment</span>',
                    icon: `<i class="fa-solid fa-circle-xmark" style="color: rgb(209, 23, 54);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "cancel_payment",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Payment"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_payment",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;

                menu.cancel_payment.style.display =
                    status_id == 1 ? "block" : "none";
                menu.delete_payment.style.display =
                    status_id == 2 ? "block" : "none";
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "delete_payment":
                        mThis.deletePayment(id, menuLink);
                        break;
                    case "cancel_payment":
                        mThis.cancelPayment(id, menuLink);
                        break;
                    default:
                        break;
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
            onClose: () =>
                mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        BillPaymentDialog.show(op);
    };

    mThis.deletePayment = (id, menuLink) => {
        const op = {
            id,
            btn: menuLink,
            onClose: () =>
                mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        cv_interact.confirm(
            "Delete this Payment?",
            { context: "delete", confirmButtonText: "Delete" },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/bill-payment/delete`,
                            { id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    res.message ||
                                        "Bill record has been deleted.",
                                );
                                mThis.BillPaymentListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(
                                    res.error_message ||
                                        "Failed to delete bill record.",
                                );
                            }
                        });
                }
            },
        );
    };

    // mThis.cancelPayment = (id, menuLink) => {
    //     const op = {
    //         id,
    //         btn: menuLink,
    //         onClose: () =>
    //             mThis.BillPaymentListView.showPage(mThis.getFilterData()),
    //     }
    //     cv_interact.confirm("Cancel this Bill Payment?",
    //         { context: "warning", confirmButtonText: "Cancel Bill" },
    //         function (e) {
    //             if (e) {
    //                 vsapi.call(`${main_view.base_url}/prm/bill-payment/cancel`, { id }, false, false, false)
    //                     .then((res) => {
    //                         if (res.status_code == 200) {
    //                             cv_interact.success(res.message || "Bill payment has been cancelled.");
    //                             mThis.BillPaymentListView.showPage(mThis.getFilterData());
    //                         } else {
    //                             cv_interact.error(res.error_message || "Failed to cancel bill payment.");
    //                         }
    //                     });
    //             }
    //         }
    //     );
    // };

    mThis.cancelPayment = (id) => {
        Swal.fire({
            title: "Cancel Payment?",
            text: "This will restore the due balance on the bill.",
            icon: "warning",
            input: "textarea",
            inputPlaceholder: "Reason for cancellation (required)...",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!",
            reverseButtons: true,
            inputValidator: (value) => {
                if (!value) return "You must provide a reason!";
            },
            showLoaderOnConfirm: true,
            preConfirm: (remark) => {
                let op = { id: id, remarks: remark };
                return vsapi
                    .call(`${mThis.base_url}/prm/bill-payment/cancel`, op, null)
                    .then((res) => {
                        if (res.status_code !== 200) {
                            throw new Error(
                                res.error_message || "Failed to cancel",
                            );
                        }
                        return res;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((request) => {
            if (request.isConfirmed) {
                cv_interact.success("Payment has been canceled.");
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            }
        });
    };

    mThis.viewAttachment = (id) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/bill/view-attachment`,
                { id },
                false,
                false,
                false,
            )
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(
                        res.error_message || "No attachment found.",
                    );
                    return;
                }
                const { data_url, ext } = res.data;
                const overlay = document.createElement("div");
                overlay.style.cssText =
                    "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;";
                const wrapper = document.createElement("div");
                wrapper.style.cssText =
                    "position:relative;max-width:90vw;max-height:90vh;";
                const isImage = ["png", "jpg", "jpeg"].includes(ext);
                const isPdf = ext === "pdf";
                if (isImage) {
                    const img = document.createElement("img");
                    img.src = data_url;
                    img.style.cssText =
                        "max-width:100%;max-height:90vh;border-radius:8px;box-shadow:0 4px 32px #000;";
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data_url;
                    iframe.style.cssText =
                        "width:80vw;height:85vh;border:none;border-radius:8px;";
                    wrapper.appendChild(iframe);
                } else {
                    document.body.removeChild(overlay);
                    window.open(data_url, "_blank");
                    return;
                }
                const btnClose = document.createElement("button");
                btnClose.style.cssText =
                    "position:absolute;top:-16px;right:-16px;border:none;background:#fff;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;line-height:1;";
                btnClose.innerHTML = "&times;";
                btnClose.onclick = (e) => {
                    e.stopPropagation();
                    document.body.removeChild(overlay);
                };
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
        vsapi
            .call(
                `${main_view.base_url}/prm/bill/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_category,
                    d.expense_types,
                    "id",
                    "expense_category",
                    "",
                    "All Categories",
                    "",
                );
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.bill_statuses,
                    "id",
                    "bill_status",
                    "",
                    "All Statuses",
                    "",
                );
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
        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,

                createContent: () => `
                <div class="container-fluid px-0">
                    <div class="row g-0" style="border-radius:8px;overflow:hidden;margin-bottom:1.5rem;">
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Balance Due</div>
                            <div style="font-size:17px;font-weight:600;color:#5665E1;" id="f_due">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; text-align:center;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Paying Now</div>
                            <div style="font-size:17px;font-weight:600;color:#19BF9B;" id="f_tot">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;text-align:right;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Remaining</div>
                            <div style="font-size:17px;font-weight:600;color:#FAB31C;" id="f_bal">$0.00</div>
                        </div>
                    </div>

                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="vs-material-field">
                                <input name="vendor" class="data-input form-control" data-field="vendor_name" placeholder=" " readonly>
                                <label>Pay To</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input type="text" data-type="date" name="payment_date" class="data-input form-control" data-field="payment_date" /disabled>
                                <label>Payment Date</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="vs-material-field">
                                <input type="text" name="payer" class="data-input form-control" data-field="payer" placeholder=" " > 
                                <label>Payer</label>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="vs-material-field">
                                <input name="cash" type="text" class="form-control data-input" data-field="cash" min="0" step="0.01" placeholder=" "/>
                                <label>Cash</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <select name="bank" class="form-select data-input" data-field="bank" data-style="material" placeholder="Bank"></select>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <input name="bank_amount" type="text" class="form-control data-input" data-field="bank_amount" min="0" step="0.01" placeholder=" "/>
                                <label>Amount</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <input name="bank_ref_number" type="text" class="form-control data-input" data-field="bank_ref_number" placeholder=" "/>
                                <label>Ref Number</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <select name="cheque_bank_id" class="form-select data-input" data-field="cheque_bank_id" data-style="material" placeholder="Cheque"></select>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <input name="cheque_amount" type="text" class="form-control data-input" data-field="cheque_amount" min="0" step="0.01" placeholder=" "/>
                                <label>Amount</label>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="vs-material-field">
                                <input name="cheque_number" type="text" class="form-control data-input" data-field="cheque_number" placeholder=" "/>
                                <label>Cheque Number</label>
                            </div>
                        </div>
                        <input name="vendorid" class="d-none data-input" data-field="vendor_id">
                        <input name="payment_method" type="hidden" class="data-input" data-field="payment_method">

                        <div class="col-12 mb-3" id="_dlg_conv_row" style="display:none;">
                            <div style="border:1px dashed #bfdbfe; border-radius:6px; padding:8px 14px; background:#eff6ff; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                                <div class="d-flex align-items-center gap-2">
                                    <span style="font-size:11px; color:#1d4ed8; white-space:nowrap;">1 USD =</span>
                                    <input id="_conv_rate" type="number" min="1" value="4100"
                                        style="width:80px; border:1px solid #93c5fd; border-radius:4px; background:#fff; padding:2px 8px; font-size:12px; color:#1d4ed8; font-weight:500; text-align:right; outline:none;">
                                    <span style="font-size:11px; color:#1d4ed8;">KHR</span>
                                </div>
                                <div class="d-flex align-items-center gap-2">
                                    <span style="font-size:11px; color:#3b82f6;">Paying Now</span>
                                    <span style="font-size:13px; color:#1d4ed8;">→</span>
                                    <span id="_conv_result" style="font-size:14px; color:#1d4ed8; font-weight:500;">៛ 0</span>
                                </div>
                            </div>
                        </div>

                        <div class="col-12">
                            <div class="vs-material-field">
                                <textarea name="remark" class="form-control data-input" data-field="remarks" rows="2" style="height:55px;" placeholder=" "></textarea>
                                <label>Remark</label>
                            </div>
                        </div>
                    </div>

                </div>`,

                contentCreated: (me) => {
                    const updateTotals = () => {
                        const getValue = (name) => {
                            const el = me.divModal.querySelector(
                                `[name="${name}"]`,
                            );
                            return el ? parseFloat(el.value) || 0 : 0;
                        };

                        const fmt = (n) => "$" + Number(n).toFixed(2);

                        const cash = getValue("cash");
                        const bank = getValue("bank_amount");
                        const cheque = getValue("cheque_amount");

                        const totalPaid = cash + bank + cheque;

                        let due = 0;
                        const dueEl = me.divModal.querySelector("#f_due");
                        if (dueEl) {
                            due = parseFloat(dueEl.textContent.replace(/[^0-9.-]+/g, ""),) || 0;
                        }
                        const remaining = due - totalPaid;
                        me.divModal.querySelector("#f_tot").textContent = fmt(totalPaid);
                        const balEl = me.divModal.querySelector("#f_bal");
                        if (balEl) {
                            if (totalPaid > due + 0.001) {
                                balEl.style.color = "#dc3545";
                                balEl.textContent ="Overpaid: " + fmt(Math.abs(remaining));
                            } else {
                                balEl.style.color = remaining <= 0.001 ? "#3B6D11" : "#FAB31C";
                                balEl.textContent = fmt(Math.max(0, remaining));
                            }
                        }

                        me.divModal.querySelector("#c_e").textContent = cash > 0 ? fmt(cash) : "—";
                        me.divModal.querySelector("#b_e").textContent = bank > 0 ? fmt(bank) : "—";
                        me.divModal.querySelector("#ch_e").textContent = cheque > 0 ? fmt(cheque) : "—";
                    };

                    const amountFields = ["cash","bank_amount","cheque_amount"];
                    amountFields.forEach((name) => {
                        const input = me.divModal.querySelector(`[name="${name}"]`,);
                        if (input) {
                            input.addEventListener("input", updateTotals);
                            input.addEventListener("change", updateTotals);
                        }
                    });

                    // Original amount formatting
                    const amountInput = me.divModal.querySelector('[name="amount"]');
                    if (amountInput) {
                        amountInput.addEventListener("input", (e) => {
                            let v = e.target.value.replace(/[^0-9.]/g, "");
                            const parts = v.split(".");
                            if (parts.length > 2) v = parts[0] + "." + parts[1];
                            if (parts[1] !== undefined)
                                v = parts[0] + "." + parts[1].slice(0, 2);
                            e.target.value = v;
                        });
                    }

                    me.convertPayment = (data) => {
                        console.log(3333333, data);
                        const parseAmt = (v) =>
                            isNaN(parseFloat(v)) ? 0 : parseFloat(v);
                        const breakdowns = [];

                        if (parseAmt(data.cash) > 0) {
                            breakdowns.push({
                                method: "Cash",
                                payer: data.payer,
                                amount: parseAmt(data.cash),
                                currency_code: "USD",
                            });
                        }
                        if (parseAmt(data.bank_amount) > 0) {
                            breakdowns.push({
                                method: "Bank",
                                amount: parseAmt(data.bank_amount),
                                currency_code: "USD",
                                bank_id:
                                    parseInt(data.bank) ||
                                    null,
                                bank_name: me.getSelectText
                                    ? me.getSelectText("bank")
                                    : null,
                                bank_ref_number: data.bank_ref_number || null,
                            });
                        }
                        if (parseAmt(data.cheque_amount) > 0) {
                            breakdowns.push({
                                method: "Cheque",
                                amount: parseAmt(data.cheque_amount),
                                currency_code: "USD",
                                bank_id: parseInt(data.cheque_bank_id) || null,
                                cheque_bank_name: me.getSelectText
                                    ? me.getSelectText("cheque_bank_id")
                                    : null,
                                cheque_number: data.cheque_number || null,
                            });
                        }
                        return {
                            bill_id: me.dataOptions?.bill_id || null,
                            remarks: (data.remarks || "").trim(),
                            payer: data.payer,
                            pmt_breakdowns: breakdowns,
                        };
                    };
                },

                prepareFormOptions: {
                    createTitle: "Bill Payment Voucher",
                    modifyTitle: "Pay Bill",
                    targetProp: "bill",
                    api: {
                        endpoint: `${main_view.base_url}/prm/bill-payment/form-options`,
                        params: (op) => ({
                            bill_id: op.bill_id || op.id || null,
                        }),
                    },
                },

                onShow: (me, container) => {
                    const menu = me.getActiveMenus(container);
                    const status_id = container.dataset.statusid;

                    // menu.edit_student.style.display = enroll_finalized == 1 ? 'none' : 'block';
                    menu.create_contract.style.display =
                        status_id == 1 ? "block" : "none";
                    menu.service_request.style.display = "none";
                    menu.upload_document.style.display =
                        status_id == 1 || status_id == 2 ? "block" : "none";
                },
                onPrepareForm: (me, data) => {
                    const bill = data?.bill || data?.bill_details;

                    const dueAmount = Number(bill?.balance || 0);
                    const dueEl = me.divModal.querySelector("#f_due");
                    if (dueEl) dueEl.textContent = "$" + dueAmount.toFixed(2);

                    const balEl = me.divModal.querySelector("#f_bal");
                    if (balEl) {
                        balEl.style.color = "#FAB31C";
                        balEl.textContent = "$" + dueAmount.toFixed(2);
                    }

                    if (me.controls.total_amount)
                        me.controls.total_amount.value = Number(bill.total_amount || 0).toFixed(2);
                    if (me.controls.paid_amount)
                        me.controls.paid_amount.value = Number(bill.paid_amount || 0,).toFixed(2);
                    if (me.controls.balance)
                        me.controls.balance.value = Number(bill.balance || 0,).toFixed(2);

                    if (me.controls.vendor) {
                        me.controls.vendor.value = bill.vendor_name || "";
                        me.controls.vendor.readOnly = true;
                    }

                    if (me.controls.payment_date &&!me.controls.payment_date.value) {
                        const now = new Date();
                        const months = [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ];
                        const day = String(now.getDate()).padStart(2, "0");
                        const month = months[now.getMonth()];
                        const year = now.getFullYear();
                        me.controls.payment_date.value = `${day}-${month}-${year}`;
                    }

                    const banks = data?.banks ?? [];
                    const bankEl = me.divModal.querySelector('[name="bank"]');
                    const chequeEl = me.divModal.querySelector(
                        '[name="cheque_bank_id"]',
                    );
                    if (bankEl)
                        VSUtil.setComboItems(bankEl,banks,"id","name","","Select Bank","",);
                    if (chequeEl)
                        VSUtil.setComboItems(chequeEl,banks,"id","name","","Select Bank","",);
                },
                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me) => me.hide(false),
                    },
                    {
                        label: '<span vslang="buttons.Confirm Payment"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const rawData = me.getData();
                            const payload = me.convertPayment(rawData);
                            console.log(11111111, payload);

                            const totalInput = payload.pmt_breakdowns.reduce(
                                (sum, item) => sum + item.amount,
                                0,
                            );

                            const dueEl = me.divModal.querySelector("#f_due");
                            const balanceDue = dueEl
                                ? parseFloat(
                                      dueEl.textContent.replace(
                                          /[^0-9.-]+/g,
                                          "",
                                      ),
                                  ) || 0
                                : 0;
                            
                            vsapi
                                .call(
                                    `${main_view.base_url}/prm/bill-payment/save`,
                                    payload,
                                    btn,
                                    null,
                                )
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        cv_interact.success(
                                            "Payment recorded successfully.",
                                        );
                                    } else {
                                        cv_interact.error(
                                            res.error_message ||
                                                "Failed to record payment.",
                                        );
                                    }
                                })
                                .catch(() => {
                                    cv_interact.error(
                                        "Network error while saving payment.",
                                    );
                                });
                        },
                    },
                ],
            });

        dialog.show(op);
    };

    return self;
})();
