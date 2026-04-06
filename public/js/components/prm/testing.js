"use strict";
var ReceiptComponent = new (function() {
    const mThis = this;
    mThis.title_prop = "Receipts";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_receipt_component"
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnReceipt");
    mThis.elFilter_category = mThis.self.querySelector("#payment_method_id");
    mThis.elFilter_status = mThis.self.querySelector("#receipt_status");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_receipt");
    mThis.elSearch = mThis.self.querySelector("#_search_receipt");
    mThis.currency_symbol = "$";

    mThis.cols = [
        { transTitle: "", className: "align-middle" },
        {
            transTitle: "titles.Receipt Num",
            className: "align-middle",
            data: data =>
                `<span class="text-prm-custom fw-bold">${data.code}</span>`
        },
        {
            transTitle: "titles.Invoice Num",
            className: "align-middle",
            data: data =>
                `<span class="text-prm-custom">${data.invoice_code ||
                    "—"}</span>`
        },
        {
            transTitle: "titles.Tenant",
            className: "align-middle",
            data: data => `<span class="text-dark">${data.tenant_name}</span>`
        },

        {
            transTitle: "titles.Amount",
            className: "align-middle ",
            data: data => {
                const val = parseFloat(data.total_received || 0).toFixed(2);
                return `<span class="text-success fw-bold">$ ${val}</span>`;
            }
        },
        {
            transTitle: "titles.Method Payment",
            className: "align-middle ",
            data: data => {
                const val = parseFloat(data.total_received || 0).toFixed(2);
                return `<span class="text-success fw-bold">$ ${val}</span>`;
            }
        },
        {
            transTitle: "titles.Date",
            className: "align-middle ",
            data: data => `<span>${data.receipt_date}</span>`
        },
        {
            transTitle: "titles.Status",
            className: "align-middle",
            data: data => {
                const status = (data.status ?? "").toLowerCase();
                let cls =
                    "badge text-dark bg-warning-subtle border border-warning";
                if (status === "approved")
                    cls =
                        "badge text-primary bg-primary-subtle border border-primary";
                if (status === "paid")
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                return `<span class="${cls} text-capitalize" style="min-width:70px">${data.status ??
                    ""}</span>`;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle",
            data: data => `
                <div class="d-flex flex-column">
                    <span class="text-capitalize text-yp-custom fw-semibold">${data.created_at ||
                        "—"}</span>
                    <small class="text-muted">${data.created_at || "—"}</small>
                </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center",
            data: data => `
                <a href="javascript:void(0)" class="btn_leave_action" data-id="${data.id}">
                    <i class="fa-solid fa-ellipsis-vertical text-muted fs-5"></i>
                </a>`
        }
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.ReceiptListView = new ListView("_receipt_list", {
            fetchApi: `${main_view.base_url}/prm/receipts/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase mb-0",
            rowCreated: (data, index, tr) => {
                tr.classList.add("receipt", "cursor-pointer");
                tr.id = `receipt_id_${data.id}`;
            }
        });

        mThis.tblReceipt = mThis.ReceiptListView.getTable();

        // Initialize Row Expansion
        new ExpandableRowConfig(mThis.tblReceipt.id, {
            dontExpandByClickingOn: ["btn_leave_action", "btn--Options"],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.id.replace("receipt_id_", "");
                if (id) mThis.displayReceiptDetail(container, id);
            }
        });

        mThis.initDropdownMenus(mThis.tblReceipt);

        // Listeners
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            el.onchange = () =>
                mThis.ReceiptListView.showPage(mThis.getFilterData());
        });

        mThis.elSearch.addEventListener("keyup", () => {
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }, 300);
        });

        mThis.initAlready = true;
    };

    mThis.displayReceiptDetail = (container, id) => {
        container.innerHTML = `<div class="p-4 text-center text-muted"><i class="fa fa-spinner fa-spin me-2"></i> Loading details...</div>`;
        vsapi
            .call(
                `${main_view.base_url}/prm/receipts/details`,
                { id: id },
                false,
                false,
                false
            )
            .then(res => {
                if (res.status_code == 200) {
                    mThis.renderReceiptDetail(container, res.data || {});
                } else {
                    container.innerHTML = `<div class="p-3 text-danger">${res.error_message ||
                        "Error loading details"}</div>`;
                }
            });
    };

    mThis.renderReceiptDetail = (container, receipt) => {
        const currency = mThis.currency_symbol || "$";
        const fmt = n =>
            Number(n || 0).toLocaleString("en-US", {
                minimumFractionDigits: 2
            });
        const breakdowns = receipt.breakdowns || [];

        const breakdownHtml = breakdowns
            .map(item => {
                const method = (item.method || "other").replace("_", " ");

                // Bank name: prefer registered bank, fall back to manual
                const bankDisplay =
                    item.registered_bank_name ||
                    item.manual_bank_name ||
                    item.bank_name ||
                    "—";

                // Reference/detail line differs by method
                let refDetail = "";
                if (item.bank_ref_number)
                    refDetail = `Ref: ${item.bank_ref_number}`;
                else if (item.card_number)
                    refDetail = `Card:${item.card_number}`;
                else if (item.cheque_number)
                    refDetail = `Cheque #${item.cheque_number}`;

                // Account identifier differs by method
                const accountDisplay =
                    item.account_name || item.card_number
                        ? item.account_name || ` ${item.card_number}`
                        : "—";

                return `
        <tr>
            <td class="fw-medium">
                <div class="d-flex flex-column">
                    <span class="text-dark text-capitalize">${method}</span>
                    <small class="text-muted" style="font-size:0.7rem">${refDetail}</small>
                </div>
            </td>
            <td>${bankDisplay}</td>
            <td>${accountDisplay}</td>
            <td class="text-end text-success fw-bold">${currency}${fmt(
                    item.amount
                )}</td>
        </tr>`;
            })
            .join("");

        container.innerHTML = `
        <div class="bg-light p-3 rounded shadow-sm border-start border-primary border-4">
            <div class="table-responsive bg-white rounded border">
                <table class="table table-sm table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Payment Method</th>
                            <th>Bank</th>
                            <th>Account / Card</th>
                            <th class="text-end">Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${breakdownHtml ||
                            '<tr><td colspan="5" class="text-center py-3 text-muted">No payment breakdowns found</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>`;
    };

    mThis.getFilterData = () => {
        let p = {
            status_id: mThis.elFilter_status.value,
            category_id: mThis.elFilter_category.value,
            search_value: mThis.elSearch.value
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            if (el.dataset.field) p[el.dataset.field] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = table => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            menus: [
                {
                    html: '<span class="ps-2">Edit Receipt</span>',
                    icon: `<i class="fa-regular fa-edit text-warning"></i>`,
                    name: "edit"
                },
                {
                    html: '<span class="ps-2">Delete Receipt</span>',
                    icon: `<i class="fa-regular fa-trash-can text-danger"></i>`,
                    name: "delete"
                }
            ],
            onClick: (btn, id, name) => {
                if (name === "delete") mThis.deleteExpense(id);
            }
        });
    };

    mThis.show = () => {
        mThis.init();
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.ReceiptListView.showPage(mThis.getFilterData());
    };

    return mThis;
})();
