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
            transTitle: "titles.Receipt No",
            className: "align-middle text-nowrap text-start",
            data: (data) => {
                const code = data.code ? `<span class="text-prm-custom">${data.code}</span>`: `<span class="text-muted fst-italic">N/A</span>`;
                const date = data.receipt_date ? `<span class="text-danger-emphasis small">${data.receipt_date}</span>`: `<span class="text-muted fst-italic small">N/A</span>`;
                return `
                    <div class="d-flex flex-column">
                        ${code}
                        <hr class="m-0 border border-secondary border-3 opacity-75">
                        ${date}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle  text-start",
            data: (data) => {
                const code = data.invoice_code ? `<span class="text-prm-custom ">${data.invoice_code}</span>`: `<span class="text-muted fst-italic">N/A</span>`;
                const date = data.invoice_date ? `<span class="text-danger-emphasis small">${data.invoice_date}</span>`: `<span class="text-muted fst-italic small">N/A</span>`;
                return `
                    <div class="d-flex flex-column ">
                        ${code}
                        <hr class="m-0 border border-secondary border-3 opacity-75">
                        ${date}
                    </div>
                `;
            }
        },

        {
            transTitle: "titles.Tenant",
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>
                    <span class="text-prm-custom d-block">
                        ${data.tenant_name ?? ''}
                    </span>
                    <span class="d-block text-warning">
                        ${data.space_code ?? ""}
                    </span>
                </div>
            </div>`;
            }
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
            transTitle: "titles.Payment Methods",
            className: "align-middle text-nowrap",
            data: data =>{
                    return `
                    <div class="text-primary-custom" style="width:220px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.payment_methods}</span>
                    </div>`;
            }
        },
        {
            transTitle: "titles.Remark",
            className: "align-middle",
            data: data => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ?? '...'}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: 'align-middle text-nowrap',
            data: (data) => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-primary-custom fw-semibold">${data.update_user ?? ''}</span>
                <span class="text-muted small">${data.updated_at ?? ''}</span>
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
                    name: "delete_receipt"
                }
            ],
            onClick: (menuLink, id, name) => {
                if (name === "delete_receipt") mThis.deleteReceipt(id, menuLink);
            }
        });
    };

    mThis.deleteReceipt = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        
        cv_interact.confirm('Delete this Receipt?', {
            transTitle: 'Delete Receipt',
            confirmButtonText: "Delete"
        }, (confirmed) => {
            if (confirmed) {
                vsapi.call(`${main_view.base_url}/prm/receipt/delete`, { id }, false, false, false)
                    .then(res => {
                        if (res.status_code === 200) {
                            cv_interact.success('Receipt deleted');
                            mThis.ReceiptListView.showPage();
                        } else {
                            cv_interact.error(res.error_message);
                        }
                    });
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
