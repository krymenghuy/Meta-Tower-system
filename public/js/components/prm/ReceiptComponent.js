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
                    <span class="text-danger-emphasis small">
                        ${data.tenant_phone ?? ""}
                    </span>
                </div>
            </div>`;
            }
        },
         {
            transTitle: "titles.Space",
            className: "align-middle text-nowrap",
            data: (data) => {
                return ` <div class="d-flex text-warning align-items-center gap-2">
                <div>

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
                    <div class="text-primary-custom" style="width:200px;">
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
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const statusId = parseInt(data.receipt_status_id) || 1;

                const statusClasses = {
                    1: 'badge text-primary bg-primary-subtle border border-primary', // Active
                    2: 'badge text-danger bg-danger-subtle border border-danger'    // Canceled
                };

                const cls = statusClasses[statusId] ?? 'badge text-dark bg-light border';

                // It is editable (cancellable) only if it is currently Active (1)
                const isEditable = statusId === 1;

                return `
                    <span
                        data-id="${data.id}"
                        class="${cls} text-capitalize d-inline-block text-center"
                        style="min-width:70px; cursor:${isEditable ? 'pointer' : 'default'}"
                        title="${isEditable ? 'Active Payment' : 'Canceled Payment'}">
                        ${data.receipt_status_name ?? (statusId === 1 ? 'Active' : 'Canceled')}
                    </span>
                `;
            },
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
            className: "col_action align-middle text-center text-nowrap",
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
                tr.dataset.statusid = data.receipt_status_id;
            }
        });
        mThis.listContainer = mThis.ReceiptListView.getListContainer();
            const sh_parent = mThis.listContainer.parentElement;
            sh_parent.style.maxHeight = (window.innerHeight - 220) + "px";
            sh_parent.classList.add("overflow-y-auto");
            window.onresize = () => {
                sh_parent.style.maxHeight = (window.innerHeight - 220) + "px";
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
            status_id: mThis.elStatus.value,
            
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach(el => {
            if (el.dataset.field) {
                p[el.dataset.field] = el.value;
            }
        });
        return p;
    };

    mThis.initDropdownMenus = table => {
        new VSDropdownMenu({
            containerElement: table,
            actionButtonClass: "btn_leave_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="title.Reject"></span>',
                    icon: `<i class="fa-regular fa-rectangle-xmark fs-5 text-danger-emphasis"></i>`,
                    name: "cancel_receipt",
                    cssClass: "border-bottom pb-2"
                },
            ],
            onShow: (me, container) =>{
                const menu = me.getActiveMenu(container);
                const status_id = container.dataset.statusid;

                menu.cancel_receipt.style.display = (status_id >= 2) ? 'none' : 'block';

            },
            onClick: (menuLink, id, name) => {
                if (name === "cancel_receipt") mThis.cancelReceipt(id, menuLink);
            }
        });
    };


    mThis.cancelReceipt = (id) => {
        Swal.fire({
            title: 'Cancel Receipt?',
            text: "This will restore the due balance on the invoice.",
            icon: 'warning',
            input: "textarea",
            inputPlaceholder: "Reason for cancellation (required)...",
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!',
            reverseButtons: true,
            inputValidator: (value) => {
                if (!value) return "You must provide a reason!";
            },
            showLoaderOnConfirm: true,
            preConfirm: (remark) => {
                let op = { id: id, remarks: remark };
                return vsapi.call(`${mThis.base_url}/prm/receipts/cancel`, op, null)
                    .then(res => {
                        if (res.status_code !== 200) {
                            throw new Error(res.error_message || "Failed to cancel");
                        }
                        return res;
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                cv_interact.success("Receipt has been canceled.");
                // Corrected the list view variable name here:
                mThis.ReceiptListView.showPage(mThis.getFilterData());
            }
        });
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/receipts/form-options`,null,null,null)
            .then(res => {
                const d = res.status_code == 200 ? res.data : {};
                    VSUtil.setComboItems(mThis.elStatus, d.receipt_statuses, 'id', 'name', '', 'All Statuses', '');
                if (typeof onFinish === 'function') onFinish();
            });
    };

     mThis.show = (options) => {
        mThis.init();
        mThis.options = options;

        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.ReceiptListView.showPage(mThis.getFilterData());
        });
    };



    return mThis;
})();
