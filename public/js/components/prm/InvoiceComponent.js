"use strict";

function openOverdueAlertsModal() {
    vsapi
        .call(`${main_view.base_url}/prm/invoice/overdue-alert`, {})
        .then(res => {
            if (res.status_code === 200 && res.data) {
                OverdueAlertsDialog.show({
                    data: {
                        alerts_data: res.data.list || []
                    }
                });
            }
        });
}

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
    mThis.elBtnOverdueAlert = mThis.self.querySelector("#_btnOverdueAlert");
  

    mThis.globalSetting = null;
    mThis.invoiceSetting = null;
    let InvoiceItemDialog = null;
    mThis.internalInvoice = null;

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
                const amt = data.balance
                    ? Number(data.balance).toLocaleString("en-US", {
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

                if (statusId === 1) {
                    cls =
                        "text-success bg-success-subtle border border-success";
                } else if (statusId === 2) {
                    cls = "text-danger bg-danger-subtle border border-danger";
                } else if (statusId === 3) {
                    cls =
                        "text-warning bg-warning-subtle border border-warning";
                } else if (statusId === 4) {
                    cls =
                        "text-danger bg-danger-subtle border border-danger fw-bold";
                }
                return `
                    <span class="badge ${cls} text-capitalize d-inline-flex align-items-center justify-content-center px-3 py-2 gap-1" style="min-width:110px">
                        ${data.payment_status_name || "Overdue"}
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
                return `<div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action" data-id="${
                        data.id
                    }" data-statusid="${data.payment_status_id ||
                    ""}" style="padding: 0 10px;">
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
            if (!AuthManager.allowed(234, false)) return;
            InvoiceDialog.show({
                id: null,
                btn: e.target,
                onClose: () =>
                    mThis.InvoiceListView.showPage(mThis.getFilterData())
            });
        };

        mThis.elBtnOverdueAlert.onclick = e => {
            e.preventDefault();
            if (!AuthManager.allowed(234, false)) return;
            OverdueAlertsDialog.show({
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

        openOverdueAlertsModal();

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi
            .call(`${main_view.base_url}/prm/invoice/details`, { id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">${LocaleManager.trans(
                        "Failed to load invoice details",
                        "message_box_default"
                    )}</div>`;
                    return;
                }
                mThis.renderInvoiceDetail(container, res.data || {});
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">${LocaleManager.trans(
                    "Network error loading invoice detail.",
                    "message_box_default"
                )}</div>`;
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
                return `<span class="text-center ">0%</span>`;
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
                    <td class="fw-medium">${item.remarks || "—"}</td>
                    <td class="text-center small">${formatDate(
                        item.start_date
                    )}</td>
                    <td class="text-center small">${formatDate(
                        item.end_date
                    )}</td>
                    <td class="text-center small">${qty} ${unit_type}</td>
                    <td class="text-end">${currency}${price.toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
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
                            <tr style="background-color:#E1E5F2;">
                                <th class="text-center" vslang="titles.Item Description"></th>
                                <th class="text-center" vslang="titles.Start Date"></th>
                                <th class="text-center" vslang="titles.End Date"></th>
                                <th class="text-center" vslang="titles.Qty"></th>
                                <th class="text-end" vslang="titles.Price"></th>
                                <th class="text-end" vslang="titles.Discount"></th>
                                <th class="text-center" vslang="titles.Tax %"></th>
                                <th class="text-end" vslang="titles.Total">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml ||
                                '<tr><td colspan="8" class="text-center py-4 text-muted">No items found</td></tr>'}
                        </tbody>
                        <tfoot class="table-light fw-bold">
                            <tr>
                                <td colspan="7" class="text-end" vslang="titles.SubTotal"></td>
                                <td colspan="1" class="text-end fs-6">${currency}${fmt(
            parseFloat(invoice.amount || 0)
        )}</td>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-end text-danger" vslang="titles.Total Discount"></td>
                                <td colspan="1" class="text-end text-danger fs-6">
                                    ${(() => {
                                        const discVal = parseFloat(
                                            invoice.discount_value || 0
                                        );
                                        const discType = (
                                            invoice.discount_type || ""
                                        ).toLowerCase();
                                        if (discVal <= 0)
                                            return `<span class="text-muted">0%</span>`;
                                        return discType === "percent"
                                            ? `${fmt(discVal)}%`
                                            : `${currency}${fmt(discVal)}`;
                                    })()}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-end text-primary" vslang="titles.Grand (Net)"></td>
                                <td colspan="1" class="text-end text-success fs-6">${currency}${fmt(
            parseFloat(invoice.amount_payable || 0)
        )}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                    ${
                        invoice.remarks
                            ? `
                        <div class="mt-3 p-3 bg-light rounded border">
                            <small class="text-muted fw-semibold d-block text-uppercase" style="font-size: 0.7rem;">Remarks:</small>
                            <p class="mb-0 small">${invoice.remarks}</p>
                        </div>`
                            : ""
                    }
                </div>`;
        LocaleManager.translateZone(container);
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
            cssClass: "bg-white box-shadow text-start",
            menus: [
                {
                    html:
                        '<span class="ps-2" vslang="titles.Receive Payment"></span>',
                    icon: `<i class="fa-solid fa-hand-holding-dollar text-success fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "receive_invoice"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Modify Invoice"></span>',
                    icon: `<i class="fa-solid fa-edit text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_invoice"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Print Invoice"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_invoice"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Delete Invoice"></span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_invoice"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Invoice Setting"></span>',
                    icon: `<i class="fa-solid fa-file-invoice-dollar text-warning-emphasis fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "invoice_setting"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Clear Setting"></span>',
                    icon: `<i class="fa-solid fa-trash-can-arrow-up fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "reset_invoice_setting"
                }
            ],
            onShow: (me, menuContainer) => {
                const menu = me.getActiveMenus(menuContainer);
                const statusId = Number(menuContainer.dataset.statusid);

                menu.receive_invoice.style.display =
                    statusId === 2 || statusId === 3 || statusId === 4
                        ? "block"
                        : "none";
                menu.delete_invoice.style.display =
                    statusId === 2 || statusId === 4 ? "block" : "none";
                menu.modify_invoice.style.display =
                    statusId === 2 || statusId === 4 ? "block" : "none";
            },
            onClick: (menulink, id, name) => {
                if (name === "delete_invoice") {
                    mThis.deleteInvoice(id);
                } else if (name === "print_invoice") {
                    mThis.printInvoice(id);
                } else if (name === "print_invoice_internal") {
                    mThis.internalInvoice = true;
                    mThis.printInvoice(id);
                } else if (name === "receive_invoice") {
                    mThis.receiveInvoice(id);
                } else if (name === "modify_invoice") {
                    mThis.editInvoice(id, menulink);
                } else if (name === "invoice_setting") {
                    mThis.btnInvoiceSetting(id, menulink);
                } else if (name === "reset_invoice_setting") {
                    mThis.btnResetInvoiceSetting(id, menulink);
                }
            }
        };

        new VSDropdownMenu(menuOptions);
    };

    mThis.deleteInvoice = (id, menuLink) => {
        if (!AuthManager.allowed(237)) return;
        cv_interact.confirm(
            "confirm_delete",
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
                            cv_interact.success(
                                LocaleManager.trans(
                                    "delete_success_invoice",
                                    "message_box_default"
                                )
                            );
                        } else {
                            cv_interact.error(
                                res.error_message ||
                                    LocaleManager.trans(
                                        "delete_failed",
                                        "message_box_default"
                                    )
                            );
                        }
                    });
            }
        );
    };

    mThis.btnInvoiceSetting = (id, menulink) => {
        if (!AuthManager.allowed(240)) return;
        InvoiceSettingDialog.show({
            invoice_id: id,
            btn: menulink,
            setting: mThis.invoiceSetting,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.btnResetInvoiceSetting = (id, menulink) => {
        if (!AuthManager.allowed(239)) return;
        cv_interact.confirm(
            "confirm_reset_invoice",
            {
                transTitle: LocaleManager.trans(
                    "Reset Invoice Settings",
                    "titles"
                ),
                confirmButtonText: LocaleManager.trans("Reset", "buttons"),
                context: "danger"
            },
            confirmed => {
                if (!confirmed) return;

                vsapi
                    .call(
                        `${main_view.base_url}/prm/invoice/reset-setting`,
                        { id },
                        menulink
                    )
                    .then(res => {
                        if (res.status_code === 200) {
                            mThis.InvoiceListView.showPage(
                                mThis.getFilterData()
                            );
                            cv_interact.success(
                                LocaleManager.trans(
                                    "reset_success_invoice",
                                    "message_box_default"
                                )
                            );
                        } else {
                            cv_interact.error(
                                res.error_message ||
                                    LocaleManager.trans(
                                        "reset_failed",
                                        "message_box_default"
                                    )
                            );
                        }
                    });
            }
        );
    };

    mThis.editInvoice = (id, menulink) => {
        if (!AuthManager.allowed(236, false)) return;
        InvoiceDialog.show({
            id: id,
            btn: menulink,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.receiveInvoice = (id, menulink) => {
        if (!AuthManager.allowed(235, false)) return;
        ReceiveDialog.show({
            invoice_id: id,
            btn: menulink,
            onClose: () => mThis.InvoiceListView.showPage(mThis.getFilterData())
        });
    };

    mThis.printInvoice = (id, menulink) => {
        if (!AuthManager.allowed(238, false)) return;

        vsapi
            .call(`${main_view.base_url}/prm/invoice/print`, { id: id })
            .then(res => {
                if (res.status_code === 200) {
                    const invoiceDetails = res.data?.invoice_details;
                    const globalSetting = res.data?.invoice_setting || {};
                    const companyProfile = res.data?.company_info || {};
                    const invoiceSetting = invoiceDetails.settings;
                    const invType = invoiceDetails?.invoice_type;

                    const params = {
                        invoice_id: id,
                        btn: menulink,
                        invoice: invoiceDetails,
                        global: globalSetting,
                        company: companyProfile,
                        setting: invoiceSetting
                    };

                    if (invoiceSetting.show_balance !== null) {
                        params.setting = invoiceSetting;
                    } else {
                        params.setting = globalSetting;
                    }
                    if (invType === 1) {
                        InvoiceTaxDialogVertical.show(params);
                    } else if (invType === 2) {
                        InvoiceNoTaxDialogVertical.show(params);
                    } else if (invType === 3) {
                        InvoiceCommercialDialogVertical.show(params);
                    } else {
                        cv_interact.error(
                            LocaleManager.trans(
                                "Unknown invoice type variant.",
                                "message_box_default"
                            )
                        );
                    }
                } else {
                    cv_interact.error(
                        res.message ||
                            LocaleManager.trans(
                                "Could not determine invoice type.",
                                "message_box_default"
                            )
                    );
                }
            });
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
                    LocaleManager.trans("All Statuses", "titles"),
                    ""
                );

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
                    LocaleManager.trans("All Types", "titles"),
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
    let InvoiceSetting = null;
    let globalSetting = null;
    let exchangeRate = null;

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
                                            <label class="field-label fw-semibold" vslang="labels.Tenant"></label>
                                            <span class="field-sep">:</span>
                                            <input name="tenant" class="data-input form-control field-input" data-field="tenant_id" placeholder=" " autocomplete="off">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Phone Number"></label>
                                            <span class="field-sep">:</span>
                                            <input name="phone_number" class="data-input form-control field-input" placeholder=" " disabled>
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Email"></label>
                                            <span class="field-sep">:</span>
                                            <input name="email" class="data-input form-control field-input" placeholder=" " disabled>
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Unit"></label>
                                            <span class="field-sep">:</span>
                                            <select name="space" data-style="material" class="data-input form-control" data-field="space_id" required placeholder=" "></select>
                                        </div>
                                    </div>

                                    <!-- RIGHT: Space / Button -->
                                    <div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Invoice Type"></label>
                                            <span class="field-sep">:</span>
                                            <select name="invoice_type" data-style="material" class="data-input form-control" data-field="invoice_type" required placeholder=" ">
                                                <option value="1">Tax</option>
                                                <option value="2">No Tax</option>
                                                <option value="3">Commercial</option>
                                            </select>
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Issue Date"></label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="issue_date" data-field="issue_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>
                                        <div class="field-row">
                                            <label class="field-label fw-semibold" vslang="labels.Due Date"></label>
                                            <span class="field-sep">:</span>
                                            <input type="text" data-type="date" name="due_date" data-field="due_date" class="form-control data-input field-input" required placeholder=" ">
                                        </div>

                                        <div class="field-row w-100 justify-content-end">
                                            <div class="d-flex flex-wrap gap-2 justify-content-end">
                                                <button name="btnRent" class="custom-button" vslang="buttons.Rent"></button>
                                                <button name="btnService" class="custom-button" vslang="buttons.Service"></button>
                                                <button name="btnRequest" class="custom-button" vslang="buttons.Request"></button>
                                                <button name="btnElectric" class="custom-button" vslang="buttons.Electric"></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div name="divItemsView"></div>
                                <div class="mt-4 d-flex justify-content-end mb-3">
                                    <div name="div_invoice_summary" class="w-100" style="max-width: 400px;"></div>
                                </div>

                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="general_remark" name="general_remark" rows="1" placeholder=" "></textarea>
                                    <label style="color:#777;" vslang="labels.Remark"></label>
                                </div>
                            </div>
                        </div>

                        <style>
                        .field-row { display: flex; align-items: center; margin-bottom: 12px; --field-width: 260px; }
                        .field-label { width: 110px; font-size: 0.875rem; color: #222; flex-shrink: 0; }
                        .field-sep { margin: 0 10px; font-weight: 600; color: #444; flex-shrink: 0; }
                        .field-row .field-input { width: var(--field-width); border-radius: 6px; border: 1px solid #d0d0d0; font-size: 0.875rem; padding: 6px 10px; background-color: #fff; box-sizing: border-box; }
                        .field-row .field-input:focus { border-color: #86b7fe; box-shadow: 0 0 0 3px rgba(13,110,253,0.15); outline: none; }
                        .field-row .choices { width: var(--field-width) !important; flex-shrink: 0; }
                        .field-row .choices .choices__inner { width: 100% !important; min-height: unset !important; border-radius: 6px !important; border: 1px solid #d0d0d0 !important; font-size: 0.875rem !important; padding: 6px 10px !important; background-color: #fff !important; box-sizing: border-box; }
                        .field-row .choices.is-focused .choices__inner, .field-row .choices .choices__inner:focus-within { border-color: #86b7fe !important; box-shadow: 0 0 0 3px rgba(13,110,253,0.15) !important; outline: none !important; }
                        .field-row .choices[data-type="select-one"] .choices__button { display: none !important; }
                        .field-row .choices .choices__list--dropdown { width: var(--field-width) !important; z-index: 9999; }
                        .custom-button { color: #1a1647; padding: 10px; font-size: 12px; border-radius: 0.5em; background: #d4d4db; cursor: pointer; border: 1px solid #9290aa; transition: all 0.3s; }
                        .custom-button:hover { background-color: #b9b9c9; border-color: #1a1647; }
                        .custom-button:active { color: #666; box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff; }
                        .cursor-blocked { cursor: not-allowed !important; }
                        </style>
                    `,

            contentCreated: me => {
                me.controls = me.controls || {};
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
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_tenant",
                                "message_box_default"
                            )
                        );
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_space",
                                "message_box_default"
                            )
                        );
                    }

                    if (
                        !me.controls.invoice_type.value ||
                        me.controls.invoice_type.value === ""
                    ) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "Please select Invoice Type.",
                                "message_box_default"
                            )
                        );
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
                        return cv_interact.error(
                            LocaleManager.trans(
                                "No space/contract found.",
                                "message_box_default"
                            )
                        );
                    }
                    const availableMonths = months.filter(
                        m =>
                            String(m.contract_id) ===
                            String(matchedSpace.contract_id)
                    );

                    if (!availableMonths || availableMonths.length === 0) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "Rent has already reached the final month of the contract.",
                                "message_box_default"
                            )
                        );
                    }

                    let rentDiv = null;
                    InputBox.resetInstance("rentPopUp");

                    InputBox.show({
                        title: `${LocaleManager.trans(
                            "Rental Details",
                            "titles"
                        )}`,
                        instanceKey: "rentPopUp",
                        confirmButtonText: `${LocaleManager.trans(
                            "Save",
                            "buttons"
                        )}`,
                        cancelButtonText: `${LocaleManager.trans(
                            "Close",
                            "buttons"
                        )}`,
                        createContent() {
                            const div = document.createElement("div");
                            rentDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Contract Details"></span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="vs-material-field" style="margin-bottom: 1rem;">
                            <input class="data-input form-control cursor-blocked" data-field="contract_id" name="contract_id" type="text" readonly>
                            <label vslang="labels.Unit Code">Unit Code</label>
                        </div>
                        <div class="vs-material-field" style="margin-bottom: 1rem;">
                            <input class="data-input form-control cursor-blocked" data-field="monthly" name="monthly" type="text" readonly>
                            <label vslang="labels.Monthly">Monthly</label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Billing Period"></span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control cursor-blocked" data-field="start_date" name="start_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;" vslang="labels.Start Date"></label>
                        </div>
                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                            <input class="data-input form-control cursor-blocked" data-field="end_date" name="end_date" type="text" readonly placeholder="d-m-y">
                            <label style="color:#777;" vslang="labels.End Date"></label>
                        </div>
                    </div>
                </div>

                <div>
                    <div class="d-flex align-items-center mb-3">
                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Financial Info"></span>
                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                        <div class="material-input outlined" style="margin-bottom: 1rem; ${
                            Number(invoiceType) === 2
                                ? "grid-column: span 2;"
                                : ""
                        }">
                            <input class="data-input form-control cursor-blocked" data-field="price" name="price" type="text" readonly style="color:#0c447c;">
                            <label style="color:#777;" vslang="labels.Total Price ($)"></label>
                        </div>
                        ${
                            Number(invoiceType) === 2
                                ? ""
                                : `
                            <div class="material-input outlined" style="margin-bottom: 1rem;">
                                <input class="data-input form-control" data-field="tax_rate" name="tax_rate" type="text" inputmode="decimal" placeholder="0" required>
                                <label style="color:#777;" vslang="labels.Tax %"></label>
                            </div>`
                        }
                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                            <div style="flex:1">
                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                <label style="color:#777;" vslang="labels.Discount"></label>
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
                    <label style="color:#777;" vslang="labels.Remark"></label>
                </div>
            `;
                            LocaleManager.translateZone(div);
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

                            if (elDiscountType)
                                elDiscountType.value = "percent";
                            if (elStartDate)
                                elStartDate.value =
                                    matchedMonth.start_date || "";
                            if (elEndDate)
                                elEndDate.value = matchedMonth.end_date || "";

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
                                    if (parts.length > 2)
                                        v = parts[0] + "." + parts[1];
                                    if (parts[1] !== undefined)
                                        v =
                                            parts[0] +
                                            "." +
                                            parts[1].slice(0, 2);
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
                            const elTaxRate = document.querySelector(
                                '[data-field="tax_rate"]'
                            );

                            if (elTaxRate) {
                                if (
                                    data.tax_rate === undefined ||
                                    data.tax_rate === null ||
                                    String(data.tax_rate).trim() === ""
                                ) {
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "tax_required",
                                            "message_box_default"
                                        )
                                    );
                                }

                                const taxValue = Number(data.tax_rate);
                                if (isNaN(taxValue) || taxValue < 0) {
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "enter_tax",
                                            "message_box_default"
                                        )
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
                                    LocaleManager.trans(
                                        "missing_unit",
                                        "message_box_default"
                                    )
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
                                tax_rate: Number(data.tax_rate) || 0,
                                unit_type: `month`
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
                                    LocaleManager.trans(
                                        "rent_exist",
                                        "message_box_default"
                                    )
                                );
                            }

                            me.itemsView.addRow(dataToAdd, 0);
                            cv_interact.success(
                                LocaleManager.trans(
                                    "rent_added_success",
                                    "message_box_default"
                                ).replace("??", roomCode)
                            );
                            ibMe.close();
                        }
                    });
                };

                me.controls.btnElectric.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_tenant",
                                "message_box_default"
                            )
                        );
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_space",
                                "message_box_default"
                            )
                        );
                    }

                    const openElectricPopup = () => {
                        let electricDiv = null;
                        InputBox.resetInstance("electricPopUp");
                        InputBox.show({
                            title: `${LocaleManager.trans(
                                "Electricity Utility",
                                "titles"
                            )}`,
                            instanceKey: "electricPopUp",
                            confirmButtonText: `${LocaleManager.trans(
                                "Save",
                                "buttons"
                            )}`,
                            cancelButtonText: `${LocaleManager.trans(
                                "Close",
                                "buttons"
                            )}`,
                            createContent() {
                                const div = document.createElement("div");
                                electricDiv = div;
                                div.style.cssText =
                                    "display:flex; flex-direction:column;";

                                div.innerHTML = `
                                <div class="d-flex mb-3" style="border-bottom:1px solid #eee; gap:16px;">
                                    <div id="btn_tab_reading" style="cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;" vslang="titles.By Reading"></div>
                                    <div id="btn_tab_manual" style="cursor:pointer; padding:8px 12px; color:#777;" vslang="titles.Manual Entry"></div>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <span id="consumption_header" style="color:#0C447C; font-size:13px;" vslang="titles.Readings"></span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <div id="row_reading_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="old_electric" name="old_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;" vslang="labels.Old Reading (kWh)"></label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="new_electric" name="new_electric" type="text" inputmode="decimal" placeholder="0">
                                        <label style="color:#777;" vslang="labels.New Reading (kWh)"></label>
                                    </div>
                                </div>

                                <div id="row_manual_fields" class="material-input outlined" style="margin-bottom: 1rem; display:none;">
                                    <input class="data-input form-control" data-field="units_used" name="units_used" type="text" inputmode="decimal" placeholder="0.00">
                                    <label style="color:#777;" vslang="labels.Units Used (kWh)"></label>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;" vslang="titles.Calculation"></span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>

                                <div id="row_calculation_fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div id="wrapper_units_readonly" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input id="units_used_readonly" class="form-control bg-light cursor-blocked" type="text" readonly placeholder="0.00">
                                        <label style="color:#777;" vslang="labels.Calculated Units (kWh)"></label>
                                    </div>
                                    <div id="wrapper_exchange_rate" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="exchange_rate" name="exchange_rate" type="text" inputmode="decimal" placeholder="0.00" value="4025">
                                        <label style="color:#777;" vslang="labels.Exchange Rate (KHR)"></label>
                                    </div>
                                    <div id="wrapper_price_khr" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_khr" name="price_khr" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;" vslang="labels.Price per kWh (KHR)"></label>
                                    </div>
                                    <div id="wrapper_price_usd" class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="price_usd" name="price_usd" type="text" inputmode="decimal" placeholder="0.00">
                                        <label style="color:#777;" vslang="labels.Price per kWh (USD)"></label>
                                    </div>
                                </div>

                                <div class="d-flex align-items-center mb-3">
                                    <span style="color:#0C447C; font-size:13px;" vslang="titles.Period"></span>
                                    <div style="flex:1; height:1px; background:#e0e0e0; margin-left:8px;"></div>
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;" vslang="labels.Start Date"></label>
                                    </div>
                                    <div class="material-input outlined" style="margin-bottom: 1rem;">
                                        <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                        <label style="color:#777;" vslang="labels.End Date"></label>
                                    </div>
                                </div>

                                <div class="material-input outlined">
                                    <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                        style="background-color: #f0f7ff; border-color: #0c447c; font-weight: bold; font-size: 1.1em;">
                                    <label vslang="labels.Total Amount ($)"></label>
                                </div>

                                <div class="material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;" vslang="labels.Remark"></label>
                                </div>
                                <input class="data-input" type="text" data-field="entry_mode" value="reading" style="display:none;">
                            `;
                                LocaleManager.translateZone(div);
                                return div;
                            },

                            onOpen(ibMe) {
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

                                elExchangeRate.value = exchangeRate
                                    ? exchangeRate.exchange_rate ?? ""
                                    : "";

                                elPriceKHR.addEventListener("input", e => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
                                    const khrVal =
                                        parseFloat(e.target.value) || 0;
                                    elPriceUSD.value =
                                        khrVal > 0
                                            ? (khrVal / rate).toFixed(2)
                                            : "";
                                    recalc();
                                });

                                elPriceUSD.addEventListener("input", e => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
                                    const usdVal =
                                        parseFloat(e.target.value) || 0;
                                    elPriceKHR.value =
                                        usdVal > 0
                                            ? Math.round(usdVal * rate)
                                            : "";
                                    recalc();
                                });

                                elExchangeRate.addEventListener("input", () => {
                                    const rate =
                                        parseFloat(elExchangeRate.value) ||
                                        4000;
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

                                const rowCalculationFields = electricDiv.querySelector(
                                    "#row_calculation_fields"
                                );

                                const switchTab = mode => {
                                    elMode.value = mode;
                                    if (mode === "reading") {
                                        rowReadingFields.style.display = "grid";
                                        rowManualFields.style.display = "none";
                                        txtConsumptionHeader.textContent = LocaleManager.trans(
                                            "Readings",
                                            "titles"
                                        );
                                        rowCalculationFields.style.gridTemplateColumns =
                                            "1fr 1fr";
                                        wrapperUnitsReadonly.style.display =
                                            "block";
                                        btnTabReading.style.cssText =
                                            "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                        btnTabManual.style.cssText =
                                            "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                    } else {
                                        rowReadingFields.style.display = "none";
                                        rowManualFields.style.display = "block";
                                        txtConsumptionHeader.textContent = LocaleManager.trans(
                                            "Manual Entry",
                                            "titles"
                                        );
                                        rowCalculationFields.style.gridTemplateColumns =
                                            "1fr 1fr 1fr";
                                        wrapperUnitsReadonly.style.display =
                                            "none";
                                        btnTabManual.style.cssText =
                                            "cursor:pointer; padding:8px 12px; border-bottom:2px solid #0C447C; color:#0C447C; font-weight:600;";
                                        btnTabReading.style.cssText =
                                            "cursor:pointer; padding:8px 12px; color:#777; font-weight:400; border-bottom:none;";
                                    }
                                    recalc();
                                };

                                btnTabReading.onclick = () =>
                                    switchTab("reading");
                                btnTabManual.onclick = () =>
                                    switchTab("manual");

                                const recalc = () => {
                                    const mode = elMode.value;
                                    let units = 0;

                                    if (mode === "reading") {
                                        const oldVal =
                                            parseFloat(elOld.value) || 0;
                                        const newVal =
                                            parseFloat(elNew.value) || 0;
                                        units = newVal - oldVal;

                                        if (units < 0) {
                                            elUnitsReadonly.value = "0.00";
                                            elUnitsReadonly.style.color = "red";
                                        } else {
                                            elUnitsReadonly.value = units.toFixed(
                                                2
                                            );
                                            elUnitsReadonly.style.color =
                                                "#212529";
                                        }
                                    } else {
                                        units = parseFloat(elUnits.value) || 0;
                                    }

                                    const ppu =
                                        parseFloat(elPriceUSD.value) || 0;
                                    const total = Math.max(0, units) * ppu;

                                    if (elTotal)
                                        elTotal.value = total.toFixed(2);

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

                                if (mode === "reading") {
                                    const oldReading =
                                        parseFloat(data.old_electric) || 0;
                                    const newReading =
                                        parseFloat(data.new_electric) || 0;
                                    units = newReading - oldReading;

                                    if (newReading <= 0)
                                        return ibMe.setError(
                                            LocaleManager.trans(
                                                "New reading is required.",
                                                "message_box_default"
                                            )
                                        );
                                    if (newReading <= oldReading)
                                        return ibMe.setError(
                                            LocaleManager.trans(
                                                "New reading must be greater than old reading.",
                                                "message_box_default"
                                            )
                                        );
                                    remarks = `Electricity ${oldReading}kWh - ${newReading}kWh`;
                                } else {
                                    units = parseFloat(data.units_used) || 0;
                                    if (units <= 0)
                                        return ibMe.setError(
                                            LocaleManager.trans(
                                                "Units Used field is required and must be greater than 0.",
                                                "message_box_default"
                                            )
                                        );
                                    remarks = `Electric Utility - ${data.start_date ||
                                        ""} to ${data.end_date || ""}`;
                                }

                                if (ppu <= 0)
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "Price per kWh (USD) is required.",
                                            "message_box_default"
                                        )
                                    );
                                if (!data.start_date || !data.end_date)
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "Start and End dates are required.",
                                            "message_box_default"
                                        )
                                    );
                                if (
                                    new Date(data.end_date) <
                                    new Date(data.start_date)
                                ) {
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "End date cannot be before Start date.",
                                            "message_box_default"
                                        )
                                    );
                                }

                                me.itemsView.addRow(
                                    {
                                        item_id: null,
                                        type: "utility",
                                        price: ppu,
                                        qty: units,
                                        remarks:
                                            mode === "reading"
                                                ? `Electricity ${data.old_electric ||
                                                      0}KWh - ${data.new_electric ||
                                                      0}KWh`
                                                : `Electricity ${units}KWh`,
                                        unit_type: "KWh",
                                        old_reading:
                                            mode === "reading"
                                                ? parseFloat(
                                                      data.old_electric
                                                  ) || 0
                                                : 0,
                                        new_reading:
                                            mode === "reading"
                                                ? parseFloat(
                                                      data.new_electric
                                                  ) || 0
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

                                cv_interact.success(
                                    LocaleManager.trans(
                                        "Electric item added.",
                                        "message_box_default"
                                    )
                                );
                                ibMe.close();
                            }
                        });
                    };

                    openElectricPopup();
                };

                me.controls.btnService.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_tenant",
                                "message_box_default"
                            )
                        );
                    }
                    if (
                        !me.controls.space.value ||
                        me.controls.space.value === ""
                    ) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_space",
                                "message_box_default"
                            )
                        );
                    }

                    const services = availableItem || [];
                    if (services.length === 0) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "No services available.",
                                "message_box_default"
                            )
                        );
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
                        title: `${LocaleManager.trans(
                            "Add Service",
                            "titles"
                        )}`,
                        instanceKey: "servicePopUp",
                        confirmButtonText: `${LocaleManager.trans(
                            "Save",
                            "buttons"
                        )}`,
                        cancelButtonText: `${LocaleManager.trans(
                            "Close",
                            "buttons"
                        )}`,
                        createContent() {
                            const div = document.createElement("div");
                            serviceDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Service Selection"></span>
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
                                            <label style="color:#777;" vslang="labels.Charge As"></label>
                                        </div>
                                        <div id="price_wrapper" class="material-input outlined" style="margin-bottom: 1rem; grid-column: span 2;">
                                            <input class="data-input form-control bg-light" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Unit Price ($)"></label>
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
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Billing Period"></span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="start_date" name="start_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Start Date"></label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="end_date" name="end_date" type="text" data-type="date" placeholder=" ">
                                            <label style="color:#777;" vslang="labels.End Date"></label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Financial Info"></span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>

                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;" vslang="labels.Discount"></label>
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

                                <div class="material-input outlined mt-2">
                                    <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                        style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;">
                                    <label style="color:#0c447c;" vslang="labels.Total Amount ($)"></label>
                                </div>

                                <div class="material-input outlined mt-3" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;" vslang="labels.Remark"></label>
                                </div>
                            `;
                            LocaleManager.translateZone(div);
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
                            const elDiscount = serviceDiv.querySelector(
                                '[data-field="discount"]'
                            );
                            const elDiscountType = serviceDiv.querySelector(
                                '[data-field="discount_type"]'
                            );
                            const elTotalAmount = serviceDiv.querySelector(
                                '[data-field="total_amount"]'
                            );

                            const calculateTotalAmount = () => {
                                const price = parseFloat(elPrice.value) || 0;
                                const isMonthly =
                                    (elUnitType.value || "").toLowerCase() ===
                                    "month";
                                const qty = isMonthly
                                    ? parseInt(elDuration.value) || 1
                                    : 1;

                                let subtotal = price * qty;
                                const discountVal =
                                    parseFloat(elDiscount.value) || 0;

                                if (elDiscountType.value === "percent") {
                                    subtotal =
                                        subtotal -
                                        subtotal * (discountVal / 100);
                                } else if (elDiscountType.value === "amount") {
                                    subtotal = subtotal - discountVal;
                                }

                                if (subtotal < 0) subtotal = 0;
                                if (elTotalAmount)
                                    elTotalAmount.value = subtotal.toFixed(2);
                            };

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
                                    calculateTotalAmount();
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
                                el?.addEventListener("change", () => {
                                    recalcDates();
                                    calculateTotalAmount();
                                });
                            });

                            if (elDiscountType) {
                                elDiscountType.addEventListener(
                                    "change",
                                    calculateTotalAmount
                                );
                            }

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
                                    calculateTotalAmount();
                                });

                                elDiscount.addEventListener("blur", e => {
                                    let v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);
                                    calculateTotalAmount();
                                });
                            }
                        },
                        onConfirm(data, btn, ibMe) {
                            if (!data.service_id) {
                                return ibMe.setError(
                                    LocaleManager.trans(
                                        "select_service",
                                        "message_box_default"
                                    )
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

                            const unit = (
                                selectedService.charge_as || ""
                            ).toLowerCase();

                            if (unit === "month") {
                                if (!data.duration_months) {
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "input_time",
                                            "message_box_default"
                                        )
                                    );
                                }
                                if (!data.start_date || !data.end_date) {
                                    return ibMe.setError(
                                        LocaleManager.trans(
                                            "input_date",
                                            "message_box_default"
                                        )
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

                            const totalAmountInput = serviceDiv.querySelector(
                                '[data-field="total_amount"]'
                            );
                            const calculatedTotal = totalAmountInput
                                ? parseFloat(totalAmountInput.value)
                                : Number(selectedService.price) || 0;

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
                                id => String(id) === String(data.service_id)
                            );
                            if (isDuplicate) {
                                return ibMe.setError(
                                    LocaleManager.trans(
                                        "service_exist",
                                        "message_box_default"
                                    )
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
                                        (selectedService.charge_as || "Month") +
                                        (qtyMonths > 1 ? "s" : ""),
                                    discount: Number(data.discount) || 0,
                                    start_date: data.start_date || "",
                                    end_date: data.end_date || "",
                                    discount_type:
                                        data.discount_type || "percent",
                                    total_amount: calculatedTotal
                                },
                                0
                            );

                            cv_interact.success(
                                LocaleManager.trans(
                                    "Service added.",
                                    "message_box_default"
                                )
                            );
                            ibMe.close();
                        },
                        onCancel(ibMe) {
                            ibMe.close();
                        }
                    });
                };

                me.controls.btnRequest.onclick = () => {
                    if (!me._selectedTenantId) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_tenant",
                                "message_box_default"
                            )
                        );
                    }

                    const selectedSpaceId =
                        me.controls.space?.value || me.controls.space_id?.value;
                    if (!selectedSpaceId || selectedSpaceId === "") {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "select_space",
                                "message_box_default"
                            )
                        );
                    }

                    const requests = me._requestedServices || [];
                    const filteredRequests = requests.filter(
                        r => String(r.space_id) === String(selectedSpaceId)
                    );

                    if (filteredRequests.length === 0) {
                        return cv_interact.error(
                            LocaleManager.trans(
                                "no_request",
                                "message_box_default"
                            )
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
                        title: `${LocaleManager.trans(
                            "Service Request",
                            "titles"
                        )}`,
                        instanceKey: "requestPopUp",
                        confirmButtonText: `${LocaleManager.trans(
                            "Save",
                            "buttons"
                        )}`,
                        cancelButtonText: `${LocaleManager.trans(
                            "Close",
                            "buttons"
                        )}`,
                        createContent() {
                            const div = document.createElement("div");
                            requestDiv = div;
                            div.style.cssText =
                                "display:flex; flex-direction:column;";

                            div.innerHTML = `
                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Request Info"></span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <select class="data-input form-control" data-field="request_id" name="request_id" data-style="material" placeholder="Request No">
                                                ${serviceRequestOption}
                                            </select>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control cursor-blocked" data-field="service_name" name="service_name" type="text" readonly placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Service Name"></label>
                                        </div>
                                        <div class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control" data-field="unit_type" name="unit_type" type="text" readonly placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Unit Type"></label>
                                        </div>
                                        <div class="material-input outlined" data-wrapper="duration" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control cursor-blocked" data-field="duration_hours" name="duration_hours" type="text" readonly placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Duration (Hours)"></label>
                                        </div>
                                        <div id="price_wrapper_requested" class="material-input outlined" style="margin-bottom: 1rem;">
                                            <input class="data-input form-control cursor-blocked" data-field="price" name="price" type="text" readonly placeholder=" ">
                                            <label style="color:#777;" vslang="labels.Original Price ($)"></label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="d-flex align-items-center mb-3">
                                        <span style="color:#0C447C; font-size:13px;" vslang="titles.Financial Info"></span>
                                        <div style="flex:1; height:1px; background:#e0e0e0;"></div>
                                    </div>
                                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                                        <div class="material-input outlined" style="display:flex; gap:8px; align-items:flex-end; grid-column: span 2;">
                                            <div style="flex:1;">
                                                <input class="data-input form-control" data-field="discount" name="discount" type="text" inputmode="decimal" placeholder="0">
                                                <label style="color:#777;" vslang="labels.Discount"></label>
                                            </div>
                                            <div style="width:80px;">
                                                <select class="data-input form-control" data-field="discount_type" name="discount_type">
                                                    <option value="percent" selected>%</option>
                                                    <option value="amount">$</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="material-input outlined" style="grid-column: span 2; margin-top: 0.5rem;">
                                            <input class="data-input form-control cursor-blocked" data-field="total_amount" name="total_amount" type="text" readonly
                                                style="background-color: #f0f7ff; border-color: #0c447c; color: #0c447c; font-weight: bold; font-size: 1.1em;" placeholder=" ">
                                            <label style="color:#0c447c;" vslang="labels.Total Amount ($)"></label>
                                        </div>
                                    </div>
                                </div>
                                <div class="material-input outlined" style="display:none;">
                                    <textarea class="data-input form-control" data-field="remark" name="remark" rows="2" placeholder=" "></textarea>
                                    <label style="color:#777;" vslang="labels.Remark"></label>
                                </div>
                            `;
                            LocaleManager.translateZone(div);
                            return div;
                        },

                        onOpen(ibMe) {
                            const elPriceWrapperR = requestDiv.querySelector(
                                "#price_wrapper_requested"
                            );
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
                            const elDiscount = requestDiv.querySelector(
                                '[data-field="discount"]'
                            );
                            const elDiscountType = requestDiv.querySelector(
                                '[data-field="discount_type"]'
                            );
                            const elTotalAmount = requestDiv.querySelector(
                                '[data-field="total_amount"]'
                            );

                            if (elPriceWrapperR)
                                elPriceWrapperR.style.gridColumn = "span 2";

                            const calculateTotalAmount = () => {
                                if (!elPrice || !elTotalAmount) return;

                                const originalPrice =
                                    parseFloat(elPrice.value) || 0;
                                const duration =
                                    elUnitType && elUnitType.value === "Hour"
                                        ? parseFloat(elDuration.value) || 0
                                        : 1;
                                const baseTotal = originalPrice * duration;

                                const discountVal =
                                    parseFloat(elDiscount.value) || 0;
                                const discType = elDiscountType
                                    ? elDiscountType.value
                                    : "percent";

                                let finalTotal = baseTotal;

                                if (discType === "percent") {
                                    finalTotal =
                                        baseTotal -
                                        baseTotal * (discountVal / 100);
                                } else {
                                    finalTotal = baseTotal - discountVal;
                                }

                                if (finalTotal < 0) finalTotal = 0;
                                elTotalAmount.value = finalTotal.toFixed(2);
                            };

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
                                            : "span 1";

                                    calculateTotalAmount();
                                }
                            };

                            if (elDiscountType) {
                                elDiscountType.value = "percent";
                                elDiscountType.addEventListener(
                                    "change",
                                    calculateTotalAmount
                                );
                            }

                            if (elRequest) {
                                fillRequestData(elRequest.value);
                                elRequest.addEventListener("change", e => {
                                    fillRequestData(e.target.value);
                                });
                            }

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

                                    calculateTotalAmount();
                                });

                                elDiscount.addEventListener("blur", e => {
                                    const v = parseFloat(e.target.value);
                                    e.target.value =
                                        isNaN(v) || v < 0 ? "" : v.toFixed(2);
                                    calculateTotalAmount();
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
                                    LocaleManager.trans(
                                        "service_request",
                                        "message_box_default"
                                    )
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
                                    LocaleManager.trans(
                                        "request_exist",
                                        "message_box_default"
                                    )
                                );
                            }

                            const dataToAdd = {
                                item_id: selectedRequest.request_id,
                                type: "Service Request",
                                price: Number(selectedRequest.price),
                                qty:
                                    selectedRequest.unit_type === "Hour"
                                        ? selectedRequest.duration_hours || 0
                                        : 1,
                                unit_type: `${selectedRequest.unit_type || 0}`,
                                remarks: `Service Request: ${requestDisplayName}`,
                                space_id: selectedRequest.space_id,
                                space_code: selectedRequest.space_code,
                                discount: Number(data.discount) || 0,
                                discount_type: data.discount_type || "percent",
                                request_id: selectedRequest.request_id
                            };

                            me.itemsView.addRow(dataToAdd, 0);
                            cv_interact.success(
                                LocaleManager.trans(
                                    "request_invoice",
                                    "message_box_default"
                                )
                            );
                            ibMe.close();
                        }
                    });
                };

                const subLabel = LocaleManager.trans("Sub Total", "titles");

                me.itemsView = new ItemsView(me.controls.divItemsView, {
                    currencyCode: "USD",
                    columns: [
                        {
                            name: "remarks",
                            transTitle: "titles.Item",
                            displayType: "text",
                            dataType: "string",
                            readOnly: true,
                            className: "small col-item-name",
                            width: "230px"
                        },
                        {
                            name: "start_date",
                            transTitle: "titles.Start Date",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "130px"
                        },
                        {
                            name: "end_date",
                            transTitle: "titles.End Date",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "130px"
                        },
                        {
                            name: "qty",
                            transTitle: "titles.QTY",
                            dataType: "number",
                            readOnly: true,
                            className: "text-start",
                            width: "70px"
                        },
                        {
                            name: "unit_type",
                            transTitle: "titles.Charge As",
                            dataType: "text",
                            readOnly: true,
                            defaultValue: "-",
                            width: "110px"
                        },
                        {
                            name: "price",
                            transTitle: "titles.Price",
                            readOnly: true,
                            isNumeric: true,
                            dataType: "money",
                            width: "150px"
                        },
                        {
                            name: "discount",
                            transTitle: "titles.Discount",
                            isDiscount: true,
                            discountType: ["percent", "amount"],
                            defaultDiscountType: "percent",
                            discountBeforeTax: true,
                            readOnly: true,
                            width: "100px"
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
                            dataType: "money",
                            readOnly: true,
                            isNumeric: true,
                            width: "150px"
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
                        labels: {
                            subtotal: LocaleManager.trans(
                                "Sub Total",
                                "titles"
                            ),
                            discount: LocaleManager.trans("Discount", "titles"),
                            total: LocaleManager.trans("Total", "titles")
                        }
                    },
                    tableClass: "table",
                    ensureEmptyRow: true,
                    showAddLineButton: true,

                    itemRendered(item, ctx) {
                        const tr = ctx.tr;
                        const item_id = ctx.data.item_id;
                        const type = ctx.data.type;
                        const unit_type = ctx.data.unit_type;

                        item.setRowMeta(tr, {
                            item_id: item_id,
                            type: type,
                            unit_type: unit_type
                        });

                        if (item.rows.length >= 2) {
                            me.controls.tenant.disabled = true;
                            me.setReadOnly(true, [
                                "tenant_id",
                                "space_id",
                                "invoice_type"
                            ]);
                        }
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
                    minChars: 0,
                    api: {
                        endpoint: `${main_view.base_url}/prm/invoice/create-form-options`
                    },
                    processResponse: res => {
                        const tenants = res?.data || [];
                        return (Array.isArray(tenants) ? tenants : []).map(
                            i => ({
                                ...i,
                                tenant: i.name || "",
                                phone_number: i.phone_number || ""
                            })
                        );
                    },
                    columns: { tenant: "Name", phone_number: "Phone Number" },
                    showColumnHeader: true,
                    placeholder: "Search Tenant",
                    onSelect: tenant => {
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
                    });

                    const totals = me.itemsView.getCurrentTotals?.() || {};

                    if (me._selectedTenantId) {
                        header.tenant_id = me._selectedTenantId;
                    }
                    if (me.dataOptions?.id) {
                        header.id = me.dataOptions.id;
                    }

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
                        amount: totals.subtotal,
                        amount_payable: totals.grand_total
                    };
                };
            },

            onPrepareForm: (me, data) => {
                availableItem = (data.services || []).filter(
                    s => s.type_id == 2
                );

                vsapi
                    .call(
                        `${main_view.base_url}/prm/invoice_setting/get-exchange-rate`,
                        {}
                    )
                    .then(res => {
                        if (res.status_code !== 200) {
                            cv_interact.error(
                                LocaleManager.trans(
                                    "failed_load_invoice",
                                    "message_box_default"
                                )
                            );
                            return;
                        }
                        exchangeRate = res.data;
                    });

                const isReadOnly = me.dataOptions.id > 0;
                me.controls.tenant.disabled = isReadOnly;
                me.setReadOnly(isReadOnly, [
                    "tenant_id",
                    "space_id",
                    "invoice_type"
                ]);

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
                            '<option value="">Select Unit</option>';
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
                                    LocaleManager.trans(
                                        "failed_load_invoice",
                                        "message_box_default"
                                    )
                                );
                                return;
                            }
                            const detail = res.data || {};

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
                                                    }
                                                }
                                            }
                                        }, 100);
                                    });
                            }

                            me.itemsView.setData(detail);
                        });
                }
            },

            onShow: me => {
                const titleEl = me.divModal.querySelector(".modal-title");

                if (titleEl) {
                    const key = me.dataOptions?.id
                        ? "Modify Invoice"
                        : "Create Invoice";
                    const translatedText = LocaleManager.trans(key, "titles");
                    titleEl.innerHTML = `<h4 class="text-prm-custom text-start fw-bold text-white">${translatedText}</h4>`;
                }
            },

            prepareFormOptions: {
                targetProp: "invoice_details",
                api: {
                    endpoint: `${main_view.base_url}/prm/invoice/form-options`,
                    params: op => {
                        return { id: op.id };
                    }
                }
            },

            onClose: me => {
                if (me.controls && me.controls.space) {
                    me.controls.space.innerHTML =
                        '<option value="">Select Unit</option>';
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
                            return cv_interact.error(
                                LocaleManager.trans(
                                    "add_item",
                                    "message_box_default"
                                )
                            );
                        }
                        formData.id = me.dataOptions.id;

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
                                            ? LocaleManager.trans(
                                                  "update_success_invoice",
                                                  "message_box_default"
                                              )
                                            : LocaleManager.trans(
                                                  "create_success_invoice",
                                                  "message_box_default"
                                              )
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message ||
                                            LocaleManager.trans(
                                                "save_failed",
                                                "message_box_default"
                                            )
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
            cssClass: "modal-lg vs-modal",
            title: me => {
                return `<h4 class="text-white text-start ">${LocaleManager.trans(
                    "Receive Payment",
                    "titles"
                )}</h4>`;
            },

            createContent: () => `
                <div class="container-fluid px-0">
                    <div class="row g-0" style="border-radius:8px;overflow:hidden;margin-bottom:1.5rem;">
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;" vslang="labels.Balance Due"></div>
                            <div style="font-size:17px;font-weight:600;color:#5665E1;" id="f_due">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;border-right:1px solid white; text-align:center;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;" vslang="labels.Total Paid"></div>
                            <div style="font-size:17px;font-weight:600;color:#19BF9B;" id="f_tot">$0.00</div>
                        </div>
                        <div class="col-4" style="padding:0.75rem 1.25rem;text-align:right;background:#e1e5f2;">
                            <div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1a1647;margin-bottom:4px;" vslang="labels.Remaining"></div>
                            <div style="font-size:17px;font-weight:600;color:#FAB31C;" id="f_bal">$0.00</div>
                        </div>
                    </div>

                    <div style="display:flex;flex-direction:column;">

                        <!-- Cash -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">${LocaleManager.trans(
                                    "Cash",
                                    "labels"
                                )}</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">${LocaleManager.trans(
                                    "Entered:",
                                    "labels"
                                )}<strong id="c_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cash" type="text" class="form-control data-input" data-field="cash" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Amount ($)"></label>
                                </div>
                            </div>
                        </div>

                        <!-- Bank Transfer -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">${LocaleManager.trans(
                                    "Bank Transfer",
                                    "labels"
                                )}</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">${LocaleManager.trans(
                                    "Entered:",
                                    "labels"
                                )} <strong id="b_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="bank_transfer_bank_id" class="form-select data-input" data-field="bank_transfer_bank_id" data-style="material"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="transfer_amount" type="text" class="form-control data-input" data-field="transfer_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Amount ($)"></label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="bank_ref_number" type="text" class="form-control data-input" data-field="bank_ref_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Reference No."></label>
                                </div>
                            </div>
                        </div>

                        <!-- Card -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">${LocaleManager.trans(
                                    "Card",
                                    "labels"
                                )}</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">${LocaleManager.trans(
                                    "Entered:",
                                    "labels"
                                )} <strong id="ca_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="card_type" class="form-select data-input" data-field="card_type" data-style="material">
                                        <option value="">None</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                    </select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_amount" type="text" class="form-control data-input" data-field="card_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Amount ($)"></label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="card_number" type="text" class="form-control data-input" data-field="card_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Card Number"></label>
                                </div>
                            </div>
                        </div>

                        <!-- Cheque -->
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-3">
                                <span class="payment-badge" style="color:#0C447C;">${LocaleManager.trans(
                                    "Cheque",
                                    "labels"
                                )}</span>
                                <div style="flex:1;height:1px;background:#dee2e6;"></div>
                                <span style="font-size:11px;color:#0C447C;">${LocaleManager.trans(
                                    "Entered:",
                                    "labels"
                                )} <strong id="ch_e" style="color:#212529;">—</strong></span>
                            </div>
                            <div style="display:flex;flex-direction:row;gap:8px;flex-wrap:wrap;margin-bottom: 0.5rem;">
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <select name="cheque_bank_id" class="form-select data-input" data-field="cheque_bank_id" data-style="material"></select>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_amount" type="text" class="form-control data-input" data-field="cheque_amount" min="0" step="0.01" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Amount ($)"></label>
                                </div>
                                <div style="flex:1;min-width:120px;" class="material-input outlined">
                                    <input name="cheque_number" type="text" class="form-control data-input" data-field="cheque_number" placeholder=" "/>
                                    <label style="padding-left:6px;color:#777777;" vslang="labels.Cheque No."></label>
                                </div>
                            </div>
                        </div>

                        <!-- Remarks -->
                        <div>
                            <div class="material-input outlined" style="margin:0;">
                                <textarea name="remarks" class="form-control data-input" data-field="remarks" rows="2" style="height:55px;" placeholder=" "></textarea>
                                <label style="padding-left:6px;color:#777777;" vslang="labels.Remark"></label>
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
                            balEl.style.color = "#dc3545";
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

                    // --- REMOVED AUTO REMARKS SYNC LOGIC TO ALLOW MANUAL INPUT ---
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
                        remarks: (data.remarks || "").trim(), // Correctly picks up manual entry
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
                                // console.log("data", d);
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
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: me => me.hide(false)
                },
                {
                    label: '<span vslang="buttons.Receive"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const rawData = me.getData();
                        const payload = me.convertPayment(rawData);
                        const totalInput = payload.pmt_breakdowns.reduce(
                            (sum, item) => sum + item.amount,
                            0
                        );

                        if (totalInput <= 0) {
                            return cv_interact.error(
                                LocaleManager.trans(
                                    "payment_amount",
                                    "message_box_default"
                                )
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
                                        LocaleManager.trans(
                                            "receive_success_payment",
                                            "message_box_default"
                                        )
                                    );
                                    me.hide(true);
                                } else {
                                    cv_interact.error(
                                        res.error_message || "save_failed"
                                    );
                                }
                            })
                            .catch(err => {
                                // console.error(err);
                                cv_interact.error("Network error occurred.");
                            });
                    }
                }
            ]
        });
        LocaleManager.trans("", "titles");
        LocaleManager.trans("", "labels");

        dialog.show(op);
    };

    return self;
})();

// const InvoiceSettingDialog = (() => {
//     const self = {};
//     let dialog = null;

//     self.show = op => {
//         // console.log(12, op);

//         const currentData = op || {};
//         const invoiceId = currentData.id || currentData.invoice_id || 0;

//         dialog = new GeneralDialog({
//             title: LocaleManager.trans("Invoice Setting", "titles"),
//             cssClass: "modal-lg vs-modal",
//             backdrop: "static",
//             keyboard: true,

//             createContent: () => `
//                 <div class="is-card">
//                     <p class="is-section-title"> ${LocaleManager.trans(
//                         "Invoice Display Options",
//                         "labels"
//                     )}</p>

//                     <div class="is-row d-flex justify-content-between align-items-center mb-3">
//                         <span class="is-row-label">
//                             <i class="fa-solid fa-receipt me-2"></i>
//                             ${LocaleManager.trans(
//                                 "Show Commercial Tax",
//                                 "labels"
//                             )}

//                         </span>
//                         <div class="form-check form-switch">
//                             <input class="form-check-input toggle-setting" type="checkbox" data-field="show_comm_tax" id="_is_show_comm_tax">
//                         </div>
//                     </div>

//                     <div class="is-row d-flex justify-content-between align-items-center mb-3">
//                         <span class="is-row-label">
//                             <i class="fa-solid fa-credit-card me-2"></i>
//                             ${LocaleManager.trans(
//                                 "Show Payment Status",
//                                 "labels"
//                             )}
//                         </span>
//                         <div class="form-check form-switch">
//                             <input class="form-check-input toggle-setting" type="checkbox" data-field="show_pmt_status" id="_is_show_pmt_status">
//                         </div>
//                     </div>

//                     <div class="is-row d-flex justify-content-between align-items-center mb-3">
//                         <span class="is-row-label">
//                             <i class="fa-solid fa-scale-balanced me-2"></i>
//                             ${LocaleManager.trans("Show Balance", "labels")}
//                         </span>
//                         <div class="form-check form-switch">
//                             <input class="form-check-input toggle-setting" type="checkbox" data-field="show_balance" id="_is_show_balance">
//                         </div>
//                     </div>

//                     <div class="is-row d-flex justify-content-between align-items-center mb-3">
//                         <span class="is-row-label">
//                             <i class="fa-solid fa-money-bill-wave me-2"></i>
//                             ${LocaleManager.trans("Show Amount Paid", "labels")}
//                         </span>
//                         <div class="form-check form-switch">
//                             <input class="form-check-input toggle-setting" type="checkbox" data-field="show_amount_paid" id="_is_show_amount_paid">
//                         </div>
//                     </div>

//                     <div class="is-row d-flex justify-content-between align-items-center mb-3">
//                         <span class="is-row-label">
//                             <i class="fa-solid fa-pen-to-square me-2"></i>
//                             ${LocaleManager.trans("Show Signature", "labels")}
//                         </span>
//                         <div class="form-check form-switch">
//                             <input class="form-check-input toggle-setting" type="checkbox" data-field="show_sign" id="_is_show_sign">
//                         </div>
//                     </div>
//                 </div>
//             `,

//             contentCreated: me => {
//                 const dataSource = currentData.settings
//                     ? currentData.settings
//                     : currentData;

//                 const normalizedData = {
//                     show_comm_tax: dataSource.show_comm_tax,
//                     show_pmt_status: dataSource.show_pmt_status,
//                     show_balance: dataSource.show_balance,
//                     show_amount_paid:
//                         dataSource.show_amount_paid !== undefined
//                             ? dataSource.show_amount_paid
//                             : dataSource.show_amount_piad,
//                     show_sign: dataSource.show_sign
//                 };

//                 // Fix: Safely locate checkboxes inside document context if framework wrappers fail
//                 const container = me.divModal || document;
//                 container.querySelectorAll(".toggle-setting").forEach(input => {
//                     const field = input.getAttribute("data-field");
//                     if (field && normalizedData[field] !== undefined) {
//                         input.checked = parseInt(normalizedData[field]) === 1;
//                     }
//                 });
//             },

//             onPrepareForm: me => {
//                 vsapi
//                     .call(`${main_view.base_url}/prm/invoice/get-setting`, {
//                         id: invoiceId
//                     })
//                     .then(res => {
//                         if (res && res.data) {
//                             const settingsData = res.data.settings || {};

//                             // console.log(13, settingsData);
//                             // console.log(14, res);

//                             const normalizedData = {
//                                 show_comm_tax: settingsData.show_comm_tax,
//                                 show_pmt_status: settingsData.show_pmt_status,
//                                 show_balance: settingsData.show_balance,
//                                 show_amount_paid:
//                                     settingsData.show_amount_paid !== undefined
//                                         ? settingsData.show_amount_paid
//                                         : settingsData.show_amount_piad,
//                                 show_sign: settingsData.show_sign
//                             };

//                             // 3. Select container context and map checkbox statuses dynamically
//                             const container = me.divModal || document;
//                             container
//                                 .querySelectorAll(".toggle-setting")
//                                 .forEach(input => {
//                                     const field = input.getAttribute(
//                                         "data-field"
//                                     );
//                                     if (
//                                         field &&
//                                         normalizedData[field] !== undefined
//                                     ) {
//                                         input.checked =
//                                             parseInt(normalizedData[field]) ===
//                                             1;
//                                     }
//                                 });
//                         } else {
//                             // console.error(
//                             //     "Failed to map configurations:",
//                             //     res.error_message
//                             // );
//                         }
//                     })
//                     .catch(err => {
//                         // console.error("AJAX Gateway Exception:", err);
//                     });
//             },

//             buttons: [
//                 {
//                     label: '<span vslang="buttons.Cancel"></span>',
//                     cssClass: "btn btn-secondary",
//                     click: (me, btn) => {
//                         me.hide(false);
//                     }
//                 },
//                 {
//                     label: '<span vslang="buttons.Save"></span>',
//                     cssClass: "btn btn-primary",
//                     click: (me, btn) => {
//                         const payload = { id: invoiceId };

//                         // Fix: Changed from me.divModal to document context to guarantee loops evaluate
//                         const container = me.divModal || document;
//                         container
//                             .querySelectorAll(".toggle-setting")
//                             .forEach(input => {
//                                 const field = input.getAttribute("data-field");
//                                 if (field) {
//                                     payload[field] = input.checked ? 1 : 0;
//                                 }
//                             });

//                         // Verify this log shows fields like "show_comm_tax: 1" in your dev console!
//                         // console.log(
//                         //     "Invoice Setting Payload gathered:",
//                         //     payload
//                         // );

//                         vsapi
//                             .call(
//                                 `${main_view.base_url}/prm/invoice/setting`,
//                                 payload,
//                                 btn
//                             )
//                             .then(res => {
//                                 if (res.status_code === 200) {
//                                     me.hide(true, res);

//                                     cv_interact.success(
//                                         LocaleManager.trans(
//                                             "update_success_setting",
//                                             "message_box_default"
//                                         )
//                                     );

//                                     if (
//                                         typeof currentData.onClose ===
//                                         "function"
//                                     ) {
//                                         currentData.onClose();
//                                     } else if (mThis.loadSettings) {
//                                         mThis.loadSettings(null);
//                                     } else if (
//                                         mThis.InvoiceListView &&
//                                         typeof mThis.InvoiceListView
//                                             .showPage === "function"
//                                     ) {
//                                         mThis.InvoiceListView.showPage();
//                                     }
//                                 } else {
//                                     cv_interact.error(
//                                         res.error_message || "save_failed"
//                                     );
//                                 }
//                             });
//                     }
//                 }
//             ]
//         });

//         dialog.show(op);
//     };

//     return self;
// })();

const InvoiceSettingDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = op => {
        const currentData = op || {};
        const invoiceId = currentData.id || currentData.invoice_id || 0;

        dialog = new GeneralDialog({
            title: LocaleManager.trans("Invoice Setting", "titles"),
            cssClass: "modal-lg vs-modal",
            backdrop: "static",
            keyboard: true,

            createContent: () => `
                <div class="is-card">
                    <p class="is-section-title">${LocaleManager.trans(
                        "Invoice Display Options",
                        "labels"
                    )}</p>

                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-receipt me-2"></i>
                            ${LocaleManager.trans(
                                "Show Commercial Tax",
                                "labels"
                            )}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_comm_tax" id="_is_show_comm_tax">
                        </div>
                    </div>

                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-credit-card me-2"></i>
                            ${LocaleManager.trans(
                                "Show Payment Status",
                                "labels"
                            )}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_pmt_status" id="_is_show_pmt_status">
                        </div>
                    </div>

                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-scale-balanced me-2"></i>
                            ${LocaleManager.trans("Show Balance", "labels")}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_balance" id="_is_show_balance">
                        </div>
                    </div>

                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-money-bill-wave me-2"></i>
                            ${LocaleManager.trans("Show Amount Paid", "labels")}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_amount_paid" id="_is_show_amount_paid">
                        </div>
                    </div>

                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-pen-to-square me-2"></i>
                            ${LocaleManager.trans("Show Signature", "labels")}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_sign" id="_is_show_sign">
                        </div>
                    </div>

                    <!-- Show Overdue Alert Toggle -->
                    <div class="is-row d-flex justify-content-between align-items-center mb-3">
                        <span class="is-row-label">
                            <i class="fa-solid fa-triangle-exclamation me-2 text-warning"></i>
                            ${LocaleManager.trans(
                                "Show Overdue Alert",
                                "labels"
                            )}
                        </span>
                        <div class="form-check form-switch">
                            <input class="form-check-input toggle-setting" type="checkbox" data-field="show_overdue_alert" id="_is_show_overdue_alert">
                        </div>
                    </div>

                    <!-- Overdue Alert Days Input (Dynamically Toggled) -->
                    <div class="is-row d-flex justify-content-between align-items-center mb-3 ms-4" id="_overdue_days_wrapper" style="display: none;">
                        <span class="is-row-label small text-muted">
                            <i class="fa-solid fa-clock me-2"></i>
                            ${LocaleManager.trans(
                                "Alert Threshold (Days)",
                                "labels"
                            )}
                        </span>
                        <div class="input-group input-group-sm" style="width: 130px;">
                            <input type="number" min="1" max="365" class="form-control text-center" id="_is_overdue_alert_days" value="7">
                            <span class="input-group-text">${LocaleManager.trans(
                                "Days",
                                "labels"
                            )}</span>
                        </div>
                    </div>
                </div>
            `,

            contentCreated: me => {
                const dataSource = currentData.settings || currentData;

                const normalizedData = {
                    show_comm_tax: dataSource.show_comm_tax,
                    show_pmt_status: dataSource.show_pmt_status,
                    show_balance: dataSource.show_balance,
                    show_amount_paid: dataSource.show_amount_paid,
                    show_sign: dataSource.show_sign,
                    show_overdue_alert:
                        dataSource.show_overdue_alert !== undefined
                            ? dataSource.show_overdue_alert
                            : 1,
                    overdue_alert_days:
                        dataSource.overdue_alert_days !== undefined
                            ? dataSource.overdue_alert_days
                            : 7
                };

                const container = me.divModal || document;

                // Populate switches
                container.querySelectorAll(".toggle-setting").forEach(input => {
                    const field = input.getAttribute("data-field");
                    if (field && normalizedData[field] !== undefined) {
                        input.checked = parseInt(normalizedData[field]) === 1;
                    }
                });

                // Populate days input
                const daysInput = container.querySelector(
                    "#_is_overdue_alert_days"
                );
                if (daysInput) {
                    daysInput.value = normalizedData.overdue_alert_days;
                }

                // Bind dynamic visibility toggle for Overdue Alert Days Input
                const overdueToggle = container.querySelector(
                    "#_is_show_overdue_alert"
                );
                const daysWrapper = container.querySelector(
                    "#_overdue_days_wrapper"
                );

                if (overdueToggle && daysWrapper) {
                    const toggleDaysVisibility = () => {
                        daysWrapper.style.display = overdueToggle.checked
                            ? "flex"
                            : "none";
                    };
                    overdueToggle.addEventListener(
                        "change",
                        toggleDaysVisibility
                    );
                    toggleDaysVisibility(); // Set initial visibility state
                }
            },

            onPrepareForm: me => {
                vsapi
                    .call(`${main_view.base_url}/prm/invoice/get-setting`, {
                        id: invoiceId
                    })
                    .then(res => {
                        if (res && res.data) {
                            const settingsData = res.data.settings || res.data;

                            const normalizedData = {
                                show_comm_tax: settingsData.show_comm_tax,
                                show_pmt_status: settingsData.show_pmt_status,
                                show_balance: settingsData.show_balance,
                                show_amount_paid: settingsData.show_amount_paid,
                                show_sign: settingsData.show_sign,
                                show_overdue_alert:
                                    settingsData.show_overdue_alert !==
                                    undefined
                                        ? settingsData.show_overdue_alert
                                        : 1,
                                overdue_alert_days:
                                    settingsData.overdue_alert_days !==
                                    undefined
                                        ? settingsData.overdue_alert_days
                                        : 7
                            };

                            const container = me.divModal || document;

                            // Update toggles
                            container
                                .querySelectorAll(".toggle-setting")
                                .forEach(input => {
                                    const field = input.getAttribute(
                                        "data-field"
                                    );
                                    if (
                                        field &&
                                        normalizedData[field] !== undefined
                                    ) {
                                        input.checked =
                                            parseInt(normalizedData[field]) ===
                                            1;
                                    }
                                });

                            // Update days input
                            const daysInput = container.querySelector(
                                "#_is_overdue_alert_days"
                            );
                            if (daysInput) {
                                daysInput.value =
                                    normalizedData.overdue_alert_days;
                            }

                            // Refresh threshold input visibility
                            const overdueToggle = container.querySelector(
                                "#_is_show_overdue_alert"
                            );
                            const daysWrapper = container.querySelector(
                                "#_overdue_days_wrapper"
                            );
                            if (overdueToggle && daysWrapper) {
                                daysWrapper.style.display = overdueToggle.checked
                                    ? "flex"
                                    : "none";
                            }
                        }
                    })
                    .catch(err => {
                        // console.error("AJAX Exception:", err);
                    });
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel">Cancel</span>',
                    cssClass: "btn btn-secondary",
                    click: (me, btn) => {
                        me.hide(false);
                    }
                },
                {
                    label: '<span vslang="buttons.Save">Save</span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const payload = { id: invoiceId };
                        const container = me.divModal || document;

                        // Gather switch states
                        container
                            .querySelectorAll(".toggle-setting")
                            .forEach(input => {
                                const field = input.getAttribute("data-field");
                                if (field) {
                                    payload[field] = input.checked ? 1 : 0;
                                }
                            });

                        // Gather overdue alert threshold days
                        const daysInput = container.querySelector(
                            "#_is_overdue_alert_days"
                        );
                        if (daysInput) {
                            payload.overdue_alert_days =
                                parseInt(daysInput.value) || 7;
                        }

                        vsapi
                            .call(
                                `${main_view.base_url}/prm/invoice/setting`,
                                payload,
                                btn
                            )
                            .then(res => {
                                if (res.status_code === 200) {
                                    me.hide(true, res);

                                    cv_interact.success(
                                        LocaleManager.trans(
                                            "update_success_setting",
                                            "message_box_default"
                                        )
                                    );

                                    if (
                                        typeof currentData.onClose ===
                                        "function"
                                    ) {
                                        currentData.onClose();
                                    } else if (mThis.loadSettings) {
                                        mThis.loadSettings(null);
                                    } else if (
                                        mThis.InvoiceListView &&
                                        typeof mThis.InvoiceListView
                                            .showPage === "function"
                                    ) {
                                        mThis.InvoiceListView.showPage();
                                    }
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


    const OverdueAlertsDialog = (() => {
        let dialog = null;

        return {
            show(op = {}) {

                dialog ??= GeneralDialog.getOrCreate({
                    instanceKey: "overdue_invoice_alerts_dialog",
                    dialogOptions: {
                        width: "800px",
                        showFooter: true,
                        // Make sure GeneralDialog actually reads a `title` key —
                        // this was likely the cause of "No title Set" in the header.
                        title: "Admin Alert: Invoice Payment Overdue Notifications"
                    },

                    prepareFormOptions: {
                        createTitle:
                            "Admin Alert: Invoice Payment Overdue Notifications",
                        modifyTitle:
                            "Admin Alert: Invoice Payment Overdue Notifications",
                        targetProp: "alerts_data",

                        
                    },

                    // Build HTML layout (Runs once)
                    createContent() {
                        return `
                            <div class="p-3">
                                <!-- Alert Summary Header Banner -->
                                <div class="d-flex align-items-center gap-3 p-3 mb-3 rounded-4"
                                    style="background: linear-gradient(135deg, #fff4e5, #ffe9cc); border: 1px solid #ffd9a0;">
                                    <div class="d-flex align-items-center justify-content-center rounded-circle"
                                        style="width: 46px; height: 46px; background: #ff9f1c; flex-shrink: 0;">
                                        <i class="fa-solid fa-bell fs-5 text-white"></i>
                                    </div>
                                    <div>
                                        <h6 class="mb-1 fw-bold text-dark">Payment Attention Required</h6>
                                        <small class="text-muted">
                                            Found
                                            <strong id="_cnt_overdue_text" class="text-danger">0</strong>
                                            overdue invoice(s).
                                        </small>
                                    </div>
                                </div>

                                <!-- Scrollable Invoice Alerts List Container -->
                                <div id="_invoice_alert_list_container"
                                    class="rounded-4"
                                    style="max-height: 400px; overflow-y: auto; background:#f7f8fa; padding: 4px;">
                                    <div class="text-center text-muted py-5">
                                        <i class="fa-solid fa-spinner fa-spin me-2"></i>Loading alerts...
                                    </div>
                                </div>
                            </div>
                        `;
                    },

                    // Cache DOM element references (Runs once)
                    contentCreated(me) {
                        me.elListContainer = me.divModal.querySelector(
                            "#_invoice_alert_list_container"
                        );
                        me.elCntOverdue = me.divModal.querySelector(
                            "#_cnt_overdue_text"
                        );
                    },

                    // Runs every time the dialog opens
                    onPrepareForm(me) {
                        const alerts = op.data.alerts_data || [];

                        let overdueCount = 0;
                        let upcomingCount = 0;

                        if (!Array.isArray(alerts) || alerts.length === 0) {
                            me.elListContainer.innerHTML = `
                                <div class="text-center text-muted py-5">
                                    <i class="fa-solid fa-circle-check text-success fs-2 d-block mb-2"></i>
                                    <span>No overdue or pending invoice alerts found.</span>
                                </div>
                            `;
                            me.elCntOverdue.textContent = "0";
                            return;
                        }

                        // Render alert items
                        const itemsHtml = alerts
                            .map(item => {
                                const isDanger = item.alert_type === "danger";
                                if (isDanger) overdueCount++;
                                else upcomingCount++;

                                const accentColor = isDanger ? "#e5384d" : "#ff9f1c";
                                const iconClass = isDanger
                                    ? "fa-solid fa-triangle-exclamation"
                                    : "fa-solid fa-clock";
                                const badgeBg = isDanger ? "#e5384d" : "#ff9f1c";

                                return `
                                <div class="d-flex align-items-center justify-content-between gap-3 p-3 mb-2 bg-white rounded-3"
                                    style="border-left: 4px solid ${accentColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
                                    <div class="d-flex align-items-start gap-3">
                                        <div class="d-flex align-items-center justify-content-center rounded-circle"
                                            style="width: 34px; height: 34px; background: ${accentColor}1a; flex-shrink: 0;">
                                            <i class="${iconClass}" style="color:${accentColor}; font-size: 14px;"></i>
                                        </div>
                                        <div>
                                            <div class="fw-bold text-dark">
                                                ${item.code}
                                                <span class="fw-normal" style="font-size: 12.5px; color:#000;">
                                                    (${item.tenant_name || "N/A"})
                                                </span>
                                            </div>
                                            <small class="d-block mt-1" style="color:#000;">
                                                ${item.message || ""}
                                            </small>
                                        </div>
                                    </div>
                                    <div class="text-end ms-3" style="flex-shrink: 0;">
                                        <span class="d-inline-block px-2 py-1 mb-1 rounded-pill fw-semibold"
                                            style="background:${badgeBg}; color:#fff; font-size: 12.5px;">
                                            Due: $${Number(item.due_amount || 0).toFixed(2)}
                                        </span>
                                        <small class="d-block text-muted" style="font-size: 11px;">
                                            ${item.due_date || ""}
                                        </small>
                                    </div>
                                </div>
                            `;
                            })
                            .join("");

                        me.elCntOverdue.textContent = overdueCount;
                        me.elListContainer.innerHTML = itemsHtml;
                    },

                    buttons: [
                        {
                        label: '<span vslang="buttons.Close">Close</span>',
                            cssClass: "btn btn-primary",
                            click(me) {
                                me.hide(false);
                            }
                        }
                    ],

                    onClose(actionDone, payload) {}
                });

                dialog.show(op);
            }
        };
    })();


