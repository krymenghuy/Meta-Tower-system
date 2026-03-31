"use strict";

var BillPaymentComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bill Payment Record Management";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_payment_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBillPayment");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill_payment");

    const formatCurrency = (amount) => {
        const value = Number(amount || 0);
        return `$ ${value.toFixed(2)}`;
    };
    mThis.cols = [
        { title: "", className: "align-middle" },
        {
            transTitle: "titles.Bill Number",
            className: "align-middle",
            data: (data) => `<span class="text-nowrap text-prm-custom">${data.bill_number ?? ""}</span>`,
        },
        {
            transTitle: "titles.Vendor",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.vendor_name}</span>`,
        },
        {
            transTitle: "titles.Phone Number",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.phone_number}</span>
                             <span class="d-block text-prm-custom">${data.email ?? "_"}</span>`,
        },
        {
            transTitle: "titles.Reference No",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.ref_no ?? "_"}</span>`,
        },
        {
            title: "Bill Date",
            className: "align-middle",
            data: (data) => `<span class="text-prm-custom text-nowrap">${data.bill_date}</span>`,
        },
        {
            title: "Total Amount",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#1d4ed8;">${formatCurrency(data.total_amount)}</span>`,
        },
        {
            title: "Amount Paid",
            className: "align-middle text-end",
            data: (data) => `<span class="d-block text-prm-custom fw-semibold" style="color:#15803d;">${formatCurrency(data.paid_amount)}</span>`,
        },
        {
            title: "Description",
            className: "align-middle",
            data: (data) => `<span class="d-block text-prm-custom">${data.remark ?? "__"}</span>`,
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status_id = data.status_id;
                let cls = "badge text-warning bg-danger-subtle border border-danger";
                if (status_id == 3) cls = "badge text-warning bg-warning-subtle border border-warning";
                else if (status_id == 2) cls = "badge text-success bg-success-subtle border border-success";
                else if (status_id == 1) cls = "badge text-danger bg-danger-subtle border border-danger";
                return `<span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">${data.status ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => `<div class="d-flex flex-column">
                <span class="text-capitalize text-start text-prm-custom fw-semibold">${data.update_user ?? ""}</span>
                <span class="text-muted">${data.updated_at ?? ""}</span>
            </div>`,
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)" class="btn--Options btn_dropdown_vendor_action"
                        data-id="${data.id}" data-vendorId="${data.vendor_id}"
                        data-statusid="${data.status_id}" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis-vertical text-black fs-5"></i>
                    </a>
                </div>`,
        },
    ];

    mThis.init = () => {
        if (mThis.initAlready) return;

        mThis.BillPaymentListView = new ListView("_bill_payment_list", {
            fetchApi: `${main_view.base_url}/prm/bill/list-paginate`,
            perPage: 10,
            apiCluster: main_view.apiCluster,
            columns: mThis.cols,
            tableClass: "table table--white rounded-2 header-uppercase",
            rowCreated: (data, index, tr) => {
                tr.dataset.id = data.id;
                tr.dataset.statusid = data.status_id;
                tr.dataset.vendorid = data.vendor_id;
                tr.dataset.fileurl = data.file_image_url ?? "";
                tr.classList.add("bill");
                tr.setAttribute("id", `bill_id${data.id}`);
            },
            listContainerClass: null,
        });

        mThis.btnAdd.onclick = function (e) {
            e.preventDefault();
            const op = {
                id: null,
                btn: e.target,
                onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
            };
            BillPaymentDialog.show(op);
        };

        mThis.pr_tbl = mThis.BillPaymentListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => { sh_parent.style.maxHeight = window.innerHeight - 200 + "px"; };

        const tblBill = mThis.BillPaymentListView.getTable();
        if (!tblBill.id) tblBill.id = "_bill_payment_list_table";
        mThis.initDropdownMenus(tblBill);

        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            el.onchange = (e) => {
                e.preventDefault();
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            };
        });

        mThis.elSearch.addEventListener("keyup", (e) => {
            e.preventDefault();
            clearTimeout(mThis.search_timeout);
            mThis.search_timeout = setTimeout(() => {
                mThis.BillPaymentListView.showPage(mThis.getFilterData());
            }, 250);
        });

        mThis.initAlready = true;
    };

    mThis.getFilterData = () => {
        let p = {
            vendor_id: mThis.elFilter_vendor.value,
            status_id: mThis.elFilter_status.value,
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            p[el.dataset.field] = el.value;
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
                {
                    html: '<span class="ps-2">View Attachment</span>',
                    icon: `<i class="fa-regular fa-eye fa-lg" style="color:rgb(56,49,111);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "view_attachment",
                },
                {
                    html: '<span class="ps-2">Bill Payment</span>',
                    icon: `<i class="fa-solid fa-sack-dollar" style="color:rgb(22,80,137);"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "bill_payment",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "modify_bill":   mThis.editBill(id, menuLink); break;
                    case "delete_bill":   mThis.deleteBill(id, menuLink); break;
                    case "view_attachment": mThis.viewAttachment(id);
                    case "bill_payment":  mThis.billPayment(id);
                    default: break;
                }
            },
        };
        new VSDropdownMenu(menuOptopns);
    };

    mThis.editBill = (id, menuLink) => {
        const tr = menuLink.closest("tr");
        const op = {
            id: parseInt(id, 10),
            vendorid: tr?.dataset.vendorid || null,
            btn: menuLink,
            onClose: () => mThis.BillPaymentListView.showPage(mThis.getFilterData()),
        };
        BillPaymentDialog.show(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        cv_interact.confirm("Delete this Bill Record?",
            { transTitle: "Delete Bill Record", context: "delete", confirmButtonText: "Delete" },
            function (e) {
                if (e) {
                    vsapi.call(`${main_view.base_url}/prm/bill/delete`, { id }, false, false, false)
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(res.message || "Bill record has been deleted.");
                                mThis.BillPaymentListView.showPage(mThis.getFilterData());
                            } else {
                                cv_interact.error(res.error_message || "Failed to delete bill record.");
                            }
                        });
                }
            }
        );
    };

    mThis.viewAttachment = (id) => {
        vsapi.call(`${main_view.base_url}/prm/bill/view-attachment`, { id }, false, false, false)
            .then((res) => {
                if (res.status_code !== 200) { cv_interact.error(res.error_message || "No attachment found."); return; }
                const { data_url, ext } = res.data;
                const overlay = document.createElement("div");
                overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;justify-content:center;align-items:center;cursor:pointer;";
                const wrapper = document.createElement("div");
                wrapper.style.cssText = "position:relative;max-width:90vw;max-height:90vh;";
                const isImage = ["png","jpg","jpeg"].includes(ext);
                const isPdf   = ext === "pdf";
                if (isImage) {
                    const img = document.createElement("img");
                    img.src = data_url;
                    img.style.cssText = "max-width:100%;max-height:90vh;border-radius:8px;box-shadow:0 4px 32px #000;";
                    wrapper.appendChild(img);
                } else if (isPdf) {
                    const iframe = document.createElement("iframe");
                    iframe.src = data_url;
                    iframe.style.cssText = "width:80vw;height:85vh;border:none;border-radius:8px;";
                    wrapper.appendChild(iframe);
                } else {
                    document.body.removeChild(overlay);
                    window.open(data_url, "_blank");
                    return;
                }
                const btnClose = document.createElement("button");
                btnClose.style.cssText = "position:absolute;top:-16px;right:-16px;border:none;background:#fff;border-radius:50%;width:32px;height:32px;font-size:18px;cursor:pointer;line-height:1;";
                btnClose.innerHTML = "&times;";
                btnClose.onclick = (e) => { e.stopPropagation(); document.body.removeChild(overlay); };
                wrapper.appendChild(btnClose);
                overlay.appendChild(wrapper);
                overlay.onclick = () => document.body.removeChild(overlay);
                document.body.appendChild(overlay);
            });
    };

    // mThis.billPayment = (id, menuLink) => {
    //     let op = {
    //         id: null,
    //         btn: menuLink,
    //         onClose: () => mThis.BillPaymentListView.showPage(),
    //     };
    //     alert("coming soon!");
    // };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi.call(`${main_view.base_url}/prm/bill/form-options`, null, null, null)
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
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
            mThis.BillPaymentListView.showPage(mThis.getFilterData());
        });
    };

    return mThis;
})();



const BillPaymentDialog = (() => {
    const self = {};
    let dialog = null;

    /* ── inline styles injected once ── */
    const injectStyles = (() => {
        let done = false;
        return () => {
            if (done) return;
            done = true;
            const css = `
            /* ── PO-style dialog reset ── */
            .bpd-wrap *{box-sizing:border-box;}
            .bpd-wrap{font-size:13px;color:#222;}

            /* header strip */
            .bpd-wrap .modal-header{
                background:#e8ecf6!important;
                border-bottom:1px solid #cdd3e8!important;
                padding:12px 20px!important;
            }
            .bpd-wrap .modal-title{font-size:15px;font-weight:600;color:#1e2a52;}

            /* field rows: label : input */
            .bpd-fields{display:grid;grid-template-columns:1fr 1fr;column-gap:48px;margin-bottom:16px;}
            .bpd-row{display:flex;align-items:center;margin-bottom:12px;gap:0;}
            .bpd-row label{
                width:110px;flex-shrink:0;
                font-size:13px;font-weight:600;color:#1e2a52;
            }
            .bpd-row .bpd-sep{color:#b0b8d0;margin:0 10px 0 0;font-weight:400;}
            .bpd-row input,.bpd-row select{
                flex:1;height:34px;
                border:1px solid #d0d6e8;border-radius:6px;
                padding:0 10px;font-size:13px;color:#222;
                background:#fff;outline:none;
                transition:border-color .15s,box-shadow .15s;
            }
            .bpd-row input:focus,.bpd-row select:focus{
                border-color:#5b72d8;
                box-shadow:0 0 0 3px rgba(91,114,216,.14);
            }
            .bpd-row input::placeholder,.bpd-row select option[value=""]{color:#b0b8d0;}

            /* file row */
            .bpd-file-wrap{flex:1;display:flex;gap:8px;}
            .bpd-file-wrap input[type=text]{
                flex:1;height:34px;border:1px solid #d0d6e8;border-radius:6px;
                padding:0 10px;font-size:13px;color:#888;background:#f8f9fd;
            }
            .bpd-choose{
                height:34px;padding:0 14px;white-space:nowrap;cursor:pointer;
                background:#e8ecf6;border:1px solid #cdd3e8;border-radius:6px;
                font-size:13px;font-weight:500;color:#3a4a7a;
                transition:background .15s;
            }
            .bpd-choose:hover{background:#d4d9ee;}

            /* amounts section */
            .bpd-amounts{
                background:#f2f4fb;border:1px solid #dde2f2;border-radius:8px;
                padding:14px 18px;margin-bottom:16px;
            }
            .bpd-amounts-grid{display:grid;grid-template-columns:1fr 1fr;column-gap:48px;}

            /* totals box */
            .bpd-totals-wrap{display:flex;justify-content:flex-end;margin-bottom:16px;}
            .bpd-totals{
                background:#fff;border:1px solid #dde2f2;border-radius:8px;
                padding:14px 20px;min-width:270px;
            }
            .bpd-t-row{
                display:flex;align-items:center;justify-content:space-between;
                margin-bottom:10px;font-size:13px;
            }
            .bpd-t-row label{font-weight:600;color:#1e2a52;min-width:90px;}
            .bpd-t-row .bpd-sep{color:#b0b8d0;margin:0 10px;}
            .bpd-t-row .bpd-val{
                min-width:100px;text-align:right;
                font-variant-numeric:tabular-nums;color:#222;
            }
            .bpd-t-row.bpd-grand{
                border-top:1px solid #dde2f2;padding-top:10px;margin-top:4px;font-size:14px;
            }
            .bpd-t-row.bpd-grand label,
            .bpd-t-row.bpd-grand .bpd-val{font-weight:700;color:#1e2a52;}
            .bpd-balance-positive{color:#15803d!important;}
            .bpd-balance-negative{color:#dc2626!important;}

            /* description */
            .bpd-textarea{
                width:100%;min-height:72px;resize:vertical;
                border:1px solid #d0d6e8;border-radius:6px;
                padding:9px 11px;font-size:13px;color:#222;
                outline:none;transition:border-color .15s,box-shadow .15s;
                font-family:inherit;
            }
            .bpd-textarea:focus{border-color:#5b72d8;box-shadow:0 0 0 3px rgba(91,114,216,.14);}
            .bpd-textarea::placeholder{color:#b0b8d0;}

            /* footer buttons */
            .bpd-wrap .modal-footer{
                background:#f2f4fb!important;
                border-top:1px solid #dde2f2!important;
                padding:12px 20px!important;
            }
            .bpd-wrap .modal-footer .btn-secondary{
                background:#f59e0b!important;border-color:#f59e0b!important;
                color:#fff!important;font-weight:600;
            }
            .bpd-wrap .modal-footer .btn-secondary:hover{background:#d97706!important;border-color:#d97706!important;}
            .bpd-wrap .modal-footer .btn-primary{
                background:#fff!important;border:1px solid #cdd3e8!important;
                color:#1e2a52!important;font-weight:600;
            }
            .bpd-wrap .modal-footer .btn-primary:hover{
                background:#eef1fb!important;border-color:#5b72d8!important;color:#3a4a7a!important;
            }

            /* section label */
            .bpd-section-label{
                font-size:11px;font-weight:700;letter-spacing:.6px;
                text-transform:uppercase;color:#7a85a8;
                margin-bottom:10px;padding-bottom:6px;
                border-bottom:1px solid #dde2f2;
            }
            `;
            const tag = document.createElement("style");
            tag.textContent = css;
            document.head.appendChild(tag);
        };
    })();

    self.show = (op) => {
        injectStyles();

        dialog = dialog || new GeneralDialog({
            cssClass: "modal-lg vs-modal bpd-wrap",
            backdrop: "static",
            keyboard: true,

            /* ── dialog HTML ── */
            createContent: () => [`

                <!-- hidden vendor id -->
                <input name="vendorid" class="d-none data-input" data-field="vendor_id">

                <!-- ── TOP FIELDS ── -->
                <div class="bpd-fields">

                    <!-- LEFT -->
                    <div>
                        <div class="bpd-row">
                            <label>Payee (Vendor)</label>
                            <span class="bpd-sep">:</span>
                            <input name="vendor"
                                class="data-input"
                                data-field="vendor_name"
                                placeholder="Search vendor…"
                                autocomplete="off"/>
                        </div>
                        <div class="bpd-row">
                            <label>Phone</label>
                            <span class="bpd-sep">:</span>
                            <input name="phone_number"
                                class="data-input"
                                data-field="phone_number"
                                placeholder="Auto-filled"
                                readonly/>
                        </div>
                        <div class="bpd-row">
                            <label>Payer</label>
                            <span class="bpd-sep">:</span>
                            <input name="code"
                                class="data-input"
                                data-field="code"
                                placeholder="Optional"/>
                        </div>
                        <div class="bpd-row">
                            <label>Category</label>
                            <span class="bpd-sep">:</span>
                            <input name="category"
                                class="data-input"
                                data-field="category"
                                placeholder="e.g. Utilities"/>
                        </div>
                    </div>

                    <!-- RIGHT -->
                    <div>
                        <div class="bpd-row">
                            <label>Payment Date</label>
                            <span class="bpd-sep">:</span>
                            <input type="text"
                                data-type="date"
                                name="bill_date"
                                required
                                class="data-input form_input"
                                data-field="bill_date"/>
                        </div>
                        <div class="bpd-row">
                            <label>Bill Number</label>
                            <span class="bpd-sep">:</span>
                            <input name="ref_no"
                                class="data-input"
                                data-field="ref_no"
                                placeholder="Ref / Invoice no."/>
                        </div>
                        <div class="bpd-row">
                            <label>Item</label>
                            <span class="bpd-sep">:</span>
                            <input name="item"
                                class="data-input"
                                data-field="item"
                                placeholder=" "/>
                        </div>
                        <div class="bpd-row">
                            <label>Payment Method</label>
                            <span class="bpd-sep">:</span>
                            <input name="item"
                                class="data-input"
                                data-field="item"
                                placeholder=" " />
                        </div>
                        
                    </div>
                </div>

                <!-- ── AMOUNTS ── -->
                <div class="bpd-amounts">
                    <div class="bpd-section-label">Payment amounts</div>
                    <div class="bpd-amounts-grid">
                        <div class="bpd-row">
                            <label>Total Amount</label>
                            <span class="bpd-sep">:</span>
                            <input name="total_amount"
                                id="_bpd_total"
                                class="data-input"
                                data-field="total_amount"
                                type="number" min="0" step="0.01"
                                placeholder="0.00"
                                oninput="_bpdRecalc()"/>
                        </div>
                        <div class="bpd-row">
                            <label>Amount Paid</label>
                            <span class="bpd-sep">:</span>
                            <input name="paid_amount"
                                id="_bpd_paid"
                                class="data-input"
                                data-field="paid_amount"
                                type="number" min="0" step="0.01"
                                placeholder="0.00"
                                oninput="_bpdRecalc()"/>
                        </div>
                    </div>
                </div>

                <!-- ── BALANCE SUMMARY ── -->
                <div class="bpd-totals-wrap">
                    <div class="bpd-totals">
                        <div class="bpd-t-row">
                            <label>Total Amount</label>
                            <span class="bpd-sep">:</span>
                            <span class="bpd-val" id="_bpd_s_total">$ 0.00</span>
                        </div>
                        <div class="bpd-t-row">
                            <label>Amount Paid</label>
                            <span class="bpd-sep">:</span>
                            <span class="bpd-val bpd-balance-positive" id="_bpd_s_paid">$ 0.00</span>
                        </div>
                        <div class="bpd-t-row bpd-grand">
                            <label>Balance</label>
                            <span class="bpd-sep">:</span>
                            <span class="bpd-val" id="_bpd_s_balance">$ 0.00</span>
                        </div>
                    </div>
                </div>

                <!-- ── DESCRIPTION ── -->
                <textarea name="remark"
                    class="data-input bpd-textarea"
                    data-field="remark"
                    placeholder="Description"></textarea>


            `].join(""),


            contentCreated: (me) => {

                const fileInput = me.divModal.querySelector("#_bpd_file_input");
                const fileLabel = me.divModal.querySelector("#_bpd_file_label");
                if (fileInput && fileLabel) {
                    fileInput.addEventListener("change", () => {
                        fileLabel.value = fileInput.files[0]?.name || "";
                    });
                }

                const applyVendorInfo = (vendorId) => {
                    me._selectedVendorId = vendorId || "";
                    if (me.controls.vendor_id) me.controls.vendor_id.value = vendorId || "";
                    if (!vendorId) {
                        if (me.controls.phone_number) me.controls.phone_number.value = "";
                        return;
                    }
                    vsapi.post(`${main_view.base_url}/prm/vendor/options-vendor-info`, { vendor_id: vendorId }, {})
                        .then(res => {
                            const v = res.data?.vendor || {};
                            if (me.controls.phone_number) me.controls.phone_number.value = v.phone_number || "";
                        })
                        .catch(() => {});
                };

                if (me.controls.vendor) {
                    me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                        type: "select",
                        prefetch: true,
                        minChars: 0,
                        api: { endpoint: `${main_view.base_url}/prm/bill/form-options` },
                        processResponse: (res) => {
                            const vendors = res?.data?.vendors || [];
                            return (Array.isArray(vendors) ? vendors : []).map(v => ({
                                ...v,
                                vendor: v.vendor || v.name || v.vendor_name || v.code || "",
                                phone_number: v.phone_number || v.contact_phone || v.phone || "",
                            }));
                        },
                        columns: { vendor: "VENDOR", phone_number: "PHONE" },
                        showColumnHeader: true,
                        placeholder: "Search vendor",
                        onSelect: (vendor) => {
                            me.controls.vendor.value = vendor?.vendor || "";
                            applyVendorInfo(vendor?.id || "");
                        },
                    });

                    if (me._selectedVendorId) applyVendorInfo(me._selectedVendorId);
                }

                // me.controls.div_invoice_summary =
                //     me.divModal.querySelector('[name="div_invoice_summary"]');

                /* hide default close button */
                const btnClose = me.divModal.querySelector(".modal-header button[data-bs-dismiss]");
                if (btnClose) btnClose.classList.add("d-none");
            },

            configSelect: [],

            prepareFormOptions: {
                createTitle: "Bill Payment Voucher",
                modifyTitle: "Modify Bill Payment",
                targetProp: "bill_details",
                api: {
                    endpoint: [main_view.base_url, "/prm/bill/form-options"].join(""),
                    params: (op) => ({ id: op.id }),
                },
            },

            onPrepareForm: (me, data) => {
                const details = data?.bill_details;

                if (details?.file_image) {
                    const fl = me.divModal.querySelector("#_bpd_file_label");
                    if (fl) fl.value = details.file_image;
                }

                if (details?.vendor_id) {
                    me._selectedVendorId = details.vendor_id;
                    if (me.controls.vendor_id)    me.controls.vendor_id.value    = details.vendor_id;
                    if (me.controls.vendor)        me.controls.vendor.value       = details.vendor_name   || "";
                    if (me.controls.phone_number)  me.controls.phone_number.value = details.phone_number  || "";
                }

                /* refresh balance summary when editing */
                setTimeout(() => _bpdRecalc(), 100);
            },

            buttons: [
                {
                    label: '<span vslang="buttons.Cancel"></span>',
                    cssClass: "btn btn-secondary",
                    click: (me) => me.hide(false),
                },
                {
                    label: '<span vslang="buttons.Submit"></span>',
                    cssClass: "btn btn-primary",
                    click: (me, btn) => {
                        const op = me.getData();
                        op.id = me.dataOptions.id;

                        if (me._selectedVendorId != null && me._selectedVendorId !== undefined) {
                            op.vendor_id = me._selectedVendorId;
                        }

                        // if (me.fileData) {
                        //     op.photo = me.fileData.base64 || me.fileData.data
                        //         || me.fileData.fileData   || me.fileData.content || null;
                        //     op.ext   = me.fileData.ext    || me.fileData.fileType
                        //         || me.fileData.extension  || null;
                        // }

                        vsapi.call([main_view.base_url, "/prm/bill/save"].join(""), op, btn, null)
                            .then((res) => {
                                if (res.status_code === 200) {
                                    me.hide(true, op);
                                    cv_interact.success(
                                        me.dataOptions.id > 0
                                            ? "Bill has been updated successfully"
                                            : "New bill has been added successfully"
                                    );
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

/* ── global recalc (called by oninput on amount fields) ── */
function _bpdRecalc() {
    const total   = parseFloat(document.getElementById("_bpd_total")?.value)   || 0;
    const paid    = parseFloat(document.getElementById("_bpd_paid")?.value)    || 0;
    const balance = total - paid;

    const fmt = (n) => "$ " + n.toFixed(2);

    const elTotal   = document.getElementById("_bpd_s_total");
    const elPaid    = document.getElementById("_bpd_s_paid");
    const elBalance = document.getElementById("_bpd_s_balance");

    if (elTotal)   elTotal.textContent   = fmt(total);
    if (elPaid)    elPaid.textContent    = fmt(paid);
    if (elBalance) {
        elBalance.textContent = fmt(Math.abs(balance));
        elBalance.className   = "bpd-val " + (balance > 0
            ? "bpd-balance-negative"   /* still owes */
            : balance < 0
                ? "bpd-balance-positive"   /* overpaid  */
                : "");                     /* settled   */
    }
}