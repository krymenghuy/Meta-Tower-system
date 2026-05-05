"use strict";

var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elFilter_category = mThis.self.querySelector("#_bill_expense_type_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        // {
        //     title: "Bill No",
        //     className: "align-middle text-nowrap",
        //     data: (data) =>
        //         `<span class="d-block text-nowrap">${data.bill_number ?? ""}</span>`,
        // },
        {
            transTitle: "titles.Ref No",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.ref_no ?? "N/A"}</span>`;
            },
        },
        {
            transTitle: "titles.Issue Date",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom ">${data.bill_date ?? "N/A"}</span>`;
            },
        },
        {
            transTitle: "titles.Due Date",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom ">${data.due_date ?? "N/A"}</span>`;
            },
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom text-capitalize">${data.vendor_name}</span>
                <span class="d-block text-primary ">${data.phone_number}</span>`;
            },
        },

        {
            transTitle: "titles.Category",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom ">${data.expense_type_name ?? "_"}</span>`;
            },
        },


        {
            transTitle: "titles.Due",
            className: "align-middle text-nowrap",
            data: (data) => {
                const total = VSMoney.formatAmount(data.total_amount, data.currency_code ?? 'USD');
                return `<span class="d-block fw-semibold text-primary">${total}</span>`;
            },
        },
        {
            transTitle: "titles.Paid",
            className: "align-middle text-nowrap",
            data: (data) => {
                const paid = VSMoney.formatAmount(data.paid_amount, data.currency_code ?? 'USD');
                return `<span class="d-block fw-semibold text-success">${paid}</span>`;
            },
        },
        {
            transTitle: "titles.Payable",
            className: "align-middle text-nowrap",
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
                       ${VSMoney.formatAmount(data.balance, data.currency_code ?? 'USD')}
                    </span>`;
            },
        },
        {
            transTitle: "titles.Status",
            className: "align-middle text-nowrap text-center",
            data: (data) => {
                const status_id = data.display_status_id ?? data.status_id;
                let cls = "bg-secondary";
                let icon = "bi bi-question-circle";

                if (status_id == 4) {
                    cls =
                        "status-overdue";
                    icon = "fa-solid fa-triangle-exclamation";
                }else if (status_id == 3) {
                    cls =
                        "badge border border-warning text-warning bg-warning-subtle";
                } else if (status_id == 2) {
                    cls =
                        "badge border border-success text-success bg-success-subtle";
                } else if (status_id == 1) {
                    cls =
                        "badge border border-danger text-danger bg-danger-subtle";
                }

                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
                        <i class="${icon}" style="font-size:10px;"></i>
                        ${data.status ?? ""}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Last Updated",
            className: "align-middle text-nowrap",
            data: (data, index, tr) => {
                return `<div class="d-flex flex-column">
                    <span class="text-capitalize text-start text-prm-custom"><span>${data.update_user ?? ""}</span></span>
                    <span class="text-muted small">${data.updated_at ?? ""}</span>
                </div>`;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle text-nowrap",
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
                tr.dataset.displaystatusid = data.display_status_id ?? data.status_id;
                tr.dataset.vendorId = data.vendor_id;
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

        mThis.initAlready = true;
    };
    mThis.getFilterData = () => {
        let p = {
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
            expense_type_id: mThis.elFilter_category.value,
            search_value: mThis.elSearch.value,
        };

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        console.log(566,p);

        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptopns = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_vendor_action",
            cssClass: "bg-white shadow",
            menus: [

                {
                    html: '<span class="ps-2" vslang="titles.Modify"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
                {
                    html: '<span class="ps-2">Pay Now</span>',
                    icon: `<i class="fa-solid fa-circle-dollar-to-slot fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "bill_payment",
                },
                {
                    html: '<span class="ps-2">View Attachment</span>',
                    icon: `<i class="fa-solid fa-panorama" style="color: rgb(59, 125, 74);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_attachment",
                },
            ],
            onShow: (me, container) => {
                const menu = me.getActiveMenus(container);
                const status_id = container.dataset.statusid;
                const locked = status_id > 1 || display_status_id == 4;
                menu.modify_bill.style.display = status_id > 1 ? 'none' : 'block'
                menu.delete_bill.style.display = status_id > 1 ? 'none' : 'block'

                if (menu.bill_payment) {
                    const isBlocked = status_id == 2;
                    menu.bill_payment.style.display = isBlocked ? 'none' : 'block';
                }
            },

            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill":   {
                        mThis.editBill(id, menuLink);
                        break;
                    }
                    case "delete_bill":    {
                        mThis.deleteBill(id, menuLink);
                        break;
                    }
                    case "view_attachment": {
                        mThis.viewAttachment(id, menuLink);
                        break;
                    }
                    case "bill_payment": {
                        mThis.billPayment(id, menuLink);
                        break;
                    }
                    default:  {
                        break;
                    }
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        let vendor_id = tr?.dataset.vendorId || null;
        console.log(33333, vendor_id);

        const op = {
            id: parseInt(id, 10),
            vendorId: vendor_id,
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
        const tr = menuLink.closest("tr");
        let vendor_id = tr?.dataset.vendorId;
        let op = {
            id: null,
            bill_id: id,
            vendorId:vendor_id,
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
                VSUtil.setComboItems(mThis.elFilter_category, d.expense_types, "id", "expense_category", "", "All Categories", "");
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
                                    <input name="phone_number" class="data-input form-control" data-field="phone_number" placeholder=" " disabled />
                                    <label style="color:#777777; padding-left:6px;">Phone Number</label >
                                </div>
                            </div>
                            <div class="col-6 col-md-6">
                                <div class=" material-input outlined">
                                    <input data-type="date" name="bill_date" required class="data-input form-control form_input" data-field="bill_date" />
                                    <label style="color:#777777;padding-left:6px;">Issue Date</label>
                                </div>
                            </div>
                            <div class="col-6 col-md-6">
                                <div class=" material-input outlined">
                                    <input type="text" data-type="date" name="due_date" required class="data-input form-control form_input" data-field="due_date" />
                                    <label style="color:#777777;padding-left:6px;">Due Date</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input name="ref_no" class="data-input form-control" data-field="ref_no" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Reference No.</label>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <select name="expense_type_id" data-style="material" class="data-input form-control" data-field="expense_type_id" placeholder="Category">
                                    </select>
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined">
                                    <input type="text" inputmode="decimal" name="total_amount" type="number" class="data-input form-control" data-field="total_amount" placeholder=" "></input>
                                    <label style="color:#777777; padding-left:6px;">Total Amount $</label>
                                </div>
                            </div>
                            <div class="col-8">
                                <div class="material-input outlined d-flex ">
                                    <input type="text" name="documents" class=" form-control " accept=".png,.jpg,.jpeg" /disabled>
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label >
                                </div>
                            </div>
                            <div class="col-4">
                                <div class="material-input outlined d-flex ">
                                    <button name ="btn_chooseFile"  class="btn btn-block" style="background-color: #e1e5f2; padding: 0.5rem 0.75rem !important;">Choose File </button>
                                    <label style="display:none;color:#777777;padding-left:6px;">File</label>
                                </div>
                            </div>
                            <div class="col-12 ">
                                <div class="material-input outlined">
                                    <textarea name="remark" class="data-input form-control" data-field="remark" placeholder=" "></textarea>
                                    <label style="color:#777777;padding-left:6px;">Remark</label>
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
                                accept: ".png,.jpg,.jpeg",
                            },
                            (d) => {
                                me.fileData = d;
                                me.controls.documents.value = d.fileName;
                                me.controls.documents.classList.remove('d-none');
                            },
                        );
                    };

                    applyNumberInput(me.controls.total_amount);
                    applyNumberInput(me.controls.ref_no);
                },

                configSelect: [
                    {
                        name: "expense_type_id",
                        data: "expense_types",
                        textField: "expense_category",
                        valueField: "id",
                    },
                ],
                onShow: (me) => {
                const title = me.divModal.querySelector('.modal-title');
                    if (title) {
                        const isModify = !!me.dataOptions?.id;
                        title.innerHTML = isModify
                            ? '<h4 class="text-prm-custom text-start fw-bold">Modify Bill</h4>'
                            : '<h4 class="text-prm-custom text-start fw-bold">Generate Bill</h4>';
                    }
                },
                prepareFormOptions: {
                    createTitle: "Generate Bill",
                    modifyTitle: "Modify Bill",
                    targetProp: "bill_details",
                    api: {
                        endpoint: [main_view.base_url, "/prm/bill/form-options"].join(""),
                        params: (op) => {
                            return { id: op.id };
                        },
                    },
                },

                // onPrepareForm: (me, data) => {
                //     const header = me.divModal.querySelector(".modal-header");
                //     const btnClose = header.querySelector("button[data-bs-dismiss]");
                //     if (btnClose) btnClose.classList.add("d-none");

                //     const details = data?.bill_details;
                //     if (details?.file_image) {
                //         me.controls.documents.value = details.file_image;
                //         me.controls.documents.classList.remove('d-none');
                //     }
                //     if (details?.vendor_id) {
                //         me._selectedVendorId = details.vendor_id;
                //         if (me.controls.vendor_id) me.controls.vendor_id.value = details.vendor_id;
                //         if (me.controls.vendor)    me.controls.vendor.value    = details.vendor_name || '';
                //         if (me.controls.phone_number) me.controls.phone_number.value = details.phone_number || '';
                //     }
                // },

                onPrepareForm: (me, data) => {
                    const details = data?.bill_details;
                    if (details?.file_image) {
                        me.controls.documents.value = details.file_image;
                        me.controls.documents.classList.remove('d-none');
                    }
                    if (details?.vendor_id) {
                        me._selectedVendorId = details.vendor_id;
                        if (me.controls.vendor_id)    me.controls.vendor_id.value    = details.vendor_id;
                        if (me.controls.vendor)       me.controls.vendor.value       = details.vendor_name || '';
                        if (me.controls.phone_number) me.controls.phone_number.value = details.phone_number || '';
                    }

                    const prefill = me.dataOptions?.prefill || {};
                    if (Object.keys(prefill).length) {
                        if (prefill.vendor_id)    me._selectedVendorId               = prefill.vendor_id;
                        if (prefill.vendor_id)    me.controls.vendorid.value         = prefill.vendor_id;
                        if (prefill.vendor_name)  me.controls.vendor.value           = prefill.vendor_name;
                        if (prefill.phone_number) me.controls.phone_number.value     = prefill.phone_number;
                        ['bill_date', 'ref_no', 'total_amount', 'remark'].forEach(field => {
                            if (prefill[field] && me.controls[field]) {
                                me.controls[field].value = prefill[field];
                            }
                        });
                    }
                    setTimeout(() => {
                        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                        const toFormatted = (val) => {
                            if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(val)) return val;
                            const parsed = new Date(val);
                            if (isNaN(parsed)) return val;
                            const d = String(parsed.getDate()).padStart(2, '0');
                            const m = months[parsed.getMonth()];
                            const y = parsed.getFullYear();
                            return `${d}-${m}-${y}`;
                        };
                        if (me.controls.bill_date) {
                            if (!me.controls.bill_date.value) {
                                const now = new Date();
                                const d = String(now.getDate()).padStart(2, '0');
                                const m = months[now.getMonth()];
                                const y = now.getFullYear();
                                me.controls.bill_date.value = `${d}-${m}-${y}`;
                            } else {
                                me.controls.bill_date.value = toFormatted(me.controls.bill_date.value);
                            }
                        }
                        if (me.controls.due_date && me.controls.due_date.value) {
                            me.controls.due_date.value = toFormatted(me.controls.due_date.value);
                        }
                    }, 0);
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
                                            cv_interact.success("Bill has been updated successfully.");
                                        } else {
                                            cv_interact.success("New bill has been added successfully.");
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
window.BillDialog = BillDialog;
