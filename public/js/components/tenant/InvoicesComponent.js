"use strict";

var InvoicesComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Invoice Management";
    mThis.currency_symbol = "$";
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_invoice_component",
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


    mThis.cols = [
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-start text-nowrap",
            data: function (data) {
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
            },
        },
        // {
        //     transTitle: "titles.Tenant",
        //     className: "align-middle text-nowrap",
        //     data: (data) => {
        //         return `
        //                 <div class="d-flex flex-column">
        //                     <span>${data.tenant_name ?? ""}</span>
        //                     <span class="d-block text-primary"style="font-size:12px;">${
        //                         data.tenant_phone ?? ""
        //                     }</span>
        //                 </div>`;
        //     },
        // },
        {
            transTitle: "titles.Unit",
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>
                    <span class="d-block text-prm-custom ">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            },
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                return `
                    <div class="d-flex flex-column align-items-center">
                        <span class="text-prm-custom text-nowrap">${
                            data.issue_date ?? ""
                        }
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const statusId = Number(data.payment_status_id || 0);
                return `
                    <div class="d-flex flex-column align-items-center ">
                        <span class="text-prm-custom text-nowrap">${
                            data.due_date ?? ""
                        }
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap text-primary",
            data: (data) => {
                const amt = data.amount_payable
                    ? Number(data.amount_payable).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block text-primary fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },
        {
            transTitle: "titles.Paid",
            className: "align-middle text-success  text-nowrap",
            data: (data) => {
                const amt = data.paid_amount
                    ? Number(data.paid_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle text-danger  text-nowrap",
            data: (data) => {
                const amt = data.due_amount
                    ? Number(data.due_amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                      })
                    : "0.00";
                return `<span class="d-block  fw-semibold">${mThis.currency_symbol}${amt}</span>`;
            },
        },

        {
            transTitle: "titles.Status",
            className: "align-middle text-center text-nowrap",
            data: (data) => {
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
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:240px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${
                            data.general_remark ?? "_"
                        }</span>
                    </div>
                `;
            },
        },

        // {
        //     transTitle: "titles.Last Updated",
        //     className: "align-middle text-nowrap",
        //     data: (data) => `
        //         <div class="d-flex flex-column">
        //             <span class="text-capitalize text-prm-custom">${
        //                 data.update_user || "—"
        //             }</span>
        //             <small class="text-muted">${data.updated_at || "—"}</small>
        //         </div>`,
        // },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: (data) => {
                // if (data.payment_status_id === 4) {
                //     return "";
                // }

                return `<div class="d-flex justify-content-center">
                    <a href="javascript:void(0)" class="btn--Options btn_leave_action"
                        data-id="${
                            data.id
                        }" data-statusid="${data.payment_status_id || ""}" style="padding: 0 10px;">
                        <i class="fa-solid fa-ellipsis-vertical text-prm-custom fs-5"></i>
                    </a>
                </div>`;
            },
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.InvoiceListView = new ListView("_invoices_list", {
            fetchApi: `${main_view.base_url}/tenant/invoice/list-paginate`,
            perPage: 5,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-3 overflow-hidden header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.classList.add("invoice", "cursor-pointer");
                tr.id = `invoice_id_${data.id}`;
                tr.dataset.statusid = data.payment_status_id || 0;
                tr.dataset.canceled = 0;
            },
            listContainerClass: null,
        });

        

        mThis.listContainer = mThis.InvoiceListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        sh_parent.classList.add("overflow-y-auto");
        // sh_parent.classList.add("overflow-x-hidden");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 190 + "px";
        };

        mThis.tblInvoice = mThis.InvoiceListView.getTable();

        mThis.initDropdownMenus(mThis.tblInvoice);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = () =>
                mThis.InvoiceListView.showPage(mThis.getFilterData());
        });

        let timeOut = null;
        mThis.elSearch.onkeyup = function (e) {
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
            },
        });

    

        mThis.initAlready = true;
    };

    mThis.displayInvoiceDetail = (container, id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;
        vsapi
            .call(`${main_view.base_url}/tenant/invoice/details`, { id })
            .then((res) => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load invoice details</div>`;
                    return;
                }
                mThis.renderInvoiceDetail(container, res.data || {});

            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading invoice detail.</div>`;
            });
    };

    mThis.renderInvoiceDetail = (container, invoice) => {
        const currency = mThis.currency_symbol || "$";
        const validItems = (invoice.items || []).filter(
            (item) =>
                parseFloat(item.price || 0) > 0 ||
                parseFloat(item.total || 0) > 0 ||
                parseFloat(item.amount || 0) > 0,
        );

        const formatDate = (dateStr) => {
            if (!dateStr) return "—";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        };
        const getDiscountDisplay = (item) => {
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
            .map((item) => {
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
                    <td class="text-center small">${formatDate(
                        item.start_date,
                    )}</td>
                    <td class="text-center small">${formatDate(
                        item.end_date,
                    )}</td>
                    <td class="text-center small">${qty} ${unit_type}</td>
                    <td class="text-end">${currency}${price.toLocaleString(
                        "en-US",
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        },
                    )}</td>
                    <td class="text-end text-danger">${getDiscountDisplay(
                        item,
                    )}</td>
                    <td class="text-center text-info">${taxAmount}%</td>
                    <td class="text-end fw-bold">${currency}${total.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
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
            { discount: 0, tax: 0, total: 0 },
        );

        const fmt = (n) =>
            n.toLocaleString("en-US", { minimumFractionDigits: 2 });
        container.innerHTML = `
            <div class="bg-white rounded shadow-sm">
                <div class="table-responsive table--dropdown">
                    <table class="table table-sm table-bordered mb-0">
                        <thead style="background:#e1e5f2;">
                            <tr style= background-color:#E1E5F2;" >
                                <th class="text-center" >Item Description </th>
                                <th class="text-center" >Start Date</th>
                                <th class="text-center" >End Date</th>
                                <th class="text-center" >Qty</th>
                                <th class="text-end" >Price</th>
                                <th class="text-end" >Discount</th>
                                <th class="text-center" >Tax %</th>
                                <th class="text-end" >Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${
                                itemsHtml ||
                                '<tr><td colspan="8" class="text-center py-4 text-muted">No items found</td></tr>'
                            }
                        </tbody>
                        <tfoot class="table-light fw-bold">
                                <!-- Displaying Net Total -->
                            <tr>
                                <td colspan="7" class="text-end  ">Sub Total</td>
                                <td colspan="1" class="text-end  fs-6">
                                    ${currency}${fmt(
                                        parseFloat(invoice.amount || 0),
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td colspan="7" class="text-end text-danger">Total Discount</td>
                                <td colspan="1" class="text-end text-danger fs-6">
                                    ${(() => {
                                        const discVal = parseFloat(
                                            invoice.discount_value || 0,
                                        );
                                        const discType = (
                                            invoice.discount_type || ""
                                        ).toLowerCase();

                                        if (discVal <= 0)
                                            return `<span class="text-muted">0%</span>`;
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
                                <td colspan="7" class="text-end  text-primary">Grand (Net)</td>
                                <td colspan="1" class="text-end text-success fs-6">
                                    ${currency}${fmt(
                                        parseFloat(invoice.amount_payable || 0),
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
            search_value: mThis.elSearch.value.trim(),
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
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
                    html: '<span class="ps-2" vslang="titles.Print"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "print_invoice",
                },
            ],
           
            onClick: (menulink, id, name) => {
             if (name === "print_invoice") {
                    mThis.printInvoice(id);
                } 
            },
        };

        new VSDropdownMenu(menuOptions);
    };
    mThis.printInvoice = (id, invoice_type, menulink) => {
        if (!invoice_type || invoice_type === "undefined") {
            console.warn(
                "Type missing for ID " + id + ". Fetching from server...",
            );

            vsapi
                .call(`${main_view.base_url}/tenant/invoice/details`, { id: id })
                .then((res) => {
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
        console.log(123,params);

        if (invType === 1) {
            InvoiceTaxDialog.show(params);
        } else if (invType === 2) {
            InvoiceNoTaxDialog.show(params);
        } else if (invType === 3) {
            InvoiceCommercialDialog.show(params);
        }
    };
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/tenant/invoice/form-options`)
            .then((res) => {
                const d = res.status_code === 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elFilter_status,
                    d.statuses,
                    "id",
                    "payment_status",
                    "",
                    "All Statuses",
                    "",
                );

                // Populate Invoice Type filter
                const typeOptions = [
                    { id: 1, name: "Tax" },
                    { id: 2, name: "No Tax" },
                    { id: 3, name: "Commercial" },
                ];
                VSUtil.setComboItems(
                    mThis.elFilter_invoice_type,
                    typeOptions,
                    "id",
                    "name",
                    "",
                    "All Types",
                    "",
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



