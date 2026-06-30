"use strict";
var ReceiptsComponent = new (function () {
    const mThis = this;
    mThis.title_prop = "Transaction";
    mThis.currency_symbol = "$";

    mThis.bindDom = () => {
        if (mThis.self) return true;
        if (!main_view?.VSAppContent) return false;

        mThis.base_url = main_view.base_url;
        mThis.self = main_view.VSAppContent.querySelector(
            "#_main_receipts_component"
        );
        if (!mThis.self) return false;

        mThis.elStatus = mThis.self.querySelector("#_receipts_status");
        mThis.divFilter = mThis.self.querySelector("#_divFilter_receipts");
        mThis.elSearch = mThis.self.querySelector("#_search_receipts");
        return true;
    };

    mThis.cols = [
        { transTitle: "", className: "align-middle" },
        {
            transTitle: "titles.Receipt No",
            className: "align-middle text-nowrap",
            data: (data) => {
                const code = data.code
                    ? `<span class="text-prm-custom">${data.code}</span>`
                    : `<span class="text-muted fst-italic">N/A</span>`;

                return `
                    <div class="d-flex flex-column">
                        ${code}
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-nowrap",
            data: (data) => {
                const code = data.invoice_code
                    ? `<span class="text-prm-custom ">${data.invoice_code}</span>`
                    : `<span class="text-muted fst-italic">N/A</span>`;
                return `
                    <div class="d-flex flex-column ">
                        ${code}
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Payment Date",
            className: "align-middle text-nowrap",
            data: (data) => {
                const date = data.receipt_date;
                return `
                    <div class="d-flex flex-column">
                        ${date}
                    </div>
                `;
            },
        },
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
            transTitle: "titles.Mode of Payment",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.payment_methods}</span>
                    </div>`;
            },
        },
        {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap",
            data: (data) => {
                const val = parseFloat(data.total_received || 0).toFixed(2);
                return `<span class="text-primary fw-bold">$ ${val}</span>`;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const statusId = parseInt(data.receipt_status_id) || 1;

                const statusClasses = {
                    1: "badge text-success bg-success-subtle border border-success",
                    2: "badge text-danger bg-danger-subtle border border-danger",
                };

                const cls =
                    statusClasses[statusId] ??
                    "badge text-dark bg-light border";

                return `
                    <span
                        data-id="${data.id}"
                        class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px;">
                        ${data.receipt_status_name ??
                            (statusId === 1 ? "Active" : "Canceled")}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ??
                            "-"}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: (data) => `
                <a href="javascript:void(0)" class="btn_receipts_action" data-id="${data.id}" data-statusid="${data.receipt_status_id}" style="padding: 0 10px;">
                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
                </a>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;
        if (!mThis.bindDom()) return;

        mThis.ReceiptListView = new ListView("_receipts_list", {
            fetchApi: `${main_view.base_url}/tenant/receipt/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass:
                "table table--white rounded-2 overflow-hidden header-uppercase mb-0",
            rowCreated: (data, index, tr) => {
                tr.classList.add("receipt", "cursor-pointer");
                tr.id = `receipt_id_${data.id}`;
                tr.dataset.statusId = data.receipt_status_id;
            },
        });
        mThis.listContainer = mThis.ReceiptListView.getListContainer();
        const sh_parent = mThis.listContainer.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 220 + "px";
        };

        mThis.tblReceipt = mThis.ReceiptListView.getTable();

        mThis.initDropdownMenus(mThis.tblReceipt);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
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

    mThis.getFilterData = () => {
        let p = {
            search_value: mThis.elSearch?.value ?? "",
            status_id: mThis.elStatus?.value ?? "",
        };
        mThis.divFilter?.querySelectorAll(".filter-field").forEach((el) => {
            if (el.dataset.field) {
                p[el.dataset.field] = el.value;
            }
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_receipts_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Print Receipt"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    name: "print_receipt",
                    cssClass: "border-bottom pb-2",
                },
            ],
            onClick: (menuLink, id, name) => {
                if (name === "print_receipt") {
                    mThis.printReceipt(id, menuLink);
                }
            },
        });
    };

    mThis.printReceipt = (id, menuLink) => {
        PrintReceiptDialog.show({
            receipt_id: id,
            btn: menuLink,
            detailsUrl: `${mThis.base_url}/tenant/receipt/details`,
            invoiceDetailsUrl: `${mThis.base_url}/tenant/invoice/details`,
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/tenant/receipt/form-options`,
                {},
                null,
                null,
                null
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                if (mThis.elStatus) {
                    VSUtil.setComboItems(
                        mThis.elStatus,
                        d.receipt_statuses,
                        "id",
                        "name",
                        "",
                        "All Statuses",
                        ""
                    );
                }
            })
            .catch((err) => {
                console.error("ReceiptsComponent: form-options failed", err);
            })
            .finally(() => {
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        if (!mThis.bindDom()) {
            console.error("ReceiptsComponent: #_main_receipts_component not found.");
            return;

        }

        mThis.options = options;
        main_view.setContentView(mThis.self, mThis.title_prop);
        mThis.init();

        mThis.prepareFormOptions(() => {
            if (mThis.ReceiptListView) {
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }
        });
    };

    return mThis;
})();

window.ReceiptsComponent = ReceiptsComponent;
