"use strict";
var ReceiptComponent = new (function() {
    const mThis = this;
    mThis.title_prop = "Receipts";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector(
        "#_main_receipt_component"
    );
    mThis.btnAdd = mThis.self.querySelector("#_btnReceipt");
    mThis.elStatus = mThis.self.querySelector("#_receipt_status");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_receipt");
    mThis.elSearch = mThis.self.querySelector("#_search_receipt");
    mThis.currency_symbol = "$";

    mThis.cols = [
        { transTitle: "", className: "align-middle" },
        {
            transTitle: "titles.Receipt No",
            className: "align-middle text-nowrap",
            data: data => {
                const code = data.code
                    ? `<span class="text-prm-custom">${data.code}</span>`
                    : `<span class="text-muted fst-italic">_</span>`;

                return `
                    <div class="d-flex flex-column">
                        ${code}
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Invoice No",
            className: "align-middle text-nowrap",
            data: data => {
                const code = data.invoice_code
                    ? `<span class="text-prm-custom ">${data.invoice_code}</span>`
                    : `<span class="text-muted fst-italic">_</span>`;
                return `
                    <div class="d-flex flex-column ">
                        ${code}
                    </div>
                `;
            }
        },
                {
            transTitle: "titles.Payment Date",
            className: "align-middle text-nowrap",
            data: data => {
                const date = data.receipt_date;
                return `
                    <div class="d-flex flex-column">
                        ${date}
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
                            ${data.tenant_name ?? ""}
                            <span class="d-block text-primary"style="font-size:12px;">${data.tenant_phone ?? ""}</span>
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
            transTitle: "titles.Mode of Payment",
            className: "align-middle text-nowrap",
            data: data => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.payment_methods}</span>
                    </div>`;
            }
        },
         {
            transTitle: "titles.Amount",
            className: "align-middle text-nowrap",
            data: data => {
                const val = parseFloat(data.total_received || 0).toFixed(2);
                return `<span class="text-primary fw-bold">$ ${val}</span>`;
            }
        },


        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: data => {
                const statusId = parseInt(data.receipt_status_id) || 1;

                const statusClasses = {
                    1: "badge text-success bg-success-subtle border border-success", // Active
                    2: "badge text-danger bg-danger-subtle border border-danger" // Canceled
                };

                const cls =
                    statusClasses[statusId] ??
                    "badge text-dark bg-light border";

                // It is editable (cancellable) only if it is currently Active (1)
                const isEditable = statusId === 1;

                return `
                    <span
                        data-id="${data.id}"
                        class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px; cursor:${
                            isEditable ? "pointer" : "default"
                        }"
                        title="${
                            isEditable ? "Active Payment" : "Canceled Payment"
                        }">
                        ${data.receipt_status_name ??
                            (statusId === 1 ? "Active" : "Canceled")}
                    </span>
                `;
            }
        },
                {
            transTitle: "titles.Remark",
            className: "align-middle text-nowrap",
            data: data => {
                return `
                    <div class="text-primary-custom" style="width:200px;">
                        <span class="text-wrap text-break" style ="word-break:break-word;">${data.remarks ??
                            "-"}</span>
                    </div>
                `;
            }
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: data => `
            <div class="d-flex flex-column">
                <span class="text-capitalize text-prm-custom">${data.update_user ?? ""}</span>
                <span class="text-muted small">${data.updated_at ?? ""}</span>
            </div>`
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-center text-nowrap",
            data: data => `
                <a href="javascript:void(0)" class="btn_leave_action" data-id="${data.id}" data-statusid="${data.receipt_status_id}" style="padding: 0 10px;">
                    <i class="fa-solid fa-ellipsis-vertical text-primary-custom fs-5"></i>
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
                tr.dataset.statusId = data.receipt_status_id;
            }
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
            search_value: mThis.elSearch.value,
            status_id: mThis.elStatus.value
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            if (el.dataset.field) {
                p[el.dataset.field] = el.value;
            }
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html:
                        '<span class="ps-2" vslang="title.Cancel Receipt"></span>',
                    icon: `<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                    name: "cancel_receipt",
                    cssClass: "border-bottom pb-2"
                },
                {
                    html:
                        '<span class="ps-2" vslang="titles.Print Receipt"></span>',
                    icon: `<i class="fa-solid fa-receipt text-primary fs-5"></i>`,
                    name: "print_receipt",
                    cssClass: "border-bottom pb-2"
                }
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                menu.cancel_receipt.style.display = status_id === '1' ? 'block' : 'none';
            },
            onClick: (menuLink, id, name) => {
                if (name === "cancel_receipt") {
                    mThis.cancelReceipt(id);
                } else if (name === "print_receipt") {
                    mThis.printReceipt(id);
                }
            }
        });
    };

    mThis.printReceipt = (id, menuLink) => {
        if (!AuthManager.allowed(241)) return;
        PrintReceiptDialog.show({
            receipt_id: id,
            btn: menuLink
        });
    };

    mThis.cancelReceipt = id => {
        if (!AuthManager.allowed(242)) return;
        Swal.fire({
            title: `${LocaleManager.trans('Cancel Receipt?', "titles")}`,
            text: "This will restore the due balance on the invoice.",
            icon: "warning",
            input: "textarea",
            inputPlaceholder: "Reason for cancellation (required)...",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: `${LocaleManager.trans('Yes, Cancel it!', "buttons")}`,
            reverseButtons: true,
            inputValidator: value => {
                if (!value) return "You must provide a reason!";
            },
            showLoaderOnConfirm: true,
            preConfirm: remark => {
                let op = { id: id, remarks: remark };
                return vsapi
                    .call(`${mThis.base_url}/prm/receipts/cancel`, op, null)
                    .then(res => {
                        if (res.status_code !== 200) {
                            throw new Error(
                                res.error_message || "cancel_failed"
                            );
                        }
                        return res;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then(result => {
            if (result.isConfirmed) {
                cv_interact.success("cancel_receipt");
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }
        });
    };

    mThis.prepareFormOptions = onFinish => {
        vsapi
            .call(
                `${main_view.base_url}/prm/receipts/form-options`,
                null,
                null,
                null
            )
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                VSUtil.setComboItems(
                    mThis.elStatus,
                    d.receipt_statuses,
                    "id",
                    "name",
                    "",
                    "All Statuses",
                    ""
                );
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = options => {
        mThis.init();
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ReceiptListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();
