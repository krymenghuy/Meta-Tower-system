"use strict";

var InvoiceComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = "$";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_invoice_component"
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnInvoice");
    mThis.btnAddTest = mThis.self.querySelector("#_btnInvoice_test");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_invoice");
    mThis.elFilter_status = mThis.self.querySelector("#payment_status");
    mThis.elFilter_invoice_type = mThis.self.querySelector("#invoice_type");
    mThis.elSpaceType = mThis.self.querySelector("#space_type_id");
    mThis.elTenant = mThis.self.querySelector("#tenant_id");
    mThis.elSearch = mThis.self.querySelector("#_search_invoice");
    mThis.tblReceive = mThis.self.querySelector("#_tblReceive");

    let InvoiceItemDialog = null;
    mThis.cols = [
        { transTitle: "", className: "align-middle text-capitalize" },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-start text-nowrap",
            data: function(data) {
                const code = data.code
                    ? `<span class="text-prm-custom">${data.code}</span>`
                    : `<span class="text-muted fst-italic">_</span>`;

                let typeHtml = "";
                const val = data.invoice_type;

                if (val == 1) {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> Tax</span>`;
                } else if (val == 2) {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> No Tax</span>`;
                } else {
                    typeHtml = `<span class="d-block text-primary"style="font-size:12px;""> Commercial</span>`;
                }
                return `
                    <div class="d-flex flex-column">
                        ${code}
                     <!--   <hr class="m-0 border border-secondary border-3 opacity-75"> -->
                        ${typeHtml}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle text-nowrap",
            data: data => {
                return `
                        <div class="d-flex flex-column">
                            <span>${data.tenant_name ?? ""}</span>
                            <span class="d-block text-primary"style="font-size:12px;">${data.tenant_phone ??
                                ""}</span>
                        </div>`;
            }
        },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: data => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>
                    <span class="d-block text-prm-custom ">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            }
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap text-center",
            data: data => {
                return `
                    <div class="d-flex flex-column align-items-center">
                        <span class="text-prm-custom text-nowrap">${data.issue_date ??
                            ""}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle text-nowrap text-center",
            data: data => {
                const statusId = Number(data.payment_status_id || 0);
                return `
                    <div class="d-flex flex-column align-items-center ">
                        <span class="text-prm-custom text-nowrap">${data.due_date ??
                            ""}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap text-primary",
            data: data => {
                const amt = data.amount_payable
                    ? Number(data.amount_payable).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block text-primary fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            transTitle: "titles.Paid",
            className: "align-middle text-success  text-nowrap",
            data: data => {
                const amt = data.paid_amount
                    ? Number(data.paid_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle text-danger  text-nowrap",
            data: data => {
                const amt = data.due_amount
                    ? Number(data.due_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },

        {
            transTitle: "titles.Status",
            className: "align-middle text-center text-nowrap",
            data: data => {
                const statusId = Number(data.payment_status_id || 0);
                let cls = "bg-secondary";
                let icon = "bi bi-question-circle";

                if (statusId === 1) {
                    // Paid
                    cls =
                        "text-success bg-success-subtle border border-success";
                } else if (statusId === 2) {
                    // Unpaid
                    cls = "text-danger bg-danger-subtle border border-danger";
                } else if (statusId === 3) {
                    // Partially Paid
                    cls =
                        "text-warning bg-warning-subtle border border-warning ";
                } else if (statusId === 4) {
                    // Overdue
                    cls = "status-overdue";
                }
                return `
                    <span class="badge ${cls} text-capitalize d-inline-flex align-items-center justify-content-center px-3 py-2 gap-1" style="min-width:110px">
                        ${data.payment_status_name || "—"}
                    </span>`;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap text-center",
            data: data => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.general_remark ??
                            "_"}</span>
                    </div>
                `;
            }
        },

        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: data => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-prm-custom">${data.update_user ||
                        "—"}</span>
                    <small class="text-muted">${data.updated_at || "—"}</small>
                </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: data => {
                // if (data.payment_status_id === 4) {
                //     return "";
                // }

                return `<div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action"
                        data-id="${
                            data.id
                        }" data-statusid="${data.payment_status_id || ""}">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`;
            }
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.InvoiceListView = new ListView("_invoices_list", {
            fetchApi: `${main_view.base_url}/prm/invoice/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.classList.add("invoice", "cursor-pointer");
                tr.id = `invoice_id_${data.id}`;
                tr.dataset.statusid = data.payment_status_id || 0;
                tr.dataset.canceled = 0;
            },
            listContainerClass: null
        });

        mThis.btnAdd.onclick = e => {
            e.preventDefault();
            InvoiceDialog.show({
                id: null,
                btn: e.target,
                onClose: () =>
                    mThis.InvoiceListView.showPage(mThis.getFilterData())
            });
        };

        mThis.listContainer = mThis.InvoiceListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };

        mThis.tblInvoice = mThis.InvoiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblInvoice);

        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            el.onchange = () =>
                mThis.InvoiceListView.showPage(mThis.getFilterData());
        });

        let timeOut = null;
        mThis.elSearch.onkeyup = function(e) {
            e.preventDefault();
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                mThis.InvoiceListView.showPage(mThis.getFilterData());
            }, 250);
        };

        new ExpandableRowConfig(mThis.tblInvoice.id, {
            dontExpandByClickingOn: ["btn_leave_action"],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.id.replace("invoice_id_", "");
                if (id && !isNaN(id)) mThis.displayInvoiceDetail(container, id);
            }
        });

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi
            .call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }
                mThis.renderInvoiceDetail(container, res.data || {});

                console.log(1112345678, res.data);
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice detail.</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const currency = mThis.currency_symbol || "$";
        const validItems = (invoice.items || []).filter(
            item =>
                parseFloat(item.price || 0) > 0 ||
                parseFloat(item.total || 0) > 0 ||
                parseFloat(item.amount || 0) > 0
        );

        const formatDate = dateStr => {
            if (!dateStr) return "—";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });
        };
        const getDiscountDisplay = item => {
            const value = parseFloat(item.discount || 0);
            const type = (item.discount_type || "percent").toLowerCase().trim();

            const discType = type === "percent" ? "%" : "$";

            const currency = mThis.currency_symbol || "$";

            if (value <= 0) {
                return `<span class="text-muted">—</span>`;
            }

            if (type === "amount" || type === "$") {
                return `${currency}${value.toFixed(2)}`;
            } else {
                const percentStr =
                    value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);

                return `${percentStr}${discType}`;
            }
        };
        const itemsHtml = validItems
            .map(item => {
                const qty = parseFloat(item.qty || 1);
                const price = parseFloat(item.price || 0);

                const discount = parseFloat(item.discount || 0);
                const taxAmount = parseFloat(item.tax_rate) || 0;
                const total = parseFloat(item.total || item.amount || 0);
                const unit_type = item.unit_type;

                return `
                <tr>
                    <td class="fw-medium">${item.remarks || "—"}
                    </td>
                    <td class="text-center text-muted small">${qty} ${unit_type}</td>
                    <td class="text-center small">${formatDate(
                        item.start_date
                    )}</td>
                    <td class="text-center small">${formatDate(
                        item.end_date
                    )}</td>
                    <td class="text-end">${currency}${price.toLocaleString(
                    "en-US",
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                )}</td>
                    <td class="text-end text-danger">${getDiscountDisplay(
                        item
                    )}</td>
                    <td class="text-center text-info">${taxAmount}%</td>
                    <td class="text-end fw-bold">${currency}${total.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                )}</td>

                </tr>`;
            })
            .join("");

        // ✅ Footer totals calculation
        const foot = validItems.reduce(
            (acc, item) => {
                const total = parseFloat(item.total || item.amount || 0);
                acc.total += total;
                return acc;
            },
            { discount: 0, tax: 0, total: 0 }
        );

        const fmt = n =>
            n.toLocaleString("en-US", { minimumFractionDigits: 2 });
        container.innerHTML = `
            <div class="bg-white rounded shadow-sm">
                <div class="table-responsive table--dropdown">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background:#e1e5f2;">
                            <tr style= background-color:#E1E5F2;" >
                                <th class="text-center" >Item Description </th>
                                <th class="text-center" >Qty</th>
                                <th class="text-center" >Start Date</th>
                                <th class="text-center" >End Date</th>
                                <th class="text-end" >Price</th>
                                <th class="text-end" >Discount</th>
                                <th class="text-center" >Tax %</th>
                                <th class="text-end" >Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml ||
                                '<tr><td colspan="8" class="text-center py-4 text-muted">No items found</td></tr>'}
                        </tbody>
                        <tfoot class="table-light fw-bold">
                                <!-- Displaying Net Total -->
                            <tr>
                                <td colspan="7" class="text-end  ">Total Item</td>
                                <td colspan="1" class="text-end  fs-6">
                                    ${currency}${fmt(
            parseFloat(invoice.amount || 0)
        )}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-end text-danger">Total Discount</td>
                                <td colspan="1" class="text-end text-danger fs-6">
                                    ${(() => {
                                        const discVal = parseFloat(
                                            invoice.discount_value || 0
                                        );
                                        const discType = (
                                            invoice.discount_type || ""
                                        ).toLowerCase();

                                        if (discVal <= 0)
                                            return `<span class="text-muted">—</span>`;
                                        if (discType === "percent") {
                                            return `${fmt(discVal)}%`;
                                        } else {
                                            return `${currency}${fmt(discVal)}`;
                                        }
                                    })()}
                                </td>
                            </tr>

                            <!-- Displaying Net Total -->
                            <tr>
                                <td colspan="7" class="text-end  text-primary">Total Amount Due</td>
                                <td colspan="1" class="text-end text-success fs-6">
                                    ${currency}${fmt(
            parseFloat(invoice.amount_payable || 0)
        )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                    ${
                        invoice.remarks
                            ? `
                        <div class="mt-3 p-3 bg-light rounded border">
                            <small class="text-muted fw-semibold d-block  text-uppercase" style="font-size: 0.7rem;">Remarks:</small>
                            <p class="mb-0 small">${invoice.remarks}</p>
                        </div>`
                            : ""
                    }
                </div>`;
    };

    mThis.getFilterData = () => {
        const params = {
            payment_status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value.trim()
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            if (el.value && el.dataset.field) {
                params[el.dataset.field] = el.value.trim();
            }
        });
        return params;
    };

    mThis.initDropdownMenus = container => {
        const menuOptions = {
            containerElement: container,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white box-shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Receive"></span>',
                    icon: `<i class="fa-solid fa-hand-holding-dollar text-success fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "receive_invoice"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-solid fa-edit text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_invoice"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Print"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_invoice"
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_invoice"
                }
            ],
            onShow: (me, menuContainer) => {
                const menu = me.getActiveMenus(menuContainer);
                const statusId = Number(menuContainer.dataset.statusid);

                // menu.print_invoice.style.display =
                //     statusId === 1 || statusId === 3 || statusId === 2
                //         ? "block"
                //         : "none";
                menu.receive_invoice.style.display =
                    statusId === 2 || statusId === 3 || statusId === 4
                        ? "block"
                        : "none";
                statusId === 2 || statusId === 3 ? "block" : "none";
                menu.delete_invoice.style.display =
                    statusId === 2 ? "block" : "none";
                menu.modify_invoice.style.display =
                    statusId === 2 ? "block" : "none";
            },
            onClick: (menulink, id, name) => {
                if (name === "delete_invoice") {
                    mThis.deleteInvoice(id);
                } else if (name === "print_invoice") {
                    mThis.printInvoice(id);
                } else if (name === "receive_invoice") {
                    mThis.receiveInvoice(id);
                } else if (name === "modify_invoice") {
                    mThis.editInvoice(id, menulink);
                }
            }
        };

        new VSDropdownMenu(menuOptions);
    };

    mThis.deleteInvoice = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;

        cv_interact.confirm(
            "Are you sure you want to delete this invoice?",
            {
                transTitle: "Delete Invoice",
                confirmButtonText: "Delete",
                context: "danger"
            },
            confirmed => {
                if (!confirmed) return;

                vsapi
                    .call(
                        `${main_view.base_url}/prm/invoice/delete`,
                        { id },
                        menuLink
                    )
                    .then(res => {
                        if (res.status_code === 200) {
                            mThis.InvoiceListView.showPage(
                                mThis.getFilterData()
                            );
                            cv_interact.success("Invoice deleted successfully");
                        } else {
                            cv_interact.error(
                                res.error_message || "Failed to delete."
                            );
                        }
                    });
            }
        );
    };

    mThis.editInvoice = (id, menulink) => {
        console.log("editInvoice id:", id);
        InvoiceDialog.show({
            id: id,
            btn: menulink,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.receiveInvoice = (id, menulink) => {
        ReceiveDialog.show({
            invoice_id: id,
            btn: menulink,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.printInvoice = (id, invoice_type, menulink) => {
        if (!invoice_type || invoice_type === "undefined") {
            console.warn(
                "Type missing for ID " + id + ". Fetching from server..."
            );

            vsapi
                .call(`${main_view.base_url}/prm/invoice/details`, { id: id })
                .then(res => {
                    if (res.status_code === 200) {
                        mThis.printInvoice(id, res.data.invoice_type, menulink);
                    } else {
                        cv_interact.error("Could not determine invoice type.");
                    }
                });
            return;
        }

        const invType = parseInt(invoice_type);
        const params = { invoice_id: id, btn: menulink };

        if (invType === 1) {
            InvoiceTaxDialog.show(params);
        } else if (invType === 2) {
            InvoiceNoTaxDialog.show(params);
        } else if (invType === 3) {
            InvoiceCommercialDialog.show(params);
        }
    };

    mThis.prepareFormOptions = onFinish => {
        vsapi
            .call(`${main_view.base_url}/prm/invoice/form-options`)
            .then(res => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.statuses,
                    "id",
                    "payment_status",
                    "",
                    "All Statuses",
                    ""
                );

                // Populate Invoice Type filter
                const typeOptions = [
                    { id: 1, name: "Tax" },
                    { id: 2, name: "No Tax" },
                    { id: 3, name: "Commercial" }
                ];
                VSUtil.setComboItems(
                    mThis.elFilter_invoice_type,
                    typeOptions,
                    "id",
                    "name",
                    "",
                    "All Types",
                    ""
                );

                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options = {}) => {
        mThis.init();
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.InvoiceListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();

const InvoiceDialog = (() => {
    const self = {};
    let dialog = null;
    let availableItem = [];

    self.show = op => {
        dialog = new GeneralDialog({
            cssClass: "modal-xl vs-modal",
            backdrop: "static",
            keyboard: true,
            createContent: () => `
                        <div class="container-fluid">
                            <div id="_invoice_form_container" class="bg-white rounded-3">

                                <div class="d-flex justify-content-between align-items-start">

                                    <!-- LEFT: Tenant Info -->
                                    <div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Tenant Name </label>
                                            <span class="field-sep">:</span>
                                            <input name="tenant" class="data-input form-control field-input" data-field="tenant_id" placeholder=" " autocomplete="off">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Phone Number</label>
                                            <span class="field-sep">:</span>
                                            <input name="phone_number" class="data-input form-control field-input bg-light"  placeholder=" ">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold">Email Address</label>
                                            <span class="field-sep">:</span>
                                            <input name="email" class="data-input form-control field-input " placeholder=" ">
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Space / Room</label>
                                            <span class="field-sep">:</span>
                                                <select name="space"  data-style="material" class="data-input form-control" data-field="space_id" required placeholder=" ">
                                                </select>
                                        </div>
                                    </div>

                                    <!-- RIGHT: Space / Button -->
                                    <div>
               
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Invoice Type</label>
                                            <span class="field-sep">:</span>
                                                <select name="invoice_type"  data-style="material" class="data-input form-control" data-field="invoice_type" required placeholder=" ">
                                                    <option value="1">Tax</option>
                                                    <option value="2">No Tax</option>
                                                    <option value="3">Commercial</option>
                                                </select>
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Issue Date </label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="issue_date" data-field="issue_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>
                                        <div class="field-row ">
                                            <label class="field-label fw-semibold">Due Date </label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="due_date" data-field="due_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>


                                        <div class="field-row w-100 justify-content-end">
                                            <div class="d-flex flex-wrap gap-2 justify-content-end ">
                                                <button name="btnRent" class="custom-button">Rent</button>
                                                <button name="btnService" class="custom-button">Service</button>
                                                <button name="btnRequest" class="custom-button">Request</button>
                                                <button name="btnElectric" class="custom-button">Electric</button>
                                                <button name="btnWater" class="custom-button">Water </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div name="divItemsView" ></div>
                                <div class="mt-4 d-flex justify-content-end mb-3">
                                    <div name="div_invoice_summary" class="w-100" style="max-width: 400px;"></div>
                                </div>

                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="general_remark" name="general_remark" rows="1" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>


                            </div>
                        </div>

                        <style>
                        .field-row {
                            display: flex;
                            align-items: center;
                            margin-bottom: 12px;
                            --field-width: 260px;
                        }
                        .field-label {
                            width: 110px;
                            font-size: 0.875rem;
                            color: #222;
                            flex-shrink: 0;
                        }
                        .field-sep {
                            margin: 0 10px;
                            font-weight: 600;
                            color: #444;
                            flex-shrink: 0;
                        }
                        .field-row .field-input {
                            width: var(--field-width);
                            border-radius: 6px;
                            border: 1px solid #d0d0d0;
                            font-size: 0.875rem;
                            padding: 6px 10px;
                            background-color: #fff;
                            box-sizing: border-box;
                        }
                        .field-row .field-input:focus {
                            border-color: #86b7fe;
                            box-shadow: 0 0 0 3px rgba(13,110,253,0.15);
                            outline: none;
                        }
                        .field-row .choices {
                            width: var(--field-width) !important;
                            flex-shrink: 0;
                        }
                        .field-row .choices .choices__inner {
                            width: 100% !important;
                            min-height: unset !important;
                            border-radius: 6px !important;
                            border: 1px solid #d0d0d0 !important;
                            font-size: 0.875rem !important;
                            padding: 6px 10px !important;
                            background-color: #fff !important;
                            box-sizing: border-box;
                        }
                        .field-row .choices.is-focused .choices__inner,
                        .field-row .choices .choices__inner:focus-within {
                            border-color: #86b7fe !important;
                            box-shadow: 0 0 0 3px rgba(13,110,253,0.15) !important;
                            outline: none !important;
                        }
                        .field-row .choices[data-type="select-one"] .choices__button {
                            display: none !important;
                        }
                        .field-row .choices .choices__list--dropdown {
                            width: var(--field-width) !important;
                            z-index: 9999;
                        }
                        .custom-button {
                            color: #1a1647;
                            padding: 10px;
                            font-size: 12px;
                            border-radius: 0.5em;
                            background: ##d4d4db;
                            cursor: pointer;
                            border: 1px solid #9290aa;
                            transition: all 0.3s;
                        }
                        .custom-button:hover {
                            background-color: #b9b9c9;
                            border-color: #1a1647;
                        }

                        .custom-button:active {
                            color: #666;
                            box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
                        }

                        .cursor-blocked {
                            cursor: not-allowed !important;
                        }

                        </style>


                    `,

            contentCreated: me => {
                me.controls = me.controls || {};
                const btn_close = me.divModal.querySelector(".close");
                if (btn_close) btn_close.classList.add("d-none");
                const allInputs = me.divModal.querySelectorAll(
                    ".data-input, input, select, textarea"
                );
                allInputs.forEach(el => {
                    const key = el.dataset.field || el.name;
                    if (key) me.controls[key] = el;
                });
                me.controls.divItemsView = me.divModal.querySelector(
                    '[name="divItemsView"]'
                );

                me.controls.div_invoice_summary = me.divModal.querySelector(
                    '[name="div_invoice_summary"]'
                );

                me.controls.btnRent.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    if (
                        !me.controls.invoice_type.value ||
                        me.controls.invoice_type.value === ""
                    ) {
                        return cv_interact.error("Please select Invoice Type.");
                    }
                    const invoiceType = me.controls.invoice_type.value;
                    const spaces = me._tenantSpaces || [];
                    const months = me._tenantMonths || [];
                    const selectedSpaceId =
                        me.controls.space?.value ||
                        me.controls.space_id?.value ||
                        "";


                    const matchedSpace =
                        spaces.find(
                            s => String(s.space_id) === String(selectedSpaceId)
                        ) || spaces[0];

                    if (!matchedSpace) {
                        return cv_interact.error("No space/contract found.");
                    }
                    const availableMonths = months.filter(
                        m =>
                            String(m.contract_id) ===
                            String(matchedSpace.contract_id)
                    );

                    if (!availableMonths || availableMonths.length === 0) {
                        return cv_interact.error(
                            "Rent has already reached the final month of the contract."
                        );
                    }

                    // Popup Initialization
                    let rentDiv = null;
                    InputBox.resetInstance("rentPopUp");

                    InputBox.show({
                        title: "Rent Detail",
                        instanceKey: "rentPopUp",
                        createContent() {
                            const div = document.createElement("div");
                            rentDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Contract Details</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="contract_id" name="contract_id" type="text" readonly>
                            <label style="color:#777;">Unit Code / Room</label>
                        </div>
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="monthly" name="monthly" type="text" readonly>
                            <label style="color:#777;">Monthly</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Billing Period</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="start_date" name="start_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;">Start Date</label>
                        </div>
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="end_date" name="end_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;">End Date</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style=" color:#0C447C; font-size:13px;">Financials</span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem; ${
                            Number(invoiceType) === 2
                                ? "grid-column: span 2;"
                                : ""
                        }">
                            <input class="data-input form-control bg-light cursor-blocked" data-field="price" name="price" type="text" readonly style=" color:#0c447c;">
                            <label style="color:#777;">Effective Price ($)</label>
                        </div>
                        ${
                            Number(invoiceType) === 2
                                ? ""
                                : `                                        
                            <div class="material-input outlined" style="margin-bottom: 1rem;">
                                <input class="data-input form-control" data-field="tax_rate" name="tax_rate" type="text" inputmode="decimal" placeholder="0" required>
                                <label style="color:#777;">Tax % </label>
                            </div>`
                        }
                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                            <div style="flex:1">
                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                <label style="color:#777;">Discount</label>
                            </div>
                            <div style="width:100px;">
                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                    <option value="percent" selected>%</option>
                                    <option value="amount">$</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="material-input outlined" style="margin-bottom: 1rem; display:none;">
                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                    <label style="color:#777;">Remark</label>
                </div>
            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elContract = rentDiv.querySelector(
                                '[data-field="contract_id"]'
                            );
                            const elMonthly = rentDiv.querySelector(
                                '[data-field="monthly"]'
                            );
                            const elPrice = rentDiv.querySelector(
                                '[data-field="price"]'
                            );
                            const elStartDate = rentDiv.querySelector(
                                '[data-field="start_date"]'
                            );
                            const elEndDate = rentDiv.querySelector(
                                '[data-field="end_date"]'
                            );
                            const elDiscountType = rentDiv.querySelector(
                                '[data-field="discount_type"]'
                            );

                            if (!elContract || !elMonthly || !elPrice) return;

                            elContract.value =
                                matchedSpace.space_code || "(No code)";
                            elContract.dataset.contractId = String(
                                matchedSpace.contract_id
                            );

                            const effectivePrice = Number(
                                matchedSpace.effective_price || 0
                            );
                            elPrice.value = effectivePrice.toFixed(2);

                            const matchedMonth =
                                months.find(
                                    m =>
                                        String(m.contract_id) ===
                                        String(matchedSpace.contract_id)
                                ) || {};

                            elMonthly.value = matchedMonth.month || "";

                            if (elDiscountType) {
                                elDiscountType.value = "percent";
                            }
                            if (elStartDate) {
                                elStartDate.value =
                                    matchedMonth.start_date || "";
                            }
                            if (elEndDate) {
                                elEndDate.value = matchedMonth.end_date || "";
                            }

                            const numericInputs = [
                                rentDiv.querySelector(
                                    '[data-field="discount"]'
                                ),
                                rentDiv.querySelector('[data-field="tax_rate"]')
                            ].filter(input => input !== null);

                            numericInputs.forEach(input => {
                                input.addEventListener("input", e => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2) {
                                        v = parts[0] + "." + parts[1];
                                    }
                                    if (parts[1] !== undefined) {
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
                                    }
                                    e.target.value = v;
                                });

                                input.addEventListener("blur", e => {
                                    let v = parseFloat(e.target.value);
                                    if (isNaN(v) || v < 0) {
                                        e.target.value = "";
                                        return;
                                    }
                                    e.target.value = v.toFixed(2);
                                });
                            });
                        },

                        onConfirm(data, btn, ibMe) {
                            // 1. Check if Tax field exists in the DOM layout tree (Invoice Type !== 2)
                            const elTaxRate = document.querySelector(
                                '[data-field="tax_rate"]'
                            );

                            if (elTaxRate) {
                                // If tax field is blank, empty strings, or evaluates to an invalid number
                                if (
                                    data.tax_rate === undefined ||
                                    data.tax_rate === null ||
                                    String(data.tax_rate).trim() === ""
                                ) {
                                    return ibMe.setError(
                                        "Tax % is required for this invoice type."
                                    );
                                }

                                const taxValue = Number(data.tax_rate);
                                if (isNaN(taxValue) || taxValue < 0) {
                                    return ibMe.setError(
                                        "Please enter a valid Tax % value."
                                    );
                                }
                            }

                            const elContract = document.querySelector(
                                '[data-field="contract_id"]'
                            );
                            const realContractId =
                                elContract?.dataset.contractId ||
                                data.contract_id;

                            if (!realContractId) {
                                return ibMe.setError(
                                    "Unit Code / Room is missing."
                                );
                            }

                            const roomCode = matchedSpace.space_code || "—";
                            const finalPrice = Number(
                                data.price || matchedSpace.effective_price || 0
                            );

                            const dataToAdd = {
                                item_id: realContractId,
                                type: "rent",
                                price: finalPrice,
                                qty: 1,
                                remarks: `Rent - ${roomCode} (${data.monthly ||
                                    "N/A"})`,
                                contract_id: realContractId,
                                start_date: data.start_date || "",
                                end_date: data.end_date || "",
                                space_code: roomCode,
                                discount: Number(data.discount) || 0,
                                discount_type: data.discount_type || "percent",
                                tax_rate: Number(data.tax_rate) || 0
                            };

                            const existingIds = me.itemsView.rows
                                .map(
                                    row =>
                                        row.meta?.item_id || row.data?.item_id
                                )
                                .filter(
                                    id =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null
                                );

                            const isDuplicate = existingIds.some(
                                id => String(id) === String(dataToAdd.item_id)
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    `Rent is already in the list.`
                                );
                            }

                            me.itemsView.addRow(
                                {
                                    item_id: realContractId,
                                    type: "rent",
                                    price: finalPrice,
                                    qty: 1,
                                    remarks: `Rent - ${roomCode} (${data.monthly ||
                                        "N/A"})`,
                                    contract_id: realContractId,
                                    start_date: data.start_date || "",
                                    end_date: data.end_date || "",
                                    unit_type: "month",
                                    space_code: roomCode,
                                    discount: Number(data.discount) || 0,
                                    discount_type:
                                        data.discount_type || "amount",
                                    tax_rate: Number(data.tax_rate) || 0
                                },
                                0
                            );

                            cv_interact.success(
                                `Rent for ${roomCode} added successfully.`
                            );
                            ibMe.close();
                        }
                    });
                };

                me.controls.btnElectric.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    let electricDiv = null;
                    InputBox.resetInstance("electricPopUp");
                    InputBox.show({
                        title: "Electricity Utility",
                        instanceKey: "electricPopUp",

                        createContent() {
                            const div = document.createElement("div");
                            electricDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <!-- Tabs Container -->
                                <div class="d-flex mb-3" style="border-bottom:1px solid #eee; gap:16px;">
                                    <div id="btn_tab_reading" style="cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;">By Reading</div>
                                    <div id="btn_tab_manual" style="cursor:pointer; padding:8px 12px; color:#777;">Manual Entry</div>
                                </div>

                                <!-- Section: Core Consumption Inputs -->
                                <div class="d-flex align-items-center mb-3">
                                    <span id="consumption_header" style="color:#0C447C; font-size:13px;">Readings</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <!-- Conditional Dynamic Fields (Reading vs Manual) -->
                                <div id="row_reading_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="old_electric" name="old_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;">Old Reading (kWh)</label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="new_electric" name="new_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;">New Reading (kWh)</label>
                                    </div>
                                </div>

                                <!-- Shared Units Field (ReadOnly on Reading tab, Editable on Manual tab) -->
                                <div id="row_manual_fields" class="material-input outlined" style="margin-bottom: 1rem; display:none;">
                                    <input class="data-input form-control" data-field="units_used" name="units_used" type="text" inputmode="decimal" placeholder="0.00">
                                    <label style="color:#777;">Units Used (kWh)</label>
                                </div>

                               <!-- Section: Unified Calculations -->
                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;">Calculation</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <!-- Dynamic Row Container: Swaps between 2 columns (Reading mode) and 3 columns (Manual mode) -->
                                <div id="row_calculation_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    
                                    <!-- Only visible in Reading Tab -->
                                    <div id="wrapper_units_readonly" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input id="units_used_readonly" class="form-control bg-light cursor-blocked" type="text" readonly placeholder="0.00">
                                        <label style="color:#777;">Calculated Units (kWh)</label>
                                    </div>
                                    
                                    <!-- Shared Field: Changes grid position dynamically -->
                                    <div id="wrapper_exchange_rate" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="exchange_rate" name="exchange_rate" type="text" inputmode="decimal" placeholder="0.00" value="4025">
                                        <label style="color:#777;">Exchange Rate (KHR)</label>
                                    </div>

                                    <!-- Hidden on Reading Init, part of the 3-column row in Manual -->
                                    <div id="wrapper_price_khr" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_khr" name="price_khr" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;">Price per kWh (KHR)</label>
                                    </div>

                                    <div id="wrapper_price_usd" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_usd" name="price_usd" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;">Price per kWh (USD)</label>
                                    </div>
                                </div>

                                <!-- Section: Unified Period -->
                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;">Period</span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;">Start Date</label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;">End Date</label>
                                    </div>
                                </div>

                                <!-- Unified Total Amount Footer Display -->
                                <div class="material-input outlined">
                                    <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                        style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;">
                                    <label style="color:#0c447c;">Total Amount ($)</label>
                                </div>
                                
                                <div class="material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                                <input class="data-input" type="text" data-field="entry_mode" value="reading" style="display:none;">
                            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            // Target elements using structural selectors
                            const elOld = electricDiv.querySelector(
                                '[data-field="old_electric"]'
                            );
                            const elNew = electricDiv.querySelector(
                                '[data-field="new_electric"]'
                            );
                            const elUnits = electricDiv.querySelector(
                                '[data-field="units_used"]'
                            );
                            const elUnitsReadonly = electricDiv.querySelector(
                                "#units_used_readonly"
                            );

                            const elExchangeRate = electricDiv.querySelector(
                                '[data-field="exchange_rate"]'
                            );
                            const elPriceKHR = electricDiv.querySelector(
                                '[data-field="price_khr"]'
                            );
                            const elPriceUSD = electricDiv.querySelector(
                                '[data-field="price_usd"]'
                            );

                            const elStartDate = electricDiv.querySelector(
                                '[data-field="start_date"]'
                            );
                            const elEndDate = electricDiv.querySelector(
                                '[data-field="end_date"]'
                            );
                            const elTotal = electricDiv.querySelector(
                                '[data-field="total_amount"]'
                            );
                            const elRemark = electricDiv.querySelector(
                                '[data-field="remark"]'
                            );
                            const elMode = electricDiv.querySelector(
                                '[data-field="entry_mode"]'
                            );

                            // Structural layout layout control nodes
                            const btnTabReading = electricDiv.querySelector(
                                "#btn_tab_reading"
                            );
                            const btnTabManual = electricDiv.querySelector(
                                "#btn_tab_manual"
                            );
                            const txtConsumptionHeader = electricDiv.querySelector(
                                "#consumption_header"
                            );
                            const rowReadingFields = electricDiv.querySelector(
                                "#row_reading_fields"
                            );
                            const rowManualFields = electricDiv.querySelector(
                                "#row_manual_fields"
                            );
                            const wrapperUnitsReadonly = electricDiv.querySelector(
                                "#wrapper_units_readonly"
                            );

                            // Currency conversion handlers
                            elPriceKHR.addEventListener("input", e => {
                                const rate =
                                    parseFloat(elExchangeRate.value) || 4000;
                                const khrVal = parseFloat(e.target.value) || 0;
                                elPriceUSD.value =
                                    khrVal > 0
                                        ? (khrVal / rate).toFixed(2)
                                        : "";
                                recalc();
                            });

                            elPriceUSD.addEventListener("input", e => {
                                const rate =
                                    parseFloat(elExchangeRate.value) || 4000;
                                const usdVal = parseFloat(e.target.value) || 0;
                                elPriceKHR.value =
                                    usdVal > 0 ? Math.round(usdVal * rate) : "";
                                recalc();
                            });

                            elExchangeRate.addEventListener("input", () => {
                                const rate =
                                    parseFloat(elExchangeRate.value) || 4000;
                                const usdVal =
                                    parseFloat(elPriceUSD.value) || 0;
                                if (usdVal > 0) {
                                    elPriceKHR.value = Math.round(
                                        usdVal * rate
                                    );
                                } else {
                                    const khrVal =
                                        parseFloat(elPriceKHR.value) || 0;
                                    if (khrVal > 0)
                                        elPriceUSD.value = (
                                            khrVal / rate
                                        ).toFixed(2);
                                }
                                recalc();
                            });

                            // UI Tab switcher

                            // New structural nodes for 3-in-1 row switching
                            const rowCalculationFields = electricDiv.querySelector(
                                "#row_calculation_fields"
                            );

                            // UI Tab switcher
                            const switchTab = mode => {
                                elMode.value = mode;
                                if (mode === "reading") {
                                    // Form structure configuration
                                    rowReadingFields.style.display = "grid";
                                    rowManualFields.style.display = "none";
                                    txtConsumptionHeader.textContent =
                                        "Readings";

                                    // Calculation Row: Standard 2x2 layout look
                                    rowCalculationFields.style.gridTemplateColumns =
                                        "1fr 1fr";
                                    wrapperUnitsReadonly.style.display =
                                        "block";

                                    // Tab Styles
                                    btnTabReading.style.cssText =
                                        "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                    btnTabManual.style.cssText =
                                        "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                } else {
                                    // Form structure configuration
                                    rowReadingFields.style.display = "none";
                                    rowManualFields.style.display = "block";
                                    txtConsumptionHeader.textContent =
                                        "Manual Entry";

                                    // Calculation Row: Shrinks into 1 clean row with 3 columns
                                    rowCalculationFields.style.gridTemplateColumns =
                                        "1fr 1fr 1fr";
                                    wrapperUnitsReadonly.style.display = "none";

                                    // Tab Styles
                                    btnTabManual.style.cssText =
                                        "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                    btnTabReading.style.cssText =
                                        "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                }
                                recalc();
                            };

                            btnTabReading.onclick = () => switchTab("reading");
                            btnTabManual.onclick = () => switchTab("manual");

                            // Centralized recalculation logic
                            const recalc = () => {
                                const mode = elMode.value;
                                let units = 0;

                                if (mode === "reading") {
                                    const oldVal = parseFloat(elOld.value) || 0;
                                    const newVal = parseFloat(elNew.value) || 0;
                                    units = newVal - oldVal;

                                    if (units < 0) {
                                        elUnitsReadonly.value = "0.00";
                                        elUnitsReadonly.style.color = "red";
                                    } else {
                                        elUnitsReadonly.value = units.toFixed(
                                            2
                                        );
                                        elUnitsReadonly.style.color = "#212529";
                                    }
                                } else {
                                    units = parseFloat(elUnits.value) || 0;
                                }

                                const ppu = parseFloat(elPriceUSD.value) || 0;
                                const total = Math.max(0, units) * ppu;

                                if (elTotal) elTotal.value = total.toFixed(2);

                                if (elRemark) {
                                    const start = elStartDate.value || "";
                                    const end = elEndDate.value || "";
                                    const period =
                                        start && end
                                            ? ` (${start} - ${end})`
                                            : "";
                                    const calcStr =
                                        units > 0 && ppu > 0
                                            ? ` — ${units.toFixed(
                                                  2
                                              )} kWh × $${ppu.toFixed(2)}`
                                            : mode === "reading"
                                            ? " — Reading Setup"
                                            : " — Manual Entry";

                                    elRemark.value = `Electric${period}${calcStr}`;
                                }
                            };

                            // Input format validation helpers and recalculation binding
                            [
                                elOld,
                                elNew,
                                elUnits,
                                elPriceUSD,
                                elExchangeRate,
                                elStartDate,
                                elEndDate
                            ].forEach(el => {
                                if (!el) return;
                                el.addEventListener("input", recalc);
                                if (el.dataset.type === "date") {
                                    el.addEventListener("change", recalc);
                                }

                                // Block non-numeric characters while tying
                                el.addEventListener("input", e => {
                                    if (el.dataset.type === "date") return;
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    if (parts[1] !== undefined)
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
                                    e.target.value = v;
                                });

                                // Enforce proper floats on losing input focus
                                el.addEventListener("blur", e => {
                                    if (el.dataset.type === "date") return;
                                    let v = parseFloat(e.target.value);
                                    if (isNaN(v) || v < 0) {
                                        e.target.value = "";
                                        return;
                                    }
                                    e.target.value = v.toFixed(2);
                                });
                            });
                        },

                        onConfirm(data, btn, ibMe) {
                            const mode = data.entry_mode || "reading";
                            const ppu = parseFloat(data.price_usd) || 0;
                            let units = 0;
                            let remarks = "";

                            // Validation rules per view mode
                            if (mode === "reading") {
                                const oldReading =
                                    parseFloat(data.old_electric) || 0;
                                const newReading =
                                    parseFloat(data.new_electric) || 0;
                                units = newReading - oldReading;

                                if (newReading <= 0)
                                    return ibMe.setError(
                                        "New reading is required."
                                    );
                                if (newReading <= oldReading)
                                    return ibMe.setError(
                                        "New reading must be greater than old reading."
                                    );
                                remarks = `Electricity ${oldReading}kWh - ${newReading}kWh`;
                            } else {
                                units = parseFloat(data.units_used) || 0;
                                if (units <= 0)
                                    return ibMe.setError(
                                        "Units Used field is required and must be greater than 0."
                                    );
                                remarks = `Electric Utility - ${data.start_date ||
                                    ""} to ${data.end_date || ""}`;
                            }

                            if (ppu <= 0)
                                return ibMe.setError(
                                    "Price per kWh (USD) is required."
                                );
                            if (!data.start_date || !data.end_date)
                                return ibMe.setError(
                                    "Start and End dates are required."
                                );
                            if (
                                new Date(data.end_date) <
                                new Date(data.start_date)
                            ) {
                                return ibMe.setError(
                                    "End date cannot be before Start date."
                                );
                            }

                            // Push payload to items view structure
                            me.itemsView.addRow(
                                {
                                    item_id: null,
                                    type: "utility",
                                    price: ppu,
                                    qty: units,
                                    // remarks: remarks,
                                    remarks:
                                        mode === "reading"
                                            ? `Electricity ${data.old_electric ||
                                                  0}kWh - ${data.new_electric ||
                                                  0}kWh`
                                            : `Electricity ${units}kWh`,
                                    unit_type: "kWh",
                                    old_reading:
                                        mode === "reading"
                                            ? parseFloat(data.old_electric) || 0
                                            : 0,
                                    new_reading:
                                        mode === "reading"
                                            ? parseFloat(data.new_electric) || 0
                                            : 0,
                                    units_used: units,
                                    price_per_unit: ppu,
                                    start_date: data.start_date,
                                    end_date: data.end_date,
                                    discount: 0,
                                    discount_type: "percent"
                                },
                                0
                            );

                            cv_interact.success("Electric item added.");
                            ibMe.close();
                        }
                    });
                };

                // ====================== Water ===================
                // me.controls.btnWater.onclick = () => {
                //     if (!me._selectedTenantId) {
                //         return cv_interact.error("Please select Tenant first.");
                //     }
                //     if (
                //         !me.controls.space.value ||
                //         me.controls.space.value === ""
                //     ) {
                //         return cv_interact.error("Please select Space.");
                //     }

                //     InputBox.resetInstance("waterPopUp");
                //     let waterDiv = null;
                //     InputBox.show({
                //         title: "Water Utility",
                //         instanceKey: "waterPopUp",

                //         createContent() {
                //             const div = document.createElement("div");
                //             div.style.cssText =
                //                 "display:flex; flex-direction:column;";

                //             div.innerHTML = `
                //                     <div>
                //                         <div class="d-flex align-items-center gap-2 mb-3">
                //                             <span style=" color:#0C447C; font-size:13px;">Readings</span>
                //                             <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                //                         </div>
                //                         <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                //                             <div class="material-input outlined" style="margin-bottom: 1rem;">
                //                                 <input class="data-input form-control" data-field="old_water" name="old_water" type="text" inputmode="decimal" placeholder="0" min="0">
                //                                 <label style="color:#777;">Old Reading (m³)</label>
                //                             </div>
                //                             <div class="material-input outlined" style="margin-bottom: 1rem;">
                //                                 <input class="data-input form-control" data-field="new_water" name="new_water" type="text" inputmode="decimal" placeholder="0" min="0">
                //                                 <label style="color:#777;">New Reading (m³)</label>
                //                             </div>
                //                         </div>
                //                     </div>

                //                     <div>
                //                         <div class="d-flex align-items-center gap-2 mb-3">
                //                             <span style=" color:#0C447C; font-size:13px;">Billing Period</span>
                //                             <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                //                         </div>
                //                         <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                //                             <div class="material-input outlined" style="margin-bottom: 1rem;">
                //                                 <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                //                                 <label style="color:#777;">Start Date</label>
                //                             </div>
                //                             <div class="material-input outlined" style="margin-bottom: 1rem;">
                //                                 <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                //                                 <label style="color:#777;">End Date</label>
                //                             </div>
                //                         </div>
                //                     </div>

                //                     <div>
                //                         <div class="d-flex align-items-center gap-2 mb-3">
                //                             <span style=" color:#0C447C; font-size:13px;">Calculation</span>
                //                             <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                //                         </div>
                //                         <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                //                             <div class="material-input outlined">
                //                                 <input class="data-input form-control bg-light cursor-blocked" data-field="units_used" name="units_used" type="text" readonly style="">
                //                                 <label style="color:#777;">Units Used (m³)</label>
                //                             </div>
                //                             <div class="material-input outlined" >
                //                                 <input class="data-input form-control" data-field="price_per_unit" name="price_per_unit" type="text" inputmode="decimalq" placeholder="0.00" step="0.01">
                //                                 <label style="color:#777;">Price per m³ ($)</label>
                //                             </div>
                //                         </div>
                //                     </div>

                //                     <div style="display:flex; flex-direction:column;">
                //                         <div class="material-input outlined">
                //                             <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                //                                 style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;">
                //                             <label style="color:#0c447c; ">Total Amount ($)</label>
                //                         </div>
                //                         <div class="material-input outlined" >
                //                             <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                //                             <label style="color:#777;">Remark</label>
                //                         </div>
                //                     </div>
                //                 `;
                //             return div;
                //         },

                //         onOpen(ibMe) {
                //             // Mapping elements
                //             const elOld = document.querySelector(
                //                 '[data-field="old_water"]'
                //             );
                //             const elNew = document.querySelector(
                //                 '[data-field="new_water"]'
                //             );
                //             const elUnits = document.querySelector(
                //                 '[data-field="units_used"]'
                //             );
                //             const elPPU = document.querySelector(
                //                 '[data-field="price_per_unit"]'
                //             );
                //             const elTotal = document.querySelector(
                //                 '[data-field="total_amount"]'
                //             );
                //             const elRemark = document.querySelector(
                //                 '[data-field="remark"]'
                //             );
                //             const elStartDate = document.querySelector(
                //                 '[data-field="start_date"]'
                //             );
                //             const elEndDate = document.querySelector(
                //                 '[data-field="end_date"]'
                //             );

                //             const recalc = () => {
                //                 const oldVal = parseFloat(elOld?.value) || 0;
                //                 const newVal = parseFloat(elNew?.value) || 0;
                //                 const ppu = parseFloat(elPPU?.value) || 0;

                //                 const units = Math.max(0, newVal - oldVal);
                //                 if (elUnits) elUnits.value = units.toFixed(2);

                //                 const total = units * ppu;
                //                 if (elTotal)
                //                     elTotal.value = total.toLocaleString(
                //                         undefined,
                //                         {
                //                             minimumFractionDigits: 2,
                //                             maximumFractionDigits: 2
                //                         }
                //                     );

                //                 if (elRemark) {
                //                     const start = elStartDate?.value || "";
                //                     const end = elEndDate?.value || "";
                //                     const period =
                //                         start && end
                //                             ? ` (${start} - ${end})`
                //                             : "";
                //                     elRemark.value = `Water${period} — ${units.toFixed(
                //                         2
                //                     )} m³ × $${ppu.toFixed(2)}`;
                //                 }
                //             };

                //             [elOld, elNew, elPPU].forEach(el => {
                //                 if (!el) return;
                //                 el.addEventListener("input", recalc);
                //                 el.addEventListener("input", e => {
                //                     let v = e.target.value.replace(
                //                         /[^0-9.]/g,
                //                         ""
                //                     );
                //                     const parts = v.split(".");
                //                     if (parts.length > 2)
                //                         v = parts[0] + "." + parts[1];
                //                     if (parts[1] !== undefined)
                //                         v =
                //                             parts[0] +
                //                             "." +
                //                             parts[1].slice(0, 2);
                //                     e.target.value = v;
                //                 });
                //                 el.addEventListener("blur", e => {
                //                     let v = parseFloat(e.target.value);
                //                     if (isNaN(v) || v < 0) {
                //                         e.target.value = "";
                //                         return;
                //                     }
                //                     e.target.value = v.toFixed(2);
                //                 });
                //             });

                //             [elStartDate, elEndDate].forEach(el =>
                //                 el?.addEventListener("change", recalc)
                //             );
                //         },

                //         onConfirm(data, btn, ibMe) {
                //             const oldReading = parseFloat(data.old_water) || 0;
                //             const newReading = parseFloat(data.new_water) || 0;
                //             const ppu = parseFloat(data.price_per_unit) || 0;
                //             const units = Math.max(0, newReading - oldReading);

                //             // Validation
                //             if (
                //                 data.start_date &&
                //                 data.end_date &&
                //                 new Date(data.end_date) <
                //                     new Date(data.start_date)
                //             ) {
                //                 return ibMe.setError(
                //                     "End date cannot be before Start date."
                //                 );
                //             }
                //             if (newReading <= 0) {
                //                 return ibMe.setError(
                //                     "New reading is required and must be greater than 0."
                //                 );
                //             }
                //             if (newReading < oldReading) {
                //                 return ibMe.setError(
                //                     "New reading cannot be less than old reading."
                //                 );
                //             }
                //             if (ppu <= 0) {
                //                 return ibMe.setError(
                //                     "Price per m³ is required and must be positive."
                //                 );
                //             }

                //             // Logic to add row
                //             me.itemsView.addRow(
                //                 {
                //                     item_id: null,
                //                     item_name: "Water",
                //                     type: "utility",
                //                     price: ppu,
                //                     qty: units,
                //                     remarks:
                //                         data.remark ||
                //                         `Water (${units.toFixed(2)} m³)`,
                //                     unit_type: "m³",
                //                     start_date: data.start_date || "",
                //                     end_date: data.end_date || "",
                //                     old_reading: oldReading,
                //                     new_reading: newReading,
                //                     units_used: units,
                //                     price_per_unit: ppu,
                //                     discount: 0,
                //                     discount_type: "percent",
                //                     tax_rate: 0
                //                 },
                //                 0
                //             );

                //             cv_interact.success("Water item added");
                //             ibMe.close();
                //         }
                //     });
                // };

                // ===================== Service =================
                me.controls.btnService.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error("Please select Space.");
                    }

                    const services = availableItem || [];
                    if (services.length === 0) {
                        return cv_interact.error("No services available.");
                    }
                    const serviceOptions = services
                        .map(
                            s =>
                                `<option value="${s.id}">${s.service ||
                                    s.name ||
                                    `Service #${s.id}`}</option>`
                        )
                        .join("");

                    let serviceDiv = null;

                    InputBox.resetInstance("servicePopUp");

                    InputBox.show({
                        title: "Add Service",
                        instanceKey: "servicePopUp",
                        createContent() {
                            const div = document.createElement("div");
                            serviceDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Service Selection</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <select class="data-input form-control" data-style="material" data-field="service_id" name="service_id" placeholder="Select Service">
                                                ${serviceOptions}
                                            </select>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light" data-field="charge_as" name="charge_as" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Charge As</label>
                                        </div>
                                        <div id="price_wrapper" class="material-input outlined" style="margin-bottom: 1rem; grid-column: span 2;">
                                            <input class="data-input form-control bg-light" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Unit Price ($)</label>
                                        </div>
                                        <div id="duration_container" style="display:none; margin-bottom: 1rem;" class="material-input outlined" >
                                            <select class="data-input form-control" data-style="material" data-field="duration_months" name="duration_months" placeholder="Duration (Qty)">
                                                <option value="1">1 Month</option>
                                                <option value="3">3 Months</option>
                                                <option value="6">6 Months</option>
                                                <option value="12">12 Months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div id="billing_period_container" style="display:none;">
                                    <div class="d-flex align-items-center  mb-3">
                                        <span style=" color:#0C447C; font-size:13px;">Billing Period</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;">Start Date</label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;">End Date</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Financials</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>

                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;">Discount</label>
                                            </div>
                                            <div style="width:80px;">
                                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                                    <option value="percent" selected>%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="material-input outlined mt-3" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                            `;
                            return div;
                        },
                        onOpen(ibMe) {
                            const elBillingCont = serviceDiv.querySelector(
                                "#billing_period_container"
                            );
                            const elPriceWrapper = serviceDiv.querySelector(
                                "#price_wrapper"
                            );

                            const elService = serviceDiv.querySelector(
                                '[data-field="service_id"]'
                            );
                            const elUnitType = serviceDiv.querySelector(
                                '[data-field="charge_as"]'
                            );
                            const elPrice = serviceDiv.querySelector(
                                '[data-field="price"]'
                            );
                            const elDuration = serviceDiv.querySelector(
                                '[data-field="duration_months"]'
                            );
                            const elDurationCont = serviceDiv.querySelector(
                                "#duration_container"
                            );
                            const elStartDate = serviceDiv.querySelector(
                                '[data-field="start_date"]'
                            );
                            const elEndDate = serviceDiv.querySelector(
                                '[data-field="end_date"]'
                            );
                            const elDiscountType = serviceDiv.querySelector(
                                '[data-field="discount_type"]'
                            );

                            const fillFields = serviceId => {
                                const selected = services.find(
                                    s => String(s.id) === String(serviceId)
                                );
                                if (selected) {
                                    const unit = (
                                        selected.charge_as || ""
                                    ).toLowerCase();

                                    if (elUnitType)
                                        elUnitType.value =
                                            selected.charge_as || "—";
                                    if (elPrice)
                                        elPrice.value = Number(
                                            selected.price || 0
                                        ).toFixed(2);

                                    if (unit === "month") {
                                        elDurationCont.style.display = "block";
                                        elBillingCont.style.display = "block";
                                        elPriceWrapper.style.gridColumn =
                                            "span 1";
                                    } else {
                                        elDurationCont.style.display = "none";
                                        elDuration.value = "1";
                                        elBillingCont.style.display = "none";
                                        elPriceWrapper.style.gridColumn =
                                            "span 2";

                                        elStartDate.value = "";
                                        elEndDate.value = "";
                                    }

                                    recalcDates();
                                }
                            };

                            const recalcDates = () => {
                                if (elStartDate.value && elDuration.value) {
                                    let start = new Date(elStartDate.value);
                                    if (isNaN(start.getTime())) return;

                                    let months =
                                        parseInt(elDuration.value) || 1;
                                    let end = new Date(start);
                                    end.setMonth(end.getMonth() + months);
                                    end.setDate(end.getDate() - 1);

                                    const formatDate = date => {
                                        const monthsArr = [
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
                                            "Dec"
                                        ];
                                        const day = String(
                                            date.getDate()
                                        ).padStart(2, "0");
                                        const month =
                                            monthsArr[date.getMonth()];
                                        const year = date.getFullYear();
                                        return `${day}-${month}-${year}`;
                                    };

                                    elEndDate.value = formatDate(end);
                                }
                            };

                            if (elDiscountType)
                                elDiscountType.value = "percent";

                            if (elService) {
                                fillFields(elService.value);
                                elService.addEventListener("change", e =>
                                    fillFields(e.target.value)
                                );
                            }

                            [elDuration, elStartDate].forEach(el => {
                                el?.addEventListener("change", recalcDates);
                            });

                            // Numeric logic for discount
                            const elDiscount = serviceDiv.querySelector(
                                '[data-field="discount"]'
                            );
                            if (elDiscount) {
                                elDiscount.addEventListener("input", e => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    e.target.value = v;
                                });
                                elDiscount.addEventListener("blur", e => {
                                    let v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);
                                });
                            }
                        },
                        onConfirm(data, btn, ibMe) {
                            if (!data.service_id) {
                                return ibMe.setError(
                                    "Please select a Service."
                                );
                            }

                            const selectedService = services.find(
                                s => String(s.id) === String(data.service_id)
                            );
                            if (!selectedService) return;

                            const serviceDisplayName =
                                selectedService.service ||
                                selectedService.name ||
                                `Service #${selectedService.id}`;

                            const formatDt = dStr => {
                                if (!dStr) return "";
                                const date = new Date(dStr);
                                if (isNaN(date.getTime())) return dStr;
                                const monthsArr = [
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
                                    "Dec"
                                ];
                                const day = String(date.getDate()).padStart(
                                    2,
                                    "0"
                                );
                                const month = monthsArr[date.getMonth()];
                                const year = date.getFullYear();
                                return `${day}-${month}-${year}`;
                            };

                            const unit = (
                                selectedService.charge_as || ""
                            ).toLowerCase();

                            // Validation for monthly services
                            if (unit === "month") {
                                if (!data.duration_months) {
                                    return ibMe.setError(
                                        "Please input Duration."
                                    );
                                }
                                if (!data.start_date || !data.end_date) {
                                    return ibMe.setError(
                                        "Please input Start and End Date."
                                    );
                                }
                            }

                            const qtyMonths =
                                unit === "month"
                                    ? parseInt(data.duration_months) || 1
                                    : 1;

                            let remarkStr = serviceDisplayName;
                            if (unit === "month") {
                                remarkStr += ` - ${qtyMonths} Month${
                                    qtyMonths > 1 ? "s" : ""
                                } `;
                            }

                            const dataToAdd = {
                                item_id: data.service_id,
                                type: "service",
                                price: Number(selectedService.price) || 0,
                                qty: qtyMonths,
                                remarks: remarkStr,
                                unit_type: selectedService.charge_as || "Month",
                                discount: Number(data.discount) || 0,
                                start_date: data.start_date || "",
                                end_date: data.end_date || "",
                                discount_type: data.discount_type || "percent"
                            };

                            const existingIds = me.itemsView.rows
                                .map(
                                    row =>
                                        row.meta?.item_id || row.data?.item_id
                                )
                                .filter(
                                    id =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null
                                );
                            const isDuplicate = existingIds.some(
                                id => String(id) === String(dataToAdd.item_id)
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    `Service is already in the list.`
                                );
                            }

                            me.itemsView.addRow(
                                {
                                    item_id: data.service_id,
                                    type: "service",
                                    price: Number(selectedService.price) || 0,
                                    qty: qtyMonths,
                                    remarks: remarkStr,
                                    unit_type:
                                        selectedService.charge_as || "Month",
                                    discount: Number(data.discount) || 0,
                                    start_date: data.start_date || "",
                                    end_date: data.end_date || "",
                                    discount_type:
                                        data.discount_type || "percent"
                                },
                                0
                            );
                            cv_interact.success(
                                `Service added for ${qtyMonths} ${
                                    unit === "month" ? "month(s)" : "unit"
                                }`
                            );
                            ibMe.close();
                        },
                        onCancel(ibMe) {
                            ibMe.close();
                        }
                    });
                };

                // ==================Service Request=========
                me.controls.btnRequest.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error("Please select Tenant first.");
                    }

                    const selectedSpaceId =
                        me.controls.space?.value || me.controls.space_id?.value;
                    if (!selectedSpaceId || selectedSpaceId === "") {
                        return cv_interact.error("Please select Space.");
                    }

                    const requests = me._requestedServices || [];
                    console.log("All Requests", requests);

                    const filteredRequests = requests.filter(
                        r => String(r.space_id) === String(selectedSpaceId)
                    );

                    if (filteredRequests.length === 0) {
                        return cv_interact.error(
                            "No Requests relate to this space."
                        );
                    }

                    const serviceRequestOption = filteredRequests
                        .map(
                            sr =>
                                `<option value="${sr.request_id}">${sr.code} (${sr.space_code})</option>`
                        )
                        .join("");

                    let requestDiv = null;
                    InputBox.resetInstance("requestPopUp");

                    InputBox.show({
                        title: "Service Request",
                        instanceKey: "requestPopUp",
                        createContent() {
                            const div = document.createElement("div");
                            requestDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Request Info</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <select class="data-input form-control" data-field="request_id" name="request_id" data-style="material" placeholder="Request No">
                                                ${serviceRequestOption}
                                            </select>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="service_name" name="service_name" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Service Name</label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light" data-field="unit_type" name="unit_type" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Unit Type</label>
                                        </div>
                                        <div class="material-input outlined" data-wrapper="duration" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="duration_hours" name="duration_hours" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Duration (Hours)</label>
                                        </div>
                                        <div id="price_wrapper_requested" class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control bg-light cursor-blocked" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;">Original Price ($)</label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;">Financials</span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;">Discount</label>
                                            </div>
                                            <div style="width:80px;">
                                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                                    <option value="percent" selected>%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div class=" material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;">Remark</label>
                                </div>
                            `;
                            return div;
                        },

                        onOpen(ibMe) {
                            const elPriceWrapperR = requestDiv.querySelector(
                                "#price_wrapper_requested"
                            ); // ✅ Fixed: was serviceDiv
                            const elRequest = requestDiv.querySelector(
                                '[data-field="request_id"]'
                            );
                            const elDuration = requestDiv.querySelector(
                                '[data-field="duration_hours"]'
                            );
                            const elPrice = requestDiv.querySelector(
                                '[data-field="price"]'
                            );
                            const elServiceName = requestDiv.querySelector(
                                '[data-field="service_name"]'
                            );
                            const elUnitType = requestDiv.querySelector(
                                '[data-field="unit_type"]'
                            );
                            const elRemark = requestDiv.querySelector(
                                '[data-field="remark"]'
                            );
                            const elDurationWrapper = requestDiv.querySelector(
                                '[data-wrapper="duration"]'
                            );
                            const elDiscountType = requestDiv.querySelector(
                                '[data-field="discount_type"]'
                            );

                            if (elPriceWrapperR)
                                elPriceWrapperR.style.gridColumn = "span 2";

                            const fillRequestData = selectedId => {
                                const matched = filteredRequests.find(
                                    r =>
                                        String(r.request_id) ===
                                        String(selectedId)
                                );

                                if (matched) {
                                    elServiceName.value =
                                        matched.service_name || "";
                                    elUnitType.value = matched.unit_type || "";
                                    elDuration.value =
                                        matched.duration_hours || "0";
                                    elPrice.value = Number(
                                        matched.price
                                    ).toFixed(2);
                                    elRemark.value = matched.remarks || "";

                                    elDurationWrapper.style.display =
                                        matched.unit_type === "Hour"
                                            ? "block"
                                            : "none";
                                    elPriceWrapperR.style.gridColumn =
                                        matched.unit_type === "Hour"
                                            ? "span 2"
                                            : "span 1"; // ✅ Now works
                                }
                            };

                            if (elDiscountType)
                                elDiscountType.value = "percent";

                            if (elRequest) {
                                fillRequestData(elRequest.value);
                                elRequest.addEventListener("change", e => {
                                    fillRequestData(e.target.value);
                                });
                            }

                            const elDiscount = requestDiv.querySelector(
                                '[data-field="discount"]'
                            );
                            if (elDiscount) {
                                elDiscount.addEventListener("input", e => {
                                    let v = e.target.value.replace(
                                        /[^0-9.]/g,
                                        ""
                                    );
                                    const parts = v.split(".");
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    if (parts[1] !== undefined)
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
                                    e.target.value = v;
                                });
                                elDiscount.addEventListener("blur", e => {
                                    const v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);
                                });
                            }
                        },

                        onConfirm(data, btn, ibMe) {
                            const selectedRequest = filteredRequests.find(
                                r =>
                                    String(r.request_id) ===
                                    String(data.request_id)
                            );

                            if (!selectedRequest) {
                                return cv_interact.error(
                                    "Please select a service request."
                                );
                            }

                            const requestDisplayName =
                                selectedRequest.code ||
                                `Request # ${selectedRequest.request_id}`;

                            const existingIds = me.itemsView.rows
                                .map(
                                    row =>
                                        row.meta?.item_id || row.data?.item_id
                                )
                                .filter(
                                    id =>
                                        id !== undefined &&
                                        id !== "" &&
                                        id !== null
                                );

                            const isDuplicate = existingIds.some(
                                id =>
                                    String(id) ===
                                    String(selectedRequest.request_id)
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    "Service Request is already in the list."
                                );
                            }

                            // ✅ Fixed: build once, reuse in addRow
                            const dataToAdd = {
                                item_id: selectedRequest.request_id,
                                type: "Service Request",
                                price: Number(selectedRequest.price),
                                qty:
                                    selectedRequest.unit_type === "Hour"
                                        ? selectedRequest.duration_hours || 0
                                        : 1,
                                unit_type: `${selectedRequest.unit_type || 0}`,
                                remarks: `Service Request:  ${requestDisplayName}`,
                                space_id: selectedRequest.space_id,
                                space_code: selectedRequest.space_code,
                                discount: Number(data.discount) || 0,
                                discount_type: data.discount_type || "percent",
                                request_id: selectedRequest.request_id
                            };

                            me.itemsView.addRow(dataToAdd, 0);
                            cv_interact.success(
                                "Service request added to invoice"
                            );
                            ibMe.close();
                        }
                    });
                };

                me.itemsView = new ItemsView(me.controls.divItemsView, {
                    currencyCode: "USD",
                    columns: [
                        // {
                        //     name: "item_id",
                        //     displayType: "text",
                        //     readOnly: true,
                        //     width: "2px",
                        // },
                        // {
                        //     name: "item_name",
                        //     transTitle: "titles.Item",
                        //     displayType: "text",
                        //     dataType: "string",
                        //     readOnly: true,
                        //     className: "small col-item-name",
                        //     width: "250px",
                        //     // html: '<input type="checkbox" class="check_accept">',
                        // },
                        // {
                        //     name: "type",
                        //     transTitle: "titles.Type",
                        //     dataType: "text",
                        //     readOnly: true,
                        //     displayType: "hidden"
                        // },
                        // {
                        //     name: "remarks",
                        //     transTitle: "titles.Remarks",
                        //     dataType: "string",
                        //     readOnly: true
                        // },
                        {
                            name: "remarks",
                            transTitle: "titles.Item",
                            displayType: "text",
                            dataType: "string",
                            readOnly: true,
                            className: "small col-item-name",
                            width: "250px"
                            // html: '<input type="checkbox" class="check_accept">',
                        },

                        // {
                        //     name: "unit_type",
                        //     transTitle: "titles.Charge As",
                        //     dataType: "text",
                        //     readOnly: true,
                        //     defaultValue: "-"
                        // },
                        {
                            name: "start_date",
                            transTitle: "titles.Start Date",
                            dataType: "text",
                            readOnly: true,
                            width: "150px"
                        },
                        {
                            name: "end_date",
                            transTitle: "titles.End Date",
                            dataType: "text",
                            readOnly: true,
                            width: "150px"
                        },
                        {
                            name: "qty",
                            transTitle: "titles.QTY",
                            dataType: "number",
                            readOnly: true,
                            className: "text-start"
                        },
                        {
                            name: "price",
                            transTitle: "titles.Price",
                            readOnly: true,
                            isNumeric: true,
                            dataType: "money"
                        },
                        {
                            name: "discount",
                            transTitle: "titles.Discount",
                            isDiscount: true,
                            discountType: ["percent", "amount"],
                            defaultDiscountType: "percent",
                            discountBeforeTax: true,
                            readOnly: true,
                            width: "200px"
                        },
                        {
                            name: "tax_rate",
                            transTitle: "titles.Tax",
                            dataType: "percent",
                            readOnly: true
                        },
                        {
                            name: "total",
                            transTitle: "titles.Total",
                            dataType: "number",
                            readOnly: true,
                            isNumeric: true
                        }
                    ],
                    calc: {
                        mode: "auto",
                        qtyField: "qty",
                        priceField: "price",
                        totalField: "total",
                        taxField: "tax_rate",
                        currencyPrecision: 2
                    },

                    totalSummary: {
                        container: me.controls.div_invoice_summary,
                        showTax: false,
                        allowDiscount: true,
                        discountBeforeTax: true,
                        currencyConversion: {
                            currency_code: "KHR",
                            rate: 4100
                        }
                    },
                    // currencyConversion: {
                    //     currency_code: "KHR",
                    //     rate: 4100,
                    //     transTitle: "titles.Amount in KHR"
                    // },
                    tableClass: "table",
                    ensureEmptyRow: false,
                    showAddLineButton: false,
                    showAddLineButton: false,

                    validateColumns: {
                        item_id: "positive",
                        qty: "positive",
                        price: "positive"
                    },

                    itemRendered(item, ctx) {
                        const tr = ctx.tr;
                        const item_id = ctx.data.item_id;
                        const type = ctx.data.type;
                        const unit_type = ctx.data.unit_type;
                        console.log(ctx.data);
                        item.setRowMeta(tr, {
                            item_id: item_id,
                            type: type,
                            unit_type: unit_type
                        });
                    },

                    onItemChange: (rowId, item, fieldName, td, tr) => {
                        if (fieldName === "item_id") {
                            const selectedService = availableItem.find(
                                s => String(s.id) === String(item.item_id)
                            );
                            if (selectedService) {
                                me.itemsView.setCellValue(
                                    tr,
                                    "price",
                                    Number(selectedService.price) || 0
                                );
                                me.itemsView.setCellValue(
                                    tr,
                                    "unit_type",
                                    selectedService.unit_type || "—"
                                );
                                me.itemsView.setCellValue(tr, "qty", 1);
                                me.itemsView.setCellValue(
                                    tr,
                                    "remarks",
                                    selectedService.service ||
                                        selectedService.name ||
                                        "—"
                                );
                                me.itemsView.setCellValue(
                                    tr,
                                    "type",
                                    "service"
                                );
                            } else if (item.contract_id || item.space_price) {
                                const rentPrice =
                                    parseFloat(
                                        item.space_price || item.price
                                    ) || 0;
                                me.itemsView.setCellValue(
                                    tr,
                                    "price",
                                    rentPrice
                                );
                                me.itemsView.setCellValue(tr, "type", "rent");
                                me.itemsView.setCellValue(tr, "unit_type", "—");
                            }
                        }
                    }
                });

                me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                    type: "select",
                    prefetch: true,
                    query: {
                        from: "tenants",
                        where: [["status_id", "=", 2]],
                        select: [
                            "id",
                            "name",
                            "legal_name",
                            "email",
                            "phone_number"
                        ],
                        searchFields: {
                            name: "LIKE",
                            legal_name: "like",
                            email: "=",
                            phone: "="
                        }
                    },
                    columns: { name: "Name", phone_number: "Phone" },
                    onSelect: tenant => {
                        me._selectedTenantId = tenant.id;
                        vsapi
                            .post(
                                `${main_view.base_url}/prm/tenant/option-tenant-with-contract`,
                                { tenant_id: tenant.id },
                                {}
                            )
                            .then(res => {
                                const d = res.data || {};

                                me.controls.phone_number.value =
                                    d.tenant?.phone_number || "";
                                me.controls.email.value = d.tenant?.email || "";
                                me._selectedTenantId = tenant.id;
                                me._tenantData = d;
                                me._tenantSpaces = d.spaces || [];
                                me._tenantMonths = d.months || [];
                                me._requestedServices =
                                    d.service_requests || [];

                                VSUtil.setComboItems(
                                    me.controls.space,
                                    d.spaces || [],
                                    "space_id",
                                    "space_code",
                                    "",
                                    "Select Space",
                                    ""
                                );
                            });
                    }
                });

                me.searchTenant.reset("");

                me.saveData = () => {
                    let header = me.getData();
                    const items = me.itemsView.getItems({
                        metaKeys: ["item_id", "type", "remark", "unit_type"]
                    }); // Retrieves all row data

                    console.log("Items", items);

                    const totals = me.itemsView.getCurrentTotals?.() || {};

                    if (me._selectedTenantId) {
                        header.tenant_id = me._selectedTenantId;
                    }
                    if (me.dataOptions?.id) {
                        header.id = me.dataOptions.id;
                    }

                    const toMySQLDate = dateStr => {
                        if (!dateStr) return null;
                        const d = new Date(dateStr);
                        return isNaN(d.getTime())
                            ? null
                            : d.toISOString().split("T")[0];
                    };

                    const mappedItems = items
                        .filter(
                            item =>
                                parseFloat(item.price || 0) > 0 ||
                                parseFloat(item.qty || 0) > 0
                        )

                        .map(item => {
                            return {
                                ...item,
                                item_id: item.item_id || null,
                                type: item.type || "service",
                                qty: parseFloat(item.qty || 1),
                                price: parseFloat(item.price || 0),
                                unit_type: item.unit_type || "—",
                                remarks: item.remarks || item.description || "",
                                start_date: item.start_date,
                                end_date: item.end_date,
                                discount: parseFloat(item.discount || 0),
                                tax_rate: parseFloat(item.tax_rate || 0),
                                amount: parseFloat(item.total || 0)
                            };
                        });

                    return {
                        ...header,
                        items: mappedItems,
                        discount_value: totals.discount_value || 0,
                        discount_type: totals.discount_type || "percent",
                        amount: totals.subtotal, // Total for the invoice header
                        amount_payable: totals.grand_total
                    };
                };
            },

            onPrepareForm: (me, data) => {
                availableItem = (data.services || []).filter(
                    s => s.type_id == 2
                );

                me._selectedTenantId = null;
                me._tenantData = null;
                me._tenantSpaces = [];
                me._tenantMonths = [];

                // Clear all inputs
                if (me.controls) {
                    Object.values(me.controls).forEach(el => {
                        if (
                            el &&
                            (el.tagName === "INPUT" ||
                                el.tagName === "TEXTAREA")
                        ) {
                            el.value = "";
                        }
                    });
                    if (me.controls.space) {
                        me.controls.space.innerHTML =
                            '<option value="">-- Select Room / Space --</option>';
                        me.controls.space.value = "";
                        me.controls.space.dispatchEvent(
                            new Event("change", { bubbles: true })
                        );
                    }
                }
                if (me.searchTenant) me.searchTenant.reset("");
                if (me.itemsView) me.itemsView.setData([]);

                if (me.dataOptions.id) {
                    vsapi
                        .call(`${main_view.base_url}/prm/invoice/details`, {
                            id: me.dataOptions.id
                        })
                        .then(res => {
                            if (res.status_code !== 200) {
                                cv_interact.error(
                                    "Failed to load invoice details."
                                );
                                return;
                            }
                            const detail = res.data || {};
                            console.log("invoice detail:", detail);

                            me.controls.due_date.value = detail.due_date;
                            me.controls.issue_date.value = detail.issue_date;
                            me.controls.invoice_type.value =
                                detail.invoice_type || "";
                            if (me.controls.general_remark) {
                                me.controls.general_remark.value =
                                    detail.general_remark || "";
                            }
                            if (me.controls.tenant) {
                                me.controls.tenant.value =
                                    detail.tenant_name || "";
                            }
                            if (detail.tenant_id) {
                                me._selectedTenantId = detail.tenant_id;
                                me.controls.phone_number.value =
                                    detail.tenant_phone || "";
                                me.controls.email.value =
                                    detail.tenant_email || "";

                                vsapi
                                    .post(
                                        `${main_view.base_url}/prm/tenant/option-tenant-with-contract`,
                                        { tenant_id: detail.tenant_id },
                                        {}
                                    )
                                    .then(res => {
                                        const d = res.data || {};
                                        me._tenantSpaces = d.spaces || [];
                                        me._tenantMonths = d.months || [];
                                        me._requestedServices =
                                            d.service_requests || [];

                                        VSUtil.setComboItems(
                                            me.controls.space,
                                            d.spaces || [],
                                            "space_id",
                                            "space_code",
                                            "",
                                            "Select Space",
                                            ""
                                        );
                                        setTimeout(() => {
                                            if (detail.space_id) {
                                                me.controls.space.value = String(
                                                    detail.space_id
                                                );

                                                // ✅ Verify — if Choices.js overrides, force via option.selected
                                                if (
                                                    me.controls.space.value !==
                                                    String(detail.space_id)
                                                ) {
                                                    const opt = Array.from(
                                                        me.controls.space
                                                            .options
                                                    ).find(
                                                        o =>
                                                            String(o.value) ===
                                                            String(
                                                                detail.space_id
                                                            )
                                                    );
                                                    if (opt) {
                                                        opt.selected = true;
                                                        me.controls.space.dispatchEvent(
                                                            new Event(
                                                                "change",
                                                                {
                                                                    bubbles: true
                                                                }
                                                            )
                                                        );
                                                        console.log(
                                                            "space restored via option.selected:",
                                                            opt.text
                                                        );
                                                    } else {
                                                        console.warn(
                                                            "space option not found for id:",
                                                            detail.space_id
                                                        );
                                                    }
                                                } else {
                                                    console.log(
                                                        "space restored:",
                                                        me.controls.space.value
                                                    );
                                                }
                                            }
                                        }, 100);
                                    });
                            }

                            me.itemsView.setData(detail);

                            console.log(
                                "Invoice items loaded into view:",
                                detail.items
                            );
                        });
                }
            },

            onShow: me => {
                const title = me.divModal.querySelector(".modal-title");
                if (title) {
                    const isModify = !!me.dataOptions?.id;
                    title.innerHTML = isModify
                        ? '<h2 class="text-prm-custom text-start fw-bold">Modify Invoice</h2>'
                        : '<h2 class="text-prm-custom text-start fw-bold">Create Invoice</h2>';
                }
            },

            prepareFormOptions: {
                modifyTitle: "Modify Invoice",
                createTitle: "Create Invoice",
                targetProp: "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: op => {
                        console.log("API params op:", op);
                        return { id: op.id };
                    }
                }
            },

            onClose: me => {
                if (me.controls && me.controls.space) {
                    me.controls.space.innerHTML =
                        '<option value="">-- Select Room / Space --</option>';
                }
                if (me.searchTenant) me.searchTenant.reset("");
                if (me.itemsView) me.itemsView.setData([]);
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: me => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Save"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const formData = me.saveData();

                        if (!formData) return;

                        if (!formData.items || formData.items.length === 0) {
                            return cv_interact.error("Add at least one item.");
                        }

                        vsapi
                            .call(
                                `${main_view.base_url}/prm/invoice/save`,
                                formData,
                                btn
                            )
                            .then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        formData.id
                                            ? "Invoice has been updated."
                                            : "Invoice has been successfully created."
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message || "Save failed."
                                    );
                                }
                            });
                    }
                }
            ]
        });

        dialog.show(op);
    };
    return self;
})();

const ReceiveDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = op => {
        dialog = new GeneralDialog({
            title: "Receive Payment",
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
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Total Paid</div>
                            <div style="font-size:17px;font-weight:600;color:#19BF9B;" id="f_tot">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;text-align:right;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;">Remaining</div>
                            <div style="font-size:17px;font-weight:600;color:#FAB31C;" id="f_bal">$0.00</div>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;">

                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Cash</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="c_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cash" type="text" class="form-control data-input" data-field="cash"
                                        min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Bank Transfer</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="b_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="bank_transfer_bank_id" class="form-select data-input" data-field="bank_transfer_bank_id" data-style="material" placeholder="Bank"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="transfer_amount" type="text" class="form-control data-input"
                                        data-field="transfer_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="bank_ref_number" type="text" class="form-control data-input"
                                        data-field="bank_ref_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Ref Number</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Card</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="ca_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="card_type" class="form-select data-input" data-field="card_type"
                                            data-style="material">
                                        <option value="">None</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_amount" type="text" class="form-control data-input"
                                        data-field="card_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_number" type="text" class="form-control data-input"
                                        data-field="card_number" placeholder=""/>
                                    <label style="padding-left:6px;color:#777777;">Card Number</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">Cheque</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">Entered: <strong id="ch_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="cheque_bank_id" class="form-select data-input"
                                            data-field="cheque_bank_id" data-style="material" placeholder="Cheque Bank"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_amount" type="text" class="form-control data-input"
                                        data-field="cheque_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Amount ($)</label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_number" type="text" class="form-control data-input"
                                        data-field="cheque_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;">Cheque Number</label>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div class="material-input outlined" style="margin:0;">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks"
                                        rows="2" style="height:55px;" placeholder=""></textarea>
                                <label style="padding-left:6px;color:#777777;">Remarks</label>
                            </div>
                        </div>

                    </div>
                </div>`,

            contentCreated: me => {
                const updateTotals = () => {
                    const getValue = name => {
                        const el = me.divModal.querySelector(
                            `[name="${name}"]`
                        );
                        return el ? parseFloat(el.value) || 0 : 0;
                    };

                    const fmt = n => "$" + Number(n).toFixed(2);

                    const cash = getValue("cash");
                    const bank = getValue("transfer_amount");
                    const card = getValue("card_amount");
                    const cheque = getValue("cheque_amount");

                    const totalPaid = cash + bank + card + cheque;

                    // Get Due amount safely
                    let due = 0;
                    const dueEl = me.divModal.querySelector("#f_due");
                    if (dueEl) {
                        due =
                            parseFloat(
                                dueEl.textContent.replace(/[^0-9.-]+/g, "")
                            ) || 0;
                    }

                    const remaining = due - totalPaid;

                    // --- Update Summary Header ---
                    me.divModal.querySelector("#f_tot").textContent = fmt(
                        totalPaid
                    );

                    const balEl = me.divModal.querySelector("#f_bal");
                    if (balEl) {
                        if (totalPaid > due + 0.001) {
                            balEl.style.color = "#dc3545"; // Red for Error
                            balEl.textContent =
                                "Overpaid: " + fmt(Math.abs(remaining));
                        } else {
                            balEl.style.color =
                                remaining <= 0.001 ? "#3B6D11" : "#FAB31C";
                            balEl.textContent = fmt(Math.max(0, remaining));
                        }
                    }

                    // --- Update Badge Displays ---
                    me.divModal.querySelector("#c_e").textContent =
                        cash > 0 ? fmt(cash) : "—";
                    me.divModal.querySelector("#b_e").textContent =
                        bank > 0 ? fmt(bank) : "—";
                    me.divModal.querySelector("#ca_e").textContent =
                        card > 0 ? fmt(card) : "—";
                    me.divModal.querySelector("#ch_e").textContent =
                        cheque > 0 ? fmt(cheque) : "—";

                    // --- Sync Remarks ---
                    const remarkParts = [];
                    if (cash > 0)
                        remarkParts.push(`Paid ${fmt(cash)} via Cash`);
                    if (bank > 0)
                        remarkParts.push(`Paid ${fmt(bank)} via Bank Transfer`);
                    if (card > 0)
                        remarkParts.push(`Paid ${fmt(card)} via Card`);
                    if (cheque > 0)
                        remarkParts.push(`Paid ${fmt(cheque)} via Cheque`);

                    const remarkEl = me.divModal.querySelector(
                        '[name="remarks"]'
                    );
                    if (remarkEl) {
                        remarkEl.value = remarkParts.join(", ");
                        remarkEl.dispatchEvent(new Event("change"));
                    }
                };

                const amountFields = [
                    "cash",
                    "transfer_amount",
                    "card_amount",
                    "cheque_amount"
                ];
                amountFields.forEach(name => {
                    const input = me.divModal.querySelector(`[name="${name}"]`);
                    if (input) {
                        input.addEventListener("input", updateTotals);
                        input.addEventListener("change", updateTotals);
                    }
                });

                me.convertPayment = data => {
                    const parseAmt = v =>
                        isNaN(parseFloat(v)) ? 0 : parseFloat(v);
                    const breakdowns = [];

                    if (parseAmt(data.cash) > 0) {
                        breakdowns.push({
                            method: "Cash",
                            amount: parseAmt(data.cash),
                            currency_code: "USD"
                        });
                    }
                    if (parseAmt(data.transfer_amount) > 0) {
                        breakdowns.push({
                            method: "Bank",
                            amount: parseAmt(data.transfer_amount),
                            currency_code: "USD",
                            bank_id:
                                parseInt(data.bank_transfer_bank_id) || null,
                            bank_name: me.getSelectText
                                ? me.getSelectText("bank_transfer_bank_id")
                                : null,
                            bank_ref_number: data.bank_ref_number || null
                        });
                    }
                    if (parseAmt(data.card_amount) > 0) {
                        breakdowns.push({
                            method: "Card",
                            amount: parseAmt(data.card_amount),
                            currency_code: "USD",
                            card_type: data.card_type || null,
                            card_number: data.card_number || null
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
                            cheque_number: data.cheque_number || null
                        });
                    }
                    return {
                        invoice_id: me.dataOptions?.invoice_id || null,
                        remarks: (data.remarks || "").trim(),
                        pmt_breakdowns: breakdowns
                    };
                };

                applyNumberInput(me.controls.cash);
                applyNumberInput(me.controls.cheque_amount);
                applyNumberInput(me.controls.card_amount);
                applyNumberInput(me.controls.transfer_amount);
            },

            onPrepareForm: me => {
                const opts = me.dataOptions || {};
                if (opts.invoice_id) {
                    vsapi
                        .call(`${main_view.base_url}/prm/invoice/details`, {
                            id: opts.invoice_id
                        })
                        .then(res => {
                            if (res.status_code === 200) {
                                const d = res.data || {};
                                const bal = Number(d.balance || 0).toFixed(2);
                                const set = (id, val) => {
                                    const el = me.divModal.querySelector(
                                        "#" + id
                                    );
                                    if (el) el.textContent = val;
                                };
                                set("f_due", "$" + bal);
                                set("f_bal", "$" + bal);
                                set("f_tot", "$0.00");
                            }
                        });
                }

                vsapi
                    .call(`${main_view.base_url}/prm/invoice/form-options`)
                    .then(res => {
                        const banks = res?.data?.banks || [];
                        if (me.controls.bank_transfer_bank_id) {
                            VSUtil.setComboItems(
                                me.controls.bank_transfer_bank_id,
                                banks,
                                "id",
                                "name",
                                true,
                                "— Select Bank —"
                            );
                        }
                        if (me.controls.cheque_bank_id) {
                            VSUtil.setComboItems(
                                me.controls.cheque_bank_id,
                                banks,
                                "id",
                                "name",
                                true,
                                "— Select Bank —"
                            );
                        }
                    });
            },

            buttons: [
                {
                    label: "Cancel",
                    cssClass: "btn btn-secondary",
                    click: me => me.hide(false)
                },
                {
                    label: "Receive",
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const rawData = me.getData();
                        const payload = me.convertPayment(rawData);
                        const totalInput = payload.pmt_breakdowns.reduce(
                            (sum, item) => sum + item.amount,
                            0
                        );
                        const dueEl = me.divModal.querySelector("#f_due");
                        const balanceDue = dueEl
                            ? parseFloat(
                                  dueEl.textContent.replace(/[^0-9.-]+/g, "")
                              ) || 0
                            : 0;

                        if (totalInput <= 0) {
                            return cv_interact.error(
                                "Please enter a payment amount."
                            );
                        }

                        vsapi
                            .call(
                                `${main_view.base_url}/prm/invoice/receive`,
                                payload,
                                btn
                            )
                            .then(res => {
                                if (res.status_code === 200) {
                                    cv_interact.success(
                                        "Payment Received Successfully."
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message || "Save failed."
                                    );
                                }
                            })
                            .catch(err => {
                                console.error(err);
                                cv_interact.error("Network error occurred.");
                            });
                    }
                }
            ]
        });

        dialog.show(op);
    };

    return self;
})();
