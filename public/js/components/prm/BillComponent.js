"use strict";
var BillComponent = (() => {
    const mThis = {};
    mThis.title_prop = "Bills";
    mThis.base_url = main_view.base_url;
    mThis.self = main_view.VSAppContent.querySelector("#_main_bill_component");
    mThis.btnAdd = mThis.self.querySelector("#_btnBill");
    mThis.divFilter = mThis.self.querySelector("#_divFilter_bill");
    mThis.elFilter_vendor = mThis.self.querySelector("#_bill_vendor_id");
    mThis.elFilter_status = mThis.self.querySelector("#_bill_status_id");
    mThis.elSearch = mThis.self.querySelector("#_search_bill");

    mThis.cols = [
        {
            title: "",
            className: "align-middle",
        },
        {
            transTitle: "titles.Vendor Name",
            className: "align-middle",
            data: (data) => {
                return `<span class="text-primary-custom">${data.vendor_name ?? ""}</span>`;
            },
        },
        {
            title: "Contact Info",
            className: "align-middle",
            data: (data) =>
                `<span class="d-block text-prm-custom text-nowrap">
                    <i class="fa-solid text-success px-1 fa-phone" style="font-size:12px;"></i>
                    ${data.phone_number ?? ""}
                </span>`,
        },
        {
            transTitle: "titles.Bill Date",
            className: "align-middle",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.bill_date ?? ""}</span>`;
            },
        },
        // {
        //     transTitle: "titles.Due Date",
        //     className: "align-middle",
        //     data: (data) => {
        //         return `<span class="d-block text-prm-custom">${data.due_date ?? ""}</span>`;
        //     },
        // },
        {
            transTitle: "titles.Total Amount",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.total_amount ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Paid Amount",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.paid_amount ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Balance",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `<span class="d-block text-prm-custom">${data.balance ?? ""}</span>`;
            },
        },
        {
            transTitle: "titles.Description",
            className: "align-middle",
            data: (data) => {
                return `
                    <div class="text-primary-custom" style="width:150px;">
                        <span class="text-wrap text-break" style="word-break:break-word;">
                            ${data.remark ?? "___"}
                        </span>
                    </div>
                `;
            },
        },
        {
            title: "Status",
            className: "align-middle text-center",
            data: (data) => {
                const status = (data.payment_status ?? "").toLowerCase();
                let cls =
                    "badge text-dark bg-warning-subtle border border-warning";
                if (status === "paid") {
                    cls =
                        "badge text-success bg-success-subtle border border-success";
                } else if (status === "unpaid") {
                    cls =
                        "badge text-danger bg-danger-subtle border border-danger";
                } else if (status === "partially_paid") {
                    cls =
                        "badge text-warning bg-warning-subtle border border-warning";
                }
                const label = (data.payment_status ?? "").replace("_", " ");
                return `
                    <span class="${cls} text-capitalize d-inline-block text-center" style="min-width:90px">
                        ${label}
                    </span>
                `;
            },
        },
        {
            transTitle: "titles.Updated By",
            className: "align-middle text-nowrap",
            data: (data) => {
                return `
                    <div class="d-flex flex-column">
                        <span class="text-capitalize text-start text-yp-custom fw-semibold">
                            ${data.update_user ?? ""}
                        </span>
                        <span class="text-muted">${data.updated_at ?? ""}</span>
                    </div>
                `;
            },
        },
        {
            transTitle: "titles.Action",
            className: "col_action align-middle",
            data: (data) => `
                <div class="d-flex justify-content-center align-items-end">
                    <a href="javascript:void(0)"
                        class="btn--Options btn_dropdown_bill_action"
                        data-id="${data.id}"
                        data-statusid="${data.status_id}"
                        aria-haspopup="true"
                        aria-expanded="false">
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
                tr.dataset.statusid = data.status_id;
                tr.classList.add("bill");
                tr.setAttribute("id", ["bill_id", data.id].join(""));
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
            showBillDialog(op);
        };

        mThis.pr_tbl = mThis.BillListView.getListContainer();
        const sh_parent = mThis.pr_tbl.parentElement;
        sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        sh_parent.classList.add("overflow-y-auto");
        window.onresize = () => {
            sh_parent.style.maxHeight = window.innerHeight - 200 + "px";
        };

        mThis.tblBill = mThis.BillListView.getTable();
        mThis.initDropdownMenus(mThis.tblBill);

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
            search_value: mThis.elSearch.value,
        };
        mThis.divFilter.querySelectorAll(".filter-field").forEach((el) => {
            const f = el.dataset.field;
            p[f] = el.value;
        });
        return p;
    };

    mThis.initDropdownMenus = (table) => {
        const menuOptions = {
            containerElement: table,
            actionButtonClass: "btn_dropdown_bill_action",
            cssClass: "bg-white shadow",
            menus: [
                {
                    html: '<span class="ps-2" vslang="titles.Change Status"></span>',
                    icon: `<i class="fa-solid fa-bolt fs-5 text-primary"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "change_bill_status",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Modify Bill"></span>',
                    icon: `<i class="fa-regular fa-edit fs-5 text-warning"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "modify_bill",
                },
                {
                    html: '<span class="ps-2" vslang="titles.Delete Bill"></span>',
                    icon: `<i class="fa-regular fa-trash-can fs-5 text-danger"></i>`,
                    cssClass: "border-bottom pb-2",
                    name: "delete_bill",
                },
            ],
            onClick: (menuLink, id, name) => {
                switch (name) {
                    case "change_bill_status":
                        mThis.changeStatus(id, menuLink);
                        break;
                    case "modify_bill":
                        mThis.editBill(id, menuLink);
                        break;
                    case "delete_bill":
                        mThis.deleteBill(id, menuLink);
                        break;
                    default:
                        break;
                }
            },
        };
        new VSDropdownMenu(menuOptions);
    };

    mThis.changeStatus = (id, link) => {
        const tr = link.closest("tr");
        const status_id = tr?.dataset.statusid || "";

        const inputOptions = {
            context: "success",
            title: "Change Status",
            label: "Bill Status",
            valueKey: "status_id",
            labelKey: "name",
            confirmButtonText: "Save",
            requiredMessage: "Please select a status",
            data: [
                { status_id: "1", name: "Active" },
                { status_id: "2", name: "Inactive" },
            ],
            defaultValue: status_id,
            onConfirm: (status, btn, me) => {
                const payload = { id, status_id: status.status_id };
                vsapi
                    .post(`${mThis.base_url}/prm/bill/update-status`, payload, {
                        loader: false,
                        agent: btn,
                    })
                    .then((res) => {
                        if (res.status_code === 200) {
                            me.close();
                            cv_interact.success("Bill status has been updated");
                            mThis.BillListView.showPage(mThis.getFilterData());
                        } else {
                            me.setError(
                                res.error_message || "Unable to update status",
                            );
                        }
                    });
            },
        };
        InputBox.show(inputOptions);
    };

    mThis.editBill = (id, menuLink) => {
        const op = {
            id: id,
            btn: menuLink,
            onClose: () => {
                mThis.BillListView.showPage(mThis.getFilterData());
            },
        };
        showBillDialog(op);
    };

    mThis.deleteBill = (id, menuLink) => {
        if (!AuthManager.allowed(242)) return;
        cv_interact.confirm(
            "Delete this Bill?",
            {
                transTitle: "Delete Bill",
                context: "delete",
                confirmButtonText: "Delete",
            },
            function (confirmed) {
                if (confirmed) {
                    vsapi
                        .call(
                            `${main_view.base_url}/prm/bill/delete`,
                            { id },
                            false,
                            false,
                            false,
                        )
                        .then((res) => {
                            if (res.status_code == 200) {
                                cv_interact.success(
                                    "Bill deleted successfully",
                                );
                                mThis.BillListView.showPage(
                                    mThis.getFilterData(),
                                );
                            } else {
                                cv_interact.error(res.error_message);
                            }
                        });
                }
            },
        );
    };

    mThis.prepareFormOptions = (onFinish) => {
        vsapi
            .call(
                `${main_view.base_url}/prm/bill/form-options`,
                null,
                null,
                null,
            )
            .then((res) => {
                const d = res.status_code == 200 ? res.data : {};
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

// ─────────────────────────────────────────────────────────────────────────────
// Bill Dialog
// ─────────────────────────────────────────────────────────────────────────────

let CreateBillDialog = null;

const showBillDialog = (op) => {
    // ── Load data for edit mode ───────────────────────────────────────────────
    const loadBillForEdit = (me, editBillId) => {
        if (!me || !editBillId) return Promise.resolve(null);

        return vsapi
            .call(
                `${main_view.base_url}/prm/bill/form-options`,
                { id: editBillId },
                null,
                false,
            )
            .then((formRes) => {
                if (!formRes || formRes.status_code !== 200) {
                    throw new Error(
                        formRes?.error_message || "Failed to load bill details",
                    );
                }

                // Change modal title to Modify
                const titleEl = me.divModal?.querySelector(".modal-title");
                if (titleEl)
                    titleEl.innerHTML =
                        '<span class="fw-semibold">Modify Bill</span>';

                const d = (formRes.data || {}).bill_details || {};

                // Populate all fields — names match createContent exactly
                const set = (name, val) => {
                    const el = me.divModal.querySelector(`[name="${name}"]`);
                    if (el) el.value = val || "";
                };

                set("vendor_id", d.vendor_id);
                set("vendor", d.vendor_name);
                set("phone_number", d.phone_number);
                set("address", d.address);
                set("po_date", d.po_date);
                set("po_number", d.po_number);
                set("bill_date", d.bill_date);
                set("due_date", d.due_date);
                set("total_amount", d.total_amount);
                set("paid_amount", d.paid_amount);
                set("remark", d.remark);

                me._selectedVendorId = d.vendor_id;

                // Recalculate after populating
                if (typeof me.calcPayment === "function") me.calcPayment();

                // Restore attachment preview if exists
                if (d.file_image) {
                    const previewEl = me.divModal.querySelector(
                        ".bill-photo-preview",
                    );
                    const hintEl =
                        me.divModal.querySelector(".bill-upload-hint");
                    if (previewEl) {
                        previewEl.src = d.file_image;
                        previewEl.style.display = "block";
                    }
                    if (hintEl) hintEl.style.display = "none";
                    me.divModal
                        .querySelector(".bill-upload-box")
                        ?.classList.add("has-image");
                }
            });
    };

    // ── Dialog ────────────────────────────────────────────────────────────────
    CreateBillDialog =
        CreateBillDialog ||
        new GeneralDialog({
            cssClass: "modal-lg vs-modal",

            createContent: () => {
                return `
            <div class="row mb-2">

                <!-- ══ LEFT — Vendor Info ══ -->
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:100px;">Vendor</span>
                        <span class="mx-2 fw-bold text-muted">:</span>
                        <input name="vendor" class="form-control flex-grow-1" placeholder="Search vendor…">
                        <input type="hidden" name="vendor_id" class="data-input" data-field="vendor_id">
                    </div>
                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:100px;">Contact</span>
                        <span class="mx-2 fw-bold text-muted">:</span>
                        <input type="text" name="phone_number"
                            class="data-input form-control flex-grow-1"
                            data-field="phone_number" placeholder="">
                    </div>
                    
                    
                </div>
                <div class="col-md-6 mt-3 mt-md-0 d-flex flex-column  align-items-end">

                    <div class="d-flex align-items-center mb-2  ">
                        <span class="fw-bold" style="min-width:100px;">PO Date</span>
                        <span class="mx-2 fw-bold text-muted">:</span>
                        <input data-type="date" name="bill_date"
                            class="data-input form-control flex-grow-1"
                            data-field="po_date">
                    </div>

                    <div class="d-flex align-items-center mb-2">
                        <span class="fw-bold" style="min-width:100px;">PO Number</span>
                        <span class="mx-2 fw-bold text-muted">:</span>
                        <input type="text" name="po_number"
                            class="data-input form-control flex-grow-1"
                            data-field="po_number" placeholder="">
                    </div>

                </div>
                
                <div class="mt-2 mb-3">
                        <span class="fw-bold d-block mb-1" style="font-size:13px;">Attachment</span>
                        <div class="bill-upload-box border rounded-2 d-flex align-items-center justify-content-center"
                            style="height:76px; cursor:pointer; background:#f8fafc; position:relative; overflow:hidden;"
                            onclick="this.querySelector('input[type=file]').click()">
                            <img class="bill-photo-preview" src="" alt="receipt"
                                style="display:none; width:100%; height:100%; object-fit:contain;">
                            <div class="bill-upload-hint text-muted" style="font-size:13px;">
                                <i class="fa fa-paperclip me-1"></i> Click to upload
                            </div>
                            <input type="file" name="file_image" class="d-none" accept="image/*,.pdf"
                                onchange="
                                    const box  = this.closest('.bill-upload-box');
                                    const img  = box.querySelector('.bill-photo-preview');
                                    const hint = box.querySelector('.bill-upload-hint');
                                    if (this.files[0]) {
                                        img.src = URL.createObjectURL(this.files[0]);
                                        img.style.display  = 'block';
                                        hint.style.display = 'none';
                                        box.classList.add('has-image');
                                    }
                                ">
                        </div>
                    </div>
                <div class="col-12">
                <label class="fw-bold d-block mb-1" style="font-size:13px; padding-left:6px;">Description</label>
                                <div class="material-input outlined">
                                    <textarea class="data-input form-control" data-field="description" placeholder=" "></textarea>
                                    
                                </div>
                            </div>
            </div>

            <div class="row mt-3 p-1">
                <div class="col-lg-12 d-flex justify-content-end">
                    <div class="p-3 rounded-3 shadow-sm border" style="background:#fff; min-width:320px;">
                        <div class="d-flex align-items-center mb-2 p-1">
                            <span class="fw-bold" style="min-width:90px;">Total Amount</span>
                            <span class="mx-2 fw-bold">:</span>
                            <input type="number" name="discount_value" class="data-input form-control mx-2" data-field="discount_value" style="width:110px" value="0" min="0" step="0.01" placeholder="0">
                                <select name="currency_code" class="data-input form-control ms-2" data-field="currency" style="width:60px;">
                                    <option value="percent">KHR </option>
                                    <option value="amount">USD</option>
                                </select>
                        </div>
                        <div class="col-lg-12 mt-3 d-flex justify-content-end">
                            <div class="p-3 rounded-3 shadow-sm border" style="background-color:#fff; min-width:280px;">
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:90px;">Total Amount</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span id="po_total_amount_display" class="ms-2">$ 0.00</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:90px;">Amount Paid</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <input type="number" name="discount_value" class="data-input form-control ms-2" data-field="discount_value" style="width:80px" value="0" min="0" step="0.01" placeholder="0">
                                    
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:90px; color:#ff0000">Balance<readonly />
                                    <span class="mx-2 fw-bold">:</span>
                                    <span id="po_tax_display" class="ms-2">$ 0.00</span>
                                </div>
                                <div class="d-flex align-items-center mb-2">
                                    <span class="fw-bold" style="min-width:90px;">Grand Total</span>
                                    <span class="mx-2 fw-bold">:</span>
                                    <span id="po_total_display" class="ms-2 fw-bold">$ 0.00</span>
                                </div>
                            </div>
                        </div>

                        <hr class="my-2">

                        <div class="d-flex align-items-center">
                            <span class="fw-bold" style="min-width:120px;">Payment Status</span>
                            <span class="mx-2 fw-bold text-muted">:</span>
                            <span class="bill-status-badge ms-1 badge bg-danger px-3 py-2">Unpaid</span>
                            <input type="hidden" name="payment_status" class="data-input bill-status-value" data-field="payment_status" value="unpaid">
                        </div>

                    </div>
                </div>
            </div>
            `;
            },

            contentCreated: (me) => {
                // ── Vendor search autocomplete ────────────────────────────────────
                if (me.controls.vendor) {
                    me.searchVendor = VSSearchInput.init(me.controls.vendor, {
                        type: "select",
                        prefetch: true,
                        api: {
                            endpoint: `${main_view.base_url}/prm/bill/form-options`,
                        },
                        onSelect: (vendor) => {
                            me.controls.vendor_id.value = vendor?.id || "";
                            me._selectedVendorId = vendor?.id;

                            // Auto-fill phone/address if vendor provides them
                            const set = (name, val) => {
                                const el = me.divModal.querySelector(
                                    `[name="${name}"]`,
                                );
                                if (el && val) el.value = val;
                            };
                            set("phone_number", vendor?.phone_number);
                            set("address", vendor?.address);
                        },
                    });
                }


                // ── Payment calculation — all queries scoped to me.divModal ───────
                // NO global getElementById — safe if dialog opens multiple times
                me.calcPayment = () => {
                    const modal = me.divModal;

                    const total =
                        parseFloat(
                            modal.querySelector('[name="total_amount"]')?.value,
                        ) || 0;
                    const paid =
                        parseFloat(
                            modal.querySelector('[name="paid_amount"]')?.value,
                        ) || 0;

                    // Paid amount cannot exceed total
                    const safePaid = Math.min(paid, total);
                    const balance = Math.max(0, total - safePaid);

                    // Elements
                    const grandEl = modal.querySelector(".bill-grand-display");
                    const balanceEl = modal.querySelector(
                        ".bill-balance-display",
                    );
                    const balanceInput = modal.querySelector(
                        ".bill-balance-value",
                    );
                    const badge = modal.querySelector(".bill-status-badge");
                    const statusInput =
                        modal.querySelector(".bill-status-value");

                    // Update Grand Total
                    if (grandEl) grandEl.textContent = "$ " + total.toFixed(2);

                    // Update Balance + color
                    if (balanceInput) balanceInput.value = balance.toFixed(2);
                    if (balanceEl) {
                        balanceEl.textContent = "$ " + balance.toFixed(2);
                        balanceEl.className =
                            "bill-balance-display ms-1 fw-bold " +
                            (balance > 0
                                ? "text-danger"
                                : total > 0
                                    ? "text-success"
                                    : "text-muted");
                    }

                    // Determine payment status
                    let badgeClass =
                        "bill-status-badge ms-1 badge px-3 py-2 bg-danger";
                    let badgeText = "Unpaid";
                    let statusVal = "unpaid";

                    if (total > 0 && safePaid >= total) {
                        badgeClass =
                            "bill-status-badge ms-1 badge px-3 py-2 bg-success";
                        badgeText = "Paid";
                        statusVal = "paid";
                    } else if (safePaid > 0 && safePaid < total) {
                        badgeClass =
                            "bill-status-badge ms-1 badge px-3 py-2 bg-warning text-dark";
                        badgeText = "Partially Paid";
                        statusVal = "partially_paid";
                    }

                    if (badge) {
                        badge.className = badgeClass;
                        badge.textContent = badgeText;
                    }
                    if (statusInput) statusInput.value = statusVal;
                };

                // Attach input listeners — no inline oninput attributes needed in HTML
                ["total_amount", "paid_amount"].forEach((name) => {
                    const el = me.divModal.querySelector(`[name="${name}"]`);
                    if (el)
                        el.addEventListener("input", () => me.calcPayment());
                });
            },

            onShow: (me) => {
                const editBillId = op?.id || null;

                if (editBillId) {
                    // Edit mode — load existing bill data
                    setTimeout(() => loadBillForEdit(me, editBillId), 100);
                } else {
                    // Create mode — reset everything
                    me.clear();
                    me._selectedVendorId = null;

                    // Reset upload box
                    const uploadBox =
                        me.divModal.querySelector(".bill-upload-box");
                    const previewImg = me.divModal.querySelector(
                        ".bill-photo-preview",
                    );
                    const uploadHint =
                        me.divModal.querySelector(".bill-upload-hint");
                    if (uploadBox) uploadBox.classList.remove("has-image");
                    if (previewImg) {
                        previewImg.src = "";
                        previewImg.style.display = "none";
                    }
                    if (uploadHint) uploadHint.style.display = "";

                    // Reset summary displays to zero
                    if (typeof me.calcPayment === "function") me.calcPayment();
                }
            },

            buttons: [
                {
                    label: "Cancel",
                    cssClass: "btn btn-light border",
                    click: (me) => me.hide(false),
                },
                {
                    label: '<i class="fa fa-save me-1"></i> Save Bill',
                    cssClass: "btn btn-primary px-4",
                    click: (me, btn) => {
                        // Ensure latest calculated values before submit
                        if (typeof me.calcPayment === "function")
                            me.calcPayment();

                        const p = me.getData();

                        // Attach vendor_id from autocomplete selection
                        p.vendor_id = me._selectedVendorId || p.vendor_id || "";

                        // Basic validation
                        if (!p.vendor_id) {
                            cv_interact.warning("Please select a vendor.");
                            return;
                        }
                        if (
                            !p.total_amount ||
                            parseFloat(p.total_amount) <= 0
                        ) {
                            cv_interact.warning(
                                "Please enter a valid Total Amount.",
                            );
                            return;
                        }
                        if (!p.bill_date) {
                            cv_interact.warning("Please select a Bill Date.");
                            return;
                        }
                        if (!p.due_date) {
                            cv_interact.warning("Please select a Due Date.");
                            return;
                        }

                        // Build FormData to support file upload
                        const formData = new FormData();
                        Object.keys(p).forEach((key) =>
                            formData.append(key, p[key]),
                        );

                        // Attach op.id for edit mode
                        if (op?.id) formData.append("id", op.id);

                        // Attach file if selected
                        const fileInput = me.divModal.querySelector(
                            'input[name="file_image"]',
                        );
                        if (fileInput?.files[0])
                            formData.append("file_image", fileInput.files[0]);

                        vsapi
                            .post(
                                `${main_view.base_url}/prm/bill/save`,
                                formData,
                                { agent: btn },
                            )
                            .then((res) => {
                                if (res.status_code == 200) {
                                    cv_interact.success(
                                        op?.id
                                            ? "Bill updated successfully."
                                            : "Bill saved successfully.",
                                    );
                                    me.hide(true);
                                    if (typeof op?.onClose === "function")
                                        op.onClose();
                                } else {
                                    cv_interact.warning(
                                        res.error_message ||
                                        "Failed to save bill.",
                                    );
                                }
                            });
                    },
                },
            ],
        });

    CreateBillDialog.show(op);
};
