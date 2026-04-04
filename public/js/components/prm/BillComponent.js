"use strict";

var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };
    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            title: "Bill Date",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-nowrap text-prm-custom fw-semibold">${data.bill_number ?? ""}</span> 
                 <span class="d-block text-prm-custom text-nowrap">${data.bill_date}</span>`,
        },

        // {
        //     transTitle: "titles.Bill Number",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="text-nowrap text-prm-custom fw-semibold">${data.bill_number ?? ""}</span>`;
        //     },
        // },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold">${data.vendor_name}</span>`;
            },
        },
        {
            transTitle: "titles.Phone Number",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.phone_number}</span>
                        <span class="d-block text-prm-custom">${data.email ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Expense Type",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom ">${data.expense_type_name ?? "_"}</span>`;
            },
        },
        {
            transTitle: "titles.Reference No",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`;
            },
        },
        
        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.total_amount)}</span>`;
            },
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => {
                return `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`;
            },
        },
        {
            title: "Balance",
            className: "align-middle text-end",
            data: (data) => {
                const balance = Number(data.balance || 0);
                const total = Number(data.total_amount || 0);
                const paid = Number(data.paid_amount || 0);
                const color =
                    balance > 0
                        ? "#dc2626"
                        : total > 0 && paid >= total
                          ? "#15803d"
                          : "#94a3b8";

                return `
                    <span class="d-block fw-semibold" style="color:${color};">
                        ${formatCurrency(data.balance)}
                    </span>`;
            },
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status_id = data.status_id;
                let cls =
                    "badge text-warning bg-danger-subtle border border-danger";

                if (status_id == 3) {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                } else if (status_id == 2) {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status_id == 1) {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom fw-semibold"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action" data-id="${data.id}" data-vendorId="${data.vendor_id}" data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillListView = new ListView("_bill_list", {
            fetchApi: `${main_view.base_url}/prm/bill/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                tr.dataset.vendorid = data.vendor_id;
                tr.dataset.billid   = data.bill_id;
                tr.dataset.fileurl = data.file_image_url ?? "";
                tr.classList.add("bill");
                tr.setAttribute("id", `bill_payment_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => {
                    mThis.BillListView.showPage(mThis.getFilterData());
                },
            };
            BillDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };
        const tblBill = mThis.BillListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_list_table";
        mThis.initDropdownMenus(tblBill);
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillListView.showPage(mThis.getFilterData());
            }, 250);
        });

        new ExpandableRowConfig(tblBill.id, {
            dontExpandByClickingOn: ["btn_dropdown_vendor_action"],
            onOpen: (container, detail_tr, parent_tr) => {
                const id = parent_tr.dataset.id;
                if (id && !isNaN(id)) mThis.displayBillDetail(container, id);
            }
        });

        mThis.initAlready = true;
    };

    mThis.displayBillDetail = (container, bill_id) => {
        container.innerHTML = `<div class="text-center py-3"><div class="spinner-border text-primary" role="status"></div></div>`;

        vsapi.call(`${main_view.base_url}/prm/bill-payment/form-options`, { bill_id })
            .then(res => {
                if (res.status_code !== 200) {
                    container.innerHTML = `<div class="alert alert-danger m-3">Failed to load bill details</div>`;
                    return;
                }
                mThis.renderBillDetail(container, res.data || {});
            })
            .catch(() => {
                container.innerHTML = `<div class="alert alert-danger m-3">Network error loading bill details</div>`;
            });
    };

    mThis.renderBillDetail = (container, data) => {
        const bill     = data.bill || {};
        const payments = data.payments || [];
        const currency = "$";
        const fmt = n => Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

        const paymentsHtml = payments.map(p => `
            <tr style="font-size:0.82rem;">
                <td class="text-center text-nowrap text-muted">${p.payment_date ?? "—"}</td>
                <td class="text-capitalize">${p.payer ?? "—"}</td>
                <td class="text-center text-muted text-capitalize">${p.note ?? "—"}</td>
                <td class="text-center">
                    <span class="badge rounded-pill bg-light text-dark border text-capitalize" style="font-size:0.75rem;">${p.payment_method ?? "—"}</span>
                </td>
                <td class="text-center text-muted">${p.currency_code ?? "USD"}</td>
                <td class="text-end fw-semibold pe-3" style="color:#059669;">${currency}${fmt(p.amount)}</td>
            </tr>
        `).join("");

        container.innerHTML = `
        <div style="background:#f8fafc; border-radius:10px; padding:10px 14px; font-size:0.875rem;">

            <!-- Payments Table only -->
            <div class="table-responsive" style="border-radius:8px; border:1px solid #e2e8f0; overflow:hidden;">
                <table class="table table-sm mb-0" style="font-size:0.82rem;">
                    <thead style="background:#f1f5f9; border-bottom:1px solid #e2e8f0;">
                        <tr>
                            <th class="text-center text-muted fw-semibold py-2" style="width:110px; font-size:0.72rem;">Date</th>
                            <th class="text-muted fw-semibold py-2" style="font-size:0.72rem;">Payer</th>
                            <th class="text-center text-muted fw-semibold py-2" style="font-size:0.72rem;">Remark</th>
                            <th class="text-center text-muted fw-semibold py-2" style="width:100px; font-size:0.72rem;">Method</th>
                            <th class="text-center text-muted fw-semibold py-2" style="width:70px; font-size:0.72rem;">Currency</th>
                            <th class="text-end text-muted fw-semibold py-2" style="width:110px; font-size:0.72rem;">Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${paymentsHtml || `
                        <tr>
                            <td colspan="6" class="text-center py-3 text-muted" style="font-size:0.82rem;">
                                <i class="fa-regular fa-folder-open me-1"></i> No payments recorded
                            </td>
                        </tr>`}
                    </tbody>
                </table>
            </div>

            <!-- Summary Footer -->
            <div class="d-flex flex-wrap justify-content-end gap-2 mt-2">
                ${[
                    { label: "Total",     val: bill.total_amount, color: "#3b82f6" },
                    { label: "Paid",      val: bill.paid_amount,  color: "#059669" },
                    { label: "Remaining", val: bill.balance,      color: "#dc2626" },
                ].map(s => `
                    <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 14px; text-align:right; min-width:120px;">
                        <div class="text-muted" style="font-size:0.68rem; text-transform:uppercase; letter-spacing:0.05em;">${s.label}</div>
                        <div class="fw-bold" style="font-size:0.95rem; color:${s.color};">${currency}${fmt(s.val)}</div>
                    </div>
                `).join("")}
            </div>

        </div>`;
    };
    mThis.getFilterData = () => {
        let p = {
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2"> Pay Now</span>',
                    icon: `<i class="fa-solid fa-circle-dollar-to-slot fa-lg" style="color: rgb(160, 2, 57);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "bill_payment",
                },
                {
                    html: '<span class="ps-2">View Attachment</span>',  
                    icon: `<i class="fa-solid fa-panorama" style="color: rgb(59, 125, 74);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_attachment",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify Bill Record"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Bill Record"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = Number(container.dataset.statusid);

                if (menu.bill_payment) {
                    const isBlocked = status_id === 2;
                    menu.bill_payment.style.display = isBlocked ? "none" : "block";
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill":     mThis.editBill(id, menuLink);       break;
                    case "delete_bill":     mThis.deleteBill(id, menuLink);     break;
                    case "view_attachment": mThis.viewAttachment(id, menuLink); break;
                    case "bill_payment":    mThis.billPayment(id, menuLink);    break;
                    default: break;
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");

        let vendor_id = tr?.dataset.vendorid || null;
        console.log(33333, vendor_id);

        const op = {
            id: parseInt(id, 10),
            vendorid: vendor_id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            },
        };
        BillDialog.show(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm(
            "Delete this Bill Record?",
            {
                transTitle: "Delete Bill Record",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (e) {
                if (e) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/bill/delete`, { id: id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    res.message || "Bill record has been deleted.",
                                );
                                mThis.BillListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(
                                    res.error_message || "Failed to delete bill record.",
                                );
                            }
                        });
                }
            },
        );
    };

    mThis.billPayment = (id, menuLink) => {
        let op = {
            id: null,
            bill_id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());

                const tr = document.querySelector(`#bill_payment_id${id}`);
                const expandedContainer = tr?.nextElementSibling?.querySelector(".expandable-content");
                if (expandedContainer) mThis.displayBillDetail(expandedContainer, id);
            }
        };
        BillPaymentDialog.show(op);
    };

    mThis.viewAttachment = (id, menuLink) => {
        vsapi.call(`${main_view.base_url}/prm/bill/view-attachment`, { id: id }, false, false, false)
            .then((res) => {
                if (res.status_code !== 200) {
                    cv_interact.error(res.error_message || 'No attachment found.');
                    return;
                }

                const { data_url, ext, mime_type } = res.data;

                const overlay = document.createElement('div');
                overlay.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9999; display:flex; justify-content:center; align-items:center; cursor:pointer;`;

                const wrapper = document.createElement('div');
                wrapper.style.cssText = `position:relative; max-width:90vw; max-height:90vh;`;

                const isImage = ['png', 'jpg', 'jpeg'].includes(ext);
                const isPdf   = ext === 'pdf';

                if (isImage) {
                    const img = document.createElement('img');
                    img.src = data_url;
                    img.style.cssText = `max-width:100%; max-height:90vh; border-radius:8px; box-shadow:0 4px 32px #000;`;
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement('iframe');
                    iframe.src = data_url;
                    iframe.style.cssText = `width:80vw; height:85vh; border:none; border-radius:8px;`;
                    wrapper.appendChild(iframe);
                } else {
                    overlay.onclick = null;
                    document.body.removeChild(overlay);
                    window.open(data_url, '_blank');
                    return;
                }

                const btnClose = document.createElement('button');
                btnClose.style.cssText = `position:absolute; top:-16px; right:-16px; border:none; background:#fff; border-radius:50%; width:32px; height:32px; font-size:18px; cursor:pointer; line-height:1;`;
                btnClose.innerHTML = '&times;';
                btnClose.onclick = (e) => { e.stopPropagation(); document.body.removeChild(overlay); };

                wrapper.appendChild(btnClose);
                overlay.appendChild(wrapper);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
            });
    };
    
    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
                console.log("form-options data:", d); 
                VSUtil.setComboItems(mThis.elFilter_vendor, d.vendors, "id", "vendor", "", "All Vendor", "");
                VSUtil.setComboItems(mThis.elFilter_status, d.bill_statuses, "id", "bill_status", "", "All Statuses", "");
                if (typeof onFinish === "function") onFinish();
            });
    };

    mThis.show = (options) => {
        mThis.init();
        mThis.options = options;
        mThis.prepareFormOptions(() => {
            main_view.setContentView(mThis.self, mThis.title_prop);
            mThis.BillListView.showPage(mThis.getFilterData());
        });
    };
    return mThis;
})();

const BillDialog = (() => {
    const self = {};
    let dialog = null;

    self.show = (op) => {
        console.log("DEBUG 1: Opening Dialog with op:", op);

        dialog =
            dialog ||
            new GeneralDialog({
                cssClass: "modal-lg vs-modal",
                backdrop: "static",
                keyboard: true,
                createContent: () => {
                    return [
                        `<div class="row ">
                                <input name="vendorid" class="d-none data-input form-control" data-field="vendor_id">
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input  name="vendor" class="data-input form-control" data-field="vendor_name" placeholder="Vendor Name "></input>
                                    <label style="color:#777777;padding-left:6px; display:none;">Vendor</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Phone Number</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-6">
                                <div class=" material-input outlined">
                                    <input type="text" data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
                                    <label style="color:#777777;padding-left:6px;">Bill Date</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="ref_no" class="data-input form-control" data-field="ref_no" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Reference No.</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <select name="expense_type_id" data-style="material" class="data-input form-control" data-field="expense_type_id" placeholder="Expense Type">
                                    </select>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined">
                                    <input name="total_amount" class="data-input form-control" data-field="total_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Total Amount</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined d-flex ">
                                    <button name ="btn_chooseFile"  class="btn btn-block" style="background-color: #e1e5f2; padding: 0.5rem 0.75rem !important;">Choose File </button>
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="material-input outlined d-flex ">
                                    <input type="text" name="documents" class="d-none form-control " accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" />
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label>
                                </div>
                            </div>
                            <div class="col-12 ">
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="remark" placeholder=" "></textarea>
                                    <label style="color:#777777;padding-left:6px;">Description</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined d-none">
                                    <input name="bill_number" class="data-input form-control" data-field="bill_number" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Bill Number</label>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="material-input outlined d-none">
                                    <input name="paid_amount" class="data-input form-control" data-field="paid_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Amount Paid</label>
                                </div>
                            </div>
                        </div>`,
                    ].join("");
                },

                contentCreated: (me) => {
                    const applyVendorInfo = (vendorId) => {
                        me._selectedVendorId = vendorId || '';
                        if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || '';
                        if (!vendorId) {
                            if (me.controls.phone_number) me.controls.phone_number.value = '';
                            return;
                        }
                        vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                            .then(res => {
                                const d = res.data || {};
                                const v = d.vendor || {};
                                if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || '';
                            })
                            .catch(() => {});
                    };
                    if (me.controls.vendor) {
                        me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                            type: 'select',
                            prefetch: true,
                            minChars: 0,
                            api: {
                                endpoint: `${main_view.base_url}/prm/bill/form-options`,
                            },
                            processResponse: (res) => {
                                const vendors = res?.data?.vendors || [];
                                return (Array.isArray(vendors) ? vendors : []).map(v => ({ ...v,
                                    vendor: v.vendor || v.name || v.vendor_name || v.code || '',
                                    phone_number: v.phone_number || v.contact_phone || v.phone || '',
                                }));
                            },
                            columns: { vendor: 'VENDOR', phone_number: 'PHONE' },
                            showColumnHeader: true,
                            placeholder: 'Search vendor',
                            onSelect: (vendor) => {
                                const id = vendor?.id || '';
                                me.controls.vendor.value = vendor?.vendor || '';
                                applyVendorInfo(id);
                            }
                        });

                        if (me._selectedVendorId) {
                            applyVendorInfo(me._selectedVendorId);
                        }
                    }
                    me.controls.btn_chooseFile.onclick = () => {
                        FileChooser.chooseFile(
                            {
                                accept: ".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg",
                            },
                            (d) => {
                                me.fileData = d;
                                me.controls.documents.value = d.fileName;
                                me.controls.documents.classList.remove('d-none');
                            },
                        );
                    };
                },

                configSelect: [
                    {
                        name: "expense_type_id",
                        data: "expense_types",
                        textField: "expense_category",
                        valueField: "id",
                    },
                ],

                prepareFormOptions: {
                    createTitle: "Add New Bill Record",
                    modifyTitle: "Modify Bill Record",
                    targetProp: "bill_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/bill/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },
               
                onPrepareForm: (me, data) => {
                    const header = me.divModal.querySelector(".modal-header");
                    const btnClose = header.querySelector("button[data-bs-dismiss]");
                    if (btnClose) btnClose.classList.add("d-none");

                    const details = data?.bill_details;
                    if (details?.file_image) {
                        me.controls.documents.value = details.file_image;
                        me.controls.documents.classList.remove('d-none');
                    }
                    if (details?.vendor_id) {
                        me._selectedVendorId = details.vendor_id;
                        if (me.controls.vendor_id) me.controls.vendor_id.value = details.vendor_id;
                        if (me.controls.vendor)    me.controls.vendor.value    = details.vendor_name || '';
                        if (me.controls.phone_number) me.controls.phone_number.value = details.phone_number || '';
                    }
                },

                buttons: [
                    {
                        label: '<span vslang="buttons.Cancel"></span>',
                        cssClass: "btn btn-secondary",
                        click: (me, btn) => {
                            me.hide(false);
                        },
                    },
                    {
                        label: '<span vslang="buttons.Submit"></span>',
                        cssClass: "btn btn-primary",
                        click: (me, btn) => {
                            const op = me.getData();
                            op.id = me.dataOptions.id;
                            console.log(444, me.dataOptions);
                            
                            if (me._selectedVendorId != null && me._selectedVendorId !== undefined) {
                                op.vendor_id = me._selectedVendorId;
                            }

                            if (me.fileData) {
                                op.photo = me.fileData.base64 
                                    || me.fileData.data 
                                    || me.fileData.fileData 
                                    || me.fileData.content 
                                    || null;

                                op.ext = me.fileData.ext
                                    || me.fileData.fileType
                                    || me.fileData.extension
                                    || null;    
                            }
                            vsapi
                                .call([main_view.base_url, "/prm/bill/save"].join(""), op, btn, null)
                                .then((res) => {
                                    if (res.status_code === 200) {
                                        me.hide(true, op);
                                        if (me.dataOptions.id > 0) {
                                            cv_interact.success("Bill has been updated successfully");
                                        } else {
                                            cv_interact.success("New bill has been added successfully");
                                        }
                                    } else {
                                        cv_interact.error(res.error_message);
                                    }
                                });
                        },
                    },
                ],
            });
        dialog.show(op);
    };
    return self;
})();