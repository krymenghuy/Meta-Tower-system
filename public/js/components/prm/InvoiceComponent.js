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
    mThis.elSpaceType = mThis.self.querySelector("#space_type_id");
    mThis.elTenant = mThis.self.querySelector("#tenant_id");
    mThis.elSearch = mThis.self.querySelector("#_search_invoice");

    mThis.cols = [
        { transTitle: "", className: "align-middle text-capitalize" },
        {
            transTitle: "titles.Invoice Num",
            className: "align-middle text-start",
            data: data =>
                `<span class="text-yp-custom">${data.code || "N/A"}</span>`
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle",
            data: data =>
                `<span class="text-yp-custom">${data.tenant_name || "—"}</span>`
        },
        {
            transTitle: "titles.Space Code",
            className: "align-middle",
            data: data =>
                `<span class="text-yp-custom">${data.space_code || "—"}</span>`
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-primary",
            data: data => {
                const amt = data.amount
                    ? Number(data.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            transTitle: "titles.Paid",
            className: "align-middle text-success",
            data: data => {
                const amt = data.paid_amount
                    ? Number(data.paid_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle text-danger",
            data: data => {
                const amt = data.balance
                    ? Number(data.balance).toLocaleString("en-US", {
                          minimumFractionDigits: 2
                      })
                    : "0.00";
                return `<span class="d-block text-yp-custom fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            }
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle",
            data: data =>
                `<span class="text-yp-custom">${data.due_date || "N/A"}</span>`
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-center",
            data: data => {
                const statusId = Number(data.payment_status_id || 0);
                let cls = "bg-secondary";

                if (statusId === 1) cls = "bg-success";           // Paid
                else if (statusId === 2) cls = "bg-danger";       // Unpaid
                else if (statusId === 3) cls = "bg-warning text-dark"; // Partially Paid

                return `<span class="badge ${cls} text-capitalize px-2 py-1">
                            ${data.payment_status_name || "—"}
                        </span>`;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle",
            data: data => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.update_user ||
                        "—"}</span>
                    <small class="text-muted">${data.updated_at || "—"}</small>
                </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center",
            data: data => `
                <div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action"
                        data-id="${
                            data.id
                        }" data-statusid="${data.payment_status_id || ""}">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.InvoiceListView = new ListView("_invoice_list", {
            fetchApi: `${main_view.base_url}/prm/invoice/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.statusid = data.payment_status_id || 0;
                tr.id = `invoice_id_${data.id}`;
                tr.dataset.ispaid = data.payment_status_id || 0;     // ← This is used by dropdown
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

        const pr_tbl = mThis.InvoiceListView.getListContainer();
        const sh_parent = pr_tbl.parentElement;
        sh_parent.style.height = `${window.innerHeight - 200}px`;
        sh_parent.classList.add("overflow-y-auto", "overflow-x-hidden");
        window.addEventListener(
            "resize",
            () => {
                sh_parent.style.height = `${window.innerHeight - 200}px`;
            },
            { passive: true }
        );

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
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice details</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const currency = mThis.currency_symbol || "$";

        // ✅ Filter out placeholder rows: must have either price or total/amount
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
        // Helper to display discount correctly ($ or %)
        const getDiscountDisplay = (item) => {
            const discountValue = parseFloat(item.discount || item.special_discount_value || 0);
            const discountType  = (item.discount_type || item.special_discount_type || 'percent').toLowerCase().trim();
            const currency = mThis.currency_symbol || "$";

            if (discountValue <= 0) {
                return `<span class="text-muted">—</span>`;
            }

            if (discountType === 'amount' || discountType === '$') {
                // Show as money: - $25.00
                return `-${currency}${discountValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2
                })}`;
            } else {
                // Show as percent: - 10.00%
                return `-${discountValue.toLocaleString("en-US", {
                    minimumFractionDigits: 2
                })}%`;
            }
        };

        const itemsHtml = validItems
            .map(item => {
                const rawType = (item.type || "service").toLowerCase().trim();

                let badgeClass = "bg-light border text-dark";
                if (rawType === "rent")
                    badgeClass = "bg-primary text-white border-0";
                if (rawType === "utility")
                    badgeClass = "bg-warning text-dark border-0";

                const qty = parseFloat(item.qty || 1);
                const price = parseFloat(item.price || 0);
                const discount = parseFloat(
                    item.discount || item.special_discount_value || 0
                );
                const taxAmount = parseFloat(item.tax_rate) || 0;

                console.log("discount", discount);
                console.log("item", item);

                // Use 'total' if available (calculated by engine), fallback to 'amount' (from DB)
                const total = parseFloat(item.total || item.amount || 0);

                return `
                <tr>
                    <td class="fw-medium">${item.description ||
                        item.remarks ||
                        item.item_name ||
                        "—"}
                    </td>
                    <td class="text-center">
                        <span class="badge rounded-pill ${badgeClass} px-3 py-1 text-capitalize">
                            ${rawType}
                        </span>
                    </td>
                    <td class="text-center text-muted small">${qty}</td>
                    <td class="text-center text-muted small">${
                        item.unit_type ? item.unit_type.trim() : "—"}
                    </td>
                    <td class="text-center small">${formatDate(item.start_date)}</td>
                    <td class="text-center small">${formatDate(item.end_date)}</td>
                    <td class="text-end">${price.toLocaleString("en-US", {minimumFractionDigits: 2})}</td>
                    <td class="text-end text-danger">${getDiscountDisplay(item)}</td>
                    <td class="text-end text-info">+${taxAmount}%</td>
                    <td class="text-end fw-bold">${currency}${total.toLocaleString("en-US",{ minimumFractionDigits: 2 })}</td>

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
            { discount: 0, tax:0,total: 0 }
        );

        const fmt = n =>
            n.toLocaleString("en-US", { minimumFractionDigits: 2 });

        container.innerHTML = `
            <div class="bg-white rounded shadow-sm p-3">
                <div class="table-responsive">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background:#f0f4ff;">
                            <tr>
                                <th class="text-center" style="min-width:150px;">Description</th>
                                <th class="text-center" style="width:100px;">Type</th>
                                <th class="text-center" style="width:0px;">Quantity</th>
                                <th class="text-center" style="width:90px;">Unit</th>
                                <th class="text-center" style="width:110px;">Start Date</th>
                                <th class="text-center" style="width:110px;">End Date</th>
                                <th class="text-end" style="width:100px;">Price</th>
                                <th class="text-end" style="width:100px;">Discount</th>
                                <th class="text-center" style="width:80px;">Tax %</th>
                                <th class="text-end" style="width:120px;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml ||
                                '<tr><td colspan="10" class="text-center py-4 text-muted">No items found</td></tr>'}
                        </tbody>
                        <tfoot class="table-light fw-bold">
                            <tr>
                                <td colspan="9" class="text-end text-uppercase text-primary">Summary</td>
                                <td class="text-end text-success fs-5">${currency}${fmt(foot.total)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                ${invoice.remarks? `
                    <div class="mt-3 p-3 bg-light rounded border">
                        <small class="text-muted fw-semibold d-block mb-1 text-uppercase" style="font-size: 0.7rem;">Remarks:</small>
                        <p class="mb-0 small">${invoice.remarks}</p>
                    </div>`: ""
                }

                <div class="text-end mt-4 no-print">
                    <button class="btn btn-sm btn-outline-primary" onclick="window.print()">
                        <i class="bi bi-printer me-1"></i> Print Invoice
                    </button>
                </div>
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



    mThis.initDropdownMenus = (container) => {
        const menuOptions = {
            containerElement: container,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white box-shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Print Invoice"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_invoice",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Invoice"></span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_invoice",
                },
            ],
            onShow: (me, menuContainer) => {
                const statusId = Number(menuContainer.dataset.ispaid || 0);

                let allowed = [];

                if (statusId === 1) {
                    allowed = ["print_invoice"];
                }
                else if (statusId === 2) {
                    allowed = ["print_invoice", "delete_invoice"];
                }
                else if (statusId === 3) {
                    allowed = ["print_invoice", "delete_invoice"];
                }
                else {
                    allowed = ["print_invoice", "delete_invoice"];
                }

                const menuItems = me.getActiveMenus(menuContainer);
                for (const key in menuItems) {
                    if (menuItems[key]?.style) {
                        menuItems[key].style.display =
                            allowed.includes(menuItems[key].dataset.mnuaction || menuItems[key].dataset.name)
                                ? "block"
                                : "none";
                    }
                }
            },
            onClick: (menulink, id, name) => {
                if (name === "delete_invoice") {
                    mThis.deleteInvoice(id, menulink);
                } else if (name === "print_invoice") {
                    mThis.printInvoice(id, menulink);
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

                vsapi.call(`${main_view.base_url}/prm/invoice/delete`, { id }, menuLink)
                    .then(res => {
                        if (res.status_code === 200) {
                            mThis.InvoiceListView.showPage(mThis.getFilterData());
                            cv_interact.success("Invoice deleted successfully");
                        } else {
                            cv_interact.error(res.error_message || "Failed to delete");
                        }
                    });
            }
        );
    };



mThis.printInvoice = (id, menulink) => {
    console.log("=== PRINT INVOICE CLICKED ===");
    console.log("Invoice ID:", id);
    console.log("PrintInvoiceDialog defined?", typeof PrintInvoiceDialog);

    if (!AuthManager.allowed(309)) {
        cv_interact.error("You do not have permission to print invoices.");
        return;
    }

    if (typeof PrintInvoiceDialog === "undefined" || typeof PrintInvoiceDialog.show !== "function") {
        console.error("PrintInvoiceDialog is not defined!");
        cv_interact.error("Print dialog is not available. Please contact administrator.");
        return;
    }

    // If we reach here, the dialog exists
    PrintInvoiceDialog.show({
        invoice_id: id,
        btn: menulink
    });
};


    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/invoice/form-options`)
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
    let dlg = null;
    let availableItem = [];

    const self = {};
    self.show = op => {
        dlg =
            dlg ||
            new GeneralDialog({
                cssClass: "modal-xl vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => `
                <div class="container-fluid">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <input name="tenant" class="data-input form-control" data-field="tenant_id" placeholder=" Tenant " autocomplete="off" data-style="material">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <select data-style="material" name="space" class="data-input form-control" data-field="space_id" required placeholder="Space">
                                </select>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <input name="phone_number" class="data-input form-control">
                                <label style="padding-left:6px;color:#777;">Phone Number</label>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="material-input outlined">
                                <input name="email" class="data-input form-control">
                                <label style="padding-left:6px;color:#777;">Email</label>
                            </div>
                        </div>
                    </div>
                    <div class="row g-3 mb-3 d-flex justify-content-between align-items-end">
                        <div class="col-md-3 material-input outlined">
                            <input type="text" data-type="date" name="due_date" class="form-control data-input" required placeholder="dd-mm-yy">
                            <label class="form-label">Due Date <span class="text-danger">*</span></label>
                        </div>
                        <div class="col-md-auto">
                            <div class="d-flex gap-2">
                                <button name="btnRent" class="btn btn-outline-primary">Rent</button>
                                <button name="btnService" class="btn btn-outline-warning">Service</button>
                                <button name="btnElectric" class="btn btn-outline-success">Electric Bill</button>
                                <button name="btnWater" class="btn btn-outline-secondary">Water Bill</button>
                            </div>
                        </div>
                    </div>
                    <div name="divItemsView"></div>
                    <div class="mt-4 d-flex justify-content-end">
                        <div name="div_invoice_summary"></div>
                    </div>
                </div>
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

                    // ================ Rent ====================
                    me.controls.btnRent.onclick = () => {
                        if (!me._selectedTenantId) {
                            return cv_interact.error(
                                "Please select Tenant first"
                            );
                        }

                        const spaces = me._tenantSpaces || [];
                        const months = me._tenantMonths || [];

                        const selectedSpaceId =
                            me.controls.space_id?.value ||
                            me.controls.space?.value ||
                            "";
                        const matchedContract = spaces.find(
                            s => String(s.space_id) === String(selectedSpaceId)
                        );
                        const defaultContractId =
                            matchedContract?.contract_id ??
                            spaces[0]?.contract_id;

                        const monthOptions = months
                            .filter(
                                m =>
                                    String(m.contract_id) ===
                                    String(defaultContractId)
                            )
                            .map(
                                m =>
                                    `<option value="${m.month}">${m.month}</option>`
                            )
                            .join("");

                        InputBox.resetInstance("rentPopUp");
                        InputBox.show({
                            title: "Rent",
                            instanceKey: "rentPopUp",
                            createContent() {
                                const div = document.createElement("div");
                                div.style.cssText =
                                    "display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;";
                                div.innerHTML = `
                                <div class="material-input outlined">
                                    <input class="data-input form-control bg-light"
                                        data-field="contract_id" name="contract_id"
                                        type="text" readonly placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">Unit Code / Room</label>
                                </div>
                                <div class="material-input outlined">
                                    <select class="data-input form-control" data-field="monthly" name="monthly" data-style="material" placeholder="Monthly">
                                        ${monthOptions}
                                    </select>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="start_date" name="start_date" type="text" readonly placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">Start Date</label>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="end_date" name="end_date" type="text" readonly placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">End Date</label>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="price" name="price" type="text" placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">Price</label>
                                </div>
                                <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end;">
                                    <div style="flex:1">
                                        <input class="data-input form-control" data-field="discount" name="discount" type="text" placeholder="0">
                                        <label class="form-label" style="font-size:13px;color:#555;">Discount</label>
                                    </div>
                                    <div style="width:85px;">
                                        <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                            <option value="percent">%</option>
                                            <option value="amount">$</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="tax_rate" name="tax_rate" type="text" placeholder="0">
                                    <label class="form-label" style="font-size:13px;color:#555;">Tax %</label>
                                </div>
                                <div style="grid-column: span 2;" class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="3"></textarea>
                                    <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                </div>
                            `;
                                return div;
                            },

                            onOpen(ibMe) {
                                const elContract = document.querySelector(
                                    '[data-field="contract_id"]'
                                );
                                const elMonthly = document.querySelector(
                                    '[data-field="monthly"]'
                                );
                                const elPrice = document.querySelector(
                                    '[data-field="price"]'
                                );
                                const elStartDate = document.querySelector(
                                    '[data-field="start_date"]'
                                );
                                const elEndDate = document.querySelector(
                                    '[data-field="end_date"]'
                                );

                                if (!elContract || !elMonthly) return;

                                const updateDates = (
                                    selectedMonth,
                                    contractId
                                ) => {
                                    const matchedMonth = months.find(
                                        m =>
                                            String(m.contract_id) ===
                                                String(contractId) &&
                                            m.month === selectedMonth
                                    );
                                    if (matchedMonth) {
                                        if (elStartDate)
                                            elStartDate.value =
                                                matchedMonth.start_date || "";
                                        if (elEndDate)
                                            elEndDate.value =
                                                matchedMonth.end_date || "";
                                    } else {
                                        if (elStartDate) elStartDate.value = "";
                                        if (elEndDate) elEndDate.value = "";
                                    }
                                };

                                elMonthly.addEventListener("change", e => {
                                    const currentContractId =
                                        elContract.dataset.contractId;
                                    updateDates(
                                        e.target.value,
                                        currentContractId
                                    );
                                });

                                const fillFields = contractId => {
                                    if (!contractId) return;
                                    const matchedSpace = spaces.find(
                                        s =>
                                            String(s.contract_id) ===
                                            String(contractId)
                                    );
                                    const defaultMonth =
                                        months.find(
                                            m =>
                                                String(m.contract_id) ===
                                                String(contractId)
                                        ) || {};
                                    if (matchedSpace && elPrice) {
                                        elPrice.value = Number(
                                            matchedSpace.price || 0
                                        ).toFixed(2);
                                    }
                                    if (elMonthly)
                                        elMonthly.value =
                                            defaultMonth.month || "";
                                    if (elStartDate)
                                        elStartDate.value =
                                            defaultMonth.start_date || "";
                                    if (elEndDate)
                                        elEndDate.value =
                                            defaultMonth.end_date || "";
                                };

                                let targetContractId = null;
                                let displaySpaceCode = "";

                                if (selectedSpaceId) {
                                    const match = spaces.find(
                                        s =>
                                            String(s.space_id) ===
                                            String(selectedSpaceId)
                                    );
                                    if (match) {
                                        targetContractId = match.contract_id;
                                        displaySpaceCode =
                                            match.space_code || "";
                                    }
                                }

                                if (!targetContractId && spaces.length > 0) {
                                    targetContractId = spaces[0].contract_id;
                                    displaySpaceCode =
                                        spaces[0].space_code || "";
                                }

                                if (targetContractId) {
                                    elContract.dataset.contractId = String(
                                        targetContractId
                                    );
                                    elContract.value =
                                        displaySpaceCode || "(No room code)";
                                    fillFields(targetContractId);
                                }
                            },

                            onConfirm(data, btn, ibMe) {
                                const elContract = document.querySelector(
                                    '[data-field="contract_id"]'
                                );
                                const realContractId =
                                    elContract?.dataset.contractId ||
                                    data.contract_id;

                                if (!realContractId) {
                                    cv_interact.error(
                                        "Unit Code / Room is missing"
                                    );
                                    return;
                                }

                                const matchedSpace = spaces.find(
                                    s =>
                                        String(s.contract_id) ===
                                        String(realContractId)
                                );
                                const roomCode =
                                    matchedSpace?.space_code || "—";

                                const filteredMonths = months.filter(
                                    m =>
                                        String(m.contract_id) ===
                                        String(realContractId)
                                );
                                const matchedMonth =
                                    filteredMonths.find(
                                        m => m.month === data.monthly
                                    ) ||
                                    filteredMonths[0] ||
                                    null;

                                const elStartDate = document.querySelector(
                                    '[data-field="start_date"]'
                                );
                                const elEndDate = document.querySelector(
                                    '[data-field="end_date"]'
                                );

                                const resolvedStartDate =
                                    elStartDate?.value ||
                                    matchedMonth?.start_date ||
                                    "";
                                const resolvedEndDate =
                                    elEndDate?.value ||
                                    matchedMonth?.end_date ||
                                    "";

                                me.itemsView.addRow(
                                    {
                                        item_id: realContractId,
                                        item_name: `Rent - ${roomCode}`,
                                        type: "rent",
                                        price: Number(data.price) || 0,
                                        // space_price: Number(data.price) || 0,
                                        qty: 1,
                                        remarks: `Rent - ${roomCode} (${data.monthly ||
                                            "N/A"})`,
                                        contract_id: realContractId,
                                        start_date: resolvedStartDate,
                                        end_date: resolvedEndDate,
                                        space_code: roomCode,
                                        discount: Number(data.discount) || 0,
                                        discount_type: data.discount_type || "amount",
                                        tax_rate: Number(data.tax_rate) || 0
                                    },
                                    0
                                );

                                cv_interact.success("Rent item added");
                                ibMe.close();
                            }
                        });
                    };

                    // ================== Electric ================
                    me.controls.btnElectric.onclick = () => {
                        if (!me._selectedTenantId) {
                            return cv_interact.error(
                                "Please select Tenant first"
                            );
                        }

                        InputBox.resetInstance("electricPopUp");
                        InputBox.show({
                            title: "Electric",
                            instanceKey: "electricPopUp",

                            createContent() {
                                const div = document.createElement("div");
                                div.style.cssText =
                                    "display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;";
                                div.innerHTML = `
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="old_electric" name="old_electric" type="number" placeholder="0" min="0">
                                        <label class="form-label" style="font-size:13px;color:#555;">Old Reading (kWh)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="new_electric" name="new_electric" type="number" placeholder="0" min="0">
                                        <label class="form-label" style="font-size:13px;color:#555;">New Reading (kWh)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control bg-light" data-field="units_used" name="units_used" type="text" readonly placeholder="Auto calc">
                                        <label class="form-label" style="font-size:13px;color:#555;">Units Used (kWh)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="price_per_unit" name="price_per_unit" type="number" placeholder="0.00" min="0" step="0.01">
                                        <label class="form-label" style="font-size:13px;color:#555;">Price per kWh ($)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder="Start Date">
                                        <label class="form-label" style="font-size:13px;color:#555;">Start Date</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder="End Date">
                                        <label class="form-label" style="font-size:13px;color:#555;">End Date</label>
                                    </div>
                                    <div class="material-input outlined" style="grid-column: span 2;">
                                        <input class="data-input form-control bg-light" data-field="total_amount" name="total_amount" type="text" readonly placeholder="Auto calc">
                                        <label class="form-label" style="font-size:13px;color:#555;">Total Amount ($)</label>
                                    </div>
                                    <div style="grid-column: span 2;" class="material-input outlined">
                                        <textarea class="data-input form-control" data-field="remark" name="remark" rows="2"></textarea>
                                        <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                    </div>
                                `;
                                return div;
                            },

                            onOpen(ibMe) {
                                const elOld = document.querySelector(
                                    '[data-field="old_electric"]'
                                );
                                const elNew = document.querySelector(
                                    '[data-field="new_electric"]'
                                );
                                const elUnits = document.querySelector(
                                    '[data-field="units_used"]'
                                );
                                const elPPU = document.querySelector(
                                    '[data-field="price_per_unit"]'
                                );
                                const elTotal = document.querySelector(
                                    '[data-field="total_amount"]'
                                );
                                const elRemark = document.querySelector(
                                    '[data-field="remark"]'
                                );
                                const elStartDate = document.querySelector(
                                    '[data-field="start_date"]'
                                );
                                const elEndDate = document.querySelector(
                                    '[data-field="end_date"]'
                                );

                                const recalc = () => {
                                    const oldVal =
                                        parseFloat(elOld?.value) || 0;
                                    const newVal =
                                        parseFloat(elNew?.value) || 0;
                                    const ppu = parseFloat(elPPU?.value) || 0;
                                    const units = Math.max(0, newVal - oldVal);
                                    if (elUnits) elUnits.value = units;
                                    const total = units * ppu;
                                    if (elTotal)
                                        elTotal.value = total.toFixed(2);
                                    if (elRemark) {
                                        const start = elStartDate?.value || "";
                                        const end = elEndDate?.value || "";
                                        const period =
                                            start && end
                                                ? ` (${start} - ${end})`
                                                : "";
                                        elRemark.value = `Electric${period} — ${units.toFixed(
                                            2
                                        )} kWh × $${ppu.toFixed(2)}`;
                                    }
                                };

                                elOld?.addEventListener("input", recalc);
                                elNew?.addEventListener("input", recalc);
                                elPPU?.addEventListener("input", recalc);
                                elStartDate?.addEventListener("change", recalc);
                                elEndDate?.addEventListener("change", recalc);
                            },

                            onConfirm(data, btn, ibMe) {
                                const oldReading =
                                    parseFloat(data.old_electric) || 0;
                                const newReading =
                                    parseFloat(data.new_electric) || 0;
                                const ppu =
                                    parseFloat(data.price_per_unit) || 0;
                                const units = Math.max(
                                    0,
                                    newReading - oldReading
                                );

                                if (newReading <= 0)
                                    return cv_interact.error(
                                        "New reading is required"
                                    );
                                if (newReading < oldReading)
                                    return cv_interact.error(
                                        "New reading must be greater than old reading"
                                    );
                                if (ppu <= 0)
                                    return cv_interact.error(
                                        "Price per kWh is required"
                                    );

                                me.itemsView.addRow(
                                    {
                                        item_id: null,
                                        item_name: "Electric",
                                        type: "utility",
                                        price: ppu,
                                        qty: units,
                                        remarks:
                                            data.remark ||
                                            `Electric (${units.toFixed(
                                                2
                                            )} kWh)`,
                                        unit_type: "kWh",
                                        start_date: data.start_date || "",
                                        end_date: data.end_date || "",
                                        old_reading: oldReading,
                                        new_reading: newReading,
                                        units_used: units,
                                        price_per_unit: ppu,
                                        discount: 0,
                                        discount_type: "percent",
                                        tax_rate: 0
                                    },
                                    0
                                );

                                cv_interact.success("Electric item added");
                                ibMe.close();
                            }
                        });
                    };

                    // ====================== Water ===================
                    me.controls.btnWater.onclick = () => {
                        if (!me._selectedTenantId) {
                            return cv_interact.error(
                                "Please select Tenant first"
                            );
                        }

                        InputBox.resetInstance("waterPopUp");
                        InputBox.show({
                            title: "Water",
                            instanceKey: "waterPopUp",

                            createContent() {
                                const div = document.createElement("div");
                                div.style.cssText =
                                    "display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;";
                                div.innerHTML = `
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="old_water" name="old_water" type="number" placeholder="0" min="0">
                                        <label class="form-label" style="font-size:13px;color:#555;">Old Reading (m³)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="new_water" name="new_water" type="number" placeholder="0" min="0">
                                        <label class="form-label" style="font-size:13px;color:#555;">New Reading (m³)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control bg-light" data-field="units_used" name="units_used" type="text" readonly placeholder="Auto calc">
                                        <label class="form-label" style="font-size:13px;color:#555;">Units Used (m³)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="price_per_unit" name="price_per_unit" type="number" placeholder="0.00" min="0" step="0.01">
                                        <label class="form-label" style="font-size:13px;color:#555;">Price per m³ ($)</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder="Start Date">
                                        <label class="form-label" style="font-size:13px;color:#555;">Start Date</label>
                                    </div>
                                    <div class="material-input outlined">
                                        <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder="End Date">
                                        <label class="form-label" style="font-size:13px;color:#555;">End Date</label>
                                    </div>
                                    <div class="material-input outlined" style="grid-column: span 2;">
                                        <input class="data-input form-control bg-light" data-field="total_amount" name="total_amount" type="text" readonly placeholder="Auto calc">
                                        <label class="form-label" style="font-size:13px;color:#555;">Total Amount ($)</label>
                                    </div>
                                    <div style="grid-column: span 2;" class="material-input outlined">
                                        <textarea class="data-input form-control" data-field="remark" name="remark" rows="2"></textarea>
                                        <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                    </div>
                                `;
                                return div;
                            },

                            onOpen(ibMe) {
                                const elOld = document.querySelector(
                                    '[data-field="old_water"]'
                                );
                                const elNew = document.querySelector(
                                    '[data-field="new_water"]'
                                );
                                const elUnits = document.querySelector(
                                    '[data-field="units_used"]'
                                );
                                const elPPU = document.querySelector(
                                    '[data-field="price_per_unit"]'
                                );
                                const elTotal = document.querySelector(
                                    '[data-field="total_amount"]'
                                );
                                const elRemark = document.querySelector(
                                    '[data-field="remark"]'
                                );
                                const elStartDate = document.querySelector(
                                    '[data-field="start_date"]'
                                );
                                const elEndDate = document.querySelector(
                                    '[data-field="end_date"]'
                                );

                                const recalc = () => {
                                    const oldVal =
                                        parseFloat(elOld?.value) || 0;
                                    const newVal =
                                        parseFloat(elNew?.value) || 0;
                                    const ppu = parseFloat(elPPU?.value) || 0;
                                    const units = Math.max(0, newVal - oldVal);
                                    if (elUnits) elUnits.value = units;
                                    const total = units * ppu;
                                    if (elTotal)
                                        elTotal.value = total.toFixed(2);
                                    if (elRemark) {
                                        const start = elStartDate?.value || "";
                                        const end = elEndDate?.value || "";
                                        const period =
                                            start && end
                                                ? ` (${start} - ${end})`
                                                : "";
                                        elRemark.value = `Water${period} — ${units.toFixed(
                                            2
                                        )} m³ × $${ppu.toFixed(2)}`;
                                    }
                                };

                                elOld?.addEventListener("input", recalc);
                                elNew?.addEventListener("input", recalc);
                                elPPU?.addEventListener("input", recalc);
                                elStartDate?.addEventListener("change", recalc);
                                elEndDate?.addEventListener("change", recalc);
                            },

                            onConfirm(data, btn, ibMe) {
                                const oldReading =
                                    parseFloat(data.old_water) || 0;
                                const newReading =
                                    parseFloat(data.new_water) || 0;
                                const ppu =
                                    parseFloat(data.price_per_unit) || 0;
                                const units = Math.max(
                                    0,
                                    newReading - oldReading
                                );

                                if (newReading <= 0)
                                    return cv_interact.error(
                                        "New reading is required"
                                    );
                                if (newReading < oldReading)
                                    return cv_interact.error(
                                        "New reading must be greater than old reading"
                                    );
                                if (ppu <= 0)
                                    return cv_interact.error(
                                        "Price per m³ is required"
                                    );

                                me.itemsView.addRow(
                                    {
                                        item_id: null,
                                        item_name: "Water",
                                        type: "utility",
                                        price: ppu,
                                        qty: units,
                                        remarks:
                                            data.remark ||
                                            `Water (${units.toFixed(2)} m³)`,
                                        unit_type: "m³",
                                        start_date: data.start_date || "",
                                        end_date: data.end_date || "",
                                        old_reading: oldReading,
                                        new_reading: newReading,
                                        units_used: units,
                                        price_per_unit: ppu,
                                        discount: 0,
                                        discount_type: "percent",
                                        tax_rate: 0
                                    },
                                    0
                                );

                                cv_interact.success("Water item added");
                                ibMe.close();
                            }
                        });
                    };

                    // ===================== Service =================
                    me.controls.btnService.onclick = () => {
                        if (!me._selectedTenantId) {
                            return cv_interact.error(
                                "Please select Tenant first"
                            );
                        }

                        const services = availableItem || [];
                        if (services.length === 0) {
                            return cv_interact.error("No services available");
                        }

                        const serviceOptions = services
                            .map(
                                s =>
                                    `<option value="${s.id}">${s.service ||
                                        s.name ||
                                        `Service #${s.id}`}</option>`
                            )
                            .join("");

                        InputBox.show({
                            title: "Add Service",
                            instanceKey: "servicePopUp",

                            createContent() {
                                const div = document.createElement("div");
                                div.style.cssText =
                                    "display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 2px;";
                                div.innerHTML = `
                                <div class="material-input outlined">
                                    <select class="data-input form-control" data-style="material" data-field="service_id" name="service_id" placeholder="Select Service">
                                        ${serviceOptions}
                                    </select>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="unit_type" name="unit_type" type="text" readonly placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">Unit Type</label>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="price" name="price" type="text" readonly placeholder="Auto fill">
                                    <label class="form-label" style="font-size:13px;color:#555;">Price</label>
                                </div>
                                <div class="material-input outlined" style="display:flex; gap:8px;">
                                    <input class="data-input form-control" data-field="discount" name="discount" type="text" placeholder="0">
                                    <label class="form-label" style="font-size:13px;color:#555;">Discount</label>
                                    <div style="display:flex; gap:8px;">
                                        <select class="data-input form-control" data-field="discount_type" name="discount_type" style="width:80px;">
                                            <option value="percent">%</option>
                                            <option value="amount">$</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="material-input outlined">
                                    <input class="data-input form-control" data-field="tax_rate" name="tax_rate" type="text" placeholder="0">
                                    <label class="form-label" style="font-size:13px;color:#555;">Tax %</label>
                                </div>
                                <div style="grid-column: span 2;" class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="3"></textarea>
                                    <label class="form-label" style="font-size:13px;color:#555;">Remark</label>
                                </div>
                            `;
                                return div;
                            },

                            onOpen(ibMe) {
                                const elService = document.querySelector(
                                    '[data-field="service_id"]'
                                );
                                const elUnitType = document.querySelector(
                                    '[data-field="unit_type"]'
                                );
                                const elPrice = document.querySelector(
                                    '[data-field="price"]'
                                );
                                const elDiscount = document.querySelector(
                                    '[data-field="discount"]'
                                );

                                if (elService) elService.value = "";
                                if (elUnitType) elUnitType.value = "";
                                if (elPrice) elPrice.value = "";
                                if (elDiscount) elDiscount.value = "";

                                const fillFields = serviceId => {
                                    const selected = services.find(
                                        s => String(s.id) === String(serviceId)
                                    );
                                    if (!selected) return;
                                    if (elUnitType)
                                        elUnitType.value =
                                            selected.unit_type || "—";
                                    if (elPrice)
                                        elPrice.value = Number(
                                            selected.price || 0
                                        ).toFixed(2);
                                };

                                if (elService) {
                                    elService.addEventListener("change", e => {
                                        fillFields(e.target.value);
                                    });
                                }
                            },

                            onConfirm(data, btn, ibMe) {
                                if (!data.service_id) {
                                    cv_interact.error(
                                        "Please select a Service"
                                    );
                                    return;
                                }

                                const selectedService = services.find(
                                    s =>
                                        String(s.id) === String(data.service_id)
                                );
                                if (!selectedService) return;

                                const serviceDisplayName =
                                    selectedService.service ||
                                    selectedService.name ||
                                    `Service #${selectedService.id}`;

                                me.itemsView.addRow(
                                    {
                                        item_id: data.service_id,
                                        item_name: serviceDisplayName,
                                        type: "service",
                                        price:
                                            Number(selectedService.price) || 0,
                                        qty: 1,
                                        remarks:
                                            selectedService.service ||
                                            selectedService.name ||
                                            "Service",
                                        unit_type:
                                            selectedService.unit_type || "—",
                                        discount: Number(data.discount) || 0,
                                        discount_type:
                                            data.discount_type || "percent",
                                        tax_rate: Number(data.tax_rate) || 0
                                    },
                                    0
                                );

                                cv_interact.success("Service added at the top");
                                ibMe.close();
                            }
                        });
                    };

                    me.itemsView = new ItemsView(me.controls.divItemsView, {
                        currencyCode: "USD",
                        columns: [
                            {
                                name: "item_id",
                                displayType: "hidden",
                                readOnly: true,
                                width: "20px"
                            },
                            {
                                name: "item_name",
                                transTitle: "titles.Item",
                                displayType: "text",
                                dataType: "string",
                                readOnly: true,
                                className: "col-item-name"
                            },
                            {
                                name: "type",
                                transTitle: "titles.Type",
                                dataType: "text",
                                readOnly: true,
                                displayType: "hidden"
                            },
                            {
                                name: "remarks",
                                transTitle: "titles.Remarks",
                                dataType: "string",
                                readOnly: true
                            },
                            {
                                name: "qty",
                                transTitle: "titles.Unit Used",
                                dataType: "number",
                                readOnly: true
                            },
                            {
                                name: "price",
                                transTitle: "titles.Price",
                                dataType: "number",
                                readOnly: true,
                                isNumeric: true
                            },
                            {
                                name: "unit_type",
                                transTitle: "titles.Charge As",
                                dataType: "text",
                                readOnly: true,
                                defaultValue: "-"
                            },
                            {
                                name: "start_date",
                                transTitle: "titles.Start Date",
                                dataType: "text",
                                readOnly: true
                            },
                            {
                                name: "end_date",
                                transTitle: "titles.End Date",
                                dataType: "text",
                                readOnly: true
                            },
                            {
                                name: "discount",
                                transTitle: "titles.Disc",
                                isDiscount: true,
                                discountType: ["percent", "amount"],
                                defaultDiscountType: "percent",
                                discountBeforeTax: true,
                                readOnly: true
                            },
                            {
                                name: "tax_rate",
                                transTitle: "titles.Tax %",
                                dataType: "number",
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
                            showTax: true,
                            allowDiscount: true,
                            discountBeforeTax: true,
                            discountTypeDefault: "percent",
                            currency: "USD"
                        },

                        validateColumns: {
                            item_id: "positive",
                            qty: "positive",
                            price: "positive"
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
                                } else if (
                                    item.contract_id ||
                                    item.space_price
                                ) {
                                    const rentPrice =
                                        parseFloat(
                                            item.space_price || item.price
                                        ) || 0;
                                    me.itemsView.setCellValue(
                                        tr,
                                        "price",
                                        rentPrice
                                    );
                                    me.itemsView.setCellValue(
                                        tr,
                                        "type",
                                        "rent"
                                    );
                                    me.itemsView.setCellValue(
                                        tr,
                                        "unit_type",
                                        "—"
                                    );
                                }
                            }
                        }
                    });

                    me.searchTenant = VSSearchInput.init(me.controls.tenant, {
                        type: "select",
                        prefetch: true,
                        query: {
                            from: "tenants",
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
                                    me.controls.email.value =
                                        d.tenant?.email || "";
                                    me._selectedTenantId = tenant.id;
                                    me._tenantData = d;
                                    me._tenantSpaces = d.spaces || [];
                                    me._tenantMonths = d.months || [];

                                    VSUtil.setComboItems(
                                        me.controls.space,
                                        d.spaces || [],
                                        "space_id",
                                        "space_code",
                                        "",
                                        "-- Select Room / Space --",
                                        ""
                                    );
                                });
                        }
                    });

                    me.searchTenant.reset("");

                    // === Save data helper ===
                    me.saveData = () => {
                        const header = me.getData();
                        const items = me.itemsView.getItems(); // Retrieves all row data
                        const totals = me.itemsView.getCurrentTotals?.() || {};

                        if (me._selectedTenantId) {
                            header.tenant_id = me._selectedTenantId;
                        }

                        // Helper to format dates for MySQL
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
                                    remarks:
                                        item.remarks || item.description || "",
                                    start_date: toMySQLDate(item.start_date),
                                    end_date: toMySQLDate(item.end_date),

                                    // Fields for the calculation audit trail
                                    discount: parseFloat(item.discount || 0),
                                    special_discount_value: parseFloat(
                                        item.discount || 0
                                    ),
                                    special_discount_type:
                                        item.discount_type || "percent",
                                    tax_rate: parseFloat(item.tax_rate || 0),

                                    amount: parseFloat(item.total || 0)
                                };
                            });

                        // Return the full payload to your API
                        return {
                            ...header,
                            items: mappedItems,
                            amount: totals.grand_total || 0, // Total for the invoice header
                            amount_payable: totals.grand_total || 0
                        };
                    };
                },

                onPrepareForm: (me, data) => {
                    availableItem = data.services || [];
                    me._selectedTenantId = null;
                    me._tenantData = null;
                    me._tenantSpaces = [];
                    me._tenantMonths = [];

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

                    me.detail = op.id ? data.invoice_details || {} : {};

                    setTimeout(() => {
                        if (me.populateItemDropdown) me.populateItemDropdown();
                    }, 300);
                },

                prepareFormOptions: {
                    createTitle: "Create Invoice",
                    modifyTitle: "Modify Invoice",
                    targetProp: "invoice_details",
                    api: {
                        endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                        params: op => ({ id: op.id })
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
                            me.itemsView.setData(null);
                            me.hide(false);
                        }
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const formData = me.saveData();
                            if (
                                !formData.items ||
                                formData.items.length === 0
                            ) {
                                return cv_interact.error(
                                    "Add at least one item"
                                );
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
                                                ? "Updated"
                                                : "Created Invoice"
                                        );
                                        me.hide(true);
                                    } else {
                                        cv_interact.error(
                                            res.error_message || "Save failed"
                                        );
                                    }
                                });
                        }
                    }
                ]
            });

        dlg.show(op);
    };

    return self;
})();
